/* Highcharts helper + shared Field theme.
   Usage: <HC options={...} style={{ height: 200 }} />
   The Field theme is applied once via Highcharts.setOptions; every HC instance
   inherits it and can override per-chart.

   In addition to the global theme, this module exposes a small set of helpers
   that produce point/series shapes consistent with the Field design system:

     fieldPalette(i)        → { fill, line, fillDeep, fillSoft }
     fieldPieData(slices)   → [{ name, y, color: fill, borderColor: line }]
     fieldBarData(rows)     → same, for bar/column charts
     fieldAreaSeries(name,
                     data,
                     colorIdx)
                            → an area-series config with gradient fill +
                              billing-style markers (the design system's
                              canonical line-chart treatment)
     fieldLineSeries(...)   → same, but a pure line without the area gradient
     fieldSingleColumn(name,
                       data,
                       colorIdx)
                            → a column/bar series with translucent fill +
                              vivid border (radial-graph treatment, applied
                              uniformly across all bars in the series)
*/

(function defineFieldPalette() {
  if (window.FIELD_PALETTE) return;
  // Each entry has a translucent "fill" for the body of the shape and a
  // vivid "line" for the highlight border / dot. Index 0 is the brand green.
  window.FIELD_PALETTE = [
    { fill: 'rgba( 94,214,164,0.55)', line: 'rgb( 94,214,164)' },
    { fill: 'rgba(120,160,230,0.55)', line: 'rgb(120,160,230)' },
    { fill: 'rgba(180,150,235,0.55)', line: 'rgb(180,150,235)' },
    { fill: 'rgba(245,200, 90,0.55)', line: 'rgb(245,200, 90)' },
    { fill: 'rgba(240,140,120,0.55)', line: 'rgb(240,140,120)' },
    { fill: 'rgba(120,200,210,0.55)', line: 'rgb(120,200,210)' },
    { fill: 'rgba(200,170,130,0.55)', line: 'rgb(200,170,130)' },
    { fill: 'rgba(160,170,185,0.55)', line: 'rgb(160,170,185)' },
  ];

  window.fieldPalette = function (i) {
    const p = window.FIELD_PALETTE[i % window.FIELD_PALETTE.length];
    return {
      fill: p.fill,
      line: p.line,
      fillDeep: p.fill.replace('0.55', '0.35'),
      fillSoft: p.fill.replace('0.55', '0.12'),
      fillNone: p.line.replace('rgb(', 'rgba(').replace(')', ',0)'),
    };
  };

  // Given a list of slices/rows, decorate each with the corresponding palette
  // colors so pies / bars get the canonical opacity-fill + highlight-border
  // effect with no per-call boilerplate.
  // Each input row may include:
  //   { name, y }        → standard
  //   { label, value }   → friendly aliases
  //   { color, borderColor, ... } → explicit overrides preserved
  function decorate(rows) {
    return (rows || []).map((r, i) => {
      const p = window.fieldPalette(i);
      const name = r.name != null ? r.name : r.label;
      const y    = r.y    != null ? r.y    : r.value;
      return {
        ...r,
        name, y,
        color:       r.color       != null ? r.color       : p.fill,
        borderColor: r.borderColor != null ? r.borderColor : p.line,
      };
    });
  }
  window.fieldPieData = decorate;
  window.fieldBarData = decorate;

  // Area series with gradient fill + Billing-style markers.
  window.fieldAreaSeries = function (name, data, colorIdx) {
    const p = window.fieldPalette(colorIdx || 0);
    return {
      type: 'area',
      name,
      color: p.line,
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, p.fillDeep], [1, p.fillNone]],
      },
      lineWidth: 2,
      marker: { enabled: true, radius: 3.5, fillColor: 'rgb(10,10,10)', lineColor: p.line, lineWidth: 2, symbol: 'circle' },
      data,
    };
  };

  // Plain line series with billing-style markers, no fill.
  window.fieldLineSeries = function (name, data, colorIdx) {
    const p = window.fieldPalette(colorIdx || 0);
    return {
      type: 'line',
      name,
      color: p.line,
      lineWidth: 2,
      marker: { enabled: true, radius: 3.5, fillColor: 'rgb(10,10,10)', lineColor: p.line, lineWidth: 2, symbol: 'circle' },
      data,
    };
  };

  // Bar / column series with the radial-graph treatment applied uniformly to
  // every bar in the series (translucent body + vivid border highlight).
  window.fieldSingleColumn = function (name, data, colorIdx, extra) {
    const p = window.fieldPalette(colorIdx || 0);
    return {
      type: 'column',
      name,
      color: p.fill,
      borderColor: p.line,
      borderWidth: 1.5,
      data,
      ...(extra || {}),
    };
  };
  window.fieldSingleBar = function (name, data, colorIdx, extra) {
    const p = window.fieldPalette(colorIdx || 0);
    return {
      type: 'bar',
      name,
      color: p.fill,
      borderColor: p.line,
      borderWidth: 1.5,
      data,
      ...(extra || {}),
    };
  };
})();

(function applyFieldTheme() {
  if (typeof Highcharts === 'undefined' || window.__fieldHCThemed) return;
  window.__fieldHCThemed = true;
  const lineColors = window.FIELD_PALETTE.map(p => p.line);
  Highcharts.setOptions({
    colors: lineColors,
    chart: {
      backgroundColor: 'transparent',
      style: { fontFamily: 'Inter, sans-serif' },
      spacing: [8, 4, 8, 4],
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: {
      itemStyle: { color: 'rgb(229,231,235)', fontWeight: '500', fontSize: '11px' },
      itemHoverStyle: { color: 'rgb(249,250,251)' },
      itemHiddenStyle: { color: 'rgb(107,114,128)' },
    },
    xAxis: {
      lineColor: 'rgba(75,85,99,0.5)',
      tickColor: 'rgba(75,85,99,0.5)',
      gridLineColor: 'rgba(75,85,99,0.25)',
      labels: { style: { color: 'rgb(163,163,163)', fontSize: '11px' } },
    },
    yAxis: {
      gridLineColor: 'rgba(75,85,99,0.25)',
      gridLineDashStyle: 'Dash',
      lineColor: 'transparent',
      tickColor: 'transparent',
      labels: { style: { color: 'rgb(163,163,163)', fontSize: '11px' } },
      title: { text: null },
    },
    tooltip: {
      backgroundColor: 'rgb(17,24,39)',
      borderColor: 'rgb(75,85,99)',
      borderRadius: 8,
      style: { color: 'rgb(249,250,251)', fontSize: '11.5px' },
      shadow: false,
      useHTML: true,
    },
    plotOptions: {
      series: { animation: { duration: 420 } },
      line:   {
        lineWidth: 2,
        marker: { enabled: true, radius: 3.5, fillColor: 'rgb(10,10,10)', lineColor: window.FIELD_PALETTE[0].line, lineWidth: 2, symbol: 'circle' },
      },
      area:   {
        lineWidth: 2,
        marker: { enabled: true, radius: 3.5, fillColor: 'rgb(10,10,10)', lineColor: window.FIELD_PALETTE[0].line, lineWidth: 2, symbol: 'circle' },
        fillOpacity: 0.22,
      },
      column: { borderWidth: 1.5, borderRadius: 4, pointPadding: 0.06, groupPadding: 0.10 },
      bar:    { borderWidth: 1.5, borderRadius: 4, pointPadding: 0.06, groupPadding: 0.10 },
      pie: {
        innerSize: '68%',
        borderColor: 'rgb(14,26,42)',
        borderWidth: 1.5,
        borderRadius: 0,
        dataLabels: { enabled: false },
        states: { hover: { brightness: 0.08, halo: { size: 6, opacity: 0.2 } } },
      },
    },
  });
})();

function HC({ options, style }) {
  const ref = React.useRef();
  const chartRef = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    chartRef.current = Highcharts.chart(ref.current, options);
    return () => { try { chartRef.current && chartRef.current.destroy(); } catch(e){} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (chartRef.current) {
      try { chartRef.current.update(options, true, true); } catch(e) {}
    }
  }, [options]);
  return <div ref={ref} style={{ width:'100%', height:'100%', ...style }} />;
}

window.HC = HC;
