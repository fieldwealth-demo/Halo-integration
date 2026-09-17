/* Manager Concentration data engine — deterministic demo data + logic.
   Individual funds per manager; 5 core managers reconcile with the dashboard
   tile (Vanguard 300 / PIMCO 57 / BlackRock 32 / Blackstone 28 / GS 19) and a
   17-manager tail sums to the tile's "Other" $19M. All $ in $M. */
(function(){
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const rnd=mulberry32(20260724);
const R=(lo,hi)=>lo+rnd()*(hi-lo);
const RI=(lo,hi)=>Math.floor(R(lo,hi+1));

const TEAMS=[{name:'Team TCB',short:'TCB'},{name:'James Group',short:'James'},{name:'Diford Partners',short:'Diford'},{name:'Berry Wealth',short:'Berry'},{name:'Kelly Advisors',short:'Kelly'}];
const MODELS={FG:['Field Growth 60/40','firm'],FB:['Field Balanced Income','firm'],FT:['Field Tax-Aware Muni','firm'],FL:['Field Legacy Conservative','firm'],BT:['BlackRock Target Allocation','tp'],EP:['Envestnet PMC Tactical','tp']};

/* [name, drift, [[product, veh, aumM, modelKey|null, flagHint?], ...]] */
const DEFS=[
['Vanguard',0.09,[
 ['Vanguard Total Stock Market ETF (VTI)','ETF',88,'FG'],
 ['Vanguard S&P 500 ETF (VOO)','ETF',61,'EP'],
 ['Vanguard Total Bond Market ETF (BND)','ETF',44,'FB'],
 ['Vanguard Total Intl Stock ETF (VXUS)','ETF',27,'FG'],
 ['Vanguard Wellington Fund (VWENX)','MF',24,null],
 ['Vanguard Tax-Exempt Bond ETF (VTEB)','ETF',21,'FT'],
 ['Vanguard Target Retirement 2035 (VTTHX)','MF',17,null],
 ['Vanguard Dividend Appreciation ETF (VIG)','ETF',13,'FB'],
 ['Vanguard STAR Fund (VGSTX)','MF',5,'FL']]],
['PIMCO',-0.06,[
 ['PIMCO Income Fund (PIMIX)','MF',24,'FB'],
 ['PIMCO Total Return Fund (PTTRX)','MF',14,'EP'],
 ['PIMCO Flexible Credit Income Fund','PF',9,null,1],
 ['PIMCO Municipal Bond Ladder SMA','SMA',7,'FT'],
 ['PIMCO Active Bond ETF (BOND)','ETF',3,null,1]]],
['BlackRock / iShares',0.15,[
 ['iShares Core S&P 500 ETF (IVV)','ETF',12,'BT'],
 ['iShares Core US Aggregate ETF (AGG)','ETF',8,'BT'],
 ['BlackRock Strategic Income Opps (BSIIX)','MF',5,'FB'],
 ['iShares MSCI EAFE ETF (EFA)','ETF',4,'BT'],
 ['BlackRock Private Investment Fund Feeder','PF',3,null,1]]],
['Blackstone',0.09,[
 ['Blackstone BREIT (Class S)','PF',16,null],
 ['Blackstone BCRED (Class I)','PF',9,null],
 ['Blackstone BXPE Feeder Fund','PF',3,null,1]]],
['Goldman Sachs AM',-0.09,[
 ['GS US Equity Dividend SMA','SMA',7,'EP'],
 ['GS Municipal Bond SMA','SMA',4,'FT'],
 ['GS Growth Opportunities Fund (GGOIX)','MF',3,null,1],
 ['GS Autocallable Structured Notes','SMA',3,null,1],
 ['GS US Equity Insights Fund (GSIIX)','MF',2,null]]],
['Invesco',-0.14,[['Invesco QQQ Trust (QQQ)','ETF',1.7,null],['Invesco Developing Markets Fund','MF',0.9,null]]],
['Franklin Templeton',-0.20,[['Franklin Income Fund (A)','MF',1.5,null],['Templeton Global Bond Fund','MF',0.9,null]]],
['Nuveen',-0.18,[['Nuveen Intermediate Duration Muni Fund','MF',1.3,null],['Nuveen Municipal SMA','SMA',0.7,null]]],
['American Funds',-0.22,[['Growth Fund of America (A)','MF',1.2,'FL'],['Capital Income Builder (A)','MF',0.8,null]]],
['First Trust',-0.10,[['FT Buffer ETF — Feb Series (FFEB)','ETF',1.0,null],['FT Rising Dividend Achievers (RDVY)','ETF',0.6,null]]],
['Cohen & Steers',-0.16,[['Cohen & Steers Realty Shares (CSRSX)','MF',1.3,null]]],
['Lord Abbett',-0.15,[['Lord Abbett Short Duration Income (A)','MF',1.2,null]]],
['MFS',-0.19,[['MFS International Diversification (A)','MF',0.9,null]]],
['Hartford Funds',-0.17,[['Hartford Balanced Income Fund (A)','MF',0.8,null]]],
['Janus Henderson',-0.18,[['Janus Henderson Balanced Fund (T)','MF',0.8,null]]],
['Neuberger Berman',-0.14,[['Neuberger Berman Genesis Fund','MF',0.7,null]]],
['Calamos',-0.20,[['Calamos Market Neutral Income (A)','MF',0.6,null]]],
['Thornburg',-0.16,[['Thornburg Investment Income Builder','MF',0.55,null]]],
['Virtus',-0.21,[['Virtus KAR Small-Cap Growth (A)','MF',0.5,null]]],
['Baron Funds',-0.13,[['Baron Growth Fund (BGRFX)','MF',0.45,null]]],
['Matthews Asia',-0.24,[['Matthews Pacific Tiger Fund','MF',0.35,null]]],
['Principal AM',-0.22,[['Principal Blue Chip Fund (A)','MF',0.25,null]]],
];

const managers=[],products=[];
DEFS.forEach((d,mi)=>{
  const [name,drift,pds]=d;
  const core=pds.reduce((s,p)=>s+p[2],0)>=19;
  const mgr={id:mi,name,drift,core,aum:0,flows:0,prods:[]};
  pds.forEach(pd=>{
    const [pname,veh,aum,mk,flagHint]=pd;
    const hh = veh==='PF'? Math.round(aum*R(1.2,1.8)) : core? Math.max(6,Math.round(aum*R(1.6,2.4))) : Math.max(2,Math.min(13,Math.round(aum*R(3.5,5.5))));
    const pos=Math.round(hh*R(1.15,1.45));
    const flows=+(aum*drift*R(0.7,1.35)).toFixed(2);
    const ease = veh==='PF'?0 : flagHint&&veh==='SMA'?0.22 : veh==='SMA'?R(0.30,0.50) : core?R(0.40,0.75):R(0.55,0.85);
    const fundAUM = veh==='PF'?R(8,60)*1e3 : veh==='SMA'?R(2,15)*1e3 : core?(veh==='ETF'?R(80,400)*1e3:R(10,120)*1e3) : R(0.4,6)*1e3; /* $M */
    /* team weights */
    let tw;
    if(core){ tw=TEAMS.map(()=>R(0.5,1.5)); }
    else { const n=aum>1.5?3:aum>0.7?2:1; const idx=[...TEAMS.keys()].sort(()=>rnd()-0.5).slice(0,n); tw=TEAMS.map((_,i)=>idx.includes(i)?R(0.6,1.4):0); }
    const s=tw.reduce((a,b)=>a+b,0); tw=tw.map(w=>w/s);
    const models=mk?[{name:MODELS[mk][0],type:MODELS[mk][1]}]:[];
    const p={id:products.length,mgrId:mi,name:pname,veh,aum,hh,pos,flows,ease,fundAUM,models,tw,flagHint:!!flagHint,teams:tw.filter(w=>w>0.001).length};
    products.push(p); mgr.prods.push(p.id); mgr.aum+=aum; mgr.flows+=flows;
  });
  mgr.hh=Math.round(mgr.prods.reduce((s,id)=>s+products[id].hh,0)*(mgr.prods.length>1?0.78:1));
  managers.push(mgr);
});
const TOTAL=managers.reduce((s,m)=>s+m.aum,0);

/* ---- flags: computed at firm level over a veh/mgr-filtered product set ---- */
function detect(prodOk){
  const tail=new Set(), outl=new Set();
  managers.forEach(m=>{
    const ps=m.prods.map(id=>products[id]).filter(prodOk);
    if(!ps.length) return;
    const aum=ps.reduce((s,p)=>s+p.aum,0);
    const hh=Math.round(ps.reduce((s,p)=>s+p.hh,0)*(ps.length>1?0.78:1));
    const teams=Math.max(...ps.map(p=>p.teams));
    if(aum/TOTAL<0.006 && hh<=15 && teams<=4){ tail.add(m.id); return; }
    const coreHH=Math.max(...ps.map(p=>p.hh));
    ps.forEach(p=>{
      if(p.flagHint || (p.hh<=Math.max(3,coreHH*0.15) && p.aum/aum<0.2 && !p.models.length)) outl.add(p.id);
    });
  });
  return {tail,outl};
}

/* ---- unified target list. wFn(p) = scope weight (1 firm, tw[team] practice) ---- */
function buildTargets(det,wFn){
  const t=[];
  det.tail.forEach(mi=>{
    const m=managers[mi];
    const ps=m.prods.map(id=>products[id]);
    const aum=ps.reduce((s,p)=>s+p.aum*wFn(p),0); if(aum<0.01) return;
    const w=aum/m.aum;
    const allPF=ps.every(p=>p.veh==='PF');
    const modeled=ps.filter(p=>p.models.length);
    const hh=Math.max(1,Math.round(m.hh*w));
    t.push({type:'mgr',mgrId:mi,prodId:null,name:m.name,
      sub:`${ps.length} product${ps.length>1?'s':''} · ${modeled.length?modeled.length+' in models':'not in a model'}`,
      aum,hh,teams:Math.max(...ps.map(p=>p.teams)),pos:Math.round(ps.reduce((s,p)=>s+p.pos*wFn(p)/(wFn(p)||1)*wFn(p),0))||Math.round(ps.reduce((s,p)=>s+p.pos,0)*w),
      flows:ps.reduce((s,p)=>s+p.flows*wFn(p),0),easy:ps.reduce((s,p)=>s+p.aum*p.ease*wFn(p),0),locked:allPF,
      action: allPF?[['Exit relationship — redeem at quarterly liquidity windows',0]]
        : modeled.length?[['Exit relationship — coordinate model change first (',0],[modeled[0].models[0].name,1],[')',0]]
        : [['Exit relationship — move '+hh+' HH to core partners',0]]});
  });
  det.outl.forEach(pi=>{
    const p=products[pi]; if(det.tail.has(p.mgrId)) return;
    const aum=p.aum*wFn(p); if(aum<0.01) return;
    const m=managers[p.mgrId];
    const sibs=m.prods.map(id=>products[id]).filter(x=>x.id!==pi&&!det.outl.has(x.id));
    const core=sibs.filter(x=>x.veh===p.veh).sort((a,b)=>b.hh-a.hh)[0]||sibs.sort((a,b)=>b.hh-a.hh)[0];
    const md=p.models[0];
    t.push({type:'prod',mgrId:p.mgrId,prodId:pi,name:p.name,
      sub:`${m.name} · ${p.models.length?p.models.map(x=>x.name).join(', '):'not in a model'}`,
      aum,hh:Math.max(1,Math.round(p.hh*wFn(p))),teams:p.teams,pos:Math.max(1,Math.round(p.pos*wFn(p))),
      flows:p.flows*wFn(p),easy:p.aum*p.ease*wFn(p),locked:p.veh==='PF',
      action: p.veh==='PF'?[['Wind down at liquidity windows',0]]
        : md?[['In ',0],[md.name,1],[' — review lineup with '+(md.type==='firm'?'the investment committee':'the model provider'),0]]
        : core?[['Consolidate into ',0],[core.name,1],[` (${core.hh} HH)`,0]]:[['Review with investment committee',0]]});
  });
  return t.sort((a,b)=>b.aum-a.aum);
}

const fm=v=>{const a=Math.abs(v),s=v<0?'−':'';return a>=1000?s+'$'+(a/1000).toFixed(2)+'B':a>=1?s+'$'+a.toFixed(1)+'M':s+'$'+Math.round(a*1000)+'K';};
const fpct=(v,d=1)=>(v*100).toFixed(d)+'%';

window.MC={TEAMS,MODELS,managers,products,TOTAL,detect,buildTargets,fm,fpct};
})();
