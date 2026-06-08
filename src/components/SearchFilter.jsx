export default function SearchFilter({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  categories,
  visibleCount,
  totalCount,
}) {
  return (
    <section className="filter-panel" aria-labelledby="filter-heading">
      <div className="filter-heading-row">
        <div>
          <p className="section-eyebrow">Find your event</p>
          <h2 id="filter-heading">Search by title, category, speaker, or description.</h2>
        </div>
        <p className="filter-count" aria-live="polite">
          {visibleCount} of {totalCount} events
        </p>
      </div>

      <label className="search-field" htmlFor="event-search">
        <span className="search-label">Search events</span>
        <input
          id="event-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try ‘workshop’, ‘Amina’, or ‘AI ethics’"
        />
      </label>

      <div className="category-group" role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-pill ${selectedCategory === category ? 'is-active' : ''}`}
            aria-pressed={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  )
}