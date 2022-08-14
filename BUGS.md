# Bugs
- `.selection` doesn't handle `overflow-y: scroll` correctly
- Remove width on last feature spacer in `#mainItems`
- Prevent `link` option showing on context menu when only one feature is selected
- Moving linked items is buggy:
  - shifting of `linked` is not correct
  - If there are multiple linked lists, all linked features are dragged
  - Drag background (`feature-group`) along with features