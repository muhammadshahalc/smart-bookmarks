// src/app/login/page.tsx

import { signInWithGoogle } from '../auth/actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="p-10 bg-white shadow-2xl rounded-3xl w-full max-w-md text-center border border-slate-100">
        <div className="mb-6 flex justify-center">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">SmartMark</h1>
        <p className="text-slate-500 mb-10">Your personal link vault, synced in real-time.</p>
        
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-4 px-6 py-4 border-2 border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-6 h-6"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}