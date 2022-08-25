import React, {createContext} from 'react'

import {getFeature} from "./helpers";
import {Feature} from "../types/feature";

const defaultData = {
  // data
  mode: 'view',
  highlighted: null,
  sequence: generateSequence(1000),
  hierarchy: generateFeatures(),

  // setters
  setMode: () => {},
  setSequence: () => {},
  setHighlighted: () => {},
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
    const chosen = Math.floor(Math.random() * 4);
    return 'ATCG'[chosen];
  }
  let sequence = Array(length);
  for (let i = 0; i < length; i++) {
    sequence[i] = nucleotide();
  }
  return sequence;
}

export function generateFeatures() {
  return [
    new Feature({
      id: 'testFeature1',
      location: [0,500],
      features: [
        new Feature({
          id: 'testFeature1_sub1',
          location: [23, 70]
        })
      ]
    }),
    new Feature({
      id: 'endBox',
      location: [900, 1000]
    }),
    new Feature({
      id: 'markedIndex',
      location: [800, 800]
    })
  ]
}

export class SequenceProvider extends React.Component {
  constructor(props) {
    super(props);

    // setters
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
    this.setHighlighted = (id) => {
      const feature = getFeature(this.state.hierarchy, id);
      if (feature === false) Error(`'id' not found in hierarchy`);
      this.setState({
        highlighted: feature
      })
    }

    this.state = {
      mode: defaultData.mode,
      sequence: defaultData.sequence,
      hierarchy: defaultData.hierarchy,
      setMode: this.setMode,
      setSequence: this.setSequence,
      setHighlighted: this.setHighlighted,
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