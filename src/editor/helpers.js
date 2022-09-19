/**
 * Shorthand to see if a given index is within given boundaries. Inclusive of endpoints.
 *
 * Used to check if a given index occurs within a `Feature`.
 *
 * @param index {number} - Index to check
 * @param bounds {[number, number]} - Boundaries
 *
 * @returns {boolean} - true if index is within or at boundary.
 */
export function withinBounds(index, bounds) {
  if (bounds === null || bounds === undefined) return false;
  return bounds[0] <= index && index <= bounds[1]
}


/**
 * Converts nesting depth to a CSS style name.
 *
 * Colors cycle as `depth` exceeds 4.
 *
 * @param depth {number} - 0, or any positive integer. No limit.
 *
 * @returns {string} - CSS style name
 */
export function colorize(depth) {
  const colors = ['red', 'purple', 'cyan', 'green'];

  return colors[depth % colors.length];
}

/**
 * Determine if input has been called with Primary Mouse button
 *
 * @param event {MouseEvent}
 *
 * @returns {boolean}
 */
export function isPrimaryButton(event) {
  return event.buttons === 1
}