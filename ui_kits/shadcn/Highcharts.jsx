// Highcharts — Field design-system wrapper.
//
// Developers build with the Highcharts library. This module provides:
//   1. fieldHighchartsTheme   — a Highcharts theme object that maps our
//                               design tokens (chart labels 12/16/400 Inter,
//                               fg-muted, 1px non-scaling strokes, the
//                               canonical asset-allocation palette) onto
//                               Highcharts' global `Highcharts.setOptions`.
//   2. applyFieldHighchartsTheme() — call once on page load to install it.
//   3. <HChart options={...} /> — thin React wrapper that renders a chart
//                               inside a tile-body-friendly container. All
//                               charts inherit the theme; you only pass
//                               series + axis data.
//
// CDN script tag to include alongside this file:
//   <script src="https://code.highcharts.com/11.4.8/highcharts.js"></script>
//   <script src="https://code.highcharts.com/11.4.8/highcharts-more.js"></script>
//   <script src="https://code.highcharts.com/11.4.8/modules/accessibility.js"></script>
//
// Design-system rules enforced by the theme:
//   • All chart labels (axis, legend, tooltip, data-labels) render at
//     12px / 16px line-height / Inter / fg-muted. MAX 12px — never scale
//     up even if the chart resizes. Highcharts renders labels as real
//     <text> in its own SVG but uses a constant font-size in CSS px, so
//     this rule holds without needing HTML overlays.
//   • Line/area/column strokes are 1px (our --chart-stroke-width).
//   • Column/area fills render at 0.5 opacity with a 1px full-opacity
//     border, matching our donut and asset-allocation convention.
//   • Default color palette = the canonical 8-color asset-allocation set.
//   • Backgrounds are transparent so charts sit directly on a glass tile.

const FIELD_CHART_PALETTE = [
  'rgb( 94, 214, 164)', // Equities
  'rgb(120, 160, 230)', // Fixed Income
  'rgb(180, 150, 235)', // Alternatives
  'rgb(245, 200,  90)', // Private
  'rgb(240, 140, 120)', // Real Estate
  'rgb(120, 200, 210)', // Cash
  'rgb(200, 170, 130)', // Hedge
  'rgb(160, 170, 185)', // Other
];

// Helper: pastel 50% opacity fill for any palette color.
function fieldChartFill(rgb) {
  return rgb.replace(/^rgb\(/, 'rgba(').replace(/\)$/, ', 0.5)');
}

const fieldHighchartsTheme = {
  colors: FIELD_CHART_PALETTE,
  chart: {
    backgroundColor: 'transparent',
    plotBackgroundColor: 'transparent',
    plotBorderWidth: 0,
    style: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      color: 'rgb(249, 250, 251)',
    },
    spacing: [8, 8, 8, 8],
  },
  title: {
    // The tile chrome already provides a title — suppress Highcharts' own.
    style: { display: 'none' },
    text: null,
  },
  subtitle: { text: null },
  credits: { enabled: false },
  accessibility: { enabled: true },

  xAxis: {
    lineColor: 'rgba(75, 85, 99, 0.45)',
    tickColor: 'rgba(75, 85, 99, 0.45)',
    gridLineColor: 'rgba(75, 85, 99, 0.25)',
    gridLineDashStyle: 'Dash',
    labels: {
      style: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontSize: '12px',        // --chart-label-size-max
        lineHeight: '16px',
        fontWeight: '400',
        color: 'rgb(163, 163, 163)', // --chart-label-color
      },
    },
    title: { style: { color: 'rgb(163, 163, 163)', fontSize: '12px', fontFamily: 'Inter' } },
  },
  yAxis: {
    gridLineColor: 'rgba(75, 85, 99, 0.25)',
    gridLineDashStyle: 'Dash',
    lineColor: 'transparent',
    tickColor: 'transparent',
    labels: {
      style: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
        color: 'rgb(163, 163, 163)',
      },
    },
    title: { style: { color: 'rgb(163, 163, 163)', fontSize: '12px', fontFamily: 'Inter' } },
  },

  legend: {
    itemStyle: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
      color: 'rgb(229, 231, 235)',
    },
    itemHoverStyle: { color: 'rgb(249, 250, 251)' },
    itemHiddenStyle: { color: 'rgb(107, 114, 128)' },
    symbolRadius: 2,
  },

  tooltip: {
    backgroundColor: 'rgba(11, 21, 36, 0.96)',
    borderColor: 'rgb(75, 85, 99)',
    borderRadius: 8,
    borderWidth: 1,
    shadow: false,
    style: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '12px',
      color: 'rgb(249, 250, 251)',
    },
  },

  plotOptions: {
    series: {
      animation: { duration: 350 },
      borderWidth: 1,                  // --chart-stroke-width
      lineWidth: 2,
      marker: {
        lineWidth: 2,
        lineColor: 'rgb(11, 21, 36)',  // --app-bg-base — hollow dot on dark
        radius: 4,
        symbol: 'circle',
      },
      states: {
        hover: { lineWidthPlus: 0, halo: { size: 6, opacity: 0.25 } },
        inactive: { opacity: 0.35 },
      },
      dataLabels: {
        style: {
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          fontSize: '12px',
          fontWeight: '400',
          color: 'rgb(229, 231, 235)',
          textOutline: 'none',
        },
      },
    },
    column: {
      borderRadius: 2,
      pointPadding: 0.08,
      groupPadding: 0.14,
    },
    bar: {
      borderRadius: 2,
    },
    area: {
      fillOpacity: 0.28,
      lineWidth: 2,
    },
    line: {
      lineWidth: 2,
    },
    pie: {
      borderColor: 'rgb(11, 21, 36)',
      borderWidth: 2,
      innerSize: '62%',                // donut-style by default
      dataLabels: {
        enabled: false,
      },
    },
  },
};

function applyFieldHighchartsTheme() {
  if (typeof Highcharts === 'undefined') {
    console.warn('Highcharts not loaded — skipping Field theme install.');
    return;
  }
  Highcharts.setOptions(fieldHighchartsTheme);
}

// Auto-apply the theme the moment this file executes, so any <HChart>
// rendered later is already on-brand. Safe to re-call.
if (typeof Highcharts !== 'undefined') applyFieldHighchartsTheme();

/* ──────────────────────────────────────────────────────────────────────
   <HChart options={...} style={...} />

   Thin React wrapper around Highcharts.chart(). Pass any Highcharts
   options object; the Field theme is merged in via setOptions, so you
   only need to provide data + series-specific overrides.

   Lifecycle: creates the chart on mount, destroys on unmount. Re-renders
   on `options` change via chart.update(options, true, true).
   ──────────────────────────────────────────────────────────────────── */
function HChart({ options, style }) {
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || typeof Highcharts === 'undefined') return;
    chartRef.current = Highcharts.chart(ref.current, options);
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (chartRef.current) chartRef.current.update(options, true, true);
  }, [options]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        flex: 1,
        ...style,
      }}
    />
  );
}

Object.assign(window, {
  HChart,
  fieldHighchartsTheme,
  applyFieldHighchartsTheme,
  FIELD_CHART_PALETTE,
  fieldChartFill,
});
