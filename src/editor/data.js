import React, {createContext} from 'react'

import {FeatureContainer, generateFeatureStructure} from '../types/featureContainer'
import {Sequence, generateSequence} from "../types/sequence";

const defaultData = {
  // data
  mode: 'view',
  highlighted: null,
  cursor: null,
  sequence: Sequence.from(generateSequence(1000)),
  hierarchy: FeatureContainer.from(generateFeatureStructure()),

  // setters
  setMode: () => {},
  setSequence: () => {},
  setHighlighted: () => {},
  setCursor: () => {},
}

export const EditorContext = createContext(defaultData);

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