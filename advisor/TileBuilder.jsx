// TileBuilder — the full "Add New" tile builder modal.
// Tabs: AI Builder · Custom · Display · Chart, with a live Preview pane.
// The Custom tab's Value field carries the fx formula editor (FormulaEditor.jsx).
// AI prompts that describe a metric hand off into the formula editor.
// Emits a tile via onAdd() compatible with the dashboard's AddedTile renderer.

const TB_BRAND = 'rgb(5,122,85)';
const TB_BRAND_SOFT = 'rgba(5,122,85,0.18)';
const TB_BRAND_TXT = 'rgb(110,231,183)';
const TB_BORDER = 'rgb(75,85,99)';
const TB_BORDER_SOFT = 'rgba(75,85,99,0.5)';
const TB_INK = 'rgb(249,250,251)';
const TB_MUTED = 'rgb(163,163,163)';
const TB_MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

const TB_CHART_TYPES = [
  { id:'bar',     label:'Bar' },
  { id:'line',    label:'Line' },
  { id:'column',  label:'Column' },
  { id:'table',   label:'Data Table' },
  { id:'pie',     label:'Pie' },
  { id:'donut',   label:'Donut' },
  { id:'treemap', label:'Treemap' },
  { id:'metric',  label:'Metric' },
];

/* Inline-SVG glyphs (Lucide-style) for chart icons the page's icon shim
   doesn't ship. TBIcon falls back to a shim <i> for any name not listed. */
const TB_GLYPHS = {
  bar:    (<React.Fragment><line x1="4" y1="3.5" x2="4" y2="20"/><line x1="4" y1="6.5" x2="14" y2="6.5"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17.5" x2="10" y2="17.5"/></React.Fragment>),
  column: (<React.Fragment><line x1="3" y1="20" x2="21" y2="20"/><line x1="6.5" y1="20" x2="6.5" y2="14"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="17.5" y1="20" x2="17.5" y2="4"/></React.Fragment>),
  line:   (<React.Fragment><polyline points="3,16 9,10 13,13 21,4.5"/><line x1="3" y1="20" x2="21" y2="20" opacity="0.35"/></React.Fragment>),
  table:  (<React.Fragment><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="4" x2="10" y2="20"/></React.Fragment>),
  pie:    (<React.Fragment><circle cx="12" cy="12" r="9"/><line x1="12" y1="12" x2="12" y2="3"/><line x1="12" y1="12" x2="20" y2="16.5"/></React.Fragment>),
  donut:  (<React.Fragment><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/></React.Fragment>),
  treemap:(<React.Fragment><rect x="3" y="3" width="10" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="13" width="7" height="8" rx="1.5"/></React.Fragment>),
  metric: (<React.Fragment><path d="M4.5 18 a7.5 7.5 0 0 1 15 0"/><line x1="12" y1="18" x2="16" y2="12.5"/></React.Fragment>),
  calc:   (<React.Fragment><rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="7.5" x2="15" y2="7.5"/><line x1="9" y1="12" x2="9.2" y2="12"/><line x1="12" y1="12" x2="12.2" y2="12"/><line x1="15" y1="12" x2="15.2" y2="12"/><line x1="9" y1="16" x2="9.2" y2="16"/><line x1="12" y1="16" x2="12.2" y2="16"/></React.Fragment>),
  eye:    (<React.Fragment><path d="M2.5 12 S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></React.Fragment>),
};
function TBIcon({ name, size = 18, color = 'currentColor' }) {
  const g = TB_GLYPHS[name];
  if (!g) return <i className={`fa-solid fa-${name}`} style={{ fontSize: size, color }} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'block' }}>
      {g}
    </svg>
  );
}

const TB_SOURCES = ['Holdings', 'Clients', 'Accounts', 'Transactions', 'Billing', 'Opportunities', 'Uploaded spreadsheet'];
const TB_CATEGORIES = ['Date', 'Asset Class', 'Account Type', 'Client', 'Sector', 'Custodian'];
const TB_VALUES = ['Sum of Market Value', 'Sum of Fees', 'Count of Accounts', 'Average AUM', 'Sum of Net Flows'];
const TB_GROUPBY = ['None', 'Account Type', 'Asset Class', 'Custodian', 'Household'];
const TB_LIMITS = ['No Limit', 'Top 5', 'Top 10', 'Top 25'];

const TB_AI_SUGGESTIONS = [
  { icon:'pie',           tint:'rgb(245,200,90)',  label:'AUM by asset class' },
  { icon:'bar',           tint:'rgb(120,160,230)', label:'Top clients by revenue' },
  { icon:'line',          tint:'rgb(94,214,164)',  label:'Monthly net flows trend' },
  { icon:'bullseye',      tint:'rgb(240,140,120)', label:'Revenue by channel' },
  { icon:'percent',       tint:'rgb(180,150,235)', label:'Effective fee rate', formula:true },
  { icon:'metric',        tint:'rgb(120,200,210)', label:'AUM per client', formula:true },
];

/* ---------------------------------------------------------------- helpers */
const TB_SIZE_TO_COL = { small:'col-3', medium:'col-6', large:'col-9', full:'col-12' };

/* Default KPI cards shown in the metrics row (each is a field or a formula). */
const TB_DEFAULT_METRICS = [
  { id:'m1', label:'AUM',     mode:'field', field:'AUM',     formula:'', format:'currency' },
  { id:'m2', label:'Clients', mode:'field', field:'Clients', formula:'', format:'number' },
  { id:'m3', label:'Fees',    mode:'field', field:'Fees',    formula:'', format:'currency' },
];

/* Resolve a KPI card to a formatted display value. */
function tbMetricValue(m) {
  if (m.mode === 'static') return m.value || '\u2014';
  if (m.mode === 'formula') {
    const r = window.evalFormula(m.formula);
    return r.ok ? window.formatResult(r.value, m.format) : '\u2014';
  }
  const f = (window.FIELD_SCHEMA || []).find(x => x.name === m.field);
  if (!f) return '\u2014';
  const fmt = m.format || (f.type === 'percent' ? 'percent' : f.type === 'count' ? 'number' : 'currency');
  return window.formatResult(f.agg, fmt);
}

/* Map a built-in dashboard tile to a faithful builder state, so the
   ⋯ → Edit action opens the builder showing what's actually on the dashboard. */
function canonicalTileState(id, title) {
  const base = {
    title: title || 'Tile', chartType:'line', source:'Holdings', category:'Date',
    valueMode:'field', value:'Sum of Market Value', formula:'', format:'currency',
    groupBy:'None', limit:'No Limit', filters:[],
    chartOpts:{ dataLabels:false, legend:true, grid:true, trend:false },
    size:'medium',
    displayOpts:{ metricsRow:false, timestamp:true, seeMore:true, drillDown:true, inflowLegend:false },
    metrics: [], previewData: null,
    palette:'emerald', stacking:'None', numFmt:'Abbreviated ($1.2M)',
  };
  const STATIC = (label, value, fmt) => ({ id:'k'+label.replace(/\W/g,''), label, mode:'static', value, field:'', formula:'', format: fmt || 'currency' });
  const allocSlices = [
    ['Equities',28,'rgb(94,214,164)'],['Fixed Income',18,'rgb(120,160,230)'],['Alternatives',14,'rgb(180,150,235)'],
    ['Private',12,'rgb(245,200,90)'],['Real Estate',10,'rgb(240,140,120)'],['Cash',8,'rgb(120,200,210)'],
    ['Hedge',6,'rgb(200,170,130)'],['Other',4,'rgb(160,170,185)'],
  ];

  const ov = ({
    meetings: {
      chartType:'table', source:'Clients', category:'Date',
      displayOpts:{ ...base.displayOpts, seeMore:true },
      previewData:{ tableCols:['Meeting','Date','Time'], table:[
        ['Kyung Min Meeting','Feb 02','11:00A'],['David Young Performance','Feb 03','1:00P'],
        ['Market Outlook Discussion','Feb 04','1:00P'],['Risk Management Review','Feb 06','1:00P'],
      ] },
    },
    notifs: {
      chartType:'table', source:'Opportunities', category:'Client',
      previewData:{ tableCols:['Notification','','Status'], table:[
        ['Upcoming Meeting: David Young','','Prep'],['Proposal Approved','','3 days'],
        ['New Client Reply','','New'],['Document Signed','','Signed'],
      ] },
    },
    topclients: {
      chartType:'table', source:'Clients', category:'Client', value:'Sum of Market Value', limit:'Top 8',
      previewData:{ tableCols:['Client','Return','AUM'], table:[
        ['David Young','+9.68%','$2.4M'],['Maria Workman','+10.68%','$2.0M'],['John Smith','+23.68%','$1.8M'],
        ['Alfonso Mango','+4.68%','$1.8M'],['Zaire Herwitz','+7.68%','$1.4M'],['Ryan Korsgaard','+2.68%','$1.3M'],
      ] },
    },
    aum_alloc: {
      chartType:'donut', source:'Holdings', category:'Asset Class',
      chartOpts:{ ...base.chartOpts, legend:true, grid:false },
      metrics:[ STATIC('Total Value','$42.3M') ],
      displayOpts:{ ...base.displayOpts, metricsRow:true },
      previewData:{ slices: allocSlices },
    },
    billing: {
      chartType:'line', source:'Billing', category:'Date', value:'Sum of Fees',
      chartOpts:{ ...base.chartOpts, legend:false, grid:true, trend:false },
      displayOpts:{ ...base.displayOpts, metricsRow:true },
      metrics:[
        STATIC('YTD Billable Assets','$16.5M'),
        STATIC('YTD Fees Collected','$78,400', 'number'),
        STATIC('Fee Run Rate','$175,996', 'number'),
      ],
      previewData:{ categories:['Jan','Feb','Mar','Apr','May'], points:[14.2,14.8,15.4,16.1,17.9] },
    },
    aum: {
      chartType:'bar', source:'Holdings', category:'Account Type', value:'Sum of Market Value', groupBy:'Account Type',
      chartOpts:{ ...base.chartOpts, legend:true, grid:true },
      previewData:{ categories:['Qualified Retirement','Taxable Investment','Cash Equivalent','Life Insurance','Other'], points:[780,640,500,400,180] },
    },
    holdings: {
      chartType:'bar', source:'Holdings', category:'Sector', value:'Sum of Market Value', limit:'Top 10',
      chartOpts:{ ...base.chartOpts, legend:false, grid:true, dataLabels:true },
      previewData:{ categories:['VTSAX','BND','VTI','AGG','BCRED','VXUS','VOO','VEA','SPY','QQQ'], points:[185,142,128,98,82,71,62,54,46,38] },
    },
    cashflow: {
      chartType:'column', source:'Transactions', category:'Date', value:'Sum of Net Flows',
      chartOpts:{ ...base.chartOpts, legend:true, grid:true },
      displayOpts:{ ...base.displayOpts, metricsRow:true, inflowLegend:true },
      metrics:[
        STATIC('YTD Inflows','$126.0M'),
        STATIC('YTD Outflows','-$45.0M'),
        STATIC('YTD Net Flow','$81.0M'),
      ],
      previewData:{ categories:['Jan','Feb','Mar','Apr','May'], points:[22,28,19,26,31] },
    },
    fees: {
      chartType:'line', source:'Billing', category:'Date', value:'Sum of Fees',
      chartOpts:{ ...base.chartOpts, legend:false, grid:true, trend:true },
      previewData:{ categories:['2025','2026','2027','2028','2029','2030'], points:[150,185,235,285,340,400] },
    },
  })[id] || {};

  // any tile with no explicit metrics keeps metricsRow off
  const merged = { ...base, ...ov, title: title || base.title };
  if (!merged.metrics || !merged.metrics.length) { merged.metrics = JSON.parse(JSON.stringify(TB_DEFAULT_METRICS)); }
  return merged;
}

/* Build a dashboard-ready tile object (consumed by window.AddedTile). */
function buildTileFromState(s, existingId) {
  const isFormula = s.valueMode === 'formula';
  const fres = isFormula ? window.evalFormula(s.formula) : null;
  const id = existingId || 'tb-' + Date.now();
  const size = TB_SIZE_TO_COL[s.size] || 'col-6';
  const _state = JSON.parse(JSON.stringify(s)); // snapshot so Edit can repopulate the builder

  if (s.chartType === 'metric' || isFormula) {
    const val = fres && fres.ok ? window.formatResult(fres.value, s.format) : '$248.5M';
    // formula-aware breakdown: show the referenced fields and their book values
    let rows;
    if (isFormula) {
      const refs = (s.formula.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [])
        .filter(n => (window.FIELD_SCHEMA || []).some(f => f.name.toLowerCase() === n.toLowerCase()));
      const seen = new Set();
      rows = [{ l: 'Formula', v: s.formula }];
      refs.forEach(n => {
        const f = window.FIELD_SCHEMA.find(x => x.name.toLowerCase() === n.toLowerCase());
        if (f && !seen.has(f.name)) { seen.add(f.name); rows.push({ l: f.name, v: window.formatResult(f.agg, f.type === 'percent' ? 'percent' : f.type === 'count' ? 'number' : 'currency') }); }
      });
      rows = rows.slice(0, 4);
    } else {
      rows = [
        { l:'This period', v: val },
        { l:'Prior period', v: '$236.1M' },
        { l:'Change', v: '+5.3%' },
      ];
    }
    return {
      id, _state, title: s.title || 'Custom Metric', icon: isFormula ? 'function' : 'bullseye',
      kind: 'stat', size,
      formula: isFormula ? s.formula : null,
      data: {
        primary: { label: s.title || 'Value', value: val },
        delta: isFormula ? 'computed from your formula' : '+4.2% vs last period',
        rows,
      },
    };
  }
  if (s.chartType === 'table') {
    return {
      id, _state, title: s.title || 'Data Table', icon:'table-columns', kind:'list', size,
      data: { rows: [
        { title:'Managed', meta:'Account Type', value:'$182.4M' },
        { title:'Held-away', meta:'Account Type', value:'$64.1M' },
        { title:'Trust', meta:'Account Type', value:'$48.7M' },
        { title:'Retirement', meta:'Account Type', value:'$17.2M' },
      ] },
    };
  }
  const pts = Array.from({ length: 8 }, (_, i) => 40 + Math.sin(i / 1.5) * 22 + i * 4 + Math.random() * 8);
  return { id, _state, title: s.title || 'Custom Chart', icon:'chart-column', kind:'chart', size, data:{ points: pts, axisLabel: s.category } };
}

/* ----------------------------------------------------------- preview tile */
/* The single source of truth for how a tile looks — used by the builder's
   live Preview pane AND by the placed tile on the dashboard (live mode). */
function TBPreview({ s, live, menu, footerSlot }) {
  const isFormula = s.valueMode === 'formula';
  const fres = isFormula ? window.evalFormula(s.formula) : null;
  const showFormulaMetric = s.chartType === 'metric' || isFormula;

  return (
    <div data-screen-label={live ? `Tile · ${s.title || 'Untitled'}` : 'Tile Preview'} style={{
      width:'100%', maxWidth: live ? '100%' : (s.size === 'small' ? 320 : s.size === 'full' ? '100%' : 560),
      height: live ? '100%' : 'auto',
      margin:'0 auto', background:'rgba(255,255,255,0.05)', border:`1px solid ${TB_BORDER}`,
      borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column',
      boxShadow: live ? 'none' : '0 18px 50px -20px rgba(0,0,0,0.6)',
    }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px 10px' }}>
        <div style={{
          width:28, height:28, borderRadius:7, background:TB_BRAND_SOFT, border:'1px solid rgba(5,122,85,0.4)',
          display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <TBIcon name={showFormulaMetric ? (isFormula ? 'calc' : 'metric') : s.chartType} size={14} color={TB_BRAND} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:TB_INK, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {s.title || 'Untitled Tile'}
          </div>
        </div>
        <div style={{ flexShrink:0 }}>
          {menu || <div style={{ width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', color:TB_MUTED }}>
            <i className="fa-solid fa-ellipsis" style={{ fontSize:14 }} />
          </div>}
        </div>
      </div>

      {/* metrics row (display option) */}
      {s.displayOpts.metricsRow && (s.metrics || []).length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min((s.metrics||[]).length,4)}, 1fr)`, gap:8, padding:'2px 16px 10px' }}>
          {(s.metrics || []).slice(0, 4).map((m) => (
            <div key={m.id} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${TB_BORDER_SOFT}`, borderRadius:8, padding:'7px 9px' }}>
              <div style={{ fontFamily:'Inter', fontSize:9.5, color:TB_MUTED, textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'flex', alignItems:'center', gap:4 }}>
                {m.mode === 'formula' && <span style={{ fontFamily:TB_MONO, fontStyle:'italic', fontWeight:700, color:TB_BRAND_TXT }}>fx</span>}
                {m.label || 'Metric'}
              </div>
              <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:TB_INK, fontVariantNumeric:'tabular-nums' }}>{tbMetricValue(m)}</div>
            </div>
          ))}
        </div>
      )}

      {/* body */}
      <div style={{ padding:'4px 16px 14px', minHeight:170, flex: live ? 1 : 'none', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ width:'100%' }}>
        {showFormulaMetric ? <TBMetricBody isFormula={isFormula} fres={fres} format={s.format} formula={s.formula} />
          : s.chartType === 'table' ? <TBTableBody pd={s.previewData} />
          : (s.chartType === 'pie' || s.chartType === 'donut') ? <TBDonutBody donut={s.chartType==='donut'} legend={s.chartOpts.legend} pd={s.previewData} />
          : s.chartType === 'treemap' ? <TBTreemapBody pd={s.previewData} />
          : (s.chartType === 'bar') ? <TBBarsBody opts={s.chartOpts} horizontal pd={s.previewData} />
          : (s.chartType === 'column') ? <TBBarsBody opts={s.chartOpts} pd={s.previewData} />
          : <TBLineBody opts={s.chartOpts} pd={s.previewData} />}
        </div>
      </div>

      {/* footer */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 16px', borderTop:`1px solid ${TB_BORDER_SOFT}`,
        fontFamily:'Inter', fontSize:12, color:TB_MUTED, flexShrink:0,
      }}>
        <span>{s.displayOpts.timestamp ? 'As of Jun 5, 2026' : '\u00A0'}</span>
        {footerSlot || (s.displayOpts.seeMore && (
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, color:TB_BRAND_TXT, cursor:'pointer' }}>
            See more <i className="fa-solid fa-chevron-right" style={{ fontSize:10 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function TBMetricBody({ isFormula, fres, format, formula }) {
  const value = isFormula ? (fres && fres.ok ? window.formatResult(fres.value, format) : null) : '$312.4M';
  return (
    <div style={{ paddingTop:6 }}>
      {isFormula && fres && !fres.ok ? (
        <div style={{ fontFamily:'Inter', fontSize:13, color:'rgb(248,113,113)', display:'flex', alignItems:'center', gap:8, padding:'24px 0' }}>
          <i className="fa-solid fa-triangle-exclamation" /> {fres.error}
        </div>
      ) : (
        <React.Fragment>
          <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:44, letterSpacing:'-0.03em', color:TB_INK, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>
            {value || '—'}
          </div>
          <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:6, color:TB_BRAND_TXT, fontFamily:'Inter', fontSize:12.5 }}>
            <i className="fa-solid fa-arrow-up" style={{ fontSize:10 }} /> +5.3% vs prior period
          </div>
          {isFormula && formula && (
            <div style={{ marginTop:16, padding:'8px 11px', background:'rgba(10,15,24,0.55)', border:`1px solid ${TB_BORDER_SOFT}`, borderRadius:8, display:'inline-flex', alignItems:'center', gap:8 }}>
              <span style={{ fontFamily:TB_MONO, fontStyle:'italic', fontWeight:700, fontSize:12, color:TB_BRAND_TXT }}>fx</span>
              <span style={{ fontFamily:TB_MONO, fontSize:12, color:TB_INK }}>{formula}</span>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

function TBLineBody({ opts, pd }) {
  const pts = (pd && pd.points && pd.points.length) ? pd.points : [38, 52, 46, 64, 58, 78, 70, 92];
  const labels = pd && pd.categories;
  const w = 480, h = 150;
  const max = Math.max(...pts), min = Math.min(...pts);
  const sx = (i) => (i / (pts.length - 1)) * w;
  const sy = (v) => h - ((v - min) / (max - min || 1)) * (h - 16) - 8;
  const path = pts.map((v, i) => `${i ? 'L' : 'M'}${sx(i)},${sy(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height:150 }} preserveAspectRatio="none">
      {opts.grid && [0.25, 0.5, 0.75].map(g => <line key={g} x1="0" x2={w} y1={h*g} y2={h*g} stroke="rgba(75,85,99,0.4)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
      <defs><linearGradient id="tb-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(5,122,85)" stopOpacity="0.35" /><stop offset="100%" stopColor="rgb(5,122,85)" stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#tb-area)" />
      <path d={path} fill="none" stroke="rgb(94,214,164)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      {opts.trend && <line x1="0" y1={sy(pts[0])} x2={w} y2={sy(pts[pts.length-1])} stroke="rgba(120,160,230,0.8)" strokeWidth="1.5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

function TBBarsBody({ opts, horizontal, pd }) {
  const vals = (pd && pd.points && pd.points.length) ? pd.points : [82, 64, 48, 36, 24];
  const labels = pd && pd.categories;
  const max = Math.max(...vals);
  if (horizontal) {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:10, paddingTop:8 }}>
        {vals.map((v, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            {labels && <span style={{ fontFamily:'Inter', fontSize:11, color:TB_MUTED, width:74, flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{labels[i]}</span>}
            <div style={{ height:16, borderRadius:4, width:`${(v/max)*100}%`, background:`rgba(94,214,164,${0.85 - i*0.12})` }} />
            {opts.dataLabels && <span style={{ fontFamily:TB_MONO, fontSize:11, color:TB_MUTED }}>{v}</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:150, paddingTop:8 }}>
      {vals.map((v, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5, height:'100%', justifyContent:'flex-end' }}>
          {opts.dataLabels && <span style={{ fontFamily:TB_MONO, fontSize:10, color:TB_MUTED }}>{v}</span>}
          <div style={{ width:'100%', borderRadius:'5px 5px 0 0', height:`${(v/max)*100}%`, background:`rgba(94,214,164,${0.85 - i*0.1})` }} />
          {labels && <span style={{ fontFamily:'Inter', fontSize:9.5, color:TB_MUTED, whiteSpace:'nowrap' }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function TBDonutBody({ donut, legend, pd }) {
  const segs = (pd && pd.slices && pd.slices.length) ? pd.slices : [['Equities', 42, 'rgb(94,214,164)'], ['Fixed Income', 26, 'rgb(120,160,230)'], ['Alternatives', 18, 'rgb(180,150,235)'], ['Cash', 14, 'rgb(120,200,210)']];
  let acc = 0;
  const stops = segs.map(([, pct, col]) => { const from = acc; acc += pct; return `${col} ${from}% ${acc}%`; }).join(', ');
  return (
    <div style={{ display:'flex', alignItems:'center', gap:20, paddingTop:8 }}>
      <div style={{ width:130, height:130, borderRadius:'50%', background:`conic-gradient(${stops})`, flexShrink:0, position:'relative' }}>
        {donut && <div style={{ position:'absolute', inset:'26%', borderRadius:'50%', background:'rgb(17,24,39)' }} />}
      </div>
      {legend && (
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {segs.map(([name, pct, col]) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:9, height:9, borderRadius:3, background:col }} />
              <span style={{ fontFamily:'Inter', fontSize:12.5, color:TB_INK }}>{name}</span>
              <span style={{ fontFamily:TB_MONO, fontSize:12, color:TB_MUTED, marginLeft:'auto' }}>{pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TBTreemapBody({ pd }) {
  const cells = (pd && pd.slices && pd.slices.length) ? pd.slices.slice(0,4) : [['Equities', 42, 'rgb(94,214,164)'], ['Fixed', 26, 'rgb(120,160,230)'], ['Alts', 18, 'rgb(180,150,235)'], ['Cash', 14, 'rgb(120,200,210)']];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gridTemplateRows:'1fr 1fr', gap:6, height:150, paddingTop:8 }}>
      {cells.map(([n, pct, col], i) => (
        <div key={n} style={{
          gridRow: i === 0 ? '1 / span 2' : 'auto', background:`${col.replace('rgb','rgba').replace(')',',0.5)')}`,
          border:`1px solid ${col}`, borderRadius:8, padding:10, display:'flex', flexDirection:'column', justifyContent:'flex-end',
        }}>
          <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, color:TB_INK }}>{n}</div>
          <div style={{ fontFamily:TB_MONO, fontSize:11, color:'rgba(255,255,255,0.7)' }}>{pct}%</div>
        </div>
      ))}
    </div>
  );
}

function TBTableBody({ pd }) {
  const cols = (pd && pd.tableCols) ? pd.tableCols : ['Account Type', 'Value', 'Share'];
  const rows = (pd && pd.table && pd.table.length) ? pd.table : [['Managed', '$182.4M', '58%'], ['Held-away', '$64.1M', '21%'], ['Trust', '$48.7M', '16%'], ['Retirement', '$17.2M', '5%']];
  return (
    <div style={{ paddingTop:6 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, padding:'6px 0', borderBottom:`1px solid ${TB_BORDER_SOFT}` }}>
        {cols.map((h, i) => <span key={h} style={{ fontFamily:'Inter', fontSize:10.5, color:TB_MUTED, textTransform:'uppercase', letterSpacing:'0.04em', textAlign: i===0?'left':'right' }}>{h}</span>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, padding:'9px 0', borderBottom: i<rows.length-1?`1px solid ${TB_BORDER_SOFT}`:'none' }}>
          <span style={{ fontFamily:'Inter', fontSize:13, color:TB_INK }}>{r[0]}</span>
          <span style={{ fontFamily:TB_MONO, fontSize:12.5, color:TB_INK, textAlign:'right' }}>{r[1]}</span>
          <span style={{ fontFamily:TB_MONO, fontSize:12.5, color:TB_MUTED, textAlign:'right' }}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------- small UI primitives */
function TBSectionHead({ icon, title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, margin:'4px 0 14px' }}>
      <div style={{ width:26, height:26, borderRadius:7, background:'rgba(255,255,255,0.05)', border:`1px solid ${TB_BORDER_SOFT}`, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
        <TBIcon name={icon} size={13} color={TB_MUTED} />
      </div>
      <span style={{ fontFamily:'Inter', fontSize:15, fontWeight:600, color:TB_INK }}>{title}</span>
    </div>
  );
}

function TBField({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7, minWidth:0 }}>
      {label && <label style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:500, color:TB_MUTED }}>{label}</label>}
      {children}
    </div>
  );
}

function TBSelect({ value, onChange, options }) {
  return (
    <div style={{ position:'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        width:'100%', appearance:'none', WebkitAppearance:'none', background:'rgba(10,15,24,0.6)',
        border:`1px solid ${TB_BORDER}`, borderRadius:9, color:TB_INK, fontFamily:'Inter', fontSize:13.5,
        padding:'11px 34px 11px 12px', cursor:'pointer', outline:'none',
      }}>
        {options.map(o => <option key={o} value={o} style={{ background:'rgb(20,28,42)' }}>{o}</option>)}
      </select>
      <i className="fa-solid fa-chevron-down" style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', fontSize:11, color:TB_MUTED, pointerEvents:'none' }} />
    </div>
  );
}

function TBInput({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
      width:'100%', background:'rgba(10,15,24,0.6)', border:`1px solid ${TB_BORDER}`, borderRadius:9,
      color:TB_INK, fontFamily:'Inter', fontSize:13.5, padding:'11px 12px', outline:'none',
    }} />
  );
}

function TBToggle({ title, desc, on, onToggle }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:14,
      padding:'13px 15px', background:'rgba(255,255,255,0.03)', border:`1px solid ${TB_BORDER_SOFT}`, borderRadius:11,
    }}>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:500, color:TB_INK }}>{title}</div>
        <div style={{ fontFamily:'Inter', fontSize:11.5, color:TB_MUTED, marginTop:2 }}>{desc}</div>
      </div>
      <button onClick={onToggle} style={{
        width:42, height:24, borderRadius:999, border:'none', cursor:'pointer', flexShrink:0,
        background: on ? TB_BRAND : 'rgba(255,255,255,0.14)', position:'relative', transition:'background 140ms ease',
      }}>
        <span style={{ position:'absolute', top:3, left: on ? 21 : 3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 140ms ease' }} />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------- the modal */
function TileBuilder({ open, onClose, onAdd, onUpdate, editTile, initialTab }) {
  const [tab, setTab] = React.useState('ai');
  const [title, setTitle] = React.useState('');
  const [chartType, setChartType] = React.useState('line');
  const [source, setSource] = React.useState('Holdings');
  const [category, setCategory] = React.useState('Date');
  const [valueMode, setValueMode] = React.useState('field'); // 'field' | 'formula'
  const [value, setValue] = React.useState('Sum of Market Value');
  const [formula, setFormula] = React.useState('');
  const [format, setFormat] = React.useState('currency');
  const [groupBy, setGroupBy] = React.useState('Account Type');
  const [limit, setLimit] = React.useState('No Limit');
  const [filters, setFilters] = React.useState(['Account Type = Managed', 'AUM > $100K']);
  const [chartOpts, setChartOpts] = React.useState({ dataLabels:false, legend:true, grid:true, trend:true });
  const [size, setSize] = React.useState('medium');
  const [displayOpts, setDisplayOpts] = React.useState({ metricsRow:true, timestamp:true, seeMore:true, drillDown:true, inflowLegend:true });
  const [metrics, setMetrics] = React.useState(TB_DEFAULT_METRICS);
  const [previewData, setPreviewData] = React.useState(null);
  const [palette, setPalette] = React.useState('emerald');
  const [stacking, setStacking] = React.useState('None');
  const [numFmt, setNumFmt] = React.useState('Abbreviated ($1.2M)');
  // AI tab
  const [prompt, setPrompt] = React.useState('');
  const [aiPhase, setAiPhase] = React.useState('input'); // input | thinking | done
  const [aiBanner, setAiBanner] = React.useState(null);

  React.useEffect(() => {
    if (!open) return;
    if (editTile && editTile._state) {
      const e = editTile._state;
      setTab('custom'); setAiPhase('input'); setPrompt(''); setAiBanner(null);
      setTitle(e.title); setChartType(e.chartType); setSource(e.source); setCategory(e.category);
      setValueMode(e.valueMode); setValue(e.value); setFormula(e.formula); setFormat(e.format);
      setGroupBy(e.groupBy); setLimit(e.limit); setFilters(e.filters); setChartOpts(e.chartOpts);
      setSize(e.size); setDisplayOpts(e.displayOpts); setMetrics(e.metrics); setPreviewData(e.previewData || null);
      setPalette(e.palette); setStacking(e.stacking); setNumFmt(e.numFmt);
    } else {
      setTab(initialTab || 'ai'); setAiPhase('input'); setPrompt(''); setAiBanner(null); setPreviewData(null);
    }
  }, [open, initialTab, editTile]);

  const state = { title, chartType, source, category, valueMode, value, formula, format, groupBy, limit, filters, chartOpts, size, displayOpts, metrics, previewData, palette, stacking, numFmt };

  const runAi = (text) => {
    const p = text != null ? text : prompt;
    if (!p.trim()) return;
    setAiPhase('thinking');
    setTimeout(() => {
      const wantsFormula = /(rate|ratio|per client|per account|average|effective|margin|yield|drift|%|formula|divide|return)/i.test(p);
      if (wantsFormula) {
        const f = window.suggestFormulaFromText(p);
        setTitle(f.title); setChartType('metric'); setValueMode('formula'); setFormula(f.formula); setFormat(f.format);
        setAiBanner({ kind:'formula', text:f.title });
      } else {
        setTitle(p.replace(/\?+$/, '').replace(/^show( me)?\s+/i, '').replace(/^(a|the)\s+/i, ''));
        if (/trend|over time|monthly|weekly|history|flows/i.test(p)) setChartType('line');
        else if (/by |allocation|class|breakdown|mix/i.test(p)) setChartType('donut');
        else if (/top |rank|biggest/i.test(p)) setChartType('bar');
        else setChartType('column');
        setValueMode('field');
        setAiBanner({ kind:'chart', text:p });
      }
      setAiPhase('done');
    }, 1100);
  };

  const isEditing = !!(editTile && editTile._state);
  const apply = () => {
    if (isEditing) { onUpdate(buildTileFromState(state, editTile.canonical ? undefined : editTile.id)); }
    else { onAdd(buildTileFromState(state)); }
    onClose();
  };

  if (!open) return null;

  const TABS = [['ai','AI Builder'], ['custom','Custom'], ['chart','Chart']];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:120, display:'flex', flexDirection:'column',
      background:'var(--app-bg-base, rgb(11,21,36))', backgroundImage:'var(--app-bg-image)', color:TB_INK }}>
      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:14, padding:'18px 28px',
        borderBottom:`1px solid ${TB_BORDER}`, flexShrink:0,
        background:'linear-gradient(90deg, rgba(5,122,85,0.12) 0%, rgba(5,122,85,0.03) 40%, transparent 80%)',
      }}>
        <div style={{ width:44, height:44, borderRadius:11, background:TB_BRAND_SOFT, border:'1px solid rgba(5,122,85,0.4)', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <i className={`fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-plus'}`} style={{ color:TB_BRAND_TXT, fontSize:18 }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'Inter', fontSize:18, fontWeight:700, color:TB_INK }}>{isEditing ? 'Edit Tile' : 'Add New'}</div>
          <div style={{ fontFamily:'Inter', fontSize:13, color:TB_MUTED }}>{isEditing ? (editTile._state.title || 'Customize this tile') : 'Build a new tile'}</div>
        </div>
        <button onClick={onClose} title="Close" style={{ width:34, height:34, borderRadius:9, border:'none', background:'transparent', color:TB_MUTED, cursor:'pointer' }}
          onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
          <i className="fa-solid fa-xmark" style={{ fontSize:18 }} />
        </button>
      </div>

      {/* Body: left controls + right preview */}
      <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'minmax(0, 1fr) minmax(0, 1fr)' }}>
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', minHeight:0, borderRight:`1px solid ${TB_BORDER}` }}>
          {/* tabs */}
          <div style={{ display:'flex', gap:24, padding:'0 28px', borderBottom:`1px solid ${TB_BORDER_SOFT}`, flexShrink:0 }}>
            {TABS.map(([id, lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding:'16px 2px', border:'none', background:'transparent', cursor:'pointer',
                fontFamily:'Inter', fontSize:14, fontWeight:600,
                color: tab === id ? TB_BRAND_TXT : TB_MUTED,
                borderBottom: tab === id ? `2px solid ${TB_BRAND}` : '2px solid transparent', marginBottom:-1,
              }}>{lbl}</button>
            ))}
          </div>

          <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'24px 28px 32px' }}>
            {tab === 'ai' && <TBAiTab {...{ prompt, setPrompt, aiPhase, runAi, aiBanner, setTab }} />}
            {tab === 'custom' && <TBCustomTab {...{ title, setTitle, chartType, setChartType, source, setSource, category, setCategory, valueMode, setValueMode, value, setValue, formula, setFormula, format, setFormat, groupBy, setGroupBy, limit, setLimit, filters, setFilters, chartOpts, setChartOpts, aiBanner, size, setSize, displayOpts, setDisplayOpts, metrics, setMetrics }} />}
            {tab === 'chart' && <TBChartTab {...{ palette, setPalette, stacking, setStacking, numFmt, setNumFmt, chartOpts, setChartOpts }} />}
          </div>
        </div>

        {/* Right preview */}
        <div style={{ display:'flex', flexDirection:'column', minHeight:0, background:'rgba(5,9,16,0.4)' }}>
          <div style={{ padding:'18px 28px 0', fontFamily:'Inter', fontSize:13, fontWeight:600, color:TB_MUTED, flexShrink:0 }}>Preview</div>
          <div style={{ flex:1, minHeight:0, overflowY:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'28px' }}>
            <TBPreview s={state} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:12, padding:'16px 28px', borderTop:`1px solid ${TB_BORDER}`, flexShrink:0, background:'rgba(10,15,24,0.5)' }}>
        <button onClick={onClose} style={{ height:40, padding:'0 20px', borderRadius:9, border:`1px solid ${TB_BORDER}`, background:'transparent', color:TB_INK, fontFamily:'Inter', fontSize:13.5, fontWeight:500, cursor:'pointer' }}>Cancel</button>
        <button onClick={apply} style={{ height:40, padding:'0 24px', borderRadius:9, border:'none', background:TB_BRAND, color:'#fff', fontFamily:'Inter', fontSize:13.5, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 6px 18px -6px rgba(5,122,85,0.6)' }}>
          <i className="fa-solid fa-check" style={{ fontSize:12 }} /> {isEditing ? 'Save changes' : 'Apply'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- AI tab */
function TBAiTab({ prompt, setPrompt, aiPhase, runAi, aiBanner, setTab }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100%' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'12px 8px 24px' }}>
        <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(135deg, ${TB_BRAND} 0%, rgb(4,90,63) 100%)`, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:'0 10px 30px -8px rgba(5,122,85,0.6)' }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color:'#fff', fontSize:26 }} />
        </div>
        <div style={{ fontFamily:'Inter', fontSize:22, fontWeight:700, color:TB_INK, marginBottom:10 }}>What would you like to visualize?</div>
        <p style={{ maxWidth:440, fontFamily:'Inter', fontSize:13.5, color:TB_MUTED, lineHeight:1.55, margin:'0 0 26px' }}>
          Describe the data you want to see and I'll create a custom tile. Ask for charts, tables, metrics — or a calculated value like an effective fee rate.
        </p>

        {aiBanner && aiPhase === 'done' && (
          <div style={{ width:'100%', maxWidth:520, marginBottom:22, padding:'14px 16px', borderRadius:12, background:TB_BRAND_SOFT, border:`1px solid rgba(5,122,85,0.45)`, textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
            <TBIcon name={aiBanner.kind === 'formula' ? 'calc' : 'line'} size={17} color={TB_BRAND_TXT} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:600, color:TB_INK }}>
                {aiBanner.kind === 'formula' ? `Created a formula tile · ${aiBanner.text}` : 'Created your tile — see the preview'}
              </div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:TB_MUTED, marginTop:2 }}>
                {aiBanner.kind === 'formula' ? 'Open Custom to fine-tune the formula in the fx editor.' : 'Switch to Custom to refine fields and styling.'}
              </div>
            </div>
            <button onClick={() => setTab('custom')} style={{ height:32, padding:'0 13px', borderRadius:8, border:'none', background:TB_BRAND, color:'#fff', fontFamily:'Inter', fontSize:12.5, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
              {aiBanner.kind === 'formula' ? 'Edit formula' : 'Refine'}
            </button>
          </div>
        )}

        <div style={{ fontFamily:'Inter', fontSize:11, fontWeight:600, color:TB_MUTED, letterSpacing:'0.08em', marginBottom:14 }}>TRY ONE OF THESE</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%', maxWidth:520 }}>
          {TB_AI_SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setPrompt(s.label); runAi(s.label); }} style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px 15px', borderRadius:12,
              background:'rgba(255,255,255,0.04)', border:`1px solid ${TB_BORDER}`, cursor:'pointer', textAlign:'left',
            }}
              onMouseEnter={(e)=>{ e.currentTarget.style.borderColor='rgba(5,122,85,0.5)'; e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.borderColor=TB_BORDER; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}>
              <span style={{ width:32, height:32, borderRadius:8, background:`${s.tint.replace('rgb','rgba').replace(')',',0.16)')}`, display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <TBIcon name={s.icon} size={15} color={s.tint} />
              </span>
              <span style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:500, color:TB_INK }}>{s.label}</span>
              {s.formula && <span style={{ marginLeft:'auto', fontFamily:TB_MONO, fontSize:9.5, fontWeight:700, color:TB_BRAND_TXT, background:TB_BRAND_SOFT, padding:'2px 6px', borderRadius:5 }}>fx</span>}
            </button>
          ))}
        </div>
      </div>

      {/* prompt bar */}
      <div style={{ flexShrink:0, paddingTop:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 8px 8px 16px', background:'rgba(10,15,24,0.6)', border:`1px solid ${TB_BORDER}`, borderRadius:12 }}>
          <i className="fa-solid fa-circle-plus" style={{ color:TB_MUTED, fontSize:15 }} />
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') runAi(); }}
            placeholder="Describe the tile you want to create…"
            style={{ flex:1, minWidth:0, background:'transparent', border:'none', outline:'none', color:TB_INK, fontFamily:'Inter', fontSize:14 }} />
          <button onClick={() => runAi()} disabled={!prompt.trim() || aiPhase === 'thinking'} style={{
            width:40, height:40, borderRadius:9, border:'none', flexShrink:0,
            background: prompt.trim() && aiPhase !== 'thinking' ? TB_BRAND : 'rgba(5,122,85,0.25)',
            color:'#fff', cursor: prompt.trim() && aiPhase !== 'thinking' ? 'pointer' : 'not-allowed',
          }}>
            {aiPhase === 'thinking' ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-arrow-up" />}
          </button>
        </div>
        <div style={{ textAlign:'center', marginTop:8, fontFamily:'Inter', fontSize:11.5, color:TB_MUTED }}>
          Press <kbd style={{ fontFamily:TB_MONO, fontSize:10.5, padding:'1px 5px', borderRadius:4, background:'rgba(255,255,255,0.06)', border:`1px solid ${TB_BORDER}` }}>Enter</kbd> to send
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Custom tab */
function TBCustomTab(p) {
  const isFormula = p.valueMode === 'formula';
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:30 }}>
      {p.aiBanner && p.aiBanner.kind === 'formula' && (
        <div style={{ padding:'12px 14px', borderRadius:11, background:TB_BRAND_SOFT, border:`1px solid rgba(5,122,85,0.45)`, display:'flex', alignItems:'center', gap:10 }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color:TB_BRAND_TXT, fontSize:14 }} />
          <span style={{ fontFamily:'Inter', fontSize:12.5, color:TB_INK }}>AI wrote this formula from your prompt — edit it below.</span>
        </div>
      )}

      <div>
        <TBSectionHead icon="pen-to-square" title="Title & Labels" />
        <TBField label="Tile Title"><TBInput value={p.title} onChange={p.setTitle} placeholder="e.g. Fee Forecast & Valuation" /></TBField>
      </div>

      <div>
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'4px 0 14px' }}>
          <div style={{ width:26, height:26, borderRadius:7, background:'rgba(255,255,255,0.05)', border:`1px solid ${TB_BORDER_SOFT}`, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
            <TBIcon name="metric" size={13} color={TB_MUTED} />
          </div>
          <span style={{ fontFamily:'Inter', fontSize:15, fontWeight:600, color:TB_INK }}>KPI Cards</span>
          <span style={{ fontFamily:'Inter', fontSize:11.5, color:TB_MUTED, marginLeft:8 }}>shown right below the title</span>
          <button onClick={() => p.setDisplayOpts({ ...p.displayOpts, metricsRow: !p.displayOpts.metricsRow })} style={{
            marginLeft:'auto', width:42, height:24, borderRadius:999, border:'none', cursor:'pointer', flexShrink:0,
            background: p.displayOpts.metricsRow ? TB_BRAND : 'rgba(255,255,255,0.14)', position:'relative', transition:'background 140ms ease',
          }} title={p.displayOpts.metricsRow ? 'Hide KPI cards' : 'Show KPI cards'}>
            <span style={{ position:'absolute', top:3, left: p.displayOpts.metricsRow ? 21 : 3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 140ms ease' }} />
          </button>
        </div>
        {p.displayOpts.metricsRow
          ? <TBMetricsEditor metrics={p.metrics} setMetrics={p.setMetrics} />
          : <div style={{ fontFamily:'Inter', fontSize:12.5, color:TB_MUTED, padding:'2px 0' }}>KPI cards are hidden. Toggle on to add metric cards above the chart.</div>}
      </div>

      <div>
        <TBSectionHead icon="column" title="Chart Type" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
          {TB_CHART_TYPES.map(t => {
            const on = p.chartType === t.id;
            return (
              <button key={t.id} onClick={() => p.setChartType(t.id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'18px 10px', borderRadius:12,
                background: on ? 'rgba(5,122,85,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${on ? TB_BRAND : TB_BORDER_SOFT}`, cursor:'pointer',
              }}>
                <TBIcon name={t.id} size={22} color={on ? TB_BRAND_TXT : TB_MUTED} />
                <span style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:500, color: on ? TB_INK : TB_MUTED }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <TBSectionHead icon="database" title="Data Source" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'end' }}>
          <TBField label="Source"><TBSelect value={p.source} onChange={p.setSource} options={TB_SOURCES} /></TBField>
          <TBField label="Import your Data">
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button style={{ height:42, padding:'0 16px', borderRadius:9, border:'none', background:TB_BRAND, color:'#fff', fontFamily:'Inter', fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
                <i className="fa-solid fa-arrow-up-from-bracket" style={{ fontSize:12 }} /> Upload
              </button>
              <span style={{ fontFamily:'Inter', fontSize:12, color:TB_MUTED }}>Upload a spreadsheet to create a custom tile</span>
            </div>
          </TBField>
        </div>
      </div>

      <div>
        <TBSectionHead icon="layer-group" title="Category & Value" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
          <TBField label="Category (X-Axis)"><TBSelect value={p.category} onChange={p.setCategory} options={TB_CATEGORIES} /></TBField>
          <TBField label="Value (Y-Axis)">
            {/* fx toggle row */}
            <div style={{ display:'flex', gap:8, marginBottom: isFormula ? 4 : 0 }}>
              <div style={{ flex:1, minWidth:0 }}>
                {!isFormula && <TBSelect value={p.value} onChange={p.setValue} options={TB_VALUES} />}
                {isFormula && (
                  <div style={{ display:'flex', alignItems:'center', height:44, padding:'0 12px', borderRadius:9, border:`1px dashed ${TB_BORDER}`, background:'rgba(255,255,255,0.02)', fontFamily:'Inter', fontSize:12.5, color:TB_MUTED }}>
                    Using a custom formula ↓
                  </div>
                )}
              </div>
              <button onClick={() => p.setValueMode(isFormula ? 'field' : 'formula')} title={isFormula ? 'Switch to a field' : 'Write a custom formula'} style={{
                width:46, height:44, borderRadius:9, flexShrink:0, cursor:'pointer',
                border:`1px solid ${isFormula ? TB_BRAND : TB_BORDER}`,
                background: isFormula ? TB_BRAND_SOFT : 'rgba(255,255,255,0.03)',
                color: isFormula ? TB_BRAND_TXT : TB_MUTED,
                fontFamily:TB_MONO, fontStyle:'italic', fontWeight:700, fontSize:15,
              }}>fx</button>
            </div>
          </TBField>
        </div>

        {/* Formula editor */}
        {isFormula && (
          <div style={{ marginTop:18, padding:16, borderRadius:13, background:'rgba(5,122,85,0.05)', border:`1px solid rgba(5,122,85,0.3)` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <i className="fa-solid fa-function" style={{ color:TB_BRAND_TXT, fontSize:13 }} />
              <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:TB_INK }}>Custom Formula</span>
              <span style={{ fontFamily:'Inter', fontSize:11.5, color:TB_MUTED, marginLeft:'auto' }}>Excel-style · references your book data</span>
            </div>
            <FormulaEditor value={p.formula} onChange={p.setFormula} format={p.format} onFormatChange={p.setFormat} />
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginTop:18 }}>
          <TBField label="Group By"><TBSelect value={p.groupBy} onChange={p.setGroupBy} options={TB_GROUPBY} /></TBField>
          <TBField label="Limit Results"><TBSelect value={p.limit} onChange={p.setLimit} options={TB_LIMITS} /></TBField>
        </div>
      </div>

      <div>
        <TBSectionHead icon="filter" title="Filters" />
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {p.filters.map((f, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, background:'rgba(120,160,230,0.14)', border:'1px solid rgba(120,160,230,0.4)', fontFamily:'Inter', fontSize:12.5, color:'rgb(160,190,245)' }}>
              {f}
              <i className="fa-solid fa-xmark" onClick={() => p.setFilters(p.filters.filter((_, j) => j !== i))} style={{ fontSize:11, cursor:'pointer' }} />
            </span>
          ))}
          <button onClick={() => p.setFilters([...p.filters, 'New filter'])} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'7px 12px', borderRadius:8, background:'transparent', border:`1px dashed ${TB_BORDER}`, color:TB_MUTED, fontFamily:'Inter', fontSize:12.5, cursor:'pointer' }}>
            <i className="fa-solid fa-plus" style={{ fontSize:11 }} /> Add Filter
          </button>
        </div>
      </div>

      <div>
        <TBSectionHead icon="gear" title="Chart Options" />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <TBToggle title="Show Data Labels" desc="Display values on chart points" on={p.chartOpts.dataLabels} onToggle={() => p.setChartOpts({ ...p.chartOpts, dataLabels: !p.chartOpts.dataLabels })} />
          <TBToggle title="Show Legend" desc="Display chart legend" on={p.chartOpts.legend} onToggle={() => p.setChartOpts({ ...p.chartOpts, legend: !p.chartOpts.legend })} />
          <TBToggle title="Show Grid Lines" desc="Display background grid" on={p.chartOpts.grid} onToggle={() => p.setChartOpts({ ...p.chartOpts, grid: !p.chartOpts.grid })} />
          <TBToggle title="Show Trend Line" desc="Add projection/forecast line" on={p.chartOpts.trend} onToggle={() => p.setChartOpts({ ...p.chartOpts, trend: !p.chartOpts.trend })} />
        </div>
      </div>

      <div style={{ height:1, background:TB_BORDER_SOFT, margin:'2px 0' }} />

      <div>
        <TBSectionHead icon="table-columns" title="Tile Size" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
          {[['small','Small (1 col)',1], ['medium','Medium (2 col)',2], ['large','Large (3 col)',3], ['full','Full',1]].map(([id, lbl, cols]) => {
            const on = p.size === id;
            return (
              <button key={id} onClick={() => p.setSize(id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'22px 10px', borderRadius:12,
                background: on ? 'rgba(5,122,85,0.12)' : 'rgba(255,255,255,0.03)', border:`1px solid ${on ? TB_BRAND : TB_BORDER_SOFT}`, cursor:'pointer',
              }}>
                <div style={{ display:'flex', gap:3, height:30, alignItems:'center' }}>
                  {id === 'full'
                    ? <div style={{ width:54, height:22, borderRadius:4, background: on ? TB_BRAND : 'rgba(255,255,255,0.18)' }} />
                    : Array.from({ length: cols }).map((_, i) => <div key={i} style={{ width:14, height:26, borderRadius:4, background: on ? TB_BRAND : 'rgba(255,255,255,0.18)' }} />)}
                </div>
                <span style={{ fontFamily:'Inter', fontSize:12.5, fontWeight:500, color: on ? TB_INK : TB_MUTED }}>{lbl}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <TBSectionHead icon="eye" title="Display Options" />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <TBToggle title="Show Timestamp" desc='Display "As of" date' on={p.displayOpts.timestamp} onToggle={() => p.setDisplayOpts({ ...p.displayOpts, timestamp: !p.displayOpts.timestamp })} />
          <TBToggle title='Show "See More" Link' desc="Add link to detailed view" on={p.displayOpts.seeMore} onToggle={() => p.setDisplayOpts({ ...p.displayOpts, seeMore: !p.displayOpts.seeMore })} />
          <TBToggle title="Enable Drill Down" desc="Allow clicking for details" on={p.displayOpts.drillDown} onToggle={() => p.setDisplayOpts({ ...p.displayOpts, drillDown: !p.displayOpts.drillDown })} />
          <TBToggle title="Show Inflow/Outflow Legend" desc="Display color legend" on={p.displayOpts.inflowLegend} onToggle={() => p.setDisplayOpts({ ...p.displayOpts, inflowLegend: !p.displayOpts.inflowLegend })} />
        </div>
      </div>
    </div>
  );
}

/* KPI-card editor: each card is a label + a field OR a custom fx formula. */
function TBMetricsEditor({ metrics, setMetrics }) {
  const update = (id, patch) => setMetrics(metrics.map(m => m.id === id ? { ...m, ...patch } : m));
  const remove = (id) => setMetrics(metrics.filter(m => m.id !== id));
  const add = () => {
    if (metrics.length >= 4) return;
    setMetrics([...metrics, { id: 'm' + Date.now(), label: 'New metric', mode: 'field', field: 'MarketValue', formula: '', format: 'currency' }]);
  };
  const fields = (window.FIELD_SCHEMA || []).map(f => f.name);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {metrics.map((m) => {
        const isF = m.mode === 'formula';
        const isStatic = m.mode === 'static';
        const res = isF ? window.evalFormula(m.formula) : null;
        return (
          <div key={m.id} style={{ padding:'12px 13px', borderRadius:11, background:'rgba(255,255,255,0.03)', border:`1px solid ${TB_BORDER_SOFT}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontFamily:'Inter', fontSize:10.5, color:TB_MUTED, width:34, flexShrink:0 }}>Label</span>
              <input value={m.label} onChange={(e) => update(m.id, { label: e.target.value })} placeholder="Card label" style={{
                flex:1, minWidth:0, background:'rgba(10,15,24,0.6)', border:`1px solid ${TB_BORDER}`, borderRadius:8,
                color:TB_INK, fontFamily:'Inter', fontSize:13, padding:'8px 10px', outline:'none',
              }} />
              <span style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, color:TB_INK, fontVariantNumeric:'tabular-nums', minWidth:64, textAlign:'right' }}>{tbMetricValue(m)}</span>
              <button onClick={() => remove(m.id)} title="Remove" disabled={metrics.length <= 1} style={{
                width:28, height:28, borderRadius:7, border:'none', background:'transparent', color:TB_MUTED,
                cursor: metrics.length <= 1 ? 'not-allowed' : 'pointer', opacity: metrics.length <= 1 ? 0.4 : 1, flexShrink:0,
              }}><i className="fa-solid fa-trash-can" style={{ fontSize:12 }} /></button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:9 }}>
              <span style={{ fontFamily:'Inter', fontSize:10.5, color:TB_MUTED, width:34, flexShrink:0 }}>Value</span>
              <div style={{ flex:1, minWidth:0 }}>
                {isStatic ? (
                  <input value={m.value} onChange={(e) => update(m.id, { value: e.target.value })} placeholder="$0.00" style={{
                    width:'100%', background:'rgba(10,15,24,0.6)', border:`1px solid ${TB_BORDER}`, borderRadius:8,
                    color:TB_INK, fontFamily:'Inter', fontSize:13, padding:'8px 10px', outline:'none', fontVariantNumeric:'tabular-nums',
                  }} />
                ) : !isF ? (
                  <div style={{ position:'relative' }}>
                    <select value={m.field} onChange={(e) => update(m.id, { field: e.target.value })} style={{
                      width:'100%', appearance:'none', WebkitAppearance:'none', background:'rgba(10,15,24,0.6)',
                      border:`1px solid ${TB_BORDER}`, borderRadius:8, color:TB_INK, fontFamily:'Inter', fontSize:13, padding:'8px 30px 8px 10px', cursor:'pointer', outline:'none',
                    }}>{fields.map(f => <option key={f} value={f} style={{ background:'rgb(20,28,42)' }}>{f}</option>)}</select>
                    <i className="fa-solid fa-chevron-down" style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', fontSize:10, color:TB_MUTED, pointerEvents:'none' }} />
                  </div>
                ) : (
                  <input value={m.formula} onChange={(e) => update(m.id, { formula: e.target.value })} placeholder="= Fees / AUM" spellCheck={false} style={{
                    width:'100%', background:'rgba(10,15,24,0.6)', border:`1px solid ${res && !res.ok && !res.empty ? 'rgba(248,113,113,0.5)' : TB_BORDER}`, borderRadius:8,
                    color:TB_INK, fontFamily:TB_MONO, fontSize:12.5, padding:'8px 10px', outline:'none',
                  }} />
                )}
              </div>
              {isStatic ? (
                <button onClick={() => update(m.id, { mode:'field', field: m.field || 'MarketValue' })} title="Use a field or formula instead" style={{
                  height:34, padding:'0 10px', borderRadius:8, flexShrink:0, cursor:'pointer',
                  border:`1px solid ${TB_BORDER}`, background:'rgba(255,255,255,0.03)', color:TB_MUTED, fontFamily:'Inter', fontSize:12, fontWeight:500,
                }}>Link data</button>
              ) : (
                <button onClick={() => update(m.id, { mode: isF ? 'field' : 'formula' })} title={isF ? 'Use a field' : 'Use a formula'} style={{
                  width:34, height:34, borderRadius:8, flexShrink:0, cursor:'pointer',
                  border:`1px solid ${isF ? TB_BRAND : TB_BORDER}`, background: isF ? TB_BRAND_SOFT : 'rgba(255,255,255,0.03)',
                  color: isF ? TB_BRAND_TXT : TB_MUTED, fontFamily:TB_MONO, fontStyle:'italic', fontWeight:700, fontSize:13,
                }}>fx</button>
              )}
              {!isStatic && (
                <div style={{ display:'flex', border:`1px solid ${TB_BORDER}`, borderRadius:8, overflow:'hidden', flexShrink:0 }}>
                  {[['currency','$'],['percent','%'],['number','#']].map(([f, sym]) => (
                    <button key={f} onClick={() => update(m.id, { format: f })} title={f} style={{
                      width:26, height:34, border:'none', cursor:'pointer', fontFamily:TB_MONO, fontSize:12, fontWeight:600,
                      background: m.format === f ? TB_BRAND_SOFT : 'transparent', color: m.format === f ? TB_BRAND_TXT : TB_MUTED,
                    }}>{sym}</button>
                  ))}
                </div>
              )}
            </div>
            {isF && res && !res.ok && !res.empty && (
              <div style={{ marginTop:7, marginLeft:42, fontFamily:'Inter', fontSize:11.5, color:'rgb(248,113,113)', display:'flex', alignItems:'center', gap:6 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize:10 }} /> {res.error}
              </div>
            )}
          </div>
        );
      })}
      {metrics.length < 4 && (
        <button onClick={add} style={{
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:10,
          background:'transparent', border:`1px dashed ${TB_BORDER}`, color:TB_MUTED, fontFamily:'Inter', fontSize:12.5, fontWeight:500, cursor:'pointer',
        }}>
          <i className="fa-solid fa-plus" style={{ fontSize:11 }} /> Add KPI card
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Chart tab */
function TBChartTab({ palette, setPalette, stacking, setStacking, numFmt, setNumFmt, chartOpts, setChartOpts }) {
  const PALETTES = {
    emerald:  ['rgb(94,214,164)', 'rgb(120,200,210)', 'rgb(5,122,85)', 'rgb(173,250,29)'],
    ocean:    ['rgb(120,160,230)', 'rgb(94,177,239)', 'rgb(0,144,255)', 'rgb(120,200,210)'],
    sunset:   ['rgb(245,200,90)', 'rgb(240,140,120)', 'rgb(248,113,113)', 'rgb(200,170,130)'],
    violet:   ['rgb(180,150,235)', 'rgb(124,58,237)', 'rgb(120,160,230)', 'rgb(94,214,164)'],
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:30 }}>
      <div>
        <TBSectionHead icon="droplet" title="Series Colors" />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {Object.entries(PALETTES).map(([id, cols]) => {
            const on = palette === id;
            return (
              <button key={id} onClick={() => setPalette(id)} style={{
                display:'flex', alignItems:'center', gap:14, padding:'12px 14px', borderRadius:11, cursor:'pointer',
                background: on ? 'rgba(5,122,85,0.1)' : 'rgba(255,255,255,0.03)', border:`1px solid ${on ? TB_BRAND : TB_BORDER_SOFT}`,
              }}>
                <div style={{ display:'flex', gap:5 }}>
                  {cols.map((c, i) => <span key={i} style={{ width:22, height:22, borderRadius:6, background:c }} />)}
                </div>
                <span style={{ fontFamily:'Inter', fontSize:13.5, fontWeight:500, color: on ? TB_INK : TB_MUTED, textTransform:'capitalize' }}>{id}</span>
                {on && <i className="fa-solid fa-check" style={{ marginLeft:'auto', color:TB_BRAND_TXT, fontSize:13 }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <TBSectionHead icon="layer-group" title="Axis & Format" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
          <TBField label="Stacking"><TBSelect value={stacking} onChange={setStacking} options={['None', 'Stacked', '100% Stacked']} /></TBField>
          <TBField label="Number Format"><TBSelect value={numFmt} onChange={setNumFmt} options={['Abbreviated ($1.2M)', 'Full ($1,234,567)', 'Percent (%)', 'Plain (1234)']} /></TBField>
        </div>
      </div>

      <div>
        <TBSectionHead icon="filter" title="Axes" />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <TBToggle title="Show X-Axis" desc="Display horizontal axis & labels" on={chartOpts.grid} onToggle={() => setChartOpts({ ...chartOpts, grid: !chartOpts.grid })} />
          <TBToggle title="Show Data Labels" desc="Print values directly on the chart" on={chartOpts.dataLabels} onToggle={() => setChartOpts({ ...chartOpts, dataLabels: !chartOpts.dataLabels })} />
          <TBToggle title="Show Trend Line" desc="Overlay a projection / forecast" on={chartOpts.trend} onToggle={() => setChartOpts({ ...chartOpts, trend: !chartOpts.trend })} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TileBuilder, buildTileFromState, canonicalTileState, TBPreview });
