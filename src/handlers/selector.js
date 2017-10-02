import selector from '../selector';

function setSelector(response) {
    // XXX this is never called, why???
    console.log("setSelector", response);
    selector.set(response.selector);
};

function keepDefault(response) {
    // XXX same 
    console.log("Keeping the default selector because of error:", response.error);
};

export function register (hub) {
    console.log("registersing selector Hub");
    hub.register('selectorReceived', setSelector);
    hub.register('selectorError', keepDefault);
}
