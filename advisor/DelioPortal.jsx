/* DelioPortal — the fund's own subscription portal (Delio), shown after the
   client approves the proposal. Deliberately light-themed and un-Field: this
   surface is not ours. Soft commitment → KYC/docs → funds received.
   Props: client, commit (number), fund, onDone. */

const DP = {
  ink:'rgb(23,32,47)', ink2:'rgb(71,85,105)', muted:'rgb(125,138,156)',
  line:'rgb(226,232,240)', bg:'rgb(243,245,248)', navy:'rgb(72,102,134)',
  green:'rgb(34,160,94)', chrome:'rgb(250,251,252)',
};
const DP_USD = (n) => n.toLocaleString('en-US');

const DP_STAGES = [
  { done:['Request More Information'], next:'Soft Commitment',
    blurb:'Please input your investment amount. Your commitment will be recorded, allowing you to continue with the process. Should the need arise, you may modify this amount at a later time.',
    cta:'Indicate commitment', bar:22, committed:false, action:'Continue Investment - Soft Commitment' },
  { done:['Request More Information','Commitment','Complete KYC Checks','Subscription Agreement Released'], next:'Subscription Agreement Signed and Approved',
    blurb:'Please complete the required information to proceed with your investment.',
    cta:'Continue', bar:62, committed:true, action:'Continue Investment - Subscription Agreement Signed and Approved' },
  { done:['Request More Information','Commitment','Complete KYC Checks','Subscription Agreement Released','Subscription Agreement Signed'], next:'Funds Received',
    blurb:'Please remember to use the payment reference when transferring your funds. Delio will record receipt and notify your adviser.',
    cta:'Mark funds sent', bar:84, committed:true, action:'Continue Investment - Funds Received' },
];

function DpCard({ children, style }) {
  return <div style={{ background:'#fff', border:`1px solid ${DP.line}`, borderRadius:10, boxShadow:'0 1px 2px rgba(15,23,42,0.04)', ...style }}>{children}</div>;
}

function DpCheck({ label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'5px 0' }}>
      <span style={{ width:20, height:20, borderRadius:5, background:'rgb(232,248,239)', border:'1px solid rgb(178,226,199)', color:DP.green, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>✓</span>
      <span style={{ fontFamily:'Inter', fontSize:13.5, color:DP.ink }}>{label}</span>
    </div>
  );
}

function DelioPortal({ client, commit, fund, onDone }) {
  const [stage, setStage] = React.useState(0);
  const [amount, setAmount] = React.useState(String(commit));
  const [panel, setPanel] = React.useState(true);
  const [done, setDone] = React.useState(false);
  const st = DP_STAGES[stage];
  const advance = () => { if (stage < DP_STAGES.length - 1) setStage(stage + 1); else setDone(true); };

  const label = { fontFamily:'Inter', fontSize:12, color:DP.muted };
  const h2 = { fontFamily:'Inter', fontSize:19, fontWeight:600, color:DP.ink, margin:0 };
  const sideBtn = { width:'100%', height:38, borderRadius:8, background:'#fff', border:`1px solid ${DP.navy}`, color:DP.navy, fontFamily:'Inter', fontSize:13, fontWeight:500, cursor:'pointer' };
  const body = { fontFamily:'Inter', fontSize:13.5, color:DP.ink2, lineHeight:1.65 };

  return (
    <div style={{ position:'relative', height:'100%', background:DP.bg, display:'flex', overflow:'hidden', borderRadius:10, border:`1px solid ${DP.line}` }}>
      {/* icon rail */}
      <div style={{ width:56, flexShrink:0, background:'#fff', borderRight:`1px solid ${DP.line}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:64, gap:22 }}>
        {['house','briefcase','file-lines','folder','calendar','users','gear'].map(ic => (
          <i key={ic} className={`fa-solid fa-${ic}`} style={{ fontSize:14, color:DP.muted }} />
        ))}
      </div>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        {/* top chrome */}
        <div style={{ height:56, flexShrink:0, background:'#fff', borderBottom:`1px solid ${DP.line}`, display:'flex', alignItems:'center', gap:16, padding:'0 22px' }}>
          <div style={{ fontFamily:'Inter', fontSize:15, fontWeight:700, letterSpacing:'0.14em', color:DP.navy }}>WPM</div>
          <span style={{ flex:1 }} />
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 14px', border:`1px solid ${DP.line}`, borderRadius:9999 }}>
            <i className="fa-solid fa-users" style={{ fontSize:11, color:DP.muted }} />
            <div>
              <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:DP.ink }}>Back to my account</div>
              <div style={{ fontFamily:'Inter', fontSize:10.5, color:DP.muted }}>Acting as {client}</div>
            </div>
          </div>
          <i className="fa-solid fa-bell" style={{ fontSize:14, color:DP.muted }} />
          <i className="fa-solid fa-circle-question" style={{ fontSize:14, color:DP.muted }} />
        </div>

        <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 26px 40px' }}>
          <div style={{ ...label, marginBottom:16 }}>Explore Opportunities / {fund.name}</div>
          <div style={{ display:'flex', gap:22, alignItems:'flex-start' }}>
            <img src={fund.img} alt="" style={{ width:180, height:180, objectFit:'cover', borderRadius:10, border:`1px solid ${DP.line}`, flexShrink:0 }} />
            <div style={{ minWidth:0, paddingTop:4 }}>
              <h1 style={{ fontFamily:'Inter', fontSize:27, fontWeight:600, color:DP.ink, margin:'0 0 14px' }}>{fund.name}</h1>
              <div style={{ ...body, maxWidth:780 }}>The Helm PM Fund invests in initiatives designed to deliver measurable social and environmental impact. Focused on supporting sustainable and inclusive communities, the fund seeks opportunities that drive positive outcomes while creating long term value.</div>
              <div style={{ ...label, marginTop:16 }}>Sponsored By: <span style={{ color:DP.ink }}>{fund.sponsor}</span></div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 320px', gap:20, marginTop:24, alignItems:'start' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <DpCard style={{ padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'baseline' }}>
                  <h2 style={h2}>My Investment</h2>
                  <span style={{ flex:1 }} />
                  <span style={label}>Payment reference: 23A129</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr)', gap:26, marginTop:18 }}>
                  <div>
                    <div style={label}>Committed</div>
                    <div style={{ fontFamily:'Inter', fontSize:21, fontWeight:600, color:DP.ink, marginTop:4 }}>{st.committed ? `${DP_USD(Number(amount) || commit)} USD` : 'None'}</div>
                  </div>
                  <div>
                    <div style={label}>Investment Progress</div>
                    <div style={{ height:8, borderRadius:9999, background:DP.line, marginTop:10, overflow:'hidden' }}>
                      <div style={{ width:`${done ? 100 : st.bar}%`, height:'100%', background:DP.navy, transition:'width .4s ease' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:22, marginTop:16, fontFamily:'Inter', fontSize:12.5, color:DP.navy }}>
                  <span>Edit Investment</span><span>View All Steps</span><span style={{ marginLeft:'auto' }}>View Full Timeline</span>
                </div>
              </DpCard>
              <DpCard style={{ padding:'20px 22px' }}>
                <h2 style={h2}>Details</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:'18px 22px', marginTop:18 }}>
                  {[['Opportunity Structure','Fund'],['Fund Type','Multi-Asset'],['Focus','Impact Investment'],['Target Return','12%'],['Minimum Investment','USD 100,000'],['Initial Close Date','01/12/2026']].map(([k, v]) => (
                    <div key={k}><div style={label}>{k}</div><div style={{ fontFamily:'Inter', fontSize:14, color:DP.navy, marginTop:4 }}>{v}</div></div>
                  ))}
                </div>
              </DpCard>
              <DpCard style={{ padding:'20px 22px' }}>
                <h2 style={h2}>Documents</h2>
                <div style={{ display:'flex', gap:14, marginTop:16 }}>
                  {[`Subscription Agreement__${client}.pdf`, 'Teaser Deck.pdf'].map(d => (
                    <div key={d} style={{ flex:1, border:`1px solid ${DP.line}`, borderRadius:8, padding:'14px 16px', background:DP.chrome }}>
                      <i className="fa-solid fa-file-lines" style={{ fontSize:15, color:DP.navy }} />
                      <div style={{ fontFamily:'Inter', fontSize:12.5, color:DP.ink, marginTop:12 }}>{d}</div>
                    </div>
                  ))}
                </div>
              </DpCard>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <DpCard style={{ padding:16 }}>
                <button onClick={() => setPanel(true)} style={{ width:'100%', minHeight:44, borderRadius:8, background:DP.navy, border:`1px solid ${DP.navy}`, color:'#fff', fontFamily:'Inter', fontSize:13, fontWeight:600, cursor:'pointer', padding:'10px 12px', lineHeight:1.4 }}>
                  {done ? 'Investment complete - Funds Received' : st.action}
                </button>
                <div style={{ height:1, background:DP.line, margin:'16px 0' }} />
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <button style={sideBtn}>Provide Feedback</button>
                  <button style={sideBtn}>Actions ⌄</button>
                </div>
              </DpCard>
              <DpCard style={{ padding:'16px 18px' }}>
                {['My Investment','Description','Details','Documents','Impact','Global Goals','Team','Video'].map((s, i) => (
                  <div key={s} style={{ fontFamily:'Inter', fontSize:13, color: i === 0 ? DP.navy : DP.ink2, padding:'7px 0' }}>{s}</div>
                ))}
              </DpCard>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Journey slide-over */}
      {panel && (
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:520, background:'#fff', borderLeft:`1px solid ${DP.line}`, boxShadow:'-24px 0 48px rgba(15,23,42,0.12)', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 22px', borderBottom:`1px solid ${DP.line}` }}>
            <button onClick={() => setPanel(false)} style={{ background:'none', border:'none', cursor:'pointer', color:DP.muted, fontSize:15 }}>✕</button>
            <div style={{ fontFamily:'Inter', fontSize:16, fontWeight:600, color:DP.ink }}>Investment Journey</div>
          </div>
          <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px 22px', display:'flex', flexDirection:'column', gap:16, background:DP.chrome }}>
            <DpCard style={{ padding:'16px 18px' }}>
              <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:600, color:DP.ink, marginBottom:8 }}>Previously Completed</div>
              {st.done.map(d => <DpCheck key={d} label={d} />)}
            </DpCard>
            {done ? (
              <DpCard style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ width:22, height:22, borderRadius:6, background:'rgb(232,248,239)', border:'1px solid rgb(178,226,199)', color:DP.green, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>✓</span>
                  <div style={{ fontFamily:'Inter', fontSize:16, fontWeight:600, color:DP.ink }}>Funds Received</div>
                </div>
                <div style={{ ...body, marginTop:12 }}>{DP_USD(Number(amount) || commit)} USD is recorded as received against payment reference 23A129. The subscription is complete and the position has been reported back to your adviser.</div>
              </DpCard>
            ) : (
              <DpCard style={{ padding:'18px 20px' }}>
                <div style={{ ...label, marginBottom:6 }}>What you need to do next:</div>
                <div style={{ fontFamily:'Inter', fontSize:17, fontWeight:600, color:DP.ink, lineHeight:1.35 }}>{st.next}</div>
                <div style={{ ...body, marginTop:12 }}>{st.blurb}</div>
                {stage === 0 && (
                  <div style={{ marginTop:18 }}>
                    <div style={{ fontFamily:'Inter', fontSize:13, color:DP.ink }}>Commitment <span style={{ color:DP.muted }}>(Optional)</span></div>
                    <div style={{ display:'flex', alignItems:'center', border:`1px solid ${DP.line}`, borderRadius:8, marginTop:8, background:'#fff' }}>
                      <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ flex:1, minWidth:0, height:42, border:'none', outline:'none', background:'transparent', padding:'0 14px', fontFamily:'Inter', fontSize:14, color:DP.ink }} />
                      <span style={{ fontFamily:'Inter', fontSize:13, color:DP.ink2, padding:'0 14px' }}>USD</span>
                    </div>
                    <div style={{ fontFamily:'Inter', fontSize:11.5, color:DP.muted, marginTop:8, lineHeight:1.5 }}>By entering a figure, you understand that this is an initial commitment and not a binding agreement at this stage.</div>
                  </div>
                )}
              </DpCard>
            )}
            <DpCard style={{ padding:'16px 18px' }}>
              <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:600, color:DP.ink, marginBottom:8 }}>Payment Reference</div>
              <div style={body}>Please remember to use the payment reference <b>23A129</b> when transferring your funds.</div>
            </DpCard>
          </div>
          <div style={{ display:'flex', gap:10, padding:'14px 22px', borderTop:`1px solid ${DP.line}`, background:'#fff' }}>
            <span style={{ flex:1 }} />
            {done ? (
              <button onClick={onDone} style={{ height:38, padding:'0 18px', borderRadius:8, background:DP.green, border:'1px solid rgb(28,140,82)', color:'#fff', fontFamily:'Inter', fontSize:13, fontWeight:600, cursor:'pointer' }}>Return to Field</button>
            ) : (
              <button onClick={advance} style={{ height:38, padding:'0 18px', borderRadius:8, background:DP.navy, border:`1px solid ${DP.navy}`, color:'#fff', fontFamily:'Inter', fontSize:13, fontWeight:600, cursor:'pointer' }}>{st.cta}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

window.DelioPortal = DelioPortal;
