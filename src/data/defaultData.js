export const defaultSubjects = [
  { id: 's1', name: 'Algoritmos', priority: 'high', color: '#6366f1', topics: 'Revisão para Prova 2\nConteúdo para Prova Final', notes: '' },
  { id: 's2', name: 'Matemática Discreta', priority: 'high', color: '#ec4899', topics: 'Conteúdo para 3ª Avaliação\nPreparação para Prova Final', notes: 'Prova final sem data marcada ainda.' },
  { id: 's3', name: 'Cálculo 3', priority: 'high', color: '#f59e0b', topics: 'Revisão para 3ª Prova\nSegunda chamada se necessário', notes: '' },
  { id: 's4', name: 'OAC', priority: 'medium', color: '#3b82f6', topics: 'Preparação para 2º Exame\nConteúdo para Prova Final', notes: 'Organização e Arquitetura de Computadores' },
  { id: 's5', name: 'Lab de OAC', priority: 'medium', color: '#10b981', topics: 'Atividades semanais (toda terça até julho)', notes: 'Entrega toda terça-feira até julho.' },
  { id: 's6', name: 'Maker', priority: 'medium', color: '#8b5cf6', topics: 'Esquemático Altium\nCapacitação 29/05 e 05/06 (14h-17h)', notes: 'Reunião toda sexta 10h-11h. Monitoria: quarta 10h-12h e 15h-17h.' },
  { id: 's7', name: 'Laser - Robocar', priority: 'low', color: '#14b8a6', topics: 'Alinhamento de projeto', notes: '' },
  { id: 's8', name: 'IC', priority: 'high', color: '#f97316', topics: 'Plano de trabalho PIBITI\nCusto de materiais\nMelhorar projeto do Inventor para apresentação da Heloísa', notes: 'Iniciação Científica — PIBITI.' },
  { id: 's9', name: 'Empresa Junior', priority: 'low', color: '#64748b', topics: '', notes: 'Sem atividades marcadas no momento.' },
]

export const defaultExams = [
  { id: 'e1', subject: 'OAC', date: '2026-06-09', color: '#3b82f6', topics: '2º Exame' },
  { id: 'e2', subject: 'Matemática Discreta', date: '2026-06-11', color: '#ec4899', topics: '3ª Avaliação' },
  { id: 'e3', subject: 'Cálculo 3', date: '2026-06-22', color: '#f59e0b', topics: '3ª Prova' },
  { id: 'e4', subject: 'Algoritmos', date: '2026-06-30', color: '#6366f1', topics: 'Prova 2' },
  { id: 'e5', subject: 'Cálculo 3', date: '2026-07-01', color: '#f59e0b', topics: 'Segunda Chamada' },
  { id: 'e6', subject: 'Algoritmos', date: '2026-07-02', color: '#6366f1', topics: 'Prova (Quinta)' },
  { id: 'e7', subject: 'Cálculo 3', date: '2026-07-06', color: '#f59e0b', topics: 'Prova Final' },
  { id: 'e8', subject: 'Algoritmos', date: '2026-07-07', color: '#6366f1', topics: 'Prova Final' },
  { id: 'e9', subject: 'OAC', date: '2026-07-07', color: '#3b82f6', topics: 'Prova Final' },
]

export const defaultTasks = [
  { id: 't1', text: 'Entregar atividade semanal — Lab de OAC', done: false, dueDate: '', priority: 'high', subject: 'Lab de OAC', createdAt: new Date().toISOString() },
  { id: 't2', text: 'Laser-Robocar: Reunião de alinhamento de projeto (18h)', done: false, dueDate: '2026-05-23', priority: 'high', subject: 'Laser - Robocar', createdAt: new Date().toISOString() },
  { id: 't3', text: 'Maker: Entregar esquemático Altium', done: false, dueDate: '2026-05-27', priority: 'high', subject: 'Maker', createdAt: new Date().toISOString() },
  { id: 't4', text: 'Sair com meu amor — Vila Trampolim (dia inteiro)', done: false, dueDate: '2026-05-27', priority: 'medium', subject: '', createdAt: new Date().toISOString() },
  { id: 't5', text: 'IC: Entregar plano de trabalho PIBITI finalizado + custo de materiais (20h30)', done: false, dueDate: '2026-05-28', priority: 'high', subject: 'IC', createdAt: new Date().toISOString() },
  { id: 't6', text: 'IC: Melhorar projeto do Inventor para apresentação da Heloísa', done: false, dueDate: '2026-05-28', priority: 'high', subject: 'IC', createdAt: new Date().toISOString() },
  { id: 't7', text: 'Maker: Capacitação (14h-17h)', done: false, dueDate: '2026-05-29', priority: 'medium', subject: 'Maker', createdAt: new Date().toISOString() },
  { id: 't8', text: 'Maker: Capacitação (14h-17h)', done: false, dueDate: '2026-06-05', priority: 'medium', subject: 'Maker', createdAt: new Date().toISOString() },
]

// Eventos esporádicos (IDs estáveis para seeding)
export const defaultSporadic = [
  { id: 'seed-laser-0530', title: 'Reunião Laser Robocar', start: '18:00', end: '19:30', type: 'atividade', color: '#14b8a6', date: '2026-05-30' },
  { id: 'seed-ic-0528',    title: 'IC — Plano de trabalho', start: '20:30', end: '22:00', type: 'atividade', color: '#f97316', date: '2026-05-28' },
  { id: 'seed-dia-0527',   title: 'Dia completo — fora', start: '08:00', end: '22:00', type: 'pessoal',   color: '#ec4899', date: '2026-05-27' },
  { id: 'seed-maker-0529', title: 'Maker Capacitação',    start: '14:00', end: '17:00', type: 'atividade', color: '#8b5cf6', date: '2026-05-29' },
  { id: 'seed-maker-0605', title: 'Maker Capacitação',    start: '14:00', end: '17:00', type: 'atividade', color: '#8b5cf6', date: '2026-06-05' },
]

// Rotina semanal: day 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex
export const defaultRotina = [
  // Segunda
  { id: 'r1', title: 'Cálculo 3', day: 1, start: '10:00', end: '12:00', color: '#f59e0b', type: 'aula' },
  // Terça
  { id: 'r2', title: 'MD', day: 2, start: '08:00', end: '10:00', color: '#ec4899', type: 'aula' },
  { id: 'r3', title: 'Algoritmos', day: 2, start: '10:00', end: '12:00', color: '#6366f1', type: 'aula' },
  { id: 'r4', title: 'OAC', day: 2, start: '13:00', end: '15:00', color: '#3b82f6', type: 'aula' },
  { id: 'r5', title: 'Lab OAC', day: 2, start: '15:00', end: '17:00', color: '#10b981', type: 'aula' },
  // Quarta
  { id: 'r6', title: 'Cálculo 3', day: 3, start: '08:00', end: '10:00', color: '#f59e0b', type: 'aula' },
  { id: 'r7', title: 'Monitoria Maker', day: 3, start: '10:00', end: '12:00', color: '#8b5cf6', type: 'atividade' },
  { id: 'r8', title: 'Monitoria Maker', day: 3, start: '15:00', end: '17:00', color: '#8b5cf6', type: 'atividade' },
  // Quinta
  { id: 'r9', title: 'Algoritmos', day: 4, start: '08:00', end: '10:00', color: '#6366f1', type: 'aula' },
  { id: 'r10', title: 'MD', day: 4, start: '10:00', end: '12:00', color: '#ec4899', type: 'aula' },
  { id: 'r11', title: 'OAC', day: 4, start: '15:00', end: '17:00', color: '#3b82f6', type: 'aula' },
  // Sexta
  { id: 'r12', title: 'Maker — Reunião', day: 5, start: '10:00', end: '11:00', color: '#8b5cf6', type: 'atividade' },
]
