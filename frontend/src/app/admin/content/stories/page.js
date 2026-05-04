"use client";

import { useState, useEffect } from "react";
import { getStories, createStory, updateStory, deleteStory } from '@/lib/api/healthPackages';
import styles from './storiesAdmin.module.css';

// Drag and drop helper function
const uploadImage = async (file) => {
  // In a real implementation, you would upload to your server or a service like Cloudinary
  // For now, returning a placeholder URL
  return URL.createObjectURL(file);
};

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [newStory, setNewStory] = useState({ 
    title: '', 
    patient: '', 
    summary: '', 
    content: '', 
    order: 0,
    image: ''
  });

  // Load stories from the backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        setStories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleCreateStory = async (e) => {
    e.preventDefault();
    try {
      const createdStory = await createStory(newStory);
      setStories(prev => [...prev, createdStory]);
      setNewStory({ 
        title: '', 
        patient: '', 
        summary: '', 
        content: '', 
        order: 0,
        image: ''
      });
      alert('Story created successfully');
    } catch (err) {
      console.error('Error creating story:', err);
      alert('Error creating story');
    }
  };

  const handleUpdateStory = async (e) => {
    e.preventDefault();
    try {
      const updatedStory = await updateStory(editingStory._id, editingStory);
      setStories(prev => prev.map(story => 
        story._id === updatedStory._id ? updatedStory : story
      ));
      setEditingStory(null);
      alert('Story updated successfully');
    } catch (err) {
      console.error('Error updating story:', err);
      alert('Error updating story');
    }
  };

  const handleDeleteStory = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(id);
        setStories(prev => prev.filter(story => story._id !== id));
        alert('Story deleted successfully');
      } catch (err) {
        console.error('Error deleting story:', err);
        alert('Error deleting story');
      }
    }
  };

  const startEditing = (story) => {
    setEditingStory({ ...story });
  };

  const cancelEditing = () => {
    setEditingStory(null);
  };

  const updateEditingStory = (field, value) => {
    setEditingStory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return <div className="p-6">Loading stories...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Patient Recovery Stories</h1>
      </div>
      
      {error && (
        <div className={styles.error}>
          Error loading stories: {error}
        </div>
      )}

      {/* Add New Story Form */}
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Add New Story</h2>
        <form onSubmit={handleCreateStory}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Title</label>
              <input
                type="text"
                value={newStory.title}
                onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Patient</label>
              <input
                type="text"
                value={newStory.patient}
                onChange={(e) => setNewStory({...newStory, patient: e.target.value})}
                className={styles.formInput}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Summary</label>
            <textarea
              value={newStory.summary}
              onChange={(e) => setNewStory({...newStory, summary: e.target.value})}
              className={styles.formTextarea}
              rows="3"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Content</label>
            <textarea
              value={newStory.content}
              onChange={(e) => setNewStory({...newStory, content: e.target.value})}
              className={styles.formTextarea}
              rows="4"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Display Order</label>
              <input
                type="number"
                value={newStory.order}
                onChange={(e) => setNewStory({...newStory, order: parseInt(e.target.value)})}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Image</label>
              <div 
                className={styles.dragDropArea}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(styles.dragDropAreaActive);
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove(styles.dragDropAreaActive);
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(styles.dragDropAreaActive);
                  const files = e.dataTransfer.files;
                  if (files.length > 0 && files[0].type.startsWith('image/')) {
                    const imageUrl = await uploadImage(files[0]);
                    setNewStory({...newStory, image: imageUrl});
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const target = e.target;
                    if (target && target.files && target.files.length > 0) {
                      const file = target.files[0];
                      if (file.type.startsWith('image/')) {
                        const imageUrl = await uploadImage(file);
                        setNewStory({...newStory, image: imageUrl});
                      }
                    }
                  };
                  input.click();
                }}
              >
                <p className={styles.dragDropText}>Drag & drop an image here, or click to select</p>
                <p className={styles.dragDropSubtext}>Supports JPG, PNG, GIF</p>
                {newStory.image && (
                  <div className="mt-2">
                    <img src={newStory.image} alt="Preview" className={styles.imagePreview} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            Add Story
          </button>
        </form>
      </div>

      {/* Edit Story Form (when editing) */}
      {editingStory && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Edit Story</h2>
          <form onSubmit={handleUpdateStory}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input
                  type="text"
                  value={editingStory.title}
                  onChange={(e) => updateEditingStory('title', e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Patient</label>
                <input
                  type="text"
                  value={editingStory.patient}
                  onChange={(e) => updateEditingStory('patient', e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Summary</label>
              <textarea
                value={editingStory.summary}
                onChange={(e) => updateEditingStory('summary', e.target.value)}
                className={styles.formTextarea}
                rows="3"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Content</label>
              <textarea
                value={editingStory.content}
                onChange={(e) => updateEditingStory('content', e.target.value)}
                className={styles.formTextarea}
                rows="4"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Display Order</label>
                <input
                  type="number"
                  value={editingStory.order}
                  onChange={(e) => updateEditingStory('order', parseInt(e.target.value))}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Image</label>
                <div 
                  className={styles.dragDropArea}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(styles.dragDropAreaActive);
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove(styles.dragDropAreaActive);
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.dragDropAreaActive);
                    const files = e.dataTransfer.files;
                    if (files.length > 0 && files[0].type.startsWith('image/')) {
                      const imageUrl = await uploadImage(files[0]);
                      updateEditingStory('image', imageUrl);
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const target = e.target;
                      if (target && target.files && target.files.length > 0) {
                        const file = target.files[0];
                        if (file.type.startsWith('image/')) {
                          const imageUrl = await uploadImage(file);
                          updateEditingStory('image', imageUrl);
                        }
                      }
                    };
                    input.click();
                  }}
                >
                  <p className={styles.dragDropText}>Drag & drop an image here, or click to select</p>
                  <p className={styles.dragDropSubtext}>Supports JPG, PNG, GIF</p>
                  {editingStory.image && (
                    <div className="mt-2">
                      <img src={editingStory.image} alt="Preview" className={styles.imagePreview} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                Update Story
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className={`${styles.button} ${styles.buttonCancel}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stories List */}
      <div className={styles.storiesList}>
        <h2 className={styles.listTitle}>Current Stories</h2>
        {stories.length === 0 ? (
          <p className={styles.noStories}>No stories found.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableCell}>Title</th>
                  <th className={styles.tableCell}>Patient</th>
                  <th className={styles.tableCell}>Summary</th>
                  <th className={styles.tableCell}>Order</th>
                  <th className={`${styles.tableCell} ${styles.actionCell}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{story.title}</td>
                    <td className={styles.tableCell}>{story.patient}</td>
                    <td className={styles.tableCell}>{story.summary.substring(0, 50)}{story.summary.length > 50 ? '...' : ''}</td>
                    <td className={styles.tableCell}>{story.order}</td>
                    <td className={`${styles.tableCell} ${styles.actionCell}`}>
                      <button
                        onClick={() => startEditing(story)}
                        className={`${styles.actionButton} ${styles.actionButtonEdit}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story._id)}
                        className={`${styles.actionButton} ${styles.actionButtonDelete}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}