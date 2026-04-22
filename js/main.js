/* ============================================================
   js/main.js — Shared JS: live datetime, nav utilities
   Runs on EVERY page.
   ============================================================ */

// Live clock — updates every second
function updateDatetime() {
  var now = new Date();
  var dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  var timeStr = now.toLocaleTimeString('en-GB');
  $('#datetime-display').text(dateStr + ' \u2014 ' + timeStr);
}

updateDatetime();
setInterval(updateDatetime, 1000);

// Scroll Progress, Back to Top & Animations
$(window).on('scroll', function () {
  var scrollTop = $(window).scrollTop();
  var docHeight = $(document).height() - $(window).height();
  var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  
  $('#scroll-progress').css('width', scrollPercent + '%');

  if (scrollTop > 300) {
    $('#back-to-top').addClass('show');
  } else {
    $('#back-to-top').removeClass('show');
  }
  
  checkAnimations(scrollTop);
});

$(document).on('click', '#back-to-top', function () {
  $('html, body').animate({ scrollTop: 0 }, 600);
});

function checkAnimations(scrollTop) {
  var windowHeight = $(window).height();
  
  $('.anim-scroll').each(function() {
    var elementOffset = $(this).offset().top;
    if (scrollTop + windowHeight > elementOffset + 50) {
      $(this).addClass('is-visible');
    }
  });
}

// Initial check on load
$(document).ready(function() {
  checkAnimations($(window).scrollTop());
});
