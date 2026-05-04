"use client";
import { useState, useEffect } from "react";
import {
  getDepartments,
  updateDepartment,
  createDepartment,
  deleteDepartment,
} from "@/lib/api/departments"; //import functions for adding, updating, deleting departments api calls

//function dealing with access of edit delete and create department for admin bascally variable inialization and functions for handling form data and api calls
export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // For handling form data for both edit and create forms
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    image: "",
    imageIcon: "",
    contactNumber: "",
    email: "",
    doctors: [],
  });
  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
    image: "",
    imageIcon: "",
    contactNumber: "",
    email: "",
    doctors: [],
  });

  useEffect(() => {
    loadDepts();
  }, []);
  const loadDepts = async () => {
    const data = await getDepartments();
    setDepartments(data || []);
  };

  const handleDocChange = (index, field, value, isEdit) => {
    const state = isEdit ? editForm : newDept;
    const setter = isEdit ? setEditForm : setNewDept;
    const docs = [...state.doctors];
    docs[index][field] = value;
    setter({ ...state, doctors: docs });
  };

  const addDoc = (isEdit) => {
    const state = isEdit ? editForm : newDept;
    const setter = isEdit ? setEditForm : setNewDept;
    setter({
      ...state,
      doctors: [...state.doctors, { name: "", description: "", image: null }],
    });
  };

  const removeDoc = (index, isEdit) => {
    const state = isEdit ? editForm : newDept;
    const setter = isEdit ? setEditForm : setNewDept;
    setter({ ...state, doctors: state.doctors.filter((_, i) => i !== index) });
  };

  const packData = (data) => {
    const fd = new FormData();
    fd.append("name", data.name || "");
    fd.append("description", data.description || "");
    fd.append("contactNumber", data.contactNumber || "");
    fd.append("email", data.email || "");
    if (data.image instanceof File) fd.append("image", data.image);
    if (data.imageIcon instanceof File) {
      fd.append("imageIcon", data.imageIcon); // The key MUST be "imageIcon"
    }

    const docMeta = data.doctors.map((d) => ({
      name: d.name,
      description: d.description,
      image: typeof d.image === "string" ? d.image : "",
      imageIcon: typeof d.imageIcon === "string" ? d.imageIcon : "",
    }));
    fd.append("doctors", JSON.stringify(docMeta));

    data.doctors.forEach((d, i) => {
      if (d.image instanceof File) fd.append(`doctor_image_${i}`, d.image);
    });
    return fd;
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateDepartment(id, packData(editForm));
      setEditingId(null);
      loadDepts();
      alert("Updated!");
    } catch (e) {
      alert("Error updating");
    }
  };

  const handleCreate = async () => {
    try {
      await createDepartment(packData(newDept));
      setNewDept({
        name: "",
        description: "",
        image: "",
        imageIcon: "",
        contactNumber: "",
        email: "",
        doctors: [],
      });
      setShowAddForm(false);
      loadDepts();
      alert("Created!");
    } catch (e) {
      alert("Error creating");
    }
  };

  // Main render show forms and list of departments with edit delete options
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Department Management</h1>

      {/* Add New Department Form */}
      {!showAddForm ? (
        <button style={styles.addBtn} onClick={() => setShowAddForm(true)}>
          + New Department
        </button>
      ) : (
        <div style={styles.formCard}>
          <h3>Add New</h3>
          <label>Department Nam</label>
          <input
            style={styles.input}
            placeholder="Name"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
          />
          <label>Department Image Icon</label>
          <input
            type="file"
            onChange={(e) =>
              setNewDept({ ...newDept, imageIcon: e.target.files[0] })
            }
          />

          {/* <label>Phone</label>
          <input style={styles.input} placeholder="Phone" value={newDept.contactNumber} onChange={e => setNewDept({...newDept, contactNumber: e.target.value})} /> */}

          {/* <label>Email</label>
          <input style={styles.input} placeholder="Email" value={newDept.email} onChange={e => setNewDept({...newDept, email: e.target.value})} /> */}

          <label>Description</label>
          <textarea
            style={styles.input}
            placeholder="Description"
            value={newDept.description}
            onChange={(e) =>
              setNewDept({ ...newDept, description: e.target.value })
            }
          />

          <label>Main Image</label>
          <input
            type="file"
            onChange={(e) =>
              setNewDept({ ...newDept, image: e.target.files[0] })
            }
          />

          <div style={styles.docBox}>
            <h4>Doctors</h4>
            {newDept.doctors.map((d, i) => (
              <div key={i} style={styles.docRow}>
                <input
                  placeholder="Doc Name"
                  style={styles.input}
                  onChange={(e) =>
                    handleDocChange(i, "name", e.target.value, false)
                  }
                />
                <textarea
                  placeholder="Doc Bio"
                  style={styles.input}
                  onChange={(e) =>
                    handleDocChange(i, "description", e.target.value, false)
                  }
                />
                <input
                  type="file"
                  onChange={(e) =>
                    handleDocChange(i, "image", e.target.files[0], false)
                  }
                />
                <button onClick={() => removeDoc(i, false)}>✕</button>
              </div>
            ))}
            <button onClick={() => addDoc(false)}>+ Add Doctor</button>
          </div>
          <button style={styles.saveBtn} onClick={handleCreate}>
            Create Department
          </button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      <div style={styles.grid}>
        {departments.map((dept) => (
          <div key={dept._id} style={styles.card}>
            {editingId === dept._id ? (
              <div>
                <label>Name</label>
                <input
                  style={styles.input}
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <label>Department Image Icon</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewDept({ ...editForm, imageIcon: e.target.files[0] })
                  }
                />

                {/* <label>Phone</label>
                <input style={styles.input} value={editForm.contactNumber} onChange={e => setEditForm({...editForm, contactNumber: e.target.value})} /> */}

                {/* <label>Email</label>
                <input style={styles.input} value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /> */}

                <label>Description</label>
                <textarea
                  style={styles.input}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />

                <label>Main Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.files[0] })
                  }
                />

                <div style={styles.docBox}>
                  {editForm.doctors.map((d, i) => (
                    <div key={i} style={styles.docRow}>
                      <input
                        value={d.name}
                        style={styles.input}
                        onChange={(e) =>
                          handleDocChange(i, "name", e.target.value, true)
                        }
                      />
                      <textarea
                        value={d.description}
                        style={styles.input}
                        onChange={(e) =>
                          handleDocChange(
                            i,
                            "description",
                            e.target.value,
                            true,
                          )
                        }
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          handleDocChange(i, "image", e.target.files[0], true)
                        }
                      />
                      <button onClick={() => removeDoc(i, true)}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => addDoc(true)}>+ Add Doc</button>
                </div>
                <button
                  style={styles.saveBtn}
                  onClick={() => handleSaveEdit(dept._id)}
                >
                  Apply
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <img
                  src={dept.image}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  alt=""
                />
                <h3>{dept.name}</h3>
                <button
                  onClick={() => {
                    setEditingId(dept._id);
                    setEditForm(dept);
                  }}
                >
                  Edit
                </button>
                <button
                  style={{ color: "red" }}
                  onClick={() => deleteDepartment(dept._id).then(loadDepts)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: { border: "1px solid #ddd", padding: "15px", borderRadius: "8px" },
  formCard: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
  },
  docBox: {
    background: "#fff",
    padding: "10px",
    border: "1px solid #eee",
    marginBottom: "10px",
  },
  docRow: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  saveBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    marginRight: "10px",
  },
  addBtn: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    marginBottom: "20px",
  },
};
