import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const res = await fetch(`${API}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode==='register'? {name, email, password}:{email, password})
      })
      if(!res.ok){
        const t = await res.json().catch(()=>({detail:'Request failed'}))
        throw new Error(t.detail || 'Request failed')
      }
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onAuth?.(data.user)
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{mode==='login'?'Welcome back':'Create your account'}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Use your SRH email for instant trust</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode==='register' && (
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 outline-none" placeholder="Full name" required />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 outline-none" placeholder="Email (prefer @srh.de)" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 outline-none" placeholder="Password" required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-[#0053A0] text-white hover:opacity-90 transition">
          {loading? 'Please wait...' : (mode==='login'? 'Sign in' : 'Create account')}
        </button>
      </form>
      <div className="mt-3 text-center">
        <button onClick={()=>setMode(mode==='login'?'register':'login')} className="text-sm text-[#0053A0] hover:underline">
          {mode==='login'? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
