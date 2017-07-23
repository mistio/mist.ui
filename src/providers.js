var PROVIDERS = []

// AZURE
PROVIDERS.push({
    title: 'Azure',
    val: 'azure',
    className: 'provider-azure',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Azure",
        defaultValue: "Azure",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "subscription_id",
        label: "Subscription ID *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter subscription id",
        helptext: "You can find your subscriptionID on the Azure portal",
        helpHref: "http://docs.mist.io/article/18-adding-microsoft-azure"
    }, {
        name: "certificate",
        label: "Certificate *",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        buttonText: "Add Certificate",
        buttonFilledText: "Certificate",
        helptext: "Your Azure certificate PEM file",
        helpHref: "http://docs.mist.io/article/18-adding-microsoft-azure"
    }]
});

// AZURE ARM
PROVIDERS.push({
    title: 'Azure ARM',
    val: 'azure_arm',
    className: 'provider-azure',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Azure ARM",
        defaultValue: "Azure ARM",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "tenant_id",
        label: "Tenant ID *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter tenant id",
        helptext: "You can find your tenant ID on the Azure portal",
        helpHref: "http://docs.mist.io/article/110-adding-azure-arm"
    }, {
        name: "subscription_id",
        label: "Subscription ID *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter subscription id",
        helptext: "You can find your subscriptionID on the Azure portal",
        helpHref: "http://docs.mist.io/article/110-adding-azure-arm"
    }, {
        name: "key",
        label: "Client key *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter client key",
        helptext: "You can find your client key on the Azure portal",
        helpHref: "http://docs.mist.io/article/110-adding-azure-arm"
    }, {
        name: "secret",
        label: "Client secret *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter client secret",
        helptext: "You can find your client secret on the Azure portal",
        helpHref: "http://docs.mist.io/article/110-adding-azure-arm"
    }]
});

/*
// COREOS
PROVIDERS.push(
    {
        title: 'CoreOS',
        val: 'coreos',
        className: 'provider-coreos',
        options: [{
            name: "title",
            label: "Title *",
            type: "text",
            value: "CoreOS",
            defaultValue: "CoreOS",
            show: true,
            required: true,
            errorMessage: "Please enter title"
        }, {
            name: "machine_ip",
            label: "Hostname *",
            type: "text",
            value: "",
            defaultValue: "",
            placeholder: "DNS or IP",
            show: true,
            required: true,
            errorMessage: "Please enter hostname"
        }, {
            name: "machine_key",
            label: "SSH Key",
            type: "dropdown",
            value: "",
            defaultValue: "",
            show: true,
            required: false,
            options: []
        }, {
            name: "machine_user",
            label: "User",
            type: "text",
            value: "root",
            defaultValue: "root",
            show: true,
            required: false,
            showIf: {
                fieldName: "machine_key",
                fieldExists: true
            }
        }, {
            name: "machine_port",
            label: "Port",
            type: "text",
            value: 22,
            defaultValue: 22,
            show: true,
            required: false,
            showIf: {
                fieldName: "machine_key",
                fieldExists: true
            }
        }, {
            name: "monitoring",
            label: "Enable monitoring",
            type: "switch",
            value: true,
            defaultValue: true,
            show: true,
            required: false,
            showIf: {
                fieldName: "machine_key",
                fieldExists: true
            }
        }]
    }
);
*/

// DIGITALOCEAN
PROVIDERS.push({
    title: 'Digital Ocean',
    val: 'digitalocean',
    className: 'provider-digitalocean',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Digital Ocean",
        defaultValue: "Digital Ocean",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "token",
        label: "Token *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter token",
        helptext: 'You can find your API Token on the Digital Ocean portal',
        helpHref: 'http://docs.mist.io/article/19-adding-digital-ocean'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// DOCKER
PROVIDERS.push({
    title: 'Docker',
    val: 'docker',
    className: 'provider-docker',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Docker",
        defaultValue: "Docker",
        show: true,
        required: true,
        errorMessage: "Please enter title",
        helptext: "If you need help, read the docs on adding a Docker cloud",
        helpHref: "http://docs.mist.io/article/20-adding-docker"
    }, {
        name: "docker_host",
        label: "Host",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter Docker host IP or DNS name",
    }, {
        name: "docker_port",
        label: "port",
        type: "text",
        value: 2375,
        defaultValue: 2375,
        show: true,
        required: false
    }, {
        name: "authentication",
        label: "Authentication",
        type: "dropdown",
        value: "basic",
        defaultValue: "tls",
        options: [{
            val: "basic",
            title: "Basic http authentication"
        }, {
            val: "tls",
            title: "TLS"
        }],
        show: true,
        required: true,
        errorMessage: "Please choose authentication method",
    }, {
        name: "auth_user",
        label: "Username",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: 'Username, if you have set basic http authentication in front of the Docker API',
        showIf: {
            fieldName: "authentication",
            fieldValues: ["basic"]
        }
    }, {
        name: "auth_password",
        label: "Password",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: 'Password, if you have set basic http authentication in front of the Docker API',
        showIf: {
            fieldName: "authentication",
            fieldValues: ["basic"]
        }
    }, {
        name: "key_file",
        label: "Key",
        type: "textarea",
        helptext: 'Client private key file',
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        showIf: {
            fieldName: "authentication",
            fieldValues: ["tls"]
        }
    }, {
        name: "cert_file",
        label: "Certificate",
        helptext: 'Client certificate file',
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        showIf: {
            fieldName: "authentication",
            fieldValues: ["tls"]
        }
    }, {
        name: "ca_cert_file",
        label: "CA Certificate",
        helptext: 'CA certificate file',
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        showIf: {
            fieldName: "authentication",
            fieldValues: ["tls"]
        }
    }, {
        name: "show_all",
        label: "Show all containers (including stopped)",
        helptext: 'Shows all containers, running and stopped. By default only running containers are shown',
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false
    }]
});

// AWS
PROVIDERS.push({
    title: 'AWS',
    val: 'ec2',
    className: 'provider-ec2',
    options: [{
        name: "region",
        label: "Region *",
        type: "dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        // SUPPORTED_PROVIDERS[3].regions.map(function(i){return {val:i.id, title: i.location}})
        //ec2_ap_northeast should be ap-northeast
        options: [{'val': 'ap-northeast-1', 'title': 'Tokyo'}, {'val': 'ap-northeast-2', 'title': 'Seoul'}, {'val': 'ap-southeast-1', 'title': 'Singapore'}, {'val': 'ap-southeast-2', 'title': 'Sydney'}, {'val': 'eu-central-1', 'title': 'Frankfurt'}, {'val': 'eu-west-1', 'title': 'Ireland'}, {'val': 'eu-west-2', 'title': 'London'},  {'val': 'ca-central-1', 'title': 'Canada Central'}, {'val': 'sa-east-1', 'title': 'Sao Paulo'}, {'val': 'us-east-1', 'title': 'N. Virginia'}, {'val': 'us-west-1', 'title': 'N. California'}, {'val': 'us-west-2', 'title': 'Oregon'}, {'val': 'us-east-2', 'title': 'Ohio'}, {'val': 'ap-south-1', 'title': 'Mumbai'}]
    }, {
        name: "title",
        label: "Title *",
        type: "text",
        value: "EC2",
        defaultValue: "EC2",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "apikey",
        label: "API Key *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        helptext: 'You can find your API key on your Amazon console',
        helpHref: 'http://docs.mist.io/article/17-adding-amazon-ec2'
    }, {
        name: "apisecret",
        label: "API Secret *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        helptext: 'You can find your API secret on your Amazon console',
        helpHref: 'http://docs.mist.io/article/17-adding-amazon-ec2'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// GCE
PROVIDERS.push({
    title: 'GCE',
    val: 'gce',
    className: 'provider-gce',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "GCE",
        defaultValue: "GCE",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "project_id",
        label: "Project ID *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter project's ID",
        helptext: 'You can find your project ID on your GCE portal',
        helpHref: 'http://docs.mist.io/article/21-adding-google-compute-engine'
    }, {
        name: "private_key",
        label: "Private Key *",
        type: "textarea",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter private key",
        helptext: 'You can create a new key on your GCE portal',
        helpHref: 'http://docs.mist.io/article/21-adding-google-compute-engine'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// HOSTVIRTUAL
PROVIDERS.push({
    title: 'HostVirtual',
    val: 'hostvirtual',
    className: 'provider-hostvirtual',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "HostVirtual",
        defaultValue: "HostVirtual",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "apikey",
        label: "API Key *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter API Key",
        helptext: 'You can find your API Token on the HostVirtual portal',
        helpHref: 'http://docs.mist.io/article/22-adding-hostvirtual'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// KVM
PROVIDERS.push({
    title: 'KVM (via libvirt)',
    val: 'libvirt',
    className: 'provider-libvirt',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "KVM (libvirt)",
        defaultValue: "KVM (libvirt)",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "machine_hostname",
        label: "KVM hostname *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter KVM hostname",
        helptext: 'The URL or IP that your KVM hypervisor listens to',
        helpHref: 'http://docs.mist.io/article/24-adding-kvm'
    }, {
        name: "machine_key",
        label: "SSH Key",
        type: "ssh_key",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        options: [],
        helptext: 'If you don\'t specify an SSH key, mist.io will assume that you are connecting via tcp (qemu+tcp)',
        helpHref: 'http://docs.mist.io/article/24-adding-kvm'
    }, {
        name: "machine_user",
        label: "SSH user",
        type: "text",
        value: "root",
        defaultValue: "root",
        show: true,
        required: false,
        helptext: 'The SSH user that Mist.io should try to connect as'
    }, {
        name: "ssh_port",
        label: "SSH port",
        type: "text",
        value: 22,
        defaultValue: 22,
        show: true,
        required: false
    }, {
        name: "images_location",
        label: "Path for *.iso images",
        type: "text",
        value: '/var/lib/libvirt/images',
        defaultValue: '/var/lib/libvirt/images',
        show: true,
        required: false,
        helptext: 'The path that your disk or iso images are located, example /var/lib/libvirt/images'
    }]
});

// LINODE
PROVIDERS.push({
    title: 'Linode',
    val: 'linode',
    className: 'provider-linode',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Linode",
        defaultValue: "Linode",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "apikey",
        label: "API Key *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter API Key",
        helptext: 'You can create an API key on your Linode portal',
        helpHref: 'http://docs.mist.io/article/25-adding-linode'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// NEPHOSCALE
PROVIDERS.push({
    title: 'NephoScale',
    val: 'nephoscale',
    className: 'provider-nephoscale',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "NephoScale",
        defaultValue: "NephoScale",
        show: true,
        required: true,
        errorMessage: "Please enter title",
        helptext: "If you need help, read the docs on adding a NephoScale cloud",
        helpHref: "http://docs.mist.io/article/26-adding-nephoscale"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username",
        helptext: 'The username you use to connect to the NephoScale portal',
        helpHref: "http://docs.mist.io/article/26-adding-nephoscale"
    }, {
        name: "password",
        label: "Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter password",
        helptext: 'The password you use to connect to the NephoScale portal',
        helpHref: "http://docs.mist.io/article/26-adding-nephoscale"
    }]
});

// OPENSTACK
PROVIDERS.push({
    title: 'Openstack',
    val: 'openstack',
    className: 'provider-openstack',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "OpenStack",
        defaultValue: "OpenStack",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username"
    }, {
        name: "password",
        label: "Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter password"
    }, {
        name: "auth_url",
        label: "Auth Url *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter url",
        helptext: 'Your OpenStack Auth URL',
        helpHref: 'http://docs.mist.io/article/27-adding-openstack'
    }, {
        name: "tenant_name",
        label: "Tenant Name *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter tenant name"
    }, {
        name: "region",
        label: "Region",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: 'Specify only if you have changed the default region',
        helpHref: 'http://docs.mist.io/article/27-adding-openstack'

    }, {
        name: "compute_endpoint",
        label: "Compute Endpoint",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        helptext: 'In most cases you will not have to specify this',
        helpHref: 'http://docs.mist.io/article/27-adding-openstack'
    }]
});

// PACKET
PROVIDERS.push({
    title: 'Packet',
    val: 'packet',
    className: 'provider-packet',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Packet",
        defaultValue: "Packet",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "apikey",
        label: "API Key *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter API Key",
        helptext: 'You can find your API Token on the Packet portal',
        helpHref: 'http://docs.mist.io/article/100-adding-packet'
    }, {
        name: "project_id",
        label: "Project",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: false,
        errorMessage: "Please enter title",
        helptext: 'Optionally specify the project name'
    }]
});

// RACKSPACE
PROVIDERS.push({
    title: 'Rackspace',
    val: 'rackspace',
    className: 'provider-rackspace',
    options: [{
        name: "region",
        label: "Region *",
        type: "dropdown",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        // SUPPORTED_PROVIDERS[9].regions.map(function(i){return {val:i.id, title: i.location}})
        options: [{"val":"dfw","title":"Dallas"},{"val":"ord","title":"Chicago"},{"val":"iad","title":"N. Virginia"},{"val":"lon","title":"London"},{"val":"syd","title":"Sydney"},{"val":"hkg","title":"Hong Kong"},{"val":"rackspace_first_gen:us","title":"US-First Gen"},{"val":"rackspace_first_gen:uk","title":"UK-First Gen"}]
    }, {
        name: "title",
        label: "Title *",
        type: "text",
        value: "Rackspace",
        defaultValue: "Rackspace",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter title",
        helptext: 'The username you use to connect to the RackSpace portal'
    }, {
        name: "apikey",
        label: "API Key *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter API Key",
        helptext: 'You can find your API key on your RackSpace portal',
        helpHref: 'http://docs.mist.io/article/29-adding-rackspace'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// SOFTLAYER
PROVIDERS.push({
    title: 'SoftLayer',
    val: 'softlayer',
    className: 'provider-softlayer',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "SoftLayer",
        defaultValue: "SoftLayer",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username",
        helptext: 'The username you use to connect to the SoftLayer portal'
    }, {
        name: "apikey",
        label: "API Key *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter API Key",
        helptext: 'You can find your API key on your SoftLayer portal',
        helpHref: 'http://docs.mist.io/article/30-adding-softlayer'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// ONAPP
PROVIDERS.push({
    title: 'OnApp',
    val: 'onapp',
    className: 'provider-onapp',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "OnApp",
        defaultValue: "OnApp",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username",
        helptext: 'Username you use to connect to OnApp portal'
    }, {
        name: "apikey",
        label: "Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter password",
        helptext: 'Password you use to connect to OnApp portal',
        helpHref: 'http://docs.mist.io/article/155-onapp'
    }, {
        name: "host",
        label: "Host *",
        type: "text",
        value: "",
        defaultValue: "onapp.com",
        show: true,
        required: true,
        errorMessage: "Please enter onapp host",
        helptext: 'URL of the OnApp host',
        helpHref: 'http://docs.mist.io/article/155-onapp'
    }, {
        name: "verify",
        label: "Verify SSL certificate",
        type: "toggle",
        value: true,
        defaultValue: true,
        show: true,
        required: false
    }]
});

// SOLUSVM
PROVIDERS.push({
    title: 'SolusVM',
    val: 'solusvm',
    className: 'provider-solusvm',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "SolusVM",
        defaultValue: "SolusVM",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username",
        helptext: 'Username you use to connect to SolusVM portal'
    }, {
        name: "apikey",
        label: "Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter password",
        helptext: 'Password you use to connect to SolusVM portal',
        helpHref: 'http://docs.mist.io'
    }, {
        name: "host",
        label: "Host *",
        type: "text",
        value: "",
        defaultValue: "solusvm.com",
        show: true,
        required: true,
        errorMessage: "Please enter SolusVM host",
        helptext: 'URL of the SolusVM host',
        helpHref: 'http://docs.mist.io'
    }, {
        name: "port",
        label: "Host port",
        type: "text",
        value: 80,
        defaultValue: 80,
        show: true,
        required: false
    }, {
        name: "verify",
        label: "Verify SSL certificate",
        type: "toggle",
        value: true,
        defaultValue: true,
        show: true,
        required: false
    }]
});

// VCLOUD
PROVIDERS.push({
    title: 'VMWare vCloud',
    val: 'vcloud',
    className: 'provider-vcloud',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "VMWare vCloud",
        defaultValue: "VMWare vCloud",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username",
        helptext: 'The username you use to login to vCloud Director'
    }, {
        name: "password",
        label: "Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter password",
        helptext: 'The password you use to login to vCloud Director'
    }, {
        name: "organization",
        label: "Organization *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter organization"
    }, {
        name: "host",
        label: "Hostname *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter hostname",
        helptext: 'The URL or IP vCloud listens to',
        helpHref: 'http://docs.mist.io/article/31-adding-vmware-vcloud'
    }, {
        name: "port",
        label: "Host port",
        type: "text",
        value: 443,
        defaultValue: 443,
        show: true,
        required: false
    }]
});

// VSPHERE
PROVIDERS.push({
    title: 'VMWare vSphere',
    val: 'vsphere',
    className: 'provider-vsphere',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "VMware vSphere",
        defaultValue: "VMware vSphere",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "username",
        label: "Username *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter username"
    }, {
        name: "password",
        label: "Password *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter password"
    }, {
        name: "host",
        label: "Hostname *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter hostname",
        helptext: 'The URL or IP vSphere listens to',
        helpHref: 'http://docs.mist.io/article/73-adding-vsphere'
    }]
});

// VULTR
PROVIDERS.push({
    title: 'Vultr',
    val: 'vultr',
    className: 'provider-vultr',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "Vultr",
        defaultValue: "Vultr",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "apikey",
        label: "API Key *",
        type: "password",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter API Key",
        helptext: 'You can find your API Token on the Vultr portal',
        helpHref: 'http://docs.mist.io/article/72-adding-vultr'
    }, {
        name: "dns_enabled",
        label: "Enable DNS support",
        type: "toggle",
        value: false,
        defaultValue: false,
        show: true,
        required: false,
        helptext: 'Check this to enable DNS support on this cloud.'
    }]
});

// OTHER SERVER
PROVIDERS.push({
    title: 'Other Server',
    val: 'bare_metal',
    className: 'provider-baremetal',
    options: [{
        name: "title",
        label: "Title *",
        type: "text",
        value: "",
        defaultValue: "",
        show: true,
        required: true,
        errorMessage: "Please enter title"
    }, {
        name: "machine_ip",
        label: "Hostname",
        type: "text",
        placeholder: 'DNS or IP',
        show: true,
        required: false,
        helptext: 'The URL or IP adress that your server listens to',
        helpHref: 'http://docs.mist.io/article/28-adding-other-servers'
    }, {
        name: "operating_system",
        label: "Operating System",
        type: "dropdown",
        value: "unix",
        defaultValue: "unix",
        show: true,
        required: false,
        options: [{
            title: "Unix",
            val: "unix"
        }, {
            title: "Windows",
            val: "windows"
        }]
    }, {
        name: "machine_key",
        label: "SSH Key",
        type: "ssh_key",
        value: "",
        defaultValue: "",
        show: false,
        required: false,
        options: [],
        showIf: {
            fieldName: "operating_system",
            fieldValues: ["unix"]
        }
    }, {
        name: "machine_user",
        label: "User",
        type: "text",
        value: "root",
        defaultValue: "root",
        show: false,
        required: false,
        errorMessage: "Please enter user",
        showIf: {
            fieldName: "machine_key",
            fieldExists: true
        }
    }, {
        name: "machine_port",
        label: "Port",
        type: "text",
        value: 22,
        defaultValue: 22,
        show: false,
        required: false,
        errorMessage: "Please enter port",
        showIf: {
            fieldName: "machine_key",
            fieldExists: true
        }
    }, {
        name: "remote_desktop_port",
        label: "Remote Desktop Port",
        type: "text",
        value: 3389,
        defaultValue: 3389,
        errorMessage: "Please enter remote desktop's port",
        show: false,
        required: true,
        showIf: {
            fieldName: "operating_system",
            fieldValues: ["windows"]
        }
    }, {
        name: "monitoring",
        label: "Enable monitoring",
        type: "toggle",
        value: true,
        defaultValue: true,
        show: true,
        required: false
    }]
});
