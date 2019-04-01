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
        name: "disk_type",
        label: "Disk type",
        type: 'dropdown',
        value: "premium",
        defaultValue: "premium",
        required: true,
        show: true,
        errorMessage: "Please enter volume's type",
        options: [{
            title: 'Premium SSD',
            val: 'Premium',
        }, {
            title: 'Standard SSD',
            val: 'Standard',
        }]
    },{
        name: "host_caching",
        label: "Host caching policy",
        type: 'dropdown',
        value: "none",
        defaultValue: "none",
        required: true,
        show: true,
        errorMessage: "Please enter host caching policy of the disk",
        options: [{
            title: 'None',
            val: 'None',
        }, {
            title: 'Read Only',
            val: 'ReadOnly',
        }, {
            title: 'Read Write',
            val: 'ReadQrite',
        }]
    }]
});


// DIGITAL OCEAN
// https://developers.digitalocean.com/documentation/v2/#create-a-new-block-storage-volume
VOLUME_CREATE_FIELDS.push({
    provider: 'digitalocean',
    fields: [{
        name: "filesystem_type",
        type: 'radio',
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
            title: 'Ext4',
            val: 'ext4',
        },{
            title: 'XFS',
            val: 'xfs',
        }]
    }]
});

// OPENSTACK
VOLUME_CREATE_FIELDS.push({
    provider: 'openstack',
    fields: []
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

VOLUME_CREATE_FIELDS.forEach(function(p) {
// add common machine properties fields
    p.fields.splice(0, 0, {
        name: "name",
        label: "Name *",
        type: "text",
        value: "",
        defaultValue: "",
        placeholder: "",
        errorMessage: "Please enter volume's name",
        show: true,
        required: true
    }, {
        name: 'size',
        label: 'Size in GB *',
        type: 'number',
        min: 1,
        value: '1',
        defaultValue: '1',
        suffix: ' GB',
        show: true,
        required: true,
        options: [],
        custom: false
    })

    if (p.provider != 'openstack') {
        p.fields.splice(1, 0, {
            name: 'location',
            label: 'Location *',
            type: 'mist_dropdown',
            value: '',
            defaultValue: '',
            show: true,
            required: false, // non required for os, do, // required for azure
            options: []
        });
    }
});