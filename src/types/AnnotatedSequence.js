/**
 * Mediator class that represents and handles the relationships between `Sequence` and `FeatureContainer`
 *
 * @see https://en.wikipedia.org/wiki/Mediator_pattern
 * @see FeatureContainer
 * @see Sequence
 */
import {Sequence} from "./sequence";

export class AnnotatedSequence extends Object {
  constructor(sequence, hierarchy, setSequence, setHierarchy) {
    super();
    this.sequence = sequence;
    this.hierarchy = hierarchy;
    this.setSequence = setSequence;
    this.setHierarchy = setHierarchy;
  }

  /**
   * Shift features and propagate changes down
   * @param magnitude {number}
   * @param index {number}
   * @param update=true {boolean} - Option flag to update hierarchy
   * @param source=false {FeatureContainer|false} - Flag to use working copy of `FeatureContainer`. Usually paired with `update=false`
   */
  shift = (magnitude, index, update=true, source=false) => {
    const updated = source || this.hierarchy.from(this.hierarchy);

    const constrained = updated.filter((feature) => feature.location[0] >= index);
    constrained.forEach((feature) => {
      feature.shift(magnitude);
    });

    if (update) {
      this.setHierarchy(updated);
    }
  }

  /**
   * Contract at the given index and propagate changes up through parents.
   *
   * @param magnitude {number} - Length and direction of change
   * @param index {number} - Manipulation loci
   */
  resize = (magnitude, index) => {
    const updated   = this.hierarchy.from(this.hierarchy);

    let feature  = this.hierarchy.deepestAt(index);
    if (feature === false) return;

    /**
     * Parent features through which to propagate changes.
     *
     * Due to current structure restrictions, index must pass through contiguous chain of features
     * @type {RenderFeature[]}
     */
    const intersecting = [];
    while (feature && feature.depth >= 0) {
      intersecting.push(feature);
      feature = feature.parent ? this.hierarchy.retrieve(feature.parent) : false;
    }

    /**
     * Pass up changes
     */
    intersecting.forEach((_feature) => {
      _feature.resize(magnitude);
    });

    this.shift(magnitude, index, false, updated);

    this.setHierarchy(updated);
  }

  /**
   * TODO: get rid of this and call `resize` in `SegmentMenu`
   * Deletes specified count at specified index.
   * @param magnitude {number} - Count to delete
   * @param index {number} - Loci to perform deletion
   */
  delete = (magnitude, index) => {
    const updated   = Sequence.from(this.sequence);
    const feature  = this.hierarchy.deepestAt(index)

    const loc = feature.location;
    updated.delete([loc[0], loc[0] - magnitude]);
    this.setSequence(updated);

    this.resize(-magnitude, index);
  }
}