/* CalendarView — week-grid calendar inspired by Outlook layout.
   Dark surface, Field design system. Used for Upcoming Meetings "See more". */

function CalendarView({ onBack }) {
  const [view, setView] = React.useState('Week');
  const days = ['Sun 1', 'Mon 2', 'Tue 3', 'Wed 4', 'Thu 5', 'Fri 6', 'Sat 7'];
  const hours = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];

  // Each event: dayIdx (0..6), startHour (8..17 fractional), durationHrs, title, sub, tone
  const events = [
    { d:1, s:9,    h:1,   title:'Kyung Min Meeting', sub:'Quarterly review', tone:'green' },
    { d:1, s:14,   h:1,   title:'Team Sync',          sub:'Internal',          tone:'blue' },
    { d:2, s:13,   h:1,   title:'David Young Performance', sub:'1:1 review',  tone:'green' },
    { d:2, s:10.5, h:0.5, title:'Prep call',          sub:'Notes prep',        tone:'mute' },
    { d:3, s:13,   h:1,   title:'Market Outlook Discussion', sub:'Group',     tone:'blue' },
    { d:3, s:9,    h:1.5, title:'Whitfield review',   sub:'BCRED proposal',    tone:'amber' },
    { d:5, s:13,   h:1,   title:'Risk Management Review', sub:'Internal',     tone:'red' },
    { d:5, s:11,   h:1,   title:'Mira Aminoff intro', sub:'Discovery',         tone:'blue' },
    { d:0, s:13,   h:1,   title:'Legacy Planning Session', sub:'Family group',tone:'green' },
  ];

  const TONE = {
    green: { bg:'rgba(5,122,85,0.22)',  bd:'rgb(5,122,85)',   fg:'rgb(110,231,183)' },
    blue:  { bg:'rgba(59,130,246,0.18)',bd:'rgb(59,130,246)', fg:'rgb(147,197,253)' },
    amber: { bg:'rgba(234,179,8,0.18)', bd:'rgb(234,179,8)',  fg:'rgb(253,224,71)' },
    red:   { bg:'rgba(220,38,38,0.18)', bd:'rgb(220,38,38)',  fg:'rgb(248,113,113)' },
    mute:  { bg:'rgba(75,85,99,0.4)',   bd:'rgb(107,114,128)',fg:'rgb(229,231,235)' },
  };

  const HOUR_PX = 56;
  const START_HOUR = 8;

  return (
    <div style={{ padding:'16px 24px 32px', color:'rgb(249,250,251)' }}>
      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <button onClick={onBack} style={{
          height:30, padding:'0 12px', borderRadius:8, border:'1px solid rgb(75,85,99)',
          background:'transparent', color:'rgb(229,231,235)',
          fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
          display:'inline-flex', alignItems:'center', gap:6,
        }}>
          <i className="fa-solid fa-chevron-left" style={{ width:11, height:11 }} /> Back to Dashboard
        </button>
        <button style={{
          height:30, padding:'0 14px', borderRadius:8, border:'none',
          background:'rgb(5,122,85)', color:'#fff',
          fontFamily:'Inter', fontSize:12, fontWeight:600, cursor:'pointer',
          display:'inline-flex', alignItems:'center', gap:6, marginLeft:6,
        }}>
          <i className="fa-solid fa-plus" style={{ width:11, height:11 }} /> New event
        </button>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', alignItems:'center', gap:6, marginRight:8 }}>
          <button style={{ width:28, height:28, borderRadius:6, border:'1px solid rgb(75,85,99)', background:'transparent', color:'rgb(229,231,235)', cursor:'pointer' }}>
            <i className="fa-solid fa-chevron-left" style={{ width:11, height:11 }} />
          </button>
          <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, padding:'0 8px' }}>February 2026</div>
          <button style={{ width:28, height:28, borderRadius:6, border:'1px solid rgb(75,85,99)', background:'transparent', color:'rgb(229,231,235)', cursor:'pointer' }}>
            <i className="fa-solid fa-chevron-right" style={{ width:11, height:11 }} />
          </button>
        </div>
        <div style={{ display:'inline-flex', borderRadius:8, border:'1px solid rgb(75,85,99)', overflow:'hidden' }}>
          {['Day','Week','Month'].map(v => (
            <button key={v} onClick={()=>setView(v)} style={{
              height:30, padding:'0 14px', border:'none',
              background: v===view ? 'rgba(5,122,85,0.25)' : 'transparent',
              color: v===view ? 'rgb(249,250,251)' : 'rgb(163,163,163)',
              fontFamily:'Inter', fontSize:12, fontWeight:500, cursor:'pointer',
              borderRight: v!=='Month' ? '1px solid rgb(75,85,99)' : 'none',
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{
        background:'rgba(255,255,255,0.04)', border:'1px solid rgb(75,85,99)', borderRadius:14,
        overflow:'hidden',
      }}>
        {/* Day headers */}
        <div style={{ display:'grid', gridTemplateColumns:'72px repeat(7, 1fr)', borderBottom:'1px solid rgb(75,85,99)' }}>
          <div />
          {days.map((d,i) => {
            const isToday = i === 1;
            return (
              <div key={i} style={{
                padding:'12px 14px', fontFamily:'Inter', fontSize:12, fontWeight:600,
                color: isToday ? 'rgb(5,122,85)' : 'rgb(229,231,235)',
                borderLeft:'1px solid rgba(75,85,99,0.6)',
                background: isToday ? 'rgba(5,122,85,0.10)' : 'transparent',
              }}>
                {d}
              </div>
            );
          })}
        </div>

        {/* Hour rows + event layer */}
        <div style={{ position:'relative', display:'grid', gridTemplateColumns:'72px repeat(7, 1fr)' }}>
          {/* Hour gutter */}
          <div>
            {hours.map((h,i) => (
              <div key={i} style={{
                height:HOUR_PX, padding:'4px 10px', fontFamily:'Inter', fontSize:10.5,
                color:'rgb(163,163,163)', borderBottom:'1px solid rgba(75,85,99,0.45)',
                textAlign:'right', boxSizing:'border-box',
              }}>{h}</div>
            ))}
          </div>
          {/* Day columns */}
          {days.map((_,dayIdx) => (
            <div key={dayIdx} style={{
              position:'relative', borderLeft:'1px solid rgba(75,85,99,0.6)',
            }}>
              {hours.map((_,hi) => (
                <div key={hi} style={{
                  height:HOUR_PX, borderBottom:'1px solid rgba(75,85,99,0.35)',
                  background: hi%2 ? 'rgba(255,255,255,0.01)' : 'transparent',
                }} />
              ))}
              {/* Events for this day */}
              {events.filter(e => e.d === dayIdx).map((e,i) => {
                const t = TONE[e.tone];
                const top = (e.s - START_HOUR) * HOUR_PX;
                const height = e.h * HOUR_PX - 4;
                return (
                  <div key={i} style={{
                    position:'absolute', left:6, right:6, top, height,
                    background:t.bg, border:`1px solid ${t.bd}`, borderLeft:`3px solid ${t.bd}`,
                    borderRadius:8, padding:'6px 8px',
                    display:'flex', flexDirection:'column', gap:2,
                    overflow:'hidden', cursor:'pointer',
                  }}>
                    <div style={{ fontFamily:'Inter', fontSize:11.5, fontWeight:600, color:'rgb(249,250,251)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.title}</div>
                    <div style={{ fontFamily:'Inter', fontSize:10.5, color:t.fg, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.sub}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.CalendarView = CalendarView;
