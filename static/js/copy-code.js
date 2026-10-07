// Copy-to-clipboard buttons for blog code blocks.
// Mirrors Expressive Code's button (Subject To blog): top-right, revealed
// on hover for mouse users, always visible on touch, "Copied!" tooltip.
// Progressive enhancement: without JavaScript no button is rendered.
(function () {
  "use strict";

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:absolute;left:-9999px;top:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallbackCopy(text); }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function showFeedback(wrap, button) {
    if (wrap.querySelector(".code-copy__feedback")) return;
    var live = wrap.querySelector("[aria-live]");
    var tip = document.createElement("div");
    tip.className = "code-copy__feedback";
    tip.textContent = button.dataset.copied;
    live.appendChild(tip);
    tip.offsetWidth; // start the fade-in from opacity 0
    requestAnimationFrame(function () { tip.classList.add("is-shown"); });
    setTimeout(function () { tip.classList.remove("is-shown"); }, 1500);
    setTimeout(function () { tip.remove(); }, 2000);
  }

  document.querySelectorAll(".post-body pre").forEach(function (pre) {
    var code = pre.querySelector("code") || pre;

    // The pre scrolls horizontally, so the button lives in a wrapper.
    var frame = document.createElement("div");
    frame.className = "code-frame";
    pre.parentNode.insertBefore(frame, pre);
    frame.appendChild(pre);

    var wrap = document.createElement("div");
    wrap.className = "code-copy";
    wrap.innerHTML =
      '<div aria-live="polite"></div>' +
      '<button type="button" title="Copy to clipboard" aria-label="Copy code to clipboard" data-copied="Copied!"><div></div></button>';
    frame.appendChild(wrap);

    var button = wrap.querySelector("button");
    button.addEventListener("click", function () {
      copy(code.innerText.replace(/\n$/, "")).then(function (ok) {
        if (ok) showFeedback(wrap, button);
      });
    });
  });
})();
