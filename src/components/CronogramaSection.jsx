function daysUntil(dateStr) {
  const today = new Date(new Date().toDateString())
  const exam = new Date(dateStr + 'T00:00:00')
  return Math.ceil((exam - today) / (1000 * 60 * 60 * 24))
}

function urgencyColor(days) {
  if (days < 0) return '#94a3b8'
  if (days === 0) return '#ef4444'
  if (days <= 3) return '#ef4444'
  if (days <= 7) return '#f59e0b'
  if (days <= 14) return '#3b82f6'
  return '#10b981'
}

function urgencyLabel(days) {
  if (days < 0) return 'Realizada'
  if (days === 0) return 'HOJE'
  if (days === 1) return 'Amanhã'
  if (days <= 3) return 'Urgente'
  if (days <= 7) return 'Esta semana'
  if (days <= 14) return 'Em breve'
  return 'Tranquilo'
}

function progressPercent(days) {
  if (days <= 0) return 100
  if (days >= 60) return 2
  return Math.round(((60 - days) / 60) * 100)
}

export function CronogramaSection({ exams }) {
  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date))
  const upcoming = sorted.filter(e => daysUntil(e.date) >= 0)
  const past = sorted.filter(e => daysUntil(e.date) < 0).reverse()

  if (exams.length === 0) {
    return (
      <section className="section">
        <div className="section-header"><h2>Cronograma</h2></div>
        <p className="empty-state">Nenhuma prova cadastrada. Adicione provas na aba Provas!</p>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>Cronograma</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {upcoming.length} prova{upcoming.length !== 1 ? 's' : ''} por vir
        </span>
      </div>

      <div className="cronograma-list">
        {upcoming.map((exam, i) => {
          const days = daysUntil(exam.date)
          const color = urgencyColor(days)
          const pct = progressPercent(days)
          const topics = exam.topics ? exam.topics.split('\n').filter(Boolean) : []

          return (
            <div key={exam.id} className="crono-item">
              <div className="crono-index" style={{ color: exam.color }}>{i + 1}</div>

              <div className="crono-body">
                <div className="crono-top">
                  <div className="crono-info">
                    <span className="crono-subject" style={{ color: exam.color }}>{exam.subject}</span>
                    <span className="crono-date">
                      {new Date(exam.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      })}
                    </span>
                    {topics.length > 0 && (
                      <div className="crono-topics">
                        {topics.slice(0, 3).map((t, j) => (
                          <span key={j} className="topic-tag">{t.trim()}</span>
                        ))}
                        {topics.length > 3 && (
                          <span className="topic-tag">+{topics.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="crono-countdown">
                    <span className="crono-days" style={{ color }}>
                      {days === 0 ? 'HOJE' : days === 1 ? '1' : days}
                    </span>
                    {days > 1 && <span className="crono-days-label" style={{ color }}>dias</span>}
                    <span className="crono-urgency-badge" style={{ background: color + '22', color }}>
                      {urgencyLabel(days)}
                    </span>
                  </div>
                </div>

                <div className="crono-bar-track">
                  <div
                    className="crono-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <div className="crono-bar-labels">
                  <span>Agora</span>
                  <span>{days === 0 ? 'Hoje' : `${days} dia${days !== 1 ? 's' : ''}`}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {past.length > 0 && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Provas realizadas
          </p>
          <div className="cronograma-list crono-past">
            {past.map(exam => (
              <div key={exam.id} className="crono-item crono-item-past">
                <div className="crono-index" style={{ color: '#94a3b8' }}>✓</div>
                <div className="crono-body">
                  <div className="crono-top">
                    <div className="crono-info">
                      <span className="crono-subject" style={{ color: '#94a3b8' }}>{exam.subject}</span>
                      <span className="crono-date">
                        {new Date(exam.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                          weekday: 'long', day: 'numeric', month: 'long'
                        })}
                      </span>
                    </div>
                    <span className="crono-urgency-badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                      Realizada
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
