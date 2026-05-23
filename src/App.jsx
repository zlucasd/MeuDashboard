import { useState, useEffect, useRef } from 'react'
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
import { MonthlyCalendar } from './components/MonthlyCalendar'
import { BottomNav } from './components/BottomNav'
import { defaultExams, defaultTasks, defaultSubjects, defaultRotina, defaultSporadic } from './data/defaultData'

const TABS = [
  { id: 'overview',   label: 'Visão Geral' },
  { id: 'rotina',     label: 'Rotina' },
  { id: 'calendario', label: 'Calendário' },
  { id: 'cronograma', label: 'Cronograma' },
  { id: 'exams',      label: 'Provas' },
  { id: 'tasks',      label: 'Tarefas' },
  { id: 'subjects',   label: 'Matérias' },
  { id: 'notas',      label: 'Notas' },
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
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null))
    return unsub
  }, [])

  const userId = user?.uid ?? null

  const [exams, setExams]       = useCloudSync(userId, 'exams',    defaultExams)
  const [tasks, setTasks]       = useCloudSync(userId, 'tasks',    defaultTasks)
  const [subjects, setSubjects] = useCloudSync(userId, 'subjects', defaultSubjects)
  const [rotina, setRotina]     = useCloudSync(userId, 'rotina',   defaultRotina)
  const [sporadic, setSporadic] = useCloudSync(userId, 'sporadic', [])

  // Seed default sporadic events (by stable ID, won't duplicate)
  const seededRef = useRef(false)
  useEffect(() => {
    if (seededRef.current || !Array.isArray(sporadic)) return
    const existingIds = new Set(sporadic.map(e => e.id))
    const toAdd = defaultSporadic.filter(e => !existingIds.has(e.id))
    if (toAdd.length > 0) {
      seededRef.current = true
      setSporadic(prev => {
        const nowIds = new Set(prev.map(e => e.id))
        const still = defaultSporadic.filter(e => !nowIds.has(e.id))
        return still.length > 0 ? [...prev, ...still] : prev
      })
    } else {
      seededRef.current = true
    }
  }, [sporadic])

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
            <RotinaSemanal rotina={rotina} setRotina={setRotina} sporadic={sporadic} setSporadic={setSporadic} />
            <CronogramaSection exams={exams} />
            <WeeklyTasks tasks={tasks} setTasks={setTasks} subjects={subjects} />
          </div>
        )}
        {tab === 'rotina'     && <RotinaSemanal rotina={rotina} setRotina={setRotina} sporadic={sporadic} setSporadic={setSporadic} />}
        {tab === 'calendario' && <MonthlyCalendar exams={exams} rotina={rotina} sporadic={sporadic} />}
        {tab === 'cronograma' && <CronogramaSection exams={exams} />}
        {tab === 'exams'      && <ExamsSection exams={exams} setExams={setExams} />}
        {tab === 'tasks'      && <WeeklyTasks tasks={tasks} setTasks={setTasks} subjects={subjects} />}
        {tab === 'subjects'   && <SubjectsSection subjects={subjects} setSubjects={setSubjects} />}
        {tab === 'notas'      && <NotasSection subjects={subjects} userId={userId} />}
      </main>

      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  )
}
