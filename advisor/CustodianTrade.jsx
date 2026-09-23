/* CustodianTrade — the custodian-side order window Field hands off to when a
   trade is released (Schwab integration). Field pre-fills the ticket from the
   funding plan; the advisor reviews, submits, and returns.
   Props: client, account, orders[{action,tkr,name,amount}], payRef, wire, cashOnHand,
   purpose, onDone. */

const CT = {
  ink:'rgb(24,33,46)', ink2:'rgb(71,85,105)', muted:'rgb(125,138,156)',
  line:'rgb(226,232,240)', bg:'rgb(244,246,249)', blue:'rgb(24,80,150)', green:'rgb(28,140,82)',
};
const CT_USD = (n) => '$' + Math.round(n).toLocaleString('en-US');

function CtField({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontFamily:'Inter', fontSize:11, letterSpacing:'0.04em', textTransform:'uppercase', color:CT.muted }}>{label}</div>
      <div style={{ marginTop:6, height:38, border:`1px solid ${CT.line}`, borderRadius:6, background:'#fff', display:'flex', alignItems:'center', padding:'0 12px',
        fontFamily: mono ? 'Geist Mono, ui-monospace, monospace' : 'Inter', fontSize:13.5, color:CT.ink }}>{value}</div>
    </div>
  );
}

function CustodianTrade({ client, account, orders, payRef, purpose, wire, cashOnHand, onDone }) {
  const [stage, setStage] = React.useState('entry'); // entry | review | done
  const total = orders.reduce((a, o) => a + o.amount, 0);
  const wireAmt = wire || total;
  const fromCash = cashOnHand != null ? cashOnHand : Math.max(0, wireAmt - total);
  const label = { fontFamily:'Inter', fontSize:11.5, color:CT.muted };
  const h = { fontFamily:'Inter', fontSize:16, fontWeight:600, color:CT.ink, margin:0 };
  const card = { background:'#fff', border:`1px solid ${CT.line}`, borderRadius:10, boxShadow:'0 1px 2px rgba(15,23,42,0.05)' };
  const btn = (primary) => ({ height:38, padding:'0 18px', borderRadius:7, cursor:'pointer', fontFamily:'Inter', fontSize:13, fontWeight:600,
    background: primary ? CT.blue : '#fff', border:`1px solid ${primary ? CT.blue : CT.line}`, color: primary ? '#fff' : CT.ink2 });

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', borderRadius:10, overflow:'hidden', border:`1px solid ${CT.line}`, background:CT.bg }}>
      {/* browser chrome */}
      <div style={{ height:38, flexShrink:0, background:'rgb(233,237,242)', borderBottom:`1px solid ${CT.line}`, display:'flex', alignItems:'center', gap:10, padding:'0 12px' }}>
        <span style={{ display:'flex', gap:6 }}>
          {['rgb(237,106,94)','rgb(245,191,79)','rgb(98,198,85)'].map(c => <span key={c} style={{ width:11, height:11, borderRadius:9999, background:c }} />)}
        </span>
        <div style={{ flex:1, maxWidth:520, height:24, borderRadius:9999, background:'#fff', border:`1px solid ${CT.line}`, display:'flex', alignItems:'center', padding:'0 12px', fontFamily:'Inter', fontSize:11, color:CT.muted }}>
          advisorcenter.schwab.com/trade/order-entry
        </div>
      </div>
      {/* app bar */}
      <div style={{ height:54, flexShrink:0, background:'#fff', borderBottom:`1px solid ${CT.line}`, display:'flex', alignItems:'center', gap:14, padding:'0 20px' }}>
        <div style={{ fontFamily:'Inter', fontSize:15, fontWeight:700, color:CT.blue }}>Schwab Advisor Center</div>
        <span style={{ fontFamily:'Inter', fontSize:12, color:CT.muted }}>Trade · Order entry</span>
        <span style={{ flex:1 }} />
        <span style={{ fontFamily:'Inter', fontSize:11.5, fontWeight:600, color:CT.green, background:'rgb(233,248,239)', border:'1px solid rgb(183,228,203)', borderRadius:6, padding:'5px 10px' }}>Pre-filled from Field</span>
      </div>

      <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 22px 28px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ ...card, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
              <h2 style={h}>Account</h2>
              <span style={{ flex:1 }} />
              <span style={label}>{purpose}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:16, marginTop:16 }}>
              <CtField label="Master account" value={`${client} — ${account}`} />
              <CtField label="Order type" value="Market" />
              <CtField label="Time in force" value="Day" />
            </div>
          </div>

          <div style={{ ...card, padding:'18px 20px' }}>
            <h2 style={h}>{stage === 'done' ? 'Executed' : 'Order ticket'}</h2>
            <div style={{ border:`1px solid ${CT.line}`, borderRadius:8, overflow:'hidden', marginTop:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'70px minmax(0,1fr) 120px 110px 120px', gap:12, padding:'10px 14px', background:'rgb(248,250,252)', fontFamily:'Inter', fontSize:10.5, letterSpacing:'0.05em', textTransform:'uppercase', color:CT.muted }}>
                <span>Action</span><span>Security</span><span style={{ textAlign:'right' }}>Amount</span><span style={{ textAlign:'right' }}>Settles</span><span style={{ textAlign:'right' }}>{stage === 'done' ? 'Order ID' : 'Status'}</span>
              </div>
              {orders.map((o, i) => (
                <div key={o.tkr} style={{ display:'grid', gridTemplateColumns:'70px minmax(0,1fr) 120px 110px 120px', gap:12, padding:'13px 14px', borderTop:`1px solid ${CT.line}`, fontFamily:'Inter', fontSize:13, color:CT.ink, background:'#fff' }}>
                  <span style={{ fontWeight:600, color: o.action === 'Sell' ? 'rgb(190,60,60)' : CT.green }}>{o.action}</span>
                  <span><b>{o.tkr}</b> <span style={{ color:CT.muted }}>{o.name}</span></span>
                  <span style={{ textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{CT_USD(o.amount)}</span>
                  <span style={{ textAlign:'right', color:CT.muted }}>T+1</span>
                  <span style={{ textAlign:'right', fontFamily:'Geist Mono, ui-monospace, monospace', fontSize:12, color: stage === 'done' ? CT.green : CT.muted }}>
                    {stage === 'done' ? `SW-84${21 + i}9` : stage === 'review' ? 'Ready' : 'Draft'}
                  </span>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'70px minmax(0,1fr) 120px 110px 120px', gap:12, padding:'13px 14px', borderTop:`1px solid ${CT.line}`, background:'rgb(248,250,252)', fontFamily:'Inter', fontSize:13, fontWeight:600, color:CT.ink }}>
                <span />
                <span>Estimated proceeds</span>
                <span style={{ textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{CT_USD(total)}</span>
                <span /><span />
              </div>
            </div>
            {stage === 'entry' && <div style={{ ...label, marginTop:14 }}>Quantities, tax lots, and the cash destination were filled in by the Field integration. Nothing has been sent to the market yet.</div>}
          </div>

          <div style={{ ...card, padding:'18px 20px' }}>
            <h2 style={h}>Cash instruction</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:16, marginTop:16 }}>
              <CtField label="Proceeds to" value="Cash sweep — same account" />
              <CtField label="Then wire" value={`${CT_USD(wireAmt)}${fromCash ? ` (${CT_USD(fromCash)} available cash + ${CT_USD(total)} proceeds)` : ''}`} />
              <CtField label="Payment reference" value={payRef} mono />
            </div>
            {stage === 'done' && (
              <div style={{ marginTop:16, padding:'12px 14px', borderRadius:8, background:'rgb(233,248,239)', border:'1px solid rgb(183,228,203)', fontFamily:'Inter', fontSize:13, color:'rgb(21,94,56)' }}>
                Orders accepted. Wire of {CT_USD(wireAmt)} queued against the standing LOA and reported back to Field.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ flexShrink:0, display:'flex', alignItems:'center', gap:10, padding:'14px 22px', borderTop:`1px solid ${CT.line}`, background:'#fff' }}>
        <span style={{ ...label, flex:1 }}>{stage === 'done' ? 'You can close this window.' : 'Review the ticket before submitting.'}</span>
        {stage === 'entry' && <button onClick={() => setStage('review')} style={btn(true)}>Review order</button>}
        {stage === 'review' && (
          <React.Fragment>
            <button onClick={() => setStage('entry')} style={btn(false)}>Back</button>
            <button onClick={() => setStage('done')} style={btn(true)}>Submit order</button>
          </React.Fragment>
        )}
        {stage === 'done' && <button onClick={onDone} style={{ ...btn(true), background:CT.green, borderColor:CT.green }}>Return to Field</button>}
      </div>
    </div>
  );
}

window.CustodianTrade = CustodianTrade;
