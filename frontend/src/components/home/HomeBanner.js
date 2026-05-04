"use client";
import "./HomeBanner.css";
import React, { useState, useEffect, useRef } from "react";

const DynamicHomeBanner = ({ bannerImages }) => {
  if (!bannerImages || bannerImages.length === 0) return null;

  const slides = [
    bannerImages[bannerImages.length - 1],
    ...bannerImages,
    bannerImages[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const isLockRef = useRef(false); // New Ref to prevent rapid click overlapping
  const transitionTimeout = useRef(null);

  // --- NAVIGATION ---
  const nextSlide = () => {
    if (isLockRef.current) return;
    isLockRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isLockRef.current) return;
    isLockRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // --- DRAG HANDLERS ---
  const handleStart = (clientX) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    setIsTransitioning(false);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    // Handle both mouse and touch
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const finalOffset = dragOffset;

    setIsDragging(false);
    setDragOffset(0);
    setIsTransitioning(true);

    if (finalOffset < -100) {
      // Threshold for swipe
      nextSlide();
    } else if (finalOffset > 100) {
      prevSlide();
    }
  };

  // --- EFFECTS ---

  // Handle the "Infinite Loop" Jump
  useEffect(() => {
    // When a transition ends, unlock the buttons
    const handleTransitionEnd = () => {
      isLockRef.current = false;

      if (currentIndex === 0 || currentIndex === slides.length - 1) {
        setIsTransitioning(false); // Kill animation for jump
        if (currentIndex === 0) setCurrentIndex(slides.length - 2);
        if (currentIndex === slides.length - 1) setCurrentIndex(1);

        // Allow state to settle before re-enabling transition
        setTimeout(() => setIsTransitioning(true), 20);
      }
    };

    const timer = setTimeout(handleTransitionEnd, 700);
    return () => clearTimeout(timer);
  }, [currentIndex, slides.length]);

  // Auto-swipe timer
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      if (!isLockRef.current) nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentIndex, isDragging]);

  return (
    <div className="home-banner-wrapper" onMouseLeave={handleEnd}>
      <div
        className="banner-track"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          transition: isTransitioning
            ? "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {slides.map((url, index) => (
          <div className="banner-slide" key={index}>
            <img
              src={url}
              alt="Hospital Facility"
              className="banner-img-fluid"
              draggable="false"
            />
          </div>
        ))}
      </div>

      {bannerImages.length > 1 && (
        <>
          <button className="nav-btn prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="nav-btn next" onClick={nextSlide}>
            &#10095;
          </button>

          <div className="indicator-dots">
            {bannerImages.map((_, index) => {
              let activeIndex = currentIndex - 1;
              if (currentIndex === 0) activeIndex = bannerImages.length - 1;
              if (currentIndex === slides.length - 1) activeIndex = 0;
              return (
                <div
                  key={index}
                  className={`dot ${index === activeIndex ? "active" : ""}`}
                  onClick={() => {
                    if (!isLockRef.current) {
                      setIsTransitioning(true);
                      setCurrentIndex(index + 1);
                    }
                  }}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicHomeBanner;
