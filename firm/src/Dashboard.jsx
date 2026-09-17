/* Dashboard page — Total AUM / Revenue / Practice Valuation + 6 tiles */

function DashboardPage() {
  const totalAssets = React.useMemo(() => ({
    chart: { type: 'area', height: 200, spacing: [8,4,4,4] },
    xAxis: { categories: ['Aug','Sep','Oct','Nov','Today'], lineWidth: 0, tickWidth: 0 },
    yAxis: { min: 500, max: 800, tickAmount: 4, labels: { formatter: function () { return this.value + 'M'; } } },
    plotOptions: { area: { fillOpacity: 0.3, lineWidth: 2, marker: { enabled: true, radius: 3, fillColor: 'rgb(35,89,255)' } } },
    series: [{ name: 'Total Assets', data: [780, 700, 720, 600, 698], color: 'rgb(35,89,255)',
      fillColor: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, 'rgba(35,89,255,0.55)'], [1, 'rgba(35,89,255,0.02)']] } }],
    tooltip: { valuePrefix: '$', valueSuffix: 'M' },
  }), []);

  const inflows = React.useMemo(() => {
    const inflowsD  = [80, 95, 110, 90, 105, 75, 88, 92, 70, 60, 85, 98];
    const outflowsD = [-30,-40,-25,-50,-35,-90,-65,-30,-55,-95,-50,-40];
    const netD = inflowsD.map((v, i) => v + outflowsD[i]);
    return {
      chart: { type: 'column', height: 200, spacing:[8,4,4,4] },
      xAxis: { categories: Array.from({length:12},(_,i)=>i+1), labels:{enabled:false}, lineWidth:0, tickWidth:0 },
      yAxis: { plotLines:[{value:0,color:'rgba(75,85,99,0.5)',width:1,zIndex:5}], labels:{enabled:false}, gridLineWidth:0 },
      plotOptions:{ column:{ stacking:undefined, pointWidth: 14, borderRadius:2, borderWidth:1.5 }},
      legend:{enabled:false},
      series: [
        { name:'Inflows',  data: inflowsD,  color:'rgba(35,89,255,0.45)', borderColor:'rgb(35,89,255)', type:'column' },
        { name:'Outflows', data: outflowsD, color:'rgba(248,113,113,0.45)', borderColor:'rgb(248,113,113)', type:'column' },
        { name:'Net', data: netD, type:'line', color:'rgb(245,200,90)', lineWidth:1.5, marker:{ radius:3, fillColor:'rgb(245,200,90)', lineColor:'rgb(245,200,90)'} }
      ],
    };
  }, []);

  const dailyRedemption = React.useMemo(() => ({
    chart: { type:'spline', height: 56, spacing:[2,0,2,0] },
    xAxis: { visible: false }, yAxis: { visible: false },
    legend: { enabled: false }, tooltip: { enabled: false },
    plotOptions: { spline: { lineWidth: 2, marker: { enabled: false } } },
    series: [{ data: [820, 840, 855, 880, 870, 850, 861], color: 'rgb(35,89,255)' }],
  }), []);

  const dailySales = React.useMemo(() => ({
    chart: { type:'spline', height: 56, spacing:[2,0,2,0] },
    xAxis: { visible: false }, yAxis: { visible: false },
    legend: { enabled: false }, tooltip: { enabled: false },
    plotOptions: { spline: { lineWidth: 2, marker: { enabled: false } } },
    series: [{ data: [3.1, 3.0, 2.95, 2.90, 2.85, 2.8, 2.85], color: 'rgb(248,113,113)' }],
  }), []);

  const heldAway = [
    { label: 'Qualified Ret.', a: 412, h: 286 },
    { label: 'Taxable Inv.',   a: 360, h: 195 },
    { label: 'Cash Equiv.',    a: 220, h: 88 },
    { label: 'Life Insurance', a: 145, h: 70 },
    { label: 'Other',          a: 98,  h: 42 },
  ];
  const maxBar = Math.max(...heldAway.flatMap(d => [d.a, d.h]));

  const goals = [
    { name: 'INVESTMENTS',     val: '$25M',  pct: 75, opps: '99 opportunities', target: '$28M',  color: 'rgb(35,89,255)' },
    { name: 'ANNUITY',         val: '$25M',  pct: 82, opps: '15 opportunities', target: '$28M',  color: 'rgb(245,200,90)' },
    { name: 'LIFE INSURANCE',  val: '$32K',  pct: 45, opps: '14 opportunities', target: '$70K',  color: 'rgb(180,150,235)' },
    { name: 'TRUST & ESTATE',  val: '$750K', pct: 20, opps: '32 opportunities', target: '$1.3M', color: 'rgb(120,160,230)' },
    { name: 'TAX OVERLAY',     val: '$32K',  pct: 45, opps: '74 opportunities', target: '$70K',  color: 'rgb(240,140,120)' },
    { name: 'CREDIT & LENDING',val: '$750K', pct: 30, opps: '90 opportunities', target: '$1.3M', color: 'rgb(248,113,113)' },
  ];

  const advisors = [
    { name: 'Nick James',     firm: 'Alpine Partners', aum: '$79M', color: 'blue' },
    { name: 'Jack Diford',    firm: 'Alpine Partners', aum: '$67M', color: 'amber' },
    { name: 'Sarah Berry',    firm: 'Alpine Partners', aum: '$56M', color: 'green' },
    { name: 'Rob Kelly',      firm: 'Alpine Partners', aum: '$43M', color: 'purple' },
    { name: 'Robert Sullivan',firm: 'Alpine Partners', aum: '$43M', color: 'coral' },
  ];

  const managers = [
    { name: 'Vanguard',     pct: 56.1, val: '$300.0M', color: 'rgb(35,89,255)' },
    { name: 'PIMCO',        pct: 12.5, val: '$57.0M',  color: 'rgb(120,160,230)' },
    { name: 'BlackRock',    pct: 7,    val: '$32.0M',  color: 'rgb(180,150,235)' },
    { name: 'Blackstone',   pct: 6.2,  val: '$28.0M',  color: 'rgb(245,200,90)' },
    { name: 'Goldman Sachs',pct: 4.2,  val: '$19.0M',  color: 'rgb(240,140,120)' },
    { name: 'Other',        pct: 4,    val: '$19.0M',  color: 'rgb(160,170,185)' },
  ];

  const reports = [
    { name: 'Assets by Product', date: 'Aug 20 - Today' },
    { name: 'Stalled Proposals', date: 'Aug 20 - Today' },
    { name: 'Net Flows by Territory', date: 'Aug 20 - Today' },
    { name: 'Client Engagement Metrics', date: 'Aug 20 - Today' },
  ];

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatTile label="TOTAL AUM"          value="$734M" sub={<span style={{color:'rgb(168,185,241)'}}>▲ 4.2% vs last quarter</span>} />
        <StatTile label="ANNUAL REVENUE"     value="$2.5M" sub={<span style={{color:'rgb(168,185,241)'}}>▲ 1.8% vs last quarter</span>} />
        <StatTile label="PRACTICE VALUATION" value="$12.5M" sub="~5x recurring revenue" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        {/* Total Assets */}
        <Card style={{ minHeight: 268 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color:'rgb(209,213,219)', fontWeight:600 }}>Total Assets</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>$698M</div>
            </div>
            <Badge color="green">▲ 12%</Badge>
          </div>
          <div style={{ marginTop: 8, height: 200 }}><HC options={totalAssets} /></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)', marginTop: 4 }}>
            <span>As of Today</span>
            <span style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>

        {/* Total Inflows */}
        <Card style={{ minHeight: 268 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color:'rgb(209,213,219)', fontWeight:600 }}>Total Inflows</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>$124.3M</div>
              <div style={{ display:'flex', gap: 12, fontSize: 11, marginTop: 6 }}>
                <span style={{display:'flex',alignItems:'center',gap:4,color:'rgb(156,163,175)'}}><span style={{width:8,height:8,borderRadius:9999,background:'rgb(35,89,255)'}}/>Inflows</span>
                <span style={{display:'flex',alignItems:'center',gap:4,color:'rgb(156,163,175)'}}><span style={{width:8,height:8,borderRadius:9999,background:'rgb(248,113,113)'}}/>Outflows</span>
                <span style={{display:'flex',alignItems:'center',gap:4,color:'rgb(156,163,175)'}}><span style={{width:8,height:8,borderRadius:9999,background:'rgb(245,200,90)'}}/>Net</span>
              </div>
            </div>
            <Badge color="green">▲ 12%</Badge>
          </div>
          <div style={{ marginTop: 8, height: 200 }}><HC options={inflows} /></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)', marginTop: 4 }}>
            <span>As of Today</span>
            <span style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>

        {/* AUM vs Held Away */}
        <Card style={{ minHeight: 268 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color:'rgb(209,213,219)', fontWeight:600 }}>AUM vs. Assets Held Away</div>
            <div style={{ display:'flex', gap: 12, fontSize: 11 }}>
              <span style={{display:'flex',alignItems:'center',gap:4,color:'rgb(156,163,175)'}}><span style={{width:8,height:8,borderRadius:9999,background:'rgb(35,89,255)'}}/>AUM <span className="num" style={{color:'rgb(229,231,235)'}}>$412M</span></span>
              <span style={{display:'flex',alignItems:'center',gap:4,color:'rgb(156,163,175)'}}><span style={{width:8,height:8,borderRadius:9999,background:'rgb(75,85,99)'}}/>Held Away <span className="num" style={{color:'rgb(229,231,235)'}}>$286M</span></span>
            </div>
          </div>
          {heldAway.map(d => (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, color: 'rgb(156,163,175)', marginBottom: 4 }}>{d.label}</div>
              <div style={{ position:'relative', height: 12, background:'rgba(75,85,99,0.4)', borderRadius: 4, overflow:'hidden' }}>
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width: `${d.a/maxBar*100}%`, background:'rgb(35,89,255)', borderRadius:'4px 0 0 4px' }} />
                <div style={{ position:'absolute', left:`${d.a/maxBar*100}%`, top:0, bottom:0, width:`${d.h/maxBar*100}%`, background:'rgb(75,85,99)' }} />
              </div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)' }}>
            <span>As of Today</span>
            <span style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.6fr', gap: 16, marginBottom: 16 }}>
        {/* Company Goals */}
        <Card>
          <CardTitle title="Company Goals" right={<button style={{ background:'transparent', border:'none', color:'rgb(156,163,175)', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><Icon name="edit" size={11}/>Customize</button>} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            {goals.map(g => (
              <div key={g.name} style={{ padding: 12, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)', background:'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color:'rgb(156,163,175)', letterSpacing:'0.06em' }}>{g.name}</div>
                <div style={{ fontSize: 10, color:'rgb(107,114,128)', marginTop: 1 }}>{g.opps}</div>
                <div className="num" style={{ fontSize: 18, fontWeight: 700, color:'rgb(249,250,251)', marginTop: 6 }}>{g.val} <span style={{ fontSize: 11, color: g.color }}>{g.pct}%</span></div>
                <div style={{ height: 4, background:'rgba(75,85,99,0.4)', borderRadius: 2, overflow:'hidden', marginTop: 6 }}>
                  <div style={{ width: `${g.pct}%`, height:'100%', background: g.color }} />
                </div>
                <div style={{ fontSize: 10, color:'rgb(156,163,175)', marginTop: 4 }}>Target: {g.target}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)', marginTop: 14 }}>
            <span>As of Today</span>
            <span style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>

        {/* Top Advisors */}
        <Card>
          <CardTitle title="Top Advisors" right={<span style={{ fontSize: 12, color:'rgb(156,163,175)', display:'flex', alignItems:'center', gap:4 }}><Icon name="users" size={12}/>Advisors</span>} />
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {advisors.map(a => {
              const isSarah = a.name === 'Sarah Berry';
              return (
              <div key={a.name}
                   onClick={isSarah ? () => window.dispatchEvent(new CustomEvent('firm:openSarah')) : undefined}
                   style={{ display:'flex', alignItems:'center', gap: 10, cursor: isSarah ? 'pointer' : 'default', padding: isSarah ? '4px 6px' : 0, margin: isSarah ? '-4px -6px' : 0, borderRadius: 8, transition: 'background 160ms ease' }}
                   onMouseEnter={isSarah ? (e) => e.currentTarget.style.background = 'rgba(35,89,255,0.08)' : undefined}
                   onMouseLeave={isSarah ? (e) => e.currentTarget.style.background = 'transparent' : undefined}>
                <Avatar initials={a.name.split(' ').map(s=>s[0]).join('')} size={32} color={a.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color:'rgb(229,231,235)' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color:'rgb(107,114,128)' }}>{a.firm}</div>
                </div>
                <div className="num" style={{ fontSize: 13, fontWeight: 600, color:'rgb(229,231,235)' }}>{a.aum}</div>
              </div>
            );})}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)', marginTop: 14 }}>
            <span>As of Today</span>
            <span style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>

        {/* Asset Manager Concentration */}
        <Card>
          <CardTitle title="Asset Manager Concentration" />
          {managers.map(m => (
            <div key={m.name} style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 80, fontSize: 12, color:'rgb(209,213,219)' }}>{m.name}</div>
              <div style={{ flex: 1, height: 16, background:'rgba(75,85,99,0.3)', borderRadius: 4, overflow:'hidden' }}>
                <div style={{ width: `${m.pct/56.1*100}%`, height:'100%', background: m.color, borderRadius: 4 }} />
              </div>
              <div className="num" style={{ width: 56, textAlign: 'right', fontSize: 11.5, color: m.color, fontWeight: 600 }}>{m.val}</div>
              <div className="num" style={{ width: 36, textAlign: 'right', fontSize: 11, color:'rgb(156,163,175)' }}>{m.pct}%</div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)', marginTop: 14 }}>
            <span>As of Today</span>
            <span onClick={() => window.dispatchEvent(new CustomEvent('firm:navigate', { detail: { page: 'manager-concentration' } }))} style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
        {/* Top Advisor Reports */}
        <Card>
          <CardTitle title="Top Advisors Reports" />
          <div>
            {reports.map(r => (
              <div key={r.name} className="row-hover" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(75,85,99,0.3)' }}>
                <div>
                  <div style={{ fontSize: 13, color:'rgb(229,231,235)' }}>{r.name}</div>
                  <div style={{ fontSize: 11, color:'rgb(107,114,128)', marginTop: 2 }}>{r.date}</div>
                </div>
                <button style={{ background:'transparent', border:'none', color:'rgb(168,185,241)', cursor:'pointer' }}><Icon name="download" size={14}/></button>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardTitle title="Activity Summary" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ padding: 14, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)' }}>
              <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>Daily Redemption</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>$861.74K</div>
              <div style={{ fontSize: 11, color:'rgb(168,185,241)', marginTop: 2 }}>▲ 2.84%</div>
              <div style={{ marginTop: 6, height: 56 }}><HC options={dailyRedemption} /></div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)' }}>
              <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>Daily Sales</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>$2.85M</div>
              <div style={{ fontSize: 11, color:'rgb(248,113,113)', marginTop: 2 }}>▼ 0.82%</div>
              <div style={{ marginTop: 6, height: 56 }}><HC options={dailySales} /></div>
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 10, border: '1px solid rgba(168,185,241,0.3)', background: 'rgba(168,185,241,0.06)' }}>
            <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>Open Pipeline</div>
            <div className="num" style={{ fontSize: 28, fontWeight: 800, color: 'rgb(168,185,241)', marginTop: 4 }}>$42.8M</div>
            <div style={{ fontSize: 11, color:'rgb(156,163,175)', marginTop: 2 }}>128 open processes</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgb(156,163,175)', marginTop: 12 }}>
            <span>As of Today</span>
            <span style={{ color:'rgb(168,185,241)', cursor:'pointer' }}>See more <Icon name="chevron-right" size={10} /></span>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.DashboardPage = DashboardPage;
