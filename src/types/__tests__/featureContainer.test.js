import {Feature} from "../feature";
import {FeatureContainer, generateFeatureStructure} from "../featureContainer";

describe('Manipulation Functions', () => {
  test('add top-level feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());
    const feature = new Feature({id: 'new', location: [69, 71]});

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected.push(new Feature({...feature, accessor: "new"}));

    expect(fs.add(feature)).toStrictEqual(expected);
  })

  test('add nested feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());
    const feature = new Feature({id: 'new', location: [69, 71]})

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected[1].features = [new Feature({...feature, accessor: 'endBox::new'})];

    expect(fs.add(feature, 'endBox')).toStrictEqual(expected);
  })

  test('delete top-level feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected.splice(1,1);

    expect(fs.delete('endBox')).toStrictEqual(expected);
  })

  test('preserve nested features when deleting top-level feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());

    let expected = FeatureContainer.from(generateFeatureStructure());
    const nested = expected.retrieve('testFeature1').features
    nested[0].parent = false;
    expected.splice(0, 1, ...nested)

    expect(fs.delete('testFeature1', true)).toStrictEqual(expected);
  })

  test('delete nested feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected[0].features.splice(0, 1);

    expect(fs.delete('testFeature1::testFeature1_sub1')).toStrictEqual(expected);
  })

  test('preserve nested features when deleting nested feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());

    let expected = FeatureContainer.from(generateFeatureStructure());
    const nested = expected[0].features[0].features
    // manually update accessors
    expected[0].features[0].features[0].accessor = expected[0].id + '::' + expected[0].features[0].features[0].id
    expected[0].features.splice(0, 1, ...nested)

    expect(fs.delete('testFeature1::testFeature1_sub1', true)).toStrictEqual(expected);
  })

  test('edit feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected[2] = new Feature({...expected[2], location: [888,888]})

    expect(fs.edit('markedIndex', {location: [888, 888]})).toStrictEqual(expected);
  })
})



describe('Miscellaneous Functions', () => {
  test('retrieve index', () => {
    const fs = FeatureContainer.from(generateFeatureStructure());

    const expected = [0, 0];

    expect(fs.retrieve('testFeature1::testFeature1_sub1', true)).toStrictEqual(expected);
  });

  test('Correctly encapsulate overlapping features', () => {
    const feature = new Feature({id: 'future_parent', location: [5, 25], accessor: 'parent::future_parent'});

    /**
     * Feature tree with future parent already added
     */
    const fs = FeatureContainer.from([
      new Feature({
        id: 'parent',
        location: [0, 50],
        features: [
          new Feature({id: 'a', location: [10, 12], parent: 'parent'}),
          new Feature({id: 'b', location: [20, 22], parent: 'parent'}),
          new Feature({id: 'c', location: [30, 32], parent: 'parent'}),

          new Feature({id: 'future_parent', location: [5, 25], parent: 'parent'})
        ]
      })
    ]);

    const expected = FeatureContainer.from([
      new Feature({
        id: 'parent',
        accessor: 'parent',
        location: [0, 50],
        features: [
          new Feature({id: 'c', location: [30, 32], parent: 'c'}),

          new Feature({id: 'future_parent', location: [5, 25], parent: 'parent',
            features: [
              new Feature({id: 'a', location: [10, 12], parent: 'parent::future_parent'}),
              new Feature({id: 'b', location: [20, 22], parent: 'parent::future_parent'}),
            ]
          })
        ]
      })
    ]);

    const result = fs.encapsulate(feature)
    expect(result).toStrictEqual(expected);
  })
})