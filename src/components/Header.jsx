export function Header({ exams, tasks, subjects, theme, onToggleTheme, children }) {
  const now = new Date()

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
        <h1>Cronograma</h1>
        <p className="header-date">Lucas David</p>
      </div>

      <div className="header-right">
        <div className="header-stats">
          <div className="stat-chip stat-subjects">
            <span>📚</span>
            <span>{subjects.length} matéria{subjects.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="stat-chip stat-tasks">
            <span>✅</span>
            <span>{pendingTasks} pendente{pendingTasks !== 1 ? 's' : ''}</span>
          </div>
          {nextExam && (
            <div className={`stat-chip ${daysUntilExam <= 3 ? 'stat-urgent' : daysUntilExam <= 7 ? 'stat-warning' : ''}`}>
              <span>🎯</span>
              <span>
                {daysUntilExam === 0
                  ? `Hoje: ${nextExam.subject}`
                  : daysUntilExam === 1
                  ? `Amanhã: ${nextExam.subject}`
                  : `Prova em ${daysUntilExam}d`}
              </span>
            </div>
          )}
        </div>

        <div className="header-actions">
          <button className="theme-toggle" onClick={onToggleTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          {children}
        </div>
      </div>
    </header>
  )
}
