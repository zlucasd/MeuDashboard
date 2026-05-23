import { useState } from 'react'

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6']

function daysUntil(dateStr) {
  const today = new Date(new Date().toDateString())
  const exam = new Date(dateStr + 'T00:00:00')
  return Math.ceil((exam - today) / (1000 * 60 * 60 * 24))
}

function ExamCard({ exam, onDelete, onEdit }) {
  const days = daysUntil(exam.date)
  const isPast = days < 0
  const isToday = days === 0
  const isSoon = days > 0 && days <= 3
  const isWarning = days > 3 && days <= 7

  const urgencyClass = isPast ? 'exam-past' : isToday ? 'exam-today' : isSoon ? 'exam-soon' : isWarning ? 'exam-warning' : ''

  return (
    <div className={`exam-card ${urgencyClass}`} style={{ borderLeftColor: exam.color }}>
      <div className="exam-card-header">
        <span className="exam-subject" style={{ color: exam.color }}>{exam.subject}</span>
        <div className="card-actions">
          <button className="btn-icon" onClick={() => onEdit(exam)} title="Editar">✏️</button>
          <button className="btn-icon" onClick={() => onDelete(exam.id)} title="Remover">🗑️</button>
        </div>
      </div>
      <div className="exam-date">
        {new Date(exam.date + 'T00:00:00').toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })}
      </div>
      <div className={`exam-countdown ${urgencyClass}`}>
        {isPast
          ? 'Já realizada'
          : isToday
          ? 'HOJE!'
          : days === 1
          ? 'Amanhã!'
          : `${days} dias`}
      </div>
      {exam.topics && (
        <div className="exam-topics">
          {exam.topics.split('\n').filter(Boolean).map((t, i) => (
            <span key={i} className="topic-tag">{t.trim()}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function ExamForm({ initial, onSave, onCancel }) {
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [date, setDate] = useState(initial?.date ?? '')
  const [topics, setTopics] = useState(initial?.topics ?? '')
  const [color, setColor] = useState(initial?.color ?? COLORS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!subject.trim() || !date) return
    onSave({ subject: subject.trim(), date, topics, color })
  }

  return (
    <form className="exam-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          className="form-input"
          placeholder="Matéria / Disciplina"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>
      <textarea
        className="form-input"
        placeholder="Assuntos (um por linha)"
        value={topics}
        onChange={e => setTopics(e.target.value)}
        rows={3}
      />
      <div className="form-row">
        <div className="color-picker">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`color-dot ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
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

export function ExamsSection({ exams, setExams }) {
  const [showForm, setShowForm] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [showPast, setShowPast] = useState(false)

  const upcoming = exams
    .filter(e => daysUntil(e.date) >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const past = exams
    .filter(e => daysUntil(e.date) < 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleSave = (data) => {
    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? { ...e, ...data } : e))
      setEditingExam(null)
    } else {
      setExams([...exams, { id: Date.now().toString(), ...data }])
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    setExams(exams.filter(e => e.id !== id))
  }

  const handleEdit = (exam) => {
    setEditingExam(exam)
    setShowForm(false)
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>Provas</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingExam(null) }}>
          + Adicionar prova
        </button>
      </div>

      {showForm && !editingExam && (
        <ExamForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      <div className="exams-grid">
        {upcoming.map(exam => (
          editingExam?.id === exam.id
            ? <ExamForm key={exam.id} initial={exam} onSave={handleSave} onCancel={() => setEditingExam(null)} />
            : <ExamCard key={exam.id} exam={exam} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>

      {upcoming.length === 0 && !showForm && (
        <p className="empty-state">Nenhuma prova cadastrada. Adicione sua primeira prova!</p>
      )}

      {past.length > 0 && (
        <div className="past-section">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowPast(!showPast)}>
            {showPast ? '▲' : '▼'} {past.length} prova{past.length !== 1 ? 's' : ''} já realizadas
          </button>
          {showPast && (
            <div className="exams-grid">
              {past.map(exam => (
                editingExam?.id === exam.id
                  ? <ExamForm key={exam.id} initial={exam} onSave={handleSave} onCancel={() => setEditingExam(null)} />
                  : <ExamCard key={exam.id} exam={exam} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
