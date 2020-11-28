import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
/* eslint-disable import/extensions */
// Linter complains about js extension but these are typescript...
import "../../node_modules/xterm";
import "../../node_modules/xterm-addon-fit";
import '../../node_modules/xterm-addon-attach';
/* eslint-enable import/extensions */

const documentContainer = document.createElement('template');

documentContainer.innerHTML = `<style>

</style><dom-module id="xterm-dialog">
    
    <template>
        <style>
        .xterm {
            font-feature-settings: "liga" 0;
            position: relative;
            user-select: none;
            -ms-user-select: none;
            -webkit-user-select: none;
        }
        
        .xterm.focus,
        .xterm:focus {
            outline: none;
        }
        
        .xterm .xterm-helpers {
            position: absolute;
            top: 0;
            /**
             * The z-index of the helpers must be higher than the canvases in order for
             * IMEs to appear on top.
             */
            z-index: 5;
        }
        
        .xterm .xterm-helper-textarea {
            padding: 0;
            border: 0;
            margin: 0;
            /* Move textarea out of the screen to the far left, so that the cursor is not visible */
            position: absolute;
            opacity: 0;
            left: -9999em;
            top: 0;
            width: 0;
            height: 0;
            z-index: -5;
            /** Prevent wrapping so the IME appears against the textarea at the correct position */
            white-space: nowrap;
            overflow: hidden;
            resize: none;
        }
        
        .xterm .composition-view {
            /* TODO: Composition position got messed up somewhere */
            background: #000;
            color: #FFF;
            display: none;
            position: absolute;
            white-space: nowrap;
            z-index: 1;
        }
        
        .xterm .composition-view.active {
            display: block;
        }
        
        .xterm .xterm-viewport {
            /* On OS X this is required in order for the scroll bar to appear fully opaque */
            background-color: #000;
            overflow-y: scroll;
            cursor: default;
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
        }
        
        .xterm .xterm-screen {
            position: relative;
        }
        
        .xterm .xterm-screen canvas {
            position: absolute;
            left: 0;
            top: 0;
        }
        
        .xterm .xterm-scroll-area {
            visibility: hidden;
        }
        
        .xterm-char-measure-element {
            display: inline-block;
            visibility: hidden;
            position: absolute;
            top: 0;
            left: -9999em;
            line-height: normal;
        }
        
        .xterm {
            cursor: text;
        }
        
        .xterm.enable-mouse-events {
            /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
            cursor: default;
        }
        
        .xterm.xterm-cursor-pointer {
            cursor: pointer;
        }
        
        .xterm.column-select.focus {
            /* Column selection mode */
            cursor: crosshair;
        }
        
        .xterm .xterm-accessibility,
        .xterm .xterm-message {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 10;
            color: transparent;
        }
        
        .xterm .live-region {
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        }
        
        .xterm-dim {
            opacity: 0.5;
        }
        
        .xterm-underline {
            text-decoration: underline;
        }
            
            :host {
                display: block;
                width: 100% !important;
                z-index: 999999;
                top: 0;
                left: 0;
            }

            paper-dialog-scrollable {
                margin: 0;
                padding: 0;
            }

            h2 {
                line-height: 32px;
                background-color: #fff !important;
                color: #000;
                padding: 8px 16px;
                margin: 0;
            }

            h2 iron-icon {
                margin-right: 8px;
            }

            #dialogModal {
              width: 100% !important;
              padding: 0px;
            }

            #terminal-container {
                padding: 4px;
                background-color: rgba(0,0,0,0.85) !important;
                color: rgba(255,255,255,.8);
                font-family: monospace;
                font-weight: 700;
                height: calc(100% - 56px);
                position: fixed;
                width:100%;
            }

            :host(.inparent) #terminal-container {
                padding: 4px;
                min-height: 300px;
                position: relative !important;
                width: calc(100% - 8px);
                overflow: scroll;
            }

            .icon-buttons {
                float: right;
                margin: 0;
            }
        </style>
        <div class="icon-buttons" hidden$="[[!controls]]">
            <!--paper-button dialog-confirm><iron-icon icon="icons:remove">minimize</iron-icon></paper-button-->
            <paper-button on-tap="remove"><iron-icon icon="icons:close">close</iron-icon></paper-button>
        </div>
        <h2 hidden$="[[!controls]]">
            <iron-icon icon="vaadin:terminal"></iron-icon> {{target.name}}
        </h2>
        <div id="terminal-container">
        </div>
    </template>

    
</dom-module>`;

document.head.appendChild(documentContainer.content);

Polymer({
    is: 'xterm-dialog',

    properties: {
        term: {
            type: Object
        },
        target: {
            type: Object
        },
        height: {
            type: Number,
            value: 0
        },
        reason: {
            type: String,
            value: null
        },
        controls: {
            type: Boolean,
            value: true
        }
    },
    listeners: {
        'iron-overlay-closed': '_modalClosed'
    },
    ready() {
        console.debug('xterm loaded');
    },
    // disablin no undef because of the typescript imports
    /* eslint-disable no-undef */
    attached() {
        console.debug('xterm attached');
        this.socket = document.querySelector('mist-app').shadowRoot.querySelector('mist-socket');
        
        this.term = new Terminal({
            cursorBlink: true
        });
        const terminalContainer = this.shadowRoot.querySelector('#terminal-container');
        this.fitAddon = new FitAddon.FitAddon();
        this.term.loadAddon(this.fitAddon);  
        this.term.open(terminalContainer);

        const [newCols, newRows] = this.resizeTerminal();

        const ips = [].concat(this.target.public_ips).concat(this.target.private_ips);
        if (ips[0])
            this.term.write(`Connecting to ${  ips[0]  }...\r\n`);

        const {socket} = this;
        this.attachAddon = new AttachAddon.AttachAddon(socket);
        this.term.loadAddon(this.attachAddon);
        this.term.onData((data, _ev) => {
            socket.send('msg', 'shell', 'shell_data', [data]);
        });
        socket.send('sub', 'shell');

        const payload = {
            cols: newCols,
            rows: newRows,
            cloud_id: '',
            machine_id: '',
            host: ''
        };

        if (this.target.job_id) {
            payload.job_id = this.target.job_id;
            payload.provider = 'docker';
            payload.host = '';
        } else {
            payload.cloud_id = this.target.cloud;
            payload.machine_id = this.target.id;
            this.set("style.position", "fixed");
        }

        if (this.target.provider === 'docker' && this.target.key_associations === false) {
            payload.provider = 'docker';
            payload.host = '';
        } else if (this.target.provider === 'kubevirt') {
            payload.provider = 'kubevirt';
            payload.host = 'kubevirt'; // otherwise an error is thrown in the api
        } else if (this.target.provider === 'lxd'){
            payload.provider = 'lxd';
            [payload.host] = ips;
        } else {
            payload.cloud_id = this.target.cloud;
            payload.machine_id = this.target.id;
            [payload.host] = ips; // TODO: Remove this
        }

        socket.send('msg', 'shell', 'shell_open', [payload]);

        socket.set('term', this.term);

        // Add event handler for window resize
        this.resizeHandler = () => {
            this.resizeTerminal();
        };
        window.addEventListener("resize", this.resizeHandler,{passive: true});
        const textArea = this.shadowRoot.querySelector('.xterm-helper-textarea');
        textArea.focus();
    },
    /* eslint-enable no-undef */
    /* eslint-disable no-param-reassign */
    resizeTerminal(newRows, newCols) {
        const prevCols = this.term.cols;
        const prevRows = this.term.rows;
        if (newRows && newCols)
            this.term.resize(newCols, newRows);
        else {
            this.fitAddon.fit();
            if (!newRows)
                newRows = this.term.rows;
            if (!newCols)
                newCols = this.term.cols;
        }
        if (newCols !== prevCols || newRows !== prevRows) {
            console.log('resize term', newCols, newRows);
            this.socket.send(
                'msg',
                'shell',
                'shell_resize',
                [newCols, newRows]);
        }
        return [newCols, newRows];
    },
    /* eslint-enable no-param-reassign */

    detached() {
        console.debug('xterm detached');
        const socket = document.querySelector('mist-app').shadowRoot.querySelector('mist-socket');
        socket.send('uns', 'shell');
        window.removeEventListener("resize", this.resizeHandler);
    },
    _closeDialog(_e) {
        // this.$.dialogModal.close();
        this.remove();
    },
    _modalClosed(e) {
        if (e.srcElement.id === 'dialogModal') {
            console.log(this.$.dialogModal.closingReason);
            this.dispatchEvent(new CustomEvent('confirmation', { bubbles: true, composed: true, detail: {
                response: this.$.dialogModal.closingReason,
                reason: this.reason
            } }));

        }
        this._closeDialog();
    }
});
