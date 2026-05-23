import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SUB_TABS = [
  { id: 'notes', label: 'Anotações' },
  { id: 'links', label: 'Links Úteis' },
  { id: 'content', label: 'Conteúdo' },
]

function emptySubjectData() {
  return { notes: '', links: [], content: [] }
}

function getSubjectData(notasData, id) {
  return notasData[id] ?? emptySubjectData()
}

function setSubjectData(notasData, id, patch) {
  return { ...notasData, [id]: { ...getSubjectData(notasData, id), ...patch } }
}

/* ── Anotações ── */
function NotesTab({ data, onChange }) {
  return (
    <div className="notas-tab-body">
      <textarea
        className="notas-textarea"
        placeholder="Escreva suas anotações aqui... Pode usar texto livre, listas com -, etc."
        value={data.notes}
        onChange={e => onChange({ notes: e.target.value })}
      />
    </div>
  )
}

/* ── Links Úteis ── */
function LinksTab({ data, onChange }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!url.trim() || !title.trim()) return
    const link = { id: Date.now().toString(), url: url.trim(), title: title.trim(), desc: desc.trim() }
    onChange({ links: [...data.links, link] })
    setUrl(''); setTitle(''); setDesc('')
  }

  const removeLink = (id) => {
    onChange({ links: data.links.filter(l => l.id !== id) })
  }

  return (
    <div className="notas-tab-body">
      <form className="link-form" onSubmit={handleAdd}>
        <div className="form-row">
          <input className="form-input" placeholder="Título do link" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="form-input" placeholder="URL (https://...)" value={url} onChange={e => setUrl(e.target.value)} required />
        </div>
        <div className="form-row">
          <input className="form-input" placeholder="Descrição (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </div>
      </form>

      {data.links.length === 0 && (
        <p className="empty-state">Nenhum link adicionado ainda.</p>
      )}

      <ul className="links-list">
        {data.links.map(link => (
          <li key={link.id} className="link-item">
            <div className="link-icon">🔗</div>
            <div className="link-body">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
                {link.title}
              </a>
              {link.desc && <p className="link-desc">{link.desc}</p>}
              <span className="link-url">{link.url}</span>
            </div>
            <button className="btn-icon" onClick={() => removeLink(link.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Conteúdo para Estudar ── */
const PRIORITIES = { high: { label: 'Alta', color: '#ef4444' }, medium: { label: 'Média', color: '#f59e0b' }, low: { label: 'Baixa', color: '#10b981' } }

function ContentTab({ data, onChange }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const item = { id: Date.now().toString(), text: text.trim(), done: false, priority }
    onChange({ content: [...data.content, item] })
    setText('')
  }

  const toggleItem = (id) => {
    onChange({ content: data.content.map(c => c.id === id ? { ...c, done: !c.done } : c) })
  }

  const removeItem = (id) => {
    onChange({ content: data.content.filter(c => c.id !== id) })
  }

  const pending = data.content.filter(c => !c.done)
  const done = data.content.filter(c => c.done)
  const pct = data.content.length > 0 ? Math.round((done.length / data.content.length) * 100) : 0

  return (
    <div className="notas-tab-body">
      {data.content.length > 0 && (
        <div className="content-progress">
          <div className="content-progress-bar">
            <div className="content-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="content-progress-label">{pct}% — {done.length}/{data.content.length} concluídos</span>
        </div>
      )}

      <form className="content-add-form" onSubmit={handleAdd}>
        <input
          className="form-input"
          placeholder="Adicionar conteúdo / tópico para estudar..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="form-row">
          <select className="form-input" value={priority} onChange={e => setPriority(e.target.value)}>
            {Object.entries(PRIORITIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label} prioridade</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </div>
      </form>

      {data.content.length === 0 && (
        <p className="empty-state">Nenhum conteúdo adicionado. Comece adicionando os tópicos que precisa estudar!</p>
      )}

      <ul className="content-list">
        {[...pending, ...done].map(item => (
          <li key={item.id} className={`content-item ${item.done ? 'content-done' : ''}`}>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={item.done}
              onChange={() => toggleItem(item.id)}
            />
            <span className="content-text">{item.text}</span>
            <span className="task-priority" style={{ color: PRIORITIES[item.priority]?.color, fontSize: '0.75rem' }}>
              {PRIORITIES[item.priority]?.label}
            </span>
            <button className="btn-icon" onClick={() => removeItem(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Main ── */
export function NotasSection({ subjects }) {
  const [notasData, setNotasData] = useLocalStorage('dashboard-notas', {})
  const [selectedId, setSelectedId] = useState(subjects[0]?.id ?? null)
  const [activeTab, setActiveTab] = useState('notes')
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved'
  const saveTimer = useRef(null)

  const selected = subjects.find(s => s.id === selectedId)
  const data = getSubjectData(notasData, selectedId)

  const handleChange = (patch) => {
    setNotasData(setSubjectData(notasData, selectedId, patch))
    setSaveStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveStatus('saved'), 800)
  }

  const handleExport = () => {
    const all = {
      notas: notasData,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notas-backup-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (parsed.notas) {
          setNotasData(parsed.notas)
          setSaveStatus('saved')
        }
      } catch {
        alert('Arquivo inválido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (subjects.length === 0) {
    return (
      <section className="section">
        <div className="section-header"><h2>Notas</h2></div>
        <p className="empty-state">Adicione matérias primeiro na aba Matérias.</p>
      </section>
    )
  }

  return (
    <section className="section notas-section">
      <div className="section-header">
        <h2>Notas por Disciplina</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
            Importar backup
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <button className="btn btn-ghost btn-sm" onClick={handleExport}>Exportar backup</button>
        </div>
      </div>

      <div className="notas-layout">
        {/* Subject sidebar */}
        <div className="notas-sidebar">
          {subjects.map(s => {
            const sData = getSubjectData(notasData, s.id)
            const hasContent = sData.notes || sData.links.length > 0 || sData.content.length > 0
            const donePct = sData.content.length > 0
              ? Math.round((sData.content.filter(c => c.done).length / sData.content.length) * 100)
              : null

            return (
              <button
                key={s.id}
                className={`notas-subject-btn ${selectedId === s.id ? 'active' : ''}`}
                style={{ '--subject-color': s.color }}
                onClick={() => setSelectedId(s.id)}
              >
                <span className="notas-subject-dot" style={{ background: s.color }} />
                <div className="notas-subject-info">
                  <span className="notas-subject-name">{s.name}</span>
                  {donePct !== null && (
                    <span className="notas-subject-pct">{donePct}%</span>
                  )}
                </div>
                {hasContent && <span className="notas-subject-indicator" />}
              </button>
            )
          })}
        </div>

        {/* Content area */}
        {selected && (
          <div className="notas-content">
            <div className="notas-content-header" style={{ borderLeftColor: selected.color }}>
              <span className="notas-content-title" style={{ color: selected.color }}>{selected.name}</span>
              <span className={`notas-save-indicator ${saveStatus}`}>
                {saveStatus === 'saving' ? '● Salvando...' : '✓ Salvo'}
              </span>
            </div>

            <div className="notas-subtabs">
              {SUB_TABS.map(t => (
                <button
                  key={t.id}
                  className={`notas-subtab-btn ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                  style={activeTab === t.id ? { borderBottomColor: selected.color, color: selected.color } : {}}
                >
                  {t.label}
                  {t.id === 'links' && data.links.length > 0 && (
                    <span className="notas-subtab-count">{data.links.length}</span>
                  )}
                  {t.id === 'content' && data.content.length > 0 && (
                    <span className="notas-subtab-count">{data.content.filter(c => !c.done).length}</span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'notes' && <NotesTab data={data} onChange={handleChange} />}
            {activeTab === 'links' && <LinksTab data={data} onChange={handleChange} />}
            {activeTab === 'content' && <ContentTab data={data} onChange={handleChange} />}
          </div>
        )}
      </div>
    </section>
  )
}
