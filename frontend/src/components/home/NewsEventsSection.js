const dummyNews = [
  {
    id: 1,
    title: "Free Health Camp at Bhaktapur",
    date: "2025-01-15",
  },
  {
    id: 2,
    title: "New Cardiology Wing Inaugurated",
    date: "2025-02-10",
  },
];

export default function NewsEventsSection() {
  return (
    <section style={{ padding: "2rem 0" }}>
      <h2>News & Events</h2>
      <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
        {dummyNews.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.35rem" }}>
            <strong>{item.title}</strong> <span style={{ fontSize: "0.85rem" }}>({item.date})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
