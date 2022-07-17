/* eslint-disable no-param-reassign, consistent-return */
export default async function bucketsDataProvider(opts, callback) {
    const mistList = this.shadowRoot.querySelector('mist-list');
    if (!mistList) return [];
    const { grid } = mistList.$;
    if (!grid) return [];
    let items;
    this.loading = true;
    // if (grid._filters && grid._checkPaths(grid._filters, 'filtering', items))
    //   items = grid._filter(items);
  
    if(!this.bucket || this.bucket.id == null)
      return;
    let url = "";
    if (!opts.parentItem) {
      url = `${mistList.apiurl}/${this.bucket.id}/content`;
    } else if (opts.parentItem && opts.parentItem.name.slice(-1) === '/') {
      url = `${mistList.apiurl}/${this.bucket.id}/content?path=${opts.parentItem.name}`;
    }
    const response = await fetch(url);
    const responseData = await response.json();
    items = Object.values(responseData.content);

    if (
      opts.sortOrders.length &&
      grid._checkPaths(grid._sorters, 'sorting', items)
    )
      items = items.sort(grid._multiSort.bind(grid));

    callback(items, items.length);
    this.loading = false;
  }
  /* eslint-enable no-param-reassign, consistent-return */