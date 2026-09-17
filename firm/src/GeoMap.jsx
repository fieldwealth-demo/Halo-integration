/* Alpine Partners network map (Highcharts Maps).
   Hub bubbles → zoom to hub with spokes → office bubbles.
   Props: metric ('aum'|'hh'|'ent'), hub (id|''), office (code|''),
          onHub(id), onOffice(code), height */
const DM_CONUS = ['us-al','us-az','us-ar','us-ca','us-co','us-ct','us-de','us-fl','us-ga','us-id','us-il','us-in','us-ia','us-ks','us-ky','us-la','us-me','us-md','us-ma','us-mi','us-mn','us-ms','us-mo','us-mt','us-ne','us-nv','us-nh','us-nj','us-nm','us-ny','us-nc','us-nd','us-oh','us-ok','us-or','us-pa','us-ri','us-sc','us-sd','us-tn','us-tx','us-ut','us-vt','us-va','us-wa','us-wv','us-wi','us-wy','us-dc'];
const DM_NATIONAL_FIT = { type:'MultiPoint', coordinates: [[-123.5,48.5],[-69,46.5],[-80.5,25.5],[-117,32.5]] };

function dmAgg(o) {
  return o.advisors.reduce((s,a) => ({ aum:s.aum+a.aum, hh:s.hh+a.hh, ent:s.ent+a.ent }), { aum:0, hh:0, ent:0 });
}
function dmVal(o, metric) { const t = dmAgg(o); return t[metric] || 0; }
function dmRgba(rgb, a) { return rgb.replace('rgb','rgba').replace(')', ','+a+')'); }
function dmMoney(m) { return m >= 1000 ? '$' + (m/1000).toFixed(1) + 'B' : '$' + Math.round(m) + 'M'; }
function dmFmt(n) { return n.toLocaleString('en-US'); }

function DistMap({ metric, hub, office, onHub, onOffice, height = 470 }) {
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);
  const cbRef = React.useRef({});
  React.useEffect(() => { cbRef.current = { onHub, onOffice }; });
  const [topology, setTopology] = React.useState(null);
  const [D, setD] = React.useState(window.NET_DATA || null);
  React.useEffect(() => {
    if (D) return;
    const t = setInterval(() => { if (window.NET_DATA) { clearInterval(t); setD(window.NET_DATA); } }, 120);
    return () => clearInterval(t);
  }, [D]);
  const hubById = React.useMemo(() => D ? Object.fromEntries(D.hubs.map(h => [h.id, h])) : {}, [D]);

  const [hcReady, setHcReady] = React.useState(typeof Highcharts !== 'undefined' && !!Highcharts.mapChart);
  React.useEffect(() => {
    if (hcReady) return;
    const t = setInterval(() => {
      if (typeof Highcharts !== 'undefined' && Highcharts.mapChart) { clearInterval(t); setHcReady(true); }
    }, 120);
    return () => clearInterval(t);
  }, [hcReady]);
  const [chartUp, setChartUp] = React.useState(false);

  React.useEffect(() => {
    if (window.__usTopology) { setTopology(window.__usTopology); return; }
    let cancelled = false;
    fetch('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json')
      .then(r => r.json())
      .then(t => { if (!cancelled) { window.__usTopology = t; setTopology(t); } })
      .catch(e => console.error('Map data load failed', e));
    return () => { cancelled = true; };
  }, []);

  const buildStateAreas = React.useCallback((selHub) => {
    if (!D) return [];
    const out = [];
    D.hubs.forEach(h => {
      const dim = selHub && selHub !== h.id;
      const m = h.color.match(/(\d+),(\d+),(\d+)/);
      const rgb = m ? m[1]+','+m[2]+','+m[3] : '120,130,150';
      h.states.forEach(s => out.push({
        'hc-key': 'us-'+s.toLowerCase(),
        color: dim ? 'rgba(120,130,150,0.05)' : 'rgba('+rgb+',0.11)',
        borderColor: dim ? 'rgba(120,130,150,0.25)' : 'rgba('+rgb+',0.45)',
        hubId: h.id,
      }));
    });
    return out;
  }, [D]);

  const buildHubBubbles = React.useCallback((m, selHub) => (!D || selHub) ? [] : D.hubs.map(h => {
    const offs = D.offices.filter(o => o.hub === h.id);
    const t = offs.reduce((s,o) => { const v = dmAgg(o); return { aum:s.aum+v.aum, hh:s.hh+v.hh, ent:s.ent+v.ent, adv:s.adv+o.advisors.length }; }, { aum:0, hh:0, ent:0, adv:0 });
    return {
      name: h.id, lat: h.lat, lon: h.lon,
      z: Math.max(t[m], 1), kind: 'hub', hubId: h.id,
      offices: offs.length, advisors: t.adv, aum: t.aum, hh: t.hh, ent: t.ent,
      color: dmRgba(h.color, 0.55),
      marker: { lineColor: h.color, lineWidth: 2 },
    };
  }), [D]);

  const buildSpokes = React.useCallback((selHub) => {
    if (!D || !selHub) return [];
    const h = hubById[selHub];
    return D.offices.filter(o => o.hub === selHub).map(o => ({
      geometry: { type:'LineString', coordinates: [[h.lon, h.lat], [o.lon, o.lat]] },
      color: dmRgba(h.color, 0.28),
    }));
  }, [D, hubById]);

  const buildOfficeBubbles = React.useCallback((m, selHub, selOffice) => {
    if (!D || !selHub) return [];
    const h = hubById[selHub];
    return D.offices.filter(o => o.hub === selHub).map(o => {
      const sel = o.code === selOffice;
      const t = dmAgg(o);
      return {
        name: o.code, lat: o.lat, lon: o.lon,
        z: Math.max(t[m], 0.5),
        kind: 'office', code: o.code, city: o.city, state: o.state,
        advisors: o.advisors.length, aum: t.aum, hh: t.hh, ent: t.ent,
        color: sel ? 'rgb(140,175,255)' : dmRgba(h.color, 0.62),
        marker: { lineColor: sel ? '#fff' : h.color, lineWidth: sel ? 2.5 : 1.2 },
      };
    });
  }, [D, hubById]);

  const hubFit = React.useCallback((selHub) => {
    if (!D || !selHub) return DM_NATIONAL_FIT;
    const offs = D.offices.filter(o => o.hub === selHub);
    const h = hubById[selHub];
    const lons = offs.map(o => o.lon).concat([h.lon]), lats = offs.map(o => o.lat).concat([h.lat]);
    const padX = Math.max((Math.max(...lons) - Math.min(...lons)) * 0.14, 1.2);
    const padY = Math.max((Math.max(...lats) - Math.min(...lats)) * 0.14, 1.0);
    return { type:'MultiPoint', coordinates: [
      [Math.min(...lons) - padX, Math.max(...lats) + padY],
      [Math.max(...lons) + padX, Math.min(...lats) - padY],
    ]};
  }, [D, hubById]);

  React.useEffect(() => {
    if (!topology || !D || !hcReady || !ref.current || typeof Highcharts === 'undefined' || !Highcharts.mapChart) return;
    if (chartRef.current) return;
    chartRef.current = Highcharts.mapChart(ref.current, {
      chart: { map: topology, backgroundColor:'transparent', height, margin:[4,4,4,4], spacing:[0,0,0,0], animation:false },
      accessibility: { enabled:false },
      title: { text:'' }, credits: { enabled:false }, legend: { enabled:false },
      mapNavigation: { enabled:false },
      mapView: { fitToGeometry: DM_NATIONAL_FIT },
      tooltip: {
        useHTML:true, backgroundColor:'rgba(13,20,32,0.96)', borderColor:'rgba(75,85,99,0.55)',
        borderRadius:8, shadow:false, padding:10, hideDelay:60,
        style: { color:'#fff', fontFamily:'Inter', fontSize:'11px' },
        formatter: function () {
          const p = this.point;
          const grid = rows => '<div style="display:grid;grid-template-columns:auto auto;gap:2px 14px;font-size:11px;">' +
            rows.map(([l,v,c]) => '<span style="color:rgb(107,114,128);">'+l+'</span><span style="text-align:right;font-weight:600;color:'+(c||'#fff')+';">'+v+'</span>').join('') + '</div>';
          if (p && p.kind === 'hub') {
            const h = window.NET_DATA.hubs.find(x => x.id === p.hubId);
            return '<div style="min-width:170px;"><div style="font-size:12px;font-weight:700;">' + p.hubId + ' region</div>' +
              '<div style="font-size:10px;color:' + h.color + ';font-weight:600;margin-bottom:6px;">Hub: ' + h.city + ' · ' + p.offices + ' offices · ' + p.advisors + ' advisors</div>' +
              grid([['AUM', dmMoney(p.aum), 'rgb(140,175,255)'], ['Households', dmFmt(p.hh)], ['Entities', dmFmt(p.ent)]]) +
              '<div style="font-size:10px;color:rgb(107,114,128);margin-top:6px;">Click to zoom into this region</div></div>';
          }
          if (p && p.kind === 'office') {
            return '<div style="min-width:170px;"><div style="font-size:12px;font-weight:700;">' + p.code + ' — ' + p.city + ', ' + p.state + '</div>' +
              '<div style="font-size:10px;color:rgb(140,175,255);font-weight:600;margin-bottom:6px;">' + p.advisors + ' advisor' + (p.advisors>1?'s':'') + '</div>' +
              grid([['AUM', dmMoney(p.aum), 'rgb(140,175,255)'], ['Households', dmFmt(p.hh)], ['Entities', dmFmt(p.ent)]]) +
              '<div style="font-size:10px;color:rgb(107,114,128);margin-top:6px;">Click to see its advisors</div></div>';
          }
          if (p && p.hubId) return '<span style="color:rgb(163,163,163)">' + p.hubId + '</span>';
          return false;
        },
      },
      plotOptions: {
        mapbubble: {
          minSize: 10, maxSize: 46, opacity: 0.9, animation:false, cursor:'pointer',
          states: { hover:{ opacity:1, lineWidthPlus:2 } },
          point: { events: { click: function () {
            const cb = cbRef.current;
            if (this.kind === 'hub' && cb.onHub) cb.onHub(this.hubId);
            else if (this.kind === 'office' && cb.onOffice) cb.onOffice(this.code);
          } } },
        },
        map: { nullColor:'rgba(255,255,255,0.025)' },
        mapline: { lineWidth: 1, enableMouseTracking: false },
      },
      series: [
        { name:'US', mapData:topology, joinBy:'hc-key', allAreas:false,
          data: DM_CONUS.map(k => ({ 'hc-key':k, value:1, color:'rgba(255,255,255,0.028)' })),
          borderColor:'rgba(120,140,170,0.30)', borderWidth:0.6,
          enableMouseTracking:false, states:{ hover:{ enabled:false } } },
        { name:'Regions', mapData:topology, joinBy:'hc-key', allAreas:false,
          borderWidth:0.9, data: buildStateAreas(hub),
          cursor:'pointer', states:{ hover:{ brightness:0.08 } },
          point:{ events:{ click: function () { if (cbRef.current.onHub && this.hubId) cbRef.current.onHub(this.hubId); } } },
          dataLabels:{ enabled:false } },
        { type:'mapline', name:'Spokes', data: buildSpokes(hub) },
        { type:'mapbubble', name:'HubBubbles', data: buildHubBubbles(metric, hub) },
        { type:'mapbubble', name:'Offices', data: buildOfficeBubbles(metric, hub, office) },
      ],
    });
    setChartUp(true);
    return () => { try { chartRef.current && chartRef.current.destroy(); } catch(e){} chartRef.current = null; };
  }, [topology, D, hcReady, height]);

  const prevHubRef = React.useRef(null);
  React.useEffect(() => {
    const ch = chartRef.current;
    if (!ch || !ch.series || ch.series.length < 5) return;
    try {
      ch.series[1].setData(buildStateAreas(hub), false, false, false);
      ch.series[2].setData(buildSpokes(hub), false, false, false);
      ch.series[3].setData(buildHubBubbles(metric, hub), false, false, false);
      ch.series[4].setData(buildOfficeBubbles(metric, hub, office), false, false, false);
      if (prevHubRef.current !== hub) {
        prevHubRef.current = hub;
        ch.mapView.update({ fitToGeometry: hubFit(hub) }, false);
      }
      ch.redraw(false);
    } catch(e){ console.error('DistMap update failed', e); }
  }, [metric, hub, office, topology, D, buildStateAreas, buildSpokes, buildHubBubbles, buildOfficeBubbles, hubFit]);

  return (
    <div style={{ position:'relative', width:'100%', height, borderRadius:8, overflow:'hidden',
      background:'radial-gradient(ellipse 60% 70% at 50% 42%, rgba(28,42,66,0.5) 0%, rgba(11,21,36,0) 70%)' }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <defs>
          <pattern id="dm-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(75,85,99,0.18)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dm-grid)" />
      </svg>
      <div ref={ref} style={{ width:'100%', height:'100%', position:'relative', zIndex:1 }} />
      {!chartUp && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontSize:12, color:'rgb(163,163,163)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight:8 }} />Loading map…
        </div>
      )}
    </div>
  );
}
window.DistMap = DistMap;
if (typeof module !== 'undefined' && module.exports) module.exports = { DistMap };
