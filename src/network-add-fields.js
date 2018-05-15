var NETWORK_ADD_FIELDS = []

// OPENSTACK
NETWORK_ADD_FIELDS.push({
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
        excludeFromPayload: true
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
        }]
    }, {
        name: "createSubnet",
        label: "Create Subnet",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: true,
        required: false
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
        }
    }, {
        name: "subnet_address",
        label: "Network Address (CIDR)",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        }
    }, {
        name: "subnet_ipv",
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
        }
    }, {
        name: "subnet_gatewayIp",
        label: "Gateway IP",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: true,
        required: false,
        disabled: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        }
    }, {
        name: "subnet_disableGateway",
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
        }
    }, {
        name: "subnet_enableDHCP",
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
        }
    }, {
        name: "subnet_allocationPools",
        label: "Allocation Pools",
        type: "textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        }
    }]
});

// GCE
NETWORK_ADD_FIELDS.push({
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
        excludeFromPayload: true
    }, {
        name: "createSubnet",
        label: "Create Subnet",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: true,
        required: false
    }, {
        name: "subnet_type",
        label: "Subnet Type",
        type: "dropdown",
        value: 'auto',
        defaultValue: 'auto',
        show: true,
        required: true,
        helptext: 'Subnets let you create your own private cloud topology within Google Cloud. Click Automatic to create a subnet in each region, or click Custom to manually define the subnets',
        showIf: {
            fieldName: "createSubnet",
            fieldValues: [true]
        },
        options: [
            {
                title: 'Automatic',
                val: 'auto'
            },
            {
                title: 'Custom',
                val: 'custom'
            }
        ]
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
            fieldName: "subnet_type",
            fieldValues: ['custom']
        }
    }, {
        name: "subnet_cidr",
        label: "Subnet CIDR",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "subnet_type",
            fieldValues: ['custom']
        }
    }, {
        name: "location",
        label: "Region *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: [],
        showIf: {
            fieldName: "subnet_type",
            fieldValues: ['custom']
        }
    }]
});


// EC2
NETWORK_ADD_FIELDS.push({
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
        excludeFromPayload: true
    }, {
        name: "cidr",
        label: "Network CIDR",
        type: "ip_textarea",
        value: "",
        defaultValue: "",
        placeholder: "",
        show: true,
        required: true
    }, {
        name: "createSubnet",
        label: "Create Subnet",
        type: "toggle",
        value: false,
        defaultValue: false,
        placeholder: "",
        show: true,
        required: false
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
        }
    }, {
        name: "subnet_cidr",
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
        }
    }, {
        name: "location",
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
        }
    }]
});