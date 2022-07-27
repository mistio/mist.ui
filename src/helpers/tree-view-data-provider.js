/* eslint-disable no-param-reassign, consistent-return */
export default function treeViewDataProvider(opts, callback) {
  let items = [];
  const mistList = this.shadowRoot.querySelector('mist-list');
  if (!mistList) return [];
  const { grid } = mistList.$;
  if (!grid) return [];
  items = Object.values(mistList.itemMap || {});
  if (
    mistList.filteredItems &&
    mistList.combinedFilter &&
    mistList.combinedFilter.trim().length > 0
  ) {
    const filterMap = {};
    mistList.filteredItems.forEach(item => {
      filterMap[item.id] = item;
    });
    // add parents
    Object.values(filterMap).forEach(item => {
      if (item.parent) filterMap[item.parent] = mistList.itemMap[item.parent];
    });
    items = Object.values(filterMap);
  }

  if (grid._filters && grid._checkPaths(grid._filters, 'filtering', items))
    items = grid._filter(items);

  grid.size = items.length;
  if (
    opts.sortOrders.length &&
    grid._checkPaths(grid._sorters, 'sorting', items)
  )
    items = items.sort(grid._multiSort.bind(grid));

  let data = [];
  if (!mistList.treeView) {
    data = items;
    mistList.count = data.length;
  } else if (opts.parentItem) {
    data = items.filter(item => item && item.parent === opts.parentItem.id);
    mistList.count += data.length;
  } else {
    data = items.filter(item => item && !item.parent);
    mistList.count = data.length;
  }
  // keep the code for reference when pagination will be introduced
  // const start = opts.page * opts.pageSize;
  // const end = start + opts.pageSize;
  // const slice = data.slice(start, end);
  callback(data, data.length);
}
/* eslint-enable no-param-reassign, consistent-return */
