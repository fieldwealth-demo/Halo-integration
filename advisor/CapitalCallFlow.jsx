/* CapitalCallFlow — Flow B, capital call (the "due" row).
   Notification → the client's record with the call on the side → the same
   funding analysis Flow A uses (shared) → a funding plan, not a proposal:
   the commitment is already binding, the only choice is what to liquidate →
   approve and execute → Delio marks it paid → back to the Halo home feed.
   Trigger: 'call:open' */

const CF = {
  ink:'rgb(249,250,251)', ink2:'rgb(229,231,235)', muted:'rgb(163,163,163)', dim:'rgb(107,114,128)',
  border:'rgba(75,85,99,0.5)', borderHard:'rgba(75,85,99,0.75)', card:'rgba(255,255,255,0.03)',
  greenBr:'rgb(140,175,255)', delio:'rgb(56,189,248)', amber:'rgb(245,200,90)', red:'rgb(248,113,113)',
};

const CF_CALL = {
  client:'Marcus Ellery', aum:'$8.9M',
  fund:'Kestermark Growth Fund (TRELLIS)', sponsor:'Kestermark Capital', ref:'F11F78',
  commitment:500000, called:250000, callNo:3, amount:125000, due:'2 Oct',
  cashAvail:38000, unfunded:125000,
  sells:[
    { tkr:'VTEB', name:'Vanguard Tax-Exempt Bond',   amt:52000, gain:900,   tax:214, settle:'T+1' },
    { tkr:'AGG',  name:'iShares Core US Aggregate',  amt:35000, gain:-1100, tax:0,   settle:'T+1' },
  ],
  rejected:[
    { tkr:'NVDA', why:'Would realize $41K of long-term gain — $9,758 of tax to raise $87K.' },
    { tkr:'VOO',  why:'Held at a gain and is the core equity sleeve; selling widens the drift.' },
    { tkr:'Cash sweep', why:'Only $38K available and $12K of it is reserved for Q4 fees.' },
  ],
};

const CF_STEPS = [{ id:'plan', label:'Funding plan' }, { id:'execute', label:'Approve & execute' }, { id:'paid', label:'Paid' }];

function CapitalCallFlow() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState('plan');
  const [streamIdx, setStreamIdx] = React.useState(0);
  const [executed, setExecuted] = React.useState(false);
  const [schwab, setSchwab] = React.useState(false);
  const [extra, setExtra] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);
  const c = CF_CALL;
  const DfCard = window.DfCard, DfKV = window.DfKV, DfLine = window.DfLine, DfOwner = window.DfOwner;
  const USD = window.DF_USD || ((n) => '$' + Math.round(n).toLocaleString('en-US'));

  React.useEffect(() => {
    const onOpen = () => { setOpen(true); setStep('plan'); setStreamIdx(0); setExecuted(false); setSchwab(false); setExtra([]); };
    window.addEventListener('call:open', onOpen);
    return () => window.removeEventListener('call:open', onOpen);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [step]);

  if (!open || !DfCard) return null;

  const sellTotal = c.sells.reduce((a, s) => a + s.amt, 0);
  const taxTotal = c.sells.reduce((a, s) => a + s.tax, 0);
  const short = c.amount - c.cashAvail;
  const stepIdx = CF_STEPS.findIndex(s => s.id === step);

  const lines = [
    { type:'thinking', text:`Reading the call notice from Delio — call 3 of ${c.fund}, ${USD(c.amount)} due ${c.due}…` },
    { type:'thinking', text:`Pulling ${c.client}'s cash, positions, and cost basis from the Halo custodian feed…` },
    { type:'thinking', text:'Ranking liquidation candidates by tax cost, tracking error, and settlement time…' },
    { type:'response', h:'What has to happen', text:`${USD(c.amount)} is due ${c.due} against a binding commitment, and only ${USD(c.cashAvail)} is available in cash. ${USD(short)} has to be raised. There is no allocation decision here — the only choice is which asset to liquidate.` },
    { type:'response', h:'The cheapest way to raise it', text:`Selling ${USD(52000)} of VTEB and ${USD(35000)} of AGG covers the shortfall for ${USD(taxTotal)} of tax. Both are close to basis, both settle T+1, and trimming the bond sleeve moves the portfolio toward its target rather than away from it.` },
  ];

  const btn = (primary) => ({
    height:36, padding:'0 16px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap',
    fontFamily:'Inter', fontSize:13, fontWeight:primary ? 600 : 500,
    background: primary ? 'rgba(35,89,255,0.22)' : 'rgba(255,255,255,0.04)',
    border:`1px solid ${primary ? 'rgba(35,89,255,0.6)' : CF.borderHard}`,
    color: primary ? CF.greenBr : CF.ink2, display:'inline-flex', alignItems:'center', gap:9,
  });
  const note = { fontFamily:'Inter', fontSize:12, color:CF.muted, lineHeight:1.6 };
  const track = (items) => (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {items.map((s, i) => {
        const tone = { done:{ c:CF.greenBr, i:'check' }, active:{ c:CF.delio, i:'spinner fa-spin' }, wait:{ c:CF.dim, i:'clock-3' } }[s.state];
        return (
          <div key={s.t} style={{ display:'grid', gridTemplateColumns:'22px minmax(0,1fr) auto', gap:12, alignItems:'start', padding:'12px 0', borderTop: i ? `1px solid ${CF.border}` : 'none' }}>
            <i className={`fa-solid fa-${tone.i}`} style={{ fontSize:11, color:tone.c, marginTop:3 }} />
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color: s.state === 'wait' ? CF.muted : CF.ink }}>{s.t}</div>
              <div style={{ ...note, fontSize:11.5, marginTop:3 }}>{s.d}</div>
            </div>
            <DfOwner who={s.owner} />
          </div>
        );
      })}
    </div>
  );
  const closeHome = () => {
    setOpen(false);
    window.FIELD_CALL_PAID = true;
    window.dispatchEvent(new CustomEvent('call:paid'));
    window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'dashboard' } }));
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(12,12,18,0.94)', backdropFilter:'blur(20px) saturate(140%)', WebkitBackdropFilter:'blur(20px) saturate(140%)', display:'flex', flexDirection:'column', animation:'cf-fade 240ms ease-out' }}>
      <style>{`@keyframes cf-fade { from { opacity:0 } to { opacity:1 } }`}</style>

      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 26px', borderBottom:`1px solid ${CF.border}` }}>
        <div style={{ width:36, height:36, borderRadius:8, flexShrink:0, background:'rgba(234,179,8,0.14)', border:'1px solid rgba(245,200,90,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-clock-3" style={{ fontSize:14, color:CF.amber }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:CF.ink }}>Capital call · {c.client}</div>
          <div style={{ fontFamily:'Inter', fontSize:11.5, color:CF.muted }}>{c.fund} · call {c.callNo} · {USD(c.amount)} due {c.due} · payment reference {c.ref}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {CF_STEPS.map((s, i) => (
            <span key={s.id} style={{
              height:26, padding:'0 10px', borderRadius:9999, display:'inline-flex', alignItems:'center',
              fontFamily:'Inter', fontSize:11, fontWeight: i === stepIdx ? 600 : 500,
              background: i === stepIdx ? 'rgba(35,89,255,0.2)' : 'transparent',
              border:`1px solid ${i === stepIdx ? 'rgba(35,89,255,0.55)' : CF.border}`,
              color: i === stepIdx ? CF.greenBr : (i < stepIdx ? CF.ink2 : CF.dim),
            }}>{`${i + 1}. ${s.label}`}</span>
          ))}
        </div>
        <button onClick={() => setOpen(false)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${CF.borderHard}`, background:'rgba(255,255,255,0.04)', color:CF.ink2, cursor:'pointer' }}>
          <i className="fa-solid fa-xmark" style={{ fontSize:13 }} />
        </button>
      </div>

      {schwab && window.CustodianTrade && (
        <div style={{ flex:1, minHeight:0, padding:'16px 26px 26px' }}>
          {React.createElement(window.CustodianTrade, {
            client:c.client, account:'…4471 · Individual', payRef:c.ref, wire:c.amount, cashOnHand:c.cashAvail, purpose:`Capital call ${c.callNo} · ${c.fund}`,
            orders:c.sells.map(x => ({ action:'Sell', tkr:x.tkr, name:x.name, amount:x.amt })),
            onDone:() => { setSchwab(false); setExecuted(true); setStep('paid'); },
          })}
        </div>
      )}
      <div ref={scrollRef} style={{ display: schwab ? 'none' : 'block', flex:1, minHeight:0, overflowY:'auto', padding:'24px 26px 40px' }}>
        <div style={{ maxWidth:880, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

          {step === 'plan' && (
            <React.Fragment>
              <div>
                {lines.slice(0, streamIdx + 1).map((l, i) => (
                  <DfLine key={i} line={l} delay={i === 0 ? 120 : 0}
                    onDone={() => { if (i === streamIdx && i + 1 < lines.length) setStreamIdx(i + 1); }} />
                ))}
              </div>
              {streamIdx >= lines.length - 1 && (
                <React.Fragment>
                  <DfCard title="The call" owner="Delio">
                    <DfKV cols={4} rows={[
                      { k:'Due', v:`${USD(c.amount)} · ${c.due}`, sub:`Call ${c.callNo} on a ${USD(c.commitment)} commitment` },
                      { k:'Available cash', v:USD(c.cashAvail), sub:'$12K reserved for Q4 fees' },
                      { k:'Short', v:USD(short), tone:CF.red },
                      { k:'Unfunded after', v:USD(c.unfunded), sub:'Remaining commitment' },
                    ]} />
                    <p style={{ ...note, marginTop:14 }}>The commitment is binding and the notice came from the fund through Delio. Declining is not an option here; the plan below is about how the cash is raised.</p>
                  </DfCard>

                  <DfCard title="Funding plan" owner="Halo">
                    <div style={{ border:`1px solid ${CF.border}`, borderRadius:10, overflow:'hidden' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 110px 110px 100px 80px', gap:12, padding:'10px 14px', background:'rgba(255,255,255,0.03)', fontFamily:'Inter', fontSize:10, letterSpacing:'0.07em', textTransform:'uppercase', color:CF.dim }}>
                        <span>Sell</span><span style={{ textAlign:'right' }}>Amount</span><span style={{ textAlign:'right' }}>Realized gain</span><span style={{ textAlign:'right' }}>Tax</span><span style={{ textAlign:'right' }}>Settles</span>
                      </div>
                      {c.sells.map(s => (
                        <div key={s.tkr} style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 110px 110px 100px 80px', gap:12, padding:'12px 14px', borderTop:`1px solid ${CF.border}`, fontFamily:'Inter', fontSize:12.5, color:CF.ink2, fontVariantNumeric:'tabular-nums' }}>
                          <span><b style={{ color:CF.ink }}>{s.tkr}</b> <span style={{ color:CF.muted }}>{s.name}</span></span>
                          <span style={{ textAlign:'right' }}>{USD(s.amt)}</span>
                          <span style={{ textAlign:'right', color: s.gain < 0 ? CF.greenBr : CF.ink2 }}>{s.gain < 0 ? '−' : '+'}{USD(Math.abs(s.gain))}</span>
                          <span style={{ textAlign:'right' }}>{USD(s.tax)}</span>
                          <span style={{ textAlign:'right', color:CF.muted }}>{s.settle}</span>
                        </div>
                      ))}
                      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 110px 110px 100px 80px', gap:12, padding:'12px 14px', borderTop:`1px solid ${CF.borderHard}`, background:'rgba(255,255,255,0.02)', fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:CF.ink, fontVariantNumeric:'tabular-nums' }}>
                        <span>Raised</span>
                        <span style={{ textAlign:'right' }}>{USD(sellTotal)}</span>
                        <span />
                        <span style={{ textAlign:'right', color:CF.amber }}>{USD(taxTotal)}</span>
                        <span />
                      </div>
                    </div>
                    <div style={{ marginTop:16 }}>
                      <DfKV cols={3} rows={[
                        { k:'Trade date', v:'26 Sep', sub:'Order generated in Halo' },
                        { k:'Cash settled', v:'29 Sep', sub:'T+1 plus a business day' },
                        { k:'Payment due', v:c.due, tone:CF.amber, sub:'Three days of slack' },
                      ]} />
                    </div>
                    <div style={{ marginTop:16 }}>
                      <div style={{ fontFamily:'Inter', fontSize:11, letterSpacing:'0.07em', textTransform:'uppercase', color:CF.dim, marginBottom:9 }}>Considered and passed over</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {c.rejected.map(r => (
                          <div key={r.tkr} style={{ display:'grid', gridTemplateColumns:'110px minmax(0,1fr)', gap:12, padding:'10px 12px', borderRadius:9, border:`1px solid ${CF.border}`, background:'rgba(255,255,255,0.015)' }}>
                            <span style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:CF.muted }}>{r.tkr}</span>
                            <span style={{ ...note, fontSize:12 }}>{r.why}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DfCard>
                  <div style={{ display:'flex', gap:10 }}>
                    <span style={{ flex:1 }} />
                    <button onClick={() => setStep('execute')} style={btn(true)}>Approve and execute<i className="fa-solid fa-arrow-right" style={{ fontSize:11 }} /></button>
                  </div>
                  {extra.map((l, i) => <DfLine key={'x' + i} line={l} delay={0} />)}
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {step === 'execute' && (
            <React.Fragment>
              <DfCard title="Execution" owner="Custodian · Bank">
                <p style={{ ...note, marginBottom:16 }}>Halo generates the trade; the cash settles and the payment leaves at the custodian and the bank. Halo and Delio only record it.</p>
                {track([
                  { t:`Sell order for ${USD(sellTotal)} staged at Schwab`, d: executed ? 'VTEB and AGG submitted in Schwab Advisor Center, orders SW-84219 and SW-84229.' : 'VTEB and AGG, market on open 26 Sep. Halo pre-fills the Schwab ticket; you submit it there.', owner:'Halo', state: executed ? 'done' : 'active' },
                  { t:'Cash settles at the custodian', d:'29 Sep. Held in the sweep against the call.', owner:'Custodian · Bank', state: executed ? 'done' : 'wait' },
                  { t:`Payment of ${USD(c.amount)} to the fund`, d:`Under the standing LOA, quoting payment reference ${c.ref}.`, owner:'Custodian · Bank', state: executed ? 'done' : 'wait' },
                  { t:'Call marked paid in Delio', d:'Receipt recorded by the fund and reflected on the client record in Halo.', owner:'Delio', state: executed ? 'done' : 'wait' },
                ])}
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <span style={{ flex:1 }} />
                  {executed ? (
                    <button onClick={() => setStep('paid')} style={btn(true)}>See confirmation<i className="fa-solid fa-arrow-right" style={{ fontSize:11 }} /></button>
                  ) : (
                    <button onClick={() => setSchwab(true)} style={btn(true)}>Open Schwab and pre-fill the ticket<i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize:11 }} /></button>
                  )}
                </div>
              </DfCard>
            </React.Fragment>
          )}

          {step === 'paid' && (
            <React.Fragment>
              <DfCard title="Call paid" owner="Delio" accent="rgba(35,89,255,0.5)">
                <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize:20, color:CF.greenBr, marginTop:2 }} />
                  <div>
                    <div style={{ fontFamily:'Inter', fontSize:15, fontWeight:600, color:CF.ink }}>{USD(c.amount)} received against payment reference {c.ref}</div>
                    <div style={{ ...note, marginTop:6 }}>Delio has marked call {c.callNo} paid. {c.client}'s paid-in capital is now {USD(c.called + c.amount)} of a {USD(c.commitment)} commitment, with {USD(c.unfunded)} unfunded. The position and the tax lots are updated in Halo.</div>
                  </div>
                </div>
                <div style={{ marginTop:16 }}>
                  <DfKV cols={3} rows={[
                    { k:'Paid in', v:USD(c.called + c.amount), sub:`of ${USD(c.commitment)}` },
                    { k:'Realized tax cost', v:USD(taxTotal), tone:CF.amber, sub:'Booked to 2026' },
                    { k:'Next call', v:'Est. Q2 2027', sub:`Up to ${USD(c.unfunded)}` },
                  ]} />
                </div>
              </DfCard>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ flex:1 }} />
                <button onClick={closeHome} style={btn(true)}>Back to the dashboard<i className="fa-solid fa-check" style={{ fontSize:11 }} /></button>
              </div>
            </React.Fragment>
          )}

        </div>
      </div>
      {step === 'plan' && !schwab && window.DfComposer && React.createElement(window.DfComposer, {
        busy,
        placeholder: `Ask about the call \u2014 a different asset to sell, the tax cost, the timing\u2026`,
        onAsk: async (q) => {
          setExtra(x => [...x, { type:'user', text:q }]);
          setBusy(true);
          const ctx = `Capital call ${c.callNo} of ${USD(c.amount)} due ${c.due} on ${c.client}'s binding ${USD(c.commitment)} commitment to ${c.fund} (paid in ${USD(c.called)}). Available cash ${USD(c.cashAvail)}, short ${USD(short)}. Plan: sell $52,000 VTEB and $35,000 AGG, total tax ${USD(taxTotal)}, T+1 settlement, trade 26 Sep, cash 29 Sep, payment due ${c.due}. Passed over: NVDA (would realize $41K gain, $9,758 tax), VOO (at a gain, core sleeve), the sweep (only ${USD(c.cashAvail)} and $12K reserved for fees).`;
          const answer = await window.dfAsk(q, ctx);
          setBusy(false);
          setExtra(x => [...x, { type:'response', text:answer }]);
          setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
        },
      })}
    </div>
  );
}

window.CapitalCallFlow = CapitalCallFlow;
