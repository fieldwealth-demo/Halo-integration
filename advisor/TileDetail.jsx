/* TileDetail — generic detail page for tile "See more" actions.
   Shows chart(s) on top and a data table below. */

// Source palette — typographic-only marks (no copyrighted logos).
// Each entry: short name + dot color used in compact pills.
const SOURCE_META = {
  schwab:    { name:'Schwab',     short:'SCHW', dot:'rgb(0,164,228)'  },
  fidelity:  { name:'Fidelity',   short:'FID',  dot:'rgb(80,175,90)'  },
  pershing:  { name:'Pershing',   short:'PSHG', dot:'rgb(245,158,11)' },
  ibkr:      { name:'IBKR',       short:'IBKR', dot:'rgb(220,38,38)'  },
  altruist:  { name:'Altruist',   short:'ALT',  dot:'rgb(168,85,247)' },
  jpm:       { name:'JP Morgan',  short:'JPM',  dot:'rgb(125,80,40)'  },
  vanguard:  { name:'Vanguard',   short:'VG',   dot:'rgb(190,30,45)'  },
  raymond:   { name:'Raymond James', short:'RJF', dot:'rgb(245,200,90)' },
  goldman:   { name:'Goldman',    short:'GS',   dot:'rgb(110,170,235)'},
  bny:       { name:'BNY Mellon', short:'BNY',  dot:'rgb(56,189,248)' },
  apex:      { name:'Apex',       short:'APX',  dot:'rgb(110,231,183)'},
  blackrock: { name:'BlackRock',  short:'BLK',  dot:'rgb(40,40,40)'   },
  betterment:{ name:'Betterment', short:'BTM',  dot:'rgb(0,180,140)'  },
  internal:  { name:'FieldWealth',short:'FW',   dot:'rgb(5,122,85)'   },
};

function SourceDot({ id, size=8 }) {
  const m = SOURCE_META[id]; if (!m) return null;
  return <span style={{ width:size, height:size, borderRadius:size, background:m.dot, display:'inline-block', flexShrink:0 }} />;
}

// Compact pill — label + dot. Used inside table rows.
function SourcePill({ id }) {
  const m = SOURCE_META[id]; if (!m) return null;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px 2px 7px', borderRadius:999,
      border:'1px solid rgba(75,85,99,0.7)',
      background:'rgba(255,255,255,0.03)',
      fontFamily:'Inter', fontSize:11, fontWeight:500,
      color:'rgb(229,231,235)', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap',
    }}>
      <SourceDot id={id} />
      {m.name}
    </span>
  );
}

// Ownership badge — who holds the account (David / Emily / Joint).
const OWNER_META = {
  David: { label:'David', color:'rgb( 94,214,164)', bg:'rgba(5,122,85,0.16)',   bd:'rgba(16,185,129,0.45)' },
  Emily: { label:'Emily', color:'rgb(196,166,250)', bg:'rgba(168,85,247,0.16)', bd:'rgba(168,85,247,0.45)' },
  Joint: { label:'Joint', color:'rgb(120,160,230)', bg:'rgba(59,130,246,0.16)', bd:'rgba(96,165,250,0.45)' },
};
function OwnerBadge({ name }) {
  const m = OWNER_META[name] || { label:name, color:'rgb(163,163,163)', bg:'rgba(255,255,255,0.04)', bd:'rgba(75,85,99,0.7)' };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 9px 2px 7px', borderRadius:9999,
      background:m.bg, border:`1px solid ${m.bd}`,
      fontFamily:'Inter', fontSize:11, fontWeight:600, color:m.color, whiteSpace:'nowrap',
    }}>
      <span style={{ width:6, height:6, borderRadius:9999, background:m.color }} />
      {m.label}
    </span>
  );
}

// Header strip — "Data sources" with a row of small chips and a freshness time.
function SourcesStrip({ sources, syncedAt }) {
  if (!sources || !sources.length) return null;
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
      padding:'10px 14px', borderRadius:10,
      border:'1px solid rgb(75,85,99)', background:'rgba(255,255,255,0.03)',
      flexShrink:0, alignSelf:'flex-end',
    }}>
      <div style={{
        fontFamily:'Inter', fontSize:10.5, fontWeight:600,
        color:'rgb(163,163,163)', letterSpacing:'0.08em', textTransform:'uppercase',
      }}>
        <i className="fa-solid fa-link" style={{ marginRight:6, fontSize:9, color:'rgb(110,231,183)' }} />
        Data sources
      </div>
      <div style={{ width:1, height:14, background:'rgba(75,85,99,0.7)' }} />
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {sources.map(s => <SourcePill key={s} id={s} />)}
      </div>
      {syncedAt && (
        <>
          <div style={{ width:1, height:14, background:'rgba(75,85,99,0.7)' }} />
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)' }}>
            <span style={{ width:7, height:7, borderRadius:7, background:'rgb(110,231,183)', boxShadow:'0 0 0 3px rgba(110,231,183,0.15)' }} />
            Synced {syncedAt}
          </div>
        </>
      )}
    </div>
  );
}

function TileDetail({ kind, onBack, backLabel='Back to Dashboard', hideBack=false }) {
  const cfg = TILE_DETAIL_CONFIG[kind] || TILE_DETAIL_CONFIG.aum;
  return (
    <div style={{ padding:'16px 24px 32px', color:'rgb(249,250,251)' }}>
      {!hideBack && (
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <button onClick={onBack} style={{
            height:30, padding:'0 12px', borderRadius:8, border:'1px solid rgb(75,85,99)',
            background:'transparent', color:'rgb(229,231,235)',
            fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
            display:'inline-flex', alignItems:'center', gap:6,
          }}>
            <i className="fa-solid fa-chevron-left" style={{ width:11, height:11 }} /> {backLabel}
          </button>
          <div style={{ flex:1 }} />
          <button data-no-hint style={{
            height:30, padding:'0 12px', borderRadius:8, border:'1px solid rgb(75,85,99)',
            background:'transparent', color:'rgb(229,231,235)',
            fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
            display:'inline-flex', alignItems:'center', gap:6,
          }}>
            <i className="fa-solid fa-download" style={{ width:11, height:11 }} /> Export
          </button>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'flex-end', gap:16, marginBottom:22 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontSize:11, color:'rgb(163,163,163)', letterSpacing:'0.06em', textTransform:'uppercase', lineHeight:1.6, marginBottom:6 }}>{cfg.kicker}</div>
          <div style={{ fontFamily:'Inter', fontSize:26, fontWeight:600, letterSpacing:'-0.01em', lineHeight:1.2 }}>{cfg.title}</div>
          <div style={{ fontFamily:'Inter', fontSize:13, color:'rgb(163,163,163)', marginTop:8, lineHeight:1.55 }}>{cfg.subtitle}</div>
        </div>
        <SourcesStrip sources={cfg.sources} syncedAt={cfg.syncedAt} />
      </div>

      {/* KPI strip */}
      {cfg.kpis && (
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${cfg.kpis.length}, 1fr)`, gap:12, marginBottom:16 }}>
          {cfg.kpis.map((k,i) => (
            <div key={i} style={{
              padding:'14px 16px', borderRadius:12, border:'1px solid rgb(75,85,99)',
              background:'rgba(255,255,255,0.04)',
            }}>
              <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>{k.label}</div>
              <div style={{ fontFamily:'Inter', fontSize:22, fontWeight:600, fontVariantNumeric:'tabular-nums', marginTop:4 }}>{k.value}</div>
              {k.delta && <div style={{ fontFamily:'Inter', fontSize:11.5, color:k.tone==='down'?'rgb(248,113,113)':'rgb(110,231,183)', marginTop:4, display:'inline-flex', alignItems:'center', gap:5 }}>
                <i className={`fa-solid fa-arrow-${k.tone==='down'?'down':'up'}`} style={{ width:9, height:9 }} /> {k.delta}
              </div>}
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div style={{
        padding:'16px 16px 8px', borderRadius:14, border:'1px solid rgb(75,85,99)',
        background:'rgba(255,255,255,0.04)', marginBottom:18,
      }}>
        <div style={{ display:'flex', alignItems:'center', marginBottom:8 }}>
          <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600 }}>{cfg.chartTitle}</div>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', gap:6 }}>
            {['1M','3M','YTD','1Y','5Y','All'].map((r,i) => (
              <button key={r} data-no-hint style={{
                height:24, padding:'0 10px', borderRadius:6,
                border:'1px solid ' + (i===2?'rgb(5,122,85)':'rgb(75,85,99)'),
                background: i===2?'rgba(5,122,85,0.22)':'transparent',
                color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:11, cursor:'pointer',
              }}>{r}</button>
            ))}
          </div>
        </div>
        <div style={{ minHeight:320 }}>
          <HC options={cfg.chartOpts} />
        </div>
      </div>

      {/* Data table */}
      <div style={{
        borderRadius:14, border:'1px solid rgb(75,85,99)',
        background:'rgba(255,255,255,0.04)', overflow:'hidden',
      }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgb(75,85,99)', display:'flex', alignItems:'center' }}>
          <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600 }}>{cfg.tableTitle}</div>
          <div style={{ flex:1 }} />
          <div style={{ fontFamily:'Inter', fontSize:11.5, color:'rgb(163,163,163)' }}>{cfg.rows.filter(r=>!r.section&&!r.total).length} rows</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {cfg.cols.map((c,i) => (
                <th key={i} style={{
                  textAlign: c.align||'left', padding:'10px 16px',
                  fontFamily:'Inter', fontSize:10.5, fontWeight:600,
                  color: c.headColor || 'rgb(163,163,163)',
                  letterSpacing:'0.06em', textTransform:'uppercase',
                  borderBottom:'1px solid rgb(75,85,99)', whiteSpace:'nowrap',
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cfg.rows.map((r,i) => {
              // Section header row spanning all columns
              if (r.section) {
                return (
                  <tr key={i}>
                    <td colSpan={cfg.cols.length} style={{
                      padding:'12px 16px 9px', fontFamily:'Inter', fontSize:10.5, fontWeight:700,
                      letterSpacing:'0.08em', textTransform:'uppercase',
                      color: r.tone==='neg' ? 'rgb(248,113,113)' : 'rgb(110,231,183)',
                      background:'rgba(255,255,255,0.025)',
                      borderTop: i===0 ? 'none' : '1px solid rgb(75,85,99)',
                      borderBottom:'1px solid rgba(75,85,99,0.6)',
                    }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
                        <span style={{ width:7, height:7, borderRadius:9999, background: r.tone==='neg' ? 'rgb(248,113,113)' : 'rgb(110,231,183)' }} />
                        {r.section}
                      </span>
                    </td>
                  </tr>
                );
              }
              // Subtotal / total row
              if (r.total) {
                return (
                  <tr key={i} style={{ borderBottom:'1px solid rgb(75,85,99)', background: r.accent ? 'rgba(5,122,85,0.10)' : 'rgba(255,255,255,0.035)' }}>
                    {cfg.cols.map((c,j) => {
                      const tv = j===0 ? r.label : r[c.key];
                      return (
                        <td key={j} style={{
                          padding:'13px 16px', fontFamily:'Inter', fontSize:12.5, fontWeight:700,
                          color: c.num && r.tone==='neg' ? 'rgb(248,113,113)' : 'rgb(249,250,251)',
                          fontVariantNumeric: c.num?'tabular-nums':'normal',
                          textAlign: c.align||'left',
                        }}>{tv == null ? '' : tv}</td>
                      );
                    })}
                  </tr>
                );
              }
              // Regular line item
              return (
                <tr key={i} style={{ borderBottom:'1px solid rgba(75,85,99,0.45)' }}>
                  {cfg.cols.map((c,j) => {
                    const v = r[c.key];
                    const empty = c.ownerCol && (v == null || v === '');
                    const content = empty
                      ? <span style={{ color:'rgb(107,114,128)' }}>—</span>
                      : c.kind === 'source'
                      ? (Array.isArray(v) ? <span style={{ display:'inline-flex', gap:4, flexWrap:'wrap', justifyContent: c.align==='right'?'flex-end':'flex-start' }}>{v.map(s=> <SourcePill key={s} id={s} />)}</span> : <SourcePill id={v} />)
                      : c.kind === 'owner'
                      ? <OwnerBadge name={v} />
                      : (typeof v==='function' ? v() : v);
                    return (
                      <td key={j} style={{
                        padding:'12px 16px', fontFamily:'Inter', fontSize:12.5,
                        color: c.muted?'rgb(163,163,163)':'rgb(229,231,235)',
                        fontVariantNumeric: c.num?'tabular-nums':'normal',
                        textAlign: c.align||'left',
                        fontWeight: c.bold?600:400,
                        whiteSpace: (c.kind==='source'||c.kind==='owner') ? 'nowrap' : undefined,
                      }}>{content}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const _GREEN = 'rgb(5,122,85)';
const _GREENS = ['rgb(5,122,85)','rgb(16,185,129)','rgb(110,231,183)','rgb(167,243,208)'];

const TILE_DETAIL_CONFIG = {
  aum_alloc: {
    kicker:'Portfolio · Detail',
    title:'AUM Asset Allocation',
    subtitle:'Breakdown across asset classes for $42.3M under management',
    sources:['schwab','fidelity','pershing','altruist'],
    syncedAt:'12 min ago',
    chartTitle:'Allocation drift over time',
    tableTitle:'Holdings by asset class',
    kpis:[
      { label:'Total AUM', value:'$42.3M', delta:'+3.4% QoQ', tone:'up' },
      { label:'Largest Allocation', value:'Equities · 28%' },
      { label:'Drift since model', value:'1.8%', delta:'within tolerance', tone:'up' },
    ],
    chartOpts: {
      chart:{ type:'area', height:320 },
      xAxis:{ categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
      yAxis:{ title:{text:null}, labels:{ formatter: function(){ return this.value+'%'; } } },
      tooltip:{ shared:true, valueSuffix:'%' },
      plotOptions:{ area:{ stacking:'percent', lineWidth:1, marker:{enabled:false}, fillOpacity:0.55 } },
      legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
      series:[
        { name:'Equities',     color:'rgb( 94,214,164)', data:[26,27,27,28,28,28,28,29,28,28,28,28] },
        { name:'Fixed Income', color:'rgb(120,160,230)', data:[20,19,19,19,18,18,18,18,18,18,18,18] },
        { name:'Alternatives', color:'rgb(180,150,235)', data:[12,13,13,13,14,14,14,14,14,14,14,14] },
        { name:'Private',      color:'rgb(245,200, 90)', data:[11,11,11,12,12,12,12,12,12,12,12,12] },
        { name:'Real Estate',  color:'rgb(240,140,120)', data:[10,10,10,10,10,10,10,10,10,10,10,10] },
        { name:'Cash',         color:'rgb(120,200,210)', data:[ 9, 8, 8, 8, 8, 8, 8, 7, 8, 8, 8, 8] },
        { name:'Hedge',        color:'rgb(200,170,130)', data:[ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6] },
        { name:'Other',        color:'rgb(160,170,185)', data:[ 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
      ],
    },
    cols:[
      { key:'asset', label:'Asset Class' },
      { key:'value', label:'Market Value', align:'right', num:true, bold:true },
      { key:'pct',   label:'% of Portfolio', align:'right', num:true },
      { key:'target',label:'Target', align:'right', num:true, muted:true },
      { key:'drift', label:'Drift', align:'right', num:true },
      { key:'ytd',   label:'YTD Return', align:'right', num:true },
    ],
    rows:[
      { asset:'Equities',     value:'$11.84M', pct:'28%', target:'27%', drift:'+1.0%', ytd:'+14.2%' },
      { asset:'Fixed Income', value:'$7.61M',  pct:'18%', target:'19%', drift:'-1.0%', ytd:'+3.4%'  },
      { asset:'Alternatives', value:'$5.92M',  pct:'14%', target:'14%', drift:'0.0%',  ytd:'+8.9%'  },
      { asset:'Private',      value:'$5.07M',  pct:'12%', target:'12%', drift:'0.0%',  ytd:'+11.2%' },
      { asset:'Real Estate',  value:'$4.23M',  pct:'10%', target:'11%', drift:'-1.0%', ytd:'+5.7%'  },
      { asset:'Cash',         value:'$3.38M',  pct:'8%',  target:'7%',  drift:'+1.0%', ytd:'+1.2%'  },
      { asset:'Hedge',        value:'$2.54M',  pct:'6%',  target:'6%',  drift:'0.0%',  ytd:'+6.1%'  },
      { asset:'Other',        value:'$1.69M',  pct:'4%',  target:'4%',  drift:'0.0%',  ytd:'+2.0%'  },
    ],
  },

  billing: {
    kicker:'Practice · Detail',
    title:'Billing Summary',
    subtitle:'Quarterly billing, fee schedule and projected run rate',
    sources:['schwab','fidelity','pershing','internal'],
    syncedAt:'2 hr ago',
    chartTitle:'Quarterly fees ($K)',
    tableTitle:'Invoices this quarter',
    kpis:[
      { label:'Total Billable Assets', value:'$16.5M', delta:'+2.4% vs last quarter', tone:'up' },
      { label:'Quarterly Fee', value:'$43,999', delta:'+$1,250 vs Q2', tone:'up' },
      { label:'Fee Run Rate', value:'$175,996', delta:'Annual projection', tone:'up' },
    ],
    chartOpts: {
      chart:{ type:'column', height:320 },
      xAxis:{ categories:['Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25'] },
      yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'K'; } } },
      legend:{ enabled:false },
      tooltip:{ valuePrefix:'$', valueSuffix:'K' },
      series:[{ name:'Fees', color:'rgba(5,122,85,0.45)', borderColor:_GREEN, borderWidth:1.5, data:[36,38,40,41,42,42.5,43.5,44] }],
    },
    cols:[
      { key:'invoice', label:'Invoice' },
      { key:'client',  label:'Client' },
      { key:'period',  label:'Period' },
      { key:'aum',     label:'Billable AUM', align:'right', num:true },
      { key:'rate',    label:'Rate', align:'right', num:true, muted:true },
      { key:'fee',     label:'Fee', align:'right', num:true, bold:true },
      { key:'status',  label:'Status' },
    ],
    rows:[
      { invoice:'INV-2025-0481', client:'David Young',     period:'Q3 2025', aum:'$31.24M', rate:'0.85%', fee:'$66,386', status:'Paid' },
      { invoice:'INV-2025-0482', client:'Edwards Family',  period:'Q3 2025', aum:'$30.85M', rate:'0.85%', fee:'$65,565', status:'Paid' },
      { invoice:'INV-2025-0483', client:'Hawkins Family',  period:'Q3 2025', aum:'$29.47M', rate:'0.90%', fee:'$66,300', status:'Paid' },
      { invoice:'INV-2025-0484', client:'Smith Trust',     period:'Q3 2025', aum:'$28.99M', rate:'0.85%', fee:'$61,604', status:'Pending' },
      { invoice:'INV-2025-0485', client:'Watson Holdings', period:'Q3 2025', aum:'$27.26M', rate:'0.90%', fee:'$61,326', status:'Paid' },
      { invoice:'INV-2025-0486', client:'Jones Family',    period:'Q3 2025', aum:'$18.15M', rate:'0.95%', fee:'$43,116', status:'Paid' },
      { invoice:'INV-2025-0487', client:'Lang Trust',      period:'Q3 2025', aum:'$16.47M', rate:'0.95%', fee:'$39,116', status:'Pending' },
    ],
  },

  aum: {
    kicker:'Portfolio · Detail',
    title:'Assets Under Management',
    subtitle:'AUM and held-away balances by account type',
    sources:['schwab','fidelity','pershing','altruist','jpm'],
    syncedAt:'8 min ago',
    chartTitle:'AUM trend ($M)',
    tableTitle:'Account roster',
    kpis:[
      { label:'Total AUM', value:'$2.50B', delta:'+8.4% YoY', tone:'up' },
      { label:'Assets Held Away', value:'$1.00B', delta:'+1.1% YoY', tone:'up' },
      { label:'Net New Assets',   value:'$184M',  delta:'YTD',       tone:'up' },
    ],
    chartOpts: {
      chart:{ type:'area', height:320 },
      xAxis:{ categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
      yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'M'; } } },
      legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
      tooltip:{ shared:true, valuePrefix:'$', valueSuffix:'M' },
      series:[
        { type:'area', name:'AUM',       color:'rgb(5,122,85)',
          fillColor:{ linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
          lineWidth:2, marker:{ enabled:true, radius:3.5, fillColor:'rgb(10,10,10)', lineColor:'rgb(5,122,85)', lineWidth:2, symbol:'circle' },
          data:[2300,2320,2350,2380,2400,2420,2440,2460,2470,2480,2490,2500] },
        { type:'line', name:'Held Away', color:'rgb(120,160,230)',
          lineWidth:2, marker:{ enabled:true, radius:3.5, fillColor:'rgb(10,10,10)', lineColor:'rgb(120,160,230)', lineWidth:2, symbol:'circle' },
          data:[ 950, 960, 965, 970, 980, 985, 988, 990, 992, 995, 998,1000] },
      ],
    },
    cols:[
      { key:'account', label:'Account Type' },
      { key:'count',   label:'# Accounts', align:'right', num:true },
      { key:'aum',     label:'AUM', align:'right', num:true, bold:true },
      { key:'held',    label:'Held Away', align:'right', num:true },
      { key:'totalbal', label:'Total', align:'right', num:true },
      { key:'avg',     label:'Avg Balance', align:'right', num:true, muted:true },
    ],
    rows:[
      { account:'Qualified Retirement', count:'124', aum:'$780M', held:'$220M', totalbal:'$1.00B', avg:'$8.06M'  },
      { account:'Taxable Investment',   count:'186', aum:'$640M', held:'$180M', totalbal:'$820M',  avg:'$4.41M'  },
      { account:'Cash Equivalent',      count:'92',  aum:'$500M', held:'$280M', totalbal:'$780M',  avg:'$8.48M'  },
      { account:'Life Insurance',       count:'58',  aum:'$400M', held:'$220M', totalbal:'$620M',  avg:'$10.69M' },
      { account:'Other',                count:'31',  aum:'$180M', held:'$100M', totalbal:'$280M',  avg:'$9.03M'  },
    ],
  },

  holdings: {
    kicker:'Portfolio · Detail',
    title:'Holdings Breakdown',
    subtitle:'All funds held across the practice grouped by family',
    sources:['schwab','fidelity','vanguard','blackrock'],
    syncedAt:'5 min ago',
    chartTitle:'Top 10 holdings by AUM ($M)',
    tableTitle:'Fund holdings',
    kpis:[
      { label:'Distinct Funds', value:'42' },
      { label:'Top 10 Concentration', value:'68%' },
      { label:'Avg YTD Return', value:'+11.8%', delta:'+2.1% vs benchmark', tone:'up' },
    ],
    chartOpts: {
      chart:{ type:'bar', height:340 },
      xAxis:{ categories:['VTSAX','BND','VTI','AGG','BCRED','VXUS','VOO','VEA','SPY','QQQ'] },
      yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'M'; } } },
      legend:{ enabled:false },
      tooltip:{ valuePrefix:'$', valueSuffix:'M' },
      series:[{ name:'AUM', color:'rgba(5,122,85,0.45)', borderColor:_GREEN, borderWidth:1.5, data:[185,142,128,98,82,71,62,54,46,38] }],
    },
    cols:[
      { key:'ticker', label:'Ticker', bold:true },
      { key:'name',   label:'Fund Name' },
      { key:'class',  label:'Asset Class' },
      { key:'aum',    label:'AUM', align:'right', num:true, bold:true },
      { key:'weight', label:'% Portfolio', align:'right', num:true },
      { key:'ytd',    label:'YTD', align:'right', num:true },
      { key:'expense',label:'Expense', align:'right', num:true, muted:true },
    ],
    rows:[
      { ticker:'VTSAX', name:'Vanguard Total Stock Market', class:'Equity',       aum:'$185M', weight:'18.4%', ytd:'+14.2%', expense:'0.04%' },
      { ticker:'BND',   name:'Vanguard Total Bond Market',  class:'Fixed Income', aum:'$142M', weight:'14.1%', ytd:'+3.4%',  expense:'0.03%' },
      { ticker:'VTI',   name:'Vanguard Total Stock ETF',    class:'Equity',       aum:'$128M', weight:'12.8%', ytd:'+13.9%', expense:'0.03%' },
      { ticker:'AGG',   name:'iShares Core US Aggregate',   class:'Fixed Income', aum:'$98M',  weight:'9.7%',  ytd:'+3.1%',  expense:'0.03%' },
      { ticker:'BCRED', name:'Blackstone Private Credit',   class:'Alternatives', aum:'$82M',  weight:'8.2%',  ytd:'+9.4%',  expense:'1.25%' },
      { ticker:'VXUS',  name:'Vanguard Total Intl Stock',   class:'Equity',       aum:'$71M',  weight:'7.0%',  ytd:'+11.8%', expense:'0.07%' },
      { ticker:'VOO',   name:'Vanguard S&P 500',            class:'Equity',       aum:'$62M',  weight:'6.2%',  ytd:'+13.5%', expense:'0.03%' },
      { ticker:'VEA',   name:'Vanguard Developed Markets',  class:'Equity',       aum:'$54M',  weight:'5.4%',  ytd:'+10.1%', expense:'0.05%' },
      { ticker:'SPY',   name:'SPDR S&P 500',                class:'Equity',       aum:'$46M',  weight:'4.6%',  ytd:'+13.4%', expense:'0.09%' },
      { ticker:'QQQ',   name:'Invesco QQQ Trust',           class:'Equity',       aum:'$38M',  weight:'3.8%',  ytd:'+18.2%', expense:'0.20%' },
    ],
  },

  cashflow: {
    kicker:'Practice · Detail',
    title:'Cash Flow',
    subtitle:'Inflows and outflows across the practice',
    sources:['schwab','fidelity','pershing','jpm','bny'],
    syncedAt:'14 min ago',
    chartTitle:'Monthly cash flow ($M)',
    tableTitle:'Recent transfers',
    kpis:[
      { label:'Total Inflows',  value:'$113.49M', delta:'+12% YoY', tone:'up' },
      { label:'Total Outflows', value:'-$88.49M', delta:'+4% YoY',  tone:'down' },
      { label:'Net Flow',       value:'$24.99M',  delta:'YTD',      tone:'up' },
    ],
    chartOpts: {
      chart:{ type:'column', height:320 },
      xAxis:{ categories:['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'] },
      yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'M'; } } },
      legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
      tooltip:{ shared:true, valuePrefix:'$', valueSuffix:'M' },
      series:[
        { name:'Inflow',  color:'rgba(5,122,85,0.45)',  borderColor:'rgb(5,122,85)',  borderWidth:1.5, data:[20,28,32,18,25,30,15,22,28,20,32,25] },
        { name:'Outflow', color:'rgba(220,38,38,0.45)', borderColor:'rgb(220,38,38)', borderWidth:1.5, data:[-8,-10,-9,-12,-7,-8,-11,-9,-10,-8,-9,-7] },
      ],
    },
    cols:[
      { key:'date',   label:'Date' },
      { key:'client', label:'Client' },
      { key:'type',   label:'Type' },
      { key:'channel',label:'Channel', muted:true },
      { key:'amount', label:'Amount', align:'right', num:true, bold:true },
      { key:'status', label:'Status' },
    ],
    rows:[
      { date:'Oct 28, 2025', client:'David Young',     type:'Contribution', channel:'ACH',  amount:'+$2.40M',  status:'Settled' },
      { date:'Oct 24, 2025', client:'Edwards Family',  type:'Distribution', channel:'Wire', amount:'-$0.85M',  status:'Settled' },
      { date:'Oct 21, 2025', client:'Hawkins Family',  type:'Contribution', channel:'Wire', amount:'+$1.20M',  status:'Settled' },
      { date:'Oct 17, 2025', client:'Smith Trust',     type:'Rollover',     channel:'ACAT', amount:'+$3.10M',  status:'Settled' },
      { date:'Oct 14, 2025', client:'Watson Holdings', type:'Distribution', channel:'ACH',  amount:'-$0.42M',  status:'Settled' },
      { date:'Oct 09, 2025', client:'Jones Family',    type:'Contribution', channel:'ACH',  amount:'+$0.65M',  status:'Settled' },
      { date:'Oct 03, 2025', client:'Lang Trust',      type:'Distribution', channel:'Wire', amount:'-$1.10M',  status:'Settled' },
    ],
  },

  fees: {
    kicker:'Practice · Detail',
    title:'Projected Fees',
    subtitle:'5-year fee trajectory and lifetime value modeling',
    sources:['schwab','fidelity','pershing','altruist','internal'],
    syncedAt:'2 hr ago',
    chartTitle:'Projected fees ($K)',
    tableTitle:'Per-client fee projection',
    kpis:[
      { label:'Current Annual Fees', value:'$176K', delta:'+8.2% YoY', tone:'up' },
      { label:'5Y Projected',        value:'$400K', delta:'+127% growth', tone:'up' },
      { label:'Lifetime Value',      value:'$2.84M' },
    ],
    chartOpts: {
      chart:{ type:'area', height:320 },
      xAxis:{ categories:['2025','2026','2027','2028','2029','2030'] },
      yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'K'; } } },
      legend:{ enabled:false },
      tooltip:{ shared:true, valuePrefix:'$', valueSuffix:'K' },
      series:[
        { type:'area', name:'Projected Fees', color:'rgb(5,122,85)',
          fillColor:{ linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
          lineWidth:2, marker:{ enabled:true, radius:3.5, fillColor:'rgb(10,10,10)', lineColor:'rgb(5,122,85)', lineWidth:2, symbol:'circle' },
          data:[150,185,235,285,340,400] },
      ],
    },
    cols:[
      { key:'client',  label:'Client' },
      { key:'aum',     label:'Current AUM', align:'right', num:true },
      { key:'rate',    label:'Rate', align:'right', num:true, muted:true },
      { key:'y1',      label:'2026', align:'right', num:true },
      { key:'y3',      label:'2028', align:'right', num:true },
      { key:'y5',      label:'2030', align:'right', num:true, bold:true },
      { key:'ltv',     label:'LTV', align:'right', num:true },
    ],
    rows:[
      { client:'David Young',     aum:'$31.24M', rate:'0.85%', y1:'$272K', y3:'$314K', y5:'$362K', ltv:'$3.6M' },
      { client:'Edwards Family',  aum:'$30.85M', rate:'0.85%', y1:'$268K', y3:'$310K', y5:'$358K', ltv:'$3.5M' },
      { client:'Hawkins Family',  aum:'$29.47M', rate:'0.90%', y1:'$271K', y3:'$313K', y5:'$361K', ltv:'$3.4M' },
      { client:'Smith Trust',     aum:'$28.99M', rate:'0.85%', y1:'$252K', y3:'$291K', y5:'$336K', ltv:'$3.2M' },
      { client:'Watson Holdings', aum:'$27.26M', rate:'0.90%', y1:'$251K', y3:'$290K', y5:'$334K', ltv:'$3.1M' },
      { client:'Jones Family',    aum:'$18.15M', rate:'0.95%', y1:'$176K', y3:'$204K', y5:'$235K', ltv:'$2.1M' },
      { client:'Lang Trust',      aum:'$16.47M', rate:'0.95%', y1:'$160K', y3:'$185K', y5:'$213K', ltv:'$1.9M' },
    ],
  },
};

/* ===== Client-tile detail configs (David Young) ===== */

TILE_DETAIL_CONFIG.cd_networth = {
  kicker:'David & Emily Young · Detail',
  title:'Net Worth',
  subtitle:'Household balance sheet by owner — David, Emily, and jointly held accounts',
  sources:['schwab','fidelity','jpm','internal'],
  syncedAt:'9 min ago',
  chartTitle:'Net worth trend ($M)',
  tableTitle:'Balance sheet',
  kpis:[
    { label:'Net Worth',  value:'$6,124,145', delta:'+1.5% MoM', tone:'up' },
    { label:'Total Assets',     value:'$6,850,000' },
    { label:'Total Liabilities',value:'$725,855',   delta:'-2.1% MoM', tone:'up' },
  ],
  chartOpts: {
    chart:{ type:'area', height:320 },
    xAxis:{ categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+(this.value/1000).toFixed(1)+'M'; } } },
    legend:{ enabled:false },
    tooltip:{ formatter: function(){ return '<b>'+this.x+'</b><br/>$'+(this.y/1000).toFixed(2)+'M'; } },
    series:[{ type:'area', name:'Net Worth', color:_GREEN,
      fillColor:{ linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
      lineWidth:2, marker:{ enabled:true, radius:3.5, fillColor:'rgb(10,10,10)', lineColor:_GREEN, lineWidth:2, symbol:'circle' },
      data:[5620,5680,5740,5810,5760,5830,5880,5920,5975,6020,6080,6124] }],
  },
  cols:[
    { key:'item',  label:'Account / Holding' },
    { key:'type',  label:'Type', muted:true },
    { key:'david', label:'David', align:'right', num:true, ownerCol:true, headColor:'rgb( 94,214,164)' },
    { key:'emily', label:'Emily', align:'right', num:true, ownerCol:true, headColor:'rgb(196,166,250)' },
    { key:'joint', label:'Joint', align:'right', num:true, ownerCol:true, headColor:'rgb(120,160,230)' },
    { key:'value', label:'Total', align:'right', num:true, bold:true },
  ],
  rows:[
    { section:'Assets' },
    { item:'Joint Taxable Brokerage', type:'Brokerage',   joint:'$2,100,000', value:'$2,100,000' },
    { item:'Rollover IRA',            type:'IRA',          david:'$1,320,000', value:'$1,320,000' },
    { item:'401(k) — Employer Plan',  type:'401(k)',       david:'$742,548',   value:'$742,548'   },
    { item:'Roth IRA',                type:'Roth IRA',     emily:'$380,000',   value:'$380,000'   },
    { item:'Primary Residence',       type:'Real Estate',  joint:'$1,425,000', value:'$1,425,000' },
    { item:'Cash & Equivalents',      type:'Cash',         joint:'$586,929',   value:'$586,929'   },
    { item:'529 College Savings',     type:'529 Plan',     joint:'$182,316',   value:'$182,316'   },
    { item:'Vehicles & Personal',     type:'Personal',     joint:'$113,207',   value:'$113,207'   },
    { total:true, label:'Total Assets', david:'$2,062,548', emily:'$380,000', joint:'$4,407,452', value:'$6,850,000' },
    { section:'Liabilities', tone:'neg' },
    { item:'Mortgage',     type:'Mortgage',    joint:'-$612,438', value:'-$612,438' },
    { item:'Auto Loan',    type:'Auto Loan',   david:'-$87,210',  value:'-$87,210'  },
    { item:'Credit Cards', type:'Credit Card', joint:'-$26,207',  value:'-$26,207'  },
    { total:true, label:'Total Liabilities', david:'-$87,210', joint:'-$638,645', value:'-$725,855', tone:'neg' },
    { total:true, accent:true, label:'Net Worth', david:'$1,975,338', emily:'$380,000', joint:'$3,768,807', value:'$6,124,145' },
  ],
};

TILE_DETAIL_CONFIG.cd_allocation = {
  kicker:'David Young · Detail',
  title:'Asset Allocation',
  subtitle:'Allocation across asset classes with model drift and rebalance targets',
  sources:['fidelity','schwab','vanguard','blackrock'],
  syncedAt:'12 min ago',
  chartTitle:'Allocation drift over 12 months',
  tableTitle:'Holdings by class',
  kpis:[
    { label:'Total Invested',   value:'$5,250,000' },
    { label:'Largest Class',    value:'Domestic Equity · 35%' },
    { label:'Drift vs Model',   value:'2.4%', delta:'within tolerance', tone:'up' },
  ],
  chartOpts: {
    chart:{ type:'area', height:320 },
    xAxis:{ categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    yAxis:{ title:{text:null}, labels:{ formatter: function(){ return this.value+'%'; } } },
    tooltip:{ shared:true, valueSuffix:'%' },
    plotOptions:{ area:{ stacking:'percent', lineWidth:1, marker:{enabled:false}, fillOpacity:0.55 } },
    legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
    series:[
      { name:'Domestic Stock',  color:'rgb( 94,214,164)', data:[33,33,34,34,35,35,35,35,35,35,35,35] },
      { name:'Bond Funds',      color:'rgb(120,160,230)', data:[29,28,28,27,27,26,26,25,25,25,25,25] },
      { name:'International',   color:'rgb(180,150,235)', data:[18,18,18,18,18,18,18,18,18,18,18,18] },
      { name:'Alternatives',    color:'rgb(245,200, 90)', data:[ 9, 9, 9, 9, 9,10,10,10,10,10,10,10] },
      { name:'Real Estate',     color:'rgb(240,140,120)', data:[ 6, 7, 6, 7, 6, 6, 6, 7, 7, 7, 7, 7] },
      { name:'Cash',            color:'rgb(120,200,210)', data:[ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
    ],
  },
  cols:[
    { key:'asset', label:'Asset Class' },
    { key:'value', label:'Market Value', align:'right', num:true, bold:true },
    { key:'pct',   label:'Current %', align:'right', num:true },
    { key:'target',label:'Target %', align:'right', num:true, muted:true },
    { key:'drift', label:'Drift', align:'right', num:true },
    { key:'ytd',   label:'YTD Return', align:'right', num:true },
  ],
  rows:[
    { asset:'Domestic Stock Funds',   value:'$1,837,500', pct:'35%', target:'34%', drift:'+1.0%', ytd:'+13.8%' },
    { asset:'Bond Funds',             value:'$1,312,500', pct:'25%', target:'27%', drift:'-2.0%', ytd:'+3.1%'  },
    { asset:'International Equities', value:'$945,000',   pct:'18%', target:'18%', drift:'0.0%',  ytd:'+10.4%' },
    { asset:'Alternatives',           value:'$525,000',   pct:'10%', target:'9%',  drift:'+1.0%', ytd:'+8.9%'  },
    { asset:'Real Estate',            value:'$367,500',   pct:'7%',  target:'7%',  drift:'0.0%',  ytd:'+5.7%'  },
    { asset:'Cash & Equivalents',     value:'$262,500',   pct:'5%',  target:'5%',  drift:'0.0%',  ytd:'+1.2%'  },
  ],
};

TILE_DETAIL_CONFIG.cd_investment = {
  kicker:'David Young · Detail',
  title:'Investment Overview',
  subtitle:'All investment accounts, contributions, and inception-to-date activity',
  sources:['schwab','fidelity','pershing'],
  syncedAt:'8 min ago',
  chartTitle:'Account value growth ($M)',
  tableTitle:'Accounts',
  kpis:[
    { label:'Total Invested', value:'$4,542,548', delta:'+12.6% YTD', tone:'up' },
    { label:'Accrued Income', value:'$165,419' },
    { label:'Net Contributions', value:'$586,929', delta:'YTD', tone:'up' },
  ],
  chartOpts: {
    chart:{ type:'area', height:320 },
    xAxis:{ categories:['2020','2021','2022','2023','2024','2025'] },
    yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'M'; } } },
    legend:{ enabled:false },
    tooltip:{ valuePrefix:'$', valueSuffix:'M' },
    series:[{ type:'area', name:'Account Value', color:_GREEN,
      fillColor:{ linearGradient:{x1:0,y1:0,x2:0,y2:1}, stops:[[0,'rgba(5,122,85,0.35)'],[1,'rgba(5,122,85,0)']] },
      lineWidth:2, marker:{ enabled:true, radius:3.5, fillColor:'rgb(10,10,10)', lineColor:_GREEN, lineWidth:2, symbol:'circle' },
      data:[2.6, 3.1, 2.9, 3.6, 4.1, 4.54] }],
  },
  cols:[
    { key:'account', label:'Account' },
    { key:'type',    label:'Type', muted:true },
    { key:'value',   label:'Value', align:'right', num:true, bold:true },
    { key:'cash',    label:'Cash', align:'right', num:true },
    { key:'income',  label:'Accrued', align:'right', num:true },
    { key:'inception', label:'Inception', align:'right', muted:true },
  ],
  rows:[
    { account:'Joint Brokerage',    type:'Taxable',     value:'$1,512,195', cash:'$184,210', income:'$58,402', inception:'Sep 8, 2020' },
    { account:'Roth IRA',           type:'Tax-Free',    value:'$842,118',   cash:'$22,148',  income:'$19,820', inception:'Jan 12, 2021' },
    { account:'Traditional IRA',    type:'Tax-Deferred',value:'$1,098,406', cash:'$48,920',  income:'$31,475', inception:'Mar 4, 2020' },
    { account:'401(k) — Held Away', type:'Tax-Deferred',value:'$926,420',   cash:'$0',       income:'$42,118', inception:'Jul 1, 2018' },
    { account:'Trust Account',      type:'Taxable',     value:'$163,409',   cash:'$8,620',   income:'$13,604', inception:'Nov 15, 2022' },
  ],
};

TILE_DETAIL_CONFIG.cd_performance = {
  kicker:'David Young · Detail',
  title:'Performance',
  subtitle:'Time-weighted returns vs market indices and asset benchmarks',
  sources:['pershing','schwab','fidelity'],
  syncedAt:'15 min ago',
  chartTitle:'TWRR vs benchmarks (%)',
  tableTitle:'Returns by period',
  kpis:[
    { label:'QTD',  value:'+13.19%', delta:'+1.4% vs S&P', tone:'up' },
    { label:'YTD',  value:'+12.69%', delta:'-0.3% vs S&P', tone:'down' },
    { label:'ITD',  value:'+7.69%',  delta:'annualized',   tone:'up' },
  ],
  chartOpts: {
    chart:{ type:'column', height:320 },
    xAxis:{ categories:['QTD','YTD','1Y','3Y','5Y','ITD'] },
    yAxis:{ title:{text:null}, labels:{ formatter: function(){ return this.value+'%'; } } },
    legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
    tooltip:{ shared:true, valueSuffix:'%' },
    series:[
      { name:'TWRR',  color:'rgba(94,214,164,0.55)',  borderColor:'rgb(94,214,164)',  borderWidth:1.5, data:[13.19, 12.69, 14.20, 9.85, 8.42, 7.69] },
      { name:'MMkt',  color:'rgba(120,160,230,0.55)', borderColor:'rgb(120,160,230)', borderWidth:1.5, data:[ 1.20,  4.80,  5.10, 4.20, 3.10, 2.85] },
      { name:'SP500', color:'rgba(245,200,90,0.55)',  borderColor:'rgb(245,200,90)',  borderWidth:1.5, data:[11.80, 12.99, 15.40,10.20, 9.30, 8.05] },
      { name:'Bond',  color:'rgba(180,150,235,0.55)', borderColor:'rgb(180,150,235)', borderWidth:1.5, data:[ 0.80,  3.10,  3.40, 1.20, 1.85, 2.10] },
    ],
  },
  cols:[
    { key:'period',  label:'Period' },
    { key:'twrr',    label:'TWRR', align:'right', num:true, bold:true },
    { key:'mmkt',    label:'MMkt', align:'right', num:true, muted:true },
    { key:'sp500',   label:'S&P 500', align:'right', num:true },
    { key:'bond',    label:'Bond Idx', align:'right', num:true, muted:true },
    { key:'excess',  label:'Excess vs S&P', align:'right', num:true },
  ],
  rows:[
    { period:'QTD',  twrr:'+13.19%', mmkt:'+1.20%', sp500:'+11.80%', bond:'+0.80%', excess:'+1.39%' },
    { period:'YTD',  twrr:'+12.69%', mmkt:'+4.80%', sp500:'+12.99%', bond:'+3.10%', excess:'-0.30%' },
    { period:'1Y',   twrr:'+14.20%', mmkt:'+5.10%', sp500:'+15.40%', bond:'+3.40%', excess:'-1.20%' },
    { period:'3Y',   twrr:'+9.85%',  mmkt:'+4.20%', sp500:'+10.20%', bond:'+1.20%', excess:'-0.35%' },
    { period:'5Y',   twrr:'+8.42%',  mmkt:'+3.10%', sp500:'+9.30%',  bond:'+1.85%', excess:'-0.88%' },
    { period:'ITD',  twrr:'+7.69%',  mmkt:'+2.85%', sp500:'+8.05%',  bond:'+2.10%', excess:'-0.36%' },
  ],
};

TILE_DETAIL_CONFIG.cd_unrealized = {
  kicker:'David Young · Detail',
  title:'Unrealized Gains & Losses',
  subtitle:'Open positions with cost basis and tax-loss harvesting opportunities',
  sources:['fidelity','schwab','pershing'],
  syncedAt:'11 min ago',
  chartTitle:'Unrealized gains vs losses by lot age',
  tableTitle:'Positions',
  kpis:[
    { label:'Net Unrealized',   value:'$192,000', delta:'+3.2% MoM', tone:'up' },
    { label:'Total Gains',      value:'$199,195', delta:'long-term',  tone:'up' },
    { label:'Harvestable Loss', value:'-$7,195',  delta:'tax savings: $2,302', tone:'up' },
  ],
  chartOpts: {
    chart:{ type:'column', height:320 },
    xAxis:{ categories:['<3 mo','3–6 mo','6–12 mo','1–2 yr','2–5 yr','5+ yr'] },
    yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'K'; } } },
    legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
    tooltip:{ shared:true, valuePrefix:'$', valueSuffix:'K' },
    series:[
      { name:'Gains',  color:'rgba(5,122,85,0.45)',  borderColor:'rgb(5,122,85)',  borderWidth:1.5, data:[18, 28, 42, 56, 38, 17] },
      { name:'Losses', color:'rgba(220,38,38,0.45)', borderColor:'rgb(220,38,38)', borderWidth:1.5, data:[-5, -2, -0.2, 0, 0, 0] },
    ],
  },
  cols:[
    { key:'ticker', label:'Ticker', bold:true },
    { key:'shares', label:'Shares', align:'right', num:true },
    { key:'cost',   label:'Cost Basis', align:'right', num:true, muted:true },
    { key:'value',  label:'Market Value', align:'right', num:true },
    { key:'unreal', label:'Unrealized', align:'right', num:true, bold:true },
    { key:'term',   label:'Term', muted:true },
  ],
  rows:[
    { ticker:'VTSAX', shares:'2,840',   cost:'$284,000', value:'$398,420', unreal:'+$114,420', term:'Long' },
    { ticker:'BND',   shares:'4,120',   cost:'$326,480', value:'$329,180', unreal:'+$2,700',   term:'Long' },
    { ticker:'VXUS',  shares:'3,210',   cost:'$182,290', value:'$215,640', unreal:'+$33,350',  term:'Long' },
    { ticker:'VOO',   shares:'215',     cost:'$92,310',  value:'$108,150', unreal:'+$15,840',  term:'Long' },
    { ticker:'QQQ',   shares:'128',     cost:'$54,200',  value:'$76,690',  unreal:'+$22,490',  term:'Long' },
    { ticker:'BCRED', shares:'1,420',   cost:'$28,400',  value:'$21,205',  unreal:'-$7,195',   term:'Short' },
    { ticker:'SCHW',  shares:'420',     cost:'$22,260',  value:'$32,656',  unreal:'+$10,396',  term:'Long' },
  ],
};

TILE_DETAIL_CONFIG.cd_tax = {
  kicker:'David Young · Detail',
  title:'Tax Summary',
  subtitle:'2025 estimated tax liability with bracket-by-bracket detail',
  sources:['internal','schwab','fidelity'],
  syncedAt:'1 hr ago',
  chartTitle:'Estimated tax liability ($K) — 2020–2025',
  tableTitle:'Tax line items',
  kpis:[
    { label:'Total Liability', value:'$184,320', delta:'+6.4% YoY', tone:'down' },
    { label:'Effective Rate',  value:'30.1%',    delta:'+0.8 pp YoY', tone:'down' },
    { label:'TLH Available',   value:'$7,195',   delta:'~$2,302 savings', tone:'up' },
  ],
  chartOpts: {
    chart:{ type:'column', height:320 },
    xAxis:{ categories:['2020','2021','2022','2023','2024','2025E'] },
    yAxis:{ title:{text:null}, labels:{ formatter: function(){ return '$'+this.value+'K'; } } },
    legend:{ enabled:true, itemStyle:{ color:'rgb(229,231,235)' } },
    tooltip:{ shared:true, valuePrefix:'$', valueSuffix:'K' },
    plotOptions:{ column:{ stacking:'normal' } },
    series:[
      { name:'Federal',   color:'rgba(220, 38, 38,0.45)', borderColor:'rgb(220, 38, 38)', borderWidth:1.5, data:[ 92, 102, 108, 115, 118, 122] },
      { name:'State',     color:'rgba(245,200, 90,0.55)', borderColor:'rgb(245,200, 90)', borderWidth:1.5, data:[ 14,  16,  17,  18,  18,  19] },
      { name:'LT Cap Gn', color:'rgba( 94,214,164,0.55)', borderColor:'rgb( 94,214,164)', borderWidth:1.5, data:[ 12,  16,  14,  18,  20,  21] },
      { name:'Other',     color:'rgba(160,170,185,0.55)', borderColor:'rgb(160,170,185)', borderWidth:1.5, data:[  8,  12,  14,  16,  17,  22] },
    ],
  },
  cols:[
    { key:'item',   label:'Line Item' },
    { key:'basis',  label:'Basis', muted:true },
    { key:'rate',   label:'Rate', align:'right', num:true, muted:true },
    { key:'amount', label:'2025 Estimate', align:'right', num:true, bold:true },
    { key:'yoy',    label:'YoY', align:'right', num:true },
  ],
  rows:[
    { item:'Federal Income Tax',     basis:'Ordinary income',     rate:'32%',   amount:'$121,840', yoy:'+5.2%' },
    { item:'PA State Income Tax',    basis:'PA flat rate',        rate:'3.07%', amount:'$18,781',  yoy:'+4.1%' },
    { item:'Long-Term Capital Gains',basis:'Realized gains',      rate:'15%',   amount:'$21,397',  yoy:'+12.4%' },
    { item:'Net Investment Income',  basis:'Investment income',   rate:'3.8%',  amount:'$15,210',  yoy:'+8.6%'  },
    { item:'Local & FICA',           basis:'Wages + self-emp.',   rate:'~1.5%', amount:'$7,092',   yoy:'+2.1%'  },
    { item:'Tax-Loss Harvest',       basis:'BCRED short-term',    rate:'—',     amount:'-$7,195',  yoy:'available' },
  ],
};

Object.assign(window, { TileDetail, SourcePill, SourcesStrip, SOURCE_META, TILE_DETAIL_CONFIG });
