/* Client List + Client Analysis */

const CLIENTS = [
  { initial: 'DV', name: 'David Young',  age: '60', range: '$10M+',     aum: '$31.2M', revenue: '$15K', ltv: '$15K', heldAway: '$830K', advisor: 'Sarah Berry', occ: 'Business Owner', services: ['Investment','Estate'], color: 'green' },
  { initial: 'E',  name: 'Edwards',      age: '58', range: '$10M+',     aum: '$30.9M', revenue: '$5K',  ltv: '$5K',  heldAway: '$910K', advisor: 'Angel Schreiber', occ: 'Executive', services: ['Investment','Financial Planning'], color: 'gray' },
  { initial: 'H',  name: 'Hawkins',      age: '62', range: '$10M+',     aum: '$29.5M', revenue: '$8K',  ltv: '$8K',  heldAway: '$1.0M', advisor: 'James Mongo', occ: 'Business Owner', services: ['Investment','Tax Services'], color: 'amber' },
  { initial: 'S',  name: 'Smith',        age: '53', range: '$10M+',     aum: '$29.0M', revenue: '$12K', ltv: '$12K', heldAway: '$2.2M', advisor: 'Martin Bergson', occ: 'Executive', services: ['Investment','Financial Planning','Estate'], color: 'blue' },
  { initial: 'W',  name: 'Watson',       age: '71', range: '$10M+',     aum: '$27.3M', revenue: '$8K',  ltv: '$12K', heldAway: '$220K', advisor: 'Cristofor Daniwarit', occ: 'Business Owner', services: ['Investment'], color: 'gray' },
  { initial: 'J',  name: 'Jones',        age: '63', range: '$3M-$5M',   aum: '$18.2M', revenue: '$10K', ltv: '$12K', heldAway: '$471K', advisor: 'Pailyn Franci', occ: 'Union/Gov', services: ['Investment','Financial Planning'], color: 'purple' },
  { initial: 'L',  name: 'Lang',         age: '49', range: '$3M-$5M',   aum: '$16.5M', revenue: '$8K',  ltv: '$12K', heldAway: '$671K', advisor: 'Giana Ekstrom', occ: 'Executive', services: ['Investment','Tax Services'], color: 'coral' },
  { initial: 'C',  name: 'Conell',       age: '52', range: '$1M-$3M',   aum: '$10.3M', revenue: '$8K',  ltv: '$12K', heldAway: '$457K', advisor: 'Marcus Toriff', occ: 'Employee', services: ['Investment'], color: 'gray' },
  { initial: 'B',  name: 'Benson',       age: '58', range: '$1M-$3M',   aum: '$5.7M',  revenue: '$12K', ltv: '$12K', heldAway: '$20K',  advisor: 'Erin Curtis', occ: 'Business Owner', services: ['Financial Planning'], color: 'amber' },
  { initial: 'S',  name: 'Simmons',      age: '44', range: '$1M-$3M',   aum: '$4.8M',  revenue: '$8K',  ltv: '$12K', heldAway: '$15K',  advisor: 'Tiana Baptiste', occ: 'Employee', services: ['Investment','Financial Planning'], color: 'teal' },
  { initial: 'M',  name: 'Morrison',     age: '61', range: '$1M-$3M',   aum: '$3.2M',  revenue: '$6K',  ltv: '$12K', heldAway: '$450K', advisor: 'Sarah Berry', occ: 'Business Owner', services: ['Estate','Tax Services'], color: 'gray' },
  { initial: 'C',  name: 'Clarke',       age: '54', range: '$1M-$3M',   aum: '$2.1M',  revenue: '$4K',  ltv: '$12K', heldAway: '—',     advisor: 'Angel Schreiber', occ: 'Executive', services: ['Investment'], color: 'gray' },
  { initial: 'R',  name: 'Rivera',       age: '38', range: '$250K-$500K', aum: '$890K', revenue: '$2K',  ltv: '$12K', heldAway: '$200K', advisor: 'James Mongo', occ: 'Employee', services: ['Financial Planning'], color: 'gray' },
  { initial: 'P',  name: 'Patel',        age: '41', range: '$250K-$500K', aum: '$420K', revenue: '$840', ltv: '$12K', heldAway: '$85K',  advisor: 'Martin Bergson', occ: 'Executive', services: ['Investment'], color: 'amber' },
];

const SERVICE_COLOR = {
  'Investment': 'green',
  'Estate': 'amber',
  'Financial Planning': 'purple',
  'Tax Services': 'purple',
};

const OCC_COLOR = {
  'Business Owner': 'amber',
  'Executive': 'blue',
  'Union/Gov': 'purple',
  'Employee': 'gray',
};

const ADVISOR_DASHBOARD_URL = 'https://claude.ai/design/p/019dd9df-a96b-72a7-a818-1e05047939be?file=Advisor+Dashboard.html';

function navigateToDavidYoungFromList() {
  try { localStorage.setItem('firm.cd.from', 'clients'); } catch (e) {}
  window.dispatchEvent(new CustomEvent('firm:navigate', { detail: { page: 'client-detail' } }));
}

function ClientListPage({ tab = 'list' }) {
  const [sort, setSort] = React.useState({ key: 'aum', dir: 'desc' });

  const sorted = React.useMemo(() => {
    const arr = [...CLIENTS];
    const k = sort.key;
    const num = (s) => parseFloat(String(s).replace(/[^0-9.\-]/g, '')) * (String(s).includes('M') ? 1e6 : String(s).includes('K') ? 1e3 : 1);
    arr.sort((a, b) => {
      let va = a[k], vb = b[k];
      if (['aum','revenue','ltv','heldAway'].includes(k)) { va = num(va); vb = num(vb); }
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sort]);

  /* In-page tabs replaced by sidebar sub-nav (Clients → Client List / Client Analytics).
     `tab` is supplied by App from PAGE_META based on the active route. */
  return (
    <div className="page-fade">
      <div style={{ padding: 24 }}>
        {tab === 'list' ? <ClientListTable sort={sort} setSort={setSort} rows={sorted} /> : <ClientAnalysis />}
      </div>
    </div>
  );
}

function ClientListTable({ sort, setSort, rows }) {
  return (
    <Card style={{ padding: 0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid rgba(75,85,99,0.3)' }}>
        <div style={{ fontSize: 12, color:'rgb(156,163,175)' }}>Showing <span style={{ color:'rgb(229,231,235)', fontWeight: 600 }}>{rows.length}</span> Households</div>
        <div style={{ display:'flex', gap: 8 }}>
          <button style={tbBtn()}><Icon name="filter" size={11}/>Filter</button>
          <button style={tbBtn()}><Icon name="columns" size={11}/>Columns</button>
          <button style={tbBtn()}><Icon name="download" size={11}/>Export</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <SortHeader label="CLIENT" sortKey="name" sort={sort} setSort={setSort} />
              <SortHeader label="AUM" sortKey="aum" sort={sort} setSort={setSort} align="right" />
              <SortHeader label="REVENUE" sortKey="revenue" sort={sort} setSort={setSort} align="right" />
              <SortHeader label="LTV" sortKey="ltv" sort={sort} setSort={setSort} align="right" />
              <SortHeader label="HELD AWAY" sortKey="heldAway" sort={sort} setSort={setSort} align="right" />
              <SortHeader label="ADVISOR" sortKey="advisor" sort={sort} setSort={setSort} />
              <SortHeader label="OCCUPATION" sortKey="occ" sort={sort} setSort={setSort} />
              <SortHeader label="SERVICES" sortKey="services" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => {
              const isDavid = c.name === 'David Young';
              return (
              <tr key={i} className="row-hover"
                onClick={isDavid ? navigateToDavidYoungFromList : undefined}
                style={{ borderBottom: '1px solid rgba(75,85,99,0.2)', cursor: isDavid ? 'pointer' : 'default' }}>
                <td style={td()}>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <Avatar initials={c.initial} size={30} color={c.color} />
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 13, fontWeight: 600, color:'rgb(229,231,235)' }}>
                        <span>{c.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color:'rgb(107,114,128)' }}>Age {c.age} · {c.range}</div>
                    </div>
                  </div>
                </td>
                <td style={td('right','num')}><span style={{ fontWeight: 600 }}>{c.aum}</span></td>
                <td style={td('right','num')}>{c.revenue}</td>
                <td style={td('right','num')}>{c.ltv}</td>
                <td style={td('right','num')}><span style={{ color: c.heldAway.includes('M') || c.heldAway.includes('K') ? 'rgb(245,200,90)' : 'rgb(107,114,128)' }}>{c.heldAway}</span></td>
                <td style={td()}><span style={{ color:'rgb(209,213,219)' }}>{c.advisor}</span></td>
                <td style={td()}><Badge color={OCC_COLOR[c.occ] || 'gray'}>{c.occ}</Badge></td>
                <td style={td()}><div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>{c.services.map(s => <Badge key={s} color={SERVICE_COLOR[s] || 'gray'}>{s}</Badge>)}</div></td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const tbBtn = () => ({
  display:'inline-flex', alignItems:'center', gap: 6, height: 30, padding: '0 12px',
  borderRadius: 8, background:'rgba(17,24,39,0.6)', border:'1px solid rgba(75,85,99,0.5)',
  color:'rgb(229,231,235)', fontSize: 12, fontWeight: 500, cursor:'pointer',
});
const td = (align='left', cls='') => ({ padding: '12px 16px', textAlign: align, fontSize: 12.5, color:'rgb(229,231,235)' });

function ClientAnalysis() {
  const ageBars = React.useMemo(() => ({
    chart: { type: 'column', height: 180, spacing:[8,4,4,4] },
    xAxis: { categories: ['21-34','35-49','50-64','64-84'], lineWidth: 0 },
    yAxis: { min: 0, max: 520, tickAmount: 5, labels: { formatter: function(){ return '$' + this.value + 'M'; } } },
    plotOptions: { column: { stacking: 'normal', pointWidth: 36, borderRadius: 0 } },
    legend: { enabled: false },
    series: [
      { name: 'AUM',    data: [42, 138, 348, 206], color: 'rgba(120,160,230,0.45)', borderColor: 'rgb(120,160,230)', borderWidth: 1.5 },
      { name: 'Assets', data: [22, 64, 128, 72], color: 'rgba(120,160,230,0.18)', borderColor: 'rgba(120,160,230,0.6)', borderWidth: 1.5 }
    ],
  }), []);

  const openDateBars = React.useMemo(() => ({
    chart: { type: 'column', height: 180, spacing:[8,4,4,4] },
    xAxis: { categories: ['0-5','5-10','10-15','20+'], lineWidth: 0 },
    yAxis: { min: 0, max: 420, tickAmount: 4, labels: { formatter: function(){ return '$' + this.value + 'M'; } } },
    plotOptions: { column: { stacking: 'normal', pointWidth: 36, borderRadius: 0 } },
    legend: { enabled: false },
    series: [
      { name: 'AUM',    data: [118, 196, 286, 134], color: 'rgba(35,89,255,0.45)', borderColor: 'rgb(35,89,255)', borderWidth: 1.5 },
      { name: 'Assets', data: [46, 76, 112, 52], color: 'rgba(35,89,255,0.18)', borderColor: 'rgba(35,89,255,0.6)', borderWidth: 1.5 }
    ],
  }), []);

  const ageDistribution = React.useMemo(() => {
    const data = [
      { name:'Under 40', y:108, pct:'6%', color:'rgba(180,150,235,0.45)' },
      { name:'40-49',    y:252, pct:'15%', color:'rgba(180,150,235,0.45)' },
      { name:'50-59',    y:358, pct:'21%', color:'rgba(180,150,235,0.45)' },
      { name:'60-69',    y:574, pct:'33%', color:'rgba(180,150,235,0.45)' },
      { name:'70+',      y:434, pct:'25%', color:'rgba(180,150,235,0.45)' }
    ];
    return {
      chart: { type: 'column', height: 160, spacing:[8,4,4,4] },
      xAxis: { categories: data.map(d => d.name), lineWidth: 0 },
      yAxis: { min: 0, max: 650, tickAmount: 5 },
      plotOptions: { column: { pointWidth: 48, borderRadius: 0, borderColor: 'rgb(180,150,235)', borderWidth: 1.5, dataLabels: {
        enabled: true, format: '{point.y} ({point.pct})',
        style: { color: 'rgb(229,231,235)', fontWeight: '600', fontSize: '10.5px', textOutline: 'none' }
      } } },
      legend: { enabled: false },
      series: [{ name: 'Clients', data, colorByPoint: true }],
    };
  }, []);

  const occupationBars = React.useMemo(() => ({
    chart: { type: 'column', height: 180, spacing:[8,4,4,4] },
    xAxis: { categories: ['Business\nOwners','Executives','Union/Gov','Employees'], lineWidth: 0 },
    yAxis: { min: 0, max: 520, tickAmount: 5, labels: { formatter: function(){ return '$' + this.value + 'M'; } } },
    plotOptions: { column: { stacking: 'normal', pointWidth: 36, borderRadius: 0 } },
    legend: { enabled: false },
    series: [
      { name: 'AUM',    data: [348, 246, 88, 52], color: 'rgba(240,140,120,0.45)', borderColor: 'rgb(240,140,120)', borderWidth: 1.5 },
      { name: 'Assets', data: [140, 98, 36, 22], color: 'rgba(240,140,120,0.18)', borderColor: 'rgba(240,140,120,0.6)', borderWidth: 1.5 }
    ],
  }), []);

  const aumTier = [
    { tier:'< $250K',     clients: 642, aum:'$74M',  pct: 95, total: 50, color:'rgb(120,160,230)' },
    { tier:'$250K - $500K', clients: 486, aum:'$168M', pct: 72, total: 50, color:'rgb(94,140,210)' },
    { tier:'$1M - $3M',   clients: 412, aum:'$214M', pct: 61, total: 75, color:'rgb(168,185,241)' },
    { tier:'$3M - $5M',   clients: 138, aum:'$146M', pct: 20, total: 50, color:'rgb(120,160,230)' },
    { tier:'$5M+',        clients: 48, aum:'$132M', pct: 7, total: 50, color:'rgb(240,140,120)' },
  ];

  const services = [
    { name: 'Investment', n: 1284, pct: '74%', color: 'rgb(168,185,241)' },
    { name: 'Financial Planning', n: 842, pct: '49%', color: 'rgb(120,160,230)' },
    { name: 'Tax Services', n: 588, pct: '34%', color: 'rgb(180,150,235)' },
    { name: 'Estate', n: 396, pct: '23%', color: 'rgb(245,200,90)' },
  ];
  // Donut convention: 45% transparent fill + full-opacity hue as the slice
  // highlight border.
  const serviceDonut = React.useMemo(() => ({
    chart: { type: 'pie', height: 200 },
    plotOptions: { pie: { innerSize: '68%', borderRadius: 0, dataLabels: { enabled: false } } },
    series: [{ data: services.map(s => ({
      name: s.name, y: s.n,
      color: s.color.replace('rgb(', 'rgba(').replace(')', ',0.45)'),
      borderColor: s.color, borderWidth: 1.5,
    })) }],
  }), []);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
      {/* Row 1 */}
      <AnalyticsTile title="Client Age" subtitle="AUM vs Client Assets by age bracket">
        <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap: 16, alignItems:'flex-start' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12 }}>
            <thead><tr style={{ background:'rgba(255,255,255,0.04)' }}><th style={{ ...th(), textAlign:'left' }}>AGE</th><th style={th('right')}>CLIENTS</th></tr></thead>
            <tbody>
              {[['21-34',58],['35-49',214],['50-64',1142],['64-84',312]].map(([a,n]) => (
                <tr key={a}><td style={tdSm()}>{a}</td><td style={tdSm('right','num')}>{n}</td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: -8 }}>
            <div style={{ display:'flex', justifyContent:'flex-end', gap: 12, fontSize: 11, color:'rgb(156,163,175)', marginBottom: 4 }}>
              <span>AUM vs Client Assets</span>
              <span style={{ display:'flex', alignItems:'center', gap: 4 }}><span style={{ width:8,height:8,borderRadius:9999,background:'rgba(120,160,230,0.45)' }}/>Assets</span>
              <span style={{ display:'flex', alignItems:'center', gap: 4 }}><span style={{ width:8,height:8,borderRadius:9999,background:'rgb(120,160,230)' }}/>AUM</span>
            </div>
            <HC options={ageBars} />
          </div>
        </div>
      </AnalyticsTile>

      <AnalyticsTile title="Client Age Distribution">
        <div style={{ height: 160 }}>
          <HC options={ageDistribution} />
        </div>
        <div style={{ display:'flex', gap: 12, marginTop: 12, fontSize: 11, color:'rgb(156,163,175)' }}>
          <div style={{ flex: 1 }}>
            <div>Pre-Retirement (Under 60) <span style={{ color:'rgb(180,150,235)', fontWeight:600 }}>42%</span></div>
            <div style={{ height: 4, background:'rgba(75,85,99,0.4)', borderRadius:2, marginTop: 4, overflow:'hidden' }}><div style={{ width:'42%', height:'100%', background:'rgb(180,150,235)' }}/></div>
          </div>
          <div style={{ flex: 1 }}>
            <div>Retirement Phase (60+) <span style={{ color:'rgb(180,150,235)', fontWeight:600 }}>58%</span></div>
            <div style={{ height: 4, background:'rgba(75,85,99,0.4)', borderRadius:2, marginTop: 4, overflow:'hidden' }}><div style={{ width:'58%', height:'100%', background:'rgb(180,150,235)' }}/></div>
          </div>
        </div>
      </AnalyticsTile>

      {/* Row 2 */}
      <AnalyticsTile title="Open Date" subtitle="Client tenure by years with firm">
        <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap: 16 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12 }}>
            <thead><tr style={{ background:'rgba(255,255,255,0.04)' }}><th style={{...th(), textAlign:'left'}}>YEARS</th><th style={th('right')}>CLIENTS</th></tr></thead>
            <tbody>
              {[['0 - 5',286],['6 - 10',472],['11 - 15',638],['20 +',330]].map(([a,n]) => (
                <tr key={a}><td style={tdSm()}>{a}</td><td style={tdSm('right','num')}>{n}</td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: -8 }}>
            <div style={{ display:'flex', justifyContent:'flex-end', gap: 12, fontSize: 11, color:'rgb(156,163,175)', marginBottom: 4 }}>
              <span>AUM vs Client Assets</span>
              <span style={{ display:'flex', alignItems:'center', gap: 4 }}><span style={{ width:8,height:8,borderRadius:9999,background:'rgba(35,89,255,0.45)' }}/>Assets</span>
              <span style={{ display:'flex', alignItems:'center', gap: 4 }}><span style={{ width:8,height:8,borderRadius:9999,background:'rgb(35,89,255)' }}/>AUM</span>
            </div>
            <HC options={openDateBars} />
          </div>
        </div>
      </AnalyticsTile>

      <AnalyticsTile title="Client Occupation">
        <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap: 16 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12 }}>
            <thead><tr style={{ background:'rgba(255,255,255,0.04)' }}><th style={{...th(), textAlign:'left'}}>OCCUPATION</th><th style={th('right')}>CLIENTS</th></tr></thead>
            <tbody>
              {[['Business Owners',688],['Executives',478],['Union/Gov',298],['Employees',262]].map(([a,n]) => (
                <tr key={a}><td style={tdSm()}>{a}</td><td style={tdSm('right','num')}>{n}</td></tr>
              ))}
            </tbody>
          </table>
          <HC options={occupationBars} />
        </div>
      </AnalyticsTile>

      {/* Row 3 */}
      <AnalyticsTile title="AUM Tier Distribution" subtitle="Client count and AUM by asset tier">
        {aumTier.map(t => (
          <div key={t.tier} style={{ display:'grid', gridTemplateColumns:'90px 1fr 1fr', gap: 8, alignItems:'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color:'rgb(209,213,219)', textAlign:'right' }}>{t.tier}</div>
            <div style={{ height: 22, background:'rgba(75,85,99,0.3)', borderRadius: 4, overflow:'hidden', position:'relative' }}>
              <div style={{ width: `${t.pct}%`, height:'100%', background: t.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 11, fontWeight: 700, color:'rgb(11,21,36)' }}>{t.clients}</div>
            </div>
            <div style={{ height: 22, display:'flex', alignItems:'center' }}>
              <div style={{ background:'rgba(168,185,241,0.7)', height:22, padding: '0 10px', display:'flex', alignItems:'center', borderRadius: 4, fontSize: 11, fontWeight: 700, color:'rgb(11,21,36)' }}>{t.aum}</div>
            </div>
          </div>
        ))}
      </AnalyticsTile>

      <AnalyticsTile title="Service Penetration">
        <div style={{ display:'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
          <HC options={serviceDonut} />
          <table style={{ width:'100%', fontSize: 12 }}>
            <thead><tr style={{ borderBottom:'1px solid rgba(75,85,99,0.3)' }}><th style={{...th(), textAlign:'left'}}>SERVICES</th><th style={th('right')}># OF CLIENTS</th><th style={th('right')}>%</th></tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.name}>
                  <td style={tdSm()}><span style={{ display:'inline-flex', alignItems:'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 9999, background: s.color }}/>{s.name}</span></td>
                  <td style={tdSm('right','num')}>{s.n}</td>
                  <td style={tdSm('right','num')} >{s.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnalyticsTile>
    </div>
  );
}
const th = (align='right') => ({ padding: '8px 10px', textAlign: align, fontSize: 10.5, fontWeight: 600, color:'rgb(156,163,175)', letterSpacing:'0.06em', borderBottom: '1px solid rgba(75,85,99,0.3)' });
const tdSm = (align='left', cls='') => ({ padding: '8px 10px', textAlign: align, fontSize: 12, color: 'rgb(229,231,235)', borderBottom: '1px solid rgba(75,85,99,0.15)' });

/* Tile chrome that mirrors the Advisor Dashboard tiles:
   title (15px) + overflow ellipsis in the header, and an
   "As of Today / See more →" footer with a top divider. */
function AnalyticsTile({ title, subtitle, children, footLabel = 'As of Today' }) {
  return (
    <div className="glass-card" style={{ borderRadius: 14, padding: 0, display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap: 12, padding:'16px 18px 10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color:'rgb(249,250,251)', letterSpacing:'-0.01em' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color:'rgb(156,163,175)', marginTop: 3 }}>{subtitle}</div>}
        </div>
        <button aria-label="More" style={{
          background:'transparent', border:'none', color:'rgb(156,163,175)', cursor:'pointer',
          width: 26, height: 26, borderRadius: 6, display:'inline-flex', alignItems:'center',
          justifyContent:'center', flexShrink: 0,
        }}><i className="fa-solid fa-ellipsis" style={{ fontSize: 14 }} /></button>
      </div>
      <div style={{ flex: 1, padding: '0 18px 8px' }}>{children}</div>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 18px', borderTop:'1px solid rgba(75,85,99,0.55)',
        fontSize: 12, color:'rgb(156,163,175)',
      }}>
        <span>{footLabel}</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap: 4, color:'rgb(168,185,241)', cursor:'pointer', fontWeight: 500 }}>See more <i className="fa-solid fa-chevron-right" style={{ fontSize: 10 }} /></span>
      </div>
    </div>
  );
}

window.ClientListPage = ClientListPage;
