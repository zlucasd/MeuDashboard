import { useState } from 'react'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getGrid(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) {
    cells.push({ date: new Date(year, month, 1 - firstDow + i), current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, cells.length - firstDow - daysInMonth + 1), current: false })
  }
  return cells
}

function eventsForDate(date, rotina, sporadic, exams) {
  const iso = toISO(date)
  const dow = date.getDay() // 0=Sun..6=Sat

  const rotinaEvs = (dow >= 1 && dow <= 5)
    ? rotina.filter(e => e.day === dow).map(e => ({ ...e, kind: 'rotina' }))
    : []
  const sporadicEvs = sporadic.filter(e => e.date === iso).map(e => ({ ...e, kind: 'sporadic' }))
  const examEvs = exams.filter(e => e.date === iso).map(e => ({
    id: e.id, title: e.subject, kind: 'exam', color: e.color || '#f87171',
    start: 'Prova', topics: e.topics,
  }))

  return [
    ...examEvs,
    ...sporadicEvs.sort((a,b) => a.start.localeCompare(b.start)),
    ...rotinaEvs.sort((a,b) => a.start.localeCompare(b.start)),
  ]
}

function EventDots({ events }) {
  const MAX = 3
  const visible = events.slice(0, MAX)
  const extra = events.length - MAX
  return (
    <div className="cal-dots">
      {visible.map((ev, i) => (
        <span key={i} className="cal-dot" style={{ background: ev.color || 'var(--accent)' }} />
      ))}
      {extra > 0 && <span className="cal-dot-more">+{extra}</span>}
    </div>
  )
}

export function MonthlyCalendar({ exams, rotina, sporadic }) {
  const now = new Date()
  const todayISO = toISO(now)
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(todayISO)

  const prevMonth = () => { if (month === 0) { setYear(y => y-1); setMonth(11) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y+1); setMonth(0) } else setMonth(m => m+1) }
  const goToday  = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelected(todayISO) }

  const grid = getGrid(year, month)
  const selectedEvents = selected
    ? eventsForDate(new Date(selected + 'T12:00:00'), rotina, sporadic, exams)
    : []

  return (
    <section className="section">
      <div className="section-header">
        <h2>Calendário</h2>
        <button className="btn btn-ghost btn-sm" onClick={goToday}>Hoje</button>
      </div>

      <div className="cal-nav">
        <button className="btn btn-ghost btn-sm" onClick={prevMonth}>‹</button>
        <span className="cal-nav-label">{MONTHS[month]} {year}</span>
        <button className="btn btn-ghost btn-sm" onClick={nextMonth}>›</button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map(d => <div key={d} className="cal-weekday">{d}</div>)}

        {grid.map(({ date, current }, i) => {
          const iso  = toISO(date)
          const evs  = eventsForDate(date, rotina, sporadic, exams)
          const isToday    = iso === todayISO
          const isSelected = iso === selected
          const hasExam    = evs.some(e => e.kind === 'exam')
          const hasSporadic = evs.some(e => e.kind === 'sporadic')

          return (
            <div
              key={i}
              className={[
                'cal-day',
                !current     && 'cal-day-other',
                isToday      && 'cal-day-today',
                isSelected   && 'cal-day-selected',
                evs.length   && 'cal-day-busy',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelected(iso === selected ? null : iso)}
            >
              <span className={[
                'cal-day-num',
                hasExam    && 'cal-num-exam',
                hasSporadic && !hasExam && 'cal-num-sporadic',
              ].filter(Boolean).join(' ')}>
                {date.getDate()}
              </span>
              {evs.length > 0 && <EventDots events={evs} />}
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="cal-detail">
          <div className="cal-detail-header">
            <span className="cal-detail-date">
              {new Date(selected + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long', day: 'numeric', month: 'long'
              })}
            </span>
            {selected === todayISO && <span className="cal-today-badge">Hoje</span>}
          </div>

          {selectedEvents.length === 0
            ? <p className="cal-empty">Nenhum evento neste dia.</p>
            : (
              <ul className="cal-event-list">
                {selectedEvents.map((ev, i) => (
                  <li key={i} className={`cal-event-item cal-ev-${ev.kind}`}>
                    <span className="cal-ev-dot" style={{ background: ev.color || 'var(--accent)' }} />
                    <div className="cal-ev-body">
                      <span className="cal-ev-title">{ev.title}</span>
                      <div className="cal-ev-meta">
                        {ev.kind === 'exam' && (
                          <span className="cal-ev-badge ev-badge-exam">🎯 Prova{ev.topics ? ` — ${ev.topics}` : ''}</span>
                        )}
                        {ev.kind === 'sporadic' && (
                          <span className="cal-ev-badge ev-badge-sporadic">⚡ Extra</span>
                        )}
                        {ev.kind === 'rotina' && (
                          <span className="cal-ev-badge ev-badge-rotina">Rotina</span>
                        )}
                        {ev.start && ev.kind !== 'exam' && (
                          <span className="cal-ev-time">{ev.start}{ev.end ? ` – ${ev.end}` : ''}</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          }
        </div>
      )}
    </section>
  )
}
