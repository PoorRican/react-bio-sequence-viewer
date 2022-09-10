/**
 * Array-like container for storing and manipulating sequences of monomers.
 * Handles insertion, deletion, replacement, and rearrangement of segments.
 * Provides an interface to store manipulations in an 'undo tree'.
 */
export class Sequence extends Array {
  /**
   * Factory that separates string into array.
   *
   * Using a factory-function eliminates errors regarding `Symbol.species` and non-callable iterators.
   *
   * @param sequence {string|string[]}
   *
   * @returns {Sequence}
   */
  static from(sequence) {
    return new Sequence(...sequence);
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
    let updated = Sequence.from(this);
    updated.splice(index, 0, ...value);
    return updated;
  }

  /**
   * Delete given range
   *
   * @param range {[number, number]} - *Inclusive* start index; *exclusive* end index
   *
   * @returns {Sequence} - Mutated copy of `this`
   */
  delete(range) {
    let updated = Sequence.from(this);
    updated.splice(range[0], (range[1] - range[0]));
    return updated;
  }

  /**
   * Swap out segment.
   *
   * Differs from `replace` in the sense that `replace` works in an element-wise manner.
   *
   * @param value {string[]|string} - Sequence to insert
   * @param range {[number, number]} - *Inclusive* start index; *exclusive* end index
   *
   * @returns {Sequence} - Mutated copy of `this`
   */
  swap(value, range) {
    let updated = Sequence.from(this);
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
   *
   * @deprecated This is a pointless feature.
   */
  replace(value, index) {
    if (value.length !== 1) Error('incorrect length of value');
    let updated = new Sequence(...this);
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