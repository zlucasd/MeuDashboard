import { useState } from 'react'

const PRIORITIES = { high: { label: 'Alta', color: '#ef4444' }, medium: { label: 'Média', color: '#f59e0b' }, low: { label: 'Baixa', color: '#10b981' } }

function getWeekLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date(new Date().toDateString())
  const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'Atrasada'
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function isOverdue(task) {
  if (task.done || !task.dueDate) return false
  return new Date(task.dueDate + 'T00:00:00') < new Date(new Date().toDateString())
}

export function WeeklyTasks({ tasks, setTasks, subjects }) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [subject, setSubject] = useState('')
  const [filter, setFilter] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTasks([...tasks, {
      id: Date.now().toString(),
      text: text.trim(),
      done: false,
      dueDate,
      priority,
      subject,
      createdAt: new Date().toISOString(),
    }])
    setText('')
    setDueDate('')
    setPriority('medium')
    setSubject('')
  }

  const toggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const remove = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const clearDone = () => {
    setTasks(tasks.filter(t => !t.done))
  }

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.done
    if (filter === 'done') return t.done
    if (filter === 'overdue') return isOverdue(t)
    return true
  }).sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const pOrder = { high: 0, medium: 1, low: 2 }
    return pOrder[a.priority] - pOrder[b.priority]
  })

  const doneCount = tasks.filter(t => t.done).length
  const overdueCount = tasks.filter(isOverdue).length

  return (
    <section className="section">
      <div className="section-header">
        <h2>Tarefas da Semana</h2>
        <div className="tasks-summary">
          <span className="badge badge-success">{doneCount} concluídas</span>
          {overdueCount > 0 && <span className="badge badge-danger">{overdueCount} atrasadas</span>}
        </div>
      </div>

      <form className="task-form" onSubmit={handleAdd}>
        <input
          className="form-input task-input"
          placeholder="Nova tarefa..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="form-row">
          <input
            className="form-input"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <select className="form-input" value={priority} onChange={e => setPriority(e.target.value)}>
            {Object.entries(PRIORITIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label} prioridade</option>
            ))}
          </select>
          {subjects.length > 0 && (
            <select className="form-input" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">Matéria (opcional)</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          )}
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </div>
      </form>

      <div className="filter-bar">
        {['all', 'pending', 'done', 'overdue'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {{ all: 'Todas', pending: 'Pendentes', done: 'Concluídas', overdue: 'Atrasadas' }[f]}
          </button>
        ))}
        {doneCount > 0 && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={clearDone}>
            Limpar concluídas
          </button>
        )}
      </div>

      <ul className="task-list">
        {filtered.map(task => (
          <li key={task.id} className={`task-item ${task.done ? 'task-done' : ''} ${isOverdue(task) ? 'task-overdue' : ''}`}>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.done}
              onChange={() => toggle(task.id)}
            />
            <div className="task-content">
              <span className="task-text">{task.text}</span>
              <div className="task-meta">
                {task.subject && <span className="task-subject">{task.subject}</span>}
                {task.dueDate && (
                  <span className={`task-due ${isOverdue(task) ? 'overdue' : ''}`}>
                    {getWeekLabel(task.dueDate)}
                  </span>
                )}
                <span
                  className="task-priority"
                  style={{ color: PRIORITIES[task.priority]?.color }}
                >
                  {PRIORITIES[task.priority]?.label}
                </span>
              </div>
            </div>
            <button className="btn-icon" onClick={() => remove(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="empty-state">
          {filter === 'all' ? 'Nenhuma tarefa. Adicione sua primeira tarefa!' : 'Nenhuma tarefa nessa categoria.'}
        </p>
      )}
    </section>
  )
}
