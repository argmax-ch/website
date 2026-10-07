// Scroll-scrubbed homepage illustration.
// The inline SVG (.traj) carries CSS animations; instead of letting them play
// on load, pause them and map scroll progress through the statements on the
// right onto their timeline: scroll down = forward, scroll up = reverse.
// Progressive enhancement: without JavaScript the SVG plays once on load.
(function () {
  "use strict";

  var svg = document.querySelector(".traj");
  if (!svg || !svg.getAnimations) return;

  var anims = svg.getAnimations({ subtree: true });
  if (!anims.length) return; // e.g. prefers-reduced-motion: static final state

  var total = 0;
  anims.forEach(function (a) {
    a.pause();
    total = Math.max(total, a.effect.getComputedTiming().endTime);
  });

  var statements = document.querySelectorAll(".statement");
  var ticking = false;

  function update() {
    ticking = false;
    // Finish when the last statement reaches the top of the viewport.
    var last = statements[statements.length - 1];
    var max = last
      ? last.getBoundingClientRect().top + window.scrollY
      : document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    var t = progress * total;
    anims.forEach(function (a) {
      a.currentTime = t;
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
