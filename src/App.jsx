import { useEffect, useMemo, useState } from 'react'
import { Plus, Filter, Shield } from 'lucide-react'
import Navbar from './components/Navbar'
import AuthPanel from './components/AuthPanel'
import ListingCard from './components/ListingCard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const categories = ['Books','Electronics','Furniture','Clothing','Misc']
const conditions = ['New','Like New','Used','Heavily Used']

function NewListingModal({ open, onClose, onCreated }){
  const [form, setForm] = useState({ title:'', description:'', price:'', category:categories[0], condition:conditions[2], images:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  if(!open) return null

  async function submit(e){
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/listings`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          images: form.images? form.images.split('\n').map(s=>s.trim()).filter(Boolean):[]
        })
      })
      if(!res.ok){
        const t = await res.json().catch(()=>({detail:'Failed'}))
        throw new Error(t.detail || 'Failed to create')
      }
      onCreated?.()
      onClose?.()
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New listing</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Close</button>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <input required placeholder="Title" className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          <textarea required placeholder="Description" rows={3} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" min="0" step="0.01" placeholder="Price" className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
            <select className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{categories.map(c=>(<option key={c}>{c}</option>))}</select>
          </div>
          <select className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800" value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))}>{conditions.map(c=>(<option key={c}>{c}</option>))}</select>
          <textarea placeholder="Image URLs (one per line)" rows={3} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none" value={form.images} onChange={e=>setForm(f=>({...f,images:e.target.value}))}/>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button disabled={loading} className="mt-1 py-2 rounded-lg bg-[#0053A0] text-white hover:opacity-90">{loading? 'Posting...':'Post listing'}</button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(()=>{
    const u = localStorage.getItem('user')
    return u? JSON.parse(u): null
  })
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ category:'', condition:'', sort:'newest' })
  const [showNew, setShowNew] = useState(false)

  async function load(){
    const token = localStorage.getItem('token')
    if(!token){ setItems([]); return }
    const params = new URLSearchParams()
    if(query) params.set('q', query)
    if(filters.category) params.set('category', filters.category)
    if(filters.condition) params.set('condition', filters.condition)
    if(filters.sort) params.set('sort', filters.sort)
    const res = await fetch(`${API}/listings?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` }})
    const data = await res.json().catch(()=>[])
    setItems(Array.isArray(data)? data: [])
  }

  useEffect(()=>{ load() }, [user, query, filters])

  if(!user){
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0053A0] to-slate-900 grid place-items-center p-4">
        <AuthPanel onAuth={(u)=> setUser(u)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <Navbar onSearch={setQuery} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="text-sm text-slate-600 dark:text-slate-300">Welcome, {user.name}</div>
          <div className="flex-1" />
          <select value={filters.category} onChange={e=>setFilters(f=>({...f,category:e.target.value}))} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10">
            <option value="">All categories</option>
            {categories.map(c=>(<option key={c} value={c}>{c}</option>))}
          </select>
          <select value={filters.condition} onChange={e=>setFilters(f=>({...f,condition:e.target.value}))} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10">
            <option value="">All conditions</option>
            {conditions.map(c=>(<option key={c} value={c}>{c}</option>))}
          </select>
          <select value={filters.sort} onChange={e=>setFilters(f=>({...f,sort:e.target.value}))} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button onClick={()=>setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0053A0] text-white shadow hover:opacity-90">
            <Plus className="w-4 h-4"/> New listing
          </button>
        </div>

        {items.length===0 ? (
          <div className="text-center text-slate-600 dark:text-slate-300 py-20">No listings yet. Be the first to post!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ListingCard key={item._id} item={item} onChat={()=>alert('Chat UI coming next.')} />
            ))}
          </div>
        )}
      </div>

      <NewListingModal open={showNew} onClose={()=>setShowNew(false)} onCreated={load} />
    </div>
  )
}

export default App
