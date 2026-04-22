/* ============================================================
   js/destinations.js — Map interaction, card hover, localStorage
   Runs on destinations.html only.
   ============================================================ */

$(document).ready(function () {

  // --- Tooltip on map area hover ---
  $('.map-area').on('mousemove', function (e) {
    var label = $(this).attr('title');
    $('#map-tooltip')
      .text(label)
      .css({
        top: e.clientY - 40,
        left: e.clientX + 12
      })
      .fadeIn(150);
  }).on('mouseleave', function () {
    $('#map-tooltip').fadeOut(150);
  });

  // --- Map area click: prevent navigation, scroll to card, highlight it ---
  $('.map-area').on('click', function (e) {
    e.preventDefault();
    var cardId = $(this).data('card');
    var $card = $('#' + cardId);

    if ($card.length === 0) { return; }

    $('html, body').animate({ scrollTop: $card.offset().top - 100 }, 500, 'swing');

    // Remove any existing highlight first
    $('.dest-card').removeClass('dest-card--highlighted');

    $card.addClass('dest-card--highlighted');
    setTimeout(function () {
      $card.removeClass('dest-card--highlighted');
    }, 2000);
  });

  // --- Save destination to localStorage when user clicks a card button or modal button ---
  $('.dest-card__btn, #modal-btn').on('click', function () {
    var dest = $(this).data('dest');
    if (dest) {
      localStorage.setItem('lastDestination', dest);
    }
  });

  // --- Show returning user banner if localStorage has a saved destination ---
  var last = localStorage.getItem('lastDestination');
  if (last) {
    var name = last.replace(/-/g, ' ').replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
    $('#returning-banner-inner')
      .text('Welcome back! Continue exploring ' + name + '? ')
      .append('<a href="info.html" class="btn btn--sm" style="margin-left:0.5rem;">Continue</a>');
    $('#returning-banner').show();
  }

  // --- Map Zoom Logic ---
  var currentZoom = 1;
  var zoomStep = 0.25;
  var maxZoom = 2.5;
  var minZoom = 1;

  $('#map-zoom-in').on('click', function() {
    if (currentZoom < maxZoom) {
      currentZoom += zoomStep;
      $('.map-image').css('--map-zoom', currentZoom);
    }
  });

  $('#map-zoom-out').on('click', function() {
    if (currentZoom > minZoom) {
      currentZoom -= zoomStep;
      $('.map-image').css('--map-zoom', currentZoom);
    }
  });

  // --- Destination Search Logic ---
  $('#dest-search-input').on('input', function() {
    var query = $(this).val().toLowerCase().trim();
    var visibleCount = 0;

    $('.dest-card').each(function() {
      var title = $(this).find('.dest-card__title').text().toLowerCase();
      var desc = $(this).find('.dest-card__desc').text().toLowerCase();
      
      if (title.indexOf(query) > -1 || desc.indexOf(query) > -1) {
        $(this).show();
        visibleCount++;
      } else {
        $(this).hide();
      }
    });

    if (visibleCount === 0) {
      $('#no-results-message').fadeIn(300).addClass('is-visible');
      $('.dest-grid').hide();
    } else {
      $('#no-results-message').hide().removeClass('is-visible');
      $('.dest-grid').show();
    }
  });

  // Clear search button functionality
  $('#clear-search-btn').on('click', function() {
    $('#dest-search-input').val('').trigger('input');
    $('#dest-search-input').focus();
  });

  // --- Modal Logic ---
  $('.dest-card').css('cursor', 'pointer'); // Indicate card is clickable
  $('.dest-card').on('click', function(e) {
    if ($(e.target).closest('.dest-card__btn').length) {
       // if they click the original link, let it navigate
       return;
    }
    e.preventDefault();

    var $img = $(this).find('img');
    var title = $(this).find('.dest-card__title').text();
    var desc = $(this).find('.dest-card__desc').text();
    var dest = $(this).find('a').data('dest');

    $('#modal-img').attr('src', $img.attr('src')).attr('alt', $img.attr('alt'));
    $('#modal-title').text(title);
    $('#modal-desc').text(desc);
    
    // Set destination data and href on the modal button
    $('#modal-btn').data('dest', dest).attr('href', 'info.html');

    // Show modal with flex display
    $('#dest-modal').css('display', 'flex').hide().fadeIn(300).attr('aria-hidden', 'false');
    $('body').css('overflow', 'hidden'); 
  });

  $('.dest-modal-close, .dest-modal-overlay').on('click', function(e) {
    if(e.target !== this) {
       // Only close if clicking exactly on the overlay or close button
       return; 
    }
    $('#dest-modal').fadeOut(300, function() {
       $(this).attr('aria-hidden', 'true');
    });
    $('body').css('overflow', ''); // reset overflow
  });

});
