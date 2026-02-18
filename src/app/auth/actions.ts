'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headerList = await headers()
  
  // Vercel usually provides the 'host' header. 
  // We construct the URL to ensure it matches your deployment exactly.
  const host = headerList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const redirectUrl = `${protocol}://${host}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    console.error('Auth error:', error.message)
    return redirect('/login?error=auth-failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}


