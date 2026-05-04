import axios from "axios";

//comment adde inorder to push and chwck the pull request can be removed if you want

// The base URL for your backend reports API
const API_URL = "http://localhost:4000/api/reports";
// The base URL for your static uploads folder
const UPLOADS_URL = "http://localhost:4000/uploads";

export const reportApi = {
  /**
   * Admin: Sends the FormData containing title, description,
   * and the 'files' array to the backend.
   */
  createReport: async (formData) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * User/Admin: Fetches the list of reports and the current
   * visibility/navLabel settings.
   * NOTE: Only returns reports where showInSection is true.
   */
  getReports: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  /**
   * Admin only: Fetches ALL reports regardless of visibility status.
   * Used by the admin panel to show reports for editing/deleting.
   */
  getAdminReports: async () => {
    const response = await axios.get(`${API_URL}/admin/all`);
    return response.data;
  },

  /**
   * Admin: Triggered by the real-time toggle in your Admin UI.
   * Updates 'shouldShow' and 'navLabel' instantly.
   */
  updateVisibility: async (visibilityData) => {
    const response = await axios.patch(`${API_URL}/visibility`, visibilityData);
    return response.data;
  },

  /**
   * Admin: The "Plus Button" logic.
   * Appends new files to an existing report.
   */
  addFilesToReport: async (reportId, formData) => {
    const response = await axios.put(
      `${API_URL}/${reportId}/add-files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Admin: Deletes a specific file from within a report
   * and removes it from the server's disk.
   */
  deleteSingleFile: async (reportId, fileId) => {
    const response = await axios.delete(
      `${API_URL}/${reportId}/file/${fileId}`,
    );
    return response.data;
  },

  /**
   * Admin: Updates the title and description of an existing report.
   * Does not change files (re-upload to change files).
   */
  updateReport: async (reportId, formData) => {
    // If it's formData, we need the multipart header
    const response = await axios.patch(`${API_URL}/${reportId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Admin: Permanently deletes a report and all its associated
   * physical files from the server's public/uploads folder.
   */
  deleteReport: async (reportId) => {
    const response = await axios.delete(`${API_URL}/${reportId}`);
    return response.data;
  },

  /**
   * Helper to resolve the correct URL for viewing or downloading files
   * from the filesystem storage.
   */
  getFileUrl: (fileId) => `${UPLOADS_URL}/${fileId}`,
};
