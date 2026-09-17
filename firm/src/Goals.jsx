/* Company Goals — firm-level strategic goals the manager can customize and
   track. Distinct from the Dashboard's product-line widget: these are the
   whole-firm objectives (AUM, revenue, households, valuation, team, service).
   Add / edit / update-progress / delete; everything persists to localStorage. */

const GOAL_CATEGORIES = [
  { id: 'assets',    label: 'Assets',    badge: 'green',  dot: 'rgb(168,185,241)' },
  { id: 'revenue',   label: 'Revenue',   badge: 'teal',   dot: 'rgb(120,200,210)' },
  { id: 'clients',   label: 'Clients',   badge: 'blue',   dot: 'rgb(120,160,230)' },
  { id: 'valuation', label: 'Valuation', badge: 'purple', dot: 'rgb(180,150,235)' },
  { id: 'team',      label: 'Team',      badge: 'amber',  dot: 'rgb(245,200,90)' },
  { id: 'service',   label: 'Service',   badge: 'coral',  dot: 'rgb(240,140,120)' },
];
const catOf = (id) => GOAL_CATEGORIES.find(c => c.id === id) || GOAL_CATEGORIES[0];

const FORMATS = ['$M', '$K', '%', '#'];

const DEFAULT_GOALS = [
  { id: 'g1', name: 'Grow firm AUM',            cat: 'assets',    owner: 'Firm',          fmt: '$M', dir: 'up', start: 680,  current: 734,  target: 850,  periodStart: '2026-01-01', deadline: '2026-12-31' },
  { id: 'g2', name: 'Recurring revenue',         cat: 'revenue',   owner: 'Firm',          fmt: '$M', dir: 'up', start: 7.4,  current: 8.5,  target: 10,   periodStart: '2026-01-01', deadline: '2026-12-31' },
  { id: 'g3', name: 'Client households',         cat: 'clients',   owner: 'Firm',          fmt: '#',  dir: 'up', start: 1560, current: 1726, target: 1900, periodStart: '2026-01-01', deadline: '2026-12-31' },
  { id: 'g4', name: 'Enterprise value',          cat: 'valuation', owner: 'Managing Partner', fmt: '$M', dir: 'up', start: 26, current: 29.8, target: 40,  periodStart: '2026-01-01', deadline: '2027-06-30' },
  { id: 'g5', name: 'Financial planning adoption',cat: 'service',  owner: 'Sarah Berry',   fmt: '%',  dir: 'up', start: 42,   current: 49,   target: 65,   periodStart: '2026-01-01', deadline: '2026-12-31' },
  { id: 'g6', name: 'Advisor headcount',         cat: 'team',      owner: 'Nick James',    fmt: '#',  dir: 'up', start: 9,    current: 11,   target: 14,   periodStart: '2026-01-01', deadline: '2026-12-31' },
  { id: 'g7', name: 'Client retention rate',     cat: 'clients',   owner: 'Firm',          fmt: '%',  dir: 'up', start: 94,   current: 95.4, target: 97,   periodStart: '2026-01-01', deadline: '2026-12-31' },
];

/* ---- value formatting ---- */
function trimNum(v) {
  const r = Math.round(v * 10) / 10;
  return (Number.isInteger(r) ? r.toString() : r.toFixed(1));
}
function fmtGoal(v, fmt) {
  if (v == null || isNaN(v)) return '—';
  if (fmt === '$M') return '$' + trimNum(v) + 'M';
  if (fmt === '$K') return '$' + trimNum(v) + 'K';
  if (fmt === '%')  return trimNum(v) + '%';
  return Math.round(v).toLocaleString();
}

/* ---- progress + pacing ---- */
function goalProgress(g) {
  const span = g.dir === 'down' ? (g.start - g.target) : (g.target - g.start);
  if (!span) return 1;
  const done = g.dir === 'down' ? (g.start - g.current) : (g.current - g.start);
  return Math.max(0, done / span);
}
function goalPace(g) {
  const s = new Date(g.periodStart || g.deadline).getTime();
  const e = new Date(g.deadline).getTime();
  const now = Date.now();
  if (!e || e <= s) return 1;
  return Math.max(0, Math.min(1, (now - s) / (e - s)));
}
function goalStatus(g) {
  const p = goalProgress(g);
  if (p >= 1) return { label: 'Achieved', badge: 'green', fill: 'rgb(168,185,241)', icon: 'circle-check' };
  const diff = p - goalPace(g);
  if (diff >= 0.05)  return { label: 'Ahead',    badge: 'teal',  fill: 'rgb(120,200,210)' };
  if (diff >= -0.05) return { label: 'On track', badge: 'green', fill: 'rgb(168,185,241)' };
  if (diff >= -0.18) return { label: 'At risk',  badge: 'amber', fill: 'rgb(245,200,90)' };
  return { label: 'Behind', badge: 'red', fill: 'rgb(248,113,113)' };
}
function fmtDeadline(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/* ============================ Goal card ============================ */
function GoalCard({ g, onEdit }) {
  const cat = catOf(g.cat);
  const st = goalStatus(g);
  const p = goalProgress(g);
  const pace = goalPace(g);
  const pctLabel = Math.round(Math.min(p, 1) * 100);
  const remaining = g.dir === 'down' ? (g.current - g.target) : (g.target - g.current);
  const remainingLabel = p >= 1 ? 'Target reached' : `${fmtGoal(Math.abs(remaining), g.fmt)} to go`;

  return (
    <div className="glass-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <Badge color={cat.badge}><span style={{ width: 7, height: 7, borderRadius: 9999, background: cat.dot, display: 'inline-block' }} />{cat.label}</Badge>
        <Badge color={st.badge}>{st.icon && <i className={`fa-solid fa-${st.icon}`} style={{ fontSize: 9 }} />}{st.label}</Badge>
      </div>

      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'rgb(249,250,251)', letterSpacing: '-0.01em' }}>{g.name}</div>
        <div style={{ fontSize: 11.5, color: 'rgb(156,163,175)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fa-solid fa-user" style={{ fontSize: 9, opacity: 0.7 }} />{g.owner}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="num" style={{ fontSize: 24, fontWeight: 800, color: 'rgb(229,231,235)', letterSpacing: '-0.02em' }}>{fmtGoal(g.current, g.fmt)}</span>
          <span className="num" style={{ fontSize: 13, color: 'rgb(156,163,175)' }}>/ {fmtGoal(g.target, g.fmt)}</span>
        </div>
        <span className="num" style={{ fontSize: 15, fontWeight: 700, color: st.fill }}>{pctLabel}%</span>
      </div>

      {/* progress bar with pace marker */}
      <div>
        <div style={{ position: 'relative', height: 8, borderRadius: 9999, background: 'rgba(75,85,99,0.35)', overflow: 'visible' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(p, 1) * 100}%`, height: '100%', background: st.fill, borderRadius: 9999, transition: 'width 300ms ease' }} />
          </div>
          {pace > 0 && pace < 1 && p < 1 && (
            <div title="Where you should be today" style={{ position: 'absolute', top: -3, bottom: -3, left: `${pace * 100}%`, width: 2, background: 'rgb(229,231,235)', borderRadius: 2, transform: 'translateX(-1px)' }} />
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'rgb(156,163,175)' }}>
          <span>{remainingLabel}</span>
          <span><i className="fa-solid fa-flag-checkered" style={{ fontSize: 9, opacity: 0.7, marginRight: 4 }} />Due {fmtDeadline(g.deadline)}</span>
        </div>
      </div>

      <button onClick={() => onEdit(g)} className="row-hover" style={{
        marginTop: 2, height: 32, borderRadius: 8, cursor: 'pointer',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(75,85,99,0.5)',
        color: 'rgb(209,213,219)', fontSize: 12, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      }}>
        <i className="fa-solid fa-sliders" style={{ fontSize: 11 }} />Update / edit
      </button>
    </div>
  );
}

/* ====================== Edit / add goal drawer ====================== */
const goalInput = () => ({
  width: '100%', height: 38, borderRadius: 8, padding: '0 12px', boxSizing: 'border-box',
  background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(75,85,99,0.5)',
  color: 'rgb(229,231,235)', fontSize: 13, fontFamily: 'Inter, sans-serif', colorScheme: 'dark',
});
const goalLabel = () => ({ fontSize: 11.5, fontWeight: 600, color: 'rgb(209,213,219)', marginBottom: 7, display: 'block' });

function GoalEditDrawer({ open, goal, isNew, onClose, onSave, onDelete }) {
  const [d, setD] = React.useState(goal);
  React.useEffect(() => { setD(goal); }, [goal]);
  if (!d) return null;
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const setNum = (k, v) => setD(prev => ({ ...prev, [k]: v === '' ? '' : parseFloat(v) }));
  const st = goalStatus(d);
  const valid = d.name && d.name.trim() && d.target !== '' && d.current !== '';

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {!isNew && <button onClick={() => onDelete(d.id)} aria-label="Delete goal" style={{ height: 38, width: 42, borderRadius: 9, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)', color: 'rgb(248,113,113)', cursor: 'pointer', fontSize: 13 }}><i className="fa-solid fa-trash-can" /></button>}
      <button onClick={onClose} style={{ flex: 1, height: 38, borderRadius: 9, background: 'transparent', border: '1px solid rgba(75,85,99,0.6)', color: 'rgb(209,213,219)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
      <button disabled={!valid} onClick={() => onSave(d)} style={{ flex: 2, height: 38, borderRadius: 9, background: valid ? 'rgb(35,89,255)' : 'rgba(35,89,255,0.4)', border: '1px solid rgb(35,89,255)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: valid ? 'pointer' : 'not-allowed' }}>{isNew ? 'Create goal' : 'Save changes'}</button>
    </div>
  );

  return (
    <DrawerShell open={open} onClose={onClose} title={isNew ? 'New goal' : 'Update goal'} subtitle={isNew ? 'Define a firm objective to track' : d.name} width="min(520px, 94vw)" footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* live progress preview */}
        {!isNew && (
          <div style={{ border: `1px solid ${st.fill}55`, borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Badge color={st.badge}>{st.icon && <i className={`fa-solid fa-${st.icon}`} style={{ fontSize: 9 }} />}{st.label}</Badge>
              <span className="num" style={{ fontSize: 14, fontWeight: 700, color: st.fill }}>{Math.round(Math.min(goalProgress(d), 1) * 100)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 9999, background: 'rgba(75,85,99,0.35)', overflow: 'hidden', marginTop: 10 }}>
              <div style={{ width: `${Math.min(goalProgress(d), 1) * 100}%`, height: '100%', background: st.fill, borderRadius: 9999, transition: 'width 200ms ease' }} />
            </div>
          </div>
        )}

        <div>
          <label style={goalLabel()}>Goal name</label>
          <input value={d.name || ''} onChange={e => set('name', e.target.value)} placeholder="e.g. Grow firm AUM" style={goalInput()} />
        </div>

        <div>
          <label style={goalLabel()}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {GOAL_CATEGORIES.map(c => {
              const on = d.cat === c.id;
              return (
                <button key={c.id} onClick={() => set('cat', c.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', borderRadius: 9999, cursor: 'pointer',
                  border: `1px solid ${on ? c.dot : 'rgba(75,85,99,0.5)'}`, background: on ? `${c.dot}22` : 'transparent',
                  color: on ? 'rgb(249,250,251)' : 'rgb(156,163,175)', fontSize: 12, fontWeight: 500,
                }}><span style={{ width: 7, height: 7, borderRadius: 9999, background: c.dot }} />{c.label}</button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={goalLabel()}>Owner</label>
          <input value={d.owner || ''} onChange={e => set('owner', e.target.value)} placeholder="Firm, or an advisor" style={goalInput()} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={goalLabel()}>Units</label>
            <div style={{ display: 'flex', border: '1px solid rgba(75,85,99,0.6)', borderRadius: 8, overflow: 'hidden' }}>
              {FORMATS.map(f => (
                <button key={f} onClick={() => set('fmt', f)} style={{ flex: 1, height: 38, border: 'none', borderRight: f !== '#' ? '1px solid rgba(75,85,99,0.4)' : 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, background: d.fmt === f ? 'rgba(168,185,241,0.18)' : 'transparent', color: d.fmt === f ? 'rgb(168,185,241)' : 'rgb(156,163,175)' }}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={goalLabel()}>Direction</label>
            <div style={{ display: 'flex', border: '1px solid rgba(75,85,99,0.6)', borderRadius: 8, overflow: 'hidden' }}>
              {[['up', 'Increase'], ['down', 'Decrease']].map(([k, l]) => (
                <button key={k} onClick={() => set('dir', k)} style={{ flex: 1, height: 38, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, background: (d.dir || 'up') === k ? 'rgba(168,185,241,0.18)' : 'transparent', color: (d.dir || 'up') === k ? 'rgb(168,185,241)' : 'rgb(156,163,175)' }}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={goalLabel()}>Starting</label>
            <input type="number" value={d.start ?? ''} onChange={e => setNum('start', e.target.value)} className="num" style={goalInput()} />
          </div>
          <div>
            <label style={{ ...goalLabel(), color: 'rgb(168,185,241)' }}>Current</label>
            <input type="number" value={d.current ?? ''} onChange={e => setNum('current', e.target.value)} className="num" style={{ ...goalInput(), borderColor: 'rgba(168,185,241,0.45)' }} />
          </div>
          <div>
            <label style={goalLabel()}>Target</label>
            <input type="number" value={d.target ?? ''} onChange={e => setNum('target', e.target.value)} className="num" style={goalInput()} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={goalLabel()}>Period start</label>
            <input type="date" value={d.periodStart || ''} onChange={e => set('periodStart', e.target.value)} style={goalInput()} />
          </div>
          <div>
            <label style={goalLabel()}>Target date</label>
            <input type="date" value={d.deadline || ''} onChange={e => set('deadline', e.target.value)} style={goalInput()} />
          </div>
        </div>
      </div>
    </DrawerShell>
  );
}

/* ============================ Page ============================ */
function newGoalTemplate() {
  return { id: 'g' + Date.now(), name: '', cat: 'assets', owner: 'Firm', fmt: '$M', dir: 'up', start: 0, current: 0, target: 0, periodStart: '2026-01-01', deadline: '2026-12-31' };
}

function GoalsPage() {
  const [goals, setGoals] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem('firm.goals')); if (Array.isArray(s) && s.length) return s; } catch (e) {}
    return DEFAULT_GOALS;
  });
  const [editing, setEditing] = React.useState(null);  // goal object being edited
  const [isNew, setIsNew] = React.useState(false);

  React.useEffect(() => {
    try { localStorage.setItem('firm.goals', JSON.stringify(goals)); } catch (e) {}
  }, [goals]);

  const openEdit = (g) => { setIsNew(false); setEditing(g); };
  const openNew  = () => { setIsNew(true); setEditing(newGoalTemplate()); };
  const save = (g) => {
    setGoals(prev => prev.some(x => x.id === g.id) ? prev.map(x => x.id === g.id ? g : x) : [...prev, g]);
    setEditing(null);
  };
  const del = (id) => { setGoals(prev => prev.filter(x => x.id !== id)); setEditing(null); };

  const statuses = goals.map(goalStatus);
  const achieved = statuses.filter(s => s.label === 'Achieved').length;
  const onTrack  = statuses.filter(s => s.label === 'On track' || s.label === 'Ahead').length;
  const atRisk   = statuses.filter(s => s.label === 'At risk' || s.label === 'Behind').length;
  const avg = goals.length ? Math.round(goals.reduce((s, g) => s + Math.min(goalProgress(g), 1), 0) / goals.length * 100) : 0;

  return (
    <div className="page-fade" style={{ padding: 24 }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(168,185,241,0.12)', border: '1px solid rgba(168,185,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-solid fa-bullseye" style={{ fontSize: 20, color: 'rgb(168,185,241)' }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'rgb(249,250,251)', letterSpacing: '-0.01em' }}>Company Goals</div>
            <div style={{ fontSize: 12.5, color: 'rgb(156,163,175)', marginTop: 2 }}>Firm objectives for the year · {goals.length} active · {avg}% avg progress</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgb(156,163,175)' }}><span style={{ width: 8, height: 8, borderRadius: 9999, background: 'rgb(168,185,241)' }} />{onTrack + achieved} on track</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgb(156,163,175)' }}><span style={{ width: 8, height: 8, borderRadius: 9999, background: 'rgb(245,200,90)' }} />{atRisk} need attention</span>
          </div>
          <button onClick={openNew} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', borderRadius: 10, background: 'rgb(35,89,255)', border: '1px solid rgb(35,89,255)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <i className="fa-solid fa-plus" style={{ fontSize: 11 }} />New goal
          </button>
        </div>
      </div>

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatTile label="ACTIVE GOALS" value={String(goals.length)} sub="firm-wide objectives" />
        <StatTile label="AVG PROGRESS" value={avg + '%'} valueColor="rgb(168,185,241)" sub="across all goals" />
        <StatTile label="ON TRACK" value={String(onTrack + achieved)} valueColor="rgb(168,185,241)" sub={`${achieved} already achieved`} />
        <StatTile label="NEED ATTENTION" value={String(atRisk)} valueColor={atRisk ? 'rgb(245,200,90)' : 'rgb(249,250,251)'} sub="at risk or behind pace" />
      </div>

      {/* Goal grid */}
      {goals.length === 0 ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(249,250,251)' }}>No goals yet</div>
          <div style={{ fontSize: 12.5, color: 'rgb(156,163,175)', marginTop: 6, marginBottom: 16 }}>Create your first firm objective to start tracking progress.</div>
          <button onClick={openNew} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', borderRadius: 10, background: 'rgb(35,89,255)', border: '1px solid rgb(35,89,255)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><i className="fa-solid fa-plus" style={{ fontSize: 11 }} />New goal</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {goals.map(g => <GoalCard key={g.id} g={g} onEdit={openEdit} />)}
        </div>
      )}

      <GoalEditDrawer open={editing !== null} goal={editing} isNew={isNew} onClose={() => setEditing(null)} onSave={save} onDelete={del} />
    </div>
  );
}

window.GoalsPage = GoalsPage;
