// src/lib/api/imageUpload.js

const HOME_API_BASE = "http://localhost:4000/api/home-content";
const ABOUT_API_BASE = "http://localhost:4000/api/about-content";
const DEPARTMENTS_API_BASE = "http://localhost:4000/api/departments";

// Upload image file to home content backend
export async function uploadHomeImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`${HOME_API_BASE}/upload-image`, {
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
    console.error("Failed to upload home image:", err);
    throw err;
  }
}

// Upload image file to about content backend
export async function uploadAboutImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`${ABOUT_API_BASE}/upload-image`, {
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
    console.error("Failed to upload about image:", err);
    throw err;
  }
}

// Upload image file to departments backend
export async function uploadDepartmentImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`${DEPARTMENTS_API_BASE}/upload-image`, {
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
    console.error("Failed to upload department image:", err);
    throw err;
  }
}