"use client";

import { useState, useEffect } from "react";
import { getAboutContent, saveAboutContent } from "@/lib/api/aboutContent";
import { uploadAboutImage } from "@/lib/api/imageUpload";

// Default about content
const DEFAULT_ABOUT_CONTENT = {
  missionVision:
    "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care.",
  hospitalProfile:
    "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals.",
  hospitalPhoto: "/images/hospital-default.jpg",
  chairmanMessage:
    '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman',
  chairmanPhoto: "/images/chairman-default.jpg",
  chairmanName: "Chairman Name",
  medicalDirectorMessage:
    '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director',
  medicalDirectorPhoto: "/images/medical-director-default.jpg",
  medicalDirectorName: "Medical Director Name",
  boardOfDirectors: [
    { name: "Director 1", photo: "/images/director-default.jpg" },
    { name: "Director 2", photo: "/images/director-default.jpg" },
    { name: "Director 3", photo: "/images/director-default.jpg" },
  ],
  managementTeam: [
    { name: "CEO", photo: "/images/team-member-default.jpg" },
    {
      name: "Hospital Administrator",
      photo: "/images/team-member-default.jpg",
    },
    { name: "Nursing Director", photo: "/images/team-member-default.jpg" },
  ],
  awards: [
    {
      title: "Example Award 1",
      description: "Description for Example Award 1",
      photo: "/images/award-default.jpg",
    },
    {
      title: "Example Award 2",
      description: "Description for Example Award 2",
      photo: "/images/award-default.jpg",
    },
  ],
};

export default function EditAboutPage() {
  const [content, setContent] = useState(DEFAULT_ABOUT_CONTENT);
  const [isSaving, setIsSaving] = useState(false);

  // Load content from backend on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error("Error loading about content:", error);
      }
    };
    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ensure boardOfDirectors and managementTeam are properly structured
      const contentToSave = {
        ...content,
        boardOfDirectors: content.boardOfDirectors.map((director) => ({
          name: director.name || "Director Name",
          photo: director.photo || "/images/director-default.jpg",
        })),
        managementTeam: content.managementTeam.map((member) => ({
          name: member.name || "Team Member Name",
          photo: member.photo || "/images/team-member-default.jpg",
        })),
        awards: content.awards.map((award) => ({
          title: award.title || "Award Title",
          description: award.description || "Award description",
          photo: award.photo || "/images/award-default.jpg",
        })),
        hospitalPhoto: content.hospitalPhoto || "/images/hospital-default.jpg",
      };

      const result = await saveAboutContent(contentToSave);
      if (result) {
        alert("About page content saved successfully!");
      } else {
        alert("Failed to save content.");
      }
    } catch (error) {
      console.error("Error saving about content:", error);
      alert("Failed to save content: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleListChange = (listName, index, newValue) => {
    const newList = [...content[listName]];
    newList[index] = newValue;
    setContent((prev) => ({ ...prev, [listName]: newList }));
  };

  const addListItem = (listName) => {
    const newList = [...content[listName], ""];
    setContent((prev) => ({ ...prev, [listName]: newList }));
  };

  const removeListItem = (listName, index) => {
    const newList = [...content[listName]];
    newList.splice(index, 1);
    setContent((prev) => ({ ...prev, [listName]: newList }));
  };

  return (
    <section className="admin-container">
      <h2>Edit About Page</h2>

      {/* Mission & Vision */}
      <div className="card">
        <h3>Mission & Vision</h3>
        <textarea
          value={content.missionVision}
          onChange={(e) =>
            setContent({ ...content, missionVision: e.target.value })
          }
          placeholder="Enter mission and vision content"
          rows={4}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>

      {/* Hospital Profile */}
      <div className="card">
        <h3>Hospital Profile</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={content.hospitalPhoto || "/images/hospital-default.jpg"}
              alt="Hospital"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
              onError={(e) => {
                e.target.src = "/images/hospital-default.jpg";
                e.target.onerror = null;
              }}
            />
            <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
              Hospital Photo
            </p>
          </div>
          <div>
            <p>
              Current Photo:{" "}
              {content.hospitalPhoto?.split("/").pop() || "No photo selected"}
            </p>
          </div>
        </div>
        <div className="file-upload" style={{ marginBottom: "1rem" }}>
          <input
            type="file"
            id="hospitalPhoto"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const result = await uploadAboutImage(file);
                  setContent({ ...content, hospitalPhoto: result.imagePath });
                  alert("Hospital photo uploaded successfully!");
                } catch (error) {
                  console.error("Error uploading hospital photo:", error);
                  alert("Error uploading photo: " + error.message);
                }
              }
            }}
          />
          <label htmlFor="hospitalPhoto" className="upload-label">
            Choose Photo
          </label>
        </div>
        <textarea
          value={content.hospitalProfile}
          onChange={(e) =>
            setContent({ ...content, hospitalProfile: e.target.value })
          }
          placeholder="Enter hospital profile content"
          rows={4}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>

      {/* Chairman Message */}
      <div className="card">
        <h3>Chairman Message</h3>
        <textarea
          value={content.chairmanMessage}
          onChange={(e) =>
            setContent({ ...content, chairmanMessage: e.target.value })
          }
          placeholder="Enter chairman message content"
          rows={4}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>

      {/* Chairman Photo and Name */}
      <div className="card">
        <h3>Chairman Photo & Name</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={content.chairmanPhoto || "/images/chairman-default.jpg"}
              alt="Current Chairman"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
              onError={(e) => {
                e.target.src = "/images/chairman-default.jpg";
                e.target.onerror = null;
              }}
            />
            <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
              {content.chairmanName || "Chairman Name"}
            </p>
          </div>
          <div>
            <p>
              Current Photo:{" "}
              {content.chairmanPhoto?.split("/").pop() || "No photo selected"}
            </p>
          </div>
        </div>
        <div className="file-upload" style={{ marginBottom: "1rem" }}>
          <input
            type="file"
            id="chairmanPhoto"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const result = await uploadAboutImage(file);
                  setContent({ ...content, chairmanPhoto: result.imagePath });
                  alert("Chairman photo uploaded successfully!");
                } catch (error) {
                  console.error("Error uploading chairman photo:", error);
                  alert("Error uploading photo: " + error.message);
                }
              }
            }}
          />
          <label htmlFor="chairmanPhoto" className="upload-label">
            Choose Photo
          </label>
        </div>
        <div>
          <label htmlFor="chairmanName">Chairman Name:</label>
          <input
            type="text"
            id="chairmanName"
            value={content.chairmanName || ""}
            onChange={(e) =>
              setContent({ ...content, chairmanName: e.target.value })
            }
            placeholder="Enter chairman name"
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </div>
      </div>

      {/* Medical Director Message */}
      <div className="card">
        <h3>Medical Director Message</h3>
        <textarea
          value={content.medicalDirectorMessage}
          onChange={(e) =>
            setContent({ ...content, medicalDirectorMessage: e.target.value })
          }
          placeholder="Enter medical director message content"
          rows={4}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>

      {/* Medical Director Photo and Name */}
      <div className="card">
        <h3>Medical Director Photo & Name</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={
                content.medicalDirectorPhoto ||
                "/images/medical-director-default.jpg"
              }
              alt="Current Medical Director"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
              onError={(e) => {
                e.target.src = "/images/medical-director-default.jpg";
                e.target.onerror = null;
              }}
            />
            <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
              {content.medicalDirectorName || "Medical Director Name"}
            </p>
          </div>
          <div>
            <p>
              Current Photo:{" "}
              {content.medicalDirectorPhoto?.split("/").pop() ||
                "No photo selected"}
            </p>
          </div>
        </div>
        <div className="file-upload" style={{ marginBottom: "1rem" }}>
          <input
            type="file"
            id="medicalDirectorPhoto"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const result = await uploadAboutImage(file);
                  setContent({
                    ...content,
                    medicalDirectorPhoto: result.imagePath,
                  });
                  alert("Medical Director photo uploaded successfully!");
                } catch (error) {
                  console.error(
                    "Error uploading medical director photo:",
                    error,
                  );
                  alert("Error uploading photo: " + error.message);
                }
              }
            }}
          />
          <label htmlFor="medicalDirectorPhoto" className="upload-label">
            Choose Photo
          </label>
        </div>
        <div>
          <label htmlFor="medicalDirectorName">Medical Director Name:</label>
          <input
            type="text"
            id="medicalDirectorName"
            value={content.medicalDirectorName || ""}
            onChange={(e) =>
              setContent({ ...content, medicalDirectorName: e.target.value })
            }
            placeholder="Enter medical director name"
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </div>
      </div>

      {/* Board of Directors */}
      <div className="card">
        <h3>Board of Directors</h3>
        {content.boardOfDirectors.map((director, index) => (
          <div
            key={index}
            className="list-item"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src={director.photo || "/images/director-default.jpg"}
                  alt={`Director ${index + 1}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.src = "/images/director-default.jpg";
                    e.target.onerror = null;
                  }}
                />
                <p
                  style={{
                    marginTop: "0.25rem",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {director.name || "Director Name"}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  Current Photo:{" "}
                  {director.photo?.split("/").pop() || "No photo selected"}
                </p>
              </div>
            </div>
            <div className="file-upload" style={{ marginBottom: "0.5rem" }}>
              <input
                type="file"
                id={`directorPhoto-${index}`}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const result = await uploadAboutImage(file);
                      const updatedDirectors = [...content.boardOfDirectors];
                      updatedDirectors[index] = {
                        ...updatedDirectors[index],
                        photo: result.imagePath,
                      };
                      setContent({
                        ...content,
                        boardOfDirectors: updatedDirectors,
                      });
                      alert("Director photo uploaded successfully!");
                    } catch (error) {
                      console.error("Error uploading director photo:", error);
                      alert("Error uploading photo: " + error.message);
                    }
                  }
                }}
              />
              <label
                htmlFor={`directorPhoto-${index}`}
                className="upload-label"
              >
                Choose Photo
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={director.name}
                onChange={(e) => {
                  const updatedDirectors = [...content.boardOfDirectors];
                  updatedDirectors[index] = {
                    ...updatedDirectors[index],
                    name: e.target.value,
                  };
                  setContent({
                    ...content,
                    boardOfDirectors: updatedDirectors,
                  });
                }}
                placeholder="Director name"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  const updatedDirectors = [...content.boardOfDirectors];
                  updatedDirectors.splice(index, 1);
                  setContent({
                    ...content,
                    boardOfDirectors: updatedDirectors,
                  });
                }}
                style={{ background: "red", color: "white", minWidth: "auto" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newDirector = {
              name: "New Director",
              photo: "/images/director-default.jpg",
            };
            setContent({
              ...content,
              boardOfDirectors: [...content.boardOfDirectors, newDirector],
            });
          }}
          className="add-button"
        >
          + Add Director
        </button>
      </div>

      {/* Management Team */}
      <div className="card">
        <h3>Management Team</h3>
        {content.managementTeam.map((member, index) => (
          <div
            key={index}
            className="list-item"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src={member.photo || "/images/team-member-default.jpg"}
                  alt={`Team Member ${index + 1}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.src = "/images/team-member-default.jpg";
                    e.target.onerror = null;
                  }}
                />
                <p
                  style={{
                    marginTop: "0.25rem",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {member.name || "Team Member Name"}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  Current Photo:{" "}
                  {member.photo?.split("/").pop() || "No photo selected"}
                </p>
              </div>
            </div>
            <div className="file-upload" style={{ marginBottom: "0.5rem" }}>
              <input
                type="file"
                id={`memberPhoto-${index}`}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const result = await uploadAboutImage(file);
                      const updatedMembers = [...content.managementTeam];
                      updatedMembers[index] = {
                        ...updatedMembers[index],
                        photo: result.imagePath,
                      };
                      setContent({
                        ...content,
                        managementTeam: updatedMembers,
                      });
                      alert("Team member photo uploaded successfully!");
                    } catch (error) {
                      console.error(
                        "Error uploading team member photo:",
                        error,
                      );
                      alert("Error uploading photo: " + error.message);
                    }
                  }
                }}
              />
              <label htmlFor={`memberPhoto-${index}`} className="upload-label">
                Choose Photo
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={member.name}
                onChange={(e) => {
                  const updatedMembers = [...content.managementTeam];
                  updatedMembers[index] = {
                    ...updatedMembers[index],
                    name: e.target.value,
                  };
                  setContent({ ...content, managementTeam: updatedMembers });
                }}
                placeholder="Team member name"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  const updatedMembers = [...content.managementTeam];
                  updatedMembers.splice(index, 1);
                  setContent({ ...content, managementTeam: updatedMembers });
                }}
                style={{ background: "red", color: "white", minWidth: "auto" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newMember = {
              name: "New Team Member",
              photo: "/images/team-member-default.jpg",
            };
            setContent({
              ...content,
              managementTeam: [...content.managementTeam, newMember],
            });
          }}
          className="add-button"
        >
          + Add Team Member
        </button>
      </div>

      {/* Awards */}
      <div className="card">
        <h3>Awards & Recognitions</h3>
        {content.awards.map((award, index) => (
          <div
            key={index}
            className="list-item"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src={award.photo || "/images/award-default.jpg"}
                  alt={`Award ${index + 1}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.src = "/images/award-default.jpg";
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  Current Photo:{" "}
                  {award.photo?.split("/").pop() || "No photo selected"}
                </p>
              </div>
            </div>
            <div className="file-upload" style={{ marginBottom: "0.5rem" }}>
              <input
                type="file"
                id={`awardPhoto-${index}`}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const result = await uploadAboutImage(file);
                      const updatedAwards = [...content.awards];
                      updatedAwards[index] = {
                        ...updatedAwards[index],
                        photo: result.imagePath,
                      };
                      setContent({ ...content, awards: updatedAwards });
                      alert("Award photo uploaded successfully!");
                    } catch (error) {
                      console.error("Error uploading award photo:", error);
                      alert("Error uploading photo: " + error.message);
                    }
                  }
                }}
              />
              <label htmlFor={`awardPhoto-${index}`} className="upload-label">
                Choose Photo
              </label>
            </div>
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                type="text"
                value={award.title}
                onChange={(e) => {
                  const updatedAwards = [...content.awards];
                  updatedAwards[index] = {
                    ...updatedAwards[index],
                    title: e.target.value,
                  };
                  setContent({ ...content, awards: updatedAwards });
                }}
                placeholder="Award title"
                style={{ flex: 1 }}
              />
            </div>
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <textarea
                value={award.description}
                onChange={(e) => {
                  const updatedAwards = [...content.awards];
                  updatedAwards[index] = {
                    ...updatedAwards[index],
                    description: e.target.value,
                  };
                  setContent({ ...content, awards: updatedAwards });
                }}
                placeholder="Award description"
                rows={2}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => {
                  const updatedAwards = [...content.awards];
                  updatedAwards.splice(index, 1);
                  setContent({ ...content, awards: updatedAwards });
                }}
                style={{ background: "red", color: "white", flex: 1 }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newAward = {
              title: "New Award",
              description: "Award description",
              photo: "/images/award-default.jpg",
            };
            setContent({ ...content, awards: [...content.awards, newAward] });
          }}
          className="add-button"
        >
          + Add Award
        </button>
      </div>

      {/* Save Button */}
      <div className="mt-md" style={{ textAlign: "center" }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
}
