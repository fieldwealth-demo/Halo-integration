// ConnectionsPanel — slide-in panel showing connected/disconnected integrations.
// Styled after the Operations Portal's data-feed monitoring cards (Tile look).

const CONN_CATALOG = [
  { id:'email',     name:'Email',         provider:'Gmail / Outlook',    desc:'Pull client emails into your inbox tile and surface unanswered threads.', icon:'envelope',         color:'rgb(220,38,38)',   sampleAcct:'sarah.berry@alpineadvisors.com',          auth:'OAuth connection',     dataType:'Email threads & attachments' },
  { id:'calendar',  name:'Calendar',      provider:'Google / Microsoft', desc:'Sync upcoming client meetings and prep windows on your dashboard.',       icon:'calendar',         color:'rgb(56,189,248)',  sampleAcct:'sarah.berry@alpineadvisors.com',          auth:'OAuth connection',     dataType:'Events, attendees, agendas' },
  { id:'hubspot',   name:'HubSpot',       provider:'CRM',                desc:'Mirror contacts, deals, and activity logs across your client book.',      icon:'address-book',     color:'rgb(251,146,60)',  sampleAcct:'Alpine Advisors · sarah@alpineadvisors',  auth:'OAuth connection',     dataType:'Contacts, deals, notes' },
  { id:'docusign',  name:'DocuSign',      provider:'eSignature',         desc:'Track agreement status and trigger reminders when signatures stall.',     icon:'file-signature',   color:'rgb(168,85,247)',  sampleAcct:'sarah.berry@alpineadvisors.com',          auth:'OAuth connection',     dataType:'Envelope status, audit trail' },
  { id:'salesforce',name:'Salesforce',    provider:'CRM',                desc:'Optional alternative to HubSpot — pull pipeline and account history.',    icon:'cloud',            color:'rgb(14,165,233)',  sampleAcct:'sarah@alpineadvisors.my.salesforce.com',  auth:'OAuth connection',     dataType:'Accounts, opportunities' },
  { id:'halo',      name:'Halo',          provider:'Protective Investments', desc:'Scan your book for households that fit a protective product — buffers, notes, market-linked CDs, and annuities.', icon:'shield-halved', color:'rgb(168,85,247)', sampleAcct:'sarah.berry@alpineadvisors.com',          auth:'API key + OAuth',      dataType:'Product shelf, terms, suitability' },
];

const CP_BORDER = 'rgb(75,85,99)';
const CP_BORDER_SOFT = 'rgba(75,85,99,0.5)';
const CP_INK = 'rgb(249,250,251)';
const CP_MUTED = 'rgb(163,163,163)';
const CP_DIM = 'rgb(107,114,128)';
const CP_GREEN = 'rgb(5,122,85)';
const CP_GREEN_BRIGHT = 'rgb(52,211,153)';

function readConnections() {
  try {
    const raw = localStorage.getItem('field.connections');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function writeConnections(c) {
  try { localStorage.setItem('field.connections', JSON.stringify(c)); } catch (e) {}
}

function relSync(ts) {
  if (!ts) return '—';
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 5)   return 'just now';
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function CPPulseDot({ color = CP_GREEN_BRIGHT }) {
  return (
    <span style={{ position:'relative', width:8, height:8, display:'inline-block' }}>
      <span style={{
        position:'absolute', inset:0, borderRadius:9999, background:color,
        boxShadow:`0 0 0 0 ${color}`,
        animation:'cpPulse 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
      }} />
      <span style={{ position:'absolute', inset:0, borderRadius:9999, background:color }} />
    </span>
  );
}

function ConnectionsPanel({ open, onClose }) {
  const [connections, setConnections] = React.useState(readConnections);
  const [pending, setPending] = React.useState(null);
  const [, force] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    if (open) setConnections(readConnections());
  }, [open]);
  React.useEffect(() => {
    writeConnections(connections);
  }, [connections]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  // Refresh "last sync" labels every 5s
  React.useEffect(() => {
    if (!open) return;
    const t = setInterval(force, 5000);
    return () => clearInterval(t);
  }, [open]);

  const handleConnect = (intg) => {
    setPending(intg.id);
    setTimeout(() => {
      setConnections(c => ({
        ...c,
        [intg.id]: { status:'connected', account:intg.sampleAcct, since:Date.now(), lastSync:Date.now() },
      }));
      setPending(null);
    }, 900);
  };
  const handleDisconnect = (id) => {
    setConnections(c => { const next = { ...c }; delete next[id]; return next; });
  };

  const connectedCount = Object.values(connections).filter(c => c && c.status === 'connected').length;

  if (!open) return null;
  return (
    <React.Fragment>
      <style>{`
        @keyframes cpFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes cpSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes cpPulse { 0%{box-shadow:0 0 0 0 ${CP_GREEN_BRIGHT};} 70%{box-shadow:0 0 0 8px rgba(52,211,153,0);} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0);} }
      `}</style>
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
        backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)',
        zIndex:55, animation:'cpFadeIn 180ms ease-out',
      }} />
      <aside style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(520px, 100%)',
        background:'rgb(17,24,39)', borderLeft:`1px solid ${CP_BORDER}`,
        zIndex:56, display:'flex', flexDirection:'column',
        animation:'cpSlideIn 220ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        boxShadow:'-12px 0 40px -10px rgba(0,0,0,0.6)',
      }}>
        <header style={{
          padding:'20px 22px 16px', borderBottom:`1px solid ${CP_BORDER_SOFT}`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:16, color:CP_INK }}>Connections</div>
            <div style={{ fontFamily:'Inter', fontSize:12, color:CP_MUTED, marginTop:3 }}>
              {connectedCount} of {CONN_CATALOG.length} connected · {connectedCount > 0 ? 'syncing' : 'no active feeds'}
            </div>
          </div>
          <button onClick={onClose} title="Close" style={{
            width:30, height:30, borderRadius:8, border:'none',
            background:'transparent', color:CP_MUTED, cursor:'pointer',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <i className="fa-solid fa-xmark" style={{ fontSize:14 }} />
          </button>
        </header>

        <div style={{ flex:1, overflowY:'auto', padding:'14px 18px' }}>
          {CONN_CATALOG.map(intg => {
            const conn = connections[intg.id];
            const isOn = conn && conn.status === 'connected';
            const isPending = pending === intg.id;
            return (
              <div key={intg.id} style={{
                position:'relative',
                padding:18, marginBottom:12,
                background:'rgba(0,0,0,0.3)',
                border: `1px solid ${isOn ? 'rgba(16,185,129,0.35)' : 'rgba(75,85,99,0.4)'}`,
                borderRadius:10,
              }}>
                <div style={{ position:'absolute', top:14, right:14, display:'flex', alignItems:'center', gap:6 }}>
                  {isOn && <CPPulseDot />}
                  <span style={{
                    display:'inline-flex', alignItems:'center',
                    height:20, padding:'0 8px', borderRadius:9999,
                    fontFamily:'Inter', fontSize:10.5, fontWeight:600,
                    background: isOn ? 'rgba(16,185,129,0.18)' : 'rgba(75,85,99,0.3)',
                    color:    isOn ? CP_GREEN_BRIGHT : 'rgb(209,213,219)',
                    border: `1px solid ${isOn ? 'rgba(16,185,129,0.35)' : 'rgba(75,85,99,0.5)'}`,
                  }}>{isOn ? 'Connected' : 'Disconnected'}</span>
                </div>

                <div style={{
                  width:40, height:40, borderRadius:9, background:intg.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', marginBottom:14,
                  boxShadow: isOn ? '0 0 0 3px rgba(16,185,129,0.18)' : 'none',
                  transition:'box-shadow 240ms',
                }}>
                  <i className={`fa-solid fa-${intg.icon}`} style={{ fontSize:18 }} />
                </div>

                <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14.5, color:CP_INK }}>{intg.name}</div>
                <div style={{ fontFamily:'Inter', fontSize:11.5, color:CP_MUTED, marginTop:5, lineHeight:1.45 }}>
                  {intg.desc}
                </div>

                {isOn ? (
                  <div style={{
                    marginTop:14, padding:'10px 12px',
                    background:'rgba(16,185,129,0.08)',
                    border:'1px solid rgba(16,185,129,0.25)',
                    borderRadius:8,
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter', fontSize:11 }}>
                      <span style={{ color:CP_DIM }}>Account</span>
                      <span style={{ color:'rgb(229,231,235)', fontVariantNumeric:'tabular-nums', maxWidth:'60%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {conn.account}
                      </span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter', fontSize:11, marginTop:5 }}>
                      <span style={{ color:CP_DIM }}>Last synced</span>
                      <span style={{ color:CP_GREEN_BRIGHT, fontWeight:600 }}>{relSync(conn.lastSync)}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'auto 1fr', gap:'4px 14px', fontFamily:'Inter', fontSize:11.5 }}>
                    <span style={{ color:CP_DIM }}>Auth</span>
                    <span style={{ color:'rgb(229,231,235)', textAlign:'right' }}>{intg.auth}</span>
                    <span style={{ color:CP_DIM }}>Data</span>
                    <span style={{ color:'rgb(229,231,235)', textAlign:'right' }}>{intg.dataType}</span>
                    <span style={{ color:CP_DIM }}>Provider</span>
                    <span style={{ color:'rgb(229,231,235)', textAlign:'right' }}>{intg.provider}</span>
                  </div>
                )}

                <div style={{ marginTop:14, display:'flex', gap:8 }}>
                  {isOn ? (
                    <button onClick={() => handleDisconnect(intg.id)} style={{
                      flex:1, height:34, borderRadius:8,
                      border:`1px solid ${CP_BORDER}`, background:'rgba(255,255,255,0.04)',
                      color:CP_INK, fontFamily:'Inter', fontSize:12.5, fontWeight:500,
                      cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
                    }}>
                      <i className="fa-solid fa-plug" style={{ fontSize:11 }} /> Disconnect
                    </button>
                  ) : (
                    <button onClick={() => !isPending && handleConnect(intg)} disabled={isPending} style={{
                      flex:1, height:34, borderRadius:8, border:'none',
                      background: isPending ? 'rgba(5,122,85,0.5)' : CP_GREEN,
                      color:'#fff', fontFamily:'Inter', fontSize:12.5, fontWeight:600,
                      cursor: isPending ? 'wait' : 'pointer',
                      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
                      boxShadow: isPending ? 'none' : '0 4px 14px -4px rgba(5,122,85,0.6)',
                    }}>
                      {isPending ? (
                        <React.Fragment>
                          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize:11 }} /> Connecting…
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <i className="fa-solid fa-plug" style={{ fontSize:11 }} /> Connect Account
                        </React.Fragment>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer style={{
          padding:'14px 22px', borderTop:`1px solid ${CP_BORDER_SOFT}`,
          fontFamily:'Inter', fontSize:11.5, color:CP_DIM, lineHeight:1.45,
          display:'flex', alignItems:'flex-start', gap:10,
        }}>
          <i className="fa-solid fa-shield-halved" style={{ color:CP_GREEN, fontSize:13, marginTop:2 }} />
          <div>Read-only OAuth scopes by default. Field never stores your credentials and you can revoke access at any time.</div>
        </footer>
      </aside>
    </React.Fragment>
  );
}

Object.assign(window, { ConnectionsPanel, readConnections });
