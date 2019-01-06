import config from './config';
const bo = chrome || browser;

// This code just store in a global setting the token. Which can be 
// refreshed in some moment by the user and (should) be saved in the
// localStorage. At the moment is downloaded every time from fbtrex,
// imply the user can open the link only via "your data" link and then
// save the link, until the token is not revoked by the user itself...
// ... (which at the moment can't be done)

class Token {
    constructor () {
        this.stored = "unset";
    }

    get() {
        return this.stored;
    }

    set(input) {
        console.log("token.set", input);
        this.stored = input;
    }

}

const token = {
    authToken: new Token()
};

export default token;
