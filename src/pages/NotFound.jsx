import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
export default function NotFound() { const { t } = useApp(); return <div className="text-center py-20"><h1 className="text-6xl font-bold text-teal-600">404</h1><p className="my-4">{t('notFound')}</p><Link className="btn" to="/">{t('goHome')}</Link></div> }
