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
      className="text-[10px] text-navy-mid/30 hover:text-navy-mid/60 transition-colors"
    >
      ¿Necesitas ayuda? Ver tutorial
    </button>
  )
}
