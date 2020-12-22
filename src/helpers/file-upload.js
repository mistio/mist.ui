import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  is: 'file-upload',

  properties: {
    file: {
      type: {
        type: Object,
      },
      value() {
        return {
          type: '',
          value: '',
        };
      },
    },
  },
  upload(args) {
    const that = this;
    const { e } = args;
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    reader.onloadend = ev => {
      let fileValue;
      if (ev.currentTarget.readyState === FileReader.DONE) {
        fileValue = ev.currentTarget.result;
      } else {
        fileValue = '';
      }

      that.set('file.type', args.type);
      that.set('file.value', fileValue);

      that.fire('file-uploaded', {
        file: that.file,
      });
    };

    reader.readAsText(file, 'UTF-8');
  },
});
