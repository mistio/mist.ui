import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '../element-for-in/element-for-in.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import moment from 'moment/src/moment';

Polymer({
  _template: html`
    <style include="shared-styles">

    </style>
          <paper-dropdown-menu
            class="dropdown-block l6 xs12 dropdown-with-logos"
            label="Select Cloud"
            horizontal-align="left"
            no-animations=""
          >
            <paper-listbox
              slot="dropdown-content"
              attr-for-selected="value"
              selected="{{selectedCloud::iron-select}}"
              class="dropdown-content"
            >
              <template is="dom-repeat" items="[[clouds]]" as="cloud">
                <paper-item
                  value="[[cloud.id]]"
                  disabled$="[[!_isOnline(cloud.id, cloud.state, model.clouds)]]"
                >
                  <img
                    src="[[_computeProviderLogo(cloud.provider)]]"
                    width="24px"
                    alt="[[cloud.title]]"
                  />[[cloud.title]]</paper-item
                >
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
  `,

  is: 'machine-cloud-dropdown',

  properties: {

  },

});
