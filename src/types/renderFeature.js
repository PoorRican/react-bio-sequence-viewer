import {Feature} from "./feature";


/**
 * `Feature` wrapper that encodes and stores non-standard attributes
 *
 * Is stored and interacted with via `FeatureContainer`, therefore the object and it's methods are mutable.
 * @see FeatureContainer
 */
export class RenderFeature extends Feature {
  constructor(data) {
    super(data)
    /**
     * Nested features are `Feature` instances whose `location` occurs within `this.location`.
     * Nesting is computed server-side to improve client performance.
     *
     * @type {RenderFeature[]}
     */
    this.features = data.features ? data.features : [];
    this.global_location = data.global_location;
    /**
     * Key used to access while in `FeatureContainer`.
     * Accessor to parent `Feature`
     *
     * @type {string|false}
     */
    this.parent = data.parent;
    /**
     * Key used to access while in `FeatureContainer`.
     *
     * @type {string}
     *
     * @see FeatureContainer.retrieve
     */
    this.accessor = data.accessor
  }

  get length() {
    const loc = this.location;
    return loc[1] - loc[0];
  }

  set length(value) {
    const loc = this.location;
    loc[1] = loc[0] + Number(value);
  }

  get accessor() {
    return ((this.parent && this.parent.length) ? this.parent + '::' : '') + this.id;
  }

  /**
   * When accessor is set, update `parent`.
   *
   * This calls `parent` setter
   *
   * @param value {string}
   */
  set accessor(value) {
    if (typeof value === 'string') {
      const index = value.lastIndexOf('::');
      if (index > 0) {
        this.parent = value.slice(0, index);
        this.id = value.slice(index+2);
      }
      else {
        this.parent = false;
        this.id = value;
      }
    }
  }

  get 0() {
    return this.location[1]
  }

  get 1() {
    return this.location[1]
  }

  get parent() {
    return this._parent;
  }

  /**
   * Propagate update downstream to nested features
   *
   * @param value {string|false} - Updated parent
   */
  set parent(value) {
    if (value)
      this._parent = value;
    else
      this._parent = false;

    if (this.features && this.features.length) {
      this.#propagateParentUpdate();
    }
  }

  get depth() {
    return (this.accessor.match(/::/g) || []).length
  }

  /**
   * Propagate changes made to `accessor` onto nested features.
   *
   * @see RenderFeature.parent
   * @see RenderFeature.accessor
   */
  #propagateParentUpdate() {
    this.features.forEach((feature) => {
      feature.parent = this.accessor;
    })
  }

  /**
   * Shift `location` by a specified magnitude.
   * @param magnitude {number} - positive shifts right; negative shifts left
   */
  shift(magnitude) {
    this.location[0] = this.location[0] + magnitude;
    this.location[1] = this.location[1] + magnitude;

    if (this.features) this.features.forEach((feature) => feature.shift(magnitude))
  }

  /**
   * Mutates `location` by setting `length`
   *
   * @param magnitude {number} - positive shifts right; negative shifts left
   *
   * @see Feature.length
   */
  resize(magnitude) {
    this.length = this.length + magnitude;
  }

  /**
   * Update keys with given values.
   * Also updates `accessor` when `id` is updated.
   *
   * @param kwargs {{}}
   */
  edit(kwargs) {
    for (let [key, val] of Object.entries(kwargs)) {
      this[key] = val;
    }

    // update accessor and nested features
    if (kwargs.id) {
      this.#propagateParentUpdate();

    }
  }

  add(feature) {
    if (this.features) {
      this.features.push(feature)
    } else
      this.features = [feature]
  }

  /**
   * Fetch stored feature or index.
   *
   * When `index=false`, `this.filter(() => val.id === id)`
   *
   * @param id {string} - Accessor key delimited by `::`
   * @param index=false {boolean} - Optional flag to return index instead of `Feature`
   *
   * @returns {RenderFeature|number}
   */
  fetch(id, index=false) {
    if (index) {
      for (let i in this.features) {
        if (this.features[i].id === id) {
          return Number(i);
        }
      }
    } else {
      for (let i of this.features) {
        if (i.id === id) {
          return i;
        }
      }
    }
  }

}


/**
 * Generate a list of numbered, identical features.
 *
 * @param count {number} - Number of features to create
 *
 * @returns {RenderFeature[]}
 */
export function generateMultipleFeatures(count=15) {
  let features = [];

  for (let i = 0; i < count; i++) {
    let f = {
      id: i.toString(),
      data: null, // simulate data element
      partial: true,
      except: false,
      comment: "this is a comment. There are some words here, but they might not mean anything. Really they're just here to take space...... words...",
      product: 'This is a product. It should really be a link instead of just text...',
      location: i.toString(),
      title: 'Feature #' + i.toString(),
    }
    f = new RenderFeature(f);
    features.push(f)
  }

  return features;
}