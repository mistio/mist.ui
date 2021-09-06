const MACHINE_CREATE_FORM_DATA = {
  src: './assets/forms/create-machine.json',
  formData: {
    dynamicData: {
        clouds: {
          func: new Promise(resolve => {
            resolve(() => ["test", "test2"])
          }),
        },
      },
  },
  patterns: {
    'ec2':{
          'maximum': 255,
          'errorMessage': `machine name max chars allowed is 255`
        },
    'gce':
        {
          'errorMessage': `name must be 1-63 characters long, with the first
          character being a lowercase letter, and all following
          characters must be a dash, lowercase letter, or digit,
          except the last character, which cannot be a dash.`,
          'pattern': '^(?:[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?)$'
        },
      'digital_ocean': {
        'errorMessage': `machine name may only contain ASCII letters or numbers, dashes and dots`,
        'pattern': '^[0-9a-zA-Z]+[0-9a-zA-Z-.]{0,}[0-9a-zA-Z]+$'
      },
      'maxihost':
        {
          'errorMessage': `machine name may only contain ASCII letters or numbers, dashes and dots`,
          'pattern': '^[0-9a-zA-Z]+[0-9a-zA-Z-.]{0,}[0-9a-zA-Z]+$'
        },
      'equinix':
        {
          'errorMessage': `machine name may only contain ASCII letters or numbers, dashes and periods`,
          'pattern': '^[0-9a-zA-Z-.]+$',
        },
      'azure_arm':
          {
            'errorMessage': `machine name may only contain ASCII letters or numbers and dashes`,
            'pattern': '^[0-9a-zA-Z\-]+$',
          },
      'linode':
        {
          'errorMessage': `machine name may only contain ASCII letters or numbers,
          dashes and underscores. Must begin and end with letters
          or numbers, and be at least 3 characters long`,
          'minimum': 3,
          'pattern': '^[0-9a-zA-Z][0-9a-zA-Z-_]+[0-9a-zA-Z]$'
        },
      'onapp':
        // I should also strip and replce spaces with -
        {
            'errorMessage': `machine name may only contain ASCII letters
            or numbers, dashes and periods. Name should not
            end with a dash`,
            'pattern': '^[0-9a-zA-Z-.]+[0-9a-zA-Z.]$',
          },
      'kubevirt':
        // I should also strip and replce spaces with -
           {
            'errorMessage':`name must be 1-63 characters long, with the first
            character being a lowercase letter, and all following
            characters must be a dash, period, lowercase letter,
            or digit, except the last character, which cannot be
            a dash nor period.`,
            'pattern': '^(?:[a-z](?:[\.\-a-z0-9]{0,61}[a-z0-9])?)$',
          },
      'default':
        {
          'pattern': '.*',
          'minlength': 1,
          'maxlength': 999
        }
    }
};

export { MACHINE_CREATE_FORM_DATA };
