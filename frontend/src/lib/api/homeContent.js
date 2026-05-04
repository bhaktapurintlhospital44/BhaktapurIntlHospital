// src/lib/api/homeContent.js

const API_BASE = "http://localhost:4000/api/home-content";

// Fetch homepage content from backend
export async function getHomeContent() {
  try {
    // Add cache-busting to ensure we get fresh data
    const res = await fetch(API_BASE, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    return data;
  } catch (err) {
    console.error("Failed to fetch home content:", err);
    return null;
  }
}

// Save homepage content to backend
export async function saveHomeContent(data) {
  try {
    const res = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Failed to save home content:", err);
    return null;
  }
}