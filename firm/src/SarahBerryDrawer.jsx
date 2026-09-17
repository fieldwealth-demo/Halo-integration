/* Advisor detail slide-out — Wealth Advisor Report (WAR)
   A firm-manager scorecard for a single advisor: book of business, goal
   attainment, compensation, client & service metrics, and forward targets.
   Listens for window 'firm:openSarah' event, slides in from the right.
   Press Esc, click X, or click backdrop to close. */

(function() {
  const GREEN_DEEP = 'rgb(35,89,255)';
  const GREEN = 'rgb(84,121,240)';
  const GREEN_SOFT = 'rgb(168,185,241)';
  const AMBER = 'rgb(245,200,90)';
  const RED = 'rgb(248,113,113)';
  const PANEL_BG = 'rgb(17,24,39)';
  const BORDER = '1px solid rgba(75,85,99,0.4)';
  const MUTED = 'rgb(156,163,175)';
  const DIM = 'rgb(107,114,128)';
  const INK = 'rgb(249,250,251)';
  const HEAD_LABEL = { fontSize: 11, color: MUTED, fontWeight: 500 };
  const HEAD_VAL = { fontSize: 18, fontWeight: 700, color: INK, marginTop: 4, fontFamily: 'inherit' };

  function Tile({ label, value, sub, valueColor, subColor }) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', border: BORDER, borderRadius: 10, padding: '12px 14px', minWidth: 0 }}>
        <div style={HEAD_LABEL}>{label}</div>
        <div className="num" style={{ ...HEAD_VAL, color: valueColor || HEAD_VAL.color }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: subColor || MUTED, marginTop: 2 }}>{sub}</div>}
      </div>
    );
  }

  function ImpactCell({ value, label, color }) {
    return (
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <div className="num" style={{ fontSize: 22, fontWeight: 700, color: color || GREEN_SOFT, letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{label}</div>
      </div>
    );
  }

  function Pill({ children, color }) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11, fontWeight: 500, color: color || 'rgb(209,213,219)',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(75,85,99,0.5)',
        borderRadius: 9999, padding: '3px 9px', whiteSpace: 'nowrap',
      }}>{children}</span>
    );
  }

  function Section({ title, action, children, style }) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.025)', border: BORDER, borderRadius: 12, padding: 16, ...style }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(229,231,235)' }}>{title}</div>
          {action || null}
        </div>
        {children}
      </div>
    );
  }

  /* Goal-attainment bar: actual vs goal with a 100% target tick + status pill. */
  function AttainmentBar({ label, actual, goal, pct, status }) {
    const above = status === 'above';
    const accent = above ? GREEN_SOFT : AMBER;
    const fill = Math.min(pct, 118);
    const tick = (100 / 118) * 100; // 100% marker position within a 0–118% track
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 12.5, color: 'rgb(229,231,235)', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
              <span className="num" style={{ color: INK, fontWeight: 600 }}>{actual}</span>
              <span style={{ margin: '0 5px', color: DIM }}>/</span>
              <span className="num">{goal} goal</span>
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 600, color: accent,
            background: above ? 'rgba(35,89,255,0.12)' : 'rgba(245,200,90,0.12)',
            border: `1px solid ${above ? 'rgba(84,121,240,0.35)' : 'rgba(245,200,90,0.35)'}`,
            borderRadius: 9999, padding: '3px 9px', whiteSpace: 'nowrap',
          }}>
            <i className={above ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'} style={{ fontSize: 9 }} />
            <span className="num">{pct}%</span> {above ? 'Above goal' : 'Below goal'}
          </span>
        </div>
        <div style={{ position: 'relative', height: 10, background: 'rgba(75,85,99,0.35)', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ width: `${(fill / 118) * 100}%`, height: '100%', background: accent, borderRadius: 9999 }} />
        </div>
        <div style={{ position: 'relative', height: 0 }}>
          <span style={{ position: 'absolute', left: `${tick}%`, top: -10, width: 1, height: 10, background: 'rgba(255,255,255,0.55)' }} />
          <span style={{ position: 'absolute', left: `${tick}%`, top: 2, transform: 'translateX(-50%)', fontSize: 9, color: DIM }}>100%</span>
        </div>
      </div>
    );
  }

  /* Composition / adoption bar: label, count, %, fill. */
  function MetricBar({ label, sublabel, count, pct, color }) {
    return (
      <div style={{ marginBottom: 11 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style={{ fontSize: 12, color: 'rgb(229,231,235)' }}>
            {label}{sublabel && <span style={{ color: DIM, marginLeft: 6, fontSize: 11 }}>{sublabel}</span>}
          </div>
          <div style={{ fontSize: 11.5, color: MUTED }}>
            <span className="num" style={{ color: INK, fontWeight: 600 }}>{count}</span>
            <span className="num" style={{ marginLeft: 8, color: MUTED }}>{pct}%</span>
          </div>
        </div>
        <div style={{ height: 6, background: 'rgba(75,85,99,0.35)', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 9999 }} />
        </div>
      </div>
    );
  }

  function GoalRow({ name, color, pct, val, valPct }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 70px', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgb(229,231,235)' }}>
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: color, display: 'inline-block' }} />
          {name}
        </div>
        <div style={{ height: 8, background: 'rgba(75,85,99,0.35)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="num" style={{ fontSize: 12, fontWeight: 600, color: 'rgb(229,231,235)' }}>{val}</div>
          <div style={{ fontSize: 10, color: DIM }}>{valPct}</div>
        </div>
      </div>
    );
  }

  /* Forward-target chip: label + target value, optional progress note. */
  function TargetCell({ label, value, note }) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(75,85,99,0.35)', borderRadius: 10, padding: '11px 12px' }}>
        <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.35 }}>{label}</div>
        <div className="num" style={{ fontSize: 17, fontWeight: 700, color: INK, marginTop: 5 }}>{value}</div>
        {note && <div style={{ fontSize: 10.5, color: GREEN_SOFT, marginTop: 3 }}>{note}</div>}
      </div>
    );
  }

  /* Performance chart — Highcharts via the shared HC wrapper so it picks up
     the canonical Field theme (Inter type, green primary, dark gridlines). */
  function PerfChart() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenue = [28, 31, 30, 33, 35, 32, 36, 34, 38, 40, 42, 44];
    const goalLine = [30, 30, 32, 32, 34, 34, 36, 36, 38, 38, 40, 40];
    const opts = React.useMemo(() => ({
      chart: { type: 'area', height: 200, spacing: [8, 8, 4, 4], backgroundColor: 'transparent' },
      xAxis: { categories: months, tickLength: 0, labels: { style: { fontSize: '10px' } } },
      yAxis: { min: 0, max: 60, tickAmount: 4 },
      tooltip: { shared: true, valuePrefix: '$', valueSuffix: 'K' },
      legend: { enabled: true, align: 'right', verticalAlign: 'top', symbolRadius: 2 },
      plotOptions: {
        area: {
          fillOpacity: 0.18, lineWidth: 2,
          marker: { enabled: true, radius: 3, symbol: 'circle', lineWidth: 1.5, lineColor: PANEL_BG },
        },
        spline: { dashStyle: 'Dash', marker: { enabled: false }, lineWidth: 1.6 },
      },
      series: [
        { name: 'Revenue', type: 'area', data: revenue, color: 'rgb(35,89,255)' },
        { name: 'Goal',    type: 'spline', data: goalLine, color: 'rgb(229,231,235)' },
      ],
    }), []);
    return (
      <div style={{ background: 'rgba(255,255,255,0.02)', border: BORDER, borderRadius: 10, padding: 12, marginTop: 12 }}>
        <div style={{ height: 200 }}>
          <HC options={opts} />
        </div>
      </div>
    );
  }

  function SarahBerryDrawer() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const handler = () => setOpen(true);
      window.addEventListener('firm:openSarah', handler);
      return () => window.removeEventListener('firm:openSarah', handler);
    }, []);

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
      <React.Fragment>
        {/* Backdrop */}
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 240ms ease',
          zIndex: 80,
        }} />

        {/* Drawer */}
        <aside style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(660px, 94vw)',
          background: PANEL_BG,
          borderLeft: '1px solid rgba(75,85,99,0.5)',
          boxShadow: '-30px 0 60px -10px rgba(0,0,0,0.65)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 81,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, ui-sans-serif, system-ui',
        }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: BORDER, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 9999, flexShrink: 0,
              background: 'linear-gradient(135deg, rgb(245,205,180), rgb(220,170,140))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: 'rgb(60,40,30)',
              border: '2px solid rgba(255,255,255,0.1)',
            }}>SB</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: INK, letterSpacing: '-0.01em' }}>Sarah Berry</div>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Wealth Advisor · Alpine Partners</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
                <Pill color={GREEN_SOFT}><i className="fa-solid fa-people-group" style={{ fontSize: 9 }} /> Team TCB</Pill>
                <Pill><i className="fa-solid fa-landmark-dome" style={{ fontSize: 9 }} /> 2 Committees</Pill>
                <Pill><i className="fa-solid fa-calendar" style={{ fontSize: 9 }} /> Since 2019</Pill>
              </div>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 12, color: GREEN_SOFT, textDecoration: 'none', marginTop: 9, display: 'inline-block' }}>View as Sarah</a>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{
              width: 32, height: 32, borderRadius: 7,
              background: 'transparent', border: 'none', color: MUTED,
              cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Body — scrollable */}
          <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Firm-share headline tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <Tile label="Assets Serviced" value="$56.0M" sub="Book of business" />
              <Tile label="% of Firm Assets" value="10.5%" sub="of $532M" />
              <Tile label="Revenue Serviced" value="$420K" sub="Trailing 12mo" />
              <Tile label="% of Firm Revenue" value="6.2%" sub="of $6.8M" valueColor={GREEN_SOFT} />
            </div>

            {/* Book of Business */}
            <Section title="Book of Business">
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11.5, color: MUTED }}>Assets by type</div>
                <div className="num" style={{ fontSize: 12, color: MUTED }}><span style={{ color: INK, fontWeight: 600 }}>$56.0M</span> serviced</div>
              </div>
              <div style={{ display: 'flex', height: 12, borderRadius: 9999, overflow: 'hidden', background: 'rgba(75,85,99,0.3)', marginBottom: 8 }}>
                <div style={{ flexGrow: 92, background: GREEN_DEEP }} />
                <div style={{ flexGrow: 8, background: 'rgb(96,165,250)' }} />
              </div>
              <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, color: 'rgb(209,213,219)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: 9999, background: GREEN_DEEP, display: 'inline-block', marginRight: 6 }} />
                  Primary <span className="num" style={{ color: INK, fontWeight: 600 }}>$51.5M</span> <span style={{ color: DIM }}>92%</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'rgb(209,213,219)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: 9999, background: 'rgb(96,165,250)', display: 'inline-block', marginRight: 6 }} />
                  Secondary <span className="num" style={{ color: INK, fontWeight: 600 }}>$4.5M</span> <span style={{ color: DIM }}>8%</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <Tile label="Primary Clients" value="54" sub="88%" />
                <Tile label="Shared Clients" value="7" sub="12%" />
                <Tile label="Clients Serviced" value="61" sub="100%" />
              </div>
            </Section>

            {/* 2025 Goal Attainment */}
            <Section title="2025 Goal Attainment">
              <AttainmentBar label="New Primary Assets" actual="$7.5M" goal="$7.2M" pct={104} status="above" />
              <AttainmentBar label="New Primary Revenue" actual="$47K" goal="$50K" pct={94} status="below" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 2 }}>
                <Tile label="New Total Assets" value="$7.5M" sub="↑ vs $7.2M goal" subColor={GREEN_SOFT} />
                <Tile label="New Total Revenue" value="$47K" sub="↓ vs $50K goal" subColor={AMBER} />
                <Tile label="Asset Growth" value="+13%" sub="YoY book" subColor={GREEN_SOFT} />
              </div>
            </Section>

            {/* Compensation */}
            <Section title="Compensation"
              action={<span style={{ fontSize: 10.5, color: DIM, display: 'flex', alignItems: 'center', gap: 5 }}><i className="fa-solid fa-lock" style={{ fontSize: 9 }} /> Manager view</span>}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
                <Tile label="2025 Total Comp" value="$221K" sub="↓ 7% YoY" subColor={AMBER} />
                <Tile label="2025 Base" value="$185K" />
                <Tile label="Bonuses Paid" value="$36K" sub="Mid-yr + YE" />
                <Tile label="Comp / Revenue" value="53%" sub="Payout ratio" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(75,85,99,0.35)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { l: '2024 FY Comp', v: '$238K' },
                  { l: '2025 FY Comp', v: '$221K' },
                  { l: '2026 New Base', v: '$185K' },
                ].map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <i className="fa-solid fa-arrow-right" style={{ color: DIM, fontSize: 11 }} />}
                    <div style={{ textAlign: 'center', minWidth: 78 }}>
                      <div style={{ fontSize: 10.5, color: MUTED }}>{c.l}</div>
                      <div className="num" style={{ fontSize: 15, fontWeight: 700, color: INK, marginTop: 3 }}>{c.v}</div>
                    </div>
                  </React.Fragment>
                ))}
                <span style={{ fontSize: 10.5, color: DIM, marginLeft: 'auto' }}>Base flat into 2026 · growth bonus paid post-audit</span>
              </div>
            </Section>

            {/* Client & Service Metrics */}
            <Section title="Client & Service Metrics">
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Clients by tier</div>
              <MetricBar label="Private" sublabel="$0–$3M" count={38} pct={62} color="rgb(96,165,250)" />
              <MetricBar label="HNW" sublabel="$3M–$10M" count={21} pct={34} color="rgb(167,139,250)" />
              <MetricBar label="Family Office" sublabel="$10M+" count={2} pct={3} color={GREEN_SOFT} />
              <div style={{ height: 1, background: 'rgba(75,85,99,0.3)', margin: '14px 0' }} />
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Planning & platform adoption</div>
              <MetricBar label="Financial Plan" count={35} pct={57} color={GREEN_DEEP} />
              <MetricBar label="eMoney" count={30} pct={50} color="rgb(120,160,255)" />
              <MetricBar label="Flourish Cash" count={6} pct={10} color="rgb(250,204,21)" />
              <MetricBar label="Vanilla (Estate)" count={2} pct={3} color="rgb(248,113,113)" />
            </Section>

            {/* Uncaptured Value Potential */}
            <Section title="Uncaptured Value Potential">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                <Tile label="Total Potential Value" value="$4.8M" />
                <Tile label="Estimated Revenue" value="$86K" />
                <Tile label="Open Opportunities" value="14" />
                <Tile label="Priority Accounts" value="8" />
              </div>
              <div style={{ background: 'rgba(35,89,255,0.06)', border: '1px solid rgba(84,121,240,0.25)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>Firm Valuation Impact</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  <ImpactCell value="+$1.2M" label="Current Contribution" />
                  <ImpactCell value="+$340K" label="Pipeline Impact" />
                  <ImpactCell value="5.2x" label="Revenue Multiple" />
                  <ImpactCell value="+$1.8M" label="Potential Increase" />
                </div>
              </div>
            </Section>

            {/* Company Goals Contribution */}
            <Section title="Company Goals Contribution">
              <GoalRow name="Investments"     color="rgb(96,165,250)"  pct={78} val="$6.2M" valPct="18%" />
              <GoalRow name="Annuity"         color="rgb(120,160,255)"  pct={48} val="$1.3M" valPct="22%" />
              <GoalRow name="Life Insurance"  color="rgb(250,204,21)"  pct={36} val="$84K"  valPct="12%" />
              <GoalRow name="Trust & Estate"  color="rgb(167,139,250)" pct={62} val="$440K" valPct="31%" />
              <GoalRow name="Tax Overlay"     color="rgb(248,113,113)" pct={32} val="$165K" valPct="24%" />
              <GoalRow name="Credit & Lending"color="rgb(156,163,175)" pct={14} val="$175K" valPct="8%" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: DIM, marginTop: 6 }}>
                <span>% of firm contribution shown on right</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Goal target <i className="fa-regular fa-circle-question" /></span>
              </div>
            </Section>

            {/* Performance vs Objectives */}
            <Section title="Performance vs Objectives">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <Tile label="YTD Revenue"          value="$428K"  sub="↑ 22% vs Goal"   subColor={GREEN_SOFT} />
                <Tile label="Client Retention"     value="97%"    sub="↑ 3% vs Goal"    subColor={GREEN_SOFT} />
                <Tile label="New Clients"          value="12"     sub="↑ Goal: 10"      subColor={GREEN_SOFT} />
                <Tile label="Recommendations Closed" value="16/24" sub="67% Close Rate" />
              </div>
              <PerfChart />
            </Section>

            {/* 2026 Goals & Targets */}
            <Section title="2026 Goals & Targets">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <TargetCell label="New Primary Assets" value="$8.5M" note="Stretch target" />
                <TargetCell label="New Primary Revenue" value="$54K" />
                <TargetCell label="Clients w/ Plan" value="90%" note="from 57%" />
                <TargetCell label="COI Meetings" value="6" />
                <TargetCell label="New Flourish" value="10%" />
                <TargetCell label="Clients w/ BAA" value="5%" />
                <TargetCell label="New in CBA Models" value="50%" />
                <TargetCell label="Clients in CBA Vault" value="20%" />
              </div>
            </Section>

          </div>
        </aside>
      </React.Fragment>
    );
  }

  window.SarahBerryDrawer = SarahBerryDrawer;
})();
