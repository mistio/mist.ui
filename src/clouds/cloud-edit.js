import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
import PROVIDERS from '../helpers/providers.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms"></style>
    <p>
      Editing the cloud's credentials may result in unexpected behaviour.
      Proceed with caution.
    </p>
    <app-form
      fields="{{fields}}"
      url="/api/v1/clouds/[[cloud.id]]"
      method="PATCH"
      on-request="_editCloudRequest"
      on-response="_editCloudsResponse"
      btncontent="Edit Credentials"
      show-cancel=""
    ></app-form>
  `,

  is: 'cloud-edit',

  properties: {
    keys: {
      type: Array,
    },
    clouds: {
      type: Object,
    },
    cloud: {
      type: Object,
    },
    fields: {
      type: Array,
      computed: '_computeFields(cloud.*)',
      notify: true,
    },
  },

  observers: ['_fillInCreds(cloud)'],

  _computeFields(_cloud) {
    const providerFields = PROVIDERS.filter(fields => {
      if (this.cloud && this.cloud.provider)
        return fields.val === this.cloud.provider;
      return false;
    }, this);
    // don't allow title and region in the fields
    let fields = [];
    if (providerFields[0] && providerFields[0].options) {
      fields = providerFields[0].options.filter(f => {
        return (
          f.name !== 'title' && f.name !== 'region' && f.name !== 'dns_enabled'
        );
      });

      for (let i = 0; i < fields.length; i++) {
        const { name } = fields[i];
        if (this.cloud[name]) {
          this.set(`fields.${i}.value`, this.cloud[name]);
        }
        // if docker_host, search for clouds host
        if (name === 'docker_host' && this.cloud.host) {
          fields[i].value = this.cloud.host;
        }
        // if docker_port, search for clouds host
        else if (name === 'docker_port' && this.cloud.port) {
          fields[i].value = this.cloud.port;
        }
        // if there is a key
        else if (fields[i].type === 'ssh_key') {
          fields[i].options = this.keys;
        } else if (fields[i].type === 'list') {
          const field = fields[i];
          for (let j = 0; j < field.options.length; j++) {
            if (field.options[j].type === 'ssh_key') {
              field.options[j].options = this.keys;
            }
          }
        }
      }
    }
    return fields;
  },

  _fillInCreds(cloud) {
    if (cloud) {
      // reset form
      if (this.shadowRoot.querySelector('app-form')) {
        this.shadowRoot.querySelector('app-form').form = {};
      }
      // if there is an apikey we can fill in
      const { apikey } = this.cloud;
      const index = this._fieldIndexByName('apikey', this.fields);
      if (apikey && index > -1) {
        this.set(`fields.${index}.value`, apikey);
        // if there is apikey and an apisecret we can 'getsecretfromdb'
        const indexp = this._fieldIndexByName('apisecret');
        if (indexp !== undefined) {
          this.set(`fields.${indexp}.value`, 'getsecretfromdb');
        }
      }

      if (this.cloud.username) {
        this._fillIn('username', 'machine_user');
      }

      if (this.cloud.host) {
        this._fillIn('host', 'machine_hostname');
      }

      if (this.cloud.key) {
        this._fillIn('key', 'machine_key');
      }

      if (this.cloud.user_id) {
        this._fillIn('user_id', 'user_id');
      }

      if (this.cloud.url) {
        this._fillIn('url', 'url');
      }

      if (this.cloud.provider === 'bare_metal' && this.cloud.machines) {
        this.async(() => {
          this._fillInHosts(Object.values(this.cloud.machines));
        }, 200);
      }
    }
  },

  _fillInHosts(machines) {
    const lindex = this._fieldIndexByName('machines');
    this.set(`fields.${lindex}.items`, []);

    for (let i = 0; i < machines.length; i++) {
      const opts = this.fields[lindex].options.slice(0);

      this.push(`fields.${lindex}.items`, opts);
      this.set(`fields.${lindex}.items.${i}.${0}.value`, machines[i].hostname);
      this.set(`fields.${lindex}.items.${i}.${1}.value`, machines[i].name);
      this.set(`fields.${lindex}.items.${i}.${2}.value`, machines[i].os_type);
      this.set(
        `fields.${lindex}.items.${i}.${3}.value`,
        machines[i].key_associations[0].key
      );

      this.set(
        `fields.${lindex}.items.${i}.${4}.value`,
        machines[i].key_associations[0].ssh_user
      );
      this.set(
        `fields.${lindex}.items.${i}.${5}.value`,
        machines[i].key_associations[0].port
      );
      this.set(`fields.${lindex}.items.${i}.${6}.value`, machines[i].rdp_port);
    }
  },

  _fillIn(cloudProperty, fieldName) {
    const index = this._fieldIndexByName(fieldName, this.fields);
    if (this.cloud[cloudProperty] && index !== undefined) {
      this.set(`fields.${index}.value`, this.cloud[cloudProperty]);
    }
  },

  _fieldIndexByName(name, _fields) {
    let index;
    if (this.fields) {
      this.fields.find((f, ind) => {
        if (f.name === name) index = ind;
        return f.name === name;
      });
    }
    return index;
  },

  fieldsOfType(data, type) {
    const typeIndexes = [];
    data.forEach((f, ind) => {
      if (f.type === type) typeIndexes.push(ind);
    });
    return typeIndexes;
  },

  updateKeys(e) {
    const keyFieldsIndexes = this.fieldsOfType(this.fields, 'ssh_key');
    console.log('updateKeys', keyFieldsIndexes);
    this.async(() => {
      for (let i = 0; i < keyFieldsIndexes.length; i++) {
        this.set(`fields.${keyFieldsIndexes[i]}.options`, this.keys);
        this.set(`fields.${keyFieldsIndexes[i]}.value`, e.detail.key);
      }
      if (this.fieldsOfType(this.fields, 'list')) {
        this.updateKeysInLists(e, this.fieldsOfType(this.fields, 'list'));
      }
    }, 1000);
  },

  updateKeysInLists(e, lists) {
    for (let j = 0; j < lists.length; j++) {
      const keyFieldsIndexes = this.fieldsOfType(
        this.fields[lists[j]].options,
        'ssh_key'
      );
      console.log('updateKeys', this.fields[lists[j]].options);

      this.async(() => {
        for (let i = 0; i < keyFieldsIndexes.length; i++) {
          this.set(
            `fields.${lists[i]}.options.${keyFieldsIndexes[i]}.options`,
            this.keys
          );
          this.set(
            `fields.${lists[i]}.options.${keyFieldsIndexes[i]}.value`,
            e.detail.key
          );
        }
      }, 500);
    }
  },

  _editCloudRequest() {},
  _editCloudsResponse() {},
});
