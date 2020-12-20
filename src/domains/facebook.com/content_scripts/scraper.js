// TODO: in order to extract the visibility of a post,
// we analyze the last word in the "aria-label" of the post itself.
// This part should be improved because there might be some really
// weird corner cases, for example if someone's first name is one
// of the `publicWords`, then we might detect a wrong visibility.

const _ = require('lodash');

// See https://github.com/tracking-exposed/web-extension/issues/42
// TODO change your browser language and see how 'Public' is localized.
var publicWords = [
  "public", // Français, Română, English,
  "öffentlich", // Deutsch
  "offentlig", // Norsk (bokmål)
  "verejné", // Slovenčina
  "público", // Espanol
  "tutti", // Italiano
  "público", // Português
  "openbaar", // 'Nederlands',
  "iedereen", // 'Nederlands (België)',
  "avalik", // Eesti
  "publiczne", // Polish
  "opið" // Icelandic
];

// Imported from WhoTargetsMe, the 15 Nov 2020, from a MIT license, (originally from Facebook.)
const sponsoredText = ['Sponsored', 'Sponsorjat','Sponzorované','Спонзорирано', 'Χορηγούμενη',
          'Sponsitud','Sponzorováno','Спонсорирано', 'ממומן', 'Sponsoroitu','Sponsrad',
          'Apmaksāta reklāma','Sponsorlu','Sponsrad','Спонзорисано','Sponzorované','Sponsa',
          'Gesponsord','Sponset','Hirdetés', 'Sponsoreret', 'Sponzorováno', 'Sponsorisé',
          'Commandité', 'Publicidad','Gesponsert', 'Χορηγούμενη', 'Patrocinado', 'Plaćeni oglas',
          'Sponsorizzata','Sponsorizzato', 'Sponsorizat', '赞赞助助内内容容', 'ﻢُﻣﻮَّﻟ',
          'प्रायोजпонзорисано', 'Реклама', '広広告告', 'ได้รับการสนับสนุน', 'Sorowane'];

/* utilities function for client-side parsing */
function infoReducer(listof, attribute) {
  if(!listof || !listof.length)
    return null;

  const retval = { amount: listof.length, attrs: [] };
  retval.attrs = [...listof].map(function(element) {
    return element.getAttribute(attribute);
  });
  return retval;
}

function checkIfIsAd(e) {
  // December 2020 update: it is now worthy to look at the call to action
  // in the advertising and go up till the right post selection.
  // this function is the one that decides if a post is a sponsored or not
  const candidate1 = infoReducer(e.querySelectorAll('i[aria-label]'), 'aria-label');
  const candidate2 = e.querySelector('a[href^="/ads/about"]');
  if(!candidate1 || !candidate1.attrs.length || !candidate2)
    return null;

  if(candidate2)
    return { type: 'ad', visibility: 'public', visibilityInfo: 'guessed', element: e };

  const sponseredWordFound = _.some(candidate1.attrs, function(label) {
    if(sponsoredText.includes(label))
      console.log("Matched sponsored content!", label, "in", e);
    return sponsoredText.includes(label);
  });
  if(!sponseredWordFound)
    return null;

  return {
    type: 'ad', visibility: 'public', element: e,
    visibilityInfo: infoReducer(e.querySelectorAll('[aria-label]'), 'aria-label'),
  };
}

function unReliableSize(elem) {
  const s = elem.outerHTML.length;
  const MINIMUM = 10000;
  if(s > MINIMUM) return false;
  console.warn("size inconsistent with expectations", s, elem.outerHTML.substr(0, 200));
  return true;
}

function scrapePost(element) {
  if(unReliableSize(element)) return null;

  /* first check depends on advertising words. this get marked accordingly client side now */
  const isAd = checkIfIsAd(element);
  if(isAd) return _.extend(isAd, {from: 'standard'});

  const iconsNfo = infoReducer(element.querySelectorAll('i[aria-label][role="img"]'), 'aria-label');
  if(!iconsNfo) {
    // this is like "people you might know"
    console.debug("Post match mistake: (no attrs found! skipping)", element.textContent);
    return null;
  }

  let lastVisibleWord, visibility = null;
  try {
    lastVisibleWord = iconsNfo.attrs.map(function(label) {
      return label.trim().split(" ").pop().toLowerCase();
    });
    visibility = lastVisibleWord.some(function(fword) {
      // if(publicWords.includes(fword)) console.log("Seems we have a winner", fword, lastVisibleWord, publicWords);
      return publicWords.includes(fword);
    }) ? "public" : "private";
  } catch(e) {
    visibility = 'broken';
  }

  console.debug(
    `Post categorized as "${visibility}" +i ${JSON.stringify(iconsNfo)}`
  );

  return {
    type: 'post',
    from: 'standard',
    visibility,
    visibilityInfo: iconsNfo,
  };
}

module.exports = {
  scrapePost,
  // scrapeAbove,
}
