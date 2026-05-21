/**
 * Math-Rendering mit KaTeX (lokal gehostet)
 *
 * Wird auf allen Lehre-Seiten geladen und rendert automatisch
 * mathematische Ausdrücke. Lädt KaTeX nur, wenn die Seite auch
 * Mathematik enthält (Performance-Optimierung).
 *
 * Syntax:
 *   $...$      → inline-Mathe
 *   $$...$$    → display-Mathe
 *   \(...\)    → inline-Mathe (alternative Syntax)
 *   \[...\]    → display-Mathe (alternative Syntax)
 *
 * KaTeX-Dateien liegen in /vendor/katex/.
 * Siehe LOCAL_HOSTING.md für die Einrichtung.
 */
(function() {
    'use strict';

    // Pfad zum lokalen KaTeX (relativ zum Repo-Root)
    var KATEX_BASE = '/vendor/katex/';
    var KATEX_CDN = '/vendor/katex/';

    function pageHasMath() {
        var text = document.body.textContent || '';
        return /\$[^$\n]+\$|\\\(|\\\[/.test(text);
    }

    function loadStylesheet(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    function loadScript(src, onLoad) {
        var script = document.createElement('script');
        script.src = src;
        script.defer = true;
        if (onLoad) script.onload = onLoad;
        script.onerror = function() {
            console.warn('[Math] Konnte ' + src + ' nicht laden.');
        };
        document.head.appendChild(script);
    }

    function renderMath() {
        if (typeof window.renderMathInElement !== 'function') {
            console.warn('[Math] KaTeX auto-render nicht verfügbar.');
            return;
        }
        try {
            window.renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '$',  right: '$',  display: false },
                    { left: '\\(', right: '\\)', display: false }
                ],
                ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
                throwOnError: false,
                errorColor: '#cc0000',
                strict: false
            });
            console.log('[Math] Mathematik gerendert.');
        } catch (e) {
            console.error('[Math] Fehler beim Rendern:', e);
        }
    }

    function init() {
        if (!pageHasMath()) {
            return;
        }

        loadStylesheet(KATEX_BASE + 'katex.min.css');

        loadScript(KATEX_BASE + 'katex.min.js', function() {
            loadScript(KATEX_BASE + 'contrib/auto-render.min.js', function() {
                renderMath();

                // Bei aufgeklappten Hinweisen erneut rendern
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.hinweis-toggle, .loesung-summary')) {
                        setTimeout(renderMath, 50);
                    }
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();