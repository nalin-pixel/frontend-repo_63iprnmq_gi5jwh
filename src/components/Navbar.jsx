import { Moon, Sun, Search, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar({ onSearch }) {
  const [dark, setDark] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-white/60 dark:bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-semibold text-slate-900 dark:text-white">SRH Marketplace</div>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input value={query} onChange={(e)=>{setQuery(e.target.value); onSearch?.(e.target.value)}} placeholder="Search books, electronics..." className="bg-transparent flex-1 outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400" />
        </div>
        <button onClick={() => setDark(!dark)} className="ml-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  )
}
