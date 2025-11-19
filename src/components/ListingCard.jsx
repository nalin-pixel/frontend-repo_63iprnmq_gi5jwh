import { MessageCircle } from 'lucide-react'

export default function ListingCard({ item, onChat }){
  return (
    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow hover:shadow-lg transition">
      <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
        {item.images?.length ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.category} • {item.condition}</p>
          </div>
          <div className="text-[#0053A0] font-semibold">€{item.price?.toFixed?.(2) ?? item.price}</div>
        </div>
        <p className="mt-2 text-sm line-clamp-2 text-slate-600 dark:text-slate-300">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className={`inline-flex text-xs px-2 py-1 rounded-md ${item.approved? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300':'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{item.approved? 'Approved':'Pending'}</div>
          <button onClick={()=>onChat?.(item)} className="inline-flex items-center gap-1 text-[#0053A0] hover:underline">
            <MessageCircle className="w-4 h-4"/> Chat
          </button>
        </div>
      </div>
    </div>
  )
}
