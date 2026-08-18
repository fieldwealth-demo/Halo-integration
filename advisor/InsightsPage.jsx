/* InsightsPage — multi-provider insight stream for the advisor's book.
   Replaces the single-provider "Halo" page. Asset managers (Halo, BlackRock,
   PIMCO, Blackstone, Nuveen) push insights into the book; the advisor scans
   them in one ranked stream, filters by provider / type / priority, and hits
   "Build proposal" to launch the AI proposal flow → client-ready proposal doc.

   Halo is the protective / structured-investment provider in the mix.

   Shared data: window.FIELD_INSIGHTS (read by InsightProposalFlow.jsx).
   Build proposal: window.dispatchEvent(new CustomEvent('insight:open', { detail:{ id } }))
*/

const IP_INK   = 'rgb(249,250,251)';
const IP_MUTED = 'rgb(163,163,163)';
const IP_DIM   = 'rgb(107,114,128)';
const IP_BORDER= 'rgb(75,85,99)';
const IP_SOFT  = 'rgba(75,85,99,0.5)';
const IP_GREEN = 'rgb(5,122,85)';
const IP_GREEN_BR = 'rgb(52,211,153)';

/* Providers that surface insights. Halo = protective/structured specialist. */
const PROVIDER_META = {
  'Halo':       { abbr:'HALO', brand:'rgb(124,58,237)', fg:'rgb(192,132,252)', specialty:'Protective & Structured' },
  'BlackRock':  { abbr:'BLK',  brand:'rgb(17,24,32)',   fg:'rgb(110,231,183)', specialty:'Models & ETFs' },
  'PIMCO':      { abbr:'PIM',  brand:'rgb(0,46,110)',   fg:'rgb(120,160,230)', specialty:'Fixed Income' },
  'Blackstone': { abbr:'BX',   brand:'rgb(38,38,38)',   fg:'rgb(245,200,90)',  specialty:'Private Markets' },
  'Nuveen':     { abbr:'NUV',  brand:'rgb(13,123,138)', fg:'rgb(244,164,200)', specialty:'Income & Munis' },
};
const PROVIDER_ORDER = ['Halo', 'BlackRock', 'PIMCO', 'Blackstone', 'Nuveen'];

const TYPE_META = {
  'Downside Protection':            { fg:'rgb(196,181,253)', bg:'rgba(139,92,246,0.16)', bd:'rgba(196,181,253,0.45)' },
  'Structured Income':              { fg:'rgb(125,211,252)', bg:'rgba(56,189,248,0.14)', bd:'rgba(125,211,252,0.45)' },
  'Cash Deployment':                { fg:'rgb(248,113,113)', bg:'rgba(220,38,38,0.16)',  bd:'rgba(248,113,113,0.50)' },
  'Income Generation':              { fg:'rgb(110,231,183)', bg:'rgba(16,185,129,0.16)', bd:'rgba(110,231,183,0.45)' },
  'Rebalancing / Drift':            { fg:'rgb(248,180,150)', bg:'rgba(251,146,60,0.16)', bd:'rgba(248,180,150,0.45)' },
  'Diversification':                { fg:'rgb(120,160,230)', bg:'rgba(96,165,250,0.16)', bd:'rgba(120,160,230,0.45)' },
  'Private Markets / Alternatives': { fg:'rgb(245,200,90)',  bg:'rgba(234,179,8,0.16)',  bd:'rgba(245,200,90,0.45)'  },
};

const PRIORITY_META = {
  HIGH: { fg:'rgb(248,113,113)', bg:'rgba(220,38,38,0.18)',  bd:'rgba(248,113,113,0.55)' },
  MED:  { fg:'rgb(234,179,8)',   bg:'rgba(202,138,4,0.18)',  bd:'rgba(245,200,90,0.55)'  },
  LOW:  { fg:'rgb(163,163,163)', bg:'rgba(255,255,255,0.04)',bd:'rgba(75,85,99,0.6)'     },
};

/* ---- The insight stream. Halo rows carry the structured-product fields the
   proposal flow + deck need (productKind, term, scope, scenarios via deck). --- */
window.FIELD_INSIGHTS = [
  /* ---- Halo (protective / structured) ---- */
  { id:'watson', provider:'Halo', client:'Watson', sub:'John & Kristin', initials:'JW', aum:'$27.3M', risk:'Aggressive',
    type:'Downside Protection', priority:'HIGH', est:'$86K', fit:94, scope:'$10.4M',
    product:'Buffered ETF', productKind:'protection', term:'12-mo · 15% buffer · 18% cap',
    signal:'Single-stock concentration',
    signalDetail:'38% of the taxable account sits in one large-cap tech position. YTD the household is \u22122.4% against a +6% target.',
    why:'A defined-outcome buffer absorbs the first 15% of a drawdown on the concentrated sleeve while keeping upside to an 18% cap — without forcing a taxable sale.' },
  { id:'smith', provider:'Halo', client:'Smith', sub:'Keith & Asheley', initials:'KS', aum:'$29.0M', risk:'Conservative',
    type:'Structured Income', priority:'HIGH', est:'$74K', fit:91, scope:'$8.2M',
    product:'RILA Annuity', productKind:'income', term:'6-yr · 10% buffer · 4.6% income',
    signal:'Near-retirement income gap',
    signalDetail:'Both spouses retire within 24 months. Current fixed-income yield trails the household\u2019s drawdown plan by roughly 1.4%.',
    why:'A registered index-linked annuity converts part of the bond sleeve into protected, index-linked income — closing the retirement income gap with a defined floor.' },
  { id:'young', provider:'Halo', client:'David Young', sub:null, initials:'DY', aum:'$31.2M', risk:'Moderate',
    type:'Cash Deployment', priority:'MED', est:'$24K', fit:88, scope:'$2.1M',
    product:'Market-Linked CD', productKind:'protection', term:'3-yr · 100% principal · index-linked',
    signal:'Idle cash drag',
    signalDetail:'$2.1M has sat in money-market and held-away cash for 90+ days, yielding below the household\u2019s blended target.',
    why:'A market-linked CD puts idle cash to work with FDIC-insured principal protection and index-linked upside — a low-friction first protective allocation.' },
  { id:'hawkins', provider:'Halo', client:'Hawkins', sub:'Ricardo & Cameron', initials:'RH', aum:'$29.5M', risk:'Moderate',
    type:'Downside Protection', priority:'MED', est:'$58K', fit:83, scope:'$6.8M',
    product:'Defined-Outcome ETF', productKind:'protection', term:'12-mo · 12% buffer · 16% cap',
    signal:'Sector concentration',
    signalDetail:'Energy and financials make up 41% of equity exposure against a 25% policy ceiling. Review is past due.',
    why:'A defined-outcome ETF dials the concentrated sector exposure back to policy while preserving participation.' },
  { id:'lang', provider:'Halo', client:'Lang', sub:'Aubrey & Josh', initials:'AL', aum:'$16.5M', risk:'Conservative',
    type:'Downside Protection', priority:'MED', est:'$41K', fit:80, scope:'$4.5M',
    product:'Principal-Protected Note', productKind:'protection', term:'5-yr · 100% principal · 70% participation',
    signal:'Sequence-of-returns risk',
    signalDetail:'Within five years of drawdown with 62% equity. A poor early sequence would materially impair the plan.',
    why:'A principal-protected note guarantees invested principal at maturity while retaining 70% of index upside — insulating the plan from an adverse early sequence.' },
  { id:'edwards', provider:'Halo', client:'Edwards', sub:'Aubrey & Josh', initials:'AE', aum:'$30.9M', risk:'Aggressive',
    type:'Structured Income', priority:'MED', est:'$68K', fit:77, scope:'$7.6M',
    product:'Structured Income Note', productKind:'income-note', term:'2-yr · 20% barrier · 9.2% coupon',
    signal:'Concentrated equity, no hedge',
    signalDetail:'92% equity with no protective overlay. Stated risk tolerance is aggressive but the plan has no defined floor.',
    why:'A barrier income note generates a 9.2% contingent coupon with a 20% downside barrier — adding protected income to an unhedged equity book.' },

  /* ---- BlackRock ---- */
  { id:'davenport', provider:'BlackRock', client:'Robert Davenport', sub:'Drifted 8% from target', initials:'RD', aum:'$2.9M', risk:'Moderate',
    type:'Rebalancing / Drift', priority:'MED', est:'$150K', fit:86, scope:'$2.9M',
    product:'BLK Target Allocation', productKind:'allocation', term:'ETF model · 0.12% ER',
    signal:'Allocation drift',
    signalDetail:'Equity sleeve has drifted 8% above target after the rally. Rebalancing to the BLK Target Allocation model brings it back to policy with minimal turnover.',
    why:'Rebalance to model — higher fit and roughly 2× the advisory impact, with almost no tax drag.' },
  { id:'collins', provider:'BlackRock', client:'James Collins', sub:'EM underweight', initials:'JC', aum:'$2.3M', risk:'Aggressive',
    type:'Diversification', priority:'MED', est:'$100K', fit:81, scope:'$2.3M',
    product:'BLK Target Allocation', productKind:'allocation', term:'Model update · EM to 8%',
    signal:'IPS diversification gap',
    signalDetail:'Model update increases emerging-market exposure to 8% via BLK Target Allocation, closing an IPS diversification gap.',
    why:'Lifts EM exposure to the policy target while staying inside the existing low-cost model.' },

  /* ---- PIMCO ---- */
  { id:'workman', provider:'PIMCO', client:'Maria Workman', sub:'Idle cash + AGG drag', initials:'MW', aum:'$5.1M', risk:'Moderate',
    type:'Cash Deployment', priority:'HIGH', est:'$221K', fit:88, scope:'$1.16M',
    product:'PIMCO Total Return (PTTRX)', productKind:'allocation', term:'Active fund · 0.46% ER',
    signal:'Idle cash + duration gap',
    signalDetail:'Idle cash plus an AGG drag — reposition $1.16M into PIMCO Total Return to close the duration gap.',
    why:'Best fit for her income mandate and deploys the full idle balance with no tax impact.' },
  { id:'chen', provider:'PIMCO', client:'Robert Chen', sub:'Light income duration', initials:'RC', aum:'$3.4M', risk:'Moderate',
    type:'Income Generation', priority:'MED', est:'$118K', fit:84, scope:'$3.4M',
    product:'PIMCO Income (PIMIX)', productKind:'income', term:'Active fund · 5.6% yield',
    signal:'Income shortfall',
    signalDetail:'Light income duration in the fixed-income sleeve — adding PIMCO Income lifts yield to ~5.6%.',
    why:'Raises portfolio yield to meet the client\u2019s income need without extending credit risk materially.' },

  /* ---- Blackstone ---- */
  { id:'sinclair', provider:'Blackstone', client:'The Sinclair Foundation', sub:'0% private real estate', initials:'SF', aum:'$6.4M', risk:'Moderate',
    type:'Private Markets / Alternatives', priority:'HIGH', est:'$148K', fit:90, scope:'$6.4M',
    product:'Blackstone BREIT', productKind:'alts', term:'Private REIT · IPS target',
    signal:'Private-markets underweight',
    signalDetail:'Qualified purchaser with 0% private real estate. A BREIT allocation fits the IPS target and diversifies the equity-heavy book.',
    why:'Adds an income-producing private real-estate sleeve that matches the foundation\u2019s long horizon and IPS target.' },
  { id:'delgado', provider:'Blackstone', client:'The Delgado Family', sub:'Private credit underweight', initials:'DF', aum:'$4.8M', risk:'Aggressive',
    type:'Private Markets / Alternatives', priority:'MED', est:'$84K', fit:82, scope:'$4.8M',
    product:'Blackstone BCRED', productKind:'alts', term:'Private credit · ~9% target yield',
    signal:'Alternatives gap',
    signalDetail:'Underexposed to private credit — a BCRED direct-lending sleeve targets ~9% yield and diversifies income sources.',
    why:'Introduces a private-credit income stream uncorrelated with the public-bond sleeve.' },

  /* ---- Nuveen ---- */
  { id:'okafor', provider:'Nuveen', client:'The Okafor Trust', sub:'37% bracket', initials:'OT', aum:'$2.3M', risk:'Conservative',
    type:'Private Markets / Alternatives', priority:'LOW', est:'$96K', fit:79, scope:'$2.3M',
    product:'Nuveen AMT-Free Muni', productKind:'income', term:'Municipal SMA',
    signal:'Tax drag',
    signalDetail:'37% bracket with a taxable bond sleeve — swapping to a Nuveen AMT-free muni SMA cuts the tax drag.',
    why:'Improves after-tax yield for a high-bracket client by moving to tax-exempt municipals.' },
];

function estK(s) {
  if (!s || s === '\u2014') return 0;
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  return s.includes('M') ? n * 1000 : n;
}
function fmtK(k) {
  if (k <= 0) return '\u2014';
  return k >= 1000 ? `$${(k / 1000).toFixed(2)}M` : `$${Math.round(k)}K`;
}

/* ---- Atoms ---- */
function ProviderBadge({ provider, size=24 }) {
  const m = PROVIDER_META[provider] || PROVIDER_META['Halo'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:9, whiteSpace:'nowrap' }}>
      <span style={{ width:size, height:size, borderRadius:5, flexShrink:0, background:m.brand,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Inter', fontWeight:800, fontSize:size*0.36, letterSpacing:'0.02em',
        color:'#fff', border:'1px solid rgba(255,255,255,0.14)' }}>{m.abbr}</span>
      <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:'rgb(229,231,235)' }}>{provider}</span>
    </span>
  );
}
function TypePill({ type }) {
  const m = TYPE_META[type]; if (!m) return null;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 10px', borderRadius:9999,
      background:m.bg, border:`1px solid ${m.bd}`, color:m.fg,
      fontFamily:'Inter', fontSize:11.5, fontWeight:500, lineHeight:1, whiteSpace:'nowrap' }}>{type}</span>
  );
}
function PriorityChip({ p }) {
  const m = PRIORITY_META[p]; if (!m) return null;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:9999,
      background:m.bg, border:`1px solid ${m.bd}`, color:m.fg,
      fontFamily:'Inter', fontSize:10.5, fontWeight:700, letterSpacing:'0.06em', lineHeight:1, whiteSpace:'nowrap' }}>{p}</span>
  );
}
function FitBar({ value, color='rgb(110,231,183)' }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
      <span style={{ width:48, height:5, borderRadius:9999, background:'rgba(255,255,255,0.12)', overflow:'hidden', display:'inline-block' }}>
        <span style={{ display:'block', height:'100%', width:`${value}%`, background:color }} />
      </span>
      <span style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:700, color:IP_INK, fontVariantNumeric:'tabular-nums' }}>{value}</span>
    </span>
  );
}
function FilterChip({ active, onClick, label, dot }) {
  return (
    <button onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:7, height:32, padding:'0 13px', borderRadius:9999, cursor:'pointer',
      border:`1px solid ${active ? IP_GREEN : 'rgba(75,85,99,0.8)'}`,
      background: active ? 'rgba(5,122,85,0.16)' : 'transparent',
      color: active ? 'rgb(110,231,183)' : 'rgb(229,231,235)',
      fontFamily:'Inter', fontSize:12.5, fontWeight:500, whiteSpace:'nowrap', transition:'background 150ms ease, border-color 150ms ease' }}>
      {dot && <span style={{ width:7, height:7, borderRadius:9999, background:dot, flexShrink:0 }} />}
      {label}
    </button>
  );
}
function IPStat({ label, value, sub }) {
  return (
    <div style={{ padding:'16px 20px', background:'rgba(255,255,255,0.025)', border:`1px solid ${IP_SOFT}`, borderRadius:12, flex:1, minWidth:0 }}>
      <div style={{ fontFamily:'Inter', fontSize:11, color:IP_MUTED, marginBottom:8, letterSpacing:'0.04em' }}>{label}</div>
      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:26, color:IP_INK, letterSpacing:'-0.01em', fontVariantNumeric:'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontFamily:'Inter', fontSize:11.5, color:IP_DIM, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

function InsightCard({ r, expanded, onToggle, onBuild }) {
  const pm = PROVIDER_META[r.provider] || PROVIDER_META['Halo'];
  const isHalo = r.provider === 'Halo';
  const accent = isHalo ? 'rgb(168,85,247)' : IP_GREEN;
  const accentSoft = isHalo ? 'rgba(168,85,247,0.16)' : 'rgba(5,122,85,0.16)';
  const accentBr = isHalo ? 'rgb(192,132,252)' : 'rgb(110,231,183)';
  return (
    <div style={{
      border:`1px solid ${expanded ? (isHalo ? 'rgba(168,85,247,0.4)' : 'rgba(5,122,85,0.4)') : IP_SOFT}`,
      borderRadius:14, background: expanded ? accentSoft.replace('0.16','0.05') : 'rgba(255,255,255,0.02)',
      transition:'border-color 160ms ease, background 160ms ease', overflow:'hidden' }}>
      <div onClick={onToggle} style={{
        display:'grid', gridTemplateColumns:'auto 1.5fr 1.4fr 1.5fr 110px 96px 150px', alignItems:'center', gap:16,
        padding:'15px 20px', cursor:'pointer' }}>
        {/* avatar */}
        <div style={{ width:38, height:38, borderRadius:9999, flexShrink:0,
          background:`linear-gradient(135deg, ${pm.brand} 0%, ${pm.fg} 240%)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Inter', fontWeight:700, fontSize:12.5, color:'#fff' }}>{r.initials}</div>
        {/* client + provider */}
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:13.5, color:IP_INK, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {r.client}{r.sub && r.provider==='Halo' && <span style={{ color:IP_MUTED, fontWeight:400 }}> · {r.sub}</span>}
          </div>
          <div style={{ marginTop:5 }}><ProviderBadge provider={r.provider} size={18} /></div>
        </div>
        {/* type + signal */}
        <div style={{ minWidth:0 }}>
          <TypePill type={r.type} />
          <div style={{ fontFamily:'Inter', fontSize:11.5, color:IP_DIM, marginTop:6 }}>{r.signal}</div>
        </div>
        {/* product */}
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:IP_INK }}>{r.product}</div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:IP_DIM, marginTop:3 }}>{r.term}</div>
        </div>
        {/* fit */}
        <FitBar value={r.fit} color={accentBr} />
        {/* est */}
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'Inter', fontSize:9.5, letterSpacing:'0.06em', textTransform:'uppercase', color:IP_DIM }}>Est. value</div>
          <div style={{ fontFamily:'Inter', fontSize:15, fontWeight:700, color:IP_INK, fontVariantNumeric:'tabular-nums', marginTop:2 }}>{r.est}</div>
        </div>
        {/* action */}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button onClick={(e)=>{ e.stopPropagation(); onBuild(r); }} style={{
            height:34, padding:'0 14px', borderRadius:8, border:`1px solid ${accent}`,
            background:accentSoft, color:accentBr, cursor:'pointer',
            fontFamily:'Inter', fontSize:12.5, fontWeight:600, whiteSpace:'nowrap',
            display:'inline-flex', alignItems:'center', gap:8 }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize:11 }} /> Build proposal
          </button>
        </div>
      </div>
      {expanded && (
        <div style={{ padding:'2px 20px 20px 74px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 32px' }}>
          <div>
            <div style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:IP_MUTED, marginBottom:8 }}>Why it flagged</div>
            <div style={{ fontFamily:'Inter', fontSize:13, color:'rgb(209,213,219)', lineHeight:1.6 }}>{r.signalDetail}</div>
            <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:10 }}>
              <PriorityChip p={r.priority} />
              <span style={{ fontFamily:'Inter', fontSize:11.5, color:IP_DIM }}>{r.aum} · {r.risk} · {r.scope} in scope</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:accentBr, marginBottom:8 }}>{r.provider} recommendation</div>
            <div style={{ fontFamily:'Inter', fontSize:13, color:'rgb(209,213,219)', lineHeight:1.6 }}>{r.why}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightsPage({ onBuildProposal, provFilter=null, typeFilter=null }) {
  const rows = window.FIELD_INSIGHTS;
  const [expanded, setExpanded] = React.useState('watson');
  const [scanAt] = React.useState(() => {
    const d = new Date(); d.setHours(3, 12, 0, 0);
    return d.toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
  });

  const filtered = (() => {
    const list = rows.filter(r =>
      (!provFilter || r.provider === provFilter) &&
      (!typeFilter || r.type === typeFilter)
    ).sort((a,b) => estK(b.est) - estK(a.est));
    // Pin the top Halo insight to the front so a Halo opportunity always leads.
    const hi = list.findIndex(r => r.provider === 'Halo');
    if (hi > 0) { const [h] = list.splice(hi, 1); list.unshift(h); }
    return list;
  })();

  const providersPresent = PROVIDER_ORDER.filter(p => rows.some(r => r.provider === p));

  return (
    <main style={{ flex:1, padding:'20px 28px 64px', background:'transparent' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:16, flexWrap:'wrap' }}>
        <div style={{ fontFamily:'Inter', fontSize:12.5, color:IP_MUTED }}>
          {filtered.length} insight{filtered.length!==1?'s':''}{(provFilter||typeFilter)?' (filtered)':''} · {providersPresent.length} providers including <span style={{ color:'rgb(192,132,252)', fontWeight:600 }}>Halo</span> · last sync {scanAt}
        </div>
        <div style={{ display:'flex', alignItems:'center' }}>
          {providersPresent.map((p,i) => { const m=PROVIDER_META[p]; return <span key={p} title={p} style={{ width:26, height:26, borderRadius:6, background:m.brand, marginLeft:i?-7:0, display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontWeight:800, fontSize:8.5, color:'#fff', border:'1px solid rgba(255,255,255,0.16)', boxShadow:'0 0 0 2px rgb(14,26,42)' }}>{m.abbr}</span>; })}
        </div>
      </div>

      {/* Column header */}
      <div style={{ display:'grid', gridTemplateColumns:'54px 1.5fr 1.4fr 1.5fr 110px 96px 150px', gap:16, padding:'0 20px 8px',
        fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:IP_DIM }}>
        <div>Client</div><div></div><div>Insight</div><div>Recommended product</div><div>Fit</div><div style={{ textAlign:'right' }}>Value</div><div></div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(r => (
          <InsightCard key={r.id} r={r} expanded={expanded===r.id}
            onToggle={()=>setExpanded(prev => prev===r.id ? null : r.id)}
            onBuild={(rr)=>onBuildProposal && onBuildProposal(rr)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding:'48px 0', textAlign:'center', fontFamily:'Inter', fontSize:13, color:IP_MUTED }}>No insights match the current filters.</div>
        )}
      </div>

      <div style={{ marginTop:24, display:'flex', alignItems:'flex-start', gap:10, padding:'14px 18px',
        background:'rgba(255,255,255,0.02)', border:`1px solid ${IP_SOFT}`, borderRadius:12,
        fontFamily:'Inter', fontSize:11.5, color:IP_DIM, lineHeight:1.5 }}>
        <i className="fa-solid fa-circle-info" style={{ color:IP_GREEN, fontSize:13, marginTop:1 }} />
        <div>Insights are generated from connected provider feeds against held and held-away positions. Suitability, product availability,
        and final terms are confirmed with the provider before any order is placed. Nothing here is an offer or a recommendation to a client.</div>
      </div>
    </main>
  );
}

window.InsightsPage = InsightsPage;
window.INSIGHT_PROVIDERS = PROVIDER_ORDER.filter(p => window.FIELD_INSIGHTS.some(r => r.provider === p));
window.INSIGHT_TYPES = Object.keys(TYPE_META).filter(t => window.FIELD_INSIGHTS.some(r => r.type === t));
window.INSIGHT_PROVIDER_META = PROVIDER_META;
window.INSIGHT_TYPE_META = TYPE_META;
