import { MACHINE_NAME_REGEX_PATTERNS } from './machine-name-regex-patterns.js';

const MACHINE_CREATE_FORM_DATA = data => ({
  src: './assets/forms/create-machine/create-machine.json',
  formData: {
    dynamicData: {
        clouds: {
          func: new Promise(resolve => {
            // Wait until clouds have loaded here
            resolve(() => data.clouds)
          }),
        },
        getZones: {
          func: new Promise(resolve => {
            // Wait until clouds have loaded here
            resolve(
              () => data._toArray(data.model.zones).map(zone=>{
                return {
                  id: zone.id,
                  title: zone.zone_id
                }
              })

            )
          }),
        }
      },
      conditionals: {
        showSetupMachineContainer: {
          func: cloudId => { return !cloudId},
        },
        getNameRegex: {
          func: cloudId => {
            const provider =  data._getCloudById(cloudId) && data._getCloudById(cloudId).provider;
            const pattern = (provider && MACHINE_NAME_REGEX_PATTERNS[provider]) || MACHINE_NAME_REGEX_PATTERNS['default'];
        console.log("pattern ", pattern);
        return pattern;
          }
      },
        showQuantity: {
          func: cloudId => {return false;},
        },
        getLocationsFromCloud: {
          func: cloudId => {
            if (!cloudId) { return;}
            const locationsArray = data._getCloudById(cloudId).locationsArray || [];
            const locations =  locationsArray.map(
              location => (
                {...location, title:location.name}
              )
            );
            console.log("locations ", locations)
            return locations;
          }
        },
        getImagesFromCloud: {
          func: cloudId => {
            if (!cloudId) { return;}
            const imagesArray = data._getCloudById(cloudId).imagesArray || [];
            const images =  imagesArray.map(
              image => (
                {...image, title:image.name}
              )
            );
            return images;
          }
        },
        getImagesFromLocation: {
          func: locationId => { return ["a", "b", "c"]},
        },
        getImagesFromSize: {
          func: cloudId => {return ["a", "b", "c"]},
        },
        getSizesFromCloud: {
          func: cloudId => {
            if (!cloudId) { return;}
            const cloudSize = data._getCloud(cloudId) || {};
            console.log("cloudSize ", cloudSize)
            return cloudSize.size || {};
          }
        },
        getSizesFromLocation: {
          func: cloudId => { return ["a", "b", "c"]},
        },
        showNetworkContainer: {
          func: cloudId => {
            const provider = data._getProviderById(cloudId);
            console.log("provider ", provider)
            const cloudsWithNetworks = ['ec2', 'azure_arm','equinixmetal','gce', 'libvirt', 'linode','openstack'];
            return !cloudsWithNetworks.includes(provider);
          }
        },
        // Add min max limits here
        getCidrRestrictions: {
          func: address_type => {
            if (address_type === 4){
              return;
          } else {
            return;
          }
        }
      },
      hideNetwork: {
        func: cloudId => !['gce', 'azure_arm'].includes(data._getProviderById(cloudId))
      },
      getNetworks: {
        // This field is for multiple providers
        func: cloudId => {
          const cloud = data._getCloudById(cloudId);
          const networks = [];
          const provider = data._getProviderById(cloudId);
          if (provider === 'gce') {
            if (cloud.networks.length ) {
              for (const [key, network] of Object.entries(cloud.networks)) {
                networks.push({
                  title: network.name,
                  id: network.id
                })
            }
          }
          }
          return networks;
        }
      },
        showVolumeContainer: {
          func: cloudId => {
            const provider = data._getProviderById(cloudId);
            const cloudsWithVolumes = ['ec2', 'azure_arm','digitalocean', 'equinixmetal','gce','linode','openstack']
            return !cloudsWithVolumes.includes(provider);
          },
        },
        hideAttachExistingVolumeContainer: {
          func: tab => { console.log("tab ", tab); return tab !== "Attach existing volume"}
        },
        hideAttachNewVolumeContainer: {
          func: tab => tab !== "Create new volume"
        },
        showDeviceNameInNewVolume: {
          func: cloudId => ['equinixmetal', 'openstack'].includes(data._getProviderById(cloudId))
        },
        showVolumeBoot: {
          func: cloudId => !['gce', 'openstack'].includes(data._getProviderById(cloudId))
        },
        showDeleteTerminationInNewVolume: {
          func: cloudId => {
            console.log("!['ec2', 'openstack'].includes(data._getProviderById(cloudId)) ", !['ec2', 'openstack'].includes(data._getProviderById(cloudId)));
            return !['ec2', 'openstack'].includes(data._getProviderById(cloudId));
          }
        },
        hideIfNotAmazon: {
          func: cloudId => {console.log("data._getProviderById(cloudId) !== 'ec2' ", data._getProviderById(cloudId) !== 'ec2');
        return data._getProviderById(cloudId) !== 'ec2';
        }
        },
        hideIfNotAzure: {
          func: cloudId => data._getProviderById(cloudId) !== 'azure_arm'
        },
        hideIfNotDigitalOcean: {
          func: cloudId => data._getProviderById(cloudId) !== 'digitalocean'
        },
        hideIfNotEquinix: {
          func: cloudId => data._getProviderById(cloudId) !== 'equinixmetal'
        },
        // One volume should set this
        hideIfNotGoogle: {
          func: cloudId => data._getProviderById(cloudId) !== 'gce'
        },
        hideIfNotLinode: {
          func: cloudId =>  data._getProviderById(cloudId) !== 'linode'
        },
        hideIfNotKVM: {
          func: cloudId =>  data._getProviderById(cloudId) !== 'libvirt'
        },
        hideIfNotOpenstack: {
          func: cloudId =>  {
            console.log("data._getProviderById(cloudId) !== 'openstack' ", data._getProviderById(cloudId) !== 'openstack');
            return data._getProviderById(cloudId) !== 'openstack';
          }
        },
        getAmazonSecurityGroups: {
          func: cloudId => {
            return cloudId ? data._getAmazonSecurityGroups(cloudId) : [];
          },
          type: 'promise'
        },
        getSubnets: {
          func: cloudId => {
            const cloud = data._getCloudById(cloudId);
            const subnets = [];
            if (cloud.networks.length ) {
              for (const [key, network] of Object.entries(cloud.networks)) {
                if (network.subnets) {
                  for (const [key, subnet] of Object.entries(network.subnets)) {
                    // There's also an availability zone property in subnets containing location names, does it mean subnets are based on location too?
                    subnets.push({
                      title: subnet.name,
                      id: subnet.id
                    })
                }
              }
            }
          }
          return subnets;
        },
        getAzureNetworks: {
          func: cloudId => {
            return [];
          }
        },
        getGoogleNetworks: {
          func: cloudId => {
            return ["a", "b", "c"];
          }
        },
        getGoogleSubnetworks: {
          func: cloudId => {
            return [];
          }
        },
        showExistingVolume: {
          func: choice => { console.log("choice ", choice); return choice === 'Create new volume'}
        },
        getVolumesFromLocations: {
          func: location => {
            const volumes = [];
            for (const [key, value] of Object.entries(data.volumes)) {
              if(value.location === location) {
                volumes.push({
                  title: value.name,
                  id: value.id
                })
              }
            }
            return volumes;

          }
        }
      }
  },
});

export { MACHINE_CREATE_FORM_DATA };
