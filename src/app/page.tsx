
// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  // If anyone hits the base URL, send them to login
  redirect('/login')
}
