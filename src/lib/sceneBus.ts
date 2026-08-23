/**
 * State the pipeline graph reads every frame. Sections write to it through
 * ScrollTrigger so the background is a consequence of the content rather
 * than decoration running beside it. Scroll position and velocity are
 * measured by the graph itself.
 */
export const sceneBus = {
  /** Active chapter index — the cluster that lights up. */
  chapter: 0,
  /** Total chapters, so the graph knows how many clusters to lay out. */
  chapterCount: 7,
  /** One-shot surge sent down the edges on chapter change. */
  pulse: 0,
}

export function setChapter(index: number, count: number) {
  if (sceneBus.chapter !== index) firePulse(1)
  sceneBus.chapter = index
  sceneBus.chapterCount = Math.max(1, count)
}

export function firePulse(amount = 1) {
  sceneBus.pulse = Math.max(sceneBus.pulse, amount)
}

export function decayPulse(dt: number) {
  sceneBus.pulse = Math.max(0, sceneBus.pulse - dt * 1.35)
}
