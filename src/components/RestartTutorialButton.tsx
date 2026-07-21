'use client'

const STORAGE_KEY = 'onboarding_v1_done'

export default function RestartTutorialButton() {
  function restart() {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    window.location.reload()
  }

  return (
    <button
      onClick={restart}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-navy-mid/30 text-navy-mid hover:border-navy hover:text-navy hover:bg-navy-tint transition-all"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0">
        <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd"/>
      </svg>
      Ver tutorial
    </button>
  )
}
