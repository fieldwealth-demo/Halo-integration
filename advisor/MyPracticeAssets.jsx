/* My Practice — Assets tab. Depends on MP_* shared tokens from MyPractice.jsx. */

const AS_KPIS = [
  { label:'Total AUM',  value:'$16.53M', delta:'+6.3% YTD',     deltaTone:'success' },
  { label:'YTD Growth', value:'$1.23M',  delta:'+12.4% vs last year', deltaTone:'success' },
  { label:'Accounts',   value:'30',      delta:'+3 this quarter',deltaTone:'success' },
  { label:'YTD Fees',   value:'$43,999', delta:'+15.2% vs last year', deltaTone:'success' },
];

const AS_ALLOCATION = [
  { label:'Public Equity',    value:'$9,093,793', pct:'55%', amount:9.09, color:'rgb(16,185,129)' },
  { label:'Fixed Income',     value:'$4,960,251', pct:'30%', amount:4.96, color:'rgb(56,189,248)' },
  { label:'Real Assets',      value:'$1,157,392', pct:'7%',  amount:1.16, color:'rgb(234,88,12)'  },
  { label:'Private Equity',   value:'$720,000',   pct:'4%',  amount:0.72, color:'rgb(139,92,246)' },
  { label:'Hedge Funds',      value:'$496,025',   pct:'3%',  amount:0.50, color:'rgb(234,179,8)'  },
  { label:'Cash & Equivalents', value:'$103,539', pct:'1%',  amount:0.10, color:'rgb(163,163,163)' },
];

const AS_TOP_MANAGERS = [
  { code:'DP', name:'Design Partner I',         sub:'8 funds held · Equity, Fixed Income',   color:'rgb(220,38,38)',  aum:'$4.2M', delta:'+12.5% YTD' },
  { code:'VG', name:'Vanguard',                 sub:'6 funds held · Equity, Multi-Asset',    color:'rgb(220,38,38)',  aum:'$3.8M', delta:'+8.7% YTD' },
  { code:'JP', name:'JPMorgan',                 sub:'5 funds held · Fixed Income, Equity',   color:'rgb(56,189,248)', aum:'$2.9M', delta:'+9.7% YTD' },
  { code:'MFS',name:'MFS Investment Management', sub:'4 funds held · Equity',                color:'rgb(234,88,12)',  aum:'$2.1M', delta:'+15.2% YTD' },
  { code:'PM', name:'PIMCO',                    sub:'3 funds held · Fixed Income',           color:'rgb(220,38,38)',  aum:'$1.8M', delta:'+5.1% YTD' },
];

const AS_GROWTH_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'];
const AS_GROWTH_VALUES = [14.9, 15.1, 14.8, 15.2, 15.5, 15.7, 15.9, 16.0, 16.1, 16.3, 16.5];

const AS_POSITIONS = [
  { code:'VTI',  color:'rgb(139,92,246)', name:'Vanguard Total Stock Market ETF', sub:'VTI', cls:'Equity',        clsTone:'success', fairValue:'$2,845,320', cost:'$2,412,890', gl:'+$432,430', glTone:'success', allocation:17.2 },
  { code:'BND',  color:'rgb(56,189,248)', name:'Vanguard Total Bond Market ETF',  sub:'BND', cls:'Fixed Income',  clsTone:'info',    fairValue:'$2,156,780', cost:'$2,234,560', gl:'-$77,780', glTone:'danger',  allocation:13 },
  { code:'SPY',  color:'rgb(234,179,8)',  name:'SPDR S&P 500 ETF Trust',          sub:'SPY', cls:'Equity',        clsTone:'success', fairValue:'$1,923,450', cost:'$1,654,320', gl:'+$269,130', glTone:'success', allocation:11.6 },
  { code:'AGG',  color:'rgb(139,92,246)', name:'iShares Core US Aggregate Bond',  sub:'AGG', cls:'Fixed Income',  clsTone:'info',    fairValue:'$1,567,890', cost:'$1,612,340', gl:'-$44,450', glTone:'danger',  allocation:9.5 },
  { code:'QQQ',  color:'rgb(16,185,129)', name:'Invesco QQQ Trust',               sub:'QQQ', cls:'Equity',        clsTone:'success', fairValue:'$1,423,670', cost:'$1,156,890', gl:'+$266,780', glTone:'success', allocation:8.6 },
  { code:'VNQ',  color:'rgb(248,113,113)',name:'Vanguard Real Estate ETF',        sub:'VNQ', cls:'Real Estate',   clsTone:'warning', fairValue:'$1,157,392', cost:'$1,089,450', gl:'+$67,942',  glTone:'success', allocation:7 },
  { code:'EFA',  color:'rgb(56,189,248)', name:'iShares Core MSCI EAFE ETF',      sub:'EFA', cls:'Equity',        clsTone:'success', fairValue:'$997,650',   cost:'$923,780',   gl:'+$63,870',  glTone:'success', allocation:6 },
  { code:'PDBC', color:'rgb(139,92,246)', name:'Invesco Optimum Yield Diversified', sub:'PDBC', cls:'Alternatives', clsTone:'violet', fairValue:'$826,708',  cost:'$798,340',   gl:'+$28,368', glTone:'success', allocation:5 },
  { code:'ABD',  color:'rgb(234,88,12)',  name:'Apexium Biodiversity Fund II',    sub:'ABD', cls:'Private Equity', clsTone:'danger', fairValue:'$723,000',   cost:'$650,000',   gl:'+$80,000',  glTone:'success', allocation:4.4, newBadge:true },
];

const AS_CLS_TONES = {
  success: { bg:'rgba(16,185,129,0.18)', fg:'rgb(16,185,129)', border:'1px solid rgba(16,185,129,0.4)' },
  info:    { bg:'rgba(56,189,248,0.18)', fg:'rgb(56,189,248)', border:'1px solid rgba(56,189,248,0.4)' },
  warning: { bg:'rgba(234,88,12,0.18)',  fg:'rgb(251,146,60)', border:'1px solid rgba(234,88,12,0.45)' },
  violet:  { bg:'rgba(139,92,246,0.18)', fg:'rgb(196,181,253)', border:'1px solid rgba(139,92,246,0.45)' },
  danger:  { bg:'rgba(248,113,113,0.18)',fg:'rgb(248,113,113)', border:'1px solid rgba(248,113,113,0.45)' },
};

function ASAllocation() {
  const opts = React.useMemo(() => ({
    chart:{ type:'pie', height:220, spacing:[4,4,4,4] },
    tooltip:{ pointFormat:'<b>${point.y}M</b> ({point.percentage:.1f}%)' },
    plotOptions:{ pie:{ innerSize:'68%', borderWidth:1.5, borderRadius:0, dataLabels:{ enabled:false }, states:{ hover:{ brightness:0.08, halo:{ size:6, opacity:0.2 } } } } },
    series:[{ name:'Allocation', data: AS_ALLOCATION.map(a => ({ name:a.label, y:a.amount, color:a.color.replace('rgb(','rgba(').replace(')',',0.55)'), borderColor:a.color })) }],
  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>AUM Asset Allocation</div><TileInfo title="AUM Asset Allocation" /></div>
        <i className="fa-solid fa-ellipsis" style={{ width:14, height:14, color:'rgb(163,163,163)' }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:16, padding:'4px 20px 10px', alignItems:'center' }}>
        <div style={{ position:'relative', width:220, height:220 }}>
          <HC options={opts} style={{ height:220 }} />
          <div style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none',
          }}>
            <div style={{ fontFamily:'Inter', fontSize:10, color:'rgb(163,163,163)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Total Value</div>
            <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:20, color:'rgb(249,250,251)' }}>$16.53M</div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {AS_ALLOCATION.map((a, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto 40px', alignItems:'center', gap:14, fontFamily:'Inter', fontSize:12 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:8, color:'rgb(229,231,235)' }}>
                <span style={{ width:10, height:10, borderRadius:2, background:a.color }} />
                {a.label}
              </span>
              <span style={{ fontVariantNumeric:'tabular-nums', color:'rgb(229,231,235)', fontWeight:600 }}>{a.value}</span>
              <span style={{ textAlign:'right', fontVariantNumeric:'tabular-nums', color:'rgb(163,163,163)' }}>{a.pct}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Managed vs Held Away bar */}
      <div style={{ padding:'10px 20px 16px', borderTop:'1px solid rgba(75,85,99,0.35)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Managed vs Held Away Assets</span>
          <span style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>
            Managed <b style={{ color:'rgb(229,231,235)' }}>$932M</b> &nbsp; Held Away <b style={{ color:'rgb(229,231,235)' }}>$332M</b>
          </span>
        </div>
        <div style={{ display:'flex', height:10, borderRadius:5, overflow:'hidden', background:'rgba(255,255,255,0.05)' }}>
          <div style={{ width:'69%', background:'rgb(16,185,129)' }} />
          <div style={{ width:'31%', background:'rgb(234,88,12)' }} />
        </div>
        <div style={{ display:'flex', gap:18, marginTop:8 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:11, color:'rgb(209,213,219)' }}>
            <span style={{ width:9, height:9, borderRadius:9999, background:'rgb(16,185,129)' }} /> Assets Under Management (69%)
          </span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:11, color:'rgb(209,213,219)' }}>
            <span style={{ width:9, height:9, borderRadius:9999, background:'rgb(234,88,12)' }} /> Assets Held Away (31%)
          </span>
        </div>
      </div>
    </div>
  );
}

function ASTopManagers() {
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Top Asset Managers</div><TileInfo title="Top Asset Managers" /></div>
        <span style={{ fontFamily:'Inter', fontSize:11, color:'rgb(16,185,129)', cursor:'pointer', fontWeight:600 }}>See all</span>
      </div>
      <div style={{ padding:'2px 18px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        {AS_TOP_MANAGERS.map((m, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'36px 1fr auto', alignItems:'center', gap:12 }}>
            <div style={{
              width:36, height:36, borderRadius:8, background:m.color,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Inter', fontWeight:700, fontSize:11.5, color:'#fff', letterSpacing:'0.02em',
            }}>{m.code}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:12.5, color:'rgb(249,250,251)' }}>{m.name}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>{m.sub}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:13.5, fontVariantNumeric:'tabular-nums' }}>{m.aum}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(16,185,129)', fontWeight:600 }}>↑ {m.delta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ASGrowth() {
  const [range, setRange] = React.useState('YTD');
  const ranges = ['1M','3M','YTD','1Y','All'];
  const opts = React.useMemo(() => ({
    chart:{ type:'areaspline', height:300, spacing:[16,8,8,8] },
    xAxis:{ categories: AS_GROWTH_MONTHS },
    yAxis:{ labels:{ formatter: function(){ return '$' + this.value.toFixed(1) + 'M'; } }, tickAmount:8 },
    legend:{ enabled:false },
    tooltip:{ pointFormat:'<b>${point.y}M</b>' },
    plotOptions:{ areaspline:{
      fillColor:{ linearGradient:{ x1:0,x2:0,y1:0,y2:1 }, stops:[[0,'rgba(16,185,129,0.32)'],[1,'rgba(16,185,129,0.02)']] },
      lineColor:'rgb(16,185,129)', lineWidth:2.5,
      marker:{ enabled:true, radius:3.5, fillColor:'rgb(16,185,129)', lineColor:'rgb(14,26,42)', lineWidth:2 },
    } },
    series:[{ name:'Managed Assets', data: AS_GROWTH_VALUES }],
  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Managed Assets Growth</div><TileInfo title="Managed Assets Growth" /></div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:4, border:'1px solid rgba(75,85,99,0.6)', borderRadius:8, padding:3, background:'rgba(255,255,255,0.02)' }}>
            {ranges.map(r => (
              <button key={r} data-no-hint onClick={()=>setRange(r)} style={{
                fontFamily:'Inter', fontWeight:600, fontSize:10.5,
                padding:'4px 10px', borderRadius:5, cursor:'pointer', border:'none',
                background: range === r ? 'rgb(5,122,85)' : 'transparent',
                color: range === r ? '#fff' : 'rgb(163,163,163)',
              }}>{r}</button>
            ))}
          </div>
          <button data-no-hint style={{
            fontFamily:'Inter', fontWeight:600, fontSize:11,
            padding:'6px 10px', borderRadius:6, cursor:'pointer',
            background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)',
            border:'1px solid rgba(75,85,99,0.7)',
            display:'inline-flex', alignItems:'center', gap:6,
          }}><i className="fa-solid fa-download" style={{ width:11, height:11 }} /> Export</button>
        </div>
      </div>
      <div style={{ padding:'0 8px 12px', flex:1 }}><HC options={opts} style={{ height:300 }} /></div>
    </div>
  );
}

function ASPositionBadge({ tone, children }) {
  const t = AS_CLS_TONES[tone] || AS_CLS_TONES.info;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      fontFamily:'Inter', fontWeight:700, fontSize:10.5,
      padding:'3px 10px', borderRadius:4, ...t,
    }}>{children}</span>
  );
}

function ASPositions() {
  const [tab, setTab] = React.useState('All');
  const tabs = ['All','Public Equity','Fixed Income','Private Markets','Real Assets'];

  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Positions</div><TileInfo title="Positions" /></div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:4, border:'1px solid rgba(75,85,99,0.6)', borderRadius:999, padding:3, background:'rgba(255,255,255,0.02)' }}>
            {tabs.map(t => (
              <button key={t} data-no-hint onClick={()=>setTab(t)} style={{
                fontFamily:'Inter', fontWeight:600, fontSize:10.5,
                padding:'4px 14px', borderRadius:999, cursor:'pointer', border:'none',
                background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: tab === t ? 'rgb(249,250,251)' : 'rgb(163,163,163)',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button data-no-hint style={{
              fontFamily:'Inter', fontWeight:600, fontSize:11,
              padding:'6px 10px', borderRadius:6, cursor:'pointer',
              background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)',
              border:'1px solid rgba(75,85,99,0.7)',
              display:'inline-flex', alignItems:'center', gap:6,
            }}><i className="fa-solid fa-filter" style={{ width:10, height:10 }} /> Filter</button>
            <button data-no-hint style={{
              fontFamily:'Inter', fontWeight:600, fontSize:11,
              padding:'6px 10px', borderRadius:6, cursor:'pointer',
              background:'rgba(255,255,255,0.04)', color:'rgb(229,231,235)',
              border:'1px solid rgba(75,85,99,0.7)',
              display:'inline-flex', alignItems:'center', gap:6,
            }}><i className="fa-solid fa-table-columns" style={{ width:10, height:10 }} /> Columns</button>
          </div>
        </div>
      </div>
      <div style={{ padding:'4px 8px 12px' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'2fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr', alignItems:'center', gap:12,
          padding:'8px 14px', fontFamily:'Inter', fontSize:10.5, fontWeight:600, letterSpacing:'0.08em',
          color:'rgb(163,163,163)', textTransform:'uppercase',
          borderBottom:'1px solid rgba(75,85,99,0.4)',
        }}>
          <span>Holding</span>
          <span>Asset Class</span>
          <span style={{ textAlign:'right' }}>Fair Value / NAV</span>
          <span style={{ textAlign:'right' }}>Cost / Paid-In</span>
          <span style={{ textAlign:'right' }}>Unrealized G/L</span>
          <span style={{ textAlign:'right' }}>Allocation</span>
        </div>
        {AS_POSITIONS.map((r, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'2fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr', alignItems:'center', gap:12,
            padding:'12px 14px', borderBottom: i === AS_POSITIONS.length - 1 ? 'none' : '1px solid rgba(75,85,99,0.22)',
            fontFamily:'Inter', fontSize:12.5,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:32, height:32, borderRadius:9999, background:r.color,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Inter', fontWeight:700, fontSize:10, color:'#fff',
              }}>{r.code}</div>
              <div style={{ minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontWeight:600, color:'rgb(249,250,251)' }}>{r.name}</span>
                  {r.newBadge && (
                    <span style={{
                      display:'inline-flex', fontFamily:'Inter', fontWeight:700, fontSize:9.5,
                      padding:'2px 7px', borderRadius:4,
                      background:'rgba(234,88,12,0.22)', color:'rgb(251,146,60)',
                      border:'1px solid rgba(234,88,12,0.45)',
                    }}>★ NEW</span>
                  )}
                </div>
                <div style={{ fontSize:11, color:'rgb(163,163,163)' }}>{r.sub}</div>
              </div>
            </div>
            <div><ASPositionBadge tone={r.clsTone}>{r.cls}</ASPositionBadge></div>
            <span style={{ textAlign:'right', fontVariantNumeric:'tabular-nums', color:'rgb(229,231,235)' }}>{r.fairValue}</span>
            <span style={{ textAlign:'right', fontVariantNumeric:'tabular-nums', color:'rgb(209,213,219)' }}>{r.cost}</span>
            <span style={{
              textAlign:'right', fontVariantNumeric:'tabular-nums', fontWeight:700,
              color: r.glTone === 'success' ? 'rgb(16,185,129)' : 'rgb(248,113,113)',
            }}>{r.gl}</span>
            <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end' }}>
              <div style={{ width:60, height:5, borderRadius:9999, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                <div style={{ width: `${Math.min(100, r.allocation * 5)}%`, height:'100%', background:'rgb(16,185,129)' }} />
              </div>
              <span style={{ fontVariantNumeric:'tabular-nums', fontWeight:600, minWidth:40, textAlign:'right' }}>{r.allocation}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MPAssetsTab() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap:16 }}>
      {AS_KPIS.map((k, i) => (
        <div key={i} style={{ gridColumn:'span 3' }}>
          <MPKpi {...k} />
        </div>
      ))}
      <div style={{ gridColumn:'span 7' }}><ASAllocation /></div>
      <div style={{ gridColumn:'span 5' }}><ASTopManagers /></div>
      <div style={{ gridColumn:'span 12' }}><ASGrowth /></div>
      <div style={{ gridColumn:'span 12' }}><ASPositions /></div>
    </div>
  );
}

window.MPAssetsTab = MPAssetsTab;
