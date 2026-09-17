/* App entry — wires everything together */

const PAGE_META = {
  dashboard:   { title: 'Firm Dashboard',   page: window.DashboardPage },
  goals:       { title: 'Company Goals',     page: window.GoalsPage },
  valuation:   { title: 'Firm Valuation',   page: window.ValuationPage },
  opportunities:{title: 'Opportunities',    page: window.OpportunitiesPage },
  positions:   { title: 'Positions & Holdings', page: window.PositionsPage },
  revenue:     { title: 'Revenue Summary',  page: window.RevenuePage },
  advisors:    { title: 'Advisors',         page: window.AdvisorsPage },
  geographics: { title: 'Geographics',      page: window.GeographicsPage },
  'manager-concentration': { title: 'Asset Manager Concentration', page: window.ManagerConcentrationPage },
  clients:     { title: 'Client List',      page: window.ClientListPage, props: { tab: 'list' } },
  'client-analytics': { title: 'Client Analytics', page: window.ClientListPage, props: { tab: 'analysis' } },
  'client-detail': { title: 'Client · David Young', page: window.ClientDetailPage, hideInNav: true },
};

const STUB_TITLES = {
  components: 'Components',
  help: 'Help & Support',
  settings: 'Settings',
};

function StubPage({ title }) {
  return (
    <div className="page-fade" style={{ padding: 48, display:'flex', alignItems:'center', justifyContent:'center', minHeight: 400 }}>
      <div className="glass-card" style={{ padding: 40, textAlign:'center', maxWidth: 420 }}>
        <div style={{ width: 48, height: 48, margin: '0 auto 16px', borderRadius: 12, background:'rgba(168,185,241,0.12)', border:'1px solid rgba(168,185,241,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="package" size={20} style={{ color:'rgb(168,185,241)' }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color:'rgb(249,250,251)', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color:'rgb(156,163,175)' }}>This page is stubbed in this prototype.</div>
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = React.useState(() => {
    try { return localStorage.getItem('firm.page') || 'dashboard'; } catch (e) { return 'dashboard'; }
  });
  React.useEffect(() => { try { localStorage.setItem('firm.page', active); } catch (e) {} }, [active]);

  /* Sidebar rail width — collapsed 56, expanded 240. Add 24px visible gap when expanded.
     The Sidebar emits a `firm:sidebarWidth` event on toggle so this animates in step. */
  const [railWidth, setRailWidth] = React.useState(() => {
    try { return localStorage.getItem('firm.nav.expanded') === '1' ? 240 : 56; } catch (e) { return 56; }
  });
  React.useEffect(() => {
    const onWidth = (e) => { const w = e && e.detail && e.detail.width; if (typeof w === 'number') setRailWidth(w); };
    window.addEventListener('firm:sidebarWidth', onWidth);
    return () => window.removeEventListener('firm:sidebarWidth', onWidth);
  }, []);
  const contentMarginLeft = railWidth;

  // Allow non-React code (e.g. row click handlers) to navigate via window event
  React.useEffect(() => {
    const handler = (e) => {
      const next = e && e.detail && e.detail.page;
      if (next) setActive(next);
    };
    window.addEventListener('firm:navigate', handler);
    return () => window.removeEventListener('firm:navigate', handler);
  }, []);

  const meta = PAGE_META[active];
  const Page = meta && meta.page;
  const stubTitle = STUB_TITLES[active];

  const isClientDetail = active === 'client-detail';

  // Client Detail topbar: back button + "David Young" + date + search by client
  const clientDetailTopbar = isClientDetail && (
    <PageTopbar
      title="David Young"
      searchPlaceholder="Search by clients"
      showDateRange={false}
      leading={
        <button
          onClick={() => {
            try {
              const back = localStorage.getItem('firm.cd.from') || 'clients';
              localStorage.removeItem('firm.cd.from');
              setActive(back);
            } catch (e) { setActive('clients'); }
          }}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(75,85,99,0.5)',
            color: 'rgb(229,231,235)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Back"
        >
          <i className="fa-solid fa-chevron-left" style={{ fontSize: 12 }} />
        </button>
      }
    />
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar active={active} onSelect={setActive} />
      <div style={{
        flex: 1, marginLeft: contentMarginLeft,
        display:'flex', flexDirection:'column', minWidth: 0,
        transition: 'margin-left 220ms cubic-bezier(0.22,0.61,0.36,1)',
      }}>
        {isClientDetail ? clientDetailTopbar : <PageTopbar title={meta ? meta.title : (stubTitle || '—')} />}
        <main style={{ flex: 1 }}>
          {Page ? <Page {...(meta && meta.props || {})} /> : <StubPage title={stubTitle || 'Coming Soon'} />}
        </main>
      </div>

      {/* AI FAB */}
      <button style={{
        position: 'fixed', right: 24, bottom: 24,
        width: 48, height: 48, borderRadius: 10,
        background: 'rgb(35,89,255)', color: '#fff',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4), 0 0 0 4px rgba(35,89,255,0.25)',
        cursor: 'pointer', zIndex: 50,
      }}>
        <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 18 }} />
      </button>

      {window.AccountMenu && <AccountMenu
        user={{ name:'Jane Cooper', role:'Admin · Firm Manager' }}
        view="firm" base="../" onSelect={setActive}
        expanded={railWidth > 100} width={railWidth - 16}
        left={railWidth > 100 ? 8 : Math.max(6, (railWidth - 46) / 2)} />}

      {/* Full-screen Rebalance opportunity flow */}
      {window.RebalanceFlow && <window.RebalanceFlow />}

      {/* Sarah Berry slide-out drawer */}
      {window.SarahBerryDrawer && <window.SarahBerryDrawer />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
