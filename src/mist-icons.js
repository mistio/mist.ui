import '../node_modules/@polymer/iron-icon/iron-icon.js';
import '../node_modules/@polymer/iron-icons/iron-icons.js';
import '../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js';

const documentContainer = document.createElement('template');

documentContainer.innerHTML = `<iron-iconset-svg name="mist-icons" size="24">
    <svg>
        <defs>
            <g id="arrow-back">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
            </g>
            <g id="menu">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </g>
            <g id="chevron-right">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
            </g>
            <g id="close">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </g>
            <g id="webconfig">
                <path fill="#AA0707" d="M91.666,184.647"></path>
                <path fill="#AA0707" d="M123.245,247.805"></path>
                <path fill="#AA0707" d="M91.666,184.647"></path>
                <path fill="#AA0707" d="M123.245,247.805"></path>
                <g>
                    <path fill="#686868" d="M397.575,64.501c0,26.913-21.852,48.754-48.746,48.754H199.357c-26.914,0-48.738-21.825-48.738-48.754l0,0
                        c0-26.913,21.811-48.754,48.738-48.754h149.486C375.742,15.747,397.575,37.572,397.575,64.501L397.575,64.501z"></path>
                    <circle fill="#686868" cx="60.936" cy="64.501" r="58.511"></circle>
                    <path fill="#686868" d="M397.575,335.482c0,26.943-21.852,48.776-48.746,48.776H199.357c-26.914,0-48.738-21.833-48.738-48.776l0,0
                        c0-26.912,21.811-48.729,48.738-48.729h149.486C375.742,286.753,397.575,308.57,397.575,335.482L397.575,335.482z"></path>
                    <path fill="#686868" d="M60.936,276.986c32.316,0,58.511,26.203,58.511,58.513c0,32.323-26.194,58.511-58.511,58.511
                        c-32.315,0-58.511-26.188-58.511-58.511C2.425,303.189,28.62,276.986,60.936,276.986z"></path>
                    <path fill="#686868" d="M60.936,137.92c-32.323,0-58.511,26.219-58.511,58.495c0,32.261,26.188,58.479,58.511,58.479
                        c32.324,0,58.511-26.188,58.511-58.479C119.446,164.107,93.244,137.92,60.936,137.92z M60.936,236.271
                        c-22.007,0-39.841-17.857-39.841-39.856s17.834-39.849,39.841-39.849c21.999,0,39.833,17.834,39.833,39.849
                        C100.769,218.414,82.935,236.271,60.936,236.271z"></path>
                    <path fill="#686868" d="M348.846,147.677H199.357c-26.914,0-48.738,21.825-48.738,48.755c0,26.928,21.811,48.723,48.738,48.723
                        h149.486c26.897,0,48.73-21.812,48.73-48.738C397.575,169.471,375.742,147.677,348.846,147.677z M338.859,228.258H209.343
                        c-17.59,0-31.874-14.236-31.874-31.796c0-17.604,14.284-31.851,31.874-31.851H338.86c17.573,0,31.834,14.246,31.834,31.851
                        C370.693,214.021,356.434,228.258,338.859,228.258z"></path>
                </g>
            </g>
        </defs>
    </svg>
</iron-iconset-svg>`;

document.head.appendChild(documentContainer.content);

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
