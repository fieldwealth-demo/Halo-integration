/* Client Reports — David Young. Dense, tabular report view matching the Field Shadcn
   glass-tile aesthetic. Sections:
     1. 4 KPI tiles (Portfolio Value, Monthly Return, Annual Return, Risk Score)
     2. 12-month portfolio trend vs S&P 500 + allocation donut
     3. 4 metric tiles (Risk, Fees, Allocation, Income)
     4. Holdings table
     5. Recent Transactions table
*/

const CR_TILE = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgb(75,85,99)',
  borderRadius: 14,
  color: 'rgb(249,250,251)',
  display:'flex', flexDirection:'column', overflow:'hidden',
};
const CR_LABEL = { fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', letterSpacing:'0.01em' };
const CR_VALUE = { fontFamily:'Inter', fontWeight:700, fontSize:18, letterSpacing:'-0.01em', fontVariantNumeric:'tabular-nums' };
const CR_TITLE = { fontFamily:'Inter', fontWeight:600, fontSize:13, letterSpacing:'-0.01em' };
const CR_DIVIDER = '1px solid rgba(75,85,99,0.45)';

const CR_GREEN  = 'rgb(5,122,85)';
const CR_GREEN_SOFT = 'rgba(5,122,85,0.18)';
const CR_RED    = 'rgb(248,113,113)';
const CR_RED_SOFT = 'rgba(248,113,113,0.16)';
const CR_BLUE   = 'rgb(56,189,248)';
const CR_BLUE_SOFT = 'rgba(56,189,248,0.18)';
const CR_AMBER  = 'rgb(234,179,8)';

/* ---- 1. KPI tiles --------------------------------------------------- */
function CRKpi({ label, value, sub, tone='green' }) {
  const tones = {
    green: { v:CR_GREEN,  s:'rgb(163,163,163)' },
    amber: { v:CR_AMBER,  s:'rgb(163,163,163)' },
    red:   { v:CR_RED,    s:'rgb(163,163,163)' },
    neutral:{v:'rgb(249,250,251)', s:'rgb(163,163,163)' },
  }[tone];
  return (
    <div style={{ ...CR_TILE, padding:'16px 18px', gap:10 }}>
      <div style={{ ...CR_LABEL, textAlign:'center' }}>{label}</div>
      <div style={{ ...CR_VALUE, color:tones.v, textAlign:'center', fontSize:18 }}>{value}</div>
      {sub && <div style={{ ...CR_LABEL, color:tones.s, textAlign:'center' }}>{sub}</div>}
    </div>
  );
}

/* ---- 2. Portfolio trend chart -------------------------------------- */
function PortfolioTrend() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const portfolio = [742, 748, 720, 764, 768, 780, 810, 798, 820, 838, 840, 856];
  const benchmark = [740, 744, 716, 758, 760, 770, 796, 788, 808, 824, 828, 840];
  const opts = React.useMemo(() => ({
    chart:{ type:'area', height:310, backgroundColor:'transparent', spacing:[8,8,8,8] },
    xAxis:{
      categories: months,
      lineColor:'rgba(75,85,99,0.6)',
      tickColor:'rgba(75,85,99,0.6)',
      labels:{ style:{ color:'rgb(163,163,163)', fontSize:'11px' } },
    },
    yAxis:{
      gridLineColor:'rgba(75,85,99,0.35)',
      title:{ text:null },
      labels:{ formatter: function(){ return '$' + this.value + 'K'; }, style:{ color:'rgb(163,163,163)', fontSize:'11px' } },
      min: 700, max: 870,
    },
    tooltip:{
      shared:true, backgroundColor:'rgba(17,24,39,0.95)', borderColor:'rgb(75,85,99)',
      style:{ color:'rgb(249,250,251)', fontSize:'11px' },
      formatter: function(){
        return `<b>${this.x}</b><br/>` + this.points.map(p =>
          `<span style="color:${p.color}">●</span> ${p.series.name}: <b>$${p.y}K</b>`
        ).join('<br/>');
      },
    },
    plotOptions:{
      area:{ marker:{ enabled:true, radius:3.5, fillColor:'rgb(10,10,10)', lineWidth:2 }, lineWidth:2 },
      series:{ states:{ hover:{ lineWidth:2.5 } } },
    },
    series:[
      {
        name:'Portfolio Value', data: portfolio, color:CR_GREEN,
        marker:{ lineColor:CR_GREEN },
        fillColor:{ linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
      },
      {
        name:'S&P 500 Benchmark', data: benchmark, color:'rgb(160,170,185)',
        dashStyle:'Dash', fillColor:'rgba(0,0,0,0)',
        marker:{ enabled:true, radius:3, symbol:'circle', fillColor:'transparent', lineWidth:1.5, lineColor:'rgb(160,170,185)' },
      },
    ],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  const Dot = ({c, label, dashed}) => (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:12, color:'rgb(209,213,219)' }}>
      {dashed ? (
        <span style={{ width:12, height:12, borderRadius:9999, border:'1.5px solid '+c, background:'transparent' }} />
      ) : (
        <span style={{ width:10, height:10, borderRadius:9999, background:c }} />
      )}
      {label}
    </span>
  );
  return (
    <div style={{ ...CR_TILE, padding:'14px 16px 14px' }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:6 }}>
        <div style={CR_TITLE}>Portfolio Performance</div>
        <div style={{ flex:1 }} />
        <span style={{
          fontFamily:'Inter', fontSize:10.5, color:'rgb(209,213,219)',
          background:'rgba(17,24,39,0.7)', border:'1px solid rgba(75,85,99,0.8)',
          borderRadius:6, padding:'3px 8px',
        }}>12 Month Trend</span>
      </div>
      <div style={{ flex:1, minHeight:310 }}><HC options={opts} /></div>
      <div style={{ display:'flex', justifyContent:'center', gap:22, paddingTop:8, marginTop:4, borderTop:CR_DIVIDER }}>
        <Dot c={CR_GREEN} label="Portfolio Value" />
        <Dot c="rgb(163,163,163)" label="S&P 500 Benchmark" dashed />
      </div>
    </div>
  );
}

/* ---- Allocation donut ---------------------------------------------- */
function AllocationDonut() {
  const data = [
    { name:'Domestic Stock Funds',   y:62, fill:'rgba( 94,214,164,0.55)', dot:'rgb( 94,214,164)', amt:'$529,220' },
    { name:'Bond Funds',             y:18, fill:'rgba(120,160,230,0.55)', dot:'rgb(120,160,230)', amt:'$153,720' },
    { name:'International Equities', y:11, fill:'rgba(180,150,235,0.55)', dot:'rgb(180,150,235)', amt:'$93,940' },
    { name:'Cash',                   y:5,  fill:'rgba(245,200, 90,0.55)', dot:'rgb(245,200, 90)', amt:'$42,700' },
    { name:'Alternatives',           y:4,  fill:'rgba(240,140,120,0.55)', dot:'rgb(240,140,120)', amt:'$34,160' },
  ];
  const opts = React.useMemo(() => ({
    chart:{ type:'pie', height:260, backgroundColor:'transparent', spacing:[4,4,4,4] },
    tooltip:{
      backgroundColor:'rgba(17,24,39,0.95)', borderColor:'rgb(75,85,99)',
      style:{ color:'rgb(249,250,251)', fontSize:'11px' },
      pointFormat:'<b>{point.percentage:.0f}%</b>',
    },
    plotOptions:{
      pie:{ innerSize:'68%', borderWidth:1.5, borderRadius:0,
        dataLabels:{ enabled:false }, states:{ hover:{ brightness:0.08, halo:{ size:6, opacity:0.2 } } } },
    },
    series:[{ data: data.map(d => ({ name:d.name, y:d.y, color:d.fill, borderColor:d.dot })) }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  return (
    <div style={{ ...CR_TILE, padding:'14px 16px' }}>
      <div style={{ ...CR_TITLE, marginBottom:6 }}>Allocation</div>
      <div style={{ minHeight:260 }}><HC options={opts} /></div>
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 12px',
        paddingTop:10, marginTop:6, borderTop:CR_DIVIDER,
      }}>
        {data.map((d,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:11.5, color:'rgb(209,213,219)' }}>
            <span style={{ width:7, height:7, borderRadius:9999, background:d.dot, flexShrink:0 }} />
            <span style={{ flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- 3. Metric tiles (Risk / Fees / Allocation / Income) ----------- */
function MetricList({ title, rows }) {
  return (
    <div style={{ ...CR_TILE, padding:'14px 16px' }}>
      <div style={{ ...CR_TITLE, marginBottom:4 }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
        {rows.map((r,i)=>(
          <div key={i} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'10px 0', borderTop: i===0 ? 'none' : CR_DIVIDER,
            fontFamily:'Inter', fontSize:12.5,
          }}>
            <span style={{ color:'rgb(209,213,219)' }}>{r.k}</span>
            <span style={{
              color: r.tone==='red' ? CR_RED : r.tone==='green' ? CR_GREEN : 'rgb(249,250,251)',
              fontWeight: r.v ? 600 : 400, fontVariantNumeric:'tabular-nums',
            }}>{r.v || <span style={{ color:'rgb(107,114,128)', fontStyle:'italic' }}>—</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- 4. Holdings table --------------------------------------------- */
function HoldingsTable() {
  const rows = [
    { sec:'VOO',  name:'Vanguard S&P 500 ETF',     sh:'420',    mv:'$198,240', pct:'23.2%', ytd:'+18.2%', tone:'green', basis:'$167,520' },
    { sec:'AAPL', name:'Apple Inc.',                sh:'310',    mv:'$72,640',  pct:'8.5%',  ytd:'+24.6%', tone:'green', basis:'$58,280' },
    { sec:'MSFT', name:'Microsoft Corp.',           sh:'155',    mv:'$68,915',  pct:'8.1%',  ytd:'+16.8%', tone:'green', basis:'$58,990' },
    { sec:'AGG',  name:'iShares Core US Agg Bond',  sh:'820',    mv:'$81,180',  pct:'9.5%',  ytd:'-2.4%',  tone:'red',   basis:'$83,180' },
    { sec:'AMZN', name:'Amazon.com Inc.',           sh:'210',    mv:'$47,460',  pct:'5.6%',  ytd:'+38.4%', tone:'green', basis:'$34,300' },
    { sec:'BRK.B',name:'Berkshire Hathaway B',      sh:'125',    mv:'$59,125',  pct:'6.9%',  ytd:'+11.3%', tone:'green', basis:'$53,125' },
  ];
  const headSt = { fontFamily:'Inter', fontSize:10.5, fontWeight:600, color:'rgb(163,163,163)', letterSpacing:'0.06em', textTransform:'uppercase', padding:'12px 14px' };
  const cellSt = { fontFamily:'Inter', fontSize:12.5, color:'rgb(229,231,235)', padding:'14px 14px', fontVariantNumeric:'tabular-nums', borderTop:CR_DIVIDER };
  return (
    <div style={{ ...CR_TILE, padding:'14px 0 0' }}>
      <div style={{ ...CR_TITLE, padding:'0 16px 8px' }}>Holdings</div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...headSt, textAlign:'left' }}>Security</th>
              <th style={{ ...headSt, textAlign:'right' }}>Shares/Units</th>
              <th style={{ ...headSt, textAlign:'right' }}>Market Value</th>
              <th style={{ ...headSt, textAlign:'right' }}>% of Portfolio</th>
              <th style={{ ...headSt, textAlign:'right' }}>YTD Return</th>
              <th style={{ ...headSt, textAlign:'right' }}>Cost Basis</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td style={{ ...cellSt, textAlign:'left' }}>
                  <div style={{ fontWeight:600, color:'rgb(249,250,251)' }}>{r.sec}</div>
                  <div style={{ fontSize:11, color:'rgb(163,163,163)' }}>{r.name}</div>
                </td>
                <td style={{ ...cellSt, textAlign:'right' }}>{r.sh}</td>
                <td style={{ ...cellSt, textAlign:'right', fontWeight:600 }}>{r.mv}</td>
                <td style={{ ...cellSt, textAlign:'right' }}>{r.pct}</td>
                <td style={{ ...cellSt, textAlign:'right', color: r.tone==='red' ? CR_RED : CR_GREEN, fontWeight:600 }}>{r.ytd}</td>
                <td style={{ ...cellSt, textAlign:'right' }}>{r.basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- 5. Transactions table ----------------------------------------- */
function TransactionsTable() {
  const rows = [
    { date:'Dec 18, 2025', type:'BUY',  sec:'NVDA', qty:'42',   price:'$577.62', amt:'-$24,260', tone:'red',   bal:'Cash ↓' },
    { date:'Dec 15, 2025', type:'SELL', sec:'TSLA', qty:'75',   price:'$248.49', amt:'+$18,637', tone:'green', bal:'Cash ↑' },
    { date:'Dec 10, 2025', type:'BUY',  sec:'VOO',  qty:'20',   price:'$480.20', amt:'-$9,604',  tone:'red',   bal:'Cash ↓' },
    { date:'Dec 05, 2025', type:'DIV',  sec:'AAPL', qty:'—',    price:'—',       amt:'+$180',    tone:'green', bal:'Cash ↑' },
    { date:'Dec 01, 2025', type:'BUY',  sec:'MSFT', qty:'28',   price:'$445.43', amt:'-$12,472', tone:'red',   bal:'Cash ↓' },
    { date:'Nov 24, 2025', type:'SELL', sec:'META', qty:'41',   price:'$549.41', amt:'+$22,526', tone:'green', bal:'Cash ↑' },
  ];
  const badge = (t) => {
    const map = {
      BUY:  { bg:CR_GREEN_SOFT, bd:'rgba(5,122,85,0.55)',  c:'rgb(52,211,153)' },
      SELL: { bg:CR_RED_SOFT,   bd:'rgba(248,113,113,0.55)', c:'rgb(252,165,165)' },
      DIV:  { bg:CR_BLUE_SOFT,  bd:'rgba(56,189,248,0.55)',  c:'rgb(125,211,252)' },
    }[t];
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:9999,
        background:map.bg, border:'1px solid '+map.bd, color:map.c,
        fontFamily:'Inter', fontSize:10.5, fontWeight:700, letterSpacing:'0.04em',
      }}>{t}</span>
    );
  };
  const headSt = { fontFamily:'Inter', fontSize:10.5, fontWeight:600, color:'rgb(163,163,163)', letterSpacing:'0.06em', textTransform:'uppercase', padding:'12px 14px' };
  const cellSt = { fontFamily:'Inter', fontSize:12.5, color:'rgb(229,231,235)', padding:'13px 14px', fontVariantNumeric:'tabular-nums', borderTop:CR_DIVIDER };
  return (
    <div style={{ ...CR_TILE, padding:'14px 0 0' }}>
      <div style={{ display:'flex', alignItems:'center', padding:'0 16px 8px' }}>
        <div style={CR_TITLE}>Recent Transactions</div>
        <div style={{ flex:1 }} />
        <span style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Last 30 days</span>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...headSt, textAlign:'left' }}>Date</th>
              <th style={{ ...headSt, textAlign:'left' }}>Transaction Type</th>
              <th style={{ ...headSt, textAlign:'left' }}>Security</th>
              <th style={{ ...headSt, textAlign:'right' }}>Quantity</th>
              <th style={{ ...headSt, textAlign:'right' }}>Price</th>
              <th style={{ ...headSt, textAlign:'right' }}>Amount</th>
              <th style={{ ...headSt, textAlign:'right' }}>Balance Impact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td style={{ ...cellSt, textAlign:'left', color:'rgb(209,213,219)' }}>{r.date}</td>
                <td style={{ ...cellSt, textAlign:'left' }}>{badge(r.type)}</td>
                <td style={{ ...cellSt, textAlign:'left', fontWeight:600, color:'rgb(249,250,251)' }}>{r.sec}</td>
                <td style={{ ...cellSt, textAlign:'right' }}>{r.qty}</td>
                <td style={{ ...cellSt, textAlign:'right' }}>{r.price}</td>
                <td style={{ ...cellSt, textAlign:'right', color: r.tone==='red' ? CR_RED : CR_GREEN, fontWeight:600 }}>{r.amt}</td>
                <td style={{ ...cellSt, textAlign:'right', color: r.tone==='red' ? CR_RED : CR_GREEN }}>{r.bal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- Root ---------------------------------------------------------- */
function ClientReports() {
  return (
    <div style={{ padding:'20px 24px 32px', display:'flex', flexDirection:'column', gap:16 }}>
      {/* Row 1 — KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        <CRKpi label="Total Portfolio Value" value="+12.4% YTD"       tone="green"   />
        <CRKpi label="Monthly Return"        value="+0.6% vs benchmark" tone="green" />
        <CRKpi label="Annual Return"         value="Outperforming S&P 500" tone="green" />
        <CRKpi label="Risk Score"            value="Moderate Risk"     tone="amber" />
      </div>

      {/* Row 2 — Trend chart + Allocation donut */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
        <PortfolioTrend />
        <AllocationDonut />
      </div>

      {/* Row 3 — 4 metric tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        <MetricList title="Risk Metrics" rows={[
          { k:'Beta (Market Risk)',    v:'0.92' },
          { k:'Sharpe Ratio',          v:'1.34' },
          { k:'Alpha (Excess Return)', v:'+2.8%', tone:'green' },
          { k:'Standard Deviation',    v:'11.4%' },
          { k:'Maximum Drawdown',      v:'-8.2%', tone:'red' },
        ]} />
        <MetricList title="Fees & Expenses" rows={[
          { k:'Advisory Fee (1.25% annually)', v:'-$10,591', tone:'red' },
          { k:'Fund Expense Ratios',           v:'-$2,847',  tone:'red' },
          { k:'Trading Commissions',           v:'-$245',    tone:'red' },
          { k:'Total Annual Fees',             v:'-$13,683', tone:'red' },
          { k:'Net Fee Rate',                  v:'1.61%' },
        ]} />
        <MetricList title="Asset Class Exposure" rows={[
          { k:'US Equities',           v:'62%' },
          { k:'International Equities',v:'11%' },
          { k:'Fixed Income',          v:'18%' },
          { k:'Cash & Equivalents',    v:'5%' },
          { k:'Alternative Investments', v:'4%' },
        ]} />
        <MetricList title="Income Generation" rows={[
          { k:'Quarterly Dividend Income', v:'$4,285' },
          { k:'Annual Dividend Yield',     v:'2.18%' },
          { k:'Interest Income',           v:'$1,840' },
          { k:'Total Income YTD',          v:'$24,500' },
          { k:'Tax-Efficient Income',      v:'$8,420' },
        ]} />
      </div>

      {/* Row 4 — Holdings */}
      <HoldingsTable />

      {/* Row 5 — Transactions */}
      <TransactionsTable />
    </div>
  );
}

Object.assign(window, { ClientReports });
