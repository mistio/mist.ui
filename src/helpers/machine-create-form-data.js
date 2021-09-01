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
};

export { MACHINE_CREATE_FORM_DATA };
