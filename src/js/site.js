/* Meniu mobil + formular de rezervare (total și mesaj WhatsApp). Fără dependențe. */
(function () {
  'use strict';

  // Meniu mobil
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Formular
  var form = document.getElementById('booking-form');
  if (!form) return;
  var cfg = JSON.parse(form.getAttribute('data-config'));
  var P = cfg.prices, M = cfg.message, F = cfg.fields;
  var $ = function (id) { return form.querySelector('[name="' + id + '"]'); };
  var out = {
    total: document.getElementById('bk-total'),
    days: document.getElementById('bk-days'),
    link: document.getElementById('bk-send')
  };

  function days() {
    var s = $('start').value, e = $('end').value;
    if (!s || !e) return 1;
    var d = Math.round((new Date(e) - new Date(s)) / 86400000) + 1;
    return d > 0 ? d : 1;
  }
  function num(id, min) {
    var v = parseInt($(id).value, 10);
    if (isNaN(v)) v = min;
    return Math.max(min, v);
  }
  function text(id, ph) { var v = $(id).value.trim(); return v || ph; }
  var W = M.words || {};
  function label(sel) { var el = $(sel); var v = el.value; return (W[v] || el.options[el.selectedIndex].text).toLowerCase(); }
  function word(k, fallback) { return W[k] || fallback; }

  function update() {
    var d = days();
    var persons = num('persons', 1);
    var sleds = num('sleds', 0);
    var helmet = $('helmet').checked, goggles = $('goggles').checked;
    var perDay = P.full + (helmet ? P.helmet : 0) + (goggles ? P.goggles : 0);
    var total = d * (persons * perDay + sleds * P.sled);
    out.total.textContent = total + ' lei';
    out.days.textContent = d + ' ' + (d === 1 ? F.day : F.days);

    var period = ($('start').value && $('end').value) ? $('start').value + ' - ' + $('end').value : M.placeholderPeriod;
    var msg = M.intro + ' ' + label('kind') + ', ' + M.level + ' ' + label('level') + ', ' +
      text('height', '[cm]') + ' cm, ' + text('weight', '[kg]') + ' kg, ' + word('shoe', F.shoe).toLowerCase() + ' ' + text('shoe', '[nr]') + '. ' +
      M.persons + ': ' + persons + '. ' + M.helmet + ' ' + (helmet ? M.yes : M.no) + ', ' + M.goggles + ' ' + (goggles ? M.yes : M.no) +
      (sleds ? ', ' + M.sleds + ' ' + sleds : '') + '. ' +
      M.period + ' ' + period + ' (' + d + ' ' + (d === 1 ? word('day', F.day) : word('days', F.days)) + '). ' +
      M.total + ' ' + total + ' lei. ' +
      M.name + ' ' + text('name', M.placeholderName) + ', ' + M.phone + ' ' + text('phone', M.placeholderPhone) + ', ' + M.email + ' ' + text('email', M.placeholderEmail) + '.' +
      ($('notes').value.trim() ? ' ' + M.notes + ': ' + $('notes').value.trim() : '');
    out.link.href = 'https://wa.me/' + cfg.wa + '?text=' + encodeURIComponent(msg);
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); update(); window.open(out.link.href, '_blank', 'noopener'); });
  // ziua de azi ca minim pentru calendar
  var today = new Date().toISOString().slice(0, 10);
  $('start').min = today; $('end').min = today;
  $('start').addEventListener('change', function () { $('end').min = $('start').value || today; if ($('end').value && $('end').value < $('start').value) $('end').value = $('start').value; update(); });
  update();
})();
