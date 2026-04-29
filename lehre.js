/**
 * Lehre-Bereich: Interaktive Komponenten
 *
 * Drei Video-Patterns werden unterstützt:
 *   1. Single  – ein Video pro Woche, .video-placeholder direkt
 *   2. Tabs    – mehrere gleichwertige Videos in .video-tabs
 *   3. Liste   – Hauptvideo + Vorschau-Karten in .video-list
 *
 * Alle drei nutzen denselben Two-Click-Mechanismus:
 * Erst beim expliziten Klick wird YouTube nachgeladen.
 */
(function() {
    'use strict';

    // ----------------------------------------------------------
    // Hilfsfunktion: ein iframe für eine YouTube-ID erstellen
    // ----------------------------------------------------------
    function createYoutubeIframe(videoId) {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' +
                     encodeURIComponent(videoId) + '?autoplay=1&rel=0';
        iframe.title = 'YouTube-Video';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; ' +
                       'encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        iframe.style.position = 'absolute';
        iframe.style.inset = '0';
        return iframe;
    }

    // ----------------------------------------------------------
    // Pattern 1 + 2 + Liste-Hauptvideo:
    // Platzhalter durch iframe ersetzen
    // ----------------------------------------------------------
    function loadInPlaceholder(placeholder) {
        var videoId = placeholder.dataset.videoId;
        if (!videoId || videoId === 'PLATZHALTER_ID') {
            console.warn('Kein gültiges YouTube-Video verknüpft.');
            return;
        }

        var wrapper = placeholder.parentElement;
        wrapper.style.position = 'relative';
        wrapper.style.aspectRatio = '16 / 9';
        wrapper.replaceChild(createYoutubeIframe(videoId), placeholder);
    }

    function initSinglePlaceholders() {
        // Wirkt nur auf direkte .video-placeholder-Elemente
        // (also Single + die einzelnen Tab-Panels + Liste-Main)
        document.querySelectorAll('.video-placeholder').forEach(function(p) {
            // Click auf Container ODER Button
            p.addEventListener('click', function() { loadInPlaceholder(p); });
            var btn = p.querySelector('.placeholder-btn');
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    loadInPlaceholder(p);
                });
            }
        });
    }

    // ----------------------------------------------------------
    // Pattern 2: Tabs
    // Tab-Buttons schalten zwischen Panels um
    // ----------------------------------------------------------
    function initTabs() {
        document.querySelectorAll('.video-tabs').forEach(function(tabs) {
            var buttons = tabs.querySelectorAll('.video-tab-btn');
            var panels = tabs.querySelectorAll('.video-tab-panel');

            buttons.forEach(function(btn, idx) {
                btn.addEventListener('click', function() {
                    buttons.forEach(function(b) {
                        b.setAttribute('aria-selected', 'false');
                    });
                    panels.forEach(function(p) {
                        p.dataset.active = 'false';
                    });
                    btn.setAttribute('aria-selected', 'true');
                    if (panels[idx]) {
                        panels[idx].dataset.active = 'true';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------
    // Pattern 3: Liste
    // Klick auf Vorschau-Karte tauscht Hauptvideo aus
    // ----------------------------------------------------------
    function initVideoLists() {
        document.querySelectorAll('.video-list').forEach(function(list) {
            var main = list.querySelector('.video-list-main');
            var cards = list.querySelectorAll('.video-card');

            cards.forEach(function(card) {
                card.addEventListener('click', function() {
                    var videoId = card.dataset.videoId;
                    if (!videoId || videoId === 'PLATZHALTER_ID') {
                        console.warn('Kein gültiges YouTube-Video verknüpft.');
                        return;
                    }

                    // Den ganzen Hauptvideo-Bereich neu aufbauen
                    main.innerHTML = '';
                    main.style.position = 'relative';
                    main.style.aspectRatio = '16 / 9';
                    main.appendChild(createYoutubeIframe(videoId));

                    // Optional: Karten-Highlight aktualisieren
                    cards.forEach(function(c) {
                        c.dataset.active = 'false';
                    });
                    card.dataset.active = 'true';
                });
            });
        });
    }

    // ----------------------------------------------------------
    // Init
    // ----------------------------------------------------------
    function init() {
        initSinglePlaceholders();
        initTabs();
        initVideoLists();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();