/* Revenue Summary page */

const REV_CATEGORIES = [
  { name:'AUM Fee',         pct:'80%',   total:'$1,720,456', delta:'+1%', color:'rgb(168,185,241)',
    sub:[
      { name:'Equity Portfolios',   pct:'48%', total:'$825,819' },
      { name:'Fixed Income',        pct:'28%', total:'$481,728' },
      { name:'Balanced Portfolios', pct:'24%', total:'$412,909' },
    ]},
  { name:'Fee Only',        pct:'6.25%', total:'$134,375',   delta:null,  color:'rgb(120,200,210)',
    sub:[
      { name:'Financial Planning',  pct:'62%', total:'$83,313' },
      { name:'Hourly Consulting',   pct:'24%', total:'$32,250' },
      { name:'Project Engagements', pct:'14%', total:'$18,812' },
    ]},
  { name:'Commissions',     pct:'5.14%', total:'$110,510',   delta:'-3%', color:'rgb(180,150,235)',
    sub:[
      { name:'Insurance Products', pct:'55%', total:'$60,780' },
      { name:'Annuities',          pct:'30%', total:'$33,153' },
      { name:'Mutual Funds',       pct:'15%', total:'$16,577' },
    ]},
  { name:'Recurring Revenue',pct:'4.21%',total:'$90,515',    delta:null,  color:'rgb(245,200,90)',
    sub:[
      { name:'Subscription Plans', pct:'68%', total:'$61,550' },
      { name:'Retainers',          pct:'32%', total:'$28,965' },
    ]},
  { name:'Advisory Fee',    pct:'1.52%', total:'$32,680',    delta:null,  color:'rgb(120,160,230)',
    sub:[
      { name:'Discretionary Advisory',     pct:'70%', total:'$22,876' },
      { name:'Non-discretionary Advisory', pct:'30%', total:'$9,804' },
    ]},
  { name:'401K',            pct:'1.48%', total:'$31,820',    delta:null,  color:'rgb(240,140,120)',
    sub:[
      { name:'Plan Administration', pct:'58%', total:'$18,455' },
      { name:'Participant Advice',  pct:'42%', total:'$13,365' },
    ]},
  { name:'Other Revenue',   pct:'1.40%', total:'$29,644',    delta:null,  color:'rgb(160,170,185)',
    sub:[
      { name:'Referral Fees',      pct:'52%', total:'$15,415' },
      { name:'Miscellaneous',      pct:'48%', total:'$14,229' },
    ]},
];

const EXP_CATEGORIES = [
  { name:'Operations',  pct:'48%', total:'$275,596', delta:'+5%', color:'rgb(168,185,241)',
    sub:[
      { name:'Salaries & Benefits', pct:'62%', total:'$170,870' },
      { name:'Rent & Utilities',    pct:'22%', total:'$60,631' },
      { name:'Office Supplies',     pct:'10%', total:'$27,560' },
      { name:'Insurance',           pct:'6%',  total:'$16,535' },
    ]},
  { name:'Sales',       pct:'32%', total:'$183,731', delta:null,  color:'rgb(245,200,90)',
    sub:[
      { name:'Commissions',   pct:'58%', total:'$106,564' },
      { name:'Bonuses',       pct:'28%', total:'$51,444' },
      { name:'Travel & Ent.', pct:'14%', total:'$25,723' },
    ]},
  { name:'Technology',  pct:'15%', total:'$86,124',  delta:'-5%', color:'rgb(120,160,230)',
    sub:[
      { name:'Software Licenses', pct:'54%', total:'$46,507' },
      { name:'Cloud Services',    pct:'28%', total:'$24,114' },
      { name:'IT Support',        pct:'18%', total:'$15,503' },
    ]},
  { name:'Marketing',   pct:'5%',  total:'$28,708',  delta:null,  color:'rgb(180,150,235)',
    sub:[
      { name:'Digital Advertising', pct:'48%', total:'$13,780' },
      { name:'Events & Sponsorships', pct:'30%', total:'$8,613' },
      { name:'Content & Collateral',  pct:'22%', total:'$6,315' },
    ]},
];

function RevenuePage() {
  const seg = (cats) => {
    const total = cats.reduce((s, c) => s + parseFloat(c.pct), 0);
    return cats.map(c => ({ ...c, fp: parseFloat(c.pct) / total * 100 }));
  };
  const rev = seg(REV_CATEGORIES);
  const exp = seg(EXP_CATEGORIES);

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16, padding: '14px 18px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <span style={{ fontSize: 12, color:'rgb(156,163,175)' }}>Filter by:</span>
          <button style={fbtn()}><Icon name="building" size={11}/>All Branches <Icon name="chevron-down" size={10}/></button>
          <button style={fbtn()}><Icon name="user" size={11}/>All Advisors <Icon name="chevron-down" size={10}/></button>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <KPICard label="Total Revenue" value="$2,150,000" segs={rev} />
        <KPICard label="Total Expenses" value="$574,154" valueColor="rgb(248,113,113)" segs={exp} />
        <Card>
          <div style={{ fontSize: 11, fontWeight: 500, color:'rgb(156,163,175)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Net Profit</div>
          <div className="num" style={{ fontSize: 26, fontWeight: 800, color:'rgb(168,185,241)', marginTop: 8 }}>$1,575,846</div>
          <div style={{ display:'flex', gap: 16, fontSize: 11, color:'rgb(156,163,175)', marginTop: 12 }}>
            <div><div style={{ color:'rgb(229,231,235)', fontWeight: 600 }}>Profit Margin</div><div className="num" style={{ color:'rgb(168,185,241)', fontSize: 14, fontWeight: 700 }}>73.3%</div></div>
            <div><div style={{ color:'rgb(229,231,235)', fontWeight: 600 }}>vs Last Year</div><div className="num" style={{ color:'rgb(168,185,241)', fontSize: 14, fontWeight: 700 }}>+12.4%</div></div>
          </div>
        </Card>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        <RevTable title="Revenue" total="$2,150,000" rows={REV_CATEGORIES} totalColor="rgb(168,185,241)" />
        <RevTable title="Expenses" total="$574,154" rows={EXP_CATEGORIES} totalColor="rgb(248,113,113)" />
      </div>
    </div>
  );
}

function KPICard({ label, value, valueColor, segs }) {
  return (
    <Card>
      <div style={{ fontSize: 11, fontWeight: 500, color:'rgb(156,163,175)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</div>
      <div className="num" style={{ fontSize: 26, fontWeight: 800, color: valueColor || 'rgb(249,250,251)', marginTop: 8 }}>{value}</div>
      <div style={{ display:'flex', height: 6, marginTop: 14, marginBottom: 8, borderRadius: 3, overflow:'hidden' }}>
        {segs.map((s,i) => <div key={i} style={{ width: `${s.fp}%`, background: s.color }} />)}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: '6px 12px' }}>
        {segs.slice(0, 4).map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 5, fontSize: 11, color:'rgb(156,163,175)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: s.color }} />
            {s.name} {s.pct}
          </div>
        ))}
      </div>
    </Card>
  );
}

function RevTable({ title, total, rows, totalColor }) {
  const [openIdx, setOpenIdx] = React.useState(null);
  return (
    <Card style={{ padding: 0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid rgba(75,85,99,0.3)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color:'rgb(249,250,251)' }}>{title}</div>
        <div className="num" style={{ fontSize: 13, fontWeight: 700, color: totalColor }}>{total}</div>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr><th style={th('left')}>CATEGORY</th><th style={th('right')}>%</th><th style={th('right')}>TOTAL</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const open = openIdx === i;
            const hasSub = Array.isArray(r.sub) && r.sub.length > 0;
            return (
              <React.Fragment key={i}>
                <tr className="row-hover"
                  onClick={() => hasSub && setOpenIdx(open ? null : i)}
                  style={{ borderBottom: i < rows.length-1 ? '1px solid rgba(75,85,99,0.15)' : 'none', cursor: hasSub ? 'pointer' : 'default' }}>
                  <td style={td()}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 9999, background: r.color }} />
                      <span style={{ fontSize: 12.5, color:'rgb(229,231,235)' }}>{r.name}</span>
                      {r.delta && <Badge color={r.delta.startsWith('+') ? 'green' : 'red'}>{r.delta.startsWith('+') ? '↑' : '↓'} {r.delta.replace(/[+-]/,'')}</Badge>}
                    </span>
                  </td>
                  <td style={td('right','num')}>{r.pct}</td>
                  <td style={td('right','num')}>
                    <span style={{ fontWeight: 600 }}>{r.total}</span>
                    {hasSub && (
                      <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`}
                         style={{ fontSize: 10, color:'rgb(107,114,128)', marginLeft: 8, transition:'transform 160ms ease' }} />
                    )}
                  </td>
                </tr>
                {open && hasSub && r.sub.map((s, j) => (
                  <tr key={`${i}-${j}`} style={{
                    background: 'rgba(0,0,0,0.18)',
                    borderBottom: j < r.sub.length-1
                      ? '1px solid rgba(75,85,99,0.08)'
                      : (i < rows.length-1 ? '1px solid rgba(75,85,99,0.15)' : 'none'),
                  }}>
                    <td style={{ ...td(), paddingLeft: 44, fontSize: 12, color:'rgb(163,163,163)' }}>{s.name}</td>
                    <td style={td('right','num')}><span style={{ color:'rgb(163,163,163)' }}>{s.pct}</span></td>
                    <td style={td('right','num')}><span style={{ color:'rgb(209,213,219)' }}>{s.total}</span></td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

/* Sub-category rows render inline within RevTable; no separate component needed. */

const fbtn = () => ({
  display:'inline-flex', alignItems:'center', gap: 6, height: 30, padding: '0 12px',
  borderRadius: 8, background:'rgba(17,24,39,0.6)', border:'1px solid rgba(75,85,99,0.5)',
  color:'rgb(229,231,235)', fontSize: 12, fontWeight: 500, cursor:'pointer',
});

window.RevenuePage = RevenuePage;
