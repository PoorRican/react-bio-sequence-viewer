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
   *
   * @returns {Sequence} - Mutated copy of `this`
   */
  insert(value, index) {
    let updated = new Sequence(this);
    updated.splice(index, 0, ...value);
    return updated;
  }

  /**
   * Delete given range
   *
   * @param range {[number, number]}
   *
   * @returns {Sequence} - Mutated copy of `this`
   */
  delete(range) {
    let updated = new Sequence(this);
    updated.splice(range[0], range[1] - range[0]);
    return updated;
  }

  /**
   * Swap out given `range` with `insert`.
   *
   * Differs from `replace` in the sense that `replace` works in an element-wise manner.
   *
   * @param value {string[]} - Sequence to insert
   * @param range {[number, number]} - Range to perform modification
   *
   * @returns {Sequence} - Mutated copy of `this`
   */
  swap(value, range) {
    let updated = new Sequence(this);
    updated.splice(range[0], range[1] - range[0], ...value);
    return updated;
  }

  /**
   * Replace given `index` with `value`.
   *
   * Allows for creation of an SNP (Single Nucleotide Polymorphism)
   *
   * @param value {string} - Replacement value
   * @param index {number} - Index to perform replacement
   *
   * @returns {Sequence} - Mutated copy of `this`
   */
  replace(value, index) {
    if (value.length !== 1) Error('incorrect length of value');
    let updated = new Sequence(this);
    updated.splice(index, 1, value);
    return updated;
  }
}


/**
 * Generates a random sequence of nucleotides
 *
 * @param length {number} - Length of generated sequence
 *
 * @returns {string[]}
 */
export function generateSequence(length) {

  /**
   * Generate a random nucleotide
   *
   * @returns {string}
   */
  function nucleotide() {
    // generates an integer between 0 and 3
    const chosen = Math.floor(Math.random() * 4);
    return 'ATCG'[chosen];
  }

  let sequence = Array(length);
  for (let i = 0; i < length; i++) {
    sequence[i] = nucleotide();
  }
  return sequence;
}