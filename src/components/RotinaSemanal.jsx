import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultRotina } from '../data/defaultData'

const DAYS = [
  { id: 1, short: 'Seg', long: 'Segunda' },
  { id: 2, short: 'Ter', long: 'Terça' },
  { id: 3, short: 'Qua', long: 'Quarta' },
  { id: 4, short: 'Qui', long: 'Quinta' },
  { id: 5, short: 'Sex', long: 'Sexta' },
]

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6']

function todayDOW() {
  const d = new Date().getDay()
  return d === 0 ? 7 : d
}

function AddEventForm({ dayName, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [type, setType] = useState('aula')
  const [color, setColor] = useState(COLORS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !start || !end) return
    onSave({ id: Date.now().toString(), title: title.trim(), start, end, type, color })
  }

  return (
    <div className="week-add-form">
      <span className="week-add-form-title">Adicionar evento — {dayName}</span>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
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
    </div>
  )
}

function DayCard({ day, events, isToday, onDelete, onAddClick }) {
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div className={`week-day-card ${isToday ? 'week-day-today' : ''}`}>
      <div className="week-day-header">
        <span className="week-day-name">{day.long}</span>
        <button className="week-day-add" onClick={onAddClick} title="Adicionar evento">+</button>
      </div>
      <div className="week-day-events">
        {sorted.length === 0 && <span className="week-day-empty">Sem eventos</span>}
        {sorted.map(ev => (
          <div key={ev.id} className="week-event" style={{ borderLeftColor: ev.color }}>
            <div className="week-event-name" style={{ color: ev.color }}>{ev.title}</div>
            <div className="week-event-time">{ev.start} – {ev.end}</div>
            <span className={`week-event-type type-${ev.type}`}>
              {ev.type === 'aula' ? 'Aula' : ev.type === 'atividade' ? 'Atividade' : 'Pessoal'}
            </span>
            <button className="week-event-del" onClick={() => onDelete(ev.id)} title="Remover">×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RotinaSemanal() {
  const [rotina, setRotina] = useLocalStorage('dashboard-rotina', defaultRotina)
  const [addingDay, setAddingDay] = useState(null)
  const today = todayDOW()

  const handleDelete = (id) => setRotina(rotina.filter(e => e.id !== id))

  const handleAddSave = (event) => {
    setRotina([...rotina, { ...event, day: addingDay }])
    setAddingDay(null)
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>Rotina Semanal</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Clique em <strong>+</strong> para adicionar evento
        </span>
      </div>

      <div className="rotina-obs">
        <span>⚠️</span>
        <span>
          <strong>Esta semana:</strong> Monitoria Maker trocada para quinta 10h–12h e terça 10h–12h.
        </span>
      </div>

      <div className="week-grid">
        {DAYS.map(day => (
          <DayCard
            key={day.id}
            day={day}
            events={rotina.filter(e => e.day === day.id)}
            isToday={day.id === today}
            onDelete={handleDelete}
            onAddClick={() => setAddingDay(day.id)}
          />
        ))}
      </div>

      {addingDay && (
        <AddEventForm
          dayName={DAYS.find(d => d.id === addingDay)?.long}
          onSave={handleAddSave}
          onCancel={() => setAddingDay(null)}
        />
      )}
    </section>
  )
}
