/* Asset Manager Concentration — full dynamic port of the ASSETM prototype.
   Data + logic in src/mc-data.js (window.MC). Field DS chrome (Card, StatTile). */
(function(){
const {TEAMS,managers,products,TOTAL,detect,buildTargets,fm,fpct}=window.MC;
const INK='rgb(249,250,251)',MUTED='rgb(156,163,175)',DIM='rgb(107,114,128)';
const MINT='rgb(120,160,255)',RED='rgb(240,82,82)',AMBER='rgb(227,160,8)';
const VEH_C={MF:'rgb(118,169,250)',ETF:'rgb(52,106,255)',SMA:'rgb(227,160,8)',PF:'rgb(172,148,250)'};
const VEH_L={MF:'Mutual Fund',ETF:'ETF',SMA:'SMA',PF:'Private Fund'};
const SEG=['rgb(52,106,255)','rgb(120,160,255)','rgb(6,148,162)','rgb(118,169,250)','rgb(172,148,250)','rgb(22,189,202)','rgb(141,162,251)'];
const TH={textAlign:'right',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',color:MUTED,padding:'8px 8px',borderBottom:'1px solid rgb(75,85,99)',whiteSpace:'nowrap',cursor:'pointer',userSelect:'none',position:'sticky',top:0,background:'rgb(27,37,55)',zIndex:3};
const THL={...TH,textAlign:'left'};
const TH2={...TH,position:'static',background:'rgba(255,255,255,0.03)',cursor:'default',padding:'7px 8px'};
const TH2L={...TH2,textAlign:'left'};
const TD={padding:'9px 8px',borderBottom:'1px solid rgba(75,85,99,0.35)',textAlign:'right',whiteSpace:'nowrap',fontSize:12};
const TDL={...TD,textAlign:'left'};

function VehTag({v,long}){return <span style={{fontSize:9,fontWeight:600,padding:'1px 6px',borderRadius:9999,border:`1px solid ${VEH_C[v]}66`,color:VEH_C[v]}}>{long?VEH_L[v]:v}</span>;}
function EasePill({pct}){const c=pct>=0.55?[MINT,'rgba(120,160,255,0.15)']:pct>=0.35?[AMBER,'rgba(227,160,8,0.15)']:[RED,'rgba(240,82,82,0.12)'];return <span className="num" style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:9999,color:c[0],background:c[1]}}>{Math.round(pct*100)}%</span>;}
function TailPill({s}){return <span style={{fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:9999,background:'rgba(227,160,8,0.9)',color:'rgb(17,25,40)',letterSpacing:'0.03em'}}>{s||'TAIL MGR'}</span>;}
function OutlPill({children}){return <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:9999,border:'1px solid rgba(227,160,8,0.6)',color:AMBER}}>{children||'OUTLIER'}</span>;}
function ModelTag({p}){if(!p.models.length)return <span style={{color:'rgb(75,85,99)',fontSize:11}}>Not in a model</span>;
  return <span style={{display:'inline-flex',gap:4}}>{p.models.map((md,i)=><span key={i} style={{fontSize:9.5,fontWeight:600,padding:'1px 7px',borderRadius:9999,whiteSpace:'nowrap',border:`1px solid ${md.type==='tp'?'rgba(118,169,250,0.5)':'rgba(120,160,255,0.5)'}`,color:md.type==='tp'?'rgb(118,169,250)':MINT}}>{md.name}</span>)}</span>;}
function Flow({v}){return <span className="num" style={{fontSize:12,fontWeight:600,color:v>=0?MINT:RED}}>{v>=0?'+':''}{fm(v)}</span>;}
function Action({parts}){return <span style={{fontSize:11,color:MUTED,whiteSpace:'normal',maxWidth:260,display:'inline-block',textAlign:'right',lineHeight:1.35}}>{parts.map((s,i)=>s[1]?<b key={i} style={{color:MINT,fontWeight:600}}>{s[0]}</b>:<React.Fragment key={i}>{s[0]}</React.Fragment>)}</span>;}
function Chip({active,onClick,children}){return <button onClick={onClick} style={{background:active?'rgb(52,106,255)':'rgba(255,255,255,0.05)',border:`1px solid ${active?'rgb(52,106,255)':'rgb(75,85,99)'}`,color:active?'#fff':MUTED,fontFamily:'Inter',fontSize:12,fontWeight:active?600:500,padding:'5px 12px',borderRadius:9999,cursor:'pointer'}}>{children}</button>;}
function Toggle({on,onClick,children}){return(<span onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:12,color:on?INK:MUTED,cursor:'pointer',userSelect:'none'}}>
  <span style={{width:32,height:18,borderRadius:9999,background:on?'rgb(52,106,255)':'rgb(55,65,81)',position:'relative',flexShrink:0,display:'inline-block',transition:'background .15s'}}>
  <span style={{position:'absolute',top:2,left:on?16:2,width:14,height:14,borderRadius:9999,background:on?'#fff':'rgb(156,163,175)',transition:'all .15s',display:'block'}}/></span>{children}</span>);}
const SEL={background:'rgb(31,42,55)',border:'1px solid rgb(75,85,99)',color:INK,fontFamily:'Inter',fontSize:12.5,fontWeight:500,padding:'7px 11px',borderRadius:6,cursor:'pointer'};
function Link({onClick,children,style}){return <a href="#" onClick={e=>{e.preventDefault();e.stopPropagation();onClick();}} style={{color:INK,textDecoration:'none',borderBottom:'1px dotted rgb(75,85,99)',...style}}>{children}</a>;}

function ManagerConcentrationPage(){
  const [lens,setLens]=React.useState('firm');
  const [teamId,setTeamId]=React.useState(0);
  const [vehs,setVehs]=React.useState(()=>new Set(['MF','ETF','SMA','PF']));
  const [mgrF,setMgrF]=React.useState('');
  const [modelF,setModelF]=React.useState('all');
  const [search,setSearch]=React.useState('');
  const [targetsOnly,setTargetsOnly]=React.useState(false);
  const [easyOnly,setEasyOnly]=React.useState(false);
  const [expanded,setExpanded]=React.useState(()=>new Set());
  const [sort,setSort]=React.useState({key:'aum',dir:-1});
  const [modal,setModal]=React.useState(null); /* {kind:'mgr',mgrId,prodId} | {kind:'model',name} */

  const wFn=p=>lens==='practice'?p.tw[teamId]:1;
  const prodOk=p=>vehs.has(p.veh)&&(mgrF===''||p.mgrId===+mgrF);
  const modelOk=p=>{const ms=p.models;
    if(modelF==='all')return true; if(modelF==='in')return ms.length>0;
    if(modelF==='firm')return ms.some(m=>m.type==='firm'); if(modelF==='tp')return ms.some(m=>m.type==='tp');
    if(modelF==='un')return !ms.length; if(modelF.slice(0,2)==='m:')return ms.some(m=>m.name===modelF.slice(2)); return true;};
  const det=detect(prodOk);
  const flagged=p=>det.tail.has(p.mgrId)||det.outl.has(p.id);
  const targets=buildTargets(det,wFn);

  /* scoped, filtered product list */
  const scope=products.map(p=>({p,aum:p.aum*wFn(p),hh:Math.max(p.tw&&wFn(p)>0?1:0,Math.round(p.hh*wFn(p))),pos:Math.max(wFn(p)>0?1:0,Math.round(p.pos*wFn(p))),flows:p.flows*wFn(p),easy:p.aum*p.ease*wFn(p)}))
    .filter(e=>e.aum>0.005&&prodOk(e.p)&&modelOk(e.p)&&(!targetsOnly||flagged(e.p))&&(!easyOnly||e.p.ease>=0.5));
  const total=scope.reduce((s,e)=>s+e.aum,0)||1;

  /* aggregate per manager */
  const aggs=managers.map(m=>{
    const es=scope.filter(e=>e.p.mgrId===m.id); if(!es.length)return null;
    const aum=es.reduce((s,e)=>s+e.aum,0);
    return {m,es:es.sort((a,b)=>b.aum-a.aum),aum,flows:es.reduce((s,e)=>s+e.flows,0),
      hh:Math.round(es.reduce((s,e)=>s+e.hh,0)*(es.length>1?0.78:1))||1,pos:es.reduce((s,e)=>s+e.pos,0),
      teams:lens==='practice'?0:Math.max(...es.map(e=>e.p.teams)),share:aum/es.reduce((s,e)=>s+e.p.fundAUM,0),
      ease:es.reduce((s,e)=>s+e.easy,0)/aum,nOutl:es.filter(e=>det.outl.has(e.p.id)).length,tail:det.tail.has(m.id)};
  }).filter(Boolean);

  const q=search.toLowerCase();
  let rows=q?aggs.filter(a=>a.m.name.toLowerCase().includes(q)||a.es.some(e=>e.p.name.toLowerCase().includes(q))):aggs;
  const sv=a=>({name:a.m.name,aum:a.aum,flows:a.flows,share:a.share,prod:a.es.length,teams:a.teams,pos:a.pos,hh:a.hh,flags:a.tail?999:a.nOutl,ease:a.ease}[sort.key]);
  rows=[...rows].sort((x,y)=>{const a=sv(x),b=sv(y);const c=typeof a==='string'?a.localeCompare(b):a-b;return sort.dir<0?-c:c;});
  const maxAum=Math.max(1,...rows.map(a=>a.aum)),maxF=Math.max(0.01,...rows.map(a=>Math.abs(a.flows)));
  const doSort=key=>setSort(s=>s.key===key?{key,dir:-s.dir}:{key,dir:-1});
  const Th=({k,children,left})=><th style={left?THL:TH} onClick={k?()=>doSort(k):undefined}>{children}{sort.key===k&&<span style={{color:MINT}}> {sort.dir<0?'▼':'▲'}</span>}</th>;

  /* KPIs */
  const top5=[...aggs].sort((a,b)=>b.aum-a.aum).slice(0,5);
  const hhAll=Math.round(scope.reduce((s,e)=>s+e.hh,0)*0.72);
  const flowsAll=scope.reduce((s,e)=>s+e.flows,0);
  const inModels=scope.filter(e=>e.p.models.length).reduce((s,e)=>s+e.aum,0);
  const tgtAum=targets.reduce((s,t)=>s+t.aum,0),tgtEasy=targets.reduce((s,t)=>s+t.easy,0);
  const nTailT=targets.filter(t=>t.type==='mgr').length,nProdT=targets.length-nTailT;

  /* vehicle strip */
  const byVeh={MF:0,ETF:0,SMA:0,PF:0}; scope.forEach(e=>byVeh[e.p.veh]+=e.aum);

  /* models aggregation (uses veh/mgr scope, not model filter) */
  const mScope=products.map(p=>({p,aum:p.aum*wFn(p)})).filter(e=>e.aum>0.005&&prodOk(e.p));
  const modelMap=new Map();
  mScope.forEach(e=>e.p.models.forEach(md=>{
    let x=modelMap.get(md.name); if(!x){x={name:md.name,type:md.type,aum:0,hh:0,pos:0,flows:0,prods:[],mgrs:new Set(),teams:new Set()};modelMap.set(md.name,x);}
    x.aum+=e.aum;x.hh+=Math.round(e.p.hh*wFn(e.p));x.pos+=Math.round(e.p.pos*wFn(e.p));x.flows+=e.p.flows*wFn(e.p);
    x.prods.push(e.p);x.mgrs.add(e.p.mgrId);e.p.tw.forEach((w,i)=>{if(w>0.001)x.teams.add(i);});
  }));
  const modelRows=[...modelMap.values()].sort((a,b)=>b.aum-a.aum);

  const gotoTeam=t=>{setLens('practice');setTeamId(t);setModal(null);};
  const reset=()=>{setVehs(new Set(['MF','ETF','SMA','PF']));setMgrF('');setModelF('all');setSearch('');setTargetsOnly(false);setEasyOnly(false);setExpanded(new Set());setSort({key:'aum',dir:-1});};
  const toggleExp=id=>setExpanded(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const nav=p=>window.dispatchEvent(new CustomEvent('firm:navigate',{detail:{page:p}}));
  const Modal=window.Modal; /* defined in ManagerConcentrationModal.jsx (separate Babel scope) */

  return(
    <div className="page-fade" style={{padding:24}}>
      {/* head: crumbs + lens */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5}}>
          <a href="#" onClick={e=>{e.preventDefault();nav('dashboard');}} style={{color:MUTED,textDecoration:'none'}}>Firm Dashboard</a>
          <i className="fa-solid fa-chevron-right" style={{fontSize:9,color:DIM}}/>
          <span style={{color:INK,fontWeight:600}}>Asset Manager Concentration</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:11,fontWeight:600,color:MINT,background:'rgba(52,106,255,0.12)',border:'1px solid rgba(120,160,255,0.35)',padding:'3px 10px',borderRadius:9999,marginLeft:8}}>◉ {lens==='firm'?'Firm view — all 5 FA teams':'Practice view — '+TEAMS[teamId].name}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{display:'flex',background:'rgba(255,255,255,0.05)',border:'1px solid rgb(75,85,99)',borderRadius:9999,padding:3}}>
            {[['firm','Firm View'],['practice','My Practice']].map(([k,l])=><button key={k} onClick={()=>setLens(k)} style={{border:'none',background:lens===k?'rgb(52,106,255)':'transparent',color:lens===k?'#fff':MUTED,fontFamily:'Inter',fontSize:12.5,fontWeight:600,padding:'6px 15px',borderRadius:9999,cursor:'pointer'}}>{l}</button>)}
          </div>
          {lens==='practice'&&<select value={teamId} onChange={e=>setTeamId(+e.target.value)} style={SEL}>{TEAMS.map((t,i)=><option key={i} value={i}>{t.name}</option>)}</select>}
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:12}}>
        <StatTile label="AUM IN SELECTION" value={fm(total===1?0:total)} sub={`${hhAll} households · ${fpct(inModels/total,0)} in models`}/>
        <StatTile label="ASSET MANAGERS" value={String(aggs.length)} sub={`${scope.length} products held`}/>
        <StatTile label="TOP 5 CONCENTRATION" value={fpct(top5.reduce((s,a)=>s+a.aum,0)/total)} sub={top5.map(a=>a.m.name.split(' ')[0]).join(', ')||'—'}/>
        <StatTile label="12-MO NET FLOWS" value={(flowsAll>=0?'+':'')+fm(flowsAll)} valueColor={flowsAll>=0?MINT:RED} sub={lens==='firm'?'firm-wide selection':TEAMS[teamId].name}/>
        <StatTile label="CONSOLIDATION TARGETS" value={fm(tgtAum)} valueColor={AMBER} sub={`${targets.length} targets (${nTailT} tail · ${nProdT} off-model) · ${fm(tgtEasy)} easy`}/>
      </div>

      {/* vehicle strip */}
      <Card style={{padding:'12px 16px',marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,color:MUTED,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>Book by Vehicle</div>
        <div style={{display:'flex',height:22,borderRadius:6,overflow:'hidden'}}>
          {Object.entries(byVeh).filter(([,v])=>v>0).map(([k,v])=>{const pct=v/total;
            return <div key={k} title={`${VEH_L[k]} — ${fm(v)} (${fpct(pct)})`} style={{width:`${(pct*100).toFixed(2)}%`,minWidth:3,background:VEH_C[k],display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'rgb(17,25,40)',whiteSpace:'nowrap',overflow:'hidden'}}>{pct>0.09?`${VEH_L[k]} ${fpct(pct,0)} · ${fm(v)}`:pct>0.03?fpct(pct,0):''}</div>;})}
        </div>
      </Card>

      {/* filter bar */}
      <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:16}}>
        <select value={mgrF} onChange={e=>setMgrF(e.target.value)} style={SEL}><option value="">All Asset Managers</option>{[...managers].sort((a,b)=>a.name.localeCompare(b.name)).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
        <select value={modelF} onChange={e=>setModelF(e.target.value)} style={SEL}>
          <option value="all">All Model Status</option><option value="in">In a model</option><option value="firm">Firm models</option><option value="tp">3rd-party models</option><option value="un">Not in a model</option>
          {Object.values(window.MC.MODELS).map(([n])=><option key={n} value={'m:'+n}>— {n}</option>)}
        </select>
        <div style={{display:'flex',gap:5,alignItems:'center'}}>
          {['MF','ETF','SMA','PF'].map(v=><Chip key={v} active={vehs.has(v)} onClick={()=>setVehs(prev=>{const n=new Set(prev);if(n.has(v)){if(n.size>1)n.delete(v);}else n.add(v);return n;})}>{{MF:'Mutual Funds',ETF:'ETFs',SMA:'SMAs',PF:'Private Funds'}[v]}</Chip>)}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search manager or product…" style={{width:200,background:'rgb(31,42,55)',border:'1px solid rgb(75,85,99)',borderRadius:6,color:INK,fontFamily:'Inter',fontSize:12.5,padding:'7px 11px'}}/>
        <Toggle on={targetsOnly} onClick={()=>setTargetsOnly(!targetsOnly)}>Targets only</Toggle>
        <Toggle on={easyOnly} onClick={()=>setEasyOnly(!easyOnly)}>Easy-to-move only</Toggle>
        <button onClick={reset} style={{fontSize:12,color:MUTED,background:'none',border:'none',fontFamily:'Inter',cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>Reset</button>
      </div>

      {/* master table */}
      <Card style={{marginBottom:16}}>
        <CardTitle title="Managers — Exposure & Flows" subtitle="Every manager individually — including the tail. AUM stacked by fund (amber = consolidation target). Click a row to expand funds; click the name for the full drill-down."/>
        <div className="scroll-thin" style={{maxHeight:620,overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>
              <Th k="name" left>Asset Manager</Th><th style={THL}>Exposure by Fund</th><Th k="aum">AUM</Th><Th k="flows">Flows 12M</Th><Th k="share">Fund Share</Th><th style={TH}>Veh</th><Th k="prod">Prod</Th><Th k="teams">Teams</Th><Th k="pos">Pos</Th><Th k="hh">HH</Th><Th k="flags">Flags</Th><Th k="ease">Ease</Th>
            </tr></thead>
            <tbody>
              {rows.length?rows.map(a=>{
                const exp=expanded.has(a.m.id);
                const fw=Math.abs(a.flows)/maxF*50;
                return(<React.Fragment key={a.m.id}>
                  <tr className="row-hover" onClick={()=>toggleExp(a.m.id)} style={{cursor:'pointer'}}>
                    <td style={{...TDL,fontWeight:600,color:INK}}>
                      <span style={{display:'inline-flex',alignItems:'center',gap:7}}>
                        <i className="fa-solid fa-caret-right" style={{fontSize:10,color:exp?MINT:'rgb(75,85,99)',transform:exp?'rotate(90deg)':'none',transition:'transform .15s'}}/>
                        <Link onClick={()=>setModal({kind:'mgr',mgrId:a.m.id,prodId:null})}>{a.m.name}</Link>
                      </span>
                    </td>
                    <td style={{...TD,width:280,minWidth:200}}>
                      <div style={{display:'flex',height:14,borderRadius:3,overflow:'hidden',width:`${Math.max(1.5,a.aum/maxAum*100)}%`,minWidth:3}}>
                        {a.es.map((e,i)=><span key={i} title={`${e.p.name}\n${fm(e.aum)} · ${e.hh} HH${flagged(e.p)?' · ⚠ consolidation target':''}`} onClick={ev=>{ev.stopPropagation();setModal({kind:'mgr',mgrId:a.m.id,prodId:e.p.id});}} style={{display:'block',height:'100%',minWidth:2,flexGrow:e.aum,background:flagged(e.p)?AMBER:SEG[i%SEG.length],borderRight:'1px solid rgb(17,25,40)',cursor:'pointer'}}/>)}
                      </div>
                    </td>
                    <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(a.aum)}<div style={{fontSize:10,color:MUTED,fontWeight:400}}>{fpct(a.aum/total)}</div></td>
                    <td style={TD}><div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}><Flow v={a.flows}/>
                      <span style={{width:72,height:5,background:'rgb(55,65,81)',borderRadius:3,position:'relative',overflow:'hidden',display:'inline-block'}}>
                        <span style={{position:'absolute',left:'50%',top:0,bottom:0,width:1,background:'rgb(17,25,40)'}}/>
                        <span style={{position:'absolute',top:0,bottom:0,borderRadius:3,background:a.flows>=0?'rgb(52,106,255)':'rgb(240,82,82)',...(a.flows>=0?{left:'50%',width:`${fw}%`}:{right:'50%',width:`${fw}%`})}}/>
                      </span></div></td>
                    <td className="num" style={{...TD,color:MUTED}}>{fpct(a.share,2)}</td>
                    <td style={TD}><span style={{display:'inline-flex',gap:3}}>{[...new Set(a.es.map(e=>e.p.veh))].map(v=><VehTag key={v} v={v}/>)}</span></td>
                    <td className="num" style={{...TD,color:MUTED}}>{a.es.length}</td>
                    <td className="num" style={{...TD,color:MUTED}}>{lens==='practice'?'—':a.teams}</td>
                    <td className="num" style={{...TD,color:MUTED}}>{a.pos}</td>
                    <td className="num" style={{...TD,color:MUTED}}>{a.hh}</td>
                    <td style={TD}>{a.tail?<TailPill s="TAIL"/>:a.nOutl?<OutlPill>{a.nOutl} outlier{a.nOutl>1?'s':''}</OutlPill>:<span style={{color:'rgb(75,85,99)'}}>—</span>}</td>
                    <td style={TD}><EasePill pct={a.ease}/></td>
                  </tr>
                  {exp&&<tr style={{background:'rgba(17,25,40,0.55)'}}><td colSpan={12} style={{padding:'0 8px 14px 8px',borderBottom:'1px solid rgba(75,85,99,0.35)'}}>
                    <div style={{border:'1px solid rgba(75,85,99,0.5)',borderRadius:8,marginTop:4,overflow:'hidden'}}>
                      <table style={{width:'100%',borderCollapse:'collapse'}}>
                        <thead><tr><th style={TH2L}>Fund / Product</th><th style={TH2}>Vehicle</th><th style={TH2L}>Model</th><th style={TH2}>AUM</th><th style={TH2}>Flows 12M</th><th style={TH2}>Fund Share</th><th style={TH2}>Teams</th><th style={TH2}>Pos</th><th style={TH2}>HH</th><th style={TH2}>Ease</th></tr></thead>
                        <tbody>{a.es.map((e,i)=>{const last=i===a.es.length-1,bb=last?'none':TD.borderBottom;return(
                          <tr key={i}>
                            <td style={{...TDL,padding:'7px 8px',borderBottom:bb,color:'rgb(229,231,235)'}}>{e.p.name}{det.outl.has(e.p.id)&&<span style={{marginLeft:6}}><OutlPill>outlier</OutlPill></span>}{a.tail&&<span style={{marginLeft:6}}><OutlPill>tail mgr</OutlPill></span>}</td>
                            <td style={{...TD,padding:'7px 8px',borderBottom:bb}}><VehTag v={e.p.veh} long/></td>
                            <td style={{...TDL,padding:'7px 8px',borderBottom:bb}}><ModelTag p={e.p}/></td>
                            <td className="num" style={{...TD,padding:'7px 8px',fontWeight:600,color:INK,borderBottom:bb}}>{fm(e.aum)}</td>
                            <td style={{...TD,padding:'7px 8px',borderBottom:bb}}><Flow v={e.flows}/></td>
                            <td className="num" style={{...TD,padding:'7px 8px',color:MUTED,borderBottom:bb}}>{fpct(e.aum/e.p.fundAUM,2)}</td>
                            <td className="num" style={{...TD,padding:'7px 8px',color:MUTED,borderBottom:bb}}>{lens==='practice'?'—':e.p.teams}</td>
                            <td className="num" style={{...TD,padding:'7px 8px',color:MUTED,borderBottom:bb}}>{e.pos}</td>
                            <td className="num" style={{...TD,padding:'7px 8px',color:MUTED,borderBottom:bb}}>{e.hh}</td>
                            <td style={{...TD,padding:'7px 8px',borderBottom:bb}}>{e.p.veh==='PF'?<span style={{color:'rgb(75,85,99)'}}>locked</span>:<EasePill pct={e.p.ease}/>}</td>
                          </tr>);})}</tbody>
                      </table>
                    </div>
                  </td></tr>}
                </React.Fragment>);
              }):<tr><td colSpan={12} style={{textAlign:'center',color:MUTED,padding:24,fontSize:12}}>No managers match the current filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{fontSize:11.5,color:MUTED,marginTop:12}}>HH = distinct client households; positions ≥ HH. Ease = qualified $ and/or held at a loss, weighted by FA discretion. Private funds are interval structures — treated as locked.</div>
      </Card>

      {/* consolidation targets */}
      <Card style={{marginBottom:16}}>
        <CardTitle title="Consolidation Targets" subtitle={targets.length?`${targets.length} targets · ${fm(tgtAum)} total — tail relationships and off-model products with the suggested move. Click a row to drill in.`:'No consolidation targets in the current selection.'}/>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{...TH2L,background:'transparent'}}>Target</th><th style={{...TH2L,background:'transparent'}}>Type</th><th style={{...TH2,background:'transparent'}}>AUM</th><th style={{...TH2,background:'transparent'}}>HH</th><th style={{...TH2,background:'transparent'}}>Teams</th><th style={{...TH2,background:'transparent'}}>Pos</th><th style={{...TH2,background:'transparent'}}>Flows 12M</th><th style={{...TH2,background:'transparent'}}>Easy $</th><th style={{...TH2,background:'transparent'}}>Suggested Action</th></tr></thead>
            <tbody>{targets.map((t,i)=>(
              <tr key={i} className="row-hover" onClick={()=>setModal({kind:'mgr',mgrId:t.mgrId,prodId:t.prodId})} style={{cursor:'pointer'}}>
                <td style={TDL}><div style={{fontWeight:600,color:INK}}>{t.name}</div><div style={{fontSize:10,color:MUTED}}>{t.sub}</div></td>
                <td style={TDL}>{t.type==='mgr'?<TailPill/>:<OutlPill/>}</td>
                <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(t.aum)}</td>
                <td className="num" style={{...TD,color:MUTED}}>{t.hh}</td>
                <td className="num" style={{...TD,color:MUTED}}>{lens==='practice'?'—':t.teams}</td>
                <td className="num" style={{...TD,color:MUTED}}>{t.pos}</td>
                <td style={TD}><Flow v={t.flows}/></td>
                <td className="num" style={{...TD,fontWeight:600}}>{t.locked?<span style={{color:'rgb(75,85,99)'}}>locked</span>:<span style={{color:MINT}}>{fm(t.easy)}</span>}</td>
                <td style={{...TD,whiteSpace:'normal'}}><Action parts={t.action}/></td>
              </tr>))}</tbody>
          </table>
        </div>
        <div style={{fontSize:11.5,color:MUTED,marginTop:12}}><TailPill/> whole relationship is minimal — exit and reduce the manager count. <OutlPill/> thinly-held product inside a core partner — consolidate into the comparable core product clients already own.</div>
      </Card>

      {/* models — adoption & health */}
      <Card style={{marginBottom:16}}>
        <CardTitle title="Models — Adoption & Health" subtitle="How many clients actually follow each model, and whether a model is carrying flagged holdings. Click a model to see its products and team adoption."/>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{...TH2L,background:'transparent'}}>Model</th><th style={{...TH2L,background:'transparent'}}>Type</th><th style={{...TH2,background:'transparent'}}>Managers</th><th style={{...TH2,background:'transparent'}}>Products</th><th style={{...TH2,background:'transparent'}}>AUM</th><th style={{...TH2,background:'transparent'}}>HH</th><th style={{...TH2,background:'transparent'}}>Teams</th><th style={{...TH2,background:'transparent'}}>Pos</th><th style={{...TH2,background:'transparent'}}>Flows 12M</th><th style={{...TH2,background:'transparent'}}>Flagged</th><th style={{...TH2L,background:'transparent',paddingLeft:16}}>Health</th></tr></thead>
            <tbody>{modelRows.length?modelRows.map(x=>{
              const nFlag=x.prods.filter(p=>det.outl.has(p.id)||det.tail.has(p.mgrId)).length;
              return(<tr key={x.name} className="row-hover" onClick={()=>setModal({kind:'model',name:x.name})} style={{cursor:'pointer'}}>
                <td style={{...TDL,fontWeight:600,color:INK}}>{x.name}</td>
                <td style={TDL}><span style={{fontSize:9.5,fontWeight:600,padding:'1px 7px',borderRadius:9999,border:`1px solid ${x.type==='tp'?'rgba(118,169,250,0.5)':'rgba(120,160,255,0.5)'}`,color:x.type==='tp'?'rgb(118,169,250)':MINT}}>{x.type==='firm'?'Firm model':'3rd-party'}</span></td>
                <td className="num" style={{...TD,color:MUTED}}>{x.mgrs.size}</td>
                <td className="num" style={{...TD,color:MUTED}}>{x.prods.length}</td>
                <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(x.aum)}</td>
                <td className="num" style={{...TD,color:MUTED}}>{x.hh}</td>
                <td className="num" style={{...TD,color:MUTED}}>{lens==='practice'?'—':x.teams.size}</td>
                <td className="num" style={{...TD,color:MUTED}}>{x.pos}</td>
                <td style={TD}><Flow v={x.flows}/></td>
                <td style={TD}>{nFlag?<OutlPill>{nFlag}</OutlPill>:<span style={{color:'rgb(75,85,99)'}}>—</span>}</td>
                <td style={{...TDL,paddingLeft:16}}>{x.hh<=10?<OutlPill>underused — {x.hh} HH, review necessity</OutlPill>:nFlag?<OutlPill>{nFlag} flagged holding{nFlag>1?'s':''}</OutlPill>:<span style={{color:MINT,fontSize:11,fontWeight:600}}>healthy</span>}</td>
              </tr>);}):<tr><td colSpan={11} style={{textAlign:'center',color:MUTED,padding:24,fontSize:12}}>No model-tagged holdings in the current selection.</td></tr>}</tbody>
          </table>
        </div>
        <div style={{fontSize:11.5,color:MUTED,marginTop:12}}>HH = distinct households holding any product tagged to the model — a proxy for adoption.</div>
      </Card>

      {/* heatmap */}
      {lens==='firm'&&targets.length>0&&<Card>
        <CardTitle title="Consolidation Heatmap — Targets × Teams" subtitle="Who holds what: each cell is a team's dollars in a flagged target. Click a team name for its practice view; click a row or cell to drill in."/>
        <HeatmapTable targets={targets} gotoTeam={gotoTeam} openModal={(m,p)=>setModal({kind:'mgr',mgrId:m,prodId:p})}/>
        <div style={{display:'flex',gap:16,alignItems:'center',marginTop:12,fontSize:11,color:MUTED,flexWrap:'wrap'}}>
          <span><TailPill s="M"/>&nbsp; Tail manager (exit relationship)</span>
          <span><OutlPill>P</OutlPill>&nbsp; Product outlier (consolidate)</span>
          <span><span style={{display:'inline-block',width:12,height:12,borderRadius:3,background:'rgba(227,160,8,0.15)',verticalAlign:-2,marginRight:5}}/>Small exposure</span>
          <span><span style={{display:'inline-block',width:12,height:12,borderRadius:3,background:'rgba(227,160,8,0.85)',verticalAlign:-2,marginRight:5}}/>Large exposure</span>
        </div>
      </Card>}

      {modal&&<Modal modal={modal} det={det} lens={lens} teamId={teamId} total={total} close={()=>setModal(null)} setModal={setModal} gotoTeam={gotoTeam}/>}
    </div>
  );
}

/* ---------- heatmap ---------- */
function HeatmapTable({targets,gotoTeam,openModal}){
  const val=(t,ti)=>t.type==='mgr'
    ? managers[t.mgrId].prods.reduce((s,id)=>s+products[id].aum*products[id].tw[ti],0)
    : products[t.prodId].aum*products[t.prodId].tw[ti];
  const cells=targets.map(t=>TEAMS.map((_,ti)=>val(t,ti)));
  const totals=TEAMS.map((_,ti)=>cells.reduce((s,row)=>s+row[ti],0));
  const maxCell=Math.max(0.01,...cells.flat()),maxTot=Math.max(0.01,...totals);
  const Cell=({v,max,onClick,tip})=>v<=0.005
    ?<td style={{padding:2}}><div style={{height:24,minWidth:52,borderRadius:3,background:'rgb(55,65,81)',opacity:0.35}}/></td>
    :(()=>{const a=0.12+0.73*Math.sqrt(v/max);return <td style={{padding:2}}><div title={tip} onClick={onClick} className="num" style={{height:24,minWidth:52,borderRadius:3,background:`rgba(227,160,8,${a.toFixed(2)})`,color:a>0.5?'rgb(17,25,40)':'rgb(252,233,106)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9.5,fontWeight:600,cursor:'pointer'}}>{fm(v)}</div></td>;})();
  return(
    <div className="scroll-thin" style={{overflowX:'auto',maxHeight:520,overflowY:'auto'}}>
      <table style={{borderCollapse:'collapse',width:'100%'}}>
        <thead><tr>
          <th style={{position:'sticky',top:0,background:'rgb(27,37,55)',zIndex:3,textAlign:'left',minWidth:230,fontSize:9.5,fontWeight:600,color:MC_MUTED,textTransform:'uppercase',letterSpacing:'0.02em',padding:'6px 3px',borderBottom:'1px solid rgb(75,85,99)'}}>Target</th>
          {TEAMS.map((t,ti)=><th key={ti} title={t.name+' — open practice view'} onClick={()=>gotoTeam(ti)} style={{position:'sticky',top:0,background:'rgb(27,37,55)',zIndex:3,fontSize:9.5,fontWeight:600,color:'rgb(120,160,255)',textTransform:'uppercase',letterSpacing:'0.02em',padding:'6px 3px',textAlign:'center',borderBottom:'1px solid rgb(75,85,99)',cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>{t.short}</th>)}
        </tr></thead>
        <tbody>
          <tr>
            <td style={{fontSize:11.5,fontWeight:700,color:'rgb(229,231,235)',padding:'5px 8px 5px 0',borderBottom:'2px solid rgb(75,85,99)'}}>All targets <span style={{color:MC_MUTED,fontSize:10,fontWeight:400}}>· target $ per team</span></td>
            {totals.map((v,ti)=><Cell key={ti} v={v} max={maxTot} tip={`${TEAMS[ti].name}\n${fm(v)} in consolidation targets — click for practice view`} onClick={()=>gotoTeam(ti)}/>)}
          </tr>
          {targets.map((t,ri)=>(
            <tr key={ri}>
              <td title={`${t.name} — ${fm(t.aum)} · ${t.hh} HH — click to drill in`} onClick={()=>openModal(t.mgrId,t.prodId)} style={{fontSize:11.5,color:'rgb(209,213,219)',padding:'5px 8px 5px 0',whiteSpace:'nowrap',maxWidth:250,overflow:'hidden',textOverflow:'ellipsis',cursor:'pointer',borderBottom:'1px solid rgba(75,85,99,0.2)'}}>
                {t.type==='mgr'?<TailPillHM/>:<OutlPillHM/>} {t.name}
              </td>
              {cells[ri].map((v,ti)=><Cell key={ti} v={v} max={maxCell} tip={`${TEAMS[ti].name}\n${t.name}\n${fm(v)}`} onClick={()=>openModal(t.mgrId,t.prodId)}/>)}
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}
const MC_MUTED='rgb(156,163,175)';
function TailPillHM(){return <span style={{fontSize:9,fontWeight:800,padding:'1px 6px',borderRadius:9999,background:'rgba(227,160,8,0.9)',color:'rgb(17,25,40)'}}>M</span>;}
function OutlPillHM(){return <span style={{fontSize:9,fontWeight:700,padding:'1px 6px',borderRadius:9999,border:'1px solid rgba(227,160,8,0.6)',color:'rgb(227,160,8)'}}>P</span>;}

window.ManagerConcentrationPage=ManagerConcentrationPage;
})();
