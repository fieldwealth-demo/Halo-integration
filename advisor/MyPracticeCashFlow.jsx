/* My Practice — Cash Flow tab. Depends on MP_* shared tokens from MyPractice.jsx. */

const CF_KPIS = [
{ label: 'Total Inflows', value: '$113.49M', delta: '+12.4% from last quarter', deltaTone: 'success' },
{ label: 'Total Outflows', value: '-$88.49M', delta: '+8.2% from last quarter', deltaTone: 'danger' },
{ label: 'Net Cash Flow', value: '$24.99M', delta: '+18.7% from last quarter', deltaTone: 'success' },
{ label: 'Total Transactions', value: '1,247', delta: 'No change from last quarter', deltaTone: 'mute' }];


const CF_MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const CF_INFLOW = [5.8, 6.0, 6.4, 6.1, 5.2, 6.8, 7.4, 7.0, 6.6, 7.2, 7.6, 6.9];
const CF_OUTFLOW = [-2.6, -2.2, -2.8, -3.0, -3.4, -2.2, -2.4, -2.0, -1.8, -2.6, -2.2, -2.4];

const CF_BY_TYPE = [
{ icon: 'sparkles', iconChar: '+', color: 'rgb(16,185,129)', bg: 'rgba(16,185,129,0.14)', label: 'Contributions', sub: '423 transactions', delta: '+$78.4M', tone: 'success' },
{ icon: 'arrow-down', iconChar: '−', color: 'rgb(248,113,113)', bg: 'rgba(248,113,113,0.14)', label: 'Withdrawals', sub: '289 transactions', delta: '-$62.3M', tone: 'danger' },
{ icon: 'arrow-right', iconChar: '⇄', color: 'rgb(56,189,248)', bg: 'rgba(56,189,248,0.14)', label: 'Transfers In', sub: '156 transactions', delta: '+$35.1M', tone: 'success' },
{ icon: 'percent', iconChar: '%', color: 'rgb(139,92,246)', bg: 'rgba(139,92,246,0.14)', label: 'Dividends & Interest', sub: '892 transactions', delta: '+$4.2M', tone: 'success' },
{ icon: 'file-bar-chart', iconChar: '$', color: 'rgb(234,88,12)', bg: 'rgba(234,88,12,0.14)', label: 'Advisory Fees', sub: '120 transactions', delta: '-$8.9M', tone: 'danger' }];


const CF_TREND_MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const CF_TREND_VALUES = [18, 27, 21, 23, 11, 14, 25];

const CF_ACCOUNT_TYPES = [
{ label: 'Qualified Retirement', value: '$12.4M', amount: 12.4, color: 'rgb(16,185,129)' },
{ label: 'Taxable Investment', value: '$8.2M', amount: 8.2, color: 'rgb(56,189,248)' },
{ label: 'Trust Accounts', value: '$3.1M', amount: 3.1, color: 'rgb(139,92,246)' },
{ label: 'Cash Equivalent', value: '$1.3M', amount: 1.3, color: 'rgb(234,88,12)' }];


const CF_TRANSACTIONS = [
{ client: 'David Young', sub: 'IRA · Traditional', color: 'rgb(16,185,129)', type: 'Contribution', typeColor: 'rgb(16,185,129)', desc: 'Annual IRA Contribution', date: 'Nov 19, 2025', status: 'Completed', statusTone: 'success', amount: '+$7,000.00', amountTone: 'success' },
{ client: 'Maria Santos', sub: 'Taxable · Individual', color: 'rgb(139,92,246)', type: 'Withdrawal', typeColor: 'rgb(248,113,113)', desc: 'Distribution - Home Purchase', date: 'Nov 18, 2025', status: 'Processing', statusTone: 'info', amount: '-$125,000.00', amountTone: 'danger' },
{ client: 'John Richardson', sub: '401(k) Rollover', color: 'rgb(234,88,12)', type: 'Transfer In', typeColor: 'rgb(56,189,248)', desc: 'Rollover from Fidelity', date: 'Nov 18, 2025', status: 'Pending', statusTone: 'warning', amount: '+$485,000.00', amountTone: 'success' },
{ client: 'Susan Richardson', sub: 'Roth IRA', color: 'rgb(220,38,38)', type: 'Dividend', typeColor: 'rgb(16,185,129)', desc: 'Q4 Dividend Distribution', date: 'Nov 17, 2025', status: 'Completed', statusTone: 'success', amount: '+$3,245.67', amountTone: 'success' },
{ client: 'Zaire Thompson', sub: 'Taxable · Joint', color: 'rgb(56,189,248)', type: 'Advisory Fee', typeColor: 'rgb(234,88,12)', desc: 'Q4 Advisory Fee', date: 'Nov 15, 2025', status: 'Completed', statusTone: 'success', amount: '-$1,570.00', amountTone: 'danger' },
{ client: 'David Park', sub: 'Joint Account', color: 'rgb(234,179,8)', type: 'Contribution', typeColor: 'rgb(16,185,129)', desc: 'Monthly Systematic Investment', date: 'Nov 15, 2025', status: 'Completed', statusTone: 'success', amount: '+$5,000.00', amountTone: 'success' },
{ client: 'Karen Lee', sub: 'Roth IRA', color: 'rgb(236,72,153)', type: 'Withdrawal', typeColor: 'rgb(248,113,113)', desc: 'RMD Distribution', date: 'Nov 14, 2025', status: 'Completed', statusTone: 'success', amount: '-$12,450.00', amountTone: 'danger' },
{ client: 'Michael Hughes', sub: 'SEP IRA', color: 'rgb(5,122,85)', type: 'Contribution', typeColor: 'rgb(16,185,129)', desc: 'SEP Employer Contribution', date: 'Nov 12, 2025', status: 'Completed', statusTone: 'success', amount: '+$66,000.00', amountTone: 'success' }];


function CFInflowsOutflows() {
  const [range, setRange] = React.useState('YTD');
  const ranges = ['1M', '3M', 'YTD', '1Y', 'All'];
  const opts = React.useMemo(() => ({
    chart: { type: 'column', height: 260, spacing: [12, 8, 8, 8] },
    xAxis: { categories: CF_MONTHS, labels: { style: { color: 'rgb(163,163,163)', fontSize: '11px' } } },
    yAxis: { labels: { formatter: function () {return (this.value >= 0 ? '+' : '') + '$' + this.value + 'M';} }, plotLines: [{ color: 'rgba(75,85,99,0.6)', width: 1, value: 0 }] },
    legend: { enabled: false },
    tooltip: { shared: true, formatter: function () {return '<b>' + this.x + '</b><br/>' + this.points.map((p) => `<span style="color:${p.color}">●</span> ${p.series.name}: <b>$${Math.abs(p.y).toFixed(1)}M</b>`).join('<br/>');} },
    plotOptions: { column: { borderRadius: 3, borderWidth: 1.5, pointPadding: 0.1, groupPadding: 0.15, maxPointWidth: 24 } },
    series: [
    { name: 'Inflows',  data: CF_INFLOW,  color: 'rgba(16,185,129,0.45)',  borderColor: 'rgb(16,185,129)' },
    { name: 'Outflows', data: CF_OUTFLOW, color: 'rgba(248,113,113,0.45)', borderColor: 'rgb(248,113,113)' }]

  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Inflows &amp; Outflows</div><TileInfo title="Inflows & Outflows" /></div>
          <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 11, color: 'rgb(209,213,219)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: 'rgb(16,185,129)' }} /> Inflows
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 11, color: 'rgb(209,213,219)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: 'rgb(248,113,113)' }} /> Outflows
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(75,85,99,0.6)', borderRadius: 8, padding: 3, background: 'rgba(255,255,255,0.02)' }}>
          {ranges.map((r) =>
          <button key={r} data-no-hint onClick={() => setRange(r)} style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 10.5,
            padding: '4px 10px', borderRadius: 5, cursor: 'pointer',
            border: 'none',
            background: range === r ? 'rgb(5,122,85)' : 'transparent',
            color: range === r ? '#fff' : 'rgb(163,163,163)'
          }}>{r}</button>
          )}
          <button data-no-hint style={{
            background: 'transparent', border: 'none', color: 'rgb(163,163,163)', cursor: 'pointer',
            padding: '4px 8px', borderRadius: 5
          }}><i className="fa-solid fa-download" style={{ width: 11, height: 11 }} /></button>
        </div>
      </div>
      <div style={{ padding: '0 8px 10px', flex: 1 }}><HC options={opts} style={{ height: 260 }} /></div>
    </div>);

}

function CFByType() {
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Cash Flow by Type</div><TileInfo title="Cash Flow by Type" /></div>
        <i className="fa-solid fa-ellipsis" style={{ width: 14, height: 14, color: 'rgb(163,163,163)' }} />
      </div>
      <div style={{ padding: '2px 18px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CF_BY_TYPE.map((r, i) =>
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 12 }}>
            <div style={{
            width: 32, height: 32, borderRadius: 8, background: r.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: r.color
          }}>{r.iconChar}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: 'rgb(249,250,251)' }}>{r.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgb(163,163,163)' }}>{r.sub}</div>
            </div>
            <div style={{
            fontFamily: 'Inter', fontWeight: 700, fontSize: 13,
            fontVariantNumeric: 'tabular-nums',
            color: r.tone === 'success' ? 'rgb(16,185,129)' : 'rgb(248,113,113)'
          }}>{r.delta}</div>
          </div>
        )}
      </div>
    </div>);

}

function CFNetTrend() {
  const opts = React.useMemo(() => ({
    chart: { type: 'areaspline', height: 280, spacing: [12, 8, 8, 8] },
    xAxis: { categories: CF_TREND_MONTHS },
    yAxis: { tickAmount: 7 },
    legend: { enabled: false },
    tooltip: { pointFormat: '<b>${point.y}M</b>' },
    plotOptions: { areaspline: {
        fillColor: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, 'rgba(16,185,129,0.35)'], [1, 'rgba(16,185,129,0)']] },
        lineColor: 'rgb(16,185,129)', lineWidth: 2,
        marker: { enabled: true, radius: 3.5, fillColor: 'rgb(10,10,10)', lineColor: 'rgb(16,185,129)', lineWidth: 2, symbol: 'circle' }
      } },
    series: [{ name: 'Net Cash Flow', data: CF_TREND_VALUES }]
  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Net Cash Flow Trend</div><TileInfo title="Net Cash Flow Trend" /></div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 11, color: 'rgb(209,213,219)', marginTop: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: 'rgb(16,185,129)' }} /> Net Cash Flow
          </div>
        </div>
        <button data-no-hint style={{
          fontFamily: 'Inter', fontWeight: 600, fontSize: 11,
          padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', color: 'rgb(229,231,235)',
          border: '1px solid rgba(75,85,99,0.7)',
          display: 'inline-flex', alignItems: 'center', gap: 6
        }}><i className="fa-solid fa-download" style={{ width: 11, height: 11 }} /> Export Data</button>
      </div>
      <div style={{ padding: '0 8px 12px', flex: 1 }}><HC options={opts} style={{ height: 280 }} /></div>
    </div>);

}

function CFByAccountType() {
  const opts = React.useMemo(() => ({
    chart: { type: 'pie', height: 230, spacing: [8, 4, 8, 4] },
    tooltip: { pointFormat: '<b>${point.y}M</b>' },
    plotOptions: { pie: { innerSize: '68%', borderWidth: 1.5, borderRadius: 0, dataLabels: { enabled: false }, states: { hover: { brightness: 0.08, halo: { size: 6, opacity: 0.2 } } } } },
    series: [{ name: 'Net Flow', data: CF_ACCOUNT_TYPES.map((a) => ({ name: a.label, y: a.amount, color: a.color.replace('rgb(', 'rgba(').replace(')', ',0.55)'), borderColor: a.color })) }]
  }), []);
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Cash Flow by Account Type</div><TileInfo title="Cash Flow by Account Type" /></div>
        <i className="fa-solid fa-ellipsis" style={{ width: 14, height: 14, color: 'rgb(163,163,163)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 20px 16px' }}>
        <div style={{ position: 'relative', width: 240, height: 230 }}>
          <HC options={opts} style={{ height: 230 }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
          }}>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgb(163,163,163)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Net Flow</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: 'rgb(249,250,251)' }}>$24.99M</div>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {CF_ACCOUNT_TYPES.map((a, i) =>
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontSize: 12, color: 'rgb(229,231,235)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: a.color }} /> {a.label}
              </span>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{a.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>);

}

function CFStatusPill({ label, tone }) {
  const tones = {
    success: { bg: 'rgba(16,185,129,0.18)', fg: 'rgb(16,185,129)', border: '1px solid rgba(16,185,129,0.4)' },
    info: { bg: 'rgba(56,189,248,0.18)', fg: 'rgb(56,189,248)', border: '1px solid rgba(56,189,248,0.4)' },
    warning: { bg: 'rgba(234,179,8,0.18)', fg: 'rgb(253,224,71)', border: '1px solid rgba(234,179,8,0.45)' }
  }[tone] || { bg: 'rgba(17,24,39,0.8)', fg: 'rgb(229,231,235)', border: '1px solid rgb(75,85,99)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 10.5,
      padding: '3px 10px', borderRadius: 5, ...tones
    }}>{label}</span>);

}

function CFTransactions() {
  const [tab, setTab] = React.useState('All');
  const tabs = ['All', 'Inflows', 'Outflows', 'Pending'];
  return (
    <div style={MP_CARD}>
      <div style={{ ...MP_HEAD, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display:'flex', alignItems:'center' }}><div style={MP_TITLE}>Recent Transactions</div><TileInfo title="Recent Transactions" /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(75,85,99,0.6)', borderRadius: 999, padding: 3, background: 'rgba(255,255,255,0.02)' }}>
            {tabs.map((t) =>
            <button key={t} data-no-hint onClick={() => setTab(t)} style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 10.5,
              padding: '4px 12px', borderRadius: 999, cursor: 'pointer', border: 'none',
              background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: tab === t ? 'rgb(249,250,251)' : 'rgb(163,163,163)'
            }}>{t}</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button data-no-hint style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 11,
              padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', color: 'rgb(229,231,235)',
              border: '1px solid rgba(75,85,99,0.7)',
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}><i className="fa-solid fa-filter" style={{ width: 10, height: 10 }} /> Filter</button>
            <button data-no-hint style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 11,
              padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', color: 'rgb(229,231,235)',
              border: '1px solid rgba(75,85,99,0.7)',
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}><i className="fa-solid fa-download" style={{ width: 10, height: 10 }} /> Export</button>
          </div>
        </div>
      </div>
      <div style={{ padding: '4px 8px 12px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr 1fr', alignItems: 'center', gap: 12,
          padding: '8px 14px', fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
          color: 'rgb(163,163,163)', textTransform: 'uppercase',
          borderBottom: '1px solid rgba(75,85,99,0.4)'
        }}>
          <span>Client</span><span>Type</span><span>Description</span><span>Date</span><span>Status</span><span style={{ textAlign: 'right' }}>Amount</span>
        </div>
        {CF_TRANSACTIONS.map((r, i) => {
          const initials = r.client.split(' ').map((s) => s[0]).join('').slice(0, 2);
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr 1fr', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderBottom: i === CF_TRANSACTIONS.length - 1 ? 'none' : '1px solid rgba(75,85,99,0.25)',
              fontFamily: 'Inter', fontSize: 12.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9999, background: r.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontWeight: 700, fontSize: 11, color: '#fff'
                }}>{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'rgb(249,250,251)' }}>{r.client}</div>
                  <div style={{ fontSize: 11, color: 'rgb(163,163,163)' }}>{r.sub}</div>
                </div>
              </div>
              <div>
                <span style={{
                  display: 'inline-flex', fontFamily: 'Inter', fontWeight: 700, fontSize: 10.5,
                  padding: '3px 10px', borderRadius: 4,
                  background: `color-mix(in srgb, ${r.typeColor} 22%, transparent)`,
                  color: r.typeColor, border: `1px solid color-mix(in srgb, ${r.typeColor} 45%, transparent)`
                }}>{r.type}</span>
              </div>
              <span style={{ color: 'rgb(209,213,219)' }}>{r.desc}</span>
              <span style={{ color: 'rgb(163,163,163)' }}>{r.date}</span>
              <span><CFStatusPill label={r.status} tone={r.statusTone} /></span>
              <span style={{
                textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700,
                color: r.amountTone === 'success' ? 'rgb(16,185,129)' : 'rgb(248,113,113)'
              }}>{r.amount}</span>
            </div>);

        })}
      </div>
    </div>);

}

function MPCashFlowTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
      {CF_KPIS.map((k, i) =>
      <div key={i} style={{ gridColumn: 'span 3' }}>
          <MPKpi {...k} />
        </div>
      )}
      <div style={{ gridColumn: 'span 8' }}><CFInflowsOutflows /></div>
      <div style={{ gridColumn: 'span 4' }}><CFByType /></div>
      <div style={{ gridColumn: 'span 8' }}><CFNetTrend /></div>
      <div style={{ gridColumn: 'span 4' }}><CFByAccountType /></div>
      <div style={{ gridColumn: 'span 12' }}><CFTransactions /></div>
    </div>);

}

window.MPCashFlowTab = MPCashFlowTab;