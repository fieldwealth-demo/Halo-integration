/* Client Filter — slide-out drawer (from the right) for the Clients table.
   Live-updates the parent filter state; the active-selections bar below the
   topbar reflects choices immediately. Field Shadcn dark surface. */

const CF_GROUPS = [
  { key:'aum',     label:'AUM',          icon:'building-columns', options:['<$5M','$5M–$15M','$15M–$30M','$30M+'] },
  { key:'risk',    label:'Risk Profile', icon:'shield-halved', options:['Conservative','Moderate','Aggressive'] },
  { key:'status',  label:'Status',       icon:'circle-check', options:['Active','Review Due','Prospect'] },
];

function ClientFilterDrawer({ open, onClose, filters, setFilters }) {
  const f = filters || {};
  const count = CF_GROUPS.reduce((n,g)=> n + ((f[g.key]||[]).length), 0);

  const toggle = (key, val) => {
    setFilters(prev => {
      const cur = new Set(prev[key] || []);
      if (cur.has(val)) cur.delete(val); else cur.add(val);
      return { ...prev, [key]: Array.from(cur) };
    });
  };
  const clearAll = () => setFilters({});

  const C = {
    panel:'rgb(17,24,39)', border:'rgb(75,85,99)', borderSoft:'rgba(75,85,99,0.5)',
    ink:'rgb(249,250,251)', subtle:'rgb(163,163,163)', green:'rgb(5,122,85)',
  };

  return (
    <React.Fragment>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:90,
        opacity: open?1:0, pointerEvents: open?'auto':'none', transition:'opacity 180ms ease',
      }} />
      {/* Panel */}
      <aside style={{
        position:'fixed', top:0, right:0, height:'100vh', width:380, maxWidth:'92vw',
        background:C.panel, borderLeft:`1px solid ${C.border}`,
        boxShadow:'-20px 0 60px -20px rgba(0,0,0,0.7)',
        transform: open?'translateX(0)':'translateX(100%)',
        transition:'transform 240ms cubic-bezier(.2,.8,.2,1)',
        zIndex:95, display:'flex', flexDirection:'column', boxSizing:'border-box',
        fontFamily:'Inter',
      }}>
        {/* Header */}
        <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.borderSoft}`, display:'flex', alignItems:'center', gap:10 }}>
          <i className="fa-solid fa-filter" style={{ fontSize:13, color:C.green }} />
          <div style={{ fontSize:14, fontWeight:600, color:C.ink }}>Filter clients</div>
          {count>0 && (
            <span style={{
              height:20, minWidth:20, padding:'0 6px', borderRadius:9999,
              background:'rgba(5,122,85,0.22)', border:'1px solid rgba(5,122,85,0.55)',
              color:'rgb(110,231,183)', fontSize:11, fontWeight:600,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>{count}</span>
          )}
          <button onClick={onClose} data-no-hint style={{
            marginLeft:'auto', width:28, height:28, borderRadius:8, border:`1px solid ${C.border}`,
            background:'rgba(255,255,255,0.04)', color:C.ink, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <i className="fa-solid fa-xmark" style={{ fontSize:12 }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'4px 18px 18px', overflowY:'auto', flex:1 }}>
          {CF_GROUPS.map(g => {
            const sel = f[g.key] || [];
            return (
              <div key={g.key} style={{ padding:'16px 0', borderBottom:`1px solid ${C.borderSoft}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:11 }}>
                  <i className={`fa-solid fa-${g.icon}`} style={{ fontSize:11, color:C.subtle, width:13 }} />
                  <span style={{ fontSize:11, fontWeight:600, color:C.subtle, textTransform:'uppercase', letterSpacing:'0.06em' }}>{g.label}</span>
                  {sel.length>0 && <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>· {sel.length}</span>}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {g.options.map(opt => {
                    const on = sel.includes(opt);
                    return (
                      <button key={opt} data-no-hint onClick={()=>toggle(g.key, opt)} style={{
                        height:32, padding:'0 13px', borderRadius:9999, cursor:'pointer',
                        fontFamily:'Inter', fontSize:12.5, fontWeight:500,
                        display:'inline-flex', alignItems:'center', gap:7,
                        background: on ? 'rgba(5,122,85,0.22)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${on ? 'rgb(5,122,85)' : C.border}`,
                        color: on ? 'rgb(110,231,183)' : 'rgb(229,231,235)',
                        transition:'background 120ms ease, border-color 120ms ease, color 120ms ease',
                      }}>
                        {on && <i className="fa-solid fa-check" style={{ fontSize:10 }} />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 18px 16px', borderTop:`1px solid ${C.borderSoft}`, display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={clearAll} data-no-hint disabled={count===0} style={{
            height:36, padding:'0 14px', borderRadius:8, border:`1px solid ${C.border}`,
            background:'rgba(255,255,255,0.03)', color: count===0 ? C.subtle : C.ink,
            fontFamily:'Inter', fontSize:12.5, fontWeight:500, cursor: count===0?'default':'pointer',
            opacity: count===0?0.6:1,
          }}>Clear all</button>
          <button onClick={onClose} data-no-hint style={{
            flex:1, height:36, borderRadius:8, border:'1px solid rgb(5,122,85)',
            background:'rgb(5,122,85)', color:'#fff',
            fontFamily:'Inter', fontSize:12.5, fontWeight:600, cursor:'pointer',
          }}>{count>0 ? `Show results` : 'Done'}</button>
        </div>
      </aside>
    </React.Fragment>
  );
}

Object.assign(window, { ClientFilterDrawer, CF_GROUPS });
