// src/components/BookmarkForm.tsx

'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkForm({ 
  userId, 
  onAdd 
}: { 
  userId: string; 
  onAdd: (bookmark: any) => void 
}) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`

    // We use .select().single() to get the newly created row back immediately
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ title, url: formattedUrl, user_id: userId }])
      .select()
      .single()

    if (error) {
      alert(error.message)
    } else if (data) {
      setTitle('')
      setUrl('')
      onAdd(data) // Push to the UI immediately!
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Website Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-3 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="p-3 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {loading ? 'Saving...' : 'Add Bookmark'}
      </button>
    </form>
  )
}