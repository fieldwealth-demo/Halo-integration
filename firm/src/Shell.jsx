/* Shell — Dual-state Sidebar + Topbar. (Field shadcn DS)
   ----------------------------------------------------------------------------
   Sidebar contract: one component, two views the user toggles.
     • Collapsed (56px) — icon rail. Hamburger toggle centered at top.
       Parents with children reveal a right-anchored flyout on hover; the
       flyout dismisses after a 150ms mouseleave grace period (re-entering
       cancels). Clicking a sub-item navigates and closes the flyout.
       Leaves show a label tooltip on hover.
     • Expanded (240px) — labeled rows. Toggle moves to upper-right as a
       left-chevron. Parents toggle an inline accordion (chevron rotates
       90°); multiple groups can be open at once.
   Selection: `active` is a single id. A parent is visually active when
     `active === parent.id` OR any child's id matches `active`. There is NO
     dot indicator — the flyout / accordion is the only sub-nav affordance.
   Persistence (localStorage):
     • firm.nav.expanded  — '0' | '1'
     • firm.nav.accordion — JSON array of open parent ids
     • firm.page          — active route id (owned by App)
   Sub-menu rules:
     • Cap at ~6 items per group. No second-level nesting.
     • Don't mix patterns within a state — collapsed=flyout only,
       expanded=accordion only.
*/

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard', icon: 'chart-pie' },
  { id: 'practice',   label: 'Practice',  icon: 'briefcase', children: [
    { id: 'valuation',         label: 'Valuation',             icon: 'circle-dollar-to-slot' },
    { id: 'revenue',           label: 'Revenue Summary',       icon: 'chart-line' },
    { id: 'positions',         label: 'Positions & Holdings',  icon: 'chart-column' },
    { id: 'client-analytics',  label: 'Client Analytics',      icon: 'chart-simple' },
  ]},
  { id: 'opportunities', label: 'Opportunities', icon: 'bullseye' },
  { id: 'clients',    label: 'Clients',        icon: 'users' },
  { id: 'advisors',   label: 'Advisors',       icon: 'user-tie' },
  { id: 'geographics', label: 'Geographics',   icon: 'map-location-dot' },
  { id: 'manager-concentration', label: 'Manager Concentration', icon: 'bars-progress' },
  { id: 'goals',      label: 'Goals',     icon: 'flag-checkered' },
];

const FOOTER_ITEMS = [
  { id: 'settings', label: 'Settings',       icon: 'gear' },
  { id: 'help',     label: 'Help & Support', icon: 'circle-question' },
];

const SIDEBAR_USER = { name: 'Jane Cooper', role: 'Admin · Alpine Partners' };
const SIDEBAR_SIGNOUT_HREF = 'https://claude.ai/design/p/019dd4c5-78f0-71ea-8229-0ec671ae00aa?file=Demo%20Landing%20Page.html&present=1';

const SIDEBAR_W_COLLAPSED = 56;
const SIDEBAR_W_EXPANDED  = 240;
const FLYOUT_GRACE_MS     = 150;

/* Notify App of rail width so the content wrapper can animate its marginLeft. */
function emitRailWidth(w) {
  try { window.dispatchEvent(new CustomEvent('firm:sidebarWidth', { detail: { width: w } })); } catch (e) {}
}

/* ============ Sidebar ============ */

function Sidebar({ active, onSelect }) {
  /* Toggle state — persisted */
  const [expanded, setExpanded] = React.useState(() => {
    try { return localStorage.getItem('firm.nav.expanded') === '1'; } catch (e) { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('firm.nav.expanded', expanded ? '1' : '0'); } catch (e) {}
    emitRailWidth(expanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED);
  }, [expanded]);

  /* Accordion open-set — persisted. Multiple groups can be open at once. */
  const [openGroups, setOpenGroups] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('firm.nav.accordion') || '[]')); }
    catch (e) { return new Set(); }
  });
  React.useEffect(() => {
    try { localStorage.setItem('firm.nav.accordion', JSON.stringify([...openGroups])); } catch (e) {}
  }, [openGroups]);

  /* If active is a sub-item of a parent, ensure that parent is open. */
  React.useEffect(() => {
    const parent = NAV_ITEMS.find(it => it.children && it.children.some(c => c.id === active));
    if (parent && !openGroups.has(parent.id)) {
      setOpenGroups(g => new Set([...g, parent.id]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const toggleGroup = (id) => setOpenGroups(g => {
    const next = new Set(g);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const isParentActive = (item) => active === item.id ||
    (item.children && item.children.some(c => c.id === active));

  const W = expanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: W,
      background: 'rgb(31,41,55)', borderRight: '1px solid rgb(75,85,99)',
      display: 'flex', flexDirection: 'column',
      padding: '12px 8px', gap: 2, zIndex: 40,
      overflow: 'visible',
      transition: 'width 220ms cubic-bezier(0.22,0.61,0.36,1)',
      color: 'rgb(249,250,251)',
    }}>
      {/* Header — collapsed: centered hamburger; expanded: brand row + left-chevron toggle */}
      {expanded ? (
        <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'4px 4px 4px 6px', marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background:'rgb(35,89,255)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontFamily:'Inter', fontWeight:700, fontSize:13, flexShrink: 0,
          }}>H</div>
          <div style={{ display:'flex', flexDirection:'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily:'Inter', fontWeight: 600, fontSize: 13, color:'rgb(249,250,251)' }}>HALO +</span>
            <span style={{ fontFamily:'Inter', fontSize: 11, color:'rgb(163,163,163)' }}>Firm Manager</span>
          </div>
          <button onClick={() => setExpanded(false)} title="Collapse menu" aria-label="Collapse menu"
            style={{
              width: 26, height: 26, borderRadius: 6, border: '1px solid transparent',
              background: 'transparent', color:'rgb(163,163,163)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgb(229,231,235)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgb(163,163,163)'; }}>
            <i className="fa-solid fa-chevron-left" style={{ fontSize: 11 }} />
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', justifyContent:'center', padding:'2px 0 4px' }}>
          <button onClick={() => setExpanded(true)} title="Expand menu" aria-label="Expand menu"
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: 'transparent', color: 'rgb(163,163,163)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgb(229,231,235)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgb(163,163,163)'; }}>
            <i className="fa-solid fa-bars" style={{ fontSize: 14 }} />
          </button>
        </div>
      )}

      <SBDivider />

      {/* Main nav */}
      <nav style={{ display:'flex', flexDirection:'column', gap: 2 }}>
        {NAV_ITEMS.map(item => (
          <NavRow key={item.id} item={item} active={active} expanded={expanded}
            isOpen={openGroups.has(item.id)}
            isParentActive={isParentActive(item)}
            onSelect={onSelect}
            onToggleGroup={toggleGroup} />
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Account lives in the AccountMenu avatar, bottom-left */}
      <div style={{ height: 64 }} />
    </aside>
  );
}

function SBDivider() {
  return <div style={{ height: 1, background: 'rgba(75,85,99,0.6)', margin: '6px 4px' }} />;
}

/* --------- Nav row (handles both states + flyout/accordion) --------- */
function NavRow({ item, active, expanded, isOpen, isParentActive, onSelect, onToggleGroup }) {
  const [hover, setHover] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState(null);
  const timerRef = React.useRef(null);
  const rowRef = React.useRef(null);
  const hasChildren = !!(item.children && item.children.length);

  const onEnter = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!hover) {
      setHover(true);
      if (rowRef.current) setAnchorRect(rowRef.current.getBoundingClientRect());
    }
  };
  const onLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setHover(false); setAnchorRect(null); }, FLYOUT_GRACE_MS);
  };
  /* Snap-shut helper so child clicks immediately close the flyout. */
  const closeNow = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHover(false); setAnchorRect(null);
  };

  React.useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const isLeafActive = !hasChildren && active === item.id;
  const isItemActive = isParentActive || isLeafActive;

  /* Active treatment (per Field brand): soft mint chip background + mint border + bright
     mint icon. The brand-primary green is used via its dot variant rgb(168,185,241) so it
     pops on the dark navy rail. */
  const ACTIVE_BG     = 'rgba(168,185,241,0.14)';
  const ACTIVE_BORDER = '1px solid rgba(168,185,241,0.45)';
  const ACTIVE_ICON   = 'rgb(168,185,241)';
  const ACTIVE_LABEL  = 'rgb(249,250,251)';

  const bg = isItemActive ? ACTIVE_BG : (hover ? 'rgba(255,255,255,0.04)' : 'transparent');
  const border = isItemActive ? ACTIVE_BORDER : '1px solid transparent';
  const iconColor = isItemActive ? ACTIVE_ICON : 'rgb(163,163,163)';
  const labelColor = isItemActive ? ACTIVE_LABEL : 'rgb(209,213,219)';

  const handleClick = () => {
    if (hasChildren) {
      if (expanded) onToggleGroup(item.id);
      /* Collapsed: parent click is a no-op — flyout is the only sub-nav affordance. */
    } else {
      onSelect(item.id);
      closeNow();
    }
  };

  return (
    <div ref={rowRef} style={{ position: 'relative' }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button onClick={handleClick}
        style={{
          width: '100%', height: 34, padding: expanded ? '0 9px' : 0,
          borderRadius: 8, border, background: bg, color: labelColor,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center', gap: 10,
          transition: 'background 140ms ease, border-color 140ms ease',
        }}>
        <i className={`fa-solid fa-${item.icon}`}
          style={{ fontSize: 14, width: 16, color: iconColor, textAlign:'center', flexShrink: 0 }} />
        {expanded && (
          <React.Fragment>
            <span style={{
              flex: 1, textAlign:'left',
              fontFamily:'Inter', fontSize: 13,
              fontWeight: isItemActive ? 500 : 400, color: labelColor,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>{item.label}</span>
            {item.badge != null && (
              <span style={{
                fontFamily:'Inter', fontSize: 10.5, fontWeight: 600,
                padding:'1px 6px', borderRadius: 9999,
                background:'rgb(35,89,255)', color:'#fff',
              }}>{item.badge}</span>
            )}
            {hasChildren && (
              <i className="fa-solid fa-chevron-right" style={{
                fontSize: 10, color:'rgb(163,163,163)',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 180ms cubic-bezier(0.22,0.61,0.36,1)',
              }} />
            )}
          </React.Fragment>
        )}
      </button>

      {/* Expanded — inline accordion. NEVER show a flyout when expanded. */}
      {expanded && hasChildren && isOpen && (
        <div style={{
          display:'flex', flexDirection:'column', gap: 1,
          marginTop: 3, marginBottom: 4, paddingLeft: 12,
          borderLeft: '1px solid rgba(75,85,99,0.55)', marginLeft: 17,
        }}>
          {item.children.map(child => {
            const ca = active === child.id;
            return (
              <button key={child.id} onClick={() => onSelect(child.id)}
                style={{
                  width: '100%', height: 30, padding: '0 8px',
                  borderRadius: 6,
                  border: ca ? '1px solid rgba(168,185,241,0.45)' : '1px solid transparent',
                  background: ca ? 'rgba(168,185,241,0.14)' : 'transparent',
                  color: ca ? 'rgb(249,250,251)' : 'rgb(163,163,163)',
                  fontFamily:'Inter', fontSize: 12.5,
                  fontWeight: ca ? 500 : 400,
                  cursor:'pointer', textAlign:'left',
                  display:'flex', alignItems:'center', gap: 8,
                  transition: 'background 140ms ease',
                }}
                onMouseEnter={e => { if (!ca) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!ca) e.currentTarget.style.background='transparent'; }}>
                <i className={`fa-solid fa-${child.icon}`} style={{ fontSize: 11.5, width: 14, color: ca ? 'rgb(168,185,241)' : 'rgb(163,163,163)' }} />
                <span style={{ flex: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{child.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Collapsed — flyout for parents, tooltip chip for leaves. NEVER show an accordion. */}
      {!expanded && hover && hasChildren && anchorRect && (
        <FlyoutPanel parent={item} active={active}
          anchorRect={anchorRect}
          onEnter={onEnter} onLeave={onLeave}
          onSelectChild={(id) => { onSelect(id); closeNow(); }} />
      )}
      {!expanded && hover && !hasChildren && anchorRect && (
        <TooltipChip label={item.label} anchorRect={anchorRect} />
      )}
    </div>
  );
}

/* --------- Collapsed-mode flyout (parent with children) --------- */
function FlyoutPanel({ parent, active, anchorRect, onEnter, onLeave, onSelectChild }) {
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{
        position:'fixed',
        left: anchorRect.right + 8,
        top: anchorRect.top,
        minWidth: 220, maxWidth: 280,
        background:'rgb(31,41,55)', border:'1px solid rgb(75,85,99)',
        borderRadius: 10, padding: 6, zIndex: 1000,
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset',
        animation: 'fadeIn 140ms ease-out',
      }}>
      <div style={{
        fontFamily:'Inter', fontSize: 10.5, fontWeight: 600,
        color:'rgb(163,163,163)', letterSpacing:'0.06em', textTransform:'uppercase',
        padding:'8px 10px 6px',
      }}>{parent.label}</div>
      {parent.children.map(child => {
        const ca = active === child.id;
        return (
          <button key={child.id} onClick={() => onSelectChild(child.id)}
            style={{
              width:'100%', height: 32, padding:'0 10px',
              borderRadius: 7,
              border: ca ? '1px solid rgba(168,185,241,0.45)' : '1px solid transparent',
              background: ca ? 'rgba(168,185,241,0.14)' : 'transparent',
              color: ca ? 'rgb(249,250,251)' : 'rgb(209,213,219)',
              fontFamily:'Inter', fontSize: 12.5,
              fontWeight: ca ? 500 : 400,
              cursor:'pointer', textAlign:'left',
              display:'flex', alignItems:'center', gap: 10,
            }}
            onMouseEnter={e => { if (!ca) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!ca) e.currentTarget.style.background='transparent'; }}>
            <i className={`fa-solid fa-${child.icon}`} style={{ fontSize: 12, width: 14, color: ca ? 'rgb(168,185,241)' : 'rgb(163,163,163)' }} />
            <span style={{ flex: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{child.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------- Collapsed-mode tooltip chip for leaf items --------- */
function TooltipChip({ label, anchorRect }) {
  return (
    <span style={{
      position:'fixed',
      left: anchorRect.right + 8,
      top: anchorRect.top + anchorRect.height / 2,
      transform: 'translateY(-50%)',
      background:'rgb(17,24,39)', border:'1px solid rgb(75,85,99)', borderRadius: 6,
      padding:'5px 9px', fontFamily:'Inter', fontSize: 11.5, fontWeight: 500,
      color:'rgb(249,250,251)', whiteSpace:'nowrap', zIndex: 1000, pointerEvents: 'none',
      boxShadow:'0 6px 16px -4px rgba(0,0,0,0.5)',
    }}>{label}</span>
  );
}

/* --------- User row (display only) --------- */
function UserRow({ expanded, user }) {
  const initials = user.name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 10,
      padding: expanded ? '6px 6px' : '6px 0',
      justifyContent: expanded ? 'flex-start' : 'center',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9999, background:'rgb(75,85,99)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'#fff', fontFamily:'Inter', fontWeight: 600, fontSize: 11.5, flexShrink: 0,
      }}>{initials}</div>
      {expanded && (
        <div style={{ display:'flex', flexDirection:'column', minWidth: 0, flex: 1 }}>
          <span style={{ fontFamily:'Inter', fontSize: 12.5, fontWeight: 500, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</span>
          <span style={{ fontFamily:'Inter', fontSize: 10.5, color:'rgb(163,163,163)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.role}</span>
        </div>
      )}
    </div>
  );
}

/* --------- Sign-out button (always visible, bottom of rail) --------- */
function SignOutButton({ expanded, href }) {
  const [hover, setHover] = React.useState(false);
  const onClick = (e) => {
    e.preventDefault();
    window.open(href, '_blank', 'noopener,noreferrer');
  };
  return (
    <a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer"
      title={expanded ? '' : 'Return to Demo Page'}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        marginTop: 4,
        height: 32, width: '100%', borderRadius: 8,
        border: '1px solid ' + (hover ? 'rgb(75,85,99)' : 'rgba(75,85,99,0.6)'),
        background: hover ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: 'rgb(209,213,219)', cursor: 'pointer', textDecoration: 'none',
        display:'flex', alignItems:'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        padding: expanded ? '0 10px' : 0, gap: 10,
        fontFamily:'Inter', fontSize: 12.5, fontWeight: 500,
      }}>
      <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 12, width: 16, textAlign:'center', color:'rgb(163,163,163)', flexShrink: 0 }} />
      {expanded && <span style={{ whiteSpace:'nowrap' }}>Return to Demo</span>}
    </a>
  );
}

/* ---- Topbar ---- (Design-system Topbar pattern: 56px, gray-800 surface,
     centered search field with ⌘K hint, ghost/outline action buttons.) */
function PageTopbar({ title, dateLabel, dateRange = 'Aug 20 - Today', actions, leading, showSearch = true, showDateRange = true, searchPlaceholder = 'Search clients, advisors, or opportunities…' }) {
  const today = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const n = today.getDate();
  const suf = (n % 10 === 1 && n !== 11) ? 'st' : (n % 10 === 2 && n !== 12) ? 'nd' : (n % 10 === 3 && n !== 13) ? 'rd' : 'th';
  const computedDate = dateLabel || `${days[today.getDay()]} ${months[today.getMonth()]} ${n}${suf} ${today.getFullYear()}`;
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(31,41,55,0.85)',
      backdropFilter: 'blur(12px) saturate(140%)',
      WebkitBackdropFilter: 'blur(12px) saturate(140%)',
      borderBottom: '1px solid rgb(75,85,99)',
    }}>
      <div style={{ height: 56, display:'flex', alignItems:'center', gap: 16, padding:'0 24px' }}>
        {leading}
        <div style={{ minWidth: 220, display:'flex', alignItems:'baseline', gap: 10 }}>
          <div style={{ fontFamily:'Inter', fontWeight: 600, fontSize: 14, color:'rgb(249,250,251)' }}>{title}</div>
          <div style={{ fontFamily:'Inter', fontSize: 12, color:'rgb(163,163,163)' }}>{computedDate}</div>
        </div>

        {showSearch ? (
          <div style={{ flex: 1, display:'flex', justifyContent:'center' }}>
            <div style={{
              display:'flex', alignItems:'center', gap: 8, height: 32, width: 380, padding:'0 12px',
              borderRadius: 8, background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)',
              fontFamily:'Inter', fontSize: 13, color:'rgb(163,163,163)',
            }}>
              <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 12 }} />
              <span style={{ flex: 1 }}>{searchPlaceholder}</span>
              <span style={{
                fontFamily:'var(--font-mono, "Geist Mono", monospace)', fontSize: 10.5,
                padding:'1px 6px', borderRadius: 4, background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(75,85,99,0.6)', color:'rgb(163,163,163)',
              }}>⌘K</span>
            </div>
          </div>
        ) : <div style={{ flex: 1 }} />}

        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          {actions}
          {showDateRange && (
            <button style={{
              height: 32, padding:'0 12px', borderRadius: 8, border:'1px solid rgb(75,85,99)',
              background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)',
              fontFamily:'Inter', fontSize: 12.5, fontWeight: 500, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap: 8,
            }}>
              <i className="fa-solid fa-calendar-days" style={{ fontSize: 12, color:'rgb(163,163,163)' }} />
              {dateRange}
              <i className="fa-solid fa-chevron-down" style={{ fontSize: 9, color:'rgb(163,163,163)' }} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---- Atoms (used by all pages) ---- */
function Card({ children, style, className = '', ...rest }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: 20, ...style }} {...rest}>{children}</div>
  );
}

function CardTitle({ title, subtitle, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 16, gap: 12 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color:'rgb(249,250,251)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color:'rgb(156,163,175)', marginTop: 3 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function StatTile({ label, value, sub, valueColor }) {
  return (
    <div className="glass-card" style={{ padding: 18, minHeight: 96 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color:'rgb(156,163,175)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</div>
      <div className="num" style={{ fontSize: 26, fontWeight: 700, color: valueColor || 'rgb(249,250,251)', marginTop: 8, letterSpacing:'-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color:'rgb(156,163,175)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Badge({ children, color = 'green', solid = false }) {
  const palette = {
    green:  { bg:'rgba(35,89,255,0.18)',    border:'rgba(35,89,255,0.45)',    fg:'rgb(168,185,241)' },
    blue:   { bg:'rgba(59,130,246,0.18)',  border:'rgba(59,130,246,0.4)',   fg:'rgb(120,160,230)' },
    purple: { bg:'rgba(147,51,234,0.2)',   border:'rgba(147,51,234,0.4)',   fg:'rgb(180,150,235)' },
    amber:  { bg:'rgba(245,158,11,0.2)',   border:'rgba(245,158,11,0.4)',   fg:'rgb(245,200,90)' },
    red:    { bg:'rgba(220,38,38,0.2)',    border:'rgba(220,38,38,0.4)',    fg:'rgb(248,113,113)' },
    coral:  { bg:'rgba(240,140,120,0.18)', border:'rgba(240,140,120,0.4)',  fg:'rgb(240,140,120)' },
    teal:   { bg:'rgba(120,200,210,0.18)', border:'rgba(120,200,210,0.4)',  fg:'rgb(120,200,210)' },
    gray:   { bg:'rgba(107,114,128,0.18)', border:'rgba(107,114,128,0.4)',  fg:'rgb(209,213,219)' },
  };
  const c = palette[color] || palette.green;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap: 4, padding:'2px 8px',
      borderRadius: 6, background: c.bg, border:`1px solid ${c.border}`,
      color: c.fg, fontSize: 11, fontWeight: 500, whiteSpace:'nowrap',
    }}>{children}</span>
  );
}

function Avatar({ initials, size = 32, color = 'gray' }) {
  const palette = {
    gray:'rgb(75,85,99)', green:'rgb(35,89,255)', blue:'rgb(59,130,246)',
    purple:'rgb(147,51,234)', amber:'rgb(202,138,4)', red:'rgb(220,38,38)',
    teal:'rgb(84,121,240)', coral:'rgb(240,140,120)',
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999, flexShrink: 0,
      background: palette[color] || palette.gray, color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: size * 0.36, fontWeight: 600,
    }}>{initials}</div>
  );
}

/* Backwards-compatibility — many pages still call `<Icon name="..." />`.
   Map common Lucide-style names to FontAwesome solid classes. */
const FA_ALIAS = {
  'pie':'chart-pie', 'dollar':'circle-dollar-to-slot', 'sparkles':'wand-magic-sparkles',
  'bar-chart':'chart-column', 'trending-up':'chart-line', 'trending-down':'chart-line-down',
  'user':'user', 'users':'users', 'receipt':'receipt', 'shield':'shield-halved',
  'link':'plug', 'package':'cube', 'help':'circle-question', 'sliders':'sliders',
  'globe':'globe', 'settings':'gear', 'menu':'bars', 'search':'magnifying-glass',
  'calendar':'calendar-days', 'chevron-left':'chevron-left', 'chevron-right':'chevron-right',
  'chevron-down':'chevron-down', 'chevron-up':'chevron-up', 'arrow-up':'arrow-up',
  'arrow-down':'arrow-down', 'up-down':'sort', 'download':'download', 'filter':'filter',
  'columns':'table-columns', 'plus':'plus', 'check':'check', 'x':'xmark',
  'edit':'pen-to-square', 'copy':'copy', 'more':'ellipsis', 'wand':'wand-magic-sparkles',
  'briefcase':'briefcase', 'heart':'heart', 'badge':'medal', 'flag':'flag',
  'alert':'triangle-exclamation', 'circle':'circle', 'mail':'envelope', 'activity':'pulse',
  'exit':'arrow-right-from-bracket', 'circle-check':'circle-check', 'key':'key',
  'building':'building', 'lock':'lock', 'refresh':'rotate', 'file-text':'file-lines',
  'arrow-right':'arrow-right', 'loader':'spinner', 'external':'arrow-up-right-from-square',
  'home':'house',
};

function Icon({ name, size = 16, style }) {
  const fa = FA_ALIAS[name] || name;
  return <i className={`fa-solid fa-${fa}`} style={{ fontSize: size, width: size, textAlign:'center', display:'inline-block', ...style }} />;
}

window.Icon = Icon;
window.Sidebar = Sidebar;
window.PageTopbar = PageTopbar;
window.Card = Card;
window.CardTitle = CardTitle;
window.StatTile = StatTile;
window.Badge = Badge;
window.Avatar = Avatar;

/* Reusable right-side slide-out drawer shell. Backdrop + panel + header +
   Esc-to-close. Pass open/onClose; render content as children, optional footer. */
function DrawerShell({ open, onClose, title, subtitle, leading, width = 'min(560px, 94vw)', children, footer }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 240ms ease', zIndex: 80,
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width,
        background: 'rgb(17,24,39)', borderLeft: '1px solid rgba(75,85,99,0.5)',
        boxShadow: '-30px 0 60px -10px rgba(0,0,0,0.65)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 81, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(75,85,99,0.4)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {leading}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'rgb(249,250,251)', letterSpacing: '-0.01em' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: 'rgb(156,163,175)', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', border: 'none', color: 'rgb(156,163,175)', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }} className="scroll-thin">{children}</div>
        {footer && <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(75,85,99,0.4)' }}>{footer}</div>}
      </aside>
    </React.Fragment>
  );
}
window.DrawerShell = DrawerShell;
