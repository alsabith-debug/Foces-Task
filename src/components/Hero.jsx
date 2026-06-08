export default function Hero({ upcomingEventsCount, categoryCount, memberCount }) {
  return (
    <section className="hero-panel">
      <div className="hero-badge">
        <span className="hero-badge-dot" aria-hidden="true" />
        Live schedule
      </div>

      <div className="hero-copy">
        <p className="hero-kicker">FOCES Events Hub</p>
        <h1>
          Discover <span className="hero-highlight">engineering events</span> that move ideas
          forward.
        </h1>
        <p className="hero-text">
          Workshops, seminars, hackathons, and competitions curated for students who want to
          build, learn, and connect.
        </p>
      </div>

      <div className="hero-stats" aria-label="Event statistics">
        <article className="stat-card">
          <span className="stat-value">{upcomingEventsCount}</span>
          <span className="stat-label">Upcoming events</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{categoryCount}</span>
          <span className="stat-label">Event categories</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{memberCount}</span>
          <span className="stat-label">Forum members</span>
        </article>
      </div>
    </section>
  )
}