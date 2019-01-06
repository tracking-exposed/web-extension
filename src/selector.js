import _ from 'lodash';
import config from './config';

const bo = chrome || browser;

// This code could be used to stop unsupported language, after some internal stats will 
// spot the presence of an anomalously sequence of 10 private post with 0 public.
class SelectorChecker {
    constructor () {
        this.reset();
    }

    add ( scrapedData ) {
        this.data.total += 1;
        this.data.infos.push(scrapedData.visibilityInfo);

        if(!scrapedData)  {
            this.data.notpost += 1;
            return;
        }
        if(!this.data.begin)
            this.data.begin = scrapedData.impressionTime;

        if(scrapedData.visibility === 'public') 
            this.data.visible++;
        else
            this.data.restricted++;

        // this.printStatus();
    }

    newTimeline () {
        if(this.data.total) {
            this.printStatus();

            if(this.previous &&
                this.data.total > 5 &&
                this.previous.total > 5 &&
                this.previous.visible === 0 &&
                this.data.visible === 0)
                console.log("newTimeline- strange behaviour comparing the last & previous: is the selector ok?");

            this.previous = Object.assign(this.data);
            console.log("newTimeline start- the previous:", JSON.stringify(this.previous));
            this.reset();
        }
    }

    reset () {
        console.log("Initialize statistics counters");
        this.data = {
            total: 0,
            visible: 0,
            restricted: 0,
            notpost: 0,
            begin: null,
            blocked: false,
            infos: [],
        }
        if(!this.previous)
            this.previous = {};
    }

    printStatus () {
        console.log("collection stats: total posts processed ", this.data.total,
                    "Public ", this.data.visible,
                    "Restricted ", this.data.restricted,
                    "!Post ", this.data.notpost,
                    "Since ", this.data.begin,
                    "Anomaly? ", this.data.blocked
        );
        console.log(this.data.infos);
    }

    /* this warning trigger `true` if restricted audience appears 
     * more than 10 times and zero visible post. It normally means 
     * we are facing an unsupported language or any other condition */
    isWarning () {
        if(this.data.blocked)
            return true;

        if(this.data.visible === 0 &&
           this.data.restricted > 10 && (this.data.total - this.data.restricted) < 3) {
            console.log("This language is not supported!");
            this.data.blocked = true;
            this.printStatus();
            return true;
        }

        if(this.data.total > 20 && this.data.restricted === 0) {
            console.log("Selector changed");
            this.data.blocked = true;
            this.printStatus();
            return true;
        }

        return false;
    }
}

const DEFAULT_SELECTOR = '.userContentWrapper';
var FB_POST_SELECTOR = null;

function get() {
    return !FB_POST_SELECTOR ? DEFAULT_SELECTOR : FB_POST_SELECTOR;
}

function set(input) {
    console.log("selector.set", input);
    FB_POST_SELECTOR = input;
}

const selector = {
    get: get,
    set: set,
    stats: new SelectorChecker()
}

export default selector;
