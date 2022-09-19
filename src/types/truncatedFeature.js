/**
 * Minimal class meant to store `RenderFeature` data.
 *
 * This is used when rendering `FeatureLine`.
 */
export class TruncatedFeature extends Object {
  /**
   * Base constructor
   * @param accessor {string}
   * @param id {string}
   * @param location {[number, number]}
   * @param truncated_location {[number, number]}
   * @param depth {number}
   */
  constructor(accessor, id, location, truncated_location, depth) {
    super();

    this.accessor = accessor;
    this.id = id;
    this.location = location;
    this.truncated_location = truncated_location;
    this.depth = depth;
  }

  /**
   * Convertor factory function.
   *
   * @param feature {RenderFeature} - Feature to take values from
   * @param truncated_location {[number, number]} - Truncated location coordinates
   *
   * @returns {TruncatedFeature}
   */
  static from(feature, truncated_location) {
    return new TruncatedFeature(
      feature.accessor,
      feature.id,
      feature.location,
      truncated_location,
      feature.depth,)
  }

}