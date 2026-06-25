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

  // --- 3D Coverflow Carousel Logic ---
  const cards = document.querySelectorAll('.coverflow-card');
  const prevBtn = document.getElementById('coverflowPrev');
  const nextBtn = document.getElementById('coverflowNext');
  
  if (cards.length > 0) {
    let currentIndex = 0;
    const totalCards = cards.length;
    
    function updateCoverflow() {
      cards.forEach((card, idx) => {
        card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
        
        const diff = (idx - currentIndex + totalCards) % totalCards;
        
        if (diff === 0) {
          card.classList.add('active');
        } else if (diff === 1) {
          card.classList.add('next');
        } else if (diff === 2) {
          card.classList.add('far-next');
        } else if (diff === totalCards - 1) {
          card.classList.add('prev');
        } else if (diff === totalCards - 2) {
          card.classList.add('far-prev');
        }
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCoverflow();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCoverflow();
      });
    }
    
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (currentIndex !== idx) {
          currentIndex = idx;
          updateCoverflow();
        }
      });
    });
    
    updateCoverflow();
  }
});
