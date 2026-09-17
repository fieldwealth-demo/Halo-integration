/* Common helpers — Tabs, sortable header, mini sparkline */

function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: '0 24px',
      borderBottom: '1px solid rgba(75,85,99,0.4)',
    }}>
      {tabs.map(t => {
        const on = value === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            position: 'relative', height: 40, padding: '0 16px', border: 'none',
            background: 'transparent', color: on ? 'rgb(168,185,241)' : 'rgb(156,163,175)',
            fontSize: 13, fontWeight: on ? 600 : 500, cursor: 'pointer',
          }}>
            {t.label}
            {on && <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'rgb(168,185,241)' }} />}
          </button>
        );
      })}
    </div>
  );
}

function SortHeader({ label, sortKey, sort = { key: null, dir: 'desc' }, setSort, align = 'left' }) {
  const active = sort && sort.key === sortKey;
  return (
    <th style={{
      textAlign: align, padding: '12px 16px', fontSize: 11, fontWeight: 500,
      color: 'rgb(156,163,175)', letterSpacing: '0.06em', textTransform: 'uppercase',
      borderBottom: '1px solid rgba(75,85,99,0.3)',
    }}>
      <button onClick={() => setSort && setSort(s => ({
        key: sortKey, dir: (s && s.key) === sortKey && (s && s.dir) === 'desc' ? 'asc' : 'desc',
      }))} style={{
        background: 'transparent', border: 'none', cursor: setSort ? 'pointer' : 'default',
        color: active ? 'rgb(229,231,235)' : 'inherit', fontSize: 'inherit', fontWeight: 'inherit',
        letterSpacing: 'inherit', textTransform: 'inherit',
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0,
      }}>
        {label}
        {setSort && <Icon name="up-down" size={11} style={{ color: 'rgb(107,114,128)' }} />}
      </button>
    </th>
  );
}

function MiniSpark({ data, color = 'rgb(35,89,255)', width = 60, height = 18 }) {
  /* Sparkline via the shared HC wrapper so it inherits the Field theme.
     Axes, legend, tooltip, credits stripped — pure trend line. */
  const opts = React.useMemo(() => ({
    chart: { type: 'spline', backgroundColor: 'transparent',
      margin: [2, 0, 2, 0], spacing: [0, 0, 0, 0],
      width, height, animation: false,
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: { visible: false, type: 'category' },
    yAxis: { visible: false, endOnTick: false, startOnTick: false },
    plotOptions: { series: { animation: false, marker: { enabled: false }, lineWidth: 1.5, states: { hover: { enabled: false }, inactive: { enabled: false } } } },
    series: [{ data, color, type: 'spline' }],
  }), [data, color, width, height]);
  return (
    <div style={{ width, height, flexShrink: 0 }}>
      <HC options={opts} />
    </div>
  );
}

function Logo({ name }) {
  // Advisory partner firm logos — uploaded asset images, rendered at native colors.
  // Each logo file already includes its own brand background, so render edge-to-edge.
  const R = window.__resources || {};
  const imgLogos = {
    declaration: R.logoDeclaration || 'uploads/declaration.png',
    hightower:   R.logoHightower || 'uploads/hightower.png',
    citizens:    R.logoCitizens || 'uploads/citizens.png',
    tpg:         R.logoTpg || 'uploads/tpg.png',
    lpl:         R.logoLpl || 'uploads/lplfinanacial.png',
  };
  if (imgLogos[name]) {
    return <img src={imgLogos[name]} alt={name} style={{ display:'block', width:'100%', height:'100%', objectFit:'contain' }} />;
  }
  const logos = {
    vanguard:  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgb(196,30,58)' }}>VANGUARD</div>,
    pimco:     <div style={{ fontSize: 11, fontWeight: 800, color: 'rgb(0,52,120)' }}>PIMCO</div>,
    blackrock: <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgb(40,40,40)' }}>BLACKROCK</div>,
    blackstone:<div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgb(40,40,40)' }}>Blackstone</div>,
    goldman:   <div style={{ fontSize: 10, fontWeight: 700, color: 'rgb(124,150,179)' }}>Goldman Sachs</div>,
    ishares:   <div style={{ fontSize: 11, fontWeight: 700, color: 'rgb(40,40,40)' }}>iShares</div>,
  };
  return logos[name] || <span>{name}</span>;
}

// Table cell helpers used across pages
const th = (align = 'left') => ({
  textAlign: align, padding: '12px 16px', fontSize: 11, fontWeight: 500,
  color: 'rgb(156,163,175)', letterSpacing: '0.06em', textTransform: 'uppercase',
});
const td = (align = 'left', extra = '') => ({
  textAlign: align, padding: '12px 16px', fontSize: 12.5, color: 'rgb(229,231,235)',
  fontVariantNumeric: extra === 'num' ? 'tabular-nums' : 'normal',
});
const tdSm = (align = 'left', extra = '') => ({
  textAlign: align, padding: '10px 16px', fontSize: 12, color: 'rgb(229,231,235)',
  fontVariantNumeric: extra === 'num' ? 'tabular-nums' : 'normal',
});

window.Tabs = Tabs;
window.SortHeader = SortHeader;
window.MiniSpark = MiniSpark;
window.Logo = Logo;
window.th = th;
window.td = td;
window.tdSm = tdSm;
