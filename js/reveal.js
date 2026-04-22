/* ============================================================
   js/reveal.js — Multi-destination Click-to-Reveal Logic
   Handles fact animations, progress, and dynamic content swapping.
   ============================================================ */

$(document).ready(function () {

  const totalFacts = 6;
  let currentFact = 0;

  // --- Destination Content Data ---
  const destinationData = {
    'edinburgh': {
      title: 'Edinburgh',
      subtitle: 'Scotland\'s Historic Capital',
      eyebrow: 'Scotland\'s Capital',
      header: 'Discover Edinburgh fact by fact. Click the button below to reveal each piece of the story.',
      facts: [
        { t: 'The City', b: 'Edinburgh is the capital of Scotland with a population of around 500,000. It sits on ancient volcanic rock and is one of the most visited cities in the UK.' },
        { t: 'Edinburgh Castle', b: 'The castle sits atop Castle Rock, a volcanic plug that has been a fortress for over 3,000 years. It houses the Scottish Crown Jewels.' },
        { t: 'The Fringe', b: 'Every August, Edinburgh hosts the world\'s largest arts festival — The Edinburgh Festival Fringe — with thousands of shows across hundreds of venues.' },
        { t: 'The Royal Mile', b: 'This historic street connects Edinburgh Castle to the Palace of Holyroodhouse, lined with closes, shops, and centuries of history.' },
        { t: 'Getting There', b: 'Direct trains from London King\'s Cross take around 4.5 hours. Budget flights operate from most major UK airports.' },
        { t: 'Best Time to Visit', b: 'May to September for warm weather and long days. August for The Fringe. December for Christmas markets.' }
      ]
    },
    'london': {
      title: 'London',
      subtitle: 'The Global Metropolis',
      eyebrow: 'England\'s Capital',
      header: 'Explore the heart of the UK. Reveal the secrets of London one by one.',
      facts: [
        { t: 'World City', b: 'London is the capital of the UK and a global hub for finance, culture, and history, with a population of nearly 9 million people.' },
        { t: 'Tower Bridge', b: 'Often mistaken for London Bridge, this iconic bascule bridge was completed in 1894 and is a masterpiece of Victorian engineering.' },
        { t: 'The Tube', b: 'London is home to the world\'s first underground railway system, which opened in 1863 and now spans 272 stations.' },
        { t: 'West End', b: 'London\'s world-famous theatre district rivals Broadway, hosting hundreds of spectacular shows in historic venues every night.' },
        { t: 'Royal Parks', b: 'London is one of the greenest cities in the world, with over 3,000 parks including Hyde Park and Richmond Park.' },
        { t: 'Londinium', b: 'The city was founded by the Romans almost 2,000 years ago as a settlement called Londinium on the banks of the River Thames.' }
      ]
    },
    'lake-district': {
      title: 'Lake District',
      subtitle: 'The Land of Lakes and Fells',
      eyebrow: 'Cumbria, North West',
      header: 'Discover the breathtaking beauty of England\'s largest National Park.',
      facts: [
        { t: 'UNESCO Site', b: 'The Lake District is a UNESCO World Heritage site, famous for its glacial ribbon lakes, rugged fell mountains, and literary history.' },
        { t: 'Windermere', b: 'Lake Windermere is the largest natural lake in England, stretching over 10 miles in length with 18 islands scattered across it.' },
        { t: 'Scafell Pike', b: 'The park contains the highest mountain in England, Scafell Pike, providing stunning panoramic views of the Cumbrian landscape.' },
        { t: 'Literary Heritage', b: 'The area inspired some of Britain\'s greatest writers, including William Wordsworth and children\'s author Beatrix Potter.' },
        { t: 'Adventure Capital', b: 'Known as the UK\'s adventure capital, it offers world-class hiking, climbing, sailing, and mountain biking across its vast fells.' },
        { t: 'Greenery', b: 'The region is one of the wettest in the UK, which creates the lush, deep green landscapes that characterize the area year-round.' }
      ]
    },
    'bath': {
      title: 'Bath',
      subtitle: 'Roman Elegance & Georgian Grace',
      eyebrow: 'Somerset, South West',
      header: 'Uncover the thermal secrets and historic streets of this golden-stone city.',
      facts: [
        { t: 'Roman Baths', b: 'Founded by the Romans in 70 AD as a thermal spa, the Great Bath still flows with natural hot springs today.' },
        { t: 'Georgian Design', b: 'The city is a UNESCO World Heritage site, famous for its incredible 18th-century architecture and golden Bath stone.' },
        { t: 'Jane Austen', b: 'One of the world\'s most famous novelists lived in Bath for several years, using the city as a setting for Persuasion and Northanger Abbey.' },
        { t: 'The Royal Crescent', b: 'This sweeping row of 30 terraced houses is one of the greatest examples of Georgian architecture ever built in the UK.' },
        { t: 'Thermal Waters', b: 'Bath is the only place in the UK where you can actually bathe in natural hot springs, just as the Romans did millennia ago.' },
        { t: 'Pulteney Bridge', b: 'Completed in 1774, it is one of only four bridges in the world to have shops built across its entire span on both sides.' }
      ]
    }
  };

  // --- Initial Content Selection ---
  const lastDest = localStorage.getItem('lastDestination') || 'edinburgh';
  const data = destinationData[lastDest] || destinationData['edinburgh'];

  // Apply chosen content to DOM
  function populateContent() {
    $('#info-header').text(data.title);
    $('.page-banner__heading').text(data.title);
    $('#info-subtitle').text(data.header);
    $('#info-eyebrow').text(data.eyebrow);
    $('#dest-label').text('Selection: ' + data.title);
    $('#summary-title').text('You have explored all of ' + data.title + '!');
    $('#btn-next').attr('aria-label', 'Show the next ' + data.title + ' fact');
    document.title = 'Explore ' + data.title + ' — UK Escapes';

    // Swap banner background image
    const bgMap = {
      'edinburgh': 'dest-edinburgh.jpg',
      'london': 'ld.png',
      'lake-district': 'lake.jpg',
      'bath': 'bath.jpeg'
    };
    const bgImg = bgMap[lastDest] || 'hero-bg.jpg';
    $('.page-banner').css('background-image', 'url("images/' + bgImg + '")');

    for (let i = 0; i < totalFacts; i++) {
      const idx = i + 1;
      const fact = data.facts[i];
      $('#fact-' + idx + '-title').text(fact.t);
      $('#fact-' + idx + '-body').text(fact.b);
    }
  }

  populateContent();

  // --- Check localStorage for saved progress (per destination) ---
  const storageKey = 'infoProgress_' + lastDest;
  const saved = parseInt(localStorage.getItem(storageKey)) || 0;

  if (saved > 0 && saved < totalFacts) {
    const $banner = $('<div class="resume-banner" role="status">' +
      'Resume where you left off for ' + data.title + '? (Fact ' + saved + ' of ' + totalFacts + ') ' +
      '<button class="btn btn--primary btn--sm" id="btn-resume">Yes, resume</button> ' +
      '<button class="btn btn--secondary btn--sm" id="btn-dismiss">No thanks</button>' +
      '</div>');
    $('.info-section').prepend($banner);

    $('#btn-resume').on('click', function () {
      for (let i = 1; i <= saved; i++) {
        $('#fact-' + i).show().attr('aria-hidden', 'false');
      }
      currentFact = saved;
      updateProgress();
      $banner.remove();
    });

    $('#btn-dismiss').on('click', function () {
      $banner.remove();
    });
  }

  // --- Progress bar and label update ---
  function updateProgress() {
    const pct = (currentFact / totalFacts) * 100;
    $('#progress-fill').css('width', pct + '%');
    $('#progress-label').text('Fact ' + currentFact + ' of ' + totalFacts);
  }

  // --- Next button: reveal one fact per click with jQuery animation ---
  $('#btn-next').on('click', function () {
    if (currentFact >= totalFacts) return;

    currentFact++;

    // jQuery fadeIn animation — this is the core 20% criterion from PRD
    $('#fact-' + currentFact)
      .attr('aria-hidden', 'false')
      .hide() // Ensure it starts hidden for fade
      .fadeIn(600);

    updateProgress();
    localStorage.setItem(storageKey, currentFact);

    // When last fact revealed
    if (currentFact === totalFacts) {
      $(this).prop('disabled', true).text('All Facts Revealed!');
      $('#facts-summary').delay(400).fadeIn(700);
      
      // Auto-scroll to top of new content if preferred
      $('html, body').animate({
        scrollTop: $('#fact-' + currentFact).offset().top - 150
      }, 500);
    }
  });

  // --- Reset button ---
  $('#btn-reset').on('click', function () {
    $('.fact-card').fadeOut(300).attr('aria-hidden', 'true');
    $('#facts-summary').hide();
    currentFact = 0;
    updateProgress();
    $('#btn-next').prop('disabled', false).text('Show Next Fact');
    localStorage.removeItem(storageKey);
  });

  // Initialise progress bar at 0
  updateProgress();

});
