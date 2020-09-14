import '../node_modules/@polymer/polymer/polymer-legacy.js';
import '../node_modules/sockjs-client/dist/sockjs.min.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
let CSRF_TOKEN = '';
let DEBUG_SOCKET = false;
let STRIPE_PUBLIC_APIKEY = ''
Polymer({
    is: 'mist-socket',
    url: '/socket',
    properties: {
        socket: {
            type: Object,
            value: false
        },
        openRequests: {
            type: Array,
            value: function () { return []; }
        },
        model: {
            type: Object,
            value: function () { return { sections: {}} },
            notify: true
        },
        initialized: {
            type: Boolean,
            value: false
        },
        term: {
            type: Object
        }
    },

    ready: function () {
        // Create the socket if it does not exist
        console.warn('ready');
        if (this.socket)
            return;
        this.connect();
        this.document = document; // suppresses an error message when sending mouse clicks to xterm.js
    },

    connect: function () {
        console.warn('connecting at ', this.url);
        // Create the SockJS object
        this.socket = new SockJS(this.url, null, {
            'transports': ['websocket', 'xhr-polling']
        });

        // Connect the receiver
        var receiver = this.receive.bind(this);
        this.socket.onmessage = function (e) {
            receiver(e.data);
        };

        var that = this;

        // Handle error & close
        this.socket.onerror = function () {
            console.warn('CONNECTION ERROR');
            that.async(that.connect, 1000);
        };
        this.socket.onclose = function () {
            console.warn('CONNECTION CLOSED');
            that.async(that.connect, 1000);
        };
        this.socket.onheartbeat = this.heartbeat;

        // When socket connects prepare channels
        this.socket.onopen = function () {
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
                patch_model: function (data) {
                    that._patchModel(data);
                },
                list_clouds: function (data) {
                    console.warn(that.model.pending)
                    that._updateClouds(data);
                },
                list_keys: function (data) {
                    that._updateKeys(data);
                },
                list_scripts: function (data) {
                    that._updateScripts(data);
                },
                list_schedules: function (data) {
                    that._updateSchedules(data);
                },
                list_templates: function (data) {
                    that._updateTemplates(data);
                },
                list_stacks: function (data) {
                    that._updateStacks(data);
                },
                list_machines: function (data) {
                    that._updateMachines(data);
                },
                list_rules: function (data) {
                    that._updateRules(data);
                },
                list_images: function (data) {
                    that._updateImages(data);
                },
                list_sizes: function (data) {
                    that._updateSizes(data);
                },
                list_locations: function (data) {
                    that._updateLocations(data);
                },
                list_networks: function (data) {
                    that._updateNetworks(data);
                },
                list_volumes: function (data) {
                    that._updateVolumes(data);
                },
                list_zones: function (data) {
                    that._updateZones(data);
                },
                list_tunnels: function (data) {
                    that._updateTunnels(data);
                },
                list_projects: function (data) {
                    that._updateProjects(data);
                },
                list_resource_groups: function (data) {;
                    that._updateResourceGroups(data);
                },
                list_storage_accounts: function (data) {;
                    that._updateStorageAccounts(data);
                },
                list_tags: function (data) {
                    that._updateTags(data);
                },
                monitoring: function (data) {
                    that._updateMonitoring(data);
                },
                reload: function (data) {
                    that._reloadPage(data);
                },
                user: function (data) {
                    that._updateUser(data);
                },
                org: function (data) {
                    console.info('Loaded org data');
                    that._updateOrg(data);
                },
                logout: function (data) {
                    document.location.pathname = '/';
                },
                stats: function (data) {
                    if (!that.openRequests[data.request_id])
                        console.warn('cannot find open request', data.request_id)
                    else {
                        that.openRequests[data.request_id](data);
                        delete that.openRequests[data.request_id];
                    }
                },
                notifications: function (data) {
                    that.debounce(
                        'loadNotifications',
                        function () {
                            that._loadNotifications(data)
                        },
                        function () {
                            console.debug('Loaded notifications list data');
                        },
                        250
                    );
                },
                patch_notifications: function (data) {
                    that._patchNotifications(data);
                    console.debug('Applied notifications patch');
                }
            },
            shell: {
                shell_data: function (data) {
                    if (that.term) {
                        that.term.write(data);
                    } else {
                        console.warn(
                            'received shell data from socket but the terminal is not open',
                            data);
                    }
                }
            },
            logs: {
                logs: function (data) {
                    console.warn('received log entries from socket', data);
                },
                event: function (data) {
                    if (DEBUG_SOCKET)
                        console.debug('received log event', data);
                    that.fire('forward-log', data);
                },
                incidents: function (data) {
                    if (DEBUG_SOCKET)
                        console.debug('got incidents', data);
                    that.debounce(that._updateIncidents(data), function () {
                        console.debug('Loaded incidents data');
                    }, 250);
                },
                jobs: function (data) {
                    if (DEBUG_SOCKET)
                        console.debug('got jobs', data);
                    that.set('model.jobs', _generateMap(data, 'story_id'));
                },
                sessions: function (data) {
                    if (DEBUG_SOCKET)
                        console.debug('got sessions', data);
                    that.set('model.sessions', _generateMap(data, 'story_id'));
                },
                shells: function (data) {
                    if (DEBUG_SOCKET)
                        console.debug('got shells', data);
                    that.set('model.shells', _generateMap(data, 'story_id'));
                },
                patch_stories: function (data) {
                    that._patchStories(data);
                    console.warn('Applied stories patch');
                }
            }
        };
    },

    heartbeat: function () {
        console.debug('got heartbeat');
        var _this = this;
        requestIdleCallback(function () {
            _this.send('h'); // reply with empty frame
        }, {
            timeout: 5000
        });
    },

    getStats: function (data, callback) {
        // console.log('getStats', data);
        var reqId = this.generateGuid(); // Math.floor(10000 * Math.random());
        data[5] = reqId;
        this.openRequests[reqId] = callback;
        this.send('msg', 'main', 'stats', data);
    },

    generateGuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    send: function (type, namespace, body, params) {
        if (namespace == undefined)
            namespace = 'main';

        var payload = type + ',' + namespace;

        if (body !== undefined)
            payload += ',' + body;

        if (params !== undefined)
            payload += ',' + JSON.stringify(params);

        this.socket.send(payload);
        if (DEBUG_SOCKET)
            console.debug('SENT: ' + payload);
    },

    receive: function (message) {
        if (DEBUG_SOCKET)
            console.debug('RECEIVED: ' + message);

        var parts = message.split(',');
        var type = parts[0],
            namespace = parts[1];
        var body = JSON.parse(parts.splice(2).join(','));
        if (this.handlers[namespace] === undefined)
            console.warn('Unknown namespace', namespace);
        var endpoint = this.handlers[namespace][Object.keys(body)[0].trim()];
        if (endpoint === undefined)
            console.warn('Unknown endpoint', Object.keys(body)[0], 'in namespace', namespace);
        else
            endpoint(body[Object.keys(body)[0]]);
    },

    _reloadPage: function (data) {
        console.warn('reloading', data);
        document.location.reload();
    },

    _patchModel: function (patch) {
        var _this = this;
        patch.forEach(function(operation) {
            var idleCallbackId = requestIdleCallback(function () {
                var cloud_id, resource_type, resource_id, resource_external_id, path, property_path, old_cloud_resource_external_ids, old_cloud_resource_ids;

                // Let's figure out if the patch applies to a cloud and which one
                if (operation.path.search('/clouds/') > -1) {
                    path = operation.path.split('/clouds/')[1].split('/');
                    cloud_id = path[0];

                    // console.log('DEBUG 1 - search cloud', path, cloud_id);

                    // We're patching cloud resources, let's figure out the resource type and keep aside the cloud resource ids before the patch
                    if (['machines', 'networks', 'volumes', 'zones'].indexOf(path[1]) > -1) {
                        resource_type = path[1];
                        path = operation.path.split('/' + resource_type + '/')[1].split('/');
                        resource_external_id = path[0];
                        property_path = operation.path.split(resource_external_id)[1].replace(/\//g, '.');


                        // console.log('DEBUG 2 - resources of cloud', path, cloud_id);


                        if (_this.model.clouds && _this.model.clouds[cloud_id]) {
                            old_cloud_resource_external_ids = Object.keys(_this.model.clouds[cloud_id][resource_type] || {}) || [];
                            old_cloud_resource_ids = old_cloud_resource_external_ids.map(i => _this.model.clouds[cloud_id][resource_type][i].id);

                            // console.log('DEBUG 3 - old ids', old_cloud_resource_external_ids, old_cloud_resource_ids);

                        }
                    }
                }

                // Apply patch operation to the model

                try {
                    jsonpatch.applyOperation(_this.model, operation, true);
                } catch(error) {
                    if (DEBUG_SOCKET)
                        console.error("jsonpatch applyOperation error", error);
                }

                if (resource_type && cloud_id && _this.model.clouds && _this.model.clouds[cloud_id] && _this.model.clouds[cloud_id][resource_type]) {
                    var new_cloud_resources = _this.model.clouds[cloud_id][resource_type],
                        new_cloud_resource_external_ids = Object.keys(new_cloud_resources),
                        new_cloud_resource_ids = new_cloud_resource_external_ids.map(i => new_cloud_resources[i].id);


                        // console.log('DEBUG 4 -  new ids', new_cloud_resources, new_cloud_resource_external_ids, new_cloud_resource_ids);

                    // Cleanup deleted resource refs
                    for (var i=0; i < old_cloud_resource_ids.length; i++) {
                        if (new_cloud_resources[old_cloud_resource_external_ids[i]] == undefined
                            && _this.model[resource_type][old_cloud_resource_ids[i]] != undefined) {
                            _this.set('model.' + resource_type + '.' + old_cloud_resource_ids[i], null);
                            _this.notifyPath('model.' + resource_type + '.' + old_cloud_resource_ids[i]);
                            delete _this.model[resource_type][old_cloud_resource_ids[i]];
                        }
                    }

                    // Link paths of new resources for easy global lookup
                    for (var i=0; i < new_cloud_resource_ids.length; i++) {
                        if (_this.model[resource_type][new_cloud_resource_ids[i]] == undefined) {
                            _this.set('model.' + resource_type + '.' + new_cloud_resource_ids[i], _this.model.clouds[cloud_id][resource_type][new_cloud_resource_external_ids[i]]);
                            _this.linkPaths('model.'+ resource_type + '.' + new_cloud_resource_ids[i], 'model.clouds.' + cloud_id + '.' + resource_type + '.' + new_cloud_resource_external_ids[i]);
                        }
                    }

                    if (property_path && _this.model.clouds[cloud_id][resource_type][resource_external_id]) {
                        var resource_global_path = 'model.' + resource_type + '.' + _this.model.clouds[cloud_id][resource_type][resource_external_id].id,
                            property_global_path =  resource_global_path + property_path,
                            resource_local_path = 'model.clouds.' + cloud_id + '.' + resource_type + '.' + resource_external_id,
                            property_local_path = resource_local_path + property_path;

                        if (_this.get(property_global_path) && _this.get(property_global_path) == _this.get(property_local_path)) {
                            _this.notifyPath(property_global_path);
                        } else {
                            _this.set(resource_global_path, _this.get(resource_local_path));
                        }

                        // Check if we need to notify a subpath e.g. when updating records of a zone
                        var property_sub_path = property_path.split('.');
                        property_sub_path.pop();
                        if (property_sub_path.length > 1) {
                            property_sub_path = property_sub_path.join('.');
                            property_sub_path = 'model.' + resource_type + '.' + _this.model.clouds[cloud_id][resource_type][resource_external_id].id + property_sub_path
                            setTimeout(function() {
                                _this.notifyPath(property_sub_path);
                            }, 50);
                        }
                    }
                    _this.notifyPath('model.' + resource_type);
                    _this.set('model.sections.' + resource_type + '.count', Object.keys(_this.model[resource_type]).length);
                }
            }, {
                timeout: 500
            });
        });
    },

    _updateModel: function (section, data, primaryField) {
        if (this.model) {
            var changed = false, // we wont update the model if it hasn't changed
                pending = this.get('model.pending.' + section);

            // if the received data array has different length than the respective
            // model array, then things must have changed since last update
            if (data.length != this.get('model.' + section + 'Array.length')) {
                // console.debug('0. length', data.length, this.get('model.' + section + 'Array.length'));
                changed = true;
            }
            // debugger;
            // For each item in the received data array
            for (var i = 0; i < data.length; i++) {
                // If we know things have changed no need to keep checking
                if (changed)
                    break;
                // check if _id is used instead of id
                if (!data[i].id) {
                    data[i].id = data[i]._id
                }
                // Check if item exists in respective model
                // var item = this.get('model.' + section + '.' + data[i].id);
                // patch for when data[i].id is of type '127.0.0.1'
                var path = this.get('model.' + section);
                var item = path[data[i].id];
                if (!item) { // If does not exist then model needs to be updated
                    // console.debug('1. data[i].id', data[i], this.get('model.' + section + '.' + data[i].id));
                    changed = true;
                    break;
                }

                // check if all fields of the data item exist in the model item
                var dataKeys = Object.keys(data[i]),
                    modelKeys = Object.keys(item);

                for (var k = 0; k < dataKeys.length; k++) {
                    // Do not update model just for the last_seen property
                    if (dataKeys[k] == 'last_seen') {
                        continue;
                    }
                    if (modelKeys.indexOf(dataKeys[k]) == -1) {
                        // If something is missing the model needs to be updated
                        console.debug('2. model', modelKeys.indexOf(dataKeys[k]), dataKeys[k]);
                        changed = true;
                        break;
                    }
                    // If some field changed the model needs to be updated
                    if (data[i][dataKeys[k]] != undefined && JSON.stringify(data[i][dataKeys[k]])
                        .localeCompare(JSON.stringify(item[dataKeys[k]]))) {
                        // console.debug('localeCompare',JSON.stringify(data[i][dataKeys[k]]).localeCompare(JSON.stringify(item[dataKeys[k]])));
                        console.debug('property ', dataKeys[k], ' changed in ', item);
                        var oldVal = JSON.stringify(item[dataKeys[k]]),
                            newVal = JSON.stringify(data[i][dataKeys[k]]);
                        console.debug('Old value: ', oldVal, oldVal.length);
                        console.debug('New value: ', newVal, newVal.length);
                        changed = true;
                        break;
                    }
                }

                if (changed)
                    break;
            }

            if (changed) {
                console.debug('updating', section);
                this.set('model.' + section, _generateMap(data, primaryField));
                this.set('model.' + section + 'Array', data);
            } else {
                if (DEBUG_SOCKET)
                    console.debug('no need to update', section);
            }

            if (this.model.sections[section] && this.model.sections[section].count != (data.length || 0)) {
                // update section count, necessary for propagating changes to sidebar & dashboard counters
                this.set('model.sections.' + section + '.count', data.length || 0);
                console.log('update model', section, this.model.sections[section].count);
            }

            if (pending) {
                this.set('model.pending.' + section, false);
            }

            return changed;
        }
        return false;
    },

    _updateClouds: function (data) {
        // console.log('_updateClouds', data);
        if (data.length && this.get('model.onboarding.hasCloud') != true)
            this.set('model.onboarding.hasCloud', true);
        if (!data.length) {
            this.set('model.onboarding.hasCloud', false);
            this.set('model.onboarding.isLoadingMachines', false);
            this.set('model.onboarding.isLoadingImages', false);
            this.set('model.onboarding.isLoadingNetworks', false);
        }
        var ret = this._updateModel('clouds', data);
        this.set('model.onboarding.isLoadingClouds', false);

        if (this.model && this.model.clouds && data) {
            // console.log('_updateClouds - in clean up loop');
            data.forEach(function (c) {
                this.cleanUpResources(c.id);
            }, this)
        }
        if (!data || this.model.cloudsArray.length == 0) {
            // console.log('_updateClouds - in clean up resources');
            this.cleanUpResources();
        }

        // the case when clouds have loaded but handlers list_machines/list_images/list_networks
        // have never been triggered (ex. all clouds are disabled, list_machines never gets data)
        var cloudsResources = !(!this.model.machines && !this.model.networks && !this.model.images);
        if (data.length && !cloudsResources && ret)
            cloudsResources = data.map(function (d) {
                return d.machines || d.images || d.networks ? true : false;
            }).reduce(function (b1, b2) {
                return b1 || b2;
            });
        if (!cloudsResources) {
            this.set('model.onboarding.isLoadingMachines', false);
            this.set('model.onboarding.isLoadingImages', false);
            this.set('model.onboarding.isLoadingNetworks', false);
        }
        return ret;
    },

    _updateMonitoring: function (data) {
        console.warn('got monitoring', data);
        if (data.length && this.get('model.onboarding.hasMonitoring') != true)
            this.set('model.onboarding.hasMonitoring', true);
        if (!data) //data is an Object
            this.set('model.onboarding.hasMonitoring', false);
        this.set('model.pending.monitoring', false);
        // inform machines that have rules
        if (data.rules) {
            for (var rule in data.rules) {
                if (rule.cloud && rule.machine && this.model.clouds[rule.cloud] && this.model.clouds[rule.cloud].machines[rule.machine]) {
                    if (!this.get('model.clouds.' + rule.cloud + '.machines.' + rule.machine + '.rules')) {
                        this.set('model.clouds.' + rule.cloud + '.machines.' + rule.machine + '.rules', [
                            rule
                        ])
                        // console.log('// inform machines that have rules ', rule.cloud, rule.machine, this.model.clouds[rule.cloud].machines[rule.machine].rules);
                    } else
                        this.push('model.clouds.' + rule.cloud + '.machines.' + rule.machine + '.rules',
                            rule)
                }
            }
        }
        this._updateRules(data.rules);
        return this.set('model.monitoring', data);
    },

    _updateUser: function (data) {
        this.set('model.user', data);
        if (data) {
            CSRF_TOKEN = data.csrf_token;
            STRIPE_PUBLIC_APIKEY = data.stripe_public_apikey;
        }
    },

    _updateOrg: function (data) {
        this.set('model.onboarding.isLoadingTeams', false);
        this._updateModel('teams', data.teams);
        this._updateModel('members', data.members);
        data.teams = data.members = undefined;
        this.set('model.org', data);
    },

    _updateKeys: function (data) {
        var _this = this;
        this.set('model.onboarding.isLoadingKeys', false);
        this.fire('update-keys');
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var key = data[i];
                if (this.model.clouds && key.machines) {
                    key.machines.forEach(function (m, index) {
                        var cloud = m[0],
                            machine = m[1],
                            last_used = m[2],
                            user = m[3],
                            sudo = m[4],
                            port = m[5];
                        if (this.model.clouds && this.model.clouds[cloud] &&
                            this.model.clouds[cloud].machines &&
                            this.model.clouds[cloud].machines[machine]) {
                            // check if machine has this key, if not add
                            var keyIndex = this.model.clouds[cloud].machines[machine].key_associations
                                .findIndex(
                                    function (k) {
                                        return k.key == key.id && k.ssh_user == user && k.port ==
                                            port;
                                    });
                            if (keyIndex > -1) {
                                this.set('model.clouds.' + cloud + '.machines.' + machine +
                                    '.key_associations.' + keyIndex, {
                                        'key': key.id,
                                        'last_used': last_used,
                                        'port': port,
                                        'ssh_user': user
                                    });
                            } else {
                                var mid = this.model.clouds[cloud].machines[machine].id;
                                this.push(
                                    'model.machines.' + mid + '.key_associations', {
                                        'key': key.id,
                                        'last_used': last_used,
                                        'port': port,
                                        'ssh_user': user
                                    }
                                )
                            }
                        }
                    }, this)
                }

                // remove disassociated keys from machines
                var machine_ids = [];
                if (this.model && this.model.machines)
                    machine_ids = Object.keys(this.model.machines);
                machine_ids.forEach(function (m, index) {
                    var associationIndexMachine, associationIndexKey, machine = _this.model.machines[m];
                    associationIndexMachine = machine && machine.key_associations.findIndex(function (k) {
                        return k.key == key.id;
                    }) || -1;
                    if (associationIndexMachine > -1) {
                        associationIndexKey = key.machines.findIndex(function (ka) {
                            return ka[0] == machine.cloud && ka[1] == machine.machine_id && ka[3] ==
                                machine.key_associations[associationIndexMachine].ssh_user &&
                                ka[5] == machine.key_associations[associationIndexMachine].port;
                        });
                        if (associationIndexKey == -1) {
                            _this.model.machines[m].key_associations.splice(
                                associationIndexMachine, 1);
                        }
                    }
                });
            }


        }
        return this._updateModel('keys', data);
    },

    _updateScripts: function (data) {
        this.set('model.onboarding.isLoadingScripts', false);
        return this._updateModel('scripts', data);
    },

    _updateRules: function (data) {
        var rulesArray = [];
        for (var p in data) {
            data[p].id = p;
            rulesArray.push(data[p]);
        }
        this._updateModel('rules', rulesArray);
        // return this._updateModel('rules', data);
    },

    _updateSchedules: function (data) {
        this.set('model.onboarding.isLoadingSchedules', false);
        return this._updateModel('schedules', data);
    },

    _updateTemplates: function (data) {
        this.set('model.onboarding.isLoadingTemplates', false);
        return this._updateModel('templates', data);
    },

    _updateStacks: function (data) {
        this.set('model.onboarding.isLoadingStacks', false);
        return this._updateModel('stacks', data);
    },

    _updateSizes: function (data) {
        return this._updateModel('clouds.' + data.cloud_id + '.sizes', data.sizes);
    },

    _updateLocations: function (data) {
        return this._updateModel('clouds.' + data.cloud_id + '.locations', data.locations);
    },

    _updateImages: function (data) {
        // console.log('_updateImages');
        this.set('model.onboarding.isLoadingImages', false);
        var changed = this._updateModel('clouds.' + data.cloud_id + '.images', data.images);
        if (!changed)
            return false;

        var self = this;
        var allImages = [];
        if (this.model != undefined) {
            this.model.cloudsArray.forEach(
                function (cloud) {
                    if (cloud.imagesArray != undefined && cloud.enabled) {
                        cloud.imagesArray.forEach(function (image, index, arr) {
                            arr[index].cloud = {
                                'id': cloud.id,
                                'title': cloud.title,
                                'provider': cloud.provider
                            };
                            self.model.imagesArray.push(arr[index])
                        });
                    }
                    return allImages = allImages.concat(cloud.imagesArray != undefined ? cloud.imagesArray :
                        [])
                });
        }

        this.set('model.imagesArray', allImages);
        this.set('model.images', _generateMap(allImages));
        // update section count, necessary for propagating changes to sidebar & dashboard counters
        this.set('model.sections.images.count', allImages.length);
    },

    _updateMachines: function (data) {
        this.set('model.onboarding.isLoadingMachines', false);
        this._updateCloudResources(data, 'machines', 'machine_id');
    },

    _updateNetworks: function (data) {
        this.set('model.onboarding.isLoadingNetworks', false);
        this._updateCloudResources(data, 'networks', 'network_id');
    },

    _updateVolumes: function (data) {
        // console.log('UPDATE VOLUMES', data);
        this._updateCloudResources(data, 'volumes', 'external_id')
    },

    _updateZones: function (data) {
        this.set('model.onboarding.isLoadingNetworks', false);
        this._updateCloudResources(data, 'zones', 'zone_id');
    },

    _updateCloudResources: function (data, section, externalId) {
        if (this.model && this.model.clouds && this.model.clouds[data.cloud_id]) {
            if (this.model.clouds[data.cloud_id][section] == undefined)
                this.model.clouds[data.cloud_id][section] = {};
            var old_cloud_resources_external_ids = Object.keys(this.model.clouds[data.cloud_id][section]),
                old_cloud_resources_ids = old_cloud_resources_external_ids.map(i => this.model.clouds[data.cloud_id][section][i].id),
                new_cloud_resources = data[section].reduce((map, obj) => (map[obj[externalId]] = obj, map), {}),
                new_cloud_resources_external_ids = Object.keys(new_cloud_resources),
                new_cloud_resources_ids = new_cloud_resources_external_ids.map(i => new_cloud_resources[i].id); 

            this.set('model.clouds.' + data.cloud_id + '.' + section, new_cloud_resources);

            for (var i=0; i<old_cloud_resources_ids.length; i++) {
                if (old_cloud_resources_ids[i].indexOf(new_cloud_resources_ids) == -1) {
                    delete this.model[section][old_cloud_resources_ids[i]];
                }
            }

            for (var i=0; i < new_cloud_resources_ids.length; i++) {
                if (this.model[section][new_cloud_resources_ids[i]] == undefined) {
                    this.set('model.' + section + '.' + new_cloud_resources_ids[i], this.model.clouds[data.cloud_id][section][new_cloud_resources_external_ids[i]]);
                    this.linkPaths('model.'+ section + '.' + new_cloud_resources_ids[i], 'this.model.clouds.' + data.cloud_id + '.' + section + '.' + new_cloud_resources_external_ids[i]);
                }
            }
            this.set('model.sections.' + section + '.count', Object.keys(this.model[section]).length);
        }
    },        

    _updateTunnels: function (data) {
        this.set('model.onboarding.isLoadingTunnels', false);
        return this._updateModel('tunnels', data);
    },

    _updateIncidents: function (data) {
        this.set('model.onboarding.isLoadingIncidents', false);
        this.set('model.incidentsArray', data);
        return this.set('model.incidents', _generateMap(data, 'incident_id'));
    },

    _updateProjects: function (data) {
        this.set('model.clouds.' + data.cloud_id + '.projects', _generateMap(data.projects));
        this.set('model.clouds.' + data.cloud_id + '.projectsArray', data.projects);
    },

    _updateResourceGroups: function (data) {
        this.set('model.clouds.' + data.cloud_id + '.resourceGroups', _generateMap(data.resource_groups));
        this.set('model.clouds.' + data.cloud_id + '.resourceGroupsArray', data.resource_groups);
    },

    _updateStorageAccounts: function (data) {
        this.set('model.clouds.' + data.cloud_id + '.storageAccounts', _generateMap(data.storage_accounts));
        this.set('model.clouds.' + data.cloud_id + '.storageAccountsArray', data.storage_accounts);
    },

    _updateTags: function (data) {
        if (Object.keys(data).length)
            console.warn('_updateTags not implemented. Got data', data);
    },

    _loadNotifications: function (data) {
        // Reverse the array here to display more recent first
        this.set('model.notificationsArray', data.reverse());
    },

    _patchNotifications: function (data) {
        var _this = this;

        // TODO: Do not replace the entire array. Also take care
        // of reversing the array in a more elegant way.
        var newArray = _this.model.notificationsArray.slice().reverse();
        data.patch.forEach(function (operation) {
            // apply patch to model
            jsonpatch.applyOperation(newArray, operation, true);

            // display toast and desktop notification if adding
            if (operation.op == "add" && operation.value.summary) {
                _this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
                    msg: operation.value.summary,
                    duration: 3000
                } }));

                var url;
                if (operation.value.resource) {
                    url = '/' + operation.value.resource._ref.$ref + '/' + operation.value.resource
                        ._ref.$id;
                }
                _this.dispatchEvent(new CustomEvent('desktop-notification', { bubbles: true, composed: true, detail: {
                    "title": operation.value.summary,
                    "body": operation.value.body,
                    "url": url
                } }));

            }
        });
        _this.set('model.notificationsArray', newArray.reverse());
    },

    _patchStories: function (data) {
        var _this = this;

        // TODO: Do not replace the entire array. Also take care
        // of reversing the array in a more elegant way.
        var target = {
            incidents: this.model.incidents,
            sessions: this.model.sessions,
            jobs: this.model.jobs,
            shells: this.model.shells
        };
        data.forEach(function (operation) {
            // apply patches to model
            jsonpatch.applyOperation(target, operation, true);
        });
        this.set('model.incidentsArray', Object.values(target.incidents || {}));
        this.notifyPath('model.incidentsArray');
    },
    _machineKeys: function (machineID, cloudID) {
        // console.log('Update _machineKeys',cloudID,machineID);
        if (machineID && cloudID) {
            var keys = this.model.keysArray.filter(function (k) {
                return k.machines.find(function (m) {
                    return m[1] == machineID && m[0] == cloudID;
                })
            });
            return keys || [];
        }
    },

    _machineRules: function (machineID, cloudID) {
        // if something has not initiaised
        if (!machineID || !cloudID || !this.model || !this.model.monitoring || !this.model.monitoring.rules ||
            !this.model.clouds || !this.model.clouds[cloudID] || !this.model.clouds[cloudID].machines ||
            !this.model.clouds[cloudID].machines[machineID]) {
            return [];
        } else {
            var rules = [];
            for (var rule in this.model.monitoring.rules) {
                if (this.model.monitoring.rules[rule].machine == machineID && this.model.monitoring.rules[
                        rule].cloud == cloudID) {
                    //add rule only if it's not already added in the machine
                    var ruleExists = false;
                    if (this.model.clouds[cloudID].machines[machineID].rules) {
                        var ruleExists = this.model.clouds[cloudID].machines[machineID].rules.find(
                            function (r) {
                                return r.id == this.model.monitoring.rules[rule].id
                            }, this);
                    }
                    if (!ruleExists) {
                        rules.push(this.model.monitoring.rules[rule]);
                    }
                }
            }
            return rules;
        }
    },

    cleanUpResources: function (cloud_id) {
        var newImagesArray = [],
            _this = this;
        if (cloud_id && this.model && this.model.imagesArray) {
            // images
            newImagesArray = this.model.imagesArray.filter(function (im) {
                return im.cloud && im.cloud.id != cloud_id;
            });
        }
        this.set('model.imagesArray', newImagesArray);
        this.set('model.images', _generateMap(newImagesArray));

        // machines
        this.cleanUpCloudResources(cloud_id, 'machines', 'machine_id');
        // networks
        this.cleanUpCloudResources(cloud_id, 'networks', 'network_id');
        // volumes
        this.cleanUpCloudResources(cloud_id, 'volumes', 'external_id');
        // zones
        this.cleanUpCloudResources(cloud_id, 'zones', 'zone_id');
    },

    cleanUpCloudResources: function(cloud_id, section, externalId) {
        var _this = this;
        var sectionItems = Object.keys(this.model[section]);
        if (this.model && this.model[section]) {
            sectionItems.forEach(function(resource_id) {
                var resource = _this.model[section][resource_id];
                if (!cloud_id || resource.cloud == cloud_id) {
                    if (_this.model.clouds[resource.cloud] && _this.model.clouds[resource.cloud][section] && _this.model.clouds[resource.cloud][section][resource[externalId]])
                        delete _this.model.clouds[resource.cloud][section][resource[externalId]];
                    if (_this.model[section] && _this.model[section][resource_id])
                        delete _this.model[section][resource_id];
                }
            });
            this.set('model.sections.' + section + '.count', sectionItems.length);
        }
    }
});

function _generateMap(list, field) {
    var out = {};
    if (field == undefined) {
        field = 'id';
    }
    for (var i = 0; i < list.length; i++) {
        out[list[i][field]] = list[i];
    }
    // console.log('generate map', list, field, JSON.stringify(out));
    return out;
}
