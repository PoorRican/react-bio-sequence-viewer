import {Sequence} from '../sequence'

const content = 'ABCDEFG'

describe('Factory Function', () => {

  test('accepts array of strings', () => {
    const seq = Sequence.from(['A', 'T', 'C', 'G'])
    expect(seq.length).toBe(4)
  })

  test('accepts string', () => {
    const seq = Sequence.from('ATCG')
    expect(seq.length).toBe(4)
  })

})

describe('Manipulation functions', () => {

  test('insert segment', () => {
    let seq = Sequence.from(content)
    const updated = seq.insert('XYZ', 2);
    expect(updated).toEqual(Sequence.from('ABXYZCDEFG'))
  });

  test('delete range', () => {
    let seq = Sequence.from(content);
    const updated = seq.delete([2,4]);
    expect(updated).toEqual(Sequence.from('ABFG'));
  });

  test('create SNP at index', () => {
    let seq = Sequence.from(content);
    const updated = seq.createSNP('X', 2);
    expect(updated).toEqual(Sequence.from('ABXDEFG'));
  });

  test('swap segment', () => {
    let seq = Sequence.from(content);
    const updated = seq.replaceSegment('XYZ', [2,4]);
    expect(updated).toEqual(Sequence.from('ABXYZEFG'));
  });

})
