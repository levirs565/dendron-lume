import toc from "https://deno.land/x/lume_markdown_plugins@v0.5.0/toc/mod.ts";

window.addEventListener("DOMContentLoaded", () => {
  const treeItemMap = {};
  for (const item of document.querySelectorAll("[data-tree-item]")) {
    treeItemMap[item.getAttribute("data-item-id")] = item;
    const chevron = item.querySelector("[data-chevron]");
    if (chevron)
      chevron.addEventListener("click", (e) => {
        const expanded = !(item.getAttribute("aria-expanded") === "true" ? true : false);
        setTreeItemExpand(item, expanded);
      });
  }

  if (window.noteId) {
    const element = treeItemMap[window.noteId];
    setTimeout(() => {
      element.scrollIntoView();
    }, 0);
    setTreeItemSelected(element, true);
    let parent = element;
    while (!parent.hasAttribute("data-tree-root")) {
      parent = parent.parentElement;
      if (parent.hasAttribute("data-tree-item")) {
        setTreeItemExpand(parent, true);
      }
    }
  }

  const headerTocMap = new Map();
  const headerVisibilityMap = new Map();

  for (const toc of document.querySelectorAll("[data-toc-item]")) {
    const id = toc.getAttribute("data-toc-id");
    const header = document.getElementById(id);
    headerTocMap.set(header, toc);
    headerVisibilityMap.set(header, false);
  }

  let lastActiveHeader = null;

  function setActiveHeader(header) {
    if (header === lastActiveHeader) return;

    for (const toc of headerTocMap.values()) {
      setTreeItemSelected(toc, false);
    }

    setTreeItemSelected(headerTocMap.get(header), true);
    lastActiveHeader = header;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const atTop =
          entry.rootBounds.bottom - entry.boundingClientRect.bottom > entry.rootBounds.bottom / 2;
        if (!atTop && !entry.isIntersecting) {
          const headers = Array.from(headerTocMap.keys());
          const currentIndex = headers.indexOf(entry.target);
          const prevHeader = headers[currentIndex > 0 ? currentIndex - 1 : 0];
          setActiveHeader(prevHeader);
          break;
        } else if (entry.isIntersecting) {
          setActiveHeader(entry.target);
          break;
        }
      }
    },
    {
      thresold: [0.0, 1.0],
    }
  );
  for (const header of headerTocMap.keys()) observer.observe(header);

  const toc = document.getElementById("toc");
  const tocBackdrop = document.getElementById("tocBackdrop");
  document.getElementById("tocToggler").addEventListener("click", () => {
    const isOpen = toc.dataset.open !== "true";
    toc.dataset.open = isOpen;
    tocBackdrop.dataset.open = isOpen;
  });

  document.getElementById("tocClose").addEventListener("click", () => {
    toc.dataset.open = false;
    tocBackdrop.dataset.open = false;
  });

  const nav = document.getElementById("navbar");
  const navBackdrop = document.getElementById("navbarBackdrop");
  document.getElementById("navToggler").addEventListener("click", () => {
    const isOpen = nav.dataset.open !== "true";
    nav.dataset.open = isOpen;
    navBackdrop.dataset.open = isOpen;
  });

  document.getElementById("navClose").addEventListener("click", () => {
    nav.dataset.open = false;
    navBackdrop.dataset.open = false;
  });
});

function setTreeItemExpand(item, expanded) {
  item.setAttribute("aria-expanded", String(expanded));
  for (const child of item.children) child.setAttribute("data-expanded", String(expanded));
}

function setTreeItemSelected(item, selected) {
  item.children[0].setAttribute("data-selected", String(selected));
}
