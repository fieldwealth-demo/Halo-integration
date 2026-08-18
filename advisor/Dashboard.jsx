// Dashboard screen — composed from the shadcn primitives.
function Dashboard() {
  const rows = [
    { id:'TASK-8782', title:"You can't compress the program without quantifying the open-source SSD pixel!", status:'In Progress', priority:'Medium', type:'Documentation' },
    { id:'TASK-7878', title:'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!', status:'Backlog', priority:'Medium', type:'Documentation' },
    { id:'TASK-7839', title:'We need to bypass the neural TCP card!', status:'Todo', priority:'High', type:'Bug' },
    { id:'TASK-5562', title:'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!', status:'Backlog', priority:'Medium', type:'Feature' },
    { id:'TASK-8686', title:"I'll parse the wireless SSL protocol, that should driver the API panel!", status:'Canceled', priority:'Medium', type:'Feature' },
  ];

  const statusBadge = (s) => {
    const map = { 'In Progress':'info', 'Backlog':'secondary', 'Todo':'outline', 'Canceled':'danger', 'Done':'success' };
    return <Badge variant={map[s] || 'secondary'}>{s}</Badge>;
  };
  const priorityBadge = (p) => (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: 9999,
        background: p === 'High' ? 'rgb(248,113,113)' : p === 'Medium' ? 'rgb(234,179,8)' : 'rgb(163,163,163)'
      }} />
      {p}
    </span>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 20, padding: 24 }}>
      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ margin:0, fontFamily:'Inter', fontWeight:700, fontSize:28, color:'rgb(249,250,251)' }}>Welcome back</h1>
          <p style={{ margin:'6px 0 0', fontFamily:'Inter', fontSize:14, color:'rgb(163,163,163)' }}>Here's what's happening with your team today.</p>
        </div>
        <div style={{ display:'flex', gap: 10 }}>
          <Button variant="outline" icon="calendar" size="md">Jan 20, 2026 – Feb 20, 2026</Button>
          <Button variant="primary" icon="download">Download</Button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14 }}>
        <StatCard title="Total Revenue" value="$45,231.89" delta="20.1%" icon="dollar-sign" />
        <StatCard title="Subscriptions" value="+2,350" delta="180.1%" icon="users" />
        <StatCard title="Sales" value="+12,234" delta="19%" icon="credit-card" />
        <StatCard title="Active Now" value="+573" delta="-2.4%" icon="activity" />
      </div>

      {/* Chart + Side list */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap: 14 }}>
        <Card>
          <CardHeader title="Overview" description="Revenue & subscribers, last 6 months" />
          <AreaChart
            width={560} height={220}
            data={[
              { values: [18, 22, 30, 28, 42, 48, 55, 60, 58, 72, 85, 92] },
              { values: [14, 18, 20, 26, 30, 32, 38, 44, 50, 58, 66, 78] },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Recent Sales" description="You made 265 sales this month." />
          {[
            { n:'Olivia Martin', e:'olivia.martin@email.com', v:'+$1,999.00' },
            { n:'Jackson Lee', e:'jackson.lee@email.com', v:'+$39.00' },
            { n:'Isabella Nguyen', e:'isabella.nguyen@email.com', v:'+$299.00' },
            { n:'William Kim', e:'will@email.com', v:'+$99.00' },
            { n:'Sofia Davis', e:'sofia.davis@email.com', v:'+$39.00' },
          ].map((r, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9999, background:'rgb(75,85,99)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontWeight:600, fontSize:12 }}>
                {r.n.split(' ').map(s => s[0]).join('')}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Inter', fontSize: 13, fontWeight: 500 }}>{r.n}</div>
                <div style={{ fontFamily:'Inter', fontSize: 12, color:'rgb(163,163,163)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.e}</div>
              </div>
              <div style={{ fontFamily:'Inter', fontVariantNumeric:'tabular-nums', fontSize: 13, fontWeight: 500 }}>{r.v}</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Tasks table */}
      <Card padding={0}>
        <div style={{ padding: 20, borderBottom: '1px solid rgb(75,85,99)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:'Inter', fontSize: 18, fontWeight: 700 }}>Tasks</div>
            <div style={{ fontFamily:'Inter', fontSize: 13, color:'rgb(163,163,163)', marginTop: 4 }}>Here's a list of your tasks for this month.</div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <Button variant="outline" size="sm" icon="filter">Filter</Button>
            <Button variant="primary" size="sm" icon="plus">New task</Button>
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <Table
            columns={[
              { key:'id', title:'Task', w:'120px', render: (r) => <span style={{ fontFamily:'Inter', fontVariantNumeric:'tabular-nums', fontSize: 12, color: 'rgb(163,163,163)' }}>{r.id}</span> },
              { key:'title', title:'Title', w:'1fr', render: (r) => <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}><Badge variant="outline">{r.type}</Badge> {r.title}</span> },
              { key:'status', title:'Status', w:'140px', render: (r) => statusBadge(r.status) },
              { key:'priority', title:'Priority', w:'120px', render: (r) => priorityBadge(r.priority) },
            ]}
            rows={rows}
          />
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Dashboard });
