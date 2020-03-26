var NETWORK_CREATE_FIELDS = []

// OPENSTACK
NETWORK_CREATE_FIELDS.push({
    provider: 'openstack',
    fields: [{
        name: "name",
        label: "Name *",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        errorMessage: "Please enter network's name",
        show: true,
        required: true,
        excludeFromPayload: true,
        inPayloadGroup: 'network'
    }, {
        name: "admin_state_up",
        label: "Admin State *",
        type: "dropdown",
        value: true,
        defaultValue: true,
        placeholder: "",
        show: true,
        required: true,
        excludeFromPayload: true,
        options: [{
            title: "Up",
            val: true
        }, {
            title: "Down",
            val: false
        }],
        inPayloadGroup: 'network'
    }, {
        name: "createSubnet",
        label: "Create Subnet",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: true,
        required: false,
        excludeFromPayload: true
    }, {
        name: "subnet_name",
        label: "Subnet Name",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "cidr",
        label: "Subnet Address (CIDR)",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "ip_version",
        label: "IP Version",
        type: "dropdown",
        value: 4,
        defaultValue: 4,
        placeholder: "",
        show: false,
        required: false,
        options: [{
            title: "IPv4",
            val: 4
        }, {
            title: "IPv6",
            val: 6
        }],
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "gateway_ip",
        label: "Gateway IP",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: true,
        required: false,
        disabled: false,
        showIf: {
            fieldName: "disableGateway",
            fieldValues: [false]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "disableGateway",
        label: "Disable Gateway",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        excludeFromPayload: true
    }, {
        name: "enable_dhcp",
        label: "Enable DHCP",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "allocation_pools",
        label: "Allocation Pools",
        type: "textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        helptext: "In the form: start CIDR - end CIDR, a range per line.",
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }]
});

// GCE
NETWORK_CREATE_FIELDS.push({
    provider: 'gce',
    fields: [{
        name: "name",
        label: "Name *",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        errorMessage: "Please enter network's name",
        show: true,
        required: true,
        excludeFromPayload: true,
        inPayloadGroup: 'network'
    }, {
        name: "mode",
        label: "Subnet Type",
        type: "dropdown",
        value: 'auto',
        defaultValue: 'auto',
        show: true,
        required: true,
        helptext: 'Subnets let you create your own private cloud topology within Google Cloud. Click Automatic to create a subnet in each region, or click Custom to manually define the subnets',
        options: [
            {
                title: 'Automatic',
                val: 'auto'
            },
            {
                title: 'Custom',
                val: 'custom'
            }
        ],
        inPayloadGroup: 'network'
    }, {
        name: "name",
        label: "Subnet Name",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "mode",
            fieldValues: ['custom']
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "cidr",
        label: "Subnet CIDR",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "mode",
            fieldValues: ['custom']
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "region",
        label: "Region *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: [],
        showIf: {
            fieldName: "mode",
            fieldValues: ['custom']
        },
        inPayloadGroup: 'subnet'
    }]
});

// GIG G8
NETWORK_CREATE_FIELDS.push({
    provider: 'gig_g8',
    fields: [{
        name: "name",
        label: "Name *",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        errorMessage: "Please enter network's name",
        show: true,
        required: true,
        inPayloadGroup: 'network'
    },{
        name: "network_type",
        label: "Type",
        type: "dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        options: [{
            title: 'Virtual Gateway', 
            val: 'vgw'
        },{
            title: 'Router OS',
            val:'routeros'
        }],
        inPayloadGroup: 'network'
    }]
});

// EC2
NETWORK_CREATE_FIELDS.push({
    provider: 'ec2',
    fields: [{
        name: "name",
        label: "Name *",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        errorMessage: "Please enter network's name",
        show: true,
        required: true,
        inPayloadGroup: 'network'
    }, {
        name: "cidr",
        label: "Network CIDR",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: true,
        required: true,
        inPayloadGroup: 'network'
    }, {
        name: "createSubnet",
        label: "Create Subnet",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: true,
        required: false,
        excludeFromPayload: true
    }, {
        name: "name",
        label: "Subnet Name",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "cidr",
        label: "Subnet CIDR",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }, {
        name: "availability_zone",
        label: "Availability Zone *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        options: [],
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        inPayloadGroup: 'subnet'
    }]
});

// LXD
NETWORK_CREATE_FIELDS.push({
    provider: 'lxd',
    fields: [{
        name: "name",
        label: "Name *",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        errorMessage: "Please enter network's name",
        show: true,
        required: true,
        inPayloadGroup: 'network'
    }, {
        name: "cidr",
        label: "Network CIDR",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: true,
        required: true,
        inPayloadGroup: 'network'
    }]
});