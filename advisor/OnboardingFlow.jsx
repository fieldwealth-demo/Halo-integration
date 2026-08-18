// OnboardingFlow — first-time advisor experience.
// Stages: welcome → 5 question steps → tile picker → building → done (handoff)
// All visuals reuse the dashboard's glass + emerald aesthetic.

const ONB_BRAND_GREEN = 'rgb(5,122,85)';
const ONB_GREEN_SOFT = 'rgba(5,122,85,0.18)';
const ONB_BORDER = 'rgb(75,85,99)';
const ONB_BORDER_SOFT = 'rgba(75,85,99,0.5)';
const ONB_GLASS = 'rgba(255,255,255,0.05)';
const ONB_GLASS_2 = 'rgba(255,255,255,0.08)';
const ONB_INK = 'rgb(249,250,251)';
const ONB_MUTED = 'rgb(163,163,163)';
const ONB_DIM = 'rgb(115,115,115)';

/* ----------------------------------------------------------------------- */
/* Question schema                                                         */
/* ----------------------------------------------------------------------- */
const ONB_STEPS = [
{
  id: 'account',
  title: 'Set up your account',
  subtitle: 'Secure your login before we wire up your dashboard.',
  icon: 'lock',
  fields: [
  { id: 'password',  kind: 'password', label: 'Create password' },
  { id: 'crd',       kind: 'text',     label: 'CRD number', placeholder: 'e.g. 4521987', maxLength: 7, pattern: 'digits' },
  { id: 'twofactor', kind: 'twofactor',label: 'Two-factor authentication' }]

}];


/* ----------------------------------------------------------------------- */
/* Tile catalog (mirrors AdvisorTiles.jsx)                                  */
/* ----------------------------------------------------------------------- */
const ONB_TILE_CATALOG = [
{ id: 'meetings', name: 'Upcoming Meetings', icon: 'calendar', desc: 'Next 5 calendared client meetings', tag: 'morning', size: 'sm', inDashboard: true,
  benefits: ['Never miss a prep window before a client meeting', 'See the next 5 days at a glance from the dashboard', 'Click any meeting to jump straight to the client'] },
{ id: 'notifications', name: 'Notifications', icon: 'bell', desc: 'Rebalance, RMD, approvals & deadlines', tag: 'alerts', size: 'sm', inDashboard: true,
  benefits: ['One inbox for time-sensitive items across your book', 'AI prioritizes by deadline and revenue impact', 'Triage in seconds without leaving the dashboard'] },
{ id: 'topclients', name: 'Top Clients', icon: 'users', desc: 'Performance of your top 8 relationships', tag: 'clients', size: 'lg', inDashboard: true,
  benefits: ['Spot performance issues with your largest accounts first', 'Track review cadence so no top client goes untouched', 'Click through for a full client deep-dive'] },
{ id: 'aumalloc', name: 'AUM by Allocation', icon: 'layer-group', desc: 'Donut breakdown across asset classes', tag: 'aum', size: 'md', inDashboard: true,
  benefits: ['Instantly see your book\'s overall asset mix', 'Spot concentration risk at the practice level', 'Compare current allocation to your target ranges'] },
{ id: 'billing', name: 'Billing Summary', icon: 'file-invoice-dollar', desc: 'Quarterly fee run-rate & projections', tag: 'revenue', size: 'md', inDashboard: true,
  benefits: ['Track quarterly billable assets and fee revenue', 'Catch billing exceptions before they hit clients', 'Project next quarter\'s revenue from current AUM'] },
{ id: 'aumbars', name: 'AUM Trend', icon: 'chart-column', desc: 'Monthly AUM change over the year', tag: 'aum', size: 'md', inDashboard: true,
  benefits: ['Visualize asset growth across account types', 'Distinguish market gains from net new assets', 'Identify which segments are growing fastest'] },
{ id: 'holdings', name: 'Top Holdings', icon: 'briefcase', desc: 'Largest positions across the book', tag: 'holdings', size: 'md', inDashboard: true,
  benefits: ['Know your largest exposures across all clients', 'Filter by asset class to drill into risk', 'Coordinate trading and tax-loss harvesting'] },
{ id: 'cashflow', name: 'Cash Flow', icon: 'arrow-trend-up', desc: 'Net inflows / outflows across the book', tag: 'flows', size: 'md', inDashboard: true,
  benefits: ['Spot withdrawal patterns before they become trends', 'Track net new assets vs. attrition over time', 'Forecast cash needs for upcoming distributions'] },
{ id: 'fees', name: 'Projected Fees', icon: 'percent', desc: 'Forward 12-month fee projection', tag: 'revenue', size: 'md', inDashboard: true,
  benefits: ['See your forward revenue based on current AUM', 'Compare lifetime client value across cohorts', 'Track practice valuation as a multiple of revenue'] },
{ id: 'opportunities', name: 'Opportunities', icon: 'sparkles', desc: 'Overnight AI-surfaced opportunities', tag: 'rebalance', size: 'sm',
  benefits: ['AI scans your book overnight for revenue-generating actions', 'Each card includes the recommended next step', 'Approve or dismiss in one click'] },
{ id: 'drift', name: 'Allocation Drift', icon: 'triangle-exclamation', desc: 'Clients off-target by ±5%', tag: 'drift', size: 'sm',
  benefits: ['Catch portfolios that have drifted from their IPS', 'Sort by severity to address the worst offenders first', 'Generate rebalance proposals with one click'] },
{ id: 'tasks', name: 'Open Tasks', icon: 'square-check', desc: 'Follow-ups, paperwork, approvals', tag: 'tasks', size: 'sm',
  benefits: ['Centralize follow-ups and paperwork in one queue', 'Tasks auto-link to the relevant client and account', 'Never let an approval slip through the cracks'] },
{ id: 'rmd', name: 'RMD Tracker', icon: 'calendar', desc: 'Required minimum distributions due', tag: 'rmd', size: 'sm', comingSoon: true,
  benefits: ['Track every RMD client by deadline and amount', 'Avoid 25% IRS penalties on missed distributions', 'Auto-flag year-end clients still pending'] },
{ id: 'inbox', name: 'Client Inbox', icon: 'envelope', desc: 'Recent client emails surfaced by AI', tag: 'inbox', size: 'sm', comingSoon: true,
  benefits: ['Surface client emails that need a response today', 'AI summarizes long threads into one-line takeaways', 'Reply with suggested drafts in your voice'] },
{ id: 'markets', name: 'Markets Brief', icon: 'arrow-trend-up', desc: 'Overnight moves in your held names', tag: 'markets', size: 'sm', comingSoon: true,
  benefits: ['See overnight moves in positions your clients hold', 'Filter to news that materially affects your book', 'Get morning talking points before client calls'] },
{ id: 'prospects', name: 'Prospect Pipeline', icon: 'bullseye', desc: 'Opportunities by stage', tag: 'prospecting', size: 'md', comingSoon: true,
  benefits: ['Visualize your pipeline by stage and dollar value', 'Track time-in-stage to spot stalled prospects', 'Forecast new AUM from probable closes'] }];


/* Lightweight inline preview SVGs per tile — shown on hover. ~280×150 viewBox.
   Visual fingerprints, not pixel-perfect mocks. */
function OnbTilePreview({ id }) {
  const w = 280,h = 150;
  const wrap = (children) =>
  <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <rect x="0" y="0" width={w} height={h} rx="8" fill="rgb(17,24,39)" />
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} rx="7.5" fill="none" stroke="rgba(75,85,99,0.6)" />
      {children}
    </svg>;

  const ink = 'rgb(229,231,235)',mute = 'rgb(115,115,115)',g = 'rgb(5,122,85)';
  switch (id) {
    case 'meetings':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Upcoming Meetings</text>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(14, ${38 + i * 32})`}>
        <rect width="32" height="24" rx="4" fill="rgba(5,122,85,0.18)" />
        <text x="16" y="11" textAnchor="middle" fill={g} fontSize="7" fontWeight="700">FEB</text>
        <text x="16" y="20" textAnchor="middle" fill={ink} fontSize="9" fontWeight="700">{`0${i + 2}`}</text>
        <text x="42" y="11" fill={ink} fontSize="8.5" fontWeight="600">{['Kyung Min', 'David Young', 'Maria W.'][i]}</text>
        <text x="42" y="22" fill={mute} fontSize="7">{`${10 + i}:00 AM`}</text>
      </g>)}
    </g>);
    case 'notifications':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Notifications</text>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(14, ${38 + i * 32})`}>
        <circle cx="10" cy="12" r="6" fill={i === 0 ? g : 'rgba(245,158,11,0.6)'} />
        <text x="24" y="10" fill={ink} fontSize="8.5" fontWeight="600">{['Rebalance Opportunity', 'RMD Deadline', 'New Email'][i]}</text>
        <text x="24" y="22" fill={mute} fontSize="7">{['David Young drifted', 'Due in 12 days', 'Send investments'][i]}</text>
      </g>)}
    </g>);
    case 'topclients':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Top Clients</text>
      {Array.from({ length: 8 }).map((_, i) => {
          const x = 14 + i % 4 * 65,y = 38 + Math.floor(i / 4) * 48;
          return <g key={i} transform={`translate(${x}, ${y})`}>
          <rect width="58" height="40" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(75,85,99,0.5)" />
          <circle cx="12" cy="12" r="6" fill="rgba(5,122,85,0.4)" />
          <rect x="22" y="8" width="30" height="3" rx="1" fill={ink} opacity="0.7" />
          <rect x="22" y="15" width="20" height="2.5" rx="1" fill={mute} />
          <text x="6" y="34" fill={i % 3 === 0 ? 'rgb(248,113,113)' : g} fontSize="7" fontWeight="700">{i % 3 === 0 ? '-2.4%' : '+8.1%'}</text>
        </g>;
        })}
    </g>);
    case 'aumalloc':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">AUM by Allocation</text>
      <g transform="translate(80, 90)">
        <circle r="36" fill="none" stroke="rgba(94,214,164,0.5)" strokeWidth="14" strokeDasharray="63 226" transform="rotate(-90)" />
        <circle r="36" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="14" strokeDasharray="50 226" strokeDashoffset="-63" transform="rotate(-90)" />
        <circle r="36" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="14" strokeDasharray="45 226" strokeDashoffset="-113" transform="rotate(-90)" />
        <circle r="36" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="14" strokeDasharray="68 226" strokeDashoffset="-158" transform="rotate(-90)" />
      </g>
      {['Equities', 'Fixed Income', 'Alts', 'Cash'].map((l, i) =>
        <g key={l} transform={`translate(160, ${48 + i * 18})`}>
          <rect width="8" height="8" rx="2" fill={['rgb(94,214,164)', 'rgb(56,189,248)', 'rgb(245,158,11)', 'rgb(168,85,247)'][i]} />
          <text x="14" y="7" fill={ink} fontSize="8">{l}</text>
          <text x="100" y="7" textAnchor="end" fill={mute} fontSize="8">{['28%', '22%', '20%', '30%'][i]}</text>
        </g>
        )}
    </g>);
    case 'billing':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Billing Summary</text>
      {[0, 1].map((i) => <g key={i} transform={`translate(${14 + i * 130}, 36)`}>
        <text fill={mute} fontSize="7">{['Billable Assets', 'Total Fees'][i]}</text>
        <text y="16" fill={ink} fontSize="15" fontWeight="700">{['$16.5M', '$132K'][i]}</text>
        <text y="28" fill={g} fontSize="7">+{['2.4', '3.1'][i]}% QoQ</text>
      </g>)}
      <g transform="translate(14, 86)">
        {[0, 1, 2, 3].map((i) =>
          <rect key={i} x={i * 62} y={20 - i * 4} width="40" height={20 + i * 4} rx="3" fill="rgba(5,122,85,0.5)" />
          )}
      </g>
    </g>);
    case 'aumbars':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">AUM Trend</text>
      {[780, 420, 310, 560, 490, 820].map((v, i) =>
        <g key={i} transform={`translate(14, ${36 + i * 16})`}>
          <text fill={mute} fontSize="7">{['Qual.Ret.', 'Joint', 'IRA', 'Trust', 'Roth', 'Taxable'][i]}</text>
          <rect x="60" y="2" width={v / 8} height="8" rx="2" fill="rgba(5,122,85,0.6)" />
          <text x={70 + v / 8} y="9" fill={ink} fontSize="7" fontWeight="600">${v / 10}M</text>
        </g>
        )}
    </g>);
    case 'holdings':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Top Holdings</text>
      {['All', 'Equity', 'FI', 'Alt'].map((f, i) =>
        <rect key={f} x={14 + i * 40} y="30" width="36" height="14" rx="7" fill={i === 0 ? 'rgba(5,122,85,0.3)' : 'rgba(255,255,255,0.04)'} stroke="rgba(75,85,99,0.5)" />
        )}
      {['All', 'Equity', 'FI', 'Alt'].map((f, i) =>
        <text key={f + '_t'} x={32 + i * 40} y="40" textAnchor="middle" fill={i === 0 ? g : mute} fontSize="7" fontWeight="600">{f}</text>
        )}
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(14, ${56 + i * 20})`}>
        <text fill={ink} fontSize="8" fontWeight="600">{['AAPL', 'MSFT', 'VTI', 'BND'][i]}</text>
        <rect x="60" y="-5" width={[140, 110, 90, 70][i]} height="6" rx="2" fill="rgba(56,189,248,0.5)" />
        <text x="248" y="2" textAnchor="end" fill={ink} fontSize="8">${[2.1, 1.7, 1.4, 1.0][i]}M</text>
      </g>)}
    </g>);
    case 'cashflow':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Cash Flow</text>
      {Array.from({ length: 12 }).map((_, i) => {
          const inH = 30 + Math.sin(i * 0.7) * 10 + i % 3 * 4;
          const outH = 18 + Math.cos(i * 0.8) * 8;
          return <g key={i} transform={`translate(${20 + i * 22}, 130)`}>
          <rect x="0" y={-inH} width="8" height={inH} fill="rgba(5,122,85,0.7)" />
          <rect x="9" y={-outH} width="8" height={outH} fill="rgba(248,113,113,0.6)" />
        </g>;
        })}
    </g>);
    case 'fees':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Projected Fees</text>
      <text x="14" y="40" fill={mute} fontSize="8">5Y Projection</text>
      <path d="M 14 120 Q 80 100, 140 70 T 266 30" stroke={g} strokeWidth="2.5" fill="none" />
      <path d="M 14 120 Q 80 100, 140 70 T 266 30 L 266 140 L 14 140 Z" fill="rgba(5,122,85,0.18)" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={14 + i * 63} cy={120 - i * 22} r="3" fill={g} />)}
    </g>);
    case 'opportunities':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Opportunities</text>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(14, ${36 + i * 32})`}>
        <rect width="252" height="26" rx="4" fill="rgba(5,122,85,0.1)" stroke="rgba(5,122,85,0.4)" />
        <circle cx="14" cy="13" r="5" fill={g} />
        <text x="26" y="11" fill={ink} fontSize="8" fontWeight="600">{['Rebalance: D. Young', 'Tax Harvest: M. Workman', 'Cash Sweep: K. Min'][i]}</text>
        <text x="26" y="21" fill={mute} fontSize="7">+${[2400, 1800, 950][i]} potential</text>
      </g>)}
    </g>);
    case 'drift':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Allocation Drift</text>
      <text x="140" y="68" textAnchor="middle" fill={ink} fontSize="32" fontWeight="700">12</text>
      <text x="140" y="82" textAnchor="middle" fill={mute} fontSize="8">clients off-target</text>
      {[0, 1, 2].map((i) => <rect key={i} x={60 + i * 50} y="100" width="40" height="6" rx="3" fill={['rgb(248,113,113)', 'rgb(245,158,11)', 'rgb(94,214,164)'][i]} />)}
      {['Sev', 'Mod', 'Min'].map((l, i) => <text key={l} x={80 + i * 50} y="120" textAnchor="middle" fill={mute} fontSize="7">{l}</text>)}
    </g>);
    case 'tasks':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Open Tasks</text>
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(14, ${36 + i * 22})`}>
        <rect width="12" height="12" rx="3" fill={i < 2 ? g : 'transparent'} stroke="rgba(75,85,99,0.7)" />
        {i < 2 && <path d="M 3 6 L 5 8 L 9 4" stroke="#fff" strokeWidth="1.5" fill="none" />}
        <text x="20" y="10" fill={i < 2 ? mute : ink} fontSize="8" textDecoration={i < 2 ? 'line-through' : 'none'}>{['Send Q4 letter', 'Review IPS', 'Approve trade', 'Call client'][i]}</text>
      </g>)}
    </g>);
    case 'rmd':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">RMD Tracker</text>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(14, ${36 + i * 32})`}>
        <rect width="252" height="26" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(75,85,99,0.4)" />
        <text x="10" y="17" fill={ink} fontSize="8" fontWeight="600">{['R. Patel', 'M. Workman', 'J. Chen'][i]}</text>
        <text x="100" y="17" fill={mute} fontSize="7">{['$24,500', '$18,200', '$32,100'][i]}</text>
        <text x="242" y="17" textAnchor="end" fill={['rgb(248,113,113)', 'rgb(245,158,11)', g][i]} fontSize="7" fontWeight="600">{['12d', '45d', 'Done'][i]}</text>
      </g>)}
    </g>);
    case 'inbox':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Client Inbox</text>
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(14, ${36 + i * 24})`}>
        <circle cx="8" cy="10" r="5" fill="rgba(5,122,85,0.4)" />
        <text x="20" y="8" fill={ink} fontSize="8" fontWeight="600">{['David Young', 'Maria W.', 'Kyung Min', 'Robert P.'][i]}</text>
        <text x="20" y="17" fill={mute} fontSize="7">{['Re: Rebalance', 'Q4 fees question', 'Cash transfer', 'Annual review'][i]}</text>
      </g>)}
    </g>);
    case 'markets':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Markets Brief</text>
      {['SPX', 'NDX', 'TLT', 'GLD'].map((s, i) => <g key={s} transform={`translate(${14 + i * 65}, 50)`}>
        <text fill={mute} fontSize="8">{s}</text>
        <text y="14" fill={ink} fontSize="11" fontWeight="700">{['5,820', '20,148', '94.21', '248.5'][i]}</text>
        <text y="28" fill={i % 2 === 0 ? g : 'rgb(248,113,113)'} fontSize="7">{i % 2 === 0 ? '+0.8%' : '-0.4%'}</text>
      </g>)}
      <path d="M 14 120 L 60 100 L 110 110 L 160 80 L 210 90 L 266 65" stroke={g} strokeWidth="1.5" fill="none" />
    </g>);
    case 'prospects':return wrap(<g>
      <text x="14" y="22" fill={ink} fontSize="11" fontWeight="600">Prospect Pipeline</text>
      {['Lead', 'Meeting', 'Proposal', 'Won'].map((s, i) => <g key={s} transform={`translate(${14 + i * 65}, 40)`}>
        <rect width="58" height="80" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(75,85,99,0.4)" />
        <text x="29" y="12" textAnchor="middle" fill={mute} fontSize="7" fontWeight="600">{s}</text>
        {Array.from({ length: [3, 2, 2, 1][i] }).map((_, j) =>
          <rect key={j} x="4" y={18 + j * 16} width="50" height="12" rx="2" fill="rgba(5,122,85,0.25)" />
          )}
      </g>)}
    </g>);
    default:return wrap(<g>
      <text x={w / 2} y={h / 2} textAnchor="middle" fill={mute} fontSize="10">Preview</text>
    </g>);
  }
}

/* Recommend tiles based on answers */
function onbRecommend(answers) {
  // No more alert-based filtering. Default starter set: workhorses + the in-dashboard tiles.
  const STARTER = ['meetings','notifications','topclients','aumalloc','billing','aumbars','holdings','cashflow','fees'];
  return ONB_TILE_CATALOG.filter((t) => STARTER.includes(t.id) && !t.comingSoon).map((t) => t.id);
}

/* Map tile ids → integration ids that should be offered if that tile is picked. */
const ONB_TILE_TO_INTEGRATIONS = {
  meetings:      ['calendar'],
  notifications: ['email','calendar','hubspot'],
  inbox:         ['email'],
  topclients:    ['hubspot'],
  prospects:     ['hubspot','salesforce'],
  tasks:         ['hubspot'],
  billing:       ['docusign'],
};
function onbIntegrationsFor(selectedTileIds) {
  const ids = new Set();
  selectedTileIds.forEach(t => (ONB_TILE_TO_INTEGRATIONS[t] || []).forEach(i => ids.add(i)));
  return ids;
}

/* ----------------------------------------------------------------------- */
/* Reusable bits                                                           */
/* ----------------------------------------------------------------------- */
function OnbProgress({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) =>
      <div key={i} style={{
        flex: 1, height: 3, borderRadius: 9999,
        background: i <= step ? ONB_BRAND_GREEN : 'rgba(75,85,99,0.5)',
        transition: 'background 240ms ease'
      }} />
      )}
    </div>);

}

function OnbChoice({ value, options, onChange, columns = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
      {options.map((opt) => {
        const on = value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            height: 48, padding: '0 16px', borderRadius: 10,
            border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
            background: on ? ONB_GREEN_SOFT : ONB_GLASS,
            color: ONB_INK, fontFamily: 'Inter', fontSize: 14, fontWeight: on ? 600 : 500,
            cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
            transition: 'background 150ms ease, border-color 150ms ease'
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 9999,
              border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
              background: on ? ONB_BRAND_GREEN : 'transparent',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {on && <i className="fa-solid fa-check" style={{ width: 10, height: 10, color: '#fff' }} />}
            </span>
            <span>{opt}</span>
          </button>);

      })}
    </div>);

}

function OnbMulti({ values, options, max, onChange }) {
  const set = new Set(values || []);
  const toggle = (v) => {
    if (set.has(v)) set.delete(v);else
    if (!max || set.size < max) set.add(v);
    onChange([...set]);
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {options.map((opt) => {
          const on = set.has(opt.v);
          const disabled = !on && max && set.size >= max;
          return (
            <button key={opt.v} disabled={disabled} onClick={() => toggle(opt.v)} style={{
              height: 44, padding: '0 14px', borderRadius: 10,
              border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
              background: on ? ONB_GREEN_SOFT : ONB_GLASS,
              color: disabled ? ONB_DIM : ONB_INK,
              fontFamily: 'Inter', fontSize: 13.5, fontWeight: on ? 600 : 500,
              cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1,
              transition: 'background 150ms ease, border-color 150ms ease'
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5,
                border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
                background: on ? ONB_BRAND_GREEN : 'transparent',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {on && <i className="fa-solid fa-check" style={{ width: 10, height: 10, color: '#fff' }} />}
              </span>
              <span style={{ flex: 1 }}>{opt.l}</span>
            </button>);

        })}
      </div>
      {max &&
      <div style={{ marginTop: 10, fontFamily: 'Inter', fontSize: 11.5, color: ONB_MUTED }}>
          Pick up to {max} — selected {set.size} / {max}
        </div>
      }
    </div>);

}

/* ---- Account setup field renderers ------------------------------------ */
function OnbInputBase({ children, status }) {
  // status: null | 'ok' | 'warn'
  const ring = status === 'ok' ? `1px solid ${ONB_BRAND_GREEN}`
             : status === 'warn' ? `1px solid rgba(248,113,113,0.6)`
             : `1px solid ${ONB_BORDER}`;
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10, height:48,
      padding:'0 14px', borderRadius:10, background:ONB_GLASS, border:ring,
    }}>{children}</div>
  );
}

function OnbPassword({ value, onChange }) {
  const [show, setShow] = React.useState(false);
  const len = value.length;
  const ok = len >= 8;
  const hasNum = /\\d/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  return (
    <div>
      <OnbInputBase status={len === 0 ? null : ok ? 'ok' : 'warn'}>
        <i className="fa-solid fa-lock" style={{ width:14, color:ONB_MUTED }} />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color:ONB_INK, fontFamily:'Inter', fontSize:14, height:'100%',
          }}
        />
        <button type="button" onClick={() => setShow(s => !s)} style={{
          background:'transparent', border:'none', color:ONB_MUTED, cursor:'pointer',
          fontFamily:'Inter', fontSize:12,
        }}>{show ? 'Hide' : 'Show'}</button>
      </OnbInputBase>
      <div style={{ display:'flex', gap:14, marginTop:8, fontFamily:'Inter', fontSize:11.5, color:ONB_MUTED }}>
        <PWHint ok={len >= 8}>8+ characters</PWHint>
        <PWHint ok={hasUpper}>1 uppercase</PWHint>
        <PWHint ok={hasNum}>1 number</PWHint>
      </div>
    </div>
  );
}
function PWHint({ ok, children }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, color: ok ? 'rgb(134,239,172)' : ONB_MUTED }}>
      <i className={`fa-solid fa-${ok ? 'check' : 'circle'}`} style={{ fontSize: ok ? 9 : 5 }} />
      {children}
    </span>
  );
}

function OnbText({ value, placeholder, maxLength, pattern, onChange }) {
  const isDigits = pattern === 'digits';
  const handle = (v) => {
    if (isDigits) v = v.replace(/\\D/g, '');
    if (maxLength) v = v.slice(0, maxLength);
    onChange(v);
  };
  const valid = !value ? null : (isDigits ? /^\\d{5,7}$/.test(value) : value.length > 0);
  return (
    <div>
      <OnbInputBase status={valid === null ? null : valid ? 'ok' : 'warn'}>
        <i className="fa-solid fa-id-card" style={{ width:14, color:ONB_MUTED }} />
        <input
          inputMode={isDigits ? 'numeric' : 'text'}
          value={value}
          placeholder={placeholder}
          onChange={(e) => handle(e.target.value)}
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color:ONB_INK, fontFamily:'Inter', fontSize:14, height:'100%',
            letterSpacing: isDigits ? '0.06em' : 'normal',
          }}
        />
        {valid && <i className="fa-solid fa-check" style={{ color:ONB_BRAND_GREEN, fontSize:12 }} />}
      </OnbInputBase>
      <div style={{ marginTop:8, fontFamily:'Inter', fontSize:11.5, color:ONB_MUTED }}>
        Used to verify your FINRA registration. We&apos;ll cross-check this with your firm&apos;s record.
      </div>
    </div>
  );
}

function OnbTwoFactor({ value, onChange }) {
  const opts = [
    { v:'authenticator', l:'Authenticator app', d:'Use Google Authenticator, Authy, or 1Password', icon:'shield-halved' },
    { v:'sms',           l:'Text message (SMS)', d:'Send a 6-digit code to your phone',             icon:'mobile-screen' },
    { v:'email',         l:'Email code',         d:'Send a code to your work email',                 icon:'envelope' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {opts.map(o => {
        const on = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} type="button" style={{
            all:'unset', boxSizing:'border-box', display:'flex', alignItems:'center', gap:14,
            padding:'12px 14px', borderRadius:10,
            border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
            background: on ? ONB_GREEN_SOFT : ONB_GLASS,
            cursor:'pointer',
          }}>
            <div style={{
              width:36, height:36, borderRadius:9, flexShrink:0,
              background: on ? 'rgba(5,122,85,0.3)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${on ? 'rgba(5,122,85,0.5)' : ONB_BORDER_SOFT}`,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>
              <i className={`fa-solid fa-${o.icon}`} style={{ color: on ? ONB_BRAND_GREEN : ONB_MUTED, fontSize:14 }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:13.5, color:ONB_INK }}>{o.l}</div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:ONB_MUTED, marginTop:2 }}>{o.d}</div>
            </div>
            <div style={{
              width:20, height:20, borderRadius:9999,
              border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
              background: on ? ONB_BRAND_GREEN : 'transparent',
              display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              {on && <i className="fa-solid fa-check" style={{ width:10, height:10, color:'#fff' }} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function OnbSlider({ label, value, onChange }) {
  const pct = Math.round(value);
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 500, color: ONB_INK }}>{label}</span>
        <span style={{ fontFamily: 'Inter', fontVariantNumeric: 'tabular-nums', fontSize: 13, fontWeight: 600, color: ONB_BRAND_GREEN }}>{pct}%</span>
      </div>
      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', height: 4, transform: 'translateY(-50%)',
          borderRadius: 9999, background: 'rgba(75,85,99,0.5)'
        }} />
        <div style={{
          position: 'absolute', left: 0, top: '50%', height: 4, transform: 'translateY(-50%)',
          width: `${pct}%`, borderRadius: 9999, background: ONB_BRAND_GREEN
        }} />
        <input
          type="range" min={0} max={100} step={5} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: 24, opacity: 0, cursor: 'pointer'
          }} />
        
        <div style={{
          position: 'absolute', left: `calc(${pct}% - 8px)`, top: '50%', transform: 'translateY(-50%)',
          width: 16, height: 16, borderRadius: 9999, background: ONB_INK,
          border: `3px solid ${ONB_BRAND_GREEN}`, pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }} />
      </div>
    </div>);

}

/* ----------------------------------------------------------------------- */
/* Stages                                                                  */
/* ----------------------------------------------------------------------- */
function OnbWelcome({ name, onStart }) {
  return (
    <div style={{
      width: 'min(640px, 100%)', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: `linear-gradient(135deg, ${ONB_BRAND_GREEN} 0%, rgb(3,84,63) 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 0 8px rgba(5,122,85,0.12), 0 20px 40px -10px rgba(5,122,85,0.4)`
      }}>
        <i className="fa-solid fa-wand-sparkles" style={{ fontSize: 36, color: '#fff' }} />
      </div>
      <div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, letterSpacing: '0.18em', color: ONB_BRAND_GREEN, textTransform: 'uppercase', marginBottom: 12 }}>
          Welcome to Field
        </div>
        <h1 style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 44, lineHeight: 1.05,
          letterSpacing: '-0.02em', color: ONB_INK, margin: '0 0 16px'
        }}>
          Hi {name}. Let's set up<br />your dashboard.
        </h1>
        <p style={{
          fontFamily: 'Inter', fontSize: 16, lineHeight: 1.55, color: ONB_MUTED, margin: '0 auto', maxWidth: 480
        }}>
          Your operations team has connected your book. Set up your account, pick the tiles you want, and we'll wire up the rest.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 24, fontFamily: 'Inter', fontSize: 13, color: ONB_MUTED, marginTop: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-circle-check" style={{ color: ONB_BRAND_GREEN }} /> ~3 minutes
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-circle-check" style={{ color: ONB_BRAND_GREEN }} /> Account → Tiles → Connect
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-circle-check" style={{ color: ONB_BRAND_GREEN }} /> Editable later
        </span>
      </div>
      <button onClick={onStart} style={{
        marginTop: 8, height: 52, padding: '0 32px', borderRadius: 12,
        background: ONB_BRAND_GREEN, color: '#fff', border: 'none',
        fontFamily: 'Inter', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 24px -8px rgba(5,122,85,0.6)'
      }}>
        Get started <i className="fa-solid fa-arrow-right" style={{ width: 14, height: 14 }} />
      </button>
    </div>);

}

function OnbStep({ step, index, total, answers, onChange, onNext, onBack }) {
  const ref = React.useRef();
  // For the account-setup step, validate password + CRD + 2FA.
  const isAccount = step.id === 'account';
  const pw = answers.password || '';
  const crd = (answers.crd || '').toString();
  const tf = answers.twofactor || null;
  const pwValid = pw.length >= 8;
  const crdValid = /^\d{5,7}$/.test(crd);
  const tfValid = !!tf;
  const valid = isAccount ? (pwValid && crdValid && tfValid) : true;
  return (
    <div ref={ref} style={{
      width: 'min(720px, 100%)', display: 'flex', flexDirection: 'column', gap: 32
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: ONB_GREEN_SOFT,
            border: `1px solid rgba(5,122,85,0.4)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className={`fa-solid fa-${step.icon}`} style={{ color: ONB_BRAND_GREEN, fontSize: 14 }} />
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 500, color: ONB_MUTED, letterSpacing: '0.04em' }}>
            STEP {index + 1} OF {total}
          </div>
        </div>
        <h2 style={{
          fontFamily: 'Inter', fontWeight: 700, fontSize: 32, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: ONB_INK, margin: '0 0 8px'
        }}>{step.title}</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 15, color: ONB_MUTED, margin: 0, lineHeight: 1.5 }}>
          {step.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {step.fields.map((f) =>
        <div key={f.id}>
            {f.label &&
          <div style={{
            fontFamily: 'Inter', fontSize: 13.5, fontWeight: 600, color: ONB_INK,
            marginBottom: 12, display: 'flex', justifyContent: 'space-between'
          }}>
                <span>{f.label}</span>
              </div>
          }
            {f.kind === 'password' &&
          <OnbPassword
            value={answers[f.id] || ''}
            onChange={(v) => onChange(f.id, v)} />
          }
            {f.kind === 'text' &&
          <OnbText
            value={answers[f.id] || ''}
            placeholder={f.placeholder}
            maxLength={f.maxLength}
            pattern={f.pattern}
            onChange={(v) => onChange(f.id, v)} />
          }
            {f.kind === 'twofactor' &&
          <OnbTwoFactor
            value={answers[f.id] || null}
            onChange={(v) => onChange(f.id, v)} />
          }
            {f.kind === 'choice' &&
          <OnbChoice
            value={answers[f.id] || ''}
            options={f.options}
            onChange={(v) => onChange(f.id, v)}
            columns={f.options.length === 4 ? 4 : 2} />

          }
            {f.kind === 'multi' &&
          <OnbMulti
            values={answers[f.id] || []}
            options={f.options}
            max={f.max}
            onChange={(v) => onChange(f.id, v)} />

          }
            {f.kind === 'sliders' &&
          <div style={{
            border: `1px solid ${ONB_BORDER}`, borderRadius: 12, padding: '8px 20px',
            background: ONB_GLASS
          }}>
                {f.items.map((it, i) =>
            <div key={it.v} style={{ borderTop: i ? `1px solid ${ONB_BORDER_SOFT}` : 'none' }}>
                    <OnbSlider
                label={it.l}
                value={(answers.sliders || {})[it.v] ?? 50}
                onChange={(val) => {
                  const next = { ...(answers.sliders || {}), [it.v]: val };
                  onChange('sliders', next);
                }} />
              
                  </div>
            )}
              </div>
          }
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <button onClick={onBack} style={{
          height: 44, padding: '0 18px', borderRadius: 10, border: `1px solid ${ONB_BORDER}`,
          background: 'transparent', color: ONB_INK, fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8
        }}>
          <i className="fa-solid fa-arrow-right" style={{ transform: 'rotate(180deg)', width: 13, height: 13 }} /> Back
        </button>
        <button onClick={valid ? onNext : undefined} disabled={!valid} style={{
          height: 44, padding: '0 22px', borderRadius: 10, border: 'none',
          background: valid ? ONB_BRAND_GREEN : 'rgba(5,122,85,0.3)',
          color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          cursor: valid ? 'pointer' : 'not-allowed',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: valid ? '0 4px 14px -4px rgba(5,122,85,0.6)' : 'none',
          opacity: valid ? 1 : 0.6
        }}>
          Continue <i className="fa-solid fa-arrow-right" style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>);

}

function OnbTilePicker({ answers, selected, onToggle, onNext, onBack }) {
  const recommended = React.useMemo(() => new Set(onbRecommend(answers)), [answers]);
  const ordered = React.useMemo(() => [
  ...ONB_TILE_CATALOG.filter((t) => t.inDashboard),
  ...ONB_TILE_CATALOG.filter((t) => !t.inDashboard && recommended.has(t.id)),
  ...ONB_TILE_CATALOG.filter((t) => !t.inDashboard && !recommended.has(t.id) && !t.comingSoon),
  ...ONB_TILE_CATALOG.filter((t) => t.comingSoon)],
  [recommended]);
  const count = selected.size;
  const [previewId, setPreviewId] = React.useState(null);
  const previewTile = previewId ? ONB_TILE_CATALOG.find((t) => t.id === previewId) : null;
  // Close popover on outside click / Escape
  React.useEffect(() => {
    if (!previewId) return;
    const onKey = (e) => {if (e.key === 'Escape') setPreviewId(null);};
    const onDoc = (e) => {
      if (!e.target.closest('[data-onb-preview]')) setPreviewId(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => {document.removeEventListener('keydown', onKey);document.removeEventListener('mousedown', onDoc);};
  }, [previewId]);
  return (
    <div style={{ width: 'min(960px, 100%)', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: ONB_GREEN_SOFT,
            border: `1px solid rgba(5,122,85,0.4)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="fa-solid fa-table-columns" style={{ color: ONB_BRAND_GREEN, fontSize: 14 }} />
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 500, color: ONB_MUTED, letterSpacing: '0.04em' }}>
            STEP 2 OF 2
          </div>
        </div>
        <h2 style={{
          fontFamily: 'Inter', fontWeight: 700, fontSize: 32, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: ONB_INK, margin: '0 0 8px'
        }}>Pick the tiles for your dashboard</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 15, color: ONB_MUTED, margin: 0, lineHeight: 1.5 }}>
          We pre-selected a starter set. Click the eye on any tile for a preview — you can always change this later.
        </p>
      </div>

      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 9999,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${ONB_BORDER}`,
              fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: ONB_MUTED
            }}>
              <i className="fa-solid fa-clock" style={{ fontSize: 9 }} /> COMING SOON
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: ONB_MUTED, marginLeft: 6 }}>
              {count} tile{count === 1 ? '' : 's'} selected
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {ordered.map((t) => {
            const on = selected.has(t.id);
            const onDash = !!t.inDashboard;
            const soon = !!t.comingSoon;
            const showPreview = previewId === t.id;
            return (
              <div
                key={t.id}
                data-onb-preview
                style={{
                  position: 'relative',
                  borderRadius: 12,
                  border: soon ? `1px dashed ${ONB_BORDER}` :
                  on ? `1px solid ${ONB_BRAND_GREEN}` :
                  onDash ? `1px solid rgba(5,122,85,0.45)` :
                  `1px solid ${ONB_BORDER}`,
                  background: soon ? 'rgba(255,255,255,0.02)' :
                  on ? ONB_GREEN_SOFT :
                  onDash ? 'rgba(5,122,85,0.06)' :
                  ONB_GLASS,
                  opacity: soon ? 0.7 : 1,
                  transition: 'background 150ms ease, border-color 150ms ease'
                }}>
                
                <button
                  type="button"
                  disabled={soon}
                  onClick={() => !soon && onToggle(t.id)}
                  style={{
                    all: 'unset', boxSizing: 'border-box', display: 'block', width: '100%',
                    padding: '14px', cursor: soon ? 'not-allowed' : 'pointer',
                    color: soon ? ONB_DIM : ONB_INK
                  }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: on ? 'rgba(5,122,85,0.3)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${on ? 'rgba(5,122,85,0.5)' : ONB_BORDER_SOFT}`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <i className={`fa-solid fa-${t.icon}`} style={{ color: soon ? ONB_DIM : on ? ONB_BRAND_GREEN : ONB_MUTED, fontSize: 13 }} />
                    </div>
                    {soon ?
                    <span style={{
                      fontFamily: 'Inter', fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 9999,
                      background: 'rgba(255,255,255,0.04)', border: `1px solid ${ONB_BORDER}`, color: ONB_MUTED, letterSpacing: '0.05em'
                    }}>SOON</span> :

                    <div style={{
                      width: 22, height: 22, borderRadius: 9999,
                      border: on ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${ONB_BORDER}`,
                      background: on ? ONB_BRAND_GREEN : 'transparent',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {on ?
                      <i className="fa-solid fa-check" style={{ width: 10, height: 10, color: '#fff' }} /> :
                      <i className="fa-solid fa-plus" style={{ width: 10, height: 10, color: ONB_MUTED }} />}
                      </div>
                    }
                  </div>
                  <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13.5, color: soon ? ONB_MUTED : ONB_INK, marginBottom: 3 }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: soon ? ONB_DIM : ONB_MUTED, lineHeight: 1.4, paddingRight: 32 }}>{t.desc}</div>
                </button>
                {/* Preview eye — bottom-right corner */}
                <button
                  type="button"
                  onClick={(e) => {e.stopPropagation();setPreviewId((p) => p === t.id ? null : t.id);}}
                  title="Preview tile"
                  style={{
                    position: 'absolute', right: 10, bottom: 10,
                    width: 26, height: 26, borderRadius: 7,
                    background: showPreview ? ONB_BRAND_GREEN : 'rgba(0,0,0,0.4)',
                    border: `1px solid ${showPreview ? ONB_BRAND_GREEN : 'rgba(75,85,99,0.6)'}`,
                    color: showPreview ? '#fff' : ONB_MUTED, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 150ms ease'
                  }}>
                  
                  <i className="fa-solid fa-eye" style={{ fontSize: 11 }} />
                </button>
                {/* Popover */}
                {showPreview &&
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 10px)', zIndex: 20,
                  width: 320, padding: 14, borderRadius: 12,
                  background: 'rgb(17,24,39)', border: `1px solid ${ONB_BORDER}`,
                  boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6)',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  animation: 'onbFadeIn 180ms ease-out'
                }}>
                    {/* Arrow */}
                    <div style={{
                    position: 'absolute', right: 18, top: -6, width: 12, height: 12,
                    background: 'rgb(17,24,39)', borderTop: `1px solid ${ONB_BORDER}`, borderLeft: `1px solid ${ONB_BORDER}`,
                    transform: 'rotate(45deg)'
                  }} />
                    <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${ONB_BORDER_SOFT}` }}>
                      <OnbTilePreview id={t.id} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13.5, color: ONB_INK, marginBottom: 8 }}>
                        Why add {t.name}?
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(t.benefits || []).map((b, i) =>
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <i className="fa-solid fa-check" style={{ color: ONB_BRAND_GREEN, fontSize: 10, marginTop: 4, flexShrink: 0 }} />
                            <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgb(209,213,219)', lineHeight: 1.45 }}>{b}</span>
                          </li>
                      )}
                      </ul>
                    </div>
                  </div>
                }
              </div>);

          })}
        </div>
      </div>

      <div style={{
        border: `1px solid rgba(5,122,85,0.4)`, borderRadius: 12, padding: '16px 18px',
        background: 'rgba(5,122,85,0.06)',
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: ONB_GREEN_SOFT,
          border: `1px solid rgba(5,122,85,0.4)`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <i className="fa-solid fa-plus" style={{ color: ONB_BRAND_GREEN, fontSize: 14 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13.5, fontWeight: 600, color: ONB_INK, marginBottom: 2 }}>
            Need something else?
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: ONB_MUTED, lineHeight: 1.4 }}>
            Once you're in, click the <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 8px', borderRadius: 6, verticalAlign: 'middle',
              background: 'rgba(5,122,85,0.2)', border: `1px solid rgba(5,122,85,0.4)`,
              fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgb(134,239,172)'
            }}><i className="fa-solid fa-plus" style={{ fontSize: 9 }} /> Add a tile</span> button on your dashboard and describe what you need in plain English.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{
          height: 44, padding: '0 18px', borderRadius: 10, border: `1px solid ${ONB_BORDER}`,
          background: 'transparent', color: ONB_INK, fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8
        }}>
          <i className="fa-solid fa-arrow-right" style={{ transform: 'rotate(180deg)', width: 13, height: 13 }} /> Back
        </button>
        <button onClick={onNext} style={{
          height: 44, padding: '0 22px', borderRadius: 10, border: 'none',
          background: ONB_BRAND_GREEN,
          color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 14px -4px rgba(5,122,85,0.6)'
        }}>
          Build my dashboard <i className="fa-solid fa-wand-sparkles" style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>);

}

function OnbBuilding({ tileCount, onDone }) {
  const steps = [
  'Connecting to your client book',
  'Importing portfolios & holdings',
  'Personalizing tiles to your workflow',
  'Tuning notifications & alerts',
  'Wiring up your AI assistant'];

  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (idx < steps.length) {
      const t = setTimeout(() => setIdx(idx + 1), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 600);
    return () => clearTimeout(t);
  }, [idx]);
  return (
    <div style={{ width: 'min(560px, 100%)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 9999,
          border: `3px solid rgba(5,122,85,0.2)`
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 9999,
          border: '3px solid transparent', borderTopColor: ONB_BRAND_GREEN,
          animation: 'spin 1.1s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <i className="fa-solid fa-wand-sparkles" style={{ color: ONB_BRAND_GREEN, fontSize: 28 }} />
        </div>
      </div>
      <div>
        <h2 style={{
          fontFamily: 'Inter', fontWeight: 700, fontSize: 30, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: ONB_INK, margin: '0 0 8px'
        }}>Building your dashboard</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 14.5, color: ONB_MUTED, margin: 0 }}>
          Wiring up {tileCount} tile{tileCount === 1 ? '' : 's'} and connecting your data feeds.
        </p>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={s} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10,
              background: active ? ONB_GREEN_SOFT : 'transparent',
              border: active ? `1px solid rgba(5,122,85,0.4)` : '1px solid transparent',
              transition: 'background 200ms ease, border-color 200ms ease'
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9999, flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: done ? ONB_BRAND_GREEN : 'transparent',
                border: done ? `1px solid ${ONB_BRAND_GREEN}` : `1px solid ${active ? ONB_BRAND_GREEN : ONB_BORDER}`
              }}>
                {done && <i className="fa-solid fa-check" style={{ width: 10, height: 10, color: '#fff' }} />}
                {active && <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 9, color: ONB_BRAND_GREEN }} />}
              </div>
              <span style={{
                fontFamily: 'Inter', fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                color: done || active ? ONB_INK : ONB_MUTED
              }}>{s}</span>
            </div>);

        })}
      </div>
    </div>);

}

/* ----------------------------------------------------------------------- */
/* Connect integrations stage                                              */
/* ----------------------------------------------------------------------- */
const ONB_INTEGRATIONS = [
{ id: 'email', name: 'Email', provider: 'Gmail / Outlook', desc: 'Pull client emails into your inbox tile and surface unanswered threads.', icon: 'envelope', color: 'rgb(220,38,38)', sampleAcct: 'sarah.berry@alpineadvisors.com' },
{ id: 'calendar', name: 'Calendar', provider: 'Google / Microsoft', desc: 'Sync upcoming client meetings and prep windows on your dashboard.', icon: 'calendar', color: 'rgb(56,189,248)', sampleAcct: 'sarah.berry@alpineadvisors.com' },
{ id: 'hubspot', name: 'HubSpot', provider: 'CRM', desc: 'Mirror contacts, deals, and activity logs across your client book.', icon: 'address-book', color: 'rgb(251,146,60)', sampleAcct: 'Alpine Advisors · sarah@alpineadvisors' },
{ id: 'docusign', name: 'DocuSign', provider: 'eSignature', desc: 'Track agreement status and trigger reminders when signatures stall.', icon: 'file-signature', color: 'rgb(168,85,247)', sampleAcct: 'sarah.berry@alpineadvisors.com' },
{ id: 'salesforce', name: 'Salesforce', provider: 'CRM', desc: 'Optional alternative to HubSpot — pull pipeline and account history.', icon: 'cloud', color: 'rgb(14,165,233)', sampleAcct: 'sarah@alpineadvisors.my.salesforce.com' }];


function OnbConnect({ selectedTiles, connections, onConnect, onDisconnect, onNext, onBack }) {
  const offered = React.useMemo(() => {
    const ids = onbIntegrationsFor(selectedTiles ? [...selectedTiles] : []);
    const list = ONB_INTEGRATIONS.filter(i => ids.has(i.id));
    return list.length > 0 ? list : ONB_INTEGRATIONS;
  }, [selectedTiles]);
  // For each integration, find which selected tiles need it (so we can show why it's here).
  const tilesNeedingIntegration = React.useMemo(() => {
    const out = {};
    const sel = new Set(selectedTiles ? [...selectedTiles] : []);
    Object.entries(ONB_TILE_TO_INTEGRATIONS).forEach(([tileId, intgs]) => {
      if (!sel.has(tileId)) return;
      const tile = ONB_TILE_CATALOG.find(t => t.id === tileId);
      if (!tile) return;
      intgs.forEach(intgId => {
        if (!out[intgId]) out[intgId] = [];
        out[intgId].push(tile.name);
      });
    });
    return out;
  }, [selectedTiles]);
  const connectedCount = Object.values(connections).filter((c) => c && c.status === 'connected').length;
  const [pending, setPending] = React.useState(null);
  const handleConnect = (intg) => {
    setPending(intg.id);
    setTimeout(() => {
      onConnect(intg.id, { status: 'connected', account: intg.sampleAcct, since: Date.now() });
      setPending(null);
    }, 900);
  };
  return (
    <div style={{ width: 'min(960px, 100%)', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: ONB_GREEN_SOFT,
            border: `1px solid rgba(5,122,85,0.4)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="fa-solid fa-link" style={{ color: ONB_BRAND_GREEN, fontSize: 14 }} />
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 500, color: ONB_MUTED, letterSpacing: '0.04em' }}>
            STEP 3 OF 3
          </div>
        </div>
        <h2 style={{
          fontFamily: 'Inter', fontWeight: 700, fontSize: 32, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: ONB_INK, margin: '0 0 8px'
        }}>Plug in the tools you already use</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 15, color: ONB_MUTED, margin: 0, lineHeight: 1.5 }}>
          Connect any account now or skip and add them later from your sidebar. We'll only pull what you need to power the tiles you picked.
        </p>
      </div>

      {/* Custodial-data already-handled banner */}
      <div style={{
        border: `1px solid rgba(5,122,85,0.35)`, borderRadius: 12, padding: '12px 16px',
        background: 'rgba(5,122,85,0.08)',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: 'rgba(5,122,85,0.18)', border: `1px solid rgba(5,122,85,0.4)`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <i className="fa-solid fa-building-columns" style={{ color: ONB_BRAND_GREEN, fontSize: 13 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: ONB_INK, marginBottom: 2 }}>
            Custodial data is already connected
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: ONB_MUTED, lineHeight: 1.45 }}>
            Your firm's admin has linked Schwab, Fidelity, and Pershing for the whole book — holdings, balances, and transactions are flowing in.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {offered.map((intg) => {
          const conn = connections[intg.id];
          const isConnected = conn && conn.status === 'connected';
          const isPending = pending === intg.id;
          const reasons = tilesNeedingIntegration[intg.id] || [];
          return (
            <div key={intg.id} style={{
              border: isConnected ? `1px solid rgba(5,122,85,0.5)` : `1px solid ${ONB_BORDER}`,
              borderRadius: 12, padding: '14px 16px',
              background: isConnected ? 'rgba(5,122,85,0.06)' : ONB_GLASS,
              display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 150ms ease'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${ONB_BORDER_SOFT}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: intg.color
              }}>
                <i className={`fa-solid fa-${intg.icon}`} style={{ fontSize: 16 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: ONB_INK }}>{intg.name}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: ONB_DIM }}>· {intg.provider}</span>
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: ONB_MUTED, lineHeight: 1.4, marginBottom: 10 }}>
                  {intg.desc}
                </div>
                {reasons.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: ONB_DIM, alignSelf: 'center' }}>Powers:</span>
                    {reasons.map(name => (
                      <span key={name} style={{
                        fontFamily: 'Inter', fontSize: 11, fontWeight: 500,
                        color: ONB_BRAND_GREEN,
                        padding: '3px 8px', borderRadius: 9999,
                        background: 'rgba(5,122,85,0.10)',
                        border: `1px solid rgba(5,122,85,0.25)`,
                      }}>{name}</span>
                    ))}
                  </div>
                )}
                {isConnected ?
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: 'Inter', fontSize: 11.5, fontWeight: 600, color: 'rgb(134,239,172)'
                  }}>
                      <span style={{ width: 7, height: 7, borderRadius: 9999, background: 'rgb(134,239,172)' }} />
                      Connected · {conn.account}
                    </span>
                    <button onClick={() => onDisconnect(intg.id)} style={{
                    marginLeft: 'auto', height: 26, padding: '0 10px', borderRadius: 6,
                    border: `1px solid ${ONB_BORDER}`, background: 'transparent',
                    color: ONB_MUTED, fontFamily: 'Inter', fontSize: 11, fontWeight: 500,
                    cursor: 'pointer'
                  }}>Disconnect</button>
                  </div> :

                <button onClick={() => !isPending && handleConnect(intg)} disabled={isPending} style={{
                  height: 30, padding: '0 14px', borderRadius: 7,
                  border: `1px solid ${ONB_BORDER}`,
                  background: isPending ? 'rgba(255,255,255,0.04)' : ONB_GLASS_2,
                  color: ONB_INK, fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                  cursor: isPending ? 'wait' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8
                }}>
                    {isPending ?
                  <React.Fragment>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 11 }} /> Connecting…
                      </React.Fragment> :

                  <React.Fragment>
                        <i className="fa-solid fa-plug" style={{ fontSize: 11 }} /> Connect
                      </React.Fragment>
                  }
                  </button>
                }
              </div>
            </div>);

        })}
      </div>

      <div style={{
        border: `1px solid rgba(5,122,85,0.4)`, borderRadius: 12, padding: '14px 18px',
        background: 'rgba(5,122,85,0.06)',
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <i className="fa-solid fa-shield-halved" style={{ color: ONB_BRAND_GREEN, fontSize: 18 }} />
        <div style={{ flex: 1, fontFamily: 'Inter', fontSize: 12.5, color: ONB_MUTED, lineHeight: 1.4 }}>
          We use read-only OAuth scopes by default. Field never stores your credentials and you can revoke access at any time from your sidebar.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{
          height: 44, padding: '0 18px', borderRadius: 10, border: `1px solid ${ONB_BORDER}`,
          background: 'transparent', color: ONB_INK, fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8
        }}>
          <i className="fa-solid fa-arrow-right" style={{ transform: 'rotate(180deg)', width: 13, height: 13 }} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: ONB_MUTED, marginRight: 4 }}>
            {connectedCount === 0 ? 'No accounts connected' : `${connectedCount} connected`}
          </span>
          <button onClick={onNext} style={{
            height: 44, padding: '0 18px', borderRadius: 10,
            border: `1px solid ${ONB_BORDER}`, background: 'transparent',
            color: ONB_MUTED, fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
            cursor: 'pointer'
          }}>
            Skip for now
          </button>
          <button onClick={onNext} style={{
            height: 44, padding: '0 22px', borderRadius: 10, border: 'none',
            background: ONB_BRAND_GREEN, color: '#fff',
            fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 14px -4px rgba(5,122,85,0.6)'
          }}>
            Build my dashboard <i className="fa-solid fa-wand-sparkles" style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </div>);

}

/* ----------------------------------------------------------------------- */
/* Root                                                                    */
/* ----------------------------------------------------------------------- */
function OnboardingFlow({ advisorName = 'Sarah', onComplete }) {
  // stages: 'welcome' | step index | 'connect' | 'tiles' | 'building'
  const [stage, setStage] = React.useState('welcome');
  const [answers, setAnswers] = React.useState({
    sliders: { meetings: 60, rebalance: 55, reporting: 40, planning: 50, prospecting: 30, ops: 25 }
  });
  const [selected, setSelected] = React.useState(new Set());
  // Onboarding always starts with all tools disconnected — fresh setup state.
  const [connections, setConnections] = React.useState({});
  React.useEffect(() => {
    try {localStorage.setItem('field.connections', JSON.stringify(connections));} catch (e) {}
  }, [connections]);
  // Once we have answers from step 5, prefill recommended tiles
  const tilesInit = React.useRef(false);
  React.useEffect(() => {
    if (stage === 'tiles' && !tilesInit.current) {
      const rec = onbRecommend(answers);
      setSelected(new Set(rec));
      tilesInit.current = true;
    }
  }, [stage, answers]);

  const goNextFrom = (s) => {
    if (s === 'welcome') return 0;
    if (typeof s === 'number') {
      if (s + 1 >= ONB_STEPS.length) return 'tiles';
      return s + 1;
    }
    if (s === 'tiles') return 'building';
    if (s === 'connect') return 'building';
    return s;
  };
  const goBackFrom = (s) => {
    if (typeof s === 'number') return s === 0 ? 'welcome' : s - 1;
    if (s === 'tiles') return ONB_STEPS.length - 1;
    if (s === 'connect') return 'tiles';
    return s;
  };

  const updateAnswer = (key, value) => setAnswers((a) => ({ ...a, [key]: value }));
  const toggleTile = (id) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);else
    next.add(id);
    return next;
  });
  const setConnection = (id, value) => setConnections((c) => ({ ...c, [id]: value }));
  const removeConnection = (id) => setConnections((c) => {
    const next = { ...c };delete next[id];return next;
  });

  const totalSteps = ONB_STEPS.length;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column'
    }}>
      {/* Top chrome — minimal: brand + step counter */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderBottom: `1px solid ${ONB_BORDER_SOFT}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: ONB_BRAND_GREEN,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: '#fff'
          }}>F</div>
          <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: ONB_INK, letterSpacing: '0.02em' }}>
            FIELD
          </div>
        </div>
        {typeof stage === 'number' &&
        <div style={{ width: 'min(420px, 50%)' }}>
            <OnbProgress step={stage} total={totalSteps} />
          </div>
        }
        <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: ONB_MUTED }}>
          {stage === 'welcome' ? "Setup" :
          stage === 'tiles' ? `Step 2 of 2` :
          stage === 'connect' ? `Step 2 of 2` :
          stage === 'building' ? "Almost there" :
          `Step 1 of 2`}
        </div>
      </header>

      {/* Content */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px'
      }}>
        {stage === 'welcome' &&
        <OnbWelcome name={advisorName} onStart={() => setStage(0)} />
        }
        {typeof stage === 'number' &&
        <OnbStep
          step={ONB_STEPS[stage]}
          index={stage}
          total={totalSteps + 1}
          answers={answers}
          onChange={updateAnswer}
          onNext={() => setStage(goNextFrom(stage))}
          onBack={() => setStage(goBackFrom(stage))} />

        }
        {stage === 'tiles' &&
        <OnbTilePicker
          answers={answers}
          selected={selected}
          onToggle={toggleTile}
          onNext={() => setStage(goNextFrom('tiles'))}
          onBack={() => setStage(goBackFrom('tiles'))} />

        }
        {stage === 'connect' &&
        <OnbConnect
          selectedTiles={selected}
          connections={connections}
          onConnect={setConnection}
          onDisconnect={removeConnection}
          onNext={() => setStage(goNextFrom('connect'))}
          onBack={() => setStage(goBackFrom('connect'))} />

        }
        {stage === 'building' &&
        <OnbBuilding tileCount={selected.size} onDone={() => onComplete && onComplete({ answers, selected: [...selected], connections })} />
        }
      </main>
    </div>);

}

Object.assign(window, { OnboardingFlow });