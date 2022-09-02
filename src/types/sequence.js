/**
 * Array-like container for storing and manipulating sequences of monomers.
 * Handles insertion, deletion, replacement, and rearrangement of segments.
 * Provides an interface to store manipulations in an 'undo tree'.
 */
export class Sequence extends Array {
  /**
   * Separate string into array
   *
   * @param sequence {string|String[]}
   * @constructor
   */
  constructor(sequence) {
    super(...sequence);
  }

  /**
   * Insert given string at `index`
   *
   * @param value {string[]}
   * @param index {number}
   */
  insert(value, index) {
    this.splice(index, 0, ...value);
  }

  /**
   * Delete given range
   *
   * @param range {[number, number]}
   */
  delete(range) {
    this.splice(range[0], range[1] - range[0]);
  }

  /**
   * Swap out given `range` with `insert`.
   *
   * Differs from `replace` in the sense that `replace` works in an element-wise manner.
   *
   * @param value {string[]} - Sequence to insert
   * @param range {[number, number]} - Range to perform modification
   */
  swap(value, range) {
    this.splice(range[0], range[1] - range[0], ...value);
  }

  /**
   * Replace given `index` with `value`.
   *
   * Allows for creation of an SNP (Single Nucleotide Polymorphism)
   *
   * @param value {string} - Replacement value
   * @param index {number} - Index to perform replacement
   */
  replace(value, index) {
    if (value.length !== 1) Error('incorrect length of value');
    this.splice(index, 1, value);
  }
}