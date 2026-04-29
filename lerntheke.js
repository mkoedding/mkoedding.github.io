/**
 * Lerntheke: Hinweise gestaffelt aufklappbar
 *
 * Verhalten:
 *   - Klick auf "Tipp N anzeigen" öffnet/schließt diesen Hinweis
 *   - Hinweise sind voneinander unabhängig
 *   - aria-expanded wird umgeschaltet (Barrierefreiheit)
 *
 * Lösungen nutzen native <details>/<summary>, brauchen kein JS.
 *
 * Diagnose: Bei Problemen die Browser-Konsole öffnen (F12).
 */
(function() {
    'use strict';

    function findContent(button) {
        // Bevorzugt: nächster Geschwister-Knoten der Klasse hinweis-content
        var sibling = button.nextElementSibling;
        while (sibling) {
            if (sibling.classList && sibling.classList.contains('hinweis-content')) {
                return sibling;
            }
            sibling = sibling.nextElementSibling;
        }
        // Fallback: innerhalb desselben hinweis-item suchen
        var item = button.closest('.hinweis-item');
        if (item) {
            return item.querySelector('.hinweis-content');
        }
        return null;
    }

    function toggleHinweis(event, button) {
        event.preventDefault();
        event.stopPropagation();

        var content = findContent(button);
        if (!content) {
            console.warn('[Lerntheke] Kein .hinweis-content zu Button gefunden:', button);
            return;
        }

        var isOpen = button.getAttribute('aria-expanded') === 'true';
        var actionLabel = button.querySelector('.hinweis-action');

        if (isOpen) {
            content.hidden = true;
            content.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
            if (actionLabel) actionLabel.textContent = 'anzeigen';
        } else {
            content.hidden = false;
            content.removeAttribute('hidden');
            button.setAttribute('aria-expanded', 'true');
            if (actionLabel) actionLabel.textContent = 'verbergen';
        }
    }

    function init() {
        var toggles = document.querySelectorAll('.hinweis-toggle');
        if (toggles.length === 0) {
            // Stille Rückkehr — auf Seiten ohne Hinweise normal
            return;
        }
        console.log('[Lerntheke] ' + toggles.length + ' Hinweis-Buttons initialisiert.');

        toggles.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                toggleHinweis(e, btn);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();