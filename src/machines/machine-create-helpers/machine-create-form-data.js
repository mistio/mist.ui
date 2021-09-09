import { MACHINE_NAME_REGEX_PATTERNS } from './machine-name-regex-patterns.js';

const MACHINE_CREATE_FORM_DATA = {
  src: './assets/forms/create-machine.json',
  formData: {
    dynamicData: {
        clouds: {
          func: new Promise(resolve => {
            // Wait until clouds have loaded here
            resolve(() => this.clouds)
          }),
        }
      },
      conditionals: {
        showSetupMachineContainer: {
          func: cloudId => { return !cloudId},
        },
        getNameRegex: {
          func: cloudId => {
            const provider =  this._getCloudById(cloudId) && this._getCloudById(cloudId).provider;
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
            const locationsArray = this._getCloudById(cloudId).locationsArray || [];
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
            const imagesArray = this._getCloudById(cloudId).imagesArray || [];
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
            const cloudSize = this._getCloud(cloudId) || {};
            return cloudSize.size;
          }
        },
        getSizesFromLocation: {
          func: cloudId => { return ["a", "b", "c"]},
        },
      }
  },
};

export { MACHINE_CREATE_FORM_DATA };
