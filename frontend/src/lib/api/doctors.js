//API client for doctors
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/doctors';

// Get all doctors
export const getDoctors = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: { 'content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
};

// Create a new doctor
export const createDoctor = async (doctorData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctorData),
        });
        if (!response.ok) throw new Error(`Create failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error creating doctor:', error);
        
    }
};

//update a doctors (used for editing and status toggling)
export const updateDoctor = async (id, doctorData) => {
    try{
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {'content-Type' : 'application/json'},
            body: JSON.stringify(doctorData),
        });
    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    return await response.json()
    } catch (error) {
        console.error('Error updating Doctors:', error);
        throw error;
    }};
    
//Delete a Doctor
export const deleteDoctor = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
        return await response.json();
    }   catch (error) {
        console.error('Error deleting Doctor', error);
        throw error;
    }
};
