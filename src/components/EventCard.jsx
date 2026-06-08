function DateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 3v4M17 3v4M4.5 8.5h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

function TimeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function VenueIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-5 9v-1a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v1m3-9h4m-2-2v4" />
    </svg>
  )
}

function MetaRow({ icon, label, value }) {
  return (
    <div className="event-meta-row">
      <span className="event-meta-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="event-meta-text">
        <span className="event-meta-label">{label}</span>
        <span className="event-meta-value">{value}</span>
      </span>
    </div>
  )
}

function getStatusLabel(status) {
  if (status === 'soon') return 'Starting soon'
  if (status === 'full') return 'Full'
  return 'Open'
}

export default function EventCard({ event }) {
  const seatsRemaining = Math.max(event.totalSeats - event.seats, 0)
  const categoryClass = event.category.toLowerCase()

  return (
    <article className="event-card">
      <div className="event-card-top">
        <span className={`category-badge category-badge--${categoryClass}`}>{event.category}</span>
        <span className={`status-chip status-chip--${event.status}`}>
          <span className="status-dot" aria-hidden="true" />
          {getStatusLabel(event.status)}
        </span>
      </div>

      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description}</p>

      <div className="event-meta" aria-label="Event details">
        <MetaRow icon={<DateIcon />} label="Date" value={event.date} />
        <MetaRow icon={<TimeIcon />} label="Time" value={event.time} />
        <MetaRow icon={<VenueIcon />} label="Venue" value={event.venue} />
        <MetaRow icon={<SpeakerIcon />} label="Speaker" value={event.speaker} />
      </div>

      <div className="event-footer">
        <p className="seats-remaining">{seatsRemaining} seats remaining</p>
        {event.status === 'full' ? (
          <button type="button" className="register-button" disabled>
            Full
          </button>
        ) : event.registrationLink ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="register-button"
          >
            Register
          </a>
        ) : (
          <button
            type="button"
            className="register-button"
            onClick={() => alert('Registration link is not yet available for this event.')}
          >
            Register
          </button>
        )}
      </div>
    </article>
  )
}