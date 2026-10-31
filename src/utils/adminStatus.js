import { ref, get } from 'firebase/database'
import { db } from '../firebase/config'
// 'approved' | 'pending' | 'none'. UI convenience only: Realtime Database rules enforce the same check.
export async function adminStatus(user) {
  try { if ((await user.getIdTokenResult(true)).claims.admin === true) return 'approved' } catch {}
  try {
    const s = await get(ref(db, 'admins/' + user.uid))
    if (!s.exists()) return 'none'
    return s.val().status === 'approved' ? 'approved' : 'pending'
  } catch { return 'none' }
}
