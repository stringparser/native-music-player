const SCROLL_TOP_PADDING_PX = 16;

function getVisibleTop(containerRect: DOMRect, stickyOffset: number): number {
  return containerRect.top + stickyOffset + SCROLL_TOP_PADDING_PX;
}

export function isElementTopVisible(
  element: HTMLElement,
  scrollContainer: HTMLElement,
  stickyHeader?: HTMLElement | null,
): boolean {
  const stickyOffset = stickyHeader?.offsetHeight ?? 0;
  const elementRect = element.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const visibleTop = getVisibleTop(containerRect, stickyOffset);

  return elementRect.top >= visibleTop && elementRect.top < containerRect.bottom;
}

export function scrollElementTopIntoView(
  element: HTMLElement,
  scrollContainer: HTMLElement,
  stickyHeader?: HTMLElement | null,
): void {
  if (isElementTopVisible(element, scrollContainer, stickyHeader)) {
    return;
  }

  const stickyOffset = stickyHeader?.offsetHeight ?? 0;
  const elementRect = element.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const targetScroll =
    scrollContainer.scrollTop +
    (elementRect.top - containerRect.top) -
    stickyOffset -
    SCROLL_TOP_PADDING_PX;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  scrollContainer.scrollTo({
    top: Math.max(0, targetScroll),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

export function scrollAlbumCoverIntoView(
  coverEl: HTMLElement,
  scrollContainer: HTMLElement,
  stickyHeader?: HTMLElement | null,
): void {
  scrollElementTopIntoView(coverEl, scrollContainer, stickyHeader);
}

export function getLibraryScrollContext(fromEl: HTMLElement): {
  scrollContainer: HTMLElement | null;
  stickyHeader: HTMLElement | null;
} {
  const scrollContainer = fromEl.closest(
    "[data-scroll-container]",
  ) as HTMLElement | null;
  const stickyHeader = scrollContainer?.querySelector(
    "[data-media-tab-toolbar]",
  ) as HTMLElement | null;

  return { scrollContainer, stickyHeader };
}
