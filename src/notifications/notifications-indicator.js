import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-icons/iron-icons.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-item/paper-item-body.js';
import '../../../../@polymer/paper-badge/paper-badge.js';
import '../../../../@polymer/paper-spinner/paper-spinner.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/iron-ajax/iron-ajax.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import '../../../../moment/moment.js';
Polymer({
  _template: html`
        <style include="shared-styles">
            :host {
                position: relative;
                height: 56px;
                outline: none;
            }

            paper-item {
                cursor: pointer;
            }

            paper-icon-button[type=recommendations],
            iron-icon[type=recommendation] {
                -webkit-transform: rotate(180deg);
                /* Chrome and other webkit browsers */
                -moz-transform: rotate(180deg);
                /* FF */
                -o-transform: rotate(180deg);
                /* Opera */
                -ms-transform: rotate(180deg);
                /* IE9 */
                transform: rotate(180deg);
                /* W3C compliant browsers */
            }

            :host #notifications-menu {
                max-width: 460px;
            }

            #indicatorBadge {
                position: relative;
                left: 34px !important;
                top: -54px !important;
            }

            .grid-row h4 {
                color: #424242;
            }

            h4 {
                margin-left: 16px
            }

            .grid-row {
                padding: 0;
                margin: 0;
            }

            paper-item:not(.context) {
                padding: 8px 16px 8px 24px;
            }

            :host iron-icon {
                box-sizing: border-box;
                margin-right: 22px;
            }

            div.summary {
                padding-bottom: 2px;
            }

            div.body {
                white-space: normal;
                padding-bottom: 3px;
                color: #555;
            }

            div.time {
                padding-bottom: 4px;
                color: #888;
            }

            hr {
                margin: 0 !important;
                border: 1px solid #ddd !important;
            }

            .hide {
                display: none !important;
            }

            .tip {
                border-color: transparent;
                border-bottom-color: #fff;
                border-style: dashed dashed solid;
                border-width: 0 11px 9px;
                position: absolute;
                left: 17px;
                top: 50px;
                z-index: 1;
                height: 0;
                width: 0;
                opacity: 1;
                transition: opacity 0.4s ease-in-out, top 0.3s ease-in-out;
            }

            .tip[closed] {
                opacity: 0;
                top: 80px;
                transition: opacity 0s ease-in-out, top 0s ease-in-out;
            }

            .notification-actions {
                background: #efeff1;
            }

            #notification-actions-menu {
                background: none;
            }

            #spinner {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                bottom: 0;
                right: 0;
                background-color: rgba(255, 255, 255, 0.85);
                height: inherit;
            }

            #spinner paper-spinner {
                position: absolute;
                top: calc(50% - 14px);
                left: calc(50% - 14px);
            }
        </style>

        <!-- local DOM goes here -->
        <paper-menu-button id="notes" hidden="[[hidden]]" horizontal-align="right" vertical-offset="56" opened="{{opened}}" ignore-select="true">
            <paper-icon-button icon\$="[[indicatorIcon]]" type\$="[[indicatorType]]" class="notification-icon dropdown-trigger" slot="dropdown-trigger"></paper-icon-button>
            <div class="dropdown-content" slot="dropdown-content">
                <div class="grid-row">
                    <h4>[[_computeTitle(notifications)]]</h4>
                </div>
                <hr>
                <paper-listbox id="notifications-menu" selectable="none">
                    <template is="dom-repeat" items="[[notifications]]">
                        <paper-item on-tap="_handleItemTap" class="context">
                            <iron-icon slot="item-icon" icon="[[_computeNotificationIcon(item)]]" type\$="[[_computeNotificationType(item)]]"></iron-icon>
                            <paper-item-body two-line="">
                                <div class="summary">[[item.summary]]</div>
                                <div secondary="" inner-h-t-m-l="[[item.html_body]]" class="body"></div>
                                <div secondary="" class="time">[[_computeRelativeTime(item, timestamp_counter)]]</div>
                            </paper-item-body>
                            <paper-menu-button id="actions" close-on-activate="" horizontal-align="right" vertical-offset="56" horizontal-offset="-36" on-tap="_handleRightButtonTap">
                                <paper-icon-button class="dismiss-icon dropdown-trigger" icon="icons:icons:more-horiz" slot="dropdown-trigger"></paper-icon-button>
                                <div class="notification-actions dropdown-content" slot="dropdown-content">
                                    <paper-listbox id="notification-actions-menu" selectable="none">
                                        <paper-item class="notification-action context" hidden\$="[[!isNotification(item)]]" on-tap="_dismissNotification">
                                            Dismiss this notification
                                        </paper-item>
                                        <paper-item class="notification-action context" hidden\$="[[isNotification(item)]]" on-tap="_dismissNotification">
                                            Dismiss this recommendation
                                        </paper-item>
                                        <paper-item class="notification-action context" hidden\$="[[!isMachineRecommendation(item)]]" on-tap="_disableNotificationsForMachine" _id="[[item._id]]">
                                            Disable recommendations for this machine
                                        </paper-item>
                                        <paper-item class="notification-action context" hidden\$="[[!isMachineNotification(item)]]" on-tap="_disableNotificationsForMachine" _id="[[item._id]]">
                                            Disable all notifications for this machine
                                        </paper-item>
                                    </paper-listbox>
                                </div>
                            </paper-menu-button>
            
            </paper-item>
            </template>
            <div id="spinner" hidden\$="[[!activeSpinner]]">
                <paper-spinner active="[[activeSpinner]]"></paper-spinner>
            </div>
            </paper-listbox>
            </div>
        </paper-menu-button>
        <paper-badge hidden="[[hidden]]" id="indicatorBadge" label="[[notifications.length]]"></paper-badge>
        <div class="tip" closed\$="[[!opened]]"></div>

        <iron-ajax id="requestDismiss" method="DELETE" handle-as="json" on-response="handleDismissResponse">
        </iron-ajax>

        <iron-ajax id="requestDisableSimilar" method="POST" handle-as="json" on-response="handleDisableNotificationsForMachineResponse">
        </iron-ajax>
`,

  /* this is the element's prototype */
  is: 'notifications-indicator',

  properties: {
      notifications: {
          type: Array,
          value: function () {
              return []
          }
      },
      opened: {
          type: Boolean
      },
      hidden: {
          type: Boolean,
          computed: '_computeIndicatorHidden(notifications.length)'
      },
      indicatorIcon: {
          type: String,
          computed: '_computeIndicatorIcon(notifications.length)'
      },
      indicatorType: {
          type: String,
          computed: '_computeIndicatorType(notifications.length)'
      },
      timestamp_counter: {
          value: 0
      },
      activeSpinner: {
          type: Boolean,
          value: false
      }
  },

  observers: [
      '_openedChanged(opened)'
  ],

  attached: function () {
      if (!this.timestamp_interval) {
          var th1s = this;
          this.timestamp_interval = setInterval(function () {
              th1s.set('timestamp_counter', th1s.timestamp_counter + 1);
          }, 10000);
      }
  },

  detached: function () {
      if (this.timestamp_interval) {
          unsetInterval(this.timestamp_interval);
      }
  },

  _computeTitle: function (notifications) {
      var type = this.getItemsType(notifications);
      if (type == 1) {
          return "Notifications";
      } else if (type == 2) {
          return "Recommendations";
      }
      return "Notifications & Recommendations";
  },

  _computeIndicatorIcon: function (notificationsLength) {
      var type = this.getItemsType(this.notifications);
      if (type == 1) {
          return "social:notifications";
      } else if (type == 2) {
          return "image:wb-incandescent";
      }
      // Todo: return dual icon
      return "social:notifications";
  },

  _computeIndicatorType: function (notificationsLength) {
      var type = this.getItemsType(this.notifications);
      if (type == 2) {
          return "recommendations";
      } else {
          return "notifications";
      }
  },

  isNotification: function (notification) {
      return notification.source == "InAppNotification";
  },

  isMachineNotification: function (notification) {
      return typeof notification.machine !== 'undefined' && this.isNotification(notification);
  },

  isMachineRecommendation: function (notification) {
      return typeof notification.machine !== 'undefined' && !this.isNotification(notification);
  },

  _computeNotificationIcon: function (notification) {
      if (notification.source == "InAppRecommendation" &&
          notification.model_id == "autoscale_v1") {
          if (notification.model_output.direction == "up") {
              return "icons:arrow-upward";
          } else if (notification.model_output.direction == "down") {
              return "icons:arrow-downward";
          }
      } else if (notification.source == "InAppRecommendation") {
          return "image:wb-incandescent";
      } else {
          return "social:notifications";
      }
  },

  _computeNotificationType: function (notification) {
      if (notification.model_id && notification.model_id.length > 0) {
          return "recommendation-specific";
      } else if (notification.source == "InAppRecommendation") {
          return "recommendation";
      } else {
          return "notification";
      }
  },

  _computeRelativeTime: function (notification, timestamp_counter) {
      var date = new Date(notification.created_date.$date);
      return moment(date).fromNow();
  },

  computeBadgeCaption: function (notifications) {
      return notifications.length;
  },

  _computeIndicatorHidden: function (notificationsLength) {
      if (notificationsLength == 0) {
          this.set('opened', false);
      }
      return notificationsLength == 0;
  },

  getItemsType: function (notifications) {
      // 0= none, 1=notifications, 2=recommendations, 3=both
      var ntf = false;
      var rec = false;
      if (notifications) {
          for (i = 0; i < notifications.length; ++i) {
              var item = notifications[i];
              if (item.source == "InAppRecommendation") {
                  rec = true;
              } else if (item.source == "InAppNotification") {
                  ntf = true;
              } else {
                  ntf = true;
              }
          }
          return ntf + rec * 2;
      }
      return false;
  },

  _handleItemTap: function (event) {
      var path;
      if (event.model.item.machine) {
          path = '/' + event.model.item.machine._ref.$ref + '/' + event.model.item.machine._ref.$id;
      } else if (event.model.item.cloud) {
          path = '/' + event.model.item.cloud._ref.$ref + '/' + event.model.item.cloud._ref.$id;
      } else if (event.model.item.tag) {
          path = '/' + event.model.item.tag._ref.$ref + '/' + event.model.item.tag._ref.$id;
      } else {
          event.model._children[1].querySelector('paper-menu-button').open();
          return;
      }

      console.log(location.pathname, path);

      if (location.pathname != path) {
          this.set('activeSpinner', true);
          this.async(function () {
              window.history.pushState({}, null, path);
              window.dispatchEvent(new CustomEvent('location-changed'));
              this.set('opened', false);
          }.bind(this), 500)
      } else {
          this.set('opened', false);
      }
      event.stopPropagation();
  },

  _openedChanged: function (opened) {
      // deactivate spinner in any change
      this.set('activeSpinner', false);
  },

  _handleRightButtonTap: function (event) {
      event.stopPropagation();
  },

  _dismissNotification: function (event) {
      var dismissURL = "/api/v1/notifications/" + event.model.item._id;
      this.$.requestDismiss.url = dismissURL;
      this.$.requestDismiss.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.requestDismiss.generateRequest();
      event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.close()
  },

  handleDismissResponse: function (event) {
      console.log("Notifications: Received dismiss response");
  },

  _disableNotificationsForMachine: function (event) {
      var dismissURL = "/api/v1/notification-overrides";
      var payload = {
          notification_id: event.model.item._id
      };
      this.$.requestDisableSimilar.url = dismissURL;
      this.$.requestDisableSimilar.body = payload;
      this.$.requestDisableSimilar.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.requestDisableSimilar.headers["Content-Type"] = 'application/json';
      this.$.requestDisableSimilar.generateRequest();
      event.stopPropagation();
  },

  handleDisableNotificationsForMachineResponse: function (event) {
      console.log("Notifications: Received disable response");
  }
});
