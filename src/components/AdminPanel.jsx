import { useEffect, useMemo, useState } from 'react'
import { events as initialEvents } from '../data/events.js'

const DEFAULT_ADMIN_PASSWORD = 'foces2026'
const PASSWORD_STORAGE_KEY = 'foces-admin-password'
const SESSION_STORAGE_KEY = 'foces-admin-session'

const initialLeaderboard = [
  {
    id: 1,
    name: 'Team Circuit',
    program: 'Competition',
    points: 320,
    note: 'Top project score this month',
  },
  {
    id: 2,
    name: 'Amina Rahman',
    program: 'Workshop',
    points: 290,
    note: 'Most active attendee',
  },
  {
    id: 3,
    name: 'IoT Builders',
    program: 'Hackathon',
    points: 250,
    note: 'Highest collaboration score',
  },
]

function blankEvent(id) {
  return {
    id,
    title: 'New event',
    category: 'Workshop',
    date: '',
    time: '',
    venue: '',
    speaker: '',
    description: '',
    registrationLink: '',
    seats: 0,
    totalSeats: 10,
    status: 'open',
  }
}

function blankLeaderboardEntry(id) {
  return {
    id,
    name: 'New entry',
    program: 'Program',
    points: 0,
    note: '',
  }
}

function blankGalleryItem(id) {
  return {
    id,
    title: 'New gallery photo',
    category: 'workshop',
    imageUrl: '',
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function getStoredPassword() {
  return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD
}

export default function AdminPanel({
  events,
  setEvents,
  leaderboard,
  setLeaderboard,
  gallery,
  setGallery,
  initialGallery,
  onClose,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('events')
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingLeaderboardId, setEditingLeaderboardId] = useState(null)
  const [editingGalleryId, setEditingGalleryId] = useState(null)
  const [eventForm, setEventForm] = useState(null)
  const [leaderboardForm, setLeaderboardForm] = useState(null)
  const [galleryForm, setGalleryForm] = useState(null)
  const [galleryUploadError, setGalleryUploadError] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const eventMaxId = useMemo(
    () => events.reduce((maxId, event) => Math.max(maxId, event.id), 0),
    [events],
  )
  const leaderboardMaxId = useMemo(
    () => leaderboard.reduce((maxId, entry) => Math.max(maxId, entry.id), 0),
    [leaderboard],
  )
  const galleryMaxId = useMemo(
    () => gallery.reduce((maxId, item) => Math.max(maxId, item.id), 0),
    [gallery],
  )

  useEffect(() => {
    try {
      if (!localStorage.getItem(PASSWORD_STORAGE_KEY)) {
        localStorage.setItem(PASSWORD_STORAGE_KEY, DEFAULT_ADMIN_PASSWORD)
      }
      if (sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true') {
        setIsAuthenticated(true)
      }
    } catch (error) {
      setIsAuthenticated(false)
    }
  }, [])

  const clearForms = () => {
    setEditingEventId(null)
    setEditingLeaderboardId(null)
    setEditingGalleryId(null)
    setEventForm(null)
    setLeaderboardForm(null)
    setGalleryForm(null)
    setGalleryUploadError('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setPasswordMessage('')
  }

  const login = (event) => {
    event.preventDefault()
    const storedPassword = getStoredPassword()

    if (loginPassword !== storedPassword) {
      setLoginError('Invalid password. Try again.')
      return
    }

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
    } catch (error) {
      // Ignore storage errors and keep the local authenticated state.
    }

    setIsAuthenticated(true)
    setLoginError('')
    setLoginPassword('')
  }

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      // Ignore storage errors.
    }

    setIsAuthenticated(false)
    clearForms()
  }

  const startEventEdit = (event) => {
    setActiveTab('events')
    setEditingEventId(event.id)
    setEventForm({ ...event })
  }

  const startLeaderboardEdit = (entry) => {
    setActiveTab('leaderboard')
    setEditingLeaderboardId(entry.id)
    setLeaderboardForm({ ...entry })
  }

  const startGalleryEdit = (item) => {
    setActiveTab('gallery')
    setEditingGalleryId(item.id)
    setGalleryForm({ ...item })
    setGalleryUploadError('')
  }

  const saveEvent = () => {
    if (!eventForm) return

    setEvents(
      events.map((event) =>
        event.id === editingEventId
          ? {
              ...eventForm,
              seats: Number(eventForm.seats),
              totalSeats: Number(eventForm.totalSeats),
            }
          : event,
      ),
    )
    setEditingEventId(null)
    setEventForm(null)
  }

  const saveLeaderboard = () => {
    if (!leaderboardForm) return

    setLeaderboard(
      leaderboard.map((entry) =>
        entry.id === editingLeaderboardId
          ? { ...leaderboardForm, points: Number(leaderboardForm.points) }
          : entry,
      ),
    )
    setEditingLeaderboardId(null)
    setLeaderboardForm(null)
  }

  const addEvent = () => {
    const newEvent = blankEvent(eventMaxId + 1)
    setEvents([newEvent, ...events])
    startEventEdit(newEvent)
  }

  const addLeaderboardEntry = () => {
    const newEntry = blankLeaderboardEntry(leaderboardMaxId + 1)
    setLeaderboard([newEntry, ...leaderboard])
    startLeaderboardEdit(newEntry)
  }

  const saveGallery = () => {
    if (!galleryForm) return

    const normalized = {
      ...galleryForm,
      title: galleryForm.title?.trim() || 'Untitled photo',
      category: galleryForm.category || 'workshop',
      imageUrl: galleryForm.imageUrl || '',
    }

    setGallery(gallery.map((item) => (item.id === editingGalleryId ? normalized : item)))
    setEditingGalleryId(null)
    setGalleryForm(null)
    setGalleryUploadError('')
  }

  const addGalleryItem = () => {
    const newItem = blankGalleryItem(galleryMaxId + 1)
    setGallery([newItem, ...gallery])
    startGalleryEdit(newItem)
  }

  const deleteEvent = (id) => {
    if (!window.confirm('Delete this event?')) return

    setEvents(events.filter((event) => event.id !== id))
    if (editingEventId === id) {
      setEditingEventId(null)
      setEventForm(null)
    }
  }

  const deleteLeaderboardEntry = (id) => {
    if (!window.confirm('Delete this leaderboard entry?')) return

    setLeaderboard(leaderboard.filter((entry) => entry.id !== id))
    if (editingLeaderboardId === id) {
      setEditingLeaderboardId(null)
      setLeaderboardForm(null)
    }
  }

  const deleteGalleryItem = (id) => {
    if (!window.confirm('Delete this gallery photo?')) return

    setGallery(gallery.filter((item) => item.id !== id))
    if (editingGalleryId === id) {
      setEditingGalleryId(null)
      setGalleryForm(null)
      setGalleryUploadError('')
    }
  }

  const handleGalleryFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setGalleryUploadError('Please choose an image file.')
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setGalleryForm((current) => {
        if (!current) return current
        return { ...current, imageUrl: dataUrl }
      })
      setGalleryUploadError('')
    } catch (error) {
      setGalleryUploadError('Could not load this image. Please try a different file.')
    }
  }

  const resetAll = () => {
    if (!window.confirm('Reset events, leaderboard, and password to the original sample data?')) {
      return
    }

    setEvents(initialEvents)
    setLeaderboard(initialLeaderboard)
    setGallery(Array.isArray(initialGallery) ? initialGallery : [])
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, DEFAULT_ADMIN_PASSWORD)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      // Ignore storage errors.
    }
    setIsAuthenticated(false)
    clearForms()
  }

  const exportAll = () => {
    downloadJson('foces-events-admin-data.json', {
      events,
      leaderboard,
      gallery,
      adminPassword: getStoredPassword(),
    })
  }

  const changePassword = (event) => {
    event.preventDefault()
    const storedPassword = getStoredPassword()

    if (currentPassword !== storedPassword) {
      setPasswordError('Current password is incorrect.')
      setPasswordMessage('')
      return
    }

    if (newPassword.trim().length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      setPasswordMessage('')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      setPasswordMessage('')
      return
    }

    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      // Ignore storage errors.
    }

    setIsAuthenticated(false)
    setLoginPassword('')
    setPasswordError('')
    setPasswordMessage('Password updated. Please log in again with the new password.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <p className="section-eyebrow">Admin access</p>
            <h3>Sign in to manage events, leaderboard, and gallery photos.</h3>
            <p>
              Default password: <strong>{DEFAULT_ADMIN_PASSWORD}</strong>
            </p>
          </div>

          <form className="admin-login-form" onSubmit={login}>
            <label>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Enter admin password"
              />
            </label>

            {loginError ? <p className="admin-inline-error">{loginError}</p> : null}

            <div className="admin-login-actions">
              <button type="submit">Sign in</button>
              <button type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          <button
            type="button"
            className={activeTab === 'events' ? 'is-active' : ''}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            type="button"
            className={activeTab === 'leaderboard' ? 'is-active' : ''}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            type="button"
            className={activeTab === 'gallery' ? 'is-active' : ''}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
          <button
            type="button"
            className={activeTab === 'security' ? 'is-active' : ''}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        <div className="admin-actions-row">
          <button type="button" onClick={exportAll}>
            Export JSON
          </button>
          <button type="button" onClick={resetAll}>
            Reset all
          </button>
          <button type="button" onClick={logout}>
            Log out
          </button>
          <button type="button" onClick={onClose}>
            Close admin
          </button>
        </div>
      </div>

      {activeTab === 'events' ? (
        <div className="admin-grid">
          <div className="admin-list">
            <div className="admin-section-head">
              <h3>Events ({events.length})</h3>
              <button type="button" onClick={addEvent}>
                Add event
              </button>
            </div>

            <ul className="admin-list-items">
              {events.map((event) => (
                <li key={event.id} className="admin-list-item">
                  <div>
                    <strong>{event.title}</strong>
                    <p>
                      {event.category} • {event.date}
                    </p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => startEventEdit(event)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteEvent(event.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-editor">
            <h3>Event editor</h3>
            {eventForm ? (
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  saveEvent()
                }}
              >
                <label>
                  Title
                  <input
                    value={eventForm.title}
                    onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })}
                  />
                </label>
                <label>
                  Category
                  <input
                    value={eventForm.category}
                    onChange={(event) => setEventForm({ ...eventForm, category: event.target.value })}
                  />
                </label>
                <label>
                  Date
                  <input
                    value={eventForm.date}
                    onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })}
                  />
                </label>
                <label>
                  Time
                  <input
                    value={eventForm.time}
                    onChange={(event) => setEventForm({ ...eventForm, time: event.target.value })}
                  />
                </label>
                <label>
                  Venue
                  <input
                    value={eventForm.venue}
                    onChange={(event) => setEventForm({ ...eventForm, venue: event.target.value })}
                  />
                </label>
                <label>
                  Speaker
                  <input
                    value={eventForm.speaker}
                    onChange={(event) => setEventForm({ ...eventForm, speaker: event.target.value })}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={eventForm.description}
                    onChange={(event) =>
                      setEventForm({ ...eventForm, description: event.target.value })
                    }
                  />
                </label>
                <label>
                  Registration Link
                  <input
                    type="url"
                    placeholder="e.g. https://forms.gle/... or https://unstop.com/..."
                    value={eventForm.registrationLink || ''}
                    onChange={(event) =>
                      setEventForm({ ...eventForm, registrationLink: event.target.value })
                    }
                  />
                </label>
                <div className="admin-form-row">
                  <label>
                    Seats
                    <input
                      type="number"
                      value={eventForm.seats}
                      onChange={(event) =>
                        setEventForm({ ...eventForm, seats: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Total seats
                    <input
                      type="number"
                      value={eventForm.totalSeats}
                      onChange={(event) =>
                        setEventForm({ ...eventForm, totalSeats: event.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  Status
                  <select
                    value={eventForm.status}
                    onChange={(event) => setEventForm({ ...eventForm, status: event.target.value })}
                  >
                    <option value="open">open</option>
                    <option value="soon">soon</option>
                    <option value="full">full</option>
                  </select>
                </label>
                <div className="admin-form-actions">
                  <button type="submit">Save event</button>
                  <button type="button" onClick={() => setEventForm(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p>Select an event to edit or create a new one.</p>
            )}
          </div>
        </div>
      ) : activeTab === 'leaderboard' ? (
        <div className="admin-grid">
          <div className="admin-list">
            <div className="admin-section-head">
              <h3>Leaderboard ({leaderboard.length})</h3>
              <button type="button" onClick={addLeaderboardEntry}>
                Add entry
              </button>
            </div>

            <ul className="admin-list-items">
              {leaderboard.map((entry, index) => (
                <li key={entry.id} className="admin-list-item">
                  <div>
                    <strong>
                      #{index + 1} {entry.name}
                    </strong>
                    <p>
                      {entry.program} • {entry.points} pts
                    </p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => startLeaderboardEdit(entry)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteLeaderboardEntry(entry.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-editor">
            <h3>Leaderboard editor</h3>
            {leaderboardForm ? (
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  saveLeaderboard()
                }}
              >
                <label>
                  Name
                  <input
                    value={leaderboardForm.name}
                    onChange={(event) =>
                      setLeaderboardForm({ ...leaderboardForm, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Program
                  <input
                    value={leaderboardForm.program}
                    onChange={(event) =>
                      setLeaderboardForm({ ...leaderboardForm, program: event.target.value })
                    }
                  />
                </label>
                <label>
                  Points
                  <input
                    type="number"
                    value={leaderboardForm.points}
                    onChange={(event) =>
                      setLeaderboardForm({ ...leaderboardForm, points: event.target.value })
                    }
                  />
                </label>
                <label>
                  Note
                  <textarea
                    rows="4"
                    value={leaderboardForm.note}
                    onChange={(event) =>
                      setLeaderboardForm({ ...leaderboardForm, note: event.target.value })
                    }
                  />
                </label>
                <div className="admin-form-actions">
                  <button type="submit">Save entry</button>
                  <button type="button" onClick={() => setLeaderboardForm(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p>Select a leaderboard entry to edit or create a new one.</p>
            )}
          </div>
        </div>
      ) : activeTab === 'gallery' ? (
        <div className="admin-grid">
          <div className="admin-list">
            <div className="admin-section-head">
              <h3>Gallery ({gallery.length})</h3>
              <button type="button" onClick={addGalleryItem}>
                Add photo
              </button>
            </div>

            <ul className="admin-list-items">
              {gallery.map((item) => (
                <li key={item.id} className="admin-list-item">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.category}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => startGalleryEdit(item)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteGalleryItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-editor">
            <h3>Gallery editor</h3>
            {galleryForm ? (
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  saveGallery()
                }}
              >
                <label>
                  Title
                  <input
                    value={galleryForm.title}
                    onChange={(event) =>
                      setGalleryForm({ ...galleryForm, title: event.target.value })
                    }
                  />
                </label>

                <label>
                  Category
                  <select
                    value={galleryForm.category || 'workshop'}
                    onChange={(event) =>
                      setGalleryForm({ ...galleryForm, category: event.target.value })
                    }
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </label>

                <label>
                  Image URL
                  <input
                    type="url"
                    placeholder="https://example.com/event-photo.jpg"
                    value={galleryForm.imageUrl || ''}
                    onChange={(event) =>
                      setGalleryForm({ ...galleryForm, imageUrl: event.target.value })
                    }
                  />
                </label>

                <label>
                  Upload image file
                  <input type="file" accept="image/*" onChange={handleGalleryFileChange} />
                </label>

                {galleryUploadError ? <p className="admin-inline-error">{galleryUploadError}</p> : null}

                {galleryForm.imageUrl ? (
                  <img
                    src={galleryForm.imageUrl}
                    alt="Gallery preview"
                    className="admin-gallery-preview"
                  />
                ) : null}

                <div className="admin-form-actions">
                  <button type="submit">Save photo</button>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryForm(null)
                      setGalleryUploadError('')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p>Select a gallery photo to edit or add a new one.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-grid">
          <div className="admin-list">
            <div className="admin-section-head">
              <h3>Password security</h3>
            </div>
            <p>
              Current password is stored locally in your browser. Use the form on the right to
              change it.
            </p>
          </div>

          <div className="admin-editor">
            <h3>Change password</h3>
            <form className="admin-form" onSubmit={changePassword}>
              <label>
                Current password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </label>
              <label>
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>

              {passwordError ? <p className="admin-inline-error">{passwordError}</p> : null}
              {passwordMessage ? <p className="admin-inline-success">{passwordMessage}</p> : null}

              <div className="admin-form-actions">
                <button type="submit">Update password</button>
                <button type="button" onClick={() => setActiveTab('events')}>
                  Back to events
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
