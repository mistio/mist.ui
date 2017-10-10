var MACHINE_CREATE_FIELDS = []

// AZURE
MACHINE_CREATE_FIELDS.push({
    provider: 'azure',
    fields: [{
        name: "azure_port_bindings",
        label: "Azure Port Bindings",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    }, {
        name: "azure_port_bindings",
        label: "Azure Port Bindings",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: 'e.g. http tcp 80:80, smtp tcp 25:25, https tcp 443:443'
    }]
});


// AZURE ARM
MACHINE_CREATE_FIELDS.push({
    provider: 'azure_arm',
    fields: [{
        name: "create_resource_group",
        label: "Create new resource group",
        type: "toggle",
        value: false,
        defaultValue: false,
        helptext: "Create the machine in a new resource group",
        show: true,
        required: false
    }, {
        name: "ex_resource_group",
        label: "Resource Group",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    }, {
        name: "new_resource_group",
        label: "Resource Group name",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    }, {
        name: "create_storage_account",
        label: "Create new storage account",
        type: "toggle",
        value: false,
        defaultValue: false,
        helptext: "Create the machine in a new storage account",
        show: true,
        required: false
    }, {
        name: "new_storage_account",
        label: "Storage Account name",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    }, {
        name: "ex_storage_account",
        label: "Storage Account",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    }, {
        name: "networks",
        label: "Networks *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        options: []
    }, {
        name: "machine_password",
        label: "Machine Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: "Windows machine password is required."
    }]
});


// DIGITALOCEAN
MACHINE_CREATE_FIELDS.push({
    provider: 'digitalocean',
    fields: []
});

// DOCKER
MACHINE_CREATE_FIELDS.push({
    provider: 'docker',
    fields: [{
        name: "docker_env",
        label: "Docker Env",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "",
    }, {
        name: "docker_command",
        label: "Docker Command",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: ""
    }, {
        name: "docker_port_bindings",
        label: "Docker Port Bindings",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    }, {
        name: "docker_exposed_ports",
        label: "Docker Exposed Ports",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    }, {
        name: "ports",
        label: "Ports",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: 'e.g. 80:80'
    }]
});

// AWS
MACHINE_CREATE_FIELDS.push({
    provider: 'ec2',
    fields: []
});

// GCE
MACHINE_CREATE_FIELDS.push({
    provider: 'gce',
    fields: [{
        name: "image_extra",
        label: "Image extra",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false
    }, {
        name: "location_name",
        label: "Location name",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false
    }]
});

// HOSTVIRTUAL
MACHINE_CREATE_FIELDS.push({
    provider: 'hostvirtual',
    fields: []
});

// KVM
MACHINE_CREATE_FIELDS.push({
    provider: 'libvirt',
    fields: [{
        name: "libvirt_disk_path",
        type: "text",
        label: "Path to create VM's disk",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "Where the VM disk file will be created",
        helpHref: "http://docs.mist.io/article/99-managing-kvm-with-mist-io"
    }, {
        name: "libvirt_disk_size",
        type: "text",
        label: "Disc size (GB)",
        value: "4",
        defaultValue: "4",
        show: true,
        required: false,
        helptext: "The VM's size will be the size of the image plus the number in GBs provided here",
        helpHref: "http://docs.mist.io/article/99-managing-kvm-with-mist-io"
    }]
});

// LINODE
MACHINE_CREATE_FIELDS.push({
    provider: 'linode',
    fields: [{
        name: "image_extra",
        label: "Image extra",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false
    }, {
        name: "location_name",
        label: "Location name",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false
    }]
});

// NEPHOSCALE
MACHINE_CREATE_FIELDS.push({
    provider: 'nephoscale',
    fields: []
});

// OPENSTACK
MACHINE_CREATE_FIELDS.push({
    provider: 'openstack',
    fields: [{
        name: "networks",
        label: "Networks *",
        type: "checkboxes",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    }, {
        name: "associate_floating_ip",
        label: "Associate Floating IP",
        type: "toggle",
        value: "true",
        defaultValue: "true",
        show: false,
        required: false,
        showIf: {
            fieldName: "networks",
            fieldExists: true
        }
    }]
});

// PACKET
MACHINE_CREATE_FIELDS.push({
    provider: 'packet',
    fields: []
});

// RACKSPACE
MACHINE_CREATE_FIELDS.push({
    provider: 'rackspace',
    fields: []
});

// SOFTLAYER
MACHINE_CREATE_FIELDS.push({
    provider: 'softlayer',
    fields: [{
        name: "softlayer_backend_vlan_id",
        label: "Backend VLAN ID",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "Optional."
    }, {
            name: "hourly",
            label: "Hourly billing",
            type: "toggle",
            value: true,
            defaultValue: true,
            show: true,
            required: false,
            helptext: "If you don't select hourly billing, monthly billing will be applied"

        }, {
            name: "bare_metal",
            label: "Bare Metal",
            type: "toggle",
            value: false,
            defaultValue: false,
            show: true,
            required: false,
            helptext: "Whether the new server will be Cloud server, or Bare Metal"

        }, {
        name: "machine_password",
        label: "Machine Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: "Windows machine password is required."
    }]
});

// VCLOUD
MACHINE_CREATE_FIELDS.push({
    provider: 'vcloud',
    fields: [{
        name: "networks",
        label: "Networks *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        options: []
    }]
});

// VSPHERE
MACHINE_CREATE_FIELDS.push({
    provider: 'vsphere',
    fields: []
});

// VULTR
MACHINE_CREATE_FIELDS.push({
    provider: 'vultr',
    fields: []
});

// ONAPP
MACHINE_CREATE_FIELDS.push({
    provider: 'onapp',
    fields: [{
        name: "networks",
        label: "Network",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        options: []
    }]
});

// add common fields
MACHINE_CREATE_FIELDS.forEach(function (p) {
    //add common machine properties fields
    p.fields.splice(0, 0, {
        name: "name",
        label: "Machine Name *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        helptext: "Fill in the machine's name"
    }, {
        name: "image",
        label: "Image *",
        type: "mist_dropdown_searchable",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: [],
        search: ""
    }, {
        name: "location",
        label: "Location *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    }, {
        name: "size",
        label: "Size *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: [],
        custom: true
    }, {
        name: "size_ram",
        label: "RAM MB",
        type: "slider",
        value: 256,
        defaultValue: "",
        min: 256,
        max: 6223,
        step: 1,
        show: true,
        required: false,
        unit: "MB",
        helptext: "Custom RAM size in MB.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    }, {
        name: "size_cpu",
        label: "CPU cores",
        type: "slider",
        value: 1,
        defaultValue: "",
        min: 1,
        max: 16,
        step: 1,
        show: true,
        required: false,
        unit: "cores",
        helptext: "Custom CPU cores.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    }, {
        name: "size_disk_primary",
        label: "Primary Disk",
        type: "slider",
        value: 5,
        defaultValue: "",
        min: 5,
        max: 16,
        step: 1,
        show: true,
        required: false,
        unit: "GB",
        helptext: "Custom disk size in GB.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    }, {
        name: "size_disk_swap",
        label: "Swap Disk",
        type: "slider",
        value: 1,
        defaultValue: "",
        min: 1,
        max: 11,
        step: 1,
        show: true,
        required: false,
        unit: "GB",
        helptext: "Custom disk size in GB.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    });

    if (['onapp'].indexOf(p.provider) != -1) {
        p.fields.push({
            name: "hypervisor_group_id",
            label: "hypervisor_group_id",
            type: "text",
            value: "",
            defaultValue: "",
            show: true,
            hidden: true,
            required: false
        }, {
            name: "onapp_advanced_options",
            label: "Advanced Options",
            type: "toggle",
            value: false,
            defaultValue: false,
            excludeFromPayload: true,
            helptext: "",
            show: true,
            required: false
        }, {
            name: "port_speed",
            label: "Port Speed",
            type: "slider",
            value: "",
            defaultValue: 0,
            min: 0,
            max: 1000,
            step: 1,
            show: true,
            required: false,
            unit: "Mbps",
            helptext: "Port speed in Mbps. Value 0 will enable unlimited speed.",
            showIf: {
                fieldName: "onapp_advanced_options",
                fieldValues: [true]
            }
        }, {
            name: "cpu_priority",
            label: "CPU Priority",
            type: "slider",
            value: 1,
            defaultValue: 1,
            min: 1,
            max: 100,
            step: 1,
            show: true,
            required: false,
            unit: "%",
            helptext: "CPU priority percentage.",
            showIf: {
                fieldName: "onapp_advanced_options",
                fieldValues: [true]
            }
        }, {
            name: "cpu_threads",
            label: "CPU Threads",
            type: "slider",
            value: 1,
            defaultValue: 1,
            min: 1,
            max: 16,
            step: 1,
            show: true,
            required: false,
            unit: "",
            helptext: "Custom CPU Threads",
            showIf: {
                fieldName: "onapp_advanced_options",
                fieldValues: [true]
            }
        }, {
            name: "cpu_sockets",
            label: "CPU Sockets",
            type: "slider",
            value: 1,
            defaultValue: 1,
            min: 1,
            max: 16,
            step: 1,
            show: true,
            required: false,
            unit: "",
            helptext: "Custom CPU Sockets",
            showIf: {
                fieldName: "onapp_advanced_options",
                fieldValues: [true]
            }
        });
    }

    p.fields.push({
        name: "key",
        label: "Key *",
        type: "ssh_key",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    });

    //add cloud init field only to providers that accept and we support
    if (['azure', 'digitalocean', 'ec2', 'gce', 'packet', 'rackspace', 'libvirt'].indexOf(p.provider) != -1) {
        p.fields.push({
            name: "cloud_init",
            label: "Cloud Init",
            type: "textarea",
            value: "",
            defaultValue: "",
            show: true,
            required: false,
            helptext: "Start your Cloud Init script with #!/bin/bash or use a valid yaml configuration file starting with #cloud-config"
        });
    }

    //add onapp specific fields
    if (['onapp'].indexOf(p.provider) != -1) {
        p.fields.push({
            name: "build",
            label: "Build",
            type: "toggle",
            value: true,
            defaultValue: true,
            show: true,
            required: false,
        }, {
            name: "boot",
            label: "Boot",
            type: "toggle",
            value: true,
            defaultValue: true,
            show: true,
            required: false,
        });
    }

    //add common post provision fields
    p.fields.push({
        name: "post_provision_script",
        label: "Run Script",
        type: "toggle",
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        helptext: "Open options to run a script immediately after provisioning",
        show: true,
        required: false
    }, {
        name: "run_script",
        label: "Script Inline or Select",
        type: "radio",
        value: "inline",
        defaultValue: "inline",
        helptext: "Edit a script to run or choose one from your existing ones.",
        show: true,
        required: false,
        class: "bind-bottom radio-highight",
        options: [{
            title: "Inline Script",
            val: "inline"
        }, {
            title: "Select Existing",
            val: "select"
        }],
        showIf: {
            fieldName: "post_provision_script",
            fieldValues: ["true", true]
        }
    }, {
        name: "script",
        label: "Inline Script",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        class: "bind-top background",
        helptext: "The inline script will run after provisioning",
        showIf: {
            fieldName: "run_script",
            fieldValues: ["inline"]
        }
    }, {
        name: "script_id",
        label: "Script",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        class: "bind-both background",
        show: true,
        required: false,
        helptext: "The selected script will run after provisioning",
        showIf: {
            fieldName: "run_script",
            fieldValues: ["select"]
        }
    }, {
        name: "script_params",
        label: "Optional Script Params",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        class: "bind-top background",
        helptext: "",
        showIf: {
            fieldName: "run_script",
            fieldValues: ["select"]
        }
    }, {
        name: "post_provision_scheduler",
        label: "Schedule a task",
        type: "toggle",
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        helptext: "Enable a scheduled action on this machine",
        show: true,
        required: false
    }, {
        name: "action",
        label: "Schedule Task",
        type: "dropdown",
        value: "",
        defaultValue: "",
        excludeFromPayload: true,
        show: true,
        required: false,
        helptext: "Choose one from the available tasks to schedule.",
        options: [],
        showIf: {
            fieldName: "post_provision_scheduler",
            fieldValues: ["true", true]
        }
    }, {
        name: "schedule_script_id",
        label: "Script",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        excludeFromPayload: true,
        add: true,
        helptext: "Schedule an existing script to run.",
        options: [],
        showIf: {
            fieldName: "action",
            fieldValues: ["run script"]
        }
    }, {
        name: "params",
        label: "Parameters",
        type: "textarea",
        value: "",
        defaultValue: "",
        helptext: "",
        show: false,
        required: false,
        showIf: {
            fieldName: "action",
            fieldValues: ["run script"]
        }
    }, {
        name: "schedule_type",
        label: "Schedule Type",
        type: "radio",
        value: "one_off",
        defaultValue: "one_off",
        helptext: "The scheduler type. Visit the docs",
        helpHref: "http://docs.mist.io/article/151-scheduler",
        show: false,
        required: true,
        excludeFromPayload: true,
        class: "bind-bottom radio-highight",
        options: [{
            title: "Once",
            val: "one_off"
        }, {
            title: "Repeat",
            val: "interval"
        }, {
            title: "Crontab",
            val: "crontab"
        }],
        showIf: {
            fieldName: "post_provision_scheduler",
            fieldValues: ["true", true]
        }
    }, {
        name: "schedule_entry",
        label: "Schedule time",
        type: "text",
        value: "",
        defaultValue: "",
        helptext: "",
        show: true,
        hidden: true,
        excludeFromPayload: true,
        required: false
    }, {
        name: "schedule_entry_interval_every",
        label: "Interval",
        type: "text",
        value: "10",
        defaultValue: "",
        excludeFromPayload: true,
        class: "bind-both background",
        show: false,
        required: true,
        helptext: "Example, every 10 minutes",
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["interval"]
        }
    }, {
        name: "schedule_entry_interval_period",
        type: "radio",
        value: "minutes",
        defaultValue: "minutes",
        excludeFromPayload: true,
        class: "bind-top background",
        show: false,
        required: false,
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["interval"]
        },
        options: [{ //days, hours, minutes, seconds, microseconds
            title: "days",
            val: "days"
        }, {
            title: "hours",
            val: "hours"
        }, {
            title: "mins",
            val: "minutes"
        }]
    }, {
        name: "schedule_entry_crontab",
        label: "Crontab",
        type: "text",
        value: "*/10 * * * *",
        defaultValue: "*/10 * * * *",
        excludeFromPayload: true,
        class: "bind-top background",
        show: false,
        required: false,
        helptext: "Example: */10 * * 1 *, is every 10 minutes on the 1st of each month. Relative periods: Minute, Hour, Day of the Month, Month of the Year, Day of the Week.",
        helpHref: "http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html#crontab-schedules",
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["crontab"]
        }
    }, {
        name: "schedule_entry_one_off",
        label: "",
        type: "date",
        value: "",
        defaultValue: "",
        class: "bind-top background",
        icon: "schedule",
        excludeFromPayload: true,
        show: false,
        required: false,
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["one_off"]
        }
    }, {
        name: "start_after",
        label: "Starts",
        type: "date",
        value: "",
        placeholder: "now",
        defaultValue: "",
        helptext: "",
        icon: "schedule",
        show: false,
        required: false,
        disabled: false,
        excludeFromPayload: true,
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["interval", "crontab"]
        }
    }, {
        name: "expires",
        label: "Expires",
        type: "date",
        value: "",
        placeholder: "never",
        excludeFromPayload: true,
        defaultValue: "",
        helptext: "",
        icon: "schedule",
        show: false,
        required: false,
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["interval", "crontab"]
        }
    }, {
        name: "max_run_count",
        label: "Maximum Run Count",
        type: "text",
        value: "",
        defaultValue: "",
        excludeFromPayload: true,
        show: false,
        required: false,
        helptext: "Optional. Integers only. Define a maximum run count.",
        showIf: {
            fieldName: "schedule_type",
            fieldValues: ["interval", "crontab"]
        }
    });

    if (['onapp'].indexOf(p.provider) == -1) {
        p.fields.push({
            name: "create_hostname_machine",
            label: "Create Hostname",
            type: "toggle",
            value: false,
            defaultValue: false,
            excludeFromPayload: true,
            helptext: "Open options to create an A record for this machine.",
            show: true,
            required: false
        }, {
            name: "hostname",
            label: "Hostname",
            type: "textarea",
            value: "",
            defaultValue: "",
            helptext: "Provide the desired hostname you want to assign to the machine. Example: machine1.mist.io. There needs to be a DNS zone for this domain already created. Currently under heavy development, might not be fully functional.",
            show: true,
            required: false,
            showIf: {
                fieldName: "create_hostname_machine",
                fieldValues: ["true", true]
            }
        });
    }

    p.fields.push({
        name: "monitoring",
        label: "Enable monitoring",
        type: "toggle",
        value: false,
        defaultValue: "false",
        show: true,
        required: false,
        helptext: ""
    }, {
        name: "async",
        label: "Async request",
        type: "toggle",
        value: "true",
        defaultValue: "true",
        show: false,
        required: false,
        helptext: ""
    });

    if (p.provider == "onapp") {
        var locationField = p.fields.find(function (f) {
                return f.name == 'location'
            }),
            index = p.fields.indexOf(locationField);
        p.fields.splice(1, 0, p.fields.splice(index, 1)[0]);
    }
});
