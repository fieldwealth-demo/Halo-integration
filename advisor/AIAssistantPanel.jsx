/* AI Assistant Slide-out -------------------------------------------------
   Right-side panel triggered by the floating sparkle FAB. Asks the advisor
   "How can I help?" with starter suggestions. Picking a suggestion (or
   submitting a free-form prompt) runs a mock agent flow that streams
   visible steps, tool calls, and an actionable result. Persists chat
   thread in component state for the session. */

const AI_BRAND       = 'rgb(5,122,85)';
const AI_BRAND_SOFT  = 'rgba(5,122,85,0.18)';
const AI_BRAND_RING  = 'rgba(5,122,85,0.35)';
const AI_PANEL_BG    = 'rgba(13, 21, 33, 0.92)';
const AI_BORDER      = 'rgb(75,85,99)';
const AI_BORDER_SOFT = 'rgba(75,85,99,0.5)';
const AI_INK         = 'rgb(249,250,251)';
const AI_MUTED       = 'rgb(163,163,163)';
const AI_DIM         = 'rgb(115,115,115)';
const AI_BUBBLE_USER = 'rgba(5,122,85,0.18)';
const AI_BUBBLE_AI   = 'rgba(255,255,255,0.04)';

/* -- Suggestions presented at the start of a thread --------------------- */
const AI_SUGGESTIONS = [
  {
    id: 'brief-david',
    icon: 'file-lines',
    title: 'Prepare meeting brief for David Young',
    sub: 'Profile · portfolio · talking points · deck',
    flow: 'meeting-brief',
    arg: 'David Young',
  },
  {
    id: 'stale-clients',
    icon: 'phone',
    title: "Clients I haven't talked to in a while",
    sub: 'Surface 5+ overdue check-ins',
    flow: 'stale-clients',
  },
  {
    id: 'drift',
    icon: 'arrow-trend-up',
    title: 'Portfolios that drifted over 5% this quarter',
    sub: 'Cross-reference targets vs. current allocation',
    flow: 'generic',
  },
  {
    id: 'review-tomorrow',
    icon: 'calendar',
    title: "What's on my plate tomorrow?",
    sub: 'Meetings, prep, follow-ups',
    flow: 'generic',
  },
];

/* =====================================================================
   AGENT FLOW DEFINITIONS
   Each flow is a scripted sequence of steps. Step kinds:
   - 'thinking' — italic reasoning line
   - 'tool'     — tool call card (with status: running → done)
   - 'message'  — assistant text block
   - 'result'   — final actionable result card
   ===================================================================== */

const AI_FLOW_MEETING_BRIEF = [
  { kind:'thinking', text:'Pulling everything I have on David Young — profile, portfolio, recent activity, last meeting.' },
  { kind:'tool', tool:'crm.lookup', label:'Looking up David Young in CRM', detail:'Found · Tier 1 · AUM $14.2M · advisor since 2018' },
  { kind:'tool', tool:'portfolio.snapshot', label:'Loading current portfolio', detail:'7 accounts · drift +6.4% from target' },
  { kind:'tool', tool:'calendar.history', label:'Reviewing meeting history', detail:'Last met 47 days ago · 12 prior touchpoints' },
  { kind:'tool', tool:'notes.fetch', label:'Reading prior meeting notes', detail:'3 open follow-ups · "529 for grandkids"' },
  { kind:'tool', tool:'market.events', label:'Scanning market events since last meeting', detail:'Fed cut · tech earnings · client industry: -3.1%' },
  { kind:'thinking', text:'Drafting talking points and a 6-slide deck.' },
  { kind:'tool', tool:'deck.generate', label:'Generating PowerPoint deck', detail:'6 slides · rebalance recommendation · 529 plan options', long:true },
  {
    kind:'result',
    title:'Meeting brief ready for David Young',
    summary:'Tomorrow · 10:30am · in-office · 60 min',
    bullets: [
      { label:'Portfolio drift',  value:'+6.4% over equity target — recommend rebalance' },
      { label:'Open follow-ups',  value:'529 plan for grandkids · trust update' },
      { label:'Life event',       value:'Daughter starting college Fall \'26' },
      { label:'Tone',             value:'Reassuring · last quarter was rough on his sector' },
    ],
    actions: [
      { id:'open-deck',    label:'Open rebalance deck',  icon:'file-lines',     href:'advisor/Rebalance%20Deck%20-%20David%20Young.html', primary:true },
      { id:'open-client',  label:'Open client page',     icon:'arrow-up-right-from-square', client:'David Young' },
      { id:'send-cal',     label:'Send agenda by email', icon:'envelope' },
    ],
  },
];

const AI_FLOW_STALE_CLIENTS = [
  { kind:'thinking', text:'Defining "a while" as ≥ 90 days since last meaningful touchpoint, weighted by tier.' },
  { kind:'tool', tool:'crm.scan',         label:'Scanning all client contact logs',     detail:'247 clients · 1,840 logged interactions' },
  { kind:'tool', tool:'calendar.history', label:'Cross-referencing calendar events',    detail:'Including office, video, phone, dinner' },
  { kind:'tool', tool:'mail.activity',    label:'Pulling email + call activity',        detail:'Outlook + Dialpad' },
  { kind:'tool', tool:'rules.apply',      label:'Applying tier-based cadence rules',    detail:'T1 90d · T2 120d · T3 180d' },
  { kind:'thinking', text:'Ranking by overdue gap × AUM × days since they reached out.' },
  {
    kind:'result',
    title:'5 clients are overdue for a check-in',
    summary:'Sorted by tier × overdue days · estimated AUM at risk: $42.3M',
    table: [
      { name:'Margaret Holloway', last:'127 days', tier:'Tier 1', aum:'$18.4M', flag:'High AUM · no spring meeting' },
      { name:'David Young',       last:'47 days',  tier:'Tier 1', aum:'$14.2M', flag:'Drift > 5% · meeting tomorrow' },
      { name:'The Chen Family',   last:'104 days', tier:'Tier 1', aum:'$9.1M',  flag:'Liquidity event in 30d' },
      { name:'Robert Patel',      last:'168 days', tier:'Tier 2', aum:'$3.8M',  flag:'No reply to last 2 emails' },
      { name:'Sarah Whitman',     last:'142 days', tier:'Tier 2', aum:'$2.6M',  flag:'Birthday last week — no card sent' },
    ],
    actions: [
      { id:'draft-emails',   label:'Draft personalized emails', icon:'envelope', primary:true },
      { id:'add-to-calendar',label:'Add to this week\'s calendar', icon:'calendar' },
    ],
  },
];

const AI_FLOW_GENERIC = [
  { kind:'thinking', text:'Got it — let me pull this together.' },
  { kind:'tool', tool:'data.query',  label:'Querying your book',     detail:'~3s' },
  { kind:'tool', tool:'rules.apply', label:'Applying your filters',  detail:'Using your saved preferences' },
  {
    kind:'result',
    title:'Here\'s what I found',
    summary:'A focused starting point — tap a row to drill in.',
    bullets: [
      { label:'Top finding',  value:'3 portfolios drifted ≥ 5% in equities' },
      { label:'Worth a look', value:'2 clients flagged for tax-loss harvest' },
      { label:'Do this next', value:'Schedule rebalance reviews this week' },
    ],
    actions: [
      { id:'open-list', label:'Open as full list', icon:'arrow-up-right-from-square', primary:true },
    ],
  },
];

function aiPickFlow(flow) {
  if (flow === 'meeting-brief')  return AI_FLOW_MEETING_BRIEF;
  if (flow === 'stale-clients')  return AI_FLOW_STALE_CLIENTS;
  return AI_FLOW_GENERIC;
}

/* =====================================================================
   STEP RENDERERS
   ===================================================================== */

function AiThinking({ text }) {
  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:8,
      padding:'4px 2px',
      fontFamily:'Inter', fontSize:12, fontStyle:'italic',
      color:AI_DIM, lineHeight:1.55,
    }}>
      <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize:10, color:AI_BRAND, marginTop:3, flexShrink:0 }} />
      <div>{text}</div>
    </div>
  );
}

function AiToolCall({ step }) {
  const done = step.status === 'done';
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'8px 10px', borderRadius:8,
      background: done ? 'rgba(255,255,255,0.025)' : 'rgba(5,122,85,0.08)',
      border:`1px solid ${done ? AI_BORDER_SOFT : AI_BRAND_RING}`,
      transition:'background 200ms ease, border-color 200ms ease',
    }}>
      <div style={{
        width:18, height:18, borderRadius:9999, flexShrink:0,
        background: done ? 'rgba(5,122,85,0.18)' : 'transparent',
        border: done ? `1px solid ${AI_BRAND}` : `1.5px solid ${AI_BRAND_RING}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: AI_BRAND,
      }}>
        {done
          ? <i className="fa-solid fa-check" style={{ fontSize:9 }} />
          : <i className="fa-solid fa-spinner fa-spin" style={{ fontSize:9 }} />
        }
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:500, color:AI_INK, lineHeight:1.3 }}>
          {step.label}
        </div>
        {step.detail && (
          <div style={{ fontFamily:'Geist Mono, monospace', fontSize:10.5, color:AI_MUTED, marginTop:2, lineHeight:1.3 }}>
            <span style={{ color:AI_BRAND }}>{step.tool}</span>
            <span style={{ color:AI_DIM, margin:'0 6px' }}>·</span>
            {step.detail}
          </div>
        )}
      </div>
    </div>
  );
}

function AiResultCard({ step, onAction }) {
  return (
    <div style={{
      borderRadius:12,
      background:'rgba(5,122,85,0.08)',
      border:`1px solid ${AI_BRAND_RING}`,
      padding:14,
      boxShadow:'0 8px 24px -10px rgba(5,122,85,0.35)',
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
        <div style={{
          width:24, height:24, borderRadius:8, background:AI_BRAND_SOFT,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:AI_BRAND, flexShrink:0,
        }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize:13 }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:600, color:AI_INK, lineHeight:1.3 }}>
            {step.title}
          </div>
          {step.summary && (
            <div style={{ fontFamily:'Inter', fontSize:11.5, color:AI_MUTED, marginTop:3, lineHeight:1.4 }}>
              {step.summary}
            </div>
          )}
        </div>
      </div>

      {step.bullets && (
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
          {step.bullets.map((b, i) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'112px 1fr', gap:8,
              padding:'6px 0',
              borderTop: i === 0 ? 'none' : `1px dashed ${AI_BORDER_SOFT}`,
            }}>
              <div style={{ fontFamily:'Inter', fontSize:11, color:AI_MUTED, fontWeight:500 }}>
                {b.label}
              </div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:AI_INK, lineHeight:1.4 }}>
                {b.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {step.table && (
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:12 }}>
          {step.table.map((r, i) => (
            <button key={i}
              onClick={()=>onAction({ id:'open-client', client: r.name })}
              style={{
                textAlign:'left', cursor:'pointer',
                display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center',
                gap:8, padding:'8px 10px', borderRadius:8,
                background:'rgba(255,255,255,0.025)',
                border:`1px solid ${AI_BORDER_SOFT}`,
                color:'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(5,122,85,0.10)'; e.currentTarget.style.borderColor = AI_BRAND_RING; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = AI_BORDER_SOFT; }}
            >
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:AI_INK, display:'flex', alignItems:'center', gap:8 }}>
                  {r.name}
                  <span style={{
                    fontSize:9, padding:'2px 6px', borderRadius:4,
                    background:'rgba(255,255,255,0.05)', color:AI_MUTED, fontWeight:500,
                    border:`1px solid ${AI_BORDER_SOFT}`,
                  }}>{r.tier}</span>
                </div>
                <div style={{ fontFamily:'Inter', fontSize:10.5, color:AI_MUTED, marginTop:2 }}>
                  Last contact <span style={{ color:'rgb(248,113,113)' }}>{r.last}</span>
                  <span style={{ color:AI_DIM, margin:'0 5px' }}>·</span>
                  {r.aum} · {r.flag}
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ fontSize:10, color:AI_DIM }} />
            </button>
          ))}
        </div>
      )}

      {step.actions && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {step.actions.map((a) => (
            <button key={a.id}
              onClick={()=>onAction(a)}
              style={{
                height:30, padding:'0 12px', borderRadius:8, cursor:'pointer',
                fontFamily:'Inter', fontSize:11.5, fontWeight:500,
                display:'inline-flex', alignItems:'center', gap:6,
                border: a.primary ? `1px solid ${AI_BRAND}` : `1px solid ${AI_BORDER}`,
                background: a.primary ? AI_BRAND : 'rgba(255,255,255,0.04)',
                color: a.primary ? '#fff' : AI_INK,
              }}>
              <i className={`fa-solid fa-${a.icon}`} style={{ fontSize:10 }} />
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   THREAD — runs a flow and reveals each step on a timer
   ===================================================================== */

function AiThread({ entry, onAction }) {
  // entry.steps is the static script. We progressively reveal steps and
  // mark each tool call done before moving on.
  const [revealed, setRevealed] = React.useState(0);     // index of last step revealed
  const [doneMap, setDoneMap]   = React.useState({});    // step idx → bool (for tools)

  React.useEffect(() => {
    if (!entry.steps) return;
    let cancelled = false;
    setRevealed(0);
    setDoneMap({});
    let i = 0;
    const next = () => {
      if (cancelled || i >= entry.steps.length) return;
      const step = entry.steps[i];
      setRevealed(i + 1);
      // Determine how long this step takes before the next reveal
      const reveal = step.kind === 'thinking' ? 700
                   : step.kind === 'tool' ? (step.long ? 1500 : 850)
                   : step.kind === 'result' ? 0
                   : 600;
      // For tool steps, schedule a "done" flip about 80% of the way through
      if (step.kind === 'tool') {
        const myIdx = i;
        setTimeout(() => { if (!cancelled) setDoneMap(prev => ({ ...prev, [myIdx]: true })); }, reveal - 200);
      }
      i++;
      setTimeout(next, reveal);
    };
    next();
    return () => { cancelled = true; };
  }, [entry.id]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {/* User bubble */}
      <div style={{ alignSelf:'flex-end', maxWidth:'85%' }}>
        <div style={{
          background: AI_BUBBLE_USER,
          border:`1px solid ${AI_BRAND_RING}`,
          borderRadius:'12px 12px 2px 12px',
          padding:'8px 12px',
          fontFamily:'Inter', fontSize:13, color:AI_INK, lineHeight:1.45,
        }}>{entry.prompt}</div>
      </div>

      {/* Agent steps */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {entry.steps.slice(0, revealed).map((step, i) => {
          const liveStep = step.kind === 'tool'
            ? { ...step, status: doneMap[i] ? 'done' : 'running' }
            : step;
          if (step.kind === 'thinking') return <AiThinking key={i} text={step.text} />;
          if (step.kind === 'tool')     return <AiToolCall key={i} step={liveStep} />;
          if (step.kind === 'result')   return <AiResultCard key={i} step={step} onAction={onAction} />;
          return null;
        })}
        {/* Typing indicator while we're not at the end */}
        {revealed < entry.steps.length && entry.steps[revealed - 1]?.kind !== 'result' && (
          <div style={{
            display:'inline-flex', gap:3, padding:'4px 2px',
          }}>
            <AiDot delay={0} />
            <AiDot delay={150} />
            <AiDot delay={300} />
          </div>
        )}
      </div>
    </div>
  );
}

function AiDot({ delay }) {
  return (
    <span style={{
      width:5, height:5, borderRadius:9999, background:AI_BRAND,
      display:'inline-block', opacity:0.3,
      animation:`aiPulse 1.1s ${delay}ms ease-in-out infinite`,
    }} />
  );
}

/* =====================================================================
   MAIN PANEL
   ===================================================================== */

function AIAssistantPanel({ open, onClose }) {
  const [thread, setThread] = React.useState([]); // array of { id, prompt, steps }
  const [input,  setInput]  = React.useState('');
  const [deckUrl, setDeckUrl] = React.useState(null); // inline deck overlay
  const scrollerRef = React.useRef();

  // Auto-scroll to bottom when thread grows
  React.useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    // Re-scroll periodically while the latest entry streams in
    const id = setInterval(() => {
      if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }, 400);
    setTimeout(() => clearInterval(id), 12000);
    return () => clearInterval(id);
  }, [thread.length]);

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleStart = (suggestion) => {
    const steps = aiPickFlow(suggestion.flow);
    setThread(prev => [...prev, {
      id: 'msg-' + Date.now(),
      prompt: suggestion.title,
      steps,
    }]);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    // Simple keyword routing for demo realism
    const lower = q.toLowerCase();
    let flow = 'generic';
    if (lower.includes('david young') || (lower.includes('brief') && lower.includes('meeting'))) flow = 'meeting-brief';
    else if (lower.includes("haven't talked") || lower.includes('overdue') || (lower.includes('clients') && lower.includes('while'))) flow = 'stale-clients';
    setThread(prev => [...prev, {
      id: 'msg-' + Date.now(),
      prompt: q,
      steps: aiPickFlow(flow),
    }]);
  };

  const handleAction = (action) => {
    if (action.id === 'open-deck' && action.href) {
      setDeckUrl(action.href);
      return;
    }
    if (action.id === 'open-client' || action.client) {
      const client = action.client || 'David Young';
      const highlight = client === 'David Young' ? 'rebalance' : null;
      window.dispatchEvent(new CustomEvent('client:open', { detail: { client, highlight } }));
      onClose();
      return;
    }
    // Other actions are just visual demos
  };

  const handleNewThread = () => setThread([]);

  return (
    <>
      {/* Animation keyframes */}
      <style>{`
        @keyframes aiPulse { 0%, 100% { opacity:0.25; transform:translateY(0); } 50% { opacity:1; transform:translateY(-2px); } }
        @keyframes aiSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes aiFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes aiStepIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform: translateY(0); } }
        .ai-suggest:hover { background: rgba(5,122,85,0.10) !important; border-color: ${AI_BRAND_RING} !important; }
        .ai-step > * { animation: aiStepIn 280ms ease both; }
      `}</style>

      {/* Backdrop — light, doesn't fully cover the dashboard */}
      {open && (
        <div onClick={onClose} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.25)',
          zIndex:90, animation:'aiFadeIn 200ms ease',
        }} />
      )}

      {/* Panel */}
      {open && (
        <div role="dialog" aria-label="Field AI" style={{
          position:'fixed', top:0, right:0, bottom:0,
          width: 'min(460px, 92vw)',
          background: AI_PANEL_BG,
          backdropFilter:'blur(18px) saturate(160%)',
          WebkitBackdropFilter:'blur(18px) saturate(160%)',
          borderLeft: `1px solid ${AI_BORDER}`,
          boxShadow:'-24px 0 60px -12px rgba(0,0,0,0.6)',
          zIndex:100,
          display:'flex', flexDirection:'column',
          animation:'aiSlideIn 280ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}>
          {/* Header */}
          <div style={{
            padding:'16px 18px',
            borderBottom:`1px solid ${AI_BORDER_SOFT}`,
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{
              width:30, height:30, borderRadius:8,
              background:`linear-gradient(135deg, ${AI_BRAND} 0%, rgb(20,160,120) 100%)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', boxShadow:`0 0 0 3px ${AI_BRAND_SOFT}`,
            }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize:13 }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:600, color:AI_INK, lineHeight:1.2 }}>
                Field AI
              </div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:AI_MUTED, lineHeight:1.2, marginTop:1 }}>
                Your assistant
              </div>
            </div>
            {thread.length > 0 && (
              <button onClick={handleNewThread} title="Start a new thread" style={{
                height:28, padding:'0 10px', borderRadius:8,
                border:`1px solid ${AI_BORDER}`, background:'rgba(255,255,255,0.04)',
                color:AI_INK, cursor:'pointer',
                fontFamily:'Inter', fontSize:11, fontWeight:500,
                display:'inline-flex', alignItems:'center', gap:5,
              }}>
                <i className="fa-solid fa-plus" style={{ fontSize:9 }} /> New
              </button>
            )}
            <button onClick={onClose} title="Close" style={{
              width:28, height:28, borderRadius:8, border:'none',
              background:'transparent', color:AI_MUTED, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <i className="fa-solid fa-xmark" style={{ fontSize:13 }} />
            </button>
          </div>

          {/* Body — scrollable */}
          <div ref={scrollerRef} className="cd-sidebar-scroll" style={{
            flex:1, minHeight:0, overflowY:'auto',
            padding: thread.length === 0 ? '0' : '18px 18px 12px',
            display: thread.length === 0 ? 'flex' : 'block',
            flexDirection: thread.length === 0 ? 'column' : undefined,
          }}>
            {thread.length === 0 ? (
              <AiEmptyState
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                onPick={handleStart}
              />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
                {thread.map((entry) => (
                  <div key={entry.id} className="ai-step">
                    <AiThread entry={entry} onAction={handleAction} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Composer — only when there's a thread; the empty state has its own centered input */}
          {thread.length > 0 && (
          <form onSubmit={handleSubmit} style={{
            padding:'12px 14px 16px',
            borderTop:`1px solid ${AI_BORDER_SOFT}`,
          }}>
            <div style={{
              display:'flex', alignItems:'flex-end', gap:8,
              background:'rgba(255,255,255,0.04)',
              border:`1px solid ${AI_BORDER}`,
              borderRadius:12,
              padding:'8px 8px 8px 12px',
              transition:'border-color 200ms ease, box-shadow 200ms ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = AI_BRAND_RING; e.currentTarget.style.boxShadow = `0 0 0 3px ${AI_BRAND_SOFT}`; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = AI_BORDER; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <textarea
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
                }}
                placeholder="Ask anything about your book…"
                rows={1}
                style={{
                  flex:1, minWidth:0, resize:'none',
                  background:'transparent', border:'none', outline:'none',
                  fontFamily:'Inter', fontSize:13, color:AI_INK,
                  lineHeight:1.45, padding:'4px 0', maxHeight:120,
                }}
              />
              <button type="submit" disabled={!input.trim()} style={{
                width:30, height:30, borderRadius:8, border:'none',
                background: input.trim() ? AI_BRAND : 'rgba(255,255,255,0.06)',
                color: input.trim() ? '#fff' : AI_DIM,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'background 150ms ease',
              }}>
                <i className="fa-solid fa-arrow-up" style={{ fontSize:11 }} />
              </button>
            </div>
            <div style={{
              fontFamily:'Inter', fontSize:10, color:AI_DIM,
              marginTop:8, textAlign:'center',
            }}>
              Field AI can take actions on your behalf · review results before sending to clients
            </div>
          </form>
          )}
        </div>
      )}

      {/* Inline deck viewer — opens the rebalance deck within the app so it
         keeps the preview's auth context (a new tab loses the token). */}
      {deckUrl && (
        <div role="dialog" aria-label="Rebalance deck" onClick={()=>setDeckUrl(null)} style={{
          position:'fixed', inset:0, zIndex:120,
          background:'rgba(2,6,12,0.78)', backdropFilter:'blur(6px)',
          WebkitBackdropFilter:'blur(6px)',
          display:'flex', flexDirection:'column', padding:'28px',
          animation:'aiFadeIn 200ms ease',
        }}>
          <div onClick={(e)=>e.stopPropagation()} style={{
            flex:1, minHeight:0, maxWidth:1280, width:'100%', margin:'0 auto',
            display:'flex', flexDirection:'column',
            borderRadius:14, overflow:'hidden',
            border:`1px solid ${AI_BORDER}`,
            boxShadow:'0 40px 100px -20px rgba(0,0,0,0.7)',
            background:'rgb(13,22,38)',
          }}>
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 16px', borderBottom:`1px solid ${AI_BORDER_SOFT}`,
              background:'rgba(255,255,255,0.03)', flexShrink:0,
            }}>
              <i className="fa-solid fa-file-lines" style={{ fontSize:13, color:'rgb(16,185,129)' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:AI_INK }}>Rebalance deck · David Young</div>
                <div style={{ fontFamily:'Inter', fontSize:11, color:AI_MUTED, marginTop:1 }}>6 slides · branded recommendation</div>
              </div>
              <button onClick={()=>setDeckUrl(null)} style={{
                width:30, height:30, borderRadius:8, cursor:'pointer',
                border:`1px solid ${AI_BORDER}`, background:'rgba(255,255,255,0.04)',
                color:AI_INK, display:'flex', alignItems:'center', justifyContent:'center',
              }} aria-label="Close deck">
                <i className="fa-solid fa-xmark" style={{ fontSize:13 }} />
              </button>
            </div>
            <iframe src={deckUrl} title="Rebalance deck" style={{
              flex:1, minHeight:0, width:'100%', border:'none', display:'block',
            }} />
          </div>
        </div>
      )}
    </>
  );
}

/* -- Empty / start state -----------------------------------------------
   Centered hero: title + composer + suggestion pills, vertically stacked
   in the middle of the panel. Mirrors the reference design. */
function AiEmptyState({ input, setInput, onSubmit, onPick }) {
  return (
    <div style={{
      flex:1, minHeight:0,
      display:'flex', flexDirection:'column',
      justifyContent:'center', alignItems:'stretch',
      padding:'24px 22px 32px',
      gap:20,
    }}>
      {/* Title + subtitle */}
      <div style={{ textAlign:'center' }}>
        <div style={{
          fontFamily:'Inter Display, Inter, sans-serif',
          fontSize:34, fontWeight:600, color:AI_INK,
          letterSpacing:'-0.02em', lineHeight:1.05,
        }}>
          How can I help?
        </div>
        <div style={{
          fontFamily:'Inter', fontSize:13, color:AI_MUTED,
          marginTop:10, lineHeight:1.5, maxWidth:340, marginLeft:'auto', marginRight:'auto',
        }}>
          I can pull data from your book, draft client communications,
          and prep meeting materials.
        </div>
      </div>

      {/* Composer card — embedded inline, with attach + suggested actions + send */}
      <form onSubmit={onSubmit} style={{
        background:'rgba(255,255,255,0.04)',
        border:`1px solid ${AI_BORDER}`,
        borderRadius:14,
        padding:'12px 12px 10px',
        display:'flex', flexDirection:'column', gap:10,
        boxShadow:'0 8px 24px -10px rgba(0,0,0,0.4)',
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = AI_BRAND_RING; e.currentTarget.style.boxShadow = `0 0 0 3px ${AI_BRAND_SOFT}, 0 8px 24px -10px rgba(0,0,0,0.4)`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = AI_BORDER; e.currentTarget.style.boxShadow = '0 8px 24px -10px rgba(0,0,0,0.4)'; }}
      >
        <textarea
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e); }
          }}
          placeholder="Write your message here…"
          rows={2}
          style={{
            width:'100%', resize:'none',
            background:'transparent', border:'none', outline:'none',
            fontFamily:'Inter', fontSize:14, color:AI_INK,
            lineHeight:1.5, padding:'2px 4px', minHeight:48, maxHeight:160,
          }}
        />
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button type="button" title="Attach a file" style={{
            width:30, height:30, borderRadius:8, border:'none',
            background:'transparent', color:AI_MUTED, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <i className="fa-solid fa-folder" style={{ fontSize:13 }} />
          </button>
          <div style={{ flex:1 }} />
          <button type="submit" disabled={!input.trim()} title="Send" style={{
            width:30, height:30, borderRadius:8, border:'none',
            background: input.trim() ? AI_BRAND : 'rgba(5,122,85,0.35)',
            color:'#fff',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'background 150ms ease',
          }}>
            <i className="fa-solid fa-arrow-up" style={{ fontSize:11 }} />
          </button>
        </div>
      </form>

      {/* Suggestion pills — stacked, centered */}
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap:8,
        marginTop:4,
      }}>
        {AI_SUGGESTIONS.map((s) => (
          <button key={s.id}
            className="ai-pill"
            onClick={()=>onPick(s)}
            style={{
              cursor:'pointer',
              maxWidth:'100%',
              padding:'7px 14px',
              borderRadius:9999,
              background:'rgba(255,255,255,0.04)',
              border:`1px solid ${AI_BORDER}`,
              color:AI_INK,
              fontFamily:'Inter', fontSize:12, fontWeight:500,
              whiteSpace:'normal', textAlign:'center',
              transition:'background 150ms ease, border-color 150ms ease, transform 150ms ease',
            }}>
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
