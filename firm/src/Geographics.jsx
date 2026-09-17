/* Geographics — Alpine Partners network on a US map.
   Drill-down: regions → offices (spokes) → advisor → client roster.
   Uses window.NET_DATA (src/network-data.js) + DistMap (src/GeoMap.jsx). */

const GEO_METRICS = { aum: 'AUM', hh: 'Households', ent: 'Entities' };
const geoFmt = (n) => n.toLocaleString('en-US');
const geoMoney = (m) => m >= 1000 ? '$' + (m / 1000).toFixed(1) + 'B' : m >= 100 ? '$' + Math.round(m) + 'M' : '$' + m.toFixed(1) + 'M';
const geoRgba = (rgb, a) => rgb.replace('rgb', 'rgba').replace(')', ',' + a + ')');
const geoAgg = (o) => o.advisors.reduce((s, a) => ({ aum: s.aum + a.aum, hh: s.hh + a.hh, ent: s.ent + a.ent }), { aum: 0, hh: 0, ent: 0 });

function GeographicsPage() {
  const D = window.NET_DATA;
  const [metric, setMetric] = React.useState('aum');
  const [hub, setHub] = React.useState('');
  const [office, setOffice] = React.useState('');
  const [advisor, setAdvisor] = React.useState('');

  const hubById = React.useMemo(() => Object.fromEntries(D.hubs.map(h => [h.id, h])), [D]);
  const mv = React.useCallback((t) => metric === 'aum' ? t.aum : metric === 'hh' ? t.hh : t.ent, [metric]);
  const mfmt = (v) => metric === 'aum' ? geoMoney(v) : geoFmt(Math.round(v));
  const mLabel = metric === 'aum' ? 'AUM' : GEO_METRICS[metric].toLowerCase();

  const selectHub = React.useCallback((id) => { setHub(h => h === id ? '' : id); setOffice(''); setAdvisor(''); }, []);
  const selectOffice = React.useCallback((code) => {
    const o = window.NET_DATA.offices.find(x => x.code === code);
    setOffice(c => c === code ? '' : code);
    if (o) setHub(o.hub);
    setAdvisor('');
  }, []);

  const scopeOffices = React.useMemo(() => hub ? D.offices.filter(o => o.hub === hub) : D.offices, [D, hub]);
  const tot = React.useMemo(() => {
    const t = { adv: 0, hh: 0, ent: 0, aum: 0 };
    scopeOffices.forEach(o => { t.adv += o.advisors.length; const v = geoAgg(o); t.hh += v.hh; t.ent += v.ent; t.aum += v.aum; });
    return t;
  }, [scopeOffices]);
  const scopeLabel = hub ? hub + ' region' : 'firm-wide';

  const selOffice = office ? D.offices.find(o => o.code === office) : null;
  const selAdvisor = selOffice && advisor ? selOffice.advisors.find(a => a.id === advisor) : null;

  return (
    <div className="page-fade" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatTile label="Offices" value={geoFmt(scopeOffices.length)} sub={(hub ? hub + ' region' : D.hubs.length + ' regional hubs') + ' · ' + tot.adv + ' advisors'} />
        <StatTile label="Assets Under Management" value={geoMoney(tot.aum)} sub={scopeLabel + ', as of ' + D.asOf} valueColor="rgb(168,185,241)" />
        <StatTile label="Households" value={geoFmt(tot.hh)} sub={'client relationships · ' + scopeLabel} />
        <StatTile label="Entities" value={geoFmt(tot.ent)} sub={'accounts, trusts & legal entities · ' + scopeLabel} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 20, alignItems: 'stretch' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Breadcrumbs hub={hub} office={office} advisorName={selAdvisor && selAdvisor.name}
                onNational={() => { setHub(''); setOffice(''); setAdvisor(''); }}
                onHub={() => { setOffice(''); setAdvisor(''); }}
                onOffice={() => setAdvisor('')} />
              <div style={{ fontSize: 11.5, color: 'rgb(156,163,175)', marginTop: 3 }}>
                {selOffice ? selOffice.city + ', ' + selOffice.state + ' · pick an advisor on the right to open their book'
                  : hub ? 'Spokes connect the ' + (hubById[hub] || {}).city + ' hub to its offices — click an office bubble to see its advisors'
                  : 'Click a region bubble or tinted area to zoom into its offices'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 9, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(75,85,99,0.6)' }}>
              {Object.keys(GEO_METRICS).map(m => (
                <button key={m} onClick={() => setMetric(m)} style={{
                  height: 28, padding: '0 12px', border: 'none', borderRadius: 7, cursor: 'pointer',
                  fontSize: 11.5, fontWeight: metric === m ? 600 : 500,
                  background: metric === m ? 'rgba(168,185,241,0.14)' : 'transparent',
                  color: metric === m ? 'rgb(168,185,241)' : 'rgb(163,163,163)',
                }}>{GEO_METRICS[m]}</button>
              ))}
            </div>
          </div>
          <DistMap metric={metric} hub={hub} office={office} onHub={selectHub} onOffice={selectOffice} height={470} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
            {D.hubs.map(h => {
              const on = hub === h.id, dim = hub && !on;
              const n = D.offices.filter(o => o.hub === h.id).length;
              return (
                <button key={h.id} onClick={() => selectHub(h.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, height: 28, padding: '0 11px', borderRadius: 9999,
                  background: on ? geoRgba(h.color, 0.16) : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (on ? h.color : 'rgba(75,85,99,0.55)'),
                  color: on ? h.color : (dim ? 'rgb(107,114,128)' : 'rgb(209,213,219)'),
                  fontSize: 11.5, fontWeight: on ? 700 : 500, cursor: 'pointer', opacity: dim ? 0.6 : 1, transition: 'all .12s',
                }}>
                  <span style={{ width: 9, height: 9, borderRadius: 9999, background: h.color, opacity: dim ? 0.5 : 1 }} />
                  {h.id}<span style={{ fontSize: 10, color: on ? h.color : 'rgb(107,114,128)', fontWeight: 500 }}>{n} offices</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          {selAdvisor
            ? <AdvisorCard advisor={selAdvisor} office={selOffice} onBack={() => setAdvisor('')} asOf={D.asOf} />
            : <GeoRankPanel D={D} hub={hub} office={selOffice} hubById={hubById} mv={mv} mfmt={mfmt} mLabel={mLabel}
                onHub={selectHub} onOffice={selectOffice} onAdvisor={setAdvisor}
                onClear={() => { setHub(''); setOffice(''); setAdvisor(''); }} />}
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {selAdvisor
          ? <ClientRoster advisor={selAdvisor} office={selOffice} />
          : <OfficeTable D={D} hub={hub} office={office} hubById={hubById} mv={mv} onOffice={selectOffice} />}
      </Card>
    </div>
  );
}

function Breadcrumbs({ hub, office, advisorName, onNational, onHub, onOffice }) {
  const crumb = (label, onClick, active) => (
    <button onClick={onClick} style={{
      border: 'none', background: 'transparent', padding: 0, fontSize: 14, fontWeight: 600,
      cursor: onClick ? 'pointer' : 'default', color: active ? 'rgb(168,185,241)' : 'rgb(209,213,219)',
    }}>{label}</button>
  );
  const sep = <i className="fa-solid fa-chevron-right" style={{ fontSize: 9, color: 'rgb(107,114,128)' }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {crumb('National', onNational, !hub)}
      {hub && <React.Fragment>{sep}{crumb(hub, onHub, !!hub && !office)}</React.Fragment>}
      {office && <React.Fragment>{sep}{crumb(office, onOffice, !!office && !advisorName)}</React.Fragment>}
      {advisorName && <React.Fragment>{sep}<span style={{ fontSize: 14, fontWeight: 600, color: 'rgb(168,185,241)' }}>{advisorName}</span></React.Fragment>}
    </div>
  );
}

function GeoRankPanel({ D, hub, office, hubById, mv, mfmt, mLabel, onHub, onOffice, onAdvisor, onClear }) {
  let title, sub, rows;
  if (office) {
    const advs = office.advisors.slice().sort((a, b) => mv(b) - mv(a));
    const max = Math.max(1, ...advs.map(a => mv(a)));
    title = office.code + ' — advisors';
    sub = advs.length + ' advisors in ' + office.city + ' · ' + mLabel + ' · click for the book';
    rows = advs.map(a => ({ key: a.id, name: a.name, sub: a.hh + ' households · ' + geoMoney(a.aum), v: mv(a), max, color: hubById[office.hub].color, onClick: () => onAdvisor(a.id) }));
  } else if (hub) {
    const offs = D.offices.filter(o => o.hub === hub).map(o => ({ o, t: geoAgg(o) })).sort((a, b) => mv(b.t) - mv(a.t));
    const max = Math.max(1, ...offs.map(x => mv(x.t)));
    title = hub + ' — offices';
    sub = offs.length + ' offices · ' + mLabel + ' · click to see advisors';
    rows = offs.map(x => ({ key: x.o.code, name: x.o.code, sub: x.o.city + ', ' + x.o.state + ' · ' + x.o.advisors.length + ' advisors', v: mv(x.t), max, color: hubById[hub].color, onClick: () => onOffice(x.o.code) }));
  } else {
    const hubs = D.hubs.map(h => {
      const offs = D.offices.filter(o => o.hub === h.id);
      const t = offs.reduce((s, o) => { const v = geoAgg(o); return { aum: s.aum + v.aum, hh: s.hh + v.hh, ent: s.ent + v.ent }; }, { aum: 0, hh: 0, ent: 0 });
      return { h, offs, t };
    });
    const max = Math.max(1, ...hubs.map(x => mv(x.t)));
    title = 'Regions';
    sub = GEO_METRICS[mLabel === 'AUM' ? 'aum' : mLabel === 'households' ? 'hh' : 'ent'] + ' by region · click to zoom in';
    rows = hubs.map(x => ({ key: x.h.id, name: x.h.id, sub: 'Hub: ' + x.h.city + ' · ' + x.offs.length + ' offices', v: mv(x.t), max, color: x.h.color, onClick: () => onHub(x.h.id) }));
  }
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(249,250,251)', flex: 1 }}>{title}</div>
        {hub && (
          <button onClick={onClear} style={{ height: 24, padding: '0 10px', border: '1px solid rgba(75,85,99,0.6)', borderRadius: 6, background: 'transparent', color: 'rgb(163,163,163)', fontSize: 11, cursor: 'pointer' }}>Clear</button>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: 'rgb(156,163,175)', marginBottom: 12 }}>{sub}</div>
      <div className="scroll-thin" style={{ flex: 1, minHeight: 0, maxHeight: 470, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rows.map(r => (
          <button key={r.key} onClick={r.onClick} className="row-hover" style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px',
            border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer', textAlign: 'left',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, flexShrink: 0, background: r.color }} />
            <span style={{ width: 124, flexShrink: 0, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgb(229,231,235)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
              <span style={{ display: 'block', fontSize: 10, color: 'rgb(107,114,128)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</span>
            </span>
            <span style={{ flex: 1, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'block' }}>
              <span style={{ display: 'block', height: '100%', width: Math.max(r.v / r.max * 100, r.v > 0 ? 3 : 0) + '%', background: r.color, borderRadius: 9999 }} />
            </span>
            <span className="num" style={{ width: 58, textAlign: 'right', fontSize: 11.5, color: 'rgb(229,231,235)' }}>{mfmt(r.v)}</span>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
}

function AdvisorCard({ advisor, office, onBack, asOf }) {
  const stats = [
    { label: 'AUM', value: geoMoney(advisor.aum), color: 'rgb(168,185,241)' },
    { label: 'Households', value: geoFmt(advisor.hh) },
    { label: 'Entities', value: geoFmt(advisor.ent) },
    { label: 'Avg / household', value: geoMoney(advisor.aum / advisor.hh) },
  ];
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={onBack} style={{
          height: 26, padding: '0 10px', display: 'inline-flex', alignItems: 'center', gap: 6,
          border: '1px solid rgba(75,85,99,0.55)', borderRadius: 7, background: 'rgba(255,255,255,0.03)',
          color: 'rgb(163,163,163)', fontSize: 11, cursor: 'pointer',
        }}><i className="fa-solid fa-arrow-left" style={{ fontSize: 10 }} />Back</button>
        <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgb(107,114,128)' }}>Advisor</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar initials={advisor.name.split(' ').map(w => w[0]).join('')} size={52} color="green" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'rgb(249,250,251)' }}>{advisor.name}</div>
          <div style={{ fontSize: 11.5, color: 'rgb(163,163,163)', marginTop: 2 }}>Financial Advisor · {office.code}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 14, borderTop: '1px solid rgba(75,85,99,0.35)', paddingTop: 10 }}>
        {[['location-dot', office.city + ', ' + office.state + ' · ' + office.hub + ' region'],
          ['envelope', advisor.email], ['phone', advisor.phone]].map(([ic, txt]) => (
          <div key={ic} className="num" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px', fontSize: 12, color: ic === 'envelope' ? 'rgb(168,185,241)' : 'rgb(209,213,219)' }}>
            <i className={'fa-solid fa-' + ic} style={{ fontSize: 11, width: 16, textAlign: 'center', color: 'rgb(107,114,128)' }} />{txt}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(75,85,99,0.4)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgb(107,114,128)' }}>{s.label}</div>
            <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 5, color: s.color || 'rgb(249,250,251)' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'rgb(107,114,128)', lineHeight: 1.55, marginTop: 14 }}>Top client relationships are listed in the roster below. Book figures as of {asOf}.</div>
    </React.Fragment>
  );
}

const CLIENT_KIND_BADGE = { 'Household': 'green', 'Revocable Trust': 'blue', 'Family LLC': 'purple', 'Foundation': 'amber', 'IRA': 'coral' };
const geoTh = { textAlign: 'left', padding: '11px 20px 10px', fontSize: 10, fontWeight: 500, color: 'rgb(107,114,128)', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: 'rgb(23,32,46)', zIndex: 5, borderBottom: '1px solid rgba(75,85,99,0.35)' };
const geoThR = { ...geoTh, textAlign: 'right' };

function TableShell({ title, sub, count, children }) {
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(75,85,99,0.3)' }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgb(249,250,251)' }}>{title}</div>
          <div style={{ fontSize: 11, color: 'rgb(163,163,163)', marginTop: 2 }}>{sub}</div>
        </div>
        <span style={{ fontSize: 11, color: 'rgb(163,163,163)', whiteSpace: 'nowrap' }}>{count}</span>
      </div>
      <div className="scroll-thin" style={{ maxHeight: 480, overflowY: 'auto' }}>{children}</div>
    </React.Fragment>
  );
}

function ClientRoster({ advisor, office }) {
  return (
    <TableShell title={advisor.name + ' — client roster'} sub={'Top relationships by AUM · ' + office.code + ', ' + office.city}
      count={advisor.clients.length + ' of ' + advisor.hh + ' households shown'}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead><tr>
          <th style={geoTh}>Client</th><th style={geoTh}>Type</th>
          <th style={geoThR}>Entities</th><th style={geoThR}>AUM</th><th style={geoThR}>Last updated</th>
        </tr></thead>
        <tbody>
          {advisor.clients.map(c => (
            <tr key={c.name} className="row-hover" style={{ borderTop: '1px solid rgba(75,85,99,0.15)' }}>
              <td style={{ padding: '10px 20px', fontSize: 12.5, fontWeight: 600, color: 'rgb(249,250,251)' }}>{c.name}</td>
              <td style={{ padding: '10px 20px' }}><Badge color={CLIENT_KIND_BADGE[c.kind] || 'gray'}>{c.kind}</Badge></td>
              <td className="num" style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(229,231,235)' }}>{geoFmt(c.entities)}</td>
              <td className="num" style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(168,185,241)', fontWeight: 600 }}>{geoMoney(c.aum)}</td>
              <td style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(163,163,163)' }}>{c.updated}d ago</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function OfficeTable({ D, hub, office, hubById, mv, onOffice }) {
  const rows = (hub ? D.offices.filter(o => o.hub === hub) : D.offices)
    .map(o => ({ o, t: geoAgg(o) })).sort((a, b) => mv(b.t) - mv(a.t));
  return (
    <TableShell title={(hub ? hub + ' — ' : '') + 'Office summary'} sub={'Click a row to open the office on the map · as of ' + D.asOf} count={rows.length + ' offices'}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead><tr>
          <th style={geoTh}>Office</th><th style={geoTh}>Region</th>
          <th style={geoThR}>Advisors</th><th style={geoThR}>Households</th><th style={geoThR}>Entities</th><th style={geoThR}>AUM</th>
        </tr></thead>
        <tbody>
          {rows.map(({ o, t }) => {
            const h = hubById[o.hub], sel = o.code === office;
            return (
              <tr key={o.code} onClick={() => onOffice(o.code)} className="row-hover"
                style={{ borderTop: '1px solid rgba(75,85,99,0.15)', cursor: 'pointer', background: sel ? 'rgba(168,185,241,0.07)' : 'transparent' }}>
                <td style={{ padding: '10px 20px' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgb(249,250,251)' }}>{o.code}</div>
                  <div style={{ fontSize: 10.5, color: 'rgb(163,163,163)', marginTop: 1 }}>{o.city}, {o.state}</div>
                </td>
                <td style={{ padding: '10px 20px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: h.color }}>
                    <span style={{ width: 8, height: 8, borderRadius: 9999, background: h.color }} />{o.hub}
                  </span>
                </td>
                <td className="num" style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(229,231,235)' }}>{geoFmt(o.advisors.length)}</td>
                <td className="num" style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(229,231,235)' }}>{geoFmt(t.hh)}</td>
                <td className="num" style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(229,231,235)' }}>{geoFmt(t.ent)}</td>
                <td className="num" style={{ padding: '10px 20px', textAlign: 'right', color: 'rgb(168,185,241)', fontWeight: 600 }}>{geoMoney(t.aum)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableShell>
  );
}

window.GeographicsPage = GeographicsPage;
