/* needed for the forms' inputs */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '../../node_modules/@polymer/polymer/polymer-legacy.js';

import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-radio-group/paper-radio-group.js';
import '../../node_modules/@polymer/paper-radio-button/paper-radio-button.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-menu-button/paper-menu-button.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-input/paper-input-behavior.js';
import '../../node_modules/@polymer/paper-slider/paper-slider.js';
import '../../node_modules/@polymer/paper-input/paper-input-addon-behavior.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import './sub-fieldgroup.js';
import './sub-form.js';
import './mist-size-field.js';
import './mist-networks-field.js';
import './mist-machine-field.js';
import './mist-tags-field.js';
import './duration-field.js';
import moment from '../../node_modules/moment/src/moment.js'
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import '../../node_modules/@fooloomanzoo/datetime-picker/datetime-picker.js';
import { YAML } from '../../node_modules/yaml/browser/dist/index.js';

Polymer({
  _template: html`
        <style include="shared-styles forms">
            :host {
                display: block;
            }
            paper-material {
                display: block;
                padding: 24px;
            }

            paper-progress {
                width: 100%;
                left: 0;
                right: 0;
            }

            :host paper-input-container {
                padding-top: 16px;
                padding-bottom: 16px;
            }

            :host([inline]) .grid {
                display: inline-flex;
                justify-content: flex-start;
                align-items: center;
                align-self: center;
                flex-wrap: wrap;
            }

            :host([inline]) .grid-row {
                display: inline-block;
                margin-left: 0;
                margin-right: 0;
                max-width: 97%;
            }

            :host([single-column]) .grid-row {
                width: 97%;
            }

            :host([inline]) .grid-row h3,
            :host([inline]) .grid-row .field-helptext {
                padding: 0;
                margin: 0;
                display: none !important;
            }

            :host .width-150 {
                width: 150px !important;
                max-width: 150px !important;
            }

            :host .inline-block {
                display: inline-block !important;
            }
            :host([no-helptexts]) .grid-row .field-helptext {
                display: none;
            }
            :host([no-horizontal-margins]) .grid-row {
                margin-left: 0;
                margin-right: 0;
            }
            :host([single-column]:not([inline])) .grid-row {
                flex-wrap: wrap-reverse;
                margin-top: 16px !important;
                margin-bottom: 16px !important;
            }
            :host([single-column]:not([inline])) .grid-row > * {
                margin-top: 0 !important;
            }

            :host([single-column]) .m6,
            :host([single-column]) .m12 {
                flex-basis: 100% ;
            }

            :host([indialog]) sub-fieldgroup {
                width: 100%;
                padding-bottom: 24px;
            }

            .grid-row {
                position: relative;
            }

            .grid-row>* {
                margin-top: 8px;
                margin-bottom: 8px;
                max-width: 100%;
            }

            h2.title {
                line-height: 20px;
            }

            paper-toggle-button[disabled]::slotted() {
                color: rgba(0, 0, 0, 0.32);
            }

            paper-toggle-button::slotted(paper-input-container input) {
                color: rgba(0, 0, 0, 0.54);
            }

            paper-button.simple-button {
                vertical-align: middle;
                padding: 4px 8px 4px 2px !important;
            }

            paper-button.simple-button>iron-icon {
                margin-right: 8px;
            }

            *:not(paper-button)[hidden] {
                display: none;
            }

            paper-button.add-input {
                margin: 0 12px 4px 12px !important;
                flex: 1 100%;
                display: flex;
            }

            paper-icon-button.docs {
                opacity: 0.54;
                width: 36px;
                height: 36px;
            }

            paper-icon-button.clear-datetime {
                padding: 0;
                width: 24px;
                height: 24px;
            }

            paper-item.button-true {
                background-color: #2196F3 !important;
                font-weight: 500 !important;
                color: #fff !important;
                text-transform: uppercase;
            }

            .pull-left {
                float: left;
            }

            .progress {
                margin: 32px 0 8px 0;
                width: 100%;
            }

            paper-progress#progresserror ::slotted(#primaryProgress) {
                background-color: var(--red-color);
            }

            .errormsg-container {
                color: var(--red-color);
            }

            .errormsg-container iron-icon {
                color: inherit;
                vertical-align: bottom;
                margin-right: 8px;
            }

            .field-icon {
                color: rgba(0, 0, 0, 0.32);
                margin-right: 4px;
            }

            paper-dropdown-menu ::slotted(.dropdown-content) {
                max-height: 300px !important;
            }

            .radio-highight .iron-selected {
                background-color: #eee;
            }

            .bind-top {
                margin-top: 0 !important;
                margin-bottom: 24px !important;
                padding-bottom: 24px !important;
            }

            .bind-bottom {
                margin-bottom: 0 !important;
                margin-top: 24px !important;
            }

            .bind-both {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
            }

            .date.bind-top {
                padding-top: 24px !important;
            }

            .margin-bottom {
                margin-top: 0 !important;
                margin-bottom: 20px !important;
            }

            .background {
                background-color: #eee;
            }

            .pad-0 {
                padding: 0;
            }
            .pad-r-0 {
                padding-right: 0;
            }
            .pad-l-0 {
                padding-left: 0;
            }
            .pad-l-32 {
                padding-left: 32px;
            }
            .pad-t {
                padding-top: 16px;
            }

            paper-radio-group {
                display: flex;
                flex-wrap: nowrap;
            }

            paper-radio-group.background {
                padding-left: 0;
                padding-right: 0;
            }

            .field-helptext.background {
                background-color: transparent;
            }

            .bottom-actions {
                padding: 0;
                text-align: right;
            }

            #dateTimePickers .bottom-actions {
                display: flex;
                justify-content: flex-end;
                padding: 16px 24px !important;
                background-color: #424242;
                color: rgba(255, 255, 255, 0.54);
                border-top: 1px solid #555;
            }

            paper-toggle-button {
                margin-top: 16px;
                margin-bottom: 16px;
            }

            paper-checkbox {
                display: block;
            }

            .checkboxes-label {
                margin: 16px 0 8px 0;
                display: block;
            }

            .checkboxes {
                max-height: 400px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            .date {
                @apply --layout-horizontal;
                align-items: baseline;
            }

            .date-label {
                margin-right: 4px;
            }

            paper-dialog>* {
                margin: 0 !important;
                padding: 0 !important;
            }

            paper-dialog>.never-date {
                background-color: #424242;
                padding: 16px !important;
            }

            paper-checkbox {
                --paper-checkbox-checked-color: var(--mist-blue) !important;
                --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
            }

            paper-slider::slotted(.slider-input) {
                width: 120px !important;
            }

            paper-input.search {
                padding-left: 16px;
                padding-right: 16px;
            }

            h3 {
                margin-top: 36px !important;
                font-weight: 500;
                font-size: 18px;
            }

            paper-textarea.script {
                --paper-input-container-shared-input-style_-_font-family: monospace;
            }

            paper-checkbox {
                position: relative;
                margin-bottom: 8px;
            }
            paper-checkbox.single-checkbox {
                margin: 16px 0;
            }

            paper-checkbox .item-desc{
                display: inline-block;
                vertical-align: top;
            }

            paper-checkbox .item-desc.noimg-false {
                padding-left: 24px;
            }

            paper-checkbox .item-img {
                position: absolute;
            }

            paper-input[type="datetime-local"] {
                display: inline-block;
                margin-left: 8px;
                max-width: 200px;
            }
            #date.valid-false {
                color: var(--red-color) !important;
            }
            #date.valid-false iron-icon {
                fill: var(--red-color) !important;
            }
            datetime-picker {
                --calendar-cell-hovered-background: var(--mist-blue) !important;
            }
            iron-icon.datetime-clear {
                width: 16px;
                height: 16px;
                cursor: pointer;
                position: absolute;
                top: 8px;
            }
            .date {
                padding-right: 0;
                position: relative;
            }
            .datetime-picker-with-button {
                position: relative;
                display: inline-block;
            }
            .date .error {
                color: var(--red-color);
                position: absolute;
                font-size: .9em;
                bottom: -1.2em;
            }

            @media (max-width: 991px) {
                :host div.field-helptext {
                    margin-top: -10px !important;
                }
                :host div.field-helptext.background,
                :host div.field-helptext.bind-bottom {
                    background-color: #eee;
                    padding: 14px 16px 0;
                }
                :host div.field-helptext.bind-bottom {
                    margin: 0 !important;
                }
                :host div.field-helptext.background {
                    margin-top: -10px !important;
                }
                .bind-top {
                    margin-bottom: 0 !important;
                }
            }

            @media screen and (max-width: 420px) {
                paper-button#reset {
                    padding: 0.8em 0 0.7em 0;
                }
            }

            .horizontal-grid .grid-row {
                flex-direction: column;
                display: inline-flex;
                padding: 0 16px;
                width: 50%;
            }

            .horizontal-grid .field-helptext {
                align-self: flex-start;
            }

            paper-listbox img {
                margin-right: 8px;
                vertical-align: middle;
            }

            @media screen and (max-width: 800px) {
                .horizontal-grid .grid-row {
                    flex-direction: column;
                    display: inline-flex;
                    padding: 0 1em;
                    width: 100%;
                }
            }

            subfield-group {
                background-color: #ddd;
            }

            :host paper-spinner {
                padding: 8px 41%;
            }
            .spinner-wrapper {
                width: 210px;
                position: relative;
                height: 40px;
            }
            span.checkboxes-category {
                margin-top: 16px;
                margin-bottom: 8px;
                display: block;
            }
            span.option-description {
                font-size: 14px;
                align-self: center;
                color: rgba(0, 0, 0, 0.54);
            }
        </style>

        <div class\$="grid [[_computeLayoutClass(horizontalLayout)]]">
            <template id="app-form-[[id]]" is="dom-repeat" items="{{fields}}" as="field">
                <template is="dom-if" if="[[_showField(field, index, fieldVisibility.*)]]" restamp="">
                    <div class="grid-row">
                        <h3 class="xs12 s12 m12 l12" hidden\$="[[!field.h3]]">[[field.h3]]</h3>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'text', fieldVisibility, index)]]" restamp="">
                            <paper-input class\$="xs12 m6 [[field.class]]" id\$="app-form-[[id]]-[[field.name]]" placeholder="[[field.placeholder]]" label="[[field.label]]" validator="[[field.validator]]" value="{{field.value}}" auto-validate="" pattern="[[field.pattern]]" required="[[field.required]]" error-message="[[field.errorMessage]]" disabled="[[field.disabled]]" always-float-label="[[field.alwaysFloatLabel]]" hidden\$="[[field.hidden]]">
                                <div suffix="" hidden\$="[[!field.suffix]]" slot="suffix">[[field.suffix]]</div>
                                <div prefix="" hidden\$="[[!field.prefix]]" slot="prefix">[[field.prefix]]</div>
                            </paper-input>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'number', fieldVisibility, index)]]" restamp="">
                            <paper-input class\$="xs12 m6 [[field.class]]" id\$="app-form-[[id]]-[[field.name]]" placeholder="[[field.placeholder]]" label="[[field.label]]" type="number" min="{{field.min}}" max="{{field.max}}" value="{{field.value}}" auto-validate="" allowed-pattern="[[field.pattern]]" required="[[field.required]]" error-message="[[field.errorMessage]]" disabled="[[field.disabled]]" hidden="[[field.hidden]]" always-float-label="[[field.alwaysFloatLabel]]">
                                <div suffix="" hidden\$="[[!field.suffix]]" slot="suffix">[[field.suffix]]</div>
                                <div prefix="" hidden\$="[[!field.prefix]]" slot="prefix">[[field.prefix]]</div>
                            </paper-input>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'password', fieldVisibility, index)]]" restamp="">
                            <paper-input class\$="xs12 m6 [[field.class]]" id\$="app-form-[[id]]-[[field.name]]" type="password" placeholder="[[field.placeholder]]" label="[[field.label]]" value="{{field.value}}" pattern="[[field.pattern]]" auto-validate="" required="[[field.required]]" error-message="[[field.errorMessage]]" always-float-label="[[field.alwaysFloatLabel]]"></paper-input>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'textarea', fieldVisibility, index)]]" restamp="">
                            <paper-textarea class\$="xs12 m6 [[field.class]]" id\$="app-form-[[id]]-[[field.name]]" label="[[field.label]]" rows="2" max-rows="10" value="{{field.value}}" placeholder="[[field.placeholder]]" auto-validate="" required="[[field.required]]" error-message="[[field.errorMessage]]" disabled="[[field.disabled]]" hidden="[[field.hidden]]" always-float-label="[[field.alwaysFloatLabel]]"></paper-textarea>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'ip_textarea', fieldVisibility, index)]]" restamp="">
                            <paper-textarea class\$="xs12 m6 [[field.class]]" id\$="app-form-[[id]]-[[field.name]]" label="[[field.label]]" rows="2" max-rows="15" value="{{field.value}}" placeholder="[[field.placeholder]]" auto-validate="" required="[[field.required]]" error-message="[[field.errorMessage]]" disabled="[[field.disabled]]" always-float-label="[[field.alwaysFloatLabel]]"></paper-textarea>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'jsoneditor', fieldVisibility, index)]]" restamp="">
                            <juicy-jsoneditor class\$="xs12 m6 [[field.class]]" id\$="app-form-[[id]]-[[field.name]]" name="[[field.name]]" json="{{field.value}}" mode="code"></juicy-jsoneditor>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'radio', fieldVisibility, index)]]" restamp="">
                            <paper-radio-group id\$="app-form-[[id]]-[[field.name]]" selected="{{field.value}}" class\$="xs12 m6 [[field.class]]" disabled="[[field.disabled]]" hidden="[[field.hidden]]">
                                <template is="dom-repeat" items="[[field.options]]" as="option">
                                    <paper-radio-button id\$="app-form-[[id]]-[[field.name]]" name="[[option.val]]" disabled="[[option.disabled]]">[[option.title]]</paper-radio-button>
                                </template>
                            </paper-radio-group>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'checkbox', fieldVisibility, index)]]" restamp="">
                            <div id\$="app-form-[[id]]-[[field.name]]" class\$="dropdown-block xs12 m6 [[field.class]] checkboxes" hidden\$="[[field.hidden]]">
                                <paper-checkbox class="single-checkbox" name\$="[[field.name]]" checked="{{field.value}}">
                                    <span data-prefix\$="[[field.prefix]]" data-suffix\$="[[field.suffix]]">[[field.label]]</span>
                                </paper-checkbox>
                            </div>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'checkboxes', fieldVisibility, index)]]" restamp="">
                            <div id\$="app-form-[[id]]-[[field.name]]" class\$="dropdown-block xs12 m6 [[field.class]] checkboxes" hidden\$="[[field.hidden]]">
                                <div hidden\$="[[!_noOptions(field.options, field.options.length)]]">
                                    <paper-item disabled="">No [[_computeResourceTypeForField(field.name, field.options.length)]] found. [[field.noOptionsMessage]]</paper-item>
                                </div>
                                <div hidden\$="[[_noOptions(field.options, field.options.length)]]">
                                    <span class="checkboxes-label" hidden\$="[[field.label]]">[[field.name]]:</span>
                                    <span class="checkboxes-label" hidden\$="[[!field.label]]">[[field.label]]:</span>
                                </div>
                                <template is="dom-repeat" items="[[field.options]]" as="option">
                                    <template is="dom-if" if="[[!option.id]]">
                                        <span class="checkboxes-category"><strong>[[option]]</strong></span>
                                    </template>
                                    <template is="dom-if" if="[[option.id]]">
                                        <paper-checkbox name\$="[[field.name]]" on-change="_updateCheckboxesField" id\$="[[option.id]]" title\$="[[option.tooltip]]">
                                            <template is="dom-if" if="[[option.img]]">
                                                <img class="item-img" src="[[option.img]]" width="24px">
                                            </template>
                                            <span class\$="item-desc noimg-[[!option.img]]" data-prefix\$="[[option.prefix]]" data-suffix\$="[[option.suffix]]">[[option.name]]</span>
                                            <span class="option-description"><br>[[option.description]]</span>
                                        </paper-checkbox>
                                    </template>
                                </template>
                            </div>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'dropdown', fieldVisibility, index)]]" restamp="">
                            <paper-dropdown-menu id\$="app-form-[[id]]-[[field.name]]" class\$="dropdown-block xs12 m6 [[field.class]]" label="[[field.label]]" horizontal-align="left" disabled="[[field.disabled]]" hidden="[[field.hidden]]" required="[[field.required]]" no-label-float="[[!field.label]]" always-float-label="[[field.alwaysFloatLabel]]">
                                <paper-listbox slot="dropdown-content" id\$="app-form-[[id]]-[[field.name]]" attr-for-selected="value" selected="{{field.value}}" class="dropdown-content">
                                    <template is="dom-if" if="[[_noOptions(field.options, field.options.length)]]" restamp="">
                                        <paper-item disabled="">No [[_computeResourceTypeForField(field.name, field.options.length)]] found. [[field.noOptionsMessage]]</paper-item>
                                    </template>
                                    <template is="dom-repeat" items="[[field.options]]" as="option">
                                        <paper-item value="[[option.val]]" disabled="[[option.disabled]]">[[option.title]]</paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'mist_size', fieldVisibility, index)]]" restamp="">
                            <mist-size-field id\$="app-form-[[id]]-[[field.name]]" class="xs12 m6" field="{{field}}"></mist-size-field>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'mist_machine', fieldVisibility, index)]]" restamp="">
                            <mist-machine-field id\$="app-form-[[id]]-[[field.name]]" class="xs12 m6" field="{{field}}"></mist-machine-field>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'mist_networks', fieldVisibility, index, field.options)]]" restamp="">
                            <mist-networks-field id\$="app-form-[[id]]-[[field.name]]" class="xs12 m6" field="{{field}}"></mist-networks-field>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'mist_tags', fieldVisibility, index)]]" restamp="">
                            <mist-tags-field id\$="app-form-[[id]]-[[field.name]]" class="xs12 m6" field="{{field}}"></mist-tags-field>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'duration_field', fieldVisibility, index)]]" restamp="">
                            <duration-field id\$="app-form-[[id]]-[[field.name]]" class\$="xs12 m6 {{field.class}}" field="{{field}}">
                        </duration-field></template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'mist_dropdown', fieldVisibility, index)]]">
                            <paper-dropdown-menu class\$="dropdown-block xs12 m6 [[field.class]]" label="[[field.label]]" horizontal-align="left" disabled="[[field.disabled]]" hidden="[[field.hidden]]" required="[[field.required]]" always-float-label="[[field.alwaysFloatLabel]]">
                                <paper-listbox slot="dropdown-content" id\$="app-form-[[id]]-[[field.name]]" attr-for-selected="value" selected="{{field.value}}" class="dropdown-content">
                                    <template is="dom-if" if="[[_noOptions(field.options, field.options.length)]]" restamp="">
                                        <paper-item disabled="">No [[_computeResourceTypeForField(field.name, field.options.length)]] found.[[field.noOptionsMessage]]</paper-item>
                                    </template>
                                    <template is="dom-repeat" items="[[field.options]]" as="option">
                                        <paper-item value="[[_getPayloadValue(field,option)]]" class\$="button-[[option.button]]" disabled\$="[[option.disabled]]">
                                            <template is="dom-if" if="[[option.icon]]">
                                                <iron-icon class="field-icon" icon="[[option.icon]]"></iron-icon>
                                            </template>
                                            <template is="dom-if" if="[[option.img]]">
                                                <img src="[[option.img]]" width="24px">
                                            </template>
                                            <span class="flex item-desc" data-prefix\$="[[option.prefix]]" data-suffix\$="[[option.suffix]]">[[showOption(option,field)]]</span>
                                        </paper-item>
                                    </template>
                                    <paper-button on-tap="_addInput" class="blue add-input" hidden\$="[[!field.add]]">Add [[_computeResourceTypeForField(field.name)]]</paper-button>
                                </paper-listbox>
                            </paper-dropdown-menu>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'mist_dropdown_searchable', fieldVisibility, index)]]">
                            <paper-dropdown-menu class\$="dropdown-block xs12 m6 [[field.class]]" label="[[field.label]]" horizontal-align="left" disabled="[[field.disabled]]" hidden="[[field.hidden]]" always-float-label="[[field.alwaysFloatLabel]]">
                                <div slot="dropdown-content" class="dropdown-content">
                                    <paper-input class="search" label\$="Search [[field.name]]s" value="{{field.search}}" data-options\$="[[field.name]]" hidden\$="[[_noOptions(field.options, field.options.length)]]"></paper-input>
                                    <paper-listbox id\$="app-form-[[id]]-[[field.name]]" attr-for-selected="value" selected="{{field.value}}">
                                        <template is="dom-if" if="[[_noOptions(field.options, field.options.length, field.loader)]]" restamp="">
                                            <paper-item disabled="">No [[_computeResourceTypeForField(field.name, field.options.length)]] found. [[field.noOptionsMessage]]</paper-item>
                                        </template>
                                        <template is="dom-if" if="[[field.loader]]" restamp="">
                                            <div class="spinner-wrapper">
                                                <paper-spinner active="[[field.loader]]"></paper-spinner>
                                            </div>
                                        </template>
                                        <template is="dom-repeat" items="[[_filter(field.options, field.search)]]" as="option">
                                            <paper-item value="[[_getPayloadValue(field,option)]]" class\$="button-[[option.button]]" disabled\$="[[option.disabled]]">
                                                <template is="dom-if" if="[[option.icon]]">
                                                    <iron-icon class="field-icon" icon="[[option.icon]]"></iron-icon>
                                                </template>
                                                <span class="flex">[[showOption(option,field)]]</span>
                                            </paper-item>
                                        </template>
                                        <paper-button on-tap="_addInput" class="blue add-input" hidden\$="[[!field.add]]">Add [[_computeResourceTypeForField(field.name)]]</paper-button>
                                    </paper-listbox>
                                </div>
                            </paper-dropdown-menu>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'slider', fieldVisibility, index)]]">
                            <div class="xs12 m12 l12" hidden="[[field.hidden]]">[[field.label]]
                                <span class="field-helptext">min [[field.min]], max [[field.max]] [[field.unit]]</span>
                            </div>
                            <paper-slider class\$="xs12 m6 [[field.class]]" disabled="[[field.disabled]]" hidden="[[field.hidden]]" min="[[field.min]]" max="[[field.max]]" value="{{field.value}}" step="[[field.step]]" pin="" snaps="" editable=""></paper-slider>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'ssh_key', fieldVisibility, index)]]">
                            <paper-dropdown-menu class="dropdown-block xs12 m6" label="[[field.label]]" horizontal-align="left" hidden\$="[[field.hidden]]">
                                <div slot="dropdown-content" class="dropdown-content" always-float-label="[[field.alwaysFloatLabel]]">
                                    <paper-input class="search" label\$="Search [[field.name]]s" value="{{field.search}}" data-options\$="[[field.name]]"></paper-input>
                                    <paper-listbox id\$="app-form-[[id]]-[[field.name]]" attr-for-selected="value" selected="{{field.value}}">
                                        <template is="dom-repeat" items="[[_filter(field.options, field.search)]]" as="option">
                                            <paper-item value="[[option.id]]">[[option.name]]</paper-item>
                                        </template>
                                        <paper-button on-tap="_addKey" class="blue add-input">Add Key</paper-button>
                                    </paper-listbox>
                                </div>
                            </paper-dropdown-menu>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'toggle', fieldVisibility, index)]]">
                            <div class="xs12 m6">
                                <paper-toggle-button id\$="app-form-[[id]]-[[field.name]]" checked="{{field.value}}" disabled="[[field.disabled]]" hidden\$="[[field.hidden]]">
                                    <span hidden\$="[[!field.label]]">[[field.label]]</span>
                                    <span hidden\$="[[field.label]]">[[field.name]]</span>
                                </paper-toggle-button>
                            </div>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'date', fieldVisibility, index)]]">
                            <div class\$="xs12 m6 date [[field.class]]">
                                <div class="date-label">[[field.label]]</div>
                                <div id="date" class\$="simple-button valid-[[_validateDatetime(field, field.value)]]">
                                    [[_displayDate(field, field.value)]]
                                    <iron-icon icon="schedule"></iron-icon>
                                    <div class="datetime-picker-with-button">
                                        <datetime-picker id\$="app-form-[[id]]-[[field.name]]" value="{{field.value}}" horizontal-align="right" auto-confirm="" hide-reset-button=""></datetime-picker>
                                        <iron-icon class="datetime-clear" icon="clear" on-tap="_clearDateTimeInput" hidden\$="[[_showClearDateBtn(field, field.value)]]"></iron-icon>
                                    </div>
                                </div>
                                <div class="error" hidden\$="[[_validateDatetime(field, field.value)]]">[[field.errorMessage]]</div>
                            </div>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'list', fieldVisibility, index)]]">
                            <div class\$="xs12 m6 [[field.class]]">
                                <span>
                                    <strong>[[field.label]]</strong>
                                </span>
                            </div>
                            <sub-form id\$="app-form-[[id]]-[[field.name]]" item-name="[[field.itemName]]" options="[[field.options]]" min="[[field.min]]" max="[[field.max]]" field-name="[[field.name]]" horizontal="[[f.horizontal]]" moderate-top="[[f.moderateTop]]" items="[[field.items]]" class\$="xs12 m12 [[field.class]]"></sub-form>
                        </template>
                        <template is="dom-if" if="[[_compareFieldType(field.type, 'fieldgroup', fieldVisibility, index)]]">
                            <sub-fieldgroup id\$="fieldgroup-[[id]]" field="[[field]]" class\$="xs12 m6 l6 [[field.class]]" optional=""></sub-fieldgroup>
                        </template>
                        <div class\$="field-helptext xs12 m6 [[field.class]]" hidden="[[!_hasHelptext(field)]]">[[field.helptext]]
                            <a hidden\$="[[!field.helpHref]]" href\$="[[field.helpHref]]" target="new" class="helpHref" on-tap="_helpTap">
                                <paper-icon-button icon="icons:help" alt="Open docs" title="Open docs" class="docs">
                                </paper-icon-button>
                            </a>
                            <p hidden\$="[[!field.warning]]">
                                <iron-icon icon="warning"></iron-icon>
                                [[field.warning]]
                            </p>
                            <div id="warningmsg"></div>
                        </div>
                        <template is="dom-if" if="[[field.isLead]]">
                            <hr class="xs12">
                        </template>
                    </div>
                </template>
            </template>

            <template is="dom-if" if="[[displayButtons]]">
                <div class="progress">
                    <paper-progress id="progress" indeterminate="" hidden\$="[[!loading]]"></paper-progress>
                    <paper-progress id="progresserror" value="100" hidden\$="[[!formError]]"></paper-progress>
                    <hr class="appform">
                    <p class="errormsg-container" hidden\$="[[!formError]]">
                        <iron-icon icon="icons:error-outline"></iron-icon>
                        <span id="errormsg"></span>
                    </p>
                </div>

                <div class="clearfix bottom-actions xs12">
                    <paper-button class\$="submit-btn [[btnClass]]" on-tap="_cancel" hidden\$="[[!showCancel]]">Cancel</paper-button>
                    <!--paper-button class="submit-btn pull-left" on-tap="_resetForm"><iron-icon icon="icons:refresh"></iron-icon>Reset Form</paper-button-->
                    <paper-button id="appformsubmit" class\$="submit-btn pull-right blue [[btnClass]]" disabled\$="[[!formReady]]" raised="" on-tap="_submitForm">
                        <template is="dom-if" if="[[btncontent]]">
                            [[btncontent]]
                        </template>
                        <template is="dom-if" if="[[!btncontent]]">
                            Add
                        </template>
                    </paper-button>
                </div>
            </template>
        </div>
        <iron-ajax id="getJSON" handle-as="json" last-response="{{data}}" on-response="_getJSONResponse" on-request="_getJSONRequest" on-error="_getJSONError"></iron-ajax>
        <iron-ajax id="formAjax" url="[[url]]" contenttype="application/json" handle-as="{{handleas}}" method="[[method]]" on-request="_handleRequest" on-response="_handleResponse" on-error="_handleError" loading="{{loading}}"></iron-ajax>
`,

  is: 'app-form',

  /**
   * Fired when a response is received.
   *
   * @event response
   */
  /**
   * Fired when a request is made.
   *
   * @event request
   */
  /**
   * Fired when the leadValue is changed.
   *
   * @event leadchange
   */
  properties: {
      id: {
          type: String
      },
      sections: {
          type: Object
      },
      section: {
          type: Object
      },
      color: {
          type: String,
          computed: '_getHeaderStyle(section)'
      },
      btncontent: {
          type: String,
          value: false
      },
      templateid: {
          type: String
      },
      handleas: {
          type: String,
          value: "xml"
      },
      form: {
          type: Object,
          value() {return {}},
          notify: true
      },
      fields: {
          type: Array,
          value(){
              return []
          },
          notify: true
      },
      method: {
          type: String,
          value: 'POST'
      },
      url: {
          type: String,
      },
      displayButtons: {
          type: Boolean,
          value: true
      },
      loading: {
          type: Boolean,
          value: false
      },
      alterrequest: {
          type: Boolean,
          value: false
      },
      formReady: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true
      },
      formError: {
          type: Boolean,
          value: false
      },
      workflow: {
          type: String
      },
      referral: {
          type: String
      },
      dateTriggerField: {
          type: Object,
          value(){
              return {}
          },
      },
      showCancel: {
          type: Boolean,
          value: false
      },
      horizontalLayout: {
          type: Boolean,
          value: false
      },
      formatPayload: {
          type: Boolean
      },
      singleColumn: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      inline: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      fieldVisibility: {
          type: Object
      },
      fieldIndex: {
          type: Number,
          value: -1
      },
      noAutoUpdate: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      btnClass: {
          type: String,
          value: ''
      }
  },

  observers: [
      '_fieldsChanged(fields.*, loading)'
  ],

  listeners: {
      'fields-changed': 'runFieldsChanged',
      'field-value-changed': 'runValidateFields',
      'app-form-ready': 'runValidateFields',
  },

  renderForm() {
      this.shadowRoot.querySelector(`#app-form-${this.id}`).render();
  },

  _computeLayoutClass (layout) {
      return this.horizontalLayout ? 'horizontal-grid' : '';
  },

  _clearDateTimeInput(e) {
      if (e && e.model && e.model.field) {
          const fieldName = e.model.field.name;
          const ind = this.fields.findIndex(function(f){ return f.name === fieldName})
          if (ind > -1) {
              this.set(`fields.${ ind }.value`, "");
          }
      }
  },

  _updateForm () {
      const uniqueFields = {};
      if (this.fields) {
          for (let i=0; i<this.fields.length; i++) {
              if (this.fields[i].defaultValue) {
                  uniqueFields[this.fields[i].name] = this.fields[i].defaultValue
              } else {
                  uniqueFields[this.fields[i].name] = null
              }
          }
      }
      this.set('form', uniqueFields);
      // console.log('app form - _updateForm', this.form);
  },

  showOption (option,field) {
      if (field.display)
          return option[field.display];
      if (option.title)
          return option.title;
      if (option.name)
          return option.name;
      if (option.id)
          return option.id;
  },

  _compareFieldType (fieldType, value, fieldVisibility, index) {
      // if (fieldType === 'fieldgroup') {
      //     console.log('fieldgroup visibility', fieldVisibility[index],fieldType === value)
      // }
      return fieldVisibility[index] && fieldType === value;
  },

  _handleRequest (e) {
      this.dispatchEvent(new CustomEvent("request", { bubbles: true, composed: true, detail:  e.detail }));
  },

  _handleResponse (e, d) {
      this.dispatchEvent(new CustomEvent("response", { bubbles: true, composed: true, detail:  e.detail }));
      // clear form only on response not on error
      this._resetForm();
      const overlay = document.querySelector('vaadin-dialog-overlay');
      if (overlay) {
          overlay.opened = false;
      }
  },

  _handleError (e, d) {
      this.set('formError', true);
      console.log('FAIL', e)
      // this.$.errormsg.textContent = e.detail.request.xhr.response.body.innerText;
      this.shadowRoot.querySelector("#errormsg").textContent = e.detail.request.xhr.responseText;
  },

  runFieldsChanged (e) {
      console.log('rule form - fields changed by event', e);
      this._fieldsChanged();
  },

  runValidateFields() {
      const valid = this._validateFields();
      const prevFormReady = this.formReady;
      this.set('formReady', valid && !this.loading);

      console.log("form validate =====", this.id, this.formReady);

      if (!prevFormReady && this.formReady) {
          this.fire('app-form-ready');
      }
  },

  _updateScheme(fieldname, value) {
      if (value) {
          const fieldIndex = this.fields.findIndex(function(f){
              return f.name === fieldname;
          });
          if (fieldIndex > -1) {
              this.set('fieldIndex', fieldIndex);
              const field =  this.fields[fieldIndex];
              this.$.getJSON.url = `./src${  field.loadSchemeFolder  }${  value  }.json`;
              this.$.getJSON.headers["Content-Type"] = 'application/json';
              this.$.getJSON.headers["Csrf-Token"] = CSRFToken.value;
              this.$.getJSON.generateRequest();
          }
      }
  },

  _getJSONResponse(e) {
      e.stopPropagation();
      console.log('getJSON response', e.detail.response);
      if (this.fieldIndex > -1 ) {
          const field = this.get(`fields.${  this.fieldIndex}`);
          let options = 'options'
          if (field.type === 'fieldgroup'){
              options = 'subfields';
          }

          this.set(`fields.${ this.fieldIndex }.${ options}`, e.detail.response[options]);
          this.set(`fields.${ this.fieldIndex }.helptext`, e.detail.response.helptext);
          this.set(`fields.${ this.fieldIndex }.label`, e.detail.response.label);

          this.notifyPath(`fields.${ this.fieldIndex}.${ options}`);
          this.set(`fieldVisibility.${ this.fieldIndex}`, true);
      }
  },

  _getJSONRequest(e) {
      e.stopPropagation();
      console.log('_getJSON Request', e);
  },

  _getJSONError(e) {
      e.stopPropagation();
      console.log('_getJSON Error', e);
      this.set('fieldIndex', -1);
  },

  _fieldsChanged (fields, loading) {
      // console.log('_fieldsChanged', fields ? fields.path : 'run by event')
      if (this.formError) {
          this.set('formError', false);
      }
      if (!this.fields)
          return;

      if (fields && fields.path && fields.path === 'fields') {
          // console.log('app form - fields changed. changerecord', fields);
          if (!this.noAutoUpdate)
              this._updateForm();
          // construct fieldVisibility
          const fv = {};
          for (let i = this.fields.length - 1; i >= 0; i--) {
              fv[i] = this.fields[i].show;
          }
          this.set('fieldVisibility', fv);
          // console.log('app form - fieldVisibility recalculated', fv);
          // console.log('fieldVisibility', this.fieldVisibility);
      }
      // a consumer changed show values
      if (fields && fields.path.endsWith('.show')) {
          const index = parseInt(fields.path.split('.')[1]);
          this.set(`fieldVisibility.${  index}`, fields.value);
          // console.log('app form - a consumer changed show values: new fv ', fv);
      }
      if (fields && !fields.path.endsWith('.show') && !fields.path.endsWith('.loader')) {
          const that = this;

          this.debounce('fieldsChangedDebouncer', function () {
              const {form} = that;
                  let show = true;
                  let dependency; const reset = true;

              // Update show field flag after calculating dependencies
              that.fields.forEach(function (el, index) {

                  if (el.eventOnChange) {
                      if(el.previousValue !== el.value){
                          el.previousValue = el.value
                          that.dispatchEvent(new CustomEvent(el.eventOnChange, {bubbles: true, composed: true}));
                      }
                  }
                  if (el.name === "expiration") {
                      // console.log(el.value);
                  }
                  if (el.type === "fieldgroup") {
                      console.log('fieldgroup', that.id, 'el', el.name, el.value);
                  }
                  if (el.loadScheme && el.schemeName) {
                      // console.log('fieldgroup', that.id, 'el', el.name, el.value);
                  }
                  // if field determines a scheme for another field
                  if (el.schemeLoaderFor && (fields.path === 'fields' || fields.path === `fields.${ index }.value`)) {
                      that._updateScheme(el.schemeLoaderFor, el.value);
                  }
                  // if field has a dependency
                  if (el.showIf) {
                      dependency = form[el.showIf.fieldName];
                      if (el.showIf.fieldExists) {
                          show = (dependency !== undefined);
                      } else {
                          show = el.showIf.fieldValues.indexOf(dependency) !=
                              -1;
                      }

                      // check for second level dependency
                      const parent = that.fields.find(function (f) {
                          return f.name === el.showIf.fieldName;
                      });

                      if (parent && parent.showIf) {
                          let parentShow;
                              const parentDependency = form[parent.showIf.fieldName];

                          if (parent.showIf.fieldExists) {
                              parentShow = !!parentDependency;
                          } else {
                              parentShow = parent.showIf.fieldValues.indexOf(
                                  parentDependency) !== -1;
                          }
                          show = show && parentShow;
                      }

                      that.set(`fieldVisibility.${  index}`, show);
                      // console.log('form set visibility', el.name , show);

                      // update form values regardless of el.show
                      if (el.type === 'list') {
                          var subformPayload = [];
                          if (el.items && el.items.length) {
                              for (var i = 0; i < el.items.length; i++) {
                                  var fieldPayload = {};
                                  for (var j = 0; j < el.items[i].length; j++) {
                                      if (that._includeInPayload(el.items[i], el.items[
                                              i][j]))
                                          fieldPayload[el.items[i][j].name] = el.items[i][j].value;
                                  }
                                  subformPayload.push(fieldPayload);
                              }
                          }
                          el.value = subformPayload;
                          that.set(`form.${  el.name}`, el.value);
                      } else if (el.type === "ip_textarea") {
                          var textToArray = el.value.split('\n');
                          that.set(`form.${  el.name}`, textToArray);
                      } else if (el.name === "machines_tags") {
                          var textToArray = el.value.split(',');
                          that.set(`form.${  el.name}`, that._constructTagsValue(
                              textToArray));
                      } else if (el.type === "checkboxes") {
                          that.set(`form.${  el.name}`, el.value || []);
                      } else if (el.type === "number") {
                          that.set(`form.${  el.name}`, parseInt(el.value));
                      } else if (el.type === "date" && el.value) {
                          that.set(`form.${  el.name}`, el.value);
                      } else {
                          that.set(`form.${  el.name}`, el.value);
                      }
                  } else if (el.type === 'list') {
                          var subformPayload = [];
                          if (el.items && el.items.length) {
                              for (var i = 0; i < el.items.length; i++) {
                                  var fieldPayload = {};
                                  for (var j = 0; j < el.items[i].length; j++) {
                                      if (that._includeInPayload(el.items[i], el.items[
                                              i][j]))
                                          fieldPayload[el.items[i][j].name] = el.items[i][j].value;
                                  }
                                  subformPayload.push(fieldPayload);
                              }
                          }
                          el.value = subformPayload;
                          that.set(`form.${  el.name}`, el.value);
                      } else if (el.type === "ip_textarea") {
                          var textToArray = el.value.split('\n');
                          that.set(`form.${  el.name}`, textToArray);
                      } else if (el.name === "machines_tags") {
                          var textToArray = el.value.split(',');
                          that.set(`form.${  el.name}`, that._constructTagsValue(
                              textToArray));
                      } else if (el.type === "checkboxes") {
                          that.set(`form.${  el.name}`, el.value || []);
                      } else if (el.type === "number") {
                          that.set(`form.${  el.name}`, parseInt(el.value));
                      } else if (el.type === "date" && el.value) {
                          that.set(`form.${  el.name}`, el.value);
                      } else {
                          that.set(`form.${  el.name}`, el.value);
                      }

                  // if field is a dependency of another field
                  that.fields.forEach(function (depel, index) {
                      if (depel.showIf &&
                          depel.showIf.fieldName !== 'yaml_or_form' &&
                          depel.showIf.fieldName === el.name) {
                          if (depel.options) {
                              that.set(`fields.${  index  }.options`,
                                  depel.options);
                          }
                      }
                  });
              });
              that.set('form', form);
              that.runValidateFields();
          },100);
      }
  },

  _validateFields (fields) {
      const fieldsToValidate = fields || this.fields;
          const fieldTypeValidators = {
              'ip_textarea': this._validateCidrArray,
              'machines_tags': this._validateTags,
              'date': this._validateDatetime,
              'mist_size': this._validateMistSize,
              'list': this._validateList,
              'duration_field': this._validateDurationField,
              'fieldgroup': this._validateGroup
          };
          const customValidators = {
              'cidr-validator': this._validateCidr,
              'ip-validator': this._validateIp,
          };
      return fieldsToValidate.every(function (el, index) {
          const fieldIndex = this.fields.findIndex(function(f){return f.name === el.name});

          // If field is not required or not visible then all is well // TODO: a non-required field should also be validated
          if (!el.required || !this.fieldVisibility[fieldIndex]) return true;

          // If there's a custom validator for the field use it
          if (el.validator && customValidators[el.validator]) {
              return customValidators[el.validator].bind(this)(el);
          }

          // Otherwise look for a field type validator
          if (fieldTypeValidators[el.type]) {
              return fieldTypeValidators[el.type].bind(this)(el);
          }

          // If the field has a pattern validate that
          if (el.pattern) return this._validatePatternedField(el);

          // Required checkboxes should be selected
          if (el.type === "checkboxes") {
              return !!el.value;
          }

          if (el.name === "cloud_init") {
              return typeof el.value === "string" && (el.value.startsWith("#!/bin/bash") || el.value.startsWith(
                                          "#cloud-config") || el.value.trim() === "");
          }

          if (el.type === "mist_machine" || el.type === "mist_networks") {
              return el.valid;
          }

          if (el.name === "admin_state_up" || el.type === "toggle" || el.type === "radio"){
              return  true;
          }

          return !!el.value;
      }.bind(this));
  },

  _validateDurationField(field) {
      return field.valid;
  },

  _validateList(field) {
      if (field.min && field.min > field.items.length) return false;

      let valid = true;
      for (let i = 0; i < field.items.length; i++) {
          valid = valid && this._validateFields(field.items[i]);
          if (!valid) {
              break;
          }
      }
      return valid;
  },

  _validateGroup(field) {
      let valid = true;
      for (let i = 0; i < field.subfields.length; i++) {
          valid = valid && this._validateFields(field.subfields[i]);
          if (!valid) {
              break;
          }
      }
      return valid;
  },

  _validateTags(field) {
      return JSON.stringify(this._constructTagsValue(
          field.value.split(','))).length > 2
  },

  _validateDatetime(el) {
      if (!el.value)
          return !el.required || !el.show;

      let valid;
      if (el.validate === "inFuture") {
          const now = moment();
          valid = moment(el.value).isValid() && !moment(el.value).isBefore(now);
      } else {
          valid = moment(el.value).isValid();
      }
      el.valid = valid;
      return valid;
  },

  _showClearDateBtn(el) {
      return el && el.value;
  },

  _validateMistSize (el) {
      return el.value === "custom" ? this._validateCustomValue(el.customSizeFields, el.customValue) : el.value.length;
  },

  _validateCustomValue (customSizeFields, customValue) {
      // console.log('_validateCustomValue',customSizeFields, customValue);
      if (customSizeFields && customValue) {
          for (let i=0; i<customSizeFields.length; i++) {
              if (customValue[customSizeFields[i].name] === undefined || customValue[customSizeFields[i].name] === ""){
                  console.warn(customValue[customSizeFields[i].name], ' not valid')
                  return false;
              }
          }
      } else {
          console.warn('customSizeFields empty')
      }
      return true;
  },

  _validatePatternedField (el) {
      const fieldName = this.id ? `paper-input#app-form-${  this.id  }-${  el.name}` :
          `paper-input#app-form--${  el.name}`;
      if (this.shadowRoot.querySelector(fieldName)) {
          return el.value && !this.shadowRoot.querySelector(fieldName).invalid;
      }
      return false;
  },

  _submitForm (e) {
      // notify the parent element to format the form's payload if necessary
      if (this.formatPayload){
          this.dispatchEvent(new CustomEvent('format-payload', {bubbles: true, composed: true}));
      }

      let payload = {};
      if (this.workflow) {
          const inps = YAML.parse(this.form.stackinputs) || {};
          for (var p in inps) {
              const field = this.fields.find((f) => { return f.name === p });
              if (field.excludeFromPayload === true) {
                  delete inps[p];
              } else {
                  if (p.startsWith('mist_location')) {
                      inps[p] = inps[p] !== undefined ? inps[p].toString() : '';
                  }
                  if (p.startsWith('mist_size')) {
                      if (field && field.type === 'mist_size' && field.value === 'custom') {
                          inps[p] = field.customValue;
                      }
                  }
                  if (field.preformatPayloadValue !== undefined && field.preformatPayloadValue.apply) {
                      inps[p] = field.preformatPayloadValue.apply(field.value);
                  }
              }
          }

          payload = {
              deploy: this.form.deploy,
              name: this.form.name,
              template_id: this.templateid,
              description: this.form.description,
              workflow: this.workflow,
              inputs: inps
          }
      } else {
          // payload = this.form;
          for (var p in this.form) {
              payload[p] = this.form[p]
          }

          // clean up form for payload
          const excludeFields = this.fields.filter(function (el) {
              return el.excludeFromPayload === true;
          });

          // if there's a list field add it as a nested object under the subform title.
          this.fields.forEach((field) => {
              if (field.type === 'mist_size' && field.value === "custom") {
                  payload[field.name] = field.customValue;
              }
              if (field.type === 'fieldgroup') {
                  if (!field.enabled) {
                      excludeFields.push(field);
                  } else {
                      for(const subfield of field.subfields){
                        if(subfield.type === 'list'){
                            const list = subfield;
                            var subformPayload = [];
                            if (list && list.items.length) {
                                for (let k = 0; k < list.items.length; k++) {
                                    var o = {};
                                    for (var j = 0; j < list.items[k].length; j++) {
                                        o[list.items[k][j].name] = list.items[k][j].value;
                                    }
                                    subformPayload.push(o);
                                }
                            }
                            field.value[subfield.name] = subformPayload;
                        } if (typeof field.value === "object") {
                            field.value[subfield.name] = subfield.value;
                            }
                      }
                      payload[field.name] = field.value;
                  }
              }
              if (field.type === 'duration-field' && field.value && field.valueType === 'date') {
                  payload[field.name] = this._updateDateCalculationOnRequest(field.value);
              }
              if (field.type === 'list') {
                  var subformPayload = [];
                  if (field.items && field.items.length) {
                      for (let i = 0; i < field.items.length; i++) {
                          var o = {};
                          for (var j = 0; j < field.items[i].length; j++) {
                              if (this._includeInPayload(field.items[i], field.items[
                                      i][j]))
                                  o[field.items[i][j].name] = field.items[i][j].value;
                          }
                          subformPayload.push(o);
                      }
                  }
                  payload[field.name] = subformPayload;
              } else if (field.type === 'date' && field.value) {
                  payload[field.name] = moment.unix(field.value/1000).utc().format("YYYY-MM-DD HH:mm:ss");
              }
          });

          for (let i = 0; i < excludeFields.length; i++) {
              delete payload[excludeFields[i].name];
          }
      }
      console.log('form _submitForm', payload, this.form);

      this.$.formAjax.headers["Content-Type"] = 'application/json';
      this.$.formAjax.headers["Csrf-Token"] = CSRFToken.value;
      this.$.formAjax.body = payload;
      this.$.formAjax.generateRequest();
  },

  _updateDateCalculationOnRequest(fieldValue) {
      return moment().add(span,unit).utc().format("YYYY-MM-DD HH:mm:ss");
  },

  _includeInPayload (list, field) {
      if (field.excludeFromPayload)
          return false;
      if (field.show && !field.showIf)
          return true;
      if (field.showIf && (field.showIf.fieldExists || field.showIf.fieldName)) {
          let d = list.find(function (f) {
              return f.name === field.showIf.fieldName;
          });
          // try in fields
          if (!d) {
              d = this.fields.find(function (l) {return l.name === field.showIf.fieldName;})
          }
          if (d && (field.showIf.fieldExists && d.value) || (field.showIf.fieldValues && field.showIf.fieldValues.indexOf(
                  d.value) > -1))
              return true;
      }
      return false;
  },

  _cancel () {
      const overlay = document.querySelector('vaadin-dialog-overlay');
      if (overlay)
          overlay.opened = false;
  },

  _resetForm (e) {
      // Reset script
      for (const attr in this.form) {
          this.set(`form.${  attr}`, '');
      }

      // Reset Form Fields
      this.fields.forEach(function (el, index) {
          if (el.showIf) {
              this.set(`fields.${  index  }.show`, false);
          }
          if (el.type === 'list') {
              for (let i = 0; i < el.options.length; i++) {
                  this.set(`fields.${  index  }.options.${  i  }.value`, this.get(
                      `fields.${  index  }.options.${  i
                      }.defaultValue`) || '')
              }
          }

          // Reset Form Fields Validation
          this._resetField(el, index);
      }.bind(this));
      this.dispatchEvent(new CustomEvent('reset-form'));
  },

  _resetField (el, index) {
      this.set(`fields.${  index  }.value`, el.defaultValue);
      const input = this.shadowRoot.querySelector(`#${  el.name}`);
      if (input) {
          input.invalid = false;
      }
  },

  _assertShowIfQuery (name) {
      this.fields.forEach(function (el, index) {
          if (el.showIf && el.showIf.fieldName === name) {
              if (this._query(el.showIf.query) in el.showIf.queryResult) {
                  this.set(`fields.${  index  }.options`, []);
              }
          }
      })
  },

  _recomputeDependentFields (name) {
      this.fields.forEach(function (el, index) {
          if (el.showIf && el.showIf.fieldName === name) {
              this.set(`fields.${  index  }.options`, []);
          }
      }.bind(this));
  },

  _validateIp (value, field) {
      const ipArray = value.split('\n');
      for (let i = 0; i < ipArray.length; i++) {
          if (!(
                  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
                  .test(ipArray[i].trim()))) {
              return false;
          }
      }
      return true;
  },

  _validateCidrArray (field) {
      const {value} = field;
      if (value === '' || value === undefined)
          return false;

      const ipArray = value.split('\n');
      if (ipArray.length === 0)
          return false;

      const ret = true;
      for (let i = 0; i < ipArray.length; i++) {
          ret === ret && this._validateCidr(ipArray[i]);
      }
      return ret;
  },

  _validateCidr (field) {
      return this._validateCidrValue(field.value);
  },

  _validateCidrValue(str) {
      if (str && !(/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(str.trim()))) {
          return false;
      }
      return true;
  },

  _validateIp(field) {
      const {value} = field
      if (value && !(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value.trim()))) {
          return false;
      }
      return true;
  },

  _addKey () {
      // set attribute origin
      const origin = window.location.pathname;
      const qParams = {
          'origin': origin
      }
      this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail:  {
          url: '/keys/+add',
          params: qParams
      } }));
  },

  _addInput (e) {
      this.dispatchEvent(new CustomEvent('add-input', { bubbles: true, composed: true, detail: {
          event: e,
          fieldname: e.model.field.name
      } }));

  },

  _computeResourceTypeForField (str, length) {
      let ret = str ? str.replace(/_[0-9]/g, " ").replace(/_/g, " ").replace(/mist/g, "").replace("*", "").replace("uuids", "").replace("ids", "").replace("id", "").replace(/s$/,'').trim() : '';
      if (length !== undefined && length > 1)
          ret += 's';
      return ret;

  },

  _displayDate (field, value) {
      if (!field.value || !moment.unix(field.value/1000).isValid()) {
          return field.placeholder ? field.placeholder : "SELECT DATE";
      }
          return moment.unix(field.value/1000).utc().fromNow();

  },

  _constructCheckboxValue (fieldname) {
      const checkboxes = this.shadowRoot.querySelectorAll(`paper-checkbox[name=${  fieldname  }]`); // get checkboxes
      const arr = [];
      checkboxes.forEach(function (c) {
          if (c.checked)
              arr.push(c.dataValue);
      })
      return arr;
  },

  _updateCheckboxesField (e) {
      // console.log('_updateCheckboxesField', e, e.model);
      const fieldInd = this.fields.findIndex(function (f) {
          return f.name === e.model.field.name;
      })
      const arr = this.get(`fields.${  fieldInd  }.value`) || [];
      if (fieldInd > -1) {
          if (e.target.checked && arr.indexOf(e.model.option.id) === -1)
              arr.push(e.model.option.id);
          else if (!e.target.checked && arr.indexOf(e.model.option.id) > -1)
              arr.splice(arr.indexOf(e.model.option.id),1)

          this.set(`fields.${  fieldInd  }.value`, arr);
      }
      // console.log('_updateCheckboxesField', arr);
  },

  _constructTagsValue (tagStringsArray) {
      const arr = {};
      tagStringsArray.forEach(function (string) {
          const chunks = string.split("=");
          if (chunks.length > 0 && chunks[0].trim().length > 0) {
              const key = chunks[0].trim();
              arr[key] = "";
              if (chunks.length > 1)
                  arr[key] = chunks[1].trim();
          }
      });
      return arr;
  },

  _helpTap (e) {
      this.dispatchEvent(new CustomEvent('user-action', { bubbles: true, composed: true, detail: `open help ${  e.model.field.helpHref}` }));
  },

  _noOptions (options, length, loader) {
      return !loader && (!options || options.length === 0);
  },

  _getPayloadValue(field, option) {
      if (!field.payloadValue){
          return option.id;
      }
          return option[field.payloadValue];

  },

  _filter (options, search) {
      if (!search)
          return options;
      return options.filter(function (op) {
          return op.name && op.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
  },

  _hasHelptext (field) {
      return field ? !field.hidden && (field.helptext || field.helpHref) : false;
  },

  _getFieldNameById (str) {
      return this.id ? str.split(`app-form-${  this.id  }-`)[1] : str.split('app-form--')[
          1];
  },

  _showField (field, index, fieldVisibility) {
      if (this.fieldVisibility) {
          // console.log('_showField', this.fieldVisibility)
          return this.fieldVisibility[index];
      }
      return true;
  }
});
