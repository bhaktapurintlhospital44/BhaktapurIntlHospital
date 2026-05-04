"use client";
import { useState, useEffect } from 'react';
import { getDoctors, 
  createDoctor as createDoctorAPI,
  updateDoctor as updateDoctorAPI,
  deleteDoctor as deleteDoctorAPI
} from '@/lib/api/doctors'; // Import here

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "", specialization: "", qualification: "", experience: "", bio: "", image: "",
  Email: "", contactNumber: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [file, setFile] = useState(null);
  const [newDoct, setNewDoct] = useState({ 
  name: "", specialization: "", qualification: "", experience: "", bio: "", image: "",
  Email: "", contactNumber: ""
  }); 

    useEffect(() => {
      loadDocts();
    }, []);

  const loadDocts = async () => {
    try {
      setLoading(true);
      const data = await getDoctors(); // Use the clean function
      if (Array.isArray(data)) setDoctors(data);
    } catch (err) {
      alert("Failed to load doctors");
    } finally{
      setLoading(false);
    }
};

  // --- EMAIL VERIFICATION HELPER ---
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

    // --- ADD NEW LOGIC ---
  const handleCreate = async () => {
    if (!newDoct.name) return alert("Doctors name is required!");
    if (newDoct.email && !isValidEmail(newDoct.email)) return alert("Please enter a valid email address!");
    
    try {
      await createDoctorAPI(newDoct);
      setNewDoct({ name: "", description: "", image: "", specialization: "", qualification: "", experience: "", bio: "", contactNumber: "", email: "" });
      setShowAddForm(false);
      loadDocts();
      alert("New doctor added!");
    } catch (err) {
      alert("Error adding doctor.");
    }
  };

  // Dele logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Doctor? This action cannot be undone.")) {
      try {
        await deleteDoctorAPI(id);
        loadDocts();
        alert("Doctor deleted successfully");
      } catch (err) {
        alert("Error deleting Doctor");
      }
    }
  };

  // --- EDIT LOGIC ---
  const handleEditClick = (doct) => {
    setEditingId(doct._id);
    setEditForm({ name: "", description: "", image: "", specialization: "", qualification: "", experience: "", bio: "", contactNumber: "", email: "" 
    });
  };

  //handle save
  const handleSave = async (id) => {
    if (editForm.email && !isValidEmail(editForm.email)) return alert("Please enter a valid email address!");
        try {
      await updateDoctorAPI(id, editForm);
      setEditingId(null);
      loaddocts(); 
      alert("Changes saved successfully!");
    } catch (err) {
      alert("Error saving changes.");
    }
  };

  if (loading) return <div style={styles.centerText}><h2>Loading Admin Panel...</h2></div>;

  return(
    <div style={styles.container}>
      <h1 style={styles.title}>Doctor Administration</h1>

      <div style={styles.addSection}>
        {!showAddForm ? (
          <button onClick={() => setShowAddForm(true)} style={styles.addNewBtn}>
            + Add New Doctor
          </button>
        ) : (
         <div style={styles.addForm}>
            <h3>Add New Doctor</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>Doctor Name</label>
              <input style={styles.input} placeholder="Doctor Name" value={newDoct.name} onChange={e => setNewDoct({...newDoct, name: e.target.value})} />

              <label style={styles.label}>Contact Number</label>
              <input style={styles.input} placeholder="Contact Number (97/98...)" value={newDoct.contactNumber} 
                onChange={e => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 10) {
                    if (val.length >= 2) {
                      const prefix = val.substring(0, 2);
                      if (prefix === '97' || prefix === '98') setNewDoct({...newDoct, contactNumber: val});
                    } else if (val === '' || val === '9') {
                      setNewDoct({...newDoct, contactNumber: val});
                    }
                  }
              }}/>

              <label style={styles.label}>Specialization</label>
              <input style={styles.input} placeholder="specialization" value={newDoct.specialization} onChange={e => setNewDoct({...newDoct, specialization: e.target.value})} />

              <label style={styles.label}>Qualification</label>
              <input style={styles.input} placeholder="qualification" value={newDoct.qualification} onChange={e => setNewDoct({...newDoct, qualification: e.target.value})} />
              
              <label style={styles.label}>Email</label>
              <input style={{...styles.input, }} placeholder="Email" value={newDoct.email} onChange={e => setNewDoct({...newDoct, email: e.target.value})} />

              <label style={styles.label}>Description</label>
              <textarea style={{...styles.input,}} placeholder="Description" value={newDoct.description} onChange={e => setNewDoct({...newDoct, description: e.target.value})} />
            </div>

              <label style={styles.label}>Image</label>
            <input type="file" accept="image/*" style={styles.input} placeholder="Image "
              onChange={(e) => {
              const file = e.target.files[0]; // Get the first file selected
              setNewDept({ ...newDept, image: file }); // Store the actual file object
            }}/>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={handleCreate} style={styles.saveBtn}>Create</button>
              <button onClick={() => setShowAddForm(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <div style={styles.grid}>
        {doctors.map((doct) => (
          <div key={doct._id} style={styles.card}>
            {editingId === doct._id ? (
              <div style={styles.formGroup}>
                <h3>Edit Mode</h3>
                <label style={styles.label}>Doctor Name</label>
                <input style={styles.input} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>specialization</label>
                    <input style={styles.input} value={editForm.specialization} onChange={e => setEditForm({...editForm, specialization: e.target.value})} />
                  </div>
                  <div>
                    <label style={styles.label}>qualification</label>
                    <input style={styles.input} value={editForm.qualification} onChange={e => setEditForm({...editForm, qualification: e.target.value})} />
                  </div>
                </div>

                <label style={styles.label}>Contact Number</label>
                <input style={styles.input} value={editForm.contactNumber} onChange={e => setEditForm({...editForm, contactNumber: e.target.value})} />

                <label style={styles.label}>Email</label>
                <input style={styles.input} value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />

                <label style={styles.label}>Description</label>
                <textarea style={{...styles.input, height: '60px'}} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />

                <label style={styles.label}>Image </label>
                <input type="file" accept="image/*" style={styles.input} placeholder="Image "
                  onChange={(e) => {
                  const file = e.target.files[0]; // Get the first file selected
                  setNewDept({ ...newDept, image: file }); // Store the actual file object
                } }/>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleSave(doct._id)} style={styles.saveBtn}>Save</button>
                  <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <img src={doct.image || 'https://via.placeholder.com/150'} style={{...styles.image, width: '50%', height: '120px'}} alt="" />
                </div>
                <h2 style={styles.doctName}>{doct.name}</h2>
                <p><strong>Doctors:</strong> {doct.specialization} & {doct.qualification || 'None'}</p>
                <p style={styles.descriptionText}>{doct.description}</p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEditClick(doct)} style={styles.editBtn}>Edit Details</button>
                  <button onClick={() => handleDelete(doct._id)} style={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
const styles = {
  container: { padding: '2rem', margin: '0 auto', fontFamily: 'sans-serif' },
  title: { textAlign: 'center', color: '#1e40af', marginBottom: '1rem' },
  label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#666', display: 'block', marginTop: '10px' },
  addSection: { marginBottom: '3rem', display: 'flex', justifyContent: 'center' },
  addForm: { background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '2px dashed #cbd5e1', width: '100%', maxWidth: '700px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' },
  card: { border: '1px solid #ddd', borderRadius: '12px', padding: '20px', backgroundColor: '#fff' },
  image: { objectFit: 'cover', borderRadius: '8px' },
  doctName: { color: '#1e40af', margin: '0 0 10px 0' },
  descriptionText: { fontSize: '0.9rem', color: '#666', marginBottom: '15px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' },
  addNewBtn: { padding: '12px 24px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  saveBtn: { flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  editBtn: { flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { flex: 1, padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  centerText: { textAlign: 'center', padding: '100px' }};
    
  



//   // 3. Submit Form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imagePath = '';

//       // First, upload the image if a file was selected
//     if (file) {
//         const imagenewDoct = new newDoct();
//         imagenewDoct.append('image', file);

//         const uploadRes = await fetch('http://localhost:4000/api/doctors/upload-image', {
//         method: 'POST',
//         body: imagenewDoct,
//         });
//         const uploadData = await uploadRes.json();
//         imagePath = uploadData.imagePath;
//       }

//       // Second, save the doctor record with the image path
//       const doctorRes = await fetch('http://localhost:4000/api/doctors', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...newDoct, image: imagePath }),
//       });

//       if (doctorRes.ok) {
//         alert("Doctor added successfully!");
//         setNewDoct({ name: '', specialization: '', bio: '' , image: ''});
//         setFile(null);
//         fetchDoctors();
//       }
//     } catch (error) {
//       console.error("Error saving doctor:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
//       <h1>Doctor Management</h1>
      
//       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
//         <input type="text" placeholder="Full Name" value={newDoct.name} onChange={e => setNewDoct({...newDoct, name: e.target.value})} required />
//         <input type="text" placeholder="Specialization (e.g. Cardiologist)" value={newDoct.specialization} onChange={e => setNewDoct({...newDoct, specialization: e.target.value})} required />
//                       <input style={styles.input} placeholder="Contact Number (97/98...)" value={newDoct.contactNumber} 
//                 onChange={e => {
//                   const val = e.target.value;
//                   if (/^\d*$/.test(val) && val.length <= 10) {
//                     if (val.length >= 2) {
//                       const prefix = val.substring(0, 2);
//                       if (prefix === '97' || prefix === '98') setNewDoct({...newDoct, contactNumber: val});
//                     } else if (val === '' || val === '9') {
//                       setNewDoct({...newDoct, contactNumber: val});
//                     }
//                   }
//                 }}/>
//         <textarea placeholder="Doctor Bio" value={newDoct.bio} onChange={e => setNewDoct({...newDoct, bio: e.target.value})} />
        
//         <div>
//           <label>Profile Photo: </label>
//           <input type="file" onChange={handleFileChange} accept="image/*" />
//         </div>

//         <button type="submit" disabled={loading} style={{ padding: '0.5rem', background: '#0b7ac4', color: 'white', border: 'none', cursor: 'pointer' }}>
//           {loading ? 'Saving...' : 'Add Doctor to Database'}
//         </button>
//       </form>

//       <h2>Current Doctors List</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
//         {doctors.map(doc => (
//           <div key={doc._id} style={{ border: '1px solid #eee', padding: '1rem', textAlign: 'center' }}>
//             <img src={`http://localhost:4000${doc.image}`} alt={doc.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
//             <h3>{doc.name}</h3>
//             <p>{doc.specialization}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }