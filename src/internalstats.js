// This code could be used to stop unsupported language, after some internal stats will 
// spot the presence of an anomalously sequence of 10 private post with 0 public.
class StatsCounter {
    constructor () {
        this.reset();
    }

    add ( scrapedData ) {
        if(!this.begin)
            this.begin = scrapedData.impressionTime;

        console.log("scrapedData", scrapedData);

        if(scrapedData.visibility === 'public') 
            this.visible++;
        else
            this.restricted++;
    }

    reset () {
        this.visibile = 0;
        this.restricted = 0;
        this.begin = null;
        this.blocked = false;
    }

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

const statscompute = new StatsCounter();

export default statscompute;
