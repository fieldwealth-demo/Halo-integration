/* My Practice — Three-tab workspace: Client Analysis, Cash Flow, Assets.
   Shell lives here. Each tab component is defined in its own file:
     - MyPractice.jsx (this file)      — shell + Client Analysis tab
     - MyPracticeCashFlow.jsx          — Cash Flow tab
     - MyPracticeAssets.jsx            — Assets tab
*/

/* ---- Shared tokens ----------------------------------------------------- */
const MP_CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(75,85,99,0.55)',
  borderRadius: 14,
  color: 'rgb(249,250,251)',
  display: 'flex', flexDirection: 'column',
  overflow: 'hidden',
  boxSizing: 'border-box',
  height: '100%'
};
const MP_HEAD = { display: 'flex', alignItems: 'baseline', padding: '14px 18px 6px', gap: 10 };
const MP_TITLE = { fontFamily: 'Inter', fontWeight: 600, fontSize: 14, letterSpacing: '-0.005em' };
const MP_SUB = { fontFamily: 'Inter', fontSize: 11, color: 'rgb(163,163,163)' };
const MP_LABEL = { fontFamily: 'Inter', fontSize: 10.5, color: 'rgb(163,163,163)', letterSpacing: '0.08em', textTransform: 'uppercase' };
const MP_VALUE = { fontFamily: 'Inter', fontWeight: 700, fontSize: 26, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' };
const MP_FOOT = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 16px', borderTop: '1px solid rgba(75,85,99,0.45)',
  fontFamily: 'Inter', fontSize: 12, color: 'rgb(163,163,163)', cursor: 'pointer'
};

function MPExportFooter() {
  return (
    <div style={MP_FOOT}>
      <i className="fa-solid fa-download" style={{ width: 12, height: 12 }} />
      Export Data
    </div>);

}

/* Generic KPI tile ------------------------------------------------------- */
function MPKpi({ label, value, delta, deltaTone = 'success', sub }) {
  const deltaColor = deltaTone === 'success' ? 'rgb(16,185,129)' :
  deltaTone === 'danger' ? 'rgb(248,113,113)' :
  'rgb(163,163,163)';
  return (
    <div style={{ ...MP_CARD, padding: '16px 20px', gap: 8, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 12, right: 12 }}><TileInfo title={label} /></div>
      <div style={MP_LABEL}>{label}</div>
      <div style={MP_VALUE}>{value}</div>
      {delta &&
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 11.5, color: deltaColor }}>
          <i className={deltaTone === 'danger' ? 'fa-solid fa-arrow-trend-down' : 'fa-solid fa-arrow-trend-up'} style={{ width: 11, height: 11 }} />
          {delta}
        </div>
      }
      {sub && <div style={{ ...MP_SUB }}>{sub}</div>}
    </div>);

}

/* Tabs header ------------------------------------------------------------ */
function MPTabs({ value, onChange }) {
  const tabs = [
  { id: 'clients', label: 'Client Analysis' },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'assets', label: 'Assets' }];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 24,
      padding: '12px 28px 0', borderBottom: '1px solid rgba(75,85,99,0.45)'
    }}>
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '10px 2px', marginBottom: -1,
            fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5,
            color: active ? 'rgb(16,185,129)' : 'rgb(163,163,163)',
            borderBottom: `2px solid ${active ? 'rgb(5,122,85)' : 'transparent'}`
          }}>{t.label}</button>);

      })}
    </div>);

}

/* ---- Client Analysis data ---------------------------------------------- */
const CA_AGE_ROWS = [
{ age: '21 - 34', clients: 21 },
{ age: '35 - 49', clients: 78 },
{ age: '50 - 64', clients: 428 },
{ age: '64 - 84', clients: 115 }];

const CA_AGE_AUM = { cats: ['21-34', '35-49', '50-64', '64-84'], aum: [18, 42, 88, 62], assets: [8, 20, 42, 28] };
const CA_OPEN_ROWS = [
{ years: '0 - 5', clients: 112 },
{ years: '6 - 10', clients: 173 },
{ years: '11 - 15', clients: 245 },
{ years: '20 +', clients: 62 }];

const CA_OPEN_AUM = { cats: ['0 - 5', '5 - 10', '10 - 15', '20 +'], aum: [36, 58, 78, 68], assets: [16, 26, 36, 32] };
const CA_AGE_DIST = [
{ bucket: 'Under 40', count: 24, pct: '8%', band: 'pre' },
{ bucket: '40-49', count: 56, pct: '19%', band: 'pre' },
{ bucket: '50-59', count: 78, pct: '21%', band: 'pre' },
{ bucket: '60-69', count: 129, pct: '33%', band: 'ret' },
{ bucket: '70+', count: 92, pct: '25%', band: 'ret' }];

const CA_OCCUPATION = [
{ name: 'Business Owners', clients: 255 },
{ name: 'Executives', clients: 178 },
{ name: 'Union/Gov', clients: 111 },
{ name: 'Employees', clients: 98 }];

const CA_OCC_AUM = { cats: ['Business\nOwners', 'Executives', 'Union/Gov', 'Employees'], aum: [6.8, 4.2, 2.4, 1.6], assets: [3.4, 2.1, 1.2, 0.8] };
const CA_TIERS = [
{ label: '< $250K', count: 68, aumLabel: '$12M', aum: 12, color: 'rgb(56,189,248)' },
{ label: '$250K - $500K', count: 84, aumLabel: '$32M', aum: 32, color: 'rgb(96,165,250)' },
{ label: '$1M - $3M', count: 76, aumLabel: '$124M', aum: 124, color: 'rgb(16,185,129)' },
{ label: '$3M - $5M', count: 28, aumLabel: '$98M', aum: 98, color: 'rgb(139,92,246)' },
{ label: '$5M+', count: 14, aumLabel: '$188M', aum: 188, color: 'rgb(234,88,12)' }];

const CA_SERVICES = [
{ name: 'Investment', clients: 358, pct: 45, color: 'rgb(16,185,129)' },
{ name: 'Financial Planning', clients: 286, pct: 20, color: 'rgb(56,189,248)' },
{ name: 'Tax Services', clients: 185, pct: 20, color: 'rgb(139,92,246)' },
{ name: 'Estate', clients: 142, pct: 15, color: 'rgb(234,179,8)' }];


/* ---- Client Analysis components --------------------------------------- */
function MPClientTable({ title, sub, rows, cols }) {
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>{title}</div><TileInfo title={title} /></div>
        <div style={MP_SUB}>{sub}</div>
      </div>
      <div style={{ padding: '10px 18px 14px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 80px',
          fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
          color: 'rgb(163,163,163)', textTransform: 'uppercase',
          padding: '8px 10px', borderBottom: '1px solid rgba(75,85,99,0.45)'
        }}>
          <span>{cols[0]}</span>
          <span style={{ textAlign: 'right' }}>{cols[1]}</span>
        </div>
        {rows.map((r, i) =>
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '1fr 80px', alignItems: 'center',
          padding: '10px', borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(75,85,99,0.25)',
          fontFamily: 'Inter', fontSize: 12.5
        }}>
            <span style={{ color: 'rgb(209,213,219)' }}>{r[0]}</span>
            <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r[1]}</span>
          </div>
        )}
      </div>
      <MPExportFooter />
    </div>);

}

function MPStackedBarChart({ title, data, color, colorLight, height = 220 }) {
  const opts = React.useMemo(() => ({
    chart: { type: 'column', height, spacing: [16, 4, 8, 4] },
    xAxis: { categories: data.cats, labels: { style: { color: 'rgb(163,163,163)', fontSize: '11px' } } },
    yAxis: { labels: { formatter: function () {return '$' + this.value + 'M';} }, tickAmount: 4 },
    legend: { enabled: true, align: 'right', verticalAlign: 'top', floating: false, margin: 14, padding: 0, symbolRadius: 3, itemStyle: { color: 'rgb(229,231,235)', fontWeight: '500', fontSize: '11.5px' } },
    tooltip: { shared: true },
    plotOptions: { column: { stacking: 'normal', borderRadius: 4, pointPadding: 0.08, groupPadding: 0.18, maxPointWidth: 42 } },
    series: [
    { name: 'Assets', data: data.assets, color: colorLight },
    { name: 'AUM', data: data.aum, color: color }]

  }), [data, color, colorLight, height]);
  return (
    <div style={MP_CARD}>
      <div style={MP_HEAD}><div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>{title}</div><TileInfo title={title} /></div></div>
      <div style={{ padding: '0 12px 12px', flex: 1 }}>
        <HC options={opts} style={{ height }} />
      </div>
    </div>);

}

function MPAgeDistribution() {
  const data = CA_AGE_DIST.map((d) => ({ y: d.count, name: d.bucket, pct: d.pct }));
  const opts = React.useMemo(() => ({
    chart: { type: 'column', height: 260, spacing: [24, 8, 8, 8] },
    xAxis: { categories: CA_AGE_DIST.map((d) => d.bucket), labels: { style: { color: 'rgb(229,231,235)', fontSize: '11.5px', fontWeight: 500 } } },
    yAxis: { tickAmount: 4, labels: { style: { color: 'rgb(163,163,163)', fontSize: '10.5px' } } },
    legend: { enabled: false },
    tooltip: { pointFormat: '<b>{point.y}</b> clients ({point.pct})' },
    plotOptions: { column: {
        borderRadius: 4, borderWidth: 1.5, pointPadding: 0.08, groupPadding: 0.2, maxPointWidth: 70,
        dataLabels: { enabled: true, formatter: function () {return this.point.y + ' (' + this.point.pct + ')';},
          style: { color: 'rgb(196,181,253)', fontWeight: 700, fontSize: '11.5px', textOutline: 'none', fontStyle: 'italic' } }
      } },
    series: [{ name: 'Clients', data, color: 'rgba(139,92,246,0.45)', borderColor: 'rgb(139,92,246)', borderWidth: 1.5 }]
  }), []);
  return (
    <div style={MP_CARD}>
      <div style={MP_HEAD}><div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>Client Age Distribution</div><TileInfo title="Client Age Distribution" /></div></div>
      <div style={{ padding: '0 8px', flex: 1 }}>
        <HC options={opts} style={{ height: 260 }} />
      </div>
      {/* Retirement bands */}
      <div style={{ padding: '8px 20px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgb(209,213,219)' }}>Pre-Retirement (Under 60)</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 11.5, color: 'rgb(209,213,219)' }}>42%</span>
          </div>
          <div style={{ height: 4, borderRadius: 9999, background: 'rgba(139,92,246,0.2)', overflow: 'hidden' }}>
            <div style={{ width: '42%', height: '100%', background: 'rgb(139,92,246)' }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'rgb(209,213,219)' }}>Retirement Phase (60+)</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 11.5, color: 'rgb(209,213,219)' }}>58%</span>
          </div>
          <div style={{ height: 4, borderRadius: 9999, background: 'rgba(139,92,246,0.2)', overflow: 'hidden' }}>
            <div style={{ width: '58%', height: '100%', background: 'rgb(196,181,253)' }} />
          </div>
        </div>
      </div>
      <MPExportFooter />
    </div>);

}

function MPClientOccupation() {
  const opts = React.useMemo(() => ({
    chart: { type: 'column', height: 220, spacing: [16, 4, 8, 4] },
    xAxis: { categories: CA_OCC_AUM.cats, labels: { style: { color: 'rgb(163,163,163)', fontSize: '10.5px' } } },
    yAxis: { labels: { formatter: function () {return '$' + this.value + 'M';} }, tickAmount: 4 },
    legend: { enabled: true, align: 'right', verticalAlign: 'top', floating: false, margin: 14, padding: 0, symbolRadius: 3, itemStyle: { color: 'rgb(229,231,235)', fontWeight: '500', fontSize: '11.5px' } },
    plotOptions: { column: { stacking: 'normal', borderRadius: 4, pointPadding: 0.08, groupPadding: 0.2, maxPointWidth: 42 } },
    tooltip: { shared: true },
    series: [
    { name: 'Assets', data: CA_OCC_AUM.assets, color: 'rgba(252,165,135,0.45)', borderColor: 'rgb(252,165,135)', borderWidth: 1.5 },
    { name: 'AUM',    data: CA_OCC_AUM.aum,    color: 'rgba(234,88,12,0.45)',   borderColor: 'rgb(234,88,12)',   borderWidth: 1.5 }]

  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,260px) 1fr', alignItems: 'stretch', gap: 0, flex: 1 }}>
        <div style={{ padding: '4px 18px 8px', borderRight: '1px solid rgba(75,85,99,0.3)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 6px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>Client Occupation</div><TileInfo title="Client Occupation" /></div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 60px',
            fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
            color: 'rgb(163,163,163)', textTransform: 'uppercase',
            padding: '6px 6px', borderBottom: '1px solid rgba(75,85,99,0.45)'
          }}>
            <span>Occupation</span>
            <span style={{ textAlign: 'right' }}>Clients</span>
          </div>
          {CA_OCCUPATION.map((r, i) =>
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 60px', alignItems: 'center',
            padding: '10px 6px', borderBottom: i === CA_OCCUPATION.length - 1 ? 'none' : '1px solid rgba(75,85,99,0.25)',
            fontFamily: 'Inter', fontSize: 12.5
          }}>
              <span style={{ color: 'rgb(209,213,219)' }}>{r.name}</span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r.clients}</span>
            </div>
          )}
        </div>
        <div style={{ padding: '0 8px 8px' }}>
          <div style={{ ...MP_TITLE, fontSize: 12.5, padding: '14px 12px 4px', color: 'rgb(209,213,219)' }}>AUM vs Client Assets</div>
          <HC options={opts} style={{ height: 220 }} />
        </div>
      </div>
      <MPExportFooter />
    </div>);

}

function MPAumTier() {
  // Two stacked horizontal bars per row: client count + AUM amount. Each uses a tone color.
  const max = Math.max(...CA_TIERS.map((t) => t.aum));
  const maxCount = Math.max(...CA_TIERS.map((t) => t.count));
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>AUM Tier Distribution</div><TileInfo title="AUM Tier Distribution" /></div>
        <div style={MP_SUB}>Client count and AUM by asset tier</div>
      </div>
      <div style={{ padding: '6px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CA_TIERS.map((t, i) => {
          const fill = t.color.replace(/^rgb\(/, 'rgba(').replace(/\)$/, ',0.45)');
          return (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '100px 1fr 1fr', alignItems: 'center', gap: 12
        }}>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgb(209,213,219)' }}>{t.label}</div>
            {/* Client count bar */}
            <div style={{ position: 'relative', height: 26, background: 'rgba(255,255,255,0.03)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${t.count / maxCount * 100}%`,
              background: fill,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter', fontWeight: 700, fontSize: 11.5, color: 'rgb(249,250,251)'
            }}>{t.count}</div>
            </div>
            {/* AUM bar */}
            <div style={{ position: 'relative', height: 26, background: 'rgba(255,255,255,0.03)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${t.aum / max * 100}%`,
              background: fill,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter', fontWeight: 700, fontSize: 11.5, color: 'rgb(249,250,251)'
            }}>{t.aumLabel}</div>
            </div>
          </div>
          );
        })}
      </div>
      <MPExportFooter />
    </div>);

}

function MPServicePenetration() {
  const opts = React.useMemo(() => ({
    chart: { type: 'pie', height: 230, spacing: [8, 4, 8, 4] },
    tooltip: { pointFormat: '<b>{point.y}</b> clients ({point.percentage:.0f}%)' },
    plotOptions: { pie: { innerSize: '62%', borderWidth: 1.5, borderRadius: 0, dataLabels: { enabled: false }, states: { hover: { brightness: 0.08, halo: { size: 6, opacity: 0.2 } } } } },
    series: [{ name: 'Clients', data: CA_SERVICES.map((s) => ({ name: s.name, y: s.clients, color: s.color.replace('rgb(', 'rgba(').replace(')', ',0.55)'), borderColor: s.color })) }]
  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>Service Penetration</div><TileInfo title="Service Penetration" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', alignItems: 'center', gap: 8, flex: 1 }}>
        <div style={{ padding: '0 0 0 12px' }}>
          <HC options={opts} style={{ height: 230 }} />
        </div>
        <div style={{ padding: '0 18px 0 8px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 90px 60px',
            fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
            color: 'rgb(163,163,163)', textTransform: 'uppercase',
            padding: '6px 8px', borderBottom: '1px solid rgba(75,85,99,0.45)'
          }}>
            <span>Services</span>
            <span style={{ textAlign: 'right' }}># of Clients</span>
            <span style={{ textAlign: 'right' }}>%</span>
          </div>
          {CA_SERVICES.map((s, i) =>
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 90px 60px', alignItems: 'center',
            padding: '10px 8px', borderBottom: i === CA_SERVICES.length - 1 ? 'none' : '1px solid rgba(75,85,99,0.25)',
            fontFamily: 'Inter', fontSize: 12.5
          }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgb(229,231,235)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: s.color }} />
                {s.name}
              </span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{s.clients}</span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'rgb(163,163,163)' }}>{s.pct}%</span>
            </div>
          )}
        </div>
      </div>
      <MPExportFooter />
    </div>);

}

/* Combo: table on the left + stacked AUM/Assets chart on the right */
function MPTableChartCombo({ title, sub, cols, rows, chartData, color, colorLight, assetsColor }) {
  // Resolve a sibling 'lighter' hue for the Assets series. If the caller passed
  // a same-hue translucent color (the old API), fall back to the main color so
  // both segments are clearly bordered. Prefer the new `assetsColor` prop.
  const aux = assetsColor || color;
  const fade = (c) => c.replace(/^rgb\(/, 'rgba(').replace(/\)$/, ',0.45)');
  const opts = React.useMemo(() => ({
    chart: { type: 'column', height: 220, spacing: [16, 4, 8, 4] },
    xAxis: { categories: chartData.cats, labels: { style: { color: 'rgb(163,163,163)', fontSize: '10.5px' } } },
    yAxis: { labels: { formatter: function () {return '$' + this.value + 'M';} }, tickAmount: 4 },
    legend: { enabled: true, align: 'right', verticalAlign: 'top', floating: false, margin: 14, padding: 0, symbolRadius: 3, itemStyle: { color: 'rgb(229,231,235)', fontWeight: '500', fontSize: '11.5px' } },
    plotOptions: { column: { stacking: 'normal', borderRadius: 4, pointPadding: 0.08, groupPadding: 0.2, maxPointWidth: 42 } },
    tooltip: { shared: true },
    series: [
    { name: 'Assets', data: chartData.assets, color: fade(aux),   borderColor: aux,   borderWidth: 1.5 },
    { name: 'AUM',    data: chartData.aum,    color: fade(color), borderColor: color, borderWidth: 1.5 }]

  }), [chartData, color, aux]);
  return (
    <div style={MP_CARD}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,260px) 1fr', alignItems: 'stretch', gap: 0, flex: 1 }}>
        <div style={{ padding: '4px 18px 8px', borderRight: '1px solid rgba(75,85,99,0.3)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 6px 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><div style={MP_TITLE}>{title}</div><TileInfo title={title} /></div>
            {sub && <div style={MP_SUB}>{sub}</div>}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 60px',
            fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
            color: 'rgb(163,163,163)', textTransform: 'uppercase',
            padding: '6px 6px', borderBottom: '1px solid rgba(75,85,99,0.45)'
          }}>
            <span>{cols[0]}</span>
            <span style={{ textAlign: 'right' }}>{cols[1]}</span>
          </div>
          {rows.map((r, i) =>
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 60px', alignItems: 'center',
            padding: '10px 6px', borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(75,85,99,0.25)',
            fontFamily: 'Inter', fontSize: 12.5
          }}>
              <span style={{ color: 'rgb(209,213,219)' }}>{r[0]}</span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r[1]}</span>
            </div>
          )}
        </div>
        <div style={{ padding: '0 8px 8px' }}>
          <div style={{ ...MP_TITLE, fontSize: 12.5, padding: '14px 12px 4px', color: 'rgb(209,213,219)' }}>AUM vs Client Assets</div>
          <HC options={opts} style={{ height: 220 }} />
        </div>
      </div>
      <MPExportFooter />
    </div>);

}

/* ---- Client Analysis tab ---------------------------------------------- */
function MPClientAnalysisTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
      {/* Row 1: Client Age combo + Age Distribution */}
      <div style={{ gridColumn: 'span 6' }}>
        <MPTableChartCombo
          title="Client Age"
          sub="AUM vs Client Assets by age bracket"
          cols={['Age', 'Clients']}
          rows={CA_AGE_ROWS.map((r) => [r.age, r.clients])}
          chartData={CA_AGE_AUM}
          color="rgb(56,130,246)"
          assetsColor="rgb(147,197,253)" />
        
      </div>
      <div style={{ gridColumn: 'span 6' }}>
        <MPAgeDistribution />
      </div>

      {/* Row 2: Open Date combo + Occupation combo */}
      <div style={{ gridColumn: 'span 6' }}>
        <MPTableChartCombo
          title="Open Date"
          sub="Client tenure by years with firm"
          cols={['Years', 'Clients']}
          rows={CA_OPEN_ROWS.map((r) => [r.years, r.clients])}
          chartData={CA_OPEN_AUM}
          color="rgb(16,185,129)"
          assetsColor="rgb(110,231,183)" />
        
      </div>
      <div style={{ gridColumn: 'span 6' }}>
        <MPClientOccupation />
      </div>

      {/* Row 3: AUM Tier + Service Penetration */}
      <div style={{ gridColumn: 'span 6' }}>
        <MPAumTier />
      </div>
      <div style={{ gridColumn: 'span 6' }}>
        <MPServicePenetration />
      </div>
    </div>);

}

/* ---- Shell ------------------------------------------------------------- */
function MyPractice({ initialTab = 'clients', onTabChange }) {
  const [tab, setTab] = React.useState(initialTab);
  React.useEffect(() => { setTab(initialTab); }, [initialTab]);
  const changeTab = (id) => { setTab(id); if (onTabChange) onTabChange(id); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <MPTabs value={tab} onChange={changeTab} />
      <div style={{ padding: '18px 28px 48px' }}>
        {tab === 'clients' && <MPClientAnalysisTab />}
        {tab === 'cashflow' && <MPCashFlowTab />}
        {tab === 'assets' && <MPAssetsTab />}
      </div>
    </div>);

}

/* Expose shared helpers to other MyPractice files -------------------------- */
window.MP_CARD = MP_CARD;
window.MP_HEAD = MP_HEAD;
window.MP_TITLE = MP_TITLE;
window.MP_SUB = MP_SUB;
window.MP_LABEL = MP_LABEL;
window.MP_VALUE = MP_VALUE;
window.MP_FOOT = MP_FOOT;
window.MPExportFooter = MPExportFooter;
window.MPKpi = MPKpi;