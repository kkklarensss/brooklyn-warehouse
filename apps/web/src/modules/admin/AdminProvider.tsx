import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { adminReducer, createAdminState } from './model'
import type { AdminAction, AdminState } from './model'

const AdminContext = createContext<{ state: AdminState; dispatch: Dispatch<AdminAction> } | null>(
  null,
)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, undefined, () => createAdminState())
  return <AdminContext.Provider value={{ state, dispatch }}>{children}</AdminContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdmin must be called inside AdminProvider')
  return context
}
