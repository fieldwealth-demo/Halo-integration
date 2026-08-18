/* RebalanceFlow — full-screen LLM-style takeover for the Rebalance opportunity.
   Progressive reveal: streaming "thinking" prose, then structured rationale cards
   appear in sequence. CTA at the end opens the generated client deck.

   Trigger: window.dispatchEvent(new CustomEvent('rebalance:open', { detail:{ client } }))
   Close:   window.dispatchEvent(new CustomEvent('rebalance:close'))
*/

const RB_CLIENT = {
  name:'David Young',
  initials:'DY',
  portfolio:'$2.4M',
  riskTolerance:'Moderate Growth',
  current:[
    { label:'Fixed Income',         pct:22, color:'rgb(56,189,248)' },
    { label:'Domestic Equity',      pct:58, color:'rgb(16,185,129)' },
    { label:'International Equity', pct:20, color:'rgb(234,88,12)'  },
  ],
  recommended:[
    { label:'Fixed Income',         pct:15, delta:-7, color:'rgb(56,189,248)' },
    { label:'Domestic Equity',      pct:65, delta:+7, color:'rgb(16,185,129)' },
    { label:'International Equity', pct:20, delta:0,  color:'rgb(234,88,12)'  },
  ],
};

/* ---- Streaming prose chunks (revealed in sequence) ---------------------- */
const RB_THINKING_LINES = [
  { type:'thinking', text:'Analyzing David Young\'s portfolio against current market conditions…' },
  { type:'thinking', text:'Evaluating allocation drift relative to target Moderate Growth profile…' },
  { type:'thinking', text:'Cross-referencing September 2025 market assessment data…' },
  { type:'thinking', text:'Computing risk-adjusted return optimization…' },
  { type:'response', text:'Based on my analysis, David Young\'s portfolio has drifted from target allocation. Fixed income is overweight at 22% (target 15%), while domestic equity is underweight at 58% (target 65%). Current market conditions favor reducing fixed income exposure given stabilizing yields, and increasing equity allocation aligns with his Moderate Growth objective.' },
  { type:'response', text:'Tax-efficient implementation is feasible — recommended trades qualify for harvest opportunities, and gradual execution over 2–3 days minimizes market impact. Estimated total cost: ~0.05% of portfolio value.' },
  { type:'response', text:'I recommend proceeding with the rebalance. I\'ve prepared a client-ready presentation covering rationale, recommended adjustments, efficient frontier analysis, trade cost management, and implementation timeline.' },
];

const RB_PILLARS = [
  { num:'1', title:'Risk Management',      body:'Prevents portfolio drift that could expose you to unintended risk levels beyond your comfort zone' },
  { num:'2', title:'Return Optimization',  body:'Ensures your asset allocation remains aligned with long-term growth objectives and market opportunities' },
  { num:'3', title:'Disciplined Approach', body:'Maintains systematic buy-low, sell-high discipline by trimming overweight positions' },
  { num:'4', title:'Tax Efficiency',       body:'Optimizes after-tax returns through strategic harvesting and asset location strategies' },
];

const RB_MARKET = [
  { label:'Fixed Income:',  body:'Yields stabilizing around 4.5-5% range',          accent:'Favorable for reduced allocation timing' },
  { label:'Equity Markets:',body:'Moderate valuations with selective opportunities',accent:'Supporting increased equity exposure' },
  { label:'International:', body:'Emerging market recovery momentum',                accent:'Maintaining 20% allocation optimal' },
  { label:'Volatility:',    body:'VIX in normal range (15-20)',                      accent:'Good environment for rebalancing' },
];

/* ---- Streaming line component ------------------------------------------ */
function RBStreamLine({ line, delay, onComplete }) {
  const [shown, setShown] = React.useState('');
  const [done, setDone]   = React.useState(false);
  React.useEffect(() => {
    let t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        i++;
        setShown(line.text.slice(0, i));
        if (i >= line.text.length) {
          clearInterval(id);
          setDone(true);
          onComplete && onComplete();
        }
      }, line.type === 'thinking' ? 12 : 8);
    }, delay);
    return () => clearTimeout(t);
  }, []);

  if (line.type === 'thinking') {
    return (
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'6px 0',
        fontFamily:'Inter', fontSize:13, color:'rgb(163,163,163)', fontStyle:'italic',
      }}>
        <i className={`fa-solid fa-${done ? 'check' : 'circle-notch'} ${done ? '' : 'fa-spin'}`} style={{ width:11, height:11, color: done ? 'rgb(16,185,129)' : 'rgb(163,163,163)' }} />
        <span>{shown}</span>
      </div>
    );
  }
  return (
    <div style={{
      padding:'12px 16px', marginTop:8,
      background:'rgba(5,122,85,0.06)', border:'1px solid rgba(5,122,85,0.3)', borderRadius:10,
      fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.6,
    }}>
      {shown}
      {!done && <span style={{ display:'inline-block', width:7, height:14, background:'rgb(16,185,129)', marginLeft:2, verticalAlign:'middle', animation:'rb-blink 1s infinite' }} />}
    </div>
  );
}

/* ---- Main overlay ------------------------------------------------------- */
function RebalanceFlow() {
  const [open, setOpen]               = React.useState(false);
  const [streamIdx, setStreamIdx]     = React.useState(0);
  const [showRationale, setShowRat]   = React.useState(false);
  const [showAllocations, setShowAlloc] = React.useState(false);
  const [showCta, setShowCta]         = React.useState(false);
  const [followUps, setFollowUps]     = React.useState([]); // [{role:'user'|'assistant', text, streaming?}]
  const [draft, setDraft]             = React.useState('');
  const [busy, setBusy]               = React.useState(false);
  const [showDeck, setShowDeck]       = React.useState(false);
  const scrollRef = React.useRef(null);

  // Open/close events
  React.useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setStreamIdx(0);
      setShowRat(false);
      setShowAlloc(false);
      setShowCta(false);
      setFollowUps([]);
      setDraft('');
      setBusy(false);
      setShowDeck(false);
    };
    const onClose = () => setOpen(false);
    window.addEventListener('rebalance:open', onOpen);
    window.addEventListener('rebalance:close', onClose);
    return () => {
      window.removeEventListener('rebalance:open', onOpen);
      window.removeEventListener('rebalance:close', onClose);
    };
  }, []);

  // Esc closes
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Reveal rationale + allocations + CTA after streaming completes
  React.useEffect(() => {
    if (!open) return;
    if (streamIdx >= RB_THINKING_LINES.length) {
      const t1 = setTimeout(() => setShowRat(true), 300);
      const t2 = setTimeout(() => setShowAlloc(true), 1200);
      const t3 = setTimeout(() => setShowCta(true), 2200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [streamIdx, open]);

  // Auto-scroll as content arrives
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior:'smooth' });
    }
  }, [streamIdx, showRationale, showAllocations, showCta, followUps]);

  const handleAsk = async () => {
    const q = draft.trim();
    if (!q || busy) return;
    setDraft('');
    setBusy(true);
    setFollowUps(prev => [...prev, { role:'user', text:q }, { role:'assistant', text:'', streaming:true }]);
    try {
      const reply = await window.claude.complete({
        messages: [{
          role:'user',
          content: `You are Field Intelligence, an AI assistant helping a financial advisor analyze a portfolio rebalance for client David Young (currently 22% Fixed Income / 58% Domestic Equity / 20% International Equity, target 15/65/20, Moderate Growth profile, $2.4M portfolio). Answer this advisor's follow-up question concisely (2-4 sentences, professional tone): ${q}`,
        }],
      });
      setFollowUps(prev => prev.map((m, i) => i === prev.length - 1 ? { role:'assistant', text:reply, streaming:false } : m));
    } catch (err) {
      setFollowUps(prev => prev.map((m, i) => i === prev.length - 1 ? { role:'assistant', text:'I had trouble generating a response. Please try again.', streaming:false } : m));
    }
    setBusy(false);
  };

  if (!open) return null;

  const handleGenerate = () => {
    setShowDeck(true);
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(10,15,25,0.92)', backdropFilter:'blur(20px) saturate(140%)', WebkitBackdropFilter:'blur(20px) saturate(140%)',
      animation:'rb-fadein 250ms ease-out',
      display:'flex', flexDirection:'column',
    }}>
      <style>{`
        @keyframes rb-fadein { from { opacity:0; } to { opacity:1; } }
        @keyframes rb-blink  { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
        @keyframes rb-rise   { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes rb-pulse  { 0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); } 50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); } }
      `}</style>

      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:14, padding:'18px 28px',
        borderBottom:'1px solid rgba(75,85,99,0.5)',
      }}>
        {showDeck ? (
          <>
            <button onClick={() => setShowDeck(false)} style={{
              height:32, padding:'0 14px', borderRadius:8, border:'1px solid rgba(75,85,99,0.7)',
              background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', cursor:'pointer',
              fontFamily:'Inter', fontSize:12.5, fontWeight:500,
              display:'inline-flex', alignItems:'center', gap:8,
            }}>
              <i className="fa-solid fa-arrow-left" style={{ width:11, height:11 }} />
              Back to analysis
            </button>
            <div style={{ flex:1, minWidth:0, paddingLeft:8 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)' }}>Portfolio Rebalancing Recommendation</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>Prepared for {RB_CLIENT.name}</div>
            </div>
            <button onClick={() => window.open('advisor/Rebalance Deck - David Young.html', '_blank')} style={{
              height:32, padding:'0 14px', borderRadius:8, border:'1px solid rgba(75,85,99,0.7)',
              background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', cursor:'pointer',
              fontFamily:'Inter', fontSize:12.5, fontWeight:500,
              display:'inline-flex', alignItems:'center', gap:8,
            }}>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ width:11, height:11 }} />
              Full screen
            </button>
          </>
        ) : (
          <>
            <div style={{
              width:36, height:36, borderRadius:9999,
              background:'linear-gradient(135deg, rgb(5,122,85) 0%, rgb(16,185,129) 100%)',
              display:'flex', alignItems:'center', justifyContent:'center',
              animation:'rb-pulse 2.5s infinite',
            }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ width:16, height:16, color:'#fff' }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)' }}>Field Intelligence</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>Analyzing rebalance opportunity for {RB_CLIENT.name}</div>
            </div>
          </>
        )}
        <button onClick={() => setOpen(false)} style={{
          width:32, height:32, borderRadius:8, border:'1px solid rgba(75,85,99,0.7)',
          background:'rgba(255,255,255,0.04)', color:'rgb(209,213,219)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <i className="fa-solid fa-xmark" style={{ width:13, height:13 }} />
        </button>
      </div>

      {/* Deck embedded iframe */}
      {showDeck && (
        <div style={{ flex:1, minHeight:0, background:'rgb(13,22,38)' }}>
          <iframe
            src="advisor/Rebalance Deck - David Young.html"
            style={{ width:'100%', height:'100%', border:'none', display:'block' }}
            title="Rebalancing Recommendation"
          />
        </div>
      )}

      {/* Scrollable body — hidden while deck is showing */}
      {!showDeck && (
      <><div ref={scrollRef} style={{ flex:1, overflowY:'auto' }}>
        <div style={{ maxWidth:920, margin:'0 auto', padding:'40px 28px 80px' }}>

          {/* Client context card */}
          <div style={{
            display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.5)', borderRadius:12,
            marginBottom:28, animation:'rb-rise 400ms ease-out',
          }}>
            <div style={{
              width:40, height:40, borderRadius:9999,
              background:'linear-gradient(135deg, rgb(56,189,248) 0%, rgb(139,92,246) 100%)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Inter', fontWeight:700, fontSize:13, color:'#fff',
            }}>{RB_CLIENT.initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)' }}>{RB_CLIENT.name}</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>
                {RB_CLIENT.portfolio} portfolio · {RB_CLIENT.riskTolerance}
              </div>
            </div>
            <div style={{
              fontFamily:'Inter', fontWeight:600, fontSize:11, padding:'5px 10px', borderRadius:6,
              background:'rgba(5,122,85,0.2)', color:'rgb(16,185,129)', border:'1px solid rgba(5,122,85,0.45)',
            }}>REBALANCE OPPORTUNITY</div>
          </div>

          {/* Section header */}
          <div style={{
            fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.12em',
            textTransform:'uppercase', color:'rgb(16,185,129)', marginBottom:14,
            animation:'rb-rise 400ms ease-out',
          }}>Analysis in progress</div>

          {/* Streaming lines */}
          <div style={{ marginBottom:32 }}>
            {RB_THINKING_LINES.slice(0, streamIdx + 1).map((line, i) => (
              <RBStreamLine
                key={i}
                line={line}
                delay={i === 0 ? 200 : 0}
                onComplete={() => setStreamIdx(prev => Math.max(prev, i + 1))}
              />
            ))}
          </div>

          {/* Rationale pillars */}
          {showRationale && (
            <div style={{ marginBottom:28, animation:'rb-rise 500ms ease-out' }}>
              <div style={{
                fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.12em',
                textTransform:'uppercase', color:'rgb(16,185,129)', marginBottom:14,
              }}>Why portfolio rebalancing matters</div>
              <div style={{
                paddingTop:8, borderTop:'1px solid rgba(75,85,99,0.5)',
                display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'24px 32px',
              }}>
                {RB_PILLARS.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:14, animation:`rb-rise 500ms ease-out ${i * 100}ms both` }}>
                    <div style={{
                      fontFamily:'Inter', fontWeight:700, fontSize:38, lineHeight:1,
                      color:'rgba(75,85,99,0.7)', fontVariantNumeric:'tabular-nums',
                    }}>{p.num}</div>
                    <div style={{ flex:1, minWidth:0, paddingTop:4 }}>
                      <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)', marginBottom:6 }}>{p.title}</div>
                      <div style={{ fontFamily:'Inter', fontSize:12.5, color:'rgb(163,163,163)', lineHeight:1.55 }}>{p.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allocation comparison */}
          {showAllocations && (
            <div style={{ marginBottom:28, animation:'rb-rise 500ms ease-out' }}>
              <div style={{
                fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.12em',
                textTransform:'uppercase', color:'rgb(16,185,129)', marginBottom:14,
              }}>Recommended adjustments</div>
              <div style={{
                paddingTop:8, borderTop:'1px solid rgba(75,85,99,0.5)',
                display:'grid', gridTemplateColumns:'1fr 40px 1fr', gap:14, alignItems:'center',
              }}>
                {/* Current */}
                <div>
                  <div style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)', textAlign:'center', marginBottom:8, letterSpacing:'0.04em' }}>Current Allocation</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {RB_CLIENT.current.map((a, i) => (
                      <div key={i} style={{
                        padding:'12px 14px',
                        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.5)', borderRadius:10,
                      }}>
                        <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', marginBottom:4 }}>{a.label}</div>
                        <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:24, color:'rgb(249,250,251)', fontVariantNumeric:'tabular-nums' }}>{a.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Arrow */}
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%' }}>
                  <i className="fa-solid fa-arrow-right" style={{ width:24, height:24, color:'rgb(16,185,129)' }} />
                </div>
                {/* Recommended */}
                <div>
                  <div style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)', textAlign:'center', marginBottom:8, letterSpacing:'0.04em' }}>Recommended Allocation</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {RB_CLIENT.recommended.map((a, i) => (
                      <div key={i} style={{
                        padding:'12px 14px',
                        background:'rgba(5,122,85,0.06)', border:'1px solid rgba(5,122,85,0.45)', borderRadius:10,
                        display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
                      }}>
                        <div>
                          <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', marginBottom:4 }}>{a.label}</div>
                          <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:24, color:'rgb(249,250,251)', fontVariantNumeric:'tabular-nums' }}>{a.pct}%</div>
                        </div>
                        {a.delta !== 0 && (
                          <div style={{
                            fontFamily:'Inter', fontWeight:700, fontSize:11.5, padding:'4px 9px', borderRadius:6,
                            background: a.delta > 0 ? 'rgba(5,122,85,0.3)' : 'rgba(220,38,38,0.25)',
                            color:     a.delta > 0 ? 'rgb(16,185,129)'   : 'rgb(248,113,113)',
                            border:    a.delta > 0 ? '1px solid rgba(5,122,85,0.55)' : '1px solid rgba(220,38,38,0.5)',
                          }}>{a.delta > 0 ? '+' : ''}{a.delta}%</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market assessment */}
          {showCta && (
            <div style={{ marginBottom:32, animation:'rb-rise 500ms ease-out' }}>
              <div style={{
                fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.12em',
                textTransform:'uppercase', color:'rgb(16,185,129)', marginBottom:14,
              }}>September 2025 market assessment</div>
              <div style={{ paddingTop:8, borderTop:'1px solid rgba(75,85,99,0.5)' }}>
                <div style={{ fontFamily:'Inter', fontSize:13, color:'rgb(209,213,219)', lineHeight:1.55, marginBottom:14 }}>
                  Current market conditions present unique opportunities for tactical rebalancing while maintaining strategic asset allocation discipline.
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
                  {RB_MARKET.map((m, i) => (
                    <div key={i} style={{
                      padding:'12px 14px',
                      background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.5)', borderRadius:10,
                    }}>
                      <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:12.5, color:'rgb(249,250,251)', marginBottom:6 }}>{m.label}</div>
                      <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(209,213,219)', lineHeight:1.5, marginBottom:8 }}>{m.body}</div>
                      <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(16,185,129)', lineHeight:1.5 }}>{m.accent}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {showCta && (
            <div style={{
              padding:'22px 24px',
              background:'linear-gradient(135deg, rgba(5,122,85,0.12) 0%, rgba(5,122,85,0.04) 100%)',
              border:'1px solid rgba(5,122,85,0.45)', borderRadius:14,
              display:'flex', alignItems:'center', gap:18,
              animation:'rb-rise 500ms ease-out 200ms both',
            }}>
              <div style={{
                width:48, height:48, borderRadius:12, flexShrink:0,
                background:'rgba(5,122,85,0.25)', border:'1px solid rgba(5,122,85,0.5)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <i className="fa-solid fa-file-powerpoint" style={{ width:20, height:20, color:'rgb(16,185,129)' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:15, color:'rgb(249,250,251)', marginBottom:4 }}>Client presentation ready</div>
                <div style={{ fontFamily:'Inter', fontSize:12.5, color:'rgb(163,163,163)' }}>
                  6-slide rebalance recommendation prepared for {RB_CLIENT.name}
                </div>
              </div>
              <button onClick={handleGenerate} style={{
                fontFamily:'Inter', fontWeight:600, fontSize:13,
                padding:'12px 20px', borderRadius:8, cursor:'pointer',
                background:'rgb(5,122,85)', border:'1px solid rgb(16,185,129)',
                color:'#fff', display:'inline-flex', alignItems:'center', gap:8,
                boxShadow:'0 4px 12px rgba(5,122,85,0.4)',
              }}>
                Open Presentation
                <i className="fa-solid fa-arrow-right" style={{ width:11, height:11 }} />
              </button>
            </div>
          )}

          {/* Follow-up Q&A thread */}
          {showCta && followUps.length > 0 && (
            <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:14 }}>
              {followUps.map((m, i) => m.role === 'user' ? (
                <div key={i} style={{ alignSelf:'flex-end', maxWidth:'80%', padding:'12px 16px',
                                       background:'rgba(56,189,248,0.12)', border:'1px solid rgba(56,189,248,0.35)', borderRadius:'12px 12px 2px 12px',
                                       fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.5,
                                       animation:'rb-rise 300ms ease-out' }}>
                  {m.text}
                </div>
              ) : (
                <div key={i} style={{ alignSelf:'flex-start', maxWidth:'85%', padding:'12px 16px',
                                       background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.55)', borderRadius:'12px 12px 12px 2px',
                                       fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.6,
                                       animation:'rb-rise 300ms ease-out' }}>
                  {m.streaming && !m.text ? (
                    <span style={{ display:'inline-flex', gap:4, alignItems:'center', color:'rgb(163,163,163)' }}>
                      <span style={{ width:6, height:6, borderRadius:9999, background:'rgb(16,185,129)', animation:'rb-blink 1s infinite' }} />
                      <span style={{ width:6, height:6, borderRadius:9999, background:'rgb(16,185,129)', animation:'rb-blink 1s infinite 0.15s' }} />
                      <span style={{ width:6, height:6, borderRadius:9999, background:'rgb(16,185,129)', animation:'rb-blink 1s infinite 0.3s' }} />
                    </span>
                  ) : m.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat input — anchored to bottom */}
      {showCta && (
        <div style={{
          flexShrink:0, borderTop:'1px solid rgba(75,85,99,0.5)',
          background:'rgba(10,15,25,0.7)', backdropFilter:'blur(8px)',
          padding:'14px 28px', animation:'rb-rise 400ms ease-out 600ms both',
        }}>
          <div style={{ maxWidth:920, margin:'0 auto' }}>
            {followUps.length === 0 && (
              <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                {['What\'s the tax impact?', 'How does this compare to peers?', 'Why not 70% equity?'].map((s, i) => (
                  <button key={i} onClick={() => setDraft(s)} style={{
                    fontFamily:'Inter', fontSize:11.5, padding:'5px 10px', borderRadius:9999, cursor:'pointer',
                    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.6)',
                    color:'rgb(209,213,219)',
                  }}>{s}</button>
                ))}
              </div>
            )}
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 14px',
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.7)', borderRadius:12,
            }}>
              <i className="fa-solid fa-comment-dots" style={{ width:14, height:14, color:'rgb(163,163,163)' }} />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
                placeholder="Ask a follow-up about this rebalance…"
                disabled={busy}
                style={{
                  flex:1, minWidth:0,
                  background:'transparent', border:'none', outline:'none',
                  fontFamily:'Inter', fontSize:13.5, color:'rgb(249,250,251)',
                }}
              />
              <button onClick={handleAsk} disabled={busy || !draft.trim()} style={{
                width:32, height:32, borderRadius:8, cursor: busy || !draft.trim() ? 'default' : 'pointer',
                background: busy || !draft.trim() ? 'rgba(75,85,99,0.4)' : 'rgb(5,122,85)',
                border: busy || !draft.trim() ? '1px solid rgba(75,85,99,0.6)' : '1px solid rgb(16,185,129)',
                color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                opacity: busy || !draft.trim() ? 0.6 : 1,
              }}>
                <i className={`fa-solid fa-${busy ? 'circle-notch fa-spin' : 'arrow-up'}`} style={{ width:13, height:13 }} />
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}

window.RebalanceFlow = RebalanceFlow;
