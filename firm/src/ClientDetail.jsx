/* Client Detail — David Young.
   Ported from Advisor Dashboard layout: tabs (Dashboard/Reports/Billing),
   left sidebar rail (General + Activities + Opportunities), 3x2 tile grid. */

const CD_GREEN  = 'rgb(35,89,255)';
const CD_GREEN_BRIGHT = 'rgb(84,121,240)';
const CD_RED    = 'rgb(248,113,113)';
const CD_BORDER = 'rgba(75,85,99,0.5)';

const CD_TILE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgb(75,85,99)',
  borderRadius: 14,
  color: 'rgb(249,250,251)',
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
  backdropFilter: 'blur(12px) saturate(140%)',
  WebkitBackdropFilter: 'blur(12px) saturate(140%)',
};
const CD_HEAD = { display:'flex', alignItems:'center', padding:'14px 16px 6px' };
const CD_TITLE = { fontFamily:'Inter', fontWeight:600, fontSize:14, letterSpacing:'-0.01em', color:'rgb(249,250,251)' };
const CD_FOOT = {
  display:'flex', alignItems:'center', justifyContent:'space-between',
  padding:'10px 16px', borderTop:'1px solid rgba(75,85,99,0.55)',
  fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)', marginTop:'auto',
};
const CD_SEE = {
  display:'inline-flex', alignItems:'center', gap:4,
  color: CD_GREEN_BRIGHT, textDecoration:'none', fontSize:11.5, fontWeight:500, cursor:'pointer',
};

function CDTile({ title, children, footLink='Reports', style, showFoot=true }) {
  return (
    <div style={{ ...CD_TILE, ...style }}>
      {title && (
        <div style={CD_HEAD}>
          <div style={CD_TITLE}>{title}</div>
          <button style={{
            marginLeft:'auto', background:'transparent', border:'none', color:'rgb(163,163,163)',
            cursor:'pointer', width:24, height:24, borderRadius:6,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}><i className="fa-solid fa-ellipsis" style={{ fontSize:13 }} /></button>
        </div>
      )}
      <div style={{ padding:'0 16px 10px', flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
        {children}
      </div>
      {showFoot && (
        <div style={CD_FOOT}>
          <span>As of Today</span>
          <a style={CD_SEE}>{footLink} <i className="fa-solid fa-chevron-right" style={{ fontSize:9 }} /></a>
        </div>
      )}
    </div>
  );
}

/* Sub-tabs under topbar */
function CDTabs({ active, onChange }) {
  const tabs = ['Dashboard','Reports','Billing'];
  return (
    <div style={{
      display:'flex', gap:18, padding:'12px 24px 0',
      borderBottom:'1px solid rgba(75,85,99,0.5)',
    }}>
      {tabs.map(t => (
        <button key={t} onClick={()=>onChange(t)} style={{
          background:'transparent', border:'none', cursor:'pointer',
          padding:'8px 2px 10px',
          borderBottom: active===t ? `2px solid ${CD_GREEN}` : '2px solid transparent',
          color: active===t ? 'rgb(249,250,251)' : 'rgb(163,163,163)',
          fontFamily:'Inter', fontSize:12.5, fontWeight: active===t ? 600 : 500,
          marginBottom:-1,
        }}>{t}</button>
      ))}
    </div>
  );
}

/* 1. Net Worth */
function NetWorth() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const series = [5620,5680,5740,5810,5760,5830,5880,5920,5975,6020,6080,6124];
  const opts = React.useMemo(() => ({
    chart: { type:'area', height:150, spacing:[4,4,4,4], backgroundColor:'transparent' },
    xAxis: {
      categories: months,
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
        fillColor: { linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(35,89,255,0.4)'],[1,'rgba(35,89,255,0)']] },
        lineWidth:2.5, color: CD_GREEN,
        marker:{ enabled:false, states:{ hover:{ enabled:true, radius:4 } } },
      },
    },
    series:[{ name:'Net Worth', data: series }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  return (
    <CDTile title="Net Worth" footLink="Facts">
      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:28, letterSpacing:'-0.02em', padding:'2px 0 8px' }}>$6,124,145</div>
      <div style={{ minHeight:150 }}><HC options={opts} /></div>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 0 10px', fontFamily:'Inter', fontSize:12 }}>
        <i className="fa-solid fa-arrow-up" style={{ fontSize:11, color: CD_GREEN_BRIGHT }} />
        <span style={{ color: CD_GREEN_BRIGHT, fontWeight:600 }}>1.5%</span>
        <span style={{ color:'rgb(163,163,163)' }}>up this month</span>
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

/* 2. Asset Allocation */
function AssetAllocation() {
  const data = [
    { name:'Domestic Stock Funds',  y:40, color:'rgb(168,185,241)',  amt:'$2,100,000 (40%)' },
    { name:'Bond Funds',            y:35, color:'rgb(120,160,230)', amt:'$1,837,500 (35%)' },
    { name:'International Equities',y:25, color:'rgb(180,150,235)', amt:'$1,312,500' },
  ];
  // Donut convention: 45% transparent fill + full-opacity hue as the slice
  // highlight border.
  const opts = React.useMemo(() => ({
    chart:{ type:'pie', height:220, backgroundColor:'transparent', spacing:[4,4,4,4] },
    tooltip:{ pointFormat:'<b>{point.percentage:.0f}%</b>' },
    plotOptions:{
      pie:{
        innerSize:'68%', dataLabels:{enabled:false},
        states:{hover:{halo:null, brightness:0.05}},
      },
    },
    series:[{ data: data.map(d => ({
      name:d.name, y:d.y,
      color: d.color.replace('rgb(', 'rgba(').replace(')', ',0.45)'),
      borderColor: d.color, borderWidth: 1.5,
    })) }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  return (
    <CDTile title="Asset Allocation" footLink="Reports">
      <div style={{ flex:1, minHeight:220 }}><HC options={opts} /></div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, padding:'8px 0 6px' }}>
        {data.map((d,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'Inter', fontSize:11.5 }}>
            <span style={{ width:7, height:7, borderRadius:9999, background:d.color }} />
            <span style={{ color:'rgb(229,231,235)', flex:1 }}>{d.name}</span>
            <span style={{ color:'rgb(163,163,163)', fontVariantNumeric:'tabular-nums' }}>{d.amt}</span>
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
    <CDTile title="Investment Overview" footLink="Reports">
      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:26, letterSpacing:'-0.02em', padding:'2px 0 8px' }}>$4,542,548</div>
      <div>{rows.map((r,i)=>Row(r[0], r[1], 'a'+i))}</div>
      <div style={{ height:12 }} />
      <div>{rows2.map((r,i)=>Row(r[0], r[1], 'b'+i))}</div>
    </CDTile>
  );
}

/* Left sidebar — General + Activities + Opportunities */
function ClientSidebar({ highlightOpp }) {
  const sectionHead = { display:'flex', alignItems:'center', padding:'16px 0 8px' };
  return (
    <div style={{
      height:'calc(100vh - 56px - 45px)', overflowY:'auto', overflowX:'hidden',
      borderRight:'1px solid rgb(75,85,99)',
      color:'rgb(249,250,251)',
      padding:'0 24px',
    }} className="scroll-thin">
      {/* General */}
      <div style={sectionHead}>
        <div style={CD_TITLE}>General</div>
        <button style={{ marginLeft:'auto', background:'transparent', border:'none', color:'rgb(163,163,163)', cursor:'pointer', width:24, height:24, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-gear" style={{ fontSize:13 }} />
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
            <i className="fa-solid fa-envelope" style={{ fontSize:11, color:'rgb(163,163,163)', width:12 }} />
            <span>joe.smith@gmail.com</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <i className="fa-solid fa-phone" style={{ fontSize:11, color:'rgb(163,163,163)', width:12 }} />
            <span>215-555-5555</span>
          </div>
        </div>
        <button style={{
          width:'100%', marginTop:14, height:34, borderRadius:8,
          background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)',
          color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:12.5, fontWeight:500, cursor:'pointer',
        }}>Schedule Appointment</button>
      </div>

      {/* Activities */}
      <div style={{ ...sectionHead, borderTop:'1px solid rgba(75,85,99,0.5)', paddingTop:16 }}>
        <div style={CD_TITLE}>Activities</div>
        <button style={{ marginLeft:'auto', background:'transparent', border:'none', color:'rgb(163,163,163)', cursor:'pointer', width:24, height:24, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <i className="fa-solid fa-ellipsis" style={{ fontSize:13 }} />
        </button>
      </div>
      <div style={{ padding:'0 0 12px', display:'flex', flexDirection:'column' }}>
        <ActivityRow icon="file-invoice-dollar" iconColor={CD_GREEN_BRIGHT} title="Billed Q4 Advisory Fee" meta="$2,648 · Nov 18, 2025" />
        <ActivityRow icon="file-lines" iconColor="rgb(56,189,248)" title="Quarterly Report Created" meta="Q3 Performance · Nov 12, 2025" />
        <ActivityRow icon="envelope" iconColor="rgb(163,163,163)" title="Email Sent" meta="Portfolio Rebalance Review · Nov 5, 2025" />
        <ActivityRow icon="file-lines" iconColor="rgb(56,189,248)" title="Tax Summary Report Created" meta="2025 YTD Estimate · Oct 28, 2025" />
        <ActivityRow icon="file-invoice-dollar" iconColor={CD_GREEN_BRIGHT} title="Billed Q3 Advisory Fee" meta="$2,591 · Aug 22, 2025" last />
      </div>

      {/* Opportunities */}
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
        <i className={`fa-solid fa-${icon}`} style={{ fontSize:12 }} />
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
      border: highlight ? `1px solid ${CD_GREEN_BRIGHT}` : '1px solid rgba(75,85,99,0.6)',
      borderRadius:10,
      background: highlight ? 'rgba(35,89,255,0.08)' : 'rgba(255,255,255,0.02)',
      padding:'12px 12px',
      boxShadow: highlight ? '0 0 0 3px rgba(84,121,240,0.18), 0 8px 24px rgba(35,89,255,0.18)' : 'none',
      animation: highlight ? 'opp-glow 2.4s ease-in-out infinite' : 'none',
      transition:'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
    }}>
      <style>{`
        @keyframes opp-glow {
          0%, 100% { box-shadow: 0 0 0 3px rgba(84,121,240,0.18), 0 8px 24px rgba(35,89,255,0.18); }
          50%      { box-shadow: 0 0 0 6px rgba(84,121,240,0.30), 0 8px 24px rgba(35,89,255,0.32); }
        }
      `}</style>
      <div style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:600, marginBottom:4 }}>{title}</div>
      <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', lineHeight:1.45 }}>{body}</div>
      <div style={{ display:'flex', alignItems:'center', marginTop:10, gap:10 }}>
        <button
          onClick={isRebalance ? () => window.dispatchEvent(new CustomEvent('rebalance:open')) : undefined}
          style={{
            height:26, padding:'0 12px', borderRadius:7,
            background: highlight ? CD_GREEN : 'rgba(35,89,255,0.2)',
            border: highlight ? `1px solid ${CD_GREEN_BRIGHT}` : '1px solid rgba(35,89,255,0.5)',
            color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:11, fontWeight:600, cursor:'pointer',
        }}>Execute</button>
      </div>
    </div>
  );
}

/* 4. Performance */
function Performance() {
  const opts = React.useMemo(() => ({
    chart:{ type:'column', height:210, backgroundColor:'transparent', spacing:[8,4,4,4] },
    xAxis:{ categories:['QTD','YTD','ITD'], lineColor:'rgba(75,85,99,0.5)', labels:{ style:{ color:'rgb(163,163,163)', fontSize:'10px' } } },
    yAxis:{
      min:-50, max:50, tickInterval:50,
      gridLineColor:'rgba(75,85,99,0.3)',
      labels:{ formatter: function(){ return this.value + '%'; }, style:{ color:'rgb(163,163,163)', fontSize:'10px' } },
      title:{ text:null }, plotLines:[{ value:0, color:'rgba(75,85,99,0.8)', width:1 }],
    },
    plotOptions:{ column:{ borderWidth:1.5, pointPadding:0.08, groupPadding:0.12, borderRadius:2 } },
    series:[
      { name:'TWRR',  data:[ 28, 15, 42 ], color:'rgba(35,89,255,0.45)',   borderColor:'rgb(35,89,255)' },
      { name:'MMkt',  data:[ 12,  8, 22 ], color:'rgba(37,99,235,0.45)',   borderColor:'rgb(37,99,235)' },
      { name:'SP500', data:[ 22, 10, 38 ], color:'rgba(234,179,8,0.45)',   borderColor:'rgb(234,179,8)' },
      { name:'Bond',  data:[  6,  4, 10 ], color:'rgba(120,160,255,0.45)',  borderColor:'rgb(120,160,255)' },
    ],
    legend:{ enabled:false }, tooltip:{ valueSuffix:'%' }, credits:{ enabled:false },
  }), []);
  const Dot = ({c,label}) => (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'Inter', fontSize:11, color:'rgb(209,213,219)' }}>
      <span style={{ width:8, height:8, borderRadius:9999, background:c }} /> {label}
    </span>
  );
  return (
    <CDTile title="Performance" footLink="Reports">
      <div style={{ display:'flex', gap:12, padding:'2px 0 6px' }}>
        <Dot c={CD_GREEN}        label="TWRR" />
        <Dot c="rgb(37,99,235)"  label="MMkt" />
        <Dot c="rgb(234,179,8)"  label="SP500" />
        <Dot c="rgb(120,160,255)" label="Bond" />
      </div>
      <div style={{ flex:1, minHeight:210 }}><HC options={opts} /></div>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, padding:'8px 0 6px',
        borderTop:'1px solid rgba(75,85,99,0.5)',
      }}>
        {[
          { k:'QTD', v:'13.19%', dir:'up',   c: CD_GREEN_BRIGHT },
          { k:'YTD', v:'12.69%', dir:'down', c: CD_RED },
          { k:'ITD', v:'7.69%',  dir:'up',   c: CD_GREEN_BRIGHT },
        ].map((m,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>{m.k}</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'Inter', fontSize:13, fontWeight:600, color:m.c }}>
              <i className={`fa-solid fa-arrow-${m.dir}`} style={{ fontSize:10 }} />
              {m.v}
            </div>
          </div>
        ))}
      </div>
    </CDTile>
  );
}

/* 5. Unrealized */
function Unrealized() {
  const Row = ({ label, gain, loss }) => (
    <div style={{ padding:'12px 0', borderTop:'1px solid rgba(75,85,99,0.45)' }}>
      <div style={{ fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)', marginBottom:6 }}>{label}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:22, fontWeight:700, color: CD_GREEN_BRIGHT, letterSpacing:'-0.02em' }}>
            <i className="fa-solid fa-arrow-up" style={{ fontSize:13 }} />
            {gain}
          </div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Gains</div>
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:22, fontWeight:700, color: CD_RED, letterSpacing:'-0.02em' }}>
            <i className="fa-solid fa-arrow-down" style={{ fontSize:13 }} />
            {loss}
          </div>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>Losses</div>
        </div>
      </div>
    </div>
  );
  return (
    <CDTile title="Unrealized" footLink="Reports">
      <Row label="Unrealized Total" gain="$199,195" loss="$ -7,195" />
      <Row label="Long Term"        gain="$142,650" loss="$0" />
      <Row label="Short Term"       gain="$56,545"  loss="$ -7,195" />
    </CDTile>
  );
}

/* 6. Tax Summary */
function TaxSummary() {
  const rows = [
    ['Federal (32% bracket)',     '$121,840',  CD_RED],
    ['PA State (3.07%)',          '$18,781',   'rgb(249,250,251)'],
    ['Long-Term Capital Gains',   '$21,397',   'rgb(249,250,251)'],
    ['Tax-Loss Harvest Available','-$7,195',   CD_GREEN_BRIGHT],
  ];
  return (
    <CDTile title="Tax Summary" footLink="Reports">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <div />
        <div style={{ fontFamily:'Inter', fontSize:10.5, color:'rgb(163,163,163)' }}>2025 Est.</div>
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

/* Page entry */
function ClientDetailPage() {
  const [tab, setTab] = React.useState('Dashboard');
  const [highlightOpp, setHighlightOpp] = React.useState(null);

  React.useEffect(() => {
    try {
      const h = localStorage.getItem('firm.cd.highlight');
      if (h) {
        setHighlightOpp(h);
        localStorage.removeItem('firm.cd.highlight');
        setTimeout(() => setHighlightOpp(null), 6000);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="page-fade" style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
      <CDTabs active={tab} onChange={setTab} />
      {tab === 'Dashboard' && (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(320px, 400px) minmax(0, 1fr)', alignItems:'stretch' }}>
          <ClientSidebar highlightOpp={highlightOpp} />
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
      )}
      {tab === 'Reports' && window.ClientReports ? <window.ClientReports /> : tab === 'Reports' && (
        <div style={{ padding:'40px 24px', color:'rgb(163,163,163)', fontFamily:'Inter', fontSize:13, textAlign:'center' }}>
          Reports view coming soon.
        </div>
      )}
      {tab === 'Billing' && (
        <div style={{ padding:'40px 24px', color:'rgb(163,163,163)', fontFamily:'Inter', fontSize:13, textAlign:'center' }}>
          Billing view coming soon.
        </div>
      )}
    </div>
  );
}

window.ClientDetailPage = ClientDetailPage;
