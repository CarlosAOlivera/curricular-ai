'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { DEPR_EVENTS, EVENT_COLORS, getEventsForDate, getEventDatesInMonth, type EventType } from '@/lib/depr-calendar'
import { useLanguage } from '@/contexts/LanguageContext'

const MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LETTERS_ES = ['D','L','M','M','J','V','S']
const DAY_LETTERS_EN = ['S','M','T','W','T','F','S']

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
}

function isSchoolDay(date: Date): boolean {
  const dow = date.getDay()
  if (dow === 0 || dow === 6) return false
  const holidays = DEPR_EVENTS.filter(e => e.type === 'holiday')
  const ds = toDateStr(date)
  return !holidays.some(h => {
    if (ds >= h.date && ds <= (h.endDate || h.date)) return true
    return false
  })
}

interface Task { id: string; text: string; done: boolean }

export default function CalendarPanel() {
  const { t, lang } = useLanguage()
  const MONTH_NAMES = lang === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ES
  const DAY_LETTERS = lang === 'en' ? DAY_LETTERS_EN : DAY_LETTERS_ES
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [showSync, setShowSync] = useState(false)

  // ── TASKS ────────────────────────────────────────────────────
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskInput, setTaskInput] = useState('')
  const taskInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('depr_tasks')
      if (stored) setTasks(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  function saveTasks(next: Task[]) {
    setTasks(next)
    try { localStorage.setItem('depr_tasks', JSON.stringify(next)) } catch { /* ignore */ }
  }

  function addTask() {
    const text = taskInput.trim()
    if (!text) return
    saveTasks([...tasks, { id: Date.now().toString(), text, done: false }])
    setTaskInput('')
    taskInputRef.current?.focus()
  }

  function toggleTask(id: string) {
    saveTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id: string) {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  // ── NAVIGATION ──────────────────────────────────────────────
  function prevPeriod() {
    if (view === 'month') setCurrent(new Date(current.getFullYear(), current.getMonth()-1, 1))
    else if (view === 'week') { const d = new Date(selectedDate); d.setDate(d.getDate()-7); setSelectedDate(d); setCurrent(new Date(d.getFullYear(),d.getMonth(),1)) }
    else { const d = new Date(selectedDate); d.setDate(d.getDate()-1); setSelectedDate(d); setCurrent(new Date(d.getFullYear(),d.getMonth(),1)) }
  }
  function nextPeriod() {
    if (view === 'month') setCurrent(new Date(current.getFullYear(), current.getMonth()+1, 1))
    else if (view === 'week') { const d = new Date(selectedDate); d.setDate(d.getDate()+7); setSelectedDate(d); setCurrent(new Date(d.getFullYear(),d.getMonth(),1)) }
    else { const d = new Date(selectedDate); d.setDate(d.getDate()+1); setSelectedDate(d); setCurrent(new Date(d.getFullYear(),d.getMonth(),1)) }
  }

  // ── MONTH VIEW DATA ─────────────────────────────────────────
  const monthEventDates = useMemo(
    () => getEventDatesInMonth(current.getFullYear(), current.getMonth()),
    [current]
  )
  const firstDow = new Date(current.getFullYear(), current.getMonth(), 1).getDay()
  const daysInMonth = new Date(current.getFullYear(), current.getMonth()+1, 0).getDate()

  // ── WEEK VIEW DATA ──────────────────────────────────────────
  const weekDays = useMemo(() => {
    const start = new Date(selectedDate)
    start.setDate(start.getDate() - start.getDay()) // Sunday
    return Array.from({length:7}, (_, i) => { const d = new Date(start); d.setDate(d.getDate()+i); return d })
  }, [selectedDate])

  // ── SELECTED DAY EVENTS ─────────────────────────────────────
  const selectedEvents = useMemo(() => getEventsForDate(toDateStr(selectedDate)), [selectedDate])

  // ── HEADER LABEL ────────────────────────────────────────────
  const headerLabel = view === 'month'
    ? `${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`
    : view === 'week'
    ? `${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getDate()} – ${MONTH_NAMES[weekDays[6].getMonth()]} ${weekDays[6].getDate()}`
    : `${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tuapp.com'
  const icsUrl = `${appUrl}/api/calendar`
  const googleUrl = `https://calendar.google.com/calendar/r/settings/addbyurl?url=${encodeURIComponent(icsUrl)}`

  return (
    <div className="flex flex-col h-full bg-white border-l border-navy-tint select-none">

      {/* ── HEADER: title + sync + task input ── */}
      <div className="px-3 pt-3 pb-2.5 border-b border-navy-tint shrink-0 space-y-2">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-navy-mid uppercase tracking-wider">{t('calendar.title')}</span>
          <button onClick={() => setShowSync(v => !v)} className="text-navy-mid/50 hover:text-navy-mid transition-colors" title="Sincronizar">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.26-3.848a.75.75 0 00.75-.75V2.583a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 003.8 7.84a.75.75 0 101.449.39 5.5 5.5 0 019.196-2.463l.314.312H12.33a.75.75 0 000 1.5h4.243a.75.75 0 00.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Sync dropdown */}
        {showSync && (
          <div className="bg-paper border border-navy-tint rounded-xl p-3 space-y-2 text-xs">
            <p className="text-navy-mid font-medium">{t('calendar.sync')}</p>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-navy-tint rounded-lg text-ink transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t('calendar.addGoogle')}
            </a>
            <a href="/api/calendar" download="depr-2026-27.ics"
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-navy-tint rounded-lg text-ink transition-colors">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-navy-mid shrink-0">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" />
              </svg>
              {t('calendar.downloadIcs')}
            </a>
            <p className="text-ink/40 text-[10px] leading-tight">{t('calendar.outlookNote')}</p>
          </div>
        )}

        {/* Task input */}
        <div className="flex gap-1">
          <input
            ref={taskInputRef}
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addTask() }}
            placeholder={lang === "en" ? "Add a task..." : "Agregar tarea..."}
            className="flex-1 text-xs bg-white border border-navy-tint rounded-lg px-2.5 py-1.5 text-ink placeholder-ink/30 focus:outline-none focus:border-navy min-w-0"
          />
          <button onClick={addTask}
            className="shrink-0 w-7 h-7 flex items-center justify-center bg-navy-tint hover:bg-navy-mid/20 border border-navy-tint rounded-lg text-navy-mid hover:text-navy transition-colors">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/></svg>
          </button>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-navy-tint/50 rounded-lg p-0.5">
          {(['month','week','day'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-1 text-xs rounded-md font-medium transition-colors ${view === v ? 'bg-navy text-white' : 'text-navy-mid hover:text-navy'}`}>
              {v === 'month' ? t('calendar.month') : v === 'week' ? t('calendar.week') : t('calendar.day')}
            </button>
          ))}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={prevPeriod} className="w-6 h-6 flex items-center justify-center text-navy-mid hover:text-navy hover:bg-navy-tint rounded transition-colors">‹</button>
          <button onClick={() => { setSelectedDate(new Date()); setCurrent(new Date(today.getFullYear(), today.getMonth(), 1)) }}
            className="text-xs font-medium text-ink hover:text-navy transition-colors truncate px-1 text-center">
            {headerLabel}
          </button>
          <button onClick={nextPeriod} className="w-6 h-6 flex items-center justify-center text-navy-mid hover:text-navy hover:bg-navy-tint rounded transition-colors">›</button>
        </div>
      </div>

      {/* ── BODY: calendar views (scrollable) ── */}
      <div className="flex-1 overflow-y-auto">

        {/* MONTH VIEW */}
        {view === 'month' && (
          <div className="p-2">
            <div className="grid grid-cols-7 mb-1">
              {DAY_LETTERS.map((l,i) => (
                <div key={i} className={`text-center text-[10px] font-medium py-1 ${i===0||i===6?'text-ink/20':'text-navy-mid/50'}`}>{l}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({length: firstDow}).map((_,i) => <div key={`e${i}`} />)}
              {Array.from({length: daysInMonth}).map((_,i) => {
                const d = i+1
                const date = new Date(current.getFullYear(), current.getMonth(), d)
                const ds   = toDateStr(date)
                const isToday = isSameDay(date, today)
                const isSel   = isSameDay(date, selectedDate)
                const dow     = date.getDay()
                const isWeekend = dow === 0 || dow === 6
                const evTypes = monthEventDates.get(d) || []
                return (
                  <div key={d} onClick={() => { setSelectedDate(date); setView('day') }}
                    className={`relative flex flex-col items-center py-0.5 rounded cursor-pointer transition-colors
                      ${isSel ? 'bg-navy' : isToday ? 'bg-navy-tint' : 'hover:bg-navy-tint/60'}
                      ${isWeekend && !isSel ? 'text-ink/25' : ''}`}>
                    <span className={`text-[11px] font-medium leading-none ${isToday && !isSel ? 'text-navy' : isSel ? 'text-white' : 'text-ink'}`}>{d}</span>
                    {evTypes.length > 0 && (
                      <div className="flex gap-px mt-0.5 flex-wrap justify-center">
                        {evTypes.slice(0,3).map((et,i) => (
                          <span key={i} className={`w-1 h-1 rounded-full ${EVENT_COLORS[et as EventType].dot}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 pt-2 border-t border-navy-tint space-y-1">
              {(Object.entries(EVENT_COLORS) as [EventType, typeof EVENT_COLORS[EventType]][]).map(([type, c]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
                  <span className="text-[10px] text-navy-mid/60">{t(`eventTypes.${type}`)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEEK VIEW */}
        {view === 'week' && (
          <div className="p-2 space-y-1">
            {weekDays.map(day => {
              const ds = toDateStr(day)
              const evs = getEventsForDate(ds)
              const isToday = isSameDay(day, today)
              const isWeekend = day.getDay() === 0 || day.getDay() === 6
              return (
                <div key={ds} onClick={() => { setSelectedDate(day); setView('day') }}
                  className={`px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${isToday ? 'bg-navy-tint' : 'hover:bg-navy-tint/60'} ${isWeekend ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold w-6 ${isToday ? 'text-navy' : 'text-ink'}`}>{day.getDate()}</span>
                    <span className="text-[10px] text-navy-mid/50 uppercase w-6">{DAY_LETTERS[day.getDay()]}</span>
                    <div className="flex gap-1 flex-wrap flex-1">
                      {evs.map(ev => (
                        <span key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${EVENT_COLORS[ev.type].bg} ${EVENT_COLORS[ev.type].text}`}>
                          {ev.short || ev.title.slice(0,18)}
                        </span>
                      ))}
                      {evs.length === 0 && isWeekend && <span className="text-[10px] text-ink/20">{t('calendar.weekend')}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* DAY VIEW */}
        {view === 'day' && (
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              {isSameDay(selectedDate, today) && (
                <span className="text-[10px] font-bold text-navy bg-navy-tint px-1.5 py-0.5 rounded">{t('calendar.today')}</span>
              )}
              {!isSchoolDay(selectedDate) && (
                <span className="text-[10px] text-gold-deep bg-gold-tint px-1.5 py-0.5 rounded">{t('calendar.noSchool')}</span>
              )}
            </div>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-ink/30 italic">{t('calendar.noEventsDay')}</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(ev => {
                  const c = EVENT_COLORS[ev.type]
                  return (
                    <div key={ev.id} className={`rounded-xl p-3 ${c.bg} border border-white/5`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${c.text}`}>{c.label}</span>
                      </div>
                      <p className={`text-xs leading-snug ${c.text}`}>{ev.title}</p>
                      {ev.endDate && ev.endDate !== ev.date && (
                        <p className="text-[10px] text-slate-500 mt-1">{t('calendar.until')} {ev.endDate}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {/* Upcoming */}
            <div className="pt-2 border-t border-navy-tint">
              <p className="text-[10px] text-navy-mid/50 uppercase tracking-wide mb-2">{t('calendar.upcoming')}</p>
              {DEPR_EVENTS.filter(ev => new Date(ev.date + 'T00:00:00') > selectedDate).slice(0,4).map(ev => {
                const c = EVENT_COLORS[ev.type]
                return (
                  <div key={ev.id} className="flex items-start gap-2 py-1.5 border-b border-navy-tint/60 last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1 shrink-0`} />
                    <div>
                      <p className="text-xs text-ink font-medium leading-tight">{ev.title}</p>
                      <p className="text-xs text-navy-mid/50">{ev.date}{ev.endDate ? ` – ${ev.endDate}` : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── TASK LIST — below calendar ── */}
      {tasks.length > 0 && (
        <div className="border-t border-navy-tint shrink-0">
          <div className="px-3 pt-2 pb-1 flex items-center gap-1">
            <span className="text-[10px] font-semibold text-navy-mid/60 uppercase tracking-wider">
              {lang === "en" ? "Tasks" : "Tareas"}
            </span>
            <span className="text-[10px] text-ink/30">({tasks.filter(t=>!t.done).length}/{tasks.length})</span>
          </div>
          <div className="px-2 max-h-36 overflow-y-auto space-y-0.5 pb-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-start gap-1.5 group px-1 py-1 rounded hover:bg-navy-tint/40">
                <button onClick={() => toggleTask(task.id)}
                  className={"mt-0.5 w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center transition-colors " + (task.done ? "bg-navy border-navy" : "border-navy-tint hover:border-navy")}>
                  {task.done && <svg viewBox="0 0 12 12" className="w-2 h-2 text-white"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <span className={"text-xs flex-1 leading-snug " + (task.done ? "line-through text-ink/25" : "text-ink")}>{task.text}</span>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-clay transition-all text-xs shrink-0 leading-none">&times;</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
