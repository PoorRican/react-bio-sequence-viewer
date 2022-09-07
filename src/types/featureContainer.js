import {Feature} from "./feature";

/**
 * Array-like container for storing and interacting with `Feature` objects.
 * Find a specific `Feature` by `id`.
 * Modify index values when corresponding `Sequence` is manipulated.
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

  // Manipulation Functions

  /**
   * Add copy of `feature` to nesting tree
   *
   * TODO: prevent overlap of `location` using `validateFeature`
   *
   * @param feature {Feature}
   * @param parent {string} - parent accessor string
   *
   * @returns {FeatureContainer} - Mutated copy of `this`
   */
  add(feature, parent=undefined) {
    const updated = FeatureContainer.from(this);

    if (parent) {

      const _parent = updated.retrieve(parent);
      const accessor = _parent.accessor + '::' + feature.id;
      const feat = new Feature({...feature, accessor: accessor})
      _parent.features.push(feat);

    } else {

      updated.push(new Feature({...feature, accessor: feature.id}))

    }

    return updated;
  }

  /**
   * Delete specific `Feature` from tree
   *
   * @param accessor {string} - Accessor key delimited by `::`
   *
   * @returns {FeatureContainer} - mutated copy of `this`
   */
  delete(accessor) {
    const updated = FeatureContainer.from(this);

    let chain = this.retrieve(accessor, true);

    if (chain.length > 1) {
      let nested = updated[chain.shift()];
      while (chain.length > 0) {
        nested = nested.features[chain.shift()]
      }

      nested = nested.features;
      nested.splice(chain.shift(), 1);
    } else
      updated.splice(chain.shift(), 1)

    return updated;
  }

  /**
   * Edit a specific
   * @param accessor {string} - Accessor key delimited by `::`
   * @param kwargs {{}} - Key-value pairs of edits to make
   */
  edit(accessor, kwargs) {

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
   * Retrieve a nested feature or string of indexes
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
   * @returns {Feature[]} - A copy of `Feature` objects whose `location` intersects with range
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

}


export function generateFeatures() {
  return [
    new Feature({
      id: 'testFeature1',
      accessor: 'testFeature1',
      location: [0, 500],
      features: [
        new Feature({
          id: 'testFeature1_sub1',
          accessor: 'testFeature1::testFeature1_sub1',
          location: [23, 70]
        })
      ]
    }),
    new Feature({
      id: 'endBox',
      accessor: 'endBox',
      location: [900, 1000]
    }),
    new Feature({
      id: 'markedIndex',
      accessor: 'markedIndex',
      location: [800, 800]
    })
  ]
}