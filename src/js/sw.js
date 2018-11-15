if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            console.info('Service Worker Registered', reg);
        })
        .catch(err => {
            console.info('Error registering Service Worker', err);
        });
}
