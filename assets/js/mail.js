// Setzt die E-Mail-Adresse erst im Browser zusammen.
// Im Quelltext steht sie nur rückwärts und ohne @, damit Crawler sie nicht finden.
// Elemente mit data-mail werden zum mailto-Link; mit Klasse mail-text wird auch die Adresse angezeigt.
document.querySelectorAll("[data-mail]").forEach(function (el) {
  var parts = el.getAttribute("data-mail").split("/").map(function (s) {
    return s.split("").reverse().join("");
  });
  var address = parts[1] + "@" + parts[0];
  el.setAttribute("href", "mailto:" + address);
  if (el.classList.contains("mail-text")) {
    el.textContent = address;
  }
});
