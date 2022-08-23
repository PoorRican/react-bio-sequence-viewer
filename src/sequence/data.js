import React, {createContext} from 'react'

const defaultData = {
  mode: 'view',
  sequence: generateSequence(1000),
  hierarchy: [                    // `Feature` should be plugged in seamlessly
    {
      id: 'testFeature1',
      location: [0,500],
      features: [
        {
          id: 'testFeature1_sub1',
          location: [23, 70]
        }
      ]
    },
    {
      id: `endBox`,
      location: [900, 1000],
    },
    {
      id: `markedIndex`,
      location: [800, 800],
    }
  ],
  setMode: () => {},
  setSequence: () => {},
}

export const SequenceContext = createContext(defaultData);

/**
 * Generates a random sequence of nucleotides
 *
 * @param length {number} - Length of generated sequence
 */
export function generateSequence(length) {
  function nucleotide() {
    // generates an integer between 0 and 3
    const chosen = Math.floor(Math.random() * 3);
    return 'ATCG'[chosen];
  }
  let sequence = Array(length);
  for (let i = 0; i < length; i++) {
    sequence[i] = nucleotide();
  }
  return sequence;
}

export class SequenceProvider extends React.Component {
  constructor(props) {
    super(props);

    this.setMode = (mode) => {
      this.setState({
        mode: mode
      })
    }
    this.setSequence = (sequence) => {
      this.setState({
        sequence: sequence
      })
    }

    this.state = {
      mode: defaultData.mode,
      sequence: defaultData.sequence,
      hierarchy: defaultData.hierarchy,
      setMode: this.setMode,
      setSequence: this.setSequence,
    }
  }

  render() {
    return (
      <SequenceContext.Provider value={this.state}>
        {this.props.children}
      </SequenceContext.Provider>
    )
  }
}