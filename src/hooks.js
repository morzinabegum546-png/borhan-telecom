import { useEffect, useState } from 'react'
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database'
import { db } from './firebase/config'
export const toList = s => { const a = []; s.forEach(c => { a.push({ id: c.key, ...c.val() }) }); return a }
const newest = (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
// public: only offers whose stored status is 'active' (rules allow exactly this query); expiry is computed client-side
export function usePublicOffers() {
  const [offers, setOffers] = useState([]), [loading, setLoading] = useState(true)
  useEffect(() => onValue(query(ref(db, 'offers'), orderByChild('status'), equalTo('active')),
    s => { setOffers(toList(s).sort(newest)); setLoading(false) }, () => setLoading(false)), [])
  return { offers, loading }
}
export function useAdminOffers() {
  const [offers, setOffers] = useState([]), [loading, setLoading] = useState(true)
  useEffect(() => onValue(ref(db, 'offers'), s => { setOffers(toList(s).sort(newest)); setLoading(false) }, () => setLoading(false)), [])
  return { offers, loading }
}
export function usePayment() {
  const [pay, setPay] = useState({})
  useEffect(() => onValue(ref(db, 'appSettings/payment'), s => setPay(s.val() || {}), () => {}), [])
  return pay
}
export function useNotifs(user) {
  const [st, setSt] = useState({ list: [], loaded: false })
  useEffect(() => { if (!user) { setSt({ list: [], loaded: false }); return }
    return onValue(ref(db, 'notifications/' + user.uid), s => setSt({ list: toList(s).sort(newest), loaded: true }), () => {}) }, [user])
  return st
}
