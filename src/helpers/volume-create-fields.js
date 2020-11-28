const VOLUME_CREATE_FIELDS = []

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
        helptext: "If a filesystem type is selected, the volume will automatically be formatted to the specified filesystem type.",
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

// EQUINIX METAL
VOLUME_CREATE_FIELDS.push({
    provider: 'equinixmetal',
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


VOLUME_CREATE_FIELDS.forEach((p) => {
// add common machine properties fields
    const minimumSize = (p.provider === 'equinixmetal' && 100) ||
                      (p.provider === 'aliyun_ecs' && 5) || 1;
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

    if (p.provider !== 'equinixmetal') {
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

    if (p.provider !== 'openstack' && p.provider !== 'gig_g8') {
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

export { VOLUME_CREATE_FIELDS };