/**
 * Return if {MouseEvent} occurred on a `FeatureLine`
 * @param e {MouseEvent}
 *
 * @returns {boolean} - `true` if DOM element was rendered from `FeatureLine`
 */
export function isFeatureLine(e) {
  return e.target.classList.contains('feature-line');
}