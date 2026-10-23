import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Check, Clock3, Users } from 'lucide-react'
import { manilaDate } from '../../../shared/lib/format'
import { validateSchedule } from '../features/reservations/validation'

export function ReservationsPage() {
  const [space, setSpace] = useState('vip')
  const [error, setError] = useState('')
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    duration: '1',
  })
  const [summary, setSummary] = useState<{
    name: string
    date: string
    time: string
    guests: string
    duration: string
    space: string
  } | null>(null)
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    if (name.length < 2) {
      setError('Please enter a name with at least two characters.')
      return
    }
    const date = String(data.get('date'))
    const time = String(data.get('time'))
    const scheduleError = validateSchedule(date, time)
    if (scheduleError) {
      setError(scheduleError)
      return
    }
    setError('')
    setDraft({
      name,
      email: String(data.get('email')),
      date,
      time,
      guests: String(data.get('guests')),
      duration: String(data.get('duration')),
    })
    setSummary({
      name,
      date,
      time,
      guests: String(data.get('guests')),
      duration: String(data.get('duration')),
      space: space === 'vip' ? 'The VIP room' : 'An activity gathering',
    })
  }
  return (
    <section className="section container page-section">
      <div className="page-intro">
        <span className="eyebrow">YOUR PEOPLE. YOUR LITTLE CORNER.</span>
        <h1>
          A space for <em>your moments.</em>
        </h1>
        <p>From quiet conversations to a table full of ideas. Let's make a little room.</p>
      </div>
      <div className="reservation-layout">
        <div className="space-options">
          <article className={`space-option ${space === 'vip' ? 'is-selected' : ''}`}>
            <div className="room-illustration">
              <span className="room-window" />
              <span className="room-table" />
              <span className="room-chair left" />
              <span className="room-chair right" />
              <span className="room-caption">A ROOM FOR GOOD COMPANY</span>
            </div>
            <div className="space-option-body">
              <span className="eyebrow">A LITTLE MORE PRIVATE</span>
              <h2>The VIP room</h2>
              <p>A quieter setting for small catch-ups, focused work, and your next big idea.</p>
              <div className="space-meta">
                <span>
                  <Users size={15} />
                  Up to 8 guests*
                </span>
                <span>
                  <Clock3 size={15} />
                  1–3 hours*
                </span>
              </div>
              <button
                className="text-link"
                aria-pressed={space === 'vip'}
                onClick={() => {
                  setSpace('vip')
                  setSummary(null)
                }}
              >
                {space === 'vip' ? (
                  <>
                    <Check size={16} />
                    Selected space
                  </>
                ) : (
                  <>
                    Choose this space
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </article>
          <button
            className={`activity-option ${space === 'activity' ? 'is-selected' : ''}`}
            aria-pressed={space === 'activity'}
            onClick={() => {
              setSpace('activity')
              setSummary(null)
            }}
          >
            <span>
              <span className="eyebrow">BRING EVERYONE TOGETHER</span>
              <strong>Activity gathering</strong>
              <span>For games, shared plans, and a little fun.</span>
            </span>
            {space === 'activity' ? <Check size={20} /> : <ArrowRight size={20} />}
          </button>
          <p className="fine-print">
            *Illustrative spaces, capacity, and duration. Actual availability and booking policies
            will be confirmed by the café.
          </p>
        </div>
        <div className="booking-card">
          {summary ? (
            <div className="booking-summary">
              <div className="success-mark">
                <Check />
              </div>
              <span className="eyebrow">REQUEST PREVIEW</span>
              <h2>
                Here's your plan,
                <br />
                <em>{summary.name}.</em>
              </h2>
              <p>
                This request has <strong>not been sent</strong>. This preview does not reserve a
                space.
              </p>
              <dl className="summary-list">
                <div>
                  <dt>Space</dt>
                  <dd>{summary.space}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{summary.date}</dd>
                </div>
                <div>
                  <dt>Start time</dt>
                  <dd>{summary.time} · Manila</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{summary.guests}</dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>{summary.duration} hour(s)</dd>
                </div>
              </dl>
              <button className="button button-outline w-full" onClick={() => setSummary(null)}>
                Edit details
              </button>
            </div>
          ) : (
            <form onSubmit={review}>
              <span className="eyebrow">MAKE A LITTLE PLAN</span>
              <h2>Your gathering starts here.</h2>
              <p>Try the form below. Requests aren't sent during this preview.</p>
              <label htmlFor="booking-name">
                Your name
                <input
                  id="booking-name"
                  name="name"
                  defaultValue={draft.name}
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="How should we call you?"
                />
              </label>
              <label htmlFor="booking-email">
                Email address
                <input
                  id="booking-email"
                  name="email"
                  defaultValue={draft.email}
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                />
              </label>
              <div className="form-row">
                <label htmlFor="booking-date">
                  Date
                  <input
                    id="booking-date"
                    name="date"
                    defaultValue={draft.date}
                    type="date"
                    min={manilaDate()}
                    required
                  />
                </label>
                <label htmlFor="booking-time">
                  Start time
                  <input
                    id="booking-time"
                    name="time"
                    defaultValue={draft.time}
                    type="time"
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label htmlFor="booking-guests">
                  Guests
                  <select id="booking-guests" name="guests" defaultValue={draft.guests}>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="booking-duration">
                  Duration
                  <select id="booking-duration" name="duration" defaultValue={draft.duration}>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                  </select>
                </label>
              </div>
              <p className="fine-print">
                All times are in Asia/Manila. Please use sample details when trying this form.
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button button-primary w-full" type="submit">
                Review demo request
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
