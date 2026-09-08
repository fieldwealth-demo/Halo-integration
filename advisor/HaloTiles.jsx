/* Halo integration tiles: Portfolio Lifecycle, Journal (+ article page), Watchlist page.
   The three full pages are reachable only from their dashboard tiles ("See more"),
   so each one carries a back-to-dashboard control. */
function BackToDashboard() {
  return (
    <button onClick={() => window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'dashboard' } }))}
      style={{
        height:30, padding:'0 12px 0 10px', borderRadius:8, cursor:'pointer', marginBottom:16,
        background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)', color:'rgb(229,231,235)',
        fontFamily:'Inter', fontSize:12, display:'inline-flex', alignItems:'center', gap:8,
      }}
      onMouseEnter={(e)=>{ e.currentTarget.style.borderColor='rgb(5,122,85)'; e.currentTarget.style.color='rgb(94,214,164)'; }}
      onMouseLeave={(e)=>{ e.currentTarget.style.borderColor='rgb(75,85,99)'; e.currentTarget.style.color='rgb(229,231,235)'; }}>
      <i className="fa-solid fa-chevron-left" style={{ fontSize:10 }} /> Back to dashboard
    </button>
  );
}

const haloTone = {
  warning: { bg:'rgba(234,179,8,0.14)', fg:'rgb(253,224,71)', ring:'rgba(234,179,8,0.45)' },
  success: { bg:'rgba(5,122,85,0.18)',  fg:'rgb(52,211,153)', ring:'rgba(5,122,85,0.5)' },
  info:    { bg:'rgba(59,130,246,0.14)',fg:'rgb(147,197,253)',ring:'rgba(59,130,246,0.4)' },
  mute:    { bg:'rgba(255,255,255,0.05)',fg:'rgb(163,163,163)',ring:'rgba(75,85,99,0.6)' },
};

/* -- Portfolio Lifecycle tile (Halo) -------------------------------------- */
const LIFECYCLE_EVENTS = [
  { m:'AUG', d:'10', title:'Conditional Coupon', sub:'SPX RUT XLU · 09711KKK1', status:'Pending',  tone:'warning', amt:'$353,000', lbl:'Total notional', cat:'coupon' },
  { m:'AUG', d:'10', title:'Issuer Call',        sub:'SPX RUT XLU · 09711KKK1', status:'Called',   tone:'success', amt:'$353,000', lbl:'Maturity value', cat:'autocall' },
  { m:'AUG', d:'17', title:'Fixed Coupon',       sub:'ORCL · 61779TNU7',        status:'Upcoming', tone:'info',    amt:'$527',     lbl:'Coupon',         cat:'coupon' },
  { m:'AUG', d:'21', title:'Fixed Coupon',       sub:'GNRC · 83371NRC2',        status:'Upcoming', tone:'info',    amt:'$492',     lbl:'Coupon',         cat:'coupon' },
  { m:'SEP', d:'04', title:'Maturity',           sub:'NDX · 06746XZZ4',         status:'Scheduled',tone:'mute',    amt:'$120,000', lbl:'Notional',       cat:'maturity' },
];
const LC_SERIES = {
  maturity: { label:'Maturity', color:'rgb(118,169,250)', vals:[0, 4, 10, 6, 46] },
  coupon:   { label:'Coupon',   color:'rgb(16,185,129)',  vals:[6, 14, 12, 8, 5] },
  autocall: { label:'Autocall', color:'rgb(227,160,8)',   vals:[88, 190, 0, 52, 0] },
};
const LC_MONTHS = ['Aug','Sep','Oct','Nov','Dec'];
function PortfolioLifecycle({ onMore }) {
  const [tab, setTab] = React.useState('all');
  const [hoverMo, setHoverMo] = React.useState(null);
  const tabs = [ ['all','All Events'], ['coupon','Coupons'], ['autocall','Autocall'], ['maturity','Maturity'] ];
  const events = LIFECYCLE_EVENTS.filter(e => tab === 'all' || e.cat === tab);
  const max = 210;
  return (
    <Tile title="Portfolio Lifecycle" onMore={onMore} footLabel="Halo · All accounts">
      <div style={{ display:'flex', gap:16, flex:1, minHeight:0, paddingTop:2 }}>
        <div style={{ flex:'0 0 46%', display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', paddingBottom:10 }}>Projected events ($ thousands)</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, flex:1, padding:'0 2px' }}>
            {LC_MONTHS.map((mo, i) => {
              const parts = ['maturity','coupon','autocall'].filter(k => tab==='all' || tab===k);
              const total = parts.reduce((s,k) => s + LC_SERIES[k].vals[i], 0);
              return (
                <div key={mo} onMouseEnter={()=>setHoverMo(i)} onMouseLeave={()=>setHoverMo(null)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%', justifyContent:'flex-end', position:'relative', cursor:'default' }}>
                  {hoverMo === i && (
                    <div style={{ position:'absolute', bottom:'calc(100% - 12px)', left:'50%', transform:'translateX(-50%)', zIndex:20, background:'rgb(17,24,39)', border:'1px solid rgb(75,85,99)', borderRadius:8, padding:'8px 10px', boxShadow:'0 10px 24px -8px rgba(0,0,0,0.6)', whiteSpace:'nowrap' }}>
                      <div style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:700, color:'rgb(249,250,251)', marginBottom:4 }}>{mo} 2026 · ${total}K</div>
                      {parts.map(k => (
                        <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:10.5, color:'rgb(209,213,219)', lineHeight:1.6 }}>
                          <span style={{ width:7, height:7, borderRadius:2, background:LC_SERIES[k].color }}></span>
                          <span style={{ minWidth:52 }}>{LC_SERIES[k].label}</span>
                          <span style={{ fontWeight:600, color:'rgb(249,250,251)' }}>${LC_SERIES[k].vals[i]}K</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ width:'100%', maxWidth:42, height:190, display:'flex', flexDirection:'column-reverse', borderRadius:4, overflow:'hidden', background:'rgba(255,255,255,0.03)', outline: hoverMo===i ? '1px solid rgba(94,214,164,0.6)' : 'none' }}>
                    {parts.map(k => {
                      const h = Math.round(LC_SERIES[k].vals[i] / max * 190);
                      return h ? <div key={k} style={{ height:h, background:LC_SERIES[k].color, opacity: hoverMo===null||hoverMo===i ? 1 : 0.45 }}></div> : null;
                    })}
                  </div>
                  <span style={{ fontFamily:'Inter', fontSize:10, color: hoverMo===i ? 'rgb(249,250,251)' : 'rgb(163,163,163)' }}>{mo}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:10, paddingTop:12, flexWrap:'wrap' }}>
            {Object.entries(LC_SERIES).map(([k, s]) => (
              <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>
                <span style={{ width:8, height:8, borderRadius:2, background:s.color, opacity: tab==='all'||tab===k ? 1 : 0.25 }}></span>{s.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', gap:6, paddingBottom:10, flexWrap:'wrap' }}>
            {tabs.map(([id, lbl]) => (
              <button key={id} onClick={()=>setTab(id)} style={{
                fontFamily:'Inter', fontSize:11.5, fontWeight: tab===id?600:500, cursor:'pointer',
                padding:'5px 12px', borderRadius:9999,
                border:`1px solid ${tab===id ? 'rgb(5,122,85)' : 'rgb(75,85,99)'}`,
                background: tab===id ? 'rgba(5,122,85,0.22)' : 'transparent',
                color: tab===id ? 'rgb(94,214,164)' : 'rgb(163,163,163)',
              }}>{lbl}</button>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'36px minmax(0,1fr) auto', gap:8, padding:'4px 0', borderBottom:'1px solid rgba(75,85,99,0.6)' }}>
            {['Date','Event','Amount'].map(c => <span key={c} style={{ fontFamily:'Inter', fontSize:10, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'rgb(163,163,163)', textAlign: c==='Amount'?'right':'left' }}>{c}</span>)}
          </div>
          {events.map((e, i) => {
            const t = haloTone[e.tone];
            return (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'36px minmax(0,1fr) auto', alignItems:'center', gap:8, padding:'6px 0', borderTop: i ? '1px solid rgba(75,85,99,0.4)' : 'none' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'Inter', fontSize:9, color:'rgb(163,163,163)', letterSpacing:'0.08em' }}>{e.m}</div>
                  <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:14, color:'rgb(5,122,85)', lineHeight:1 }}>{e.d}</div>
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:12, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.title}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
                    <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:9.5, padding:'1px 7px', borderRadius:9999, background:t.bg, color:t.fg, border:`1px solid ${t.ring}`, whiteSpace:'nowrap', flexShrink:0 }}>{e.status}</span>
                    <span style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.sub}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:12, color:'rgb(249,250,251)', whiteSpace:'nowrap' }}>{e.amt}</div>
                  <div style={{ fontFamily:'Inter', fontSize:10, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>{e.lbl}</div>
                </div>
              </div>
            );
          })}
          {!events.length && <div style={{ fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)', padding:'16px 0' }}>No events in this category.</div>}
        </div>
      </div>
    </Tile>
  );
}

/* -- Portfolio Lifecycle page ---------------------------------------------------- */
const LC_PAGE_MONTHS = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const LC_PAGE_SERIES = {
  maturity: { label:'Maturity', color:'rgb(118,169,250)', vals:[0, 4, 10, 6, 46, 0, 120, 18] },
  coupon:   { label:'Coupon',   color:'rgb(16,185,129)',  vals:[6, 14, 12, 8, 5, 11, 9, 13] },
  autocall: { label:'Autocall', color:'rgb(227,160,8)',   vals:[88, 190, 0, 52, 0, 64, 0, 30] },
};
const LC_PAGE_EVENTS = [
  { m:'AUG', d:'10', title:'Conditional Coupon', sub:'SPX RUT XLU · 09711KKK1', client:'David Young',   status:'Pending',  tone:'warning', amt:'$353,000', lbl:'Total notional', cat:'coupon' },
  { m:'AUG', d:'10', title:'Issuer Call',        sub:'SPX RUT XLU · 09711KKK1', client:'David Young',   status:'Called',   tone:'success', amt:'$353,000', lbl:'Maturity value', cat:'autocall' },
  { m:'AUG', d:'17', title:'Fixed Coupon',       sub:'ORCL · 61779TNU7',        client:'Maria Workman', status:'Upcoming', tone:'info',    amt:'$527',     lbl:'Coupon',         cat:'coupon' },
  { m:'AUG', d:'21', title:'Fixed Coupon',       sub:'GNRC · 83371NRC2',        client:'Robert Patel',  status:'Upcoming', tone:'info',    amt:'$492',     lbl:'Coupon',         cat:'coupon' },
  { m:'SEP', d:'04', title:'Maturity',           sub:'NDX · 06746XZZ4',         client:'Edwards Family',status:'Scheduled',tone:'mute',    amt:'$120,000', lbl:'Notional',       cat:'maturity' },
  { m:'SEP', d:'12', title:'Autocall Observation', sub:'NVDA TSLA · 48130CKR9', client:'Kyung Min',     status:'Above call', tone:'success', amt:'$190,000', lbl:'Notional',     cat:'autocall' },
  { m:'SEP', d:'26', title:'Memory Coupon',      sub:'EEM EFA · 40447KHK2',     client:'Ryan Korsgaard',status:'Upcoming', tone:'info',    amt:'$1,340',   lbl:'Coupon',         cat:'coupon' },
  { m:'OCT', d:'08', title:'Autocall Observation', sub:'QQQ · 74348JQL5',       client:'Chris Jones',   status:'Below call', tone:'warning', amt:'$95,000',  lbl:'Notional',     cat:'autocall' },
  { m:'NOV', d:'14', title:'Maturity',           sub:'GLD · 06747PBB8',         client:'Maria Workman', status:'Scheduled',tone:'mute',    amt:'$52,000',  lbl:'Notional',       cat:'maturity' },
];
const LC_AT_RISK = [
  { name:'SPX RUT XLU Income Note', client:'David Young',  barrier:'25% Hard', dist:8,  worst:'XLU −17.2%' },
  { name:'EEM / EFA Income Note',   client:'Ryan Korsgaard', barrier:'40% Soft', dist:14, worst:'EEM −26.4%' },
];
const LC_PROCEEDS = [
  { title:'Issuer Call · SPX RUT XLU', client:'David Young', amt:'$353,000', when:'Settles Aug 14' },
  { title:'Maturity · NDX',            client:'Edwards Family', amt:'$120,000', when:'Settles Sep 8' },
];
function LifecyclePage() {
  const [tab, setTab] = React.useState('all');
  const [hoverMo, setHoverMo] = React.useState(null);
  const tabs = [ ['all','All Events'], ['coupon','Coupons'], ['autocall','Autocall'], ['maturity','Maturity'] ];
  const events = LC_PAGE_EVENTS.filter(e => tab === 'all' || e.cat === tab);
  const max = 210;
  const CARD = { background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:14 };
  const kpis = [
    ['Coupons this month', '$2,359', '4 payments across 3 clients'],
    ['Maturing next 90 days', '$525,000', '3 notes · 4 clients'],
    ['Autocalled YTD', '$1.21M', '6 notes called above level'],
    ['Near protection barrier', '2 positions', 'closest 8% from breach'],
  ];
  return (
    <div style={{ padding:'24px 32px 56px', fontFamily:'Inter' }}>
      <BackToDashboard />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:16 }}>
        {kpis.map(([lbl, val, sub], i) => (
          <div key={lbl} style={{ ...CARD, padding:'14px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'rgb(163,163,163)' }}>{lbl}</div>
            <div style={{ fontSize:22, fontWeight:700, color: i === 3 ? 'rgb(253,224,71)' : 'rgb(249,250,251)', letterSpacing:'-0.01em', margin:'6px 0 2px' }}>{val}</div>
            <div style={{ fontSize:11.5, color:'rgb(163,163,163)' }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1.6fr', gap:16, marginBottom:16, alignItems:'stretch' }}>
        <div style={{ ...CARD, padding:'16px 18px', display:'flex', flexDirection:'column' }}>
          <div style={{ fontSize:13.5, fontWeight:700, color:'rgb(249,250,251)', marginBottom:2 }}>Projected events</div>
          <div style={{ fontSize:11.5, color:'rgb(163,163,163)', marginBottom:14 }}>$ thousands · all accounts · next 8 months</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:10, flex:1, minHeight:220 }}>
            {LC_PAGE_MONTHS.map((mo, i) => {
              const parts = ['maturity','coupon','autocall'].filter(k => tab==='all' || tab===k);
              const total = parts.reduce((s,k) => s + LC_PAGE_SERIES[k].vals[i], 0);
              return (
                <div key={mo} onMouseEnter={()=>setHoverMo(i)} onMouseLeave={()=>setHoverMo(null)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%', justifyContent:'flex-end', position:'relative' }}>
                  {hoverMo === i && (
                    <div style={{ position:'absolute', bottom:'calc(100% - 4px)', left:'50%', transform:'translateX(-50%)', zIndex:20, background:'rgb(17,24,39)', border:'1px solid rgb(75,85,99)', borderRadius:8, padding:'8px 10px', boxShadow:'0 10px 24px -8px rgba(0,0,0,0.6)', whiteSpace:'nowrap' }}>
                      <div style={{ fontSize:10.5, fontWeight:700, color:'rgb(249,250,251)', marginBottom:4 }}>{mo} · ${total}K</div>
                      {parts.map(k => (
                        <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:10.5, color:'rgb(209,213,219)', lineHeight:1.6 }}>
                          <span style={{ width:7, height:7, borderRadius:2, background:LC_PAGE_SERIES[k].color }}></span>
                          <span style={{ minWidth:52 }}>{LC_PAGE_SERIES[k].label}</span>
                          <span style={{ fontWeight:600, color:'rgb(249,250,251)' }}>${LC_PAGE_SERIES[k].vals[i]}K</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ width:'100%', maxWidth:34, height:200, display:'flex', flexDirection:'column-reverse', borderRadius:4, overflow:'hidden', background:'rgba(255,255,255,0.03)', outline: hoverMo===i ? '1px solid rgba(94,214,164,0.6)' : 'none' }}>
                    {parts.map(k => {
                      const h = Math.round(LC_PAGE_SERIES[k].vals[i] / max * 200);
                      return h ? <div key={k} style={{ height:h, background:LC_PAGE_SERIES[k].color, opacity: hoverMo===null||hoverMo===i ? 1 : 0.45 }}></div> : null;
                    })}
                  </div>
                  <span style={{ fontSize:10, color: hoverMo===i ? 'rgb(249,250,251)' : 'rgb(163,163,163)' }}>{mo}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:14, paddingTop:14 }}>
            {Object.entries(LC_PAGE_SERIES).map(([k, s]) => (
              <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10.5, color:'rgb(163,163,163)' }}>
                <span style={{ width:8, height:8, borderRadius:2, background:s.color, opacity: tab==='all'||tab===k ? 1 : 0.25 }}></span>{s.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ ...CARD, padding:'16px 18px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:'rgb(249,250,251)' }}>Upcoming events</div>
            <div style={{ display:'flex', gap:6 }}>
              {tabs.map(([id, lbl]) => (
                <button key={id} onClick={()=>setTab(id)} style={{ fontFamily:'Inter', fontSize:11, fontWeight: tab===id?600:500, cursor:'pointer', padding:'4px 11px', borderRadius:9999, border:`1px solid ${tab===id ? 'rgb(5,122,85)' : 'rgb(75,85,99)'}`, background: tab===id ? 'rgba(5,122,85,0.22)' : 'transparent', color: tab===id ? 'rgb(94,214,164)' : 'rgb(163,163,163)' }}>{lbl}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'40px minmax(0,1.4fr) minmax(0,1fr) auto auto', gap:10, padding:'4px 0 6px', borderBottom:'1px solid rgba(75,85,99,0.6)' }}>
            {['Date','Event','Client','Status','Amount'].map(c => <span key={c} style={{ fontSize:10, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'rgb(163,163,163)', textAlign: c==='Amount'?'right':'left' }}>{c}</span>)}
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            {events.map((e, i) => {
              const t = haloTone[e.tone];
              return (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'40px minmax(0,1.4fr) minmax(0,1fr) auto auto', alignItems:'center', gap:10, padding:'8px 0', borderTop: i ? '1px solid rgba(75,85,99,0.4)' : 'none' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'rgb(163,163,163)', letterSpacing:'0.08em' }}>{e.m}</div>
                    <div style={{ fontWeight:700, fontSize:15, color:'rgb(5,122,85)', lineHeight:1 }}>{e.d}</div>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:12.5, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.title}</div>
                    <div style={{ fontSize:10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.sub}</div>
                  </div>
                  <a onClick={() => window.dispatchEvent(new CustomEvent('client:open', { detail:{ client:e.client } }))} style={{ fontSize:12, fontWeight:500, color:'rgb(94,214,164)', cursor:'pointer', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.client}</a>
                  <span style={{ fontWeight:600, fontSize:10, padding:'2px 8px', borderRadius:9999, background:t.bg, color:t.fg, border:`1px solid ${t.ring}`, whiteSpace:'nowrap' }}>{e.status}</span>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:600, fontSize:12.5, color:'rgb(249,250,251)', whiteSpace:'nowrap' }}>{e.amt}</div>
                    <div style={{ fontSize:10, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>{e.lbl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ ...CARD, padding:'16px 18px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:'rgb(249,250,251)' }}>Proceeds to reinvest</div>
            <a onClick={() => window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'watchlist' } }))} style={{ fontSize:11.5, fontWeight:600, color:'rgb(94,214,164)', cursor:'pointer' }}>View live auctions →</a>
          </div>
          <div style={{ fontSize:11.5, color:'rgb(163,163,163)', marginBottom:10 }}>Called and maturing notes settling soon — candidates for rolling into current terms.</div>
          {LC_PROCEEDS.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'10px 0', borderTop:'1px solid rgba(75,85,99,0.45)' }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:'rgb(249,250,251)' }}>{p.title}</div>
                <div style={{ fontSize:11, color:'rgb(163,163,163)' }}>{p.client} · {p.when}</div>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:'rgb(52,211,153)', whiteSpace:'nowrap' }}>{p.amt}</span>
            </div>
          ))}
        </div>
        <div style={{ ...CARD, padding:'16px 18px' }}>
          <div style={{ fontSize:13.5, fontWeight:700, color:'rgb(249,250,251)', marginBottom:4 }}>Positions near protection barrier</div>
          <div style={{ fontSize:11.5, color:'rgb(163,163,163)', marginBottom:10 }}>Distance between the worst underlier and the protection level.</div>
          {LC_AT_RISK.map((p, i) => (
            <div key={i} style={{ padding:'10px 0', borderTop:'1px solid rgba(75,85,99,0.45)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:'rgb(249,250,251)' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'rgb(163,163,163)' }}>{p.client} · {p.barrier} · worst underlier {p.worst}</div>
                </div>
                <span style={{ fontSize:12, fontWeight:700, color: p.dist < 10 ? 'rgb(253,224,71)' : 'rgb(209,213,219)', whiteSpace:'nowrap' }}>{p.dist}% to breach</span>
              </div>
              <div style={{ height:6, borderRadius:9999, background:'rgba(255,255,255,0.06)', marginTop:8, overflow:'hidden' }}>
                <div style={{ width:`${100 - p.dist * 2.5}%`, height:'100%', borderRadius:9999, background: p.dist < 10 ? 'rgb(227,160,8)' : 'rgb(5,122,85)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -- Journal tile ---------------------------------------------------------- */
const JOURNAL_ARTICLES = [
  { id:'catapult', tag:'Structured Notes 101', ago:'8 days ago',  date:'Aug 10, 2026', read:'5 min read', t:'Understanding Catapult Structured Notes: How the First Observation Date Shapes the Payoff Path',
    sections:[
      { t:'Structured notes are bank-issued investments that combine market-linked growth potential with bond-like safety features. Inside the wrapper sits a zero-coupon bond paired with options on an underlier — an index, a stock, or a basket. Catapult notes are a growth variant that concentrates much of the return potential in the first observation date.' },
      { h:'How the first observation works', t:'If the underlier closes at or above its call level on the first observation date, the note is redeemed early and pays the full stated premium — often several times the annualized coupon of a comparable autocallable. Because that first date carries the largest payoff, the entry point matters more than with standard autocalls.' },
      { h:'After the first date', t:'If the note is not called on the first observation, subsequent observations usually revert to a standard autocall schedule, and the note behaves like a conventional income structure for the remainder of its term. Advisors typically ladder catapult exposure across issuance dates so no single observation window dominates the outcome.' },
      { h:'Where it fits', t:'Catapults suit clients with a moderately bullish view over a short horizon who want a defined payoff rather than open-ended participation. As with all structured notes, protection applies only when held to maturity and issuer credit risk applies throughout.' },
    ]},
  { id:'layered', tag:'Advisor Insights', ago:'2 weeks ago', date:'Jul 30, 2026', read:'4 min read', t:'Two Ways Advisors Can Use Structured Notes: Layered Vs. Replacement Allocations',
    sections:[
      { t:'Structured notes are a vehicle, not an asset class — a different and often more efficient way to access the stocks and bonds a portfolio already holds. That framing drives the two dominant implementation patterns advisors use.' },
      { h:'Layered allocations', t:'A layered allocation adds structured notes on top of an existing core portfolio, using them to reshape the return profile — trading some upside for defined protection or enhanced income — without selling underlying positions. This suits appreciated taxable accounts where turnover is costly.' },
      { h:'Replacement allocations', t:'A replacement allocation swaps a slice of the equity or fixed income sleeve for notes tracking the same exposure. The portfolio keeps its market participation but gains a buffer or coupon stream in exchange for capped upside. This works well in qualified accounts where turnover is frictionless.' },
      { h:'Choosing between them', t:'The decision usually comes down to tax posture and where the client sits relative to plan. Clients ahead of plan tend to layer protection over what they have; clients who need the return stream restructured tend toward replacement.' },
    ]},
  { id:'volatility', tag:'Advisor Insights', ago:'4 weeks ago', date:'Jul 20, 2026', read:'4 min read', t:'The New Volatility Trade: What Market Rotation Means for Investors',
    sections:[
      { t:'Sector rotation has lifted single-name and sector-index volatility even as broad-index volatility stays subdued. For structured note pricing, that gap matters: higher implied volatility on the underlier translates directly into better coupons or deeper protection.' },
      { h:'Where the pricing is richest', t:'Notes on rotating sectors — energy, utilities, small caps — are currently pricing materially richer terms than S&P-linked equivalents at the same protection level. Income note yields in particular tend to spike in turbulent markets, a pattern visible in every major volatility episode since 2018.' },
      { h:'The trade-off', t:'Dispersion risk. Worst-of structures spanning uncorrelated underliers should be sized accordingly, and hard-buffer variants deserve a closer look where the client cannot tolerate breach scenarios.' },
    ]},
  { id:'buffer', tag:'Structured Notes 101', ago:'5 weeks ago', date:'Jul 9, 2026', read:'5 min read', t:'Understanding Structured Notes: Hard Protection (Buffer)',
    sections:[
      { t:'Structured notes behave like a hybrid between a stock and a bond: technically a bond, but with market value linked to the return of an underlier. Protection is the feature that defines how much downside a client actually wears — and hard protection is the strictest form.' },
      { h:'How a hard buffer works', t:'A hard buffer absorbs the first fixed percentage of underlier decline at maturity. With a 20% buffer, a 15% drawdown returns full principal; a 30% drawdown loses only the 10% beyond the buffer. Losses get a defined head start.' },
      { h:'Hard vs. soft protection', t:'Soft (barrier) protection eliminates losses only until the threshold is breached — beyond it, the investor is exposed to the full decline from the initial level. Buffers are “protected, period”; barriers are all-or-nothing. Hard protection is most effective in moderately to severely volatile markets.' },
      { h:'What it costs', t:'Buffered notes typically price with lower coupons or caps than barrier equivalents at the same level — the certainty costs yield. They suit clients for whom that certainty is the difference between staying invested and de-risking.' },
    ]},
  { id:'ladder', tag:'Structured Notes 101', ago:'2 months ago', date:'Jun 12, 2026', read:'4 min read', t:'Laddering Structured Notes: Managing Reinvestment and Interest-Rate Risk',
    sections:[
      { t:'The same laddering practice familiar from fixed income applies to structured notes: staggering trade dates and maturities so no single pricing window, rate environment, or observation schedule dominates the portfolio’s outcome.' },
      { h:'Why it works', t:'A ladder smooths reinvestment risk — notes mature and reprice at different points in the rate cycle — and turns autocall unpredictability into a steady cadence of maturing rungs that can be rolled into current terms.' },
    ]},
  { id:'underhood', tag:'Structured Notes 101', ago:'2 months ago', date:'May 28, 2026', read:'5 min read', t:'Under the Hood: How Structured Notes Work',
    sections:[
      { t:'On the outside, a structured note is simply a wrapper. Inside sits a combination of a zero-coupon bond and options on the underlier — the bond provides the protection component, the options create the payoff profile.' },
      { h:'Why the composition matters', t:'Because the ingredients are ordinary instruments, note pricing is transparent and competitive: the same structure can be auctioned across issuers, and richer option premiums (higher volatility) translate directly into better terms.' },
    ]},
  { id:'assetclass', tag:'Advisor Insights', ago:'3 months ago', date:'May 14, 2026', read:'3 min read', t:'Why Structured Notes Are a Vehicle, Not an Asset Class',
    sections:[
      { t:'A common misconception is that structured notes are an asset class. More accurately, they are a structure — a different, often more efficient way to access the stocks and bonds investors already know.' },
      { h:'The practical consequence', t:'Notes should be evaluated against the exposure they wrap, not as a separate sleeve. A buffered S&P note belongs in the equity conversation; an income note competes with the bond allocation it replaces.' },
    ]},
  { id:'taxloss', tag:'Advisor Insights', ago:'4 months ago', date:'Apr 30, 2026', read:'4 min read', t:'Tax-Loss Harvesting with Structured Notes Ahead of Year-End',
    sections:[
      { t:'Tax-loss harvesting is a proven way to lower long-term tax liability, and structured notes give advisors a clean replacement vehicle: harvest the loss in the underlying position, keep the exposure through a note on the same index.' },
      { h:'Timing considerations', t:'Because notes are issued on a schedule, year-end harvesting works best planned a quarter ahead — auction calendars fill in December, and observation dates should clear the wash-sale window.' },
    ]},
  { id:'soft', tag:'Structured Notes 101', ago:'4 months ago', date:'Apr 16, 2026', read:'4 min read', t:'Understanding Structured Notes: Soft (Barrier) Protection',
    sections:[
      { t:'Soft protection eliminates losses entirely as long as the underlier finishes above the barrier at maturity. A 30% barrier returns full principal on any decline up to 30% — but a breach exposes the full decline from the initial level.' },
      { h:'Where it fits', t:'Soft protection is most effective in positive and moderately negative scenarios, and prices richer coupons than a hard buffer at the same level. It suits clients comfortable trading tail exposure for yield.' },
    ]},
  { id:'growthincome', tag:'Structured Notes 101', ago:'5 months ago', date:'Apr 2, 2026', read:'4 min read', t:'Growth Notes vs. Income Notes: Choosing the Right Payoff',
    sections:[
      { t:'Structured notes fall into two broad camps. Growth notes pay a participation rate on the underlier’s appreciation — sometimes levered, sometimes capped. Income notes pay a coupon stream with protection on both principal and coupons.' },
      { h:'Choosing between them', t:'Income notes do not participate in upside the way growth notes do, but their yields can spike in turbulent markets. The choice tracks the client’s objective: replace equity upside, or replace bond income at higher yield.' },
    ]},
];
function JournalTile({ onMore }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const open = (a) => window.dispatchEvent(new CustomEvent('journal:open', { detail:{ id:a.id } }));
  const tileArts = JOURNAL_ARTICLES.slice(0, 4);
  const act = tileArts[activeIdx];
  return (
    <Tile title="Journal" onMore={onMore ? onMore : () => open(act)} footLabel="Halo · As of today">
      <div style={{ display:'flex', gap:16, flex:1, minHeight:0, paddingTop:2 }}>
        <div onClick={() => open(act)} style={{ flex:'0 0 38%', borderRadius:10, cursor:'pointer', minHeight:280, position:'relative', overflow:'hidden', border:'1px solid rgba(75,85,99,0.6)' }}>
          {tileArts.map((a, i) => (
            <div key={a.id} style={{ position:'absolute', inset:0, opacity: i === activeIdx ? 1 : 0, transition:'opacity 220ms ease', pointerEvents: i === activeIdx ? 'auto' : 'none' }}>
              <image-slot id={`journal-card-${a.id}`} shape="rect" placeholder="Drop article image"></image-slot>
            </div>
          ))}
          <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'26px 12px 12px', background:'linear-gradient(transparent, rgba(10,18,30,0.92))', pointerEvents:'none' }}>
            <span style={{ fontFamily:'Inter', fontSize:10, fontWeight:600, letterSpacing:'0.06em', color:'rgb(94,214,164)', textTransform:'uppercase' }}>{act.tag}</span>
            <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, color:'rgb(249,250,251)', lineHeight:1.35, marginTop:3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{act.t}</div>
          </div>
        </div>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
          {tileArts.map((a, i) => (
            <div key={a.id} onClick={() => open(a)} onMouseEnter={()=>setActiveIdx(i)} style={{ padding:'10px 0', borderTop: i ? '1px solid rgba(75,85,99,0.45)' : 'none', cursor:'pointer', background: i === activeIdx ? 'rgba(5,122,85,0.06)' : 'transparent' }}>
              <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
                <span style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)' }}>{a.tag}</span>
                <span style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>{a.ago}</span>
              </div>
              <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:500, color: i === activeIdx ? 'rgb(94,214,164)' : 'rgb(249,250,251)', lineHeight:1.4, marginTop:3, transition:'color 120ms ease' }}>{a.t}</div>
            </div>
          ))}
        </div>
      </div>
    </Tile>
  );
}

/* -- Watchlist tile (dashboard) ------------------------------------------------ */
function WatchlistTile({ onMore }) {
  const rows = WATCHLIST_ROWS.slice(0, 5);
  return (
    <Tile title="Watchlist" onMore={onMore} footLabel="Halo · Live pricing">
      <div style={{ display:'flex', flexDirection:'column', paddingTop:2 }}>
        {rows.map((r, i) => {
          const t = haloTone[r.tone];
          return (
            <div key={r.id} onClick={() => window.dispatchEvent(new CustomEvent('note:open', { detail:{ id:r.id } }))} style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) auto auto', alignItems:'center', gap:10, padding:'9px 0', borderTop: i ? '1px solid rgba(75,85,99,0.45)' : 'none', cursor:'pointer' }}
              onMouseEnter={(e)=>{ e.currentTarget.firstChild.firstChild.style.color = 'rgb(94,214,164)'; }}
              onMouseLeave={(e)=>{ e.currentTarget.firstChild.firstChild.style.color = 'rgb(249,250,251)'; }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:12.5, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', transition:'color 120ms ease' }}>{r.unds.join(' / ')}</div>
                <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.term} · {r.prot} · {r.feat}</div>
              </div>
              <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:700, color:'rgb(52,211,153)', whiteSpace:'nowrap' }}>{r.yield}</span>
              <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:10, padding:'2px 8px', borderRadius:9999, background:t.bg, color:t.fg, border:`1px solid ${t.ring}`, whiteSpace:'nowrap' }}>{r.status.replace('Auction closed', 'Closed')}</span>
            </div>
          );
        })}
      </div>
    </Tile>
  );
}

/* -- Journal article page (blog layout) --------------------------------------- */
function JournalArticlePage({ articleId, onBack }) {
  const a = JOURNAL_ARTICLES.find(x => x.id === articleId) || JOURNAL_ARTICLES[0];
  const others = JOURNAL_ARTICLES.filter(x => x.id !== a.id).slice(0, 4);
  React.useEffect(() => { const m = document.querySelector('main'); if (m) m.scrollTop = 0; window.scrollTo(0, 0); }, [articleId]);
  return (
    <div style={{ padding:'28px 32px 64px', fontFamily:'Inter' }}>
      <div style={{ maxWidth:1060, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, fontFamily:'Inter', marginBottom:22 }}>
          <a onClick={() => window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'dashboard' } }))} style={{ color:'rgb(5,122,85)', fontWeight:500, cursor:'pointer' }}>Dashboard</a>
          <i className="fa-solid fa-chevron-right" style={{ width:10, height:10, color:'rgb(107,114,128)' }} />
          <a onClick={onBack} style={{ color:'rgb(5,122,85)', fontWeight:500, cursor:'pointer' }}>Journals</a>
          <i className="fa-solid fa-chevron-right" style={{ width:10, height:10, color:'rgb(107,114,128)' }} />
          <span style={{ color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:420 }}>{a.t}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 280px', gap:36, alignItems:'start' }}>
          <div>
            <div>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'rgb(94,214,164)', background:'rgba(5,122,85,0.15)', border:'1px solid rgba(5,122,85,0.4)', borderRadius:9999, padding:'4px 12px' }}>{a.tag}</span>
              <h1 style={{ fontSize:28, fontWeight:700, lineHeight:1.25, color:'rgb(249,250,251)', margin:'16px 0 8px', letterSpacing:'-0.015em', textWrap:'pretty' }}>{a.t}</h1>
              <div style={{ fontSize:12.5, color:'rgb(163,163,163)' }}>Halo Journal · {a.date} · {a.read}</div>
            </div>
            <div style={{ margin:'24px 0 28px', height:320 }}>
              <image-slot id={`journal-hero-${a.id}`} shape="rounded" radius="14" placeholder="Drop a hero image for this article"></image-slot>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {a.sections.map((s, i) => (
                <div key={i}>
                  {s.h && <h2 style={{ fontSize:18, fontWeight:700, color:'rgb(249,250,251)', margin:'20px 0 8px', letterSpacing:'-0.01em' }}>{s.h}</h2>}
                  <p style={{ margin:'0 0 8px', fontSize:15, lineHeight:1.75, color:'rgb(209,213,219)' }}>{s.t}</p>
                </div>
              ))}
            </div>
            <div style={{ margin:'28px 0 0', padding:'18px 22px', borderRadius:12, background:'rgba(5,122,85,0.10)', border:'1px solid rgba(5,122,85,0.35)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'rgb(94,214,164)', marginBottom:6 }}>From the desk</div>
              <div style={{ fontSize:13.5, lineHeight:1.65, color:'rgb(209,213,219)' }}>Structured notes are a defined-outcome vehicle, not an asset class — the same equity and rate exposures your clients already hold, repackaged with protection and payoff terms you choose up front.</div>
            </div>
          </div>
          <aside style={{ position:'sticky', top:24 }}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgb(163,163,163)', marginBottom:12 }}>More from the Journal</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {others.map(o => (
                <div key={o.id} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:10, borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)' }}
                  onMouseEnter={(e)=>{ e.currentTarget.style.borderColor = 'rgb(5,122,85)'; }}
                  onMouseLeave={(e)=>{ e.currentTarget.style.borderColor = 'rgb(75,85,99)'; }}>
                  <div style={{ width:64, height:64, flexShrink:0 }}>
                    <image-slot id={`journal-card-${o.id}`} shape="rounded" radius="8" placeholder=" "></image-slot>
                  </div>
                  <div onClick={() => window.dispatchEvent(new CustomEvent('journal:open', { detail:{ id:o.id } }))} style={{ minWidth:0, cursor:'pointer' }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgb(94,214,164)' }}>{o.tag}</div>
                    <div style={{ fontSize:12, fontWeight:600, lineHeight:1.4, color:'rgb(249,250,251)', marginTop:3, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{o.t}</div>
                    <div style={{ fontSize:10.5, color:'rgb(163,163,163)', marginTop:3 }}>{o.ago}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* -- Watchlist page (watched note tiles) -------------------------------------- */
const UND_NAMES = { NDX:'Nasdaq', RUT:'Russell 2000', SPX:'S&P 500', XLU:'Utilities', XLE:'Energy', XLF:'Financials', COP:'Conoco', ORCL:'Oracle', NVDA:'NVIDIA', TSLA:'Tesla', MSFT:'Microsoft', AAPL:'Apple', GLD:'Gold', EEM:'EM Equity', EFA:'EAFE', QQQ:'Nasdaq 100', RTY:'Russell 2000' };
const UND_VARIANTS = [
  { bg:'rgb(249,250,251)', name:'rgb(17,24,39)', tick:'rgb(107,114,128)', ring:'rgba(255,255,255,0.25)' },
  { bg:'rgb(23,37,64)',    name:'rgb(249,250,251)', tick:'rgb(148,163,184)', ring:'rgba(118,169,250,0.35)' },
  { bg:'rgb(229,231,235)', name:'rgb(17,24,39)', tick:'rgb(107,114,128)', ring:'rgba(255,255,255,0.25)' },
];
function UnderlierBadge({ ticker, i }) {
  const v = UND_VARIANTS[i % UND_VARIANTS.length];
  return (
    <div style={{ width:62, height:62, borderRadius:12, background:v.bg, border:`1px solid ${v.ring}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, boxShadow:'0 4px 12px -4px rgba(0,0,0,0.45)' }}>
      <span style={{ fontFamily:'Inter', fontSize:9, fontWeight:700, letterSpacing:'0.09em', color:v.tick }}>{ticker}</span>
      <span style={{ fontFamily:'Inter', fontSize:10, fontWeight:700, color:v.name, textAlign:'center', lineHeight:1.15, padding:'0 4px', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis' }}>{UND_NAMES[ticker] || ticker}</span>
    </div>
  );
}
const WATCHLIST_ROWS = [
  { id:'ndx',  unds:['NDX','RUT','SPX'],  post:'$5,000,000.0 of this Income Note with a trade date of 07-31-2026.', yield:'12.60%', term:'24 months', prot:'30% Soft', feat:'Memory · Autocall', status:'Auction closed Jul 31', tone:'mute' },
  { id:'cop',  unds:['COP','XLE'],        post:'$1,101,000 of this Income Note with a trade date of 07-28-2026.', yield:'8.65%',  term:'24 months', prot:'40% Soft', feat:'Fixed · Non-callable', status:'Auction closed Jul 28', tone:'mute' },
  { id:'spx',  unds:['SPX','RUT','XLU'],  post:'$353,000 of this Income Note with a trade date of 08-21-2026.', yield:'9.10%',  term:'36 months', prot:'25% Hard', feat:'Memory · Autocall', status:'Live auction', tone:'success' },
  { id:'orcl', unds:['ORCL'],             post:'$750,000 of this Fixed Coupon Note with a trade date of 08-24-2026.', yield:'10.54%', term:'18 months', prot:'30% Soft', feat:'Fixed · Callable', status:'Live auction', tone:'success' },
  { id:'nvda', unds:['NVDA','TSLA'],      post:'$2,400,000 of this Growth Note with a trade date of 08-28-2026.', yield:'142% cap', term:'36 months', prot:'20% Hard', feat:'Uncapped · Catapult', status:'Live auction', tone:'success' },
  { id:'msft', unds:['MSFT','AAPL'],      post:'$1,850,000 of this Income Note pricing this Friday.', yield:'9.85%',  term:'24 months', prot:'35% Soft', feat:'Memory · Autocall', status:'Pricing Fri', tone:'warning' },
  { id:'spxg', unds:['SPX'],              post:'$3,200,000 of this Growth Note with a trade date of 08-04-2026.', yield:'1.5x to 60%', term:'60 months', prot:'15% Hard', feat:'Participation · Capped', status:'Auction closed Aug 4', tone:'mute' },
  { id:'gld',  unds:['GLD'],              post:'$925,000 of this Digital Note with a trade date of 08-26-2026.', yield:'11.20%', term:'12 months', prot:'25% Soft', feat:'Digital · Fixed barrier', status:'Live auction', tone:'success' },
  { id:'jpm',  unds:['XLF'],              post:'$1,300,000 of this Income Note pricing this Monday.', yield:'8.90%',  term:'24 months', prot:'30% Soft', feat:'Fixed · Callable', status:'Pricing Mon', tone:'warning' },
  { id:'eem',  unds:['EEM','EFA'],        post:'$2,050,000 of this Income Note with a trade date of 08-30-2026.', yield:'13.40%', term:'36 months', prot:'40% Soft', feat:'Memory · Worst-of', status:'Live auction', tone:'success' },
  { id:'rty',  unds:['RTY'],              post:'$1,600,000 of this Twin-Win Note with a trade date of 07-15-2026.', yield:'± absolute', term:'48 months', prot:'25% Hard', feat:'Absolute return', status:'Auction closed Jul 15', tone:'mute' },
  { id:'qqq',  unds:['QQQ'],              post:'$2,750,000 of this Step-Up Autocall with a trade date of 09-02-2026.', yield:'10.05%', term:'30 months', prot:'30% Soft', feat:'Step-up · Autocall', status:'Live auction', tone:'success' },
];
const BENEFIT_CLIENTS = [
  { name:'David Young',   why:'Income sleeve up for renewal; suitability matches buffered income notes', aum:'$4.2M' },
  { name:'Maria Workman', why:'Approved proposal includes structured note allocation pending funding',   aum:'$2.8M' },
  { name:'Robert Patel',  why:'Q4 review flagged concentration risk — candidate for hard-buffer swap',   aum:'$1.9M' },
];
function BenefitClients() {
  return (
    <div>
      <div style={{ fontFamily:'Inter', fontSize:15, fontWeight:700, color:'rgb(249,250,251)', letterSpacing:'-0.01em', marginBottom:12 }}>Clients that may benefit</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
        {BENEFIT_CLIENTS.map(c => (
          <div key={c.name} onClick={() => window.dispatchEvent(new CustomEvent('client:open', { detail:{ client:c.name } }))} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', cursor:'pointer' }}
            onMouseEnter={(e)=>{ e.currentTarget.style.borderColor = 'rgb(5,122,85)'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.borderColor = 'rgb(75,85,99)'; }}>
            <div style={{ width:34, height:34, borderRadius:9999, flexShrink:0, background:'rgba(5,122,85,0.2)', border:'1px solid rgba(5,122,85,0.5)', color:'rgb(94,214,164)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontSize:12, fontWeight:700 }}>{c.name.split(' ').map(w=>w[0]).join('')}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:'rgb(249,250,251)' }}>{c.name}</span>
                <span style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>{c.aum}</span>
              </div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', lineHeight:1.5, marginTop:2 }}>{c.why}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function WatchButton({ on, onClick }) {
  return (
    <button onClick={(e)=>{ e.stopPropagation(); onClick(); }} title={on ? 'Remove from watchlist' : 'Add to watchlist'} style={{
      display:'inline-flex', alignItems:'center', gap:6,
      fontFamily:'Inter', fontSize:11, fontWeight:600, cursor:'pointer',
      color: on ? 'rgb(94,214,164)' : 'rgb(209,213,219)',
      background:'rgba(17,24,39,0.85)', border:`1px solid ${on ? 'rgba(5,122,85,0.7)' : 'rgb(75,85,99)'}`,
      borderRadius:9999, padding:'4px 10px',
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      {on ? 'Watching' : 'Watch'}
    </button>
  );
}
function NoteCard({ r, watched, onToggle }) {
  const t = haloTone[r.tone];
  return (
    <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(75,85,99,0.45)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:'10px 10px 0' }}>
          <WatchButton on={watched} onClick={onToggle} />
          <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:10, padding:'3px 9px', borderRadius:9999, background:'rgba(17,24,39,0.85)', color:t.fg, border:`1px solid ${t.ring}`, whiteSpace:'nowrap', maxWidth:'55%', overflow:'hidden', textOverflow:'ellipsis' }}>{r.status.replace('Auction closed', 'Closed')}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 10px 16px' }}>
          {r.unds.map((u, i) => <UnderlierBadge key={u} ticker={u} i={i} />)}
        </div>
      </div>
      <div style={{ padding:'12px 14px 14px', display:'flex', flexDirection:'column', gap:10, flex:1 }}>
        <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:600, color:'rgb(249,250,251)', lineHeight:1.45 }}>{r.post}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontFamily:'Inter', fontSize:20, fontWeight:700, color:'rgb(52,211,153)', letterSpacing:'-0.01em' }}>{r.yield}</span>
          <span style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)' }}>{r.yield.includes('%') && !r.yield.includes('cap') && !r.yield.includes('to') ? 'annualized yield' : 'payoff'}</span>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {[r.term, r.prot, r.feat].map(c => (
            <span key={c} style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:500, color:'rgb(209,213,219)', border:'1px solid rgba(75,85,99,0.8)', borderRadius:9999, padding:'3px 9px', whiteSpace:'nowrap' }}>{c}</span>
          ))}
        </div>
        <div style={{ marginTop:'auto', paddingTop:4 }}>
          <button onClick={() => window.dispatchEvent(new CustomEvent('note:open', { detail:{ id:r.id } }))} style={{ display:'inline-flex', alignItems:'center', gap:7, fontFamily:'Inter', fontSize:11.5, fontWeight:600, color:'rgb(94,214,164)', background:'transparent', border:'1px solid rgba(5,122,85,0.55)', borderRadius:9999, padding:'6px 13px', cursor:'pointer' }}
            onMouseEnter={(e)=>{ e.currentTarget.style.background = 'rgba(5,122,85,0.15)'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.background = 'transparent'; }}>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ width:11, height:11 }} /> View Full Post
          </button>
        </div>
      </div>
    </div>
  );
}
function WatchlistPage() {
  const [watched, setWatched] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem('halo.watched')||'null'); if (Array.isArray(s)) return new Set(s); } catch(e) {}
    return new Set(['ndx','cop','spx']);
  });
  React.useEffect(() => { localStorage.setItem('halo.watched', JSON.stringify([...watched])); }, [watched]);
  const toggle = (id) => setWatched(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const watchedRows = WATCHLIST_ROWS.filter(r => watched.has(r.id));
  const auctionRows = WATCHLIST_ROWS.filter(r => !watched.has(r.id));
  const HEAD = { fontFamily:'Inter', fontSize:15, fontWeight:700, color:'rgb(249,250,251)', letterSpacing:'-0.01em' };
  const SUB = { fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)' };
  return (
    <div style={{ padding:'28px 32px 56px', fontFamily:'Inter' }}>
      <BackToDashboard />
      <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:14 }}>
        <div style={HEAD}>Watchlist</div>
        <span style={SUB}>{watchedRows.length} notes you're watching</span>
      </div>
      {watchedRows.length ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:40 }}>
          {watchedRows.map(r => <NoteCard key={r.id} r={r} watched={true} onToggle={()=>toggle(r.id)} />)}
        </div>
      ) : (
        <div style={{ fontFamily:'Inter', fontSize:12.5, color:'rgb(163,163,163)', border:'1px dashed rgb(75,85,99)', borderRadius:12, padding:'22px 20px', marginBottom:40 }}>Nothing watched yet — tap Watch on any recent auction below to pin it here.</div>
      )}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(75,85,99,0.55)', padding:'22px 0 14px' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
          <div style={HEAD}>Recent auction</div>
          <span style={SUB}>Halo auctions · live pricing</span>
        </div>
        <button style={{ display:'inline-flex', alignItems:'center', gap:7, fontFamily:'Inter', fontSize:12, fontWeight:600, color:'#fff', background:'rgb(5,122,85)', border:'none', borderRadius:8, padding:'8px 14px', cursor:'pointer' }}>
          <i className="fa-solid fa-circle-plus" style={{ width:13, height:13 }} /> Create post
        </button>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'70px 2.4fr 1.1fr 0.9fr 0.9fr 1.2fr 1.2fr 110px', gap:12, alignItems:'center', padding:'11px 16px', borderBottom:'1px solid rgba(75,85,99,0.6)' }}>
          {['Watch','Post','Yield','Term','Protection','Features','Status',''].map((c,i) => <span key={i} style={{ fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'rgb(163,163,163)' }}>{c}</span>)}
        </div>
        {auctionRows.map((r, idx) => {
          const t = haloTone[r.tone];
          return (
            <div key={r.id} style={{ display:'grid', gridTemplateColumns:'70px 2.4fr 1.1fr 0.9fr 0.9fr 1.2fr 1.2fr 110px', gap:12, alignItems:'center', padding:'11px 16px', borderTop: idx ? '1px solid rgba(75,85,99,0.4)' : 'none' }}>
              <button onClick={()=>toggle(r.id)} title="Add to watchlist" style={{ width:30, height:30, borderRadius:8, border:'1px solid rgb(75,85,99)', background:'transparent', color:'rgb(163,163,163)', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center' }}
                onMouseEnter={(e)=>{ e.currentTarget.style.color = 'rgb(94,214,164)'; e.currentTarget.style.borderColor = 'rgb(5,122,85)'; }}
                onMouseLeave={(e)=>{ e.currentTarget.style.color = 'rgb(163,163,163)'; e.currentTarget.style.borderColor = 'rgb(75,85,99)'; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.post}</div>
                <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', marginTop:2 }}>{r.unds.join(' / ')}</div>
              </div>
              <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:700, color:'rgb(52,211,153)', whiteSpace:'nowrap' }}>{r.yield}</span>
              <span style={{ fontFamily:'Inter', fontSize:12, color:'rgb(209,213,219)' }}>{r.term}</span>
              <span style={{ fontFamily:'Inter', fontSize:12, color:'rgb(209,213,219)' }}>{r.prot}</span>
              <span style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>{r.feat}</span>
              <span style={{ justifySelf:'start', fontFamily:'Inter', fontWeight:600, fontSize:10.5, padding:'3px 10px', borderRadius:9999, background:t.bg, color:t.fg, border:`1px solid ${t.ring}`, whiteSpace:'nowrap' }}>{r.status}</span>
              <button onClick={() => window.dispatchEvent(new CustomEvent('note:open', { detail:{ id:r.id } }))} style={{ fontFamily:'Inter', fontSize:11.5, fontWeight:600, color:'rgb(94,214,164)', background:'transparent', border:'none', cursor:'pointer', textAlign:'right', whiteSpace:'nowrap', justifySelf:'end' }}>View post →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -- Note full-post page -------------------------------------------------------- */
function NotePostPage({ noteId, onBack }) {
  const r = WATCHLIST_ROWS.find(x => x.id === noteId) || WATCHLIST_ROWS[0];
  const t = haloTone[r.tone];
  React.useEffect(() => { const m = document.querySelector('main'); if (m) m.scrollTop = 0; window.scrollTo(0, 0); }, [noteId]);
  const stats = [ ['Annualized yield', r.yield], ['Term', r.term], ['Protection', r.prot], ['Features', r.feat] ];
  return (
    <div style={{ padding:'28px 32px 64px', fontFamily:'Inter' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, marginBottom:22 }}>
          <a onClick={() => window.dispatchEvent(new CustomEvent('nav:set', { detail:{ screen:'dashboard' } }))} style={{ color:'rgb(5,122,85)', fontWeight:500, cursor:'pointer' }}>Dashboard</a>
          <i className="fa-solid fa-chevron-right" style={{ width:10, height:10, color:'rgb(107,114,128)' }} />
          <a onClick={onBack} style={{ color:'rgb(5,122,85)', fontWeight:500, cursor:'pointer' }}>Watchlist</a>
          <i className="fa-solid fa-chevron-right" style={{ width:10, height:10, color:'rgb(107,114,128)' }} />
          <span style={{ color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:460 }}>{r.post}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          {r.unds.map((u, i) => <UnderlierBadge key={u} ticker={u} i={i} />)}
          <span style={{ marginLeft:'auto', fontFamily:'Inter', fontWeight:600, fontSize:11, padding:'4px 12px', borderRadius:9999, background:t.bg, color:t.fg, border:`1px solid ${t.ring}` }}>{r.status}</span>
        </div>
        <h1 style={{ fontSize:26, fontWeight:700, lineHeight:1.3, color:'rgb(249,250,251)', margin:'0 0 8px', letterSpacing:'-0.015em', textWrap:'pretty' }}>{r.post}</h1>
        <div style={{ fontSize:12.5, color:'rgb(163,163,163)', marginBottom:24 }}>Halo auction post · Recent auction</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:28 }}>
          {stats.map(([lbl, val]) => (
            <div key={lbl} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:12, padding:'12px 14px' }}>
              <div style={{ fontSize:10.5, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'rgb(163,163,163)', marginBottom:4 }}>{lbl}</div>
              <div style={{ fontSize:15, fontWeight:700, color: lbl === 'Annualized yield' ? 'rgb(52,211,153)' : 'rgb(249,250,251)' }}>{val}</div>
            </div>
          ))}
        </div>
        <p style={{ margin:'0 0 28px', fontSize:14.5, lineHeight:1.75, color:'rgb(209,213,219)', maxWidth:720 }}>
          This note was placed through a competitive Halo auction across multiple issuing banks. Pricing reflects the winning issuer's terms at auction close; protection applies at maturity and issuer credit risk applies throughout the term. Full term sheet, issuer details, and observation schedule are available in the auction record.
        </p>
        <div style={{ borderTop:'1px solid rgba(75,85,99,0.55)', paddingTop:24 }}>
          <BenefitClients />
        </div>
      </div>
    </div>
  );
}

/* -- Journals page ------------------------------------------------------------- */
function JournalsPage() {
  const open = (a) => window.dispatchEvent(new CustomEvent('journal:open', { detail:{ id:a.id } }));
  const featured = JOURNAL_ARTICLES[0];
  const rest = JOURNAL_ARTICLES.slice(1, 4);
  const more = JOURNAL_ARTICLES.slice(4);
  return (
    <div style={{ padding:'28px 32px 56px', fontFamily:'Inter' }}>
      <BackToDashboard />
      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:16, marginBottom:16 }}>
        <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}
          onMouseEnter={(e)=>{ e.currentTarget.style.borderColor = 'rgb(5,122,85)'; }}
          onMouseLeave={(e)=>{ e.currentTarget.style.borderColor = 'rgb(75,85,99)'; }}>
          <div style={{ height:240 }}>
            <image-slot id={`journal-card-${featured.id}`} shape="rect" placeholder="Featured article image"></image-slot>
          </div>
          <div onClick={() => open(featured)} style={{ padding:'16px 18px 18px', display:'flex', flexDirection:'column', gap:8, flex:1, cursor:'pointer' }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
              <span style={{ fontSize:10.5, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgb(94,214,164)' }}>{featured.tag}</span>
              <span style={{ fontSize:11, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>{featured.ago}</span>
            </div>
            <div style={{ fontSize:17, fontWeight:700, lineHeight:1.35, color:'rgb(249,250,251)', letterSpacing:'-0.01em' }}>{featured.t}</div>
            <div style={{ fontSize:12.5, lineHeight:1.6, color:'rgb(163,163,163)', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{featured.sections[0].t}</div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {rest.map(a => (
            <div key={a.id} style={{ display:'flex', gap:14, background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:12, overflow:'hidden', flex:1 }}
              onMouseEnter={(e)=>{ e.currentTarget.style.borderColor = 'rgb(5,122,85)'; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.borderColor = 'rgb(75,85,99)'; }}>
              <div style={{ width:130, flexShrink:0 }}>
                <image-slot id={`journal-card-${a.id}`} shape="rect" placeholder=" "></image-slot>
              </div>
              <div onClick={() => open(a)} style={{ padding:'12px 14px 12px 0', display:'flex', flexDirection:'column', gap:5, cursor:'pointer', justifyContent:'center', minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgb(94,214,164)' }}>{a.tag}</span>
                  <span style={{ fontSize:10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>{a.ago}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:600, lineHeight:1.4, color:'rgb(249,250,251)' }}>{a.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
        {more.map(a => (
          <div key={a.id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgb(75,85,99)', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}
            onMouseEnter={(e)=>{ e.currentTarget.style.borderColor = 'rgb(5,122,85)'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.borderColor = 'rgb(75,85,99)'; }}>
            <div style={{ height:130 }}>
              <image-slot id={`journal-card-${a.id}`} shape="rect" placeholder="Article image"></image-slot>
            </div>
            <div onClick={() => open(a)} style={{ padding:'12px 14px 14px', display:'flex', flexDirection:'column', gap:6, flex:1, cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgb(94,214,164)' }}>{a.tag}</span>
                <span style={{ fontSize:10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap' }}>{a.ago}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, lineHeight:1.4, color:'rgb(249,250,251)' }}>{a.t}</div>
              <div style={{ fontSize:11.5, lineHeight:1.55, color:'rgb(163,163,163)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{a.sections[0].t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PortfolioLifecycle, JournalTile, JournalArticlePage, WatchlistPage, JournalsPage, NotePostPage, WatchlistTile, LifecyclePage, JOURNAL_ARTICLES, WATCHLIST_ROWS });
