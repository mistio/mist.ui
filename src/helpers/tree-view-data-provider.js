/* eslint-disable no-param-reassign */
export default function treeViewDataProvider(grid) {
  return (opts, callback) => {
    let items = (Array.isArray(grid.items) ? grid.items : []).slice(0);
    if (grid._filters && grid._checkPaths(grid._filters, 'filtering', items))
      items = grid._filter(items);

    grid.size = items.length;
    if (
      opts.sortOrders.length &&
      grid._checkPaths(grid._sorters, 'sorting', items)
    )
      items = items.sort(grid._multiSort.bind(grid));

    if (this.filteredItems && this.filter && this.filter.trim().length > 0) {
      const filterMap = {};
      this.filteredItems.forEach(item => {
        filterMap[item.id] = item;
      });
      // add parents
      Object.values(filterMap).forEach(item => {
        if (item.parent) filterMap[item.parent] = this.itemMap[item.parent];
      });
      items = Object.values(filterMap);
    }
    let data = [];
    if (!this.treeView) {
      data = items;
      this.count = data.length;
    } else if (opts.parentItem) {
      data = items.filter(item => item.parent === opts.parentItem.id);
      this.count += data.length;
    } else {
      data = items.filter(item => !item.parent);
      this.count = data.length;
    }
    const start = opts.page * opts.pageSize;
    const end = start + opts.pageSize;
    const slice = data.slice(start, end);
    callback(slice, data.length);
  };
}
/* eslint-enable no-param-reassign */
