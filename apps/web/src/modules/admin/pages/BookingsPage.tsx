import { useState } from 'react'
import { CalendarDays, Check, Users, X } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, Panel, SearchField, Status } from '../components/AdminUI'

export function BookingsPage() {
  const { state, dispatch } = useAdmin()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const bookings = state.bookings.filter(
    (booking) =>
      (filter === 'All' || booking.status === filter) &&
      `${booking.name} ${booking.id} ${booking.space}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHeading
        title="Room for a little company."
        description="Review space requests and make every gathering feel at home."
      />
      <Panel
        title="The reservation book"
        subtitle="Approvals are simulated. No customer is notified or actual space reserved."
      >
        <div className="admin-toolbar">
          <div className="admin-tabs" role="group" aria-label="Reservation status">
            {['All', 'Pending', 'Approved', 'Declined'].map((status) => (
              <button
                key={status}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <SearchField value={query} onChange={setQuery} placeholder="Search guests or spaces" />
        </div>
        <div className="admin-bookings">
          {bookings.map((booking) => (
            <article className="admin-booking" key={booking.id}>
              <div className="admin-booking-top">
                <span className="admin-category-label">{booking.id}</span>
                <Status>{booking.status}</Status>
              </div>
              <h2>{booking.name}</h2>
              <p>{booking.space}</p>
              <div className="admin-booking-details">
                <span>
                  <CalendarDays size={16} />
                  {booking.date} · {booking.time}
                </span>
                <span>
                  <Users size={16} />
                  {booking.guests} guests · {booking.hours} {booking.hours === 1 ? 'hour' : 'hours'}
                </span>
              </div>
              {booking.status === 'Pending' ? (
                <div className="admin-row-actions">
                  <button
                    className="admin-small-button"
                    onClick={() =>
                      dispatch({ type: 'booking-status', id: booking.id, status: 'Approved' })
                    }
                  >
                    <Check size={14} />
                    Approve<span className="sr-only"> {booking.id}</span>
                  </button>
                  <button
                    className="admin-small-button admin-danger"
                    onClick={() =>
                      dispatch({ type: 'booking-status', id: booking.id, status: 'Declined' })
                    }
                  >
                    <X size={14} />
                    Decline<span className="sr-only"> {booking.id}</span>
                  </button>
                </div>
              ) : (
                <span className="admin-muted">Reviewed in demo</span>
              )}
            </article>
          ))}
        </div>
        {!bookings.length && <EmptyState />}
      </Panel>
      <p className="admin-page-note">
        All times in Asia/Manila. The demo prevents overlapping approvals for the same space and
        date.
      </p>
    </>
  )
}
