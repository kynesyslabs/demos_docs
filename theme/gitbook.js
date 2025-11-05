(function () {
  const storagePrefix = "mdbook:gitbook-nav:";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function enhanceChapterItem(li) {
    if (!li || li.dataset.gitbookEnhanced === "true") {
      return;
    }

    li.dataset.gitbookEnhanced = "true";
    li.classList.add("gitbook-chapter");

    const anchor = li.querySelector(":scope > a");
    if (!anchor) {
      return;
    }

    let chapterLine = li.querySelector(":scope > .chapter-line");
    if (!chapterLine) {
      chapterLine = document.createElement("div");
      chapterLine.className = "chapter-line";
      li.insertBefore(chapterLine, anchor);
    }

    // Move the anchor into the line wrapper so we can keep layout predictable
    if (anchor.parentElement !== chapterLine) {
      chapterLine.appendChild(anchor);
    }

    const sublist = li.querySelector(":scope > ul");

    if (sublist) {
      li.classList.add("has-children");
      chapterLine.classList.add("with-toggle");

      let toggle = chapterLine.querySelector(":scope > .chapter-toggle");
      if (!toggle) {
        toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "chapter-toggle";
        toggle.setAttribute("aria-label", "Toggle section");
        chapterLine.insertBefore(toggle, anchor);
      }

      const storageKey =
        storagePrefix + (anchor.getAttribute("href") || li.textContent.trim());

      const hasActiveChild =
        anchor.classList.contains("active") ||
        !!sublist.querySelector("a.active");

      let collapsed = true;
      const stored = localStorage.getItem(storageKey);
      if (stored === null) {
        collapsed = !hasActiveChild;
      } else {
        collapsed = stored === "true";
      }

      li.classList.toggle("collapsed", collapsed);
      toggle.setAttribute("aria-expanded", (!collapsed).toString());

      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isCollapsed = li.classList.toggle("collapsed");
        toggle.setAttribute("aria-expanded", (!isCollapsed).toString());
        localStorage.setItem(storageKey, isCollapsed ? "true" : "false");
      });

      anchor.addEventListener("click", function () {
        localStorage.setItem(storageKey, "false");
      });

      sublist.querySelectorAll("a").forEach(function (child) {
        child.addEventListener("click", function () {
          localStorage.setItem(storageKey, "false");
        });
      });
    } else {
      chapterLine.classList.add("no-toggle");
    }
  }

  function enhanceSidebar() {
    const sidebar = document.querySelector("#sidebar");
    if (!sidebar) {
      return;
    }

    const chapters = sidebar.querySelectorAll("ul.chapter li");
    chapters.forEach(enhanceChapterItem);
  }

  onReady(enhanceSidebar);
})();
