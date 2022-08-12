export function isFeature(target) {
  if (target) {
    if (target.classList && target.classList.contains('feature')) {
      return true;
    } else {
      return isFeature(target.parentNode)
    }
  }
}

export function isSelected(selected, index, container='') {
  const key = selected.key;

  if (key === null || key === undefined) {
    return false
  }

  if (container && !(container === selected.container)) {
    return false;
  }

  else if (typeof(key) === "number") {
    return key === index
  }

  else if (index >= key[0] && index <= key[1]) {
    return true;
  }

  return false;
}

export function isLinked(linked, index) {
  if (index === null) {
    return false;
  } else if (typeof(index) === 'number') {
    for (let i = 0; i < linked.length; i++) {
      const obj = linked[i]
      if (index >= obj[0] && index <= obj[1] ) {
        return i+1;
      }
    }
    return false;
  } else {
    const linked = index.map((val) => {return isLinked(val)})
    return linked.reduce((a, b) => {return a && b && true})
  }
}

export function getContainer(target) {
  const id = target.id
  if (id === `mainItems` || id === `availableItems`) {
    return id;
  } else {
    return getContainer(target.parentNode);
  }
}

export function getItemId(target) {
  if (target.id === '') {
    return getItemId(target.parentNode);
  }
  return target.id;
}

export function linkedAnchors(items, linked) {
  let starts = Array(items.length).fill(false);
  let ends = Array(items.length).fill(false);
  for (let i = 0; i < linked.length; i++) {
    const pos = linked[i];
    starts[pos[0]] = true;
    ends[pos[1]] = true;
  }
  return [starts, ends]
}
