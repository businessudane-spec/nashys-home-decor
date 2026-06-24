document.addEventListener('DOMContentLoaded', () => {
  // --- Hover Video Playback Logic ---
  // Plays non-autoplaying videos in the exhibition and center artwork on hover
  const videoContainers = document.querySelectorAll('.tilted-img-wrap, .middle-artwork-inner');
  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    if (video) {
      container.addEventListener('mouseenter', () => {
        video.play().catch(err => {});
      });
      container.addEventListener('mouseleave', () => {
        video.pause();
      });
    }
  });

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
});
