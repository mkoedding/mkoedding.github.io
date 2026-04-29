/**
 * Two-Click-Video-Embed (datenschutz-konform):
 * Beim ersten Klick auf das Platzhalter-Element wird das
 * eigentliche YouTube-iframe nachgeladen. Erst dann werden
 * Daten an YouTube/Google übertragen.
 */
(function() {
    'use strict';

    function loadVideo(placeholder) {
        var videoId = placeholder.dataset.videoId;
        if (!videoId || videoId === 'PLATZHALTER_ID') {
            console.warn('Kein gültiges YouTube-Video verknüpft.');
            return;
        }

        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0';
        iframe.title = 'YouTube-Video';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        iframe.style.position = 'absolute';
        iframe.style.inset = '0';

        var wrapper = placeholder.parentElement;
        wrapper.style.position = 'relative';
        wrapper.style.aspectRatio = '16 / 9';
        wrapper.replaceChild(iframe, placeholder);
    }

    function init() {
        document.querySelectorAll('.video-placeholder').forEach(function(placeholder) {
            placeholder.addEventListener('click', function() {
                loadVideo(placeholder);
            });
            // Auch der Button-Klick (falls separat) triggert es
            var btn = placeholder.querySelector('.placeholder-btn');
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    loadVideo(placeholder);
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();