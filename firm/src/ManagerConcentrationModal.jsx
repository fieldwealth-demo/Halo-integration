/* Manager Concentration — drill-down modal (manager + model views).
   Loaded after ManagerConcentration.jsx; exposes window.Modal used there. */
(function(){
const {TEAMS,managers,products,detect,fm,fpct}=window.MC;
const INK='rgb(249,250,251)',MUTED='rgb(156,163,175)',MINT='rgb(120,160,255)',RED='rgb(240,82,82)',AMBER='rgb(227,160,8)';
const VEH_C={MF:'rgb(118,169,250)',ETF:'rgb(52,106,255)',SMA:'rgb(227,160,8)',PF:'rgb(172,148,250)'};
const VEH_L={MF:'Mutual Fund',ETF:'ETF',SMA:'SMA',PF:'Private Fund'};
const TH={textAlign:'right',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',color:MUTED,padding:'7px 8px',borderBottom:'1px solid rgb(75,85,99)',whiteSpace:'nowrap',background:'rgba(255,255,255,0.03)'};
const THL={...TH,textAlign:'left'};
const TD={padding:'8px 8px',borderBottom:'1px solid rgba(75,85,99,0.35)',textAlign:'right',whiteSpace:'nowrap',fontSize:12};
const TDL={...TD,textAlign:'left'};
const Veh=({v,long})=><span style={{fontSize:9,fontWeight:600,padding:'1px 6px',borderRadius:9999,border:`1px solid ${VEH_C[v]}66`,color:VEH_C[v]}}>{long?VEH_L[v]:v}</span>;
const Flow=({v})=><span className="num" style={{fontSize:12,fontWeight:600,color:v>=0?MINT:RED}}>{v>=0?'+':''}{fm(v)}</span>;
const Kpi=({label,value,sub,color})=>(
  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgb(75,85,99)',borderRadius:12,padding:'12px 14px'}}>
    <div style={{fontSize:11,fontWeight:600,color:MUTED,textTransform:'uppercase',letterSpacing:'0.05em'}}>{label}</div>
    <div className="num" style={{fontSize:19,fontWeight:700,marginTop:5,letterSpacing:'-0.02em',color:color||INK}}>{value}</div>
    {sub&&<div style={{fontSize:11.5,color:MUTED,marginTop:3}}>{sub}</div>}
  </div>);
const H4=({children})=><div style={{fontSize:14,fontWeight:600,color:INK,margin:'20px 0 10px',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>{children}</div>;
const Hint=({children})=><span style={{fontSize:12,color:MUTED,fontWeight:400}}>{children}</span>;
const OutlP=({children})=><span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:9999,border:'1px solid rgba(227,160,8,0.6)',color:AMBER}}>{children||'OUTLIER'}</span>;
const TailP=()=><span style={{fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:9999,background:'rgba(227,160,8,0.9)',color:'rgb(17,25,40)'}}>TAIL MANAGER</span>;
const ModelT=({p})=>p.models.length?<span style={{display:'inline-flex',gap:4}}>{p.models.map((md,i)=><span key={i} style={{fontSize:9.5,fontWeight:600,padding:'1px 7px',borderRadius:9999,whiteSpace:'nowrap',border:`1px solid ${md.type==='tp'?'rgba(118,169,250,0.5)':'rgba(120,160,255,0.5)'}`,color:md.type==='tp'?'rgb(118,169,250)':MINT}}>{md.name}</span>)}</span>:<span style={{color:'rgb(75,85,99)',fontSize:11}}>Not in a model</span>;
const TeamLink=({ti,gotoTeam})=><a href="#" onClick={e=>{e.preventDefault();gotoTeam(ti);}} style={{color:INK,fontWeight:500,textDecoration:'none',borderBottom:'1px dotted rgb(75,85,99)'}}>{TEAMS[ti].name}</a>;

function Modal({modal,det,lens,teamId,total,close,setModal,gotoTeam}){
  const [selProd,setSelProd]=React.useState(modal.prodId!==null&&modal.prodId!==undefined?modal.prodId:null);
  React.useEffect(()=>{setSelProd(modal.prodId!==null&&modal.prodId!==undefined?modal.prodId:null);},[modal]);
  React.useEffect(()=>{const k=e=>{if(e.key==='Escape')close();};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);},[]);
  const wFn=p=>lens==='practice'?p.tw[teamId]:1;

  let head=null,body=null;
  if(modal.kind==='mgr'){
    const m=managers[modal.mgrId];
    const ps=m.prods.map(id=>products[id]).map(p=>({p,aum:p.aum*wFn(p),hh:Math.max(wFn(p)>0?1:0,Math.round(p.hh*wFn(p))),pos:Math.max(wFn(p)>0?1:0,Math.round(p.pos*wFn(p))),flows:p.flows*wFn(p),easy:p.aum*p.ease*wFn(p)})).filter(e=>e.aum>0.005).sort((a,b)=>b.aum-a.aum);
    const aum=ps.reduce((s,e)=>s+e.aum,0)||0.001;
    const easy=ps.reduce((s,e)=>s+e.easy,0);
    const hh=Math.round(ps.reduce((s,e)=>s+e.hh,0)*(ps.length>1?0.78:1))||1;
    const flows=ps.reduce((s,e)=>s+e.flows,0);
    const isTail=det.tail.has(m.id);
    const focus=selProd!==null?ps.find(e=>e.p.id===selProd):null;
    const tps=focus?[focus]:ps;
    const teamRows=TEAMS.map((_,ti)=>{
      const v=tps.reduce((s,e)=>s+e.p.aum*e.p.tw[ti],0);
      if(v<=0.005)return null;
      return {ti,v,hh:Math.max(1,Math.round(tps.reduce((s,e)=>s+e.p.hh*e.p.tw[ti],0))),pos:Math.max(1,Math.round(tps.reduce((s,e)=>s+e.p.pos*e.p.tw[ti],0))),easy:tps.reduce((s,e)=>s+e.p.aum*e.p.ease*e.p.tw[ti],0)};
    }).filter(Boolean).sort((a,b)=>b.v-a.v);
    const tTot=teamRows.reduce((s,r)=>s+r.v,0)||1;
    head=<div><h2 style={{fontSize:24,fontWeight:700,letterSpacing:'-0.02em',color:INK,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>{m.name}{isTail&&<TailP/>}</h2>
      <div style={{fontSize:13,color:MUTED,marginTop:2}}>{lens==='firm'?'Firm-wide exposure':'Exposure — '+TEAMS[teamId].name}</div></div>;
    body=<React.Fragment>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:8}}>
        <Kpi label="AUM" value={fm(aum)} sub={fpct(aum/total)+' of selection'}/>
        <Kpi label="12-Mo Net Flows" value={(flows>=0?'+':'')+fm(flows)} color={flows>=0?MINT:RED} sub="rolling 12 months"/>
        <Kpi label="Footprint" value={`${ps.length} · ${lens==='practice'?1:Math.max(...ps.map(e=>e.p.teams))} · ${ps.reduce((s,e)=>s+e.pos,0)}`} sub="products · teams · positions"/>
        <Kpi label="Households · Easy $" value={<span>{hh} · <span style={{color:MINT}}>{fm(easy)}</span></span>} sub={fpct(easy/aum,0)+' of this book is easy to move'}/>
      </div>
      <H4>Funds &amp; Products <Hint>— click a row to see which teams hold it</Hint></H4>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th style={THL}>Product</th><th style={TH}>Vehicle</th><th style={THL}>Model</th><th style={TH}>AUM</th><th style={TH}>Flows 12M</th><th style={TH}>Fund Share</th><th style={TH}>Teams</th><th style={TH}>Pos</th><th style={TH}>HH</th><th style={TH}>Easy $</th></tr></thead>
        <tbody>{ps.map((e,i)=>{const sel=selProd===e.p.id;return(
          <tr key={i} onClick={()=>setSelProd(sel?null:e.p.id)} className="row-hover" style={{cursor:'pointer',background:sel?'rgba(52,106,255,0.1)':'transparent'}}>
            <td style={{...TDL,color:'rgb(229,231,235)',boxShadow:sel?'inset 3px 0 0 rgb(52,106,255)':'none'}}>{e.p.name}{det.outl.has(e.p.id)&&<span style={{marginLeft:6}}><OutlP>outlier</OutlP></span>}</td>
            <td style={TD}><Veh v={e.p.veh} long/></td>
            <td style={TDL}><ModelT p={e.p}/></td>
            <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(e.aum)}</td>
            <td style={TD}><Flow v={e.flows}/></td>
            <td className="num" style={{...TD,color:MUTED}}>{fpct(e.aum/e.p.fundAUM,2)}</td>
            <td className="num" style={{...TD,color:MUTED}}>{lens==='practice'?'—':e.p.teams}</td>
            <td className="num" style={{...TD,color:MUTED}}>{e.pos}</td>
            <td className="num" style={{...TD,color:MUTED}}>{e.hh}</td>
            <td className="num" style={{...TD,color:MUTED}}>{e.p.veh==='PF'?<span style={{color:'rgb(75,85,99)'}}>locked</span>:fm(e.easy)}</td>
          </tr>);})}</tbody>
      </table></div>
      <H4>{focus?<span>Teams holding {focus.p.name} <button onClick={()=>setSelProd(null)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgb(75,85,99)',color:MUTED,fontSize:11,fontFamily:'Inter',padding:'3px 10px',borderRadius:9999,cursor:'pointer',marginLeft:6}}>✕ show all</button></span>:<span>By FA Team <Hint>— click a product above to focus · click a team to open its practice view</Hint></span>}</H4>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th style={THL}>Team</th><th style={TH}>AUM</th><th style={TH}>% Shown</th><th style={TH}>Pos</th><th style={TH}>HH</th><th style={TH}>Easy to Move</th></tr></thead>
        <tbody>{teamRows.map(r=>(
          <tr key={r.ti}>
            <td style={TDL}><TeamLink ti={r.ti} gotoTeam={gotoTeam}/></td>
            <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(r.v)}</td>
            <td className="num" style={{...TD,color:MUTED}}>{fpct(r.v/tTot)}</td>
            <td className="num" style={{...TD,color:MUTED}}>{r.pos}</td>
            <td className="num" style={{...TD,color:MUTED}}>{r.hh}</td>
            <td style={TD}>{r.easy>0.005?<span className="num" style={{fontSize:11,fontWeight:600,color:MINT}}>{fm(r.easy)} ({fpct(r.easy/r.v,0)})</span>:<span style={{color:'rgb(75,85,99)'}}>—</span>}</td>
          </tr>))}</tbody>
      </table></div>
    </React.Fragment>;
  } else {
    /* model modal */
    const name=modal.name;
    const ms=products.map(p=>({p,aum:p.aum*wFn(p)})).filter(e=>e.aum>0.005&&e.p.models.some(md=>md.name===name)).sort((a,b)=>b.aum-a.aum);
    const type=ms.length?ms[0].p.models.find(md=>md.name===name).type:'firm';
    const aum=ms.reduce((s,e)=>s+e.aum,0)||0.001;
    const hh=Math.round(ms.reduce((s,e)=>s+e.p.hh*wFn(e.p),0));
    const flows=ms.reduce((s,e)=>s+e.p.flows*wFn(e.p),0);
    const teamSet=new Set(); ms.forEach(e=>e.p.tw.forEach((w,i)=>{if(w>0.001)teamSet.add(i);}));
    const teamRows=TEAMS.map((_,ti)=>{
      const v=ms.reduce((s,e)=>s+e.p.aum*e.p.tw[ti],0); if(v<=0.005)return null;
      return {ti,v,pos:Math.max(1,Math.round(ms.reduce((s,e)=>s+e.p.pos*e.p.tw[ti],0))),hh:Math.max(1,Math.round(ms.reduce((s,e)=>s+e.p.hh*e.p.tw[ti],0)))};
    }).filter(Boolean).sort((a,b)=>b.v-a.v);
    head=<div><h2 style={{fontSize:24,fontWeight:700,letterSpacing:'-0.02em',color:INK,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>{name}{hh<=10&&<OutlP>underused</OutlP>}</h2>
      <div style={{fontSize:13,color:MUTED,marginTop:2}}>{type==='firm'?'Firm model — managed by the RIA investment committee':'3rd-party model'}{lens==='practice'?' · '+TEAMS[teamId].name+' only':''}</div></div>;
    body=<React.Fragment>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:8}}>
        <Kpi label="Model AUM" value={fm(aum)} sub={fpct(aum/total)+' of selection'}/>
        <Kpi label="Households Following" value={String(hh)} sub={ms.length+' products'}/>
        <Kpi label="Adoption" value={lens==='practice'?'—':teamSet.size+' of '+TEAMS.length} sub="teams using this model"/>
        <Kpi label="12-Mo Net Flows" value={(flows>=0?'+':'')+fm(flows)} color={flows>=0?MINT:RED} sub="rolling 12 months"/>
      </div>
      <H4>Model Holdings <Hint>— click a product to open the manager drill-down</Hint></H4>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th style={THL}>Product</th><th style={THL}>Manager</th><th style={TH}>Veh</th><th style={TH}>AUM</th><th style={TH}>Flows 12M</th><th style={TH}>Teams</th><th style={TH}>Pos</th><th style={TH}>HH</th><th style={TH}>Flag</th></tr></thead>
        <tbody>{ms.map((e,i)=>(
          <tr key={i} className="row-hover" onClick={()=>setModal({kind:'mgr',mgrId:e.p.mgrId,prodId:e.p.id})} style={{cursor:'pointer'}}>
            <td style={{...TDL,color:'rgb(229,231,235)'}}>{e.p.name}</td>
            <td style={{...TDL,color:MUTED}}>{managers[e.p.mgrId].name}</td>
            <td style={TD}><Veh v={e.p.veh}/></td>
            <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(e.aum)}</td>
            <td style={TD}><Flow v={e.p.flows*wFn(e.p)}/></td>
            <td className="num" style={{...TD,color:MUTED}}>{lens==='practice'?'—':e.p.teams}</td>
            <td className="num" style={{...TD,color:MUTED}}>{Math.max(1,Math.round(e.p.pos*wFn(e.p)))}</td>
            <td className="num" style={{...TD,color:MUTED}}>{Math.max(1,Math.round(e.p.hh*wFn(e.p)))}</td>
            <td style={TD}>{det.tail.has(e.p.mgrId)?<TailP/>:det.outl.has(e.p.id)?<OutlP>outlier</OutlP>:<span style={{color:'rgb(75,85,99)'}}>—</span>}</td>
          </tr>))}</tbody>
      </table></div>
      <H4>Adoption by FA Team <Hint>— click a team to open its practice view</Hint></H4>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th style={THL}>Team</th><th style={TH}>AUM</th><th style={TH}>% of Model</th><th style={TH}>Pos</th><th style={TH}>HH</th></tr></thead>
        <tbody>{teamRows.map(r=>(
          <tr key={r.ti}>
            <td style={TDL}><TeamLink ti={r.ti} gotoTeam={gotoTeam}/></td>
            <td className="num" style={{...TD,fontWeight:600,color:INK}}>{fm(r.v)}</td>
            <td className="num" style={{...TD,color:MUTED}}>{fpct(r.v/aum)}</td>
            <td className="num" style={{...TD,color:MUTED}}>{r.pos}</td>
            <td className="num" style={{...TD,color:MUTED}}>{r.hh}</td>
          </tr>))}</tbody>
      </table></div>
    </React.Fragment>;
  }

  return(
    <div onClick={e=>{if(e.target===e.currentTarget)close();}} style={{position:'fixed',inset:0,background:'rgba(17,25,40,0.8)',backdropFilter:'blur(4px)',zIndex:100,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'48px 24px',overflowY:'auto'}}>
      <div style={{background:'rgb(22,31,48)',border:'1px solid rgb(75,85,99)',borderRadius:16,width:'100%',maxWidth:980,padding:28}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:20}}>
          {head}
          <button onClick={close} aria-label="Close" style={{marginLeft:'auto',background:'rgba(255,255,255,0.06)',border:'1px solid rgb(75,85,99)',color:MUTED,width:32,height:32,borderRadius:8,cursor:'pointer',fontSize:14,fontFamily:'Inter',flexShrink:0}}>✕</button>
        </div>
        {body}
      </div>
    </div>
  );
}
window.Modal=Modal;
})();
