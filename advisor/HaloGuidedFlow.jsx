/* HaloGuidedFlow — Aura-style guided analysis for Halo insights.
   Replaces the generic proposal flow for provider === 'Halo'.
   Sequence: stream analysis on ACTUAL client holdings (Field custodian data)
   → guided inputs (outlook / goal / horizon) → scored, ranked note candidates
   (advisor checkbox-selects what the client will see — non-advice mode)
   → overlay slider + Monte Carlo with/without comparison + histogram
   → plain-language explanation → build client proposal from the selection.
   Trigger: window 'insight:open' with a Halo insight id. */

const HGF = {
  ink:'rgb(249,250,251)', muted:'rgb(163,163,163)', dim:'rgb(107,114,128)',
  border:'rgba(75,85,99,0.5)', borderHard:'rgba(75,85,99,0.7)',
  green:'rgb(5,122,85)', greenBr:'rgb(52,211,153)', greenSoft:'rgba(5,122,85,0.06)',
  halo:'rgb(124,58,237)', haloBr:'rgb(192,132,252)',
  card:'rgba(255,255,255,0.03)',
};

/* Actual client holdings from the Field custodian feed, mapped to asset
   classes (Aura lab mode: simulate against real positions, not generic models). */
const HGF_HOLDINGS = {
  watson: [
    { tkr:'NVDA',  name:'NVIDIA Corp',              cls:'US Equity — Single Stock', val:10.4, pct:38, flag:true },
    { tkr:'VOO',   name:'Vanguard S&P 500 ETF',     cls:'US Large Blend',           val:6.8,  pct:25 },
    { tkr:'QQQ',   name:'Invesco QQQ',              cls:'US Large Growth',          val:3.8,  pct:14 },
    { tkr:'IEFA',  name:'iShares Core MSCI EAFE',   cls:'Intl Developed Equity',    val:2.2,  pct:8 },
    { tkr:'AGG',   name:'iShares Core US Aggregate',cls:'Core Bond',                val:2.5,  pct:9 },
    { tkr:'VTEB',  name:'Vanguard Tax-Exempt Bond', cls:'Municipal Bond',           val:1.1,  pct:4 },
    { tkr:'CASH',  name:'Money Market / Sweep',     cls:'Cash',                     val:0.5,  pct:2 },
  ],
  _default: [
    { tkr:'VOO',  name:'Vanguard S&P 500 ETF',      cls:'US Large Blend',    val:4.1, pct:34 },
    { tkr:'VXUS', name:'Vanguard Total Intl',       cls:'Intl Equity',       val:2.2, pct:18 },
    { tkr:'AGG',  name:'iShares Core US Aggregate', cls:'Core Bond',         val:3.4, pct:28 },
    { tkr:'VTEB', name:'Vanguard Tax-Exempt Bond',  cls:'Municipal Bond',    val:1.6, pct:13 },
    { tkr:'CASH', name:'Money Market / Sweep',      cls:'Cash',              val:0.8, pct:7 },
  ],
};

/* Candidate notes from Halo's pre-bucketed shelf (~400 products, 27-point grid).
   Base composite + per-input adjustments drive the live ranking. */
const HGF_NOTES = [
  { id:'n1', name:'12-mo Buffered Growth Note', und:'S&P 500', kind:'Growth', term:'12 mo',
    protection:'15% hard buffer', payoff:'1:1 upside to 18% cap', issuer:'JPMorgan', cusip:'48130C7',
    base:86, adj:{ outlook:{ cautious:8, neutral:4, constructive:0 }, goal:{ growth:6, balance:3, income:-4 }, horizon:{ short:6, medium:2, long:-2 } },
    stats:{ sharpe:0.71, negFreq:'11%', exp:'8.1%', sd:'9.6%', inc:'—', kurt:'Low tail' } },
  { id:'n2', name:'24-mo Uncapped Accelerated Note', und:'S&P 500 / NDX (worst-of)', kind:'Growth', term:'24 mo',
    protection:'20% buffer', payoff:'1.15× upside, uncapped', issuer:'Goldman Sachs', cusip:'38150G2',
    base:84, adj:{ outlook:{ cautious:2, neutral:5, constructive:8 }, goal:{ growth:8, balance:2, income:-6 }, horizon:{ short:-3, medium:5, long:3 } },
    stats:{ sharpe:0.66, negFreq:'14%', exp:'9.4%', sd:'12.1%', inc:'—', kurt:'Moderate' } },
  { id:'n3', name:'2-yr Contingent Income Note', und:'S&P 500', kind:'Income', term:'24 mo',
    protection:'30% barrier', payoff:'9.2% contingent coupon', issuer:'Morgan Stanley', cusip:'61760QX',
    base:82, adj:{ outlook:{ cautious:4, neutral:4, constructive:-2 }, goal:{ growth:-5, balance:3, income:9 }, horizon:{ short:3, medium:4, long:-2 } },
    stats:{ sharpe:0.62, negFreq:'13%', exp:'7.0%', sd:'8.8%', inc:'9.2%', kurt:'Low tail' } },
  { id:'n4', name:'5-yr Principal-Protected Note', und:'S&P 500', kind:'Growth', term:'60 mo',
    protection:'100% principal', payoff:'70% participation', issuer:'Citigroup', cusip:'17330F9',
    base:76, adj:{ outlook:{ cautious:9, neutral:2, constructive:-4 }, goal:{ growth:-2, balance:4, income:-1 }, horizon:{ short:-6, medium:0, long:8 } },
    stats:{ sharpe:0.58, negFreq:'0%', exp:'6.2%', sd:'6.9%', inc:'—', kurt:'Floored' } },
];

const HGF_OUTLOOKS = [ { id:'cautious', label:'Cautious', ic:'fa-shield-halved' }, { id:'neutral', label:'Neutral', ic:'fa-up-down' }, { id:'constructive', label:'Constructive', ic:'fa-arrow-trend-up' } ];
const HGF_GOALS    = [ { id:'growth', label:'Growth', ic:'fa-arrow-trend-up' }, { id:'balance', label:'Balance', ic:'fa-up-down' }, { id:'income', label:'Income', ic:'fa-file-invoice-dollar' } ];
const HGF_HORIZONS = [ { id:'short', label:'≤ 2 yrs' }, { id:'medium', label:'2–5 yrs' }, { id:'long', label:'5+ yrs' } ];

const hgfScore = (n, o, g, h) => Math.min(99, n.base + n.adj.outlook[o] + n.adj.goal[g] + n.adj.horizon[h]);

/* Monte Carlo summary — baseline vs overlay, interpolated by overlay weight. */
function hgfSim(note, ov) {
  const w = ov / 40; // 0..1 across the 5–40% pre-calculated range
  const lerp = (a, b) => a + (b - a) * w;
  const tgt = { n1:{ exp:7.9, med:7.6, sharpe:0.71, sd:11.2, inc:1.3, neg:14 }, n2:{ exp:8.4, med:7.9, sharpe:0.68, sd:12.4, inc:1.3, neg:16 }, n3:{ exp:7.5, med:7.3, sharpe:0.66, sd:11.0, inc:3.4, neg:15 }, n4:{ exp:7.1, med:6.9, sharpe:0.63, sd:9.8,  inc:1.3, neg:10 } }[note.id];
  const base = { exp:7.2, med:6.6, sharpe:0.52, sd:14.8, inc:1.3, neg:24 };
  return { base, over: { exp:lerp(base.exp,tgt.exp), med:lerp(base.med,tgt.med), sharpe:lerp(base.sharpe,tgt.sharpe), sd:lerp(base.sd,tgt.sd), inc:lerp(base.inc,tgt.inc), neg:lerp(base.neg,tgt.neg) } };
}

/* 1-yr return distribution buckets (−30% … +40%, 14 buckets) for the histogram. */
const HGF_BASE_DIST = [1.6,2.4,3.6,5.2,7.4,9.8,12.0,13.4,12.8,11.0,8.6,6.2,3.8,2.2];
const HGF_NOTE_DIST = { n1:[0.3,0.6,1.4,3.0,5.8,9.4,13.2,15.6,14.8,12.6,9.8,7.4,4.0,2.1], n2:[0.5,0.9,1.8,3.4,6.0,9.0,12.4,14.6,14.0,12.4,10.2,8.0,4.6,2.2], n3:[0.4,0.8,1.6,3.2,6.2,10.2,14.0,16.2,15.0,12.0,9.0,6.0,3.4,2.0], n4:[0.1,0.3,0.8,2.2,5.4,10.0,14.6,16.8,15.4,12.2,9.4,6.6,3.6,2.6] };
const HGF_BUCKET_LABELS = ['−30','−25','−20','−15','−10','−5','0','+5','+10','+15','+20','+25','+30','+35'];

function HgfStreamLine({ line, delay, onComplete }) {
  const [shown, setShown] = React.useState('');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => { i++; setShown(line.text.slice(0, i)); if (i >= line.text.length) { clearInterval(id); setDone(true); onComplete && onComplete(); } }, line.type === 'thinking' ? 10 : 6);
    }, delay);
    return () => clearTimeout(t);
  }, []);
  if (line.type === 'thinking') return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', fontFamily:'Inter', fontSize:13, color:HGF.muted, fontStyle:'italic' }}>
      <i className={`fa-solid fa-${done ? 'check' : 'circle-notch'} ${done ? '' : 'fa-spin'}`} style={{ width:11, height:11, color: done ? HGF.greenBr : HGF.muted }} />
      <span>{shown}</span>
    </div>
  );
  return (
    <div style={{ padding:'12px 16px', marginTop:8, background:HGF.card, border:`1px solid ${HGF.border}`, borderRadius:10, fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.6 }}>
      {shown}{!done && <span style={{ display:'inline-block', width:7, height:14, background:HGF.greenBr, marginLeft:2, verticalAlign:'middle', animation:'hgf-blink 1s infinite' }} />}
    </div>
  );
}

function HgfSeg({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', gap:6 }}>
      {options.map(o => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7, height:36, borderRadius:8, cursor:'pointer', fontFamily:'Inter', fontSize:12.5, fontWeight: on ? 600 : 500,
            background: on ? 'rgba(5,122,85,0.16)' : HGF.card, border: on ? `1px solid ${HGF.green}` : `1px solid ${HGF.borderHard}`, color: on ? HGF.greenBr : 'rgb(209,213,219)', transition:'all 120ms ease' }}>
            {o.ic && <i className={`fa-solid ${o.ic}`} style={{ width:12, height:12 }} />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

function HaloGuidedFlow() {
  const [open, setOpen] = React.useState(false);
  const [r, setR] = React.useState(null);
  const [streamIdx, setStreamIdx] = React.useState(0);
  const [stage, setStage] = React.useState(0); // 1 holdings, 2 guided, 3 recs, 4 sim+cta
  const [outlook, setOutlook] = React.useState('cautious');
  const [goal, setGoal] = React.useState('growth');
  const [horizon, setHorizon] = React.useState('short');
  const [selected, setSelected] = React.useState({});
  const [overlay, setOverlay] = React.useState(20);
  const [explain, setExplain] = React.useState(null); // null | 'busy' | text
  const [showDeck, setShowDeck] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const onOpen = (e) => {
      const id = e.detail && e.detail.id;
      const m = (window.FIELD_INSIGHTS || []).find(x => x.id === id);
      if (!m || m.provider !== 'Halo') return;
      setR(m); setOpen(true); setStreamIdx(0); setStage(0); setShowDeck(false); setExplain(null);
      setSelected({ n1:true }); setOverlay(20);
      setOutlook(m.risk === 'Aggressive' ? 'cautious' : 'neutral');
      setGoal(m.productKind && m.productKind.includes('income') ? 'income' : 'growth');
      setHorizon(m.productKind && m.productKind.includes('income') ? 'medium' : 'short');
    };
    const onClose = () => setOpen(false);
    window.addEventListener('insight:open', onOpen);
    window.addEventListener('insight:closeflow', onClose);
    return () => { window.removeEventListener('insight:open', onOpen); window.removeEventListener('insight:closeflow', onClose); };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const lines = React.useMemo(() => {
    if (!r) return [];
    return [
      { type:'thinking', text:`Pulling ${r.client}\u2019s actual holdings from the Field custodian feed…` },
      { type:'thinking', text:'Mapping positions to asset classes for simulation (lab mode — real holdings, not model proxies)…' },
      { type:'thinking', text:`Evaluating "${r.signal}" against the household\u2019s ${r.risk} profile…` },
      { type:'thinking', text:'Bucketing Halo\u2019s shelf (~400 notes, 27-point grid) and loading pre-calculated overlays…' },
      { type:'response', text:`${r.signalDetail} ${r.why}` },
      { type:'response', text:`I\u2019ve mapped ${r.client}\u2019s live positions and pre-scored Halo\u2019s shelf against them. Confirm the outlook, goal, and horizon below — I\u2019ll rank the best-fit notes and you choose which ones the client sees.` },
    ];
  }, [r]);

  React.useEffect(() => {
    if (!open || !lines.length || streamIdx < lines.length) return;
    const ts = [setTimeout(() => setStage(1), 300), setTimeout(() => setStage(2), 1100), setTimeout(() => setStage(3), 1900), setTimeout(() => setStage(4), 2700)];
    return () => ts.forEach(clearTimeout);
  }, [streamIdx, open, lines.length]);

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTo({ top:scrollRef.current.scrollHeight, behavior:'smooth' }); }, [streamIdx, stage]);

  if (!open || !r) return null;

  const holdings = HGF_HOLDINGS[r.id] || HGF_HOLDINGS._default;
  const ranked = HGF_NOTES.map(n => ({ ...n, score:hgfScore(n, outlook, goal, horizon) })).sort((a,b) => b.score - a.score);
  const selIds = ranked.filter(n => selected[n.id]);
  const primary = selIds[0] || ranked[0];
  const sim = hgfSim(primary, overlay);
  const w = overlay / 40;
  const overDist = HGF_BASE_DIST.map((v,i) => v * (1-w) + HGF_NOTE_DIST[primary.id][i] * w);
  const maxBar = Math.max(...HGF_BASE_DIST, ...overDist);
  const deckHref = `advisor/Insight Proposal.html?id=${r.id}`;
  const sectionStyle = { fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:HGF.greenBr, marginBottom:14 };
  const btn = { height:32, padding:'0 14px', borderRadius:8, border:`1px solid ${HGF.borderHard}`, background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', cursor:'pointer', fontFamily:'Inter', fontSize:12.5, fontWeight:500, display:'inline-flex', alignItems:'center', gap:8 };
  const statCell = (label, a, b, betterLow, ratio) => {
    const improved = betterLow ? b < a : b > a;
    const fmt = (v) => ratio ? v.toFixed(2) : v.toFixed(1) + '%';
    return (
      <div style={{ padding:'12px 14px', background:HGF.card, border:`1px solid ${HGF.border}`, borderRadius:10 }}>
        <div style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:HGF.dim, marginBottom:8 }}>{label}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontFamily:'Inter', fontSize:18, fontWeight:700, color:HGF.ink, fontVariantNumeric:'tabular-nums' }}>{fmt(b)}</span>
          <span style={{ fontFamily:'Inter', fontSize:11.5, color:HGF.dim, fontVariantNumeric:'tabular-nums', textDecoration:'line-through' }}>{fmt(a)}</span>
          <i className={`fa-solid fa-arrow-${improved ? (betterLow ? 'down' : 'up') : 'right'}`} style={{ width:10, height:10, color: improved ? HGF.greenBr : HGF.muted, marginLeft:'auto' }} />
        </div>
      </div>
    );
  };

  const handleExplain = async () => {
    if (explain === 'busy') return;
    setExplain('busy');
    try {
      const reply = await window.claude.complete({ messages:[{ role:'user', content:
        `You are Halo Aura's explanation layer inside Field, speaking to a financial advisor (non-advice mode — the advisor decides what to show the client). Client: ${r.client} household, ${r.aum}, ${r.risk} risk. Signal: ${r.signalDetail} A ${overlay}% overlay of "${primary.name}" (${primary.protection}, ${primary.payoff}, ${primary.term}) on the at-risk sleeve moves the Monte Carlo results from expected return ${sim.base.exp.toFixed(1)}%→${sim.over.exp.toFixed(1)}%, std dev ${sim.base.sd.toFixed(1)}%→${sim.over.sd.toFixed(1)}%, Sharpe ${sim.base.sharpe.toFixed(2)}→${sim.over.sharpe.toFixed(2)}, negative-year frequency ${sim.base.neg.toFixed(0)}%→${sim.over.neg.toFixed(0)}%. Explain in plain language (3-4 sentences, no jargon, client-friendly) what changed and why, as text the advisor could read aloud.` }] });
      setExplain(reply);
    } catch { setExplain('The overlay trades a slice of the portfolio\u2019s open-ended upside for a defined floor: the buffer absorbs the first leg of any market decline, so bad years get much rarer and shallower, while typical and good years look almost the same. That is why the spread of outcomes narrows and risk-adjusted return improves even though the headline expected return barely moves.'); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(12,12,18,0.93)', backdropFilter:'blur(20px) saturate(140%)', WebkitBackdropFilter:'blur(20px) saturate(140%)', animation:'hgf-fadein 250ms ease-out', display:'flex', flexDirection:'column' }}>
      <style>{`
        @keyframes hgf-fadein { from { opacity:0; } to { opacity:1; } }
        @keyframes hgf-blink { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
        @keyframes hgf-rise { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hgf-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(124,58,237,0.5); } 50% { box-shadow:0 0 0 8px transparent; } }
        .hgf-range { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:9999px; background:linear-gradient(to right, rgb(5,122,85) 0%, rgb(5,122,85) var(--fill), rgba(75,85,99,0.6) var(--fill), rgba(75,85,99,0.6) 100%); outline:none; }
        .hgf-range::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:9999px; background:rgb(52,211,153); border:2px solid rgb(5,122,85); cursor:grab; }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 28px', borderBottom:`1px solid ${HGF.border}` }}>
        {showDeck ? (
          <React.Fragment>
            <button onClick={() => setShowDeck(false)} style={btn}><i className="fa-solid fa-arrow-left" style={{ width:11, height:11 }} /> Back to analysis</button>
            <div style={{ flex:1, minWidth:0, paddingLeft:8 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:HGF.ink }}>Structured Note Proposal</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:HGF.muted }}>Prepared for {r.client} · {selIds.length || 1} note{(selIds.length||1) > 1 ? 's' : ''} selected · via Halo</div>
            </div>
            <button onClick={() => window.open(deckHref, '_blank')} style={btn}><i className="fa-solid fa-arrow-up-right-from-square" style={{ width:11, height:11 }} /> Full screen</button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ width:36, height:36, borderRadius:8, flexShrink:0, background:HGF.halo, display:'flex', alignItems:'center', justifyContent:'center', animation:'hgf-pulse 2.5s infinite', border:'1px solid rgba(255,255,255,0.14)' }}>
              <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:11, color:'#fff' }}>HALO</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:HGF.ink }}>Field Intelligence · Halo Guided Analysis</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:HGF.muted }}>Simulating on {r.client}’s actual holdings</div>
            </div>
            <div style={{ fontFamily:'Inter', fontSize:11, fontWeight:600, padding:'5px 10px', borderRadius:6, background:'rgba(234,179,8,0.14)', color:'rgb(245,200,90)', border:'1px solid rgba(245,200,90,0.4)', display:'inline-flex', alignItems:'center', gap:7 }}>
              <i className="fa-solid fa-shield-halved" style={{ width:11, height:11 }} /> NON-ADVICE MODE
            </div>
          </React.Fragment>
        )}
        <button onClick={() => setOpen(false)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${HGF.borderHard}`, background:'rgba(255,255,255,0.04)', color:'rgb(209,213,219)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-xmark" style={{ width:13, height:13 }} />
        </button>
      </div>

      {showDeck && (
        <div style={{ flex:1, minHeight:0, background:'rgb(15,14,22)' }}>
          <iframe src={deckHref} style={{ width:'100%', height:'100%', border:'none', display:'block' }} title="Proposal" />
        </div>
      )}

      {!showDeck && (
        <div ref={scrollRef} style={{ flex:1, overflowY:'auto' }}>
          <div style={{ maxWidth:960, margin:'0 auto', padding:'40px 28px 80px' }}>

            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:HGF.card, border:`1px solid ${HGF.border}`, borderRadius:12, marginBottom:28, animation:'hgf-rise 400ms ease-out' }}>
              <div style={{ width:40, height:40, borderRadius:9999, background:`linear-gradient(135deg, ${HGF.halo} 0%, ${HGF.haloBr} 240%)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontWeight:700, fontSize:13, color:'#fff' }}>{r.initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:HGF.ink }}>{r.client}{r.sub && <span style={{ color:HGF.muted, fontWeight:400 }}> · {r.sub}</span>}</div>
                <div style={{ fontFamily:'Inter', fontSize:11.5, color:HGF.muted }}>{r.aum} · {r.risk} · {r.scope} at-risk sleeve · Holdings synced 4 min ago</div>
              </div>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:11, padding:'5px 10px', borderRadius:6, background:'rgba(124,58,237,0.2)', color:HGF.haloBr, border:'1px solid rgba(124,58,237,0.45)' }}>HALO · FIT {r.fit}</div>
            </div>

            <div style={sectionStyle}>Analysis in progress</div>
            <div style={{ marginBottom:32 }}>
              {lines.slice(0, streamIdx + 1).map((line, i) => (
                <HgfStreamLine key={i} line={line} delay={i === 0 ? 200 : 0} onComplete={() => setStreamIdx(p => Math.max(p, i + 1))} />
              ))}
            </div>

            {stage >= 1 && (
              <div style={{ marginBottom:28, animation:'hgf-rise 500ms ease-out' }}>
                <div style={sectionStyle}>Actual holdings · Field custodian feed</div>
                <div style={{ border:`1px solid ${HGF.border}`, borderRadius:12, overflow:'hidden' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'0.7fr 1.6fr 1.3fr 0.7fr 0.6fr', background:HGF.card, fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.04em', color:HGF.muted, textTransform:'uppercase' }}>
                    <div style={{ padding:'10px 16px' }}>Ticker</div><div style={{ padding:'10px 12px' }}>Position</div><div style={{ padding:'10px 12px' }}>Mapped asset class</div><div style={{ padding:'10px 12px', textAlign:'right' }}>Value</div><div style={{ padding:'10px 16px', textAlign:'right' }}>Weight</div>
                  </div>
                  {holdings.map((hh, i) => (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'0.7fr 1.6fr 1.3fr 0.7fr 0.6fr', alignItems:'center', borderTop:`1px solid rgba(75,85,99,0.4)`, fontFamily:'Inter', fontSize:12.5, background: hh.flag ? 'rgba(220,38,38,0.06)' : 'transparent' }}>
                      <div style={{ padding:'10px 16px', fontWeight:600, color: hh.flag ? 'rgb(248,113,113)' : HGF.ink }}>{hh.tkr}{hh.flag && <i className="fa-solid fa-triangle-exclamation" style={{ width:10, height:10, marginLeft:6, color:'rgb(248,113,113)' }} />}</div>
                      <div style={{ padding:'10px 12px', color:'rgb(209,213,219)' }}>{hh.name}</div>
                      <div style={{ padding:'10px 12px', color:HGF.muted }}>{hh.cls}</div>
                      <div style={{ padding:'10px 12px', textAlign:'right', color:'rgb(209,213,219)', fontVariantNumeric:'tabular-nums' }}>${hh.val.toFixed(1)}M</div>
                      <div style={{ padding:'10px 16px', textAlign:'right', fontWeight:600, color: hh.flag ? 'rgb(248,113,113)' : HGF.ink, fontVariantNumeric:'tabular-nums' }}>{hh.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stage >= 2 && (
              <div style={{ marginBottom:28, animation:'hgf-rise 500ms ease-out' }}>
                <div style={sectionStyle}>Guided inputs — confirm or adjust</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
                  {[['Market outlook', HGF_OUTLOOKS, outlook, setOutlook], ['Portfolio goal', HGF_GOALS, goal, setGoal], ['Time horizon', HGF_HORIZONS, horizon, setHorizon]].map(([label, opts, val, set], i) => (
                    <div key={i} style={{ padding:'14px 16px', background:HGF.card, border:`1px solid ${HGF.border}`, borderRadius:12 }}>
                      <div style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:HGF.dim, marginBottom:10 }}>{label}</div>
                      <HgfSeg options={opts} value={val} onChange={set} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:10, fontFamily:'Inter', fontSize:11.5, color:HGF.dim, display:'flex', alignItems:'center', gap:7 }}>
                  <i className="fa-solid fa-circle-info" style={{ width:11, height:11 }} /> Pre-filled from the household profile and the concentration signal. Changing an input re-ranks the shelf instantly — overlays are pre-calculated.
                </div>
              </div>
            )}

            {stage >= 3 && (
              <div style={{ marginBottom:28, animation:'hgf-rise 500ms ease-out' }}>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ ...sectionStyle, marginBottom:0 }}>Ranked notes — select what {r.client.split(' ')[0]} sees</div>
                  <div style={{ fontFamily:'Inter', fontSize:11.5, color:HGF.muted }}>{selIds.length} of {ranked.length} selected for the client proposal</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {ranked.map((n, i) => {
                    const on = !!selected[n.id];
                    const isPrimary = primary.id === n.id && on;
                    return (
                      <div key={n.id} onClick={() => setSelected(s => ({ ...s, [n.id]:!s[n.id] }))} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', borderRadius:12, cursor:'pointer', transition:'all 140ms ease',
                        background: on ? 'rgba(5,122,85,0.08)' : HGF.card, border: on ? `1px solid rgba(5,122,85,0.55)` : `1px solid ${HGF.border}` }}>
                        <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background: on ? HGF.green : 'transparent', border: on ? `1px solid ${HGF.greenBr}` : `1px solid ${HGF.borderHard}` }}>
                          {on && <i className="fa-solid fa-check" style={{ width:11, height:11, color:'#fff' }} />}
                        </div>
                        <div style={{ width:44, textAlign:'center', flexShrink:0 }}>
                          <div style={{ fontFamily:'Inter', fontWeight:800, fontSize:20, color: n.score >= 90 ? HGF.greenBr : n.score >= 84 ? 'rgb(229,231,235)' : HGF.muted, fontVariantNumeric:'tabular-nums' }}>{n.score}</div>
                          <div style={{ fontFamily:'Inter', fontSize:9, fontWeight:600, letterSpacing:'0.08em', color:HGF.dim, textTransform:'uppercase' }}>Score</div>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:13.5, color:HGF.ink, display:'flex', alignItems:'center', gap:8 }}>
                            {n.name}
                            {i === 0 && <span style={{ fontFamily:'Inter', fontSize:9.5, fontWeight:700, letterSpacing:'0.06em', padding:'2px 7px', borderRadius:5, background:'rgba(124,58,237,0.22)', color:HGF.haloBr, border:'1px solid rgba(124,58,237,0.45)' }}>TOP MATCH</span>}
                            {isPrimary && <span style={{ fontFamily:'Inter', fontSize:9.5, fontWeight:700, letterSpacing:'0.06em', padding:'2px 7px', borderRadius:5, background:'rgba(5,122,85,0.2)', color:HGF.greenBr, border:'1px solid rgba(5,122,85,0.5)' }}>SIMULATING</span>}
                          </div>
                          <div style={{ fontFamily:'Inter', fontSize:11.5, color:HGF.muted, marginTop:3 }}>{n.und} · {n.protection} · {n.payoff} · {n.issuer}</div>
                        </div>
                        <div style={{ display:'flex', gap:18, flexShrink:0, fontFamily:'Inter', fontVariantNumeric:'tabular-nums' }}>
                          {[['Sharpe', n.stats.sharpe], ['Neg. yrs', n.stats.negFreq], ['Exp. ret', n.stats.exp], ['Income', n.stats.inc]].map(([l, v], j) => (
                            <div key={j} style={{ textAlign:'right', minWidth:44 }}>
                              <div style={{ fontSize:12.5, fontWeight:600, color:'rgb(209,213,219)' }}>{v}</div>
                              <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.06em', color:HGF.dim, textTransform:'uppercase' }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop:12, padding:'11px 14px', borderRadius:10, background:'rgba(234,179,8,0.07)', border:'1px solid rgba(245,200,90,0.3)', display:'flex', gap:10, alignItems:'flex-start' }}>
                  <i className="fa-solid fa-shield-halved" style={{ width:12, height:12, color:'rgb(245,200,90)', marginTop:2 }} />
                  <span style={{ fontFamily:'Inter', fontSize:12, color:'rgb(209,213,219)', lineHeight:1.5 }}>Aura surfaces curated candidates scored on Sharpe, negative-return frequency, expected return, volatility, income, and tail risk — weighted for a {goal} goal. <strong style={{ color:HGF.ink }}>You choose what the client sees;</strong> nothing here is a recommendation to the client.</span>
                </div>
              </div>
            )}

            {stage >= 4 && selIds.length > 0 && (
              <div style={{ marginBottom:28, animation:'hgf-rise 500ms ease-out' }}>
                <div style={sectionStyle}>Monte Carlo — {r.client} with vs. without {primary.name}</div>
                <div style={{ padding:'16px 18px', background:HGF.card, border:`1px solid ${HGF.border}`, borderRadius:12, marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:HGF.ink }}>Overlay on the at-risk sleeve</div>
                    <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:700, color:HGF.greenBr, fontVariantNumeric:'tabular-nums' }}>{overlay}% <span style={{ fontSize:11, fontWeight:500, color:HGF.muted }}>≈ ${(parseFloat(r.scope.replace(/[^0-9.]/g,'')) * overlay / 100).toFixed(1)}M</span></div>
                  </div>
                  <input type="range" min="5" max="40" step="5" value={overlay} onChange={(e) => setOverlay(+e.target.value)} className="hgf-range" style={{ '--fill': `${(overlay-5)/35*100}%` }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter', fontSize:10.5, color:HGF.dim, marginTop:6 }}><span>5% · lightest</span><span>Pre-calculated 5–40%</span><span>40% · max</span></div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:14 }}>
                  {statCell('Expected return', sim.base.exp, sim.over.exp, false)}
                  {statCell('Median return', sim.base.med, sim.over.med, false)}
                  {statCell('Sharpe ratio', sim.base.sharpe, sim.over.sharpe, false, true)}
                  {statCell('Std deviation', sim.base.sd, sim.over.sd, true)}
                  {statCell('Portfolio income', sim.base.inc, sim.over.inc, false)}
                  {statCell('Negative years', sim.base.neg, sim.over.neg, true)}
                </div>
                <div style={{ padding:'18px 18px 12px', background:HGF.card, border:`1px solid ${HGF.border}`, borderRadius:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:14 }}>
                    <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:HGF.ink, flex:1 }}>Distribution of simulated 1-yr returns · 10,000 paths</div>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:11, color:HGF.muted }}><span style={{ width:10, height:10, borderRadius:3, background:'rgba(107,114,128,0.55)' }} /> Current</span>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:11, color:HGF.muted }}><span style={{ width:10, height:10, borderRadius:3, background:HGF.greenBr }} /> With note</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:130 }}>
                    {HGF_BASE_DIST.map((bv, i) => (
                      <div key={i} style={{ flex:1, display:'flex', alignItems:'flex-end', gap:2, height:'100%' }}>
                        <div style={{ flex:1, height:`${bv/maxBar*100}%`, background:'rgba(107,114,128,0.45)', borderRadius:'3px 3px 0 0', transition:'height 300ms ease' }}></div>
                        <div style={{ flex:1, height:`${overDist[i]/maxBar*100}%`, background: i < 6 ? 'rgba(52,211,153,0.55)' : HGF.greenBr, borderRadius:'3px 3px 0 0', transition:'height 300ms ease' }}></div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:6 }}>
                    {HGF_BUCKET_LABELS.map((l, i) => <div key={i} style={{ flex:1, textAlign:'center', fontFamily:'Inter', fontSize:9.5, color:HGF.dim, fontVariantNumeric:'tabular-nums' }}>{l}</div>)}
                  </div>
                </div>
                <div style={{ marginTop:14 }}>
                  {explain === null && (
                    <button onClick={handleExplain} style={{ ...btn, height:36 }}><i className="fa-solid fa-wand-magic-sparkles" style={{ width:12, height:12, color:HGF.greenBr }} /> Explain these results in plain language</button>
                  )}
                  {explain === 'busy' && (
                    <div style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'Inter', fontSize:12.5, color:HGF.muted, fontStyle:'italic', padding:'8px 0' }}>
                      <i className="fa-solid fa-circle-notch fa-spin" style={{ width:12, height:12 }} /> Drafting a client-friendly explanation…
                    </div>
                  )}
                  {explain && explain !== 'busy' && (
                    <div style={{ padding:'14px 16px', background:'rgba(5,122,85,0.07)', border:'1px solid rgba(5,122,85,0.35)', borderRadius:10, animation:'hgf-rise 300ms ease-out' }}>
                      <div style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:HGF.greenBr, marginBottom:8, display:'flex', alignItems:'center', gap:7 }}><i className="fa-solid fa-wand-magic-sparkles" style={{ width:11, height:11 }} /> Plain-language summary — reads aloud to the client</div>
                      <div style={{ fontFamily:'Inter', fontSize:13.5, color:'rgb(229,231,235)', lineHeight:1.65 }}>{explain}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stage >= 4 && (
              <div style={{ padding:'22px 24px', background:'linear-gradient(135deg, rgba(5,122,85,0.14) 0%, rgba(5,122,85,0.04) 100%)', border:'1px solid rgba(5,122,85,0.45)', borderRadius:14, display:'flex', alignItems:'center', gap:18, animation:'hgf-rise 500ms ease-out 200ms both' }}>
                <div style={{ width:48, height:48, borderRadius:12, flexShrink:0, background:'rgba(5,122,85,0.25)', border:'1px solid rgba(5,122,85,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className="fa-solid fa-file-lines" style={{ width:20, height:20, color:HGF.greenBr }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:15, color:HGF.ink, marginBottom:4 }}>{selIds.length > 0 ? `Client proposal — ${selIds.length} note${selIds.length > 1 ? 's' : ''}, ${overlay}% overlay` : 'Select at least one note to build the proposal'}</div>
                  <div style={{ fontFamily:'Inter', fontSize:12.5, color:HGF.muted }}>{selIds.length > 0 ? `${r.client} sees only your selection: ${selIds.map(n => n.name).join(' · ')}` : 'The client only ever sees the notes you check above.'}</div>
                </div>
                <button disabled={selIds.length === 0} onClick={() => selIds.length && setShowDeck(true)} style={{ fontFamily:'Inter', fontWeight:600, fontSize:13, padding:'12px 20px', borderRadius:8, cursor: selIds.length ? 'pointer' : 'default', background: selIds.length ? HGF.green : 'rgba(75,85,99,0.4)', border: selIds.length ? `1px solid ${HGF.greenBr}` : `1px solid ${HGF.borderHard}`, color:'#fff', display:'inline-flex', alignItems:'center', gap:8, opacity: selIds.length ? 1 : 0.6, boxShadow: selIds.length ? '0 4px 12px rgba(5,122,85,0.4)' : 'none' }}>
                  Build client proposal <i className="fa-solid fa-arrow-right" style={{ width:11, height:11 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

window.HaloGuidedFlow = HaloGuidedFlow;
