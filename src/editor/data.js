import React, {createContext} from 'react'

import {FeatureContainer} from '../types/featureContainer'
import {Feature} from "../types/feature";

const defaultData = {
  // data
  mode: 'view',
  highlighted: null,
  cursor: null,
  sequence: generateSequence(1000),
  hierarchy: new FeatureContainer(generateFeatures()),

  // setters
  setMode: () => {},
  setSequence: () => {},
  setHighlighted: () => {},
  setCursor: () => {},
}

export const EditorContext = createContext(defaultData);

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

export function generateFeatures() {
  return [
    new Feature({
      id: 'testFeature1',
      accessor: 'testFeature1',
      location: [0,500],
      features: [
        new Feature({
          id: 'testFeature1_sub1',
          accessor: 'testFeature1::testFeature1_sub1',
          location: [23, 70]
        })
      ]
    }),
    new Feature({
      id: 'endBox',
      accessor: 'endBox',
      location: [900, 1000]
    }),
    new Feature({
      id: 'markedIndex',
      accessor: 'markedIndex',
      location: [800, 800]
    })
  ]
}

export class EditorProvider extends React.Component {
  constructor(props) {
    super(props);

    // setters
    /**
     * @param mode {string}
     */
    this.setMode = (mode) => {
      this.setState({
        mode: mode
      })
    }
    /**
     * @param sequence {string[]}
     */
    this.setSequence = (sequence) => {
      this.setState({
        sequence: sequence
      })
    }
    /**
     * @param id {string|null}
     */
    this.setHighlighted = (id) => {
      const feature = this.state.hierarchy.retrieve(id);
      if (feature === false) Error(`'id' not found in hierarchy`);
      this.setState({
        highlighted: feature
      })
    }

    /**
     * Points `context.cursor` to `Feature`, index, or range.
     *
     * Used for manipulating `context.sequence` or interacting with `Feature`
     *
     * @param value {string|[]|number|null}
     */
    this.setCursor = (value) => {

      /**
       * Point cursor to object
       */
      if (typeof(value) === 'string') {
        const feature = this.state.hierarchy.retrieve(value);
        if (feature === false) Error(`'id' not found in hierarchy`);
        this.setState({
          cursor: feature
        })

      } else {
        /**
         * Point cursor to index or range
         */
        this.setState({
          cursor: value
        })

      }
    }

    this.state = {
      ...defaultData,
      setMode: this.setMode,
      setSequence: this.setSequence,
      setHighlighted: this.setHighlighted,
      setCursor: this.setCursor,
    }
  }

  render() {
    return (
      <EditorContext.Provider value={this.state}>
        {this.props.children}
      </EditorContext.Provider>
    )
  }
}