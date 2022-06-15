/* eslint-disable no-param-reassign, consistent-return */
export default function nodepoolsDataProvider(opts, callback) {
    let items = [];
    const mistList = this.shadowRoot.querySelector('mist-list');
    if (!mistList) return [];
    const { grid } = mistList.$;
    if (!grid) return [];
    items = Object.values(mistList.itemMap || {});
  
    grid.size = items.length;
  
    let data = [];
    if (!mistList.treeView) {
      data = items;
      mistList.count = data.length;
    } else if (opts.parentItem && opts.parentItem.machine_type === 'node') {
      data = items.filter(item => item.id && item.parent === opts.parentItem.id);
    } else if (opts.parentItem && !opts.parentItem.id) {
      data = items.filter(
        item => item.extra && item.extra.nodepool === opts.parentItem.name
      );
    } else {
      data = items.filter(item => item && !item.id);
      mistList.count = data.length;
    }
    // keep the code for reference when pagination will be introduced
    // const start = opts.page * opts.pageSize;
    // const end = start + opts.pageSize;
    // const slice = data.slice(start, end);
    callback(data, data.length);
  }
/* eslint-enable no-param-reassign, consistent-return */
