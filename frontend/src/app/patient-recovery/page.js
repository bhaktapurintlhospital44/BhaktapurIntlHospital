"use client";

import { useState, useEffect } from "react";
import { getStories } from "@/lib/api/healthPackages";
import styles from "./patientRecovery.module.css";

const FALLBACK_STORIES = [
  {
    _id: "fb1",
    title: "Back to Normal Life After Cardiac Surgery",
    patient: "Mr. A",
    summary:
      "After undergoing successful cardiac surgery at our hospital, Mr. A has returned to his normal daily activities.",
  },
  {
    _id: "fb2",
    title: "Quick Recovery from Orthopedic Injury",
    patient: "Ms. B",
    summary:
      "Ms. B made an excellent recovery with the help of our orthopedic and physiotherapy team.",
  },
];

function PageHeader() {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Patient Recovery Stories</h2>
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <div className={styles.storyCard}>
      {story.image && (
        <img
          src={story.image}
          alt={story.title}
          className={styles.storyImage}
        />
      )}
      <h3 className={styles.storyTitle}>{story.title}</h3>
      <p className={styles.storyPatient}>Patient: {story.patient}</p>
      <p className={styles.storySummary}>{story.summary}</p>
      {story.content && (
        <div className={styles.storyContent}>
          <p>{story.content}</p>
        </div>
      )}
    </div>
  );
}

export default function PatientRecoveryPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStories = async () => {
      try {
        const data = await getStories();
        // Ensure data is an array before setting state
        setStories(Array.isArray(data) ? data : FALLBACK_STORIES);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(err.message);
        setStories(FALLBACK_STORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Preventing Hydration Mismatch:
  // Do not render the dynamic part until the client has mounted.
  if (!mounted) {
    return (
      <div className={styles.container}>
        <PageHeader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader />

      {loading ? (
        <div className={styles.loading}>Loading stories…</div>
      ) : (
        <>
          {error && (
            <div className={styles.error}>
              Note: Showing fallback stories due to error: {error}
            </div>
          )}

          <div className={styles.storiesGrid}>
            {stories.length > 0 ? (
              stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))
            ) : (
              <p>No stories found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
