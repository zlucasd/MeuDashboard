import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultRotina } from '../data/defaultData'

const DAYS = [
  { id: 1, short: 'Seg', long: 'Segunda' },
  { id: 2, short: 'Ter', long: 'Terça' },
  { id: 3, short: 'Qua', long: 'Quarta' },
  { id: 4, short: 'Qui', long: 'Quinta' },
  { id: 5, short: 'Sex', long: 'Sexta' },
]

function todayDayOfWeek() {
  const d = new Date().getDay() // 0=Sun,1=Mon,...
  return d === 0 ? 7 : d // convert to 1=Mon,...,7=Sun
}

function EventPill({ event }) {
  return (
    <div className="rotina-pill" style={{ borderLeftColor: event.color }}>
      <div className="rotina-pill-title" style={{ color: event.color }}>{event.title}</div>
      <div className="rotina-pill-time">{event.start} – {event.end}</div>
      <span className={`rotina-type-badge ${event.type}`}>
        {event.type === 'aula' ? 'Aula' : 'Atividade'}
      </span>
    </div>
  )
}

export function RotinaSemanal() {
  const [rotina] = useLocalStorage('dashboard-rotina', defaultRotina)
  const today = todayDayOfWeek()

  return (
    <section className="section">
      <div className="section-header">
        <h2>Rotina Semanal</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Grade fixa de aulas e atividades</span>
      </div>

      <div className="rotina-obs">
        <span className="rotina-obs-icon">⚠️</span>
        <span>
          <strong>Esta semana:</strong> Monitoria Maker trocada para quinta 10h-12h e terça 10h-12h (compensando quarta com meu amor).
        </span>
      </div>

      <div className="rotina-grid">
        {DAYS.map(day => {
          const events = rotina
            .filter(e => e.day === day.id)
            .sort((a, b) => a.start.localeCompare(b.start))
          const isToday = day.id === today

          return (
            <div key={day.id} className={`rotina-day ${isToday ? 'rotina-day-today' : ''}`}>
              <div className="rotina-day-header">
                <span className="rotina-day-name">{day.long}</span>
                {isToday && <span className="rotina-today-badge">Hoje</span>}
              </div>
              <div className="rotina-day-events">
                {events.length > 0
                  ? events.map(e => <EventPill key={e.id} event={e} />)
                  : <span className="rotina-free">Livre</span>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
