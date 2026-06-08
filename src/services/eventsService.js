import { getSupabaseClient } from '../supabase/client.js'

const EVENT_COLUMNS =
  'id, title, category, date, time, venue, speaker, description, registration_link, seats, total_seats, status, created_at, updated_at'

function mapRowToEvent(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    time: row.time,
    venue: row.venue,
    speaker: row.speaker,
    description: row.description,
    registrationLink: row.registration_link || '',
    seats: row.seats,
    totalSeats: row.total_seats,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapEventToInsert(event) {
  return {
    title: event.title,
    category: event.category,
    date: event.date,
    time: event.time,
    venue: event.venue,
    speaker: event.speaker,
    description: event.description,
    registration_link: event.registrationLink || null,
    seats: Number(event.seats),
    total_seats: Number(event.totalSeats),
    status: event.status,
  }
}

function handleSupabaseError(error, fallbackMessage) {
  if (!error) return
  throw new Error(error.message || fallbackMessage)
}

export async function fetchEvents() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .order('id', { ascending: true })

  handleSupabaseError(error, 'Failed to fetch events.')
  return (data || []).map(mapRowToEvent)
}

export async function createEvent(payload) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('events').insert(mapEventToInsert(payload))

  handleSupabaseError(error, 'Failed to create event.')
}

export async function updateEventById(eventId, payload) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('events')
    .update(mapEventToInsert(payload))
    .eq('id', eventId)

  handleSupabaseError(error, 'Failed to update event.')
}

export async function deleteEventById(eventId) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('events').delete().eq('id', eventId)

  handleSupabaseError(error, 'Failed to delete event.')
}