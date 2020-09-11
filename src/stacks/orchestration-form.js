import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../helpers/stack-forms-behavior.js';
import '../app-form/app-form.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="shared-styles forms">
         :host {
            max-width: calc(100% - 150px);
            position: relative;
            display: block;
        }
        </style>
        <app-form id\$="stack_[[workflow]]" fields="{{fields}}" workflow="[[workflow]]" url="[[url]]" btncontent="[[btncontent]]"></app-form>
`,

  is: 'orchestration-form',

  properties: {
      model: {
          type: Object
      },
      fields: {
          type: Array
      },
      workflow: {
          type: String
      },
      url: {
          type: String
      },
      onRequest: {
          type: String
      },
      onResponse: {
          type: String
      },
      onError: {
          type: String
      },
      btncontent: {
          type: String
      },
      yaml_inputs: {
          type: String,
          notify: true
      }
  },

  observers: [
      '_cloudChanged(fields.*)'
  ],

  listeners: {
      'change': '_updateFields',
      'iron-select': '_updateFields',
  },

  ready: function() {
      var yaml_inputs = '';
      this.fields.forEach(function(inp) {
          yaml_inputs += inp.name + ': ';
          var val = inp.value = !undefined ? inp.value : inp.defaultValue || inp.default;
          yaml_inputs += val + '\n';
      }, this);
      this.set('yaml_inputs', yaml_inputs);
  },

  attached: function() {
      // prepare mist machine
      var inps = this.fields.filter(function(f) {return f.name.startsWith("mist_machine")})
      if (inps && inps.length) {
          for (var i = 0; i < inps.length; i++) {
              var inp = inps[i];
              inp.label = inp.name.split("mist_machine_")[1] || "";
              inp.required = true;
              inp.valid = false;
              inp.show = true;
              inp.type = 'mist_machine';
              inp.cloud = '';
              inp.machine = '';
              inp.machinesList = [];
              inp.image = '';
              inp.size = '';
              inp.location = '';
              inp.key = '';
              inp.networks = [];
              inp.value = {};
              inp.helptext = inp.description;
              inp.quantity = 1;
              if (inp.name.endsWith("list")) {
                  inp.multi = true;
              } else {
                  inp.multi = false;
              }
              if (this.model){
                  inp.clouds = this.model.clouds || {};
                  inp.keys = this.model.keys || {};
              }
          }
      }
  },

  _cloudChanged: function(changeRecord) {
      if (!this.fields || !changeRecord || !changeRecord.path || !changeRecord.path.endsWith('value')) {
          return;
      } else {
          var field = this.get(changeRecord.path.replace('.value', ''))
          if (field && field.name.startsWith('mist_cloud') && this.model.clouds[changeRecord.value]) {
              function copy(o) { // deep copy an array of objects
                  var output, v, key;
                  output = Array.isArray(o) ? [] : {};
                  for (key in o) {
                      v = o[key];
                      output[key] = (typeof v === "object") ? copy(v) : v;
                  }
                  return output;
              }
              // reset fields if cloud changed
              var fields = copy(this.fields);
              this.set('fields', []);
              this.set('fields', fields);
              this._updateFields();
          }
      }
  },

  _updateFields: function(e) {
      var changeInYaml = e && e.path.indexOf(this.shadowRoot.querySelector('app-form').shadowRoot.querySelector("paper-textarea#app-form-stack_" + this.workflow + "-stackinputs")) > -1;
      this.fields.forEach(function(inp) {
          if (inp.name != 'yaml_or_form' && inp.name != 'stackinputs') {

              // Temp, before Tosca uses 'required' key
              inp.required = false;

              // Uncomment when TOSCA uses 'required' key
              // if (!inp.required){
              //     inp.required = false;
              // }

              // make key dropdown
              if (inp.name.startsWith('mist_key')) {
                  inp.type = 'ssh_key';
                  // inp.type = 'dropdown';
                  inp.helptext = 'Select key';
                  inp.options = this.model.keysArray;
              }

              // make cloud dropdown
              if (inp.name.startsWith('mist_cloud')) {
                  inp.label = 'cloud';
                  inp.type = 'mist_dropdown';
                  inp.helptext = 'Select cloud';
                  inp.options = this.model.cloudsArray;
              }

              // make image dropdown & dependent on cloud
              if (inp.name.startsWith("mist_image")) {
                  var xid = inp.name.split("mist_image")[1];
                  inp.show = false;
                  inp.type = 'mist_dropdown';
                  inp.helptext = 'Select image';
                  inp.showIf = {
                      fieldName: "mist_cloud" + xid,
                      fieldExists: true
                  }
              }

              // make image location & dependent on cloud
              if (inp.name.startsWith("mist_location")) {
                  var xid = inp.name.split("mist_location")[1];
                  inp.show = false;
                  inp.type = 'mist_dropdown';
                  inp.helptext = 'Select location';
                  inp.showIf = {
                      fieldName: "mist_cloud" + xid,
                      fieldExists: true
                  }
              }

              // make network dropdown & dependent on cloud
              if (inp.name.startsWith("mist_networks")) {
                  var xid = inp.name.split("mist_networks")[1];
                  inp.show = false;
                  inp.type = 'mist_dropdown';
                  inp.helptext = 'Select network';
                  inp.showIf = {
                      fieldName: "mist_cloud" + xid,
                      fieldExists: true
                  }
              }

              // make image location & dependent on cloud
              if (inp.name.startsWith("mist_size")) {
                  var xid = inp.name.split("mist_size")[1];
                  inp.show = false;
                  inp.type = 'mist_size';
                  inp.helptext = 'Machine size';
                  inp.showIf = {
                      fieldName: "mist_cloud" + xid,
                      fieldExists: true
                  }
              }

              // prepare mist tags
              if (inp.name.startsWith("mist_tags")) {
                  inp.show = false;
                  inp.type = 'mist_tags';
                  inp.helptext = inp.description;
                  inp.value = [];
              }

              // prepare mist machine
              if (inp.name.startsWith("mist_machine")) {
                  inp.label = inp.name.split("mist_machine_")[1] || "Mist Machine";
                  inp.required = true;
                  inp.show = true;
                  inp.type = 'mist_machine';
                  inp.helptext = inp.description;
                  if (this.model){
                      inp.clouds = this.model.clouds || {};
                      inp.keys = this.model.keys || {};
                  }
              }

              // hide mist api credential inputs
              if (["mist_token", "script_path", "mist_uri", "mist_username", "mist_password"].indexOf(inp.name) > -1) {
                  inp.hidden = true;
                  inp.required = false;
              }
          }
      }, this);

      if (changeInYaml) {
          var yaml = this.shadowRoot.querySelector('app-form').shadowRoot.querySelector("paper-textarea#stackinputs").value;
          console.log('yaml', yaml);
          var yaml_array = yaml.split('\n');
          var inputs = [];
          yaml_array.forEach(function(line) {
              var name = line.split(':')[0].trim();
              var value = line.split(':')[1];
              if (value)
                  value = value.trim();
              inputs[name] = JSON.parse(value);
          });

          this.fields.forEach(function(f, index) {
              if (inputs[f.name])
                  this.set('fields.' + index + '.value', inputs[f.name])
          }, this)
      } else {
          var cloud = this.fields.find(function(f) {
              return f.name.startsWith("mist_cloud");
          });
          var yaml_inputs = '';
          var machines = this.model.machines;
          this.fields.forEach(function(inp) {
              var fieldCloud;

              if (['yaml_or_form', 'stackinputs'].indexOf(inp.name) == -1) {
                  yaml_inputs += inp.name + ': ';
                  var preformatedValue = inp.preformatPayloadValue ? inp.preformatPayloadValue.apply(inp.value) : inp.value;
                  var val = preformatedValue ? JSON.stringify(preformatedValue) : inp.defaultValue;
                  yaml_inputs += val + '\n';
              }
              if (cloud && cloud.value) {
                  if (inp.name.startsWith("mist_location")) {
                      var xid = inp.name.split("mist_location")[0];
                      fieldCloud = this.fields.find(function(f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      var cloudId = fieldCloud.value;
                      if (cloudId)
                          inp.options = this.model.clouds[cloudId].locationsArray || [];
                  }
                  if (inp.name.startsWith("mist_image")) {
                      var xid = inp.name.split("mist_image")[0];
                      fieldCloud = this.fields.find(function(f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      var cloudId = fieldCloud.value;
                      if (this.model && cloudId)
                          inp.options = this.model.clouds[cloudId].imagesArray || [];
                  }
                  if (inp.name.startsWith("mist_networks")) {
                      var xid = inp.name.split("mist_networks")[0];
                      fieldCloud = this.fields.find(function(f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      cloudId = fieldCloud.value;
                      if (this.model && cloudId)
                          inp['options'] = Object.values(this.model.clouds[cloudId].networks) || [];
                  }
                  // mist-machine contains its own cloud value
                  if (inp.name.startsWith("mist_machine")) {
                      if (this.model) {
                          inp.clouds = this.model.clouds || {};
                          inp.keys = this.model.keys || {};
                      }
                  }
                  if (inp.name.startsWith("mist_size")) {
                      var xid = inp.name.split("mist_size")[0];
                      fieldCloud = this.fields.find(function(f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      var cloudId = fieldCloud.value;
                      if (cloudId) {
                          if (this.model.clouds[cloudId].sizesArray)
                              inp.options = this.model.clouds[cloudId].sizesArray || [];
                          if (['libvirt', 'onapp', 'vsphere'].indexOf(this.model.clouds[cloudId].provider) == -1) {
                              inp.custom = false;
                              inp.customValue = null;
                              inp.customSizeFields = [];
                          }
                          if (['libvirt', 'onapp', 'vsphere'].indexOf(this.model.clouds[cloudId].provider) > -1) {
                              inp.options = [];
                              inp.custom = true;
                              inp.value = 'custom';
                          }
                          if (['libvirt', 'vsphere'].indexOf(this.model.clouds[cloudId].provider) > -1) {
                              inp.customSizeFields = [{
                                  name: 'ram',
                                  label: 'RAM MB',
                                  type: 'slider',
                                  value: 256,
                                  defaultValue: 256,
                                  min: 256,
                                  max: 6223,
                                  step: 256,
                                  show: true,
                                  required: false,
                                  unit: 'MB',
                              }, {
                                  name: 'cpu',
                                  label: 'CPU cores',
                                  type: 'slider',
                                  value: 1,
                                  defaultValue: 1,
                                  min: 1,
                                  max: 16,
                                  step: 1,
                                  show: true,
                                  required: false,
                                  unit: 'cores',
                              }]
                          }
                          if (['onapp'].indexOf(this.model.clouds[cloudId].provider) > -1) {
                              inp.customSizeFields = [{
                                  name: 'size_ram',
                                  label: 'RAM MB',
                                  type: 'slider',
                                  value: 256,
                                  defaultValue: 256,
                                  min: 256,
                                  max: 6223,
                                  step: 1,
                                  show: true,
                                  required: false,
                                  unit: 'MB',
                                  helptext: 'Custom RAM size in MB.',
                                  showIf: {
                                      fieldName: 'size',
                                      fieldValues: ['custom'],
                                  },
                              }, {
                                  name: 'size_cpu',
                                  label: 'CPU cores',
                                  type: 'slider',
                                  value: 1,
                                  defaultValue: 1,
                                  min: 1,
                                  max: 16,
                                  step: 1,
                                  show: true,
                                  required: false,
                                  unit: 'cores',
                                  helptext: 'Custom CPU cores.',
                                  showIf: {
                                      fieldName: 'size',
                                      fieldValues: ['custom'],
                                  },
                              }, {
                                  name: 'size_disk_primary',
                                  label: 'Primary Disk',
                                  type: 'slider',
                                  value: 5,
                                  defaultValue: 5,
                                  min: 5,
                                  max: 16,
                                  step: 1,
                                  show: true,
                                  required: false,
                                  unit: 'GB',
                                  helptext: 'Custom disk size in GB.',
                                  showIf: {
                                      fieldName: 'size',
                                      fieldValues: ['custom'],
                                  },
                              }, {
                                  name: 'size_disk_swap',
                                  label: 'Swap Disk',
                                  type: 'slider',
                                  value: 1,
                                  defaultValue: 1,
                                  min: 1,
                                  max: 11,
                                  step: 1,
                                  show: true,
                                  required: false,
                                  unit: 'GB',
                                  helptext: 'Custom disk size in GB.',
                                  showIf: {
                                      fieldName: 'size',
                                      fieldValues: ['custom'],
                                  },
                              }]
                          }
                      }
                  }
              }
          }, this);

          this.set('yaml_inputs', yaml_inputs);

          // pass values into form's stackinputs value
          this._updateStackInputsValue()
      }
  },

  _computeProviderLogo: function(provider) {
      return 'assets/providers/provider-' + provider + '.png';
  },

  _updateStackInputsValue: function() {
      var stackinputsIndex = this.fields.findIndex(function(f) {
          return f.name == "stackinputs";
      });
      if (stackinputsIndex && stackinputsIndex > -1)
          this.set('fields.' + stackinputsIndex + '.value', this.yaml_inputs);
  }
});
