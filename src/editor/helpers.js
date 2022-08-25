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
 * Generator which traverses an array of nested objects.
 *
 * Objects are iterated through as a flat array. `depth` attribute is added to indicate degree of nesting.
 *
 * @param hierarchy {[{},]} - Array of nested objects
 * @param traverse {string} - Attribute to access nested objects
 * @param depth {number} - Indicates degree of nesting. Used for recursion when iterating nested objects.
 *
 * @returns {Generator<{}>} - Copies of nested objects in `hierarchy` with corresponding `depth`
 */
export function* iterateHierarchy(hierarchy, traverse='features', depth=0) {
  for (const node of hierarchy) {
    yield {...node, depth: depth};

    if (node[traverse]) {
      yield* iterateHierarchy(node[traverse], traverse, depth+1);
    }

  }
}


/**
 * Fetch a nested feature by a string.
 *
 * **Assumes that `value` will be unique.**
 *
 * @param hierarchy {[{}]} - Array of nested objects
 * @param value {string} - value to search for
 * @param attribute {string} - attribute to compare
 * @param traverse {string} - attribute in which other objects are nested
 * @returns {boolean|{id, location, features}}
 */
export function getFeature(hierarchy, value, attribute='id', traverse='features') {
  for (const feature of iterateHierarchy(hierarchy, traverse)) {
    if (feature[attribute] === value) {
      return feature;
    }
  }
  return false;
}


/**
 * Returns a slice of given `hierarchy` based on given index range as a flat array of `FeatureLine` components.
 *
 * Features and their sub-features are notated by `depth` attribute.
 *
 * *Must* be used to process features in `FeatureRowBar`
 *
 * @param hierarchy {[{},]} - Array of features to scrub
 * @param start {number} - Inclusive start index
 * @param end {number} - Inclusive ending index
 *
 * @returns {[{key: string, id: string, location: [number, number], depth: number}]} - Flattened array of features and sub-features
 */
export function flattenHierarchy(hierarchy, start, end) {
  let contained = [];

  const width = Math.abs(end - start);
  for (let feature of iterateHierarchy(hierarchy)) {
    const loc = feature.location
    if (loc[0] <= end && loc[1] >= start) {

      // truncate `start` & `end` indices
      const trunc_start = loc[0] <= start ? 0 : (loc[0] % width);
      const trunc_end = loc[1] >= end ? width : (loc[1] % width);

      contained.push({
        key: feature.id,
        id: feature.id,
        location: [trunc_start, trunc_end],
        depth: feature.depth
      });
    }
  }

  return contained
}