import {Feature} from "./feature";

/**
 * Array-like container for storing and interacting with `Feature` objects.
 * Find a specific `Feature` by `id`.
 * Modify index values when corresponding `Sequence` is manipulated.
 * Provides an interface to store manipulations in an 'undo tree'.
 */
export class FeatureContainer extends Array {
  /**
   * @param hierarchy {Feature[]} - Initial tree of `Feature` objects
   */
  constructor(hierarchy) {
    super(...hierarchy);
  }

  /**
   * Add copy of `feature` to nesting tree
   *
   * TODO: prevent overlap of `location` using `validateFeature`
   *
   * @param feature {Feature}
   * @param parent {string} - parent accessor string
   */
  add(feature, parent=undefined) {
    if (parent) {
      const _parent = this.retrieve(parent);
      const accessor = _parent.accessor + '::' + feature.id;
      const updated = new Feature({...feature, accessor: accessor})
      _parent.features.push(updated);
    } else {
      this.push(new Feature({...feature, accessor: feature.id}))
    }
  }

  /**
   * Fetch a top-level feature using id.
   *
   * This is similar to `Array.filter((val) => val === id)`
   *
   * @param id {string}
   *
   * @returns {Feature|any}
   */
  fetch(id) {
    for (let i of this) {
      if (i.id === id) {
        return i;
      }
    }
  }


  /**
   * Retrieve a nested feature by a string
   *
   * @param accessor {string}
   *
   * @returns {Feature|false}
   */
  retrieve(accessor) {
    try {
      let chain = accessor.split('::');

      let feature = this.fetch(chain.shift())
      while (chain.length) {
        feature = feature.fetch(chain.shift())
      }

      return feature
    }
    catch (err) {
      return false
    }
  }

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