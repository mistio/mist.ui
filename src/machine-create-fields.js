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
    }],
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

// NEPHOSCALE
MACHINE_CREATE_FIELDS.push({
    provider: 'nephoscale',
    fields: [],
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

// add common fields
MACHINE_CREATE_FIELDS.forEach(function(p) {
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
        name: 'image',
        label: 'Image *',
        type: 'mist_dropdown_searchable',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
        search: '',
    }, {
        name: 'location',
        label: 'Location *',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
    });

    // mist_size for kvm libvirt
    if (['libvirt'].indexOf(p.provider) != -1) {
        p.fields.splice(2, 0, {
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
            }],
        });
    } else if (['onapp'].indexOf(p.provider) != -1) {
        p.fields.splice(2, 0, {
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
    } else if (['vsphere'].indexOf(p.provider) != -1) {
        p.fields.splice(2, 0, {
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
            }],
        });
    } else { // mist_dropdown for all others
        p.fields.splice(2, 0, {
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

    p.fields.push({
        name: 'key',
        label: 'Key *',
        type: 'ssh_key',
        value: '',
        defaultValue: '',
        show: true,
        required: true,
        options: [],
        search: '',
    });

    // add cloud init field only to providers that accept and we support
    if (['azure', 'azure_arm', 'digitalocean', 'ec2', 'gce', 'packet', 'rackspace', 'libvirt', 'openstack', 'aliyun_ecs', 'vultr', 'softlayer'].indexOf(p.provider) != -1) {
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

    if (['openstack', 'packet', 'azure_arm','gce', 'digitalocean', 'ec2', 'aliyun_ecs'].indexOf(p.provider) > -1) {
        var allowedVolumes = ['gce','azure_arm'].indexOf(p.provider) > -1 ? 3 : 1; 
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
        subfields: [
            {
                name: 'action',
                type: 'dropdown',
                class: 'bind-both',
                value: 'stop',
                defaultValue: 'stop',
                helptext: '',
                show: true,
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
                defaultValue: '',
                valueType: 'date',
                valueDefaultSpan: 1,
                valueDefaultUnit: 'days',
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
                valueDefaultSpan: 1,
                valueDefaultUnit: 'hours',
                class: 'bind-top',
                helptext: '',
                show: true,
                required: false,
                prefixText: 'Notify me ',
                suffixText: 'before',
                secondary: true,
                optional: true,
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
        name: 'schedule_entry_interval_every',
        label: 'Interval',
        type: 'text',
        value: '10',
        defaultValue: '',
        excludeFromPayload: true,
        class: 'bind-both background',
        show: false,
        required: true,
        helptext: 'Example, every 10 minutes',
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval'],
        },
    }, {
        name: 'schedule_entry_interval_period',
        type: 'radio',
        value: 'minutes',
        defaultValue: 'minutes',
        excludeFromPayload: true,
        class: 'bind-top background',
        show: false,
        required: false,
        showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval'],
        },
        options: [{ // days, hours, minutes, seconds, microseconds
            title: 'days',
            val: 'days',
        }, {
            title: 'hours',
            val: 'hours',
        }, {
            title: 'mins',
            val: 'minutes',
        }],
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
    });

    if (['onapp'].indexOf(p.provider) == -1) {
        p.fields.push({
                name: 'hostname',
                label: 'Create DNS record',
                type: 'fieldgroup',
                value: {},
                defaultValue: {},
                defaultToggleValue: false,
                helptext: 'Create an A record for this machine on an existing DNS zone.',
                show: true,
                required: false,
                optional: true,
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
                        display: 'zone_id',
                        show: true,
                        class: 'inline-block pad-l-0 pad-t',
                        required: true,
                        options: []
                    }
                ]
            }
        );
    }

    p.fields.push({
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

    if (p.provider == 'onapp') {
        let locationField = p.fields.find(function(f) {
            return f.name == 'location';
        });
        let index = p.fields.indexOf(locationField);
        p.fields.splice(1, 0, p.fields.splice(index, 1)[0]);
    }
});