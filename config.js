// Ligação à base de dados partilhada (Supabase).
// Em Supabase > Project Settings > API copia o "Project URL" e a chave "anon public" para aqui.
// A chave "anon" é pública por natureza: a segurança está nas regras de supabase/schema.sql.
// NUNCA coloques aqui a chave "service_role".
// Enquanto estes campos estiverem vazios, a app funciona como antes: os alertas ficam só neste aparelho.
window.ALERTA_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  google: false // muda para true depois de ativares o Google em Supabase > Authentication > Providers
};
