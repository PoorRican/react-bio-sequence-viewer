import React, {createContext} from 'react'
import {generateFeatures} from "./feature";

export const MODES = {
  view: 'view',
  select: 'select',
  insert: 'insert',
  move: 'move'
}

export const features = generateFeatures(30);
export const DataContext = createContext({
    mode: '',
    items: {
      mainItems: {},
    },
    linked: [],
    selected: {
      key: null,
      content: null,
    },
    setItems: () => {},
    setLinked: () => {},
    setSelected: () => {},
  }

);

const defaultData = {
  mode: MODES.view,
  items: {
    mainItems: features.slice(0, 15),
  },
  linked: [],
  selected: {
    key: null,
    content: null,
  },
}

export default class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.setMode = (mode) => {
      this.setState({
        mode: mode
      })
    }
    this.setItems = (items) => {
      this.setState({
        items: {
          mainItems: items
        }
      })
    }
    this.setLinked = (linked) => {
      this.setState({
        linked: linked,
      })
    }
    this.setSelected = (selected) => {
      this.setState({
        selected: selected
      })
    }

    this.state = {
      // data
      mode: defaultData.mode,
      items: {
        mainItems: defaultData.items.mainItems,
      },
      linked: defaultData.linked,
      selected: defaultData.selected,

      // setters
      setMode: this.setMode,
      setItems: this.setItems,
      setLinked: this.setLinked,
      setSelected: this.setSelected,
    }
  }
  render() {
    return (
      <DataContext.Provider value={this.state}>
        {this.props.children}
      </DataContext.Provider>
    )
  }
}
