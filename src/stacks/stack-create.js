import '../../../../@polymer/paper-material/paper-material.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-progress/paper-progress.js';
import '../helpers/stack-forms-behavior.js';
import '../app-form/app-form.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
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
});
Polymer({
  _template: html`
        <style include="shared-styles forms single-page">
            paper-material {
                display: block;
                padding: 24px;
            }

            #content {
                max-width: 900px;
            }

            paper-progress {
                position: absolute;
                bottom: 87px;
                width: 100%;
                left: 0;
                right: 0;
            }

            :host>::slotted(paper-input-container) {
                padding-top: 16px;
                padding-bottom: 16px;
            }

            paper-item.lead {
                font-size: 2em;
            }

            paper-toggle-button[disabled]::slotted() {
                color: rgba(0, 0, 0, 0.32);
            }

            paper-toggle-button::slotted(paper-input-container input) {
                color: color: rgba(0, 0, 0, 0.54);
            }

            .spacer {
                display: block;
                height: 24px;
                width: 100%;
            }

            .bottom-actions {
                padding-left: 20px;
            }

            *:not(paper-button)[disabled] {
                display: none;
            }

            paper-radio-group {
                padding: 16px 8px;
            }

            @media (max-width: 800px) {
                .desc {
                    display: none;
                }
            }

            .desc {
                width: 250px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .single-head {
                @apply --stack-page-head-mixin
            }
        </style>
        <div id="content">
            <paper-material class="single-head layout horizontal">
                <span class="icon">
                    <iron-icon icon="[[section.icon]]"></iron-icon>
                </span>
                <div class="title flex">
                    <h2>
                        Create Stack
                    </h2>
                    <div class="subtitle">
                        from [[template.name]]
                        <a href\$="/templates/[[template.id]]">
                            <iron-icon icon="icons:link"></iron-icon>
                        </a>
                        <span class="desc" hidden\$="[[!template.description]]">([[template.description]])</span>
                    </div>
                </div>
            </paper-material>
            <paper-material hidden\$="[[template.id]]">
                <p>Template is missing</p>
            </paper-material>
            <paper-material hidden\$="[[!template.id]]">
                <app-form id="create_stack" fields="{{fields}}" templateid="{{template.id}}" workflow="install" url="/api/v1/stacks" on-request="_handleRequest" on-response="_handleResponse" on-error="_handleError" btncontent="create stack" format-payload=""></app-form>
            </paper-material>
        </div>
`,

  is: 'stack-create',

  behaviors: [
      stackFormsBehavior
  ],

  properties: {
      model: {
          type: Object
      },
      section: {
          type: Object
      },
      stack: {
          type: Object
      },
      form: {
          type: Object,
          value: {}
      },
      params: {
          type: Object
      },
      template: {
          type: Object,
          computed: '_fromTemplate(params, model.templates.*)'
      },
      fields: {
          type: Array,
          value: [],
          notify: true
      },
      keys: {
          type: Array
      },
      clouds: {
          type: Array
      },
      images: {
          type: Array
      },
      uri: {
          type: String
      },
      yaml_inputs: {
          type: String,
          notify: true
      }
  },

  observers: [
      '_computeFields(template, template.inputs, template.inputs.*, model.templatesArray.*, model.cloudsArray.*, model.keys.*, params)'
  ],

  listeners: {
      'change': '_updateFields',
      'iron-select': '_updateFields',
      'update-keys': 'updateKeys',
      'format-payload': '_updateFields'
  },

  ready: function () {},

  _fromTemplate: function (params, templates) {
      if (params.template && this.model.templates) {
          var yaml_inputs = '';
          this.model.templates[params.template].inputs.forEach(function (inp) {
              yaml_inputs += inp.name + ': ';
              var val = inp.value = !undefined ? inp.value : inp.defaultValue || inp.default;
              if (inp.value == 'custom')
                  val = JSON.stringify(inp.customValue);
              yaml_inputs += val + '\n';
          }, this);
          this.set('yaml_inputs', yaml_inputs);
          // pass values into form's stackinputs default value
          var ind;
          var stackinputsField = this.fields.find(function (f, index) {
              ind = index;
              return f.name == "stackinputs";
          });
          this.set('fields.' + ind + '.defaultValue', this.yaml_inputs);
          // console.log('template is redefined');

          var yaml_or_form = 'form';
          var template = this.model.templates[params.template];
          // console.log('Computing Fields started');

          if (this.fields) {
              var yf = this.fields.find(function (f) {
                  return f.name == 'yaml_or_form'
              });
              if (yf && yf.value)
                  yaml_or_form = yf.value;
              else
                  yaml_or_form = 'form';
          }

          var ret = [{
              name: "name",
              label: "Stack Name",
              type: "text",
              value: "",
              isLead: true,
              defaultValue: "",
              placeholder: "",
              errorMessage: "Please enter a name for the stack",
              show: true,
              required: true
          }, {
              name: "description",
              label: "Stack Description",
              type: "textarea",
              value: "",
              defaultValue: "",
              placeholder: "",
              helptext: "Choose a usefull description for your stack",
              errorMessage: "Please enter stacks's description",
              show: true,
              required: false
          }, {
              name: "yaml_or_form",
              label: "YAML or form",
              type: "radio",
              value: yaml_or_form,
              defaultValue: "form",
              helptext: "Choose the way you want to insert inputs",
              errorMessage: "Choose an input format",
              show: true,
              required: true,
              options: [{
                  title: "Form",
                  val: "form"
              }, {
                  title: "YAML",
                  val: "yaml"
              }]
          }, {
              name: "stackinputs",
              label: "Stack Inputs YAML",
              type: "textarea",
              value: this.yaml_inputs,
              defaultValue: this.yaml_inputs,
              placeholder: '',
              helptext: "Enter the stack inputs in yaml format",
              errorMessage: "Please enter stacks's inputs",
              show: true,
              required: true,
              showIf: {
                  fieldName: "yaml_or_form",
                  fieldValues: ["yaml"]
              }
          }];

          if (template && template.inputs) {
              template.inputs.forEach(function (inp) {
                  inp['showIf'] = {
                      fieldName: "yaml_or_form",
                      fieldValues: ["form"]
                  }
                  inp['label'] = inp.name.replace(/_/g, ' ');
                  inp['defaultValue'] = inp.default;
                  inp['value'] = inp['value'] || inp.default;

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
                      inp.options = []; //this.model.keysArray;
                  }

                  // make cloud dropdown
                  if (inp.name.startsWith('mist_cloud')) {
                      inp.label = 'cloud';
                      inp.type = 'mist_dropdown';
                      inp.helptext = 'Select cloud';
                      inp.options = []; //this.model.cloudsArray;

                      inp.options.forEach(function (o) {
                          o.disabled = !o.enabled;
                      });
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

                  // make image & location dependent on cloud
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

                  // make size dependent on cloud
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
                      inp.label = inp.name.split("mist_machine_")[1] || "";
                      inp.required = true;
                      if (inp.name.endsWith("list")) {
                          inp.multi = true;
                      } else {
                          inp.multi = false;
                      }
                      inp.quantity = 1;
                      inp.valid = false;
                      inp.show = true;
                      inp.type = 'mist_machine';
                      inp.cloud = '';
                      inp.machine = '';
                      inp.image = '';
                      inp.size = '';
                      inp.location = '';
                      inp.key = '';
                      inp.networks = [];
                      inp.value = {};
                      inp.helptext = inp.description;
                      if (this.model){
                          inp.clouds = this.model.clouds;
                          inp.keys = this.model.keys;
                      }
                  }

                  // hide mist api credential inputs
                  if (["mist_token", "script_path", "mist_uri", "mist_username", "mist_password"].indexOf(inp.name) > -1) {
                      inp.hidden = true;
                      inp.show = false;
                      inp.required = false;
                  }

                  ret.push(inp);
              }, this);
          }

          ret.push({
              name: "deploy",
              label: "Deploy Now",
              type: "toggle",
              value: true,
              defaultValue: true,
              placeholder: true,
              helptext: "Enable this option to deploy your stack now",
              errorMessage: "",
              show: true,
              required: false
          });
          this.set('fields', ret);

          return this.model.templates[params.template];
      } else {
          return {
              name: "Template is missing"
          }
          console.log('template is missing');
      }
  },

  _computeFields: function (template, templateInps, templateInputs, modelTemplates, clouds, keys,
      params) {
      this.fields.forEach(function (inp, index) {
          if (inp.name.startsWith('mist_key')) {
              this.set('fields.' + index + '.options', this.model.keysArray);
          }

          if (inp.name.startsWith('mist_cloud')) {
              this.set('fields.' + index + '.options', this.model.cloudsArray);
              this.fields[index].options.forEach(function (o) {
                  o.disabled = !o.enabled;
              })
          }

          if (inp.name.startsWith('mist_tags')) {
              this.set('fields.' + index + '.value', []);
          }

          if (inp.name.startsWith('mist_')) {
              this.set('fields.' + index + '.label', this.get('fields.' + index + '.label').replace('mist ', ''));
          }

          if (inp.options && inp.options.length == 1) {
              if (inp.type == "dropdown")
                  this.set('fields.' + index + '.value', inp.options[0].val);
              else
                  this.set('fields.' + index + '.value', inp.options[0].id);
          }

          if (inp.name.startsWith("mist_machine")) {
              inp.keys = this.model.keys;
          }
      }, this);

  },

  _updateFields: function (event) {
      // if a cloud changed
      if (this.fields && event && event.path.map(function(i){return i.id;}).join(',').indexOf("mist_cloud") > -1) {
          var fieldName = event.path.find(function(f){
                  return f.id && f.id.indexOf('mist_cloud') > -1
              }),
              fieldIndex = fieldName && this.fieldIndexByName(fieldName.id.replace('app-form-create_stack-','')),
              field = fieldIndex > -1 && this.fields[fieldIndex];

          if (field && field.name.startsWith('mist_cloud') && this.model.clouds[field.value]) {
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
          }
      }
      var e = dom(event);
      var changeInYaml = e && e.path && e.path.indexOf(document.querySelector("paper-textarea#app-form-create_stack-stackinputs")) > -1;
      if (changeInYaml) {
          var yaml = document.querySelector("paper-textarea#app-form-create_stack-stackinputs").value;
          var yaml_array = yaml.split('\n');
          var inputs = [];
          yaml_array.forEach(function (line) {
              var name = line.split(':')[0].trim();
              var value = line.split(':')[1];
              if (value)
                  value = value.trim();
              inputs[name] = value;
          });

          this.fields.forEach(function (f, index) {
              if (inputs[f.name])
                  this.set('fields.' + index + '.value', inputs[f.name])
          }, this)
      } else {
          var cloud = this.fields.find(function (f) {
              return f.name.startsWith("mist_cloud");
          });
          var yaml_inputs = '';
          this.fields.forEach(function (inp, index) {
              var fieldCloud, // cloud field Object
                  xid, // resource batch index type string ex _1
                  cloudId; // mist cloud id

              if (['name', 'description', 'yaml_or_form', 'stackinputs', 'deploy'].indexOf(
                      inp.name) == -1) {
                  yaml_inputs += inp.name + ': ';
                  var preformatedValue = inp.preformatPayloadValue ? inp.preformatPayloadValue.apply(inp.value) : inp.value;
                  var val = preformatedValue ? JSON.stringify(preformatedValue) : inp.defaultValue;
                  if (inp.value == 'custom') {
                      val = JSON.stringify(inp.customValue);
                  }
                  yaml_inputs += val + '\n';
              }

              // mist-machine contains its own cloud value
              if (inp.name.startsWith("mist_machine")) {
                  if (this.model) {
                      inp.clouds = this.model.clouds;
                      inp.keys = this.model.keys;
                  }
              }
              if (cloud && cloud.value) {
                  if (inp.name.startsWith("mist_cloud")) {
                      xid = inp.name.split("mist_cloud")[0];
                      cloudId = inp.value;
                      if (cloudId && this.fieldIndexByName('mist_size' + xid) > -1) {
                          if (["onapp", "vsphere", "libvirt", "gce"].indexOf(this.model.clouds[
                                  cloudId].provider) > -1) {
                              this.set('fields.' + this.fieldIndexByName('mist_size' +
                                  xid) + '.custom', true);
                              this.set('fields.' + this.fieldIndexByName('mist_size' +
                                  xid) + '.customValue', {});
                          } else {
                              this.set('fields.' + this.fieldIndexByName('mist_size' +
                                  xid) + '.custom', false);
                              this.set('fields.' + this.fieldIndexByName('mist_size' +
                                  xid) + '.customValue', false);
                          }
                      }
                      if (!inp.show) {
                          inp.excludeFromPayload = true;
                      } else {
                          inp.excludeFromPayload = false;
                      }
                  }
                  if (inp.name.startsWith("mist_location")) {
                      xid = inp.name.split("mist_location")[0];
                      fieldCloud = this.fields.find(function (f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      cloudId = fieldCloud.value;
                      if (cloudId)
                          inp['options'] = Object.values(this.model.clouds[cloudId].locations);
                  }
                  if (inp.name.startsWith("mist_image")) {
                      xid = inp.name.split("mist_image")[0];
                      fieldCloud = this.fields.find(function (f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      cloudId = fieldCloud.value;
                      if (this.model && cloudId)
                          inp['options'] = this.model.clouds[cloudId].imagesArray;
                  }
                  if (inp.name.startsWith("mist_networks")) {
                      xid = inp.name.split("mist_networks")[0];
                      fieldCloud = this.fields.find(function (f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      cloudId = fieldCloud.value;
                      if (this.model && cloudId)
                          inp['options'] = Object.values(this.model.clouds[cloudId].networks) || [];
                      else
                          inp['options'] = [];
                  }
                  if (inp.name.startsWith("mist_size")) {
                      xid = inp.name.split("mist_size")[0];
                      fieldCloud = this.fields.find(function (f) {
                          return f.name.startsWith("mist_cloud" + xid);
                      }) || cloud;
                      cloudId = fieldCloud.value;
                      if (cloudId) {
                          inp['options'] = this.model.clouds[cloudId].sizesArray ? this.model.clouds[cloudId].sizesArray : [];
                          if (["onapp", "vsphere", "libvirt"].indexOf(this.model.clouds[cloudId].provider) > -1) {
                              var provider = this.model.clouds[cloudId].provider,
                                  fields = MACHINE_CREATE_FIELDS.find(function(p) {return p.provider == provider}).fields;
                              inp['custom'] = true;
                              inp["value"] = "custom";
                              inp["customSizeFields"] = fields.find(function(f){return f.type == "mist_size"}).customSizeFields;
                          }
                          else
                              inp['custom'] = false;
                      }
                  }

                  if (inp.options && inp.options.length == 1) {
                      if (inp.type == "dropdown") {
                          this.set('fields.' + index + '.value', f.options[0]
                              .val);
                      }
                      else {
                          this.set('fields.' + index + '.value', f.options[0]
                              .id);
                      }
                  }
              }
          }.bind(this));

          this.set('yaml_inputs', yaml_inputs);

          // pass values into form's stackinputs value
          var ind;
          var stackinputsField = this.fields.find(function (f, index) {
              ind = index;
              return f.name == "stackinputs";
          });

          this.set('fields.' + ind + '.value', this.yaml_inputs);
      }
  },

  fieldIndexByName: function (name) {
      var index = this.fields.findIndex(function (f) {
          return f.name == name;
      });
      return index;
  },

  updateKeys: function (e) {
      // console.log('_updateKeys', e);
      this.async(function () {
          // console.log(this.template);
          if (this.fields)
              this.fields.forEach(function (f, index) {
                  // make key dropdown && select newly created key
                  if (f.name.startsWith('mist_key')) {
                      f.options = this.model.keysArray;
                      this.set('fields.' + index + '.value', e.detail.key);
                  }
              }, this);
      }.bind(this), 1000);
  },

  _handleRequest: function (e) {

  },

  _handleResponse: function (e) {
      // console.log('create stack ', e);
      var response = YAML.parse(e.detail.xhr.response);
      var sid = response.id;
      this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
          url: '/stacks/' + sid
      } }));

      this.debounce('resetForm', function () {
          this._resetForm();
      }, 500);
  },

  _handleError: function (e) {

  },

  _resetForm: function (e) {
      // Reset form
      for (var attr in this.form) {
          this.set('form.' + attr, '');
      }
      // Reset Form Fields
      this.fields.forEach(function (el, index) {
          if (el.showIf) {
              this.set('fields.' + index + '.show', false);
          }
          // Reset Form Fields Validation
          this._resetField(el, index);
      }, this);
  },

  _computeProviderLogo: function (provider) {
      return 'assets/providers/provider-' + provider + '.png';
  },

  _resetField: function (el, index) {
      // this.set('fields.' + index + '.value', el.defaultValue);
      // var input = this.shadowRoot.querySelector('#' + el.name);
      // if (input) {
      //     input.invalid = false;
      // }
  }
});
