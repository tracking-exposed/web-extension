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

// Imported from WhoTargetsMe , 15 Nov 2020, from a MIT license, (originally from Facebook?)
const sponsoredText = ['Sponsored', 'Sponsorjat','Sponzorované','Спонзорирано', 'Χορηγούμενη',
          'Sponsitud','Sponzorováno','Спонсорирано', 'ממומן', 'Sponsoroitu','Sponsrad',
          'Apmaksāta reklāma','Sponsorlu','Sponsrad','Спонзорисано','Sponzorované','Sponsa',
          'Gesponsord','Sponset','Hirdetés', 'Sponsoreret', 'Sponzorováno', 'Sponsorisé',
          'Commandité', 'Publicidad','Gesponsert', 'Χορηγούμενη', 'Patrocinado', 'Plaćeni oglas',
          'Sponsorizzata ','Sponsorizzato', 'Sponsorizat', '赞赞助助内内容容', 'ﻢُﻣﻮَّﻟ',
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

/* function recursiveParent(node, MAX) {
  console.log("* recursiveParent", node.tagName, "size", node.outerHTML.length);
  if(node.parentNode.outerHTML.length < MAX) {
    return recursiveParent(node.parentNode, MAX);
  }
  return node;
} */

function checkIfIsAd(e) {
  const candidates = infoReducer(e.querySelectorAll('[aria-label]'), 'aria-label');
  if(!candidates || !candidates.attrs.length)
    return null;
  const sponseredWordFound = _.some(candidates.attrs, function(label) {
    return sponsoredText.includes(label);
  });
  if(!sponseredWordFound)
    return null;
  console.log("Matched sponsored content!", sponseredWordFound, e);
  return {
    type: 'ad',
    visibility: 'public',
    visibilityInfo: infoReducer(e.querySelectorAll('[aria-label]'), 'aria-label'),
  }
}

function unReliableSize(elem) {
  const s = elem.outerHTML.length;
  const MINIMUM = 10000;
  if(s > MINIMUM) return false;
  console.log("size failure", s, elem.outerHTML.substr(0, 200));
  return true;
}

/* core entry function for client-side parsing, configured in scrape.js,
  this is the only function that return element because it should overwrite the one grabbed */
function scrapeAbove(element) {
  /* this is used for dark ad spotting */
  const rightElement = element.closest("div[data-pagelet]"); // ERROR this selector is hardcoded and shouldn't
  console.log("scrapeAbove(darkad)", rightElement.outerHTML.length);
  if(unReliableSize(rightElement)) return null;

  /* double check */
  const classList = rightElement.className.split(/\s+/);
  if(classList.indexOf('webtrex--scraped') !== -1) {
    console.log("Element already checked/acquired?", rightElement, "returning");
    return null;
  }
  // rightElement.classList.add("webtrex--scraped");

  /* first check depends on advertising words. this get marked accordingly client side now */
  const isAd = checkIfIsAd(rightElement);
  if(isAd) return _.extend(isAd, { from: 'recursive', element: rightElement });

  const visibilityInfo = infoReducer(rightElement.querySelectorAll('i[aria-label]'), 'aria-label');
  return {
    type: 'darkadv',
    element: rightElement,
    from: 'recursive',
    visibilityInfo,
  }
}

function scrapePost(element) {
  if(unReliableSize(element)) return null;

  /* first check depends on advertising words. this get marked accordingly client side now */
  const isAd = checkIfIsAd(element);
  if(isAd) return _.extend(isAd, {from: 'standard'});

  const iconsNfo = infoReducer(element.querySelectorAll('i[aria-label][role="img"]'), 'aria-label');
  if(!iconsNfo) {
    // this is like "people you might know"
    // console.debug("Post match mistake: (no attrs found! skipping)", element.textContent);
    return null;
  }

  const lastVisibleWord = iconsNfo.attrs.map(function(label) {
    return label.trim().split(" ").pop().toLowerCase();
  });
  const visibility = lastVisibleWord.some(function(fword) {
    // if(publicWords.includes(fword)) console.log("Seems we have a winner", fword, lastVisibleWord, publicWords);
    return publicWords.includes(fword);
  }) ? "public" : "private";

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

function scrapeGrab(element) {
  /* this is used for events pages */
  console.log("scrapeGrab for /events -- PLS2CHK", element);
  return {
    type: 'event',
    note: 'not really implemented, check near the end of scraper.js'
  }
}

module.exports = {
  scrapePost,
  scrapeAbove,
  scrapeGrab,
}
