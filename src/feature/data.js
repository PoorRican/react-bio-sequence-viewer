import React, {createContext} from 'react'
import {generateFeatures} from "./feature";

export const features = generateFeatures(30);
export const DataContext = createContext({
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
  items: {
    mainItems: features.slice(0, 15),
  },
  linked: [],
  selected: {
    key: null,
    content: null,
  },
}

export class Provider extends React.Component {
  constructor(props) {
    super(props);

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
      items: {
        mainItems: defaultData.items.mainItems,
      },
      linked: defaultData.linked,
      selected: defaultData.selected,

      // setters
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
