// Carousel functionality
document.addEventListener("DOMContentLoaded", function() {
  const track = document.querySelector(".carousel_track");
  const prevBtn = document.querySelector(".carousel_nav.prev");
  const nextBtn = document.querySelector(".carousel_nav.next");
  const boxes = document.querySelectorAll(".new_collection_box");
  
  if (!track || boxes.length === 0) return;
  
  let currentIndex = 0;
  const totalItems = boxes.length;
  let itemsPerView = 3;
  let autoScrollInterval;
  
  // Calculate items per view based on screen width
  function updateItemsPerView() {
    if (window.innerWidth <= 768) {
      itemsPerView = 1;
    } else if (window.innerWidth <= 1024) {
      itemsPerView = 2;
    } else {
      itemsPerView = 3;
    }
  }
  
  // Update carousel position
  function updateCarousel() {
    const boxWidth = boxes[0].offsetWidth;
    const gap = 16; // 1rem gap
    const offset = currentIndex * (boxWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }
  
  // Move to next item
  function moveNext() {
    currentIndex++;
    if (currentIndex > totalItems - itemsPerView) {
      currentIndex = 0; // Loop back to start
    }
    updateCarousel();
  }
  
  // Move to previous item
  function movePrev() {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = totalItems - itemsPerView; // Loop to end
    }
    updateCarousel();
  }
  
  // Start auto-scroll
  function startAutoScroll() {
    autoScrollInterval = setInterval(moveNext, 3000); // Auto-scroll every 3 seconds
  }
  
  // Stop auto-scroll
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  
  // Event listeners for buttons
  nextBtn.addEventListener("click", function() {
    stopAutoScroll();
    moveNext();
    startAutoScroll(); // Restart auto-scroll after manual interaction
  });
  
  prevBtn.addEventListener("click", function() {
    stopAutoScroll();
    movePrev();
    startAutoScroll(); // Restart auto-scroll after manual interaction
  });
  
  // Pause auto-scroll on hover
  track.addEventListener("mouseenter", stopAutoScroll);
  track.addEventListener("mouseleave", startAutoScroll);
  
  // Handle window resize
  window.addEventListener("resize", function() {
    updateItemsPerView();
    updateCarousel();
  });
  
  // Initialize
  updateItemsPerView();
  updateCarousel();
  startAutoScroll();
});

// Add click handlers for product section navigation
document.addEventListener("DOMContentLoaded", function() {
  // Navigate product section boxes to products page
  const productSectionBoxes = document.querySelectorAll('.product_section_box');
  
  productSectionBoxes.forEach(box => {
    const href = box.getAttribute('href');
    
    // Update hrefs to go to products page
    if (href === '/living-products') {
      box.setAttribute('href', 'prdcts.html');
      box.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'prdcts.html';
      });
    } else if (href === '/bed-products') {
      box.setAttribute('href', 'prdcts.html');
      box.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'prdcts.html';
      });
    } else if (href === '/dining-products') {
      box.setAttribute('href', 'prdcts.html');
      box.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'prdcts.html';
      });
    }
  });
});
