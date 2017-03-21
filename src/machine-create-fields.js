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
    },{
        name: "ports",
        label: "Ports *",
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
    fields: []
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
    },{
        name: "docker_command",
        label: "Docker Command",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: ""
    },{
        name: "docker_port_bindings",
        label: "Docker Port Bindings",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    },{
        name: "docker_exposed_ports",
        label: "Docker Exposed Ports",
        type: "text",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        helptext: ""
    },{
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
    },{
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

// INDONESIAN CLOUD
MACHINE_CREATE_FIELDS.push({
    provider: 'indonesian_vcloud',
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
    },{
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
    },{
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
    fields: []
});

// add common fields
MACHINE_CREATE_FIELDS.forEach(function(p){
    //add common machine properties fields
    p.fields.splice(0, 0 , {
        name: "name",
        label: "Machine Name *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        helptext: "Fill in the machine's name"
    },{
        name: "image",
        label: "Image *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    },{
        name: "size",
        label: "Size *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: [],
        custom: true
    },{
        name: "size_ram",
        label: "RAM MB",
        type: "slider",
        value: "",
        defaultValue: "",
        min: 256,
        max: 6223,
        step: 256,
        show: true,
        required: false,
        helptext: "Custom RAM size in MB.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    },{
        name: "size_cpu",
        label: "CPU cores",
        type: "slider",
        value: "",
        defaultValue: "",
        min: 1,
        max: 16,
        step: 1,
        show: true,
        required: false,
        helptext: "Custom CPU cores.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    },{
        name: "size_disk",
        label: "Disk GB",
        type: "slider",
        value: "",
        defaultValue: "",
        min: 5,
        max: 16,
        step: 1,
        show: true,
        required: false,
        helptext: "Custom disk size in GB.",
        showIf: {
            fieldName: "size",
            fieldValues: ["custom"]
        }
    },{
        name: "location",
        label: "Location *",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        options: []
    },{
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
    if (['azure', 'digitalocean', 'ec2', 'gce', 'packet', 'rackspace', 'libvirt', 'onapp'].indexOf(p.provider) != -1) {
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
    },{
        name: "radio",
        label: "Script Inline or Select",
        type: "radio",
        value: "inline",
        defaultValue: "inline",
        helptext: "Edit a script to run or choose one from your existing ones.",
        show: true,
        required: false,
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
    },{
        name: "script",
        label: "Inline Script",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "The inline script will run after provisioning",
        showIf: {
            fieldName: "radio",
            fieldValues: ["inline"]
        }
    },{
        name: "script_id",
        label: "Script",
        type: "mist_dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "The selected script will run after provisioning",
        showIf: {
            fieldName: "radio",
            fieldValues: ["select"]
        }
    },{
        name: "script_params",
        label: "Optional Script Params",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: "",
        showIf: {
            fieldName: "radio",
            fieldValues: ["select"]
        }
    },
     {
         name: "post_provision_scheduler",
         label: "Schedule a task",
         type: "toggle",
         value: false,
         defaultValue: false,
         excludeFromPayload: true,
         helptext: "Enable a scheduled action on this machine",
         show: true,
         required: false
     },{
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
         },{
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
         },{
             title: "hours",
             val: "hours"
         },{
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
         helptext: "Example: */10 * * 1 *, is every 10 minutes on the 1st of each month. Relative periods: minute hour day_of_week day_of_month month_of_year.",
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
     }, {
        name: "create_hostname_machine",
        label: "Create Hostname",
        type: "toggle",
        value: false,
        defaultValue: false,
        excludeFromPayload: true,
        helptext: "Open options to create an A record for this machine.",
        show: true,
        required: false
    },{
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
    }, {
        name: "monitoring",
        label: "Enable monitoring",
        type: "toggle",
        value: true,
        defaultValue: "true",
        show: true,
        required: false,
        helptext: ""
    },{
        name: "async",
        label: "Async request",
        type: "toggle",
        value: "true",
        defaultValue: "true",
        show: false,
        required: false,
        helptext: ""
    });
});