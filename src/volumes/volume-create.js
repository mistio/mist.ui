import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

export var VOLUME_CREATE_FIELDS = [];

// cloud:
//   in: path
//   required: true
//   type: string
// size:
//   required: true
//   type: integer
//   description: Size of disk in Gb
// name:
//   required: true
//   type: string
//   description: Name of the disk
// location:
//   required: true
//   type: string
// ex_disk_type:
//   type: string
//   description: GCE-specific. One of 'pd-standard'(default) or 'pd-ssd'
// ex_volume_type:
//   type: string
//   description: EC2-specific. One of 'standard', 'io1', 'gp2', 'sc1', 'st1'
// ex_iops:
//   type: string
//   description: EC2-specific. Needs to be specified if volume_type='io1'

// AZURE ARM  
// https://docs.microsoft.com/en-us/rest/api/dtl/disks/createorupdate
VOLUME_CREATE_FIELDS.push({
    provider: 'azure_arm',
    fields: [{
        name: "host_caching",
        label: "Host caching",
        type: 'dropdown',
        value: "None",
        defaultValue: "None",
        required: true,
        show: true,
        onForm: 'createForm',
        errorMessage: "Please enter host caching policy of the disk",
        options: [{
            title: 'None',
            val: 'None',
        }, {
            title: 'Read Only',
            val: 'ReadOnly',
        }, {
            title: 'Read Write',
            val: 'ReadWrite',
        }]
    },
    {
        name: 'create_resource_group',
        h3: 'Resource group',
        type: 'radio',
        value: true,
        defaultValue: true,
        class: 'bind-both',
        helptext: 'Create the machine in a new resource group',
        show: true,
        required: false,
        excludeFromPayload: true,
        options: [{
            title: 'Create new',
            val: true,
        }, {
            title: 'Use existing',
            val: false,
        }],
    },{
        name: 'resource_group',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        excludeFromPayload: false
    },{
        name: 'ex_resource_group',
        label: 'Resource Group',
        type: 'mist_dropdown_searchable',
        loader: true,
        class: 'margin-top',
        value: '',
        defaultValue: '',
        search: '',
        show: false,
        excludeFromPayload: true,
        required: true,
        options: [],
        showIf: {
            fieldName: 'create_resource_group',
            fieldValues: [false],
        }
    },{
        name: 'new_resource_group',
        label: 'Resource Group name',
        type: 'text',
        value: '',
        class: 'margin-bottom',
        defaultValue: '',
        show: true,
        excludeFromPayload: true,
        required: false,
        helptext: '',
        showIf: {
            fieldName: 'create_resource_group',
            fieldValues: [true],
        }
    }, {
        name: 'storage_account_type',
        label: 'Storage account type',
        type: 'dropdown',
        value: 'StandardSSD_LRS',
        defaultValue: 'StandardSSD_LRS',
        helptext: 'Specify the storage account type for the managed disk.',
        show: true,
        required: true,
        options: [{
            title: 'Standard HDD',
            val: 'Standard_LRS'
        }, {
            title: 'Standard SSD',
            val: 'StandardSSD_LRS',	
        }, {
            title: 'Premium SSD',
            val: 'Premium_LRS',
        }],
    }]
});


// DIGITAL OCEAN
// https://developers.digitalocean.com/documentation/v2/#create-a-new-block-storage-volume
VOLUME_CREATE_FIELDS.push({
    provider: 'digitalocean',
    fields: [{
        name: "filesystem_type",
        type: 'dropdown',
        label: 'Filesystem type',
        value: "",
        defaultValue: "",
        helptext: "If a filesystem type is selected, the volume will automatically be formated to the specified filesystem type.",
        show: true,
        required: false,
        options: [{
            title: 'Do not automatically format.',
            val: '',
        }, {
            title: 'Ext4 filesystem type',
            val: 'ext4',
        },{
            title: 'XFS filesystem type',
            val: 'xfs',
        }]
    }]
});

// GIGG8
VOLUME_CREATE_FIELDS.push({
    provider: 'gig_g8',
    fields: [ {
        name: "description",
        label: "Description *",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        helptext: "A human friendly description of the volume.",
        onForm: 'volume_add',
    }]
});

// OPENSTACK
VOLUME_CREATE_FIELDS.push({
    provider: 'openstack',
    fields: []
});

// PACKET
VOLUME_CREATE_FIELDS.push({
    provider: 'packet',
    fields: []
});

// ALIYUN ECS
VOLUME_CREATE_FIELDS.push({
    provider: 'aliyun_ecs',
    fields: [{
        name: "disk_category",
        label: "Disk category *",
        type: 'dropdown',
        value: "cloud",
        defaultValue: "cloud",
        required: true,
        show: true,
        errorMessage: "Please enter disk's category",
        options: [{
            title: 'Basic cloud disk',
            val: 'cloud',
        }, {
            title: 'Efficiency cloud disk',
            val: 'cloud_efficiency'
        }, {
            title: 'Cloud SSD',
            val: 'cloud_ssd'
        }, {
            title: 'Cloud ESSD',
            val: 'cloud_essd'
        }]
    }, {
        name: "description",
        label: "Description",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "A human friendly description of the volume."
    }]
});


// GCE
VOLUME_CREATE_FIELDS.push({
    provider: 'gce',
    fields: [{
        name: "ex_disk_type",
        label: "External disk type",
        type: 'dropdown',
        value: "pd-standard",
        defaultValue: "pd-standard",
        required: true,
        show: true,
        errorMessage: "Please enter volume's type",
        options: [{
            title: 'pd-standard (default)',
            val: 'pd-standard',
        }, {
            title: 'pd-ssd',
            val: 'pd-ssd',
        }]
    }]
});


// EC2
VOLUME_CREATE_FIELDS.push({
    provider: 'ec2',
    fields: [{
        name: "ex_volume_type",
        label: "External volume type",
        type: 'dropdown',
        value: "standard",
        defaultValue: "standard",
        required: true,
        show: true,
        errorMessage: "Please enter volume's type",
        options: [{
            title: 'standard',
            val: 'standard',
        }, {
            title: 'General Purpose SSD (gp2)',
            val: 'gp2'
        }, {
            title: 'Provisioned IOPS SSD (io1)',
            val: 'io1'
        }, {
            title: 'Throughput Optimized HDD (st1)',
            val: 'st1'
        }, {
            title: 'Cold HDD (sc1)',
            val: 'sc1'
        }]
    }, {
        name: "ex_iops",
        label: "Number of I/O operations per second",
        type: 'number',
        min: 100,
        value: '',
        defaultValue: '',
        required: true,
        show: true,
        errorMessage: "Please enter volume's iops",
        helptext: "Maximum ratio is 50 IOPS/GiB. Range is 100 to 32000 IOPS for volumes in most regions",
        showIf: {
            fieldName: 'ex_volume_type',
            fieldValues: ['io1'],
        }
    }]
});
// KubeVirt
VOLUME_CREATE_FIELDS.push({
    provider: 'kubevirt',
    fields: [{
            name: "storage_class_name",
            label: "Storage Class *",
            type: "dropdown",
            class: "margin-bottom",
            value: "",
            defaultValue: "",
            options: [],
            helptext: `Select a storage class, it should support dynamic provisioning, unless you intend to create 
            a static peristent volume. Most storage classes by default support dynamic provisioning.`,
            errorMessage: "Please select a storage class of the cluster.",
            show: true,
            required: true,
            excludeFromPayload:false,
        },
        {
            name: "volume_mode",
            label: "Volume Mode",
            type: "dropdown",
            value: "Filesystem",
            defaultValue: "Filesystem",
            placeholder: "",
            helptext: "The acccepted modes are Filesystem or Block ",
            show: true,
            required: false,
            excludeFromPayload: false,
            options:[{
                title: "Filesystem",
                val: "Filesystem"
            },
            {
                title: "Block",
                val: "Block"
            }]
        },
        {
            name: "access_mode",
            label: "Access Mode",
            type: "dropdown",
            value: "ReadWriteOnce",
            defaultValue: "ReadWriteOnce",
            placeholder: "",
            helptext: 'An access mode may be specified',
            show: true,
            required: false,
            options: [
                {val: "ReadWriteOnce",title: "ReadWriteOnce"},
                {val: "ReadOnlyMany",title: "ReadOnlyMany"},
                {val: "ReadWriteMany",title: "ReadWriteMany"}

            ]
        },
        {
            name: 'dynamic',
            label: 'Dynamic',
            type: 'toggle',
            value: true,
            defaultValue: true,
            excludeFromPayload: false,
            helptext: `If enabled you will create a Persistent Volume Claim
             that will be bound to a dynamically created Persistent Volume.
             If disabled a Persistent Volume will be created statically,
             admin privileges are required for this. The Persistent Volume
             will remain unbound. This needs cluster admin privileges.`,
            show: true,
            required: true,
        },{
            name: 'reclaim_policy',
            label: 'Reclaim Policy',
            type: 'text',
            value: 'Delete',
            defaultValue: 'Delete',
            show: true,
            required: false,
            helptext: 'Valid reclaim policies are Retain, Recycle and Delete',
            showIf:{
                fieldName: 'dynamic',
                fieldValues: [false],
            },
        },
        {
            name: 'volume_type',
            label: 'Volume Type',
            type: 'dropdown',
            value: '',
            defaultValue: '',
            show: true,
            required: false,
            helptext: 'Choose according to the cloud your cluster is located on.',
            showIf: {
                fieldName: 'dynamic',
                fieldValues: [false],
            },            
            options: [
                {val: 'awsElasticBlockStore', title: "AWS ELASTIC BlockStore"},
                {val: 'azureDisk', title: "Azure Disk"},
                {val:'azureFile', title: "Azure File"},
                {val: 'cephfs', title: 'CephFS'},
                {val: 'cinder', title: 'Cinder'},
                {val: 'csi', title: 'CSI'},
                {val: 'fc', title: 'Fibre Channel'},
                {val: 'flexVolume', title: 'Flex Volume'},
                {val: 'flocker', title: 'Flocker'},
                {val: 'gcePersistentDisk', title: "GCE Persistent Disk"},
                {val: 'glusterfs', title: 'Glusterfs'},
                {val: 'hostPath', title: 'Host Path (local only!)'},
                {val: 'iscsi', title: 'iSCSI'},
                {val: 'nfs', title: "NFS"},
                {val: 'photonPersistentDisk', title: 'Photon Persistent Disk'},
                {val: 'portworxVolume', title: 'Portworx Volume'},
                {val: 'quobyte', title: 'Quodbyte'},
                {val: 'rbd', title: 'Rados Block Device'},
                {val: 'scaleIO', title: 'ScaleIO'},
                {val: 'storageos', title: 'StorageOS'},
                {val: 'vsphereVolume', title: 'VSphere Volume'},
            ],
        schemeLoaderFor: 'volume_params'
    },
    {
        name: 'volume_params',
        label: 'Params',
        type: 'fieldgroup',
        value: {},
        defaultValue: {},
        show: true,
        required: false,
        optional: false,
        defaultToggleValue: true,
        helptext: '',
        showIf:{
            "fieldName": "dynamic",
            "fieldValues": [false]
        },
        loadSchemeFolder: '/volumes/volume_params/', // where json schemes are located
        subfields: []
    }        
    ]
});

VOLUME_CREATE_FIELDS.push({
    provider: 'lxd',
    fields: [{
        name: 'pool_id',
        label: 'Pool Id *',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
        helptext: 'Specify the pool id the volume will be created',
    }, {
        name: 'block_filesystem',
        label: 'Block Filesystem ',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
        helptext: 'Filesystem of the storage volume',
    }, {
        name: 'block_mount_options',
        label: 'Block Mount Options',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
        helptext: 'Mount options for block devices',
    }, {
        name: 'security_shifted',
        label: 'Security Shifted',
        type: 'toggle',
        value: '',
        defaultValue: false,
        show: true,
        required: true,
        helptext: 'Enable id shifting overlay (allows attach by multiple isolated containers).'
    },  {
        name: 'path',
        label: 'Path *',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        onForm: 'createForm',
        options: [],
        helptext: 'Path in the container the volume is attached. e.g. /opt/my/data. This is required when attaching the volume to a container',
    }]
});


VOLUME_CREATE_FIELDS.forEach(function(p) {
// add common machine properties fields
    const minimumSize = (p.provider == 'packet' && 10) ||
                      (p.provider == 'aliyun_ecs' && 5) || 1;
    p.fields.splice(0, 0, {
        name: 'size',
        label: 'Size in GB *',
        type: 'number',
        min: minimumSize,
        value: minimumSize,
        defaultValue: minimumSize,
        helptext: `A minimum of ${minimumSize} GB is required.`,
        suffix: ' GB',
        show: true,
        required: true,
        options: [],
        custom: false
    });

    if (p.provider != 'packet') {
        p.fields.splice(0, 0, {
            name: "name",
            label: "Name *",
            type: "text",
            value: "",
            defaultValue: "",
            placeholder: "",
            errorMessage: "Please enter volume's name",
            show: true,
            required: true});
    }

    if (p.provider != 'openstack' && p.provider != 'gig_g8') {
        p.fields.splice(1, 0, {
            name: 'location',
            label: 'Location *',
            type: 'mist_dropdown',
            value: '',
            defaultValue: '',
            show: true,
            required: true, // non required for os, do, // required for azure
            options: []
        });
    }
});

Polymer({
  _template: html`
        <style include="shared-styles forms single-page">
            #content {
                max-width: 900px;
            }

            paper-material {
                display: block;
                padding: 24px;
            }

            paper-progress {
                position: absolute;
                bottom: 85px;
                width: 100%;
                left: 0;
                right: 0;
            }

            :host>::slotted(paper-input-container) {
                padding-top: 16px;
                padding-bottom: 16px;
            }

            .dropdown-with-logos paper-item img {
                margin-right: 16px;
            }

            .single-head {
                @apply --volume-page-head-mixin
            }
        </style>
        <div id="content">
            <paper-material class="single-head layout horizontal">
                <span class="icon">
                    <iron-icon icon="[[section.icon]]"></iron-icon>
                </span>
                <div class="title flex">
                    <h2>
                        Create Volume
                    </h2>
                    <div class="subtitle">
                    </div>
                </div>
            </paper-material>
            <paper-material hidden\$="[[hasCloudsWithVolumes]]">
                <p>Creating volumes is available in OpenStack, GCE, AWS, Azure ARM, Packet, Aliyun, Gig G8, Kubevirt and Digital Ocean clouds
                    <br> Add a cloud using the
                    <a href="/clouds/+add" class="blue-link regular">add cloud form</a>.
                </p>
            </paper-material>
            <paper-material hidden\$="[[!hasCloudsWithVolumes]]">
                <div class="grid-row">
                    <paper-dropdown-menu class="dropdown-block l6 xs12 dropdown-with-logos" label="Select Cloud" horizontal-align="left">
                        <paper-listbox slot="dropdown-content" attr-for-selected="value" selected="{{selectedCloud::iron-select}}" class="dropdown-content">
                            <template is="dom-repeat" items="[[providers]]" as="provider">
                                <paper-item value="[[provider.id]]" disabled\$="[[!_isOnline(provider.id, provider.state, model.clouds)]]">
                                    <img src="[[_computeProviderLogo(provider.provider)]]" width="24px">[[provider.title]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
            </paper-material>
            <paper-material hidden\$="[[selectedCloud]]">
                Depending on the cloud, different volume parameters may be required. Choose an available cloud for the corresponding
                    fields to appear.
            </paper-material>
            <template is="dom-if" if="[[selectedCloud]]" restamp="">
                <paper-material>
                    <app-form id="volume_add" fields="{{fields}}" form="[[form]]" url="/api/v1/clouds/[[selectedCloud]]/volumes" on-response="_handleCreateVolumeResponse" on-error="_handleError"></app-form>
                </paper-material>
            </template>
        </div>
        <iron-ajax id="getResourceGroups" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetResourceGroupsRequest" on-response="_handleGetResourceGroupsResponse" on-error="_handleGetResourceGroupsError"></iron-ajax>
        <iron-ajax id="getStorageClasses" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetStorageClassesRequest" on-response="_handleGetStorageClassesResponse" on-error="_handleGetStorageClassesError"></iron-ajax>
        <iron-ajax id="getLXDStoragePools" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetLXDStoragePoolsRequest" on-response="_handleGetLXDStoragePoolsResponse" on-error="_handleGetLXDStoragePoolsError"></iron-ajax>
`,

  is: 'volume-create',

  properties: {
      section: {
          type: Object
      },
      model: {
          type: Object
      },
      providers: Array,
      form: {
          type: Object,
          value () {
              return {}
          }
      },
      fields: {
          type: Array,
          value () { return [] }
      },
      volumesFields: {
          type: Array,
          value () {
              return VOLUME_CREATE_FIELDS;
          }
      },
      hasCloudsWithVolumes: {
          type: Boolean,
          value: false
      },
      selectedCloud: {
          type: String,
          value: false
      },
      resourceGroupsFieldIndex: {
          type: Number
      },
      storageClassesFieldIndex: {
          type: Number
      },
      lxdStoragePoolsFieldIndex: {
          type: Number
      }
  },

  observers: [
      '_cloudsChanged(model.clouds.*)',
      '_cloudChanged(selectedCloud)',
      '_locationChanged(fields.1.value)',
      '_diskCategoryChanged(fields.3.value)',
      '_fieldValuesChanged(fields.*)'
  ],

  _cloudsChanged (clouds) {
      const volumeClouds = this.model && this.model.cloudsArray.filter(function (cloud) {
          return VOLUME_CREATE_FIELDS.map(i => i.provider).indexOf(cloud.provider) > -1;
      });
      this.set('providers', volumeClouds);
      this.set('hasCloudsWithVolumes', !!(volumeClouds && volumeClouds.length > 0));
  },

  _computeProviderLogo (className) {
      const identifier = className.replace('_', '');
      return `assets/providers/provider-${  identifier  }.png`;
  },

  _isOnline (cloud, state, clouds) {
      return this.model.clouds[cloud] && this.model.clouds[cloud].state == 'online';
  },

  _cloudChanged (selectedCloud) {
      // clear to reset
      this.set('fields', []);
      let volumeFields = [];
      if (this.selectedCloud) {
          const {provider} = this.model.clouds[selectedCloud];
          volumeFields = this.volumesFields.find(function (c) {
              return c.provider == provider;
          });
      }
      // add cloud fields
      if (volumeFields.fields)
          this.set('fields', JSON.parse(JSON.stringify(volumeFields.fields.filter(function(f){
              return f.onForm == 'volume_add' || !f.onForm;
          }))));

      // set values by provider
      this._updateFields(selectedCloud);
  },

  _updateFields(selectedCloud) {
      if (this.model && this.model.clouds && this.selectedCloud && this.model.clouds[this
              .selectedCloud]) {
          const cloudId = this.selectedCloud;
          // if is azure arm, change required values
          if (this.model.clouds[cloudId].provider == "azure_arm") {
              this._updateResourceGroups(cloudId);
          }
          if (this.model.clouds[cloudId].provider == "kubevirt"){
              this._updateStorageClasses(cloudId);
          }

          if(this.model.clouds[cloudId].provider == "lxd"){
              this._updateLXDStoragePools(cloudId);
          }

          this.fields.forEach(function (f, index) {
              if (f.name.endsWith("location")) {
                  let locations = this.model.clouds[cloudId].locationsArray.slice();
                  if (locations.length == 1 && locations[0].name == '') {
                      // If there's a single location preselect it and hide the field
                      f.value = locations[0].id;
                      f.show = false;
                      locations = [];
                  }
                  if (this.model.clouds[cloudId].provider == 'packet') {
                      locations = locations.filter(function(l) {
                          if (l.extra.features.indexOf('storage') > -1) {
                              return true;
                          }
                      });
                  } else if (this.model.clouds[cloudId].provider == 'aliyun_ecs') {
                      locations = locations.filter(function(l) {
                          if (l.extra.available_disk_categories.length) {
                              return true;
                          }
                      });
                  }
                  f.options = locations;
              }
          }.bind(this));
      }
  },

  _locationChanged (locationId, what) {
      if (!locationId || !this.selectedCloud || !this.model.clouds[this.selectedCloud]) return;
      const {provider} = this.model.clouds[this.selectedCloud];
          const location = this.model.clouds[this.selectedCloud].locations[locationId];
      if (provider == 'aliyun_ecs') {
          const diskCategoryOptions = this.volumesFields.find(function (cloud) {
              return cloud.provider == provider;
          }).fields[3].options.filter(function(option) {
              return location.extra.available_disk_categories.indexOf(option.val) > -1;
          });
          this.set('fields.3.options', diskCategoryOptions);
      }
  },

  _diskCategoryChanged(diskCategory) {
      if (!diskCategory || !this.selectedCloud || !this.model.clouds[this.selectedCloud]) return;
      const {provider} = this.model.clouds[this.selectedCloud]; let minSize = 1;
      if (provider == 'aliyun_ecs') {
          if (diskCategory != 'cloud') {
              minSize = 20;
          } else {
              minSize = 5;
          }
          this.set('fields.2.min', minSize);
          if (Number(this.fields[2].value) < minSize) {
              this.set('fields.2.value', minSize);
          }
          this.set('fields.2.helptext', `A minimum of ${ minSize  } GB is required.`)
      }
  },

  _fieldValuesChanged(changeRecord) {
      const fieldName = this.get(changeRecord.path.replace('.value', '')).name;
      if (['create_resource_group','ex_resource_group','new_resource_group']
          .indexOf(fieldName) > -1) {
          this._updateResourceGroupValue(this.selectedCloud);
      }
  },

  _updateResourceGroupValue(cloudId) {
      const createFieldIndex = this._fieldIndexByName('create_resource_group');
      const existingFieldIndex = this._fieldIndexByName('ex_resource_group');
      const newFieldIndex = this._fieldIndexByName('new_resource_group');
      const resourceGroupFieldIndex = this._fieldIndexByName('resource_group');

      if (this.get(`fields.${ createFieldIndex }.value`) == true ) {
          this.set(`fields.${ resourceGroupFieldIndex }.value`, this.get(`fields.${ newFieldIndex }.value`))
      } else {
          this.set(`fields.${ resourceGroupFieldIndex }.value`, this.get(`fields.${ existingFieldIndex }.value`))
      }
  },

  _updateResourceGroups(cloudId) {
      const fieldIndex = this._fieldIndexByName('ex_resource_group');
      if (fieldIndex && this.get(`fields.${  fieldIndex  }.options`) && !this.get(`fields.${  fieldIndex  }.options`).length) {
          this._getResourceGroups(cloudId, fieldIndex);
      }
  },

  _getResourceGroups(cloudId, index) {
      this.set("resourceGroupsFieldIndex",index);
      this.$.getResourceGroups.headers["Content-Type"] = 'application/json';
      this.$.getResourceGroups.headers["Csrf-Token"] = CSRF_TOKEN;                
      this.$.getResourceGroups.url = `/api/v1/clouds/${ cloudId }/resource-groups`;
      this.$.getResourceGroups.generateRequest();
  },

  _handleGetResourceGroupsRequest(e) {
      this.set(`fields.${  this.resourceGroupsFieldIndex  }.loader`, true);
  },

  _handleGetResourceGroupsResponse(e) {
      this.set(`fields.${  this.resourceGroupsFieldIndex  }.options`, e.detail.response || []);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'volume-create.html'}}));
      this.set(`fields.${  this.resourceGroupsFieldIndex  }.loader`, false);
  },

  _handleGetResourceGroupsError(e) {
      console.error('Got resource groups error', e);
  },

  _updateStorageClasses(cloudId) {
      const fieldIndex = this._fieldIndexByName('storage_class_name');
      if (fieldIndex && this.get(`fields.${  fieldIndex  }.options`) && !this.get(`fields.${  fieldIndex  }.options`).length){
          this._getStorageClasses(cloudId, fieldIndex)
      }
  },

  _getStorageClasses(cloudId, index) {
      this.set("storageClassesFieldIndex", index)
      this.$.getStorageClasses.headers["Content-Type"] = 'application/json';
      this.$.getStorageClasses.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getStorageClasses.url = `/api/v1/clouds/${  cloudId  }/storage-classes`;
      this.$.getStorageClasses.generateRequest();
  },

  _handleGetStorageClassesRequest(e) {
      this.set(`fields.${  this.storageClassesFieldIndex  }.loader`, true);
  },

  _handleGetStorageClassesResponse(e){
      const options = []
      e.detail.response.forEach(function(item, ind){
          options.push({title: item, val: item});
      });
      this.set(`fields.${  this.storageClassesFieldIndex  }.options`, options|| []);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'volume-create.html'}}));
      this.set(`fields.${  this.storageClassesFieldIndex  }.loader`, false);
  },

  _handleGetStorageClassesError(e){
      console.error("Got storage classes error ", e);
  },

  _updateLXDStoragePools(cloudId) {
      const fieldIndex = this._fieldIndexByName('pool_id');
      if (fieldIndex && this.get(`fields.${  fieldIndex  }.options`) && !this.get(`fields.${  fieldIndex  }.options`).length) {
          this._getLXDStoragePools(cloudId, fieldIndex);
      }
  },

  _getLXDStoragePools(cloudId, index) {
      this.set("lxdStoragePoolsFieldIndex",index);
      this.$.getLXDStoragePools.headers["Content-Type"] = 'application/json';
      this.$.getLXDStoragePools.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getLXDStoragePools.url = `/api/v1/clouds/${ cloudId }/storage-pools`;
      this.$.getLXDStoragePools.generateRequest();
  },

  _handleGetLXDStoragePoolsRequest(e) {
      this.set(`fields.${  this.lxdStoragePoolsFieldIndex  }.loader`, true);
  },

  _handleGetLXDStoragePoolsResponse(e) {
      this.set(`fields.${  this.lxdStoragePoolsFieldIndex  }.options`, e.detail.response || []);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'volume-create.html'}}));
      this.set(`fields.${  this.lxdStoragePoolsFieldIndex  }.loader`, false);
  },

  _handleGetLXDStoragePoolsError(e) {
      console.error('Got LXD storage pools error error', e);
  },

  _fieldIndexByName (name) {
      const field = this.fields.findIndex(function (f) {
          return f.name == name;
      });
      return field;
  },

  _handleCreateVolumeResponse (e) {
      const response = JSON.parse(e.detail.xhr.response);
      this.dispatchEvent(new CustomEvent('go-to', {
          bubbles: true, composed: true,
          detail: {
              url: '/volumes'
          }}));
  },

  _handleError (e) {
      console.log(e);
      this.$.errormsg.textContent = e.detail.request.xhr.responseText;
      this.set('formError', true);
  },

  _goBack () {
      history.back();
  }
});
