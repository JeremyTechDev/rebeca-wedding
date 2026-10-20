(function () {
  'use strict';

  var items = document.querySelectorAll('.qa');
  if (!items.length) return;

  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      items.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
