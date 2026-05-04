"use client";

import { useState, useEffect } from "react";
import "./page.css";
import {
  getHealthPackages,
  createHealthPackage,
  updateHealthPackage,
  deleteHealthPackage,
} from "@/lib/api/healthPackages";

export default function EditHealthPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPackage, setCurrentPackage] = useState({
    _id: null,
    name: "",
    description: "",
    price: "",
    features: [""],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await getHealthPackages();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching health packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const handleInputChange = (field, value) => {
    setCurrentPackage((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...currentPackage.features];
    updated[index] = value;
    setCurrentPackage((prev) => ({ ...prev, features: updated }));
  };

  const addFeatureField = () => {
    setCurrentPackage((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeatureField = (index) => {
    if (currentPackage.features.length > 1) {
      setCurrentPackage((prev) => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAddPackage = async () => {
    if (
      currentPackage.name &&
      currentPackage.description &&
      currentPackage.price
    ) {
      try {
        if (isEditing) {
          await updateHealthPackage(currentPackage._id, currentPackage);
        } else {
          await createHealthPackage(currentPackage);
        }

        const updated = await getHealthPackages();
        setPackages(updated);

        resetForm();
      } catch (err) {
        console.error(err);
        alert("Error saving package");
      }
    }
  };

  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this package?")) {
      await deleteHealthPackage(id);
      setPackages(await getHealthPackages());
    }
  };

  const resetForm = () => {
    setCurrentPackage({
      _id: null,
      name: "",
      description: "",
      price: "",
      features: [""],
    });
    setIsEditing(false);
  };

  return (
    <div className="hp-container">
      <h2 className="hp-title">Edit Health Packages</h2>

      {/* FORM SECTION */}
      <div className="hp-section hp-formSection">
        <h3 className="hp-sectionTitle">
          {isEditing ? "Edit Package" : "Add New Package"}
        </h3>

        <div className="hp-formCard">
          <input
            className="hp-input"
            placeholder="Package Name"
            value={currentPackage.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <textarea
            className="hp-textarea"
            placeholder="Description"
            value={currentPackage.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />

          <input
            className="hp-input"
            placeholder="Price"
            value={currentPackage.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />

          <div className="hp-featureBox">
            {currentPackage.features.map((f, i) => (
              <div key={i} className="hp-featureRow">
                <input
                  className="hp-inputSmall"
                  value={f}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                />
                <button
                  className="hp-btnDanger"
                  onClick={() => removeFeatureField(i)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button className="hp-btnGreen" onClick={addFeatureField}>
              Add Feature
            </button>
          </div>

          <button className="hp-btnPrimary" onClick={handleAddPackage}>
            {isEditing ? "Update Package" : "Add Package"}
          </button>

          {isEditing && (
            <button className="hp-btnGray" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="hp-section hp-listSection">
        <h3 className="hp-sectionTitleRed">Current Packages</h3>

        <div className="hp-grid">
          {packages.map((pkg) => (
            <div key={pkg._id} className="hp-card">
              <h4 className="hp-cardTitle">{pkg.name}</h4>
              <div className="hp-price">{pkg.price}</div>
              <p className="hp-desc">{pkg.description}</p>

              <ul className="hp-list">
                {pkg.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>

              <div className="hp-actions">
                <button className="hp-btnWarn" onClick={() => handleEdit(pkg)}>
                  Edit
                </button>
                <button
                  className="hp-btnDanger"
                  onClick={() => handleDelete(pkg._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
