import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultRotina } from '../data/defaultData'

const START_H = 7
const END_H = 22
const PX_PER_HOUR = 64
const TOTAL_H = (END_H - START_H) * PX_PER_HOUR

const DAYS = [
  { id: 1, short: 'Seg', long: 'Segunda' },
  { id: 2, short: 'Ter', long: 'Terça' },
  { id: 3, short: 'Qua', long: 'Quarta' },
  { id: 4, short: 'Qui', long: 'Quinta' },
  { id: 5, short: 'Sex', long: 'Sexta' },
]

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6']

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minToTime(min) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

function toPx(minutes) {
  return ((minutes - START_H * 60) / 60) * PX_PER_HOUR
}

function durationPx(start, end) {
  return ((timeToMin(end) - timeToMin(start)) / 60) * PX_PER_HOUR
}

function calcFreeSlots(events) {
  const sorted = [...events].sort((a, b) => timeToMin(a.start) - timeToMin(b.start))
  const slots = []
  let cursor = START_H * 60
  for (const ev of sorted) {
    const s = timeToMin(ev.start)
    const e = timeToMin(ev.end)
    if (s - cursor >= 30) slots.push({ start: minToTime(cursor), end: minToTime(s) })
    cursor = Math.max(cursor, e)
  }
  if (END_H * 60 - cursor >= 30) slots.push({ start: minToTime(cursor), end: minToTime(END_H * 60) })
  return slots
}

function totalFreeMin(events) {
  return calcFreeSlots(events).reduce((acc, s) => acc + timeToMin(s.end) - timeToMin(s.start), 0)
}

function todayDOW() {
  const d = new Date().getDay()
  return d === 0 ? 7 : d
}

function nowMin() {
  const n = new Date()
  return n.getHours() * 60 + n.getMinutes()
}

/* ── Add Event Form ── */
function AddEventForm({ dayId, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [type, setType] = useState('aula')
  const [color, setColor] = useState(COLORS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !start || !end || timeToMin(end) <= timeToMin(start)) return
    onSave({ id: Date.now().toString(), title: title.trim(), day: dayId, start, end, type, color })
  }

  return (
    <form className="exam-form" onSubmit={handleSubmit}>
      <input className="form-input" placeholder="Nome do evento" value={title} onChange={e => setTitle(e.target.value)} required />
      <div className="form-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>De</span>
          <input className="form-input" type="time" value={start} onChange={e => setStart(e.target.value)} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Até</span>
          <input className="form-input" type="time" value={end} onChange={e => setEnd(e.target.value)} required />
        </div>
        <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
          <option value="aula">Aula</option>
          <option value="atividade">Atividade</option>
          <option value="pessoal">Pessoal</option>
        </select>
      </div>
      <div className="form-row">
        <div className="color-picker">
          {COLORS.map(c => (
            <button key={c} type="button" className={`color-dot ${color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
          ))}
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Salvar</button>
        </div>
      </div>
    </form>
  )
}

/* ── Day Column ── */
function DayColumn({ day, events, isToday, onDelete, addingDay, onAddClick, onAddSave, onAddCancel }) {
  const freeSlots = calcFreeSlots(events)
  const freeMin = totalFreeMin(events)
  const freeH = Math.floor(freeMin / 60)
  const freeM = freeMin % 60
  const freeLabel = freeH > 0 ? `${freeH}h${freeM > 0 ? freeM + 'min' : ''} livre${freeH !== 1 ? 's' : ''}` : `${freeM}min livre`

  const current = isToday ? nowMin() : null
  const isCurrentInRange = current !== null && current >= START_H * 60 && current <= END_H * 60

  return (
    <div className="timeline-day">
      <div className={`timeline-day-header ${isToday ? 'timeline-day-today' : ''}`}>
        <div>
          <div className="timeline-day-name">
            {day.short}
            {isToday && <span className="timeline-today-chip">Hoje</span>}
          </div>
          <div className="timeline-free-summary">{freeLabel}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => onAddClick(day.id)}>+</button>
      </div>

      {addingDay === day.id && (
        <AddEventForm dayId={day.id} onSave={onAddSave} onCancel={onAddCancel} />
      )}

      <div className="timeline-col" style={{ height: TOTAL_H }}>
        {/* Free slots */}
        {freeSlots.map((slot, i) => {
          const sMin = timeToMin(slot.start)
          const eMin = timeToMin(slot.end)
          const h = Math.floor((eMin - sMin) / 60)
          const m = (eMin - sMin) % 60
          return (
            <div
              key={i}
              className="timeline-free-block"
              style={{ top: toPx(sMin), height: durationPx(slot.start, slot.end) }}
            >
              <span className="tl-free-label">Livre</span>
              <span className="tl-free-time">{slot.start}–{slot.end}</span>
              <span className="tl-free-duration">{h > 0 ? `${h}h` : ''}{m > 0 ? `${m}min` : ''}</span>
            </div>
          )
        })}

        {/* Events */}
        {events.map(ev => (
          <div
            key={ev.id}
            className={`timeline-event tl-type-${ev.type}`}
            style={{
              top: toPx(timeToMin(ev.start)),
              height: Math.max(durationPx(ev.start, ev.end), 28),
              borderLeftColor: ev.color,
            }}
          >
            <div className="tl-event-title" style={{ color: ev.color }}>{ev.title}</div>
            <div className="tl-event-time">{ev.start}–{ev.end}</div>
            <button className="tl-event-delete" onClick={() => onDelete(ev.id)}>×</button>
          </div>
        ))}

        {/* Current time line */}
        {isCurrentInRange && (
          <div className="timeline-now-line" style={{ top: toPx(current) }}>
            <span className="timeline-now-dot" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Component ── */
export function RotinaSemanal() {
  const [rotina, setRotina] = useLocalStorage('dashboard-rotina', defaultRotina)
  const [addingDay, setAddingDay] = useState(null)
  const [, forceUpdate] = useState(0)
  const today = todayDOW()

  // refresh current time every minute
  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const handleDelete = (id) => setRotina(rotina.filter(e => e.id !== id))
  const handleAddSave = (event) => {
    setRotina([...rotina, event])
    setAddingDay(null)
  }

  const hours = Array.from({ length: END_H - START_H }, (_, i) => START_H + i)

  return (
    <section className="section">
      <div className="section-header">
        <h2>Rotina Semanal</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Clique em <strong>+</strong> para adicionar evento em qualquer dia
        </span>
      </div>

      <div className="rotina-obs">
        <span>⚠️</span>
        <span><strong>Esta semana:</strong> Monitoria Maker trocada para quinta 10h–12h e terça 10h–12h (compensa falta na quarta).</span>
      </div>

      <div className="timeline-wrapper">
        {/* Hour labels */}
        <div className="timeline-hours" style={{ height: TOTAL_H }}>
          {hours.map(h => (
            <div key={h} className="timeline-hour-label" style={{ top: toPx(h * 60) }}>
              {String(h).padStart(2, '0')}h
            </div>
          ))}
        </div>

        {/* Hour grid lines */}
        <div className="timeline-grid-lines" style={{ height: TOTAL_H }}>
          {hours.map(h => (
            <div key={h} className="timeline-grid-line" style={{ top: toPx(h * 60) }} />
          ))}
        </div>

        {/* Day columns */}
        <div className="timeline-days-row">
          {DAYS.map(day => (
            <DayColumn
              key={day.id}
              day={day}
              events={rotina.filter(e => e.day === day.id).sort((a, b) => timeToMin(a.start) - timeToMin(b.start))}
              isToday={day.id === today}
              onDelete={handleDelete}
              addingDay={addingDay}
              onAddClick={setAddingDay}
              onAddSave={handleAddSave}
              onAddCancel={() => setAddingDay(null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
