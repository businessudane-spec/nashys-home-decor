document.addEventListener('DOMContentLoaded', () => {

  // --- Throttled 3D Mouse Tilt Effect for Middle Artwork ---
  const centerArtwork = document.getElementById('centerArtwork');
  if (centerArtwork) {
    let mouseX = 0, mouseY = 0;
    let artCenterX = 0, artCenterY = 0;
    let tickingMouse = false;

    // Cache center coordinates on resize
    function updateCenterCoords() {
      const rect = centerArtwork.getBoundingClientRect();
      artCenterX = rect.left + rect.width / 2;
      artCenterY = rect.top + rect.height / 2;
    }
    updateCenterCoords();
    window.addEventListener('resize', updateCenterCoords);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!tickingMouse) {
        window.requestAnimationFrame(() => {
          const rotateY = ((mouseX - artCenterX) / window.innerWidth) * 45; // limit to 45 deg
          const rotateX = -((mouseY - artCenterY) / window.innerHeight) * 45;
          centerArtwork.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(10px)`;
          tickingMouse = false;
        });
        tickingMouse = true;
      }
    });
  }

  // --- Throttled Scroll-based 3D rotation for Tilted Grid ---
  const tiltedGrid = document.getElementById('tiltedGrid');
  if (tiltedGrid) {
    let tickingScroll = false;
    window.addEventListener('scroll', () => {
      if (!tickingScroll) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const gridRect = tiltedGrid.getBoundingClientRect();
          const gridTop = gridRect.top + scrollPosition;
          
          const windowHeight = window.innerHeight;
          const offset = (scrollPosition + windowHeight) - gridTop;
          
          if (offset > 0 && gridRect.top < windowHeight) {
            const factor = (offset / windowHeight) * 15;
            const rotX = 20 - (factor * 0.5);
            const rotY = -10 + (factor * 0.3);
            const rotZ = 5 - (factor * 0.15);
            
            tiltedGrid.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
          }
          tickingScroll = false;
        });
        tickingScroll = true;
      }
    });
  }

  // --- Lazy Loading Video Controller via Intersection Observer ---
  const lazyVideos = document.querySelectorAll('.lazy-video');
  if ('IntersectionObserver' in window && lazyVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = video.getAttribute('data-src');
            video.load();
          }
          video.play().catch(err => console.log("Video auto-play blocked: ", err));
        } else {
          if (video.src) {
            video.pause();
          }
        }
      });
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    lazyVideos.forEach((video) => {
      videoObserver.observe(video);
    });
  } else {
    // Fallback if IntersectionObserver not supported
    lazyVideos.forEach((video) => {
      video.src = video.getAttribute('data-src');
      video.load();
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
    });
  }

  // --- Custom Interactive Cursor (Paint Brush) ---
  const cursor = document.getElementById('customCursor');
  const clickables = document.querySelectorAll('.clickable');

  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    clickables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
      });
    });
  }

  // --- Horizontal Gallery Slider Logic ---
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  
  if (track) {
    const cards = track.querySelectorAll('.art-card');
    let currentIndex = 0;
    const originalCount = 5; // First set C1 to C5
    let isTransitioning = false;
    
    function updateSlider(useTransition = true) {
      if (cards.length === 0) return;
      
      if (!useTransition) {
        track.style.transition = 'none';
      } else {
        track.style.transition = '';
      }
      
      let targetOffset = 0;
      const gap = 40; // 2.5rem = 40px
      for (let i = 0; i < currentIndex; i++) {
        targetOffset += cards[i].offsetWidth + gap;
      }
      
      const wrapperWidth = track.parentElement.offsetWidth;
      const maxOffset = track.scrollWidth - wrapperWidth + 32;
      
      track.style.transform = `translateX(-${Math.min(targetOffset, Math.max(0, maxOffset))}px)`;
      
      if (!useTransition) {
        // Force reflow to register instant transform
        track.offsetWidth;
      }
    }
    
    // Autoplay Loop Logic
    let autoplay = setInterval(() => {
      handleNext();
    }, 3000);
    
    function resetAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(() => {
        handleNext();
      }, 3000);
    }
    
    function handleNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateSlider(true);
    }
    
    function handlePrev() {
      if (isTransitioning) return;
      
      if (currentIndex === 0) {
        // Snap instantly to index 5 (cloned C1)
        currentIndex = originalCount;
        updateSlider(false);
        // Slide smoothly backward to index 4 (cloned C5)
        setTimeout(() => {
          isTransitioning = true;
          currentIndex = originalCount - 1;
          updateSlider(true);
        }, 20);
      } else {
        isTransitioning = true;
        currentIndex--;
        updateSlider(true);
      }
    }
    
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      
      // If we scrolled past C5 to index 5 (cloned C1), snap back instantly to index 0 (original C1)
      if (currentIndex === originalCount) {
        currentIndex = 0;
        updateSlider(false);
      }
    });
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        handlePrev();
        resetAutoplay();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        handleNext();
        resetAutoplay();
      });
    }
    
    window.addEventListener('resize', () => updateSlider(false));
    setTimeout(() => updateSlider(false), 200);
  }
});
