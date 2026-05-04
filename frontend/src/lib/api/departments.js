// This file contains API functions for interacting with the backend department endpoints. It includes functions to fetch all departments, fetch a single department by ID, create a new department, update an existing department, and delete a department. Each function handles errors gracefully and logs them for debugging purposes.
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/departments').replace(/\/$/, '');

/**
 * Fetch all departments
 */
export const getDepartments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    return await response.json();
  } catch (error) {
    console.error("API Error (getDepartments):", error);
    return []; // Return empty array to prevent .map() errors in UI
  }
};

/**
 * Fetch a single department by ID
 */
export const getDepartmentById = async (id) => {
  if (!id) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) console.warn(`Department ${id} not found`);
      return null; 
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (getDepartmentById):", error);
    return null;
  }
};

/**
 * Create a new department (expects FormData)
 */
export const createDepartment = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      // Note: No 'Content-Type' header here. Browser sets it for FormData automatically.
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to create department');
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (createDepartment):", error);
    throw error;
  }
};

/**
 * Update an existing department (expects FormData)
 */
export const updateDepartment = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to update department');
    }
    return await response.json();
  } catch (error) {
    console.error("API Error (updateDepartment):", error);
    throw error;
  }
};

/**
 * Delete a department
 */
export const deleteDepartment = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete department');
    return await response.json();
  } catch (error) {
    console.error("API Error (deleteDepartment):", error);
    throw error;
  }
};