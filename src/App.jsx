import { useEffect, useMemo, useState } from 'react'
import AdminPanel from './components/AdminPanel.jsx'
import EventCard from './components/EventCard.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import SearchFilter from './components/SearchFilter.jsx'
import { events as initialEvents } from './data/events.js'
import './App.css'

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

const initialGallery = [
  {
    id: 1,
    title: 'Workshop nights',
    category: 'workshop',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Hackathon energy',
    category: 'hackathon',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Speaker sessions',
    category: 'seminar',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
  },
]

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname + window.location.hash)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [events, setEvents] = useState(initialEvents)
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard)
  const [gallery, setGallery] = useState(initialGallery)

  const clearAdminSession = () => {
    try {
      sessionStorage.removeItem('foces-admin-session')
    } catch (e) {
      // Ignore storage errors.
    }
  }

  const navigateTo = (nextPath) => {
    const isLeavingAdmin = pathname.startsWith('/admin') && !nextPath.startsWith('/admin')

    if (isLeavingAdmin) {
      clearAdminSession()
    }

    const currentFullPath = window.location.pathname + window.location.hash
    if (currentFullPath !== nextPath) {
      window.history.pushState({}, '', nextPath)
      setPathname(nextPath)
    } else {
      // If already on the target path/hash, manually trigger scroll
      const hashIndex = nextPath.indexOf('#')
      if (hashIndex !== -1) {
        const hash = nextPath.slice(hashIndex + 1)
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (!nextPath.startsWith('/admin')) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('foces-events-admin-data')
      if (!saved) return

      const parsed = JSON.parse(saved)

      if (Array.isArray(parsed.events)) setEvents(parsed.events)
      if (Array.isArray(parsed.leaderboard)) setLeaderboard(parsed.leaderboard)
      if (Array.isArray(parsed.gallery)) setGallery(parsed.gallery)
    } catch (e) {
      // Ignore malformed storage and keep the bundled sample data.
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('foces-events-admin-data', JSON.stringify({ events, leaderboard, gallery }))
    } catch (e) {
      // Ignore storage quota or privacy errors.
    }
  }, [events, leaderboard, gallery])

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname + window.location.hash)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const hashIndex = pathname.indexOf('#')
    if (hashIndex !== -1) {
      const hash = pathname.slice(hashIndex + 1)
      const element = document.getElementById(hash)
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        return () => clearTimeout(timer)
      }
    } else if (!pathname.startsWith('/admin')) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const categories = useMemo(
    () => ['All', ...new Set(events.map((event) => event.category))],
    [events],
  )

  const visibleEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return events.filter((event) => {
      const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory
      const searchableText = [event.title, event.category, event.speaker, event.description]
        .join(' ')
        .toLowerCase()

      return categoryMatch && (normalizedQuery.length === 0 || searchableText.includes(normalizedQuery))
    })
  }, [events, query, selectedCategory])

  const upcomingEventsCount = events.length
  const categoryCount = categories.length - 1
  const memberCount = 240
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <div className="app-shell" id="top">
        <Header isAdminRoute onNavigateTo={navigateTo} />

        <main className="page-shell">
          <section id="admin" className="content-section">
            <div className="section-heading-row">
              <div>
                <p className="section-eyebrow">Admin</p>
                <h2>Event editor & leaderboard</h2>
              </div>
            </div>

            <AdminPanel
              events={events}
              setEvents={setEvents}
              leaderboard={leaderboard}
              setLeaderboard={setLeaderboard}
              gallery={gallery}
              setGallery={setGallery}
              initialGallery={initialGallery}
              onClose={() => navigateTo('/')}
            />
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="app-shell" id="top">
      <Header isAdminRoute={false} onNavigateTo={navigateTo} />

      <main className="page-shell">
        <Hero
          upcomingEventsCount={upcomingEventsCount}
          categoryCount={categoryCount}
          memberCount={memberCount}
        />

        <SearchFilter
          query={query}
          onQueryChange={setQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          visibleCount={visibleEvents.length}
          totalCount={events.length}
        />

        <section id="events" className="content-section">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">Featured events</p>
              <h2>Browse the latest FOCES sessions and student competitions.</h2>
            </div>
            <p className="section-copy">
              Filter by topic, scan the details, and reserve your place before seats fill up.
            </p>
          </div>

          <div className="event-grid">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {visibleEvents.length === 0 ? (
            <div className="empty-state">
              <h3>No events match your search.</h3>
              <p>Try clearing the search term or switching to a different category.</p>
            </div>
          ) : null}
        </section>

        <section id="about" className="content-section content-section--split">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">About FOCES</p>
              <h2>Forum of Computer Engineering Students.</h2>
            </div>
            <p className="section-copy">
              We create a steady calendar of learning-first activities that help students build
              skills, meet mentors, and showcase work.
            </p>
          </div>

          <div className="info-grid">
            <article className="info-card">
              <h3>Student-led, practical, and inclusive</h3>
              <p>
                Every event is structured around hands-on learning and peer collaboration so
                students can leave with something they can reuse immediately.
              </p>
            </article>
            <article className="info-card">
              <h3>Designed for momentum</h3>
              <p>
                We keep the schedule visible, the registration flow simple, and the event data
                lightweight so students can move from discovery to participation quickly.
              </p>
            </article>
          </div>
        </section>

        <section id="team" className="content-section">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">Team</p>
              <h2>People who keep the forum moving.</h2>
            </div>
          </div>

          <div className="team-grid">
            <article className="team-card">
              <span className="team-role">Leadership</span>
              <h3>Executive Board</h3>
              <p>Guides planning, approvals, and the overall event calendar.</p>
            </article>
            <article className="team-card">
              <span className="team-role">Technical</span>
              <h3>Build Crew</h3>
              <p>Handles event logistics, registration details, and production support.</p>
            </article>
            <article className="team-card">
              <span className="team-role">Outreach</span>
              <h3>Media Team</h3>
              <p>Keeps the community informed with announcements, highlights, and visuals.</p>
            </article>
          </div>
        </section>

        <section id="leaderboard" className="content-section">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">Leaderboard</p>
              <h2>Current rankings and recognition.</h2>
            </div>
            <p className="section-copy">
              Track the current top performers, projects, and teams. The admin tab can update these
              cards directly.
            </p>
          </div>

          <div className="leaderboard-grid">
            {leaderboard.map((entry, index) => (
              <article key={entry.id} className="leaderboard-card">
                <span className="leaderboard-rank">#{index + 1}</span>
                <h3>{entry.name}</h3>
                <p className="leaderboard-program">{entry.program}</p>
                <strong className="leaderboard-points">{entry.points} pts</strong>
                <p className="leaderboard-note">{entry.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="content-section">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">Gallery</p>
              <h2>Snapshots of the event experience.</h2>
            </div>
          </div>

          <div className="gallery-grid">
            {gallery.map((item) => (
              <article
                key={item.id}
                className={`gallery-tile gallery-tile--${item.category || 'workshop'}`}
                style={item.imageUrl ? { backgroundImage: `linear-gradient(160deg, rgba(0, 0, 0, 0.2), rgba(10, 14, 26, 0.85)), url(${item.imageUrl})` } : undefined}
              >
                <span>{item.title}</span>
              </article>
            ))}
          </div>

          {gallery.length === 0 ? (
            <div className="empty-state">
              <h3>No photos in the gallery.</h3>
              <p>Add some event photos using the admin panel.</p>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
