import { sectionUpdated } from './slices/org.js';
import { store } from './store.js';

/* eslint-disable consistent-return */
export default function reduxDataProvider(opts, callback) {
  const start = opts.page * opts.pageSize;
  const baseurl = `/api/v2/${this.getAttribute('name')}`;
  let url = `${baseurl}?start=${start}&limit=${opts.pageSize}`;
  if (this.combinedFilter) {
    url = `${url}&search=${this.combinedFilter}`
  }
  fetch(url)
    .then((response) => response.json())
    .then((body) => {     
      const resources = body.data;
      store.dispatch(sectionUpdated(body));
      callback(resources, body.meta.total);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
}
