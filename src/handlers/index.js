export function registerHandlers (hub) {
    require('./sync').register(hub);
    require('./logger').register(hub);
    require('./visualFeedback').register(hub);
    // require('./visualDebug').register(hub);

    if (config.DEVELOPMENT) {
        require('./reloadExtension').register(hub);
    }
}
