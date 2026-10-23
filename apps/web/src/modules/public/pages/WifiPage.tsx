import { ArrowRight, Coffee, ShieldCheck, Ticket, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'

export function WifiPage() {
  return (
    <section className="section container page-section">
      <div className="page-intro">
        <span className="eyebrow">STAY A WHILE. STAY CONNECTED.</span>
        <h1>
          Your cup. Your corner.
          <br />
          <em>Your connection.</em>
        </h1>
        <p>A little work, a catch-up, or some time to yourself. Here's how café Wi-Fi will work.</p>
      </div>
      <div className="wifi-layout">
        <div className="wifi-art">
          <Wifi size={100} strokeWidth={0.8} />
          <span className="eyebrow">A CONNECTION FOR YOUR LITTLE PAUSE</span>
          <h2>
            Good coffee.
            <br />
            Even better <em>company.</em>
          </h2>
        </div>
        <div className="wifi-steps">
          {[
            {
              icon: Coffee,
              title: 'Settle in with your favorite cup',
              body: 'Make yourself at home. Ask the café team about the current Wi-Fi access policy.',
            },
            {
              icon: Ticket,
              title: 'Get your access voucher',
              body: 'Staff provide a unique voucher with an allotted connection time and same-day expiry.',
            },
            {
              icon: Wifi,
              title: 'Connect through the café portal',
              body: 'Choose the café network and enter your voucher on the official sign-in page.',
            },
          ].map(({ icon: Icon, title, body }, index) => (
            <div className="wifi-step" key={title}>
              <span className="step-number">0{index + 1}</span>
              <div>
                <Icon size={22} strokeWidth={1.4} />
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
          <div className="info-note">
            <ShieldCheck size={20} />
            <p>
              This page explains the planned experience. Live voucher login and internet access are
              not connected in this frontend preview.
            </p>
          </div>
          <Link to="/help" className="text-link">
            A little help getting connected
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}
