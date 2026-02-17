// src/app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { signOut } from '@/app/auth/actions'

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  if (!userId) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="animate-pulse text-slate-400 font-medium">Synchronizing session...</div>
    </div>
  )

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              Smart Bookmark <span className="text-indigo-500">App</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Enterprise-grade vault for your digital assets.</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-fit text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-indigo-500/50 px-5 py-2.5 rounded-full transition-all duration-300 bg-white/5 hover:bg-indigo-500/10 backdrop-blur-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-10">
          <section>
            <BookmarkForm 
              userId={userId} 
              onAdd={(newBk) => setBookmarks((prev) => [newBk, ...prev])} 
            />
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400/80">Book Marks</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent"></div>
            </div>
            <BookmarkList 
              userId={userId} 
              bookmarks={bookmarks} 
              setBookmarks={setBookmarks} 
            />
          </section>
        </div>
      </div>
    </main>
  )
}