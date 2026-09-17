/* Highcharts helper + shared Field theme.
   Usage: <HC options={...} style={{ height: 200 }} />
   The Field theme is applied once via Highcharts.setOptions; every HC instance
   inherits it and can override per-chart. */

(function applyFieldTheme() {
  if (typeof Highcharts === 'undefined' || window.__fieldHCThemed) return;
  window.__fieldHCThemed = true;
  Highcharts.setOptions({
    colors: ['rgb(35,89,255)', 'rgb(120,160,230)', 'rgb(180,150,235)', 'rgb(245,200,90)', 'rgb(240,140,120)', 'rgb(120,200,210)', 'rgb(200,170,130)', 'rgb(160,170,185)'],
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
      line:   { marker: { lineColor: 'rgb(10,10,10)', lineWidth: 2, fillColor: 'rgb(35,89,255)', radius: 3.5 } },
      area:   { marker: { enabled: false } },
      column: { borderWidth: 0, borderRadius: 2 },
      bar:    { borderWidth: 0, borderRadius: 2 },
      pie:    { borderColor: 'rgb(10,10,10)', borderWidth: 1, borderRadius: 0 },
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
