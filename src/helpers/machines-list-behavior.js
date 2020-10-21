import '../../node_modules/@polymer/polymer/polymer-legacy.js';
/**
* Behavior that defines the machine list columns
*
* @polymerBehavior
*/
export const machinesListBehavior = {
    properties: {},
    _getFrozenColumn() {
        return ['name'];
    },

    _getVisibleColumns() {
        const ret = ['state', 'cloud', 'cost', 'created', 'created_by', 'tags', 'image_id', 'size', 'location', 'hostname', 'public_ips'];
        if (this.model.org && this.model.org.ownership_enabled == true)
            ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
        // console.log('parent sets visible', ret);
        return ret;
    },

    _getRenderers() {
        const _this = this;
        return {
            'indicator': {
                'body': function(item, row) {
                    const green = "#69b46c";
                        const pending = "#eee";
                        const red = "#d96557";
                        let color = 'transparent';
                    // 'background:  repeating-linear-gradient(-45deg,#ddd,#ddd 2px,#eee 2px,#eee 4px);'
                    if (row.monitoring && row.monitoring.hasmonitoring) {
                        color = green;
                        if (_this._machineHasIncidents(row, _this.model.incidentsArray))
                            color = red;
                        if (row.monitoring.installation_status == "installing" || !row.monitoring
                            .installation_status == "installing" || !row.monitoring.installation_status
                            .activated_at)
                            color = pending;
                        return `border-left: 8px solid ${  color  }; padding-left: 8px;`;
                    }
                    return '';
                }
            },
            'icon': {
                'body': function(item, row) {
                    if (!_this.model.clouds[row.cloud])
                        return '';
                    return `./assets/providers/provider-${  _this.model.clouds[row.cloud].provider.replace("_", "")
                        .replace(" ", "")  }.png`;
                }
            },
            'name': {
                'body': function(item, row) {
                    return `<strong class="name">${  item  }</strong>`;
                }
            },
            'state': {
                'body': function(item, row) {
                    let ret = '';
                        let prefix = '';
                    if (_this.itemRecommendation(row)) {
                        prefix =
                            '<iron-icon icon="icons:report-problem" class="recommendation-icon"></iron-icon>';
                    }
                    if (item == "running")
                        ret += `<div class='state ${  _this.itemProbeClasses(row) 
                        }'><span class='green'>${  item  }</span></div>`;
                    else if (item == "error")
                        ret += `<div class='state ${  _this.itemProbeClasses(row) 
                        }'><span class='error'>${  item  }</span></div>`;
                    else if (item == "stopped")
                        ret += `<div class='state ${  _this.itemProbeClasses(row) 
                        }'><span class='orange'>${  item  }</span></div>`;
                    else
                        ret += `<div class='state'>${  item  }</span>`;

                    return prefix + ret;
                },
                'cmp': function(item1, item2, row1, row2) {
                    if (row1.monitoring && !row2.monitoring) {
                        return -1;
                    } if (!row1.monitoring && row2.monitoring) {
                        return 1;
                    }
                    return 0; // item1.localeCompare(item2);
                }
            },
            'cloud': {
                'body': function(item, row) {
                    if (_this.model && _this.model.clouds)
                        return _this.model.clouds[item] ? _this.model.clouds[item].title :
                            '';
                },
                'cmp': function(item1, item2, row1, row2) {
                    if (_this.model && _this.model.clouds && _this.model.clouds[item1.id] &&
                        _this.model.clouds[item2.id]) {
                        if (_this.model.clouds[item1.id].title < _this.model.clouds[item2.id].title)
                            return -1;
                        if (_this.model.clouds[item1.id].title > _this.model.clouds[item2.id].title)
                            return 1;
                    }
                    return 0;
                }
            },
            'cost': {
                'body': function(item, row) {
                    const cost = parseFloat(item.monthly) * _this.currency.rate;
                    return item && item.monthly ? _this.currency.sign + cost.formatMoney(0) : '';
                },
                'cmp': function(item1, item2, row1, row2) {
                    if (item1.monthly < item2.monthly)
                        return -1;
                    if (item1.monthly > item2.monthly)
                        return 1;
                    return 0;
                }
            },
            'owned_by': {
                'title': function(item, row) {
                    return 'owner';
                },
                'body': function(item, row) {
                    return _this.model.members[item] ? _this.model.members[item].name || _this.model.members[item].email  || _this.model.members[item].username : '';
                }
            },
            'created_by': {
                'title': function(item, row) {
                    return 'created by';
                },
                'body': function(item, row) {
                    return _this.model.members[item] ? _this.model.members[item].name || _this.model.members[item].email || _this.model.members[item].username : '';
                }
            },
            'created': {
                'body': function(item, row) {
                    return moment(item).isValid() ? moment.utc(item).fromNow() : "";
                }
            },
            'size': {
                'body': function(item, row) {
                    return _this.computeSize(row, item);
                },
                'cmp': function(item1, item2, row1, row2) {
                    const s1 = _this.computeSize(row1, item1);
                        const s2 = _this.computeSize(row2, item2);

                    if (!s1.length && !s2.length)
                        return 0;
                    if (!s1.length)
                        return 1;
                    if (!s2.length)
                        return -1;

                    if (s1.toLowerCase() < s2.toLowerCase())
                        return -1;
                    if (s1.toLowerCase() > s2.toLowerCase())
                        return 1;
                    return 0;

                }
            },
            'image_id': {
                'title': function(item, row) {
                    return 'image';
                },
                'body': function(item, row) {
                    return _this._computeImage(row, item);
                },
                'cmp': function(item1, item2, row1, row2) {
                    const im1 = _this._computeImage(row1, item1);
                        const im2 = _this._computeImage(row2, item2);

                    if (!im1.length && !im2.length)
                        return 0;
                    if (!im1.length)
                        return 1;
                    if (!im2.length)
                        return -1;

                    if (im1.toLowerCase() < im2.toLowerCase())
                        return -1;
                    if (im1.toLowerCase() > im2.toLowerCase())
                        return 1;
                    return 0;
                }
            },
            'location': {
                'body': function(item, row) {
                    if (_this.model && _this.model.clouds && _this.model.clouds[row.cloud] &&
                        _this.model.clouds[row.cloud].locations)
                        var location = _this.model.clouds[row.cloud].locations[item];
                    return location ? location.name : item || '';
                }
            },
            'tags': {
                'body': function(item, row) {
                    const tags = item;
                        let display = "";
                    for (key in tags) {
                        display += `<span class='tag'>${  key}`;
                        if (tags[key] != undefined && tags[key] != "")
                            display += `=${  tags[key]}`;
                        display += "</span>";
                    }
                    return display;
                }
            },
            'machine_id': {
                'title': 'id (external)',
                'body': function(i) {
                    return i;
                }
            },
            'public_ips': {
                'title': 'public ip\'s',
                'body': function(ips) {
                    return ips && ips.join(', ');
                }
            },
            'private_ips': {
                'title': 'private ip\'s',
                'body': function(ips) {
                    return ips.join(', ');
                }
            },
            'hostname': {
                'body': function(hostname) {
                    return hostname || '';
                }
            }
        }
    },

    _computeImage(row, item) {
        // FIXME This needs to be standarized in the backend to remove the cruft below
        let image_id = item;

        if (!image_id && row.extra && row.extra.image) {
            if (row.extra.image.distribution && row.extra.image.name) {
                return `${row.extra.image.distribution  } ${  row.extra.image.name}`;
            }
            image_id = row.extra.image;
        }
        if (!image_id && row.extra) {
            image_id = row.extra.image_id || row.imageId || (row.extra.image && (row.extra.image
                .slug || row.extra.image.name));
        }

        if (image_id && row.cloud.id && this.model.clouds[row.cloud.id] && this.model.clouds[row.cloud
                .id].images && this.model.clouds[row.cloud.id].images[image_id]) {
            return this.model.clouds[row.cloud.id].images[image_id].name
        }

        return image_id || "";
    },

    computeSize(row, item) {
        // FIXME This needs to be standarized in the backend to remove the cruft below
        let size_id = item;


        // Try to figure out size_id
        if (row.size && typeof(row.size) !== 'object') {
            size_id = row.size || '';
        }

        if (!size_id && row.extra) {
            if (row.extra.size && typeof(row.extra.size) === 'string') {
                size_id = row.extra.size;
            } else {
                size_id = row.extra.instance_type || row.extra.instance_size || row.extra.service_type ||
                    row.extra.PLANID;
            }
        }

        // Given size_id, try to figure out actual size name
        if (size_id && this.model.clouds && this.model.clouds[row.cloud.id] && this.model.clouds[
                row.cloud.id].sizes && this.model.clouds[
                row.cloud.id].sizes[size_id]) {
            const size = this.model.clouds[row.cloud.id].sizes[size_id];
            return size.name || size.id;
        }

        // If that fails look for size info in the extra metadata
        if (row.extra) {
            if (row.extra.size && row.extra.size.vcpus) {
                var size_name = `${row.extra.size.vcpus  }vCPU`;
                if (row.extra.size.memory)
                    size_name += `, ${  row.extra.size.memory  }MB RAM`;
                return size_name;
            } if (row.extra.maxCpu) {
                size_name = `${row.extra.maxCpu  }vCPU`;
                if (row.extra.maxMemory)
                    size_name += `, ${  row.extra.maxMemory  }MB RAM`;
                return size_name;
            }
        }

        return size_id || '';
    },

    _getMachineWeight(machine, model) {
        let weight = 0;
        const machineHasIncidents = this._machineHasIncidents(machine, this.model.incidentsArray);
            const machineHasMonitor = this._machineHasMonitoring(machine);
            const machineHasrecommendations = this._machineHasrecommendations(machine);
            const machineHasProbe = this._machineHasProbe(machine);
        machineState = this._machineState(machine);
        weight = machineHasIncidents + machineHasMonitor + machineHasrecommendations +
            machineHasProbe + machineState;
        return weight != NaN ? weight : 0;
    },

    _machineHasIncidents(machine, incidents) {
        const machineIncidents = incidents ? incidents.filter(function(inc) {
            return inc.machine_id == machine.machine_id && inc.cloud_id == machine.cloud && !inc.finished_at
        }) : [];
        return machineIncidents ? machineIncidents.length * 1000 : 0;
    },

    _machineHasMonitoring(machine) {
        return machine.monitoring && machine.monitoring.hasmonitoring ? 100 : 0;
    },

    _machineHasrecommendations(machine, probes) {
        return machine.probe && machine.probe.ssh && machine.probe.ssh.dirty_cow ? 10 : 0;
    },

    _machineHasProbe(machine) {
        return machine.probe && machine.probe.ssh && machine.probe.ssh.loadloadavg ? machine.probe.ssh
            .loadloadavg[0] + machine.probe.ssh.loadloadavg[1] + machine.probe.ssh.loadloadavg[2] :
            1;
    },

    _machineState(machine) {
        if (machine.state == 'running')
            return 5;
        if (machine.state == 'error')
            return 3;
        if (machine.state == 'stopped')
            return 2;
        if (machine.state == 'terminated')
            return 1;
        if (machine.state == 'unknown')
            return 0;
        return 0;
    },

    itemRecommendation(item) {
        if (this.probes == {} || !item || !item.id) {
            return false;
        } 
            if (!this.model.probes[item.id] || !this.model.probes[item.id].dirty_cow)
                return false;
            return true;
        
    },

    itemProbeClasses(item) {
        if (this.probes == {}) {
            return '';
        } 
            if (!this.model.probes[item.id] || !this.model.probes[item.id].loadavg) {
                return "";
            } 
                const probe = this.model.probes[item.id].loadavg;
                const cores = parseInt(this.model.probes[item.id].cores);
                let classes = '';
                const prefix = '';

                classes += this.loadToColor(parseFloat(probe[0] / cores), "short");
                classes += this.loadToColor(parseFloat(probe[1] / cores), "mid");
                classes += this.loadToColor(parseFloat(probe[2] / cores), "long");

                // has probe data
                if (classes != "")
                    classes += "hasprobe "

                return classes;
            
        
    },

    loadToColor(load, prefix) {
        if (load > 1.2)
            return `${prefix  }high `;
        if (load > 0.8)
            return `${prefix  }medium `;
        if (load > 0.6)
            return `${prefix  }eco `;
        if (load > 0.2)
            return `${prefix  }low `;
        return `${prefix  }low `;
    }
}