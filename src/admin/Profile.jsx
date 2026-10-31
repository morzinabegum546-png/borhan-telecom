import { useApp } from '../context/AppContext'
export default function Profile() { const { user, t } = useApp(); return <div className="card p-6"><h1 className="text-2xl font-bold mb-2">{t('profile')}</h1><p>{user?.email}</p><p className="text-xs text-slate-500">UID: {user?.uid}</p></div> }
