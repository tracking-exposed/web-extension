// # Welcome to the extension docs!
// Here you can learn how the extension works and, if this is what you aim for,
// where to put your hands to hack the code.
//
// ## Structure of the extension
// The extension has two parts:
//  - a content script
//  - event pages.
//
// The **content script** is the JavaScript code injected into the Facebook.com
// website. It can interact with the elements in the page to scrape the data and
// prepare the payload to be sent to the API.
//
// On the other side there are **event pages**. They are scripts triggered by
// some events sent from the **content script**. Since they run in *browser-space*,
// they have the permission (if granted) to do cross-domain requests, access
// cookies, and [much more](https://developer.chrome.com/extensions/declare_permissions).
// All **event pages** are contained in the [`./background`](./background/app.html) folder.
// (the name is **background** for historical reasons and it might be subject of changes
// in the future).

// # Code
// Import the styles for the app.
require('../styles/app.scss');

// Import the react toolkit.
// Seems like importing 'react-dom' is not enough, we need to import 'react' as well.
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

// Import other utils to handle the DOM and scrape data.
import uuid from 'uuid';
import $ from 'jquery';
import 'arrive';
import { scrape, scrapePermalink } from './scrape';

import config from './config';
import hub from './hub';
import { getTimeISO8601 } from './utils';
import { registerHandlers } from './handlers/index';
import internalstats from './internalstats';

import OnboardingBox from './components/onboardingBox';

// export const FB_POST_SELECTOR1 = '.fbUserPost';
// export const FB_POST_SELECTOR1 = '.fbUserContent';
export const FB_POST_SELECTOR1 = '.fbUserStory';
export const FB_TIMELINE_SELECTOR = '#newsFeedHeading';

// bo is the browser object, in chrom is named 'chrome', in firefox is 'browser'
const bo = chrome || browser;

// Boot the user script. This is the first function called.
// Everything starts from here.
function boot () {
    console.log(`Fbtrex version ${config.VERSION} build ${config.BUILD} loading.`);
    console.log('Config:', config);

    // Register all the event handlers.
    // An event handler is a piece of code responsible for a specific task.
    // You can learn more in the [`./handlers`](./handlers/index.html) directory.
    registerHandlers(hub);

    // Lookup the current user and decide what to do.
    userLookup(response => {
        // `response` contains the user's public key and its status,
        // if the key has just been created, the status is `new`.
        if (response.status === 'new') {
            // In the case the status is `new` then we need to onboard the user.
            onboarding(response.publicKey);
            // Keep an eye if the onboarding box is still there.
            window.setInterval(() => onboarding(response.publicKey), 1000);
        } else {
            // Otherwise, we load all the components of the UI and the watchers.
            timeline();
            prefeed();
            watch();
            flush();
        }
    });
}

// The function `userLookup` communicates with the **action pages**
// to get information about the current user from the browser storage
// (the browser storage is unreachable from a **content script**).
function userLookup (callback) {
    if (!config.userId || config.userId === 'loggedOut') {
        console.log('User not logged in, bye for now');
        return;
    }

    // Retrieve the user from the browser storage. This is achieved
    // sending a message to the `chrome.runtime`.
    bo.runtime.sendMessage({
        type: 'userLookup',
        payload: {
            userId: config.userId
        }
    }, callback);
}

// This function will first trigger a `newTimeline` event and wait for a
// new refresh.
function timeline () {
    processTimeline();
    /* this is not OK anymore, the selector is outdated,
     * still it is working fine, because it is call when refresh */
    document.arrive(FB_TIMELINE_SELECTOR, processTimeline);
}

function prefeed () {
    document.querySelectorAll(FB_POST_SELECTOR1).forEach(processPost);
}

function testx(e) {
    console.log("begin");
    for(var i = 0 ; i < 9; i++) {
        if(e) {
            if(e.innerHTML) {
                console.log(i, " + ", e.innerHTML.length);
            }
            if(e.parent) {
                console.log("dio");
                e = e.parent;
            }
        }
        console.log("done", i);
    }
}

function watch () {
    document.arrive(FB_POST_SELECTOR1, function () { processPost(this); });
}

function flush () {
    window.addEventListener('beforeunload', (e) => {
        hub.event('windowUnload');
    });
}

function processPost (elem) {
    if (window.location.pathname !== '/') {
        console.log('Skip post, not in main feed', window.location.pathname);
        return;
    }

    const $elem = $(elem).parent();
    var data = null;;
    try {
        data = scrape($elem);
    } catch (e) {
        console.log("Unable to scrape post");
        /*
        if (e.toString() !== "TypeError: Cannot read property 'trim' of undefined") {
            console.error(e, $elem);
        } */
    }

    if (data) {
        hub.event('newPost', { element: $elem, data: data });
    }

    internalstats.add(data);
    if (internalstats.isWarning() ) {
        hub.event('warning', { stats: internalstats, element: $elem } );
    }
}

function processTimeline () {
    internalstats.newTimeline();
    internalstats.reset();
    hub.event('newTimeline', {
        uuid: uuid.v4(),
        startTime: getTimeISO8601()
    });
}

// The function `onboarding` guides the user through the public key
// registration.
// The flow is the following:
// 1. display a message at the top of the page. The message includes the
//    a public key and it prompts the user to copy paste it in a
//    new public post.
// 2. Wait until a post appears in the timeline.
// 3. Once the post appears, extract its permalink and send it to the API.
// 4. If the API call is successful, an **activity page** will update the
//    status of the key from `new` to `verified`.
function onboarding (publicKey) {
    // Since this function can be called multiple times, we need to check
    // if the message box is already there. If so, we just return

    if ($('.fbtrex--onboarding').length) {
        return;
    }

    // The first action is to display the big information box.
    $('body').prepend($(ReactDOMServer.renderToString(
        <OnboardingBox publicKey={publicKey} />
    )));

    // Bind events to the onboarding box (this should not live here but in
    // its own function.
    $('.fbtrex--onboarding-toggle').on('click', () => {
        $('.fbtrex--onboarding > div').toggle('fbtrex--hide');
    });

    // Then we listen to all the new posts appearing on the user's timeline.
    document.arrive(FB_POST_SELECTOR1, function () {
        const $elem = $(this).parent();

        // Process the post only if its html contains the user's public key.
        if ($elem.html().indexOf(publicKey) !== -1) {
            // Extract the URL from the post
            var permalink = scrapePermalink($elem);

            console.log('Permalink for verification', permalink);

            // Kindly ask to verify the user's public key against the API.
            // Since this is a cross domain request, we need to delegate the
            // call to an **action page**. If the call is successful, the action
            // page handling the event will update the status of the key in the
            // database. It will call the `verify` callback function as well.
            bo.runtime.sendMessage({
                type: 'userVerify',
                payload: {
                    html: $elem.html(),
                    userId: config.userId,
                    publicKey: publicKey,
                    permalink: permalink
                }
            }, verify);
        }
    });
}

// This function checks the response from the verification API call.
// If the call is successful, it will reload the browser. This will restart
// this application as well, but instead of the onboarding the app will start
// scraping the posts.
function verify (status, response) {
    console.log('verify response:', response, status);
    if (status === 'ok') {
        window.location.reload();
    } else {
        console.error('sendMessage on userVerify gave back an error?',
            response, status);
        window.location.reload();
    }
}

// Before booting the app, we need to update the current configuration
// with some values we can retrieve only from the `chrome`space.
bo.runtime.sendMessage({type: 'chromeConfig'}, (response) => {
    Object.assign(config, response);
    boot();
});
