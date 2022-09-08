import {Feature} from "../feature";
import {FeatureContainer, generateFeatureStructure} from "../featureContainer";

describe('Manipulation Functions', () => {
  test('add top-level feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());
    const feature = new Feature({id: 'new', location: [69, 71]});

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected.push(new Feature({...feature, accessor: 'new'}));

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

  test('delete nested feature', () => {
    let fs = FeatureContainer.from(generateFeatureStructure());

    let expected = FeatureContainer.from(generateFeatureStructure());
    expected[0].features.splice(0, 1);

    expect(fs.delete('testFeature1::testFeature1_sub1')).toStrictEqual(expected);
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
  })
})