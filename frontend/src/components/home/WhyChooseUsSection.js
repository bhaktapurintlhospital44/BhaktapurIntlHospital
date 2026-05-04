const reasons = [
  "Experienced and compassionate doctors",
  "Modern infrastructure and equipment",
  "Patient-centered care philosophy",
  "Convenient location and 24/7 services",
];

export default function WhyChooseUsSection() {
  return (
    <section style={{ padding: "2rem 0" }}>
      <h2>Why Choose Us</h2>
      <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
        {reasons.map((reason) => (
          <li key={reason} style={{ marginBottom: "0.35rem" }}>
            {reason}
          </li>
        ))}
      </ul>
    </section>
  );
}
