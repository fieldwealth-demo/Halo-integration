/* Field Shadcn — Topbar
   Sticky 56px header used at the top of every workspace. Mirrors the
   Asset Manager Portal top bar: title + date on the left, a centered search
   pill, and right-rail action buttons.

   Usage:
     <Topbar
       title="Dashboard"
       subtitle="Thu Nov 20th 2025"
       searchPlaceholder="Search by firm name, advisor, city, or CRD…"
       onBack={...}                          // optional — shows back chevron
       actions={
         <>
           <TopbarButton variant="ghost">Year to date <i className="fa-solid fa-chevron-down" /></TopbarButton>
           <TopbarButton variant="outline" icon="arrow-up-from-bracket">Export</TopbarButton>
           <TopbarButton variant="primary">Edit Dashboard</TopbarButton>
         </>
       }
       activeSelections={[{ label:'Northeast', icon:'location-dot' }]}    // optional
       onClearAll={...}
     />
*/

function Topbar({
  title,
  subtitle,
  searchPlaceholder = null,
  onBack,
  actions,
  activeSelections,
  onClearAll,
  children,
}) {
  return (
    <header style={{
      position:'sticky', top:0, zIndex:30,
      background:'rgba(31,41,55,0.85)',
      backdropFilter:'blur(12px) saturate(140%)',
      WebkitBackdropFilter:'blur(12px) saturate(140%)',
      borderBottom:'1px solid rgba(75,85,99,0.4)',
    }}>
      <div style={{
        height:56, display:'flex', alignItems:'center', gap:16, padding:'0 24px',
      }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back" style={{
            width:28, height:28, borderRadius:8, border:'1px solid rgb(75,85,99)',
            background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <i className="fa-solid fa-chevron-left" style={{ fontSize:11 }} />
          </button>
        )}

        <div style={{ minWidth:220, display:'flex', alignItems:'baseline', gap:10 }}>
          {title && <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:15, color:'rgb(249,250,251)' }}>{title}</div>}
          {subtitle && <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>{subtitle}</div>}
        </div>

        <div style={{ flex:1, display:'flex', justifyContent:'center', minWidth:0 }}>
          {searchPlaceholder && (
            <div style={{
              display:'flex', alignItems:'center', gap:8, height:32, width:'100%', maxWidth:420, padding:'0 12px',
              borderRadius:8, background:'rgba(0,0,0,0.35)', border:'1px solid rgba(75,85,99,0.5)',
              fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)',
              overflow:'hidden', whiteSpace:'nowrap',
            }}>
              <i className="fa-solid fa-magnifying-glass" style={{ fontSize:11, flexShrink:0 }} />
              <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{searchPlaceholder}</span>
            </div>
          )}
        </div>

        {actions && <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>{actions}</div>}
        {children}
      </div>

      {activeSelections !== undefined && (
        <div style={{
          padding:'10px 20px', display:'flex', alignItems:'center', gap:10,
          borderTop:'1px solid rgba(75,85,99,0.25)',
        }}>
          <span style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', marginRight:4 }}>
            Active Selections:
          </span>
          {activeSelections.length === 0 ? (
            <span style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(107,114,128)', fontStyle:'italic' }}>None</span>
          ) : activeSelections.map((sel, i) => (
            <SelectionChip key={i} label={sel.label} icon={sel.icon} onRemove={sel.onRemove} />
          ))}
          {activeSelections.length > 0 && onClearAll && (
            <button onClick={onClearAll} style={{
              marginLeft:'auto', background:'transparent', border:'none',
              color:'rgb(163,163,163)', fontFamily:'Inter', fontSize:11.5, cursor:'pointer',
            }}>Clear All</button>
          )}
        </div>
      )}
    </header>
  );
}

function SelectionChip({ label, icon, onRemove }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6, height:24, padding:'0 8px',
      borderRadius:6, background:'rgba(5,122,85,0.22)', border:'1px solid rgba(5,122,85,0.55)',
      fontFamily:'Inter', fontSize:11, color:'rgb(110,240,180)',
    }}>
      {icon && <i className={`fa-solid fa-${icon}`} style={{ fontSize:10 }} />}
      {label}
      <i
        className="fa-solid fa-xmark"
        onClick={onRemove}
        style={{ fontSize:9, opacity:0.7, cursor: onRemove ? 'pointer' : 'default' }}
      />
    </div>
  );
}

function TopbarButton({ variant = 'ghost', icon, active, children, ...rest }) {
  const base = {
    height:30, padding:'0 12px', borderRadius:8,
    fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
    display:'inline-flex', alignItems:'center', gap:6,
    border:'1px solid transparent',
  };
  let style;
  if (variant === 'primary') {
    style = { background:'rgb(5,122,85)', border:'1px solid rgb(5,122,85)', color:'#fff' };
  } else if (variant === 'outline') {
    style = active
      ? { background:'rgba(5,122,85,0.22)', border:'1px solid rgb(5,122,85)', color:'rgb(52,211,153)' }
      : { background:'rgba(255,255,255,0.03)', border:'1px solid rgb(75,85,99)', color:'rgb(249,250,251)' };
  } else {
    style = { background:'rgba(255,255,255,0.03)', border:'1px solid rgb(75,85,99)', color:'rgb(249,250,251)' };
  }
  return (
    <button style={{ ...base, ...style }} {...rest}>
      {icon && <i className={`fa-solid fa-${icon}`} style={{ fontSize:11 }} />}
      {children}
    </button>
  );
}

Object.assign(window, { Topbar, TopbarButton, SelectionChip });
