/* eslint-disable consistent-return */
export default function reduxDataProvider(opts, callback) {
  const mistList = this.shadowRoot.querySelector('mist-list');
  if (!mistList) return [];
  // resource can be any mist resource
  const resource = mistList.name.toLowerCase();
  const { grid } = mistList.$;
  if (!grid) return [];
  const { store } = mistList;
  if (!store) {
    // eslint-disable-next-line no-console
    console.warn(`This works with a redux store! Pass mist-list a 
              redux store in the store property!`);
    return;
  }

  let sort = '';
  if (grid._sorters && grid._sorters.length > 0) {
    sort =
      grid._sorters[0].direction === 'desc'
        ? `-${grid._sorters[0].path}`
        : grid._sorters[0].path;
  }
  // use this.sorters because data provider gets called before mist-list has the chance
  // to update the sorters when the element gets rendered for the first time
  else if (this.sorters) {
    sort =
      this.sorters.direction === 'desc'
        ? `-${this.sorters.path}`
        : this.sorters.path;
  }

  const start = opts.page * opts.pageSize;
  fetch(
    `${mistList.apiurl}?start=${start}&sort=${sort}&limit=${opts.pageSize}&search=${mistList.combinedFilter}`
  )
    .then(response => response.json())
    .then(data => {
      const resources = data.data;
      mistList.count = data.meta.total;
      const resourceCount = {};
      resourceCount[resource] = { total: data.meta.total };
      store.dispatch({ type: 'Update-Sections-Count', payload: resourceCount });
      if (resources && resources.length < opts.pageSize)
        mistList.finished = true;
      // first letter must be capital, eg. Update-Orgs, Update-Users
      store.dispatch({
        type: `Update-${resource.charAt(0).toUpperCase() + resource.slice(1)}`,
        payload: resources,
      });
      const totalItems = store.getState().mainReducer[resource];
      // set columns, it is enough to set them the first time
      const item = resources[0];
      if (item && opts.page === 0) {
        Object.keys(item).forEach(prop => {
          mistList.colmap[prop] = true;
        });
        const cols = Object.keys(mistList.colmap);
        mistList.frozen.forEach(prop => {
          if (cols.indexOf(prop) > -1) cols.splice(cols.indexOf(prop), 1);
        });
        mistList.columns = cols;
      }
      mistList.received =
        mistList.combinedFilter.length > 0
          ? resources.length
          : Object.keys(totalItems).length;
      callback(resources, mistList.count);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
}
