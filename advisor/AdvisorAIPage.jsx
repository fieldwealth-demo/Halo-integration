/* Field AI — full-page assistant (Advisor) ----------------------------
   A dedicated LLM workspace page (mirrors the Asset-Manager home, recast
   for the advisor's book). Greeting → composer → suggestion chips. On
   submit, runs a short streamed "working" sequence (tool calls) and then
   reveals a rich, actionable result panel. A recent-chats rail docks on
   the left and a sticky follow-up composer lives at the bottom. Clicking a
   client opens that client's profile; deck actions open the rebalance deck. */

const AIP_BRAND      = 'rgb(5,122,85)';
const AIP_BRAND_LT   = 'rgb(52,211,153)';
const AIP_BRAND_SOFT = 'rgba(5,122,85,0.16)';
const AIP_BRAND_RING = 'rgba(5,122,85,0.40)';
const AIP_INK        = 'rgb(249,250,251)';
const AIP_INK_2      = 'rgb(229,231,235)';
const AIP_MUTED      = 'rgb(163,163,163)';
const AIP_DIM        = 'rgb(115,115,115)';
const AIP_LINE       = 'rgba(75,85,99,0.45)';
const AIP_RED        = 'rgb(248,113,113)';
const AIP_AMBER      = 'rgb(250,204,21)';
const AIP_BLUE       = 'rgb(96,165,250)';

/* =====================================================================
   RESULT DATA — recast for the advisor's book
   ===================================================================== */

const AIP_OVERDUE_CLIENTS = [
  { name:'Margaret Holloway', firm:'Holloway Family Trust', city:'Greenwich, CT', tier:'Tier 1', init:'MH', bg:'rgb(96,165,250)',  last:'127 days', aum:'$18.4M', priority:'High',   pDot:AIP_RED,   flag:'No spring review · top-decile AUM' },
  { name:'David Young',       firm:'Young Holdings LLC',    city:'Austin, TX',    tier:'Tier 1', init:'DY', bg:'rgb(52,211,153)',  last:'47 days',  aum:'$14.2M', priority:'High',   pDot:AIP_RED,   flag:'Drift +6.4% · review booked tomorrow' },
  { name:'The Chen Family',   firm:'Chen Family Office',    city:'San Jose, CA',  tier:'Tier 1', init:'CF', bg:'rgb(167,139,250)', last:'104 days', aum:'$9.1M',  priority:'High',   pDot:AIP_RED,   flag:'Liquidity event closing in ~30 days' },
  { name:'Robert Patel',      firm:'Patel & Co.',           city:'Chicago, IL',   tier:'Tier 2', init:'RP', bg:'rgb(251,146,60)',  last:'168 days', aum:'$3.8M',  priority:'Medium', pDot:AIP_AMBER, flag:'No reply to last 2 outreach emails' },
  { name:'Sarah Whitman',     firm:'Whitman Revocable',     city:'Denver, CO',    tier:'Tier 2', init:'SW', bg:'rgb(45,212,191)',  last:'142 days', aum:'$2.6M',  priority:'Medium', pDot:AIP_AMBER, flag:'Birthday last week — no card sent' },
];

const AIP_OVERDUE_INSIGHTS = [
  { icon:'triangle-exclamation', color:AIP_RED,     title:'$42.3M of AUM is overdue for a touchpoint', body:'Five relationships have slipped past their tier cadence. Three are Tier 1 — the segment most sensitive to engagement gaps.' },
  { icon:'bullseye',            color:AIP_BLUE,    title:'Margaret Holloway is the highest priority', body:'127 days since last contact, no spring review on the books, and the largest book of the group at $18.4M. A single call resets the relationship clock.' },
  { icon:'clock-3',             color:'rgb(251,146,60)', title:'Two windows are time-boxed', body:'The Chen Family has a liquidity event closing in ~30 days, and David Young\'s drift review is already on tomorrow\'s calendar.' },
];

const AIP_DRIFT_ROWS = [
  { name:'David Young',       init:'DY', bg:'rgb(52,211,153)',  sleeve:'Equity', target:'60%', current:'66.4%', drift:'+6.4%', dDot:AIP_RED,   note:'Tech overweight after Q1 run-up' },
  { name:'Margaret Holloway', init:'MH', bg:'rgb(96,165,250)',  sleeve:'Equity', target:'55%', current:'61.2%', drift:'+6.2%', dDot:AIP_RED,   note:'No rebalance since last August' },
  { name:'The Okafor Trust',  init:'OT', bg:'rgb(167,139,250)', sleeve:'Fixed Income', target:'35%', current:'28.5%', drift:'-6.5%', dDot:AIP_AMBER, note:'Bond ladder rolled off, not replaced' },
  { name:'Linda Park',        init:'LP', bg:'rgb(251,146,60)',  sleeve:'Equity', target:'50%', current:'55.4%', drift:'+5.4%', dDot:AIP_AMBER, note:'Concentrated single-stock position' },
];

const AIP_DRIFT_INSIGHTS = [
  { icon:'arrow-trend-up', color:AIP_RED,  title:'4 portfolios are outside their target band', body:'All four breach the ±5% rebalance trigger in your IPS. Combined, $34.7M is currently off-model.' },
  { icon:'shield-halved',  color:AIP_BLUE, title:'Two are concentration-driven', body:'David Young and Linda Park drifted on single names. A trim + diversify motion addresses drift and risk together.' },
  { icon:'percent',        color:'rgb(167,139,250)', title:'Tax-aware path available', body:'Three of the four hold offsetting losses in taxable sleeves — rebalancing now can be paired with tax-loss harvesting.' },
];

const AIP_CASH_ROWS = [
  { name:'The Chen Family',   init:'CF', bg:'rgb(167,139,250)', cash:'$1.9M', pct:'21%', idle:'62 days', note:'Proceeds from Q1 property sale' },
  { name:'Margaret Holloway', init:'MH', bg:'rgb(96,165,250)',  cash:'$1.2M', pct:'7%',  idle:'48 days', note:'Above 5% cash policy target' },
  { name:'Robert Patel',      init:'RP', bg:'rgb(251,146,60)',  cash:'$640K', pct:'17%', idle:'91 days', note:'RMD distribution not redeployed' },
];

const AIP_CASH_INSIGHTS = [
  { icon:'droplet',        color:AIP_BLUE,  title:'$3.7M sitting idle across 3 clients', body:'All three carry cash well above their stated policy targets, dragging on expected return at current short-rate levels.' },
  { icon:'clock-3',        color:'rgb(251,146,60)', title:'The Chen Family cash is the oldest', body:'$1.9M has been uninvested for 62 days. A staged entry over the next two reviews limits timing risk.' },
];

/* =====================================================================
   SHARED PIECES
   ===================================================================== */

function AipAvatar({ init, bg, size = 32 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:7, background:bg, flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'Inter', fontSize:size*0.34, fontWeight:700, color:'rgb(17,24,39)',
    }}>{init}</div>
  );
}

function AipInsight({ insight }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'11px 0' }}>
      <div style={{
        width:30, height:30, borderRadius:7, flexShrink:0,
        background:`color-mix(in oklab, ${insight.color} 14%, transparent)`,
        border:`1px solid color-mix(in oklab, ${insight.color} 32%, transparent)`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <i className={`fa-solid fa-${insight.icon}`} style={{ fontSize:12, color:insight.color }} />
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AIP_INK, marginBottom:3 }}>{insight.title}</div>
        <div style={{ fontFamily:'Inter', fontSize:12, color:AIP_MUTED, lineHeight:1.55 }}>{insight.body}</div>
      </div>
    </div>
  );
}

function AipAction({ icon, label, sub, onClick, primary }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        flex:1, minWidth:180, display:'flex', alignItems:'center', gap:12,
        padding:'12px 14px', borderRadius:10, cursor:'pointer', textAlign:'left',
        fontFamily:'Inter', transition:'background .14s ease, border-color .14s ease, transform .14s ease',
        transform: hover ? 'translateY(-1px)' : 'none',
        background: primary ? (hover ? 'rgba(5,122,85,0.20)' : 'rgba(5,122,85,0.13)') : (hover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)'),
        border: primary ? `1px solid ${AIP_BRAND_RING}` : `1px solid ${AIP_LINE}`,
      }}>
      <div style={{
        width:32, height:32, borderRadius:8, flexShrink:0,
        background: primary ? 'rgba(5,122,85,0.20)' : 'rgba(255,255,255,0.04)',
        border: primary ? '1px solid rgba(5,122,85,0.35)' : `1px solid ${AIP_LINE}`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <i className={`fa-solid fa-${icon}`} style={{ fontSize:13, color: primary ? AIP_BRAND_LT : AIP_INK_2 }} />
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:500, color:AIP_INK, marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:11, color:AIP_MUTED }}>{sub}</div>
      </div>
    </button>
  );
}

function AipPanelShell({ prompt, summary, children }) {
  return (
    <div style={{
      width:'100%', maxWidth:920,
      background:'rgba(255,255,255,0.025)', border:`1px solid ${AIP_LINE}`,
      borderRadius:14, padding:'20px 22px',
      display:'flex', flexDirection:'column', gap:18,
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{
          width:30, height:30, borderRadius:8, flexShrink:0,
          background:'linear-gradient(135deg, rgba(5,122,85,0.35), rgba(5,122,85,0.10))',
          border:`1px solid ${AIP_BRAND_RING}`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize:13, color:AIP_BRAND_LT }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:10.5, color:AIP_DIM, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.07em' }}>You asked</div>
          <div style={{ fontFamily:'Inter', fontSize:14, color:AIP_INK_2, lineHeight:1.4 }}>{prompt}</div>
        </div>
      </div>
      {summary && (
        <div style={{ fontFamily:'Inter', fontSize:13.5, color:AIP_INK_2, lineHeight:1.6 }}>{summary}</div>
      )}
      {children}
    </div>
  );
}

function AipSectionLabel({ children }) {
  return (
    <div style={{
      fontFamily:'Inter', fontSize:10.5, fontWeight:600, color:AIP_DIM,
      textTransform:'uppercase', letterSpacing:'0.08em',
      paddingBottom:8, borderBottom:`1px solid ${AIP_LINE}`, marginBottom:4,
    }}>{children}</div>
  );
}

/* =====================================================================
   RESULT PANELS
   ===================================================================== */

function AipClientRow({ children, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div role="button" tabIndex={0} onClick={onClick}
      onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onClick&&onClick(); } }}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background: hover ? 'rgba(5,122,85,0.07)' : 'rgba(255,255,255,0.02)',
        border: hover ? `1px solid ${AIP_BRAND_RING}` : `1px solid ${AIP_LINE}`,
        borderRadius:10, cursor:'pointer',
        transition:'background .14s ease, border-color .14s ease, transform .14s ease',
        transform: hover ? 'translateY(-1px)' : 'none',
      }}>{children(hover)}</div>
  );
}

function OverduePanel({ prompt, onClient }) {
  return (
    <AipPanelShell prompt={prompt}
      summary={<>Weighing days since last contact against tier cadence and book size, here are the <b style={{ color:AIP_INK }}>5 relationships most overdue for a check-in</b> — about <b style={{ color:AIP_INK }}>$42.3M</b> in AUM.</>}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {AIP_OVERDUE_CLIENTS.map((c, i) => (
          <AipClientRow key={c.name} onClick={()=>onClient(c.name)}>
            {(hover) => (
              <div style={{ display:'grid', gridTemplateColumns:'22px 34px 1fr auto auto 14px', alignItems:'center', gap:13, padding:'11px 14px' }}>
                <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, color:AIP_DIM, textAlign:'center' }}>{i+1}</div>
                <AipAvatar init={c.init} bg={c.bg} />
                <div style={{ minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AIP_INK }}>{c.name}</span>
                    <span style={{ fontFamily:'Inter', fontSize:9.5, fontWeight:500, color:AIP_MUTED, padding:'1px 5px', border:`1px solid ${AIP_LINE}`, borderRadius:3 }}>{c.tier}</span>
                  </div>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:AIP_MUTED }}>
                    Last contact <span style={{ color:AIP_RED }}>{c.last}</span>
                    <span style={{ color:AIP_DIM, margin:'0 6px' }}>·</span>{c.flag}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Inter', fontSize:9.5, color:AIP_DIM, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>AUM</div>
                  <div style={{ fontFamily:'Inter Display, Inter', fontSize:14, fontWeight:500, color:AIP_INK }}>{c.aum}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:6 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:c.pDot }} />
                  <span style={{ fontFamily:'Inter', fontSize:11, color:AIP_INK_2 }}>{c.priority}</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color: hover ? AIP_BRAND_LT : AIP_DIM, transform: hover ? 'translateX(2px)' : 'none', transition:'transform .14s ease, color .14s ease' }} />
              </div>
            )}
          </AipClientRow>
        ))}
      </div>
      <div>
        <AipSectionLabel>Key insights</AipSectionLabel>
        {AIP_OVERDUE_INSIGHTS.map((ins, i) => <AipInsight key={i} insight={ins} />)}
      </div>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:11.5, color:AIP_MUTED, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
          <i className="fa-solid fa-arrow-right" style={{ fontSize:11, color:AIP_BRAND_LT }} />
          <span>Recommended next steps for <b style={{ color:AIP_INK }}>Margaret Holloway</b> (highest priority)</span>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <AipAction icon="calendar" label="Schedule review" sub="60 min · this week" onClick={()=>onClient('Margaret Holloway')} />
          <AipAction icon="arrow-up-right-from-square" label="Open client profile" sub="Holloway Family Trust" onClick={()=>onClient('Margaret Holloway')} />
          <AipAction icon="envelope" label="Draft check-in email" sub="Warm, personal tone" primary onClick={()=>onClient('Margaret Holloway')} />
        </div>
      </div>
    </AipPanelShell>
  );
}

function BriefPanel({ prompt, onClient, onDeck }) {
  const bullets = [
    { label:'Portfolio drift', value:'+6.4% over equity target — recommend a rebalance back to the 60/40 IPS band.' },
    { label:'Open follow-ups', value:'529 plan for the grandkids · trust document update still pending from Q4.' },
    { label:'Life event',      value:'Daughter starts college Fall 2026 — revisit the education funding plan.' },
    { label:'Market context',  value:'His sector is down 3.1% since you last met. Lead with reassurance, then the rebalance.' },
  ];
  return (
    <AipPanelShell prompt={prompt}
      summary={<>Here's the brief for <b style={{ color:AIP_INK }}>David Young</b> — Tier 1 · $14.2M · advisor since 2018. Next meeting is <b style={{ color:AIP_INK }}>tomorrow at 10:30am</b>, in-office, 60 minutes.</>}>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'130px 1fr', gap:12, padding:'10px 0', borderTop: i===0 ? 'none' : `1px dashed ${AIP_LINE}` }}>
            <div style={{ fontFamily:'Inter', fontSize:11.5, color:AIP_MUTED, fontWeight:500 }}>{b.label}</div>
            <div style={{ fontFamily:'Inter', fontSize:12.5, color:AIP_INK_2, lineHeight:1.5 }}>{b.value}</div>
          </div>
        ))}
      </div>
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
        background:'rgba(5,122,85,0.07)', border:`1px solid ${AIP_BRAND_RING}`, borderRadius:10,
      }}>
        <div style={{ width:34, height:34, borderRadius:8, background:'rgba(5,122,85,0.18)', border:'1px solid rgba(5,122,85,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <i className="fa-solid fa-file-lines" style={{ fontSize:14, color:AIP_BRAND_LT }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AIP_INK }}>Rebalance deck is ready</div>
          <div style={{ fontFamily:'Inter', fontSize:11.5, color:AIP_MUTED, marginTop:1 }}>6 slides · rebalance recommendation + 529 plan options</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <AipAction icon="file-lines" label="Open rebalance deck" sub="David Young · 6 slides" primary onClick={onDeck} />
        <AipAction icon="arrow-up-right-from-square" label="Open client profile" sub="Young Holdings LLC" onClick={()=>onClient('David Young')} />
        <AipAction icon="envelope" label="Send agenda by email" sub="Confirm tomorrow 10:30am" onClick={()=>onClient('David Young')} />
      </div>
    </AipPanelShell>
  );
}

function DriftPanel({ prompt, onClient }) {
  return (
    <AipPanelShell prompt={prompt}
      summary={<>Comparing live allocations against each client's IPS target, <b style={{ color:AIP_INK }}>4 portfolios</b> have drifted past the ±5% rebalance trigger this quarter — <b style={{ color:AIP_INK }}>$34.7M</b> off-model.</>}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {AIP_DRIFT_ROWS.map((r) => (
          <AipClientRow key={r.name} onClick={()=>onClient(r.name)}>
            {(hover) => (
              <div style={{ display:'grid', gridTemplateColumns:'34px 1fr auto auto 14px', alignItems:'center', gap:13, padding:'11px 14px' }}>
                <AipAvatar init={r.init} bg={r.bg} />
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AIP_INK, marginBottom:2 }}>{r.name}</div>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:AIP_MUTED }}>{r.sleeve} · target {r.target} → now {r.current}<span style={{ color:AIP_DIM, margin:'0 6px' }}>·</span>{r.note}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Inter', fontSize:9.5, color:AIP_DIM, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Drift</div>
                  <div style={{ fontFamily:'Inter Display, Inter', fontSize:14, fontWeight:600, color:r.dDot }}>{r.drift}</div>
                </div>
                <span style={{ width:8, height:8, borderRadius:'50%', background:r.dDot }} />
                <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color: hover ? AIP_BRAND_LT : AIP_DIM, transform: hover ? 'translateX(2px)' : 'none', transition:'transform .14s ease, color .14s ease' }} />
              </div>
            )}
          </AipClientRow>
        ))}
      </div>
      <div>
        <AipSectionLabel>Key insights</AipSectionLabel>
        {AIP_DRIFT_INSIGHTS.map((ins, i) => <AipInsight key={i} insight={ins} />)}
      </div>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:11.5, color:AIP_MUTED, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
          <i className="fa-solid fa-arrow-right" style={{ fontSize:11, color:AIP_BRAND_LT }} />
          <span>Recommended next steps for <b style={{ color:AIP_INK }}>David Young</b> (largest drift)</span>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <AipAction icon="file-lines" label="Build rebalance proposal" sub="Trim equity → IPS band" primary onClick={()=>onClient('David Young')} />
          <AipAction icon="arrow-up-right-from-square" label="Open client profile" sub="Review full allocation" onClick={()=>onClient('David Young')} />
          <AipAction icon="percent" label="Pair with tax-loss harvest" sub="3 of 4 hold offsets" onClick={()=>onClient('David Young')} />
        </div>
      </div>
    </AipPanelShell>
  );
}

function CashPanel({ prompt, onClient }) {
  return (
    <AipPanelShell prompt={prompt}
      summary={<>Across your book, <b style={{ color:AIP_INK }}>3 clients</b> are holding cash well above policy — about <b style={{ color:AIP_INK }}>$3.7M</b> idle and ready to deploy.</>}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {AIP_CASH_ROWS.map((r) => (
          <AipClientRow key={r.name} onClick={()=>onClient(r.name)}>
            {(hover) => (
              <div style={{ display:'grid', gridTemplateColumns:'34px 1fr auto auto 14px', alignItems:'center', gap:13, padding:'11px 14px' }}>
                <AipAvatar init={r.init} bg={r.bg} />
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AIP_INK, marginBottom:2 }}>{r.name}</div>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:AIP_MUTED }}>{r.pct} of portfolio · idle {r.idle}<span style={{ color:AIP_DIM, margin:'0 6px' }}>·</span>{r.note}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Inter', fontSize:9.5, color:AIP_DIM, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Cash</div>
                  <div style={{ fontFamily:'Inter Display, Inter', fontSize:14, fontWeight:500, color:AIP_BLUE }}>{r.cash}</div>
                </div>
                <span style={{ width:0 }} />
                <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color: hover ? AIP_BRAND_LT : AIP_DIM, transform: hover ? 'translateX(2px)' : 'none', transition:'transform .14s ease, color .14s ease' }} />
              </div>
            )}
          </AipClientRow>
        ))}
      </div>
      <div>
        <AipSectionLabel>Key insights</AipSectionLabel>
        {AIP_CASH_INSIGHTS.map((ins, i) => <AipInsight key={i} insight={ins} />)}
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <AipAction icon="file-lines" label="Draft deployment plans" sub="Staged entry · 3 clients" primary onClick={()=>onClient('The Chen Family')} />
        <AipAction icon="arrow-up-right-from-square" label="Open Chen Family" sub="Oldest idle balance" onClick={()=>onClient('The Chen Family')} />
      </div>
    </AipPanelShell>
  );
}

function InsightPanel({ prompt, onClient }) {
  const rows = (window.FIELD_INSIGHTS || []).slice(0, 4);
  const build = (id) => window.dispatchEvent(new CustomEvent('insight:open', { detail:{ id } }));
  return (
    <AipPanelShell prompt={prompt}
      summary={<>Connected providers have pushed <b style={{ color:AIP_INK }}>{(window.FIELD_INSIGHTS||[]).length} insights</b> into your book. These four rank highest on suitability fit and estimated value.</>}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {rows.map(r => (
          <AipClientRow key={r.id} onClick={()=>build(r.id)}>
            {(hover) => (
              <div style={{ display:'grid', gridTemplateColumns:'34px 1fr auto auto 14px', alignItems:'center', gap:13, padding:'11px 14px' }}>
                <AipAvatar init={r.initials} bg={AIP_BRAND_LT} />
                <div style={{ minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AIP_INK }}>{r.client}</span>
                    <span style={{ fontFamily:'Inter', fontSize:9.5, color:AIP_MUTED, padding:'1px 5px', border:`1px solid ${AIP_LINE}`, borderRadius:3 }}>{r.provider}</span>
                  </div>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:AIP_MUTED }}>
                    {r.signal}<span style={{ color:AIP_DIM, margin:'0 6px' }}>·</span>{r.product} · {r.term}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Inter', fontSize:9.5, color:AIP_DIM, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Est. value</div>
                  <div style={{ fontFamily:'Inter Display, Inter', fontSize:14, fontWeight:500, color:AIP_INK }}>{r.est}</div>
                </div>
                <span style={{ fontFamily:'Inter', fontSize:11, color:AIP_INK_2 }}>Fit {r.fit}</span>
                <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color: hover ? AIP_BRAND_LT : AIP_DIM, transform: hover ? 'translateX(2px)' : 'none', transition:'transform .14s ease, color .14s ease' }} />
              </div>
            )}
          </AipClientRow>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <AipAction icon="file-lines" label="Build the top proposal" sub={rows[0] ? `${rows[0].client} · ${rows[0].product}` : ''} primary onClick={()=>rows[0] && build(rows[0].id)} />
        <AipAction icon="lightbulb" label="Open the insights page" sub="Filter by provider or type" onClick={()=>window.dispatchEvent(new CustomEvent('insights:scan'))} />
      </div>
    </AipPanelShell>
  );
}

/* =====================================================================
   FLOW REGISTRY + routing
   ===================================================================== */

const AIP_FLOWS = {
  overdue: {
    tools: [
      { tool:'crm.scan',         label:'Scanning client contact logs',    detail:'247 clients · 1,840 logged interactions' },
      { tool:'calendar.history', label:'Cross-referencing your calendar', detail:'Office, video, phone & dinner events' },
      { tool:'rules.apply',      label:'Applying tier cadence rules',     detail:'T1 90d · T2 120d · T3 180d', long:true },
    ],
    Panel: OverduePanel,
  },
  brief: {
    tools: [
      { tool:'crm.lookup',        label:'Looking up David Young',        detail:'Tier 1 · $14.2M · advisor since 2018' },
      { tool:'portfolio.snapshot',label:'Loading current portfolio',     detail:'7 accounts · drift +6.4% from target' },
      { tool:'notes.fetch',       label:'Reading prior meeting notes',   detail:'3 open follow-ups · "529 for grandkids"' },
      { tool:'deck.generate',     label:'Generating rebalance deck',     detail:'6 slides · branded · ~10 sec', long:true },
    ],
    Panel: BriefPanel,
  },
  drift: {
    tools: [
      { tool:'portfolio.scan',  label:'Reading live allocations',       detail:'Across all managed households' },
      { tool:'ips.compare',     label:'Comparing against IPS targets',  detail:'±5% rebalance trigger band' },
      { tool:'rank.drift',      label:'Ranking by absolute drift',      detail:'Weighted by sleeve & book size', long:true },
    ],
    Panel: DriftPanel,
  },
  insight: {
    tools: [
      { tool:'providers.sync', label:'Syncing connected provider feeds', detail:'Halo · BlackRock · PIMCO · Blackstone · Nuveen' },
      { tool:'book.match',     label:'Matching insights to households',  detail:'Held and held-away positions' },
      { tool:'rank.fit',       label:'Ranking by suitability fit',       detail:'Weighted by scope & estimated value', long:true },
    ],
    Panel: InsightPanel,
  },
  cash: {
    tools: [
      { tool:'positions.cash',  label:'Pulling cash balances',          detail:'Sweep + money-market sleeves' },
      { tool:'policy.compare',  label:'Comparing to cash policy',       detail:'Per-household target weights' },
      { tool:'rank.idle',       label:'Ranking by idle days × size',    detail:'Net of near-term liabilities', long:true },
    ],
    Panel: CashPanel,
  },
};

function aipPickFlow(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('david young') || t.includes('brief') || t.includes('prep') || (t.includes('meeting') && !t.includes('haven'))) return 'brief';
  if (t.includes('drift') || t.includes('rebalance') || t.includes('5%') || t.includes('allocation') || t.includes('off-model')) return 'drift';
  if (t.includes('insight') || t.includes('protection') || t.includes('proposal') || t.includes('provider') || t.includes('halo') || t.includes('concentrat')) return 'insight';
  if (t.includes('cash') || t.includes('deploy') || t.includes('idle') || t.includes('invest')) return 'cash';
  return 'overdue';
}

/* =====================================================================
   STREAMING THREAD — reveals tool chips, then the result panel
   ===================================================================== */

function AipToolChip({ step, done }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10, padding:'8px 11px', borderRadius:9,
      background: done ? 'rgba(255,255,255,0.025)' : 'rgba(5,122,85,0.08)',
      border:`1px solid ${done ? AIP_LINE : AIP_BRAND_RING}`,
      transition:'background 200ms ease, border-color 200ms ease',
    }}>
      <div style={{
        width:18, height:18, borderRadius:9999, flexShrink:0,
        background: done ? 'rgba(5,122,85,0.18)' : 'transparent',
        border: done ? `1px solid ${AIP_BRAND}` : `1.5px solid ${AIP_BRAND_RING}`,
        display:'flex', alignItems:'center', justifyContent:'center', color:AIP_BRAND,
      }}>
        {done ? <i className="fa-solid fa-check" style={{ fontSize:9 }} /> : <i className="fa-solid fa-spinner fa-spin" style={{ fontSize:9 }} />}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:500, color:AIP_INK, lineHeight:1.3 }}>{step.label}</div>
        <div style={{ fontFamily:'Geist Mono, ui-monospace, monospace', fontSize:10.5, color:AIP_MUTED, marginTop:2, lineHeight:1.3 }}>
          <span style={{ color:AIP_BRAND_LT }}>{step.tool}</span>
          <span style={{ color:AIP_DIM, margin:'0 6px' }}>·</span>{step.detail}
        </div>
      </div>
    </div>
  );
}

function AipDot({ delay }) {
  return <span style={{ width:5, height:5, borderRadius:9999, background:AIP_BRAND_LT, display:'inline-block', opacity:0.3, animation:`aipPulse 1.1s ${delay}ms ease-in-out infinite` }} />;
}

function AipThread({ entry, onClient, onDeck }) {
  const flow = AIP_FLOWS[entry.flow] || AIP_FLOWS.overdue;
  const tools = flow.tools;
  const [revealed, setRevealed] = React.useState(0);
  const [doneMap, setDoneMap]   = React.useState({});
  const [showResult, setShowResult] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setRevealed(0); setDoneMap({}); setShowResult(false);
    let i = 0;
    const next = () => {
      if (cancelled) return;
      if (i >= tools.length) { setTimeout(() => { if (!cancelled) setShowResult(true); }, 350); return; }
      setRevealed(i + 1);
      const dur = tools[i].long ? 1300 : 800;
      const myIdx = i;
      setTimeout(() => { if (!cancelled) setDoneMap(p => ({ ...p, [myIdx]: true })); }, dur - 200);
      i++;
      setTimeout(next, dur);
    };
    const t = setTimeout(next, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [entry.id]);

  const Panel = flow.Panel;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ alignSelf:'flex-start', maxWidth:'92%' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {tools.slice(0, revealed).map((s, i) => (
            <div key={i} className="aip-step"><AipToolChip step={s} done={!!doneMap[i]} /></div>
          ))}
          {!showResult && revealed < tools.length && (
            <div style={{ display:'inline-flex', gap:3, padding:'2px 2px' }}>
              <AipDot delay={0} /><AipDot delay={150} /><AipDot delay={300} />
            </div>
          )}
        </div>
      </div>
      {showResult && (
        <div className="aip-step">
          <Panel prompt={entry.prompt} onClient={onClient} onDeck={onDeck} />
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   HISTORY RAIL (in-flow, collapsible)
   ===================================================================== */

function fmtWhen(d) {
  if (!d) return '';
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString();
}

function AipHistoryRail({ items, activeText, onPick, onClose, onClear }) {
  return (
    <aside style={{
      width:268, flexShrink:0, borderRight:`1px solid ${AIP_LINE}`,
      padding:'18px 14px 14px', display:'flex', flexDirection:'column', gap:8,
      minHeight:0,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, padding:'2px 4px 6px' }}>
        <i className="fa-solid fa-clock-3" style={{ fontSize:11, color:AIP_MUTED }} />
        <div style={{ fontFamily:'Inter', fontSize:11, fontWeight:600, color:AIP_INK_2, textTransform:'uppercase', letterSpacing:'0.06em' }}>Recent chats</div>
        <div style={{ flex:1 }} />
        <button onClick={onClose} title="Hide" style={{ width:22, height:22, borderRadius:5, border:'none', background:'transparent', color:AIP_MUTED, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-xmark" style={{ fontSize:11 }} />
        </button>
      </div>
      <div className="cd-sidebar-scroll" style={{ flex:1, minHeight:0, overflowY:'auto', display:'flex', flexDirection:'column', gap:2, paddingRight:2 }}>
        {items.length === 0 && (
          <div style={{ padding:'24px 12px', textAlign:'center', fontFamily:'Inter', fontSize:11.5, color:AIP_DIM }}>No chats yet.</div>
        )}
        {items.map((it, i) => {
          const isActive = it.text === activeText;
          return (
            <button key={i} onClick={()=>onPick(it.text)} style={{
              textAlign:'left', cursor:'pointer', display:'flex', flexDirection:'column', gap:3,
              padding:'9px 10px', borderRadius:8, fontFamily:'Inter',
              background: isActive ? 'rgba(5,122,85,0.10)' : 'transparent',
              border: isActive ? `1px solid ${AIP_BRAND_RING}` : '1px solid transparent',
            }}
            onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
            onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent'; }}>
              <span style={{ fontSize:12.5, color:AIP_INK_2, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.text}</span>
              <span style={{ fontSize:10.5, color:AIP_DIM }}>{fmtWhen(it.when)}</span>
            </button>
          );
        })}
      </div>
      {items.length > 0 && (
        <button onClick={onClear} style={{ background:'transparent', border:'none', cursor:'pointer', color:AIP_MUTED, fontFamily:'Inter', fontSize:11, padding:'6px 4px 2px', textAlign:'left' }}>Clear history</button>
      )}
    </aside>
  );
}

function AipPill({ children, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      height:28, padding:'0 12px', borderRadius:9999, cursor:'pointer',
      background: active ? 'rgba(5,122,85,0.16)' : 'rgba(255,255,255,0.04)',
      border: active ? `1px solid ${AIP_BRAND_RING}` : `1px solid ${AIP_LINE}`,
      color: active ? AIP_BRAND_LT : AIP_INK_2,
      fontFamily:'Inter', fontSize:11.5, fontWeight:500,
      display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap',
    }}>{children}</button>
  );
}

/* =====================================================================
   MAIN PAGE
   ===================================================================== */

const AIP_SUGGESTIONS = [];

function AdvisorAIPage({ onOpenClient, onOpenDeck, onNav }) {
  const [active, setActive]   = React.useState(false);
  const [prompt, setPrompt]   = React.useState('');
  const [thread, setThread]   = React.useState([]);
  const [msg, setMsg]         = React.useState('');
  const [chatMsg, setChatMsg] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [deckUrl, setDeckUrl] = React.useState(null); // inline deck overlay
  const scrollerRef = React.useRef();

  // Open the deck inside the app (a new tab loses the preview's auth token).
  const openDeck = () => setDeckUrl('advisor/Rebalance%20Deck%20-%20David%20Young.html');

  const submit = (text) => {
    const t = (text || '').trim();
    if (!t) return;
    setHistory(prev => (prev[0] && prev[0].text === t) ? prev : [{ text:t, when:new Date() }, ...prev].slice(0, 20));
    setPrompt(t);
    setThread(prev => [...prev, { id:'aip-'+Date.now(), prompt:t, flow:aipPickFlow(t) }]);
    setActive(true);
    setMsg(''); setChatMsg('');
  };

  const startNew = () => { setActive(false); setThread([]); setPrompt(''); setMsg(''); setChatMsg(''); setHistoryOpen(false); };

  const handleClient = (name) => { if (onOpenClient) onOpenClient(name); };

  const sentinelRef = React.useRef(null);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    // Neither scroll events nor IntersectionObserver fire reliably in every
    // host, but scrollTop always reads true — poll it on a rAF loop and only
    // set state when the boolean flips.
    let raf = 0, last = null;
    const tick = () => {
      const y = window.scrollY || (document.scrollingElement || document.documentElement).scrollTop || 0;
      const next = y > 190;
      if (next !== last) { last = next; setScrolled(next); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    const onAsk = (e) => { const t = (e.detail || {}).text; if (t) submit(t); };
    window.addEventListener('ai:ask', onAsk);
    return () => window.removeEventListener('ai:ask', onAsk);
  }, []);

  React.useEffect(() => {
    if (!scrollerRef.current) return;
    const el = scrollerRef.current;
    el.scrollTop = el.scrollHeight;
    const id = setInterval(() => { if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight; }, 350);
    setTimeout(() => clearInterval(id), 9000);
    return () => clearInterval(id);
  }, [thread.length]);

  /* ---------- Greeting (empty) state ---------- */
  if (!active) {
    return (
      <main style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 40px 96px', gap:28, background:'transparent' }}>
        <style>{aipKeyframes}</style>
        <div style={{
          position:'sticky', top:56, zIndex:20, width:'auto', maxWidth:'none', alignSelf:'stretch',
          display:'flex', alignItems:'center', gap:16, padding:'10px 16px',
          background:'rgba(16,25,40,0.86)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
          borderBottom:`1px solid ${AIP_LINE}`, margin:'-48px -40px -57px', height:57, boxSizing:'border-box',
          opacity: scrolled ? 1 : 0, pointerEvents: scrolled ? 'auto' : 'none',
          transform: scrolled ? 'translateY(0)' : 'translateY(-6px)',
          transition:'opacity 180ms ease, transform 180ms ease',
        }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:9, flexShrink:0 }}>
            <i className="fa-solid fa-house" style={{ fontSize:12, color:AIP_BRAND_LT }} />
            <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:AIP_INK }}>Your day</span>
          </div>
          <div style={{ flex:1, display:'flex', justifyContent:'center', minWidth:0 }}>
            <div style={{
              display:'flex', alignItems:'center', gap:10, width:'100%', maxWidth:470,
              padding:'0 8px 0 12px', height:34, borderRadius:9999,
              background:'rgba(255,255,255,0.05)', border:`1px solid ${AIP_LINE}`,
            }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize:12, color:AIP_BRAND_LT, flexShrink:0 }} />
              <input value={msg} onChange={e=>setMsg(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); submit(msg); } }}
                placeholder="Ask about your book…"
                style={{ flex:1, minWidth:0, background:'transparent', border:'none', color:AIP_INK, fontFamily:'Inter', fontSize:12.5, outline:'none' }} />
              <button onClick={()=>submit(msg)} title="Send" style={{ width:24, height:24, borderRadius:9999, border:'none', background: msg.trim() ? AIP_BRAND : 'rgba(5,122,85,0.3)', color:'#fff', cursor: msg.trim() ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className="fa-solid fa-arrow-up" style={{ fontSize:10 }} />
              </button>
            </div>
          </div>
          <button onClick={()=>{ const s=document.scrollingElement||document.documentElement; s.scrollTop=0; window.scrollTo({ top:0, behavior:'smooth' }); }} style={{
            height:30, padding:'0 12px', borderRadius:9999, cursor:'pointer', flexShrink:0,
            background:'rgba(255,255,255,0.04)', border:`1px solid ${AIP_LINE}`, color:AIP_INK_2,
            fontFamily:'Inter', fontSize:12, display:'inline-flex', alignItems:'center', gap:7,
          }}>
            <i className="fa-solid fa-arrow-up" style={{ fontSize:10 }} /> Top
          </button>
        </div>
        <div ref={sentinelRef} style={{ height:1, flexShrink:0 }}></div>
        <div style={{ minHeight:'calc(42vh - 250px)' }}></div>
        <div style={{ textAlign:'center' }}>
          <h1 style={{ fontFamily:'Inter Display, Inter', fontWeight:500, fontSize:46, color:AIP_INK, margin:0, letterSpacing:'-0.02em' }}>How can I help, Avery?</h1>
          <p style={{ fontFamily:'Inter', fontSize:14, color:AIP_MUTED, margin:'12px auto 0', lineHeight:1.55, maxWidth:480 }}>
            I can pull from your book, prep meeting materials, flag portfolio drift, and draft client outreach.
          </p>
        </div>

        <div style={{ width:640, maxWidth:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${AIP_LINE}`, borderRadius:14, padding:'16px 16px 12px', display:'flex', flexDirection:'column', gap:12, boxShadow:'0 8px 30px -12px rgba(0,0,0,0.5)' }}>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(msg); } }}
            placeholder="Ask anything about your clients or your book…" rows={2}
            style={{ width:'100%', background:'transparent', border:'none', resize:'none', color:AIP_INK, fontFamily:'Inter', fontSize:14, outline:'none', minHeight:46, lineHeight:1.5 }} />
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button title="Attach a file" style={{ width:30, height:30, borderRadius:7, border:'none', background:'transparent', color:AIP_MUTED, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="fa-solid fa-folder" style={{ fontSize:13 }} />
            </button>
            <div style={{ flex:1 }} />
            <button onClick={()=>submit(msg)} title="Send" style={{ width:32, height:32, borderRadius:8, border:'none', background: msg.trim() ? AIP_BRAND : 'rgba(5,122,85,0.3)', color:'#fff', cursor: msg.trim() ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 150ms ease' }}>
              <i className="fa-solid fa-arrow-up" style={{ fontSize:12 }} />
            </button>
          </div>
        </div>


        <div style={{ width:920, maxWidth:'100%', marginTop:'clamp(24px, 9vh, 90px)' }}>
          {window.AipHomeFeed ? React.createElement(window.AipHomeFeed) : null}
        </div>
      </main>
    );
  }

  /* ---------- Active (conversation) state ---------- */
  return (
    <main style={{ flex:1, display:'flex', minHeight:0, background:'transparent' }}>
      <style>{aipKeyframes}</style>
      {historyOpen && (
        <AipHistoryRail items={history} activeText={prompt}
          onPick={(t)=>submit(t)} onClose={()=>setHistoryOpen(false)} onClear={()=>setHistory([])} />
      )}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        {/* Action bar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 40px 4px' }}>
          {!historyOpen && (
            <AipPill onClick={()=>setHistoryOpen(true)}>
              <i className="fa-solid fa-clock-3" style={{ fontSize:10 }} /> History
              {history.length > 0 && <span style={{ marginLeft:2, padding:'1px 6px', borderRadius:9999, background:'rgba(5,122,85,0.18)', color:AIP_BRAND_LT, fontSize:10, fontWeight:600 }}>{history.length}</span>}
            </AipPill>
          )}
          <div style={{ flex:1 }} />
          <AipPill onClick={startNew} active>
            <i className="fa-solid fa-pen-to-square" style={{ fontSize:10 }} /> New chat
          </AipPill>
        </div>

        {/* Scrollable conversation */}
        <div ref={scrollerRef} className="cd-sidebar-scroll" style={{ flex:1, minHeight:0, overflowY:'auto', padding:'14px 40px 24px' }}>
          <div style={{ width:'100%', maxWidth:920, margin:'0 auto', display:'flex', flexDirection:'column', gap:30 }}>
            {thread.map((entry) => (
              <AipThread key={entry.id} entry={entry} onClient={handleClient} onDeck={openDeck} />
            ))}
          </div>
        </div>

        {/* Sticky follow-up composer */}
        <div style={{ position:'sticky', bottom:0, padding:'12px 40px 18px', borderTop:`1px solid ${AIP_LINE}`, background:'rgba(20,30,46,0.78)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' }}>
          <div style={{ width:'100%', maxWidth:920, margin:'0 auto', background:'rgba(255,255,255,0.04)', border:`1px solid ${AIP_LINE}`, borderRadius:13, padding:'10px 10px 8px', display:'flex', flexDirection:'column', gap:9 }}>
            <textarea value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(chatMsg); } }}
              placeholder="Ask a follow-up…" rows={1}
              style={{ width:'100%', background:'transparent', border:'none', resize:'none', color:AIP_INK, fontFamily:'Inter', fontSize:13.5, outline:'none', minHeight:22, lineHeight:1.45, padding:'2px 4px' }} />
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button title="Attach" style={{ width:28, height:28, borderRadius:7, border:'none', background:'transparent', color:AIP_MUTED, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="fa-solid fa-folder" style={{ fontSize:12 }} />
              </button>
              <div style={{ display:'flex', gap:6, flex:1, flexWrap:'wrap' }}>
                {['Show only Tier 1', 'Draft the emails for me', 'Add these to my calendar'].map((p, i) => (
                  <button key={i} onClick={()=>setChatMsg(p)} style={{ height:24, padding:'0 10px', borderRadius:9999, background:'rgba(255,255,255,0.025)', border:`1px solid ${AIP_LINE}`, color:AIP_MUTED, fontFamily:'Inter', fontSize:11, cursor:'pointer' }}>{p}</button>
                ))}
              </div>
              <button onClick={()=>submit(chatMsg)} title="Send" style={{ width:28, height:28, borderRadius:7, border:'none', background: chatMsg.trim() ? AIP_BRAND : 'rgba(5,122,85,0.3)', color:'#fff', cursor: chatMsg.trim() ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="fa-solid fa-arrow-up" style={{ fontSize:11 }} />
              </button>
            </div>
          </div>
          <div style={{ fontFamily:'Inter', fontSize:10, color:AIP_DIM, marginTop:8, textAlign:'center' }}>
            Field AI can take actions on your behalf · review results before sending to clients
          </div>
        </div>
      </div>

      {/* Inline deck viewer — keeps the preview's auth context */}
      {deckUrl && (
        <div role="dialog" aria-label="Rebalance deck" onClick={()=>setDeckUrl(null)} style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(2,6,12,0.8)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
          display:'flex', flexDirection:'column', padding:28,
        }}>
          <div onClick={(e)=>e.stopPropagation()} style={{
            flex:1, minHeight:0, maxWidth:1280, width:'100%', margin:'0 auto',
            display:'flex', flexDirection:'column', borderRadius:14, overflow:'hidden',
            border:`1px solid ${AIP_LINE}`, boxShadow:'0 40px 100px -20px rgba(0,0,0,0.7)',
            background:'rgb(13,22,38)',
          }}>
            <div style={{
              display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
              borderBottom:`1px solid ${AIP_LINE}`, background:'rgba(255,255,255,0.03)', flexShrink:0,
            }}>
              <i className="fa-solid fa-file-lines" style={{ fontSize:13, color:AIP_BRAND_LT }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:AIP_INK }}>Rebalance deck · David Young</div>
                <div style={{ fontFamily:'Inter', fontSize:11, color:AIP_MUTED, marginTop:1 }}>6 slides · branded recommendation</div>
              </div>
              <a href={deckUrl} target="_blank" rel="noopener" onClick={(e)=>e.stopPropagation()} title="Open in new tab" style={{
                height:30, padding:'0 12px', borderRadius:8, cursor:'pointer', textDecoration:'none',
                border:`1px solid ${AIP_LINE}`, background:'rgba(255,255,255,0.04)', color:AIP_INK,
                display:'inline-flex', alignItems:'center', gap:7, fontFamily:'Inter', fontSize:12,
              }}>
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize:11 }} /> New tab
              </a>
              <button onClick={()=>setDeckUrl(null)} aria-label="Close deck" style={{
                width:30, height:30, borderRadius:8, cursor:'pointer',
                border:`1px solid ${AIP_LINE}`, background:'rgba(255,255,255,0.04)', color:AIP_INK,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <i className="fa-solid fa-xmark" style={{ fontSize:13 }} />
              </button>
            </div>
            <iframe src={deckUrl} title="Rebalance deck" style={{
              flex:1, minHeight:0, width:'100%', border:'none', display:'block',
            }} />
          </div>
        </div>
      )}
    </main>
  );
}

const aipKeyframes = `
  @keyframes aipPulse { 0%,100% { opacity:0.25; transform:translateY(0); } 50% { opacity:1; transform:translateY(-2px); } }
  @keyframes aipStepIn { from { transform:translateY(6px); } to { transform:translateY(0); } }
  .aip-step { animation: aipStepIn 280ms ease; }
  .aip-suggest:hover { background: rgba(5,122,85,0.10) !important; border-color: ${AIP_BRAND_RING} !important; color: ${AIP_INK} !important; }
`;

window.AdvisorAIPage = AdvisorAIPage;
