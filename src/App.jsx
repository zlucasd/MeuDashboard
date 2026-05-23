import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useCloudSync } from './hooks/useCloudSync'
import { Header } from './components/Header'
import { AuthButton } from './components/AuthButton'
import { ExamsSection } from './components/ExamsSection'
import { WeeklyTasks } from './components/WeeklyTasks'
import { SubjectsSection } from './components/SubjectsSection'
import { CronogramaSection } from './components/CronogramaSection'
import { RotinaSemanal } from './components/RotinaSemanal'
import { NotasSection } from './components/NotasSection'
import { BottomNav } from './components/BottomNav'
import { defaultExams, defaultTasks, defaultSubjects } from './data/defaultData'

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'rotina', label: 'Rotina' },
  { id: 'cronograma', label: 'Cronograma' },
  { id: 'exams', label: 'Provas' },
  { id: 'tasks', label: 'Tarefas' },
  { id: 'subjects', label: 'Matérias' },
  { id: 'notas', label: 'Notas' },
]

export default function App() {
  const [user, setUser] = useState(undefined)
  const [tab, setTab] = useState('overview')
  const [theme, setTheme] = useState(() => localStorage.getItem('dashboard-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    if (!auth) { setUser(null); return }
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  const userId = user?.uid ?? null

  const [exams, setExams] = useCloudSync(userId, 'exams', defaultExams)
  const [tasks, setTasks] = useCloudSync(userId, 'tasks', defaultTasks)
  const [subjects, setSubjects] = useCloudSync(userId, 'subjects', defaultSubjects)

  return (
    <div className="app">
      <Header exams={exams} tasks={tasks} subjects={subjects} theme={theme} onToggleTheme={toggleTheme}>
        <AuthButton user={user || null} />
      </Header>

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
            <RotinaSemanal userId={userId} />
            <CronogramaSection exams={exams} />
            <WeeklyTasks tasks={tasks} setTasks={setTasks} subjects={subjects} />
            <div className="overview-desktop-only"><ExamsSection exams={exams} setExams={setExams} /></div>
            <div className="overview-desktop-only"><SubjectsSection subjects={subjects} setSubjects={setSubjects} /></div>
          </div>
        )}
        {tab === 'rotina' && <RotinaSemanal userId={userId} />}
        {tab === 'cronograma' && <CronogramaSection exams={exams} />}
        {tab === 'exams' && <ExamsSection exams={exams} setExams={setExams} />}
        {tab === 'tasks' && <WeeklyTasks tasks={tasks} setTasks={setTasks} subjects={subjects} />}
        {tab === 'subjects' && <SubjectsSection subjects={subjects} setSubjects={setSubjects} />}
        {tab === 'notas' && <NotasSection subjects={subjects} userId={userId} />}
      </main>

      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  )
}
