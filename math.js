/**
 * Math-Rendering mit KaTeX
 *
 * Wird auf allen Lehre-Seiten geladen und rendert automatisch
 * mathematische Ausdrücke. Lädt KaTeX nur, wenn die Seite auch
 * Mathematik enthält (Performance-Optimierung).
 *
 * Syntax in HTML/Markdown:
 *   $...$      → inline-Mathe (z.B. $f(x) = x^2$)
 *   $$...$$    → display-Mathe (eigene Zeile, zentriert)
 *   \(...\)    → inline-Mathe (alternative Syntax)
 *   \[...\]    → display-Mathe (alternative Syntax)
 *
 * Beispiele in der Lerntheke:
 *   "Berechne $(-4) + (+3)$"
 *   "Die Lösung ist $$\frac{a+b}{c}$$"
 *
 * Datenschutz:
 *   KaTeX wird via cdn.jsdelivr.net geladen. Beim Aufruf wird
 *   die IP an Cloudflare übertragen. Falls das nicht erwünscht
 *   ist, KaTeX lokal in /vendor/katex/ ablegen und die URLs
 *   unten anpassen.
 */
(function() {
    'use strict';

    var KATEX_VERSION = '0.16.11';
    var KATEX_CDN = 'https://cdn.jsdelivr.net/npm/katex@' + KATEX_VERSION + '/dist/';

    // Erkennen, ob die Seite Mathe-Ausdrücke enthält
    function pageHasMath() {
        var text = document.body.textContent || '';
        // Heuristik: Suche nach $...$, $$...$$, \(...\) oder \[...\]
        return /\$[^$\n]+\$|\\\(|\\\[/.test(text);
    }

    function loadStylesheet(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    function loadScript(src, onLoad) {
        var script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
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
                // Bei Hinweisen, die hidden sind: trotzdem rendern,
                // damit beim Aufklappen sofort sichtbar
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
            return;  // Stille Rückkehr, keine Mathe-Last für reine Textseiten
        }

        // Schritt 1: KaTeX-CSS laden
        loadStylesheet(KATEX_CDN + 'katex.min.css');

        // Schritt 2: KaTeX-Core laden, dann auto-render
        loadScript(KATEX_CDN + 'katex.min.js', function() {
            // Schritt 3: Auto-render-Extension nachladen
            loadScript(KATEX_CDN + 'contrib/auto-render.min.js', function() {
                renderMath();

                // Bei dynamisch geöffneten Hinweisen erneut rendern
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.hinweis-toggle, .loesung-summary')) {
                        // Nach kurzer Verzögerung, damit das Element sichtbar ist
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