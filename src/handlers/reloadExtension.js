function handleReload (hub) {
    chrome.runtime.sendMessage({ type: 'reloadExtension' },
                               response => console.log('Reloading Extension'));
}

export function register (hub) {
    hub.register('windowUnload', handleReload.bind(null, hub));
}
