// TODO: in order to extract the visibility of a post,
// we analyze the last word in the "aria-label" of the post itself.
// This part should be improved because there might be some really
// weird corner cases, for example if someone's first name is one
// of the `publicWords`, then we might detect a wrong visibility.

const { not_equal } = require("svelte/internal");

// See https://github.com/tracking-exposed/web-extension/issues/42
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

/* utilities function for client-side parsing */
function infoReducer(listof, attribute) {
  if(!listof || !listof.length)
    return null;

  const retval = { amount: listof.length, e: [] };
  retval.e = [...listof].map(function(element) {
    console.info("text:", element.textContent);
    return element.getAttribute(attribute);
  });
  return retval;
}

function recursiveParent(node, MAX) {
  console.log("trying", node.tagName, "size", node.outerHTML.length);

  if(node.parentNode.outerHTML.length > MAX) {
    return node;
  }
  return recursiveParent(node.parentNode, MAX);
}

/* core entry function for client-side parsing, configured in scrape.js */
function scrapeAbove(element) {
  /* this is used for dark ad spotting */
  const rightElement = recursiveParent(element, 50000);

  const check = rightElement.querySelector('div[aria-posinset');
  if(check)
    check.classList.add("webtrex--scraped");
  else 
    console.log("Odd mistake here! check with scrape.js because we've to mark this dark ad");

  const links = rightElement.querySelectorAll('a[aria-label]');
  const linksNfo = infoReducer(links, 'href');
  if(!linksNfo) debugger;

  return {
    type: 'darkadv',
    updatedElement: rightElement,
    linksNfo,
  }
}

function scrapeGrab(element) {
  /* this is used in event pages */
  debugger;
  return {
    type: 'event'
  }
}

function scrapePost(element) {

  const smalli = element.querySelectorAll('i[aria-label]');
  const iconsNfo = infoReducer(smalli, 'aria-label');
  if(!iconsNfo) {
    console.debug("This post match proven to be a mistake, and will not be send:", element.textContent);
    return null;
  }

  const lastVisibleWord = iconsNfo.e.map(function(label) {
    return label.trim().split(" ").pop().toLowerCase();
  });
  const visibility = lastVisibleWord.some(function(fword) {
    return publicWords.includes(fword);
  }) ? "public" : "private";

  const links = element.querySelectorAll('a[aria-label]');
  const linksNfo = infoReducer(links, 'href');
  if(!linksNfo) debugger;

  console.debug(
    `Post categorized as "${visibility}" +i ${JSON.stringify(iconsNfo)}`
  );

  linksNfo.e.map(function(urlstr, i) {
    let urlO;
    if(!urlstr || !urlstr.length)
      return;
    if(urlstr[0] === '/') {
      urlO = new URL(urlstr, window.location.href);
      console.info("REL", i, urlstr);
    } else {
      urlO = new URL(urlstr);
      console.info("ABS", i, urlstr);
    }
    console.info(urlO.pathname, [...urlO.searchParams.keys()] );
  });

  return {
    type: 'post',
    visibility,
    linksNfo,
    iconsNfo,
  };
}

module.exports = {
  scrapePost,
  scrapeAbove,
  scrapeGrab,
}