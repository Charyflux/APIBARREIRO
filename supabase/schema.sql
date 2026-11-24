-- StreetAlert: base de dados partilhada (Supabase)
-- Cola este ficheiro inteiro em Supabase > SQL Editor > New query e carrega em Run.
-- Pode correr-se mais do que uma vez sem estragar nada.

create extension if not exists pgcrypto;

-- ---------- Definições (uma só linha, alteráveis no painel de administração) ----------
create table if not exists public.definicoes (
  id int primary key default 1 check (id = 1),
  exigir_telemovel boolean not null default false, -- true só depois de configurar SMS no Supabase
  limite_conta_nova int not null default 3,         -- reportes por dia nas contas novas
  limite_normal int not null default 20,            -- reportes por dia nas restantes contas
  dias_conta_nova int not null default 7,           -- quantos dias uma conta é "nova"
  denuncias_para_ocultar int not null default 3     -- denúncias que escondem um reporte até um admin rever
);
insert into public.definicoes (id) values (1) on conflict do nothing;

-- ---------- Perfis: o nome de exibição de cada conta ----------
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null check (char_length(btrim(nome)) between 2 and 30),
  criado timestamptz not null default now(),
  bloqueado boolean not null default false,
  admin boolean not null default false
);

-- ---------- Reportes ----------
create table if not exists public.reportes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  cat text not null check (cat in ('violencia', 'estacionamento')),
  lat double precision not null check (lat between 29 and 46),
  lng double precision not null check (lng between -34 and 0),
  descricao text not null default '' check (char_length(descricao) <= 140),
  quando timestamptz not null,
  criado timestamptz not null default now(),
  oculto boolean not null default false
);
create index if not exists reportes_user_criado on public.reportes (user_id, criado);
create index if not exists reportes_quando on public.reportes (quando);

create table if not exists public.confirmacoes (
  reporte_id uuid not null references public.reportes (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  primary key (reporte_id, user_id)
);

create table if not exists public.denuncias (
  reporte_id uuid not null references public.reportes (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  motivo text not null default '' check (char_length(motivo) <= 200),
  criado timestamptz not null default now(),
  primary key (reporte_id, user_id)
);

-- ---------- Funções de apoio ----------
create or replace function public.e_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select admin and not bloqueado from public.perfis where id = auth.uid()), false)
$$;

-- Pode publicar: tem perfil, não está bloqueado e, se exigido, tem o telemóvel confirmado.
create or replace function public.pode_publicar() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfis p where p.id = auth.uid() and not p.bloqueado)
     and (not (select exigir_telemovel from public.definicoes where id = 1)
          or exists (select 1 from auth.users u where u.id = auth.uid() and u.phone_confirmed_at is not null))
$$;

-- Antes de gravar um reporte: data válida, coordenadas arredondadas (~10 m) e limite diário.
create or replace function public.reportes_antes_inserir() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  d public.definicoes;
  conta_criada timestamptz;
  limite int;
  feitos int;
begin
  select * into d from public.definicoes where id = 1;
  select criado into conta_criada from public.perfis where id = new.user_id;
  if new.quando > now() + interval '5 minutes' or new.quando < now() - interval '30 days' then
    raise exception 'data_invalida' using hint = 'A data tem de estar nos últimos 30 dias.';
  end if;
  new.lat := round(new.lat::numeric, 4);
  new.lng := round(new.lng::numeric, 4);
  new.descricao := btrim(new.descricao);
  new.criado := now();
  new.oculto := false;
  limite := case when conta_criada > now() - make_interval(days => d.dias_conta_nova)
                 then d.limite_conta_nova else d.limite_normal end;
  select count(*) into feitos from public.reportes
   where user_id = new.user_id and criado > now() - interval '24 hours';
  if feitos >= limite then
    raise exception 'limite_diario:%', limite using hint = 'Limite de reportes por dia atingido.';
  end if;
  return new;
end $$;
drop trigger if exists reportes_antes_inserir on public.reportes;
create trigger reportes_antes_inserir before insert on public.reportes
  for each row execute function public.reportes_antes_inserir();

-- Depois de uma denúncia: com denúncias suficientes, o reporte fica escondido até um admin rever.
create or replace function public.denuncias_depois_inserir() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.denuncias where reporte_id = new.reporte_id)
     >= (select denuncias_para_ocultar from public.definicoes where id = 1) then
    update public.reportes set oculto = true where id = new.reporte_id;
  end if;
  return new;
end $$;
drop trigger if exists denuncias_depois_inserir on public.denuncias;
create trigger denuncias_depois_inserir after insert on public.denuncias
  for each row execute function public.denuncias_depois_inserir();

-- Administração: bloquear ou desbloquear uma conta (e, se pedido, apagar os reportes dela).
create or replace function public.admin_bloquear(alvo uuid, bloquear boolean, apagar_reportes boolean default false)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.e_admin() then raise exception 'sem_permissao'; end if;
  if alvo = auth.uid() then raise exception 'nao_te_podes_bloquear'; end if;
  update public.perfis set bloqueado = bloquear where id = alvo;
  if bloquear and apagar_reportes then
    delete from public.reportes where user_id = alvo;
  end if;
end $$;

-- Administração: tirar as denúncias de um reporte e voltar a mostrá-lo.
create or replace function public.admin_aprovar(reporte uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.e_admin() then raise exception 'sem_permissao'; end if;
  delete from public.denuncias where reporte_id = reporte;
  update public.reportes set oculto = false where id = reporte;
end $$;

-- RGPD: cada pessoa pode apagar a própria conta e tudo o que publicou.
create or replace function public.apagar_conta()
returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from auth.users where id = auth.uid();
end $$;

-- ---------- Permissões (Row Level Security) ----------
alter table public.definicoes enable row level security;
alter table public.perfis enable row level security;
alter table public.reportes enable row level security;
alter table public.confirmacoes enable row level security;
alter table public.denuncias enable row level security;

-- Quem não tem sessão não vê nada.
revoke all on public.definicoes, public.perfis, public.reportes, public.confirmacoes, public.denuncias from anon;
revoke all on public.definicoes, public.perfis, public.reportes, public.confirmacoes, public.denuncias from authenticated;
grant select, update on public.definicoes to authenticated;
grant select, insert, delete on public.perfis to authenticated;
grant update (nome) on public.perfis to authenticated;           -- só o nome; admin/bloqueado mudam por função
grant select, insert, delete on public.reportes to authenticated; -- sem update: ninguém altera reportes
grant select, insert, delete on public.confirmacoes to authenticated;
grant select, insert, delete on public.denuncias to authenticated;

revoke execute on function public.admin_bloquear(uuid, boolean, boolean), public.admin_aprovar(uuid), public.apagar_conta() from public, anon;
grant execute on function public.admin_bloquear(uuid, boolean, boolean), public.admin_aprovar(uuid), public.apagar_conta(), public.e_admin(), public.pode_publicar() to authenticated;

drop policy if exists "ler definicoes" on public.definicoes;
create policy "ler definicoes" on public.definicoes for select to authenticated using (true);
drop policy if exists "admin altera definicoes" on public.definicoes;
create policy "admin altera definicoes" on public.definicoes for update to authenticated using (public.e_admin()) with check (public.e_admin());

drop policy if exists "ler perfis" on public.perfis;
create policy "ler perfis" on public.perfis for select to authenticated using (true);
drop policy if exists "criar o meu perfil" on public.perfis;
create policy "criar o meu perfil" on public.perfis for insert to authenticated
  with check (id = auth.uid() and not admin and not bloqueado);
drop policy if exists "mudar o meu nome" on public.perfis;
create policy "mudar o meu nome" on public.perfis for update to authenticated
  using (id = auth.uid() and not bloqueado) with check (id = auth.uid());
drop policy if exists "apagar o meu perfil" on public.perfis;
create policy "apagar o meu perfil" on public.perfis for delete to authenticated using (id = auth.uid());

drop policy if exists "ler reportes" on public.reportes;
create policy "ler reportes" on public.reportes for select to authenticated
  using (not oculto or user_id = auth.uid() or public.e_admin());
drop policy if exists "publicar reportes" on public.reportes;
create policy "publicar reportes" on public.reportes for insert to authenticated
  with check (user_id = auth.uid() and public.pode_publicar());
drop policy if exists "apagar reportes" on public.reportes;
create policy "apagar reportes" on public.reportes for delete to authenticated
  using (user_id = auth.uid() or public.e_admin());

drop policy if exists "ler confirmacoes" on public.confirmacoes;
create policy "ler confirmacoes" on public.confirmacoes for select to authenticated using (true);
drop policy if exists "confirmar" on public.confirmacoes;
create policy "confirmar" on public.confirmacoes for insert to authenticated
  with check (user_id = auth.uid() and public.pode_publicar()
              and not exists (select 1 from public.reportes r where r.id = reporte_id and r.user_id = auth.uid()));
drop policy if exists "tirar confirmacao" on public.confirmacoes;
create policy "tirar confirmacao" on public.confirmacoes for delete to authenticated using (user_id = auth.uid());

drop policy if exists "ler denuncias" on public.denuncias;
create policy "ler denuncias" on public.denuncias for select to authenticated
  using (user_id = auth.uid() or public.e_admin());
drop policy if exists "denunciar" on public.denuncias;
create policy "denunciar" on public.denuncias for insert to authenticated
  with check (user_id = auth.uid()
              and exists (select 1 from public.perfis p where p.id = auth.uid() and not p.bloqueado));
drop policy if exists "admin apaga denuncias" on public.denuncias;
create policy "admin apaga denuncias" on public.denuncias for delete to authenticated using (public.e_admin());

-- ---------- Tempo real (o mapa atualiza-se sozinho) ----------
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin alter publication supabase_realtime add table public.reportes; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.confirmacoes; exception when duplicate_object then null; end;
  end if;
end $$;

-- ---------- Apagar reportes com mais de 90 dias (todos os dias às 04:00) ----------
do $$ begin
  create extension if not exists pg_cron;
  perform cron.unschedule(jobid) from cron.job where jobname = 'alerta-apagar-antigos';
  perform cron.schedule('alerta-apagar-antigos', '0 4 * * *',
    $q$ delete from public.reportes where criado < now() - interval '90 days' $q$);
exception when others then
  raise notice 'pg_cron indisponível: ativa-o em Database > Extensions e corre este ficheiro outra vez.';
end $$;

-- ---------- Tornar-te administrador ----------
-- Depois de entrares na app e escolheres o teu nome, corre (com o teu email):
-- update public.perfis set admin = true where id = (select id from auth.users where email = 'o-teu-email@exemplo.pt');
