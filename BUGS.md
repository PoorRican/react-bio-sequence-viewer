# Bugs
- Context menu no longer recognizes `inFeature`
- XArrow does not render in the correct location in `insert` mode. Maybe this can be fixed by using lazy/delayed rendering.
- `.selection` doesn't handle `overflow-y: scroll` correctly
- Remove width on last feature spacer in `#mainItems`
- Moving linked items is buggy:
  - shifting of `linked` is not correct
  - If there are multiple linked lists, all linked features are dragged
  - Drag background (`feature-group`) along with features