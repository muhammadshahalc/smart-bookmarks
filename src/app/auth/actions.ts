// src/app/auth/actions.ts

'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // We need to know where the app is running (localhost or Vercel)
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // This tells Google where to send the user after they log in
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Auth error:', error.message)
    return redirect('/login?error=auth-failed')
  }

  // Redirect the user to the Google Login screen
  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}


