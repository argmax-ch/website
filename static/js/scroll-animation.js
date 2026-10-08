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
  var column = document.querySelector(".image-column");
  // Mirrors the mobile breakpoint in styles.css, where the artwork is pinned
  // in a band above the statements instead of beside them.
  var stacked = window.matchMedia("(max-width: 991px)");
  var ticking = false;

  // Maps scroll progress (0..1) onto the animation timeline (0..1).
  // TODO: on mobile the band is empty at progress 0, since nothing has been
  // drawn yet. Decide what a first-time visitor should see, e.g. start from
  // a floor so the root and first branches are already drawn, only when
  // `stacked.matches`, so desktop keeps its current behaviour.
  function timeline(progress) {
    return progress;
  }

  function update() {
    ticking = false;
    // Finish when the last statement reaches the top of the visible text
    // area: the viewport top, or the bottom of the pinned band on mobile.
    var last = statements[statements.length - 1];
    var inset = stacked.matches && column ? column.offsetHeight : 0;
    var max = last
      ? last.getBoundingClientRect().top + window.scrollY - inset
      : document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    var t = timeline(progress) * total;
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
