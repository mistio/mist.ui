import '@polymer/polymer/polymer-legacy.js';
import 'sockjs-client/dist/sockjs.min.js';
import * as jsonpatch from 'fast-json-patch/index.mjs';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {
  _generateMap,
  CSRFToken,
  stripePublicAPIKey,
} from './helpers/utils.js';

const DEBUG_SOCKET = false;
const loadedResourceCounters = {};

Polymer({
  is: 'mist-socket',
  url: '/socket',
  properties: {
    socket: {
      type: Object,
      value: false,
    },
    openRequests: {
      type: Array,
      value() {
        return [];
      },
    },
    model: {
      type: Object,
      value() {
        return { sections: {} };
      },
      notify: true,
    },
    initialized: {
      type: Boolean,
      value: false,
    },
    term: {
      type: Object,
    },
  },

  ready() {
    // Create the socket if it does not exist
    console.warn('ready');
    if (this.socket) return;
    this.connect();
    this.document = document; // suppresses an error message when sending mouse clicks to xterm.js
  },

  connect() {
    console.warn('connecting at ', this.url);
    // Create the SockJS object
    // eslint-disable-next-line no-undef
    this.socket = new SockJS(this.url, null, {
      // eslint-disable-line no-undef
      transports: ['websocket', 'xhr-polling'],
    });

    // Connect the receiver
    const receiver = this.receive.bind(this);
    this.socket.onmessage = e => {
      receiver(e.data);
    };

    const that = this;

    // Handle error & close
    this.socket.onerror = () => {
      console.warn('CONNECTION ERROR');
      that.async(that.connect, 1000);
    };
    this.socket.onclose = () => {
      console.warn('CONNECTION CLOSED');
      that.async(that.connect, 1000);
    };
    this.socket.onheartbeat = this.heartbeat;

    // When socket connects prepare channels
    this.socket.onopen = () => {
      console.log('CONNECTION ESTABLISHED');
      that.send('sub', 'main');
      that.send('msg', 'main', 'ready');
      that.send('sub', 'logs');
      that.send('msg', 'logs', 'ready');
      that.set('initialized', true);
    };
    // Initialize main handlers
    this.handlers = {
      main: {
        patch_model(data) {
          that._patchModel(data);
        },
        list_clouds(data) {
          console.warn(that.model.pending);
          that._updateClouds(data);
        },
        list_clusters(data) {
          that._updateClusters(data);
        },
        list_keys(data) {
          that._updateKeys(data);
        },
        list_scripts(data) {
          that._updateScripts(data);
        },
        list_schedules(data) {
          that._updateSchedules(data);
        },
        list_templates(data) {
          that._updateTemplates(data);
        },
        list_stacks(data) {
          that._updateStacks(data);
        },
        list_machines(data) {
          that._updateMachines(data);
        },
        list_rules(data) {
          that._updateRules(data);
        },
        list_images(data) {
          that._updateImages(data);
        },
        list_sizes(data) {
          that._updateSizes(data);
        },
        list_locations(data) {
          that._updateLocations(data);
        },
        list_networks(data) {
          that._updateNetworks(data);
        },
        list_volumes(data) {
          that._updateVolumes(data);
        },
        list_buckets(data) {
          that._updateBuckets(data);
        },
        list_zones(data) {
          that._updateZones(data);
        },
        list_tunnels(data) {
          that._updateTunnels(data);
        },
        list_projects(data) {
          that._updateProjects(data);
        },
        list_resource_groups(data) {
          that._updateResourceGroups(data);
        },
        list_storage_accounts(data) {
          that._updateStorageAccounts(data);
        },
        list_tags(data) {
          that._updateTags(data);
        },
        monitoring(data) {
          that._updateMonitoring(data);
        },
        reload(data) {
          that._reloadPage(data);
        },
        user(data) {
          that._updateUser(data);
        },
        org(data) {
          console.info('Loaded org data');
          that._updateOrg(data);
        },
        logout(_data) {
          document.location.pathname = '/';
        },
        stats(data) {
          if (!that.openRequests[data.request_id])
            console.warn('cannot find open request', data.request_id);
          else {
            that.openRequests[data.request_id](data);
            delete that.openRequests[data.request_id];
          }
        },
        notifications(data) {
          that.debounce(
            'loadNotifications',
            () => {
              that._loadNotifications(data);
            },
            () => {
              console.debug('Loaded notifications list data');
            },
            250
          );
        },
        patch_notifications(data) {
          that._patchNotifications(data);
          console.debug('Applied notifications patch');
        },
      },
      shell: {
        shell_data(data) {
          if (that.term) {
            that.term.write(data);
          } else {
            console.warn(
              'received shell data from socket but the terminal is not open',
              data
            );
          }
        },
      },
      logs: {
        logs(data) {
          console.warn('received log entries from socket', data);
        },
        event(data) {
          if (DEBUG_SOCKET) console.debug('received log event', data);
          that.fire('forward-log', data);
        },
        incidents(data) {
          if (DEBUG_SOCKET) console.debug('got incidents', data);
          that.debounce(
            that._updateIncidents(data),
            () => {
              console.debug('Loaded incidents data');
            },
            250
          );
        },
        jobs(data) {
          if (DEBUG_SOCKET) console.debug('got jobs', data);
          that.set('model.jobs', _generateMap(data, 'story_id'));
        },
        sessions(data) {
          if (DEBUG_SOCKET) console.debug('got sessions', data);
          that.set('model.sessions', _generateMap(data, 'story_id'));
        },
        shells(data) {
          if (DEBUG_SOCKET) console.debug('got shells', data);
          that.set('model.shells', _generateMap(data, 'story_id'));
        },
        patch_stories(data) {
          that._patchStories(data);
          console.warn('Applied stories patch');
        },
      },
    };
  },

  heartbeat() {
    console.debug('got heartbeat');
    const _this = this;
    requestIdleCallback(
      () => {
        _this.send('h'); // reply with empty frame
      },
      {
        timeout: 5000,
      }
    );
  },
  /* eslint-disable no-param-reassign */
  getStats(data, callback) {
    // console.log('getStats', data);
    const reqId = this.generateGuid(); // Math.floor(10000 * Math.random());
    data[5] = reqId;
    this.openRequests[reqId] = callback;
    this.send('msg', 'main', 'stats', data);
  },
  /* eslint-enable no-param-reassign */
  generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  },
  /* eslint-disable no-param-reassign */
  send(type, namespace, body, params) {
    if (namespace === undefined) namespace = 'main';

    let payload = `${type},${namespace}`;

    if (body !== undefined) payload += `,${body}`;

    if (params !== undefined) payload += `,${JSON.stringify(params)}`;

    this.socket.send(payload);
    if (DEBUG_SOCKET) console.debug(`SENT: ${payload}`);
  },
  /* eslint-enable no-param-reassign */
  receive(message) {
    if (DEBUG_SOCKET) console.debug(`RECEIVED: ${message}`);

    const parts = message.split(',');
    const namespace = parts[1];
    const body = JSON.parse(parts.splice(2).join(','));
    if (this.handlers[namespace] === undefined)
      console.warn('Unknown namespace', namespace);
    const endpoint = this.handlers[namespace][Object.keys(body)[0].trim()];
    if (endpoint === undefined)
      console.warn(
        'Unknown endpoint',
        Object.keys(body)[0],
        'in namespace',
        namespace
      );
    else endpoint(body[Object.keys(body)[0]]);
  },

  _reloadPage(data) {
    console.warn('reloading', data);
    document.location.reload();
  },

  _patchModel(patch) {
    const _this = this;
    patch.forEach(operation => {
      // eslint-disable-next-line no-unused-vars
      const idleCallbackId = requestIdleCallback(
        () => {
          let cloudId;
          let resourceType;
          let resourceExternalId;
          let path;
          let propertyPath;
          let oldCloudResourceExternalIds;
          let oldCloudResourceIds;

          // Let's figure out if the patch applies to a cloud and which one
          if (operation.path.search('/clouds/') > -1) {
            path = operation.path.split('/clouds/')[1].split('/');
            [cloudId] = path;

            // console.log('DEBUG 1 - search cloud', path, cloudId);

            // We're patching cloud resources, let's figure out the resource type and keep aside the cloud resource ids before the patch
            if (
              [
                'clusters',
                'machines',
                'networks',
                'volumes',
                'zones',
                'buckets',
              ].indexOf(path[1]) > -1
            ) {
              [, resourceType] = path;
              path = operation.path.split(`/${resourceType}/`)[1].split('/');
              [resourceExternalId] = path;
              propertyPath = operation.path
                .split(resourceExternalId)[1]
                .replace(/\//g, '.');

              // console.log('DEBUG 2 - resources of cloud', path, cloudId);

              if (_this.model.clouds && _this.model.clouds[cloudId]) {
                oldCloudResourceExternalIds =
                  Object.keys(
                    _this.model.clouds[cloudId][resourceType] || {}
                  ) || [];
                oldCloudResourceIds = oldCloudResourceExternalIds.map(
                  i => _this.model.clouds[cloudId][resourceType][i].id
                );

                // console.log('DEBUG 3 - old ids', oldCloudResourceExternalIds, oldCloudResourceIds);
              }
            }
          }
          // Apply patch operation to the model

          try {
            jsonpatch.applyOperation(_this.model, operation, true);
          } catch (error) {
            if (DEBUG_SOCKET)
              console.error('jsonpatch applyOperation error', error);
          }

          if (
            resourceType &&
            cloudId &&
            _this.model.clouds &&
            _this.model.clouds[cloudId] &&
            _this.model.clouds[cloudId][resourceType]
          ) {
            const newCloudResources = _this.model.clouds[cloudId][resourceType];
            const newCloudResourceExternalIds = Object.keys(newCloudResources);
            const newCloudResourceIds = newCloudResourceExternalIds.map(
              i => newCloudResources[i].id
            );

            // console.log('DEBUG 4 -  new ids', newCloudResources, newCloudResourceExternalIds, newCloudResourceIds);

            // Cleanup deleted resource refs
            for (let i = 0; i < oldCloudResourceIds.length; i++) {
              if (
                newCloudResources[oldCloudResourceExternalIds[i]] ===
                  undefined &&
                _this.model[resourceType][oldCloudResourceIds[i]] !== undefined
              ) {
                _this.set(
                  `model.${resourceType}.${oldCloudResourceIds[i]}`,
                  null
                );
                _this.notifyPath(
                  `model.${resourceType}.${oldCloudResourceIds[i]}`
                );
                delete _this.model[resourceType][oldCloudResourceIds[i]];
              }
            }

            // Link paths of new resources for easy global lookup
            for (let i = 0; i < newCloudResourceIds.length; i++) {
              if (
                _this.model[resourceType][newCloudResourceIds[i]] === undefined
              ) {
                const newResource = _this.model.clouds[cloudId][resourceType][
                  newCloudResourceExternalIds[i]
                ]
                // if resource has parent set the parent's treeNode attribute
                // the resource may be a parent if it has no parent
                if(
                  newResource.parent &&
                  _this.model[resourceType][newResource.parent]
                ) {
                    _this.model[resourceType][newResource.parent].treeNode = true;
                } else if(!newResource.treeNode) {
                  const hasChild = Object.values(_this.model[resourceType]).some(resource =>
                      resource.parent === newResource.id
                    )
                  newResource.treeNode = hasChild
                }
                _this.set(
                  `model.${resourceType}.${newCloudResourceIds[i]}`,
                  newResource
                );
                _this.linkPaths(
                  `model.${resourceType}.${newCloudResourceIds[i]}`,
                  `model.clouds.${cloudId}.${resourceType}.${newCloudResourceExternalIds[i]}`
                );
              }
            }

            if (
              propertyPath &&
              _this.model.clouds[cloudId][resourceType][resourceExternalId]
            ) {
              const resourceGlobalPath = `model.${resourceType}.${_this.model.clouds[cloudId][resourceType][resourceExternalId].id}`;
              const propertyGlobalPath = resourceGlobalPath + propertyPath;
              const resourceLocalPath = `model.clouds.${cloudId}.${resourceType}.${resourceExternalId}`;
              const propertyLocalPath = resourceLocalPath + propertyPath;

              if (
                _this.get(propertyGlobalPath) &&
                _this.get(propertyGlobalPath) === _this.get(propertyLocalPath)
              ) {
                _this.notifyPath(propertyGlobalPath);
              } else {
                _this.set(resourceGlobalPath, _this.get(resourceLocalPath));
              }

              // Check if we need to notify a subpath e.g. when updating records of a zone
              let propertySubPath = propertyPath.split('.');
              propertySubPath.pop();
              if (propertySubPath.length > 1) {
                propertySubPath = propertySubPath.join('.');
                propertySubPath = `model.${resourceType}.${_this.model.clouds[cloudId][resourceType][resourceExternalId].id}${propertySubPath}`;
                setTimeout(() => {
                  _this.notifyPath(propertySubPath);
                }, 50);
              }
            }
            _this.notifyPath(`model.${resourceType}`);
            _this.set(
              `model.sections.${resourceType}.count`,
              Object.keys(_this.model[resourceType]).length
            );
          }
        },
        {
          timeout: 500,
        }
      );
    });
  },
  /* eslint-disable no-param-reassign */
  _updateModel(section, data, primaryField) {
    if (this.model) {
      let changed = false; // we wont update the model if it hasn't changed
      const pending = this.get(`model.pending.${section}`);

      // if the received data array has different length than the respective
      // model array, then things must have changed since last update
      if (data.length !== this.get(`model.${section}Array.length`)) {
        // console.debug('0. length', data.length, this.get('model.' + section + 'Array.length'));
        changed = true;
      }
      // For each item in the received data array
      for (let i = 0; i < data.length; i++) {
        // If we know things have changed no need to keep checking
        if (changed) break;
        // check if _id is used instead of id
        if (!data[i].id) {
          data[i].id = data[i]._id;
        }
        // Check if item exists in respective model
        // var item = this.get('model.' + section + '.' + data[i].id);
        // patch for when data[i].id is of type '127.0.0.1'
        const path = this.get(`model.${section}`);
        const item = path[data[i].id];
        if (!item) {
          // If does not exist then model needs to be updated
          // console.debug('1. data[i].id', data[i], this.get('model.' + section + '.' + data[i].id));
          changed = true;
          break;
        }

        // check if all fields of the data item exist in the model item
        const dataKeys = Object.keys(data[i]);
        const modelKeys = Object.keys(item);

        for (let k = 0; k < dataKeys.length; k++) {
          // Do not update model just for the last_seen property
          if (
            dataKeys[k] !== 'last_seen' &&
            modelKeys.indexOf(dataKeys[k]) === -1
          ) {
            // If something is missing the model needs to be updated
            console.debug(
              '2. model',
              modelKeys.indexOf(dataKeys[k]),
              dataKeys[k]
            );
            changed = true;
            break;
          }
          // If some field changed the model needs to be updated
          if (
            dataKeys[k] !== 'last_seen' &&
            data[i][dataKeys[k]] !== undefined &&
            JSON.stringify(data[i][dataKeys[k]]).localeCompare(
              JSON.stringify(item[dataKeys[k]])
            )
          ) {
            // console.debug('localeCompare',JSON.stringify(data[i][dataKeys[k]]).localeCompare(JSON.stringify(item[dataKeys[k]])));
            console.debug('property ', dataKeys[k], ' changed in ', item);
            const oldVal = JSON.stringify(item[dataKeys[k]]);
            const newVal = JSON.stringify(data[i][dataKeys[k]]);
            console.debug('Old value: ', oldVal, oldVal.length);
            console.debug('New value: ', newVal, newVal.length);
            changed = true;
            break;
          }
        }

        if (changed) break;
      }

      if (changed) {
        // console.warn('updating', section);
        this.set(`model.${section}`, _generateMap(data, primaryField));
        this.set(`model.${section}Array`, data);
      } else if (DEBUG_SOCKET) console.debug('no need to update', section);

      if (
        this.model.sections[section] &&
        this.model.sections[section].count !== (data.length || 0)
      ) {
        // update section count, necessary for propagating changes to sidebar & dashboard counters
        this.set(`model.sections.${section}.count`, data.length || 0);
        console.log(
          'update model',
          section,
          this.model.sections[section].count
        );
      }

      if (pending) {
        this.set(`model.pending.${section}`, false);
      }

      return changed;
    }
    return false;
  },
  _initializeLoadedResourceCounters(clouds) {
    // If the resource types increase, we should probably store them in an array and iterate over them
    loadedResourceCounters.machines = clouds.filter(
      cloud => cloud.enabled
    ).length;
    loadedResourceCounters.zones = clouds.filter(
      cloud => cloud.dns_enabled
    ).length;
    // TODO: Counters for volumes, networks and images
    // loadedResourceCounters.volumes = clouds.filter(cloud => cloud.hasOwnProperty('volumes')).length;
    // loadedResourceCounters.networks = clouds.filter(cloud => cloud.hasOwnProperty('networks')).length;
    // loadedResourceCounters.images = clouds.filter(cloud => cloud.hasOwnProperty('images')).length;
  },
  /* eslint-enable no-param-reassign */
  _updateClouds(data) {
    // console.log('_updateClouds', data);
    if (data.length && this.get('model.onboarding.hasCloud') !== true)
      this.set('model.onboarding.hasCloud', true);
    if (!data.length) {
      this.set('model.onboarding.hasCloud', false);
      this.set('model.onboarding.isLoadingMachines', false);
      this.set('model.onboarding.isLoadingImages', false);
      this.set('model.onboarding.isLoadingNetworks', false);
    } else {
      this._initializeLoadedResourceCounters([...data]);
      this.set('model.onboarding.isLoadingMachines', true);
      this.set('model.onboarding.isLoadingImages', true);
      this.set('model.onboarding.isLoadingNetworks', true);
    }

    const ret = this._updateModel('clouds', data);
    this.set('model.onboarding.isLoadingClouds', false);

    if (this.model && this.model.clouds && data) {
      // console.log('_updateClouds - in clean up loop');
      data.forEach(c => {
        this.cleanUpResources(c.id);
      }, this);
    }
    if (!data || this.model.cloudsArray.length === 0) {
      // console.log('_updateClouds - in clean up resources');
      this.cleanUpResources();
    }

    // the case when clouds have loaded but handlers list_machines/list_images/list_networks
    // have never been triggered (ex. all clouds are disabled, list_machines never gets data)
    let cloudsResources = !(
      !this.model.machines &&
      !this.model.networks &&
      !this.model.images
    );
    if (data.length && !cloudsResources && ret)
      cloudsResources = data
        .map(d => !!(d.machines || d.images || d.networks))
        .reduce((b1, b2) => b1 || b2);
    if (!cloudsResources) {
      this.set('model.onboarding.isLoadingMachines', false);
      this.set('model.onboarding.isLoadingImages', false);
      this.set('model.onboarding.isLoadingNetworks', false);
    }
    return ret;
  },

  _updateMonitoring(data) {
    console.warn('got monitoring', data);
    if (data.length && this.get('model.onboarding.hasMonitoring') !== true)
      this.set('model.onboarding.hasMonitoring', true);
    if (!data)
      // data is an Object
      this.set('model.onboarding.hasMonitoring', false);
    this.set('model.pending.monitoring', false);
    // inform machines that have rules
    if (data.rules) {
      Object.keys(data.rules || {}).forEach(rule => {
        if (
          rule.cloud &&
          rule.machine &&
          this.model.clouds[rule.cloud] &&
          this.model.clouds[rule.cloud].machines[rule.machine]
        ) {
          if (
            !this.get(
              `model.clouds.${rule.cloud}.machines.${rule.machine}.rules`
            )
          ) {
            this.set(
              `model.clouds.${rule.cloud}.machines.${rule.machine}.rules`,
              [rule]
            );
            // console.log('// inform machines that have rules ', rule.cloud, rule.machine, this.model.clouds[rule.cloud].machines[rule.machine].rules);
          } else
            this.push(
              `model.clouds.${rule.cloud}.machines.${rule.machine}.rules`,
              rule
            );
        }
      });
    }
    this._updateRules(data.rules);
    return this.set('model.monitoring', data);
  },

  _updateUser(data) {
    this.set('model.user', data);
    if (data) {
      CSRFToken.value = data.csrf_token;
      stripePublicAPIKey.value = data.stripe_public_apikey;
    }
  },

  _updateOrg(data) {
    this.set('model.onboarding.isLoadingTeams', false);
    this._updateModel('teams', data.teams);
    this._updateModel('members', data.members);
    // data.teams = data.members = undefined;
    this.set('model.org', data);
  },
  /* eslint-disable no-param-reassign */
  _updateKeys(data) {
    this.set('model.onboarding.isLoadingKeys', false);
    this.fire('update-keys');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const key = data[i];
        // remove disassociated keys from machines or add new associations
        const machineIds = {};
        key.machines.forEach(k => {
          machineIds[k.machine_id] = k;
        });
        if (this.model && Object.keys(this.model.machines || {}).length > 0) {
          Object.values(this.model.machines).forEach(m => {
            if (Object.keys(machineIds).includes(m.id))
              m.key_associations[machineIds[m.id].association_id] = {
                key: key.id,
                last_used: machineIds[m.id].last_used,
                port: machineIds[m.id].port,
                ssh_user: machineIds[m.id].ssh_user,
              };
            else if (m.key_associations) {
              Object.keys(m.key_associations).forEach(keyAssoc => {
                if (m.key_associations[keyAssoc].key === key.id)
                  delete m.key_associations[keyAssoc];
              });
            }
          });
        }
      }
    }
    return this._updateModel('keys', data);
  },
  /* eslint-enable no-param-reassign */
  _updateScripts(data) {
    this.set('model.onboarding.isLoadingScripts', false);
    return this._updateModel('scripts', data);
  },

  _updateRules(data) {
    const rulesArray = [];
    Object.keys(data || {}).forEach(p => {
      const rule = data[p];
      rule.id = p;
      rulesArray.push(rule);
    });
    this._updateModel('rules', rulesArray);
    // return this._updateModel('rules', data);
  },

  _updateSchedules(data) {
    this.set('model.onboarding.isLoadingSchedules', false);
    return this._updateModel('schedules', data);
  },

  _updateTemplates(data) {
    this.set('model.onboarding.isLoadingTemplates', false);
    return this._updateModel('templates', data);
  },

  _updateStacks(data) {
    this.set('model.onboarding.isLoadingStacks', false);
    return this._updateModel('stacks', data);
  },

  _updateSizes(data) {
    return this._updateModel(`clouds.${data.cloud_id}.sizes`, data.sizes);
  },

  _updateLocations(data) {
    return this._updateModel(
      `clouds.${data.cloud_id}.locations`,
      data.locations
    );
  },
  /* eslint-disable no-param-reassign */
  _updateImages(data) {
    // console.log('_updateImages');
    this.set('model.onboarding.isLoadingImages', false);
    const changed = this._updateModel(
      `clouds.${data.cloud_id}.images`,
      data.images
    );
    if (!changed) return false;

    const self = this;
    let allImages = [];
    if (this.model !== undefined) {
      this.model.cloudsArray.forEach(cloud => {
        if (cloud.imagesArray !== undefined && cloud.enabled) {
          cloud.imagesArray.forEach(image => {
            image.cloud = {
              id: cloud.id,
              name: cloud.name,
              provider: cloud.provider,
            };
            self.model.imagesArray.push(image);
          });
        }
        allImages = allImages.concat(
          cloud.imagesArray !== undefined ? cloud.imagesArray : []
        );
      });
    }

    this.set('model.imagesArray', allImages);
    this.set('model.images', _generateMap(allImages));
    // update section count, necessary for propagating changes to sidebar & dashboard counters
    this.set('model.sections.images.count', allImages.length);
    return true;
  },
  _updateClusters(data) {
    this.set('model.onboarding.isLoadingClusters', false);
    this._updateCloudResources(data, 'clusters', 'external_id');
  },
  _updateMachines(data) {
    const parentIds = new Set();
    data.machines.forEach(machine => {
      if (
        machine && machine.parent
      )
        parentIds.add(machine.parent);
    });
    data.machines.forEach(machine => {
      if(parentIds.has(machine.id))
        machine.treeNode = true;
    })
    loadedResourceCounters.machines -= 1;
    if (loadedResourceCounters.machines <= 0) {
      this.set('model.onboarding.isLoadingMachines', false);
    }

    this._updateCloudResources(data, 'machines', 'external_id');
  },
  /* eslint-enable no-param-reassign */
  _updateNetworks(data) {
    this.set('model.onboarding.isLoadingNetworks', false);
    this._updateCloudResources(data, 'networks', 'external_id');
  },

  _updateVolumes(data) {
    // console.log('UPDATE VOLUMES', data);
    this._updateCloudResources(data, 'volumes', 'external_id');
  },

  _updateBuckets(data) {
    this._updateCloudResources(data, 'buckets', 'id');
  },

  _updateZones(data) {
    this.set('model.onboarding.isLoadingNetworks', false);
    this._updateCloudResources(data, 'zones', 'external_id');
  },

  _updateCloudResources(data, section, externalId) {
    if (this.model && this.model.clouds && this.model.clouds[data.cloud_id]) {
      if (this.model.clouds[data.cloud_id][section] === undefined)
        this.model.clouds[data.cloud_id][section] = {};
      const oldCloudResourcesExternalIDs = Object.keys(
        this.model.clouds[data.cloud_id][section]
      );
      const oldCloudResourcesIDs = oldCloudResourcesExternalIDs.map(
        i => this.model.clouds[data.cloud_id][section][i].id
      );
      // const newCloudResources = data[section].reduce((map, obj) => (map[obj[externalId]] = obj, map), {});
      const newCloudResources = {};
      data[section].forEach(sec => {
        newCloudResources[sec[externalId]] = sec;
      });
      const newCloudResourcesExternalIds = Object.keys(newCloudResources);
      const newCloudResourcesIds = newCloudResourcesExternalIds.map(
        i => newCloudResources[i].id
      );

      this.set(`model.clouds.${data.cloud_id}.${section}`, newCloudResources);

      for (let i = 0; i < oldCloudResourcesIDs.length; i++) {
        if (oldCloudResourcesIDs[i].indexOf(newCloudResourcesIds) === -1) {
          delete this.model[section][oldCloudResourcesIDs[i]];
        }
      }

      for (let i = 0; i < newCloudResourcesIds.length; i++) {
        if (this.model[section][newCloudResourcesIds[i]] === undefined) {
          this.set(
            `model.${section}.${newCloudResourcesIds[i]}`,
            this.model.clouds[data.cloud_id][section][
              newCloudResourcesExternalIds[i]
            ]
          );
          this.linkPaths(
            `model.${section}.${newCloudResourcesIds[i]}`,
            `this.model.clouds.${data.cloud_id}.${section}.${newCloudResourcesExternalIds[i]}`
          );
        }
      }
      this.set(
        `model.sections.${section}.count`,
        Object.keys(this.model[section]).length
      );
    }
  },

  _updateTunnels(data) {
    this.set('model.onboarding.isLoadingTunnels', false);
    return this._updateModel('tunnels', data);
  },

  _updateIncidents(data) {
    this.set('model.onboarding.isLoadingIncidents', false);
    this.set('model.incidentsArray', data);
    return this.set('model.incidents', _generateMap(data, 'incident_id'));
  },

  _updateProjects(data) {
    this.set(
      `model.clouds.${data.cloud_id}.projects`,
      _generateMap(data.projects)
    );
    this.set(`model.clouds.${data.cloud_id}.projectsArray`, data.projects);
  },

  _updateResourceGroups(data) {
    this.set(
      `model.clouds.${data.cloud_id}.resourceGroups`,
      _generateMap(data.resource_groups)
    );
    this.set(
      `model.clouds.${data.cloud_id}.resourceGroupsArray`,
      data.resource_groups
    );
  },

  _updateStorageAccounts(data) {
    this.set(
      `model.clouds.${data.cloud_id}.storageAccounts`,
      _generateMap(data.storage_accounts)
    );
    this.set(
      `model.clouds.${data.cloud_id}.storageAccountsArray`,
      data.storage_accounts
    );
  },

  _updateTags(data) {
    if (Object.keys(data).length)
      console.warn('_updateTags not implemented. Got data', data);
  },

  _loadNotifications(data) {
    // Reverse the array here to display more recent first
    this.set('model.notificationsArray', data.reverse());
  },

  _patchNotifications(data) {
    const _this = this;

    // TODO: Do not replace the entire array. Also take care
    // of reversing the array in a more elegant way.
    const newArray = _this.model.notificationsArray.slice().reverse();
    data.patch.forEach(operation => {
      // apply patch to model
      jsonpatch.applyOperation(newArray, operation, true);

      // display toast and desktop notification if adding
      if (operation.op === 'add' && operation.value.summary) {
        _this.dispatchEvent(
          new CustomEvent('toast', {
            bubbles: true,
            composed: true,
            detail: {
              msg: operation.value.summary,
              duration: 3000,
            },
          })
        );

        let url;
        if (operation.value.resource) {
          url = `/${operation.value.resource._ref.$ref}/${operation.value.resource._ref.$id}`;
        }
        _this.dispatchEvent(
          new CustomEvent('desktop-notification', {
            bubbles: true,
            composed: true,
            detail: {
              title: operation.value.summary,
              body: operation.value.body,
              url,
            },
          })
        );
      }
    });
    _this.set('model.notificationsArray', newArray.reverse());
  },

  _patchStories(data) {
    // TODO: Do not replace the entire array. Also take care
    // of reversing the array in a more elegant way.
    const target = {
      incidents: this.model.incidents,
      sessions: this.model.sessions,
      jobs: this.model.jobs,
      shells: this.model.shells,
    };
    data.forEach(operation => {
      // apply patches to model
      jsonpatch.applyOperation(target, operation, true);
    });
    this.set('model.incidentsArray', Object.values(target.incidents || {}));
    this.notifyPath('model.incidentsArray');
  },
  _machineKeys(machineID, cloudID) {
    // console.log('Update _machineKeys',cloudID,machineID);
    if (machineID && cloudID) {
      const keys = this.model.keysArray.filter(k =>
        k.machines.find(m => m[1] === machineID && m[0] === cloudID)
      );
      return keys || [];
    }
    return [];
  },

  _machineRules(machineID, cloudID) {
    // if something has not initiaised
    if (
      !machineID ||
      !cloudID ||
      !this.model ||
      !this.model.monitoring ||
      !this.model.monitoring.rules ||
      !this.model.clouds ||
      !this.model.clouds[cloudID] ||
      !this.model.clouds[cloudID].machines ||
      !this.model.clouds[cloudID].machines[machineID]
    ) {
      return [];
    }
    const rules = [];
    Object.keys(this.model.monitoring.rules || {}).forEach(rule => {
      if (
        this.model.monitoring.rules[rule].machine === machineID &&
        this.model.monitoring.rules[rule].cloud === cloudID
      ) {
        // add rule only if it's not already added in the machine
        let ruleExists = false;
        if (this.model.clouds[cloudID].machines[machineID].rules) {
          ruleExists = this.model.clouds[cloudID].machines[
            machineID
          ].rules.find(
            r => r.id === this.model.monitoring.rules[rule].id,
            this
          );
        }
        if (!ruleExists) {
          rules.push(this.model.monitoring.rules[rule]);
        }
      }
    });
    return rules;
  },

  cleanUpResources(cloudId) {
    let newImagesArray = [];
    if (cloudId && this.model && this.model.imagesArray) {
      // images
      newImagesArray = this.model.imagesArray.filter(
        im => im.cloud && im.cloud.id !== cloudId
      );
    }
    this.set('model.imagesArray', newImagesArray);
    this.set('model.images', _generateMap(newImagesArray));

    // machines
    this.cleanUpCloudResources(cloudId, 'machines', 'external_id');
    // networks
    this.cleanUpCloudResources(cloudId, 'networks', 'external_id');
    // volumes
    this.cleanUpCloudResources(cloudId, 'volumes', 'external_id');
    // zones
    this.cleanUpCloudResources(cloudId, 'zones', 'external_id');
  },

  cleanUpCloudResources(cloudId, section, externalId) {
    const _this = this;
    const sectionItems = Object.keys(this.model[section]);
    if (this.model && this.model[section]) {
      sectionItems.forEach(resourceId => {
        const resource = _this.model[section][resourceId];
        if (!cloudId || resource.cloud === cloudId) {
          if (
            _this.model.clouds[resource.cloud] &&
            _this.model.clouds[resource.cloud][section] &&
            _this.model.clouds[resource.cloud][section][resource[externalId]]
          )
            delete _this.model.clouds[resource.cloud][section][
              resource[externalId]
            ];
          if (_this.model[section] && _this.model[section][resourceId])
            delete _this.model[section][resourceId];
        }
      });
      this.set(`model.sections.${section}.count`, sectionItems.length);
    }
  },
});
