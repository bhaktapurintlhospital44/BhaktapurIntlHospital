  // src/lib/api/videoUpload.js

const API_BASE = "http://localhost:4000/api/home-content";

// Upload video file to backend
export async function uploadVideo(file) {
  try {
    const formData = new FormData();
    formData.append('video', file);
    
    const res = await fetch(`${API_BASE}/upload-video`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to upload video:", err);
    throw err;
  }
}