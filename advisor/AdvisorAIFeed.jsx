/* Halo + AI home feed — one mixed stream under the composer, laid out as
   social-style posts: source header, copy, large media (chart or image),
   then actions. Data comes from the app's existing sources:
   window.FIELD_INSIGHTS, window.WATCHLIST_ROWS, window.JOURNAL_ARTICLES. */

const AF_INK   = 'rgb(249,250,251)';
const AF_INK_2 = 'rgb(229,231,235)';
const AF_MUTED = 'rgb(163,163,163)';
const AF_DIM   = 'rgb(115,115,115)';
const AF_LINE  = 'rgba(75,85,99,0.45)';
const AF_GREEN = 'rgb(128,152,234)';
const AF_BLUE  = 'rgb(96,165,250)';
const AF_VIO   = 'rgb(167,139,250)';
const AF_RED   = 'rgb(248,113,113)';

const AF_KINDS = {
  answer:    { label:'Halo + AI',  icon:'wand-magic-sparkles', color:AF_GREEN },
  insight:   { label:'Insight',   icon:'lightbulb',      color:AF_GREEN },
  watchlist: { label:'Watchlist', icon:'arrow-trend-up', color:AF_BLUE  },
  journal:   { label:'Journal',   icon:'file-lines',     color:AF_VIO   },
  research:  { label:'Manager research', icon:'building-columns', color:AF_INK_2 },
  shared:    { label:'Shared with your practice', icon:'paper-plane', color:AF_GREEN },
};

/* ---- deterministic series so a card looks the same on every render ---- */
function afSeed(str) { let h = 2166136261; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h>>>15), 2246822507); h ^= h>>>13; return ((h>>>0) % 1000) / 1000; }; }
function afWalk(id, n, drift) {
  const rnd = afSeed(id); const out = [100];
  for (let i=1;i<n;i++) out.push(Math.max(58, out[i-1] * (1 + drift + (rnd() - 0.5) * 0.055)));
  return out;
}
function afPath(vals, w, h, pad, inset = 2) {
  const lo = Math.min(...vals), hi = Math.max(...vals), span = (hi - lo) || 1;
  return vals.map((v, i) => {
    const x = inset + (i / (vals.length - 1)) * (w - inset * 2);
    const y = pad + (1 - (v - lo) / span) * (h - pad * 2);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

/* Underlier path with the protection barrier drawn in — watchlist notes. */
function AfNoteChart({ id, prot, unds }) {
  const vals = afWalk(id, 44, 0.004);
  const W = 100, H = 130;
  const barrierPct = parseFloat(prot) || 30;
  return (
    <div style={{ borderRadius:10, overflow:'hidden', border:`1px solid ${AF_LINE}`, background:'rgba(96,165,250,0.05)' }}>
      <div style={{ position:'relative', height:H }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <defs>
          <linearGradient id={`afg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(96,165,250,0.35)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0)" />
          </linearGradient>
        </defs>
        <path d={`${afPath(vals, W, H, 14)} L${W - 2},${H} L2,${H} Z`} fill={`url(#afg-${id})`} stroke="none" />
        <path d={afPath(vals, W, H, 14)} fill="none" stroke={AF_BLUE} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1={H - 18} x2={W} y2={H - 18} stroke={AF_RED} strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" opacity="0.8" />
      </svg>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0 12px', height:30, borderTop:`1px solid ${AF_LINE}`, background:'rgba(9,17,29,0.5)' }}>
        <span style={{ fontFamily:'Inter', fontSize:10.5, color:AF_MUTED, letterSpacing:'0.05em', textTransform:'uppercase' }}>{unds.join(' / ')} · 12-mo path</span>
        <span style={{ flex:1 }} />
        <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:10.5, color:AF_RED }}>
          <span style={{ width:12, height:0, borderTop:`1px dashed ${AF_RED}` }} />
          {`${barrierPct}% protection barrier`}
        </span>
      </div>
    </div>
  );
}

/* Buffer / exposure / cap band — insight cards. */
function AfProtectionChart({ id, term, fit }) {
  const m = (term || '').match(/(\d+)%\s*(buffer|hard|soft)/i);
  const buffer = m ? Math.min(40, parseInt(m[1], 10)) : 15;
  const capM = (term || '').match(/(\d+)%\s*cap/i);
  const cap = capM ? Math.min(40, parseInt(capM[1], 10)) : 18;
  const vals = afWalk(id, 40, -0.002);
  const W = 100, H = 130;
  return (
    <div style={{ borderRadius:10, overflow:'hidden', border:`1px solid ${AF_LINE}`, background:'rgba(35,89,255,0.05)' }}>
      <div style={{ position:'relative', height:H }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          <rect x="0" y={H * 0.66} width={W} height={H * 0.34} fill="rgba(128,152,234,0.14)" />
          <path d={afPath(vals, W, H, 16)} fill="none" stroke={AF_GREEN} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1={H * 0.16} x2={W} y2={H * 0.16} stroke={AF_GREEN} strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" opacity="0.75" />
        </svg>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 12px', height:30, borderTop:`1px solid ${AF_LINE}`, background:'rgba(9,17,29,0.5)' }}>
        <span style={{ fontFamily:'Inter', fontSize:10.5, color:AF_GREEN, whiteSpace:'nowrap' }}>{`${cap}% cap`}</span>
        <span style={{ fontFamily:'Inter', fontSize:10.5, color:AF_INK_2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{`${buffer}% buffer absorbs the first drawdown`}</span>
        <span style={{ flex:1 }} />
        <span style={{ fontFamily:'Inter', fontSize:10.5, color:AF_MUTED, whiteSpace:'nowrap' }}>{`Suitability fit ${fit}`}</span>
      </div>
    </div>
  );
}

/* Answers Halo + AI already ran across the book — these replace the old
   prompt chips. Opening one re-runs the full flow in the conversation view. */
const AF_ANSWERS = [
  { id:'overdue', who:'Halo + AI · Relationship cadence', eyebrow:'Answered for your book',
    title:'5 relationships are overdue for a touchpoint',
    body:'Three are Tier 1 — the segment most sensitive to engagement gaps. Margaret Holloway is the highest priority at 127 days with no spring review booked.',
    stats:[{ k:'AUM affected', v:'$42.3M' }, { k:'Clients', v:'5' }, { k:'Longest gap', v:'168 days' }],
    ask:"Which clients haven't I talked to in a while?" },
  { id:'drift', who:'Halo + AI · IPS monitoring', eyebrow:'Answered for your book',
    title:'4 portfolios drifted past their ±5% rebalance band',
    body:'Two drifted on single names, so a trim-and-diversify motion addresses drift and concentration together. Three hold offsetting losses in taxable sleeves.',
    stats:[{ k:'Off-model', v:'$34.7M' }, { k:'Largest drift', v:'+6.4%' }, { k:'Portfolios', v:'4' }],
    ask:'Which portfolios drifted over 5% this quarter?' },
  { id:'protection', who:'Halo + AI · Provider insights', eyebrow:'Answered for your book',
    title:'Protection ideas are waiting on 3 concentrated positions',
    body:'Buffered and defined-outcome structures cover the concentrated sleeves without forcing a taxable sale. Watson ranks highest on suitability fit.',
    stats:[{ k:'Est. value', v:'$168K' }, { k:'Top fit', v:'94' }, { k:'Providers', v:'5' }],
    ask:'Show me protection ideas for concentrated positions' },
  { id:'brief', who:'Halo + AI · Meeting prep', eyebrow:'Answered for your book',
    title:'Meeting brief is ready for David Young',
    body:'Tomorrow 10:30am, in-office, 60 minutes. Portfolio is +6.4% over equity target and two follow-ups are still open from Q4.',
    stats:[{ k:'Household', v:'$14.2M' }, { k:'Open items', v:'2' }, { k:'Deck', v:'6 slides' }],
    ask:'Prepare a meeting brief for David Young' },
];

function afAnswerItems() {
  return AF_ANSWERS.map(a => ({
    kind:'answer', id:'ans-'+a.id, when:'Today',
    who:a.who, eyebrow:a.eyebrow, initials:'AI',
    title:a.title, body:a.body, stats:a.stats, meta:[],
    action:'See the full answer',
    open:()=>window.dispatchEvent(new CustomEvent('ai:ask', { detail:{ text:a.ask } })),
  }));
}

function AfStats({ stats }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${stats.length}, 1fr)`, border:`1px solid ${AF_LINE}`, borderRadius:10, overflow:'hidden', background:'rgba(35,89,255,0.05)' }}>
      {stats.map((s, i) => (
        <div key={s.k} style={{ padding:'14px 16px', borderLeft: i ? `1px solid ${AF_LINE}` : 'none' }}>
          <div style={{ fontFamily:'Inter', fontSize:10, color:AF_DIM, letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.k}</div>
          <div style={{ fontFamily:'Inter Display, Inter', fontSize:20, fontWeight:500, color:AF_INK, marginTop:4 }}>{s.v}</div>
        </div>
      ))}
    </div>
  );
}

/* Opportunities an asset manager sent to this practice (written by the
   distribution portal). These lead the feed while they are new. */
function afSharedItems() {
  let log = [];
  try { log = JSON.parse(localStorage.getItem('halo.shared') || '[]'); } catch (e) { log = []; }
  return log.slice(0, 3).map(s => ({
    kind:'shared', id:'shr-'+s.id, when:'Today',
    who: s.from || 'Asset manager', eyebrow: s.practice ? 'Sent to ' + s.practice : 'Sent to your practice',
    initials:'BR',
    title:'Three ideas shared with your practice',
    body:'Private credit, an interval fund and an equity SMA \u2014 sized for the households flagged in your book. Terms, liquidity and fee schedules are attached to each.',
    stats:(s.items || []).map(i => ({ k:i.k, v:i.v })),
    meta:(s.items || []).map(i => i.note).filter(Boolean),
    action:'Review the ideas',
    open:()=>window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'insights' } })),
  }));
}

/* Asset-manager house views, surfaced next to the provider insights so the
   feed carries market context and not only firm-generated signals. */
const AF_RESEARCH = [
  { id:'blackrock-fi', who:'BlackRock \u00b7 Fundamental Fixed Income', initials:'BR', eyebrow:'Fixed income',
    title:'Front-end yields still pay for patience',
    body:'The house view favors high-quality duration in the 3\u20135 year part of the curve, where carry is competitive with cash and the roll-down adds return if policy rates fall.',
    stats:[{ k:'Preferred duration', v:'3\u20135 yr' }, { k:'Credit stance', v:'Up in quality' }, { k:'Cash vs. bonds', v:'Bonds' }],
    meta:['Fixed income', 'Rates & duration', 'Published today'] },
  { id:'blackstone', who:'Blackstone \u00b7 Private Wealth Solutions', initials:'BX', eyebrow:'Private markets',
    title:'Private credit spreads still clear the public-bond hurdle',
    body:'Direct lending continues to price above comparable public credit, and the firm\u2019s view is that disciplined underwriting matters more than vintage timing for long-horizon households.',
    stats:[{ k:'Target yield', v:'~9%' }, { k:'Sleeve size', v:'5\u201310%' }, { k:'Horizon', v:'Long' }],
    meta:['Private credit', 'Alternatives', 'Published today'] },
  { id:'blackrock', who:'BlackRock \u00b7 Investment Institute', initials:'BR', eyebrow:'Asset allocation',
    title:'Staying pro-risk, with tighter guardrails',
    body:'Equity exposure stays overweight on earnings breadth, paired with an explicit hedging sleeve \u2014 a fit for the concentrated households already flagged in your book.',
    stats:[{ k:'Equities', v:'Overweight' }, { k:'Duration', v:'Neutral' }, { k:'Hedged sleeve', v:'Add' }],
    meta:['Asset allocation', 'Tactical views', 'Published today'] },
];

function afResearchItems() {
  return AF_RESEARCH.map(r => ({
    kind:'research', id:'res-'+r.id, when:'Today',
    who:r.who, eyebrow:r.eyebrow, initials:r.initials,
    title:r.title, body:r.body, stats:r.stats, meta:r.meta,
    action:'Read the view',
    open:()=>window.dispatchEvent(new CustomEvent('ai:ask', { detail:{ text:`Summarize the latest ${r.who.split(' \u00b7 ')[0]} view for my book` } })),
  }));
}

function afInsightItems() {
  return (window.FIELD_INSIGHTS || []).slice(0, 5).map(r => ({
    kind:'insight', id:'ins-'+r.id, when:'Today',
    who:`${r.provider} → ${r.client}`,
    eyebrow:r.type,
    initials:r.initials,
    title:r.signal,
    body:r.why,
    meta:[r.product, r.term, `Scope ${r.scope}`, `Est. ${r.est}`],
    chart:<AfProtectionChart id={r.id} term={r.term} fit={r.fit} />,
    action:'Build proposal',
    open:()=>window.dispatchEvent(new CustomEvent('insight:open', { detail:{ id:r.id } })),
  }));
}

function afWatchItems() {
  return (window.WATCHLIST_ROWS || []).filter(r => r.tone !== 'mute').slice(0, 5).map(r => ({
    kind:'watchlist', id:'wl-'+r.id, when:r.status,
    who:`Halo · ${r.unds.join(' / ')}`,
    eyebrow:'Note auction',
    initials:r.unds[0].slice(0, 2),
    title:r.post,
    body:null,
    meta:[`${r.yield} yield`, r.term, r.prot, r.feat],
    chart:<AfNoteChart id={r.id} prot={r.prot} unds={r.unds} />,
    action:'View note',
    open:()=>window.dispatchEvent(new CustomEvent('note:open', { detail:{ id:r.id } })),
  }));
}

function afJournalItems() {
  return (window.JOURNAL_ARTICLES || []).slice(0, 5).map(a => ({
    kind:'journal', id:'jr-'+a.id, when:a.ago,
    who:`Halo Journal · ${a.tag}`,
    eyebrow:a.read,
    initials:'HJ',
    title:a.t,
    body:(a.sections && a.sections[0] && a.sections[0].t) || null,
    meta:[a.date, a.read],
    hero:'journal-card-'+a.id,
    action:'Read the article',
    open:()=>window.dispatchEvent(new CustomEvent('journal:open', { detail:{ id:a.id } })),
  }));
}

/* Interleave so the stream never reads as three stacked sections. */
function afBuildFeed() {
  const cols = [afInsightItems(), afWatchItems(), afJournalItems(), afAnswerItems()];
  const research = afResearchItems();
  const out = afSharedItems();
  // Answer first, then a note and an article inside the first screenful, so the
  // stream never reads as four stacked sections.
  for (let i = 0; i < 5; i++) {
    cols.forEach(c => { if (c[i]) out.push(c[i]); });
    // Manager research sits directly under the Halo / Watson insight cards.
    if (research[i]) out.splice(out.length - (cols.length - 1), 0, research[i]);
  }
  return out;
}

function AfChip({ children }) {
  return (
    <span style={{
      fontFamily:'Inter', fontSize:10.5, color:AF_MUTED, whiteSpace:'nowrap',
      padding:'2px 7px', border:`1px solid ${AF_LINE}`, borderRadius:4,
    }}>{children}</span>
  );
}

function AfPost({ item }) {
  const [hover, setHover] = React.useState(false);
  const k = AF_KINDS[item.kind];
  return (
    <article onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        border: hover ? '1px solid rgba(35,89,255,0.35)' : `1px solid ${AF_LINE}`,
        borderRadius:14, background:'rgba(255,255,255,0.025)',
        transition:'border-color .14s ease', overflow:'hidden',
      }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px 12px' }}>
        <div style={{
          width:36, height:36, borderRadius:10, flexShrink:0,
          background:`color-mix(in oklab, ${k.color} 14%, transparent)`,
          border:`1px solid color-mix(in oklab, ${k.color} 32%, transparent)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Inter', fontSize:12, fontWeight:600, color:k.color,
        }}>{item.initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:AF_INK }}>{item.who}</div>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:2 }}>
            <span style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:k.color }}>{k.label}</span>
            <span style={{ color:AF_DIM }}>·</span>
            <span style={{ fontFamily:'Inter', fontSize:11, color:AF_MUTED }}>{item.eyebrow}</span>
            <span style={{ color:AF_DIM }}>·</span>
            <span style={{ fontFamily:'Inter', fontSize:11, color:AF_DIM }}>{item.when}</span>
          </div>
        </div>
        <i className="fa-solid fa-ellipsis" style={{ fontSize:13, color:AF_DIM }} />
      </div>

      {/* copy */}
      <div style={{ padding:'0 18px 12px' }}>
        <div style={{ fontFamily:'Inter', fontSize:15, fontWeight:500, color:AF_INK, lineHeight:1.4, textWrap:'pretty' }}>{item.title}</div>
        {item.body && (
          <div style={{ fontFamily:'Inter', fontSize:12.5, color:AF_MUTED, lineHeight:1.6, marginTop:6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.body}</div>
        )}
      </div>

      {/* media — full-width image for articles, chart for insights & notes */}
      {item.stats ? (
        <div onClick={item.open} style={{ padding:'0 18px 14px', cursor:'pointer' }}><AfStats stats={item.stats} /></div>
      ) : item.hero ? (
        <div onClick={item.open} style={{ height:340, cursor:'pointer', borderTop:`1px solid ${AF_LINE}`, borderBottom:`1px solid ${AF_LINE}` }}>
          <img src="assets/journal-globe.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        </div>
      ) : (
        <div onClick={item.open} style={{ padding:'0 18px 14px', cursor:'pointer' }}>{item.chart}</div>
      )}

      {/* footer */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 18px 14px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:6, flex:1, flexWrap:'wrap', minWidth:0 }}>
          {item.meta.filter(Boolean).map((m, i) => <AfChip key={i}>{m}</AfChip>)}
        </div>
        <button onClick={item.open} style={{
          height:30, padding:'0 14px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap',
          fontFamily:'Inter', fontSize:12, fontWeight:500,
          background: hover ? 'rgba(35,89,255,0.18)' : 'rgba(255,255,255,0.04)',
          border: hover ? '1px solid rgba(35,89,255,0.45)' : `1px solid ${AF_LINE}`,
          color: hover ? AF_GREEN : AF_INK_2,
          display:'inline-flex', alignItems:'center', gap:8,
          transition:'background .14s ease, border-color .14s ease, color .14s ease',
        }}>
          {item.action}
          <i className="fa-solid fa-chevron-right" style={{ fontSize:9 }} />
        </button>
      </div>
    </article>
  );
}

function AfFilter({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      height:26, padding:'0 11px', borderRadius:9999, cursor:'pointer',
      fontFamily:'Inter', fontSize:11.5, fontWeight:500,
      background: active ? 'rgba(35,89,255,0.16)' : 'transparent',
      border: active ? '1px solid rgba(35,89,255,0.40)' : `1px solid ${AF_LINE}`,
      color: active ? AF_GREEN : AF_MUTED,
    }}>{label}</button>
  );
}

/* An approved item reports back here: the card confirms, then leaves the feed. */
function AfLeaving({ item, state }) {
  const gone = state === 'leaving';
  return (
    <div style={{
      maxHeight: gone ? 0 : 1400, opacity: gone ? 0 : 1,
      transform: gone ? 'translateY(-8px) scale(0.98)' : 'none',
      overflow:'hidden', transition:'max-height 620ms cubic-bezier(.4,0,.2,1), opacity 420ms ease, transform 620ms cubic-bezier(.4,0,.2,1)',
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'10px 16px', marginBottom:8,
        borderRadius:10, background:'rgba(35,89,255,0.14)', border:'1px solid rgba(35,89,255,0.4)',
        fontFamily:'Inter', fontSize:12.5, color:AF_INK,
      }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize:13, color:AF_GREEN }} />
        <span>Approved and sent to execution · clearing from your feed</span>
      </div>
      <div style={{ filter:'saturate(0.6)', opacity:0.75 }}><AfPost item={item} /></div>
    </div>
  );
}

function AipHomeFeed() {
  const all = React.useMemo(afBuildFeed, []);
  const [filter, setFilter] = React.useState('all');
  const [limit, setLimit] = React.useState(6);
  const [state, setState] = React.useState({}); // id -> 'approved' | 'leaving' | 'gone'
  React.useEffect(() => {
    const onDone = (e) => {
      const raw = (e.detail && e.detail.id) || 'opp-young-rebalance';
      const hit = all.find(r => r.id === raw || r.id.endsWith('-' + raw))
        || (raw.indexOf('young') >= 0 ? all.find(r => r.id === 'ins-young') : null)
        || all[0];
      if (!hit) return;
      setState(s => ({ ...s, [hit.id]:'approved' }));
      setTimeout(() => setState(s => ({ ...s, [hit.id]:'leaving' })), 1500);
      setTimeout(() => setState(s => ({ ...s, [hit.id]:'gone' })), 2250);
    };
    window.addEventListener('opportunity:done', onDone);
    return () => window.removeEventListener('opportunity:done', onDone);
  }, [all]);
  const rows = (filter === 'all' ? all : all.filter(r => r.kind === filter)).filter(r => state[r.id] !== 'gone');
  const shown = rows.slice(0, limit);
  return (
    <section style={{ width:'100%', maxWidth:680, margin:'0 auto', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', padding:'0 2px 4px' }}>
        <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, color:AF_INK_2, letterSpacing:'0.04em', textTransform:'uppercase' }}>For you</div>
        <div style={{ flex:1 }} />
        {[['all','All'],['shared','Shared'],['insight','Insights'],['research','Research'],['watchlist','Watchlist'],['journal','Journal']].map(([id,label]) => (
          <AfFilter key={id} label={label} active={filter===id} onClick={()=>{ setFilter(id); setLimit(6); }} />
        ))}
      </div>
      {shown.map(item => state[item.id]
        ? <AfLeaving key={item.id} item={item} state={state[item.id]} />
        : <AfPost key={item.id} item={item} />)}
      {rows.length > shown.length && (
        <button onClick={()=>setLimit(n => n + 9)} style={{
          alignSelf:'center', height:32, padding:'0 18px', borderRadius:9999,
          background:'transparent', border:`1px solid ${AF_LINE}`, color:AF_INK_2,
          fontFamily:'Inter', fontSize:11.5, cursor:'pointer',
        }}>{`Show ${Math.min(9, rows.length - shown.length)} more`}</button>
      )}
    </section>
  );
}

window.AipHomeFeed = AipHomeFeed;
