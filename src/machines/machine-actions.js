import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-input/paper-input-error.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/iron-ajax/iron-ajax.js';
import '../../../../@polymer/iron-icons/iron-icons.js';
import '../../../../vaadin-icons/vaadin-icons.js';
import '../../../../mist-list/mist-list-actions.js';
import '../../../../mist-list/mist-list-actions-behavior.js';
import '../tags/tags-form.js';
import '../helpers/xterm-dialog.js';
import '../helpers/dialog-element.js';
import '../helpers/transfer-ownership.js';
import '../mist-icons.js';
import './associate-key.js';
import './run-script-on-machine.js';
import './resize-dialog.js';
import './machine-edit.js';
import './attach-volume-on-machine.js';
import './machine-snapshots.js';
import './expose-ports.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
var VOLUME_CREATE_FIELDS = []

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
    var minimumSize = (p.provider == 'packet' && 10) ||
                      (p.provider == 'aliyun_ecs' && 5) || 1;
    p.fields.splice(0, 0, {
        name: 'size',
        label: 'Size in GB *',
        type: 'number',
        min: minimumSize,
        value: minimumSize,
        defaultValue: minimumSize,
        helptext: 'A minimum of '+minimumSize+' GB is required.',
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

const MACHINE_ACTIONS = {
    'attach-volume': {
        'name': 'attach volume',
        'icon': 'device:storage',
        'confirm': false,
        'multi': false,
        'single': true
    },
    'create_snapshot': {
        'name': 'create snapshot',
        'icon': 'image:add-a-photo',
        'confirm': true,
        'multi': false
    },
    'remove_snapshot': {
        'name': 'remove snapshot',
        'icon': 'image:monochrome-photos',
        'confirm': true,
        'multi': false
    },
    'revert_to_snapshot': {
        'name': 'revert to snapshot',
        'icon': 'social:party-mode',
        'confirm': true,
        'multi': false
    },
    'shell': {
        'name': 'shell',
        'icon': 'vaadin:terminal',
        'confirm': false,
        'multi': false
    },
    'console': {
        'name': 'console',
        'icon': 'vaadin:terminal',
        'confirm': false,
        'multi': false
    },
    'tag': {
        'name': 'tag',
        'icon': 'label',
        'confirm': true,
        'multi': true
    },
    'associate-key': {
        'name': 'associate key',
        'icon': 'communication:vpn-key',
        'confirm': true,
        'multi': false
    },
    'run-script': {
        'name': 'run script',
        'icon': 'image:movie-creation',
        'confirm': true,
        'multi': false
    },
    'reboot': {
        'name': 'reboot',
        'icon': 'av:replay',
        'confirm': true,
        'multi': true
    },
    'start': {
        'name': 'start',
        'icon': 'av:play-arrow',
        'confirm': true,
        'multi': true
    },
    'stop': {
        'name': 'stop',
        'icon': 'av:stop',
        'confirm': true,
        'multi': true
    },
    'clone': {
        'name': 'clone',
        'icon': 'content-copy',
        'confirm': true,
        'multi': false,
        'fields': [{
            type: 'text',
            name: 'name',
            label: "Clone's Name",
            type: 'text',
            value: '',
            defaultValue: '',
            show: true,
            required: false,
        }]
    },
    'suspend': {
        'name': 'suspend',
        'icon': 'av:stop',
        'confirm': true,
        'multi': true
    },
    'rename': {
        'name': 'rename',
        'icon': 'editor:mode-edit',
        'confirm': true,
        'multi': false
    },
    'resize': {
        'name': 'resize',
        'icon': 'image:photo-size-select-small',
        'confirm': true,
        'multi': false
    },
    'resume': {
        'name': 'resume',
        'icon': 'av:replay',
        'confirm': true,
        'multi': true
    },
    'undefine': {
        'name': 'undefine',
        'icon': 'image:panorama-fish-eye',
        'confirm': true,
        'multi': true
    },
    'remove': {
        'name': 'remove',
        'icon': 'remove',
        'confirm': true,
        'multi': true
    },
    'destroy': {
        'name': 'destroy',
        'icon': 'delete',
        'confirm': true,
        'multi': true
    },
    'transfer-ownership': {
        'name': 'transfer ownership',
        'icon': 'icons:redo',
        'confirm': false,
        'multi': true
    },
    'tag': {
        'name': 'tag',
        'icon': 'label',
        'confirm': true,
        'multi': true
    },
    'webconfig': {
        'name': 'webconfig',
        'icon': 'mist-icons:menu',
        'confirm': true,
        'multi': false
    },
    'delete': {
        'name': 'delete',
        'icon': 'delete',
        'confirm': true,
        'multi': true
    },
    'expose': {
        'name': 'expose',
        'icon': 'icons:forward',
        'confirm': true,
        'multi': false

    }
};

Polymer({
  _template: html`
        <style include="shared-styles">
            mist-list-actions {
                width: 100%;
            }
        </style>
        <machine-edit id="renamedialog" items="[[items]]"></machine-edit>
        <run-script-on-machine id="runscriptdialog" items="[[items]]" scripts="[[model.scriptsArray]]"></run-script-on-machine>
        <expose-ports id="exposePortsdialog" machine="[[items.0]]" provider="[[getProvider(items.0)]]"></expose-ports>
        <associate-key id="associatekeydialog" items="[[items]]" model="[[model]]"></associate-key>
        <machine-snapshots id="snapshotdialog" machine="[[items.0]]" snapshots="" action=""></machine-snapshots>
        <attach-volume-on-machine id="attachvolumedialog" machine="[[items.0]]" model="[[model]]"></attach-volume-on-machine>
        <dialog-element id="confirm" fields="{{action.fields}}"></dialog-element>
        <tags-form id="tagsdialog" model="[[model]]" items="[[items]]" type="machine"></tags-form>
        <transfer-ownership id="ownershipdialog" user="[[user]]" members="[[_otherMembers(model.membersArray,items.length)]]" items="[[items]]" type="[[type]]"></transfer-ownership>
        <resize-dialog id="resizedialog" machine="[[_getMachine(items.length)]]" clouds="[[model.clouds]]"></resize-dialog>
        <iron-ajax id="request" handle-as="json" loading="{{loadingData}}" on-response="handleResponse" on-error="handleError"></iron-ajax>
        <slot>
            <mist-list-actions actions="[[actions]]"></mist-list-actions>
        </slot>
`,

  is: 'machine-actions',
  behaviors: [MistListActionsBehavior],

  properties: {
      model: {
          type: Object
      },
      items: {
          type: Array,
          value: function() {
              return []
          }
      },
      actions: {
          type: Array,
          value: function() {
              return []
          },
          notify: true
      },
      inSinglePage: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      action: {
          type: Object
      },
      providersWithVolumes: {
          type: Array,
          value: function() {
              return VOLUME_CREATE_FIELDS.map(i => i.provider);
          }
      },
  },

  listeners: {
      'rename-machine': 'renameAction',
      'transfer-ownership': 'transferOwnership',
      'perform-action': 'performAction',
      'confirmation': 'confirmAction',
      'select-action': 'selectAction',
  },

  ready: function() {},

  attached: function() {
      this.$.request.headers["Content-Type"] = 'application/json';
      this.$.request.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.request.method = "POST";
  },

  getProviders: function(machines) {
      var providers = []
      for (var i=0; i < machines.length; i++) {
          providers.push(this.getProvider(machines[i]));
      }
      return providers;
  },

  getProvider: function(machine) {
      if (machine && this.model && this.model.clouds && this.model.clouds[machine.cloud]) {
          return this.model.clouds[machine.cloud].provider;
      }
  },

  computeItemActions: function(machine) {
      var arr = [];
      if (this.model && this.model.clouds && ['vsphere', 'openstack', 'libvirt'].indexOf(this.model.clouds[machine.cloud].provider) > -1){
          if(machine.state == "running" && (this.model.clouds[machine.cloud].provider != 'libvirt' || machine.parent)) {
              arr.push('console');
          }
      }
      if (machine) {
          if (machine.os_type != 'windows' && machine.machine_type != 'ilo-host' && ["terminated", "stopped"].indexOf(machine.state) == -1) {
              arr.push('shell');
              arr.push('associate-key');
          }
          if (this.inSinglePage && this.providersWithVolumes.indexOf(this.model.clouds[machine.cloud].provider) > -1) {
              arr.push('attach-volume');
          }
      }
      if (machine && machine.actions) {
          for (var action in machine.actions) {
              if (machine.actions[action])
                  arr.push(action);
          }
      }
      if (machine.key_associations && machine.key_associations.length) {
          arr.push('run-script');
      }
      if (this.model && this.model.org.ownership_enabled && (machine.owned_by == this.model.user.id || this.model.org.is_owner)) {
          arr.push('transfer-ownership');
      }
      return arr.sort(this._sortActions.bind(this));
  },

  _sortActions: function(a, b) {
      var sortOrder = [
          'console',
          'shell',
          'webconfig',
          'expose',
          'start',
          'stop',
          'clone',
          'suspend',
          'resume',
          'reboot',
          'resize',
          'undefine',
          'remove',
          'destroy',
          'delete',
          'attach-volume',
          'create_snapshot',
          'revert_to_snapshot',
          'remove_snapshot',
          'associate-key',
          'rename',
          'run-script',
          'transfer-ownership',
          'tag'
      ];
      if (sortOrder.indexOf(a) < sortOrder.indexOf(b)) {
          return -1;
      }
      if (sortOrder.indexOf(a) > sortOrder.indexOf(b)) {
          return 1;
      }
      // a must be equal to b
      return 0;
  },

  _otherMembers: function(members, items) {
      if (this.items && members) {
          var owners = this.items.map(function(i) { return i.owned_by; })
              .filter(function(value, index, self) { return self.indexOf(value) === index; });
          // filter out pending users and the single owner of the item-set if that is the case
          return members.filter(function(m) {
              return owners.length == 1 ? m.id != owners[0] && !m.pending : !m.pending;
          });
      }
  },

  _getMachine: function(length) {
      if (this.items.length)
          return this.get('items.0');
      else
          return undefined;
  },

  computeActionListDetails: function(actions) {
      var ret = [];
      for (var i = 0; i < actions.length; i++) {
          ret.push(MACHINE_ACTIONS[actions[i]]);
      }
      return ret;
  },

  _delete: function(items) {
      //set up iron ajax
      this.$.request.headers["Content-Type"] = 'application/json';
      this.$.request.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.request.method = "DELETE";

      for (var i = 0; i < this.items.length; i++) {
          this.$.request.url = "/api/v1/machines/" + this.items[i].id
          this.$.request.generateRequest();
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {
              msg: 'Deleting ' + this.items[i].name,
              duration: 1000
          } }))
      }
  },

  _showDialog: function(info) {
      var dialog = this.shadowRoot.querySelector('dialog-element');
      if (info) {
          for (var i in info) {
              dialog[i] = info[i];
          }
      }
      dialog._openDialog();
  },

  selectAction: function(e) {
      console.log('selectAction machine-actions');
      if (this.items.length) {
          var action = e.detail.action;
          this.set('action', action);
          // console.log('perform action mist-action', this.items);
          if (action.confirm && ['tag', 'rename', 'expose', 'run script', 'associate key', 'resize', 'webconfig', 'create snapshot', 'remove snapshot', 'revert to snapshot'].indexOf(action.name) ==
              -1) {
              var plural = this.items.length == 1 ? '' : 's',
                  count = this.items.length > 1 ? this.items.length + ' ' : '';
              if (action.name == "clone" && this.action.fields) {
                  this.set('action.fields.0.value', this.items[0].value || this.items[0].name + "-clone");
              }
              this._showDialog({
                  title: this.action.name + ' ' + count + 'machine' + plural + '?',
                  body: "You are about to " + this.action.name + " " + this.items.length + " machine" +
                      plural + ".",
                  list: this._makeList(this.items, "name"),
                  action: action.name,
                  danger: true,
                  hideText: this.action.fields ? true : false,
                  reason: "machine." + this.action.name
              });
          } else if (action.name == 'delete') {
              this._delete(this.items);
          } else if (action.name == 'resize') {
              this.$.resizedialog._openDialog();
          } else if (action.name == 'tag') {
              this.$.tagsdialog._openDialog();
          } else if (action.name == 'attach volume') {
              this.$.attachvolumedialog._openDialog();
          } else if (action.name == 'transfer ownership') {
              this.$.ownershipdialog._openDialog();
          } else if (action.name == 'create snapshot') {
              this.$['snapshotdialog'].action = action.name;
              this.$['snapshotdialog']._openDialog();
          } else if (action.name == 'remove snapshot') {
              this.$['snapshotdialog'].snapshots = this.items[0].extra.snapshots;
              this.$['snapshotdialog'].action = action.name;
              this.$['snapshotdialog']._openDialog();
          } else if (action.name == 'revert to snapshot') {
              this.$['snapshotdialog'].snapshots = this.items[0].extra.snapshots;
              this.$['snapshotdialog'].action = action.name;
              this.$['snapshotdialog']._openDialog();
          } else if (action.name == 'rename') {
              this.$['renamedialog']._openDialog();
          } else if (action.name == 'webconfig') {
              this._openWebconfig(this.items);
          } else if (action.name == 'run script') {
              this.$['runscriptdialog']._openDialog();
          } else if (action.name == 'associate key') {
              this.$['associatekeydialog']._openDialog();
          } else if (action.name == 'expose') {
              this.$['exposePortsdialog']._openDialog();
          } else if (!action.confirm) {
              this.performMachineAction(action, this.items);
          }
      }
  },

  _openWebconfig: function(items) {
      var machine = this.items[0];
      var url = 'https://' + machine.hostname + ':81';
      window.open(url, "view");
  },

  confirmAction: function(e) {
      if (e.detail.confirmed)
          this.performMachineAction(this.action, this.items);
  },

  renameAction: function(e) {
      console.log('renameAction', e.detail);
      this.performMachineAction(e.detail.action, this.items, e.detail.name);
  },

  transferOwnership: function(e) {
      var payload = {
          user_id: e.detail.user_id, //new owner
          resources: {}
      };
      payload.resources['machine'] = this.items.map(function(i) { return i.id });
      console.log('transferOwnership', e.detail, payload);
      this.$.request.url = '/api/v1/ownership';
      this.$.request.headers["Content-Type"] = 'application/json';
      this.$.request.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.request.method = "POST";
      this.$.request.body = payload;
      this.$.request.generateRequest();
  },

  performMachineAction: function(action, items, name) {
      var runitems = items.slice();
      // console.log('perform action machine',items);
      var run = function(el) {
          var uri, payload, item = runitems.shift(),
              method = 'POST';
          // console.log('renameAction', item.name, action.name, name);
          //machines
          if (action.name == 'shell') {
              console.warn('opening shell');
              // load page import on demand.
              // el.importHref(el.resolveUrl('/elements/helpers/xterm-dialog.html'), null, null, true);
              // remove existing terminals from DOM
              var xterm = document.querySelector("xterm-dialog");
              if (xterm) {
                  xterm.remove();
                  // console.log('xterm removed', this.items);
              }

              xterm = el.querySelector("xterm-dialog");
              if (!xterm) {
                  xterm = document.createElement("xterm-dialog");
                  xterm.target = item;
                  var app = document.querySelector('mist-app');
                  app.shadowRoot.insertBefore(xterm, app.shadowRoot.firstChild);
              }
              // console.log('perform action shell', item);
              return;
          } else if (['reboot', 'start', 'stop', 'suspend', 'resume', 'undefine', 'destroy', 'remove'].indexOf(action.name) >
              -1) {
              uri = '/api/v1/machines/' + item.id;
              payload = {
                  'action': action.name
              };
          } else if (action.name == 'rename') {
              uri = '/api/v1/machines/' + item.id;
              payload = {
                  'action': action.name,
                  'name': name
              };
          } else if (action.name == 'clone') {
              uri = '/api/v1/machines/' + item.id;
              payload = {
                  'action': action.name,
                  'name': action.fields[0].value
              };
          } else if (action.name == 'probe') {
              uri = '/api/v1/machines/' + item.id + '/probe';
              payload = {
                  'host': item.public_ips[0],
                  'key': item.key_associations[0]
              };
          } else if (action.name == 'console') {
              uri = '/api/v1/machines/' + item.id + '/console';
              //window.open(uri, 'view');
              var form = document.createElement("form");
              form.setAttribute("method", "post");
              form.setAttribute("action", uri);
              form.setAttribute("target", "view");
              var hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", "Csrf-Token");
              hiddenField.setAttribute("value", CSRF_TOKEN);
              form.appendChild(hiddenField);
              document.body.appendChild(form);

              window.open('', 'view');

              form.submit();
              return;
          } else if (action.name == 'transfer ownership') {
              return;
          } else {
              console.error('unknown action', action, 'on item', item);
              return;
          }

          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
              if (xhr.readyState == XMLHttpRequest.DONE) {
                  var message = '';
                  if (xhr.status == 200) {
                      console.log(action, 'success');
                      message = 'Successfully ' + this.inPast(action.name) + ' machine. Updating...';
                      this.dispatchEvent(new CustomEvent('action-finished', { bubbles: true, composed: true, detail: {
                          success: true
                      } }));

                      // for machines destroy only and only if in machine page
                      var app_location = document.querySelector('app-location');
                      if (["destroy","remove"].indexOf(action.name) > -1 && document.location.pathname && document.location.pathname.split(
                              '/machines/')[1] == item.id) {
                          // kvm machines
                          if (item.provider != 'kvm') {
                              this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
                                  url: '/machines'
                              } }));

                          }
                      }
                      if (item.provider == 'kvm' && action.name == "undefine" && document.querySelector('app-location').path.split(
                              '/machines/')[1] == item.id) {
                          this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
                              url: '/machines'
                          } }));

                      }
                  } else {
                      console.error(action, 'failed');
                      console.log(xhr);
                      var responsetext = xhr.responseText ? xhr.responseText : '';
                      message = action.name.toUpperCase() + ' failed.' + responsetext;
                      this.dispatchEvent(new CustomEvent('action-finished', { bubbles: true, composed: true, detail: {
                          success: false
                      } }));

                  }
                  this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
                      msg: message,
                      duration: 5000
                  } }));

                  if (runitems.length) {
                      run(el);
                  } else {
                      this.dispatchEvent(new CustomEvent('action-finished'));



                  }
              }
          }.bind(this);

          xhr.open(method, uri);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr.setRequestHeader("Csrf-Token", CSRF_TOKEN);
          xhr.send(JSON.stringify(payload));

          var logMessage = 'Performing action ' + action.name.toUpperCase() + ' on machine ' + this.model.machines[
              item.id].name;
          this.dispatchEvent(new CustomEvent('performing-action', { bubbles: true, composed: true, detail: {
              log: logMessage
          } }));

      }.bind(this);

      run(this);
  },

  handleResponse: function(e) {
      console.log('handle response', e, this.$.request.body);
      if (this.$.request && this.$.request.body && this.$.request.body.action)
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
              msg: 'Action: ' + (this.$.request.body.action || 'ownership transfer') + ' successfull',
              duration: 3000
          } }));

      if (e.detail.xhr.responseURL.endsWith("api/v1/ownership") && e.detail.xhr.status == 200) {
          this.$.ownershipdialog._closeDialog();
          this.dispatchEvent(new CustomEvent('action-finished'));
          
          if (this.querySelector('mist-list-actions')) {
              this.querySelector('mist-list-actions').fire('action-finished');
          }

          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
              msg: 'Successfull ownership transfer',
              duration: 3000
          } }));

      }
  },

  handleError: function(e) {
      // console.log(e.detail.request.xhr.statusText);
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
          msg: 'Error: ' + e.detail.request.xhr.status + " " + e.detail.request.xhr.statusText,
          duration: 5000
      } }));

      if (e.detail.request.xhr.responseURL.endsWith("api/v1/ownership")) {
          this.$.ownershipdialog._closeDialog();
      }
  },

  _makeList: function(items, property) {
      if (items && items.length)
          return items.map(function(item) {
              return item[property];
          });
  },

  inPast: function(action) {
      if (action == 'shell')
          return 'opened shell'
      else if (action == 'expose')
          return 'exposed'
      else if (action == 'tag')
          return 'tagged'
      else if (action == 'associate key')
          return 'associated key'
      else if (action == 'run-script')
          return 'run script'
      else if (action == 'reboot')
          return 'rebooted'
      else if (action == 'start')
          return 'started'
      else if (action == 'stop')
          return 'stopped'
      else if (action == 'suspend')
          return 'suspended'
      else if (action == 'rename')
          return 'renamed'
      else if (action == 'resume')
          return 'resumed'
      else if (action == 'clone')
          return 'cloned'
      else if (action == 'undefine')
          return 'undefined'
      else if (action == 'suspend')
          return 'suspended'
      else if (action == 'destroy')
          return 'destroyed'
      else if (action == 'remove')
          return 'removed'
      else if (action == 'star')
          return 'starred'
      else if (action == 'unstar')
          return 'unstarred'
      else if (action == 'destroy')
          return 'destroyed'
      else if (action == 'make default')
          return 'made default'
      else if (action == 'run')
          return 'run'
      else if (action == 'enable')
          return 'enabled'
      else if (action == 'disable')
          return 'disabled'
      else if (action == 'disable')
          return 'disabled'
      else if (action == 'delete')
          return 'deleted'
      else
          return ''
  }
});
