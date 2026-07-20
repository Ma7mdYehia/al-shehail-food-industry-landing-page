// Framework-agnostic controller for the dashboard mobile navigation drawer.
//
// It owns the a11y-critical DOM behavior directly (so it can be driven by a REAL
// browser test, not a React-only mock): inert toggling, focus movement, Escape
// handling, and — crucially — restoring focus to the toggle ONLY AFTER the
// background inert has been removed. The React shell is a thin adapter that
// supplies the element refs and forwards viewport changes.
//
// No React, no server imports; safe to run in any DOM.

export type DrawerElements = {
  drawer: HTMLElement; // the sidebar <aside>
  toggle: HTMLElement; // the hamburger button (outside the drawer)
  closeButton: HTMLElement; // the accessible close button INSIDE the drawer
  background: HTMLElement[]; // regions inert while the drawer is open (header, main)
};

export type DrawerController = {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
  setMobile(isMobile: boolean): void;
  destroy(): void;
};

function setInert(el: HTMLElement, on: boolean): void {
  if (on) {
    el.setAttribute("inert", "");
    el.setAttribute("aria-hidden", "true");
  } else {
    el.removeAttribute("inert");
    el.removeAttribute("aria-hidden");
  }
}

export function createDrawerController(
  els: DrawerElements,
  options: { isMobile: boolean } = { isMobile: false }
): DrawerController {
  let open = false;
  let isMobile = options.isMobile;

  // Apply the current { isMobile, open } state to the DOM. The drawer is inert
  // when mobile AND closed; the background is inert when mobile AND open; the
  // desktop sidebar is NEVER inert.
  function apply(): void {
    setInert(els.drawer, isMobile && !open);
    for (const bg of els.background) setInert(bg, isMobile && open);
    els.toggle.setAttribute("aria-expanded", open ? "true" : "false");
    els.drawer.setAttribute("data-open", open ? "true" : "false");
  }

  function focusInsideDrawer(): void {
    const focusable = els.drawer.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (focusable ?? els.closeButton).focus();
  }

  function doOpen(): void {
    if (!isMobile || open) return; // no drawer state on desktop
    open = true;
    apply();
    focusInsideDrawer();
  }

  function doClose(): void {
    if (!open) return;
    open = false;
    // apply() removes the background inert BEFORE we move focus, so restoring
    // focus to the toggle always succeeds.
    apply();
    els.toggle.focus();
  }

  function doToggle(): void {
    if (open) doClose();
    else doOpen();
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      doClose();
    }
  }

  els.toggle.addEventListener("click", doToggle);
  els.closeButton.addEventListener("click", doClose);
  document.addEventListener("keydown", onKeyDown);
  apply();

  return {
    open: doOpen,
    close: doClose,
    toggle: doToggle,
    isOpen: () => open,
    setMobile(next: boolean) {
      isMobile = next;
      if (!next) open = false; // desktop is always "open" visually, not a drawer
      apply();
    },
    destroy() {
      els.toggle.removeEventListener("click", doToggle);
      els.closeButton.removeEventListener("click", doClose);
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
