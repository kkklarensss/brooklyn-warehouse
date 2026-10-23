import { useState } from 'react'
import { RotateCcw, Save } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { PageHeading, Panel } from '../components/AdminUI'

export function SettingsPage() {
  const { state, dispatch } = useAdmin()
  const [confirmReset, setConfirmReset] = useState(false)
  return (
    <>
      <PageHeading
        title="Make yourself at home."
        description="A few little preferences for your café workspace."
      />
      <div className="admin-content-layout">
        <Panel
          title="Workspace preferences"
          subtitle="Saved only for this demo session. The public café details stay unchanged."
        >
          <form
            className="admin-form"
            key={JSON.stringify(state.settings)}
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              dispatch({
                type: 'settings',
                settings: {
                  name: String(data.get('name')).trim(),
                  email: String(data.get('email')).trim(),
                  lowStockAlerts: data.get('alerts') === 'on',
                },
              })
            }}
          >
            <label className="admin-field">
              Café name
              <input
                name="name"
                defaultValue={state.settings.name}
                maxLength={100}
                pattern=".*\S.*"
                required
              />
            </label>
            <label className="admin-field">
              Contact email
              <input
                name="email"
                type="email"
                defaultValue={state.settings.email}
                maxLength={254}
                required
              />
            </label>
            <label className="admin-check">
              <input name="alerts" type="checkbox" defaultChecked={state.settings.lowStockAlerts} />
              Show low-stock action in the daily checklist
            </label>
            <div className="admin-setting-detail">
              <span>Business timezone</span>
              <strong>Asia/Manila (UTC+08:00)</strong>
            </div>
            <button className="admin-button admin-button-primary" type="submit">
              <Save size={16} />
              Save preferences
            </button>
          </form>
        </Panel>
        <div>
          <Panel title="About this workspace" subtitle="Frontend preview">
            <div className="admin-form">
              <p className="admin-description">
                This admin area is open for demonstration. Authentication, permissions, database
                storage, payments, email, and router control will need backend integration before
                real staff use.
              </p>
              <div className="admin-setting-detail">
                <span>Data storage</span>
                <strong>In memory · resets on refresh or exit</strong>
              </div>
              <div className="admin-setting-detail">
                <span>Connected services</span>
                <strong>None</strong>
              </div>
            </div>
          </Panel>
          <Panel
            title="A fresh little start"
            subtitle="Restore the sample data for every admin page."
          >
            <div className="admin-form">
              {confirmReset ? (
                <>
                  <p className="admin-description">Reset all changes made in this demo session?</p>
                  <div className="admin-row-actions">
                    <button
                      className="admin-small-button admin-danger"
                      onClick={() => {
                        dispatch({ type: 'reset' })
                        setConfirmReset(false)
                      }}
                    >
                      Reset workspace
                    </button>
                    <button className="admin-small-button" onClick={() => setConfirmReset(false)}>
                      Keep changes
                    </button>
                  </div>
                </>
              ) : (
                <button className="admin-small-button" onClick={() => setConfirmReset(true)}>
                  <RotateCcw size={14} />
                  Reset demo data
                </button>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
