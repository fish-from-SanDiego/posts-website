// defaults
Fancybox.defaults = {
    ...Fancybox.defaults,
    Images: {
        // Disable image zoom animation on opening and closing
        zoom: false,
        Panzoom: {
            ClickAction: "toggleZoom",
            zoom: true,

            // drag (hold mouse button and move to pan)
            panMode: "drag",
            // max scale is 2
            maxScale: 2
        },
    },
    Toolbar: {
        display: {
            // i / n - displays info
            left: ["infobar"],
            // none
            middle: [],
            // zoom, toggle thumbs, close gallery
            right: ["iterateZoom", "thumbs", "close"],
        },
    },
    // Classic thumbnails (no slide animation in mini gallery)
    Thumbs: {
        type: "classic",
    },
    // Don't create anchor on photo
    Hash: false,
    // Don't animate sliding
    animated: false
};

// binding elements to their galleries ( and setting local params)
Fancybox.bind('[data-fancybox="nuclear_blueprint"]', {});
Fancybox.bind('[data-fancybox="turbines_heat_close"]', {});
Fancybox.bind('[data-fancybox="steam_tanks_close"]', {});
Fancybox.bind('[data-fancybox="reactor_init"]', {Images: {Panzoom: {maxScale: 3},},});
Fancybox.bind('[data-fancybox="reactor_working"]', {Images: {Panzoom: {maxScale: 3},},});
Fancybox.bind('[data-fancybox="reactor_idle"]', {Images: {Panzoom: {maxScale: 3},},});
Fancybox.bind('[data-fancybox="inserters_close"]', {Images: {Panzoom: {maxScale: 3},},});
Fancybox.bind('[data-fancybox="input_output"]', {});
Fancybox.bind('[data-fancybox="combinator_settings"]', {Images: {Panzoom: {maxScale: 3},},});
Fancybox.bind('[data-fancybox="reactors_close"]', {Images: {Panzoom: {maxScale: 3},},});