# Gera a lista de freguesias usada no ecrã de entrada (freguesias.json) e na base de dados
# (bloco "freguesias" no fim de supabase/schema.sql).
# Fonte: CAOP 2020 da DGT, tal como vem no pacote npm @cartography/pt (dist/parishes.json e
# dist/municipalities.json). O concelho de cada freguesia é o polígono municipal que contém um
# ponto interior da freguesia.
# Uso: python3 scripts/build_freguesias.py <pasta dist do @cartography/pt>
import json,sys,collections,os,re
src=sys.argv[1]
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=json.load(open(src+'/parishes.json'))['features']
M=json.load(open(src+'/municipalities.json'))['features']
def rings(g):
    if g['type']=='Polygon': return [g['coordinates']]
    return g['coordinates']
def bbox(polys):
    xs=[p[0] for poly in polys for r in poly for p in r]; ys=[p[1] for poly in polys for r in poly for p in r]
    return min(xs),min(ys),max(xs),max(ys)
def inring(x,y,r):
    c=False;n=len(r);j=n-1
    for i in range(n):
        xi,yi=r[i][:2];xj,yj=r[j][:2]
        if (yi>y)!=(yj>y) and x<(xj-xi)*(y-yi)/(yj-yi)+xi: c=not c
        j=i
    return c
def inpolys(x,y,polys):
    for poly in polys:
        if inring(x,y,poly[0]) and not any(inring(x,y,h) for h in poly[1:]): return True
    return False
mun=[(m['properties']['name'],rings(m['geometry'])) for m in M]
mun=[(n,p,bbox(p)) for n,p in mun]
def interior_pt(polys):
    # largest ring; try centroid then sample points
    poly=max(polys,key=lambda p:len(p[0]))
    r=poly[0];x=sum(p[0] for p in r)/len(r);y=sum(p[1] for p in r)/len(r)
    if inpolys(x,y,[poly]): return x,y
    b=bbox([poly])
    for k in range(1,40):
        for i in range(k):
            for j in range(k):
                xx=b[0]+(b[2]-b[0])*(i+.5)/k;yy=b[1]+(b[3]-b[1])*(j+.5)/k
                if inpolys(xx,yy,[poly]): return xx,yy
    return x,y
out=set();miss=0
for f in P:
    nm=f['properties']['name'].strip();polys=rings(f['geometry'])
    x,y=interior_pt(polys)
    c=[n for n,p,b in mun if b[0]<=x<=b[2] and b[1]<=y<=b[3] and inpolys(x,y,p)]
    if not c: miss+=1;continue
    out.add((nm,c[0]))
# Concelhos com o mesmo nome noutra região: a fonte junta os dois "Lagoa" num só polígono.
LAGOA_ACORES={'Cabouco','Lagoa (Nossa Senhora do Rosário)','Lagoa (Santa Cruz)','Ribeira Chã','Água de Pau'}
def fix(n,c):
    if c=='Lagoa': return n,'Lagoa (Açores)' if n in LAGOA_ACORES else 'Lagoa (Algarve)'
    if c=='Calheta': return n,'Calheta (Madeira)'
    return n,c
out={fix(n,c) for n,c in out}
out=sorted(out,key=lambda t:(t[1],t[0]))
cc=collections.Counter(c for _,c in out)
print(len(out),'freguesias,',len(cc),'concelhos, sem concelho:',miss,file=sys.stderr)
with open(os.path.join(ROOT,'freguesias.json'),'w',encoding='utf-8') as f:
    json.dump(out,f,ensure_ascii=False,separators=(',',':'))
q=lambda x:"'"+x.replace("'","''")+"'"
rows=',\n'.join('(%s,%s)'%(q(n),q(c)) for n,c in out)
block=('-- FREGUESIAS:INICIO (gerado por scripts/build_freguesias.py, não editar à mão)\n'
       'insert into public.freguesias (nome, concelho) values\n'+rows+'\non conflict do nothing;\n'
       '-- FREGUESIAS:FIM')
sp=os.path.join(ROOT,'supabase','schema.sql')
sql=open(sp,encoding='utf-8').read()
sql,n=re.subn(r'-- FREGUESIAS:INICIO.*?-- FREGUESIAS:FIM',lambda m:block,sql,flags=re.S)
if n!=1: sys.exit('schema.sql: marcadores FREGUESIAS:INICIO/FIM em falta')
open(sp,'w',encoding='utf-8').write(sql)
