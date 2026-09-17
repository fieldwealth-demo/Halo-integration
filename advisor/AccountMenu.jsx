/* AccountMenu — one avatar button (initials) that opens the account panel:
   who you are, settings, help, restart the demo, and the other Halo + views.
   Used by the advisor dashboard, the firm manager dashboard and the asset
   manager portal, so `base` prefixes the hrefs for pages in subfolders. */

const AM_INK = 'rgb(229,231,235)';
const AM_LINE = 'rgba(75,85,99,0.45)';
const AM_ACCENT = 'rgb(35,89,255)';
const AM_ACCENT_FG = 'rgb(168,185,241)';

const HALO_VIEWS = [
  { id:'advisor', label:'Advisor Dashboard',   href:'Advisor Dashboard.html' },
  { id:'firm',    label:'Firm Manager',        href:'firm/Firm Dashboard.html' },
  { id:'am',      label:'Asset Manager Portal',href:'asset-manager/Asset Manager Portal.html' },
];

function haloRestart(base) {
  try {
    Object.keys(localStorage)
      .filter(k => /^(field\.|adv\.|firm\.|amp_|halo)/i.test(k))
      .forEach(k => localStorage.removeItem(k));
  } catch (e) {}
  window.location.href = (base || '') + (window.HALO_ONBOARDING_HREF || 'Advisor Onboarding.html');
}

function AccountMenu({ user = {}, view = 'advisor', base = '', onSelect, size = 46, left = 16, expanded = false, width = 0 }) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef();
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away, true);
    window.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away, true); window.removeEventListener('keydown', esc); };
  }, [open]);
  /* The avatar floats over the sidebar rail — give the rail room so its own
     footer rows never sit under it. */
  React.useEffect(() => {
    const rail = [...document.querySelectorAll('aside')].find(el => {
      const cs = getComputedStyle(el);
      return cs.position === 'fixed' && parseInt(cs.left || '0', 10) === 0;
    });
    if (!rail) return;
    rail.setAttribute('data-account-rail', '');
    if (!document.getElementById('account-rail-pad')) {
      const st = document.createElement('style');
      st.id = 'account-rail-pad';
      st.textContent = 'aside[data-account-rail]{padding-bottom:' + (size + 26) + 'px !important}';
      document.head.appendChild(st);
    }
  }, [size]);
  const initials = user.initials || (user.name || '').split(' ').map(w => w[0]).slice(0, 2).join('');
  const row = (icon, label, onClick) => (
    <button key={label} onClick={onClick} style={{
      width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:12,
      height:44, padding:'0 12px', borderRadius:9, border:'none', background:'transparent',
      cursor:'pointer', color:AM_INK, fontFamily:'Inter', fontSize:13.5,
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <i className={`fa-solid fa-${icon}`} style={{ fontSize:13.5, width:17, textAlign:'center', color:'rgb(163,163,163)' }} />
      {label}
    </button>
  );
  return (
    <div ref={wrap} style={{ position:'fixed', bottom:16, left, zIndex:140 }}>
      <button onClick={() => setOpen(o => !o)} aria-label="Settings and account" title={user.name || 'Account'} style={{
        width: expanded ? (width || 224) : size, height:size,
        borderRadius: expanded ? 12 : 9999, cursor:'pointer',
        padding: expanded ? '0 10px 0 5px' : 0, gap: expanded ? 10 : 0,
        border:`1px solid ${open ? 'rgba(35,89,255,0.7)' : expanded ? AM_LINE : 'rgba(255,255,255,0.14)'}`,
        background: expanded ? (open ? 'rgba(35,89,255,0.12)' : 'transparent') : 'linear-gradient(135deg, rgb(52,106,255), rgb(25,64,190))',
        color:'#fff', fontFamily:'Inter', fontSize:14, fontWeight:700,
        display:'flex', alignItems:'center', justifyContent: expanded ? 'flex-start' : 'center',
        transition:'width 220ms cubic-bezier(0.22,0.61,0.36,1)',
      }}>
        <span style={{ width: size - 10, height: size - 10, flexShrink:0, borderRadius:9999,
          background:'linear-gradient(135deg, rgb(52,106,255), rgb(25,64,190))', color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>{initials}</span>
        {expanded && (
          <span style={{ minWidth:0, textAlign:'left', display:'flex', flexDirection:'column' }}>
            <span style={{ fontSize:13, fontWeight:600, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</span>
            <span style={{ fontSize:11, fontWeight:400, color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.role}</span>
          </span>
        )}
      </button>
      {open && (
        <div style={{ position:'absolute', bottom:size + 10, left:0, width:268, padding:6, borderRadius:14,
          border:`1px solid ${AM_LINE}`, background:'rgb(17,26,44)', boxShadow:'0 26px 56px -14px rgba(0,0,0,0.8)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px 14px' }}>
            <div style={{ width:40, height:40, borderRadius:9999, flexShrink:0,
              background:'linear-gradient(135deg, rgb(52,106,255), rgb(25,64,190))', color:'#fff',
              fontFamily:'Inter', fontSize:13.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{initials}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:'rgb(249,250,251)' }}>{user.name}</div>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', marginTop:2 }}>{user.role}</div>
            </div>
          </div>
          <div style={{ height:1, background:AM_LINE, margin:'0 4px 5px' }} />
          {row('gear', 'Settings', () => { setOpen(false); onSelect && onSelect('settings'); })}
          {row('circle-question', 'Help & support', () => { setOpen(false); onSelect && onSelect('help'); })}
          {row('rotate-left', 'Restart demo', () => { setOpen(false); haloRestart(base); })}
          <div style={{ height:1, background:AM_LINE, margin:'5px 4px' }} />
          <div style={{ fontFamily:'Inter', fontSize:10, fontWeight:600, letterSpacing:'0.07em',
            textTransform:'uppercase', color:'rgb(115,115,115)', padding:'6px 12px 4px' }}>Switch view</div>
          {HALO_VIEWS.map(v => v.id === view ? (
            <div key={v.id} style={{ display:'flex', alignItems:'center', gap:12, height:44, padding:'0 12px',
              fontFamily:'Inter', fontSize:13.5, color:AM_ACCENT_FG }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize:13.5, width:17, textAlign:'center' }} />{v.label}
            </div>
          ) : row('arrow-up-right-from-square', v.label, () => { setOpen(false); window.location.href = (base || '') + v.href; }))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AccountMenu, HALO_VIEWS, haloRestart, AM_ACCENT });
