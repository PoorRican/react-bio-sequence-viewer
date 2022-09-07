import {Feature} from "../feature";
import {FeatureContainer, generateFeatures} from "../featureContainer";

describe('Manipulation Functions', () => {
  test('add top-level feature', () => {
    let fs = FeatureContainer.from(generateFeatures());
    const feature = new Feature({id: 'new', location: [69, 71]});

    let expected = new FeatureContainer(...fs);
    expected.push(new Feature({...feature, accessor: 'new'}));

    expect(fs.add(feature)).toStrictEqual(expected);
  })

  test('add nested feature', () => {
    let fs = FeatureContainer.from(generateFeatures());
    const feature = new Feature({id: 'blah', location: [69, 71]})

    let expected = new FeatureContainer(...fs);
    expected[2].features = [new Feature({...feature, accessor: 'endBox::new'})];

    expect(fs.add(feature, 'endBox')).toStrictEqual(expected);
  })

  test('delete top-level feature', () => {
    let fs = FeatureContainer.from(generateFeatures());

    let expected = new FeatureContainer(...fs);
    expected.splice(1,1);

    expect(fs.delete('endBox')).toStrictEqual(expected);
  })

  test('delete nested feature', () => {

  })

  test('edit feature', () => {

  })
})