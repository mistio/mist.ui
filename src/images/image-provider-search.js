import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs forms">
      :host {
        display: inline;
        color: rgba(255, 255, 255, 0.87);
      }
      paper-checkbox {
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }
      .no-clouds {
        font-style: italic;
      }
      .progress {
        margin: 14px -24px 0 -24px;
        width: 100%;
      }
      .progress paper-progress {
        width: 100%;
      }
      paper-progress.progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .error {
        color: var(--red-color);
        align-self: flex-end;
        padding: 8px;
        font-size: 0.9em;
      }
      iron-icon {
        color: inherit;
      }
      .errormsg-container {
        color: var(--red-color);
        padding-left: 24px;
        padding-right: 24px;
        margin-bottom: 0;
      }
      .errormsg-container iron-icon {
        color: inherit;
        margin: -2px 4px 0px -2px;
      }
      .checkboxes {
        margin: 24px 0;
      }
    </style>

    <paper-dialog
      id="providerSearch"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2>Search and Import Images</h2>
      <paper-dialog-scrollable>
        <paper-input
          value="{{queryTerm}}"
          label="Search term"
          autofocus=""
        ></paper-input>
        <p class="no-clouds" hidden$="[[clouds.length]]">No clouds found.</p>
        <p class="sup">Image search is supported in EC2 and Docker clouds.</p>
      </paper-dialog-scrollable>

      <div class="progress">
        <paper-progress
          id="progress"
          indeterminate=""
          hidden$="[[!loading]]"
        ></paper-progress>
        <paper-progress
          id="progresserror"
          class="progresserror"
          value="100"
          hidden$="[[!formError]]"
        ></paper-progress>
        <hr class="appform" />
        <p
          id="progressmessage"
          class="errormsg-container"
          hidden$="[[!formError]]"
        >
          <iron-icon icon="icons:error-outline"></iron-icon
          ><span id="errormsg"></span>
        </p>
      </div>

      <div class="btn-group">
        <paper-button dialog-dismiss="">Cancel</paper-button>
        <paper-button
          class="blue"
          disabled$="[[!formReady]]"
          on-tap="_submitForm"
          >Submit</paper-button
        >
      </div>
    </paper-dialog>

    <iron-ajax
      id="request"
      handle-as="xml"
      method="GET"
      loading="{{loading}}"
      on-response="handleResponse"
      on-error="handleError"
    ></iron-ajax>
  `,

  is: 'image-provider-search',

  properties: {
    queryTerm: {
      type: String,
      value: '',
    },
    clouds: {
      type: Array,
    },
    formReady: {
      type: Boolean,
      value: true,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    selectedClouds: {
      type: Array,
    },
    activeSearchIndex: {
      type: Number,
      value: 0,
    },
  },

  observers: [
    'updateFormReady(queryTerm, selectedClouds, loading)',
    'queryTermChanged(queryTerm)',
  ],

  listeners: {
    keyup: 'hotkeys',
    change: 'toggleSelection',
  },

  attached() {},

  _openDialog() {
    this.$.providerSearch.open();
  },

  updateFormReady(queryTerm, _selectedClouds, _loading) {
    this.set(
      'formReady',
      queryTerm && queryTerm.length && this.clouds.length && !this.loading
    );
  },

  handleResponse(e) {
    this.$.providerSearch.close();
    const newImages = JSON.parse(e.detail.xhr.response);
    console.log('handleResponse', e, newImages.length);
    if (newImages.length) {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `${newImages.length} new images in ${this.get(
              `clouds.${this.activeSearchIndex}.title`
            )}. Updating..`,
            duration: 3000,
          },
        })
      );
      this.dispatchEvent(
        new CustomEvent('add-new-images', {
          bubbles: true,
          composed: true,
          detail: {
            images: newImages,
            cloud: this.get(`clouds.${this.activeSearchIndex}`),
          },
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `No new images found in ${this.get(
              `clouds.${this.activeSearchIndex}.title`
            )}`,
            duration: 3000,
          },
        })
      );
    }
    this.set('activeSearchIndex', this.activeSearchIndex + 1);
    this.nextSearch(this.activeSearchIndex);
  },

  handleError(e) {
    this.set('formError', true);
    console.log('handleError', e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;

    this.set('activeSearchIndex', this.activeSearchIndex + 1);
    this.nextSearch(this.activeSearchIndex);
  },

  queryTermChanged(_queryTerm) {
    this.set('formError', false);
  },

  toggleSelection(e) {
    if (e.target.tagName === 'PAPER-CHECKBOX') this._updateSelectedClouds();
  },

  _updateSelectedClouds() {
    const checkboxes = this.shadowRoot.querySelectorAll(
      'paper-checkbox[name="searchableClouds"]'
    ); // get checkboxes
    const arr = [];
    checkboxes.forEach(c => {
      if (c.checked) arr.push(c.dataValue);
    });
    this.set('selectedClouds', arr);
  },

  _submitForm(_e) {
    const payload = {
      search_term: this.queryTerm,
    };
    this.$.request.body = payload;
    this.nextSearch(0);
  },

  nextSearch(index) {
    console.log('nextSearch', this.clouds.length, index);
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
    if (this.clouds && this.clouds.length && index < this.clouds.length) {
      this.$.request.url = `/api/v1/clouds/${this.get(
        `clouds.${index}.id`
      )}/images`;
      this.$.request.generateRequest();
    } else {
      this.set('activeSearchIndex', 0);
    }
  },

  hotkeys(e) {
    // ENTER
    if (e.keyCode === 13 && this.queryTerm.length) {
      this._submitForm(e);
    }
  },
});
