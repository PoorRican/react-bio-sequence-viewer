import {RenderFeature} from "./renderFeature";
import {TruncatedFeature} from "./truncatedFeature";
import {withinBounds} from "../editor/helpers";


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
   * @param hierarchy {RenderFeature[]} - Initial tree of `Feature` objects
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

  /**
   * Flattened array of nested features that can be passed a check function.
   *
   * When check function is given, only `RenderFeature` objects which pass check are returned.
   * Check functions must only accept a `RenderFeature` as argument and must return a `Boolean`
   *
   * @param check=undefined {function} - Check function. Gets passed `feature` and must return `Boolean`
   * @param force=false {boolean} - Iterate through `features` if `check` was not passed
   * @param nested {FeatureContainer|RenderFeature[]}
   *
   * @returns {Generator<RenderFeature>}
   */
  *iterateNested(check=undefined, force=false, nested=this) {
    for (let i = 0; i < nested.length; i++) {
      const feature = nested[i];
      if (check) {
        const passed = check(feature);
        if (passed) {
          yield feature;

          if ((force || passed) && feature.features)
            yield* this.iterateNested(check, force, feature.features);
        }
      } else {
        yield feature;
        if (feature.features) yield* this.iterateNested(check, force, feature.features);
      }
    }
  }

  /**
   * Get `RenderFeature` by index.
   *
   * Matches index to the deepest feature at location.
   *
   * @param index {number}
   *
   * @returns {RenderFeature|false}} - The deepest feature or `false` if no feature at index
   */
  deepestAt(index) {

    /**
     * Wrapper for `withinBounds` to be passed to `this.iterateNested`
     * @param feature
     * @returns {boolean}
     */
    function checkWithinBounds(feature) {
      return withinBounds(index, feature.location);
    }

    let deepest = {depth: -1};

    const features = this.iterateNested(checkWithinBounds, false);
    for (const feature of features) {
      if (feature.depth > deepest.depth) {
        deepest = feature
      }
    }
    deepest = (deepest.depth === -1) ? false : deepest;
    return deepest;
  }

  // Manipulation Functions

  /**
   * Add copy of `feature` to nesting tree. Automatically encapsulates any constrained features.
   *
   * TODO: prevent overlap of `location` using `validateFeature`
   *
   * @param feature {RenderFeature}
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
       * @type {RenderFeature[]}
       */
      let features = nested.map((feature) => {
        const _feature = new RenderFeature(feature);
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
   * @returns {RenderFeature|any}
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
   * @returns {RenderFeature|number[]|false}
   *
   * @see RenderFeature.fetch
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
   * @param truncate {boolean} - Flag that returns a copy with `truncated_location`
   * @param features {RenderFeature[]} - Used for recursion
   *
   * @returns {RenderFeature[]|TruncatedFeature[]} - `RenderFeature` objects that fall within range.
   * If `truncate`, then `TruncatedFeature` is returned
   */
  within(start, end, truncate=false, features=this) {
    let contained = [];

    const width = Math.abs(end - start)
    for (let feature of features) {
      const loc = feature.location;
      if (loc[0] <= end && loc[1] >= start) {

        if (truncate) {
          // truncate start & end
          const trunc_start = loc[0] <= start ? 0 : (loc[0] % width);
          const trunc_end = loc[1] >= end ? width : (loc[1] % width);

          contained.push(TruncatedFeature.from(feature, [trunc_start, trunc_end]));
        } else {
          contained.push(feature);
        }

        if (feature.features)
          contained.push(...this.within(start, end, truncate, feature.features))

      }
    }

    return contained;
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
   * @param feature {RenderFeature} - future parent feature
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
      const copy = new RenderFeature(child)
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
 * @returns {RenderFeature[]}
 */
export function generateFeatureStructure() {
  return [
    new RenderFeature({
      id: 'testFeature1',
      location: [0, 500],
      features: [
        new RenderFeature({
          id: 'testFeature1_sub1',
          parent: 'testFeature1',
          location: [23, 70],
          features: [
            new RenderFeature({
              id: 'deeply_nested',
              parent: 'testFeature1::testFeature1_sub1',
              location: [50, 55],
            })
          ]
        })
      ]
    }),
    new RenderFeature({
      id: 'endBox',
      location: [900, 1000]
    }),
    new RenderFeature({
      id: 'markedIndex',
      location: [800, 800]
    })
  ]
}