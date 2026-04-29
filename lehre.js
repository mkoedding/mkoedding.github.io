/**
 * Lehre-Bereich: Interaktive Komponenten
 *
 * Drei Video-Patterns werden unterstützt:
 *   1. Single  – ein Video pro Woche, .video-placeholder direkt
 *   2. Tabs    – mehrere gleichwertige Videos in .video-tabs
 *   3. Liste   – Hauptvideo + Vorschau-Karten in .video-list
 *
 * Schul-Modus (Moodle-Variante):
 *   URL mit ?moodle, ?schule oder ?embed=off versteckt alle
 *   Video-Komponenten und zeigt nur PDFs.
 *   Beispiel: .../natuerliche-zahlen/?moodle
 */
(function() {
    'use strict';

    // ----------------------------------------------------------
    // Schul-Modus erkennen
    // ----------------------------------------------------------
    function isSchoolMode() {
        var params = new URLSearchParams(window.location.search);
        return params.has('moodle') ||
               params.has('schule') ||
               params.get('embed') === 'off';
    }

    // ----------------------------------------------------------
    // Schul-Modus aktivieren
    // ----------------------------------------------------------
    function applySchoolMode() {
        document.documentElement.classList.add('school-mode');

        // Banner ganz oben einblenden (nach dem Header)
        var banner = document.createElement('div');
        banner.className = 'school-mode-banner';
        banner.setAttribute('role', 'note');
        banner.innerHTML =
            '<div class="container">' +
                '<div class="school-mode-banner-content">' +
                    '<span class="school-mode-icon" aria-hidden="true">🎓</span>' +
                    '<div class="school-mode-text">' +
                        '<strong>Schul-Ansicht</strong> · ' +
                        'Videos sind ausgeblendet. Es werden nur die ' +
                        'Lückenskripte und Aufgabenblätter angezeigt.' +
                    '</div>' +
                    '<a href="' + window.location.pathname + '" class="school-mode-toggle">' +
                        'Vollversion mit Videos →' +
                    '</a>' +
                '</div>' +
            '</div>';

        var header = document.querySelector('.site-header');
        if (header && header.parentNode) {
            header.parentNode.insertBefore(banner, header.nextSibling);
        } else {
            document.body.insertBefore(banner, document.body.firstChild);
        }

        // Statt der Video-Komponenten einen kompakten Hinweis einblenden
        var videoContainers = document.querySelectorAll(
            '.video-wrapper, .video-tabs, .video-list'
        );
        videoContainers.forEach(function(container) {
            var notice = document.createElement('div');
            notice.className = 'video-hidden-notice';
            notice.innerHTML =
                '<span class="video-hidden-icon" aria-hidden="true">▶</span>' +
                '<span class="video-hidden-text">' +
                    'Video ist in der Schul-Ansicht ausgeblendet.' +
                '</span>';
            container.parentNode.replaceChild(notice, container);
        });

        // In der Meta-Zeile jeder Stunde "Video" ggf. entfernen
        document.querySelectorAll('.stunde-meta').forEach(function(meta) {
            var text = meta.textContent;
            if (text.indexOf('Video') !== -1) {
                // Entferne alle Vorkommen von "Video..." bis zum nächsten "·" oder Ende
                text = text.replace(/[^·]*Video[^·]*(·\s*)?/gi, '');
                text = text.replace(/^\s*·\s*/, '').trim();
                meta.textContent = text || 'PDF + Aufgaben';
            }
        });
    }

    // ----------------------------------------------------------
    // YouTube-iframe für eine ID erzeugen
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
        document.querySelectorAll('.video-placeholder').forEach(function(p) {
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

                    main.innerHTML = '';
                    main.style.position = 'relative';
                    main.style.aspectRatio = '16 / 9';
                    main.appendChild(createYoutubeIframe(videoId));

                    cards.forEach(function(c) { c.dataset.active = 'false'; });
                    card.dataset.active = 'true';
                });
            });
        });
    }

    function init() {
        if (isSchoolMode()) {
            applySchoolMode();
            return;
        }
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