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
import selector from './selector';
import token from './token';

import OnboardingBox from './components/onboardingBox';

const FB_TIMELINE_SELECTOR = '#newsFeedHeading';

// bo is the browser object, in chrom is named 'chrome', in firefox is 'browser'
const bo = chrome || browser;

// Boot the user script. This is the first function called.
// Everything starts from here.
function boot () {
    console.log(`fbtrex version ${config.VERSION} loading.`);
    console.log('Config:', config);

    // Register all the event handlers.
    // An event handler is a piece of code responsible for a specific task.
    // You can learn more in the [`./handlers`](./handlers/index.html) directory.
    registerHandlers(hub);

    // check if the content script is on tracking.exposed page and if the page is
    // communicating something (researcher opt-in or special settings update
    if(!_.endsWith(window.location.origin, 'facebook.com')) {
        console.log("Considering TREX channel on: ", window.location.origin);
        if(_.isUndefined($("#fbtrex-parseable-channel")))
            return null;

        $(".extension-missing").hide();
        $(".extension-present").show();

        let channeled = $("#fbtrex-parseable-channel").text();
        console.log(`Channeled content: ${channeled}`);

        /* TODO -- inject a clickable function inside the button "accept"
         * and when the user press it, save in the DB the new special
         * conditions */
        return;
    }

    // Lookup the current user and decide what to do.
    userLookup(response => {

        // `response` contains the user's public key and its status,
        // if the key has just been created, the status is `new`.
        console.log("userLookup responded:", response);
        if (_.isUndefined(response.optin) || response.optin.infoDiet !== true) {
            // The opt-in is missing then we need to ask them to the user.
            onboarding(response);
            window.setInterval(() => onboarding(response), 1000);
            // without opt-in, there is not acquisition at all
            return;
        } 

        // The user compose this unique message and is signed with their PGP key
        // we returns the most update CSS selector for the public posts and 
        // an authentication token, necessary to log-in into the personal page
        // selector is returned, accessToken is saved as side-effect (it could be cleaner)
        let uniqueMsg = `key ${response.publicKey}@${config.userId} RAND: ${Math.random()}@${new Date()}`;

        // this can be used to verify presente of privateKey associated to our own publicKey
        bo.runtime.sendMessage({
            type: 'userInfo',
            payload: {
                message: uniqueMsg,
                userId: config.userId,
                version: config.VERSION,
                publicKey: response.publicKey,
                optin: response.optin
            },
            userId: config.userId
        }, (response => {
            try {
                /* this could raise an exception if JSON.parse fails, but
                 * there is a default hardcoded in the extension */
                selector.set(JSON.parse(response.response).selector);
                token.set(JSON.parse(response.response).token);
            } catch(e) {
                console.log("selector retrieve fail:", e.description);
            } finally {
                console.log("Begin collection and analysis [using:", selector.get(), "]");
                console.log("Token received is [", token.get(), "]");
                timeline();
                prefeed();
                watch();
                flush();
            }
        }));
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
    document.arrive(FB_TIMELINE_SELECTOR, processTimeline);
}

function prefeed () {
    document.querySelectorAll(selector.get()).forEach(processPost);
}

function watch () {
    document.arrive(selector.get(), function () { processPost(this); });
}

function flush () {
    window.addEventListener('beforeunload', (e) => {
        hub.event('windowUnload');
    });
}

function locationConsidered(path) {
    /* check if the path is among the one which we would read at */
    return ( path !== '/' );
}

function processPost (elem) {

    if (locationConsidered(window.location.pathname)) {
        console.log(`Skip post: ${window.location.pathname} is not an observed location`);
        return;
    }

    const $elem = $(elem).parent();

    if (selector.stats.isWarning()) {
        console.log(`Anomaly detected: ${selector.stats.printStatus()}`);
        hub.event('anomaly', {
            stats: selector.stats.data,
            previous: selector.stats.previous,
            element: $elem
        });
    }

    try {
        var data = scrape($elem);
        selector.stats.add(data);
        delete data.visibilityInfo;
        hub.event('newPost', { element: $elem, data: data });
    } catch (e) {
        console.log("Unable to scrape post");
        selector.stats.add(null);

        // XXX TODO make this investigation method for developers/researcher
        // hub.event('newPost', { element: $elem, data: data, anomaly: true });
        // console.log($elem.html());
    }
}

function processTimeline () {
    console.log("New timeline begin now:", new Date());
    selector.stats.newTimeline();
    hub.event('newTimeline', {
        uuid: uuid.v4(),
        startTime: getTimeISO8601()
    });
}

// The function `onboarding` guides the user through the 
// opt-in process.
//
// Memory: this code originally guide through the public key 
// registration. That part of code and description got removed
// at 0927f2b6040dac4c8ef0232a1de7713d601dfef9
function onboarding (publicKey) {

    // Since this function can be called multiple times, we need to check
    // if the message box is already there. If so, we just return
    if ($('.fbtrex--onboarding').length)
        return;

    // The first action is to display the big information box.
    $('body').prepend($(ReactDOMServer.renderToString(
        <OnboardingBox publicKey={publicKey} />
    )));

    // Bind events to the onboarding box (this should not live here but in
    // its own function.
    $('.fbtrex--onboarding-toggle').on('click', () => {
        $('.fbtrex--onboarding > div').toggle('fbtrex--hide');
    });

    $('#info-diet-button').on('click', () => {
        $('#info-diet-asterisk').addClass('asterisk-selected');
        $('#info-diet-asterisk').removeClass('asterisk-default');
        $('#info-diet-checkbox').text('☑');
        $('#closeContinue').addClass('enabled');
        $('#closeContinue').removeClass('continue-default');
    });

/*
    $('#anomaly-button').on('click', () => {
        $('#anomaly-checkbox').text('☑');
    });

   -- the data reuse is not personal, and the researcher agreements
      needs a dedicated opt-in therefore this is removed             --
    $('#data-reuse-checkbox').on('click', () => {
        $('#data-reuse-button').toggleClass('welcome-opt-in');
        console.log("clicked 1");
    });
 */

    $('#closeContinue').on('click', () => {
        if($('#closeContinue').hasClass('enabled')) {
            $("#closeContinue").text("Saving and refreshing...");

            bo.runtime.sendMessage({
                type: 'optIn',
                payload: {
                    infoDiet: true,
                    // dataReuse: dataReuse,
                    userId: config.userId
                }
            }, (response => {
                window.location.reload();
            }));
        } 
    });

}

// Before booting the app, we need to update the current configuration
// with some values we can retrieve only from the `chrome`space.
bo.runtime.sendMessage({type: 'chromeConfig'}, (response) => {
    Object.assign(config, response);
    boot();
});
