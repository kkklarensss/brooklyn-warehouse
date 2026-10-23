import { Route, Routes } from 'react-router-dom'
import { AdminProvider } from './AdminProvider'
import { AdminLayout } from './layouts/AdminLayout'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'
import { PosPage } from './pages/PosPage'
import { MenuManagementPage } from './pages/MenuManagementPage'
import { InventoryPage } from './pages/InventoryPage'
import { BookingsPage } from './pages/BookingsPage'
import { TeamPage } from './pages/TeamPage'
import { VouchersPage } from './pages/VouchersPage'
import { ReportsPage } from './pages/ReportsPage'
import { ContentPage } from './pages/ContentPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './admin.css'

export default function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reservations" element={<BookingsPage />} />
          <Route path="staff" element={<TeamPage />} />
          <Route path="wifi" element={<VouchersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AdminProvider>
  )
}
