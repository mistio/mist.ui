import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import { rbacBehavior } from '../rbac-behavior.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
let MACHINE_CREATE_FIELDS = [];

// AZURE
MACHINE_CREATE_FIELDS.push({
    provider: 'azure',
    fields: [{
        name: 'azure_port_bindings',
        label: 'Azure Port Bindings',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        helptext: '',
    }, {
        name: 'azure_port_bindings',
        label: 'Azure Port Bindings',
        type: 'textarea',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: 'e.g. http tcp 80:80, smtp tcp 25:25, https tcp 443:443',
    }],
});


// AZURE ARM
MACHINE_CREATE_FIELDS.push({
    provider: 'azure_arm',
    fields: [{
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
    },  {
        name: 'resource_group',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        excludeFromPayload: false
    }, {
        name: 'ex_resource_group',
        label: 'Resource Group',
        type: 'mist_dropdown_searchable',
        loader: true,
        class: 'margin-bottom',
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
    }, {
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
        name: 'create_storage_account',
        h3: 'Storage account',
        label: 'Create new storage account',
        type: 'radio',
        value: true,
        defaultValue: true,
        hidden: true,
        class: 'bind-both',
        helptext: 'Create the machine in a new or existing storage account. Existing storage account options depend on location and resource group.',
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
    }, {
        name: 'storage_account',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        excludeFromPayload: false
    }, {
        name: 'new_storage_account',
        label: 'Storage Account name',
        type: 'text',
        value: '',
        class: 'margin-bottom',
        defaultValue: '',
        show: true,
        excludeFromPayload: true,
        required: false,
        helptext: '',
        showIf: {
            fieldName: 'create_storage_account',
            fieldValues: [true],
        }
    }, {
        name: 'ex_storage_account',
        label: 'Storage Account',
        type: 'mist_dropdown_searchable',
        loader: true,
        value: '',
        search: '',
        class: 'margin-bottom',
        defaultValue: '',
        show: true,
        excludeFromPayload: true,
        required: true,
        options: [],
        alloptions: [],
        showIf: {
            fieldName: 'create_storage_account',
            fieldValues: [false],
        },
    }, {
        name: 'storage_account_type',
        label: 'Storage account type for OS Disk',
        type: 'dropdown',
        value: 'StandardSSD_LRS',
        defaultValue: 'StandardSSD_LRS',
        helptext: 'Specify the storage account type for the managed OS Disk.',
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
    }, {
        name: 'create_network',
        h3: 'Network',
        label: 'Create new network',
        type: 'radio',
        value: true,
        hidden: true,
        defaultValue: true,
        class: 'bind-both',
        helptext: 'Create the machine in a new or existing network. Existing network options depend on location and resource group.',
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
    }, {
        name: 'networks',
        value: '',
        type: 'text',
        defaultValue: '',
        show: false,
        excludeFromPayload: false
    }, {
        name: 'new_network',
        label: 'Network name',
        type: 'text',
        value: '',
        defaultValue: '',
        class: 'margin-bottom',
        show: false,
        required: false,
        excludeFromPayload: true,
        helptext: '',
        showIf: {
            fieldName: 'create_network',
            fieldValues: [true],
        }
    }, {
        name: 'ex_networks',
        label: 'Network',
        type: 'mist_dropdown_searchable',
        noPluralisation: true,
        value: '',
        search: '',
        class: 'margin-bottom',
        excludeFromPayload: true,
        defaultValue: '',
        show: true,
        required: true,
        options: [],
        showIf: {
            fieldName: 'create_network',
            fieldValues: [false],
        },
    }, {
        name: 'machine_username',
        label: 'Machine Username *',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        helptext: 'Machine username',
    }, {
        name: 'machine_password',
        label: 'Machine Password *',
        type: 'password',
        value: '',
        defaultValue: '',
        // http://regexlib.com/REDetails.aspx?regexp_id=887
        pattern: '(?=^.{12,123}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*',
        errorMessage: 'Invalid password!',
        show: false,
        required: false,
        helptext: 'Windows machine password is required. The password must be between 12-123 characters long and must contain an uppercase character, a lowercase character, a numeric digit and a special character.',
    }],
});


// DIGITALOCEAN
MACHINE_CREATE_FIELDS.push({
    provider: 'digitalocean',
    fields: [],
});

// MAXIHOST
MACHINE_CREATE_FIELDS.push({
    provider: 'maxihost',
    fields: [],
});

// DOCKER
MACHINE_CREATE_FIELDS.push({
    provider: 'docker',
    fields: [{
        name: 'docker_env',
        label: 'Docker Env',
        type: 'textarea',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: '',
    }, {
        name: 'docker_command',
        label: 'Docker Command',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: '',
    }, {
        name: 'docker_port_bindings',
        label: 'Docker Port Bindings',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        helptext: '',
    }, {
        name: 'docker_exposed_ports',
        label: 'Docker Exposed Ports',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        helptext: '',
    }, {
        name: 'ports',
        label: 'Ports',
        type: 'textarea',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: 'e.g. 80:80',
    }],
});

// AWS
MACHINE_CREATE_FIELDS.push({
    provider: 'ec2',
    fields: [{
        name: 'security_group',
        label: 'Security group *',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
        helptext: 'Specify the security group for this machine',
    }, {
        name: 'subnet_id',
        label: 'Subnet',
        type: 'mist_dropdown_searchable',
        search: '',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        options: [],
        helptext: 'Optional. If you leave subnet blank, the machine will be created in the location\'s (availability zone) default subnet.',
        showIf: {
            fieldName: 'location',
            fieldExists: true,
        },
    }, ],
});

// GIG G8
MACHINE_CREATE_FIELDS.push({
    provider: 'gig_g8',
    fields: [{
        name: 'networks',
        label: 'Network *',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
        canConfigure: false
    },{
        name: 'description',
        label: 'Description',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: false
    }
],
});


// Alibaba Cloud
MACHINE_CREATE_FIELDS.push({
    provider: 'aliyun_ecs',
    fields: [/*{
        name: 'assign_public_ip',
        label: 'Assign Public IP',
        type: 'toggle',
        value: true,
        defaultValue: true,
        show: true,
        required: false,
    }, {
        name: 'internet_max_bandwidth_out',
        label: 'Maximum outgoing bandwidth',
        type: 'slider',
        value: 5,
        defaultValue: 5,
        min: 1,
        max: 100,
        unit: 'Mbps',
        helptext: 'Mbps',
        show: true,
        required: false,
        showIf: {
            fieldName: 'assign_public_ip',
            fieldValues: [true],
        }
    }*/],
});


// GCE
MACHINE_CREATE_FIELDS.push({
    provider: 'gce',
    fields: [{
        name: 'image_extra',
        label: 'Image extra',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
    }, {
        name: 'location_name',
        label: 'Location name',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
    }, {
        name: 'networks',
        label: 'Network',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
    }, {
        name: 'subnetwork',
        label: 'Subnetwork',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        options: [],
    }],
});

// HOSTVIRTUAL
MACHINE_CREATE_FIELDS.push({
    provider: 'hostvirtual',
    fields: [],
});

// KVM
MACHINE_CREATE_FIELDS.push({
    provider: 'libvirt',
    fields: [{
        name: 'networks',
        label: 'Networks',
        type: 'mist_networks',
        value: [],
        defaultValue: [],
        show: true,
        required: false,
        options: [],
        canConfigure: true
    }, {
        name: 'vnfs',
        label: 'Configure Virtual Network Functions',
        type: 'fieldgroup',
        value: {},
        defaultValue: {},
        defaultToggleValue: false,
        helptext: '',
        show: true,
        required: false,
        optional: true,
        inline: true,
        loader: true,
        singleColumn: true,
        subfields: [{
            name: 'vnfs',
            label: 'Available VNFs',
            type: 'checkboxes',
            helptext: '',
            show: true,
            required: false,
            options: [],
            loader: true
        }]
    }, {
        name: 'libvirt_disk_path',
        type: 'text',
        label: 'Path to create VM\'s disk',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: 'Where the VM disk file will be created',
        helpHref: 'http://docs.mist.io/article/99-managing-kvm-with-mist-io',
    }, {
        name: 'libvirt_disk_size',
        type: 'text',
        label: 'Disc size (GB)',
        value: 4,
        defaultValue: 4,
        show: true,
        required: true,
        pattern: '[0-9]*',
        helptext: 'The VM\'s size will be the size of the image plus the number in GBs provided here',
        helpHref: 'http://docs.mist.io/article/99-managing-kvm-with-mist-io',
    }]
});

// LINODE
MACHINE_CREATE_FIELDS.push({
    provider: 'linode',
    fields: [{
        name: 'image_extra',
        label: 'Image extra',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
    }, {
        name: 'location_name',
        label: 'Location name',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
    }],
});

// OPENSTACK
MACHINE_CREATE_FIELDS.push({
    provider: 'openstack',
    fields: [{
        name: 'networks',
        label: 'Networks',
        type: 'checkboxes',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
    }, {
        name: 'associate_floating_ip',
        label: 'Associate Floating IP',
        type: 'toggle',
        value: 'true',
        defaultValue: 'true',
        show: false,
        required: false,
        showIf: {
            fieldName: 'networks',
            fieldExists: true,
        },
    }]
});

// PACKET
MACHINE_CREATE_FIELDS.push({
    provider: 'packet',
    fields: [{
        name: 'ip_addresses',
        type: 'array',
        value: [{address_family: 4, public: true},{address_family: 4, public: false}, { address_family: 6, public: false}],
        defaultValue: [{address_family: 4, public: false}, { address_family: 6, public: false}],
        show: false,
        required: true
    },{
        name: 'public_ipv4',
        label: 'Public IPv4',
        type: 'toggle',
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        show: true,
        required: true,
        helptext: "Choose whether to assign Public IPv4 IPs."
    }, {
        name: 'public_ipv4_subnet_size',
        label: 'IPv4 Subnet Size',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        helptext: "Choose the public IPv4 subnet sizes that you would like to allocate when provisioning this device. By default, Packet assigns a /31 to each host; however, Windows requires a /30 and ESXi requires a /29.",
        options: [{ title: '/28', val: '28'
        }, { title: '/29', val: '29'
        }, { title: '/30', val: '30'
        }, { title: '/31', val: '31'
        }],
        showIf: {
            fieldName: 'public_ipv4',
            fieldValues: [true],
        },
    },{
        name: 'public_ipv6',
        label: 'Public IPv6',
        type: 'toggle',
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        show: true,
        required: true,
        helptext: "Choose whether to assign Public IPv6 IPs."
    }, {
        name: 'public_ipv6_subnet_size',
        label: 'IPv6 Subnet Size',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        helptext: "Choose the public IPv6 subnet size that you would like to allocate when provisioning this device. By default, Packet assigns a /31 to each host; however, Windows requires a /30 and ESXi requires a /29.",
        options: [{ title: '/64', val: '64'
        }, { title: '/65', val: '65'
        }, { title: '/66', val: '66'
        }, { title: '/67', val: '67'
        }, { title: '/68', val: '68'
        }, { title: '/69', val: '69'
        }, { title: '/70', val: '70'
        }, { title: '/71', val: '71'
        }, { title: '/72', val: '72'
        }, { title: '/73', val: '73'
        }, { title: '/74', val: '74'
        }, { title: '/74', val: '74'
        }, { title: '/74', val: '74'
        }, { title: '/75', val: '75'
        }, { title: '/76', val: '76'
        }, { title: '/77', val: '77'
        }, { title: '/78', val: '78'
        }, { title: '/79', val: '79'
        }, { title: '/80', val: '80'
        }, { title: '/81', val: '81'
        }, { title: '/82', val: '82'
        }, { title: '/83', val: '83'
        }, { title: '/84', val: '84'
        }, { title: '/85', val: '85'
        }, { title: '/86', val: '86'
        }, { title: '/87', val: '87'
        }, { title: '/88', val: '88'
        }, { title: '/89', val: '89'
        }, { title: '/90', val: '90'
        }, { title: '/91', val: '91'
        }, { title: '/92', val: '92'
        }, { title: '/93', val: '93'
        }, { title: '/94', val: '94'
        }, { title: '/95', val: '95'
        }, { title: '/96', val: '96'
        }, { title: '/97', val: '97'
        }, { title: '/98', val: '98'
        }, { title: '/99', val: '99'
        }, { title: '/100', val: '100'
        }, { title: '/101', val: '101'
        }, { title: '/102', val: '102'
        }, { title: '/103', val: '103'
        }, { title: '/104', val: '104'
        }, { title: '/105', val: '105'
        }, { title: '/106', val: '106'
        }, { title: '/107', val: '107'
        }, { title: '/108', val: '108'
        }, { title: '/109', val: '109'
        }, { title: '/110', val: '110'
        }, { title: '/111', val: '111'
        }, { title: '/112', val: '112'
        }, { title: '/113', val: '113'
        }, { title: '/114', val: '114'
        }, { title: '/115', val: '115'
        }, { title: '/116', val: '116'
        }, { title: '/117', val: '117'
        }, { title: '/118', val: '118'
        }, { title: '/119', val: '119'
        }, { title: '/120', val: '120'
        }, { title: '/121', val: '121'
        }, { title: '/122', val: '122'
        }, { title: '/123', val: '123'
        }, { title: '/124', val: '124'
        }, { title: '/125', val: '125'
        }, { title: '/126', val: '126'
        }, { title: '/127', val: '127'
        }],
        showIf: {
            fieldName: 'public_ipv6',
            fieldValues: [true],
        },
    }, {
        name: 'private_ipv4_subnet_size',
        label: 'Private IPv4 Subnet Size',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: "Choose the private IPv6 subnet size that you would like to allocate when provisioning this device.",
        options: [{ title: '/28', val: '28'
        }, { title: '/29', val: '29'
        }, { title: '/30', val: '30'
        }, { title: '/31', val: '31'
        }]
    }],
});

// RACKSPACE
MACHINE_CREATE_FIELDS.push({
    provider: 'rackspace',
    fields: [],
});

// SOFTLAYER
MACHINE_CREATE_FIELDS.push({
    provider: 'softlayer',
    fields: [{
        name: 'softlayer_backend_vlan_id',
        label: 'Backend VLAN ID',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        helptext: 'Optional.',
    }, {
        name: 'hourly',
        label: 'Hourly billing',
        type: 'toggle',
        value: true,
        defaultValue: true,
        show: true,
        required: false,
        helptext: 'If you don\'t select hourly billing, monthly billing will be applied',

    }, {
        name: 'bare_metal',
        label: 'Bare Metal',
        type: 'toggle',
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Whether the new server will be Cloud server, or Bare Metal',

    }, {
        name: 'machine_password',
        label: 'Machine Password *',
        type: 'password',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
        helptext: 'Windows machine password is required.',
    }],
});

// VCLOUD
MACHINE_CREATE_FIELDS.push({
    provider: 'vcloud',
    fields: [{
        name: 'networks',
        label: 'Networks *',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
    }],
});

// VSPHERE
MACHINE_CREATE_FIELDS.push({
    provider: 'vsphere',
    fields: [{
        name: 'folders',
        label: 'VM Folder',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false, 
        helptext: 'VSphere 6.7 required, choose the folder to place the new VM in.',
        options:[],
    },{
        name: 'networks',
        label: 'Networks *',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
    },{
        name: 'datastore',
        label: 'Datastore',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false, 
        helptext: 'Optional. Datastore for the VM disk.',
        options:[],
    },{
        name: 'image_extra',
        label: 'Image extra',
        type: 'text',
        value: '',
        defaultValue: '',
        show: false,
        required: false,
    },],
});

// VULTR
MACHINE_CREATE_FIELDS.push({
    provider: 'vultr',
    fields: [],
});

// ONAPP
MACHINE_CREATE_FIELDS.push({
    provider: 'onapp',
    fields: [{
        name: 'networks',
        label: 'Network',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
    }],
});

// KUBEVIRT
MACHINE_CREATE_FIELDS.push({
    provider: 'kubevirt',
    fields: [],
});
// LXD
MACHINE_CREATE_FIELDS.push({
    provider: 'lxd',
    fields: [{
        name: 'ephemeral',
        label: 'Ephemeral *',
        type: 'toggle',
        value: '',
        defaultValue: false,
        show: true,
        required: true,
        helptext: 'An ephemeral container will be deleted when is stopped.'
    }, {
        name: 'networks',
        label: 'Network',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        options: [],
    }],
});

// add common fields
MACHINE_CREATE_FIELDS.forEach(function(p) {
    var addImage = ['libvirt', 'kubevirt'].indexOf(p.provider) != -1;
    var showLocation = ['lxd', 'gig_g8'].indexOf(p.provider) == -1;

    // add common machine properties fields
    p.fields.splice(0, 0, {
        name: 'name',
        label: 'Machine Name *',
        type: 'text',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        helptext: 'Fill in the machine\'s name',
    }, {
        name: 'location',
        label: 'Location *',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: showLocation,
        required: showLocation,
        options: []
    }, {
        name: 'image',
        label: 'Image *',
        type: 'mist_dropdown_searchable',
        value: '',
        defaultValue: '',
        show: true,
        add: addImage,
        required: true,
        options: [],
        search: '',
    });

    // mist_size for kvm libvirt
    if (['libvirt'].indexOf(p.provider) != -1) {
        p.fields.splice(3, 0, {
            name: 'size',
            label: 'Size *',
            type: 'mist_size',
            value: 'custom',
            defaultValue: 'custom',
            custom: true,
            customValue: null,
            show: true,
            required: true,
            customSizeFields: [{
                name: 'ram',
                label: 'RAM MB',
                type: 'slider',
                value: 256,
                defaultValue: 256,
                min: 256,
                max: 131072,
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
            }],
        });
    } else if (['gig_g8'].indexOf(p.provider) != -1) {
        p.fields.splice(3, 0, {
            name: 'size',
            label: 'Size *',
            type: 'mist_size',
            value: 'custom',
            defaultValue: 'custom',
            custom: true,
            customValue: null,
            show: true,
            required: true,
            customSizeFields: [{
                name: 'ram',
                label: 'RAM MB',
                type: 'slider',
                value: 256,
                defaultValue: 256,
                min: 512,
                max: 15872,
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
            }, {
                name: 'disk_primary',
                label: 'Primary Disk',
                type: 'slider',
                value: 5,
                defaultValue: 5,
                min: 1,
                max: 1024,
                step: 1,
                show: true,
                required: true,
                unit: 'GB',
                helptext: 'Custom disk size in GB.'
            }],
        });
    } else if (['onapp'].indexOf(p.provider) != -1) {
        p.fields.splice(3, 0, {
            name: 'size',
            label: 'Size *',
            type: 'mist_size',
            value: 'custom',
            defaultValue: 'custom',
            custom: true,
            customValue: null,
            show: true,
            required: true,
            customSizeFields: [{
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
            }],
        });
    } else if (['vsphere', 'lxd', 'kubevirt'].indexOf(p.provider) != -1) {
        p.fields.splice(3, 0, {
            name: 'size',
            label: 'Size *',
            type: 'mist_size',
            value: 'custom',
            defaultValue: 'custom',
            custom: true,
            customValue: null,
            show: true,
            required: true,
            customSizeFields: [{
                name: 'ram',
                label: 'RAM MB',
                type: 'slider',
                value: 256,
                defaultValue: '',
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
                defaultValue: '',
                min: 1,
                max: 8,
                step: 1,
                show: true,
                required: false,
                unit: 'cores',
            }, {
                name: 'disk_primary',
                label: 'Disk',
                type: 'slider',
                value: 5,
                defaultValue: 5,
                min: 5,
                max: 512,
                step: 1,
                show: false,
                required: false,
                unit: 'GB',
                helptext: 'Custom disk size in GB.'
            }],
        });
    } else if (['maxihost'].indexOf(p.provider) != -1){ // size dependent on location for maxihost
        p.fields.splice(3, 0, {
            name: 'size',
            label: 'Size *',
            type: 'mist_size',
            value: '',
            defaultValue: '',
            show: true,
            required: true,
            options: [],
            custom: false,
            showIf: {
                fieldName: 'location',
                fieldExists: true
            }
        });
    } else { // mist_dropdown for all others
        p.fields.splice(3, 0, {
            name: 'size',
            label: 'Size *',
            type: 'mist_size',
            value: '',
            defaultValue: '',
            show: true,
            required: true,
            options: [],
            custom: false,
        });
    }

    if (['onapp'].indexOf(p.provider) != -1) {
        p.fields.push({
            name: 'hypervisor_group_id',
            label: 'hypervisor_group_id',
            type: 'text',
            value: '',
            defaultValue: '',
            show: false,
            required: false,
        }, {
            name: 'onapp_advanced_options',
            label: 'Advanced Options',
            type: 'toggle',
            value: false,
            defaultValue: false,
            excludeFromPayload: true,
            helptext: '',
            show: true,
            required: false,
        }, {
            name: 'port_speed',
            label: 'Port Speed',
            type: 'slider',
            value: '',
            defaultValue: 0,
            min: 0,
            max: 1000,
            step: 1,
            show: true,
            required: false,
            unit: 'Mbps',
            helptext: 'Port speed in Mbps. Value 0 will enable unlimited speed.',
            showIf: {
                fieldName: 'onapp_advanced_options',
                fieldValues: [true],
            },
        }, {
            name: 'cpu_priority',
            label: 'CPU Priority',
            type: 'slider',
            value: 1,
            defaultValue: 1,
            min: 1,
            max: 100,
            step: 1,
            show: true,
            required: false,
            unit: '%',
            helptext: 'CPU priority percentage.',
            showIf: {
                fieldName: 'onapp_advanced_options',
                fieldValues: [true],
            },
        }, {
            name: 'cpu_threads',
            label: 'CPU Threads',
            type: 'slider',
            value: 1,
            defaultValue: 1,
            min: 1,
            max: 16,
            step: 1,
            show: true,
            required: false,
            unit: '',
            helptext: 'Custom CPU Threads',
            showIf: {
                fieldName: 'onapp_advanced_options',
                fieldValues: [true],
            },
        }, {
            name: 'cpu_sockets',
            label: 'CPU Sockets',
            type: 'slider',
            value: 1,
            defaultValue: 1,
            min: 1,
            max: 16,
            step: 1,
            show: true,
            required: false,
            unit: '',
            helptext: 'Custom CPU Sockets',
            showIf: {
                fieldName: 'onapp_advanced_options',
                fieldValues: [true],
            },
        });
    }
    var requiredKey = ['gig_g8', 'lxd', 'docker', 'onapp', 'libvirt', 'vsphere', 'kubevirt'].indexOf(p.provider) == -1;
    p.fields.push({
        name: 'key',
        label: 'Key ' + (requiredKey ? '*' : ''),
        type: 'ssh_key',
        value: '',
        defaultValue: '',
        add: true,
        show: true,
        required: requiredKey,
        options: [],
        search: '',
    });

    // add cloud init field only to providers that accept and we support
    if (['azure', 'azure_arm', 'digitalocean', 'ec2', 'gce', 'packet', 'rackspace', 'libvirt', 'openstack', 'aliyun_ecs', 'vultr', 'softlayer', 'gig_g8'].indexOf(p.provider) != -1) {
        p.fields.push({
            name: 'cloud_init',
            label: 'Cloud Init',
            type: 'textarea',
            value: '',
            defaultValue: '',
            show: true,
            required: false,
            helptext: 'Start your Cloud Init script with #!/bin/bash or use a valid yaml configuration file starting with #cloud-config',
        });
    }

    // add onapp specific fields
    if (['onapp'].indexOf(p.provider) != -1) {
        p.fields.push({
            name: 'build',
            label: 'Build',
            type: 'toggle',
            value: true,
            defaultValue: true,
            show: true,
            required: false,
        }, {
            name: 'boot',
            label: 'Boot',
            type: 'toggle',
            value: true,
            defaultValue: true,
            show: true,
            required: false,
        });
    }

    // add create volume fields for 'openstack'
    // coming soon for 'gce', 'digitalocean', 'aws' & 'packet'

    if (['openstack', 'packet', 'azure_arm','gce', 'digitalocean', 'ec2', 'aliyun_ecs', 'lxd', 'kubevirt', 'gig_g8'].indexOf(p.provider) > -1) {
        var allowedVolumes = ['gce','azure_arm','gig_g8'].indexOf(p.provider) > -1 ? 3 : 1;
        var allowExistingVolumes = ['gig_g8'].indexOf(p.provider) == -1;
        p.fields.push({
            name: 'addvolume',
            excludeFromPayload: true,
            label: 'Attach volume',
            type: 'toggle',
            value: false,
            defaultValue: false,
            helptext: 'Attach a volume to the machine.',
            show: true,
            required: false
        }, {
            name: 'volumes',
            itemName: 'volume',
            type: 'list',
            items: [],
            show: false,
            required: false,
            horizontal: false,
            moderateTop: true,
            min: '1',
            max: allowedVolumes,
            showIf: {
                fieldName: 'addvolume',
                fieldValues: ['true', true],
            },
            options: [{
                name: 'new-or-existing-volume',
                type: 'radio',
                class: 'x12 s12 m12',
                value: 'new',
                defaultValue: 'new',
                show: true,
                required: false,
                excludeFromPayload: true,
                options: [{
                    title: 'Create new Volume',
                    val: 'new',
                }, {
                    title: 'Attach Existing',
                    val: 'existing',
                    disabled: !allowExistingVolumes
                }]
            }, {
                name: 'volume_id',
                label: 'Existing Volume',
                type: 'mist_dropdown',
                helptext: "The machine's location must first be selected, to add existing volumes. Only volumes of the same location can be attached to a machine.",
                value: '',
                defaultValue: '',
                show: true,
                required: false,
                options: [],
                noOptionsMessage: 'You must first select a location for your machine.',
                showIf: {
                    fieldName: 'new-or-existing-volume',
                    fieldValues: ['existing'],
                }
            }]
        })

        if(['lxd'].indexOf(p.provider) > -1){
           p.fields[p.fields.length-1].options.push({
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
           })
        }

        if (['ec2'].indexOf(p.provider) > -1) {
            p.fields[p.fields.length-1].options.push({
                name: 'device',
                label: 'Device name',
                type: 'text',
                helptext: 'Choose a device name. Recommended names /dev/sd[f-p] and /dev/sd[f-p][1-6]',
                pattern: '/dev/sd[f-p][1-6]?',
                value: '/dev/sdf',
                defaultValue: '/dev/sdf',
                show: true,
                required: true,
                showIf: {
                    fieldName: 'new-or-existing-volume',
                    fieldValues: ['existing'],
                }
            })
        }
        if (['openstack','ec2','aliyun_ecs'].indexOf(p.provider) > -1) {
            p.fields[p.fields.length-1].options.push({
                name: 'delete_on_termination',
                label: 'Delete volume when machine is deleted',
                type: 'checkbox',
                value: '',
                defaultValue: '',
                show: true,
                required: false
            })
        }
        if (['kubevirt','gig_g8'].indexOf(p.provider) > -1) {
            p.fields.push({
                name: 'port_forwards',
                label: 'Expose ports',
                type: 'fieldgroup',
                value: {},
                defaultValue: {},
                defaultToggleValue: false,
                helptext: '',
                show: true,
                required: false,
                optional: true,
                inline: true,
                flatten: false,
                enabled:false,
                loader: false,
                subfields: [{
                    name: 'ports',
                    itemName: 'ports',
                    items: [],
                    label: '',
                    show: true,
                    required: false,
                    horizontal: true,
                    type: 'list',
                    min: '0',
                    options: [{
                        name: 'port',
                        label: 'Port *',
                        type: 'text',
                        value: '',
                        defaultValue: "80",
                        show: true,
                        required: true,
                        helptext: 'The public port, fill in either a port or host:port,\n eg: 80 or 172.11.234.13:80',
                    }, {
                        name: 'target_port',
                        label: 'Target Port',
                        type: 'text',
                        value: '',
                        defaultValue: '',
                        show: true,
                        required: false,

                        helptext: 'Optional, fill in only if the local port is different from the public one.',
                    },{
                        name: 'protocol',
                        label: 'Protocol',
                        type: 'dropdown',
                        value: 'TCP',
                        defaultValue: 'TCP',
                        helptext: '',
                        show: true,
                        required: true,
                        class: 'width-150 inline-block',
                        options: [
                            {val: 'TCP', title: 'TCP'},
                            {val: 'UDP', title: 'UDP'}
                        ]
                    }]
                }],
            })
            if (['kubevirt'].indexOf(p.provider) > -1) {
                p.fields[p.fields.length-1].subfields.unshift(
                    {
                        name: 'service_type',
                        label: 'Service Type',
                        type: 'dropdown',
                        value: 'NodePort',
                        defaultValue: 'NodePort',
                        previousValue: 'NodePort',
                        helptext: 'The type of the service to be created',
                        eventOnChange: "service-type-updated",
                        show: true,
                        required: true,
                        class: 'width-155 inline-block',
                        options: [
                            {val: 'ClusterIP', title: 'ClusterIP'},
                            {val: 'NodePort', title: 'NodePort'},
                            {val: 'LoadBalancer', title: 'LoadBalancer'}
                        ]
                    }
                )
            }
        }

    }

    // add common post provision fields
    p.fields.push(
    {
        name: 'expiration',
        label: 'Set expiration',
        type: 'fieldgroup',
        value: {},
        defaultValue: {},
        defaultToggleValue: false,
        helptext: 'Set an expiration date when the machine will stop or be destroyed',
        show: true,
        required: false,
        optional: true,
        singleColumnForm: true,
        inline: true,
        subfields: [{
                name: 'action',
                type: 'dropdown',
                class: 'bind-both',
                value: 'stop',
                defaultValue: 'stop',
                helptext: '',
                show: true,
                parentfield: 'expiration',
                required: false,
                class: 'width-150 inline-block',
                options: [
                    {val: 'stop', title: 'STOP'},
                    {val: 'destroy', title: 'DESTROY'}
                ]
            }, {
                name: 'date',
                type: 'duration_field',
                class: 'bind-both',
                value: '',
                defaultValue: '1d',
                valueType: 'date',
                parentfield: 'expiration',
                helptext: '',
                show: true,
                required: false,
                prefixText: 'in ',
                options: [
                    {val: 'months', title: 'months'},
                    {val: 'weeks', title: 'weeks'},
                    {val: 'days', title: 'days'},
                    {val: 'hours', title: 'hours'},
                    {val: 'minutes', title: 'minutes'}
                ]
            }, {
                name: 'notify',
                type: 'duration_field',
                valueType: 'secs',
                value: 3600,
                defaultValue: 3600,
                helptext: '',
                parentfield: 'expiration',
                show: true,
                required: false,
                prefixText: 'Notify me ',
                suffixText: 'before',
                optional: true,
                defaultCheck: true,
                disabled: false,
                options: [
                    {val: 'months', title: 'months'},
                    {val: 'weeks', title: 'weeks'},
                    {val: 'days', title: 'days'},
                    {val: 'hours', title: 'hours'},
                    {val: 'minutes', title: 'minutes'}
                ]
            }
        ]
    }, {
        name: 'post_provision_script',
        label: 'Run post-deploy script',
        type: 'toggle',
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        helptext: 'Open options to run a script immediately after provisioning',
        show: true,
        required: false,
    }, {
        name: 'run_script',
        label: 'Script Inline or Select',
        type: 'radio',
        value: 'inline',
        defaultValue: 'inline',
        helptext: 'Edit a script to run or choose one from your existing ones.',
        show: true,
        required: false,
        class: 'bind-bottom radio-highight',
        options: [{
            title: 'Inline Script',
            val: 'inline',
        }, {
            title: 'Select Existing',
            val: 'select',
        }],
        showIf: {
            fieldName: 'post_provision_script',
            fieldValues: ['true', true],
        },
    }, {
        name: 'script',
        label: 'Inline Script',
        type: 'textarea',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        class: 'bind-top background',
        helptext: 'The inline script will run after provisioning',
        showIf: {
            fieldName: 'run_script',
            fieldValues: ['inline'],
        },
    }, {
        name: 'script_id',
        label: 'Script',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        class: 'bind-both background',
        show: true,
        required: false,
        helptext: 'The selected script will run after provisioning',
        showIf: {
            fieldName: 'run_script',
            fieldValues: ['select'],
        },
    }, {
        name: 'script_params',
        label: 'Optional Script Params',
        type: 'textarea',
        value: '',
        defaultValue: '',
        show: true,
        required: false,
        class: 'bind-top background',
        helptext: '',
        showIf: {
            fieldName: 'run_script',
            fieldValues: ['select'],
        },
    }, {
        name: 'post_provision_scheduler',
        label: 'Schedule a task',
        type: 'toggle',
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        helptext: 'Enable a scheduled action on this machine',
        show: true,
        required: false,
    }, {
        name: 'action',
        label: 'Schedule Task',
        type: 'dropdown',
        value: '',
        defaultValue: '',
        excludeFromPayload: true,
        show: true,
        required: false,
        helptext: 'Choose one from the available tasks to schedule.',
        options: [],
        showIf: {
            fieldName: 'post_provision_scheduler',
            fieldValues: ['true', true],
        },
    }, {
        name: 'schedule_script_id',
        label: 'Script',
        type: 'mist_dropdown_searchable',
        value: '',
        search: '',
        defaultValue: '',
        show: false,
        required: false,
        excludeFromPayload: true,
        add: true,
        helptext: 'Schedule an existing script to run.',
        options: [],
        showIf: {
            fieldName: 'action',
            fieldValues: ['run script'],
        },
    }, {
        name: 'params',
        label: 'Parameters',
        type: 'textarea',
        value: '',
        defaultValue: '',
        helptext: '',
        show: false,
        required: false,
        showIf: {
            fieldName: 'action',
            fieldValues: ['run script'],
        },
    }, {
        name: 'schedule_type',
        label: 'Schedule Type',
        type: 'radio',
        value: 'one_off',
        defaultValue: 'one_off',
        helptext: 'The scheduler type. Visit the docs',
        helpHref: 'http://docs.mist.io/article/151-scheduler',
        show: false,
        required: true,
        excludeFromPayload: true,
        class: 'bind-bottom radio-highight',
        options: [{
            title: 'Once',
            val: 'one_off',
        }, {
            title: 'Repeat',
            val: 'interval',
        }, {
            title: 'Crontab',
            val: 'crontab',
        }],
        showIf: {
            fieldName: 'post_provision_scheduler',
            fieldValues: ['true', true],
        },
    }, {
        name: 'schedule_entry',
        label: 'Schedule time',
        type: 'textarea',
        value: '',
        defaultValue: '',
        helptext: '',
        show: false,
        excludeFromPayload: true,
        required: false,
    }, {
        name: 'schedule_entry_interval',
        type: 'duration_field',
        excludeFromPayload: true,
        value: {every: 1, period: 'minutes'},
        defaultValue: {every: 1, period: 'minutes'},
        valueType: 'period',
        prefixText: 'every ',
        class: 'bind-top background',
        show: false,
        required: true,
        helptext: 'Example, every 10 minutes',
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval'],
        },
        options: [
            {val: 'days', title: 'days'},
            {val: 'hours', title: 'hours'},
            {val: 'minutes', title: 'minutes'}
        ],
    }, {
        name: 'schedule_entry_crontab',
        label: 'Crontab',
        type: 'text',
        value: '*/10 * * * *',
        defaultValue: '*/10 * * * *',
        excludeFromPayload: true,
        class: 'bind-top background',
        show: false,
        required: false,
        helptext: 'Example: */10 * * 1 *, is every 10 minutes on the 1st of each month. Relative periods: Minute, Hour, Day of the Month, Month of the Year, Day of the Week.',
        helpHref: 'http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html#crontab-schedules',
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['crontab'],
        },
    }, {
        name: 'schedule_entry_one_off',
        label: '',
        type: 'date',
        value: '',
        defaultValue: '',
        class: 'bind-top background',
        icon: 'schedule',
        validate: 'inFuture',
        errorMessage: 'Date must be a future date',
        excludeFromPayload: true,
        show: false,
        required: false,
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['one_off'],
        },
    }, {
        name: 'start_after',
        label: 'Starts',
        type: 'date',
        value: '',
        placeholder: 'now',
        defaultValue: '',
        helptext: '',
        icon: 'schedule',
        validate: 'inFuture',
        errorMessage: 'Date must be a future date',
        show: false,
        required: false,
        disabled: false,
        excludeFromPayload: true,
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
        },
    }, {
        name: 'expires',
        label: 'Expires',
        type: 'date',
        value: '',
        placeholder: 'never',
        excludeFromPayload: true,
        defaultValue: '',
        helptext: '',
        icon: 'schedule',
        validate: 'inFuture',
        errorMessage: 'Date must be a future date',
        show: false,
        required: false,
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
        },
    }, {
        name: 'max_run_count',
        label: 'Maximum Run Count',
        type: 'text',
        value: '',
        defaultValue: '',
        excludeFromPayload: true,
        show: false,
        required: false,
        helptext: 'Optional. Integers only. Define a maximum run count.',
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
        },
    }, {
        name: 'hostname',
        label: 'Create DNS record',
        type: 'fieldgroup',
        value: {},
        defaultValue: {},
        defaultToggleValue: false,
        helptext: 'Create an A record on an existing DNS zone that will point to the public ip address of the machine.',
        show: true,
        required: false,
        optional: true,
        singleColumnForm: true,
        inline: true,
        subfields: [
            {
                name: 'record_name',
                type: 'text',
                value: '',
                label: 'Record name',
                defaultValue: '',
                helptext: '',
                show: true,
                class: 'width-150 inline-block pad-r-0 pad-t',
                required: true,
                suffix: '.',
            }, {
                name: 'dns_zone',
                type: 'mist_dropdown',
                label: 'DNS zone',
                value: '',
                defaultValue: '',
                helptext: '',
                display: 'domain',
                show: true,
                class: 'inline-block pad-l-0 pad-t',
                required: true,
                options: []
           }
        ]
    }, {
        name: 'monitoring',
        label: 'Enable monitoring',
        type: 'toggle',
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: '',
    }, {
        name: 'async',
        label: 'Async request',
        type: 'toggle',
        value: true,
        defaultValue: true,
        show: false,
        required: false,
        helptext: '',
    });
});var VOLUME_CREATE_FIELDS = []

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

SCHEDULEACTIONS = {
    'reboot': {
        'name': 'reboot',
        'icon': 'av:replay',
        'confirm': true,
        'multi': true
    },
    'start': {
        'name': 'start',
        'icon': 'av:replay',
        'confirm': true,
        'multi': true
    },
    'stop': {
        'name': 'stop',
        'icon': 'av:stop',
        'confirm': true,
        'multi': true
    },
    'suspend': {
        'name': 'suspend',
        'icon': 'av:stop',
        'confirm': true,
        'multi': true
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
    'destroy': {
        'name': 'destroy',
        'icon': 'delete',
        'confirm': true,
        'multi': true
    },
    'run-script': {
        'name': 'run script',
        'icon': 'image:movie-creation',
        'confirm': true,
        'multi': false
    }
};

Polymer({
  _template: html`
        <style include="shared-styles forms single-page">
        :host {
            min-height: 1200px;
        }

        paper-material {
            display: block;
            padding: 24px;
            transition: all 0.2 ease-in;
        }

        #content {
            max-width: 900px;
        }

        paper-card,
        paper-checkbox {
            display: block;
        }

        paper-card {
            margin-bottom: 40px;
        }

        paper-toggle-button,
        paper-checkbox {
            margin-top: 20px;
        }

        .dropdown-with-logos paper-item img {
            margin-right: 16px;
        }

        .dropdown-with-logos paper-item {
            text-transform: capitalize;
            opacity: 0.87;
        }

        paper-dropdown-menu ::slotted(.dropdown-content) {
            max-height: 400px !important;
        }

        :host app-form::slotted(paper-radio-group) {
            margin-top: 24px;
        }

        app-form::slotted(paper-radio-group) {
            margin-top: 36px !important;
            margin-bottom: 0;
        }

        app-form::slotted(.helptext-radio) {
            margin-top: 36px !important;
            margin-bottom: 0;
        }

        paper-dialog#addKvmImage {
            width: 260px;
        }

        paper-dialog#addKvmImage>paper-input {
            margin-top: 0;
            margin-bottom: 20px;
        }

        paper-dialog#addKvmImage .btn-group {
            display: flex;
            justify-content: flex-end;
        }

        .machine-page-head {
            @apply --machine-page-head-mixin
        }
        </style>
        <app-location route="{{route}}"></app-location>
        <div id="content">
            <paper-material class="single-head layout horizontal machine-page-head">
                <span class="icon">
                    <iron-icon icon="hardware:computer"></iron-icon>
                </span>
                <div class="title flex">
                    <h2>
                        Create machine
                    </h2>
                    <div class="subtitle">
                        Provision compute resources across clouds
                    </div>
                </div>
            </paper-material>
            <paper-material hidden\$="[[_hasProviders(providers)]]">
                <p>You don't have any clouds that support machine provisioning.
                    <a href="/clouds/+add" class="blue-link regular">Add a cloud</a> to get started creating machines.</p>
            </paper-material>
            <paper-material hidden\$="[[!_hasProviders(providers)]]">
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
            <paper-material class\$="selected-[[!selectedCloud]]" hidden\$="[[!_hasProviders(providers)]]">
                <h3 class="smallcaps">Machine Setup</h3>
                <div hidden\$="[[selectedCloud]]">
                    <p>Depending on the cloud, different machine parameters may be required. Choose a provider for the corresponding
                        fields to appear.</p>
                </div>
                <div hidden\$="[[!selectedCloud]]">
                    <app-form id="createForm" format-payload="" fields="{{machineFields}}" method="POST" url="/api/v1/clouds/[[selectedCloud]]/machines" on-response="_machineCreateResponse" on-error="_machineCreateError" btncontent="Launch"></app-form>
                </div>
            </paper-material>
        </div>
        <paper-dialog id="addKvmImage" with-backdrop="">
            <h2>[[_computeAddImageTitle(selectedCloud)]]</h2>
            <paper-input id="kvmImageInput" label="[[_computeAddImageLabel(selectedCloud)]]" value="{{newImage}}" autofocus=""></paper-input>
            <div class="btn-group">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button class="blue" on-tap="saveNewImage">Save</paper-button>
            </div>
        </paper-dialog>
        <iron-ajax id="getSecurityGroups" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetSecurityGroupsRequest" on-response="_handleGetSecurityGroupsResponse" on-error="_handleGetSecurityGroupsError"></iron-ajax>
        <iron-ajax id="getResourceGroups" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetResourceGroupsRequest" on-response="_handleGetResourceGroupsResponse" on-error="_handleGetResourceGroupsError"></iron-ajax>
        <iron-ajax id="getStorageAccounts" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetStorageAccountsRequest" on-response="_handleGetStorageAccountsResponse" on-error="_handleGetResourceGroupsError"></iron-ajax>
        <iron-ajax id="getStorageClasses" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetStorageClassesRequest" on-response="_handleGetStorageClassesResponse" on-error="_handleGetStorageClassesError"></iron-ajax>
        <iron-ajax id="getFolders" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetFoldersRequest" on-response="_handleGetFoldersResponse" on-error="_handleGetResourceGroupsError"></iron-ajax>
        <iron-ajax id="getDatastores" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetDatastoresRequest" on-response="_handleGetDatastoresResponse" on-error="_handleGetResourceGroupsError"></iron-ajax>
        <iron-ajax id="getLXDStoragePools" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetLXDStoragePoolsRequest" on-response="_handleGetLXDStoragePoolsResponse" on-error="_handleGetLXDStoragePoolsError"></iron-ajax>
        <iron-ajax id="getVirtualNetworkFunctions" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetVirtualNetworkFunctionsRequest" on-response="_handleGetVirtualNetworkFunctionsResponse" on-error="_handleGetVirtualNetworkFunctionsError"></iron-ajax>
`,

  is: 'machine-create',
  behaviors: [rbacBehavior],

  properties: {
      model: {
          type: Object
      },
      cloud: {
          type: Object
      },
      selectedCloud: {
          type: String,
          value: false
      },
      machineFields: {
          type: Array,
          value: function() {
              return []
          }
      },
      machinesFields: {
          type: Array,
          value: function() {
              return MACHINE_CREATE_FIELDS;
          }
      },
      volumeFields: {
          type: Array,
          value: function(){
              return VOLUME_CREATE_FIELDS;
          }
      },
      providers: {
          type: Array,
          value: function() {
              return []
          },
          computed: "_computeProviders(model, model.clouds, model.teams.*)"
      },
      newImage: {
          type: String
      },
      scheduleActions: {
          type: Array,
          computed: '_computeActions(model.machines)'
      },
      monitoring: {
          type: Boolean
      },
      docs: {
          type: String,
          value: ''
      },
      storageAccountsFieldIndex: {
          type: Number
      },
      resourceGroupsFieldIndex: {
          type: Number
      },
      storageClassesField: {
          type: Object
      },
      foldersField: {
          type: Object
      },
      lxdStoragePoolsField: {
          type: Object
      },
      securityGroupsFieldIndex: {
          type: Number
      },
      virtualNetworkFunctionFieldIndex: {
          type: Number
      },
      constraints: {
          type: Object
      }
  },

  observers: [
      '_applyConstraints(machinesFields, constraints)',
      '_teamsChanged(model.teams.*)',
      '_cloudChanged(selectedCloud)',
      '_updateCloudOptions(cloud.*)',
      '_machineFieldsChanged(machineFields.*)',
      '_prefillOptions(route.*)',
      '_locationChanged(machineFields.1.value)'
  ],

  listeners: {
      'keyup': 'hotkeys',
      'add-input': 'addInput',
      'format-payload': 'formatPayload',
      'fields-changed': 'fieldsChanged',
      'subfield-enabled': '_subfieldEnabled'
  },

  _teamsChanged: function() {
      console.log('_teamsChanged CALL checkPermissions');
      this.checkPermissions();
  },

  checkPermissions: function() {
      var perm = this.check_perm('create','machine');
      if (perm == true) {
          return;
      } else if (perm == false) {
          return;
      } else if (typeof perm == 'object') {
          this.set('constraints', perm);
      }
      // console.log('checkPermissions', perm);
  },

  _applyConstraints: function(machinesFields, constraints) {
      if (!this.constraints || !this.machinesFields) {
          return;
      }
      if (this.constraints.expiration) {
          this._applyExpirationConstraints();
      }
      if (this.constraints.field) {
          this._applyFieldConstraints();
      }
      if (this.constraints.size) {
          this._applySizeConstraints();
      }
  },

  _applySizeConstraints: function() {
      var constraint = this.constraints.size;
      for (var i=0; i < this.machinesFields.length; i++) {
          var sizeIndex = this._fieldIndexByName('size', this.machinesFields[i].fields);
          var path = 'machinesFields.' + i + '.fields.' + sizeIndex;
          if (constraint.disk && constraint.disk.min) {
              this.set(path + '.customSizeFields.2.min', constraint.disk.min);
              this.set(path + '.customSizeFields.2.value', constraint.disk.min);
          }
          if (constraint.disk && constraint.disk.show != undefined) {
              this.set(path + '.customSizeFields.2.hidden', !constraint.disk.show);
              this.set(path + '.customSizeFields.2.value', undefined);
          }
      }
  },

  _applyFieldConstraints: function() {
      let constraints = [];
      if (this.constraints.field.length) {
          constraints = this.constraints.field;
      } else {
          constraints = [this.constraints.field];
      }

      // Iterate available clouds
      for (var i=0; i < this.machinesFields.length; i++) {
          // Iterate field constraints
          for(var c=0; c < constraints.length; c++) {
              // Apply constraint to cloud fields if applicable
              var fieldIndex = this._fieldIndexByName(constraints[c].name, this.machinesFields[i].fields);
              if (fieldIndex == -1) {
                  continue;
              }
              var path = 'machinesFields.' + i + '.fields.' + fieldIndex;
              if (constraints[c].show != undefined) {
                  this.set(path + '.show', constraints[c].show);
              }
          }
      }
  },

  _applyExpirationConstraints: function() {
      for (var i=0; i < this.machinesFields.length; i++) {
          var ind = this._fieldIndexByName('expiration', this.machinesFields[i].fields),
              path = 'machinesFields.'+ i +'.fields.'+ ind +'.subfields';

          if (ind > -1) {
              if (this.constraints.expiration.max) {
                  this.set(path + '.1.max', this.constraints.expiration.max);

                  // force expiration and disallow to close option
                  this.set('machinesFields.'+ i +'.fields.'+ ind + '.defaultToggleValue', true);
                  this.set('machinesFields.'+ i +'.fields.'+ ind + '.toggleDisabled', true);
              }
              if (this.constraints.expiration.default) {
                  this.set(path + '.1.defaultValue', this.constraints.expiration.default);
              }
              if (this.constraints.expiration.notify) {
                  if (this.constraints.expiration.notify.default) {
                      // notify default
                      this.set(path + '.2.defaultValue', this.constraints.expiration.notify.default);
                      // notify require
                      this.set(path + '.2.defaultCheck', this.constraints.expiration.notify.require);
                      if (this.constraints.expiration.notify.require)
                          this.set(path + '.2.disabledCheck', this.constraints.expiration.notify.require);
                      // notify max
                      if (this.constraints.expiration.default) {
                          this.set(path + '.2.max', this.constraints.expiration.default);
                      }
                  }
                  if (this.constraints.expiration.notify.require != null
                      && this.constraints.expiration.notify.require != undefined) {
                      // notify require (checkbox value)
                      this.set(path + '.2.disabled', !this.constraints.expiration.notify.require);
                  }
              }
              if (this.constraints.expiration.actions) {
                  if (this.constraints.expiration.actions.available) {
                      // available actions
                      var actions = this.constraints.expiration.actions.available.map(function(x){
                          return {'val':x,'title':x.toUpperCase()};
                      })
                      this.set(path + '.0.options', actions);
                  }
                  if (this.constraints.expiration.actions.default) {
                      // default action
                      this.set(path + '.0.value', this.constraints.expiration.actions.default);
                      this.set(path + '.0.defaultValue', this.constraints.expiration.actions.default);
                  }
              }
          }
      }
      // update selected cloud's provider-fields after constraints applied
      if (this.selectedCloud) {
          this._cloudChanged(this.selectedCloud);
      }
  },

  _updateCloudOptions: function(cloud) {
      // console.log('_updateCloudOptions === ', cloud);
      this._updateFields(this.selectedCloud);
  },

  _prefillOptions: function(location) {
      if (this.shadowRoot.querySelector('app-location') && this.shadowRoot.querySelector('app-location').queryParams)
          var image = this.shadowRoot.querySelector('app-location').queryParams.image,
              cloud = this.shadowRoot.querySelector('app-location').queryParams.cloud;
      if (image && cloud)
          this._setOptions({
              cloud: cloud,
              image: image
          });
  },

  _computeActions: function(machines) {
      var ret = ['start', 'stop', 'reboot', 'destroy', 'run-script']; //'suspend', 'resume',

      var actions = [];
      for (var i = 0; i < ret.length; i++) {
          var act = SCHEDULEACTIONS[ret[i]];
          var transformRet = {
              title: act.name.toUpperCase(),
              val: act.name,
              icon: act.icon
          };
          actions.push(transformRet);
      }
      return actions;
  },

  _computeProviderLogo: function(className) {
      var identifier = className.replace('_', '');
      return 'assets/providers/provider-' + identifier + '.png';
  },

  _isOnline: function(cloud, state, clouds) {
      return this.model.clouds[cloud] && this.model.clouds[cloud].state == 'online';
  },

  _setOptions: function(params) {
      if (params) {
          for (var p in params) {
              if (p == 'cloud')
                  this.set('selectedCloud', params[p])
              else {
                  var ind = this._fieldIndexByName(p)
                  if (ind)
                      this.set('machineFields.' + ind + '.value', params[p]);
              }
          }
      }
  },

  _computeFieldType: function(field, value, show) {
      if (!(field.showIf && !field.show)) {
          return field.type == value;
      }
  },

  _cloudChanged: function(selectedCloud) {
      //clear saved new image of lxd or kvm
      this.set("newImage", "");
      if (selectedCloud && this.model) {
          this.set('cloud', this.model.clouds[selectedCloud]);
      }
      if (!this.docs && this.machinesFields) {
          for (var i = 0; i < this.machinesFields.length; i++) {
              if (this.machinesFields[i].fields) {
                  for (var j = 0; j < this.machinesFields[i].fields.length; j++) {
                      this.machinesFields[i].fields[j].helpHref = '';
                  }
              }
          }
      }
      var allMachinesFields;
      if (this.selectedCloud) {
          var provider = this.model.clouds[selectedCloud] && this.model.clouds[selectedCloud].provider;
          allMachinesFields = this.machinesFields.find(function(c) {
              return c.provider == provider;
          });
      }

      // add cloud fields
      if (allMachinesFields && allMachinesFields.fields) {
          // allow hostname iff at least a cloud has dns access enabled
          var fields = JSON.parse(JSON.stringify(allMachinesFields.fields));
          if (this.model.clouds) {
              var dns = this._enableHostname(this.model.clouds);
              if (!dns) {
                  var ind = this._fieldIndexByName('hostname', fields);
                  if (ind > -1) {
                      fields.splice(ind,1);
                  }
              }
          }
          // clear to reset
          this.set('machineFields', []);
          this.set('machineFields', fields);
      }
      
      // set values by provider
      this._updateFields(selectedCloud);
  },

  _enableHostname: function(clouds) {
      return Object.values(clouds).reduce(function(a,b){
                  return a || b.dns_enabled;
              },false);
  },

  _locationChanged: function (locationId) {
      if (!locationId) return;
      var provider = this.model.clouds[this.selectedCloud].provider,
          location = this.model.clouds[this.selectedCloud].locations[locationId],
          sizeIndex = this._fieldIndexByName('size'),
          selectedSize = this.machineFields[sizeIndex].value,
          allSizes = this._toArray(this.model.clouds[this.selectedCloud].sizes).sort(function(a, b) {
              if (a.cpus < b.cpus) {
                  return -1;
              } else if (a.cpus > b.cpus) {
                  return 1;
              }
              return 0;
          }) || [];
      if (location.extra && location.extra.available_instance_types) { // provider == "aliyun_ecs"
          var sizeOptions = allSizes.filter(function(option){
              return location.extra.available_instance_types.indexOf(option.external_id) > -1;
          });
      } else {
          var sizeOptions = allSizes.filter(function(option){
              return !option.extra.regions || option.extra.regions.indexOf(location.external_id) > -1;
          });
      }
      if (sizeOptions.findIndex(function(item){return item.id == selectedSize}) == -1) {
          this.set('machineFields' + sizeIndex + '.value', '');
      }
      this.set('machineFields.' + sizeIndex + '.options', sizeOptions);
  },

  _resetForm: function () {
      // Reset Form Fields
      this.set('selectedCloud', false)
      this.machineFields.forEach(function(el, index) {
          if (el.showIf) {
              this.set('machineFields.' + index + '.show', false);
          }
          // Reset Form Fields Validation
          this._resetField(el, index);
      }, this);
  },

  _resetField: function(el, index) {
      this.set('machineFields.' + index + '.value', el.defaultValue);

      var input = this.shadowRoot.querySelector('#' + el.name);
      if (input) {
          input.invalid = false;
      }
  },

  _updateFields: function(selectedCloud) {
      if (this.model && this.model.clouds && this.selectedCloud && this.model.clouds[this
              .selectedCloud]) {
          var cloudId = this.selectedCloud;

          if (!this.monitoring) // hide enable monitoring field if monitoring is disabled
              this.set('machineFields.' + this._fieldIndexByName('monitoring') + '.show',
                  false);

          // if is openstack do not require network/locations
          if (this.model.clouds[this.selectedCloud].provider == "openstack") {
              this._updateFieldsForOpenstack();
          }

          // if is packet construct ip_addresses value
          if (this.model.clouds[this.selectedCloud].provider == "packet") {
              this._updateFieldsForPacket();
          }

          // fetch security groups if necessary
          if (this.model.clouds[this.selectedCloud].provider == "ec2") {
              this._updateSecurityGroups(this.selectedCloud);
          }
          var that = this;
          this.machineFields.forEach(function(f, index) {
              // clear options
              if (['duration_field','dropdown','radio','list'].indexOf(f.type) == -1  && f.options) {
                  f.options = [];
              }

              if (f.name.endsWith("location")) {
                  var allLocations = this._toArray(this.model.clouds[cloudId].locations);
                  var locations = allLocations.filter(function(l){
                          var check_perm = that.check_perm('create_resources', 'location', l.id);
                          return check_perm != false;
                      });
                  // disable maxihost locations that support no sizes
                  if (this.model.clouds[cloudId].provider == "maxihost") {
                      var sizeLocations = this._toArray(this.model.clouds[this.selectedCloud].sizes).map(x=>x.extra.regions).join();
                      locations.forEach(function(l) {
                          if (sizeLocations.indexOf(l.external_id) == -1) {l.disabled = true;}
                      })
                  }
                  f.options = locations;
                  if (locations.length == 1 ) {
                      // If there's a single location preselect it
                      this.set('machineFields.'+index+'.value', locations[0].id);
                  }
              }
              if (f.name.endsWith("image")) {
                  var images = this._toArray(this.model.clouds[cloudId].images);
                  // KVM images depend on location
                  if (this.model.clouds[cloudId].provider == "libvirt"){
                      var locInd = this._fieldIndexByName('location');
                      if (locInd > -1) {
                          images = this._getLocationImages(this.get('machineFields.' + locInd + '.value'));
                      }
                  }
                  f.options = images.sort(function(ima, imb) {
                          if (ima.starred) {
                              return -1;
                          }
                          return 0;
                      }
                  );
                  for (var i = 0; i < f.options.length; i++) {
                      if (f.options[i].starred) {
                          f.options[i].icon = 'icons:star';
                      } else {
                          break;
                      }
                  }
              }

              if (f.type.startsWith("mist_") && f.name.endsWith("size")) {
                  f.options = this._toArray(this.model.clouds[cloudId].sizes).sort(function(a, b) {
                      if (a.cpus < b.cpus) {
                          return -1;
                      }
                      if (a.cpus > b.cpus) {
                          return 1;
                      }
                      return 0;
                  }) || [];
              }

              if (f.name.endsWith("key")) {
                  f.options = this._toArray(this.model.keys);
              }

              if (f.name.endsWith("zone")) {
                  f.options = this._toArray(this.model.zones);
                  // If zones share same domain but have differnt zone_id then display zone_id as suffix
                  f.options.forEach(function(zone) {
                      if (zone.domain != zone.zone_id+'.') {
                          zone.suffix = zone.zone_id;
                      }
                  })
              }

              // TODO: Run a recursive _updateFields() for fieldgroup subfields
              if (f.type == "fieldgroup") {
                  for (var k=0; k<f.subfields.length; k++) {
                      var sf = f.subfields[k];
                      if (sf.name && sf.name.endsWith("zone")) {
                          sf.options = this._toArray(this.model.zones);
                          sf.options.forEach(function(zone) {
                              if (zone.zone_id+'.' != zone.domain) {
                                  zone.suffix = zone.zone_id;
                              }
                          })
                          if (sf.options.length)
                              this.set('machineFields.'+index+'.subfields.'+k+'.value', sf.options[0].id);
                      }
                  }
              }

              if (f.name.startsWith("script") || f.name.startsWith(
                      "schedule_script")) {
                  f.options = this._toArray(this.model.scripts);
              }

              if (f.name == "action") {
                  f.options = this.scheduleActions || [];
              }

              // for openstack this should be multi selection
              if (f.name.endsWith("networks")) {
                  f.options = this.model.clouds[cloudId].networks ? Object.values(this.model.clouds[
                      cloudId].networks) : [];
                  if (f.options.length < 2)
                      this.set('machineFields.' + index + '.required', false);
              }

              // if is packet construct ip_addresses value
              if (f.name.includes("ipv4") || f.name.includes("ipv6")) {
                  // console.log("_updateFieldsForPacket");
                  this._updateFieldsForPacket();
              }

              // for ec2 subnet selection
              if (f.name == "subnet_id") {
                  var subnets = [];
                  var networks = this.model.clouds[cloudId].networks ? Object.values(this.model.clouds[cloudId].networks) : [];
                  for (var i = 0; i < networks.length; i++) {
                      var network = networks[i];
                      if (network.subnets && network.subnets.length)
                          for (var j = 0; j < network.subnets.length; j++) {
                              var subnet = network.subnets[j];
                              subnet.suffix = network.name;
                              subnets.push(subnet);
                          }
                  }
                  f.options = subnets;
                  if (f.options.length < 2)
                      this.set('machineFields.' + index + '.required', false);
              }

              // for volumes options
              if (f.name == 'volumes') {
                  var provider = this.model.clouds[cloudId].provider;
                  var fieldset = this.volumeFields.find(function (fieldset) {
                      return fieldset.provider == provider;
                  });
                  // remove location field if it exists,
                  // the location of the machine will be used instead
                  if (fieldset) {
                      var options = this._cleanCopy(fieldset.fields);
                      if(provider == 'kubevirt'){
                          //update kubernetes/kubevirt storage classes
                          var storageClassIndex = options.findIndex(function(f){return f.name == 'storage_class_name'});
                          if(storageClassIndex > -1) {
                              var storageClassField = options[storageClassIndex];
                              this._updateStorageClasses(cloudId, storageClassField);
                          }
                          //remove the static volume creation
                          var toRemove = ['dynamic', 'volume_type', 'reclaim_policy'];
                          for (const item of toRemove){
                              const ind = options.findIndex(function(f){return f.name == item});
                              if(ind>-1){
                                  options.splice(ind,1);
                              }
                          }
                      }

                      var locationIndex = options.findIndex(function(f){return f.name == 'location'});

                      if(provider === "lxd"){
                          var storagePoolsIdx = options.findIndex(function(f){return f.name == 'pool_id'});

                          if(storagePoolsIdx > -1){
                              var storagePoolField = options[storagePoolsIdx];
                              this.set("lxdStoragePoolsField",storagePoolField);
                              this._updateLXDStoragePools(cloudId);
                          }
                      }

                      if (locationIndex > -1) {
                          options.splice(locationIndex,1);
                      }
                      // remove resource group fields if they exists,
                      // the resource group of the machine will be used instead
                      var resourceGroupFields = options.filter(function(f){return f.name.indexOf('resource_group')>-1});
                      // console.log('resourceGroupFields',resourceGroupFields);
                      if (resourceGroupFields.length > -1) {
                          for (var i=0; i<resourceGroupFields.length; i++) {
                              var resourceGroupFieldName = resourceGroupFields[i].name;
                              var fieldIndex = options.findIndex(function(f){return f.name == resourceGroupFieldName})
                              options.splice(fieldIndex,1);
                          }
                      }
                      // Remove new volume name field for now since it's not used by OpenStack
                      if (provider == "openstack" || provider == "gig_g8"){
                          var nameIndex = options.findIndex(function(f){return f.name == 'name'})
                          if (nameIndex > -1) {
                              options.splice(nameIndex,1);
                          }
                      }
                      options.forEach(function(f){
                          f.showIf = {
                              fieldName: 'new-or-existing-volume',
                              fieldValues: ['new'],
                          }
                      })
                      var existingIndex = f.options.findIndex(function(f){return f.name == 'volume_id'});
                      // add provider dependent fields if they do yet not exist
                      var names = f.options.map(f => f.name);
                      for (var i = options.length-1; i>=0;i--){
                          if (names.indexOf(options[i].name) == -1 && (options[i].onForm == 'createForm' || !options[i].onForm) ) {
                              f.options.splice(existingIndex, 0, options[i]);
                          }
                      }
                  }
              }

              // update options
              if (f.options) {
                  this.set('machineFields.' + index + '.options', f.options);
              }

              // console.log(this.get('machineFields.' + index + '.options'));
              // console.log('update fields', f.name, f.value)
          }.bind(this));

          // if cloud is Aliyun ECS update locations
          if (this.model.clouds[this.selectedCloud].provider == "aliyun_ecs") {
              this._updateFieldsForAliyun();
          }

          // if is docker, change required values
          if (this.model.clouds[this.selectedCloud].provider == "docker") {
              this._updateFieldsForDocker();
          }

          // if is lxd, change required values
          if (this.model.clouds[this.selectedCloud].provider == "lxd") {
              this._updateFieldsForLxd();
          }

          // if is gig_g8 require network
          if (this.model.clouds[this.selectedCloud].provider == "gig_g8") {
              this._updateFieldsForGigG8();
          }

          // if is azure arm, change required values
          if (this.model.clouds[this.selectedCloud].provider == "azure_arm") {
              this._updateFieldsForAzureArm();
              this._updateStorageAccounts(this.selectedCloud);
              this._updateResourceGroups(this.selectedCloud);
          }

          // if is kvm, change helptexts
          if (this.model.clouds[this.selectedCloud].provider == "libvirt") {
              this._updateFieldsForKvm();
          }
          //if it is vsphere add folders
          if (this.model.clouds[this.selectedCloud].provider == "vsphere") {
              var folderFieldInd = this._fieldIndexByName('folders');
              var folderField = this.get("machineFields." + folderFieldInd);
              var datastoreFieldInd = this._fieldIndexByName('datastore')
              var datastoreField = this.get("machineFields." + datastoreFieldInd)
              this._updateFolders(this.selectedCloud, folderField);
              this._updateDatastores(this.selectedCloud, datastoreField)
          }
          // default values, hide empty non required, fill in single options
          if (this.machineFields) {
              this.machineFields.forEach(function(f, ind) {
                  this.set('machineFields.' + ind + '.value', this.get(
                      'machineFields.' + ind + '.defaultValue'));
                  if (f.required && f.options && f.options.length == 1 &&
                      (f.name!= "image" && this.model.clouds[this.selectedCloud].provider != "vsphere")) {
                      if (f.type == "dropdown") {
                          this.set('machineFields.' + ind + '.value', f.options[0].val);
                      } else {
                          this.set('machineFields.' + ind + '.value', f.options[0].id);
                      }
                  }

                  if (!f.required && f.options && f.options.length == 0) {
                      this.set('machineFields.' + ind + '.show', false);
                  }
              }.bind(this));
          }
      }
  },

  fieldsChanged: function(e) {
      // change notify values if expiration date changes
      if (e.detail && e.detail.fieldname == "date" && e.detail.parentfield == "expiration") {
          var expIndex = this._fieldIndexByName('expiration'),
              parentPath = 'machineFields.'+ expIndex +'.subfields', dateIndex = 1, notifyIndex = 2,
              date = this.get(parentPath +'.'+ dateIndex +'.value'),
              notify = this.get(parentPath +'.'+ notifyIndex +'.value');
          this.set(parentPath +'.'+ notifyIndex +'.max', date);
      }
  },

  _machineFieldsChanged: function(changeRecord) {
      // console.log('model, selected cloud or machine fields changed', this.selectedCloud, changeRecord);
      if (this.selectedCloud && this.model && this.model.clouds && this.model.clouds[this
              .selectedCloud]) {
          // if (changeRecord.path.endsWith('options') && this.get(changeRecord.path).length == 1)
          //     this.set(changeRecord.path.replace('.options', '.value'), changeRecord.path+'.0.id')

          // if is docker & ports changed, transform ports to docker_exposed_ports & docker_port_bindings
          if (this.model.clouds[this.selectedCloud].provider == "docker" && changeRecord.path
              .endsWith('value') && this.get(changeRecord.path.replace('.value', '')).name ==
              'ports') {
              // TODO: remove _mapPortsToDockerPorts, when backend is ready to accept docker_port_bindings as string
              // Then also, replace field ports with docker_port_bindings as a textarea and remove docker_exposed_ports and ports altogether in machine-create-fields.js
              this._mapPortsToDockerPorts(changeRecord.value);
          }

          // if is gce/linode and image changed, include image extra in payload
          if ((this.model.clouds[this.selectedCloud].provider == "linode" || this.model.clouds[
                  this.selectedCloud].provider == "gce" || this.model.clouds[
                  this.selectedCloud].provider == "vsphere") && changeRecord.path.endsWith(
                  'value') && this.get(changeRecord.path.replace('.value', '')).name ==
              'image') {
              this._includeImageExtra(changeRecord.value);
          }

          // if is gce/linode and image changed, include location name in payload
          if ((this.model.clouds[this.selectedCloud].provider == "linode" || this.model.clouds[
                  this.selectedCloud].provider == "gce") && changeRecord.path.endsWith(
                  'value') && this.get(changeRecord.path.replace('.value', '')).name ==
              'location') {
              this._includeLocationName(changeRecord.value);
          }

          // if its ec2 and image changes update size to match the virtualization_type
          if (this.model.clouds[this.selectedCloud].provider == "ec2" && changeRecord.path
              .endsWith('value') && this.get(changeRecord.path.replace('.value', '')).name ==
              'image') {
              this._updateEc2Sizes(this.get(changeRecord.path.replace('.value', '')).value);
          }

          // if it's gce and network changes update subnets
          if (this.model.clouds[this.selectedCloud].provider == "gce" && changeRecord.path
              .endsWith('value') && this.get(changeRecord.path.replace('.value', '')).name ==
              'networks') {
              this._updateGceSubnets(this.get(changeRecord.path.replace('.value', '')).value);
          }

          // if image and image is Windows, show password field
          if (changeRecord.path.endsWith('value') && this.get(changeRecord.path.replace(
                  '.value', '')).name == 'image') {
              this._showPassword(this.get(changeRecord.path));
              this._hideElementsforWin(this.get(changeRecord.path));
          }

          // if its kvm
          if (this.model.clouds[this.selectedCloud].provider == 'libvirt') {
              if (changeRecord
                  .path.endsWith('.value') && this.get(changeRecord.path.replace('.value', ''))
                  .name == 'name') {
                  this._updateKvmDiskPathName(this.get(changeRecord.path.replace('.value', '')).value);
              }

              if (changeRecord
                  .path.endsWith('.value') && this.get(changeRecord.path.replace('.value', ''))
                  .name == 'location') {
                  this._updateImagesAndNetworksBasedOnLocation();
                  this._updateKvmDiskPathFolder(this.get(changeRecord.path.replace('.value', '')).value);
              }
          }

          // if its packet and ips changed
          if (this.model.clouds[this.selectedCloud].provider == 'packet' && changeRecord
              .path.endsWith('.value') && this.get(changeRecord.path.replace('.value', ''))
              .name.includes('_ipv')) {
              this._updateFieldsForPacket();
          }

          // if selected image provides size min/max, update them
          if (changeRecord
              .path.endsWith('.value') && this.get(changeRecord.path.replace('.value', ''))
              .name == "image") {
              this._updateMinSize(changeRecord.value);
          }

          // if location changed and volumes are allowed
          if (changeRecord.path.endsWith('value') && ['location', 'volumes'].indexOf(this.get(changeRecord.path.replace(
                  '.value', '')).name) > -1 && this._fieldIndexByName('volumes') > -1) {
              // add existing volume options filtered by location
              var volumesInd = this._fieldIndexByName('volumes');
              var volumeField = this.get('machineFields.' + volumesInd);
              var existingIndex = volumeField.options.findIndex(function(f){return f.name == 'volume_id'});
              // reset
              this.set('machineFields.' + volumesInd + '.options.' + existingIndex +'.options', []);
              this.set('machineFields.' + volumesInd + '.options.' + existingIndex +'.value', '');
              this.notifyPath('machineFields.' + volumesInd + '.options.' + existingIndex +'.value');
              // add
              if (existingIndex > -1) {
                  var volumes = this.model.clouds[this.selectedCloud].volumes ? Object.values(this.model.clouds[this.selectedCloud].volumes).filter(
                      function(v) {
                          return !v.location || v.location == changeRecord.value
                      }) : [];
                  volumeField.options[existingIndex].options = volumes;
                  this.set('machineFields.' + volumesInd + '.options.' + existingIndex +'.options', volumes);
                  this.notifyPath('machineFields.' + volumesInd + '.options.' + existingIndex +'.options');
              }
          }

          // if add volume toggler changed value
          if (changeRecord.path.endsWith('value') && ['addvolume'].indexOf(this.get(changeRecord.path.replace(
                  '.value', '')).name) > -1) {
              var volumesInd = this._fieldIndexByName('volumes');
              if (!changeRecord.value) {
                  this.set('machineFields.' + volumesInd + '.items', []);
                  this.set('machineFields.' + volumesInd + '.value', null);
              }
              this.set('machineFields.' + volumesInd + '.excludeFromPayload', !changeRecord.value);
          }

          // if it's ec2 and location is selected filter subnets
          if (changeRecord.path.endsWith('value') && this.get(changeRecord.path.replace(
                  '.value', '')).name == 'location' && changeRecord.value.length) {
              var subid = this._fieldIndexByName('subnet_id');
              // clear previous selection
              this.set('machineFields.' + subid + '.value', '');
              var subnets = [];
              if (this.model.clouds[this.selectedCloud] && this.model.clouds[this.selectedCloud].networks) {
                  var networks = Object.values(this.model.clouds[this.selectedCloud].networks);
                  for (var i = 0; i < networks.length; i++) {
                      var network = networks[i];
                      if (network.subnets)
                          for (var subnetId in network.subnets) {
                              var subnet = network.subnets[subnetId];
                              if (subnet.availability_zone == this.model.clouds[this.selectedCloud].locations[changeRecord.value].name) {
                                  subnet.suffix = network.name;
                                  subnets.push(subnet);
                              }
                          }
                  }
              }
              this.set('machineFields.' + subid + '.options', subnets);
          }

          // if it is maxihost and location changed
          if (this.model.clouds[this.selectedCloud].provider == 'maxihost') {
              if (this.get(changeRecord.path.replace('.value', '')).name == 'location' && changeRecord.value.length) {
                  this._updateMaxihostSizes(changeRecord.value);
              }
          }

          // if it is azure arm update storage accounts & resource groups
          if (this.model.clouds[this.selectedCloud].provider == 'azure_arm') {
              // console.log('changeRecord', changeRecord);
              if (changeRecord.path.endsWith('value')) {
                  var fieldName = this.get(changeRecord.path.replace('.value', '')).name;

                  if (['resource_group','location'].indexOf(fieldName) > -1){
                      this._filterStorageAccountsOptions();
                      this._filterNetworksOptions();
                  }

                  if (['resource_group','storage_account','networks']
                      .indexOf(fieldName) > -1) {
                          return;
                  }

                  if (['create_resource_group','ex_resource_group','new_resource_group']
                      .indexOf(fieldName) > -1) {
                      this._updateResourceGroupValue(this.selectedCloud);
                      if (fieldName == "create_resource_group") {
                          this._toggleExistingStorageAccounts(changeRecord.value);
                          this._toggleExistingNetworks(changeRecord.value);
                      }
                  }
                  if (['create_storage_account','ex_storage_account','new_storage_account']
                      .indexOf(fieldName) > -1) {
                      this._updateStorageAccountValue(this.selectedCloud);
                  }
                  if (['create_network','ex_networks','new_network']
                      .indexOf(fieldName) > -1) {
                      this._updateNetworkValue(this.selectedCloud);
                  }
                  // if it is azure arm and location is changed
                  if (fieldName == 'location') {
                      // update networks
                      var networks = this.model.clouds[this.selectedCloud].networks ? Object.values(this.model.clouds[this.selectedCloud].networks).slice() : [];
                      var locationNetworks = networks.filter(function(n) {
                          return n.location == location
                      });
                      var networkInd = this._fieldIndexByName('ex_networks');
                      if (networkInd > -1) {
                          this.set('machineFields.' + networkInd + '.options', locationNetworks);
                      }
                  }
                  // if it is azure arm and machine name is changed
                  if (fieldName == 'name') {
                      //autocomplete resource, storage, network fields
                      this._updateAzureFields(this.get(changeRecord.path));
                  }
              }
          }
          // let either script or script_id to pass in the from payload
          if (changeRecord.path.endsWith('value') && this.get(changeRecord.path.replace(
                  '.value', '')).name == 'run_script') {
              this._toggleScriptFields(this.get(changeRecord.path.replace('.value', '')).value);
          }

          if (this.model.clouds[this.selectedCloud].provider == 'onapp' && changeRecord.path
              .endsWith('value')) {
              // if is onapp controll options based on location
              if (this.get(changeRecord.path.replace('.value', '')).name == 'location')
                  this._updateFieldOptionsForOnapp(changeRecord.value);
              // if is onapp controll options based on image
              if (this.get(changeRecord.path.replace('.value', '')).name == 'image')
                  this._updateFieldMinsForOnapp(changeRecord.value);
              // if is onapp controll total size
              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  'size_disk_primary')
                  this._updateDiskMax('size_disk_swap', changeRecord.value);
              // if is onapp controll total size
              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  'size_disk_swap')
                  this._updateDiskMax('size_disk_primary', changeRecord.value);
          }

          // update scheduler fields
          if (changeRecord.path.endsWith('.value')) {
              var scheduleFields = ['action', 'schedule_script_id', 'params',
                  'schedule_type', 'schedule_entry', 'start_after', 'expires',
                  'max_run_count'
              ];
              var scheduleFieldFalse = ['action', 'params', 'schedule_type',
                  'schedule_entry', 'start_after', 'expires', 'max_run_count'
              ];
              // toggling scehduler
              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  "post_provision_scheduler") {
                  //console.log('schedule changed', changeRecord.value);
                  if (changeRecord.value == true) {
                      for (var i = 0; i < scheduleFieldFalse.length; i++) {
                          var index = this._fieldIndexByName(scheduleFieldFalse[i]);
                          if (index > -1) {
                              this.set('machineFields.' + index + '.excludeFromPayload',
                                  false);
                          }
                      }
                  } else {
                      for (var i = 0; i < scheduleFields.length; i++) {
                          var index = this._fieldIndexByName(scheduleFields[i]);
                          if (index > -1) {
                              this.set('machineFields.' + index + '.excludeFromPayload', true);
                          }
                      }
                  }
              }

              // selecting action or script
              if (this.get(changeRecord.path.replace('.value', '')).name == "action") {
                  var actionInd = this._fieldIndexByName("action");
                  var scriptInd = this._fieldIndexByName("schedule_script_id");

                  if (changeRecord.value == "run script") {
                      if (scriptInd > -1) {
                          this.set('machineFields.' + scriptInd + '.excludeFromPayload',
                              false);
                      }
                      if (actionInd > -1) {
                          this.set('machineFields.' + actionInd + '.excludeFromPayload', true);
                      }
                  }

                  if (changeRecord.value != "run script") {
                      if (scriptInd > -1) {
                          this.set('machineFields.' + scriptInd + '.excludeFromPayload', true);
                      }
                      if (actionInd > -1) {
                          this.set('machineFields.' + actionInd + '.excludeFromPayload',
                              false);
                      }
                  }
              }

              // initial values in shedule entry
              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  "schedule_type") {
                  var entryInd = this._fieldIndexByName("schedule_entry"),
                      expInd = this._fieldIndexByName("expires"),
                      entryCronTabInd = this._fieldIndexByName("schedule_entry_crontab"),
                      maxcountInd = this._fieldIndexByName("max_run_count"),
                      entry;
                  if (changeRecord.value == "interval") {
                      entry = this._getInterval();
                      if (expInd > -1) this.set('machineFields.' + expInd + '.disabled', false);
                      if (maxcountInd > -1) this.set('machineFields.' + maxcountInd + '.disabled', false);
                      if (maxcountInd > -1) this.set('machineFields.' + maxcountInd + '.value', "");
                  } else if (changeRecord.value == "crontab") {
                      entry = this._processCrotab(this.get('machineFields.' +
                          entryCronTabInd + '.value')) || this._processCrotab(this.get(
                          'machineFields.' + entryCronTabInd + '.defaultValue'));
                      if (expInd > -1) this.set('machineFields.' + expInd + '.disabled', false);
                      if (maxcountInd > -1) this.set('machineFields.' + maxcountInd + '.disabled', false);
                      if (maxcountInd > -1) this.set('machineFields.' + maxcountInd + '.value', "");
                  } else if (changeRecord.value == "one_off") {
                      if (expInd > -1) this.set('machineFields.' + expInd + '.disabled', true);
                      if (maxcountInd > -1) this.set('machineFields.' + maxcountInd + '.value', 1);
                      if (maxcountInd > -1) this.set('machineFields.' + maxcountInd + '.disabled', true);
                  }
                  this.set('machineFields.' + entryInd + '.value', entry);
              }

              // date in shedule entry
              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  "schedule_entry_one_off") {
                  var entryInd = this._fieldIndexByName("schedule_entry");
                  if (entryInd > -1) this.set('machineFields.' + entryInd + '.value', changeRecord.value);
              }

              // crontab in schedule entry
              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  "schedule_entry_crontab") {
                  var entryInd = this._fieldIndexByName("schedule_entry");
                  if (entryInd > -1) this.set('machineFields.' + entryInd + '.value', this._processCrotab(
                      changeRecord.value));
              }

              // interval changes in schedule entry
              if (this.get(changeRecord.path.replace('.value', '')).name.startsWith(
                      "schedule_entry_interval")) {
                  var entryInd = this._fieldIndexByName("schedule_entry");
                  if (entryInd > -1) this.set('machineFields.' + entryInd + '.value', this._getInterval());
              }

              if (this.get(changeRecord.path.replace('.value', '')).name == "expires") {
                  var expiresInd = this._fieldIndexByName("expires");
                  var include = changeRecord.value != "" ? false : true;
                  if (expiresInd > -1) this.set('machineFields.' + expiresInd + '.excludeFromPayload', include);
              }

              if (this.get(changeRecord.path.replace('.value', '')).name ==
                  "max_run_count") {
                  var maxcountInd = this._fieldIndexByName("max_run_count");
                  if (typeof(this.get('machineFields.' + maxcountInd + '.value')) !=
                      'number') {
                      if (parseInt(changeRecord.value) == NaN && maxcountInd > -1) {
                          this.set('machineFields.' + maxcountInd + '.excludeFromPayload',
                              true);
                          this.set('machineFields.' + maxcountInd + '.value', "");
                      } else {
                          this.set('machineFields.' + maxcountInd + '.excludeFromPayload',
                              false);
                          this.set('machineFields.' + maxcountInd + '.value', parseInt(
                              changeRecord.value));
                      }
                  }
              }
          }
      }
      // if is vsphere change fields
      if (this.model && this.model.clouds && this.model.clouds[this.selectedCloud] && this.model.clouds[
              this.selectedCloud].provider == "vsphere") {
          this._updateFieldsForVsphere();
      }
  },

  _mapPortsToDockerPorts: function(input) {
      var lines = input.split('\n');
      var docker_exposed_ports = {};
      var docker_port_bindings = {};

      for (var i = 0; i < lines.length; i++) {
          var ports = lines[i].split(':');

          var p1 = ports[0],
              p2 = ports[1];

          //sanitize
          if (p1)
              p1 = p1.trim();
          if (p2)
              p2 = p2.trim();

          //update docker_exposed_ports
          //update docker_port_bindings
          if (p1 && p1.length && p2 && p2.length) {
              if (p1.indexOf('/') == -1) {
                  docker_exposed_ports[p1 + '/tcp'] = {};
                  docker_port_bindings[p1 + '/tcp'] = {
                      "HostPort": p2
                  }
              } else {
                  docker_exposed_ports[p1] = {};
                  docker_port_bindings[p1] = [{
                      "HostPort": p2
                  }]
              }
          }
      }

      // save in fields
      var indDep = this._fieldIndexByName('docker_exposed_ports');
      var indDpb = this._fieldIndexByName('docker_port_bindings');

      if (indDep != undefined && indDep > -1)
          this.set('machineFields.' + indDep + '.value', docker_exposed_ports);
      if (indDpb != undefined && indDpb > -1)
          this.set('machineFields.' + indDpb + '.value', docker_port_bindings);
  },

  _includeImageExtra: function(image) {
      if (image) {
          // save in fields
          var indImEx = this._fieldIndexByName('image_extra');
          if (indImEx != undefined)
              this.set('machineFields.' + indImEx + '.value', this.model.clouds[this.selectedCloud]
                  .images[image].extra);
      }
  },

  _includeLocationName: function(location) {
      if (location) {
          // save in fields
          var indLocName = this._fieldIndexByName('location_name');
          if (indLocName != undefined && indLocName > -1)
              this.set('machineFields.' + indLocName + '.value', this.model.clouds[this.selectedCloud]
                  .locations[location].name);
      }
  },

  _updateDiskMax: function(name, value, total) {
      var sizeInd = this._fieldIndexByName(name),
          location = this.model.clouds[this.selectedCloud].locations[this.get(
              'machineFields.' + this._fieldIndexByName('location') + '.value')];

      if (!location)
          return;
      if (location && location.extra) {
          if (!total)
              var total = location.extra.max_disk_size;

          if (total && total - value > 0 && sizeInd > -1)
              this.set('machineFields.' + sizeInd + '.max', total - value);
      }
  },

  _updateFieldsForAliyun: function () {
      var locationIndex = this._fieldIndexByName('location'),
          cloudLocations = this.model.clouds[this.selectedCloud].locations;
      if (locationIndex > -1) {
          var filteredLocations = this.machineFields[locationIndex].options.filter(function (option) {
              return option.extra.available_instance_types.length;
          });
          this.set('machineFields.' + locationIndex + '.options', filteredLocations);
      }
  },

  _updateFieldsForVsphere: function() {
      var keyInd = this._fieldIndexByName('key');
      if (keyInd > -1 && this.get('machineFields.' + keyInd + '.required')) {
          this.set('machineFields.' + keyInd + '.required', false);
          this.set('machineFields.' + keyInd + '.label', "Key");
      }
      var imgInd = this._fieldIndexByName('image');
      var img = this.get('machineFields.' + imgInd);
      if (img && img.value) {
          for (var i = 0; i < img.options.length; i++) {
              current = img.options[i];
              if (current.id == img.value) {
                  break
              }
          }
          
          var sizeInd = this._fieldIndexByName('size');
          var min_size = Math.max(current.extra.disk_size, this.machineFields[sizeInd].customSizeFields[2].min);
          if (current.extra.type == "ovf"){
              this.set('machineFields.' + sizeInd + '.customSizeFields.' + 2 + '.min', min_size);
              this.set('machineFields.' + sizeInd + '.customSizeFields.' + 2 + '.max', 1);
              this.set('machineFields.' + sizeInd + '.customSizeFields.' + 2 + '.value', min_size);
          } else {
              this.set('machineFields.' + sizeInd + '.customSizeFields.' + 2 + '.min', min_size);
              this.set('machineFields.' + sizeInd + '.customSizeFields.' + 2 + '.max', 512);
              this.set('machineFields.' + sizeInd + '.customSizeFields.' + 2 + '.value', Math.max(min_size, this.machineFields[sizeInd].customSizeFields[2].value));
          }
      }
      
      
  },

  _updateFieldsForOpenstack: function() {
      var locInd = this._fieldIndexByName('location');
      if (locInd > -1) {
          this.set('machineFields.' + locInd + '.required', false);
          this.set('machineFields.' + locInd + '.label', "Location");
          if (this.get('machineFields.' + locInd + '.options').length == 0) {
              this.set('machineFields.' + locInd + '.show', false);
          }
      }
  },

  _updateFieldsForGigG8: function() {
      var netInd = this._fieldIndexByName('networks');
      if (netInd > -1) {
          this.set('machineFields.' + netInd + '.options', this._toArray(this.model.clouds[this.selectedCloud].networks));
          this.set('machineFields.' + netInd + '.required', true);
      }
  },

  _updateMinSize: function(image) {
      console.log('test');
      if (!image || !this.model || !this.model.images || !this.model.images[image] || !this.model.images[image].extra)
          return;

      var minRam = this.model.images[image].extra.min_memory;
      var minDisk = this.model.images[image].extra.min_disk_size;

      var sizeInd = this._fieldIndexByName('size');
      if (sizeInd > -1) {
          var customSizeFields = this.machineFields[sizeInd].customSizeFields;
          var ramInd = this._fieldIndexByName('ram', customSizeFields);
          var diskInd = this._fieldIndexByName('disk_primary', customSizeFields);

          // some providers use size_ prefix
          if (ramInd ==  -1)
              ramInd = this._fieldIndexByName('size_ram', customSizeFields);
          if (diskInd ==  -1)
              diskInd = this._fieldIndexByName('size_disk_primary', customSizeFields);

          if (minRam && ramInd > -1)
              this.set('machineFields.'+ sizeInd +'.customSizeFields.'+ ramInd +'.min', minRam);
          if (minDisk && diskInd > -1)
              this.set('machineFields.'+ sizeInd +'.customSizeFields.'+ diskInd +'.min', minDisk);
      }
      // console.log(this.model.images[image].name, 'ram', this.model.images[image].extra.min_memory, 'disk', this.model.images[image].extra.min_disk_size);
      // console.log('mins', this.get('machineFields.'+ sizeInd +'.customSizeFields.'+ ramInd +'.min'), this.get('machineFields.'+ sizeInd +'.customSizeFields.'+ diskInd +'.min'));
  },

  _updateFieldMinsForOnapp: function(image) {
      var image = this.model.clouds[this.selectedCloud].images && this.model.clouds[this.selectedCloud]
          .images[image] ? this.model.clouds[this.selectedCloud].images[image] : undefined;

      if (!image) {
          return;
      }

      var sizeInd = this._fieldIndexByName('mist_size'),
          ramInd = this._fieldIndexByName('size_ram', this.get('machineFields.' + sizeInd + '.customSizeFields')),
          diskInd = this._fieldIndexByName('size_disk_primary', this.get('machineFields.' + sizeInd + '.customSizeFields'));

      if (sizeInd > -1 && ramInd > -1)
          this.set('machineFields.' + sizeInd + '.customSizeFields.' + ramInd + '.min', image.extra.min_memory_size);
      if (sizeInd > -1 && diskInd > -1)
          this.set('machineFields.' + sizeInd + '.customSizeFields.' + diskInd + '.min', image.extra.min_disk_size);

      // console.log('mins', image.extra.min_memory_size, image.extra.min_disk_size);
  },

  _updateFieldOptionsForOnapp: function(loc) {
      var location = this.model.clouds[this.selectedCloud].locations[loc];

      // console.log('location', this.model.clouds[this.selectedCloud]);

      if (!location) {
          return;
      }

      var cpuInd = this._fieldIndexByName('size_cpu'),
          ramInd = this._fieldIndexByName('size_ram'),
          hgiInd = this._fieldIndexByName('hypervisor_group_id'),
          diskInd = this._fieldIndexByName('size_disk_primary'),
          swapInd = this._fieldIndexByName('size_disk_swap');

      // update mins maxs
      if (location.extra) {
          if (cpuInd > -1) this.set('machineFields.' + cpuInd + '.max', location.extra.max_cpu);
          if (ramInd > -1) this.set('machineFields.' + ramInd + '.max', location.extra.max_memory);
          if (hgiInd > -1) this.set('machineFields.' + hgiInd + '.value', location.extra.hypervisor_group_id);

          if (location.extra.max_disk_size) {
              this._updateDiskMax('size_disk_primary', this.get('machineFields.' + this._fieldIndexByName(
                  'size_disk_swap') + '.value'), location.extra.max_disk_size);
              this._updateDiskMax('size_disk_swap', this.get('machineFields.' + this._fieldIndexByName(
                  'size_disk_primary') + '.value'), location.extra.max_disk_size);
          } else {
              if (diskInd > -1) this.set('machineFields.' + diskInd + '.max', 16);
              if (swapInd > -1) this.set('machineFields.' + swapInd + '.max', 16);
          }

          var imagesInd = this._fieldIndexByName('image'),
              networksInd = this._fieldIndexByName('networks');

          // update networks
          if (networksInd > -1) this.set('machineFields.' + networksInd + '.options', location.extra.networks);

          // filter images
          if (location.extra.federated == true && imagesInd > -1)
              this.set('machineFields.' + imagesInd + '.options', this._filterImagesByLoc(
                  location.extra.hypervisor_group_id));
          else
              this.set('machineFields.' + imagesInd + '.options', this._filterImagesWithNoHyp());
      }

  },

  _filterImagesByLoc: function(location) {
      return this.model.clouds[this.selectedCloud].imagesArray.filter(function(im) {
          return im.extra.hypervisor_group_id == location;
      });
  },

  _filterImagesWithNoHyp: function(location) {
      return this.model.clouds[this.selectedCloud].imagesArray.filter(function(im) {
          return !im.extra.hypervisor_group_id;
      });
  },

  _updateFieldsForDocker: function() {
      var sizeInd = this._fieldIndexByName('size');
      var locInd = this._fieldIndexByName('location');
      var keyInd = this._fieldIndexByName('key');
      var monInd = this._fieldIndexByName('monitoring');

      //hide size and location
      // console.log('............', sizeInd, locInd);
      if (sizeInd > -1) this.set('machineFields.' + sizeInd + '.show', false);
      if (locInd > -1) this.set('machineFields.' + locInd + '.show', false);

      this.notifyPath('machineFields.' + sizeInd + '.show');
      this.notifyPath('machineFields.' + locInd + '.show');

      // optional key
      if (keyInd > -1) {
          this.set('machineFields.' + keyInd + '.helptext',
              "Optional. Only valid if image includes ssh server");
      }

      // disable monitoring by default
      if (monInd > -1)
          this.set('machineFields.' + monInd + '.value', false);
  },

  _updateFieldsForLxd: function() {
      var keyInd = this._fieldIndexByName('key');
      // optional key
      if (keyInd > -1) {
          this.set('machineFields.' + keyInd + '.helptext',
              "Optional. Only valid if image includes ssh server");
      }
  },

  _computeAddImageTitle: function(selectedCloud) {
      var provider = "";
      if (selectedCloud) {
          provider = this.model.clouds[this.selectedCloud].provider
      }
      return provider == 'lxd' ? "Pull image from URL:" : "Create image";
  },

  _computeAddImageLabel: function(selectedCloud) {
      var provider = "";
      if (selectedCloud) {
          provider = this.model.clouds[this.selectedCloud].provider
      }
      return provider == 'lxd' ? "Image URL:" : "Image's path";
  },

  _updateFieldsForKvm: function() {
      var keyInd = this._fieldIndexByName('key');
      var pathInd = this._fieldIndexByName('libvirt_disk_path');

      //change key helptexts
      if (keyInd > -1) {
          this.set('machineFields.' + keyInd + '.helptext',
              "Αn ssh key to deploy if using a cloudinit based Linux image");
          if (this.docs)
              this.set('machineFields.' + keyInd + '.helpHref',
                  "http://docs.mist.io/article/99-managing-kvm-with-mist-io");
      }

      // if location is selected, we can update image options
      this._updateImagesAndNetworksBasedOnLocation();

  },

  _updateImagesAndNetworksBasedOnLocation: function() {
      var locInd = this._fieldIndexByName('location');
      var imgInd = this._fieldIndexByName('image');
      var networkInd = this._fieldIndexByName('networks');
      var vnfInd = this._fieldIndexByName('vnfs');
      if (locInd == -1 || imgInd == -1 || networkInd == -1) {
          return;
      }
      var location = this.get('machineFields.' + locInd + '.value');
      if (!location) return;

      var locImages = this._getLocationImages(location);
      this.set('machineFields.' + imgInd + '.options', locImages);

      // update networks
      var networks = this.model.clouds[this.selectedCloud].networks ? Object.values(this.model.clouds[this.selectedCloud].networks).slice() : [];

      var locationNetworks = networks.filter(function(n) {
          return n.location == location
      });

      if (networkInd > -1) {
          this.set('machineFields.' + networkInd + '.options', locationNetworks);
      }

      if (vnfInd > -1) {
          var allVnfs = this.get('machineFields.' + vnfInd + '.vnfs') || [],
              locationVNFs = allVnfs.filter(function(f) {return f.location == location}),
              categorisedVNFs = this._getCategorizedVirtualNetworkFunctions(locationVNFs);
          this.set('machineFields.' + vnfInd + '.subfields.0.options', categorisedVNFs);
      }
  },

  _getLocationImages: function(location) {
      if (location && this.model && this.model.clouds)
          return this.model.imagesArray.filter(function(im){
                  return im.extra && im.extra.locations && im.extra.locations.indexOf(location) > -1 ;
              });
      return [];
  },

  _updateFieldsForAzureArm: function() {
      var hostnameInd = this._fieldIndexByName('create_hostname_machine');
      if (hostnameInd > -1)
          this.set('machineFields.' + hostnameInd + '.show', false);
  },

  _updateKvmDiskPath: function(location, machinename) {
      var pathInd = this._fieldIndexByName('libvirt_disk_path');
      var locationPath = location.length && 
                          this.model.clouds[this.selectedCloud] &&
                          this.model.clouds[this.selectedCloud].locations &&
                          this.model.clouds[this.selectedCloud].locations[location] &&
                          this.model.clouds[this.selectedCloud].locations[location].extra ?
                          this.model.clouds[this.selectedCloud].locations[location].extra.images_location : '';
      //fill in disk path using images_location and machine name
      if (machinename.trim().length && pathInd > -1)
          this.set('machineFields.' + pathInd + '.value', locationPath + "/" + machinename.trim() + ".img");
  },

  _updateKvmDiskPathName: function(name) {
      var ind = this._fieldIndexByName('location');
      var location = ind > -1 ? this.machineFields[ind].value : '';
      this._updateKvmDiskPath(location || '', name || '');
  },

  _updateKvmDiskPathFolder: function(location) {
      var ind = this._fieldIndexByName('name');
      var name = ind > -1 ? this.machineFields[ind].value : '';
      this._updateKvmDiskPath(location || '', name || '');
  },

  _updateAzureFields: function(machinename) {
      var networkInd = this._fieldIndexByName('new_network');
      if (networkInd > -1) this.set('machineFields.' + networkInd + '.value', machinename + '-vnet');
      var resourceInd = this._fieldIndexByName('new_resource_group');
      if (resourceInd > -1) this.set('machineFields.' + resourceInd + '.value', machinename);
      var storageInd = this._fieldIndexByName('new_storage_account');
      // storage account name must be lower case numbers and letters, length 3-24
      if (storageInd > -1) this.set('machineFields.' + storageInd + '.value', machinename.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "").slice(0, 19) + 'disks');
  },

  _updateEc2Sizes: function(imageid) {
      if (this.model.images[imageid] && this.model.images[imageid].extra && this.model.images[
              imageid].extra.virtualization_type) {
          var virtualization_type = this.model.images[imageid].extra.virtualization_type;

          var sizeInd = this._fieldIndexByName('size');
          var sizesOptions = this.model.clouds[this.selectedCloud].sizesArray.filter(
              function(s) {
                  if (s.extra.virtualizationTypes) {
                      return s.extra.virtualizationTypes.indexOf(virtualization_type) >
                          -1
                  } else {
                      return 1
                  }
              });
          if (sizeInd > -1)
              this.set('machineFields.' + sizeInd + '.options', sizesOptions);
          // console.log('_updateEc2Sizes', virtualization_type , this.model.clouds[this.selectedCloud].sizesArray.length, sizesOptions)
      }
  },

  _updateMaxihostSizes: function(locationId){
      // var locationInd = this._fieldIndexByName('location');
      var sizeInd = this._fieldIndexByName('size');
      var locationExternalId = this.model.clouds[this.selectedCloud].locations[locationId].external_id;

      var allSizes = this._toArray(this.model.clouds[this.selectedCloud].sizes) || [];
      var filteredSizes = allSizes.filter(function(s) {
          return s.extra.regions.indexOf(locationExternalId) > -1
      });
      this.set('machineFields.' + sizeInd + '.options', filteredSizes);
      // clear previous value if not in filtered sizes
      if (this.machineFields[sizeInd].value != '' && filteredSizes.map(x=>x.id).indexOf(this.machineFields[sizeInd].value) == -1) {
          this.set('machineFields.' + sizeInd + '.value', '');
      }
      // console.log('maxihost ', locationExternalId, filteredSizes.map(x=>x.extra.regions));
  },

  _updateGceSubnets: function(networkId) {
      var subnetsInd = this._fieldIndexByName('subnetwork'),
          network = networkId && this.model.clouds[this.selectedCloud].networks[networkId];
      if (subnetsInd && network && network.extra.mode == 'custom') {
          var subnetsOptions = this.model.clouds[this.selectedCloud].networks[networkId].subnets.map(
              x => x.name).filter((v, i, a) => a.indexOf(v) === i).map(x => {
              return {
                  id: x,
                  name: x
              }
          });
          this.set('machineFields.' + subnetsInd + '.options', subnetsOptions);
          if (subnetsOptions.length && subnetsInd > -1) {
              this.set('machineFields.' + subnetsInd + '.show', true);
              this.set('machineFields.' + subnetsInd + '.required', true);
          }
      } else if (subnetsInd && subnetsInd > -1 && network) {
          this.set('machineFields.' + subnetsInd + '.options', []);
          this.set('machineFields.' + subnetsInd + '.show', false);
          this.set('machineFields.' + subnetsInd + '.required', false);
          this.set('machineFields.' + subnetsInd + '.value', undefined);
      }
  },

  _toggleScriptFields: function(scripttype) {
      var inlineInd = this._fieldIndexByName('script');
      var selectInd = this._fieldIndexByName('script_id');

      //if one, exclude the other
      if (scripttype == "inline") {
          if (inlineInd > -1) this.set('machineFields.' + inlineInd + '.excludeFromPayload', false);
          if (selectInd > -1) this.set('machineFields.' + selectInd + '.excludeFromPayload', true);
      } else if (scripttype == "select") {
          if (selectInd > -1) this.set('machineFields.' + selectInd + '.excludeFromPayload', false);
          if (inlineInd > -1) this.set('machineFields.' + inlineInd + '.excludeFromPayload', true);
      }

      // console.log('_toggleScriptFields',this.get('machineFields.'+ inlineInd), this.get('machineFields.'+ selectInd))
  },

  _toggleExistingStorageAccounts: function(newResourceGroup) {
      var createResGroupInd = this._fieldIndexByName('create_resource_group'),
          createStorAccInd = this._fieldIndexByName('create_storage_account'),
          existingResGroupInd = this._fieldIndexByName('ex_storage_account');
      // if user chooses create new resource group, so it must be for storage accounts and networks
      if (newResourceGroup) {
          this.set('machineFields.' + createStorAccInd + '.value', newResourceGroup);
      }
      this.set('machineFields.' + createStorAccInd + '.hidden', newResourceGroup);
      this.set('machineFields.' + existingResGroupInd + '.show', !newResourceGroup);
  },

  _toggleExistingNetworks: function(newResourceGroup) {
      var createResGroupInd = this._fieldIndexByName('create_resource_group'),
          createNetworkInd = this._fieldIndexByName('create_network'),
          existingNetworkInd = this._fieldIndexByName('ex_networks');
      // if user chooses create new resource group, so it must be for storage accounts and networks
      if (newResourceGroup) {
          this.set('machineFields.' + createNetworkInd + '.value', newResourceGroup);
      }
      this.set('machineFields.' + createNetworkInd + '.hidden', newResourceGroup);
      this.set('machineFields.' + existingNetworkInd + '.show', !newResourceGroup);
  },

  _updateStorageAccountValue: function(cloudId) {
      var createFieldIndex = this._fieldIndexByName('create_storage_account');
      var existingFieldIndex = this._fieldIndexByName('ex_storage_account');
      var newFieldIndex = this._fieldIndexByName('new_storage_account');
      var storageAccountFieldIndex = this._fieldIndexByName('storage_account');

      if (this.get('machineFields.'+ createFieldIndex +'.value') == true ) {
          this.set('machineFields.'+ storageAccountFieldIndex +'.value', this.get('machineFields.'+ newFieldIndex +'.value'))
      } else {
          this.set('machineFields.'+ storageAccountFieldIndex +'.value', this.get('machineFields.'+ existingFieldIndex +'.value'))
      }
  },

  _updateStorageAccounts: function(cloudId) {
      var fieldIndex = this._fieldIndexByName('ex_storage_account');
      if (fieldIndex > -1 && this.get('machineFields.' + fieldIndex + '.options') && !this.get('machineFields.' + fieldIndex + '.options').length) {
          this._getStorageAccounts(cloudId, fieldIndex);
      }
  },

  _getStorageAccounts: function(cloudId, index) {
      this.set("storageAccountsFieldIndex",index);
      this.$.getStorageAccounts.headers["Content-Type"] = 'application/json';
      this.$.getStorageAccounts.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getStorageAccounts.url = '/api/v1/clouds/'+ cloudId +'/storage-accounts';
      this.$.getStorageAccounts.generateRequest();
  },

  _handleGetStorageAccountsRequest: function(e) {
      this.set('machineFields.' + this.storageAccountsFieldIndex + '.loader', true);
  },

  _handleGetStorageAccountsResponse: function(e) {
      this.set('machineFields.' + this.storageAccountsFieldIndex + '.alloptions', e.detail.response || []);
      this._filterStorageAccountsOptions();
      this.set('machineFields.' + this.storageAccountsFieldIndex + '.loader', false);
  },

  _filterStorageAccountsOptions: function() {
      var resourceGroupFieldIndex = this._fieldIndexByName('resource_group'),
          locationFieldIndex = this._fieldIndexByName('location'),
          resourceGroup = this.get('machineFields.'+ resourceGroupFieldIndex +'.value'),
          location = this.get('machineFields.'+ locationFieldIndex +'.value');
      var options = [];
      if (resourceGroup && location) {
          options = this.get('machineFields.' + this.storageAccountsFieldIndex + '.alloptions').filter(function(o){
              return o.resource_group == resourceGroup && o.location == location;
          })
      }
      // console.log('_filterStorageAccountsOptions', resourceGroup, location, options.length)
      this.set('machineFields.' + this.storageAccountsFieldIndex + '.value', this.get('machineFields.' + this.storageAccountsFieldIndex + '.defaultValue'));
      this.set('machineFields.' + this.storageAccountsFieldIndex + '.options', options);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _filterStorageAccountsOptions()'}}));
  },

  _filterNetworksOptions: function() {
      var resourceGroupFieldIndex = this._fieldIndexByName('resource_group'),
          locationFieldIndex = this._fieldIndexByName('location'),
          resourceGroup = this.get('machineFields.'+ resourceGroupFieldIndex +'.value'),
          location = this.get('machineFields.'+ locationFieldIndex +'.value'),
          netInd = this._fieldIndexByName('ex_networks');
      var options = [];
      if (resourceGroupFieldIndex > -1 && locationFieldIndex > -1 && resourceGroup && location) {
          options = this._toArray(this.model.clouds[this.selectedCloud].networks).filter(function(n){
              return n.location == location && n.resource_group == resourceGroup;
          })
      }
      // console.log('_filterNetworksOptions', resourceGroup, location, options.length)
      this.set('machineFields.' + netInd + '.value', this.get('machineFields.' + netInd + '.defaultValue'));
      this.set('machineFields.' + netInd + '.options', options);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _filterNetworksOptions()'}}));
  },

  _handleGetStorageAccountsError: function(e) {
      console.error('Got storage accounts error', e);
  },

  _updateResourceGroupValue: function(cloudId) {
      var createFieldIndex = this._fieldIndexByName('create_resource_group');
      var existingFieldIndex = this._fieldIndexByName('ex_resource_group');
      var newFieldIndex = this._fieldIndexByName('new_resource_group');
      var resourceGroupFieldIndex = this._fieldIndexByName('resource_group');

      if (this.get('machineFields.'+ createFieldIndex +'.value') == true ) {
          this.set('machineFields.'+ resourceGroupFieldIndex +'.value', this.get('machineFields.'+ newFieldIndex +'.value'))
      } else {
          this.set('machineFields.'+ resourceGroupFieldIndex +'.value', this.get('machineFields.'+ existingFieldIndex +'.value'))
      }
  },

  _updateSecurityGroups: function(cloudId) {
      var fieldIndex = this._fieldIndexByName('security_group');
      if (fieldIndex > -1 && this.get('machineFields.' + fieldIndex + '.options') && !this.get('machineFields.' + fieldIndex + '.options').length) {
          this._getSecurityGroups(cloudId, fieldIndex);
      }
  },

  _getSecurityGroups: function(cloudId, index) {
      this.set("securityGroupsFieldIndex",index);
      this.$.getSecurityGroups.headers["Content-Type"] = 'application/json';
      this.$.getSecurityGroups.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getSecurityGroups.url = '/api/v1/clouds/'+ cloudId +'/security-groups';
      this.$.getSecurityGroups.generateRequest();
  },

  _handleGetSecurityGroupsRequest: function(e) {
      this.set('machineFields.' + this.securityGroupsFieldIndex + '.loader', true);
  },

  _handleGetSecurityGroupsResponse: function(e) {
      var secGroups=[];
      for (var i=0; i<e.detail.response.length; i++)
          secGroups.push({'title': e.detail.response[i].name, 'val': e.detail.response[i].id});
      this.set('machineFields.' + this.securityGroupsFieldIndex + '.options', secGroups || []);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetSecurityGroupsResponse()'}}));
      this.set('machineFields.' + this.securityGroupsFieldIndex + '.loader', false);
  },

  _handleGetSecurityGroupsError: function(e) {
      console.error('Got security groups error', e);
  },

  _updateResourceGroups: function(cloudId) {
      var fieldIndex = this._fieldIndexByName('ex_resource_group');
      if (fieldIndex > -1 && this.get('machineFields.' + fieldIndex + '.options') && !this.get('machineFields.' + fieldIndex + '.options').length) {
          this._getResourceGroups(cloudId, fieldIndex);
      }
  },

  _getResourceGroups: function(cloudId, index) {
      this.set("resourceGroupsFieldIndex",index);
      this.$.getResourceGroups.headers["Content-Type"] = 'application/json';
      this.$.getResourceGroups.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getResourceGroups.url = '/api/v1/clouds/'+ cloudId +'/resource-groups';
      this.$.getResourceGroups.generateRequest();
  },

  _handleGetResourceGroupsRequest: function(e) {
      this.set('machineFields.' + this.resourceGroupsFieldIndex + '.loader', true);
  },

  _handleGetResourceGroupsResponse: function(e) {
      this.set('machineFields.' + this.resourceGroupsFieldIndex + '.options', e.detail.response || []);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetResourceGroupsResponse()'}}));
      this.set('machineFields.' + this.resourceGroupsFieldIndex + '.loader', false);
  },

  _handleGetResourceGroupsError: function(e) {
      console.error('Got resource groups error', e);
  },

  _updateStorageClasses: function(cloudId,field) {
      if (field && field.options && !field.options.length){
          this._getStorageClasses(cloudId, field);
      }
  },

  _getStorageClasses: function(cloudId, field) {
      this.set("storageClassesField", field)
      this.$.getStorageClasses.headers["Content-Type"] = 'application/json';
      this.$.getStorageClasses.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getStorageClasses.url = '/api/v1/clouds/' + cloudId + '/storage-classes';
      this.$.getStorageClasses.generateRequest();
  },

  _handleGetStorageClassesRequest: function(e) {
     this.storageClassesField.loader = true;
  },

  _handleGetStorageClassesResponse: function(e){
      var options = [];
      e.detail.response.forEach(function(item, ind){
          options.push({title: item, val: item});
      });
      this.storageClassesField.options = options;
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetStorageClassesResponse()'}}));
      this.storageClassesField.loader = false;
  },

  _handleGetStorageClassesError: function(e){
      console.error("Got storage classes error ", e);
  },

  _updateFolders: function(cloudId, field){
      if (field && field.options && !field.options.length){
          this._getFolders(cloudId, field);                
      }
  },

  _getFolders(cloudId, field){
      this.set("foldersField", field)
      this.$.getFolders.headers["Content-Type"] = 'application/json';
      this.$.getFolders.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getFolders.url = '/api/v1/clouds/' + cloudId + '/folders';
      this.$.getFolders.generateRequest();
  },

  _handleGetFoldersRequest: function(e){
      this.foldersField.loader = true;
  },

  _handleGetFoldersResponse: function(e){
      const options = [];
      e.detail.response.forEach(function(item, ind){
          options.push({title: item.name, val: item.id})
      });
      this.foldersField.options = options;
      //this.set('machineFields.'+this.machineFields.indexOf(this.foldersField)+'.options', options);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetFoldersResponse()'}}));
      this.foldersField.loader = false;
      if(options && options.length > 0){
          // this.foldersField.value= this.foldersField.options[0].val;
          this.set('machineFields.'+this.machineFields.indexOf(this.foldersField)+'.show', true);}
  },

  _updateDatastores: function(cloudId, field){
      if (field && field.options && !field.options.length){
          this._getDatastores(cloudId, field);                
      }
  },

  _getDatastores(cloudId, field){
      this.set("datastoresField", field)
      this.$.getDatastores.headers["Content-Type"] = 'application/json';
      this.$.getDatastores.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getDatastores.url = '/api/v1/clouds/' + cloudId + '/datastores';
      this.$.getDatastores.generateRequest();
  },

  _handleGetDatastoresRequest: function(e){
      this.datastoresField.loader = true;
  },

  _handleGetDatastoresResponse: function(e){
      const options = [];
      e.detail.response.forEach(function(item, ind){
          space = Math.floor(item.free_space / (1024*1024*1024))
          name = item.name + "  " + "Free: " + space + " GB"
          options.push({title: name, val: item.id, space: item.free_space})
      });
      this.datastoresField.options = options;
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetFoldersResponse()'}}));
      this.datastoresField.loader = false;
      if (options && options.length > 0) {
          var showDatastores = true;
          if (this.constraints && this.constraints.field) {
              var fieldConstraints;
              if (this.constraints.field.length == undefined) {
                  fieldConstraints = [this.constraints.field];
              } else {
                  fieldConstraints = this.constraints.field;
              }
              var datastoreConstraint = fieldConstraints.find(function(c) { return c.name && c.name == 'datastore'});
              if (datastoreConstraint.show != undefined) {
                  showDatastores = datastoreConstraint.show;
              }
          }
          this.set('machineFields.' + this.machineFields.indexOf(this.datastoresField)+'.show', showDatastores);
      }
  },

  _updateLXDStoragePools: function(cloudId) {
      //var fieldIndex = this._fieldIndexByName('pool_id');
      //console.warn("!!!!!!!!!!!", fieldIndex,this.get('machineFields.' + this.lxdStoragePoolsFieldIndex));
      if (this.lxdStoragePoolsField.options && !this.lxdStoragePoolsField.options.length) {
          this._getLXDStoragePools(cloudId);
      }
  },

  _getLXDStoragePools: function(cloudId) {
      //this.set("lxdStoragePoolsFieldIndex",index);
      this.$.getLXDStoragePools.headers["Content-Type"] = 'application/json';
      this.$.getLXDStoragePools.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getLXDStoragePools.url = '/api/v1/clouds/'+ cloudId +'/storage-pools';
      this.$.getLXDStoragePools.generateRequest();
  },

  _handleGetLXDStoragePoolsRequest: function(e) {
      this.lxdStoragePoolsField.loader = true;
  },

  _handleGetLXDStoragePoolsResponse: function(e) {
      this.lxdStoragePoolsField.options = e.detail.response || [];
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetLXDStoragePoolsResponse()'}}));
      this.lxdStoragePoolsField.loader =  false;
  },

  _handleGetLXDStoragePoolsError: function(e) {
      console.error('Got LXD storage pools error error', e);
  },

  _updateVirtualNetworkFunctions: function(cloudId) {
      var fieldIndex = this._fieldIndexByName('vnfs');
      if (fieldIndex > -1 && this.get('machineFields.' + fieldIndex + '.subfields.0.options') && !this.get('machineFields.' + fieldIndex + '.subfields.0.options').length) {
          this._getVirtualNetworkFunctions(cloudId, fieldIndex);
      }
  },

  _getVirtualNetworkFunctions: function(cloudId, index) {
      this.set("virtualNetworkFunctionFieldIndex",index);
      this.$.getVirtualNetworkFunctions.headers["Content-Type"] = 'application/json';
      this.$.getVirtualNetworkFunctions.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.getVirtualNetworkFunctions.url = '/api/v1/clouds/'+ cloudId +'/vnfs';
      this.$.getVirtualNetworkFunctions.generateRequest();
  },

  _handleGetVirtualNetworkFunctionsRequest: function(e) {
      this.set('machineFields.' + this.virtualNetworkFunctionFieldIndex + '.loader', true);
  },

  _handleGetVirtualNetworkFunctionsResponse: function(e) {
      var vnfs=[];
      for (var i=0; i<e.detail.response.length; i++) {
          if (e.detail.response[i].interface) {
              vnfs.push(e.detail.response[i]);
          }
      }
      this.set('machineFields.' + this.virtualNetworkFunctionFieldIndex + '.vnfs', vnfs || []);

      var locInd = this._fieldIndexByName('location'),
          location = this.get('machineFields.' + locInd + '.value'),
          locationVNFs = location ? vnfs.filter(function(f) {return f.location == location}) : vnfs,
          categorisedVNFs = this._getCategorizedVirtualNetworkFunctions(locationVNFs);

      this.set('machineFields.' + this.virtualNetworkFunctionFieldIndex + '.subfields.0.options',  categorisedVNFs || []);
      this.shadowRoot.querySelector('app-form').dispatchEvent(new CustomEvent('fields-changed', {detail: {file: 'machine-create.html : _handleGetVirtualNetworkFunctionsResponse()'}}));
      this.set('machineFields.' + this.virtualNetworkFunctionFieldIndex + '.loader', false);
  },

  _getCategorizedVirtualNetworkFunctions: function(arr) {
      var categories = [], // store names
          categoriesObjects = {}; // store items
      for  (var i=0; i<arr.length; i++) {
          var catName = 'NUMA ' + arr[i].numa; // Category name
          if (categories.indexOf(catName) <= -1) {
              // store category name and initialise category
              categories.push(catName);
              categoriesObjects[catName] = [];
          }
          var item = {
              'name': arr[i].interface,
              'id': arr[i].pci_bdf,
              'description': arr[i].pci_bdf,
              'location': arr[i].location,
              'tooltip': arr[i].device.vendor + ' ' + arr[i].device.name
          }
          // store item under its category name
          categoriesObjects[catName].push(item);
      }
      // merge category names with items
      var categorisedArray = [];
      categories = categories.reverse();
      for  (var i=0; i<categories.length; i++) {
          var cat = categories[i];
          categorisedArray.push(cat);
          categorisedArray = categorisedArray.concat(categoriesObjects[cat]);
      }
      // return categorisedArray or default array
      return categorisedArray || arr.map(function(x){ return {
          'name': x.interface,
          'id': x.pci_bdf,
          'location': x.location,
          'description': x.pci_bdf + ' - ' + x.device.vendor + ' ' + x.device.name}});
  },

  _handleGetVirtualNetworkFunctionsError: function(e) {
      console.error('Got security groups error', e);
  },

  _subfieldEnabled: function(e) {
      if (e.detail.field.name == 'vnfs')
          this._updateVirtualNetworkFunctions(this.cloud.id)
  },

  _updateNetworkValue: function() {
      var createFieldIndex = this._fieldIndexByName('create_network');
      var existingFieldIndex = this._fieldIndexByName('ex_networks');
      var newFieldIndex = this._fieldIndexByName('new_network');
      var networksFieldIndex = this._fieldIndexByName('networks');
      var networks = [];
      if (this.get('machineFields.'+ createFieldIndex +'.value') == true ) {
          networks.push({name:this.get('machineFields.'+ newFieldIndex +'.value')});
      } else {
          networks.push({id:this.get('machineFields.'+ existingFieldIndex +'.value')});
      }
      this.set('machineFields.'+ networksFieldIndex +'.value', networks)
  },

  _hideElementsforWin: function(value) {
      var scriptInd = this._fieldIndexByName('post_provision_script');
      var taskInd = this._fieldIndexByName('post_provision_scheduler');
      var monitoringInd = this._fieldIndexByName('monitoring');

      if (value && value.toLowerCase().indexOf('win') > -1) {
          if (scriptInd > -1)
              this.set('machineFields.' + scriptInd + '.show', false);
          if (monitoringInd > -1) {
              this.set('machineFields.' + monitoringInd + '.show', false);
              this.set('machineFields.' + monitoringInd + '.value', false);
          }
      } else {
          if (scriptInd > -1)
              this.set('machineFields.' + scriptInd + '.show', true);
          if (monitoringInd > -1) {
              this.set('machineFields.' + monitoringInd + '.show', true);
              this.set('machineFields.' + monitoringInd + '.value', this.get(
                  'machineFields.' + monitoringInd + '.defaultValue'));
          }
      }
  },

  _showPassword: function(value) {
      var passwordInd = this._fieldIndexByName('machine_password');
      var keyInd = this._fieldIndexByName('key');
      if (value && value.toLowerCase().indexOf('win') > -1 && passwordInd > -1) {
          this.set('machineFields.' + passwordInd + '.show', true);
          this.set('machineFields.' + passwordInd + '.required', true);
          if (keyInd > -1) {
              this.set('machineFields.' + keyInd + '.show', false);
              this.set('machineFields.' + keyInd + '.required', false);
          }
      } else {
          if (passwordInd > -1) {
              this.set('machineFields.' + passwordInd + '.show', false);
              this.set('machineFields.' + passwordInd + '.required', false);
          }
          if (keyInd > -1) {
              this.set('machineFields.' + keyInd + '.show', true);
          }
          //if the provider is Docker or onapp, the key should not be required
          if (['docker', 'lxd', 'onapp', 'libvirt', 'vshere', 'gig_g8', 'kubevirt'].indexOf(this.model.clouds[this.selectedCloud].provider) < 0)
              if (keyInd > -1) {
                  this.set('machineFields.' + keyInd + '.required', true);
              }
      }
  },

  _fieldIndexByName: function(name, context) {
      if (!context) {
          return this.machineFields.findIndex(function(f) {
              return f.name == name;
          });
      } else {
          return context.findIndex(function(f) {
              return f.name == name;
          });
      }
  },

  _machineCreateResponse: function(e) {
      // console.log('creation resp', e);
      var response = JSON.parse(e.detail.xhr.response);
      // console.log('logs -- machine create response', response);
      this.dispatchEvent(new CustomEvent('set-job-id', { bubbles: true, composed: true, detail: response }));

      this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
          url: '/machines'
      } }));

      this._resetForm();
  },

  _machineCreateError: function(e) {
      // console.log('creation failed', e)
  },

  _computeProviders: function(model, clouds) {
      // exclude bare metals and not allowed clouds from provider dropdown list
      var that = this;
      return this._toArray(this.model.clouds).filter(function(c) {
          return ["bare_metal"].indexOf(c.provider) == -1 && that.check_perm("create_resources","cloud",c.id);
      });
  },

  addInput: function(e) {
      if (e.detail.fieldname == 'schedule_script_id' || e.detail.fieldname == 'script_id') {
          //set attribute origin
          var origin = window.location.pathname;
          var qParams = {
              'origin': origin
          }
          this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
              url: '/machines',
              params: qParams
          } }));

      } else if (e.detail.fieldname == 'image') {
          this.shadowRoot.querySelector("paper-dialog#addKvmImage").open();
      }
  },

  saveNewImage: function(e) {
      var imaInd = this._fieldIndexByName('image');
      if (imaInd > -1) {
          var opts = this.get('machineFields.' + imaInd + '.options');
          opts.push({
              name: this.newImage,
              id: this.newImage
          });
          // hard reset fields
          this.set('machineFields.' + imaInd + '.options', []);
          this.set('machineFields.' + imaInd + '.options', opts);
          this.set('machineFields.' + imaInd + '.value', this.newImage);
          // console.log(this.get('machineFields.' + imaInd + '.value'));
      }

      this.shadowRoot.querySelector("paper-dialog#addKvmImage").close();
  },

  hotkeys: function(e) {
      // ENTER
      if (e.keyCode === 13 && e.path.indexOf(this.shadowRoot.querySelector("paper-dialog#addKvmImage")) > -1) {
          this.saveNewImage(e);
      }
  },

  updateKeys: function(e) {
      var keyInd = this._fieldIndexByName('key');
      this.async(function() {
          if (keyInd > -1) {
              this.set('machineFields.' + keyInd + '.options', this.model.keysArray);
              if (e.detail.key)
                  this.set('machineFields.' + keyInd + '.value', e.detail.key);
          }
      }.bind(this), 1000);
  },

  _goBack: function() {
      history.back();
  },

  _getInterval: function() {
      var intervalInd = this._fieldIndexByName("schedule_entry_interval"), interval = {};
      if (intervalInd > -1) {
          interval = this.get('machineFields.' + intervalInd + '.value') || 
              this.get('machineFields.' + intervalInd + '.defaultValue');
      }
      return interval;
  },

  _updateFieldsForPacket: function(e) {
      var ipAddresses = this._fieldIndexByName("ip_addresses");
      var ipv4Ind = this._fieldIndexByName("public_ipv4"),
          ipv6Ind = this._fieldIndexByName("public_ipv6");
      var ipv4SubSizeInd = this._fieldIndexByName("public_ipv4_subnet_size"),
          ipv6SubSizeInd = this._fieldIndexByName("public_ipv6_subnet_size"),
          privateIpv4SubSizeInd = this._fieldIndexByName("private_ipv4_subnet_size");
      var ipv4 = ipv4Ind > -1 ? this.get('machineFields.' + ipv4Ind + '.value') : false,
          ipv6 = ipv6Ind > -1 ? this.get('machineFields.' + ipv6Ind + '.value') : false;
      var ipv4SubSize = ipv4SubSizeInd > -1 ? this.get('machineFields.' + ipv4SubSizeInd + '.value') : '',
          ipv6SubSize = ipv6SubSizeInd > -1 ? this.get('machineFields.' + ipv6SubSizeInd + '.value') : '',
          privateIpv4SubSize = privateIpv4SubSizeInd > -1 ? this.get('machineFields.' + privateIpv4SubSizeInd + '.value') : '';
      var formattedIpAddresses = [];
      if (ipv4) {
          var formattedIpv4 = {
              address_family: 4, public: ipv4
          }
          if (ipv4SubSize.length) {
              formattedIpv4.cidr = ipv4SubSize;
          }
          formattedIpAddresses.push(formattedIpv4);
      }
      if (ipv6) {
          var formattedIpv6 = {
              address_family: 6, public: ipv6
          }
          if (ipv6SubSize.length) {
              formattedIpv6.cidr = ipv6SubSize;
          }
          formattedIpAddresses.push(formattedIpv6);
      }
      var formattedPrivateIpv4 = {
          address_family: 4, public: false
      }
      if (privateIpv4SubSize) {
          formattedPrivateIpv4.cidr = privateIpv4SubSize;
      }
      formattedIpAddresses.push(formattedPrivateIpv4);

      this.set('machineFields.'+ ipAddresses + '.value', formattedIpAddresses)
  },

  _processCrotab: function(entry) {
      var construct = {};
      if (entry) {
          var chunchs = entry.split(" ");
          // fill in missin
          for (var i = 0; i < 5; i++) {
              if (!chunchs[i])
                  chunchs[i] = "*"
          }
          var diff = moment().utcOffset() / 60;
          for (var i = 0; i < 5; i++) {
              if (!chunchs[i])
                  chunchs[i] = "*"
          }
          var construct = {
              'minute': chunchs[0],
              'hour': chunchs[1],
              'day_of_month': chunchs[2],
              'month_of_year': chunchs[3],
              'day_of_week': chunchs[4],
          };
          if (construct.hour != "*" && parseInt(chunchs[1]) && diff) {
              construct.hour = ((parseInt(chunchs[1]) - diff) % 24).toString();
          }
      }
      return construct;
  },

  updateScripts: function(e) {
      var scheduleScriptInd = this._fieldIndexByName("schedule_script_id");
      this.async(function() {
          if (scheduleScriptInd > -1) {
              this.set('machineFields.' + scheduleScriptInd + '.options', this.model.scriptsArray || []);
              this.set('machineFields.' + scheduleScriptInd + '.value', e.detail.script);
          }
      }.bind(this), 1000);
  },

  formatPayload: function(e) {
      var hostnameInd = this._fieldIndexByName("hostname"),
          composedHostname = '',
          hostname =  this.get('machineFields.' + hostnameInd + '.value'),
          vnfsInd = this._fieldIndexByName("vnfs"),
          vnfs = this.get('machineFields.' + vnfsInd + '.value');
      if (hostname) {
          if (hostname.record_name && hostname.dns_zone) {
              var domainName = this.model.zones[hostname.dns_zone].zone_id;
              composedHostname = hostname.record_name+'.'+domainName+'.';
          }
          this.set('machineFields.' + hostnameInd + '.value',composedHostname);
      }
      if (vnfs && vnfs.vnfs) {
          this.set('machineFields.' + vnfsInd + '.value', vnfs.vnfs);
      }
  },

  _hasProviders: function(providers) {
      if (providers && providers.length)
          return true;
  },

  _toArray: function(x, z) {
      if (x) {
          return Object.keys(x).map(y => x[y])
      }
      return [];
  },

  _cleanCopy: function(value, property) {
      var newValue;
      if (value == null)
          return null;
      if (typeof value == "string") {
          newValue = "";
          newValue = value.slice(0);
      } else if (typeof value == "object") {
          if (Array.isArray(value)) {
              newValue = [];
              for (var i = 0; i < value.length; i++) {
                  newValue[i] = this._cleanCopy(value[i], property);
              }
          } else {
              newValue = {};
              for (var q in value) {
                  newValue[q] = this._cleanCopy(value[q], q);
              }
          }
      } else {
          newValue = value;
      }
      return newValue;
  }
});
