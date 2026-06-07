const SCROLL_TOP_PADDING_PX = 16;

function getVisibleTop(containerRect: DOMRect, stickyOffset: number): number {
  return containerRect.top + stickyOffset + SCROLL_TOP_PADDING_PX;
}

export function isAlbumCoverTopVisible(
  coverEl: HTMLElement,
  scrollContainer: HTMLElement,
  stickyHeader?: HTMLElement | null,
): boolean {
  const stickyOffset = stickyHeader?.offsetHeight ?? 0;
  const coverRect = coverEl.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const visibleTop = getVisibleTop(containerRect, stickyOffset);

  return coverRect.top >= visibleTop && coverRect.top < containerRect.bottom;
}

export function scrollAlbumCoverIntoView(
  coverEl: HTMLElement,
  scrollContainer: HTMLElement,
  stickyHeader?: HTMLElement | null,
): void {
  if (isAlbumCoverTopVisible(coverEl, scrollContainer, stickyHeader)) {
    return;
  }

  const stickyOffset = stickyHeader?.offsetHeight ?? 0;
  const coverRect = coverEl.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const targetScroll =
    scrollContainer.scrollTop +
    (coverRect.top - containerRect.top) -
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
