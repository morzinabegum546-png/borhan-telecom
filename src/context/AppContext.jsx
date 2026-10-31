import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { adminStatus } from '../utils/adminStatus'
import { dict } from '../translations'
const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'bn')
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [user, setUser] = useState(null), [isAdmin, setIsAdmin] = useState(false), [authReady, setReady] = useState(false)
  const [toast, setToast] = useState(null)
  useEffect(() => { localStorage.setItem('lang', lang); document.documentElement.lang = lang }, [lang])
  useEffect(() => { localStorage.setItem('theme', dark ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', dark) }, [dark])
  useEffect(() => onAuthStateChanged(auth, async u => {
    setUser(u)
    try { setIsAdmin(u ? (await adminStatus(u)) === 'approved' : false) } catch { setIsAdmin(false) }
    setReady(true)
  }), [])
  const t = useCallback(k => dict[lang][k] ?? dict.en[k] ?? k, [lang])
  const notify = useCallback((msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }, [])
  const logout = () => signOut(auth)
  return <Ctx.Provider value={{ lang, setLang, dark, setDark, t, user, isAdmin, authReady, notify, logout }}>
    {children}
    {toast && <div role="status" className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-white shadow-lg ${toast.type === 'ok' ? 'bg-teal-600' : 'bg-red-600'}`}>{toast.msg}</div>}
  </Ctx.Provider>
}
