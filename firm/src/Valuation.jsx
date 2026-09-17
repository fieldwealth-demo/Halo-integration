/* Valuation page */

/* Acquirer firm profiles. Each is a prospective buyer interested in the firm;
   clicking a row opens a full-screen profile modal (modeled on the user's
   "What's Your RIA Worth?" sample) describing what that acquirer does and
   ending in a "Share My Data" CTA. Offers are deliberately distinct — a
   boutique advisory, an aggregator, a bank, a PE shop and a platform value
   the same book very differently. */
const FIRM_PROFILES = [
  {
    logo: 'declaration', name: 'Declaration', accent: 'rgb(37,99,235)',
    val: '$29M – $32M', basis: 'Boutique RIA M&A advisory · 3.4–3.8× revenue',
    desc: 'Specializes in high-growth RIA acquisitions with focus on technology integration and client retention strategies.',
    headline: "What's Your RIA Worth?",
    tagline: 'Get a comprehensive, market-accurate valuation of your registered investment advisory firm with our industry-leading assessment methodology.',
    features: [
      { t: 'Comprehensive Analysis', b: "Deep dive into your firm's financials, client base, operational efficiency, and market positioning to deliver precise valuations." },
      { t: 'Industry Expertise', b: 'Our team of certified professionals specializes exclusively in RIA valuations with extensive knowledge of industry standards and trends.' },
      { t: 'Rapid Turnaround', b: 'Receive your detailed valuation report within 10–14 business days, complete with market comparables and growth projections.' },
      { t: 'Confidential Process', b: 'Bank-level security protocols ensure your sensitive financial data remains completely confidential throughout the evaluation process.' },
      { t: 'Strategic Insights', b: "Beyond valuation, receive actionable recommendations to enhance your firm's value and market positioning." },
      { t: 'M&A Support', b: 'Comprehensive support for succession planning, merger opportunities, and acquisition strategies with market intelligence.' },
    ],
    ctaHeadline: "Ready to Discover Your Firm's True Value?",
    ctaBody: 'Join hundreds of RIA firms who have trusted Declaration with their most important financial decisions. Get started with a complimentary consultation today.',
  },
  {
    logo: 'hightower', name: 'Hightower', accent: 'rgb(25,64,190)',
    val: '$24M – $27M', basis: 'RIA partnership / aggregator · 7–9× EBITDA + equity',
    desc: 'Premium valuations for established practices with strong recurring revenue and institutional-quality operations.',
    headline: 'Partner With Hightower',
    tagline: 'Sell a stake, keep your brand, and plug into the scale of a national partnership built for established advisory practices.',
    features: [
      { t: 'Equity Partnership', b: 'Monetize a portion of your firm today while retaining meaningful upside through Hightower equity and ongoing economics.' },
      { t: 'Back-Office Scale', b: 'Offload compliance, HR, billing, and technology to a shared services platform so your team can focus on clients.' },
      { t: 'Growth & Marketing', b: 'Access centralized marketing, lead generation, and business development resources to accelerate organic growth.' },
      { t: 'Succession Planning', b: 'A built-in continuity solution and next-gen advisor pipeline protect your clients and your legacy.' },
      { t: 'Open Architecture', b: 'Keep your custodian, your investment philosophy, and your client relationships — we add scale, not constraints.' },
      { t: 'M&A Firepower', b: 'Tap balance-sheet capital and a sourcing team to pursue your own tuck-in acquisitions under the Hightower umbrella.' },
    ],
    ctaHeadline: 'Build Something Bigger, Together.',
    ctaBody: 'Hightower partners with elite advisory practices nationwide. Share your firm data for a confidential partnership valuation and term indication.',
  },
  {
    logo: 'citizens', name: 'Citizens Private Wealth', accent: 'rgb(0,144,255)',
    val: '$19M – $23M', basis: 'Bank-owned wealth platform · 6–7× EBITDA',
    desc: 'Conservative banking approach with emphasis on stable cash flows and established client relationships.',
    headline: 'Citizens Private Wealth',
    tagline: 'Join a bank-backed wealth platform that pairs your advisory practice with full-service banking, lending, and balance-sheet strength.',
    features: [
      { t: 'Balance-Sheet Strength', b: 'Back your clients with the stability and capital of an established national bank and its deposit base.' },
      { t: 'Lending Solutions', b: 'Offer mortgages, securities-based lines, and private credit to deepen wallet share with high-net-worth households.' },
      { t: 'Banking Integration', b: 'Seamlessly connect investment management with everyday banking, treasury, and cash management for clients.' },
      { t: 'Stable Funding', b: 'Predictable, conservatively structured cash consideration with retention incentives for your senior advisors.' },
      { t: 'Risk & Compliance', b: 'Institutional-grade risk, audit, and compliance infrastructure already built and maintained for you.' },
      { t: 'Long-Term Stewardship', b: 'A patient, relationship-first owner focused on multi-decade client continuity rather than a quick flip.' },
    ],
    ctaHeadline: 'Stability Meets Sophistication.',
    ctaBody: 'Citizens Private Wealth acquires established advisory practices with durable client relationships. Share your data for a confidential indication of value.',
  },
  {
    logo: 'tpg', name: 'TPG Growth', accent: 'rgb(229,231,235)',
    val: '$31M – $38M', basis: 'Private equity · 10–12× EBITDA',
    desc: 'Private equity premium for scalable businesses with clear growth trajectory and market leadership position.',
    headline: 'TPG Growth Capital',
    tagline: 'Unlock the highest multiple in the market with growth capital, an operating playbook, and a clear path to a second, larger exit.',
    features: [
      { t: 'Growth Capital', b: 'Inject capital to fund acquisitions, new markets, and talent — built for firms with a clear scaling trajectory.' },
      { t: 'Operating Playbook', b: 'Proven value-creation frameworks across pricing, productivity, and margin expansion from a dedicated ops team.' },
      { t: 'Acquisition Pipeline', b: 'Source and finance tuck-in deals to roll up your region and compound enterprise value quickly.' },
      { t: 'Tech & Data Investment', b: 'Fund the platform, data, and automation investments that lift advisor capacity and client experience.' },
      { t: 'Talent & Recruiting', b: 'Equity-based incentive design and executive recruiting to attract and retain top advisory talent.' },
      { t: 'Exit Optionality', b: 'Position for a premium second exit — strategic sale or IPO — with you participating in the upside.' },
    ],
    ctaHeadline: 'Scale Fast. Exit Higher.',
    ctaBody: 'TPG Growth backs market-leading advisory platforms with capital and operating muscle. Share your firm data to explore a growth-equity partnership.',
  },
  {
    logo: 'lpl', name: 'LPL Financial', accent: 'rgb(0,82,155)',
    val: '$18M + earn-out', basis: 'Platform / broker-dealer · transition + earn-out',
    desc: 'Platform-based valuation with additional earn-out potential based on advisor retention and asset growth.',
    headline: 'LPL Financial',
    tagline: 'Move onto the largest independent advisor platform with transition capital up front and earn-out upside as your assets grow.',
    features: [
      { t: 'Platform & Technology', b: 'Run your practice on a fully integrated advisory, planning, and portfolio platform used by 20,000+ advisors.' },
      { t: 'Transition Assistance', b: 'Up-front transition capital plus a dedicated onboarding team to move your book with minimal client disruption.' },
      { t: 'Earn-Out Upside', b: 'Earn additional consideration tied to advisor retention and net new assets over the first three years.' },
      { t: 'Custody & Clearing', b: 'Self-clearing custody and a deep product shelf give you flexibility without third-party dependencies.' },
      { t: 'Advisor Services', b: 'Practice management, marketing, and business consulting resources to grow and run your firm.' },
      { t: 'Product Access', b: 'Open access to investment products, advisory programs, and lending through a single platform.' },
    ],
    ctaHeadline: 'Your Practice, Powered by Scale.',
    ctaBody: 'LPL supports independent advisors with technology, transition capital, and earn-out economics. Share your data to model your transition package.',
  },
];

function ValuationPage() {
  const [firmOpen, setFirmOpen] = React.useState(null);
  const services = [
    { name: 'Asset Management',   y: 4.23, color: 'rgb(35,89,255)', val: '$4.23M', pct: '45%' },
    { name: 'Financial Planning', y: 1.88, color: 'rgb(120,160,230)', val: '$1.88M', pct: '20%' },
    { name: 'Tax Services',       y: 1.88, color: 'rgb(180,150,235)', val: '$1.88M', pct: '20%' },
    { name: 'Estate',             y: 1.41, color: 'rgb(245,200,90)', val: '$1.41M', pct: '15%' },
  ];
  // Donut convention: 45% transparent fill + full-opacity hue as the slice
  // highlight border. Defined via point-level overrides so each slice carries
  // its own border color rather than the global pie border.
  const serviceDonut = React.useMemo(() => ({
    chart: { type:'pie', height: 280 },
    plotOptions: { pie: { innerSize: '68%', borderRadius: 0, dataLabels: { enabled: false } } },
    series: [{ data: services.map(s => ({
      name: s.name, y: s.y,
      color: s.color.replace('rgb(', 'rgba(').replace(')', ',0.45)'),
      borderColor: s.color, borderWidth: 1.5,
    })) }],
  }), []);

  const firms = FIRM_PROFILES;

  const feeTiers = [
    { tier:'< $500K',    rate:'1.25%', peer:'1.20%', industry:'1.15%', aum:'$42M' },
    { tier:'$500K - $1M', rate:'1.00%', peer:'1.00%', industry:'0.95%', aum:'$86M' },
    { tier:'$1M - $3M',  rate:'0.85%', peer:'0.80%', industry:'0.75%', aum:'$124M' },
    { tier:'$3M - $5M',  rate:'0.70%', peer:'0.65%', industry:'0.60%', aum:'$98M' },
    { tier:'$5M+',       rate:'0.50%', peer:'0.55%', industry:'0.50%', aum:'$182M' },
  ];

  const advFees = [
    { name:'Sarah Berry',     pct:'0.92%', delta:'+0.04%', color:'green' },
    { name:'Nick James',      pct:'0.88%', delta:'+0.00%', color:'blue'  },
    { name:'Frank Smith',     pct:'0.84%', delta:'-0.02%', color:'purple'},
    { name:'Robert Sullivan', pct:'0.82%', delta:'-0.04%', color:'coral' },
    { name:'Karen Manning',   pct:'0.89%', delta:'+0.00%', color:'amber' },
  ];

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        <StatTile label="Recurring Revenue" value="$8.5M" sub={<span style={{ color: 'rgb(168,185,241)' }}>↑ 14.2% from previous year</span>} />
        <StatTile label="Annual Expenses" value="$5.8M" sub={<span style={{ color: 'rgb(248,113,113)' }}>↑ 8.1% from previous year</span>} />
        <StatTile label="Total Client Households" value="1,726" sub={<span style={{ color: 'rgb(168,185,241)' }}>↑ 5% from previous year</span>} />
        <StatTile label="Client Retention Rate" value="96.2%" sub={<span style={{ color: 'rgb(168,185,241)' }}>↑ 1.4% from previous year</span>} />
      </div>

      <FirmValuationStory />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardTitle title="Advisory Firm Valuations" subtitle="Acquirers interested in your firm · click to view their offer" />
          {firms.map((f,i) => (
            <div key={i} className="row-hover" onClick={() => setFirmOpen(f)} style={{ display:'flex', alignItems:'center', gap: 12, padding: 12, borderBottom: i < firms.length-1 ? '1px solid rgba(75,85,99,0.2)' : 'none', cursor:'pointer', borderRadius: 8 }}>
              <div style={{ width: 110, height: 44, borderRadius: 6, overflow: 'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0, border:'1px solid rgba(75,85,99,0.4)' }}>
                <Logo name={f.logo} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color:'rgb(156,163,175)' }}>{f.desc}</div>
                <div style={{ fontSize: 10.5, color:'rgb(107,114,128)', marginTop: 3 }}>{f.basis}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink: 0 }}>
                <div className="num" style={{ fontSize: 13, fontWeight: 700, color: 'rgb(168,185,241)' }}>{f.val}</div>
                <div style={{ fontSize: 10, color:'rgb(107,114,128)' }}>est. offer</div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: 12, color:'rgb(107,114,128)', flexShrink: 0 }} />
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle title="Revenue Breakdown by Service" />
          <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap: 12, alignItems:'center' }}>
            <div style={{ position:'relative' }}>
              <HC options={serviceDonut} />
              <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', pointerEvents:'none' }}>
                <div style={{ fontSize: 10, color:'rgb(156,163,175)', letterSpacing:'0.06em' }}>CURRENT</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 700, color:'rgb(249,250,251)' }}>$8,534,169</div>
              </div>
            </div>
            <table style={{ width:'100%', fontSize: 12 }}>
              <thead><tr style={{ borderBottom:'1px solid rgba(75,85,99,0.3)' }}><th style={{...th('left')}}>TYPE</th><th style={th('right')}>AUM</th><th style={th('right')}>%</th></tr></thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.name}>
                    <td style={tdSm()}><span style={{ display:'inline-flex', alignItems:'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 9999, background: s.color }}/>{s.name}</span></td>
                    <td style={tdSm('right','num')}>{s.val}</td>
                    <td style={tdSm('right','num')}>{s.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle title="Fee Structure Analysis" subtitle="Extracted from ADV · Compared to Peer Group & Industry" />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(75,85,99,0.3)' }}>
                <th style={th('left')}>AUM TIER</th><th style={th('right')}>YOUR RATE</th><th style={th('right')}>PEER GROUP</th><th style={th('right')}>INDUSTRY</th><th style={th('right')}>AUM IN TIER</th>
              </tr>
            </thead>
            <tbody>
              {feeTiers.map((t,i) => (
                <tr key={i} style={{ borderBottom: i < feeTiers.length-1 ? '1px solid rgba(75,85,99,0.15)' : 'none' }}>
                  <td style={tdSm()}>{t.tier}</td>
                  <td style={tdSm('right','num')}><span style={{ fontWeight: 600, color:'rgb(168,185,241)' }}>{t.rate}</span></td>
                  <td style={tdSm('right','num')}>{t.peer}</td>
                  <td style={tdSm('right','num')}>{t.industry}</td>
                  <td style={tdSm('right','num')}>{t.aum}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ marginTop: 12, display:'inline-flex', alignItems:'center', gap: 6, height: 26, padding: '0 10px', borderRadius: 6, background:'rgba(168,185,241,0.15)', border:'1px solid rgba(168,185,241,0.3)', color:'rgb(168,185,241)', fontSize: 11, fontWeight: 600, cursor:'pointer', alignSelf:'flex-start' }}><i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 11 }} />AI Insights</button>
        </Card>

        <Card>
          <CardTitle title="Firm Average Blended Fee" right={<span className="num" style={{ fontSize: 16, fontWeight: 700, color:'rgb(168,185,241)' }}>0.86%</span>} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div style={{ padding: 12, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)' }}>
              <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>vs Peer Group</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 700, color:'rgb(168,185,241)', marginTop: 4 }}>+0.04%</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)' }}>
              <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>vs Industry</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 700, color:'rgb(168,185,241)', marginTop: 4 }}>+0.08%</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)' }}>
              <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>Avg Client Fee</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 700, color:'rgb(229,231,235)', marginTop: 4 }}>$22,640/yr</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color:'rgb(209,213,219)', marginBottom: 10 }}>Advisor Blended Fees vs Firm Average (0.86%)</div>
          <div style={{ display:'flex', gap: 10 }}>
            {advFees.map(a => (
              <div key={a.name} style={{ flex: 1, padding: 10, borderRadius: 10, border:'1px solid rgba(75,85,99,0.5)', textAlign:'center' }}>
                <Avatar initials={a.name.split(' ').map(s=>s[0]).join('')} size={32} color={a.color} />
                <div style={{ fontSize: 10.5, color:'rgb(209,213,219)', marginTop: 6 }}>{a.name}</div>
                <div className="num" style={{ fontSize: 13, fontWeight: 700, color:'rgb(229,231,235)', marginTop: 2 }}>{a.pct}</div>
                <div style={{ fontSize: 10, color: a.delta.startsWith('+') ? 'rgb(168,185,241)' : 'rgb(248,113,113)', marginTop: 2 }}>{a.delta.startsWith('+') ? '↑' : '↓'} {a.delta.replace(/[+-]/,'')}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <FirmProfileModal firm={firmOpen} onClose={() => setFirmOpen(null)} />
    </div>
  );
}

/* ===== Interactive firm-valuation story =====
   Merges the old "Firm Valuation Impact" calculator with the "Projected
   Valuation Growth" chart. The manager picks a valuation method + multiple,
   then toggles real opportunity-pipeline levers to watch enterprise value
   compound. Inputs are derived (AUM × blended fee + service retainers) so the
   methodology is transparent. */

const VAL_LEVERS = [
  { key:'investments', name:'Investments',      rev:1.5, n:45, color:'rgb(168,185,241)' },
  { key:'credit',      name:'Credit & Lending', rev:1.1, n:23, color:'rgb(248,113,113)' },
  { key:'life',        name:'Life Insurance',   rev:1.2, n:9,  color:'rgb(180,150,235)' },
  { key:'estate',      name:'Trust & Estate',   rev:0.9, n:12, color:'rgb(120,160,230)' },
  { key:'annuity',     name:'Annuity',          rev:0.8, n:18, color:'rgb(245,200,90)' },
  { key:'tax',         name:'Tax Overlay',      rev:0.7, n:8,  color:'rgb(240,140,120)' },
  { key:'health',      name:'Healthcare',       rev:0.6, n:14, color:'rgb(120,200,210)' },
];
const VAL_AUM = 734, VAL_FEE = 0.0086, VAL_OTHER_REV = 2.2, VAL_MARGIN = 0.32;
const VAL_ADVISORY = VAL_AUM * VAL_FEE;             // ≈ $6.31M
const VAL_BASE_REV = VAL_ADVISORY + VAL_OTHER_REV;  // ≈ $8.51M (reconciles w/ service donut)
const fmtM = (n) => '$' + n.toFixed(1) + 'M';

function ValRow({ l, r, muted, bold, accent }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span style={{ color: muted ? 'rgb(107,114,128)' : 'rgb(156,163,175)', fontSize: 11.5 }}>{l}</span>
      <span className="num" style={{ fontWeight: bold ? 700 : 600, fontSize: 11.5, color: accent ? 'rgb(168,185,241)' : (bold ? 'rgb(249,250,251)' : 'rgb(209,213,219)') }}>{r}</span>
    </div>
  );
}
const valMiniBtn = (primary) => ({
  height: 28, padding: '0 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11.5, fontWeight: 600,
  border: primary ? '1px solid rgba(168,185,241,0.4)' : '1px solid rgba(75,85,99,0.5)',
  background: primary ? 'rgba(168,185,241,0.15)' : 'transparent',
  color: primary ? 'rgb(168,185,241)' : 'rgb(156,163,175)',
});

function FirmValuationStory() {
  const ls = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  const [method, setMethod]       = React.useState(() => ls('firm.val.method', 'revenue'));
  const [revMult, setRevMult]     = React.useState(() => parseFloat(ls('firm.val.revMult', '3.5')) || 3.5);
  const [ebitdaMult, setEbitdaMult] = React.useState(() => parseFloat(ls('firm.val.ebitdaMult', '8')) || 8);
  React.useEffect(() => {
    try {
      localStorage.setItem('firm.val.method', method);
      localStorage.setItem('firm.val.revMult', String(revMult));
      localStorage.setItem('firm.val.ebitdaMult', String(ebitdaMult));
    } catch (e) {}
  }, [method, revMult, ebitdaMult]);

  // Full pipeline is always part of the projection — the manager wants all of it.
  const capturedRev = VAL_LEVERS.reduce((s, o) => s + o.rev, 0);
  const totalOpps   = VAL_LEVERS.reduce((s, o) => s + o.n, 0);
  const valuationOf = (rev) => method === 'revenue' ? rev * revMult : rev * VAL_MARGIN * ebitdaMult;
  const currentVal  = valuationOf(VAL_BASE_REV);
  const projRev     = VAL_BASE_REV + capturedRev;
  const projVal     = valuationOf(projRev);
  const delta       = projVal - currentVal;
  const pct         = currentVal ? (delta / currentVal * 100) : 0;
  const goOpps      = () => window.dispatchEvent(new CustomEvent('firm:navigate', { detail: { page: 'opportunities' } }));

  const months = ['Now', '+3mo', '+6mo', '+9mo', '+12mo', '+15mo', '+18mo'];
  const ramp   = [0, 0.12, 0.32, 0.55, 0.76, 0.91, 1];   // opportunities ramp in over 18mo
  const base   = months.map((_, i) => +(currentVal * Math.pow(1.06, (i * 3) / 12)).toFixed(2));
  const top    = months.map((_, i) => {
    const tgt = projVal * Math.pow(1.06, (i * 3) / 12);
    return +(base[i] + (tgt - base[i]) * ramp[i]).toFixed(2);
  });

  const opts = React.useMemo(() => ({
    chart: { type: 'line', height: 290, spacing: [8, 6, 4, 4] },
    xAxis: { categories: months, lineWidth: 0, tickWidth: 0 },
    yAxis: { labels: { formatter: function () { return '$' + Math.round(this.value) + 'M'; } }, title: { text: null } },
    legend: { enabled: false },
    tooltip: { shared: true, valuePrefix: '$', valueSuffix: 'M', valueDecimals: 1 },
    plotOptions: { series: { animation: { duration: 520 }, marker: { enabled: false } } },
    series: [
      { name: 'Upside', type: 'arearange', data: months.map((_, i) => [base[i], top[i]]),
        color: 'rgba(35,89,255,0.26)', lineWidth: 0, fillOpacity: 0.26, enableMouseTracking: false, zIndex: 0, marker: { enabled: false } },
      { name: 'With opportunities', type: 'line', data: top, color: 'rgb(35,89,255)', lineWidth: 2.5, zIndex: 2,
        marker: { enabled: true, radius: 3.5, symbol: 'circle', fillColor: 'rgb(10,10,10)', lineColor: 'rgb(35,89,255)', lineWidth: 2 } },
      { name: 'Baseline (organic)', type: 'line', data: base, color: 'rgb(160,170,185)', dashStyle: 'Dash', lineWidth: 1.5, zIndex: 1, marker: { enabled: false } },
    ],
  }), [method, revMult, ebitdaMult, capturedRev]);

  return (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 340px) 1fr' }}>
        {/* LEFT — valuation model */}
        <div style={{ padding: 22, borderRight: '1px solid rgba(75,85,99,0.3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'rgb(156,163,175)', textTransform: 'uppercase' }}>Estimated value today</div>
            <div className="num" style={{ fontSize: 28, fontWeight: 800, color: 'rgb(229,231,235)', marginTop: 3, letterSpacing: '-0.02em' }}>{fmtM(currentVal)}</div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'rgb(156,163,175)', marginBottom: 6 }}>Valuation method</div>
            <div style={{ display: 'flex', border: '1px solid rgba(75,85,99,0.6)', borderRadius: 10, overflow: 'hidden' }}>
              {[['revenue', 'Revenue multiple'], ['ebitda', 'EBITDA multiple']].map(([k, l]) => (
                <button key={k} onClick={() => setMethod(k)} style={{ flex: 1, height: 34, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: method === k ? 'rgba(168,185,241,0.18)' : 'transparent', color: method === k ? 'rgb(168,185,241)' : 'rgb(156,163,175)' }}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgb(156,163,175)' }}>
              <span>{method === 'revenue' ? 'Revenue multiple' : 'EBITDA multiple'}</span>
              <span className="num" style={{ color: 'rgb(168,185,241)', fontWeight: 700 }}>{(method === 'revenue' ? revMult : ebitdaMult).toFixed(1)}x</span>
            </div>
            {method === 'revenue'
              ? <input type="range" min="2" max="5" step="0.1" value={revMult} onChange={e => setRevMult(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'rgb(168,185,241)', marginTop: 6 }} />
              : <input type="range" min="5" max="12" step="0.5" value={ebitdaMult} onChange={e => setEbitdaMult(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'rgb(168,185,241)', marginTop: 6 }} />}
          </div>

          <div style={{ borderTop: '1px solid rgba(75,85,99,0.3)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgb(107,114,128)', textTransform: 'uppercase', marginBottom: 2 }}>How we estimate value</div>
            <ValRow l="AUM under management" r="$734M" />
            <ValRow l="Blended advisory fee" r="0.86%" />
            <ValRow l="Advisory revenue" r={fmtM(VAL_ADVISORY)} muted />
            <ValRow l="Planning · tax · estate" r={fmtM(VAL_OTHER_REV)} muted />
            <ValRow l="Recurring revenue" r={fmtM(VAL_BASE_REV)} bold />
            <ValRow l="+ Captured pipeline" r={'+' + fmtM(capturedRev)} accent />
            {method === 'ebitda' && <ValRow l="EBITDA margin" r="32%" muted />}
            <ValRow l="Projected revenue" r={fmtM(projRev)} bold />
            <ValRow l={method === 'revenue' ? '× Revenue multiple' : '× EBITDA multiple'} r={(method === 'revenue' ? revMult : ebitdaMult).toFixed(1) + 'x'} muted />
          </div>
        </div>

        {/* RIGHT — value-at-full-pipeline tile + chart */}
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(168,185,241,0.35)', background: 'rgba(168,185,241,0.06)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'rgb(168,185,241)', textTransform: 'uppercase', fontWeight: 600 }}>Value at full pipeline</div>
                <div className="num" style={{ fontSize: 28, fontWeight: 800, color: 'rgb(168,185,241)', marginTop: 8, marginBottom: 8, letterSpacing: '-0.02em' }}>{fmtM(projVal)}</div>
                <div style={{ fontSize: 11.5, color: 'rgb(156,163,175)' }}>+{fmtM(delta)} created by capturing your full pipeline</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgb(168,185,241)', background: 'rgba(168,185,241,0.15)', border: '1px solid rgba(168,185,241,0.3)', borderRadius: 9999, padding: '2px 8px' }}>↑ {pct.toFixed(0)}%</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ fontSize: 11.5, color: 'rgb(156,163,175)', textAlign: 'right' }}>Pipeline captured <span className="num" style={{ color: 'rgb(168,185,241)', fontWeight: 700 }}>+{fmtM(capturedRev)}</span> · {totalOpps} opps</div>
                  <button onClick={goOpps} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 8, background: 'rgba(168,185,241,0.18)', border: '1px solid rgba(168,185,241,0.4)', color: 'rgb(168,185,241)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>View opportunities <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} /></button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(229,231,235)' }}>Projected enterprise value · next 18 months</div>
              <div style={{ fontSize: 11, color: 'rgb(156,163,175)', marginTop: 2 }}>Shaded band = value from capturing your full pipeline</div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'rgb(156,163,175)', flexShrink: 0, paddingTop: 2 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, borderTop: '2px solid rgb(35,89,255)' }} />With opportunities</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, borderTop: '2px dashed rgb(160,170,185)' }} />Baseline</span>
            </div>
          </div>
          <div style={{ height: 290, marginTop: 4 }}><HC options={opts} /></div>
        </div>
      </div>
    </Card>
  );
}

/* ===== Acquirer firm profile modal =====
   Full-screen centered overlay modeled on the user's "What's Your RIA Worth?"
   sample: branded top bar, hero headline + media, "what they do" feature grid,
   and a green "Share My Data" CTA that flips to a confirmation. */
function FirmProfileModal({ firm, onClose }) {
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => { if (firm) setSent(false); }, [firm]);
  React.useEffect(() => {
    if (!firm) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [firm, onClose]);
  if (!firm) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(6,12,22,0.72)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '40px 20px', overflowY: 'auto', animation: 'fadeIn 200ms ease-out',
    }} className="scroll-thin">
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(960px, 100%)', background: 'rgb(15,23,38)',
        border: '1px solid rgba(75,85,99,0.5)', borderRadius: 24,
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        {/* Top bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(75,85,99,0.35)', background: 'rgba(15,23,38,0.92)', backdropFilter: 'blur(8px)' }}>
          <div style={{ height: 30, padding: '0 6px', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(75,85,99,0.4)' }}>
            <div style={{ width: 92, height: 24, display: 'flex', alignItems: 'center' }}><Logo name={firm.logo} /></div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 8, background: 'transparent', border: 'none', color: 'rgb(156,163,175)', cursor: 'pointer', fontSize: 20 }}><i className="fa-solid fa-xmark" /></button>
        </div>

        <div style={{ padding: '40px 56px 48px' }}>
          {/* Hero */}
          <h2 style={{ margin: 0, textAlign: 'center', fontSize: 46, fontWeight: 800, color: 'rgb(249,250,251)', letterSpacing: '-0.025em', lineHeight: 1.05 }}>{firm.headline}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 16, overflow: 'hidden', marginTop: 32, border: '1px solid rgba(75,85,99,0.4)' }}>
            <div style={{ background: 'rgb(20,28,44)', display: 'flex', alignItems: 'flex-end', padding: 28, minHeight: 300 }}>
              <div style={{ width: 200, maxWidth: '100%' }}><Logo name={firm.logo} /></div>
            </div>
            <image-slot
              id={`firm-hero-${firm.logo}`}
              shape="rect"
              fit="cover"
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
              placeholder="Drop firm photo / video thumbnail"
              style={{ width: '100%', height: '100%', minHeight: '300px', display: 'block' }}
            ></image-slot>
          </div>

          <p style={{ textAlign: 'center', maxWidth: 660, margin: '28px auto 0', fontSize: 17, lineHeight: 1.6, color: 'rgb(156,163,175)' }}>{firm.tagline}</p>

          {/* Offer summary */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(168,185,241,0.35)', background: 'rgba(168,185,241,0.08)' }}>
              <span style={{ fontSize: 12, color: 'rgb(156,163,175)' }}>Estimated offer for Alpine Partners</span>
              <span className="num" style={{ fontSize: 20, fontWeight: 800, color: 'rgb(168,185,241)', letterSpacing: '-0.01em' }}>{firm.val}</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(75,85,99,0.5)', background: 'rgba(255,255,255,0.02)', fontSize: 12.5, color: 'rgb(209,213,219)' }}>{firm.basis}</div>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 36 }}>
            {firm.features.map((f, i) => (
              <div key={i} style={{ borderRadius: 14, border: '1px solid rgba(75,85,99,0.4)', background: 'rgba(255,255,255,0.025)', padding: 22 }}>
                <div style={{ fontSize: 16.5, fontWeight: 700, color: 'rgb(249,250,251)', letterSpacing: '-0.01em', marginBottom: 12 }}>{f.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgb(156,163,175)' }}>{f.b}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 28, borderRadius: 20, border: `1px solid ${sent ? 'rgba(168,185,241,0.45)' : 'rgba(168,185,241,0.3)'}`, background: 'rgba(35,89,255,0.1)', padding: '44px 32px', textAlign: 'center' }}>
            {sent ? (
              <React.Fragment>
                <div style={{ width: 64, height: 64, borderRadius: 9999, margin: '0 auto 18px', background: 'rgba(168,185,241,0.18)', border: '1px solid rgba(168,185,241,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-check" style={{ fontSize: 26, color: 'rgb(168,185,241)' }} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'rgb(249,250,251)', letterSpacing: '-0.02em' }}>Your data is on its way to {firm.name}</div>
                <p style={{ maxWidth: 560, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6, color: 'rgb(156,163,175)' }}>We securely shared Alpine Partners' financials, book composition, and growth metrics with {firm.name}. Their team will follow up within 2 business days with a formal valuation.</p>
                <button onClick={onClose} style={{ marginTop: 24, height: 46, padding: '0 28px', borderRadius: 9999, background: 'transparent', border: '1px solid rgba(75,85,99,0.6)', color: 'rgb(229,231,235)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Done</button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'rgb(249,250,251)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{firm.ctaHeadline}</div>
                <p style={{ maxWidth: 600, margin: '14px auto 0', fontSize: 15, lineHeight: 1.6, color: 'rgb(156,163,175)' }}>{firm.ctaBody}</p>
                <button onClick={() => setSent(true)} style={{ marginTop: 28, height: 50, padding: '0 36px', borderRadius: 9999, background: 'rgb(35,89,255)', border: '1px solid rgb(35,89,255)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px -6px rgba(35,89,255,0.6)' }}>Share My Data</button>
                <div style={{ marginTop: 14, fontSize: 11.5, color: 'rgb(107,114,128)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><i className="fa-solid fa-lock" style={{ fontSize: 10 }} />Bank-level encryption · you control what's shared</div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ValuationPage = ValuationPage;
