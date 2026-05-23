import { useState } from 'react'

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

// returns Mon–Fri Date objects for the week at offset (0 = current, 1 = next, -1 = prev)
function getWeekDates(offset = 0) {
  const today = new Date()
  const dow = today.getDay()
  const toMon = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + toMon + offset * 7)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function dateToISO(d) {
  return d.toISOString().slice(0, 10)
}

function formatWeekLabel(dates) {
  const fmt = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  return `${fmt(dates[0])} – ${fmt(dates[4])}`
}

function AddEventForm({ title, dayLabel, sporadic, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [type, setType] = useState(sporadic ? 'evento' : 'aula')
  const [color, setColor] = useState(sporadic ? '#fbbf24' : COLORS[0])
  const [date, setDate] = useState(dayLabel ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !start || !end) return
    onSave({ id: Date.now().toString(), title: name.trim(), start, end, type, color, ...(sporadic ? { date } : {}) })
  }

  return (
    <div className="week-add-form">
      <span className="week-add-form-title">
        {sporadic ? '⚡ Adicionar evento esporádico' : `Adicionar evento — ${title}`}
      </span>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <input className="form-input" placeholder="Nome do evento" value={name} onChange={e => setName(e.target.value)} required />
        <div className="form-row">
          {sporadic && (
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>De</span>
            <input className="form-input" type="time" value={start} onChange={e => setStart(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Até</span>
            <input className="form-input" type="time" value={end} onChange={e => setEnd(e.target.value)} required />
          </div>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            {sporadic
              ? <><option value="evento">Evento</option><option value="pessoal">Pessoal</option><option value="atividade">Atividade</option></>
              : <><option value="aula">Aula</option><option value="atividade">Atividade</option><option value="pessoal">Pessoal</option></>}
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

function DayCard({ day, date, recurringEvents, sporadicEvents, isToday, onDeleteRecurring, onDeleteSporadic, onAddClick }) {
  const allEvents = [
    ...recurringEvents.sort((a, b) => a.start.localeCompare(b.start)).map(e => ({ ...e, kind: 'recurring' })),
    ...sporadicEvents.sort((a, b) => a.start.localeCompare(b.start)).map(e => ({ ...e, kind: 'sporadic' })),
  ].sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div className={`week-day-card ${isToday ? 'week-day-today' : ''}`}>
      <div className="week-day-header">
        <div>
          <div className="week-day-name">{day.short}</div>
          {date && <div className="week-day-date">{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>}
        </div>
        <button className="week-day-add" onClick={onAddClick} title="Adicionar">+</button>
      </div>
      <div className="week-day-events">
        {allEvents.length === 0 && <span className="week-day-empty">Sem eventos</span>}
        {allEvents.map(ev =>
          ev.kind === 'sporadic' ? (
            <div key={ev.id} className="week-event-sporadic">
              <div className="week-event-sporadic-badge">⚡ EXTRA</div>
              <div className="week-event-name" style={{ color: ev.color ?? 'var(--sporadic)' }}>{ev.title}</div>
              <div className="week-event-time">{ev.start} – {ev.end}</div>
              <span className={`week-event-type type-${ev.type}`}>{ev.type}</span>
              <button className="week-event-del" onClick={() => onDeleteSporadic(ev.id)}>×</button>
            </div>
          ) : (
            <div key={ev.id} className="week-event" style={{ borderLeftColor: ev.color }}>
              <div className="week-event-name" style={{ color: ev.color }}>{ev.title}</div>
              <div className="week-event-time">{ev.start} – {ev.end}</div>
              <span className={`week-event-type type-${ev.type}`}>{ev.type === 'aula' ? 'Aula' : ev.type === 'atividade' ? 'Atividade' : 'Pessoal'}</span>
              <button className="week-event-del" onClick={() => onDeleteRecurring(ev.id)}>×</button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export function RotinaSemanal({ rotina, setRotina, sporadic, setSporadic }) {
  const [tab, setTab] = useState('fixa')
  const [weekOffset, setWeekOffset] = useState(0)
  const [addingDay, setAddingDay] = useState(null) // { dayId, dayDate, isSporadic }

  const today = todayDOW()
  const weekDates = getWeekDates(weekOffset)

  const handleAddRecurring = (event) => {
    setRotina([...rotina, { ...event, day: addingDay.dayId }])
    setAddingDay(null)
  }

  const handleAddSporadic = (event) => {
    setSporadic([...sporadic, event])
    setAddingDay(null)
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>Rotina Semanal</h2>
        {tab === 'alterada' && (
          <button className="btn btn-primary btn-sm" onClick={() => setAddingDay({ isSporadic: true })}>
            ⚡ Evento extra
          </button>
        )}
      </div>

      <div className="rotina-obs">
        <span>⚠️</span>
        <span><strong>Esta semana:</strong> Monitoria Maker trocada para quinta e terça 10h–12h.</span>
      </div>

      <div className="rotina-subtabs">
        <button className={`rotina-subtab ${tab === 'fixa' ? 'active' : ''}`} onClick={() => setTab('fixa')}>
          Rotina Fixa
        </button>
        <button className={`rotina-subtab ${tab === 'alterada' ? 'active' : ''}`} onClick={() => setTab('alterada')}>
          Rotina Alterada
          {sporadic.length > 0 && (
            <span style={{ marginLeft: '0.375rem', background: 'var(--sporadic)', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '999px' }}>
              {sporadic.length}
            </span>
          )}
        </button>
      </div>

      {/* Week navigation — only in Rotina Alterada */}
      {tab === 'alterada' && (
        <div className="week-nav">
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(o => o - 1)}>‹ Anterior</button>
          <span className="week-nav-label">
            {weekOffset === 0 ? 'Semana atual · ' : weekOffset === 1 ? 'Próxima semana · ' : weekOffset === -1 ? 'Semana passada · ' : `Semana +${weekOffset} · `}
            {formatWeekLabel(weekDates)}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(o => o + 1)}>Próxima ›</button>
        </div>
      )}

      <div className="week-grid-scroll">
      <div className="week-grid">
        {DAYS.map((day, i) => {
          const date = tab === 'alterada' ? weekDates[i] : null
          const isoDate = date ? dateToISO(date) : null
          const isToday = tab === 'alterada'
            ? (date && dateToISO(date) === dateToISO(new Date()))
            : day.id === today

          const sporadicForDay = isoDate
            ? sporadic.filter(e => e.date === isoDate)
            : []

          return (
            <DayCard
              key={day.id}
              day={day}
              date={date}
              recurringEvents={rotina.filter(e => e.day === day.id)}
              sporadicEvents={tab === 'alterada' ? sporadicForDay : []}
              isToday={!!isToday}
              onDeleteRecurring={id => setRotina(rotina.filter(e => e.id !== id))}
              onDeleteSporadic={id => setSporadic(sporadic.filter(e => e.id !== id))}
              onAddClick={() => setAddingDay({ dayId: day.id, dayDate: isoDate, isSporadic: tab === 'alterada' })}
            />
          )
        })}
      </div>
      </div>

      {addingDay && (
        addingDay.isSporadic
          ? <AddEventForm sporadic dayLabel={addingDay.dayDate} onSave={handleAddSporadic} onCancel={() => setAddingDay(null)} />
          : <AddEventForm title={DAYS.find(d => d.id === addingDay.dayId)?.long} onSave={handleAddRecurring} onCancel={() => setAddingDay(null)} />
      )}
    </section>
  )
}
