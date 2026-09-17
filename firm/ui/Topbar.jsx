/* Field Shadcn — Topbar
   Sticky 56px header used at the top of every workspace. Prop-driven so apps
   can supply their own title, subtitle, search placeholder, and right-rail
   actions. Pair with TopbarButton for consistent action styling.

   Usage:
     <Topbar
       title="My Practice"
       subtitle="Thu Nov 20th 2025"
       searchPlaceholder="Search by clients"
       onBack={...}                                  // optional — shows back chevron
       actions={
         <>
           <TopbarButton variant="ghost">Year to date <i className="fa-solid fa-chevron-down" /></TopbarButton>
           <TopbarButton variant="outline"><i className="fa-solid fa-download" /> Export</TopbarButton>
           <TopbarButton variant="primary">Edit Dashboard</TopbarButton>
         </>
       }
     />
*/

function Topbar({ title, subtitle, searchPlaceholder = 'Search', onBack, actions, children }) {
  return (
    <header style={{
      position:'sticky', top:0, zIndex:30,
      height:56, display:'flex', alignItems:'center', gap:14, padding:'0 20px',
      borderBottom:'1px solid rgb(75,85,99)', background:'rgba(31,41,55,0.85)',
      backdropFilter:'blur(12px) saturate(140%)', WebkitBackdropFilter:'blur(12px) saturate(140%)',
    }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{
          width:28, height:28, borderRadius:8, border:'1px solid rgb(75,85,99)',
          background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <i className="fa-solid fa-chevron-left" style={{ width:12, height:12 }} />
        </button>
      )}
      {title && <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:15, color:'rgb(249,250,251)' }}>{title}</div>}
      {subtitle && <div style={{ fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)' }}>{subtitle}</div>}
      <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:8, height:32, width:320, padding:'0 12px',
          borderRadius:9999, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.6)',
          fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)',
        }}>
          <i className="fa-solid fa-magnifying-glass" style={{ width:13, height:13 }} />
          {searchPlaceholder}
        </div>
      </div>
      {actions && <div style={{ display:'flex', gap:8 }}>{actions}</div>}
      {children}
    </header>
  );
}

function TopbarButton({ variant = 'ghost', children, ...rest }) {
  const base = {
    height:32, padding:'0 12px', borderRadius:8,
    fontFamily:'Inter', fontSize:12.5, fontWeight:500, cursor:'pointer',
    display:'inline-flex', alignItems:'center', gap:6,
    border:'1px solid transparent',
  };
  const variants = {
    primary: { background:'rgb(17,24,39)',           border:'1px solid rgb(75,85,99)', color:'rgb(249,250,251)' },
    outline: { background:'transparent',             border:'1px solid rgb(75,85,99)', color:'rgb(249,250,251)' },
    ghost:   { background:'rgba(255,255,255,0.04)',  border:'1px solid rgb(75,85,99)', color:'rgb(229,231,235)' },
  };
  return (
    <button style={{ ...base, ...(variants[variant] || variants.ghost) }} {...rest}>
      {children}
    </button>
  );
}

window.Topbar = Topbar;
window.TopbarButton = TopbarButton;
