'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkList({ 
  userId, 
  bookmarks, 
  setBookmarks 
}: { 
  userId: string; 
  bookmarks: any[]; 
  setBookmarks: React.Dispatch<React.SetStateAction<any[]>> 
}) {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('Connecting...')
  const supabase = createClient()

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (data) setBookmarks(data)
      setLoading(false)
    }
    fetchBookmarks()

    const channel = supabase
      .channel(`sync-${userId}-${Math.random().toString(36).substring(2, 7)}`) 
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks',
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new
            setBookmarks((prev) => {
              const exists = prev.some(b => b.id === newRecord.id)
              return exists ? prev : [newRecord, ...prev]
            })
          }
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            setBookmarks((prev) => prev.filter((b) => b.id !== deletedId))
          }
        }
      )
      .subscribe((status) => {
        setStatus(status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, setBookmarks])

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error("Delete Error:", error)
  }

  if (loading) return (
    <div className="flex flex-col items-center py-20 text-slate-500 italic">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      Fetching vault data...
    </div>
  )

  return (
    <div className="grid gap-4">
      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <p className="text-slate-500 font-medium">Your vault is currently empty.</p>
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div 
            key={bookmark.id} 
            className="relative p-5 bg-slate-900/50 border border-white/5 rounded-2xl flex justify-between items-center group transition-all duration-300 hover:bg-slate-800/80 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 shadow-sm"
          >
            <div className="overflow-hidden pr-6">
              <h3 className="font-bold text-slate-100 truncate text-lg group-hover:text-indigo-300 transition-colors">
                {bookmark.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-slate-500 hover:text-indigo-400 truncate underline-offset-4 hover:underline transition-colors"
                >
                  {bookmark.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            <button 
              onClick={() => deleteBookmark(bookmark.id)} 
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 transform scale-90 group-hover:scale-100"
              title="Delete Bookmark"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  )
}