import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Header } from './components/Header'
import { ExamsSection } from './components/ExamsSection'
import { WeeklyTasks } from './components/WeeklyTasks'
import { SubjectsSection } from './components/SubjectsSection'

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'exams', label: 'Provas' },
  { id: 'tasks', label: 'Tarefas' },
  { id: 'subjects', label: 'Matérias' },
]

export default function App() {
  const [exams, setExams] = useLocalStorage('dashboard-exams', [])
  const [tasks, setTasks] = useLocalStorage('dashboard-tasks', [])
  const [subjects, setSubjects] = useLocalStorage('dashboard-subjects', [])
  const [tab, setTab] = useState('overview')

  return (
    <div className="app">
      <Header exams={exams} tasks={tasks} subjects={subjects} />

      <nav className="tab-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === 'overview' && (
          <div className="overview-grid">
            <ExamsSection exams={exams} setExams={setExams} />
            <WeeklyTasks tasks={tasks} setTasks={setTasks} subjects={subjects} />
            <SubjectsSection subjects={subjects} setSubjects={setSubjects} />
          </div>
        )}
        {tab === 'exams' && <ExamsSection exams={exams} setExams={setExams} />}
        {tab === 'tasks' && <WeeklyTasks tasks={tasks} setTasks={setTasks} subjects={subjects} />}
        {tab === 'subjects' && <SubjectsSection subjects={subjects} setSubjects={setSubjects} />}
      </main>
    </div>
  )
}
