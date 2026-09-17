/* Opportunities page */

const OPP_CATEGORIES = [
  { name: 'Investments',     val: '$1.5M', n: 45, color: 'rgb(168,185,241)' },
  { name: 'Annuity',         val: '$0.8M', n: 18, color: 'rgb(245,200,90)' },
  { name: 'Life Insurance',  val: '$1.2M', n: 9,  color: 'rgb(180,150,235)' },
  { name: 'Trust & Estate',  val: '$0.9M', n: 12, color: 'rgb(120,160,230)' },
  { name: 'Tax Overlay',     val: '$0.7M', n: 8,  color: 'rgb(240,140,120)' },
  { name: 'Credit & Lending',val: '$1.1M', n: 23, color: 'rgb(248,113,113)' },
  { name: 'Healthcare',      val: '$0.6M', n: 14, color: 'rgb(120,200,210)' },
];

const OPPS = [
  { client:'David Young', email:'david.y@example.com', oppType:'Investments', oppColor:'green', detail:'Portfolio Enhancement', desc:'Asset Allocation Rebalancing', value:'$1,250,000', amt:'$12,500', date:'Apr 30, 2025', tag:'New', color:'green' },
  { client:'David Young', email:'davidy@example.com',  oppType:'Investments', oppColor:'green', detail:'Portfolio Enhancement', desc:'Implementing APME for 15% of fixed income allocation', value:'$1,250,000', amt:'$12,500', date:'Apr 30, 2025', color:'green' },
  { client:'Sarah Lawson',email:'sarah.l@example.com', oppType:'Life Insurance', oppColor:'purple', detail:'High Premium Policy', desc:'Current whole life policy has excessive premiums, recommended termconversion', value:'$2,300,000', amt:'$180,000', date:'Apr 29, 2025', color:'teal' },
  { client:'Thomas Wilson',email:'t.wilson@example.com', oppType:'Trust & Estate', oppColor:'blue', detail:'Outdated Estate Plan', desc:'Estate plan created pre-2018 tax law changes, needs significant updates', value:'$3,750,000', amt:'$340,000', date:'Apr 28, 2025', color:'gray' },
  { client:'Maria Davis', email:'maria.d@example.com', oppType:'Annuity', oppColor:'amber', detail:'High-Fee Product', desc:'Variable annuity with 3.2% annual fees, recommend replacement with modern low-fee option', value:'$1,850,000', amt:'$145,000', date:'Apr 26, 2025', color:'coral' },
  { client:'James Chen',  email:'james.c@example.com', oppType:'Healthcare', oppColor:'teal', detail:'Missing LTC Coverage', desc:'No long-term care coverage, high net worth exposure to healthcare costs', value:'$920,000', amt:'$75,000', date:'Apr 25, 2025', color:'blue' },
  { client:'Patricia Kim',email:'p.kim@example.com',   oppType:'Tax Overlay', oppColor:'coral', detail:'Tax Loss Harvesting', desc:'$95,000 in unrealized losses that could offset capital gains taxes', value:'$1,450,000', amt:'$110,000', date:'Apr 24, 2025', color:'amber' },
  { client:'Amanda Wright',email:'a.wright@example.com',oppType:'Investments', oppColor:'green', detail:'Held-Away Assets', desc:'$1.2M in high-fee managed accounts (1.75%) at competitor firm', value:'$3,250,000', amt:'$290,000', date:'Apr 21, 2025', color:'amber' },
];

const ADVISOR_DASHBOARD_URL = 'https://claude.ai/design/p/019dd9df-a96b-72a7-a818-1e05047939be?file=Advisor+Dashboard.html';

const OPP_ADVISORS = [
  { name: 'Sarah Berry',     color: 'green' },
  { name: 'Nick James',      color: 'blue' },
  { name: 'Frank Smith',     color: 'purple' },
  { name: 'Robert Sullivan', color: 'coral' },
  { name: 'Karen Manning',   color: 'amber' },
];

function oppFirst(name) { return String(name).split(' ')[0]; }
function genAssignMsg(advisorName, opp) {
  if (!opp) return '';
  const f = oppFirst(advisorName);
  return `Hi ${f},\n\nI'm routing this ${opp.oppType} opportunity for ${opp.client} to you — ${opp.detail}.\n\nWhy it's a fit for you: it adds an estimated ${opp.amt} in recurring revenue to your book, deepens the ${opp.client} relationship, and lifts your conversion rate and quarterly goal numbers. Full context is in the opportunity record.\n\nWant me to set up a quick handoff call?`;
}

const drwPrimary = () => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 38, padding: '0 16px', borderRadius: 9, background: 'rgb(35,89,255)', border: '1px solid rgb(35,89,255)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' });
const drwGhost = () => ({ height: 38, padding: '0 16px', borderRadius: 9, background: 'transparent', border: '1px solid rgba(75,85,99,0.6)', color: 'rgb(209,213,219)', fontSize: 13, fontWeight: 500, cursor: 'pointer' });

/* Slide-out assignment flow: pick an advisor, review the hand-off message
   (framed around how it helps the advisor), send, then a confirmation. */
function OppAssignDrawer({ open, opp, current, onClose, onSend }) {
  const [adv, setAdv] = React.useState(OPP_ADVISORS[0].name);
  const [msg, setMsg] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setAdv((current && current !== 'Unassigned') ? current : OPP_ADVISORS[0].name);
      setTouched(false);
      setSent(false);
    }
  }, [open, opp]);

  React.useEffect(() => { if (!touched) setMsg(genAssignMsg(adv, opp)); }, [adv, opp, touched]);

  const advObj = OPP_ADVISORS.find(a => a.name === adv) || OPP_ADVISORS[0];
  const footer = !opp ? null : (sent
    ? <button onClick={onClose} style={drwPrimary()}>Done</button>
    : (
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={drwGhost()}>Cancel</button>
        <button onClick={() => { onSend(adv); setSent(true); }} style={{ ...drwPrimary(), flex: 1 }}>
          <i className="fa-solid fa-paper-plane" style={{ fontSize: 11 }} /> Send to {oppFirst(adv)}
        </button>
      </div>
    ));

  return (
    <DrawerShell open={open} onClose={onClose}
      title={sent ? 'Opportunity assigned' : 'Assign opportunity'}
      subtitle={opp ? `${opp.oppType} · ${opp.client}` : ''}
      width="min(520px, 94vw)" footer={footer}>
      {!opp ? null : sent ? (
        <div style={{ textAlign: 'center', padding: '32px 8px' }}>
          <div style={{ width: 60, height: 60, borderRadius: 9999, margin: '0 auto 16px', background: 'rgba(168,185,241,0.15)', border: '1px solid rgba(168,185,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-check" style={{ fontSize: 24, color: 'rgb(168,185,241)' }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'rgb(249,250,251)' }}>Sent to {adv}</div>
          <div style={{ fontSize: 12.5, color: 'rgb(156,163,175)', marginTop: 6, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
            {adv} has been notified about the {opp.oppType} opportunity for {opp.client}, and your hand-off note is in their inbox.
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(75,85,99,0.5)', background: 'rgba(255,255,255,0.03)' }}>
            <Avatar initials={advObj.name.split(' ').map(s => s[0]).join('')} size={26} color={advObj.color} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgb(229,231,235)' }}>{adv}</div>
              <div style={{ fontSize: 11, color: 'rgb(168,185,241)' }}>{opp.amt} est. revenue</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ border: '1px solid rgba(75,85,99,0.4)', borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <Badge color={opp.oppColor}>◉ {opp.oppType}</Badge>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgb(229,231,235)', marginTop: 8 }}>{opp.detail}</div>
                <div style={{ fontSize: 12, color: 'rgb(156,163,175)', marginTop: 4, maxWidth: 300 }}>{opp.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.06em', color: 'rgb(156,163,175)', textTransform: 'uppercase' }}>Est. revenue</div>
                <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'rgb(168,185,241)' }}>{opp.amt}</div>
                <div style={{ fontSize: 11, color: 'rgb(107,114,128)' }}>{opp.client}</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgb(209,213,219)', marginBottom: 8 }}>Choose an advisor</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {OPP_ADVISORS.map(a => {
                const on = a.name === adv;
                return (
                  <button key={a.name} onClick={() => setAdv(a.name)} style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    border: `1px solid ${on ? 'rgba(168,185,241,0.5)' : 'rgba(75,85,99,0.5)'}`,
                    background: on ? 'rgba(168,185,241,0.1)' : 'rgba(255,255,255,0.02)',
                  }}>
                    <Avatar initials={a.name.split(' ').map(s => s[0]).join('')} size={28} color={a.color} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgb(229,231,235)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                    {on && <i className="fa-solid fa-circle-check" style={{ fontSize: 14, color: 'rgb(168,185,241)' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgb(209,213,219)' }}>Message to {oppFirst(adv)}</div>
              <span style={{ fontSize: 11, color: 'rgb(107,114,128)' }}>Editable</span>
            </div>
            <textarea value={msg} onChange={e => { setTouched(true); setMsg(e.target.value); }} rows={7} style={{
              width: '100%', resize: 'vertical', borderRadius: 10, padding: '12px 14px', fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.5,
              color: 'rgb(229,231,235)', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(75,85,99,0.5)', boxSizing: 'border-box',
            }} />
            {touched && <button onClick={() => setTouched(false)} style={{ marginTop: 6, background: 'transparent', border: 'none', color: 'rgb(168,185,241)', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Reset to suggested message</button>}
          </div>
        </div>
      )}
    </DrawerShell>
  );
}

function navigateToDavidYoung(fromPage) {
  try {
    localStorage.setItem('firm.cd.from', fromPage);
    if (fromPage === 'opportunities') {
      localStorage.setItem('firm.cd.highlight', 'rebalance');
    }
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('firm:navigate', { detail: { page: 'client-detail' } }));
}

function OpportunitiesPage() {
  const [page, setPage] = React.useState(1);
  const [assign, setAssign] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('firm.opps.assign')) || {}; } catch (e) { return {}; }
  });
  const [assigning, setAssigning] = React.useState(null);
  React.useEffect(() => {
    try { localStorage.setItem('firm.opps.assign', JSON.stringify(assign)); } catch (e) {}
  }, [assign]);

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 12, marginBottom: 16 }}>
        {OPP_CATEGORIES.map((c, i) => (
          <div key={c.name} className="glass-card" style={{ padding: 14, borderTop: `2px solid ${c.color}` }}>
            <div style={{ fontSize: 12, color: 'rgb(209,213,219)', fontWeight: 500 }}>{c.name}</div>
            <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'rgb(249,250,251)', marginTop: 4 }}>{c.val}</div>
            <div style={{ fontSize: 11, color: 'rgb(156,163,175)', marginTop: 2 }}>{c.n} Opportunities</div>
          </div>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <SortHeader label="CLIENT" sortKey="client" sort={{}} />
                <SortHeader label="OPPORTUNITY" sortKey="opp" sort={{}} />
                <SortHeader label="DETAILS" sortKey="detail" sort={{}} />
                <SortHeader label="VALUE" sortKey="value" sort={{}} align="right" />
                <SortHeader label="OPPORTUNITY AMOUNT" sortKey="amt" sort={{}} align="right" />
                <SortHeader label="LAST UPDATED" sortKey="date" sort={{}} />
                <SortHeader label="ACTION" sortKey="action" sort={{}} />
              </tr>
            </thead>
            <tbody>
              {OPPS.map((o, i) => {
                const isDavid = o.client === 'David Young';
                return (
                <tr key={i} className="row-hover"
                  onClick={isDavid ? () => navigateToDavidYoung('opportunities') : undefined}
                  style={{
                    borderBottom:'1px solid rgba(75,85,99,0.2)',
                    cursor: isDavid ? 'pointer' : 'default',
                  }}>
                  <td style={td()}>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <Avatar initials={o.client.split(' ').map(s=>s[0]).join('')} size={32} color={o.color} />
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color:'rgb(229,231,235)' }}>{o.client}</div>
                          {o.tag && <span style={{ fontSize: 9.5, fontWeight: 700, color:'#fff', background:'rgb(220,38,38)', padding:'1px 6px', borderRadius: 4, letterSpacing:'0.04em' }}>{o.tag}</span>}
                        </div>
                        <div style={{ fontSize: 11, color:'rgb(107,114,128)' }}>{o.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td()}><Badge color={o.oppColor}>◉ {o.oppType}</Badge></td>
                  <td style={td()}>
                    <Badge color="gray">{o.detail}</Badge>
                    <div style={{ fontSize: 11.5, color:'rgb(156,163,175)', marginTop: 4, maxWidth: 260 }}>{o.desc}</div>
                  </td>
                  <td style={td('right','num')}><span style={{ fontWeight: 600 }}>{o.value}</span></td>
                  <td style={td('right','num')}><span style={{ fontWeight: 600, color:'rgb(168,185,241)' }}>{o.amt}</span></td>
                  <td style={td()}><span style={{ color:'rgb(156,163,175)', fontSize: 12 }}>{o.date}</span></td>
                  <td style={td()}>
                    {(() => {
                      const an = assign[i] && assign[i] !== 'Unassigned' ? assign[i] : null;
                      const ao = an ? OPP_ADVISORS.find(x => x.name === an) : null;
                      if (an) return (
                        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap: 7, height: 28, padding:'0 10px 0 6px', borderRadius: 9999, border:'1px solid rgba(75,85,99,0.6)', background:'rgba(255,255,255,0.03)' }}>
                            <Avatar initials={an.split(' ').map(s=>s[0]).join('')} size={18} color={ao ? ao.color : 'gray'} />
                            <span style={{ fontSize: 11.5, fontWeight: 500, color:'rgb(229,231,235)' }}>{an}</span>
                          </span>
                          <button onClick={e => { e.stopPropagation(); setAssigning(i); }} style={{ height: 28, padding:'0 10px', borderRadius: 6, background:'transparent', border:'1px solid rgba(75,85,99,0.5)', color:'rgb(156,163,175)', fontSize: 11, fontWeight: 500, cursor:'pointer' }}>Reassign</button>
                        </div>
                      );
                      return (
                        <div style={{ display:'flex', gap: 6 }}>
                          <button onClick={e => { e.stopPropagation(); setAssigning(i); }} style={{ height: 28, padding: '0 14px', borderRadius: 6, background:'rgba(168,185,241,0.18)', border:'1px solid rgba(168,185,241,0.4)', color:'rgb(168,185,241)', fontSize: 11.5, fontWeight: 600, cursor:'pointer' }}>Assign</button>
                          <button onClick={e => e.stopPropagation()} style={{ height: 28, padding: '0 12px', borderRadius: 6, background:'transparent', border:'1px solid rgba(75,85,99,0.5)', color:'rgb(209,213,219)', fontSize: 11.5, fontWeight: 500, cursor:'pointer' }}>Dismiss</button>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px' }}>
          <div style={{ fontSize: 12, color:'rgb(156,163,175)' }}>Showing 1 to 8 of 24 entries</div>
          <div style={{ display:'flex', gap: 4 }}>
            <button style={pgBtn(false)}>Previous</button>
            {[1,2,3].map(p => <button key={p} onClick={() => setPage(p)} style={pgBtn(page === p)}>{p}</button>)}
            <button style={pgBtn(false)}>Next</button>
          </div>
        </div>
      </Card>

      <OppAssignDrawer
        open={assigning !== null}
        opp={assigning !== null ? OPPS[assigning] : null}
        current={assigning !== null ? assign[assigning] : null}
        onClose={() => setAssigning(null)}
        onSend={(adv) => setAssign(a => ({ ...a, [assigning]: adv }))}
      />
    </div>
  );
}

const pgBtn = (active) => ({
  height: 28, minWidth: 28, padding: '0 10px', borderRadius: 6,
  background: active ? 'rgba(168,185,241,0.18)' : 'transparent',
  border: '1px solid ' + (active ? 'rgba(168,185,241,0.4)' : 'rgba(75,85,99,0.5)'),
  color: active ? 'rgb(168,185,241)' : 'rgb(209,213,219)',
  fontSize: 12, fontWeight: 500, cursor: 'pointer',
});

window.OpportunitiesPage = OpportunitiesPage;
