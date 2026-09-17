/* Home — AI assistant greeting screen */

function HomePage({ onNav, onAIAction }) {
  const [msg, setMsg] = React.useState('');
  const [aiActive, setAIActive] = React.useState(false);
  const [aiPrompt, setAIPrompt] = React.useState('');
  const [chatMsg, setChatMsg] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [historyOpen, setHistoryOpen] = React.useState(false);

  // Two vectors, per Chris: Field-curated prompts (deliberately projective) and
  // the user's own real activity. Recent reads from actual history once they've
  // asked anything; the seeds below stand in until then.
  const seedRecent = [
    { text: 'What are my top client opportunities in large blend?', ai: true },
    { text: "Who are my NY metro top producers that I haven't met this quarter?", ai: true },
  ];
  const fieldPrompts = [
    { text: 'What are my biggest competitive advantage opportunities?', ai: true },
    { text: 'Who are my Ed Jones level 1 producers that have not done business this year?', ai: true },
    { text: 'Which advisors are likely to buy any of our focus products?', ai: true },
  ];

  const recordPrompt = (text) => {
    setHistory(prev => {
      const stamp = { text, when: new Date() };
      // de-dupe consecutive identical prompts
      if (prev[0] && prev[0].text === text) return prev;
      return [stamp, ...prev].slice(0, 20);
    });
  };

  const submitPrompt = (text) => {
    const t = (text || '').trim();
    if (!t) return;
    recordPrompt(t);
    setAIPrompt(t);
    setAIActive(true);
    setChatMsg('');
    setHistoryOpen(false);
  };

  const onSuggest = (s) => {
    if (s.ai) submitPrompt(s.text);
    else if (s.go) onNav(s.go);
  };

  const startNewChat = () => {
    setAIActive(false);
    setAIPrompt('');
    setChatMsg('');
    setMsg('');
    setHistoryOpen(false);
  };

  // ---- AI active view: content + left history rail (fixed) + sticky bottom composer
  if (aiActive) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {historyOpen && (
          <HistorySidePanel
            items={history}
            activeText={aiPrompt}
            onPick={(t) => { submitPrompt(t); }}
            onClose={() => setHistoryOpen(false)}
            onClear={() => setHistory([])}
            onNewChat={startNewChat}
          />
        )}

        {/* Fixed action buttons: History (far left of content area) | New chat (far right) */}
        {!historyOpen && (
          <button
            onClick={() => setHistoryOpen(true)}
            style={{ ...pillBtn(false), position:'fixed', top:70, left:76, zIndex:22 }}
            title="Recent chats">
            <i className="fa-solid fa-clock-rotate-left" style={{ fontSize:10 }} /> History
            {history.length > 0 && (
              <span style={{
                marginLeft:2, padding:'1px 6px', borderRadius:9999,
                background:'rgba(84,121,240,0.18)', color:'rgb(128,152,234)',
                fontFamily:'Inter', fontSize:10, fontWeight:600,
              }}>{history.length}</span>
            )}
          </button>
        )}
        <button
          onClick={startNewChat}
          style={{ ...pillBtn(), position:'fixed', top:70, right:20, zIndex:22 }}
          title="Start a new chat">
          <i className="fa-solid fa-pen-to-square" style={{ fontSize:10 }} /> New chat
        </button>

        {/* Top spacer so the result panel doesn't sit under the fixed buttons */}
        <div style={{ height: 16 }} />

        {/* Result body */}
        <div style={{
          padding:'18px 40px 24px',
          display:'flex', justifyContent:'center',
        }}>
          <div style={{ width:'100%', maxWidth:920 }}>
            <AIInsightsPanel
              prompt={aiPrompt}
              onClient={(client) => onAIAction && onAIAction({ id:'openClient', client })}
              onViewProfile={() => onAIAction && onAIAction('viewPolkProfile')}
              onCreateMaterial={() => onAIAction && onAIAction('createMaterial')}
              onScheduleMeeting={() => onAIAction && onAIAction('scheduleMeeting')}
            />
          </div>
        </div>

        {/* Sticky bottom area — background matches the top bar */}
        <div style={{
          position:'sticky', bottom:0, marginTop:'auto', zIndex:30,
          padding:'12px 40px 18px',
          borderTop:'1px solid rgba(75,85,99,0.3)',
          background:'rgba(31, 41, 55, 0.85)',
          backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
        }}>
          <div style={{
            width:'100%', maxWidth:920, margin:'0 auto',
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(75,85,99,0.5)', borderRadius:14, padding:'12px 14px 10px',
            display:'flex', flexDirection:'column', gap:10,
          }}>
            <textarea
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitPrompt(chatMsg); } }}
              placeholder="Ask a follow-up…"
              rows={1}
              style={{
                width: '100%', background: 'transparent', border: 'none', resize: 'none',
                color: 'rgb(249,250,251)', fontFamily: 'Inter', fontSize: 13.5, outline: 'none',
                minHeight: 22,
              }}
            />
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button style={{
                width:26, height:26, borderRadius:6, border:'none',
                background:'transparent', color:'rgb(163,163,163)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }} title="Attach">
                <i className="fa-solid fa-paperclip" style={{ fontSize:12 }} />
              </button>
              <div style={{ display:'flex', gap:6, flex:1, flexWrap:'wrap' }}>
                {[
                  'Filter to Northeast region',
                  'Show similar opps in Mid-Cap Growth',
                  'Compare Doe vs Smith Group',
                ].map((p,i) => (
                  <button key={i} onClick={() => setChatMsg(p)} style={{
                    height:24, padding:'0 10px', borderRadius:9999,
                    background:'rgba(255,255,255,0.025)', border:'1px solid rgba(75,85,99,0.4)',
                    color:'rgb(163,163,163)', fontFamily:'Inter', fontSize:11, cursor:'pointer',
                  }}>{p}</button>
                ))}
              </div>
              <button onClick={() => submitPrompt(chatMsg)} style={{
                width:28, height:28, borderRadius:7, border:'none',
                background: chatMsg ? 'rgb(84,121,240)' : 'rgba(84,121,240,0.3)',
                color: '#fff', cursor: chatMsg ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
              }} title="Send">
                <i className="fa-solid fa-paper-plane" style={{ fontSize:11 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Default greeting view
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 40px 120px', gap: 28,
    }}>
      <h1 style={{
        fontFamily: 'Inter Display, Inter', fontWeight: 500, fontSize: 48,
        color: 'rgb(249,250,251)', margin: 0, letterSpacing: '-0.02em',
      }}>Ask Halo +</h1>

      <div style={{
        width: 620, maxWidth: '100%', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(75,85,99,0.5)', borderRadius: 14, padding: '16px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Write your message here…"
          rows={2}
          style={{
            width: '100%', background: 'transparent', border: 'none', resize: 'none',
            color: 'rgb(249,250,251)', fontFamily: 'Inter', fontSize: 14, outline: 'none',
            minHeight: 46,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button title="Attach a list to match against Halo + data — event lists, target lists, prospect files" style={{
            width: 28, height: 28, borderRadius: 6, border: 'none',
            background: 'transparent', color: 'rgb(163,163,163)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-paperclip" style={{ fontSize: 13 }} />
          </button>
          <span style={{ fontFamily:'Inter', fontSize:11, color:'rgb(107,114,128)' }}>Attach a list to match against Halo + data</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => submitPrompt(msg)} style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: msg ? 'rgb(84,121,240)' : 'rgba(84,121,240,0.3)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-paper-plane" style={{ fontSize: 12 }} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', width: 620, maxWidth: '100%' }}>
        <PromptGroup label="Suggested by Halo +" icon="sparkles" items={fieldPrompts} onPick={onSuggest} />
        <PromptGroup label="Your recent questions" icon="clock-rotate-left"
          items={history.length > 0 ? history.slice(0, 3).map(h => ({ text: h.text, ai: true })) : seedRecent}
          onPick={onSuggest} />
      </div>
    </div>
  );
}

function PromptGroup({ label, icon, items, onPick }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center', width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <i className={`fa-solid fa-${icon}`} style={{ fontSize:10, color:'rgb(107,114,128)' }} />
        <span style={{
          fontFamily:'Inter', fontSize:10, fontWeight:600, color:'rgb(107,114,128)',
          textTransform:'uppercase', letterSpacing:0.8,
        }}>{label}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center', width:'100%' }}>
        {items.map((s, i) => (
          <button key={i} onClick={() => onPick(s)} style={{
            minHeight: 30, padding: '6px 14px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(75,85,99,0.4)',
            color: 'rgb(209,213,219)', fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
            cursor: 'pointer', textAlign:'center',
          }}>{s.text}</button>
        ))}
      </div>
    </div>
  );
}

window.HomePage = HomePage;

/* ---- small helpers / sub-components for the AI active view ---- */
function pillBtn(active) {
  return {
    height:26, padding:'0 10px', borderRadius:9999,
    background: active ? 'rgba(84,121,240,0.16)' : 'rgba(255,255,255,0.04)',
    border: active ? '1px solid rgba(84,121,240,0.45)' : '1px solid rgba(75,85,99,0.5)',
    color: active ? 'rgb(128,152,234)' : 'rgb(209,213,219)',
    fontFamily:'Inter', fontSize:11.5, fontWeight:500, cursor:'pointer',
    display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap',
  };
}

function fmtWhen(d) {
  if (!d) return '';
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString();
}

function HistorySidePanel({ items, activeText, onPick, onClose, onClear, onNewChat }) {
  // Fixed full-height rail that docks next to the 56px nav sidebar.
  return (
    <aside style={{
      position:'fixed', top:56, bottom:0, left:56, width:280, zIndex:18,
      background:'transparent',
      borderRight:'1px solid rgba(75,85,99,0.4)',
      padding:'14px 12px 12px',
      display:'flex', flexDirection:'column', gap:8,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'2px 4px 6px' }}>
        <i className="fa-solid fa-clock-rotate-left" style={{ fontSize:11, color:'rgb(163,163,163)' }} />
        <div style={{
          fontFamily:'Inter', fontSize:11, fontWeight:600,
          color:'rgb(229,231,235)', textTransform:'uppercase', letterSpacing:'0.06em',
        }}>Recent chats</div>
        <div style={{ flex:1 }} />
        <button onClick={onClose} title="Close" style={{
          width:22, height:22, borderRadius:5, border:'none',
          background:'transparent', color:'rgb(163,163,163)', cursor:'pointer',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}><i className="fa-solid fa-xmark" style={{ fontSize:11 }} /></button>
      </div>

      <div style={{
        flex:1, minHeight:0, overflowY:'auto',
        display:'flex', flexDirection:'column', gap:2,
        paddingRight:2,
      }}>
        {items.length === 0 && (
          <div style={{
            padding:'24px 12px', textAlign:'center',
            fontFamily:'Inter', fontSize:11.5, color:'rgb(115,115,115)',
          }}>No chats yet.</div>
        )}
        {items.map((it, i) => {
          const isActive = it.text === activeText;
          return (
            <button key={i} onClick={() => onPick(it.text)} style={{
              textAlign:'left', cursor:'pointer',
              display:'flex', flexDirection:'column', gap:3,
              padding:'9px 10px', borderRadius:8,
              background: isActive ? 'rgba(84,121,240,0.10)' : 'transparent',
              border: isActive ? '1px solid rgba(84,121,240,0.35)' : '1px solid transparent',
              fontFamily:'Inter',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{
                fontSize:12.5, color:'rgb(229,231,235)', lineHeight:1.4,
                display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
              }}>{it.text}</span>
              <span style={{ fontSize:10.5, color:'rgb(115,115,115)' }}>
                <i className="fa-solid fa-clock" style={{ fontSize:9, marginRight:5 }} />
                {fmtWhen(it.when)}
              </span>
            </button>
          );
        })}
      </div>

      {items.length > 0 && (
        <button onClick={onClear} style={{
          background:'transparent', border:'none', cursor:'pointer',
          color:'rgb(163,163,163)', fontFamily:'Inter', fontSize:11,
          padding:'6px 4px 2px', textAlign:'left',
        }}>Clear history</button>
      )}
    </aside>
  );
}
