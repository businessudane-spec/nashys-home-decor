document.addEventListener('DOMContentLoaded', () => {

  // --- 3D Mouse Tilt Effect for Middle Artwork ---
  const centerArtwork = document.getElementById('centerArtwork');
  if (centerArtwork) {
    document.addEventListener('mousemove', (e) => {
      const rect = centerArtwork.getBoundingClientRect();
      const artCenterX = rect.left + rect.width / 2;
      const artCenterY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate rotation angles
      const rotateY = ((mouseX - artCenterX) / window.innerWidth) * 45; // limit to 45 deg
      const rotateX = -((mouseY - artCenterY) / window.innerHeight) * 45;
      
      centerArtwork.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(10px)`;
    });
  }

  // --- Scroll-based 3D rotation for Tilted Grid ---
  const tiltedGrid = document.getElementById('tiltedGrid');
  if (tiltedGrid) {
    window.addEventListener('scroll', () => {
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
    
    function updateSlider() {
      if (cards.length === 0) return;
      const cardWidth = cards[0].offsetWidth;
      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.gap) || 40;
      const step = cardWidth + gap;
      
      const wrapperWidth = track.parentElement.offsetWidth;
      const maxOffset = track.scrollWidth - wrapperWidth + 32;
      const targetOffset = currentIndex * step;
      
      track.style.transform = `translateX(-${Math.min(targetOffset, Math.max(0, maxOffset))}px)`;
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const wrapperWidth = track.parentElement.offsetWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 40;
        const visibleCards = Math.floor(wrapperWidth / (cardWidth + gap));
        
        if (currentIndex < cards.length - visibleCards) {
          currentIndex++;
          updateSlider();
        }
      });
    }
    
    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 200);
  }
});
