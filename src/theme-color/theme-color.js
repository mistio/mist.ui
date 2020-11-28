import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
    is: 'theme-color',
    properties: {
        color: {
            type: String,
            notify: true
        },
        textColor: {
            type: String,
            notify: true,
            computed: 'computeTextColor(color)'
        },
        outline: {
            type: Boolean
        }
    },
    observers: [
        'colorContent(color)'
    ],
    computeTextColor() {
        return 'rgb(255,255,255)';
        /* if (this.color) {
            var lightness = one.color(this.color).lightness();
            return (lightness > 0.5) ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)';
        } else {
            return null;
        } */
    },
    /* eslint-disable no-param-reassign */
    _color(node, bgColor, color) {
        node.style.color = color;
        node.style.backgroundColor = bgColor;
        if (this.outline) this._outline(node, bgColor);
    },

    _colorBorder(node, borderColor) {
        node.style.borderColor = borderColor;
    },
    _outline(node, bgColor) {
        if (this._getColorLightness(bgColor) > 0.9) {
            node.style.outline = '1px solid rgba(0,0,0,.25)';
            node.style.outlineOffset = '-1px';
        }
    },
    /* eslint-enable no-param-reassign */
    colorContent() {
        if (this.hasAttribute('themed')) this._color(this, this.color, this.textColor);
        if (this.hasAttribute('themed-reverse')) this._color(this, this.textColor, this.color);
        if (this.hasAttribute('themed-border')) this._colorBorder(this, this.color);
        if (this.hasAttribute('themed-border-reverse')) this._colorBorder(this, this.textColor);

        const nodes = dom(this).querySelectorAll('[themed],[themed-reverse],[themed-border],[themed-border-reverse]');
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].hasAttribute('themed')) {
                this._color(nodes[i], this.color, this.textColor);
            } else if (nodes[i].hasAttribute('themed-reverse')) {
                this._color(nodes[i], this.textColor, this.color);
            } else if (nodes[i].hasAttribute('themed-border')) {
                this._colorBorder(nodes[i], this.color);
            } else if (nodes[i].hasAttribute('themed-border-reverse')) {
                this._colorBorder(nodes[i], this.textColor);
            }
        }
    },
    /* eslint-disable no-bitwise */
    _getColorLightness(rgbColor){

        const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;
        const hex2RGB = str => {
            const [ , short, long ] = String(str).match(RGB_HEX) || [];

            if (long) {
                const value = Number.parseInt(long, 16);
                return [ value >> 16, value >> 8 & 0xFF, value & 0xFF ];
            } 
            if (short) {
                return Array.from(short, s => Number.parseInt(s, 16)).map(n => (n << 4) | n);
            } 
            return str.split(",").map(x => parseInt(x,10));
            
        };
        let [r,g,b] = hex2RGB(rgbColor);
        r /= 255;
        g /= 255;
        b /= 255;
        const lightness = 0.5 * (Math.max(r,g,b) + Math.min(r,g,b));
        return lightness;
    }
    /* eslint-enable no-bitwise */
});
