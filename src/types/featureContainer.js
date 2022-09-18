import {Feature} from "./feature";

/**
 * Array-like container for storing and interacting with `Feature` objects.
 * Since this will be directly related to React context state, this object and methods are immutable,
 * however, `Feature` object and methods _are_ mutable.
 *
 * Provides an interface to store manipulations in an 'undo tree'.
 */
export class FeatureContainer extends Array {
  /**
   * Factory function
   *
   * @param hierarchy {Feature[]} - Initial tree of `Feature` objects
   *
   * @returns {FeatureContainer}
   */
  from(hierarchy) {
    return new FeatureContainer(...hierarchy);
  }

  get features() {
    return false;
  }

  get accessor() {
    return false;
  }

  // Manipulation Functions

  /**
   * Add copy of `feature` to nesting tree. Automatically encapsulates any constrained features.
   *
   * TODO: prevent overlap of `location` using `validateFeature`
   *
   * @param feature {Feature}
   * @param parent=undefined {string} - parent accessor string
   * @param encapsulate=true {boolean} - Option flag to encapsulate enclosed features.
   * Needed when called from `encapsulate` so `accessor` does not point back to original `parent`
   *
   * @returns {FeatureContainer} - Mutated copy of `this`
   */
  add(feature, parent=undefined, encapsulate=true) {
    const updated = FeatureContainer.from(this);

    // add nested `Feature`
    if (parent) {

      feature.edit({parent: parent})
      updated.retrieve(parent).add(feature);

    }

    // add top-level feature
    else {

      feature.edit({parent: false})
      updated.push(feature)

    }

    return encapsulate ? updated.encapsulate(feature) : updated;
  }

  /**
   * Delete specific `Feature` from tree.
   * This does not delete any `Monomer` objects from `Sequence`
   *
   * @param accessor {string} - Accessor key delimited by `::`
   * @param preserve=false {boolean} - Flag to preserve nested features
   *
   * @returns {FeatureContainer} - mutated copy of `this`
   */
  delete(accessor, preserve=false) {
    const updated = FeatureContainer.from(this);

    const feature = updated.retrieve(accessor);
    const parent  = feature.parent ? updated.retrieve(feature.parent) : updated;

    /**
     * Callback indexes to the `Feature` to be deleted
     * @type {number[]|false}
     */
    let chain = updated.retrieve(accessor, true);
    /**
     * Index in respect to `parent.features`
     * @type {number}
     */
    const index = Number(chain.slice(-1));

    const nested = feature.features;

    if (preserve && nested) {
      /**
       * Modify nested features
       * @type {Feature[]}
       */
      let features = nested.map((feature) => {
        const _feature = new Feature(feature);
        _feature.parent = parent.accessor;
        return _feature;
      });

      (parent.features || updated).splice(index, 1, ...features);
    }
    /**
     * Do not preserve, or no values to preserve
     */
    else {
      (parent.features || updated).splice(index, 1)
    }

    return updated;
  }

  /**
   * Edit specific `Feature`
   *
   * @param accessor {string} - Accessor key delimited by `::`
   * @param kwargs {{}} - Key-value pairs of edits to make
   *
   * @returns {FeatureContainer} - Mutated copy of `this`
   */
  edit(accessor, kwargs) {
    const updated = FeatureContainer.from(this);
    const feature = updated.retrieve(accessor);
    feature.edit(kwargs);

    return updated;
  }

  // Retrieval Functions

  /**
   * Fetch a top-level feature.
   *
   * When `index=false`, `this.filter(() => val.id === id)`
   *
   * @param id {string} - `id` of top-level feature
   * @param index=false {boolean} - Optional flag to return index instead of `Feature`
   *
   * @returns {Feature|any}
   */
  fetch(id, index=false) {
    if (index) {
      for (let i in this) {
        if (this[i].id === id) {
          return Number(i);
        }
      }
    } else {
      for (let i of this) {
        if (i.id === id) {
          return i;
        }
      }
    }
  }

  /**
   * Retrieve feature object or string of indexes.
   *
   * @param accessor {string} - Accessor string delimited by `::`
   * @param index=false {boolean} - Flag to return a string of indexes
   *
   * @returns {Feature|number[]|false}
   *
   * @see Feature.fetch
   */
  retrieve(accessor, index=false) {
    try {
      let chain = accessor.split('::');

      if (index) {
        let indices = [this.fetch(chain.shift(), true)];
        let feature = this[indices[0]];

        while (chain.length) {
          const i = feature.fetch(chain.shift(), true);
          feature = feature.features[i]
          indices.push(i);
        }

        return indices;

      } else {

        let feature = this.fetch(chain.shift())
        while (chain.length) {
          feature = feature.fetch(chain.shift())
        }

        return feature
      }
    }
    catch (err) {
      return false
    }
  }

  // Miscellaneous Functions

  /**
   * Derive a flattened array of all features and sub-features who's `location` fall within range.
   *
   * @param start {number} - Start of range
   * @param end {number} - End of range
   * @param features {Feature[]} - Used for recursion
   *
   * @returns {Feature[]} - A copy of `Feature` objects whose `location` are truncated to intersect with range endpoints
   */
  within(start, end, features=this) {
    let contained = [];

    const width = Math.abs(end - start)
    for (let feature of features) {
      const loc = feature.location;
      if (loc[0] <= end && loc[1] >= start) {

        // truncate start & end
        const trunc_start = loc[0] <= start ? 0 : (loc[0] % width);
        const trunc_end = loc[1] >= end ? width : (loc[1] % width);

        contained.push(
          new Feature({
            accessor: feature.accessor,
            id: feature.id,
            location: [trunc_start, trunc_end],
            global_location: feature.location,
            depth: feature.depth
          })
        );

        if (feature.features) contained.push(...this.within(start, end, feature.features))

      }
    }

    return contained;
  }


  /**
   * Find the deepest feature within a given range.
   *
   * This is used for finding a parent when creating a new feature.
   *
   * @param start {number}
   * @param end {number}
   * @param strict=true {boolean} - Ignore partially intersecting features
   *
   * @returns {string|null} - Accessor key of the deepest feature; `null` if there is no feature in given range.
   */
  deepest(start, end, strict=true) {
    const features = this.within(start, end);
    let accessor = null;

    if (features !== []) {
      let deepest = -1;
      features.forEach((feature) => {
        const loc = feature.global_location || feature.location;
        const [starts_before, ends_after] = [loc[0] <= start, loc[1] >= end];
        /**
         * `Feature` is fully outside or intersects with given range
         * @type {boolean}
         */
        const outside = strict ? starts_before && ends_after : starts_before || ends_after

        if (feature.depth > deepest && outside) {
          deepest = feature.depth;
          accessor = feature.accessor;
        }
      })
    }

    return accessor;
  }

  /**
   * Find overlapping features in `parent.features` container.
   *
   * @example
   * `Parent {
   *  location: [0, 50],
   *  features: [
   *    {id: a, location: [10, 12]},
   *    {id: b, location: [20, 22]},
   *    {id: c, location: [30, 32]}
   * ]`
   */
   constrained(feature) {
    const parent = feature.parent ? this.retrieve(feature.parent) : this;
    // iterate through siblings
    return (parent.features || parent).filter((child) => {
      return (
        child.location[0] >= feature.location[0] &&
        child.location[1] <= feature.location[1] && child.id !== feature.id
      )
    })
  }

  /**
   * Encapsulate any overlapping sibling Features as nested features.
   *
   * Rearrangement occurs after `Feature` is created *and* added to parent `Feature`.
   *
   * @param feature {Feature} - future parent feature
   *
   * @example
   * `Parent {
   *  location: [0, 50],
   *  features: [
   *    {id: a, location: [10, 12]},
   *    {id: b, location: [20, 22]},
   *    {id: c, location: [30, 32]}
   * ]`
   * If a new feature 'Capsule' whose location is [5, 25], is created, features 'Capsule' and 'c' would
   * be nested features of 'Parent'. Features 'a' and 'b' would then become be nested features of 'Capsule'
   *
   * @returns {FeatureContainer} - Mutated copy of `this`
   */
  encapsulate(feature) {
    let updated = this.from(this);
    const constrained = updated.constrained(feature);
    /**
     * Old accessors for deletion
     * @type {string[]}
     */
    const accessors = constrained.map((feature) => {
      return feature.accessor
    });

    /**
     * Make copies of constrained features before adding, so they are not deleted.
     */
    constrained.forEach((child) => {
      const copy = new Feature(child)
      copy.parent = feature.accessor;
      updated = updated.add(copy, feature.accessor, false)
    });

    /**
     * Delete previous children from main tree
     */
    accessors.forEach((accessor) => {
      updated = updated.delete(accessor);
    })

    return updated;
  }

}


/**
 * Generate hardcoded structure of `Feature` objects.
 *
 * This is used during testing purposes.
 *
 * @returns {Feature[]}
 */
export function generateFeatureStructure() {
  return [
    new Feature({
      id: 'testFeature1',
      location: [0, 500],
      features: [
        new Feature({
          id: 'testFeature1_sub1',
          parent: 'testFeature1',
          location: [23, 70],
          features: [
            new Feature({
              id: 'deeply_nested',
              parent: 'testFeature1::testFeature1_sub1',
              location: [50, 55],
            })
          ]
        })
      ]
    }),
    new Feature({
      id: 'endBox',
      location: [900, 1000]
    }),
    new Feature({
      id: 'markedIndex',
      location: [800, 800]
    })
  ]
}