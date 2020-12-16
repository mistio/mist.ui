import '../../node_modules/@polymer/polymer/polymer-legacy.js';
/**
 * Behavior that empties the list selection.
 *
 * @polymerBehavior
 */
export const getResourceFromIncidentBehavior = {
  properties: {},
  _getResource(incident, _model) {
    if (this.model) {
      // Get incident type
      const resourceTypes = [
        'machine',
        'volume',
        'network',
        'zone',
        'key',
        'script',
        'schedule',
        'template',
        'member',
        'cloud',
        'organization',
      ];
      let type;
      // Loop through types, check if incident refers to some type of resource
      for (let i = 0; i < resourceTypes.length; i++) {
        type = resourceTypes[i];
        if (incident[`${type}_id`]) break;
      }
      // Get resource
      if (type) {
        let resource = {};
        if (type === 'subnet') {
          if (this.model.clouds[incident.network_id])
            resource = this.model.networks[incident.network_id][
              incident[`${type}_id`]
            ];
          if (resource) resource.uri = `/networks/${incident.network_id}`;
        } else if (type === 'record') {
          if (this.model.clouds[incident.zone_id])
            resource = this.model.networks[incident.zone_id][
              incident[`${type}_id`]
            ];
          if (resource) {
            resource.uri = `/zones/${incident.zone_id}`;
          }
        } else if (type === 'cloud') {
          if (this.model.clouds)
            resource = this.model.clouds[incident.cloud_id];
          if (resource) {
            resource.uri = `/clouds/${incident.cloud_id}`;
            resource.name = resource.title;
          }
        } else if (type === 'organization') {
          resource = {
            name: 'Organization',
            type,
          };
        } else {
          resource = this.model[`${type}s`][incident[`${type}_id`]];
          if (resource) {
            resource.uri = `/${type}s/${resource.id}`;
            resource.name = resource.name || resource.title || resource.domain;
          }
        }
        // Add type information in object. Used to construct the link.
        if (resource) {
          resource.type = type;
        }
        // If we could not find the resource, return a missing object
        if (!resource) {
          const machineName =
            incident.logs && incident.logs[0] && incident.logs[0].machine_name
              ? incident.logs[0].machine_name
              : '';
          resource = {
            name: `missing ${type} ${machineName}`,
            type,
          };
        }
        return resource;
      }
      if (incident.rule_arbitrary === true) {
        return {
          name: 'Organization',
          type: 'organization',
        };
      }
      // Try to get related resource from first log item
      return incident.logs ? this._getResource(incident.logs[0]) : false;
    }
    return false;
  },
};
