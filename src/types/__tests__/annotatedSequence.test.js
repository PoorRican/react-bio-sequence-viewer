import {AnnotatedSequence} from "../AnnotatedSequence";
import {Sequence} from "../sequence";
import {FeatureContainer} from "../featureContainer";
import {generateSequence} from "../sequence";
import {generateFeatureStructure} from "../featureContainer";


/**
 * Simulate context
 * @returns {{sequence: Sequence, hierarchy: FeatureContainer}}
 */
function makeContainer() {
  return {
    sequence: Sequence.from(generateSequence(1000)),
    hierarchy: FeatureContainer.from(generateFeatureStructure()),
  }
}

function makeMediator(container) {
  return new AnnotatedSequence(
    container.sequence,
    container.hierarchy,
    (value) => container['sequence'] = value,
    (value) => container['hierarchy'] = value,
  )
}


describe('Sequence Manipulation', () => {
  test('features shifted upon insertion', () => {
    const container = makeContainer();

    // shift 2nd and 3rd features by 5 bp
    const expected = FeatureContainer.from(generateFeatureStructure());
    [1,2].forEach((index) => {
      const feature = expected[index];
      feature.location = [feature.location[0]+5, feature.location[1]+5]
    })

    const mediator = makeMediator(container);
  mediator.shift(5, 501)

    expect(container.hierarchy).toStrictEqual(expected);
  });
  test('features shifted upon deletion', () => {
    const container = makeContainer();

    // shift 2nd and 3rd features by 5 bp
    const expected = FeatureContainer.from(generateFeatureStructure());
    [1,2].forEach((index) => {
      const feature = expected[index];
      feature.location = [feature.location[0]-5, feature.location[1]-5]
    })

    const mediator = makeMediator(container);
    mediator.shift(-5, 501)
    expect(container.hierarchy).toStrictEqual(expected);
  });

  test('features shortened upon deletion', () => {
    const container = makeContainer();

    const expected = FeatureContainer.from(generateFeatureStructure());
    // contract first feature by 5
    expected[0].location[1] = expected[0].location[1] - 5;

    // shift 2nd and 3rd features by 5 bp
    [1,2].forEach((index) => {
      const feature = expected[index];
      feature.location = [feature.location[0]-5, feature.location[1]-5]
    })

    const mediator = makeMediator(container);
    mediator.resize(-5, 400)
    expect(container.hierarchy).toStrictEqual(expected);
  });
  test('features expanded upon insertion', () => {
    const container = makeContainer();

    const expected = FeatureContainer.from(generateFeatureStructure());
    // contract first feature by 5
    expected[0].location[1] = expected[0].location[1] + 5;

    // shift 2nd and 3rd features by 5 bp
    [1,2].forEach((index) => {
      const feature = expected[index];
      feature.location = [feature.location[0]+5, feature.location[1]+5]
    })

    const mediator = makeMediator(container);
    mediator.resize(5, 400)
    expect(container.hierarchy).toStrictEqual(expected);
  });

  test('sequence deleted', () => {
    const container = makeContainer();

    const expected = makeContainer();
    expected.sequence = Sequence.from(container.sequence);

    /**
     * Set up expectations for `container.hierarchy`
     */
    // contract first feature by 5
    expected.hierarchy[0].location[1] = expected.hierarchy[0].location[1] - 5;

    // shift 2nd and 3rd features by 5 bp
    [1,2].forEach((index) => {
      const feature = expected.hierarchy[index];
      feature.location = [feature.location[0]-5, feature.location[1]-5]
    })

    /**
     * Set up expectations for `container.sequence`
     */
    expected.sequence.delete(5, 400);

    const mediator = makeMediator(container);
    mediator.delete(5, 400)

    expect(container).toStrictEqual(expected);
  })

  test('sequence inserted', () => {
    const container = makeContainer();

    const expected = makeContainer();
    expected.sequence = Sequence.from(container.sequence);

    /**
     * Set up expectations for `container.hierarchy`
     */
    // contract first feature by 5
    expected.hierarchy[0].location[1] = expected.hierarchy[0].location[1] + 5;

    // shift 2nd and 3rd features by 5 bp
    [1,2].forEach((index) => {
      const feature = expected.hierarchy[index];
      feature.location = [feature.location[0]+5, feature.location[1]+5]
    })

    /**
     * Set up expectations for `container.sequence`
     */
    expected.sequence.insert('AAAA', 400);

    const mediator = makeMediator(container);
    mediator.insert('AAAAA', 400)

    expect(container).toStrictEqual(expected);
  })

});

describe('Feature Manipulation', () => {
  test.skip('sequence deleted during deletion', () => {});
});