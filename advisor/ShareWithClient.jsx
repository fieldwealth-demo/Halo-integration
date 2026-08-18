/* ShareWithClient — secure client-portal share flow.
   Triggered by the "Share with Client" button on a client's Profile tab.
   Listens for window event 'share:open' (detail: { client, email, phone }).

   Left  : secure-link configuration + send action (live ties to the preview).
   Right : a real iPhone preview of the client's mobile portal — the same
           right-side profile tiles, tappable into detail screens.

   Icons are inline Lucide-style SVG (the page's fa-* shim only covers a subset,
   so anything outside it would render as a square — we avoid the shim entirely). */

/* ── advisory firm (client-facing brand — edit here) ───────────────── */
const ADV_FIRM = 'Meridian Wealth Partners';
const ADV_NAME = 'Avery Chen';
const ADV_ROLE = 'Senior Advisor';

/* ── shared tokens ─────────────────────────────────────────────────── */
const SW_GREEN  = 'rgb(5,122,85)';
const SW_GREENB = 'rgb(16,185,129)';
const SW_INK    = 'rgb(249,250,251)';
const SW_MUTE   = 'rgb(163,163,163)';
const SW_SUB    = 'rgb(209,213,219)';
const SW_LINE   = 'rgba(75,85,99,0.55)';
const SW_CARD   = 'rgba(255,255,255,0.05)';

/* ── inline Lucide icons ───────────────────────────────────────────── */
const SW_ICONS = {
  share:        "<circle cx='18' cy='5' r='3'/><circle cx='6' cy='12' r='3'/><circle cx='18' cy='19' r='3'/><line x1='8.59' y1='13.51' x2='15.42' y2='17.49'/><line x1='15.41' y1='6.51' x2='8.59' y2='10.49'/>",
  lock:         "<rect width='18' height='11' x='3' y='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/>",
  wallet:       "<path d='M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 1-1 1v-2'/><path d='M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'/>",
  pie:          "<path d='M21.21 15.89A10 10 0 1 1 8 2.83'/><path d='M22 12A10 10 0 0 0 12 2v10z'/>",
  line:         "<path d='M3 3v18h18'/><path d='m19 9-5 5-4-4-3 3'/>",
  landmark:     "<line x1='3' x2='21' y1='22' y2='22'/><line x1='6' x2='6' y1='18' y2='11'/><line x1='10' x2='10' y1='18' y2='11'/><line x1='14' x2='14' y1='18' y2='11'/><line x1='18' x2='18' y1='18' y2='11'/><polygon points='12 2 20 7 4 7'/>",
  trendUp:      "<polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/>",
  receipt:      "<path d='M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z'/><path d='M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8'/><path d='M12 17.5v-11'/>",
  chevronRight: "<path d='m9 18 6-6-6-6'/>",
  chevronLeft:  "<path d='m15 18-6-6 6-6'/>",
  arrowUp:      "<path d='M12 19V5'/><path d='m5 12 7-7 7 7'/>",
  arrowDown:    "<path d='M12 5v14'/><path d='m19 12-7 7-7-7'/>",
  eye:          "<path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/>",
  clock:        "<circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/>",
  shield:       "<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/><path d='m9 12 2 2 4-4'/>",
  circleCheck:  "<circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/>",
  circle:       "<circle cx='12' cy='12' r='10'/>",
  send:         "<path d='M22 2 11 13'/><path d='M22 2 15 22l-4-9-9-4Z'/>",
  check:        "<polyline points='20 6 9 17 4 12'/>",
  copy:         "<rect width='14' height='14' x='8' y='8' rx='2' ry='2'/><path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'/>",
  refresh:      "<path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'/><path d='M21 3v5h-5'/>",
  smartphone:   "<rect width='14' height='20' x='5' y='2' rx='2' ry='2'/><path d='M12 18h.01'/>",
  x:            "<path d='M18 6 6 18'/><path d='m6 6 12 12'/>",
};
function Icon({ name, size=14, color='currentColor', strokeWidth=2, style }) {
  const inner = SW_ICONS[name] || '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display:'block', flexShrink:0, ...style }}
      dangerouslySetInnerHTML={{ __html: inner }} />
  );
}

/* firm monogram mark */
function FirmMark({ size=26, radius=7 }) {
  return (
    <span style={{ width:size, height:size, borderRadius:radius, flexShrink:0,
      background:'linear-gradient(135deg, rgb(16,185,129), rgb(5,122,85))',
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontFamily:'Inter', fontWeight:700, fontSize:size*0.5, letterSpacing:'-0.02em' }}>
      {ADV_FIRM[0]}
    </span>
  );
}

/* ── tile registry — drives both the section toggles and the phone ──── */
const SW_SECTIONS = [
  { key:'networth',   label:'Net Worth',           icon:'wallet' },
  { key:'allocation', label:'Asset Allocation',    icon:'pie' },
  { key:'performance',label:'Performance',         icon:'line' },
  { key:'investment', label:'Investment Overview', icon:'landmark' },
  { key:'unrealized', label:'Unrealized Gains',    icon:'trendUp' },
  { key:'tax',        label:'Tax Summary',         icon:'receipt' },
];

/* ════════════════════════════════════════════════════════════════════
   MOBILE PORTAL — what the client sees on their phone
   ════════════════════════════════════════════════════════════════════ */
const MP_BG    = 'rgb(11,13,17)';
const MP_TILE  = 'rgb(20,24,31)';
const MP_BORDER= 'rgba(75,85,99,0.5)';

function MPCard({ icon, title, onTap, children }) {
  return (
    <div
      onClick={onTap}
      style={{
        background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:18,
        padding:'15px 16px 14px', cursor:'pointer', WebkitTapHighlightColor:'transparent',
      }}>
      <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:11 }}>
        <span style={{
          width:26, height:26, borderRadius:8, flexShrink:0,
          background:'rgba(5,122,85,0.16)', border:'1px solid rgba(16,185,129,0.35)',
          display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name={icon} size={13} color={SW_GREENB} /></span>
        <span style={{ flex:1, fontFamily:'Inter', fontSize:14, fontWeight:600, color:SW_INK }}>{title}</span>
        <Icon name="chevronRight" size={15} color={SW_MUTE} />
      </div>
      {children}
    </div>
  );
}

function MPStat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontFamily:'Inter', fontSize:11, color:SW_MUTE }}>{label}</div>
      <div style={{ fontFamily:'Inter', fontSize:19, fontWeight:700, letterSpacing:'-0.02em', color:color||SW_INK, fontVariantNumeric:'tabular-nums' }}>{value}</div>
    </div>
  );
}

/* mini area chart for net worth */
function MPSpark() {
  const opts = React.useMemo(() => ({
    chart:{ type:'area', height:108, backgroundColor:'transparent', margin:[6,2,20,2] },
    xAxis:{ categories:['Jan','Feb','Mar','Apr','May'], lineColor:'rgba(75,85,99,0.4)', tickLength:0,
      labels:{ style:{ color:'rgb(120,124,134)', fontSize:'9px' } } },
    yAxis:{ visible:false },
    tooltip:{ backgroundColor:'rgba(17,24,39,0.95)', borderColor:'rgb(75,85,99)', style:{ color:SW_INK, fontSize:'11px' },
      formatter:function(){ return `<b>${this.x}</b><br/>$${(this.y/1000).toFixed(2)}M`; } },
    plotOptions:{ area:{ fillColor:{ linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
      lineWidth:2, color:SW_GREEN, marker:{ enabled:false } } },
    series:[{ data:[5760,5830,5920,6020,6124] }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  return <div style={{ margin:'2px 0 4px' }}><HC options={opts} /></div>;
}

/* donut for allocation */
const MP_ALLOC = [
  { name:'Domestic Stock', y:35, dot:'rgb( 94,214,164)', fill:'rgba( 94,214,164,0.55)' },
  { name:'Bond Funds',     y:25, dot:'rgb(120,160,230)', fill:'rgba(120,160,230,0.55)' },
  { name:'International',   y:18, dot:'rgb(180,150,235)', fill:'rgba(180,150,235,0.55)' },
  { name:'Alternatives',   y:10, dot:'rgb(245,200, 90)', fill:'rgba(245,200, 90,0.55)' },
  { name:'Real Estate',    y:7,  dot:'rgb(240,140,120)', fill:'rgba(240,140,120,0.55)' },
  { name:'Cash',           y:5,  dot:'rgb(120,200,210)', fill:'rgba(120,200,210,0.55)' },
];
function MPDonut({ height=128 }) {
  const opts = React.useMemo(() => ({
    chart:{ type:'pie', height, backgroundColor:'transparent', margin:[2,2,2,2] },
    tooltip:{ pointFormat:'<b>{point.y}%</b>' },
    plotOptions:{ pie:{ innerSize:'66%', borderWidth:1.5, dataLabels:{ enabled:false } } },
    series:[{ data: MP_ALLOC.map(d => ({ name:d.name, y:d.y, color:d.fill, borderColor:d.dot })) }],
    legend:{ enabled:false }, credits:{ enabled:false },
  }), [height]);
  return <HC options={opts} />;
}

/* small grouped column for performance */
function MPPerfBars() {
  const opts = React.useMemo(() => ({
    chart:{ type:'column', height:124, backgroundColor:'transparent', margin:[8,2,20,2] },
    xAxis:{ categories:['QTD','YTD','ITD'], lineColor:'rgba(75,85,99,0.5)', tickLength:0,
      labels:{ style:{ color:'rgb(120,124,134)', fontSize:'9px' } } },
    yAxis:{ visible:false },
    plotOptions:{ column:{ borderWidth:1.2, pointPadding:0.06, groupPadding:0.18, borderRadius:2 } },
    series:[
      { name:'Portfolio', data:[13.2,12.7,68.1], color:'rgba( 94,214,164,0.6)', borderColor:'rgb( 94,214,164)' },
      { name:'S&P 500',   data:[9.8,14.2,52.4],  color:'rgba(245,200, 90,0.55)', borderColor:'rgb(245,200, 90)' },
    ],
    tooltip:{ valueSuffix:'%' }, legend:{ enabled:false }, credits:{ enabled:false },
  }), []);
  return <HC options={opts} />;
}

function MPRow({ k, v, color, first }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0',
      borderTop: first ? 'none' : `1px solid rgba(75,85,99,0.4)`, fontFamily:'Inter', fontSize:13 }}>
      <span style={{ color:SW_SUB }}>{k}</span>
      <span style={{ color:color||SW_INK, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{v}</span>
    </div>
  );
}

/* ── detail screens (one per tile) ─────────────────────────────────── */
function MPDetail({ section }) {
  const wrap = { display:'flex', flexDirection:'column', gap:14 };
  if (section === 'networth') {
    return (
      <div style={wrap}>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:12, color:SW_MUTE, marginBottom:7 }}>Total net worth</div>
          <div style={{ fontFamily:'Inter', fontSize:34, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1, color:SW_INK }}>$6,124,145</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'Inter', fontSize:13, color:SW_GREENB, fontWeight:600, marginTop:7 }}>
            <Icon name="arrowUp" size={12} color={SW_GREENB} />6.33% year to date</div>
        </div>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'14px 16px' }}>
          <MPSpark />
        </div>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'4px 16px 10px' }}>
          <MPRow k="Assets" v="$6,850,000" first />
          <MPRow k="Liabilities" v="$725,855" />
          <MPRow k="Cash on hand" v="$586,929" />
          <MPRow k="Net worth" v="$6,124,145" color={SW_GREENB} />
        </div>
      </div>
    );
  }
  if (section === 'allocation') {
    return (
      <div style={wrap}>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'10px 16px 14px' }}>
          <div style={{ height:170 }}><MPDonut height={170} /></div>
        </div>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'4px 16px 8px' }}>
          {MP_ALLOC.map((d,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 0',
              borderTop: i===0 ? 'none' : '1px solid rgba(75,85,99,0.4)', fontFamily:'Inter', fontSize:13 }}>
              <span style={{ width:9, height:9, borderRadius:9, background:d.dot, flexShrink:0 }} />
              <span style={{ flex:1, color:SW_SUB }}>{d.name}</span>
              <span style={{ color:SW_INK, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{d.y}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (section === 'performance') {
    const metrics = [['QTD','+13.19%'],['YTD','+12.69%'],['Since inception','+68.10%'],['Benchmark (S&P 500) YTD','+14.21%'],['Alpha YTD','-1.52%']];
    return (
      <div style={wrap}>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'12px 16px 14px' }}>
          <div style={{ display:'flex', gap:14, marginBottom:6 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:12, color:SW_SUB }}>
              <span style={{ width:8, height:8, borderRadius:9, background:'rgb( 94,214,164)' }} /> Portfolio</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:12, color:SW_SUB }}>
              <span style={{ width:8, height:8, borderRadius:9, background:'rgb(245,200, 90)' }} /> S&P 500</span>
          </div>
          <MPPerfBars />
        </div>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'4px 16px 10px' }}>
          {metrics.map((m,i) => (
            <MPRow key={i} k={m[0]} v={m[1]} color={m[1].startsWith('-') ? 'rgb(248,113,113)' : SW_GREENB} first={i===0} />
          ))}
        </div>
      </div>
    );
  }
  if (section === 'investment') {
    const rows = [['Stocks','$1,512,195'],['Non-custodied assets','$2,424,275'],['Cash','$586,929'],['Accrued income','$165,419'],['Inception date','Sep 8, 2020']];
    return (
      <div style={wrap}>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:12, color:SW_MUTE, marginBottom:7 }}>Total invested</div>
          <div style={{ fontFamily:'Inter', fontSize:34, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1, color:SW_INK }}>$4,542,548</div>
        </div>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'4px 16px 10px' }}>
          {rows.map((r,i) => <MPRow key={i} k={r[0]} v={r[1]} first={i===0} />)}
        </div>
      </div>
    );
  }
  if (section === 'unrealized') {
    const Block = ({ label, gain, loss }) => (
      <div style={{ padding:'14px 0', borderTop:'1px solid rgba(75,85,99,0.4)' }}>
        <div style={{ fontFamily:'Inter', fontSize:12, color:SW_MUTE, marginBottom:8 }}>{label}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:20, fontWeight:700, color:SW_GREENB }}>
              <Icon name="arrowUp" size={13} color={SW_GREENB} />{gain}</div>
            <div style={{ fontFamily:'Inter', fontSize:11, color:SW_MUTE }}>Gains</div>
          </div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:20, fontWeight:700, color:'rgb(248,113,113)' }}>
              <Icon name="arrowDown" size={13} color="rgb(248,113,113)" />{loss}</div>
            <div style={{ fontFamily:'Inter', fontSize:11, color:SW_MUTE }}>Losses</div>
          </div>
        </div>
      </div>
    );
    return (
      <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'2px 16px 6px' }}>
        <Block label="Unrealized total" gain="$199,195" loss="$-7,195" />
        <Block label="Long term" gain="$142,650" loss="$0" />
        <Block label="Short term" gain="$56,545" loss="$-7,195" />
      </div>
    );
  }
  if (section === 'tax') {
    const rows = [['Federal (32% bracket)','$121,840','rgb(248,113,113)'],['PA State (3.07%)','$18,781',SW_INK],['Long-term capital gains','$21,397',SW_INK],['Tax-loss harvest available','-$7,195',SW_GREENB]];
    return (
      <div style={wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <MPStat label="Total liability" value="$184,320" />
          <MPStat label="Effective rate" value="30.1%" color="rgb(234,179,8)" />
        </div>
        <div style={{ background:MP_TILE, border:`1px solid ${MP_BORDER}`, borderRadius:16, padding:'4px 16px 10px' }}>
          {rows.map((r,i) => <MPRow key={i} k={r[0]} v={r[1]} color={r[2]} first={i===0} />)}
        </div>
        <div style={{ fontFamily:'Inter', fontSize:11, color:SW_MUTE, lineHeight:1.5, padding:'0 2px' }}>
          Tax Year 2026 · estimated from 1099 &amp; realized gains/losses. For planning purposes only.
        </div>
      </div>
    );
  }
  return null;
}

/* ── the portal screen (home list ↔ detail) ────────────────────────── */
function MobilePortal({ client, visible }) {
  const [screen, setScreen] = React.useState(null); // null = home, else section key
  const sec = SW_SECTIONS.find(s => s.key === screen);
  const shown = SW_SECTIONS.filter(s => visible[s.key]);
  const firstName = String(client).split(' ')[0];

  return (
    <div style={{ minHeight:'100%', background:MP_BG, color:SW_INK }}>
      {/* ── sticky top header bar ── */}
      <div style={{
        position:'sticky', top:0, zIndex:6,
        paddingTop:50, paddingBottom:12, paddingLeft:16, paddingRight:16,
        background:'rgba(11,13,17,0.86)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
        borderBottom:`1px solid ${MP_BORDER}`,
        display:'flex', alignItems:'center', gap:11, minHeight:50,
      }}>
        {screen === null ? (
          <React.Fragment>
            <FirmMark size={30} radius={8} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:700, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ADV_FIRM}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:SW_MUTE }}>Client portal</div>
            </div>
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 9px', borderRadius:999, flexShrink:0,
              background:'rgba(5,122,85,0.16)', border:'1px solid rgba(16,185,129,0.35)', fontFamily:'Inter', fontSize:10.5, fontWeight:600, color:'rgb(110,231,183)' }}>
              <Icon name="lock" size={10} color="rgb(110,231,183)" /> Secure
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <button onClick={() => setScreen(null)} style={{
              width:34, height:34, borderRadius:999, flexShrink:0,
              background:MP_TILE, border:`1px solid ${MP_BORDER}`, color:SW_INK, cursor:'pointer',
              display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="chevronLeft" size={15} color={SW_INK} /></button>
            <span style={{ flex:1, minWidth:0, fontFamily:'Inter', fontSize:17, fontWeight:700, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{sec && sec.label}</span>
            <Icon name="lock" size={14} color={SW_MUTE} />
          </React.Fragment>
        )}
      </div>

      {screen === null ? (
        <div style={{ padding:'18px 16px 44px' }}>
          <div style={{ fontFamily:'Inter', fontSize:24, fontWeight:700, letterSpacing:'-0.02em' }}>Hello, {firstName}</div>
          <div style={{ fontFamily:'Inter', fontSize:13, color:SW_MUTE, marginBottom:20 }}>Your portfolio · as of Jun 10, 2026</div>

          {/* hero net worth — generous spacing */}
          <div style={{
            background:'linear-gradient(135deg, rgba(5,122,85,0.24), rgba(20,24,31,0.55))',
            border:'1px solid rgba(16,185,129,0.35)', borderRadius:20, padding:'24px 22px', marginBottom:18,
          }}>
            <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:500, letterSpacing:'0.02em', color:'rgb(167,243,208)', marginBottom:12 }}>Total net worth</div>
            <div style={{ fontFamily:'Inter', fontSize:38, fontWeight:700, letterSpacing:'-0.025em', lineHeight:1 }}>$6,124,145</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:14, fontFamily:'Inter', fontSize:13, color:'rgb(110,231,183)', fontWeight:600 }}>
              <Icon name="arrowUp" size={12} color="rgb(110,231,183)" />6.33% year to date</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {shown.map(s => (
              <MPCard key={s.key} icon={s.icon} title={s.label} onTap={() => setScreen(s.key)}>
                {s.key === 'networth'   && <MPSpark />}
                {s.key === 'allocation' && (
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:96, height:96, flexShrink:0 }}><MPDonut height={96} /></div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
                      {MP_ALLOC.slice(0,4).map((d,i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:7, fontFamily:'Inter', fontSize:11.5 }}>
                          <span style={{ width:7, height:7, borderRadius:7, background:d.dot }} />
                          <span style={{ flex:1, color:SW_SUB, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</span>
                          <span style={{ color:SW_MUTE }}>{d.y}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {s.key === 'performance' && (
                  <div style={{ display:'flex', gap:18 }}>
                    <MPStat label="YTD" value="+12.69%" color={SW_GREENB} />
                    <MPStat label="Since inception" value="+68.1%" color={SW_GREENB} />
                  </div>
                )}
                {s.key === 'investment' && (
                  <div style={{ display:'flex', gap:18 }}>
                    <MPStat label="Invested" value="$4.54M" />
                    <MPStat label="Cash" value="$586.9K" />
                  </div>
                )}
                {s.key === 'unrealized' && (
                  <div style={{ display:'flex', gap:18 }}>
                    <MPStat label="Gains" value="$199,195" color={SW_GREENB} />
                    <MPStat label="Losses" value="$-7,195" color="rgb(248,113,113)" />
                  </div>
                )}
                {s.key === 'tax' && (
                  <div style={{ display:'flex', gap:18 }}>
                    <MPStat label="Liability" value="$184,320" />
                    <MPStat label="Eff. rate" value="30.1%" color="rgb(234,179,8)" />
                  </div>
                )}
              </MPCard>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginTop:20, fontFamily:'Inter', fontSize:11, color:SW_MUTE }}>
            <Icon name="lock" size={10} color={SW_MUTE} /> Read-only · shared by {ADV_NAME}
          </div>
        </div>
      ) : (
        <div key={screen} style={{ padding:'30px 16px 44px', animation:'mp-slide 280ms cubic-bezier(0.22,1,0.36,1)' }}>
          <MPDetail section={screen} />
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PHONE — scales to fit the available height
   ════════════════════════════════════════════════════════════════════ */
function PhonePreview({ client, visible }) {
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.8);
  React.useEffect(() => {
    const fit = () => {
      const el = wrapRef.current; if (!el) return;
      const s = Math.min((el.clientHeight - 20) / 874, (el.clientWidth - 8) / 402, 0.9);
      setScale(Math.max(0.4, s));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, []);
  return (
    <div ref={wrapRef} style={{ flex:1, minWidth:0, minHeight:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <div style={{ width:402*scale, height:874*scale, flexShrink:0 }}>
        <div style={{ transform:`scale(${scale})`, transformOrigin:'top left', width:402, height:874 }}>
          <IOSDevice dark>
            <MobilePortal client={client} visible={visible} />
          </IOSDevice>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ROOT OVERLAY
   ════════════════════════════════════════════════════════════════════ */
function ShareWithClient() {
  const [open, setOpen]   = React.useState(false);
  const [recip, setRecip] = React.useState({ client:'David Young', email:'joe.smith@gmail.com', phone:'215-555-5555' });
  const [sent, setSent]   = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [otp, setOtp]     = React.useState(true);
  const [expiry, setExpiry] = React.useState('30 days');
  const [visible, setVisible] = React.useState(() => Object.fromEntries(SW_SECTIONS.map(s => [s.key, true])));

  const link = 'portal.meridianwealth.com/v/9f2a7c41';

  React.useEffect(() => {
    const onOpen = (e) => {
      if (e.detail) setRecip(r => ({ ...r, ...e.detail }));
      setSent(false); setCopied(false);
      setVisible(Object.fromEntries(SW_SECTIONS.map(s => [s.key, true])));
      setOpen(true);
    };
    window.addEventListener('share:open', onOpen);
    return () => window.removeEventListener('share:open', onOpen);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText('https://' + link); } catch(_) {}
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  const toggleSection = (k) => setVisible(v => ({ ...v, [k]: !v[k] }));

  if (!open) return null;
  const firstName = String(recip.client).split(' ')[0];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1100,
      background:'rgba(8,11,18,0.93)', backdropFilter:'blur(18px) saturate(140%)', WebkitBackdropFilter:'blur(18px) saturate(140%)',
      animation:'sw-fade 220ms ease-out', display:'flex', flexDirection:'column',
      fontFamily:'Inter, sans-serif',
    }}>
      <style>{`
        @keyframes sw-fade { from { opacity:0; } to { opacity:1; } }
        @keyframes mp-slide { from { opacity:0; transform: translateX(18px); } to { opacity:1; transform: translateX(0); } }
        .sw-scroll::-webkit-scrollbar { width:8px; }
        .sw-scroll::-webkit-scrollbar-thumb { background:rgba(75,85,99,0.5); border-radius:8px; }
      `}</style>

      {/* header */}
      <div style={{ display:'flex', alignItems:'center', gap:13, padding:'17px 26px', borderBottom:`1px solid ${SW_LINE}`, flexShrink:0 }}>
        <span style={{ width:32, height:32, borderRadius:9, background:'rgba(5,122,85,0.18)', border:'1px solid rgba(16,185,129,0.4)',
          display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="share" size={15} color={SW_GREENB} />
        </span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:600, color:SW_INK }}>Share with Client</div>
          <div style={{ fontSize:12, color:SW_MUTE }}>Send {recip.client} a secure, read-only link to their portfolio</div>
        </div>
        <button onClick={() => setOpen(false)} style={{
          width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.04)', border:`1px solid ${SW_LINE}`,
          color:SW_SUB, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="x" size={15} color={SW_SUB} /></button>
      </div>

      {/* body */}
      <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'minmax(380px, 440px) 1fr', gridTemplateRows:'minmax(0, 1fr)' }}>
        {/* LEFT — config / send */}
        <div className="sw-scroll" style={{ borderRight:`1px solid ${SW_LINE}`, overflowY:'auto', padding:'24px 26px 32px' }}>
          {/* recipient */}
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px', borderRadius:12, border:`1px solid ${SW_LINE}`, background:SW_CARD }}>
            <div style={{ width:42, height:42, borderRadius:999, flexShrink:0, background:'linear-gradient(135deg,#f0abfc,#c084fc)',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:16 }}>{firstName[0]}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:600, color:SW_INK }}>{recip.client}</div>
              <div style={{ fontSize:12, color:SW_MUTE, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{recip.email}</div>
            </div>
            <span style={{ fontSize:11, color:SW_MUTE, padding:'4px 9px', borderRadius:999, border:`1px solid ${SW_LINE}` }}>Client</span>
          </div>

          {/* secure link */}
          <div style={{ marginTop:22 }}>
            <div style={{ fontSize:11.5, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:SW_MUTE, marginBottom:9 }}>Secure link</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 4px 0 12px', height:42, borderRadius:10, border:`1px solid ${SW_LINE}`, background:'rgba(0,0,0,0.25)' }}>
              <Icon name="lock" size={13} color={SW_GREENB} />
              <span style={{ flex:1, minWidth:0, fontSize:12.5, color:SW_SUB, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontVariantNumeric:'tabular-nums' }}>{link}</span>
              <button onClick={copy} style={{
                height:32, padding:'0 12px', borderRadius:7, flexShrink:0, cursor:'pointer',
                background: copied ? 'rgba(5,122,85,0.2)' : 'rgba(255,255,255,0.06)',
                border:`1px solid ${copied ? 'rgba(16,185,129,0.5)' : SW_LINE}`,
                color: copied ? 'rgb(110,231,183)' : SW_SUB, fontSize:12, fontWeight:600,
                display:'inline-flex', alignItems:'center', gap:6,
              }}>
                <Icon name={copied ? 'check' : 'copy'} size={12} color={copied ? 'rgb(110,231,183)' : SW_SUB} />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* access settings */}
          <div style={{ marginTop:22 }}>
            <div style={{ fontSize:11.5, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:SW_MUTE, marginBottom:9 }}>Access</div>
            <div style={{ borderRadius:12, border:`1px solid ${SW_LINE}`, background:SW_CARD, overflow:'hidden' }}>
              <SettingRow icon="eye" title="Read-only" sub="Client can view, never edit" right={<span style={{ fontSize:12, color:SW_GREENB, fontWeight:600 }}>On</span>} />
              <SettingRow icon="clock" title="Link expires" sub="Auto-revokes after this period"
                right={
                  <div style={{ display:'flex', gap:6 }}>
                    {['7 days','30 days','90 days'].map(o => (
                      <button key={o} onClick={() => setExpiry(o)} style={{
                        padding:'5px 9px', borderRadius:7, cursor:'pointer', fontSize:11.5, fontWeight:600,
                        background: expiry===o ? 'rgba(5,122,85,0.2)' : 'transparent',
                        border:`1px solid ${expiry===o ? 'rgba(16,185,129,0.5)' : SW_LINE}`,
                        color: expiry===o ? 'rgb(110,231,183)' : SW_MUTE,
                      }}>{o.replace(' days','d')}</button>
                    ))}
                  </div>
                } />
              <SettingRow icon="shield" title="One-time passcode" sub="Texted to client on first open" last
                right={<Toggle on={otp} onClick={() => setOtp(o => !o)} />} />
            </div>
          </div>

          {/* visible sections */}
          <div style={{ marginTop:22 }}>
            <div style={{ fontSize:11.5, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:SW_MUTE, marginBottom:9 }}>Visible sections</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {SW_SECTIONS.map(s => {
                const on = visible[s.key];
                return (
                  <button key={s.key} onClick={() => toggleSection(s.key)} style={{
                    display:'flex', alignItems:'center', gap:9, padding:'10px 11px', borderRadius:10, cursor:'pointer', textAlign:'left',
                    background: on ? 'rgba(5,122,85,0.1)' : 'rgba(255,255,255,0.02)',
                    border:`1px solid ${on ? 'rgba(16,185,129,0.4)' : SW_LINE}`,
                  }}>
                    <Icon name={s.icon} size={14} color={on ? SW_GREENB : SW_MUTE} />
                    <span style={{ flex:1, fontSize:12.5, fontWeight:500, color: on ? SW_INK : SW_MUTE }}>{s.label}</span>
                    <Icon name={on ? 'circleCheck' : 'circle'} size={15} color={on ? SW_GREENB : 'rgba(120,124,134,0.6)'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* send / sent */}
          <div style={{ marginTop:26 }}>
            {!sent ? (
              <button onClick={() => setSent(true)} style={{
                width:'100%', height:46, borderRadius:11, cursor:'pointer', border:'1px solid rgba(16,185,129,0.6)',
                background:'linear-gradient(180deg, rgb(7,140,98), rgb(5,110,76))', color:'#fff', fontSize:14, fontWeight:600,
                display:'inline-flex', alignItems:'center', justifyContent:'center', gap:9,
                boxShadow:'0 8px 24px rgba(5,122,85,0.32)',
              }}>
                <Icon name="send" size={15} color="#fff" />
                Send secure link to {firstName}
              </button>
            ) : (
              <div style={{ borderRadius:13, border:'1px solid rgba(16,185,129,0.45)', background:'rgba(5,122,85,0.12)', padding:'18px', animation:'mp-slide 300ms ease-out' }}>
                <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <span style={{ width:36, height:36, borderRadius:999, background:SW_GREEN, display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon name="check" size={17} color="#fff" />
                  </span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:SW_INK }}>Secure link sent</div>
                    <div style={{ fontSize:12, color:SW_SUB }}>Emailed to {recip.email}{otp ? ' · passcode texted to ' + recip.phone : ''}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:9, marginTop:15 }}>
                  <button onClick={copy} style={{
                    flex:1, height:38, borderRadius:9, cursor:'pointer', background:'rgba(255,255,255,0.06)', border:`1px solid ${SW_LINE}`,
                    color:SW_SUB, fontSize:12.5, fontWeight:600, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
                  }}><Icon name={copied ? 'check' : 'copy'} size={12} color={SW_SUB} />{copied ? 'Copied' : 'Copy link'}</button>
                  <button onClick={() => { setSent(false); setTimeout(() => setSent(true), 50); }} style={{
                    flex:1, height:38, borderRadius:9, cursor:'pointer', background:'rgba(255,255,255,0.06)', border:`1px solid ${SW_LINE}`,
                    color:SW_SUB, fontSize:12.5, fontWeight:600, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
                  }}><Icon name="refresh" size={12} color={SW_SUB} />Resend</button>
                </div>
              </div>
            )}
            <div style={{ fontSize:11, color:SW_MUTE, lineHeight:1.5, marginTop:12, textAlign:'center' }}>
              {firstName} sees a live, read-only mirror of the sections you enabled — exactly as previewed.
            </div>
          </div>
        </div>

        {/* RIGHT — phone preview */}
        <div style={{ position:'relative', display:'flex', flexDirection:'column', minWidth:0, minHeight:0, background:'radial-gradient(circle at 50% 30%, rgba(5,122,85,0.1), transparent 60%)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'16px 0 4px', fontFamily:'Inter', fontSize:12, color:SW_MUTE, flexShrink:0 }}>
            <Icon name="smartphone" size={13} color={SW_MUTE} />
            Client preview — what {firstName} sees on mobile
          </div>
          <PhonePreview client={recip.client} visible={visible} />
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, sub, right, last }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:11, padding:'13px 14px', borderBottom: last ? 'none' : `1px solid rgba(75,85,99,0.4)` }}>
      <span style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:'rgba(255,255,255,0.04)', border:`1px solid ${SW_LINE}`,
        display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name={icon} size={14} color={SW_MUTE} /></span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:SW_INK }}>{title}</div>
        <div style={{ fontFamily:'Inter', fontSize:11.5, color:SW_MUTE }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width:42, height:24, borderRadius:999, cursor:'pointer', flexShrink:0, position:'relative',
      background: on ? SW_GREEN : 'rgba(120,124,134,0.4)', border:'none', transition:'background 180ms ease',
    }}>
      <span style={{ position:'absolute', top:2, left: on ? 20 : 2, width:20, height:20, borderRadius:999, background:'#fff', transition:'left 180ms ease' }} />
    </button>
  );
}

Object.assign(window, { ShareWithClient });
