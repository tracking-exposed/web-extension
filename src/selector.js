import config from './config';
const bo = chrome || browser;

export const DEFAULT_SELECTOR = '.fbUserStory';
export var FB_POST_SELECTOR = null;

// This code could be used to stop unsupported language, after some internal stats will 
// spot the presence of an anomalously sequence of 10 private post with 0 public.
class SelectorChecker {
    constructor () {
        this.reset();
    }

    add ( scrapedData ) {

        this.total += 1;

        if(!scrapedData)  {
            this.notpost += 1;
            return;
        }

        if(!this.begin)
            this.begin = scrapedData.impressionTime;

        if(scrapedData.visibility === 'public') 
            this.visible++;
        else
            this.restricted++;

        // this.debug();
    }

    newTimeline () {

        this.debug();
        console.log("newTimeline");

        if(this.previous &&
            this.total > 5 &&
            this.previous.total > 5 &&
            this.previous.visible === 0 &&
            this.visible === 0) console.error("Ops!, check teh selector?");

        this.backupPrevious();

        console.log("newTimeline registered in internalstats",
            this.previous);
    }

    backupPrevious() {
        this.previous = {
            total: this.total,
            visible: this.visible,
            restricted: this.restricted,
            notpost: this.notpost,
            begin: this.begin,
            blocked: this.blocked
        };
    }

    reset () {
        console.log("reset");
        this.total = 0;
        this.visible = 0;
        this.restricted = 0;
        this.notpost = 0;
        this.begin = null;
        this.blocked = false;
    }

    debug () {
        console.log("# ", this.total,
                    "Public ", this.visible,
                    "Restricted ", this.restricted,
                    "!P ", this.notpost,
                    "B ", this.begin,
                    "stop ", this.blocked);
    }

    /* this warning trigger `true` if restricted audience appears 
     * more than 10 times and zero visible post. It normally means 
     * we are facing an unsupported language or any other condition */
    isWarning () {

        var retVal = false;

        if(this.blocked)
            return retVal;

        if(this.visible === 0 &&
           this.restricted > 10 && (this.total - this.restricted) < 3) {
            console.log("This language is not supported!");
            this.blocked = true;
            retVal = true;
            this.debug();
        }

        if(this.total > 20 && this.restricted === 0) {
            console.log("Selector changed");
            this.blocked = true;
            retVal = true;
            this.debug();
        }

        return retVal;
    }
}
export const internalstats = new SelectorChecker();

bo.runtime.onMessage.addListener((request) => {
    console.log("?", request);
    if(request.type === 'selectorFetch') {
        console.log("!");
        api
            .selectorGet(config.version)
            .then(response => selectorSetter({info: 'fetch', response: response }))
            .catch(error => selectorSetter({info: 'default', response: DEFAULT_SELECTOR }))
        return true;
    };
});

export function selectorSetter(info) {
    console.log("selectorSetter", info.info, "=", info.response);
    FB_POST_SELECTOR = info.response;
};

