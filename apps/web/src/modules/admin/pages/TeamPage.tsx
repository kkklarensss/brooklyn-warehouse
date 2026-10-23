import { useState } from 'react'
import { Clock3, Users } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, Panel, SearchField, Status } from '../components/AdminUI'

export function TeamPage() {
  const { state, dispatch } = useAdmin()
  const [query, setQuery] = useState('')
  const staff = state.staff.filter((person) =>
    `${person.name} ${person.role}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHeading
        title="The people behind the pause."
        description="A little appreciation for the team that makes it all happen."
      />
      <div className="admin-summary-strip">
        <span>
          <Users size={18} />
          <strong>{state.staff.length}</strong>team members
        </span>
        <span>
          <Clock3 size={18} />
          <strong>{state.staff.filter((person) => person.clockedIn).length}</strong>on shift in demo
        </span>
      </div>
      <Panel
        title="Your café team"
        subtitle="Sample attendance toggles only. These are not payroll or timekeeping records."
      >
        <div className="admin-toolbar">
          <span className="admin-muted">Demo team directory</span>
          <SearchField value={query} onChange={setQuery} placeholder="Search name or role" />
        </div>
        {staff.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Staff and demo attendance</caption>
              <thead>
                <tr>
                  <th scope="col">Team member</th>
                  <th scope="col">Role</th>
                  <th scope="col">Attendance</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <span className="admin-cell-icon">
                        <span className="admin-avatar">{person.initials}</span>
                        <span>
                          <strong>{person.name}</strong>
                          <small>{person.id}</small>
                        </span>
                      </span>
                    </td>
                    <td>{person.role}</td>
                    <td>
                      <Status>{person.clockedIn ? 'On shift' : 'Off shift'}</Status>
                    </td>
                    <td>
                      <button
                        className="admin-small-button"
                        onClick={() => dispatch({ type: 'clock', id: person.id })}
                      >
                        <Clock3 size={14} />
                        {person.clockedIn ? 'Clock out' : 'Clock in'}
                        <span className="sr-only"> {person.name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </Panel>
    </>
  )
}
