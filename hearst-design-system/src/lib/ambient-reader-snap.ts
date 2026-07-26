export const ambientReaderCenterSurfaceIndex = 1;

export function getSettledAmbientSurfaceIndex(
  scrollLeft: number,
  itemWidth: number,
) {
  return Math.max(
    0,
    Math.min(2, Math.round(scrollLeft / Math.max(itemWidth, 1))),
  );
}

export function shouldInsertAmbientInterstitial({
  alreadyOpened,
  articleVisitCount,
}: {
  alreadyOpened: boolean;
  articleVisitCount: number;
}) {
  return !alreadyOpened && (articleVisitCount + 1) % 3 === 0;
}
