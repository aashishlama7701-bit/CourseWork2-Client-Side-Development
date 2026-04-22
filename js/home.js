/* ============================================================
   js/home.js — Homepage Interactivity
   Handles Animated Stats and Testimonial Slider
   ============================================================ */

$(document).ready(function () {
  
  // --- 1. Animated Success Stats ---
  
  const animateStats = () => {
    $('.stat-item__number').each(function () {
      const $this = $(this);
      const target = parseInt($this.data('target'));
      const suffix = $this.data('suffix') || '';
      const duration = 2500; // 2.5 seconds for a premium feel
      
      // Prevent re-animation if already done
      if ($this.hasClass('animated')) return;
      $this.addClass('animated');

      $({ countNum: 0 }).animate({ countNum: target }, {
        duration: duration,
        easing: 'swing',
        step: function () {
          // Use Locale String for pretty numbers (e.g. 15,000)
          $this.text(Math.floor(this.countNum).toLocaleString() + suffix);
        },
        complete: function () {
          $this.text(target.toLocaleString() + suffix);
        }
      });
    });
  };

  // Use IntersectionObserver to trigger animation when visible
  const statsSection = document.querySelector('.stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        observer.unobserve(statsSection);
      }
    }, { threshold: 0.2 });
    observer.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver not supported
    setTimeout(animateStats, 1000);
  }


  // --- 2. Testimonial Slider ---

  let currentSlide = 0;
  const slides = $('.testimonial-slide');
  const totalSlides = slides.length;
  const $track = $('#testimonial-track');
  const $dotsContainer = $('#slider-dots');

  // Create dots dynamically
  for (let i = 0; i < totalSlides; i++) {
    const $dot = $('<div class="dot"></div>');
    if (i === 0) $dot.addClass('active');
    $dot.on('click', () => moveSlide(i));
    $dotsContainer.append($dot);
  }

  const updateDots = () => {
    $('.dot').removeClass('active').eq(currentSlide).addClass('active');
  };

  const moveSlide = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    
    $track.css('transform', `translateX(-${currentSlide * 100}%)`);
    updateDots();
  };

  $('#slider-next').on('click', () => {
    moveSlide(currentSlide + 1);
    resetAutoPlay();
  });

  $('#slider-prev').on('click', () => {
    moveSlide(currentSlide - 1);
    resetAutoPlay();
  });

  // Auto-play functionality
  let autoPlayInterval = setInterval(() => {
    moveSlide(currentSlide + 1);
  }, 6000);

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      moveSlide(currentSlide + 1);
    }, 6000);
  };

  // Pause on hover
  $('.testimonial-slider').on('mouseenter', () => clearInterval(autoPlayInterval))
                        .on('mouseleave', resetAutoPlay);


  // --- 3. Dynamic Initials Avatars ---

  const generateInitialsAvatars = () => {
    const colors = ['#1C4A2E', '#C8A96E', '#6B6460', '#133520'];
    
    $('.initials-avatar').each(function(index) {
      const name = $(this).data('name');
      if (!name) return;

      // Extract initials
      const initials = name.split(' ')
                           .map(word => word.charAt(0))
                           .join('')
                           .substring(0, 2);
      
      $(this).text(initials);
      
      // Assign a color from the palette based on index
      $(this).css('background-color', colors[index % colors.length]);
    });
  };

  generateInitialsAvatars();

});
