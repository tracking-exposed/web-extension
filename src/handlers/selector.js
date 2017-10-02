import selector from '../selector';

function setSelector(response) {
    console.log("setSelector", response);
    selector.set(response.response);
};

function keepDefault(response) {
    console.log("Keeping the default selector because of error:", response.error);
};

export function register (hub) {
    console.log("registersing selector Hub");
    hub.register('selectorReceived', setSelector);
    hub.register('selectorError', keepDefault);
}
