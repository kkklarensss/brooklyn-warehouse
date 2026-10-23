import { useState } from 'react'
import { Plus, Wifi } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, Panel, Status } from '../components/AdminUI'

export function VouchersPage() {
  const { state, dispatch } = useAdmin()
  const [minutes, setMinutes] = useState(60)
  const [filter, setFilter] = useState('All')
  const vouchers = state.vouchers.filter((voucher) => filter === 'All' || voucher.status === filter)
  return (
    <>
      <PageHeading
        title="A connection for every corner."
        description="Explore the voucher workflow for a café that stays connected."
      />
      <div className="admin-info-callout">
        <Wifi size={23} strokeWidth={1.5} />
        <div>
          <strong>Router integration is a future step.</strong>
          <p>
            These sample codes do not grant internet access. Live sessions, expiry, and device
            management need the backend and café router.
          </p>
        </div>
      </div>
      <Panel
        title="Wi-Fi vouchers"
        subtitle="Issued means a sample code was created, not an active connection."
      >
        <div className="admin-toolbar">
          <div className="admin-tabs" role="group" aria-label="Voucher status">
            {['All', 'Issued', 'Revoked'].map((status) => (
              <button
                key={status}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <form
            className="admin-inline-form"
            onSubmit={(event) => {
              event.preventDefault()
              dispatch({ type: 'issue-voucher', id: crypto.randomUUID(), minutes })
            }}
          >
            <label className="admin-filter">
              <span className="sr-only">Voucher duration</span>
              <select value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}>
                {[30, 60, 120].map((value) => (
                  <option value={value} key={value}>
                    {value} minutes
                  </option>
                ))}
              </select>
            </label>
            <button className="admin-button admin-button-primary" type="submit">
              <Plus size={15} />
              Issue sample
            </button>
          </form>
        </div>
        {vouchers.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Sample Wi-Fi vouchers</caption>
              <thead>
                <tr>
                  <th scope="col">Voucher code</th>
                  <th scope="col">Allowance</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.id}>
                    <td>
                      <code className="admin-voucher-code">{voucher.code}</code>
                    </td>
                    <td>{voucher.minutes} minutes</td>
                    <td>
                      <Status>{voucher.status}</Status>
                    </td>
                    <td>
                      {voucher.status === 'Issued' ? (
                        <button
                          className="admin-small-button admin-danger"
                          onClick={() => dispatch({ type: 'revoke-voucher', id: voucher.id })}
                        >
                          Revoke<span className="sr-only"> {voucher.code}</span>
                        </button>
                      ) : (
                        <span className="admin-muted">Revoked in demo</span>
                      )}
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
