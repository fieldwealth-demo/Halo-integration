/* Advisors page */

const ADVISORS = [
  { name: 'Sarah Berry',     role: 'PA Advisor',    aum: '$56M',  delta: '+13%', open: 18, openVal:'$8.2M potential', clients: 61, opps: 14, oppsVal:'$86K Estimated Revenue', conv: 72, won: '18 / 25 closed won', color: 'green' },
  { name: 'Nick James',      role: 'PA Advisor',    aum: '$79M',  delta: '+9%',  open: 15, openVal:'$8.4M potential', clients: 55, opps: 12, oppsVal:'$76K Estimated Revenue', conv: 68, won: '15 / 22 closed won', color: 'blue'  },
  { name: 'Frank Smith',     role: 'Firm Owner',    aum: '$92M',  delta: '+5%',  open: 9,  openVal:'$4.2M potential', clients: 52, opps: 8,  oppsVal:'$124K Estimated Revenue', conv: 64, won: '9 / 14 closed won',  color: 'purple' },
  { name: 'Robert Sullivan', role: 'NY Advisor',    aum: '$67M',  delta: '+7%',  open: 11, openVal:'$5.1M potential', clients: 48, opps: 6,  oppsVal:'$56K Estimated Revenue',  conv: 61, won: '11 / 18 closed won', color: 'coral' },
  { name: 'Karen Manning',   role: 'NY Advisor',    aum: '$43M',  delta: '+8%',  open: 8,  openVal:'$3.0M potential', clients: 44, opps: 4,  oppsVal:'$234K Estimated Revenue', conv: 58, won: '7 / 12 closed won',  color: 'amber' },
  { name: 'Robert Smith',    role: 'Market Analyst',aum: '$55M',  delta: '+8%',  open: 9,  openVal:'$4.0M potential', clients: 41, opps: 5,  oppsVal:'$16K Estimated Revenue',  conv: 62, won: '8 / 13 closed won',  color: 'gray' },
  { name: 'Michael Lee',     role: 'Sales Director',aum: '$72M',  delta: '+8%',  open: 10, openVal:'$6.3M potential', clients: 38, opps: 3,  oppsVal:'$76K Estimated Revenue',  conv: 65, won: '9 / 15 closed won',  color: 'teal' },
  { name: 'Sophia Garcia',   role: 'Digital Strategist', aum:'$29M', delta: '+10%',open: 6, openVal:'$2.0M potential', clients: 36, opps: 12, oppsVal:'$5K Estimated Revenue',   conv: 57, won: '5 / 9 closed won',   color: 'purple' },
];

const ADV_OPP_CATS = [
  { name: 'Investments',     color: 'rgb(168,185,241)' },
  { name: 'Annuity',         color: 'rgb(245,200,90)' },
  { name: 'Life Insurance',  color: 'rgb(180,150,235)' },
  { name: 'Trust & Estate',  color: 'rgb(120,160,230)' },
  { name: 'Tax Overlay',     color: 'rgb(240,140,120)' },
  { name: 'Credit & Lending',color: 'rgb(248,113,113)' },
  { name: 'Healthcare',      color: 'rgb(120,200,210)' },
];
const ADV_OPP_STAGES = [
  { key: 'identified',  name: 'Identified',    progress: 12,  color: 'rgb(120,160,230)' },
  { key: 'contacted',   name: 'Contacted',     progress: 38,  color: 'rgb(94,140,210)' },
  { key: 'proposal',    name: 'Proposal sent', progress: 64,  color: 'rgb(245,200,90)' },
  { key: 'negotiation', name: 'Negotiation',   progress: 86,  color: 'rgb(240,140,120)' },
  { key: 'won',         name: 'Won',           progress: 100, color: 'rgb(168,185,241)' },
];
const ADV_OPP_CLIENTS = ['David Young','Edwards','Hawkins','Smith','Watson','Jones','Lang','Conell','Benson','Morrison','Rivera','Patel','Clarke','Simmons'];
const ADV_OPP_VALS = ['$1.2M','$840K','$2.3M','$1.6M','$420K','$980K','$3.1M','$560K','$1.9M','$720K','$1.1M','$2.7M','$310K','$1.4M'];

function distributeCounts(total, ratios) {
  const raw = ratios.map(r => total * r);
  const out = raw.map(Math.floor);
  let rem = total - out.reduce((a, b) => a + b, 0);
  const fr = raw.map((v, i) => ({ i, f: v - out[i] })).sort((a, b) => b.f - a.f);
  for (let k = 0; k < rem; k++) out[fr[k % fr.length].i]++;
  return out;
}

function buildAdvisorPipeline(a) {
  const total = a.opps;
  const counts = distributeCounts(total, [0.30, 0.25, 0.20, 0.15, 0.10]);
  const items = [];
  let idx = 0;
  ADV_OPP_STAGES.forEach((st, si) => {
    for (let k = 0; k < counts[si]; k++) {
      const cat = ADV_OPP_CATS[idx % ADV_OPP_CATS.length];
      items.push({
        client: ADV_OPP_CLIENTS[(idx * 3 + si) % ADV_OPP_CLIENTS.length],
        cat: cat.name, catColor: cat.color,
        value: ADV_OPP_VALS[(idx * 2 + si) % ADV_OPP_VALS.length],
        stage: st,
      });
      idx++;
    }
  });
  return { total, counts, items };
}

function AdvisorOppsDrawer({ open, advisor, onClose }) {
  const data = React.useMemo(() => advisor ? buildAdvisorPipeline(advisor) : { total: 0, counts: [], items: [] }, [advisor]);
  const wonCount = advisor ? data.counts[ADV_OPP_STAGES.length - 1] : 0;
  return (
    <DrawerShell open={open} onClose={onClose}
      title={advisor ? advisor.name : 'Opportunities'}
      subtitle="Opportunities pipeline · progress"
      width="min(560px, 94vw)"
      leading={advisor ? <Avatar initials={advisor.name.split(' ').map(s => s[0]).join('')} size={40} color={advisor.color} /> : null}>
      {!advisor ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { l: 'Open opportunities', v: String(data.total) },
              { l: 'Est. revenue', v: advisor.oppsVal.split(' ')[0] },
              { l: 'Win rate', v: advisor.conv + '%' },
            ].map((s, i) => (
              <div key={i} style={{ border: '1px solid rgba(75,85,99,0.4)', borderRadius: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 11, color: 'rgb(156,163,175)' }}>{s.l}</div>
                <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'rgb(249,250,251)', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid rgba(75,85,99,0.4)', borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(229,231,235)' }}>Pipeline by stage</div>
              <div style={{ fontSize: 11, color: 'rgb(156,163,175)' }}><span className="num" style={{ color: 'rgb(168,185,241)', fontWeight: 700 }}>{wonCount}</span> won</div>
            </div>
            <div style={{ display: 'flex', height: 10, borderRadius: 9999, overflow: 'hidden', background: 'rgba(75,85,99,0.3)', marginBottom: 14 }}>
              {ADV_OPP_STAGES.map((st, i) => (
                <div key={st.key} style={{ flexGrow: data.counts[i] || 0, background: st.color }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ADV_OPP_STAGES.map((st, i) => (
                <div key={st.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 9999, background: st.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'rgb(209,213,219)' }}>{st.name}</span>
                  <span className="num" style={{ color: 'rgb(156,163,175)' }}>{data.counts[i] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(229,231,235)', marginBottom: 10 }}>Opportunities</div>
            {data.items.map((it, i) => (
              <div key={i} style={{ border: '1px solid rgba(75,85,99,0.35)', borderRadius: 10, padding: '10px 12px', marginBottom: 8, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgb(229,231,235)' }}>{it.client}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgb(156,163,175)', marginTop: 3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 9999, background: it.catColor }} />{it.cat}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'inline-block', fontSize: 10.5, fontWeight: 600, color: it.stage.color, background: 'rgba(255,255,255,0.04)', border: `1px solid ${it.stage.color}`, borderRadius: 9999, padding: '2px 9px' }}>{it.stage.name}</span>
                    <div className="num" style={{ fontSize: 12, color: 'rgb(156,163,175)', marginTop: 4 }}>{it.value}</div>
                  </div>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(75,85,99,0.4)', overflow: 'hidden', marginTop: 10 }}>
                  <div style={{ width: `${it.stage.progress}%`, height: '100%', background: it.stage.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DrawerShell>
  );
}

function AdvisorsPage() {
  const [sort, setSort] = React.useState({ key: 'conv', dir: 'desc' });
  const [oppsFor, setOppsFor] = React.useState(null);
  const num = (s) => parseFloat(String(s).replace(/[^0-9.\-]/g, ''));
  const sorted = React.useMemo(() => {
    const arr = [...ADVISORS];
    arr.sort((a,b) => {
      let va = a[sort.key], vb = b[sort.key];
      if (['aum','open','clients','opps','conv'].includes(sort.key)) { va = typeof va === 'string' ? num(va) : va; vb = typeof vb === 'string' ? num(vb) : vb; }
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sort]);

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
        <StatTile label="Total Advisors"  value="15"     sub={<span style={{color:'rgb(168,185,241)'}}>↑ 2 From last quarter</span>} />
        <StatTile label="Total AUM"       value="$532M"  sub={<span style={{color:'rgb(168,185,241)'}}>↑ 13% YTD</span>} />
        <StatTile label="Open Proposals"  value="142"    sub="$24.6M potential AUM" />
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid rgba(75,85,99,0.3)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color:'rgb(249,250,251)' }}>Senior Advisors</div>
          <button style={{ ...tbBtn(), height: 30 }}>Sort by: Conversion Rate <Icon name="chevron-down" size={11}/></button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <SortHeader label="ADVISOR" sortKey="name" sort={sort} setSort={setSort} />
                <SortHeader label="AUM" sortKey="aum" sort={sort} setSort={setSort} align="right" />
                <SortHeader label="OPEN PROPOSALS" sortKey="open" sort={sort} setSort={setSort} align="right" />
                <SortHeader label="# OF CLIENTS" sortKey="clients" sort={sort} setSort={setSort} align="right" />
                <SortHeader label="OPPORTUNITIES" sortKey="opps" sort={sort} setSort={setSort} align="right" />
                <SortHeader label="CONVERSION" sortKey="conv" sort={sort} setSort={setSort} align="right" />
                <SortHeader label="" sortKey="detail" sort={sort} align="right" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((a,i) => {
                return (
                <tr key={i} className="row-hover"
                    style={{ borderBottom:'1px solid rgba(75,85,99,0.2)' }}>
                  <td style={td()}>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <Avatar initials={a.name.split(' ').map(s=>s[0]).join('')} size={36} color={a.color} />
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color:'rgb(229,231,235)' }}>{a.name}</div>
                          {a.badge && <Badge color="amber">🏆 {a.badge}</Badge>}
                        </div>
                        <div style={{ fontSize: 11, color:'rgb(107,114,128)', marginTop: 2 }}>{a.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td('right')}>
                    <div className="num" style={{ fontSize: 13.5, fontWeight: 700, color:'rgb(229,231,235)' }}>{a.aum}</div>
                    <div style={{ fontSize: 11, color:'rgb(168,185,241)' }}>↑ {a.delta}</div>
                  </td>
                  <td style={td('right')}>
                    <div className="num" style={{ fontSize: 13.5, fontWeight: 600, color:'rgb(229,231,235)' }}>{a.open}</div>
                    <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>{a.openVal}</div>
                  </td>
                  <td style={td('right','num')}><span style={{ fontSize: 13.5, fontWeight: 600 }}>{a.clients}</span></td>
                  <td style={{ ...td('right'), cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setOppsFor(a); }}>
                    <div className="num" style={{ fontSize: 13.5, fontWeight: 600 }}>{a.opps}</div>
                    <div style={{ fontSize: 11, color:'rgb(156,163,175)' }}>{a.oppsVal}</div>
                    <div style={{ fontSize: 10.5, color:'rgb(168,185,241)', fontWeight: 500, marginTop: 2 }}>View progress →</div>
                  </td>
                  <td style={td('right')}>
                    <div className="num" style={{ fontSize: 14, fontWeight: 700, color:'rgb(168,185,241)' }}>{a.conv}%</div>
                    <div style={{ fontSize: 10.5, color:'rgb(156,163,175)' }}>{a.won}</div>
                    <div style={{ width: 80, height: 3, marginLeft: 'auto', marginTop: 4, background:'rgba(75,85,99,0.4)', borderRadius: 2, overflow:'hidden' }}>
                      <div style={{ width: `${a.conv}%`, height: '100%', background: 'rgb(168,185,241)' }} />
                    </div>
                  </td>
                  <td style={td('right')}>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('firm:openSarah'))} style={{ height: 30, padding: '0 12px', borderRadius: 8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(75,85,99,0.6)', color:'rgb(229,231,235)', fontSize: 12, fontWeight: 500, cursor:'pointer', whiteSpace:'nowrap' }}>View detail</button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </Card>

      <AdvisorOppsDrawer open={oppsFor !== null} advisor={oppsFor} onClose={() => setOppsFor(null)} />
    </div>
  );
}

window.AdvisorsPage = AdvisorsPage;
