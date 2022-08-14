export function isFeature(target) {
  if (target) {
    if (target.classList && target.classList.contains('feature')) {
      return true;
    } else {
      return isFeature(target.parentNode)
    }
  }
}

/**
 * Checks if target of `MouseEvent` is a valid target for draggable events.
 * This is done by checking class attributes.
 *
 * @param target {object} - DOM target from `MouseEvent`
 *
 * @returns {boolean} - `true` if `target` is valid drop target.
 */
export function isTarget(target) {
  return target.classList.contains("drop-target") && !(target.classList.contains("react-draggable-dragging"))
}

export function isSelected(list, index, container='') {
  const key = list.key;

  if (key === null || key === undefined) {
    return false
  }

  if (container && !(container === list.container)) {
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

export function isLinked(list, index) {
  if (index === null || list === []) {
    return false;
  } else if (typeof(index) === 'number') {
    for (let i = 0; i < list.length; i++) {
      const obj = list[i]
      if (index >= obj[0] && index <= obj[1] ) {
        return i+1;
      }
    }
    return false;
  } else {
    const _linked = index.map(val => {return isLinked(list, val)})
    return _linked.reduce((a, b) => {return a && b && true})
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

export function getItem(target) {
  return [Number(getItemId(target)), getContainer(target)]
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

/**
 * Shifts linked coordinates to account for linked list manipulation.
 * This function is called when inserting, deleting, or moving elements.
 *
 * If `lower` is provided, all elements between `index` and `lower` and shifted.
 * Otherwise, all elements higher than `index` are shifted.
 *
 * @param linked {[]} - List of linked objects
 * @param index {number} - Upper bound of list shift
 * @param magnitude {number} - Magnitude of shift
 * @param lower {number} {optional} - Lower bound of list shift
 *
 * @returns {[]} - Manipulated copy of `linked`
 */
export function shiftLinked(linked, index, magnitude, lower=-1) {
  if (lower) {

    for (let i = 0; i < linked.length; i++) {
      if (linked[i][0] >= index) {
        linked[i][0] += magnitude;
        linked[i][1] += magnitude;
      }
    }

  } else {

    for (let i = 0; i < linked.length; i++) {
      if (linked[i][0] <= index && linked[i][0] >= lower) {
        linked[i][0] += magnitude;
        linked[i][1] += magnitude;
      }
    }

  }

  return linked
}
