/* Client List — table view for the Clients sidebar route.
   Matches Field Shadcn design system; dark surface. */

const CL_SEGMENTS = {
  Platinum: { fg:'rgb(199,210,254)', bg:'rgba(129,140,248,0.16)', bd:'rgba(129,140,248,0.4)' },
  Gold:     { fg:'rgb(252,211,77)',  bg:'rgba(245,158,11,0.16)',  bd:'rgba(245,158,11,0.4)'  },
  Silver:   { fg:'rgb(203,213,225)', bg:'rgba(148,163,184,0.16)', bd:'rgba(148,163,184,0.4)' },
  Emerging: { fg:'rgb(110,231,183)', bg:'rgba(5,122,85,0.18)',    bd:'rgba(5,122,85,0.45)'   },
};

function clAumTier(aum) {
  if (aum < 5000000)  return '<$5M';
  if (aum < 15000000) return '$5M–$15M';
  if (aum < 30000000) return '$15M–$30M';
  return '$30M+';
}

function ClientList({ onOpenClient, view = 'households', filters }) {
  // view: 'households' | 'individuals' | 'prospects' — drives only the heading
  // copy + row count; the dataset itself is unchanged for the demo.
  const VIEW_LABELS = {
    households:  { count: 375, label: 'households' },
    individuals: { count: 612, label: 'individuals' },
    prospects:   { count:  48, label: 'prospects'  },
  };
  const viewInfo = VIEW_LABELS[view] || VIEW_LABELS.households;
  const [sortKey, setSortKey] = React.useState('aum');
  const [sortDir, setSortDir] = React.useState('desc');

  const rows = React.useMemo(() => [
    { id:1,  name:'David Young', sub:null,                aum:31240000, held:830000,  segment:'Platinum', risk:'Moderate',     status:'Active',     ytd:0.084,  nextReview:'Jun 18, 2026', reviewDue:true,  accounts:6 },
    { id:2,  name:'Edwards',     sub:'Aubrey & Josh',     aum:30854000, held:910000,  segment:'Platinum', risk:'Aggressive',   status:'Active',     ytd:0.112,  nextReview:'Aug 02, 2026', reviewDue:false, accounts:5 },
    { id:3,  name:'Hawkins',     sub:'Ricardo & Cameron', aum:29467000, held:1020000, segment:'Platinum', risk:'Moderate',     status:'Review Due', ytd:0.061,  nextReview:'Jun 12, 2026', reviewDue:true,  accounts:7 },
    { id:4,  name:'Smith',       sub:'Keith & Asheley',   aum:28986000, held:2220000, segment:'Gold',     risk:'Conservative', status:'Active',     ytd:0.039,  nextReview:'Sep 21, 2026', reviewDue:false, accounts:4 },
    { id:5,  name:'Watson',      sub:'John & Kristin',    aum:27256000, held:220000,  segment:'Gold',     risk:'Aggressive',   status:'Active',     ytd:-0.024, nextReview:'Jul 09, 2026', reviewDue:false, accounts:3 },
    { id:6,  name:'Jones',       sub:'Joe & Mary',        aum:18154000, held:471000,  segment:'Gold',     risk:'Moderate',     status:'Review Due', ytd:0.052,  nextReview:'Jun 15, 2026', reviewDue:true,  accounts:5 },
    { id:7,  name:'Lang',        sub:'Aubrey & Josh',     aum:16471000, held:671000,  segment:'Gold',     risk:'Conservative', status:'Active',     ytd:0.028,  nextReview:'Oct 04, 2026', reviewDue:false, accounts:4 },
    { id:8,  name:'Conell',      sub:'Ricardo & Cameron', aum:10264000, held:457000,  segment:'Silver',   risk:'Moderate',     status:'Active',     ytd:0.071,  nextReview:'Aug 27, 2026', reviewDue:false, accounts:3 },
    { id:9,  name:'Benson',      sub:'Keith & Asheley',   aum:5671000,  held:20000,   segment:'Silver',   risk:'Aggressive',   status:'Prospect',   ytd:-0.011, nextReview:'Jul 19, 2026', reviewDue:false, accounts:2 },
    { id:10, name:'Simmons',     sub:'John & Kristin',    aum:4812000,  held:15000,   segment:'Emerging', risk:'Conservative', status:'Prospect',   ytd:0.046,  nextReview:'Sep 06, 2026', reviewDue:false, accounts:2 },
    { id:11, name:'Patel',       sub:'Anita & Raj',       aum:3940000,  held:88000,   segment:'Emerging', risk:'Moderate',     status:'Active',     ytd:0.093,  nextReview:'Jun 14, 2026', reviewDue:true,  accounts:3 },
    { id:12, name:'Nguyen',      sub:'Linh & Daniel',     aum:2210000,  held:34000,   segment:'Emerging', risk:'Aggressive',   status:'Prospect',   ytd:0.157,  nextReview:'Nov 01, 2026', reviewDue:false, accounts:2 },
  ], []);

  // --- Apply filters from the slide-out drawer ----------------------------
  const f = filters || {};
  const filtered = React.useMemo(() => rows.filter(r => {
    if (f.segment && f.segment.length && !f.segment.includes(r.segment)) return false;
    if (f.aum && f.aum.length && !f.aum.includes(clAumTier(r.aum))) return false;
    if (f.risk && f.risk.length && !f.risk.includes(r.risk)) return false;
    if (f.status && f.status.length && !f.status.includes(r.status)) return false;
    return true;
  }), [rows, f.segment, f.aum, f.risk, f.status]);

  const sorted = React.useMemo(() => {
    const copy = [...filtered];
    copy.sort((a,b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'number') return sortDir==='desc' ? bv-av : av-bv;
      return sortDir==='desc' ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const onSort = (k) => {
    if (k === sortKey) setSortDir(d => d==='desc'?'asc':'desc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const fmtCur = (n) => '$' + n.toLocaleString('en-US');
  const fmtPct = (n) => (n>=0?'+':'') + (n*100).toFixed(1) + '%';

  const COLOR = {
    border: 'rgb(75,85,99)',
    subtle: 'rgb(163,163,163)',
    ink:    'rgb(249,250,251)',
    surface:'rgb(17,24,39)',
    hover:  'rgba(255,255,255,0.03)',
    green:  'rgb(5,122,85)',
    greenSoft:'rgba(5,122,85,0.16)',
    pos:    'rgb(52,211,153)',
    neg:    'rgb(248,113,113)',
  };

  const HeadCell = ({ k, label, align='left' }) => (
    <th onClick={()=> k && onSort(k)} style={{
      textAlign: align, padding:'10px 14px', fontFamily:'Inter', fontSize:10.5, fontWeight:600,
      color: COLOR.subtle, letterSpacing:'0.06em', textTransform:'uppercase',
      borderBottom:`1px solid ${COLOR.border}`, cursor: k?'pointer':'default', userSelect:'none',
      whiteSpace:'nowrap', background:'transparent',
    }}>
      <span style={{ display:'inline-flex', alignItems:'center', gap:6, flexDirection: align==='right'?'row-reverse':'row' }}>
        {label}
        {k && <i className="fa-solid fa-up-down" style={{ width:9, height:9, opacity: sortKey===k?1:0.4, color: sortKey===k?COLOR.ink:COLOR.subtle }} />}
      </span>
    </th>
  );

  const IconBtn = ({ icon, color=COLOR.green }) => (
    <button data-no-hint style={{
      width:26, height:26, borderRadius:6, border:'none', background:'transparent',
      color, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
    }}>
      <i className={`fa-solid fa-${icon}`} style={{ width:13, height:13 }} />
    </button>
  );

  const SegmentBadge = ({ tier }) => {
    const c = CL_SEGMENTS[tier] || CL_SEGMENTS.Silver;
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', height:22, padding:'0 9px', borderRadius:9999,
        background:c.bg, border:`1px solid ${c.bd}`, color:c.fg, fontSize:11, fontWeight:600, whiteSpace:'nowrap',
      }}>{tier}</span>
    );
  };

  return (
    <div style={{ padding:'20px 24px 32px', background:'transparent' }}>
      {/* Head background tweak — transparent */}
      <style>{`.__cl-head th { background: transparent !important; }`}</style>
      {/* Toolbar — household count and view toggle */}
      <div style={{
        display:'flex', alignItems:'center', gap:14, padding:'6px 2px 14px',
      }}>
        <div style={{ fontFamily:'Inter', fontSize:12, color:COLOR.subtle }}>
          Showing <span style={{ color:COLOR.ink, fontWeight:600 }}>{sorted.length}</span> of {viewInfo.count} {viewInfo.label}
        </div>
      </div>

      {/* Table */}
      <div style={{
        border:`1px solid ${COLOR.border}`, borderRadius:12, overflow:'hidden',
        background:'rgba(255,255,255,0.05)',
      }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Inter' }}>
          <thead>
            <tr>
              <HeadCell k="name"       label="Clients" />
              <HeadCell k="aum"        label="AUM"          align="right" />
              <HeadCell k="held"       label="Held Away"    align="right" />
              <HeadCell k="ytd"        label="YTD Return"   align="right" />
              <HeadCell k="nextReview" label="Next Review"  align="right" />
              <HeadCell                label="Contact"      align="center" />
              <HeadCell                label="Schedule"     align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.id + '-' + i}
                  data-clickable={r.name === 'David Young' ? true : undefined}
                  onClick={()=>onOpenClient && onOpenClient(r.name)} style={{
                borderBottom: i === sorted.length-1 ? 'none' : `1px solid ${COLOR.border}`,
                transition:'background 120ms', cursor: onOpenClient ? 'pointer' : 'default',
              }} onMouseEnter={e=>e.currentTarget.style.background=COLOR.hover}
                 onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {/* Client cell */}
                <td style={{ padding:'14px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <Avatar name={r.name} id={r.id} />
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:COLOR.ink }}>{r.name}</div>
                      {r.sub && <div style={{ fontSize:11, color:COLOR.subtle, marginTop:1 }}>{r.sub}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ padding:'14px 14px', textAlign:'right', fontSize:13, color:COLOR.ink, fontVariantNumeric:'tabular-nums' }}>
                  {fmtCur(r.aum)}
                </td>
                <td style={{ padding:'14px 14px', textAlign:'right', fontSize:13, color:COLOR.ink, fontVariantNumeric:'tabular-nums' }}>
                  {fmtCur(r.held)}
                </td>
                {/* YTD Return */}
                <td style={{ padding:'14px 14px', textAlign:'right', fontVariantNumeric:'tabular-nums' }}>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:5, justifyContent:'flex-end',
                    fontSize:13, fontWeight:600, color: r.ytd>=0 ? COLOR.pos : COLOR.neg,
                  }}>
                    <i className={`fa-solid fa-arrow-trend-${r.ytd>=0?'up':'down'}`} style={{ width:11, height:11 }} />
                    {fmtPct(r.ytd)}
                  </span>
                </td>
                {/* Next Review */}
                <td style={{ padding:'14px 14px', textAlign:'right', fontSize:13, color:COLOR.ink, fontVariantNumeric:'tabular-nums' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:7, justifyContent:'flex-end' }}>
                    {r.reviewDue && <span title="Review due soon" style={{ width:6, height:6, borderRadius:9999, background:'rgb(245,158,11)', flexShrink:0 }} />}
                    <span style={{ color: r.reviewDue ? 'rgb(252,211,77)' : COLOR.ink }}>{r.nextReview}</span>
                  </span>
                </td>
                <td style={{ padding:'14px 14px', textAlign:'center' }} onClick={e=>e.stopPropagation()}>
                  <div style={{ display:'inline-flex', gap:2 }}>
                    <IconBtn icon="house" />
                    <IconBtn icon="envelope" />
                    <IconBtn icon="phone" />
                  </div>
                </td>
                <td style={{ padding:'14px 14px', textAlign:'right' }} onClick={e=>e.stopPropagation()}>
                  <button data-no-hint style={{
                    height:30, padding:'0 12px', borderRadius:8,
                    background:'rgba(255,255,255,0.04)', border:`1px solid ${COLOR.border}`,
                    color:COLOR.ink, fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
                    whiteSpace:'nowrap',
                  }}>Schedule Appointment</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding:'48px 14px', textAlign:'center', color:COLOR.subtle, fontFamily:'Inter', fontSize:13 }}>
                  No clients match the active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function smBtn() {
  return {
    height:30, padding:'0 12px', borderRadius:8,
    background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)',
    color:'rgb(229,231,235)', fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
    display:'inline-flex', alignItems:'center',
  };
}
function viewBtn(active) {
  return {
    width:30, height:30, borderRadius:8,
    background: active ? 'rgba(5,122,85,0.22)' : 'rgba(255,255,255,0.04)',
    border:'1px solid rgb(75,85,99)',
    color: active ? 'rgb(5,122,85)' : 'rgb(163,163,163)',
    cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
  };
}

/* Avatar — stable per-id gradient with initials */
function Avatar({ name, id }) {
  const palette = [
    ['#f0abfc','#c084fc'], ['#fca5a5','#f87171'], ['#fdba74','#fb923c'],
    ['#fcd34d','#f59e0b'], ['#86efac','#34d399'], ['#67e8f9','#22d3ee'],
    ['#93c5fd','#60a5fa'], ['#c4b5fd','#a78bfa'], ['#f9a8d4','#ec4899'],
  ];
  const [a,b] = palette[id % palette.length];
  const initial = String(name || '?').trim().charAt(0).toUpperCase();
  return (
    <div style={{
      width:32, height:32, borderRadius:9999,
      background:`linear-gradient(135deg, ${a}, ${b})`,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontSize:12, fontWeight:700,
      border:'1px solid rgba(255,255,255,0.15)', flexShrink:0,
    }}>{initial}</div>
  );
}

Object.assign(window, { ClientList, CL_SEGMENTS, clAumTier });
