/* InsightProposalFlow — full-screen LLM-style takeover that turns an insight
   (from any provider) into a client-ready, illustrated proposal doc. Modeled
   on RebalanceFlow: streaming analysis → rationale pillars → a scenario / what-
   changes panel → CTA that opens the generated proposal deck.

   Provider-aware: Halo gets the violet protective treatment; other managers
   use the green house accent. Reads window.FIELD_INSIGHTS.

   Trigger: window.dispatchEvent(new CustomEvent('insight:open', { detail:{ id } }))
*/

const IPF_PROVIDER = {
  'Halo':       { accent:'rgb(168,85,247)', bright:'rgb(192,132,252)', soft:'rgba(168,85,247,0.06)', bd:'rgba(168,85,247,0.3)', brand:'rgb(124,58,237)', abbr:'HALO' },
  'BlackRock':  { accent:'rgb(5,122,85)',   bright:'rgb(110,231,183)', soft:'rgba(5,122,85,0.06)',  bd:'rgba(5,122,85,0.3)',   brand:'rgb(17,24,32)',  abbr:'BLK' },
  'PIMCO':      { accent:'rgb(37,99,235)',  bright:'rgb(120,160,230)', soft:'rgba(37,99,235,0.06)', bd:'rgba(37,99,235,0.3)',  brand:'rgb(0,46,110)',  abbr:'PIM' },
  'Blackstone': { accent:'rgb(202,138,4)',  bright:'rgb(245,200,90)',  soft:'rgba(202,138,4,0.06)', bd:'rgba(202,138,4,0.3)',  brand:'rgb(38,38,38)',  abbr:'BX' },
  'Nuveen':     { accent:'rgb(190,24,93)',  bright:'rgb(244,164,200)', soft:'rgba(190,24,93,0.06)', bd:'rgba(190,24,93,0.3)',  brand:'rgb(13,123,138)',abbr:'NUV' },
};

/* Protected-vs-unprotected scenario tables for the structured (payoff) Halo
   insights. Allocation/income insights show a "what changes" panel instead. */
const IPF_SCENARIOS = {
  watson:  [ { move:'Index falls 25%', un:'\u221225.0%', pr:'\u221210.0%', good:false }, { move:'Index falls 15%', un:'\u221215.0%', pr:'0.0%', good:true }, { move:'Index rises 12%', un:'+12.0%', pr:'+12.0%', good:true }, { move:'Index rises 24%', un:'+24.0%', pr:'+18.0% (cap)', good:true } ],
  smith:   [ { move:'Index falls 20%', un:'\u221220.0%', pr:'\u221210.0%', good:false }, { move:'Index falls 10%', un:'\u221210.0%', pr:'0.0%', good:true }, { move:'Flat market', un:'0.0%', pr:'+4.6% income', good:true }, { move:'Index rises 15%', un:'+15.0%', pr:'+4.6% income', good:true } ],
  young:   [ { move:'Index falls 30%', un:'\u221230.0%', pr:'0.0% (principal)', good:true }, { move:'Index falls 10%', un:'\u221210.0%', pr:'0.0% (principal)', good:true }, { move:'Index rises 10%', un:'+10.0%', pr:'+10.0%', good:true }, { move:'Index rises 20%', un:'+20.0%', pr:'+18.0% (cap)', good:true } ],
  hawkins: [ { move:'Index falls 25%', un:'\u221225.0%', pr:'\u221213.0%', good:false }, { move:'Index falls 12%', un:'\u221212.0%', pr:'0.0%', good:true }, { move:'Index rises 10%', un:'+10.0%', pr:'+10.0%', good:true }, { move:'Index rises 22%', un:'+22.0%', pr:'+16.0% (cap)', good:true } ],
  lang:    [ { move:'Index falls 35%', un:'\u221235.0%', pr:'0.0% (principal)', good:true }, { move:'Index falls 15%', un:'\u221215.0%', pr:'0.0% (principal)', good:true }, { move:'Index rises 15%', un:'+15.0%', pr:'+10.5%', good:true }, { move:'Index rises 25%', un:'+25.0%', pr:'+17.5%', good:true } ],
  edwards: [ { move:'Index falls 25%', un:'\u221225.0%', pr:'\u221225.0%', good:false }, { move:'Index falls 18%', un:'\u221218.0%', pr:'+9.2% coupon', good:true }, { move:'Flat market', un:'0.0%', pr:'+9.2% coupon', good:true }, { move:'Index rises 15%', un:'+15.0%', pr:'+9.2% coupon', good:true } ],
};

const IPF_PILLARS = {
  protection: [
    { num:'1', title:'Defined Downside',     body:'A stated buffer, barrier, or 100% principal floor absorbs losses before the client\u2019s capital is touched.' },
    { num:'2', title:'Known Terms Up Front', body:'Protection level, cap, and maturity are fixed at purchase — no surprises, no active management.' },
    { num:'3', title:'Upside Participation', body:'The client keeps market upside to a defined cap, or earns a contingent coupon, rather than sitting in cash.' },
    { num:'4', title:'Fits the Portfolio',   body:'Funded from the at-risk sleeve so it complements existing allocation without a forced taxable sale.' },
  ],
  allocation: [
    { num:'1', title:'Back to Policy',        body:'Brings the portfolio back in line with the household\u2019s investment policy and target allocation.' },
    { num:'2', title:'Low Cost & Tax-Aware',  body:'Implemented through low-cost vehicles with minimal turnover to limit tax drag.' },
    { num:'3', title:'Provider Conviction',   body:'Reflects the manager\u2019s current house view and model positioning, refreshed continuously.' },
    { num:'4', title:'Documented Rationale',  body:'Every move ties back to a stated objective the client can see in the proposal.' },
  ],
};

function IPFStreamLine({ line, delay, onComplete, bright }) {
  const [shown, setShown] = React.useState('');
  const [done, setDone]   = React.useState(false);
  React.useEffect(() => {
    let t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        i++; setShown(line.text.slice(0, i));
        if (i >= line.text.length) { clearInterval(id); setDone(true); onComplete && onComplete(); }
      }, line.type === 'thinking' ? 11 : 7);
    }, delay);
    return () => clearTimeout(t);
  }, []);
  if (line.type === 'thinking') {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', fontFamily:'Inter', fontSize:13, color:'rgb(163,163,163)', fontStyle:'italic' }}>
        <i className={`fa-solid fa-${done ? 'check' : 'circle-notch'} ${done ? '' : 'fa-spin'}`} style={{ width:11, height:11, color: done ? bright : 'rgb(163,163,163)' }} />
        <span>{shown}</span>
      </div>
    );
  }
  return (
    <div style={{ padding:'12px 16px', marginTop:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.5)', borderRadius:10,
      fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.6 }}>
      {shown}
      {!done && <span style={{ display:'inline-block', width:7, height:14, background:bright, marginLeft:2, verticalAlign:'middle', animation:'ipf-blink 1s infinite' }} />}
    </div>
  );
}

function InsightProposalFlow() {
  const [open, setOpen]   = React.useState(false);
  const [r, setR]         = React.useState(null);
  const [streamIdx, setStreamIdx] = React.useState(0);
  const [showRat, setShowRat]   = React.useState(false);
  const [showScen, setShowScen] = React.useState(false);
  const [showCta, setShowCta]   = React.useState(false);
  const [followUps, setFollowUps] = React.useState([]);
  const [draft, setDraft] = React.useState('');
  const [busy, setBusy]   = React.useState(false);
  const [showDeck, setShowDeck] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Field house theming for the flow + CTAs (all green); providers differ only by their badge monogram.
  const pmBase = r ? (IPF_PROVIDER[r.provider] || IPF_PROVIDER['Halo']) : IPF_PROVIDER['Halo'];
  const pm = { ...pmBase, accent:'rgb(5,122,85)', bright:'rgb(52,211,153)', soft:'rgba(5,122,85,0.06)', bd:'rgba(5,122,85,0.3)' };
  const isPayoff = r && IPF_SCENARIOS[r.id];

  const lines = React.useMemo(() => {
    if (!r) return [];
    return [
      { type:'thinking', text:`Loading ${r.client}\u2019s positions from ${r.provider} and the custodian feed…` },
      { type:'thinking', text:`Evaluating "${r.signal}" against the household\u2019s ${r.risk} profile…` },
      { type:'thinking', text:`Screening ${r.provider}\u2019s shelf for the best-fit ${r.product}…` },
      { type:'thinking', text:'Modeling outcomes and drafting the client proposal…' },
      { type:'response', text:`${r.signalDetail} ${r.why}` },
      { type:'response', text:`A ${r.product} (${r.term}) is the strongest fit, with roughly ${r.scope} eligible. I\u2019ve prepared a client-ready proposal with the rationale, structure, an illustrated payoff, and implementation.` },
    ];
  }, [r]);

  React.useEffect(() => {
    const onOpen = (e) => {
      const id = e.detail && e.detail.id;
      const m = (window.FIELD_INSIGHTS || []).find(x => x.id === id) || (window.FIELD_INSIGHTS || [])[0];
      if (m && m.provider === 'Halo') return; /* Halo insights route to the Aura-style HaloGuidedFlow */
      setR(m); setOpen(true); setStreamIdx(0); setShowRat(false); setShowScen(false); setShowCta(false);
      setFollowUps([]); setDraft(''); setBusy(false); setShowDeck(false);
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

  React.useEffect(() => {
    if (!open) return;
    if (streamIdx >= lines.length && lines.length) {
      const t1 = setTimeout(() => setShowRat(true), 300);
      const t2 = setTimeout(() => setShowScen(true), 1200);
      const t3 = setTimeout(() => setShowCta(true), 2200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [streamIdx, open, lines.length]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior:'smooth' });
  }, [streamIdx, showRat, showScen, showCta, followUps]);

  const handleAsk = async () => {
    const q = draft.trim();
    if (!q || busy || !r) return;
    setDraft(''); setBusy(true);
    setFollowUps(prev => [...prev, { role:'user', text:q }, { role:'assistant', text:'', streaming:true }]);
    try {
      const reply = await window.claude.complete({
        messages: [{ role:'user', content:
          `You are Field Intelligence helping a financial advisor evaluate a ${r.provider} insight for the ${r.client} household (${r.aum}, ${r.risk} risk). Signal "${r.signal}": ${r.signalDetail} Recommended: ${r.product} (${r.term}), ${r.scope} in scope. Answer the advisor's follow-up concisely (2-4 sentences, professional, no disclaimers): ${q}` }],
      });
      setFollowUps(prev => prev.map((m, i) => i === prev.length - 1 ? { role:'assistant', text:reply, streaming:false } : m));
    } catch (err) {
      setFollowUps(prev => prev.map((m, i) => i === prev.length - 1 ? { role:'assistant', text:'I had trouble generating a response. Please try again.', streaming:false } : m));
    }
    setBusy(false);
  };

  if (!open || !r) return null;
  const scenarios = IPF_SCENARIOS[r.id] || [];
  const pillars = IPF_PILLARS[isPayoff ? 'protection' : 'allocation'];
  const deckHref = `advisor/Insight Proposal.html?id=${r.id}`;
  const sectionStyle = { fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:pm.bright, marginBottom:14 };
  const btn = { height:32, padding:'0 14px', borderRadius:8, border:'1px solid rgba(75,85,99,0.7)', background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', cursor:'pointer', fontFamily:'Inter', fontSize:12.5, fontWeight:500, display:'inline-flex', alignItems:'center', gap:8 };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(12,12,18,0.93)', backdropFilter:'blur(20px) saturate(140%)', WebkitBackdropFilter:'blur(20px) saturate(140%)', animation:'ipf-fadein 250ms ease-out', display:'flex', flexDirection:'column' }}>
      <style>{`
        @keyframes ipf-fadein { from { opacity:0; } to { opacity:1; } }
        @keyframes ipf-blink  { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
        @keyframes ipf-rise   { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes ipf-pulse  { 0%,100% { box-shadow: 0 0 0 0 ${pm.accent}80; } 50% { box-shadow: 0 0 0 8px transparent; } }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 28px', borderBottom:'1px solid rgba(75,85,99,0.5)' }}>
        {showDeck ? (
          <React.Fragment>
            <button onClick={() => setShowDeck(false)} style={btn}><i className="fa-solid fa-arrow-left" style={{ width:11, height:11 }} /> Back to analysis</button>
            <div style={{ flex:1, minWidth:0, paddingLeft:8 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)' }}>{r.product} Proposal</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>Prepared for {r.client} · via {r.provider}</div>
            </div>
            <button onClick={() => window.open(deckHref, '_blank')} style={btn}><i className="fa-solid fa-arrow-up-right-from-square" style={{ width:11, height:11 }} /> Full screen</button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ width:36, height:36, borderRadius:8, flexShrink:0, background:pm.brand, display:'flex', alignItems:'center', justifyContent:'center', animation:'ipf-pulse 2.5s infinite', border:'1px solid rgba(255,255,255,0.14)' }}>
              <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:11, color:'#fff' }}>{pm.abbr}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)' }}>Field Intelligence · {r.provider}</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>Building a proposal for {r.client}</div>
            </div>
          </React.Fragment>
        )}
        <button onClick={() => setOpen(false)} style={{ width:32, height:32, borderRadius:8, border:'1px solid rgba(75,85,99,0.7)', background:'rgba(255,255,255,0.04)', color:'rgb(209,213,219)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-xmark" style={{ width:13, height:13 }} />
        </button>
      </div>

      {showDeck && (
        <div style={{ flex:1, minHeight:0, background:'rgb(15,14,22)' }}>
          <iframe src={deckHref} style={{ width:'100%', height:'100%', border:'none', display:'block' }} title="Proposal" />
        </div>
      )}

      {!showDeck && (
      <React.Fragment>
        <div ref={scrollRef} style={{ flex:1, overflowY:'auto' }}>
          <div style={{ maxWidth:920, margin:'0 auto', padding:'40px 28px 80px' }}>

            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.5)', borderRadius:12, marginBottom:28, animation:'ipf-rise 400ms ease-out' }}>
              <div style={{ width:40, height:40, borderRadius:9999, background:`linear-gradient(135deg, ${pm.brand} 0%, ${pm.bright} 240%)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontWeight:700, fontSize:13, color:'#fff' }}>{r.initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)' }}>
                  {r.client}{r.sub && r.provider==='Halo' && <span style={{ color:'rgb(163,163,163)', fontWeight:400 }}> · {r.sub}</span>}
                </div>
                <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>{r.aum} · {r.risk} · {r.scope} in scope</div>
              </div>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:11, padding:'5px 10px', borderRadius:6, background:`${pm.accent}33`, color:pm.bright, border:`1px solid ${pm.accent}73` }}>{r.provider.toUpperCase()} · FIT {r.fit}</div>
            </div>

            <div style={sectionStyle}>Analysis in progress</div>
            <div style={{ marginBottom:32 }}>
              {lines.slice(0, streamIdx + 1).map((line, i) => (
                <IPFStreamLine key={i} line={line} delay={i === 0 ? 200 : 0} bright={pm.bright} onComplete={() => setStreamIdx(prev => Math.max(prev, i + 1))} />
              ))}
            </div>

            {showRat && (
              <div style={{ marginBottom:28, animation:'ipf-rise 500ms ease-out' }}>
                <div style={sectionStyle}>{isPayoff ? 'Why protective investments' : 'Why act on this'}</div>
                <div style={{ paddingTop:8, borderTop:'1px solid rgba(75,85,99,0.5)', display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'24px 32px' }}>
                  {pillars.map((p, i) => (
                    <div key={i} style={{ display:'flex', gap:14, animation:`ipf-rise 500ms ease-out ${i*100}ms both` }}>
                      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:38, lineHeight:1, color:`${pm.accent}80`, fontVariantNumeric:'tabular-nums' }}>{p.num}</div>
                      <div style={{ flex:1, minWidth:0, paddingTop:4 }}>
                        <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:'rgb(249,250,251)', marginBottom:6 }}>{p.title}</div>
                        <div style={{ fontFamily:'Inter', fontSize:12.5, color:'rgb(163,163,163)', lineHeight:1.55 }}>{p.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showScen && isPayoff && (
              <div style={{ marginBottom:28, animation:'ipf-rise 500ms ease-out' }}>
                <div style={sectionStyle}>Protected vs. unprotected — {r.product}</div>
                <div style={{ paddingTop:8, borderTop:'1px solid rgba(75,85,99,0.5)' }}>
                  <div style={{ fontFamily:'Inter', fontSize:12.5, color:'rgb(209,213,219)', lineHeight:1.55, marginBottom:14 }}>
                    Modeled outcomes on the {r.scope} sleeve under {r.term}. The proposal includes a full payoff illustration.
                  </div>
                  <div style={{ border:'1px solid rgba(75,85,99,0.5)', borderRadius:12, overflow:'hidden' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', background:'rgba(255,255,255,0.03)', fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.04em', color:'rgb(163,163,163)', textTransform:'uppercase' }}>
                      <div style={{ padding:'11px 16px' }}>Market scenario</div>
                      <div style={{ padding:'11px 16px', textAlign:'right' }}>Unprotected</div>
                      <div style={{ padding:'11px 16px', textAlign:'right' }}>With {r.provider}</div>
                    </div>
                    {scenarios.map((s, i) => (
                      <div key={i} style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', alignItems:'center', borderTop:'1px solid rgba(75,85,99,0.4)', fontFamily:'Inter', fontSize:13.5 }}>
                        <div style={{ padding:'12px 16px', color:'rgb(229,231,235)' }}>{s.move}</div>
                        <div style={{ padding:'12px 16px', textAlign:'right', color:'rgb(163,163,163)', fontVariantNumeric:'tabular-nums' }}>{s.un}</div>
                        <div style={{ padding:'12px 16px', textAlign:'right', fontWeight:600, fontVariantNumeric:'tabular-nums', color: s.good ? 'rgb(110,231,183)' : pm.bright }}>{s.pr}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showScen && !isPayoff && (
              <div style={{ marginBottom:28, animation:'ipf-rise 500ms ease-out' }}>
                <div style={sectionStyle}>What changes</div>
                <div style={{ paddingTop:8, borderTop:'1px solid rgba(75,85,99,0.5)', display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    `Reposition ${r.scope} into ${r.product} (${r.term}).`,
                    `Brings ${r.client} back in line with the household\u2019s investment policy.`,
                    `The proposal includes a before / after allocation and a 12-month projection.`,
                  ].map((t,i)=>(
                    <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.5)', borderRadius:10 }}>
                      <i className="fa-solid fa-circle-check" style={{ color:pm.bright, fontSize:13, marginTop:2 }} />
                      <span style={{ fontFamily:'Inter', fontSize:13.5, color:'rgb(229,231,235)', lineHeight:1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCta && (
              <div style={{ padding:'22px 24px', background:`linear-gradient(135deg, ${pm.accent}24 0%, ${pm.accent}0a 100%)`, border:`1px solid ${pm.accent}73`, borderRadius:14, display:'flex', alignItems:'center', gap:18, animation:'ipf-rise 500ms ease-out 200ms both' }}>
                <div style={{ width:48, height:48, borderRadius:12, flexShrink:0, background:`${pm.accent}40`, border:`1px solid ${pm.accent}80`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className="fa-solid fa-file-powerpoint" style={{ width:20, height:20, color:pm.bright }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:15, color:'rgb(249,250,251)', marginBottom:4 }}>Client proposal ready</div>
                  <div style={{ fontFamily:'Inter', fontSize:12.5, color:'rgb(163,163,163)' }}>Illustrated {r.product} proposal prepared for {r.client}</div>
                </div>
                <button onClick={() => setShowDeck(true)} style={{ fontFamily:'Inter', fontWeight:600, fontSize:13, padding:'12px 20px', borderRadius:8, cursor:'pointer', background:pm.accent, border:`1px solid ${pm.bright}`, color:'#fff', display:'inline-flex', alignItems:'center', gap:8, boxShadow:`0 4px 12px ${pm.accent}66` }}>
                  Open Proposal <i className="fa-solid fa-arrow-right" style={{ width:11, height:11 }} />
                </button>
              </div>
            )}

            {showCta && followUps.length > 0 && (
              <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:14 }}>
                {followUps.map((m, i) => m.role === 'user' ? (
                  <div key={i} style={{ alignSelf:'flex-end', maxWidth:'80%', padding:'12px 16px', background:`${pm.accent}1f`, border:`1px solid ${pm.accent}59`, borderRadius:'12px 12px 2px 12px', fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.5, animation:'ipf-rise 300ms ease-out' }}>{m.text}</div>
                ) : (
                  <div key={i} style={{ alignSelf:'flex-start', maxWidth:'85%', padding:'12px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.55)', borderRadius:'12px 12px 12px 2px', fontFamily:'Inter', fontSize:14, color:'rgb(229,231,235)', lineHeight:1.6, animation:'ipf-rise 300ms ease-out' }}>
                    {m.streaming && !m.text ? (
                      <span style={{ display:'inline-flex', gap:4, alignItems:'center', color:'rgb(163,163,163)' }}>
                        <span style={{ width:6, height:6, borderRadius:9999, background:pm.bright, animation:'ipf-blink 1s infinite' }} />
                        <span style={{ width:6, height:6, borderRadius:9999, background:pm.bright, animation:'ipf-blink 1s infinite 0.15s' }} />
                        <span style={{ width:6, height:6, borderRadius:9999, background:pm.bright, animation:'ipf-blink 1s infinite 0.3s' }} />
                      </span>
                    ) : m.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showCta && (
          <div style={{ flexShrink:0, borderTop:'1px solid rgba(75,85,99,0.5)', background:'rgba(12,12,18,0.7)', backdropFilter:'blur(8px)', padding:'14px 28px', animation:'ipf-rise 400ms ease-out 600ms both' }}>
            <div style={{ maxWidth:920, margin:'0 auto' }}>
              {followUps.length === 0 && (
                <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                  {(isPayoff ? ['How do I explain the cap to the client?', 'What if they need liquidity early?', 'How does this compare to an options collar?'] : ['What\u2019s the tax impact?', 'Why this provider over the others?', 'How long to implement?']).map((s, i) => (
                    <button key={i} onClick={() => setDraft(s)} style={{ fontFamily:'Inter', fontSize:11.5, padding:'5px 10px', borderRadius:9999, cursor:'pointer', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(75,85,99,0.6)', color:'rgb(209,213,219)' }}>{s}</button>
                  ))}
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.7)', borderRadius:12 }}>
                <i className="fa-solid fa-comment-dots" style={{ width:14, height:14, color:'rgb(163,163,163)' }} />
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }} placeholder={`Ask a follow-up about ${r.client}\u2019s proposal…`} disabled={busy} style={{ flex:1, minWidth:0, background:'transparent', border:'none', outline:'none', fontFamily:'Inter', fontSize:13.5, color:'rgb(249,250,251)' }} />
                <button onClick={handleAsk} disabled={busy || !draft.trim()} style={{ width:32, height:32, borderRadius:8, cursor: busy || !draft.trim() ? 'default' : 'pointer', background: busy || !draft.trim() ? 'rgba(75,85,99,0.4)' : pm.accent, border: busy || !draft.trim() ? '1px solid rgba(75,85,99,0.6)' : `1px solid ${pm.bright}`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', opacity: busy || !draft.trim() ? 0.6 : 1 }}>
                  <i className={`fa-solid fa-${busy ? 'circle-notch fa-spin' : 'arrow-up'}`} style={{ width:13, height:13 }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
      )}
    </div>
  );
}

window.InsightProposalFlow = InsightProposalFlow;
