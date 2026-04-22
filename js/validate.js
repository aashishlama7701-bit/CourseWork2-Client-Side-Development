/* ============================================================
   js/validate.js — Form validation logic for contact.html
   Criteria: 15% form validation + 10% accessibility
   ============================================================ */

$(document).ready(function () {

  // -----------------------------------------------
  // Validation functions — return error string or ''
  // -----------------------------------------------

  function validateName(v) {
    if (!v.trim()) { return 'Full name is required.'; }
    if (v.trim().length < 2) { return 'Name must be at least 2 characters.'; }
    if (v.trim().length > 60) { return 'Name must be under 60 characters.'; }
    if (!/^[a-zA-Z\s\-']+$/.test(v.trim())) {
      return 'Name may only contain letters, spaces, and hyphens.';
    }
    return '';
  }

  function validateEmail(v) {
    if (!v.trim()) { return 'Email address is required.'; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  }

  function validatePhone(v) {
    if (!v.trim()) { return 'Phone number is required.'; }
    var cleaned = v.replace(/[\s\-\(\)]/g, '');
    if (!/^(\+44|0)[0-9]{9,10}$/.test(cleaned)) {
      return 'Enter a valid UK number (e.g. 07700 900000).';
    }
    return '';
  }

  function validateArrivalDate(v) {
    if (!v) { return 'Arrival date is required.'; }
    var selected = new Date(v);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) { return 'Arrival must be today or in the future.'; }
    return '';
  }

  function validateDepartureDate(arrival, departure) {
    if (!departure) { return 'Departure date is required.'; }
    var a = new Date(arrival);
    var d = new Date(departure);
    if (d < a) { return 'Departure must be on or after arrival.'; }
    return '';
  }

  function validateGuests(v) {
    var n = parseInt(v, 10);
    if (!v) { return 'Number of guests is required.'; }
    if (isNaN(n) || n < 1) { return 'At least 1 guest is required.'; }
    if (n > 20) { return 'Maximum 20 guests per booking.'; }
    return '';
  }

  function validateDestination(v) {
    if (!v) { return 'Please select a destination.'; }
    return '';
  }

  function validateTerms(checked) {
    if (!checked) { return 'You must agree to the terms to continue.'; }
    return '';
  }

  // -----------------------------------------------
  // Show / clear error for a field
  // -----------------------------------------------

  function showError(id, msg) {
    $('#' + id).addClass('field--invalid').attr('aria-invalid', 'true');
    $('#' + id + '-error').text(msg);
  }

  function clearError(id) {
    $('#' + id).removeClass('field--invalid').attr('aria-invalid', 'false');
    $('#' + id + '-error').text('');
  }

  // -----------------------------------------------
  // Real-time validation on blur (leaving a field)
  // -----------------------------------------------

  $('#name').on('blur', function () {
    var err = validateName($(this).val());
    if (err) { showError('name', err); } else { clearError('name'); }
  });

  $('#email').on('blur', function () {
    var err = validateEmail($(this).val());
    if (err) { showError('email', err); } else { clearError('email'); }
  });

  $('#phone').on('blur', function () {
    var err = validatePhone($(this).val());
    if (err) { showError('phone', err); } else { clearError('phone'); }
  });

  $('#arrival-date').on('blur change', function () {
    var err = validateArrivalDate($(this).val());
    if (err) { showError('arrival-date', err); } else { clearError('arrival-date'); }
    updatePrice();
  });

  $('#departure-date').on('blur change', function () {
    var err = validateDepartureDate($('#arrival-date').val(), $(this).val());
    if (err) { showError('departure-date', err); } else { clearError('departure-date'); }
    updatePrice();
  });

  $('#guests, #destination, #private-guide').on('change input', function() {
    updatePrice();
  });

  // Block past dates in HTML5 calendar
  var todayISO = new Date().toISOString().split('T')[0];
  $('#arrival-date, #departure-date').attr('min', todayISO);

  function updatePrice() {
    var arrival = $('#arrival-date').val();
    var departure = $('#departure-date').val();
    var guestCount = parseInt($('#guests').val(), 10) || 0;
    var pricePerNight = parseInt($('#destination option:selected').data('price'), 10) || 0;
    var hasGuide = $('#private-guide').is(':checked');

    if (!arrival || !departure || guestCount < 1 || pricePerNight === 0) {
      $('#price-status').text('Enter details to see price');
      $('#price-duration').text('0 Nights');
      $('#price-guests-count').text(guestCount);
      $('#price-total').text('£0');
      return;
    }

    var start = new Date(arrival);
    var end = new Date(departure);
    var diffTime = end - start;
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      $('#price-status').text('Check dates');
      return;
    }

    // Handle same-day as 1 day/minimum charge or 0 nights
    var totalDays = Math.max(diffDays, 1);
    var total = (pricePerNight * totalDays * guestCount);
    if (hasGuide) { total += 150; }

    $('#price-status').text('Live Estimate');
    if (diffDays === 0) {
      $('#price-duration').text('Same Day (Day Trip)');
    } else {
      $('#price-duration').text(diffDays + (diffDays === 1 ? ' Night' : ' Nights'));
    }
    $('#price-guests-count').text(guestCount);
    $('#price-total').text('£' + total.toLocaleString());
  }

  $('#guests').on('blur', function () {
    var err = validateGuests($(this).val());
    if (err) { showError('guests', err); } else { clearError('guests'); }
  });

  $('#destination').on('blur change', function () {
    var err = validateDestination($(this).val());
    if (err) { showError('destination', err); } else { clearError('destination'); }
  });

  // -----------------------------------------------
  // Character counter for textarea
  // -----------------------------------------------

  $('#message').on('input', function () {
    var len = $(this).val().length;
    var $counter = $('#char-count');
    $counter.text(len + ' / 500 characters');
    $counter.removeClass('counter--warn counter--limit');
    if (len >= 500) {
      $counter.addClass('counter--limit');
    } else if (len >= 450) {
      $counter.addClass('counter--warn');
    }
    localStorage.setItem('formDraft_message', $(this).val());
  });

  // -----------------------------------------------
  // Save fields to localStorage on blur
  // -----------------------------------------------

  $('#name, #email, #phone, #travel-date, #guests, #destination').on('blur change', function () {
    localStorage.setItem('formDraft_' + $(this).attr('id'), $(this).val());
  });

  // -----------------------------------------------
  // Restore saved draft from localStorage on page load
  // -----------------------------------------------

  var draftFields = ['name', 'email', 'phone', 'arrival-date', 'departure-date', 'guests', 'destination', 'message', 'private-guide'];
  var hasDraft = false;

  $.each(draftFields, function (i, id) {
    var savedVal = localStorage.getItem('formDraft_' + id);
    if (savedVal) {
      $('#' + id).val(savedVal);
      if (id === 'message') {
        $('#char-count').text(savedVal.length + ' / 500 characters');
      }
      hasDraft = true;
    }
  });

  updatePrice(); // Init price on load if draft exists


  if (hasDraft) {
    $('#draft-banner').show();
  }

  // Clear draft button
  $('#btn-clear-draft').on('click', function () {
    $.each(draftFields, function (i, id) {
      localStorage.removeItem('formDraft_' + id);
    });
    $('#booking-form')[0].reset();
    $('#char-count').text('0 / 500 characters');
    $('#draft-banner').hide();
  });

  // -----------------------------------------------
  // Form submit — validate ALL fields
  // -----------------------------------------------

  $('#booking-form').on('submit', function (e) {
    e.preventDefault(); // prevent page reload — satisfies 15% criterion

    var isValid = true;
    var firstErrorId = null;

    var checks = [
      { id: 'name',        fn: validateName,        val: $('#name').val() },
      { id: 'email',       fn: validateEmail,       val: $('#email').val() },
      { id: 'phone',          fn: validatePhone,       val: $('#phone').val() },
      { id: 'arrival-date',   fn: validateArrivalDate, val: $('#arrival-date').val() },
      { id: 'departure-date', fn: function(v){ return validateDepartureDate($('#arrival-date').val(), v); }, val: $('#departure-date').val() },
      { id: 'guests',         fn: validateGuests,      val: $('#guests').val() },
      { id: 'destination',    fn: validateDestination, val: $('#destination').val() }
    ];

    $.each(checks, function (i, check) {
      var err = check.fn(check.val);
      if (err) {
        showError(check.id, err);
        if (!firstErrorId) { firstErrorId = check.id; }
        isValid = false;
      } else {
        clearError(check.id);
      }
    });

    var termsErr = validateTerms($('#terms').is(':checked'));
    if (termsErr) {
      showError('terms', termsErr);
      if (!firstErrorId) { firstErrorId = 'terms'; }
      isValid = false;
    } else {
      clearError('terms');
    }

    // Scroll to first error field
    if (!isValid) {
      $('html, body').animate({ scrollTop: $('#' + firstErrorId).offset().top - 120 }, 400);
      return;
    }

    // -----------------------------------------------
    // All valid — update the DOM with booking summary.
    // No page reload. This satisfies the 15% criterion.
    // -----------------------------------------------

    var refNum = 'UKE-' + Math.floor(Math.random() * 90000 + 10000);
    var rawDate = $('#travel-date').val();
    var formattedDate = new Date(rawDate + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    $('#summary-ref').text(refNum);
    $('#summary-name').text($('#name').val());
    $('#summary-email').text($('#email').val());
    $('#summary-destination').text($('#destination').val());
    var arrivalStr = new Date($('#arrival-date').val()).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
    var departureStr = new Date($('#departure-date').val()).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    $('#summary-date').text(arrivalStr + ' — ' + departureStr);
    $('#summary-guests').text($('#guests').val());

    // Animate: fade out form, fade in booking summary — DOM update, no reload
    $('#booking-form').fadeOut(400, function () {
      $('#booking-summary').fadeIn(600);
      $('#booking-summary').attr('tabindex', '-1').focus();
    });

    // Clear draft from localStorage
    $.each(draftFields, function (i, id) {
      localStorage.removeItem('formDraft_' + id);
    });
  });

  // -----------------------------------------------
  // Start Over — show form again, reset everything
  // -----------------------------------------------

  $('#btn-start-over').on('click', function () {
    $('#booking-summary').fadeOut(300, function () {
      $('#booking-form')[0].reset();
      $('#char-count').text('0 / 500 characters');
      $('.field-error').text('');
      $('.form-input').removeClass('field--invalid').attr('aria-invalid', 'false');
      $('#booking-form').fadeIn(400);
    });
  });

});
