import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
const Home = lazy(() => import('./pages/Home'))
const OfferList = lazy(() => import('./pages/OfferList'))
const OfferDetails = lazy(() => import('./pages/OfferDetails'))
const NotFound = lazy(() => import('./pages/NotFound'))
const CustomerAuth = lazy(() => import('./pages/CustomerAuth'))
const Notifications = lazy(() => import('./pages/Notifications'))
const PaymentSettings = lazy(() => import('./admin/PaymentSettings'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const AdminOrders = lazy(() => import('./admin/AdminOrders'))
const AdminRegister = lazy(() => import('./admin/AdminRegister'))
const Login = lazy(() => import('./admin/Login'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const AdminOffers = lazy(() => import('./admin/AdminOffers'))
const OfferForm = lazy(() => import('./admin/OfferForm'))
const Profile = lazy(() => import('./admin/Profile'))
const Spinner = () => <div className="p-10 text-center animate-pulse" role="status">Loading…</div>
function Guard({ children }) {
  const { user, isAdmin, authReady } = useApp()
  if (!authReady) return <Spinner />
  return user && isAdmin ? children : <Navigate to="/admin/login" replace />
}
const cats = ['offers:all', 'internet', 'minutes:minute', 'combo', 'drive', 'popular', 'sms', 'special', 'latest', 'discount', 'search']
export default function App() {
  return <Suspense fallback={<Spinner />}><Routes>
    <Route element={<UserLayout />}>
      <Route path="/" element={<Home />} />
      {cats.map(c => { const [p, k] = c.split(':'); return <Route key={p} path={'/' + p} element={<OfferList key={p} cat={k || p} />} /> })}
      <Route path="/operator/:opId" element={<OfferList />} />
      <Route path="/login" element={<CustomerAuth mode="login" />} />
      <Route path="/register" element={<CustomerAuth mode="register" />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/offer/:offerId" element={<OfferDetails />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin/register" element={<AdminRegister />} />
    <Route path="/admin" element={<Guard><AdminLayout /></Guard>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="offers" element={<AdminOffers />} />
      <Route path="active-offers" element={<AdminOffers only="active" />} />
      <Route path="expired-offers" element={<AdminOffers only="expired" />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="add-offer" element={<OfferForm />} />
      <Route path="edit-offer/:offerId" element={<OfferForm />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<PaymentSettings />} />
    </Route>
  </Routes></Suspense>
}
