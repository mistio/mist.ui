import { MACHINE_NAME_REGEX_PATTERNS } from './machine-name-regex-patterns.js';
// I should get image id from image name before submitting to the API
// I should get size if from size name before submitting to the API
const MACHINE_CREATE_FORM_DATA = data => ({
  src: './assets/forms/create-machine/create-machine.json',
  formData: {
    dynamicData: {
      clouds: {
        func: data._getClouds,
      },
      getZones: {
        func: new Promise(resolve => {
          // Wait until clouds have loaded here
          resolve(() =>
            data._toArray(data.model.zones).map(zone => ({
              id: zone.id,
              title: zone.zone_id,
            }))
          );
        }),
      },
      getipv6Subnets: {
        func: new Promise(resolve => {
          // Wait until clouds have loaded here
          resolve(() => {
            const arr = [];
            for (let i = 64; i < 128; i++) {
              arr.push(`\${i}`);
            }
            return arr;
          });
        }),
      },
      getScripts: {
        func: new Promise(resolve => {
          // Wait until clouds have loaded here
          resolve(() =>
            data.model.scriptsArray.map(script => ({
              id: script.id,
              title: script.name,
            }))
          );
        }),
      },
    },
    conditionals: {
      showSetupMachineContainer: {
        func: cloudId => {
          // This changes every time a different cloud is selected so I save the cloud to localstorage here
          localStorage.setItem('createMachine#cloud', cloudId);
          return !cloudId;
        },
      },
      getNameRegex: {
        func: cloudId => {
          const provider =
            data._getCloudById(cloudId) && data._getCloudById(cloudId).provider;
          const pattern =
            (provider && MACHINE_NAME_REGEX_PATTERNS[provider]) ||
            MACHINE_NAME_REGEX_PATTERNS.default;
          return pattern;
        },
      },
      getLocations: {
        func: (id, path, formValues) => {
          let locationsFromImage = [];
          let locationsFromCloud = [];
          let locationsFromSize = [];
          const image =
            formValues.setupMachine && formValues.setupMachine.image;
          const size = formValues.setupMachine && formValues.setupMachine.size;
          if (!id) {
            return undefined;
          }
          const cloudId =
            path === 'cloudContainer.cloud'
              ? id
              : formValues.cloudContainer && formValues.cloudContainer.cloud;

          locationsFromCloud = (
            data._getCloudById(cloudId).locationsArray || []
          ).map(location => ({
            ...location,
            title: location.name,
          }));

          if (image) {
            locationsFromImage = locationsFromCloud.filter(
              location =>
                // Find correct imageName
                location.available_images &&
                location.available_images.includes(image)
            );
          }
          if (size) {
            locationsFromSize = locationsFromCloud.filter(
              location =>
                location.available_sizes &&
                location.available_sizes.includes(id)
            );
          }

          if (
            locationsFromImage.length === 0 &&
            locationsFromSize.length === 0
          ) {
            return locationsFromCloud;
          }
          if (locationsFromImage.length > 0 && locationsFromSize.length === 0) {
            return locationsFromImage;
          }
          if (locationsFromImage.length === 0 && locationsFromSize.length > 0) {
            return locationsFromSize;
          }
          return [locationsFromImage, locationsFromSize].reduce((a, b) =>
            a.filter(c => b.includes(c))
          );
        },
      },
      getImages: {
        func: (id, path, formValues) => {
          let imagesFromCloud = [];
          let imagesFromLocation = [];
          let imagesFromSize = [];
          const location =
            formValues.setupMachine && formValues.setupMachine.location;
          const size = formValues.setupMachine && formValues.setupMachine.size;
          if (!id) {
            return undefined;
          }
          const cloudId =
            path === 'cloudContainer.cloud'
              ? id
              : formValues.cloudContainer && formValues.cloudContainer.cloud;

          imagesFromCloud = (data._getCloudById(cloudId).imagesArray || []).map(
            image => image.name
          );

          if (location && location.available_images) {
            imagesFromLocation = location.available_images;
          }

          if (size) {
            // Check if size objhect is coming through properly or I have to find it
            const images = imagesFromLocation.length
              ? imagesFromLocation
              : imagesFromCloud;
            imagesFromSize = images.filter(
              image =>
                (image.architecture
                  ? image.architecture.includes(size.architecture)
                  : true) &&
                (image.min_memory ? size.ram > image.min_memory_size : true) &&
                (image.min_disk_size ? size.disk > image.min_disk_size : true)
            );
          }

          if (imagesFromLocation.length === 0 && imagesFromSize.length === 0) {
            return imagesFromCloud;
          }
          if (imagesFromLocation.length > 0 && imagesFromSize.length === 0) {
            return imagesFromLocation;
          }
          if (imagesFromLocation.length === 0 && imagesFromSize.length > 0) {
            return imagesFromSize;
          }
          return [imagesFromLocation, imagesFromSize].reduce((a, b) =>
            a.filter(c => b.includes(c))
          );
        },
      },

      getSizes: {
        func: (id, path, formValues) => {
          let sizesFromCloud = null;
          let sizesFromLocation = null;
          let sizesFromImage = null;
          const location =
            formValues.setupMachine && formValues.setupMachine.location;
          const imageName =
            formValues.setupMachine && formValues.setupMachine.image;
          const sizeId =
            formValues.setupMachine && formValues.setupMachine.size;
          if (!id) {
            return undefined;
          }
          const cloudId =
            path === 'cloudContainer.cloud'
              ? id
              : formValues.cloudContainer && formValues.cloudContainer.cloud;
          const cloud = data._getCloud(cloudId) || {};

          sizesFromCloud = cloud.size || {};
          if (location && location.available_sizes) {
            sizesFromLocation = {
              ...sizesFromCloud,
              options: sizesFromCloud.options.filter(size =>
                location.available_sizes.includes(size.name)
              ),
            };
          }

          if (imageName) {
            const image = (data._getCloudById(cloudId).imagesArray || []).find(
              img => img.name === imageName
            );
            const sizes = sizesFromLocation || sizesFromCloud;
            sizesFromImage = {
              ...sizes,
              options: sizes.options.filter(
                size =>
                  (image.architecture
                    ? image.architecture.includes(size.architecture)
                    : true) &&
                  (image.min_memory
                    ? size.ram > image.min_memory_size
                    : true) &&
                  (image.min_disk_size ? size.disk > image.min_disk_size : true)
              ),
            };
          }

          if (!sizesFromLocation && !sizesFromImage) {
            if (sizeId) {
              sizesFromCloud.value = sizeId;
            }
            return sizesFromCloud;
          }
          if (sizesFromLocation && !sizesFromImage) {
            if (
              sizeId &&
              sizesFromLocation.options.find(size => size.id === sizeId)
            ) {
              sizesFromLocation.value = sizeId;
            }
            return sizesFromLocation;
          }
          if (!sizesFromLocation && sizesFromImage) {
            if (
              sizeId &&
              sizesFromImage.options.find(size => size.id === sizeId)
            ) {
              sizesFromImage.value = sizeId;
            }
            return sizesFromImage;
          }
          const sizeIntersection = {
            ...sizesFromLocation,
            options: [
              sizesFromLocation.options,
              sizesFromImage.options,
            ].reduce((a, b) => a.filter(c => b.includes(c))),
          };
          if (
            sizeId &&
            sizeIntersection.options.find(size => size.id === sizeId)
          ) {
            sizeIntersection.value = sizeId;
          }
          return sizeIntersection;
        },
      },
      hideNetworkContainer: {
        func: cloudId => {
          const provider = data._getProviderById(cloudId);
          const cloudsWithNetworks = [
            'ec2',
            'azure_arm',
            'equinixmetal',
            'gce',
            'libvirt',
            'linode',
            'openstack',
            'aliyun_ecs',
          ];
          return !cloudsWithNetworks.includes(provider);
        },
      },
      // Add min max limits here
      getCidrRestrictions: {
        func: addressType => {
          if (addressType === 4) {
            return undefined;
          }
          return undefined;
        },
      },
      hideNetwork: {
        func: cloudId =>
          !['gce', 'aliyun_ecs'].includes(data._getProviderById(cloudId)),
      },
      getNetworks: {
        // This field is for multiple providers
        func: cloudId => {
          const cloud = data._getCloudById(cloudId);
          const networks = [];
          const provider = data._getProviderById(cloudId);
          if (provider === 'gce') {
            if (cloud.networks.length) {
              for (const network of Object.values(cloud.networks)) {
                networks.push({
                  title: network.name,
                  id: network.id,
                });
              }
            }
          }
          return networks;
        },
      },
      showVolumeContainer: {
        func: cloudId => {
          const provider = data._getProviderById(cloudId);
          const cloudsWithVolumes = [
            'ec2',
            'azure_arm',
            'digitalocean',
            'equinixmetal',
            'gce',
            'linode',
            'openstack',
            'aliyun_ecs',
          ];
          return !cloudsWithVolumes.includes(provider);
        },
      },
      hideAttachExistingVolumeContainer: {
        func: tab => tab !== 'Attach existing volume',
      },
      hideAttachNewVolumeContainer: {
        func: tab => tab !== 'Create new volume',
      },
      showDeviceNameInNewVolume: {
        func: cloudId =>
          ['equinixmetal', 'openstack', 'aliyun_ecs'].includes(
            data._getProviderById(cloudId)
          ),
      },
      showVolumeBoot: {
        func: cloudId =>
          !['gce', 'openstack'].includes(data._getProviderById(cloudId)),
      },
      hideDeleteTerminationInNewVolume: {
        func: cloudId =>
          !['ec2', 'openstack', 'aliyun_ecs'].includes(
            data._getProviderById(cloudId)
          ),
      },
      hideIfNotAmazon: {
        func: cloudId => data._getProviderById(cloudId) !== 'ec2',
      },
      hideIfNotAzure: {
        func: cloudId => data._getProviderById(cloudId) !== 'azure_arm',
      },
      hideIfNotDigitalOcean: {
        func: cloudId => data._getProviderById(cloudId) !== 'digitalocean',
      },
      hideIfNotEquinix: {
        func: cloudId => data._getProviderById(cloudId) !== 'equinixmetal',
      },
      // One volume should set this
      hideIfNotGoogle: {
        func: cloudId => data._getProviderById(cloudId) !== 'gce',
      },
      hideIfNotLinode: {
        func: cloudId => data._getProviderById(cloudId) !== 'linode',
      },
      hideIfNotKVM: {
        func: cloudId => data._getProviderById(cloudId) !== 'libvirt',
      },
      hideIfNotOpenstack: {
        func: cloudId => data._getProviderById(cloudId) !== 'openstack',
      },
      hideDeleteOnTerminationExisting: {
        func: cloudId =>
          !['aliyun_ecs', 'openstack'].includes(data._getProviderById(cloudId)),
      },
      hideSecurityGroup: {
        func: cloudId =>
          !['ec2', 'aliyun_ecs'].includes(data._getProviderById(cloudId)),
      },
      hideLocations: {
        func: cloudId =>
          ['lxd', 'docker', 'kubevirt'].includes(
            data._getProviderById(cloudId)
          ),
      },
      locationRequired: {
        func: cloudId =>
          !['lxd', 'docker', 'kubevirt', 'linode'].includes(
            data._getProviderById(cloudId)
          ),
      },
      getSecurityGroups: {
        func: cloudId =>
          cloudId && data._getProviderById(cloudId) === 'ec2'
            ? data._getAmazonSecurityGroups(cloudId)
            : [],
        type: 'promise',
      },
      hideipv4SubnetSize: {
        func: toggle => toggle,
      },
      hideipv6SubnetSize: {
        func: toggle => toggle,
      },
      getVolumeTypes: {
        func: cloudId => {
          const provider = data._getProviderById(cloudId);
          switch (provider) {
            case 'aliyun_ecs':
              return ['cloud', 'cloud_efficiency', 'cloud_ssd', 'cloud_essd'];
            case 'gce':
              return ['pd-standard', 'pd-ssd'];
            default:
              return [];
          }
        },
      },
      getSubnets: {
        func: (locationId, fieldpath, formValues) => {
          const cloudId =
            formValues.cloudContainer && formValues.cloudContainer.cloud;
          const cloud = data._getCloudById(cloudId);
          const subnets = [];
          if (cloud && cloud.networks) {
            for (const network of Object.values(cloud.networks)) {
              if (network.subnets) {
                for (const subnet of Object.values(network.subnets)) {
                  // There's also an availability zone property in subnets containing location names, does it mean subnets are based on location too?
                  if (
                    cloud.locations[locationId].name ===
                    subnet.availability_zone
                  ) {
                    subnets.push({
                      title: subnet.name,
                      id: subnet.id,
                    });
                  }
                }
              }
            }
          }
          return subnets;
        },
      },
      showExistingVolume: {
        func: choice => choice === 'Create new volume',
      },
      getVolumesFromLocations: {
        func: location => {
          const volumes = [];
          for (const value of Object.values(data.volumes)) {
            if (value.location === location) {
              volumes.push({
                title: value.name,
                id: value.id,
              });
            }
          }
          return volumes;
        },
      },
      hideTaskScriptContainer: {
        func: type => type !== 'run script',
      },
      hideOneOffContainer: {
        func: type => type !== 'one_off',
      },
      hideCrontabContainer: {
        func: type => type !== 'crontab',
      },
      hideIntervalContainer: {
        func: type => type !== 'interval',
      },
      hideTemplateName: {
        func: saveAsTemplate => !saveAsTemplate,
      },
    },
    dataFormatting: {
      formatCloudContainerPayload: values => values,
    },
  },
});

export { MACHINE_CREATE_FORM_DATA };
