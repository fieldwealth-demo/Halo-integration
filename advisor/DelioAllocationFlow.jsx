/* DelioAllocationFlow — Flow A, new allocation ("good fit" row).
   Feed row → ranked client fit (LLM-style scan) → the client's own detail page
   with the opportunity on the side → Execute → LLM rationale for that client →
   proposal deck the client approves on the last slide → Delio, where the
   commitment is made → back to the Halo home feed.
   Triggers: 'delio:open' (scan), 'delio:execute' { client } (rationale). */

const DF = {
  ink:'rgb(249,250,251)', ink2:'rgb(229,231,235)', muted:'rgb(163,163,163)', dim:'rgb(107,114,128)',
  border:'rgba(75,85,99,0.5)', borderHard:'rgba(75,85,99,0.75)', card:'rgba(255,255,255,0.03)',
  green:'rgb(35,89,255)', greenBr:'rgb(140,175,255)',
  delio:'rgb(56,189,248)', delioSoft:'rgba(56,189,248,0.10)',
  rail:'rgb(196,181,253)', amber:'rgb(245,200,90)', red:'rgb(248,113,113)',
};

const DF_FUND = {
  name:'Helm Private Markets Fund X', sponsor:'Impact Company IV', min:100000,
  structure:'Evergreen fund · multi-asset', close:'Initial close 1 Dec', target:'12% target return',
  fees:'1% initial · 2% AMC · 10% perf over 8% hurdle',
  img:'assets/helm-fund-x.png',
};

const DF_CLIENTS = [
  { id:'holloway', name:'Margaret Holloway', tier:'Tier 1', aum:'$18.4M', score:96, commit:750000,
    alts:4, altsTarget:15, cash:'$1.24M', cashAvail:420000,
    reasons:['Alts 4% vs 15% IPS target','$1.24M idle cash, 61 days','No capital calls due before Q2'],
    why:[
      { h:'Why her', b:'Margaret is the most underweight alternatives of anyone in the book — 4% against a 15% policy target, a gap that has been open four quarters. She is 61 years old with no drawdown planned before 2031, so a lock-up costs her nothing she needs.' },
      { h:'Why it matters to her', b:'$1.24M has been sitting in the sweep for 61 days earning below her long-term return assumption. That cash is the single largest drag on the plan right now, and she has raised it in each of the last two reviews.' },
      { h:'What she gains', b:'A $750,000 commitment closes two-thirds of the alternatives gap in one step, adds a return stream that is not correlated to the equity sleeve she is heavy in, and still leaves $490K of liquid cash for taxes and gifting.' },
    ] },
  { id:'young', name:'David Young', tier:'Tier 1', aum:'$14.2M', score:92, commit:500000,
    alts:6, altsTarget:12, cash:'$840K', cashAvail:500000,
    reasons:['Alts 6% vs 12% IPS target','Cash covers the full commitment','Accredited, docs current'],
    sells:[] },
  { id:'watson', name:'Watson Family Trust', tier:'Tier 1', aum:'$27.1M', score:90, commit:1000000,
    alts:9, altsTarget:20, cash:'$2.41M', cashAvail:900000,
    reasons:['Alts 9% vs 20% IPS target','Trust permits illiquids to 25%','NVDA trim already approved'],
    sells:[{ tkr:'NVDA', name:'NVIDIA Corp', amt:100000, gain:71000, tax:16898, settle:'T+1' }] },
  { id:'raghunathan', name:'Priya Raghunathan', tier:'Tier 2', aum:'$9.6M', score:87, commit:250000,
    alts:2, altsTarget:10, cash:'$610K', cashAvail:250000,
    reasons:['Alts 2% vs 10% IPS target','Asked for private markets in Q4 review','No liquidity needs flagged'],
    sells:[] },
  { id:'okonkwo', name:'Okonkwo Household', tier:'Tier 2', aum:'$11.3M', score:84, commit:300000,
    alts:5, altsTarget:12, cash:'$390K', cashAvail:180000,
    reasons:['Impact mandate matches fund focus','Underweight alts by 7pts','Tax-deferred sleeve can fund'],
    sells:[{ tkr:'VTEB', name:'Vanguard Tax-Exempt Bond', amt:120000, gain:1800, tax:428, settle:'T+1' }] },
  { id:'sterling', name:'Sterling Bequest Trust', tier:'Tier 1', aum:'$22.8M', score:81, commit:600000,
    alts:11, altsTarget:18, cash:'$1.05M', cashAvail:600000,
    reasons:['Long horizon, no distributions until 2031','Cash covers commitment','Two existing Delio subscriptions'],
    sells:[] },
];
/* Margaret's funding detail — the flow's worked example. */
DF_CLIENTS[0].sells = [
  { tkr:'AGG', name:'iShares Core US Aggregate', amt:180000, gain:-4200, tax:0, settle:'T+1' },
  { tkr:'VOO', name:'Vanguard S&P 500 ETF',      amt:150000, gain:62400, tax:14856, settle:'T+1' },
];

const DF_USD = (n) => '$' + Math.round(n).toLocaleString('en-US');

const DF_STEPS = [
  { id:'scan',   label:'Fit' },
  { id:'why',    label:'Rationale' },
  { id:'deck',   label:'Proposal' },
  { id:'portal', label:'Subscribe' },
];

function DfOwner({ who }) {
  const map = {
    Halo:  { c:DF.greenBr, bg:'rgba(35,89,255,0.16)', b:'rgba(35,89,255,0.5)' },
    Delio:  { c:DF.delio,   bg:DF.delioSoft,          b:'rgba(56,189,248,0.45)' },
    Client: { c:DF.rail,    bg:'rgba(167,139,250,0.12)', b:'rgba(167,139,250,0.4)' },
    'Custodian · Bank': { c:DF.muted, bg:'rgba(255,255,255,0.05)', b:DF.border },
  };
  const t = map[who] || map.Halo;
  return (
    <span style={{ fontFamily:'Inter', fontSize:10, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase',
      padding:'3px 8px', borderRadius:5, color:t.c, background:t.bg, border:`1px solid ${t.b}`, whiteSpace:'nowrap' }}>{who}</span>
  );
}

function DfLine({ line, delay, onDone }) {
  const [shown, setShown] = React.useState('');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => { i++; setShown(line.text.slice(0, i)); if (i >= line.text.length) { clearInterval(id); setDone(true); onDone && onDone(); } }, line.type === 'thinking' ? 9 : 5);
    }, delay);
    return () => clearTimeout(t);
  }, []);
  if (line.type === 'user') return (
    <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
      <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:'12px 12px 4px 12px', background:'rgba(35,89,255,0.16)', border:'1px solid rgba(35,89,255,0.4)', fontFamily:'Inter', fontSize:13.5, color:DF.ink }}>{line.text}</div>
    </div>
  );
  if (line.type === 'thinking') return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', fontFamily:'Inter', fontSize:13, color:DF.muted, fontStyle:'italic' }}>
      <i className={`fa-solid fa-${done ? 'check' : 'spinner fa-spin'}`} style={{ width:11, color: done ? DF.greenBr : DF.muted }} />
      <span>{shown}</span>
    </div>
  );
  return (
    <div style={{ padding:'12px 16px', marginTop:8, background:DF.card, border:`1px solid ${DF.border}`, borderRadius:10, fontFamily:'Inter', fontSize:14, color:DF.ink2, lineHeight:1.6 }}>
      {line.h && <div style={{ fontFamily:'Inter', fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:DF.greenBr, marginBottom:7 }}>{line.h}</div>}
      {shown}{!done && <span style={{ display:'inline-block', width:7, height:14, background:DF.greenBr, marginLeft:2, verticalAlign:'middle', animation:'df-blink 1s infinite' }} />}
    </div>
  );
}

function DfCard({ title, owner, children, accent }) {
  return (
    <section style={{ border:`1px solid ${accent || DF.border}`, borderRadius:12, background:DF.card, overflow:'hidden', animation:'df-rise 320ms ease-out both' }}>
      <header style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', borderBottom:`1px solid ${DF.border}` }}>
        <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:DF.ink2 }}>{title}</div>
        <span style={{ flex:1 }} />
        {owner && <DfOwner who={owner} />}
      </header>
      <div style={{ padding:16 }}>{children}</div>
    </section>
  );
}

function DfKV({ rows, cols }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols || rows.length}, minmax(0,1fr))`, gap:1, background:DF.border, border:`1px solid ${DF.border}`, borderRadius:10, overflow:'hidden' }}>
      {rows.map(r => (
        <div key={r.k} style={{ padding:'12px 14px', background:'rgb(17,20,27)' }}>
          <div style={{ fontFamily:'Inter', fontSize:10, letterSpacing:'0.07em', textTransform:'uppercase', color:DF.dim }}>{r.k}</div>
          <div style={{ fontFamily:'Inter', fontSize:17, fontWeight:600, color:r.tone || DF.ink, marginTop:5, fontVariantNumeric:'tabular-nums' }}>{r.v}</div>
          {r.sub && <div style={{ fontFamily:'Inter', fontSize:11, color:DF.muted, marginTop:3 }}>{r.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function DfIpsBar({ from, to, target }) {
  const scale = Math.max(target, to) * 1.25;
  const pct = (v) => `${(v / scale) * 100}%`;
  return (
    <div>
      <div style={{ position:'relative', height:26, borderRadius:6, background:'rgba(255,255,255,0.04)', border:`1px solid ${DF.border}`, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, width:pct(to), background:'rgba(35,89,255,0.35)' }} />
        <div style={{ position:'absolute', inset:0, width:pct(from), background:'rgba(255,255,255,0.10)' }} />
        <div style={{ position:'absolute', top:0, bottom:0, left:pct(target), width:2, background:DF.amber }} />
      </div>
      <div style={{ display:'flex', gap:16, marginTop:8, fontFamily:'Inter', fontSize:11.5, color:DF.muted, flexWrap:'wrap' }}>
        <span>Now {from}%</span>
        <span style={{ color:DF.greenBr }}>After {to}%</span>
        <span style={{ color:DF.amber }}>IPS target {target}%</span>
      </div>
    </div>
  );
}

/* Composer shared by both flows — the stream stays a conversation, so the
   advisor can push back on the reasoning without leaving the flow. */
function DfComposer({ placeholder, onAsk, busy }) {
  const [text, setText] = React.useState('');
  const send = () => { const t = text.trim(); if (!t || busy) return; setText(''); onAsk(t); };
  return (
    <div style={{ borderTop:`1px solid ${DF.border}`, padding:'14px 26px 18px', background:'rgba(9,13,20,0.6)' }}>
      <div style={{ maxWidth:880, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, padding:'10px 12px', borderRadius:12, border:`1px solid ${DF.borderHard}`, background:'rgba(255,255,255,0.03)' }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1} placeholder={placeholder}
            style={{ flex:1, minWidth:0, resize:'none', border:'none', outline:'none', background:'transparent', color:DF.ink, fontFamily:'Inter', fontSize:13.5, lineHeight:1.5, padding:'6px 4px', maxHeight:120 }} />
          <button onClick={send} disabled={busy} style={{ width:32, height:32, borderRadius:8, flexShrink:0, cursor: busy ? 'default' : 'pointer',
            background: busy ? 'rgba(255,255,255,0.04)' : 'rgba(35,89,255,0.25)', border:`1px solid ${busy ? DF.borderHard : 'rgba(35,89,255,0.6)'}`, color: busy ? DF.dim : DF.greenBr }}>
            <i className={`fa-solid fa-${busy ? 'spinner fa-spin' : 'arrow-up'}`} style={{ fontSize:12 }} />
          </button>
        </div>
        <div style={{ fontFamily:'Inter', fontSize:10.5, color:DF.dim, marginTop:8, textAlign:'center' }}>Halo AI can take actions on your behalf · review results before sending to clients</div>
      </div>
    </div>
  );
}

/* Ask a follow-up against the live flow context. Falls back to a written
   answer if the model is unavailable. */
async function dfAsk(question, context) {
  try {
    return await window.claude.complete({ messages:[{ role:'user', content:
      `You are Halo AI, speaking to a financial advisor inside a private-markets workflow. Context: ${context}. Answer the advisor's question in 2-4 plain sentences, specific to this client and these numbers, no preamble, no bullet lists, no jargon.\n\nQuestion: ${question}` }] });
  } catch (e) {
    return 'I can\u2019t reach the model right now. Based on the figures already on screen, the funding plan holds: the cash and the two sales cover the commitment inside the wire deadline, and the tax cost is the only real trade-off to discuss with the client.';
  }
}

function DelioAllocationFlow() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState('scan');
  const [streamIdx, setStreamIdx] = React.useState(0);
  const [showList, setShowList] = React.useState(false);
  const [sel, setSel] = React.useState('holloway');
  const [showAll, setShowAll] = React.useState(false);
  const [maxIdx, setMaxIdx] = React.useState(0);
  const [extra, setExtra] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const onOpen = () => { setOpen(true); setStep('scan'); setStreamIdx(0); setShowList(false); setShowAll(false); setMaxIdx(0); setExtra([]); };
    const onExecute = (e) => {
      const name = (e.detail || {}).client;
      const c = DF_CLIENTS.find(x => x.name === name) || DF_CLIENTS[0];
      setSel(c.id); setStreamIdx(0); setStep('why'); setMaxIdx(1); setExtra([]); setOpen(true);
    };
    const onInsight = (e) => {
      const id = e.detail && e.detail.id;
      const m = (window.FIELD_INSIGHTS || []).find(x => x.id === id);
      if (!m || m.provider !== 'Helm') return;
      const c = DF_CLIENTS.find(x => x.name === m.client) || DF_CLIENTS[0];
      setSel(c.id); setStreamIdx(0); setStep('why'); setMaxIdx(1); setExtra([]); setOpen(true);
    };
    window.addEventListener('insight:open', onInsight);
    const onMsg = (e) => { if (e.data && e.data.type === 'helmx:approved') setStep('portal'); };
    window.addEventListener('delio:open', onOpen);
    window.addEventListener('delio:execute', onExecute);
    window.addEventListener('message', onMsg);
    return () => { window.removeEventListener('delio:open', onOpen); window.removeEventListener('delio:execute', onExecute); window.removeEventListener('insight:open', onInsight); window.removeEventListener('message', onMsg); };
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  React.useEffect(() => { const i = DF_STEPS.findIndex(s => s.id === step); setMaxIdx(m => Math.max(m, i)); if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [step]);

  if (!open) return null;

  const c = DF_CLIENTS.find(x => x.id === sel) || DF_CLIENTS[0];
  const sells = c.sells || [];
  const sellTotal = sells.reduce((a, s) => a + s.amt, 0);
  const taxTotal = sells.reduce((a, s) => a + s.tax, 0);
  const aumNum = parseFloat(c.aum.replace(/[^0-9.]/g, '')) * 1e6;
  const hhPct = ((c.commit / aumNum) * 100).toFixed(1);
  const altsAfter = +(c.alts + (c.commit / aumNum) * 100).toFixed(1);
  const stepIdx = DF_STEPS.findIndex(s => s.id === step);

  const scanLines = [
    { type:'thinking', text:'Reading the Helm Private Markets Fund X offering from Delio — minimum, structure, close date, eligibility…' },
    { type:'thinking', text:'Screening 121 eligible households: accreditation, IPS alts band, liquidity needs…' },
    { type:'thinking', text:'Checking committed-but-uncalled exposure and the capital-call calendar…' },
    { type:'response', text:'14 of your 121 eligible clients are a fit. The top six are underweight alternatives against their IPS, hold idle cash, and have no capital calls due before Q2. Nine can fund the full commitment from cash alone; five would need a sale.' },
  ];
  const whyBase = c.why || [
    { h:'Why this client', b:`${c.name} runs alternatives at ${c.alts}% against a ${c.altsTarget}% policy target and holds ${c.cash} in cash with no near-term use.` },
    { h:'Why it matters', b:'The gap is a persistent drag on the plan, and the cash is earning below the long-term return assumption used in their projections.' },
    { h:'What they gain', b:`A ${DF_USD(c.commit)} commitment moves alternatives to ${altsAfter}% and adds a return stream uncorrelated to the equity sleeve.` },
  ];
  const whyLines = [
    { type:'thinking', text:`Pulling ${c.name}'s holdings, IPS bands, and cash from the Halo custodian feed…` },
    { type:'thinking', text:'Checking suitability: accreditation, illiquidity tolerance, planned withdrawals, existing commitments…' },
    { type:'thinking', text:`Sizing the commitment against the alternatives band and the tax cost of raising cash…` },
    ...whyBase.map(w => ({ type:'response', h:w.h, text:w.b })),
  ];

  const deckRows = sells.map(s => `<tr><td>${s.tkr} · ${s.name}</td><td class="num">${DF_USD(s.amt)}</td><td class="num${s.gain < 0 ? ' green' : ''}">${s.gain < 0 ? '−' : '+'}${DF_USD(Math.abs(s.gain))}</td><td class="num">${DF_USD(s.tax)}</td><td class="num">${s.settle}</td></tr>`).join('');
  const deckSrc = 'advisor/Helm Fund X Proposal.html?' + new URLSearchParams({
    client:c.name, commit:DF_USD(c.commit), tax: taxTotal ? DF_USD(taxTotal) : '$0', cash:c.cash,
    alts:String(c.alts), target:String(c.altsTarget), after:String(altsAfter), hh:hhPct,
    source: sellTotal ? `${DF_USD(c.cashAvail)} cash<br />+ ${DF_USD(sellTotal)} sale` : 'Cash sweep',
    rows: encodeURIComponent(deckRows || '<tr><td>No sale required — funded from the cash sweep</td><td class="num">—</td><td class="num">—</td><td class="num">$0</td><td class="num">—</td></tr>'),
  }).toString();

  const btn = (primary) => ({
    height:36, padding:'0 16px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap',
    fontFamily:'Inter', fontSize:13, fontWeight:primary ? 600 : 500,
    background: primary ? 'rgba(35,89,255,0.22)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${primary ? 'rgba(35,89,255,0.6)' : DF.borderHard}`,
    color: primary ? DF.greenBr : DF.ink2, display:'inline-flex', alignItems:'center', gap:9,
  });
  const note = { fontFamily:'Inter', fontSize:12, color:DF.muted, lineHeight:1.6 };
  const closeHome = () => { setOpen(false); setStep('scan'); window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'assistant' } })); };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(12,12,18,0.94)', backdropFilter:'blur(20px) saturate(140%)', WebkitBackdropFilter:'blur(20px) saturate(140%)', display:'flex', flexDirection:'column', animation:'df-fade 240ms ease-out' }}>
      <style>{`
        @keyframes df-fade { from { opacity:0 } to { opacity:1 } }
        @keyframes df-blink { 0%,49% { opacity:1 } 50%,100% { opacity:0 } }
        @keyframes df-rise { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
        .df-row:hover { border-color:rgba(35,89,255,0.55) !important; background:rgba(35,89,255,0.06) !important }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 26px', borderBottom:`1px solid ${DF.border}` }}>
        <div style={{ width:36, height:36, borderRadius:8, flexShrink:0, background:'rgba(56,189,248,0.14)', border:'1px solid rgba(56,189,248,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:10, color:DF.delio }}>HELM</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:DF.ink }}>{DF_FUND.name}{step === 'scan' ? ' · new allocation' : ` · ${c.name}`}</div>
          <div style={{ fontFamily:'Inter', fontSize:11.5, color:DF.muted }}>
            {step === 'portal' ? 'Delio · fund subscription portal' : `Sponsored by ${DF_FUND.sponsor} · minimum ${DF_USD(DF_FUND.min)} · subscription runs in Delio`}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
          {DF_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { if (i <= maxIdx) setStep(s.id); }} style={{
              height:26, padding:'0 10px', borderRadius:9999, cursor: i <= maxIdx ? 'pointer' : 'default',
              fontFamily:'Inter', fontSize:11, fontWeight: i === stepIdx ? 600 : 500,
              background: i === stepIdx ? 'rgba(35,89,255,0.2)' : 'transparent',
              border:`1px solid ${i === stepIdx ? 'rgba(35,89,255,0.55)' : DF.border}`,
              color: i === stepIdx ? DF.greenBr : (i <= maxIdx ? DF.ink2 : DF.dim),
            }}>{i + 1}. {s.label}</button>
          ))}
        </div>
        <button onClick={() => setOpen(false)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${DF.borderHard}`, background:'rgba(255,255,255,0.04)', color:DF.ink2, cursor:'pointer' }}>
          <i className="fa-solid fa-xmark" style={{ fontSize:13 }} />
        </button>
      </div>

      {step === 'deck' ? (
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 26px', borderBottom:`1px solid ${DF.border}` }}>
            <button onClick={() => setStep('why')} style={btn(false)}><i className="fa-solid fa-chevron-left" style={{ fontSize:11 }} />Rationale</button>
            <div style={{ ...note, flex:1 }}>Shared with {c.name}. They approve on the last slide, which opens the fund's subscription in Delio.</div>
            <button onClick={() => window.open(deckSrc, '_blank')} style={btn(false)}><i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize:11 }} />Full screen</button>
          </div>
          <div style={{ flex:1, minHeight:0, background:'rgb(10,14,22)' }}>
            <iframe src={deckSrc} title="Proposal" style={{ width:'100%', height:'100%', border:'none', display:'block' }} />
          </div>
        </div>
      ) : step === 'portal' ? (
        <div style={{ flex:1, minHeight:0, padding:'16px 26px 26px' }}>
          {window.DelioPortal ? React.createElement(window.DelioPortal, { client:c.name, commit:c.commit, fund:DF_FUND, onDone:() => { const p = { client:c.name, commit:c.commit, at:Date.now() }; window.HALO_HELMX = p; try { localStorage.setItem('halo.helmx', JSON.stringify(p)); } catch (e) {} window.dispatchEvent(new CustomEvent('helmx:pending')); setOpen(false); setStep('scan'); window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'notifications' } })); } }) : null}
        </div>
      ) : (
        <div ref={scrollRef} style={{ flex:1, minHeight:0, overflowY:'auto', padding:'24px 26px 40px' }}>
          <div style={{ maxWidth:880, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

            {step === 'scan' && (
              <React.Fragment>
                <div>
                  {scanLines.slice(0, streamIdx + 1).map((l, i) => (
                    <DfLine key={i} line={l} delay={i === 0 ? 120 : 0}
                      onDone={() => { if (i === streamIdx) { if (i + 1 < scanLines.length) setStreamIdx(i + 1); else setTimeout(() => setShowList(true), 250); } }} />
                  ))}
                </div>
                {showList && (
                  <DfCard title="Ranked fit · 14 clients" owner="Halo">
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {(showAll ? DF_CLIENTS : DF_CLIENTS.slice(0, 4)).map(x => (
                        <div key={x.id} className="df-row"
                          onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('client:open', { detail:{ client:x.name, highlight:'helmx' } })); }}
                          style={{ display:'grid', gridTemplateColumns:'44px minmax(0,1fr) auto', gap:14, alignItems:'center', padding:'13px 14px', borderRadius:10, border:`1px solid ${DF.border}`, background:'rgba(255,255,255,0.02)', cursor:'pointer', transition:'all .14s ease' }}>
                          <div style={{ width:44, height:44, borderRadius:9, background:'rgba(35,89,255,0.14)', border:'1px solid rgba(35,89,255,0.4)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontFamily:'Inter', fontSize:15, fontWeight:700, color:DF.greenBr, lineHeight:1 }}>{x.score}</span>
                            <span style={{ fontFamily:'Inter', fontSize:8, letterSpacing:'0.08em', color:DF.muted, marginTop:2 }}>FIT</span>
                          </div>
                          <div style={{ minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                              <span style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:DF.ink }}>{x.name}</span>
                              <span style={{ fontFamily:'Inter', fontSize:11.5, color:DF.muted }}>{x.aum} · {x.tier}</span>
                            </div>
                            <div style={{ display:'flex', gap:6, marginTop:7, flexWrap:'wrap' }}>
                              {x.reasons.map(rr => (
                                <span key={rr} style={{ fontFamily:'Inter', fontSize:10.5, color:DF.ink2, padding:'2px 8px', border:`1px solid ${DF.border}`, borderRadius:9999, background:'rgba(255,255,255,0.03)' }}>{rr}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:DF.ink, fontVariantNumeric:'tabular-nums' }}>{DF_USD(x.commit)}</div>
                            <div style={{ fontFamily:'Inter', fontSize:11, color: (x.sells || []).length ? DF.amber : DF.greenBr, marginTop:3 }}>{(x.sells || []).length ? 'Needs a sale' : 'Cash covers it'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!showAll && (
                      <button onClick={() => setShowAll(true)} style={{ ...btn(false), marginTop:12, height:32 }}>Show 2 more of the top six<i className="fa-solid fa-chevron-down" style={{ fontSize:9 }} /></button>
                    )}
                    <p style={{ ...note, marginTop:14 }}>Open a client to see the opportunity on their record, alongside their holdings and cash.</p>
                  </DfCard>
                )}
                {extra.map((l, i) => <DfLine key={'x' + i} line={l} delay={0} />)}
              </React.Fragment>
            )}

            {step === 'why' && (
              <React.Fragment>
                <div>
                  {whyLines.slice(0, streamIdx + 1).map((l, i) => (
                    <DfLine key={i} line={l} delay={i === 0 ? 120 : 0}
                      onDone={() => { if (i === streamIdx && i + 1 < whyLines.length) setStreamIdx(i + 1); }} />
                  ))}
                </div>
                {streamIdx >= whyLines.length - 1 && (
                  <React.Fragment>
                    <DfCard title="What the commitment takes" owner="Halo">
                      <DfKV cols={4} rows={[
                        { k:'Commitment', v:DF_USD(c.commit), sub:`${hhPct}% of household` },
                        { k:'Available cash', v:DF_USD(c.cashAvail), sub:`of ${c.cash} total` },
                        { k:'Must be sold', v: sellTotal ? DF_USD(sellTotal) : '—', tone: sellTotal ? DF.amber : DF.greenBr },
                        { k:'Tax cost', v: taxTotal ? DF_USD(taxTotal) : '$0', tone: taxTotal ? DF.amber : DF.greenBr, sub: taxTotal ? 'Long-term, federal + state' : 'No sale required' },
                      ]} />
                      {sells.length > 0 && (
                        <div style={{ marginTop:16, border:`1px solid ${DF.border}`, borderRadius:10, overflow:'hidden' }}>
                          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 110px 110px 100px 80px', gap:12, padding:'10px 14px', background:'rgba(255,255,255,0.03)', fontFamily:'Inter', fontSize:10, letterSpacing:'0.07em', textTransform:'uppercase', color:DF.dim }}>
                            <span>Position</span><span style={{ textAlign:'right' }}>Sell</span><span style={{ textAlign:'right' }}>Realized gain</span><span style={{ textAlign:'right' }}>Tax</span><span style={{ textAlign:'right' }}>Settles</span>
                          </div>
                          {sells.map(s => (
                            <div key={s.tkr} style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 110px 110px 100px 80px', gap:12, padding:'12px 14px', borderTop:`1px solid ${DF.border}`, fontFamily:'Inter', fontSize:12.5, color:DF.ink2, fontVariantNumeric:'tabular-nums' }}>
                              <span><b style={{ color:DF.ink }}>{s.tkr}</b> <span style={{ color:DF.muted }}>{s.name}</span></span>
                              <span style={{ textAlign:'right' }}>{DF_USD(s.amt)}</span>
                              <span style={{ textAlign:'right', color: s.gain < 0 ? DF.greenBr : DF.ink2 }}>{s.gain < 0 ? '−' : '+'}{DF_USD(Math.abs(s.gain))}</span>
                              <span style={{ textAlign:'right' }}>{DF_USD(s.tax)}</span>
                              <span style={{ textAlign:'right', color:DF.muted }}>{s.settle}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop:16 }}>
                        <div style={{ fontFamily:'Inter', fontSize:11, letterSpacing:'0.07em', textTransform:'uppercase', color:DF.dim, marginBottom:9 }}>Alternatives against the IPS target</div>
                        <DfIpsBar from={c.alts} to={altsAfter} target={c.altsTarget} />
                      </div>
                    </DfCard>
                    <div style={{ display:'flex', gap:10 }}>
                      <span style={{ flex:1 }} />
                      <button onClick={() => setStep('deck')} style={btn(true)}>Create proposal<i className="fa-solid fa-arrow-right" style={{ fontSize:11 }} /></button>
                    </div>
                    {extra.map((l, i) => <DfLine key={'x' + i} line={l} delay={0} />)}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}

          </div>
        </div>
      )}
      {(step === 'scan' || step === 'why') && (
        <DfComposer busy={busy}
          placeholder={step === 'scan' ? 'Ask about the fit \u2014 tighten the screen, rank differently, exclude a household\u2026' : `Ask about ${c.name} \u2014 the funding, the tax cost, a different size\u2026`}
          onAsk={async (q) => {
            setExtra(x => [...x, { type:'user', text:q }]);
            setBusy(true);
            const ctx = step === 'scan'
              ? `${DF_FUND.name} is open (minimum ${DF_USD(DF_FUND.min)}, evergreen, 12% target). 14 of 121 eligible clients screened as a fit; the top six are ${DF_CLIENTS.map(x => `${x.name} (${x.aum}, fit ${x.score}, ${DF_USD(x.commit)} suggested, alts ${x.alts}% vs ${x.altsTarget}% target, cash ${x.cash})`).join('; ')}.`
              : `Client ${c.name}, household ${c.aum}, alternatives ${c.alts}% against a ${c.altsTarget}% IPS target, cash ${c.cash} with ${DF_USD(c.cashAvail)} available. Suggested commitment ${DF_USD(c.commit)} into ${DF_FUND.name}, which needs ${sellTotal ? DF_USD(sellTotal) + ' of sales costing ' + DF_USD(taxTotal) + ' in tax' : 'no sales'}. Alternatives would move to ${altsAfter}%.`;
            const answer = await dfAsk(q, ctx);
            setBusy(false);
            setExtra(x => [...x, { type:'response', text:answer }]);
            setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
          }} />
      )}
    </div>
  );
}

/* Shared with CapitalCallFlow — the funding analysis is common infrastructure. */
Object.assign(window, { DelioAllocationFlow, DF, DF_FUND, DF_CLIENTS, DF_USD, DfCard, DfKV, DfOwner, DfLine, DfIpsBar, DfComposer, dfAsk });
