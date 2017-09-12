// This code could be used to stop unsupported language, after some internal stats will 
// spot the presence of an anomalously sequence of 10 private post with 0 public.
class StatsCounter {
    constructor () {
        this.reset();
    }

    add ( scrapedData ) {
        if(!this.begin)
            this.begin = scrapedData.impressionTime;

        if(scrapedData.visibility === 'public') 
            this.visible++;
        else
            this.restricted++;
    }

    newTimeline () {
        if(this.previous === 0 && this.visible === 0) {
            console.error("Test, check teh selector");
        }
        this.previous = this.visible;
        console.log("newTimeline registered in internalstats",
            this.previous);
    }

    reset () {
        this.visibile = 0;
        this.restricted = 0;
        this.begin = null;
        this.blocked = false;
    }

    /* this warning trigger `true` if restricted audience appears 
     * more than 10 times and zero visible post. It normally means 
     * we are facing an unsupported language */
    isWarning () {
        if(this.blocked)
            return false;

        if(this.restricted > 10 && !this.visible) {
            console.log("This language is not supported!");
            this.blocked = true;
        }
        /* TODO can be done statistics here, about frequency ? */

        return (this.restricted > 10 && !this.visible);
    }
}

const internalstats = new StatsCounter();

export default internalstats;
