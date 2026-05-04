export default function AdminDashboardPage() {
  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p style={{ marginTop: "0.5rem" }}>
        Welcome to the admin panel. Use the sidebar to manage content across the
        website.
      </p>
      <div className="card-grid mt-md">
        <div className="card">
          <h3>Edit Home Page</h3>
          <p>Update hero section, services, specialities, and more.</p>
        </div>
        <div className="card">
          <h3>Edit About Page</h3>
          <p>Manage mission, vision, leadership, and recognition content.</p>
        </div>
        <div className="card">
          <h3>Edit Doctors Page</h3>
          <p>Manage doctor profiles, specialties, and availability.</p>
        </div>
        <div className="card">
          <h3>Edit Departments</h3>
          <p>Add, remove, or update hospital departments.</p>
        </div>
        <div className="card">
          <h3>Edit Health Packages</h3>
          <p>Customize preventive health checkup plans.</p>
        </div>
        <div className="card">
          <h3>Edit Patient Stories</h3>
          <p>Share inspiring recovery journeys.</p>
        </div>
        <div className="card">
          <h3>Edit Reports Page</h3>
          <p>Share inspiring recovery journeys.</p>
        </div>
        <div className="card">
          <h3>Edit FAQs</h3>
          <p>Answer common visitor questions.</p>
        </div>
        <div className="card">
          <h3>Feed Backs</h3>
          <p>Update contact info, video, and global preferences.</p>
        </div>
      </div>
    </section>
  );
}
