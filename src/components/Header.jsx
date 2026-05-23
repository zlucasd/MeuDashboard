export function Header({ exams, tasks, subjects, children }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const nextExam = exams
    .filter(e => new Date(e.date + 'T00:00:00') >= new Date(now.toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

  const daysUntilExam = nextExam
    ? Math.ceil((new Date(nextExam.date + 'T00:00:00') - new Date(now.toDateString())) / (1000 * 60 * 60 * 24))
    : null

  const pendingTasks = tasks.filter(t => !t.done).length

  return (
    <header className="header">
      <div className="header-left">
        <h1>{greeting}!</h1>
        <p className="header-date">{dateStr}</p>
      </div>
      <div className="header-stats">
        {children}
        <div className="stat-chip">
          <span className="stat-icon">📚</span>
          <span>{subjects.length} matéria{subjects.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">✅</span>
          <span>{pendingTasks} tarefa{pendingTasks !== 1 ? 's' : ''} pendente{pendingTasks !== 1 ? 's' : ''}</span>
        </div>
        {nextExam && (
          <div className={`stat-chip ${daysUntilExam <= 3 ? 'stat-urgent' : daysUntilExam <= 7 ? 'stat-warning' : ''}`}>
            <span className="stat-icon">🎯</span>
            <span>
              {daysUntilExam === 0
                ? `Prova hoje: ${nextExam.subject}`
                : daysUntilExam === 1
                ? `Prova amanhã: ${nextExam.subject}`
                : `Próxima prova em ${daysUntilExam} dias`}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
