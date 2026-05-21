/**
 * Filter-Logik für Paper- und Projekt-Einträge
 *
 * Funktioniert mit Buttons der Klasse .filter-btn,
 * gruppiert in .filter-buttons-Containern, jeweils mit
 * data-filter-target. Filtert .entry-Elemente innerhalb
 * des dazugehörigen Bereichs (#papers / #projects)
 * basierend auf dem Attribut data-year.
 */

(function() {
    'use strict';

    function initFilters() {
        const filterGroups = document.querySelectorAll('.filter-buttons[data-filter-target]');

        filterGroups.forEach(function(group) {
            const targetId = group.dataset.filterTarget;
            const targetSection = document.getElementById(targetId);

            if (!targetSection) {
                return;
            }

            const buttons = group.querySelectorAll('.filter-btn');
            const entries = targetSection.querySelectorAll('.entry');

            buttons.forEach(function(button) {
                button.addEventListener('click', function() {
                    const selectedYear = button.dataset.year;

                    // Aktiv-Status der Buttons aktualisieren
                    buttons.forEach(function(btn) {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');

                    // Einträge ein- bzw. ausblenden
                    entries.forEach(function(entry) {
                        if (selectedYear === 'all' || entry.dataset.year === selectedYear) {
                            entry.style.display = '';
                        } else {
                            entry.style.display = 'none';
                        }
                    });
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFilters);
    } else {
        initFilters();
    }
})();