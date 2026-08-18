/* Client Detail — David Young. Matches Figma: 4 top tiles (Net Worth, Asset Allocation,
   Investment Overview, General+Opportunities column) and 3 bottom tiles (Performance,
   Unrealized, Tax Summary). Follows Field Shadcn tile patterns. */

const CD_TILE = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgb(75,85,99)',
  borderRadius: 14,
  color: 'rgb(249,250,251)',
  display:'flex', flexDirection:'column', overflow:'hidden',
};
const CD_HEAD = { display:'flex', alignItems:'center', padding:'14px 16px 6px' };
const CD_TITLE = { fontFamily:'Inter', fontWeight:600, fontSize:14, letterSpacing:'-0.01em' };
const CD_FOOT = {
  display:'flex', alignItems:'center', justifyContent:'space-between',
  padding:'10px 16px', borderTop:'1px solid rgba(75,85,99,0.55)',
  fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', marginTop:'auto',
};
const CD_SEE = {
  display:'inline-flex', alignItems:'center', gap:4,
  color:'rgb(5,122,85)', textDecoration:'none', fontSize:11.5, fontWeight:500, cursor:'pointer',
};

/* How-it's-calculated copy + data source per tile, surfaced via the header info icon */
const CD_INFO = {
  cd_networth:   { source:'schwab',   text:'Net Worth = total assets − total liabilities. Balances pull from the linked custodian feed and refresh daily after market close.' },
  cd_allocation: { source:'fidelity', text:'Each slice is the market value of an asset class ÷ total portfolio value. Positions sync intraday from the custodian.' },
  cd_investment: { source:'schwab',   text:'Aggregates custodied holdings, non-custodied assets, cash and accrued income as reported by the custodian.' },
  cd_performance:{ source:'pershing', text:'Returns are time-weighted (TWRR), net of fees, and benchmarked against the S&P 500. Computed from daily account valuations.' },
  cd_unrealized: { source:'fidelity', text:'Unrealized gain/loss = current market value − cost basis, split into long- and short-term by holding period.' },
  cd_tax:        { source:'internal', text:'Estimated from realized gains/losses and 1099 data applied to the client\u2019s current federal and state brackets. For planning only.' },
};

function InfoPopover({ kind, source }) {
  const [open, setOpen] = React.useState(false);
  const info = CD_INFO[kind] || {};
  const srcId = source || info.source;
  const meta = srcId ? ((window.SOURCE_META || {})[srcId] || { name: srcId, dot:'rgb(107,114,128)' }) : null;
  const toggle = (e) => { e.stopPropagation(); setOpen(o => !o); };
  return (
    <span style={{ position:'relative', marginLeft:'auto', display:'inline-flex' }}>
      <button
        data-no-hint
        onClick={toggle}
        aria-label="How this is calculated"
        style={{
          background:'transparent', border:'none', cursor:'pointer',
          width:24, height:24, borderRadius:6,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          color: open ? 'rgb(5,122,85)' : 'rgb(163,163,163)', transition:'color 150ms ease',
        }}
      >
        <i className="fa-solid fa-circle-info" style={{ width:14, height:14 }} />
      </button>
      {open && (
        <React.Fragment>
          <div onClick={(e)=>{ e.stopPropagation(); setOpen(false); }} style={{ position:'fixed', inset:0, zIndex:40 }} />
          <div onClick={(e)=>e.stopPropagation()} style={{
            position:'absolute', top:30, right:0, zIndex:41, width:264,
            background:'rgb(17,24,39)', border:'1px solid rgb(75,85,99)', borderRadius:10,
            boxShadow:'0 12px 32px -8px rgba(0,0,0,0.6)', padding:'12px 13px',
            fontFamily:'Inter', textAlign:'left',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10.5, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'rgb(163,163,163)', marginBottom:7 }}>
              <i className="fa-solid fa-circle-info" style={{ width:11, height:11, color:'rgb(5,122,85)' }} />
              How this is calculated
            </div>
            <div style={{ fontSize:11.5, lineHeight:1.5, color:'rgb(209,213,219)' }}>{info.text || 'Calculation details unavailable.'}</div>
            {meta && (
              <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:10, paddingTop:9, borderTop:'1px solid rgba(75,85,99,0.55)' }}>
                <span style={{ fontSize:10.5, color:'rgb(163,163,163)' }}>Source</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'rgb(229,231,235)' }}>
                  <span style={{ width:7, height:7, borderRadius:9999, background:meta.dot }} />
                  {meta.name}
                </span>
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </span>
  );
}

function CDTile({ title, children, footLink='Reports', style, showFoot=true, source, kind, footLabel }) {
  const period = React.useContext(window.PeriodContext || React.createContext('Year to date'));
  const periodLabel = footLabel || (window.periodToLabel ? window.periodToLabel(period) : 'As of Today');
  const open = (e) => {
    if (e) e.stopPropagation();
    if (kind) window.dispatchEvent(new CustomEvent('clienttile:open', { detail: { kind } }));
  };
  const hasDetails = !!kind;
  return (
    <div style={{ ...CD_TILE, ...style }}>
      {title && (
        <div style={CD_HEAD}>
          <div style={CD_TITLE}>{title}</div>
          <InfoPopover kind={kind} source={source} />
        </div>
      )}
      <div style={{ padding:'0 16px 10px', flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
        {children}
      </div>
      {showFoot && (
        <div style={CD_FOOT}>
          <span>{periodLabel}</span>
          {hasDetails ? (
            <a onClick={open} style={{ ...CD_SEE, cursor:'pointer' }}>
              See details <i className="fa-solid fa-chevron-right" style={{ width:11, height:11 }} />
            </a>
          ) : (
            <a style={{ ...CD_SEE, cursor:'default' }}>
              {footLink} <i className="fa-solid fa-chevron-right" style={{ width:11, height:11 }} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* Sub-tabs under topbar */
function CDTabs({ active, onChange, period, setPeriod }) {
  const tabs = ['Profile','Reports','Billing'];
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:18, padding:'12px 24px 0',
      borderBottom:'1px solid rgba(75,85,99,0.5)',
    }}>
      {tabs.map(t => (
        <button key={t} onClick={()=>onChange(t)} style={{
          background:'transparent', border:'none', cursor:'pointer',
          padding:'8px 2px 10px',
          borderBottom: active===t ? '2px solid rgb(5,122,85)' : '2px solid transparent',
          color: active===t ? 'rgb(249,250,251)' : 'rgb(163,163,163)',
          fontFamily:'Inter', fontSize:12.5, fontWeight: active===t ? 600 : 500,
          marginBottom:-1,
        }}>{t}</button>
      ))}
    </div>
  );
}

/* 1. Net Worth — big number + monthly chart + assets/liabilities */
const NW_BY_PERIOD = {
  'Today':          { cats:['9a','10a','11a','12p','1p','2p','3p','4p'], data:[6118,6120.5,6121.8,6119.5,6123,6122.5,6124.1,6124], delta:'0.10%', dir:'up', deltaLabel:'today' },
  'This week':      { cats:['Mon','Tue','Wed','Thu','Fri'], data:[6098,6105,6112.5,6118,6124], delta:'0.43%', dir:'up', deltaLabel:'this week' },
  'This month':     { cats:['W1','W2','W3','W4'], data:[6080,6094,6112,6124], delta:'0.73%', dir:'up', deltaLabel:'this month' },
  'This quarter':   { cats:['Apr','May'], data:[6020,6124], delta:'1.73%', dir:'up', deltaLabel:'this quarter' },
  'Year to date':   { cats:['Jan','Feb','Mar','Apr','May'], data:[5760,5830,5920,6020,6124], delta:'6.33%', dir:'up', deltaLabel:'YTD' },
  'Last 12 months': { cats:['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'], data:[5620,5680,5740,5810,5760,5830,5880,5920,5975,6020,6080,6124], delta:'8.97%', dir:'up', deltaLabel:'12-month' },
  'All time':       { cats:['2020','2021','2022','2023','2024','2025','2026'], data:[3200,3850,4400,4850,5400,5900,6124], delta:'91.4%', dir:'up', deltaLabel:'since inception' },
};

function NetWorth() {
  const period = React.useContext(window.PeriodContext || React.createContext('Year to date'));
  const cfg = NW_BY_PERIOD[period] || NW_BY_PERIOD['Year to date'];
  const opts = React.useMemo(() => ({
    chart: { type:'area', height:150, spacing:[4,4,4,4], backgroundColor:'transparent' },
    xAxis: {
      categories: cfg.cats,
      lineColor:'rgba(75,85,99,0.4)', tickColor:'rgba(75,85,99,0.4)',
      labels:{ style:{ color:'rgb(163,163,163)', fontSize:'10px' } },
    },
    yAxis: {
      visible:true, gridLineColor:'rgba(75,85,99,0.2)', title:{ text:null },
      labels:{ formatter: function(){ return '$'+(this.value/1000).toFixed(1)+'M'; }, style:{ color:'rgb(163,163,163)', fontSize:'10px' } },
    },
    tooltip: {
      backgroundColor:'rgba(17,24,39,0.95)', borderColor:'rgb(75,85,99)',
      style:{ color:'rgb(249,250,251)', fontSize:'11px' },
      formatter: function(){ return `<b>${this.x}</b><br/>$${(this.y/1000).toFixed(2)}M`; },
    },
    plotOptions: {
      area: {
        fillColor: { linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
        lineWidth:2, color:'rgb(5,122,85)',
        marker:{ enabled:true, radius:2.5, fillColor:'rgb(10,10,10)', lineColor:'rgb(5,122,85)', lineWidth:1.5, symbol:'circle' },
      },
    },
    series:[{ name:'Net Worth', data: cfg.data }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), [period]);
  const upColor = cfg.dir === 'up' ? 'rgb(5,122,85)' : 'rgb(248,113,113)';
  return (
    <CDTile title="Net Worth" footLink="Facts" source="schwab" kind="cd_networth">
      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:28, letterSpacing:'-0.02em', padding:'2px 0 8px' }}>$6,124,145</div>
      <div style={{ minHeight:150 }}><HC options={opts} /></div>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 0 10px', fontFamily:'Inter', fontSize:12 }}>
        <i className={`fa-solid fa-arrow-${cfg.dir}`} style={{ width:11, height:11, color:upColor }} />
        <span style={{ color:upColor, fontWeight:600 }}>{cfg.delta}</span>
        <span style={{ color:'rgb(163,163,163)' }}>{cfg.dir === 'up' ? 'up' : 'down'} {cfg.deltaLabel}</span>
      </div>
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, paddingTop:12,
        borderTop:'1px solid rgba(75,85,99,0.5)',
      }}>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Assets</div>
          <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:22, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>$6,850,000</div>
        </div>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Liabilities</div>
          <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:22, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>$725,855</div>
        </div>
      </div>
    </CDTile>
  );
}

/* 2. Asset Allocation — donut + legend */
function AssetAllocation() {
  const data = [
    { name:'Domestic Stock', y:35, fill:'rgba( 94,214,164,0.55)', dot:'rgb( 94,214,164)', amt:'35%' },
    { name:'Bond Funds',     y:25, fill:'rgba(120,160,230,0.55)', dot:'rgb(120,160,230)', amt:'25%' },
    { name:'International',   y:18, fill:'rgba(180,150,235,0.55)', dot:'rgb(180,150,235)', amt:'18%' },
    { name:'Alternatives',   y:10, fill:'rgba(245,200, 90,0.55)', dot:'rgb(245,200, 90)', amt:'10%' },
    { name:'Real Estate',    y:7,  fill:'rgba(240,140,120,0.55)', dot:'rgb(240,140,120)', amt:'7%'  },
    { name:'Cash',           y:5,  fill:'rgba(120,200,210,0.55)', dot:'rgb(120,200,210)', amt:'5%'  },
  ];
  const opts = React.useMemo(() => ({
    chart:{ type:'pie', height:200, backgroundColor:'transparent', spacing:[4,4,4,4] },
    tooltip:{ pointFormat:'<b>{point.percentage:.0f}%</b>' },
    plotOptions:{
      pie:{
        innerSize:'68%', borderWidth:1.5, borderRadius:0, dataLabels:{enabled:false},
        states:{ hover:{ brightness:0.08, halo:{ size:6, opacity:0.2 } } },
      },
    },
    series:[{ data: data.map(d => ({ name:d.name, y:d.y, color:d.fill, borderColor:d.dot })) }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  return (
    <CDTile title="Asset Allocation" footLink="Reports" source="fidelity" kind="cd_allocation">
      <div style={{ flex:1, minHeight:200 }}><HC options={opts} /></div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, padding:'8px 0 6px' }}>
        {data.map((d,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'Inter', fontSize:11.5 }}>
            <span style={{ width:7, height:7, borderRadius:9999, background:d.dot, flexShrink:0 }} />
            <span style={{ color:'rgb(229,231,235)', flex:1, minWidth:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</span>
            <span style={{ color:'rgb(163,163,163)', fontVariantNumeric:'tabular-nums', flexShrink:0 }}>{d.amt}</span>
          </div>
        ))}
      </div>
    </CDTile>
  );
}

/* 3. Investment Overview */
function InvestmentOverview() {
  const rows = [
    ['Stocks',         '$1,512,195'],
    ['Non-custodied',  '$2,424,275'],
    ['Cash',           '$586,929'],
  ];
  const rows2 = [
    ['Accrued Income', '$165,419'],
    ['Net Investment', '$586,929'],
    ['Inception Date', 'Sep 8, 2020'],
  ];
  const Row = (k, v, idx) => (
    <div key={idx} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderTop:'1px solid rgba(75,85,99,0.45)', fontFamily:'Inter', fontSize:12.5 }}>
      <span style={{ color:'rgb(209,213,219)' }}>{k}</span>
      <span style={{ color:'rgb(249,250,251)', fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{v}</span>
    </div>
  );
  return (
    <CDTile title="Investment Overview" footLink="Reports" source="schwab" kind="cd_investment">
      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:26, letterSpacing:'-0.02em', padding:'2px 0 8px' }}>$4,542,548</div>
      <div>{rows.map((r,i)=>Row(r[0], r[1], 'a'+i))}</div>
      <div style={{ height:12 }} />
      <div>{rows2.map((r,i)=>Row(r[0], r[1], 'b'+i))}</div>
    </CDTile>
  );
}

/* 4. Left sidebar column — General + Activities + Opportunities, single scrollable container */
function ClientSidebar({ onBack, highlightOpp }) {
  const sectionHead = {
    display:'flex', alignItems:'center', padding:'16px 0 8px',
  };
  return (
    <div style={{
      height:'calc(100vh - 88px)', overflowY:'auto', overflowX:'hidden',
      borderRight:'1px solid rgb(75,85,99)',
      color:'rgb(249,250,251)',
      padding:'0 24px',
    }} className="cd-sidebar-scroll">
      {/* General section */}
      <div style={sectionHead}>
        <div style={CD_TITLE}>General</div>
        <button data-no-hint style={{ marginLeft:'auto', background:'transparent', border:'none', color:'rgb(163,163,163)', cursor:'pointer', width:24, height:24, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-gear" style={{ width:14, height:14 }} />
        </button>
      </div>
      <div style={{ padding:'0 0 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:44, height:44, borderRadius:9999,
            background:'linear-gradient(135deg,#f0abfc,#c084fc)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:700, fontSize:16, flexShrink:0,
            border:'1px solid rgba(255,255,255,0.15)',
          }}>D</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600 }}>David Young</div>
          </div>
          <div style={{ fontFamily:'Inter', fontSize:22, fontWeight:300, color:'rgb(163,163,163)' }}>59</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:12, fontFamily:'Inter', fontSize:12, color:'rgb(209,213,219)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <i className="fa-solid fa-envelope" style={{ width:12, height:12, color:'rgb(163,163,163)' }} />
            <span>joe.smith@gmail.com</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <i className="fa-solid fa-phone" style={{ width:12, height:12, color:'rgb(163,163,163)' }} />
            <span>215-555-5555</span>
          </div>
        </div>
        <button data-no-hint style={{
          width:'100%', marginTop:14, height:34, borderRadius:8,
          background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)',
          color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:12.5, fontWeight:500, cursor:'pointer',
        }}>Schedule Appointment</button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('share:open', { detail:{ client:'David Young', email:'joe.smith@gmail.com', phone:'215-555-5555' } }))}
          data-no-hint
          style={{
            width:'100%', marginTop:8, height:34, borderRadius:8,
            background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)',
            color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:12.5, fontWeight:500, cursor:'pointer',
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
          <i className="fa-solid fa-share-nodes" style={{ width:12, height:12 }} />
          Share with Client
        </button>
      </div>

      {/* Opportunities section */}
      <div style={{ ...sectionHead, borderTop:'1px solid rgba(75,85,99,0.5)', paddingTop:16 }}>
        <div style={CD_TITLE}>Opportunities</div>
      </div>
      <div style={{ padding:'0 0 16px', display:'flex', flexDirection:'column', gap:10 }}>
        <OppCard
          title="Portfolio Enhancement"
          body="Implementing APME for 15% of fixed income allocation"
        />
        <OppCard
          title="Rebalancing Opportunity"
          body="Consider reducing your fixed income allocation from 22% to the target 15% and increase international equity exposure to 20%. This adjustment would better align with your risk tolerance and long-term growth objectives."
          highlight={highlightOpp === 'rebalance'}
        />
      </div>

      {/* Activities section */}
      <div style={{ ...sectionHead, borderTop:'1px solid rgba(75,85,99,0.5)', paddingTop:16 }}>
        <div style={CD_TITLE}>Activities</div>
        <button data-no-hint style={{ marginLeft:'auto', background:'transparent', border:'none', color:'rgb(163,163,163)', cursor:'pointer', width:24, height:24, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-ellipsis" style={{ width:14, height:14 }} />
        </button>
      </div>
      <div style={{ padding:'0 0 16px', display:'flex', flexDirection:'column' }}>
        <ActivityRow icon="file-invoice-dollar" iconColor="rgb(5,122,85)" title="Billed Q4 Advisory Fee" meta="$2,648 · Nov 18, 2025" />
        <ActivityRow icon="file-lines" iconColor="rgb(56,189,248)" title="Quarterly Report Created" meta="Q3 Performance · Nov 12, 2025" />
        <ActivityRow icon="envelope" iconColor="rgb(163,163,163)" title="Email Sent" meta="Portfolio Rebalance Review · Nov 5, 2025" />
        <ActivityRow icon="file-lines" iconColor="rgb(56,189,248)" title="Tax Summary Report Created" meta="2025 YTD Estimate · Oct 28, 2025" />
        <ActivityRow icon="file-invoice-dollar" iconColor="rgb(5,122,85)" title="Billed Q3 Advisory Fee" meta="$2,591 · Aug 22, 2025" last />
      </div>
    </div>
  );
}

function CustodianRow({ source, label, amount, muted }) {
  const meta = (window.SOURCE_META || {})[source] || { name: source, dot: 'rgb(107,114,128)' };
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'9px 10px', borderRadius:8,
      border:'1px solid rgba(75,85,99,0.6)',
      background: muted ? 'transparent' : 'rgba(255,255,255,0.03)',
    }}>
      <div style={{
        width:26, height:26, borderRadius:6, flexShrink:0,
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(75,85,99,0.7)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ width:9, height:9, borderRadius:9, background: meta.dot }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, color:'rgb(229,231,235)' }}>{meta.name}</div>
        <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
      </div>
      <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, fontVariantNumeric:'tabular-nums', color: muted ? 'rgb(163,163,163)' : 'rgb(229,231,235)' }}>{amount}</div>
    </div>
  );
}

function ActivityRow({ icon, iconColor, title, meta, last }) {
  return (
    <div style={{
      display:'flex', gap:10, alignItems:'flex-start',
      padding:'10px 0', borderBottom: last ? 'none' : '1px solid rgba(75,85,99,0.4)',
    }}>
      <div style={{
        width:28, height:28, borderRadius:8, flexShrink:0,
        background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.6)',
        display:'inline-flex', alignItems:'center', justifyContent:'center', color:iconColor,
      }}>
        <i className={`fa-solid fa-${icon}`} style={{ width:13, height:13 }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:500, color:'rgb(229,231,235)' }}>{title}</div>
        <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', marginTop:2 }}>{meta}</div>
      </div>
    </div>
  );
}
function OppCard({ title, body, highlight }) {
  const isRebalance = title === 'Rebalancing Opportunity';
  return (
    <div style={{
      border: highlight ? '1px solid rgb(16,185,129)' : '1px solid rgba(75,85,99,0.6)',
      borderRadius:10,
      background: highlight ? 'rgba(5,122,85,0.08)' : 'rgba(255,255,255,0.02)',
      padding:'12px 12px',
      boxShadow: highlight ? '0 0 0 3px rgba(16,185,129,0.18), 0 8px 24px rgba(5,122,85,0.18)' : 'none',
      animation: highlight ? 'opp-glow 2.4s ease-in-out infinite' : 'none',
      transition:'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
    }}>
      <style>{`
        @keyframes opp-glow {
          0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.18), 0 8px 24px rgba(5,122,85,0.18); }
          50%      { box-shadow: 0 0 0 6px rgba(16,185,129,0.30), 0 8px 24px rgba(5,122,85,0.32); }
        }
      `}</style>
      <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, marginBottom:4 }}>{title}</div>
      <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', lineHeight:1.45 }}>{body}</div>
      <div style={{ display:'flex', alignItems:'center', marginTop:10, gap:10 }}>
        <button
          onClick={isRebalance ? () => window.dispatchEvent(new CustomEvent('rebalance:open')) : undefined}
          data-no-hint={isRebalance ? undefined : true}
          style={{
            height:26, padding:'0 12px', borderRadius:7,
            background: highlight ? 'rgb(5,122,85)' : 'rgba(5,122,85,0.2)',
            border: highlight ? '1px solid rgb(16,185,129)' : '1px solid rgba(5,122,85,0.5)',
            color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:11, fontWeight:600, cursor:'pointer',
        }}>Execute</button>
      </div>
    </div>
  );
}

/* 5. Performance — grouped bar chart + period-aware summary */
const PERF_BY_PERIOD = {
  'Today':          { metrics:[ {k:'1D Return', v:'0.18%', dir:'up'},   {k:'Bench',  v:'0.11%', dir:'up'}, {k:'Alpha', v:'0.07%', dir:'up'}   ] },
  'This week':      { metrics:[ {k:'1W Return', v:'1.04%', dir:'up'},   {k:'Bench',  v:'0.82%', dir:'up'}, {k:'Alpha', v:'0.22%', dir:'up'}   ] },
  'This month':     { metrics:[ {k:'MTD',       v:'3.42%', dir:'up'},   {k:'Bench',  v:'2.91%', dir:'up'}, {k:'Alpha', v:'0.51%', dir:'up'}   ] },
  'This quarter':   { metrics:[ {k:'QTD',       v:'13.19%',dir:'up'},   {k:'Bench',  v:'9.84%', dir:'up'}, {k:'Alpha', v:'3.35%', dir:'up'}   ] },
  'Year to date':   { metrics:[ {k:'YTD',       v:'12.69%',dir:'up'},   {k:'Bench',  v:'14.21%',dir:'up'}, {k:'Alpha', v:'1.52%', dir:'down'} ] },
  'Last 12 months': { metrics:[ {k:'12-month',  v:'18.42%',dir:'up'},   {k:'Bench',  v:'16.84%',dir:'up'}, {k:'Alpha', v:'1.58%', dir:'up'}   ] },
  'All time':       { metrics:[ {k:'ITD',       v:'68.10%',dir:'up'},   {k:'Bench',  v:'52.40%',dir:'up'}, {k:'Alpha', v:'15.7%', dir:'up'}   ] },
};

function Performance() {
  const period = React.useContext(window.PeriodContext || React.createContext('Year to date'));
  const cfg = PERF_BY_PERIOD[period] || PERF_BY_PERIOD['Year to date'];
  const opts = React.useMemo(() => ({
    chart:{ type:'column', height:210, backgroundColor:'transparent', spacing:[8,4,4,4] },
    xAxis:{ categories:['QTD','YTD','ITD'], lineColor:'rgba(75,85,99,0.5)', labels:{ style:{ color:'rgb(163,163,163)', fontSize:'10px' } } },
    yAxis:{
      min:-50, max:50, tickInterval:50,
      gridLineColor:'rgba(75,85,99,0.3)',
      labels:{ formatter: function(){ return this.value + '%'; }, style:{ color:'rgb(163,163,163)', fontSize:'10px' } },
      title:{ text:null }, plotLines:[{ value:0, color:'rgba(75,85,99,0.8)', width:1 }],
    },
    plotOptions:{ column:{ borderWidth:1.5, pointPadding:0.08, groupPadding:0.12, borderRadius:3 } },
    series:[
      { name:'TWRR',  data:[ 28, 15, 42 ], color:'rgba( 94,214,164,0.55)', borderColor:'rgb( 94,214,164)' },
      { name:'MMkt',  data:[ 12,  8, 22 ], color:'rgba(120,160,230,0.55)', borderColor:'rgb(120,160,230)' },
      { name:'SP500', data:[ 22, 10, 38 ], color:'rgba(245,200, 90,0.55)', borderColor:'rgb(245,200, 90)' },
      { name:'Bond',  data:[  6,  4, 10 ], color:'rgba(180,150,235,0.55)', borderColor:'rgb(180,150,235)' },
    ],
    legend:{ enabled:false }, tooltip:{ valueSuffix:'%' }, credits:{ enabled:false },
  }), []);
  const Dot = ({c,label}) => (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'Inter', fontSize:11, color:'rgb(209,213,219)' }}>
      <span style={{ width:8, height:8, borderRadius:9999, background:c }} /> {label}
    </span>
  );
  return (
    <CDTile title="Performance" footLink="Reports" source="pershing" kind="cd_performance">
      <div style={{ display:'flex', gap:12, padding:'2px 0 6px' }}>
        <Dot c="rgb( 94,214,164)" label="TWRR" />
        <Dot c="rgb(120,160,230)" label="MMkt" />
        <Dot c="rgb(245,200, 90)" label="SP500" />
        <Dot c="rgb(180,150,235)" label="Bond" />
      </div>
      <div style={{ flex:1, minHeight:210 }}><HC options={opts} /></div>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, padding:'8px 0 6px',
        borderTop:'1px solid rgba(75,85,99,0.5)',
      }}>
        {cfg.metrics.map((m,i)=>{
          const c = m.dir === 'up' ? 'rgb(5,122,85)' : 'rgb(248,113,113)';
          return (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>{m.k}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'Inter', fontSize:13, fontWeight:600, color:c }}>
                <i className={`fa-solid fa-arrow-${m.dir}`} style={{ width:10, height:10 }} />
                {m.v}
              </div>
            </div>
          );
        })}
      </div>
    </CDTile>
  );
}

/* 6. Unrealized */
function Unrealized() {
  const Row = ({ label, gain, loss }) => (
    <div style={{ padding:'12px 0', borderTop:'1px solid rgba(75,85,99,0.45)' }}>
      <div style={{ fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)', marginBottom:6 }}>{label}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:22, fontWeight:700, color:'rgb(5,122,85)', letterSpacing:'-0.02em' }}>
            <i className="fa-solid fa-arrow-up" style={{ width:14, height:14 }} />
            {gain}
          </div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Gains</div>
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:22, fontWeight:700, color:'rgb(248,113,113)', letterSpacing:'-0.02em' }}>
            <i className="fa-solid fa-arrow-down" style={{ width:14, height:14 }} />
            {loss}
          </div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Losses</div>
        </div>
      </div>
    </div>
  );
  return (
    <CDTile title="Unrealized" footLink="Reports" source="fidelity" kind="cd_unrealized">
      <Row label="Unrealized Total" gain="$199,195" loss="$ -7,195" />
      <Row label="Long Term"        gain="$142,650" loss="$0" />
      <Row label="Short Term"       gain="$56,545"  loss="$ -7,195" />
    </CDTile>
  );
}

/* 7. Tax Summary */
function TaxSummary() {
  const rows = [
    ['Federal (32% bracket)', '$121,840',  'rgb(248,113,113)'],
    ['PA State (3.07%)',      '$18,781',   'rgb(249,250,251)'],
    ['Long-Term Capital Gains','$21,397',  'rgb(249,250,251)'],
    ['Tax-Loss Harvest Available','-$7,195','rgb(5,122,85)'],
  ];
  return (
    <CDTile title="Tax Summary" footLink="Reports" source="internal" kind="cd_tax" footLabel="Tax Year 2026 · Est. from 1099 & realized G/L">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <div />
        <div style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)' }}>Tax Year 2026 · YTD Est.</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Total Liability</div>
          <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:22, letterSpacing:'-0.02em' }}>$184,320</div>
        </div>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Effective Rate</div>
          <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:22, color:'rgb(234,179,8)', letterSpacing:'-0.02em' }}>30.1%</div>
        </div>
      </div>
      {rows.map((r,i)=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderTop:'1px solid rgba(75,85,99,0.45)', fontFamily:'Inter', fontSize:12.5 }}>
          <span style={{ color:'rgb(209,213,219)' }}>{r[0]}</span>
          <span style={{ color:r[2], fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{r[1]}</span>
        </div>
      ))}
    </CDTile>
  );
}

/* Root */
function ClientDetail({ clientName='David Young', onBack, highlightOpp, tab: tabProp, onTabChange, period: periodProp, setPeriod: setPeriodProp }) {
  const [tabInternal, setTabInternal] = React.useState('Profile');
  const [periodInternal, setPeriodInternal] = React.useState('Year to date');
  const tab = tabProp != null ? tabProp : tabInternal;
  const setTab = onTabChange || setTabInternal;
  const period = periodProp != null ? periodProp : periodInternal;
  const setPeriod = setPeriodProp || setPeriodInternal;
  // Scroll the highlighted opportunity into view when it activates
  React.useEffect(() => {
    if (highlightOpp) setTab('Profile');
  }, [highlightOpp]);
  const Provider = (window.PeriodContext && window.PeriodContext.Provider) || React.Fragment;
  const providerProps = window.PeriodContext ? { value: period } : {};
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
      <CDTabs active={tab} onChange={setTab} period={period} setPeriod={setPeriod} />
      {tab === 'Profile' && (
        <Provider {...providerProps}>
          <div style={{ display:'grid', gridTemplateColumns:'minmax(320px, 400px) minmax(0, 1fr)', alignItems:'stretch' }}>
            <ClientSidebar onBack={onBack} highlightOpp={highlightOpp} />
            <div style={{ padding:'16px 24px 32px', display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
                <NetWorth />
                <AssetAllocation />
                <InvestmentOverview />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
                <Performance />
                <Unrealized />
                <TaxSummary />
              </div>
            </div>
          </div>
        </Provider>
      )}
      {tab === 'Reports' && window.ClientReports && <ClientReports />}
      {tab === 'Billing' && (
        <div style={{ padding:'40px 24px', color:'rgb(163,163,163)', fontFamily:'Inter', fontSize:13, textAlign:'center' }}>
          Billing view coming soon.
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ClientDetail });
