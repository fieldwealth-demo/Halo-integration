/* Notifications Page — full-width list view of all notifications with filter chips.
   Matches the Halo Shadcn glass aesthetic. Each card is bordered left with a tone
   color (red=high, yellow=medium, blue=info, purple=private). Cards can have a
   dense "multi-client" variant with a bulleted breakdown, and an actions row.
*/

const NOTIF_TONES = {
  danger:  { border:'rgb(220,38,38)',   iconBg:'rgba(220,38,38,0.14)',   iconFg:'rgb(248,113,113)', dot:'rgb(220,38,38)',  tag:{bg:'rgba(220,38,38,0.18)', fg:'rgb(248,113,113)', border:'1px solid rgba(220,38,38,0.45)'} },
  warning: { border:'rgb(234,179,8)',   iconBg:'rgba(234,179,8,0.14)',   iconFg:'rgb(253,224,71)',  dot:'rgb(234,179,8)',  tag:{bg:'rgba(234,179,8,0.18)', fg:'rgb(253,224,71)', border:'1px solid rgba(234,179,8,0.5)'} },
  success: { border:'rgb(35,89,255)',    iconBg:'rgba(35,89,255,0.18)',    iconFg:'rgb(84,121,240)',  dot:'rgb(35,89,255)',   tag:{bg:'rgba(35,89,255,0.22)', fg:'rgb(84,121,240)', border:'1px solid rgba(35,89,255,0.5)'} },
  info:    { border:'rgb(56,189,248)',  iconBg:'rgba(56,189,248,0.14)',  iconFg:'rgb(56,189,248)',  dot:'rgb(56,189,248)', tag:{bg:'rgba(56,189,248,0.18)', fg:'rgb(56,189,248)', border:'1px solid rgba(56,189,248,0.5)'} },
  violet:  { border:'rgb(139,92,246)',  iconBg:'rgba(139,92,246,0.14)',  iconFg:'rgb(167,139,250)', dot:'rgb(139,92,246)', tag:{bg:'rgba(139,92,246,0.2)',  fg:'rgb(196,181,253)', border:'1px solid rgba(139,92,246,0.5)'} },
  mute:    { border:'rgba(75,85,99,0.8)', iconBg:'rgba(255,255,255,0.05)', iconFg:'rgb(163,163,163)', dot:'rgb(107,114,128)', tag:{bg:'rgba(17,24,39,0.8)', fg:'rgb(229,231,235)', border:'1px solid rgb(75,85,99)'} },
};

const NP_CARD_BASE = {
  background: 'rgba(255,255,255,0.04)',
  borderTop: '1px solid rgba(75,85,99,0.55)',
  borderRight: '1px solid rgba(75,85,99,0.55)',
  borderBottom: '1px solid rgba(75,85,99,0.55)',
  borderRadius: 12,
  color: 'rgb(249,250,251)',
  position: 'relative',
  overflow: 'hidden',
};

const NP_LABEL = { fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' };
const NP_TITLE = { fontFamily:'Inter', fontSize:14, fontWeight:600, color:'rgb(249,250,251)', letterSpacing:'-0.005em' };
const NP_BODY  = { fontFamily:'Inter', fontSize:12.5, color:'rgb(209,213,219)', lineHeight:1.55 };

function NPBadge({ tone='mute', children, size='sm' }) {
  const t = NOTIF_TONES[tone] || NOTIF_TONES.mute;
  const sizes = size === 'xs'
    ? { padding:'2px 7px', fontSize:9.5, letterSpacing:'0.06em' }
    : { padding:'3px 9px', fontSize:10, letterSpacing:'0.06em' };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', fontFamily:'Inter', fontWeight:700,
      textTransform:'uppercase', borderRadius:4, ...t.tag, ...sizes,
    }}>{children}</span>
  );
}

function NPMetaChip({ children, tone='mute' }) {
  const t = NOTIF_TONES[tone] || NOTIF_TONES.mute;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      fontFamily:'Inter', fontWeight:500, fontSize:10.5,
      padding:'3px 9px', borderRadius:5,
      background: tone === 'mute' ? 'rgba(255,255,255,0.04)' : t.tag.bg,
      color: tone === 'mute' ? 'rgb(163,163,163)' : t.tag.fg,
      border: tone === 'mute' ? '1px solid rgba(75,85,99,0.55)' : t.tag.border,
    }}>{children}</span>
  );
}

function NPButton({ variant='primary', children, onClick, noHint }) {
  const styles = variant === 'primary' ? {
    background:'rgb(35,89,255)', color:'#fff', border:'1px solid rgb(35,89,255)',
  } : variant === 'violet' ? {
    background:'rgb(139,92,246)', color:'#fff', border:'1px solid rgb(139,92,246)',
  } : {
    background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)', border:'1px solid rgba(75,85,99,0.8)',
  };
  return (
    <button onClick={onClick} data-no-hint={(noHint || !onClick) || undefined} style={{
      ...styles,
      fontFamily:'Inter', fontWeight:600, fontSize:11.5,
      padding:'6px 12px', borderRadius:6, cursor:'pointer',
      display:'inline-flex', alignItems:'center', gap:6,
    }}>{children}</button>
  );
}

/* ---- Generic Card ------------------------------------------------------- */
function NotificationCard({
  tone='mute', icon='bell', iconChar,
  title, titleBadges=[], body, clients,
  meta=[], actions=[], unread=true, time, children,
}) {
  const t = NOTIF_TONES[tone] || NOTIF_TONES.mute;
  return (
    <div style={{ ...NP_CARD_BASE, borderLeft:`3px solid ${t.border}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'44px 1fr auto', gap:14, padding:'14px 18px 14px 16px' }}>
        {/* Icon */}
        <div style={{
          width:36, height:36, borderRadius:8, background:t.iconBg,
          display:'flex', alignItems:'center', justifyContent:'center',
          border:`1px solid ${t.tag.border.replace('1px solid ','')}`,
          marginTop:2,
        }}>
          {iconChar ? (
            <span style={{ fontFamily:'Inter', fontWeight:700, fontSize:13, color:t.iconFg }}>{iconChar}</span>
          ) : (
            <i className={faCls(icon)} style={{ width:16, height:16, color:t.iconFg }} />
          )}
        </div>
        {/* Body */}
        <div style={{ minWidth:0, display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <div style={NP_TITLE}>{title}</div>
            {titleBadges.map((b, i) => (
              <NPBadge key={i} tone={b.tone || 'mute'}>{b.label}</NPBadge>
            ))}
          </div>
          {body && <div style={NP_BODY}>{body}</div>}
          {clients && clients.length > 0 && (
            <ul style={{ margin:'2px 0 0', padding:'0 0 0 18px', display:'flex', flexDirection:'column', gap:2 }}>
              {clients.map((c, i) => (
                <li key={i} style={{ ...NP_BODY, fontSize:12, color:'rgb(209,213,219)' }}>
                  {c.name} <span style={{ color:'rgb(163,163,163)' }}>— {c.amount}</span>
                </li>
              ))}
            </ul>
          )}
          {children}
          {meta.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginTop:6 }}>
              {meta.map((m, i) => <NPMetaChip key={i} tone={m.tone || 'mute'}>{m.label}</NPMetaChip>)}
            </div>
          )}
          {actions.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginTop:10 }}>
              {actions.map((a, i) => (
                <NPButton key={i} variant={a.variant || (i === 0 ? 'primary' : 'secondary')} onClick={a.onClick} noHint={a.noHint}>
                  {a.label} {a.arrow && <i className="fa-solid fa-arrow-right" style={{ width:10, height:10 }} />}
                </NPButton>
              ))}
            </div>
          )}
        </div>
        {/* Right meta column: time + unread dot */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, paddingTop:4 }}>
          {time && <div style={{ ...NP_LABEL, fontSize:10.5, whiteSpace:'nowrap' }}>{time}</div>}
          {unread && (
            <div style={{ width:8, height:8, borderRadius:9999, background:t.dot, boxShadow:`0 0 8px ${t.dot}` }} />
          )}
        </div>
      </div>
    </div>
  );
}


/* Helm subscription left in progress after the Delio hand-off (persisted so a
   refresh keeps it; Restart demo clears halo.* keys). */
function haloHelmPending() {
  try { return window.HALO_HELMX || JSON.parse(localStorage.getItem('halo.helmx') || 'null'); } catch (e) { return null; }
}

/* ---- Data -------------------------------------------------------------- */
const NP_ALL_NOTIFICATIONS = [
  // ALL tab — general feed
  {
    group:'all',
    tone:'danger', icon:'triangle-alert', unread:true,
    title:'Capital Call Due · Kestermark Growth Fund (TRELLIS)',
    titleBadges:[{ tone:'danger', label:'High' }, { tone:'mute', label:'Helm · Delio' }],
    body:'Marcus Ellery — $125K due Oct 2. Available cash $38K. Short $87K. Call 3 on a $500K commitment; the commitment is binding, so the only decision is what to liquidate.',
    meta:[{ label:'Due Oct 2', tone:'danger' }, { label:'Capital calls' }, { label:'Payment ref F11F78' }],
    actions:[
      { variant:'primary', label:'Open the client', arrow:true, onClick:() => window.dispatchEvent(new CustomEvent('client:open', { detail:{ client:'Marcus Ellery', highlight:'call' } })) },
      { variant:'secondary', label:'View funding plan', onClick:() => window.dispatchEvent(new CustomEvent('call:open')) },
    ],
    time:'20 min ago',
    priority:'high', upcoming:true, today:true, hideWhenPaid:true,
  },
  {
    group:'all',
    tone:'success', icon:'check-circle-2', unread:true,
    title:'Capital Call Paid · Kestermark Growth Fund (TRELLIS)',
    titleBadges:[{ tone:'success', label:'Paid' }, { tone:'mute', label:'Helm · Delio' }],
    body:'Marcus Ellery — $125,000 wired against payment reference F11F78. Delio marked call 3 paid; paid-in capital is now $375,000 of a $500,000 commitment. Orders SW-84219 and SW-84229 filled at Schwab.',
    meta:[{ label:'Just now' }, { label:'Capital calls' }, { label:'$214 realized tax' }],
    time:'Just now',
    priority:'medium', upcoming:false, today:true, onlyWhenPaid:true,
  },
  {
    group:'all',
    tone:'success', icon:'sparkles', unread:true,
    title:'Rebalance Opportunity',
    body:'David Young has an opportunity to make his plan improve. Next step create a presentation for David.',
    meta:[{ label:'15 min ago' }, { label:'New Business' }],
    actions:[
      { variant:'primary', label:'Review Opportunity', arrow:true, onClick:() => window.dispatchEvent(new CustomEvent('client:open', { detail:{ client:'David Young', highlight:'rebalance' } })) },
      { variant:'secondary', label:'Dismiss' },
    ],
    priority:'medium', upcoming:false, today:true,
  },
  {
    group:'all',
    tone:'success', icon:'sparkles', unread:true,
    title:'New Opportunity APME Insight',
    body:'Implementing APME for 15% of fixed income allocation.',
    meta:[{ label:'15 min ago' }, { label:'New Business' }],
    priority:'medium', upcoming:false, today:true,
  },
  {
    group:'all',
    tone:'violet', icon:'circle-check', unread:false,
    title:'New Opportunity Shared with Your Firm',
    titleBadges:[{ tone:'violet', label:'Private Placement' }, { tone:'violet', label:'+ Reg D' }],
    body:<span><b style={{color:'rgb(196,181,253)'}}>APEXIUM Asset Management</b> has shared a new private placement opportunity with Alpine Partners.</span>,
    extra:'APEXIUM Biodiversity Fund II · $500M Target · Min. Investment $250,000 · Accredited Investors Only',
    actions:[
      { variant:'violet', label:'View Opportunity', arrow:true, noHint:true },
      { variant:'secondary', label:'Dismiss' },
    ],
    time:'2 hours ago',
    priority:'medium', upcoming:false, today:true,
  },
  {
    group:'all',
    tone:'warning', icon:'check', unread:true,
    title:'Proposal Approved',
    body:'Maria Warkman has approved the investment proposal. Next step: Schedule account opening meeting.',
    meta:[{ label:'1 hour ago' }, { label:'Proposals' }],
    priority:'medium', upcoming:false, today:true,
  },
  {
    group:'all',
    tone:'success', icon:'calendar', unread:false,
    title:'Upcoming: Risk Management Review',
    body:'Scheduled for tomorrow at 11:00 AM with the compliance team. Preparation materials have been shared.',
    meta:[{ label:'2 hours ago' }, { label:'Meetings' }],
    priority:'medium', upcoming:true, today:false,
  },
  {
    group:'all',
    tone:'info', icon:'mail', unread:false,
    title:'Client Document Update',
    body:'John Smith has uploaded updated financial statements for Q4 review. Documents are now available in the client portal.',
    meta:[{ label:'3 hours ago' }, { label:'Documents' }],
    priority:'medium', upcoming:false, today:true,
  },

  // HIGH PRIORITY tab — detailed, action-oriented
  {
    group:'high',
    tone:'danger', icon:'layers', unread:true,
    title:'Bond Maturity Alert: Anderson Portfolio',
    titleBadges:[{ tone:'danger', label:'High' }],
    body:'$250,000 Treasury Bond maturing on Nov 25th. Reinvestment decision required. Current yield environment suggests reviewing duration strategy.',
    meta:[{ label:'1 hour ago' }, { label:'Fixed Income' }],
    actions:[
      { variant:'primary', label:'Review Options' },
      { variant:'secondary', label:'Contact Client' },
    ],
    priority:'high', today:true,
  },
  {
    group:'high',
    tone:'danger', icon:'shield', unread:true,
    title:'Compliance Review Required',
    titleBadges:[{ tone:'danger', label:'High' }],
    body:'Annual compliance certification due in 5 days for 3 client accounts. Missing documentation flagged by compliance system.',
    meta:[{ label:'4 hours ago' }, { label:'Compliance' }],
    actions:[
      { variant:'primary', label:'View Details' },
      { variant:'secondary', label:'Upload Documents' },
    ],
    priority:'high', today:false,
  },

  // NEXT 10 DAYS tab — upcoming items with dates + "In N days" chip
  {
    group:'upcoming',
    tone:'info', icon:'layers', unread:true,
    title:'Bond Maturity: Anderson Portfolio',
    titleBadges:[{ tone:'warning', label:'Medium' }],
    body:'$250,000 Treasury Bond (CUSIP: 912810TH8) maturing. Reinvestment decision pending.',
    meta:[{ label:'Nov 25' }, { label:'Fixed Income' }, { label:'In 5 days', tone:'success' }],
    priority:'medium', upcoming:true,
  },
  {
    group:'upcoming',
    tone:'success', icon:'calendar', unread:false,
    title:'Quarterly Review: Martinez Family',
    titleBadges:[{ tone:'warning', label:'Medium' }],
    body:'Q4 portfolio review meeting scheduled. Agenda: Performance review, tax-loss harvesting opportunities, 2026 planning.',
    meta:[{ label:'Nov 22' }, { label:'Meetings' }, { label:'In 2 days', tone:'success' }],
    priority:'medium', upcoming:true,
  },
  {
    group:'upcoming',
    tone:'warning', icon:'folder', unread:true,
    title:'Document Expiry: Wilson Account',
    titleBadges:[{ tone:'warning', label:'Medium' }],
    body:'Power of Attorney document expires Nov 24th. Renewal signature required from client.',
    meta:[{ label:'Nov 24' }, { label:'Documents' }, { label:'In 4 days', tone:'warning' }],
    priority:'medium', upcoming:true,
  },
  {
    group:'upcoming',
    tone:'violet', icon:'file-bar-chart', iconChar:'$', unread:false,
    title:'CD Maturity: Johnson Account',
    titleBadges:[{ tone:'warning', label:'Medium' }],
    body:'$100,000 CD maturing at 4.5% APY. Current rates available: 4.75% (12mo), 4.50% (6mo). Rollover decision needed.',
    meta:[{ label:'Nov 26' }, { label:'Fixed Income' }, { label:'In 6 days', tone:'success' }],
    priority:'medium', upcoming:true,
  },
  {
    group:'upcoming',
    tone:'success', icon:'users', unread:true,
    title:'New Client Onboarding: Davis Family',
    titleBadges:[{ tone:'warning', label:'Medium' }],
    body:'Account opening meeting scheduled. Documents prepared: IPS, Account Agreement, Beneficiary Forms.',
    meta:[{ label:'Nov 21' }, { label:'New Business' }, { label:'Tomorrow', tone:'warning' }],
    priority:'medium', upcoming:true,
  },
];

const NP_FILTERS = [
  { id:'all',      label:'All',           match:()=>true },
  { id:'unread',   label:'Unread',        match:(n)=>n.unread },
  { id:'high',     label:'High Priority', match:(n)=>n.priority === 'high' },
  { id:'today',    label:'Today',         match:(n)=>n.today },
  { id:'upcoming', label:'Next 10 Days',  match:(n)=>n.upcoming },
];

/* ---- Page -------------------------------------------------------------- */
function NotificationsPage() {
  const [filter, setFilter] = React.useState('all');
  const [paidTick, setPaidTick] = React.useState(0);
  React.useEffect(() => { const f = () => setPaidTick(n => n + 1); window.addEventListener('call:paid', f); window.addEventListener('helmx:pending', f); return () => { window.removeEventListener('call:paid', f); window.removeEventListener('helmx:pending', f); }; }, []);

  // "All" = union of unread + high priority + today + next 10 days, de-duped.
  // Other filters apply their match predicate across the whole set.
  const rows = React.useMemo(() => {
    const paid = !!window.FIELD_CALL_PAID;
    const gate = (n) => !(n.hideWhenPaid && paid) && !(n.onlyWhenPaid && !paid);
    const f = NP_FILTERS.find(x => x.id === filter) || NP_FILTERS[0];
    const seen = new Set();
    const hp = haloHelmPending();
    const USD = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const SRC = hp ? [{
      group:'all', tone:'info', icon:'file-signature', unread:true,
      title:'Subscription In Progress · Helm Private Markets Fund X',
      titleBadges:[{ tone:'info', label:'In progress' }, { tone:'mute', label:'Helm · Delio' }],
      body:`${hp.client} — ${USD(hp.commit)} commitment submitted in Delio. Agreement signed and funds sent; Delio confirms receipt in 2–3 business days, and units issue at the initial close on 1 Dec.`,
      meta:[{ label:'5 of 7 steps' }, { label:'Private markets' }, { label:'Close 1 Dec' }],
      actions:[{ variant:'primary', label:'Open the client', arrow:true, onClick:() => window.dispatchEvent(new CustomEvent('client:open', { detail:{ client:hp.client, highlight:'helmx-progress' } })) }],
      time:'Just now', priority:'medium', upcoming:true, today:true,
    }].concat(NP_ALL_NOTIFICATIONS) : NP_ALL_NOTIFICATIONS;
    if (filter === 'all') {
      return SRC.filter(n => {
        if (!gate(n)) return false;
        const hit = n.unread || n.priority === 'high' || n.today || n.upcoming;
        if (!hit) return false;
        if (seen.has(n.title)) return false;
        seen.add(n.title);
        return true;
      });
    }
    return SRC.filter(n => {
      if (!gate(n)) return false;
      if (!f.match(n)) return false;
      if (seen.has(n.title)) return false;
      seen.add(n.title);
      return true;
    });
  }, [filter, paidTick]);

  return (
    <div style={{ padding:'18px 28px 48px', maxWidth:1200, margin:'0 auto' }}>
      {/* Header w/ back */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
        <div style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:'rgb(249,250,251)', letterSpacing:'-0.01em' }}>
          Notifications
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {NP_FILTERS.map(f => {
          const active = f.id === filter;
          return (
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              fontFamily:'Inter', fontWeight:600, fontSize:11.5,
              padding:'7px 14px', borderRadius:6, cursor:'pointer',
              border: active ? '1px solid rgb(35,89,255)' : '1px solid rgba(75,85,99,0.7)',
              background: active ? 'rgb(35,89,255)' : 'rgba(255,255,255,0.04)',
              color: active ? '#fff' : 'rgb(209,213,219)',
              letterSpacing:'0.01em',
            }}>{f.label}</button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {rows.map((n, i) => (
          <NotificationCard key={n.group + '-' + i} {...n}>
            {n.extra && (
              <div style={{
                ...NP_BODY, fontSize:11.5, color:'rgb(163,163,163)',
                marginTop:2,
              }}>{n.extra}</div>
            )}
          </NotificationCard>
        ))}
        {rows.length === 0 && (
          <div style={{
            ...NP_CARD_BASE, borderLeft:'1px solid rgba(75,85,99,0.55)',
            padding:'40px 20px', textAlign:'center', color:'rgb(163,163,163)',
            fontFamily:'Inter', fontSize:13,
          }}>No notifications match this filter.</div>
        )}
      </div>
    </div>
  );
}
