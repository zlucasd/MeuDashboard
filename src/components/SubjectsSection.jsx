import { useState } from 'react'

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6']
const PRIORITIES = { high: { label: 'Alta', color: '#ef4444' }, medium: { label: 'Média', color: '#f59e0b' }, low: { label: 'Baixa', color: '#10b981' } }

function SubjectCard({ subject, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const topics = subject.topics ? subject.topics.split('\n').filter(Boolean) : []

  return (
    <div className="subject-card">
      <div className="subject-card-header" style={{ borderTopColor: subject.color }}>
        <div className="subject-title-row">
          <span className="subject-name" style={{ color: subject.color }}>{subject.name}</span>
          <span className="subject-priority-badge" style={{ background: PRIORITIES[subject.priority]?.color + '22', color: PRIORITIES[subject.priority]?.color }}>
            {PRIORITIES[subject.priority]?.label}
          </span>
        </div>
        <div className="card-actions">
          <button className="btn-icon" onClick={() => setExpanded(!expanded)} title="Ver tópicos">
            {expanded ? '▲' : '▼'}
          </button>
          <button className="btn-icon" onClick={() => onEdit(subject)} title="Editar">✏️</button>
          <button className="btn-icon" onClick={() => onDelete(subject.id)} title="Remover">🗑️</button>
        </div>
      </div>

      {subject.notes && <p className="subject-notes">{subject.notes}</p>}

      <div className="subject-stats">
        <span className="topic-count">{topics.length} tópico{topics.length !== 1 ? 's' : ''}</span>
      </div>

      {expanded && topics.length > 0 && (
        <ul className="topics-list">
          {topics.map((t, i) => (
            <li key={i} className="topic-item">
              <span className="topic-bullet" style={{ background: subject.color }} />
              {t.trim()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SubjectForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [topics, setTopics] = useState(initial?.topics ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [priority, setPriority] = useState(initial?.priority ?? 'medium')
  const [color, setColor] = useState(initial?.color ?? COLORS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), topics, notes, priority, color })
  }

  return (
    <form className="exam-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          className="form-input"
          placeholder="Nome da matéria"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select className="form-input" value={priority} onChange={e => setPriority(e.target.value)}>
          {Object.entries(PRIORITIES).map(([k, v]) => (
            <option key={k} value={k}>{v.label} prioridade</option>
          ))}
        </select>
      </div>
      <textarea
        className="form-input"
        placeholder="Tópicos para estudar (um por linha)"
        value={topics}
        onChange={e => setTopics(e.target.value)}
        rows={4}
      />
      <textarea
        className="form-input"
        placeholder="Anotações gerais (opcional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={2}
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

export function SubjectsSection({ subjects, setSubjects }) {
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [sortBy, setSortBy] = useState('priority')

  const handleSave = (data) => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...data } : s))
      setEditingSubject(null)
    } else {
      setSubjects([...subjects, { id: Date.now().toString(), ...data }])
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setShowForm(false)
  }

  const pOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...subjects].sort((a, b) =>
    sortBy === 'priority'
      ? pOrder[a.priority] - pOrder[b.priority]
      : a.name.localeCompare(b.name)
  )

  return (
    <section className="section">
      <div className="section-header">
        <h2>Matérias</h2>
        <div className="section-header-actions">
          <select className="form-input form-input-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="priority">Por prioridade</option>
            <option value="name">Por nome</option>
          </select>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingSubject(null) }}>
            + Adicionar matéria
          </button>
        </div>
      </div>

      {showForm && !editingSubject && (
        <SubjectForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      <div className="subjects-grid">
        {sorted.map(subject => (
          editingSubject?.id === subject.id
            ? <SubjectForm key={subject.id} initial={subject} onSave={handleSave} onCancel={() => setEditingSubject(null)} />
            : <SubjectCard key={subject.id} subject={subject} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>

      {subjects.length === 0 && !showForm && (
        <p className="empty-state">Nenhuma matéria cadastrada. Adicione sua primeira matéria!</p>
      )}
    </section>
  )
}
