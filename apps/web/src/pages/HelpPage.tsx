import { ArrowUpRight, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const questions = [
  [
    'Where can I find Brooklyn Warehouse Coffee?',
    'The capstone lists the café at 2F YOU.suites, 2113 Recto Avenue, Sampaloc, Manila. Check directly with the café for current operating hours before visiting.',
  ],
  [
    'Can I place a real order here?',
    'This is a frontend demonstration. You can browse sample items, build a bag, and preview an order. Nothing is sent to the café and no payment is collected.',
  ],
  [
    'How do space reservations work?',
    'The planned system lets you request a VIP room or activity booking for staff review. The current form only shows a local preview; it does not check live availability or reserve a space.',
  ],
  [
    'How do I connect to Wi-Fi?',
    'Ask café staff for an access voucher and use the café network’s official captive portal. This demo website does not grant internet access.',
  ],
  [
    'What payment methods are planned?',
    'The capstone supports cash and GCash. Payment collection and verification will be implemented with the backend. Never enter payment credentials into this preview.',
  ],
  [
    'Is my demo bag saved?',
    'Your item choices and quantities are saved in this browser when local storage is available. The reservation form is kept in memory only. You can remove items from your bag at any time.',
  ],
]
export function HelpPage() {
  return (
    <section className="section container page-section">
      <div className="page-intro">
        <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
        <h1>
          Good questions.
          <br />
          <em>Simple answers.</em>
        </h1>
        <p>Everything you need to know before your next little pause.</p>
      </div>
      <div className="help-layout">
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <aside className="visit-card">
          <MapPin size={28} strokeWidth={1.2} />
          <span className="eyebrow">YOUR NEIGHBORHOOD CORNER</span>
          <h2>
            Let's meet
            <br />
            <em>at Brooklyn.</em>
          </h2>
          <p>
            2F YOU.suites
            <br />
            2113 Recto Avenue
            <br />
            Sampaloc, Manila
          </p>
          <Link to="/menu" className="text-link">
            Pick your first cup
            <ArrowUpRight size={17} />
          </Link>
        </aside>
      </div>
    </section>
  )
}
