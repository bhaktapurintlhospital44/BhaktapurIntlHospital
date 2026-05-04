"use client";

import { useState, useEffect, useRef } from "react";
import { getHomeContent, saveHomeContent } from "@/lib/api/homeContent";
import { uploadVideo } from "@/lib/api/videoUpload";
import { uploadHomeImage } from "@/lib/api/imageUpload";

// Default content (fallback if none in DB)
const DEFAULT_HOME_CONTENT = {
  videoHeroTitle: " Bhaktapur International hospital 24/7 emergency and free ambulance ",
  heroTitle: "Welcome to Bhaktapur International Hospital",
  heroSubtitle:
    "We provide comprehensive medical care with state-of-the-art facilities and a team of experienced specialists dedicated to your well-being.",
    bannerImages: [],
  services: [
    {
      title: "24/7 Emergency Services",
      description:
        "Emergency medical care available around the clock for critical situations.",
      detailedContent: {
        about:
          "24/7 Emergency Services is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "24/7 availability (where applicable)",
          "Patient-centered care philosophy",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional 24/7 emergency services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
    {
      title: "Outpatient & Inpatient Services",
      description:
        "Comprehensive care for both outpatient visits and extended stays.",
      detailedContent: {
        about:
          "Outpatient & Inpatient Services is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "Flexible scheduling options",
          "Patient-centered care philosophy",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional outpatient & inpatient services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
    {
      title: "Diagnostic & Imaging",
      description:
        "Advanced diagnostic tools and imaging technology for accurate diagnosis.",
      detailedContent: {
        about:
          "Diagnostic & Imaging is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "Advanced imaging technology",
          "Accurate and timely results",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional diagnostic & imaging services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
    {
      title: "Surgical Services",
      description:
        "State-of-the-art surgical facilities with experienced surgeons.",
      detailedContent: {
        about:
          "Surgical Services is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "Advanced surgical technology",
          "Patient-centered care philosophy",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional surgical services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
  ],
  departments: [
    {
      title: "24/7 Emergency Services",
      description:
        "Emergency medical care available around the clock for critical situations.",
      detailedContent: {
        about:
          "24/7 Emergency Services is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "24/7 availability (where applicable)",
          "Patient-centered care philosophy",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional 24/7 emergency services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
    {
      title: "Outpatient & Inpatient Services",
      description:
        "Comprehensive care for both outpatient visits and extended stays.",
      detailedContent: {
        about:
          "Outpatient & Inpatient Services is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "Flexible scheduling options",
          "Patient-centered care philosophy",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional outpatient & inpatient services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
    {
      title: "Diagnostic & Imaging",
      description:
        "Advanced diagnostic tools and imaging technology for accurate diagnosis.",
      detailedContent: {
        about:
          "Diagnostic & Imaging is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "Advanced imaging technology",
          "Accurate and timely results",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional diagnostic & imaging services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
    {
      title: "Surgical Services",
      description:
        "State-of-the-art surgical facilities with experienced surgeons.",
      detailedContent: {
        about:
          "Surgical Services is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.",
        keyFeatures: [
          "State-of-the-art equipment and facilities",
          "Experienced and qualified medical professionals",
          "Comprehensive care approach",
          "Advanced surgical technology",
          "Patient-centered care philosophy",
        ],
        whyChoose:
          "At Bhaktapur International Hospital, we pride ourselves on delivering exceptional surgical services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.",
      },
    },
  ],

  whyChooseUs: [
    "Experienced and compassionate doctors",
    "Modern infrastructure and equipment",
    "Patient-centered care philosophy",
    "Convenient location and 24/7 services",
  ],
  rotatingTextPhrases: [
    "Caring for your health with compassion and excellence",
    "Dedicated to your wellness and recovery",
    "Providing exceptional healthcare services",
    "Your trusted partner in health",
  ],
  videoPath: "/videos/hospital-tour.mp4", // Default video path - change this to your actual video path
};

export default function EditHomePage() {
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Load content from backend on mount
  useEffect(() => {
    const loadContent = async () => {
      const data = await getHomeContent();
      if (data && Object.keys(data).length > 0) {
        setContent(data);
      }
    };
    loadContent();
  }, []);

  const handleChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleListChange = (listName, index, newValue) => {
    const newList = [...content[listName]];
    newList[index] = newValue;
    setContent((prev) => ({ ...prev, [listName]: newList }));
  };

  const addListItem = (listName) => {
    let newItem;
    if (listName === "services") {
      // For services, add a new object with title, description, imageUrl, and detailedContent
      newItem = {
        title: "New Service",
        description: "",
        imageUrl: "",
        detailedContent: {
          about: "",
          aboutHeading: "About New Service",
          whyChoose: "",
          whyChooseHeading: "Why Choose Our New Service",
          image1Path: "",
          image2Path: "",
        },
      };
    } else {
      // For other lists, add an empty string
      newItem = "";
    }
    const newList = [...(content[listName] || []), newItem];
    setContent((prev) => ({ ...prev, [listName]: newList }));
  };

  const removeListItem = (listName, index) => {
    const newList = [...content[listName]];
    newList.splice(index, 1);
    setContent((prev) => ({ ...prev, [listName]: newList }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Filter out any blob URLs before saving
    const contentToSave = {
      ...content,
      videoPath:
        content.videoPath && content.videoPath.startsWith("blob:")
          ? "/videos/hospital-tour.mp4"
          : content.videoPath,
    };

    const result = await saveHomeContent(contentToSave);
    if (result) {
      alert("Home page content saved to database!");
    } else {
      alert("Failed to save content.");
    }
    setIsSaving(false);
  };

  // --- NEW: BANNER IMAGE HANDLERS ---
  const handleBannerUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    try {
      const result = await uploadHomeImage(file);
      const currentBanners = content.bannerImages || [];
      if (currentBanners.length >= 50) {
        alert("Maximum 50 banner images allowed.");
        return;
      }
      handleChange("bannerImages", [...currentBanners, result.imagePath]);
    } catch (error) {
      alert("Image upload failed.");
    }
  };

  const removeBannerImage = (index) => {
    const updatedBanners = content.bannerImages.filter((_, i) => i !== index);
    handleChange("bannerImages", updatedBanners);
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        try {
          // Upload the video file to the server
          const result = await uploadVideo(file);
          // Update the video path in the content
          handleChange("videoPath", result.videoPath);
          alert(`Video uploaded successfully: ${file.name}`);
        } catch (error) {
          console.error("Video upload failed:", error);
          alert(`Failed to upload video: ${error.message}`);
        }
      } else {
        alert("Please drop a valid video file.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        try {
          // Upload the video file to the server
          const result = await uploadVideo(file);
          // Update the video path in the content
          handleChange("videoPath", result.videoPath);
          alert(`Video uploaded successfully: ${file.name}`);
        } catch (error) {
          console.error("Video upload failed:", error);
          alert(`Failed to upload video: ${error.message}`);
        }
      } else {
        alert("Please select a valid video file.");
      }
    }
  };

  return (
    <section className="admin-container">
      <h2>Edit Home Page</h2>

      {/* video hero section*/}
      <div className="card">
        <h3> Video Hero Section</h3>
        <div className="mt-sm">
          <label>Title</label>
          <input
            type="text"
            value={content.videoHeroTitle}
            onChange={(e) => handleChange("videoHeroTitle", e.target.value)}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="card">
        <h3>Hero Section</h3>
        <div className="mt-sm">
          <label>Title</label>
          <input
            type="text"
            value={content.heroTitle}
            onChange={(e) => handleChange("heroTitle", e.target.value)}
          />
        </div>
        <div className="mt-sm">
          <label>Subtitle</label>
          <textarea
            value={content.heroSubtitle}
            onChange={(e) => handleChange("heroSubtitle", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Services */}
      <div className="card">
        <h3>Services</h3>
        {content.services.map((service, index) => (
          <div key={index} className="service-item">
            <div className="service-item-header">
              <input
                type="text"
                value={service.title || ""}
                onChange={(e) => {
                  const updatedServices = [...content.services];
                  const newTitle = e.target.value;
                  updatedServices[index] = {
                    ...updatedServices[index],
                    title: newTitle,
                    detailedContent: {
                      ...updatedServices[index].detailedContent,
                      aboutHeading: `About ${newTitle}`,
                      whyChooseHeading: `Why Choose Our ${newTitle}`,
                    },
                  };
                  setContent((prev) => ({
                    ...prev,
                    services: updatedServices,
                  }));
                }}
                placeholder="Service title"
              />
              <button
                type="button"
                onClick={() => removeListItem("services", index)}
                style={{ background: "red", color: "white", minWidth: "70px" }}
              >
                Remove
              </button>
            </div>
            <textarea
              value={service.description || ""}
              onChange={(e) => {
                const updatedServices = [...content.services];
                updatedServices[index] = {
                  ...updatedServices[index],
                  description: e.target.value,
                };
                setContent((prev) => ({ ...prev, services: updatedServices }));
              }}
              placeholder="Service description"
              rows={2}
            />

            {/* Detailed Content Section */}
            <details className="detailed-content">
              <summary>Edit Detailed Content</summary>

              {/* Images Section */}
              <div>
                <label>Service Images</label>
                <div
                  style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
                >
                  {/* First Image */}
                  <div style={{ flex: 1 }}>
                    <label>Image 1</label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          const file = files[0];
                          if (file.type.startsWith("image/")) {
                            try {
                              const uploadResult = await uploadHomeImage(file);
                              const updatedServices = [...content.services];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                detailedContent: {
                                  ...updatedServices[index].detailedContent,
                                  image1Path: uploadResult.imagePath,
                                },
                              };
                              setContent((prev) => ({
                                ...prev,
                                services: updatedServices,
                              }));
                            } catch (error) {
                              console.error("Failed to upload image:", error);
                            }
                          }
                        }
                      }}
                      className="image-upload-area"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const uploadResult = await uploadHomeImage(file);
                              const updatedServices = [...content.services];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                detailedContent: {
                                  ...updatedServices[index].detailedContent,
                                  image1Path: uploadResult.imagePath,
                                },
                              };
                              setContent((prev) => ({
                                ...prev,
                                services: updatedServices,
                              }));
                            } catch (error) {
                              console.error("Failed to upload image:", error);
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      {service.detailedContent?.image1Path ? (
                        <div>
                          <img
                            src={service.detailedContent.image1Path}
                            alt="Service 1"
                          />
                          <p>Click to replace</p>
                        </div>
                      ) : (
                        <p>Click or drag image here</p>
                      )}
                    </div>
                  </div>

                  {/* Second Image */}
                  <div style={{ flex: 1 }}>
                    <label>Image 2</label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          const file = files[0];
                          if (file.type.startsWith("image/")) {
                            try {
                              const uploadResult = await uploadHomeImage(file);
                              const updatedServices = [...content.services];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                detailedContent: {
                                  ...updatedServices[index].detailedContent,
                                  image2Path: uploadResult.imagePath,
                                },
                              };
                              setContent((prev) => ({
                                ...prev,
                                services: updatedServices,
                              }));
                            } catch (error) {
                              console.error("Failed to upload image:", error);
                            }
                          }
                        }
                      }}
                      className="image-upload-area"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const uploadResult = await uploadHomeImage(file);
                              const updatedServices = [...content.services];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                detailedContent: {
                                  ...updatedServices[index].detailedContent,
                                  image2Path: uploadResult.imagePath,
                                },
                              };
                              setContent((prev) => ({
                                ...prev,
                                services: updatedServices,
                              }));
                            } catch (error) {
                              console.error("Failed to upload image:", error);
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      {service.detailedContent?.image2Path ? (
                        <div>
                          <img
                            src={service.detailedContent.image2Path}
                            alt="Service 2"
                          />
                          <p>Click to replace</p>
                        </div>
                      ) : (
                        <p>Click or drag image here</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label style={{ display: "block" }}>
                    About Section Heading
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedServices = [...content.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        detailedContent: {
                          ...updatedServices[index].detailedContent,
                          aboutHeading: "About This Service",
                        },
                      };
                      setContent((prev) => ({
                        ...prev,
                        services: updatedServices,
                      }));
                    }}
                    style={{
                      background: "#0b7ac4",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="text"
                  value={
                    service.detailedContent?.aboutHeading ||
                    "About This Service"
                  }
                  onChange={(e) => {
                    const updatedServices = [...content.services];
                    updatedServices[index] = {
                      ...updatedServices[index],
                      detailedContent: {
                        ...updatedServices[index].detailedContent,
                        aboutHeading: e.target.value,
                      },
                    };
                    setContent((prev) => ({
                      ...prev,
                      services: updatedServices,
                    }));
                  }}
                  placeholder="Enter heading for about section"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  About Content
                </label>
                <textarea
                  value={service.detailedContent?.about || ""}
                  onChange={(e) => {
                    const updatedServices = [...content.services];
                    updatedServices[index] = {
                      ...updatedServices[index],
                      detailedContent: {
                        ...updatedServices[index].detailedContent,
                        about: e.target.value,
                      },
                    };
                    setContent((prev) => ({
                      ...prev,
                      services: updatedServices,
                    }));
                  }}
                  placeholder="Enter content for about section"
                  rows={3}
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
              </div>

              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label style={{ display: "block" }}>
                    Why Choose Section Heading
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedServices = [...content.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        detailedContent: {
                          ...updatedServices[index].detailedContent,
                          whyChooseHeading: `Why Choose Our ${updatedServices[index].title}`,
                        },
                      };
                      setContent((prev) => ({
                        ...prev,
                        services: updatedServices,
                      }));
                    }}
                    style={{
                      background: "#0b7ac4",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="text"
                  value={
                    service.detailedContent?.whyChooseHeading ||
                    `Why Choose Our ${service.title}`
                  }
                  onChange={(e) => {
                    const updatedServices = [...content.services];
                    updatedServices[index] = {
                      ...updatedServices[index],
                      detailedContent: {
                        ...updatedServices[index].detailedContent,
                        whyChooseHeading: e.target.value,
                      },
                    };
                    setContent((prev) => ({
                      ...prev,
                      services: updatedServices,
                    }));
                  }}
                  placeholder="Enter heading for why choose section"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Why Choose Content
                </label>
                <textarea
                  value={service.detailedContent?.whyChoose || ""}
                  onChange={(e) => {
                    const updatedServices = [...content.services];
                    updatedServices[index] = {
                      ...updatedServices[index],
                      detailedContent: {
                        ...updatedServices[index].detailedContent,
                        whyChoose: e.target.value,
                      },
                    };
                    setContent((prev) => ({
                      ...prev,
                      services: updatedServices,
                    }));
                  }}
                  placeholder="Enter content for why choose section"
                  rows={3}
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
              </div>
            </details>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  const file = files[0];
                  if (file.type.startsWith("image/")) {
                    try {
                      const uploadResult = await uploadHomeImage(file);
                      const updatedServices = [...content.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        imageUrl: uploadResult.imagePath,
                      };
                      setContent((prev) => ({
                        ...prev,
                        services: updatedServices,
                      }));
                    } catch (error) {
                      console.error("Failed to upload image:", error);
                    }
                  }
                }
              }}
              className="image-upload-area"
              onClick={() => {
                // Create a file input element to allow clicking to select image
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const uploadResult = await uploadHomeImage(file);
                      const updatedServices = [...content.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        imageUrl: uploadResult.imagePath,
                      };
                      setContent((prev) => ({
                        ...prev,
                        services: updatedServices,
                      }));
                    } catch (error) {
                      console.error("Failed to upload image:", error);
                    }
                  }
                };
                input.click();
              }}
            >
              {service.imageUrl ? (
                <div>
                  <img src={service.imageUrl} alt="Service" />
                  <p>Click or drag an image to replace</p>
                </div>
              ) : (
                <p>Click or drag an image here</p>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem("services")}
          className="add-button"
        >
          + Add Service
        </button>
      </div>

        {/* for banner image */}

      <div className="card">
        <h3>Homepage Banner Gallery (Max 50)</h3>
        <p className="description">These images will rotate every 10 seconds on the homepage.</p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '15px 0' }}>
          {content.bannerImages?.map((url, index) => (
            <div key={index} style={{ position: 'relative', width: '120px', height: '80px' }}>
              <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              <button 
                onClick={() => removeBannerImage(index)}
                style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {(!content.bannerImages || content.bannerImages.length < 50) && (
          <div 
            className="image-upload-area" 
            onClick={() => bannerInputRef.current.click()}
            style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
          >
            <p>Click to add Banner Image ({50 - (content.bannerImages?.length || 0)} left)</p>
            <input 
              type="file" 
              ref={bannerInputRef} 
              hidden 
              accept="image/*" 
              onChange={(e) => handleBannerUpload(e.target.files[0])} 
            />
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="card">
        <h3>Why Choose Us</h3>
        {content.whyChooseUs.map((item, index) => (
          <div key={index} className="list-item">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleListChange("whyChooseUs", index, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeListItem("whyChooseUs", index)}
              style={{ background: "red", color: "white" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem("whyChooseUs")}
          className="add-button"
        >
          + Add Reason
        </button>
      </div>

      {/* Rotating Text Phrases */}
      <div className="card">
        <h3>Rotating Text Phrases</h3>
        <p>These phrases will rotate in the header subtitle area</p>
        {content.rotatingTextPhrases.map((item, index) => (
          <div key={index} className="list-item">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleListChange("rotatingTextPhrases", index, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeListItem("rotatingTextPhrases", index)}
              style={{ background: "red", color: "white" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem("rotatingTextPhrases")}
          className="add-button"
        >
          + Add Phrase
        </button>
      </div>

      {/* Video Upload */}
      <div className="card">
        <h3>Homepage Video</h3>
        <div className="mt-sm">
          <label>Current Video Path</label>
          <input
            type="text"
            value={content.videoPath}
            onChange={(e) => handleChange("videoPath", e.target.value)}
            placeholder="Enter video path (e.g., /videos/hospital-tour.mp4)"
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            {content.videoPath && !content.videoPath.startsWith("blob:") && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "225px",
                  marginTop: "0.5rem",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <video
                  src={content.videoPath}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            {content.videoPath && content.videoPath.startsWith("blob:") && (
              <p style={{ color: "red" }}>
                Blob URLs are temporary and won't work for other users. Please
                upload a video file.
              </p>
            )}
          </div>
        </div>

        <div
          className={`mt-sm ${dragActive ? "drag-active" : ""}`}
          style={{
            border: dragActive
              ? "2px dashed var(--primary-color)"
              : "2px dashed var(--border-color)",
            padding: "1rem",
            textAlign: "center",
            borderRadius: "8px",
            backgroundColor: dragActive ? "#f0f8ff" : "#f9fafb",
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <p>Drag & drop a video file here, or click to select</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </div>
        <p className="mt-sm" style={{ fontSize: "0.9rem", color: "#666" }}>
          This will upload the video to the server and automatically update the
          video path.
        </p>
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
