import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { PageHeading, Panel, Status } from '../components/AdminUI'

export function ContentPage() {
  const { state, dispatch } = useAdmin()
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    dispatch({
      type: 'save-post',
      id: crypto.randomUUID(),
      title: String(data.get('title')),
      body: String(data.get('body')),
    })
    form.reset()
  }
  return (
    <>
      <PageHeading
        title="A few good words."
        description="Make a little space for café news, everyday stories, and invitations."
      />
      <div className="admin-content-layout">
        <Panel
          title="From your café"
          subtitle="Demo announcements. Publication here does not change the customer website."
        >
          <div className="admin-posts">
            {state.posts.map((post) => (
              <article key={post.id}>
                <Status>{post.status}</Status>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <button
                  className="admin-small-button"
                  onClick={() => dispatch({ type: 'toggle-post', id: post.id })}
                >
                  {post.status === 'Draft' ? 'Publish in demo' : 'Return to draft'}
                  <span className="sr-only">: {post.title}</span>
                </button>
              </article>
            ))}
          </div>
        </Panel>
        <Panel title="Start a little story" subtitle="Add an announcement to this workspace.">
          <form className="admin-form" onSubmit={save}>
            <label className="admin-field">
              Title
              <input
                name="title"
                placeholder="Something good to share…"
                maxLength={100}
                required
                pattern=".*\S.*"
              />
            </label>
            <label className="admin-field">
              Message
              <textarea
                name="body"
                placeholder="Tell your guests a little more."
                maxLength={1000}
                rows={6}
                required
              />
            </label>
            <button className="admin-button admin-button-primary" type="submit">
              <Plus size={16} />
              Save demo draft
            </button>
          </form>
        </Panel>
      </div>
    </>
  )
}
