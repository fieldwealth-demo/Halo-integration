/* Positions & Holdings page */

const POSITIONS = [
  { ticker:'VOO',  fullName:'Vanguard S&P 500 ETF',   manager:'Vanguard',  type:'ETF',         strategy:'Large Cap Blend',  aum:'$148.0M', clients:124, avg:'$1.2M', pct: 32.6, ytd:'+18.4%', exp:'0.03%', logo:'V', logoColor:'rgb(196,30,58)', tColor:'green', sparkColor:'rgb(168,185,241)' },
  { ticker:'VTV',  fullName:'Vanguard Value ETF',     manager:'Vanguard',  type:'ETF',         strategy:'Large Cap Value',  aum:'$95.0M',  clients:98,  avg:'$968K', pct: 20.9, ytd:'+14.1%', exp:'0.04%', logo:'V', logoColor:'rgb(196,30,58)', tColor:'green', sparkColor:'rgb(168,185,241)' },
  { ticker:'VUG',  fullName:'Vanguard Growth ETF',    manager:'Vanguard',  type:'ETF',         strategy:'Large Cap Growth', aum:'$57.0M',  clients:76,  avg:'$750K', pct: 12.6, ytd:'+22.7%', exp:'0.04%', logo:'V', logoColor:'rgb(196,30,58)', tColor:'green', sparkColor:'rgb(168,185,241)' },
  { ticker:'PIMCO',fullName:'PIMCO Income Fund',      manager:'PIMCO',     type:'Mutual Fund', strategy:'Multi-Sector Bond',aum:'$57.0M',  clients:87,  avg:'$655K', pct: 12.6, ytd:'+8.2%',  exp:'0.50%', logo:'P', logoColor:'rgb(0,52,120)',  tColor:'blue',  sparkColor:'rgb(120,160,230)' },
  { ticker:'IUSB', fullName:'iShares Core Total USD Bond',manager:'BlackRock',type:'ETF',      strategy:'Broad Market Bond',aum:'$32.0M',  clients:45,  avg:'$711K', pct: 7.0,  ytd:'+4.8%',  exp:'0.03%', logo:'i', logoColor:'rgb(40,40,40)',  tColor:'green', sparkColor:'rgb(168,185,241)' },
  { ticker:'BX-RE',fullName:'Blackstone RE Income Trust',manager:'Blackstone',type:'Alternative',strategy:'Private Real Estate',aum:'$28.0M',clients:27,avg:'$1.3M',pct: 6.2, ytd:'+8.9%',  exp:'1.25%', logo:'B', logoColor:'rgb(40,40,40)',  tColor:'amber', sparkColor:'rgb(245,200,90)' },
  { ticker:'GS-SN',fullName:'GS Structured Note 2024',manager:'Goldman Sachs',type:'Structured',strategy:'Principal Protected',aum:'$19.0M',clients:18,avg:'$1.1M',pct: 4.2, ytd:'+9.4%',  exp:'—',     logo:'G', logoColor:'rgb(124,150,179)',tColor:'coral', sparkColor:'rgb(240,140,120)' },
];

const MANAGERS = [
  { name:'Vanguard',     pct: 65.1, val:'$300.0M', color:'rgb(168,185,241)' },
  { name:'PIMCO',        pct: 12.6, val:'$57.0M',  color:'rgb(120,160,230)' },
  { name:'BlackRock',    pct: 7,    val:'$32.0M',  color:'rgb(180,150,235)' },
  { name:'Blackstone',   pct: 6.2,  val:'$28.0M',  color:'rgb(245,200,90)' },
  { name:'Goldman Sachs',pct: 4.2,  val:'$19.0M',  color:'rgb(240,140,120)' },
];

function PositionsPage() {
  const [filter, setFilter] = React.useState('All');
  const filters = ['All','ETF','Mutual Fund','Alternative','Structured'];
  const visible = filter === 'All' ? POSITIONS : POSITIONS.filter(p => p.type === filter);

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
        <StatTile label="VANGUARD CONCENTRATION" value="$300M" sub="VOO + VTV + VUG combined · 65% of book" />
        <StatTile label="PIMCO INCOME FUND" value="$57M" sub="87 clients holding · 12.6% of book" />
        <StatTile label="ALTERNATIVES AUM" value="$47M" sub="Blackstone REIT + iCapital alts" />
      </div>

      <Card style={{ padding: 0, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid rgba(75,85,99,0.3)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color:'rgb(249,250,251)' }}>All Positions</div>
            <div style={{ fontSize: 11.5, color:'rgb(156,163,175)', marginTop: 2 }}>Click any row to drill in · Showing {visible.length} of {POSITIONS.length} positions</div>
          </div>
          <div style={{ display:'flex', gap: 4, padding: 3, background:'rgba(17,24,39,0.6)', borderRadius: 8, border:'1px solid rgba(75,85,99,0.4)' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                height: 26, padding: '0 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: filter === f ? 'rgba(168,185,241,0.18)' : 'transparent',
                color: filter === f ? 'rgb(168,185,241)' : 'rgb(156,163,175)',
                fontSize: 11.5, fontWeight: 500,
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <SortHeader label="POSITION" sortKey="ticker" sort={{}} />
                <SortHeader label="ASSET MANAGER" sortKey="manager" sort={{}} />
                <SortHeader label="TYPE" sortKey="type" sort={{}} />
                <SortHeader label="STRATEGY" sortKey="strategy" sort={{}} />
                <SortHeader label="BOOK AUM" sortKey="aum" sort={{key:'aum',dir:'desc'}} align="right" />
                <SortHeader label="CLIENTS" sortKey="clients" sort={{}} align="right" />
                <SortHeader label="AVG POSITION" sortKey="avg" sort={{}} align="right" />
                <SortHeader label="% OF BOOK" sortKey="pct" sort={{}} align="right" />
                <SortHeader label="YTD RETURN" sortKey="ytd" sort={{}} align="right" />
                <SortHeader label="EXPENSE RATIO" sortKey="exp" sort={{}} align="right" />
              </tr>
            </thead>
            <tbody>
              {visible.map((p, i) => (
                <tr key={i} className="row-hover" style={{ borderBottom:'1px solid rgba(75,85,99,0.2)' }}>
                  <td style={td()}>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 6, background: p.logoColor, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{p.ticker.split('-')[0].slice(0,3)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color:'rgb(229,231,235)' }}>{p.ticker}</div>
                        <div style={{ fontSize: 11, color:'rgb(107,114,128)' }}>{p.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td()}><span style={{ fontSize: 12.5, color:'rgb(209,213,219)' }}>{p.manager}</span></td>
                  <td style={td()}><Badge color={p.type==='Mutual Fund'?'purple':p.type==='Alternative'?'amber':p.type==='Structured'?'coral':'gray'}>{p.type}</Badge></td>
                  <td style={td()}><span style={{ fontSize: 12.5, color:'rgb(209,213,219)' }}>{p.strategy}</span></td>
                  <td style={td('right','num')}><span style={{ fontWeight: 700 }}>{p.aum}</span></td>
                  <td style={td('right','num')}>{p.clients}</td>
                  <td style={td('right','num')}>{p.avg}</td>
                  <td style={td('right')}>
                    <div style={{ display:'flex', alignItems:'center', gap: 6, justifyContent:'flex-end' }}>
                      <div style={{ width: 50, height: 4, background:'rgba(75,85,99,0.4)', borderRadius:2, overflow:'hidden' }}>
                        <div style={{ width:`${Math.min(p.pct*2.5,100)}%`, height:'100%', background: p.sparkColor }} />
                      </div>
                      <span className="num" style={{ fontWeight: 600, fontSize: 12 }}>{p.pct}%</span>
                    </div>
                  </td>
                  <td style={td('right','num')}><span style={{ color: p.ytd.startsWith('+') ? 'rgb(168,185,241)' : 'rgb(248,113,113)', fontWeight: 600 }}>{p.ytd}</span></td>
                  <td style={td('right','num')}><span style={{ color:'rgb(168,185,241)' }}>{p.exp}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle title="Asset Manager Concentration" subtitle="Firm-wide exposure by manager · Useful for who-owes relationships and leverage" />
        {MANAGERS.map(m => (
          <div key={m.name} style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 100, fontSize: 12.5, color:'rgb(209,213,219)' }}>{m.name}</div>
            <div style={{ flex: 1, height: 18, background:'rgba(75,85,99,0.3)', borderRadius: 4, overflow:'hidden' }}>
              <div style={{ width: `${m.pct/65.1*100}%`, height:'100%', background: m.color, borderRadius: 4 }} />
            </div>
            <div className="num" style={{ width: 70, textAlign:'right', fontSize: 12, color: m.color, fontWeight: 600 }}>{m.val}</div>
            <div className="num" style={{ width: 50, textAlign:'right', fontSize: 12, color:'rgb(156,163,175)' }}>{m.pct}%</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

window.PositionsPage = PositionsPage;
