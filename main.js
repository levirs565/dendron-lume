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

  const tocModal = {
    container: document.getElementById("toc"),
    backdrop: document.getElementById("tocBackdrop"),
    extra: "xl:overflow-y-visible",
  };
  document.getElementById("tocToggler").addEventListener("click", () => {
    setModalOpen(tocModal, tocModal.container.dataset.open !== "true");
  });

  document.getElementById("tocClose").addEventListener("click", () => {
    setModalOpen(tocModal, false);
  });

  const navModal = {
    container: document.getElementById("navbar"),
    backdrop: document.getElementById("navbarBackdrop"),
    extra: "lg:overflow-y-visible",
  };
  document.getElementById("navToggler").addEventListener("click", () => {
    setModalOpen(navModal, navModal.container.dataset.open !== "true");
  });

  document.getElementById("navClose").addEventListener("click", () => {
    setModalOpen(navModal, false);
  });
});

function setTreeItemExpand(item, expanded) {
  item.setAttribute("aria-expanded", String(expanded));
  for (const child of item.children) child.setAttribute("data-expanded", String(expanded));
}

function setTreeItemSelected(item, selected) {
  item.children[0].setAttribute("data-selected", String(selected));
}

function setModalOpen(modal, state) {
  modal.container.dataset.open = state;
  modal.backdrop.dataset.open = state;
  document.body.classList.toggle("overflow-y-hidden", state);
  document.body.classList.toggle(modal.extra, state);
}
