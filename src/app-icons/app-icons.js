import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

const documentContainer = document.createElement('template');

documentContainer.innerHTML = `<iron-iconset-svg name="mist-icons" size="24">
    <svg>
        <defs>
            <g id="icon-ubuntu">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M921.611,281.602C921.611,281.602,921.611,896.009,921.611,896.009C921.611,896.009,102.401,896.009,102.401,896.009C102.401,896.009,102.401,281.602,102.401,281.602C102.401,281.602,0,281.602,0,281.602C0,281.602,0,128,0,128C0,128,1024,128,1024,128C1024,128,1024,281.602,1024,281.602C1024,281.602,921.611,281.602,921.611,281.602C921.611,281.602,921.611,281.602,921.611,281.602M204.802,793.608C204.802,793.608,819.197,793.608,819.197,793.608C819.197,793.608,819.197,384.003,819.197,384.003C819.197,384.003,204.802,384.003,204.802,384.003C204.802,384.003,204.802,793.608,204.802,793.608C204.802,793.608,204.802,793.608,204.802,793.608M614.407,230.402C614.407,230.402,409.605,230.402,409.605,230.402C409.605,230.402,409.605,281.59,409.605,281.59C409.605,281.59,614.407,281.59,614.407,281.59C614.407,281.59,614.407,230.402,614.407,230.402C614.407,230.402,614.407,230.402,614.407,230.402"></path>
            </g>
            <g id="icon-machine">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M921.611,281.602C921.611,281.602,921.611,896.009,921.611,896.009C921.611,896.009,102.401,896.009,102.401,896.009C102.401,896.009,102.401,281.602,102.401,281.602C102.401,281.602,0,281.602,0,281.602C0,281.602,0,128,0,128C0,128,1024,128,1024,128C1024,128,1024,281.602,1024,281.602C1024,281.602,921.611,281.602,921.611,281.602C921.611,281.602,921.611,281.602,921.611,281.602M204.802,793.608C204.802,793.608,819.197,793.608,819.197,793.608C819.197,793.608,819.197,384.003,819.197,384.003C819.197,384.003,204.802,384.003,204.802,384.003C204.802,384.003,204.802,793.608,204.802,793.608C204.802,793.608,204.802,793.608,204.802,793.608M614.407,230.402C614.407,230.402,409.605,230.402,409.605,230.402C409.605,230.402,409.605,281.59,409.605,281.59C409.605,281.59,614.407,281.59,614.407,281.59C614.407,281.59,614.407,230.402,614.407,230.402C614.407,230.402,614.407,230.402,614.407,230.402"></path>
            </g>
            <g id="icon-image">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M512.048,602.184C462.606,602.184,422.412,561.966,422.412,512.572C422.412,463.178,462.606,422.948,512.048,422.948C561.502,422.948,601.636,463.178,601.588,512.572C601.588,561.966,561.442,602.184,512.048,602.184C512.048,602.184,512.048,602.184,512.048,602.184M512.048,1024.44C229.665,1024.44,0,794.822,0,512.548C0,230.226,229.665,0.5,512.048,0.5C794.322,0.5,1024,230.19,1024,512.548C1024,794.822,794.322,1024.44,512.048,1024.44C512.048,1024.44,512.048,1024.44,512.048,1024.44M445.628,953.263C448.831,954.66,478.236,966.966,528.461,966.966C572.917,966.966,619.421,957.369,666.708,938.344C666.708,938.344,673.86,935.49,673.86,935.49C673.86,935.49,672.957,933.624,672.957,933.624C672.957,933.624,557.914,698.78,557.914,698.78C557.914,698.78,551.761,701.177,551.761,701.177C544.09,704.115,535.144,705.668,525.98,705.668C518.984,705.668,514.035,704.801,513.517,704.657C513.517,704.657,506.834,703.308,506.834,703.308C506.834,703.308,506.365,705.042,506.365,705.042C506.365,705.042,440.017,950.783,440.017,950.783C440.017,950.783,445.628,953.263,445.628,953.263C445.628,953.263,445.628,953.263,445.628,953.263M512.048,339.718C416.729,339.718,339.302,417.204,339.302,512.476C339.302,607.808,416.729,685.306,512.048,685.306C607.32,685.306,684.806,607.796,684.806,512.476C684.806,417.204,607.32,339.718,512.048,339.718C512.048,339.718,512.048,339.718,512.048,339.718"></path>
            </g>
            <g id="icon-network">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M943.205,215.589C943.205,215.589,943.205,431.166,943.205,431.166C943.205,431.166,943.205,538.949,943.205,538.949C943.205,538.949,565.937,538.949,565.937,538.949C565.937,538.949,565.937,700.628,565.937,700.628C565.937,700.628,673.731,700.628,673.731,700.628C673.731,700.628,673.731,1024,673.731,1024C673.731,1024,350.372,1024,350.372,1024C350.372,1024,350.372,700.628,350.372,700.628C350.372,700.628,458.154,700.628,458.154,700.628C458.154,700.628,458.154,538.949,458.154,538.949C458.154,538.949,80.885,538.949,80.885,538.949C80.885,538.949,80.885,431.166,80.885,431.166C80.885,431.166,80.885,215.589,80.885,215.589C80.885,215.589,27,215.589,27,215.589C27,215.589,27,0,27,0C27,0,242.577,0,242.577,0C242.577,0,242.577,215.589,242.577,215.589C242.577,215.589,188.68,215.589,188.68,215.589C188.68,215.589,188.68,431.166,188.68,431.166C188.68,431.166,458.154,431.166,458.154,431.166C458.154,431.166,458.154,215.589,458.154,215.589C458.154,215.589,404.257,215.589,404.257,215.589C404.257,215.589,404.257,0,404.257,0C404.257,0,619.834,0,619.834,0C619.834,0,619.834,215.589,619.834,215.589C619.834,215.589,565.937,215.589,565.937,215.589C565.937,215.589,565.937,431.166,565.937,431.166C565.937,431.166,835.411,431.166,835.411,431.166C835.411,431.166,835.411,215.589,835.411,215.589C835.411,215.589,781.526,215.589,781.526,215.589C781.526,215.589,781.526,0,781.526,0C781.526,0,997.103,0,997.103,0C997.103,0,997.103,215.589,997.103,215.589C997.103,215.589,943.205,215.589,943.205,215.589"></path>
            </g>
            <g id="icon-keys">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M271.44,662.586C271.44,662.586,391.903,662.586,391.903,662.586C391.903,662.586,391.903,1024,391.903,1024C391.903,1024,30.5,1024,30.5,1024C30.5,1024,30.5,662.586,30.5,662.586C30.5,662.586,150.964,662.586,150.964,662.586C150.964,662.586,150.964,0,150.964,0C150.964,0,391.903,0,391.903,0C391.903,0,391.903,120.464,391.903,120.464C391.903,120.464,271.44,120.464,271.44,120.464C271.44,120.464,271.44,301.183,271.44,301.183C271.44,301.183,452.147,301.183,452.147,301.183C452.147,301.183,452.147,421.647,452.147,421.647C452.147,421.647,271.44,421.647,271.44,421.647C271.44,421.647,271.44,662.586,271.44,662.586C271.44,662.586,271.44,662.586,271.44,662.586M150.964,783.062C150.964,783.062,150.964,903.524,150.964,903.524C150.964,903.524,271.44,903.524,271.44,903.524C271.44,903.524,271.44,783.062,271.44,783.062C271.44,783.062,150.964,783.062,150.964,783.062C150.964,783.062,150.964,783.062,150.964,783.062M994.269,301.172C994.269,301.172,994.269,421.634,994.269,421.634C994.269,421.634,813.573,421.634,813.573,421.634C813.573,421.634,813.573,662.586,813.573,662.586C813.573,662.586,934.037,662.586,934.037,662.586C934.037,662.586,934.037,1024,934.037,1024C934.037,1024,572.622,1024,572.622,1024C572.622,1024,572.622,662.586,572.622,662.586C572.622,662.586,693.086,662.586,693.086,662.586C693.086,662.586,693.086,0,693.086,0C693.086,0,934.024,0,934.024,0C934.024,0,934.024,120.464,934.024,120.464C934.024,120.464,813.561,120.464,813.561,120.464C813.561,120.464,813.561,301.183,813.561,301.183C813.561,301.183,994.269,301.183,994.269,301.183C994.269,301.183,994.269,301.172,994.269,301.172M693.086,783.062C693.086,783.062,693.086,903.524,693.086,903.524C693.086,903.524,813.561,903.524,813.561,903.524C813.561,903.524,813.561,783.062,813.561,783.062C813.561,783.062,693.086,783.062,693.086,783.062C693.086,783.062,693.086,783.062,693.086,783.062"></path>
            </g>
            <g id="icon-script">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M256.058,1024C256.058,1024,256.058,113.791,256.058,113.791C256.058,113.791,142.279,113.791,142.279,113.791C142.279,113.791,142.279,796.442,142.279,796.442C142.279,796.442,28.5,796.442,28.5,796.442C28.5,796.442,28.5,0,28.5,0C28.5,0,995.604,0,995.604,0C995.604,0,995.604,1024,995.604,1024C995.604,1024,256.058,1024,256.058,1024C256.058,1024,256.058,1024,256.058,1024M426.721,853.337C426.721,853.337,824.942,853.337,824.942,853.337C824.942,853.337,824.942,625.791,824.942,625.791C824.942,625.791,426.721,625.791,426.721,625.791C426.721,625.791,426.721,853.337,426.721,853.337C426.721,853.337,426.721,853.337,426.721,853.337M426.721,512.012C426.721,512.012,824.942,512.012,824.942,512.012C824.942,512.012,824.942,398.233,824.942,398.233C824.942,398.233,426.721,398.233,426.721,398.233C426.721,398.233,426.721,512.012,426.721,512.012C426.721,512.012,426.721,512.012,426.721,512.012M426.721,284.454C426.721,284.454,824.942,284.454,824.942,284.454C824.942,284.454,824.942,170.674,824.942,170.674C824.942,170.674,426.721,170.674,426.721,170.674C426.721,170.674,426.721,284.454,426.721,284.454C426.721,284.454,426.721,284.454,426.721,284.454"></path>
            </g>
            <g id="icon-vm">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M794.287,704.162C786.78,704.162,779.11,703.727,771.114,702.802C726.981,761.55,658.751,795.62,585.425,794.659C552.552,886.134,466.661,948.381,370.036,948.381C243.403,948.381,140.414,843.161,140.414,713.808C140.414,704.706,140.921,695.549,141.991,686.393C56.245,650.51,0,565.888,0,469.553C0,340.255,100.868,265.624,227.537,265.624C227.537,265.624,455.075,265.624,455.075,265.624C455.075,265.624,455.075,151.864,455.075,151.864C455.075,151.864,227.537,151.864,227.537,151.864C227.537,151.864,227.537,76,227.537,76C227.537,76,758.494,76,758.494,76C758.494,76,758.494,151.864,758.494,151.864C758.494,151.864,530.921,151.864,530.921,151.864C530.921,151.864,530.921,265.624,530.921,265.624C530.921,265.624,796.426,265.624,796.426,265.624C923.041,265.624,1024,340.255,1024,469.553C1023.982,598.906,920.938,704.162,794.287,704.162C794.287,704.162,794.287,704.162,794.287,704.162"></path>
            </g>
            <g id="icon-bm">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M1000.023,677.312C1000.023,677.312,23.936,677.312,23.936,677.312C10.698,677.312,0,665.344,0,650.575C0,650.575,0,373.764,0,373.764C0,358.982,10.698,347,23.936,347C23.936,347,1000.023,347,1000.023,347C1013.289,347,1024,358.982,1024,373.764C1024,373.764,1024,650.575,1024,650.575C1024,665.344,1013.289,677.312,1000.023,677.312C1000.023,677.312,1000.023,677.312,1000.023,677.312M165.149,479.114C165.149,479.114,99.092,479.114,99.092,479.114C99.092,479.114,99.092,545.185,99.092,545.185C99.092,545.185,165.149,545.185,165.149,545.185C165.149,545.185,165.149,479.114,165.149,479.114C165.149,479.114,165.149,479.114,165.149,479.114M297.291,479.114C297.291,479.114,231.22,479.114,231.22,479.114C231.22,479.114,231.22,545.185,231.22,545.185C231.22,545.185,297.291,545.185,297.291,545.185C297.291,545.185,297.291,479.114,297.291,479.114C297.291,479.114,297.291,479.114,297.291,479.114M429.405,479.114C429.405,479.114,363.348,479.114,363.348,479.114C363.348,479.114,363.348,545.185,363.348,545.185C363.348,545.185,429.405,545.185,429.405,545.185C429.405,545.185,429.405,479.114,429.405,479.114C429.405,479.114,429.405,479.114,429.405,479.114M561.533,479.114C561.533,479.114,561.533,545.185,561.533,545.185C561.533,545.185,924.894,545.185,924.894,545.185C924.894,545.185,924.894,479.114,924.894,479.114C924.894,479.114,561.533,479.114,561.533,479.114C561.533,479.114,561.533,479.114,561.533,479.114"></path>
            </g>
            <g id="icon-code">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M320.078,266.52C320.078,266.52,292.097,238.538,292.097,238.538C288.368,234.809,284.075,232.929,279.219,232.929C274.362,232.929,270.069,234.809,266.34,238.538C266.34,238.538,5.609,499.27,5.609,499.27C1.88,502.998,0,507.291,0,512.148C0,517.005,1.88,521.298,5.609,525.026C5.609,525.026,266.34,785.758,266.34,785.758C270.069,789.487,274.362,791.367,279.219,791.367C284.075,791.367,288.368,789.487,292.097,785.758C292.097,785.758,320.078,757.776,320.078,757.776C323.807,754.048,325.687,749.755,325.687,744.898C325.687,740.041,323.807,735.748,320.078,732.02C320.078,732.02,100.175,512.117,100.175,512.117C100.175,512.117,320.078,292.214,320.078,292.214C323.807,288.485,325.687,284.192,325.687,279.335C325.687,274.478,323.807,270.186,320.078,266.457C320.078,266.457,320.078,266.52,320.078,266.52M650.748,863.529C650.748,863.529,442.031,141.152,442.031,141.152C440.558,136.295,437.644,132.66,433.351,130.247C429.059,127.835,424.672,127.365,420.191,128.837C420.191,128.837,385.504,138.363,385.504,138.363C380.647,139.836,377.012,142.75,374.6,147.042C372.187,151.335,371.717,155.91,373.19,160.767C373.19,160.767,581.906,883.144,581.906,883.144C583.379,888.001,586.293,891.636,590.586,894.049C594.879,896.461,599.266,896.931,603.746,895.459C603.746,895.459,638.433,885.933,638.433,885.933C643.29,884.46,646.925,881.546,649.338,877.253C651.75,872.961,652.22,868.386,650.748,863.529C650.748,863.529,650.748,863.529,650.748,863.529M1018.391,499.27C1018.391,499.27,757.66,238.538,757.66,238.538C753.931,234.809,749.638,232.929,744.781,232.929C739.925,232.929,735.632,234.809,731.903,238.538C731.903,238.538,703.922,266.52,703.922,266.52C700.193,270.248,698.313,274.541,698.313,279.398C698.313,284.255,700.193,288.547,703.922,292.276C703.922,292.276,923.825,512.179,923.825,512.179C923.825,512.179,703.922,732.082,703.922,732.082C700.193,735.811,698.313,740.104,698.313,744.961C698.313,749.817,700.193,754.11,703.922,757.839C703.922,757.839,731.903,785.82,731.903,785.82C735.632,789.549,739.925,791.429,744.781,791.429C749.638,791.429,753.931,789.549,757.66,785.82C757.66,785.82,1018.391,525.089,1018.391,525.089C1022.12,521.36,1024,517.067,1024,512.211C1024,507.354,1022.12,503.061,1018.391,499.332C1018.391,499.332,1018.391,499.27,1018.391,499.27"></path>
            </g>
            <g id="icon-shell">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M0,981.656C0,981.656,0,43,0,43C0,43,1024,43,1024,43C1024,43,1024,981.656,1024,981.656C1024,981.656,0,981.656,0,981.656C0,981.656,0,981.656,0,981.656M938.656,128.312C938.656,128.312,85.312,128.312,85.312,128.312C85.312,128.312,85.312,682.968,85.312,682.968C85.312,682.968,938.656,682.968,938.656,682.968C938.656,682.968,938.656,128.312,938.656,128.312C938.656,128.312,938.656,128.312,938.656,128.312M938.656,725.656C938.656,725.656,85.312,725.656,85.312,725.656C85.312,725.656,85.312,896.312,85.312,896.312C85.312,896.312,938.656,896.312,938.656,896.312C938.656,896.312,938.656,725.656,938.656,725.656C938.656,725.656,938.656,725.656,938.656,725.656M469.344,853.656C469.344,853.656,384,853.656,384,853.656C384,853.656,384,768.312,384,768.312C384,768.312,469.344,768.312,469.344,768.312C469.344,768.312,469.344,853.656,469.344,853.656C469.344,853.656,469.344,853.656,469.344,853.656M341.344,853.656C341.344,853.656,256,853.656,256,853.656C256,853.656,256,768.312,256,768.312C256,768.312,341.344,768.312,341.344,768.312C341.344,768.312,341.344,853.656,341.344,853.656C341.344,853.656,341.344,853.656,341.344,853.656M213.344,853.656C213.344,853.656,128,853.656,128,853.656C128,853.656,128,768.312,128,768.312C128,768.312,213.344,768.312,213.344,768.312C213.344,768.312,213.344,853.656,213.344,853.656C213.344,853.656,213.344,853.656,213.344,853.656"></path>
            </g>
            <g id="icon-key">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M704,1024C527.264,1024,384,880.736,384,704C384,684,386.368,664.736,389.888,645.888C389.888,645.888,0,256,0,256C0,256,0,0,0,0C0,0,384,0,384,0C384,0,384,128,384,128C384,128,512,128,512,128C512,128,512,256,512,256C512,256,640,256,640,256C640,256,640,384,640,384C640,384,645.888,389.888,645.888,389.888C664.736,386.368,684,384,704,384C880.736,384,1024,527.264,1024,704C1024,880.736,880.736,1024,704,1024C704,1024,704,1024,704,1024M704,512C693.984,512,683.008,513.248,669.248,515.744C669.248,515.744,603.008,528,603.008,528C603.008,528,512,436.992,512,436.992C512,436.992,512,384,512,384C512,384,384,384,384,384C384,384,384,256,384,256C384,256,256,256,256,256C256,256,256,128,256,128C256,128,128,128,128,128C128,128,128,203.008,128,203.008C128,203.008,528,603.008,528,603.008C528,603.008,515.744,669.248,515.744,669.248C513.184,683.008,512,694.016,512,704C512,809.888,598.112,896,704,896C809.888,896,896,809.888,896,704C896,598.112,809.888,512,704,512C704,512,704,512,704,512M640,704C640,739.36,668.64,768,704,768C739.36,768,768,739.36,768,704C768,668.64,739.36,640,704,640C668.64,640,640,668.64,640,704C640,704,640,704,640,704"></path>
            </g>
            <g id="icon-cloud-check">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M825.823,596.16C796.803,742.96,667.289,853.662,512.007,853.662C388.715,853.662,281.812,783.687,228.281,681.495C100.052,667.647,0,559.046,0,427.003C0,285.569,114.569,171,256.003,171C256.003,171,810.677,171,810.677,171C928.43,171,1024,266.597,1024,384.336C1024,496.978,936.338,588.293,825.823,596.16C825.823,596.16,825.823,596.16,825.823,596.16C825.823,596.16,825.823,596.16,825.823,596.16M426.672,298.988C426.672,298.988,277.344,448.33,277.344,448.33C277.344,448.33,337.712,508.712,337.712,508.712C337.712,508.712,426.672,419.752,426.672,419.752C426.672,419.752,647.461,640.54,647.461,640.54C647.461,640.54,707.842,580.172,707.842,580.172C707.842,580.172,426.672,298.988,426.672,298.988C426.672,298.988,426.672,298.988,426.672,298.988C426.672,298.988,426.672,298.988,426.672,298.988"></path>
            </g>
            <g id="icon-cloud-cry">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M825.823,596.16C796.789,742.96,667.303,853.649,512.007,853.649C388.701,853.649,281.812,783.687,228.281,681.495C100.052,667.647,0,559.046,0,427.003C0,285.555,114.569,171,255.99,171C255.99,171,810.664,171,810.664,171C928.43,171,1024,266.57,1024,384.323C1024.013,496.978,936.338,588.28,825.823,596.16C825.823,596.16,825.823,596.16,825.823,596.16C825.823,596.16,825.823,596.16,825.823,596.16M377.342,566.324C406.79,566.324,430.673,542.455,430.673,513.007C430.673,483.532,406.79,459.676,377.342,459.676C347.88,459.676,324.011,483.532,324.011,513.007C323.998,542.455,347.88,566.324,377.342,566.324C377.342,566.324,377.342,566.324,377.342,566.324C377.342,566.324,377.342,566.324,377.342,566.324M693.566,245.845C679.759,300.313,603.857,342.017,512.02,342.017C420.183,342.017,344.281,300.326,330.474,245.845C329.029,251.652,328.012,257.565,328.012,263.613C328.012,326.55,410.389,377.566,512.02,377.566C613.651,377.566,696.028,326.55,696.028,263.613C696.015,257.565,695.038,251.638,693.566,245.845C693.566,245.845,693.566,245.845,693.566,245.845C693.566,245.845,693.566,245.845,693.566,245.845M646.698,459.663C617.236,459.663,593.354,483.518,593.354,512.993C593.354,542.442,617.236,566.311,646.698,566.311C676.146,566.311,700.015,542.442,700.015,512.993C700.015,483.518,676.146,459.663,646.698,459.663C646.698,459.663,646.698,459.663,646.698,459.663C646.698,459.663,646.698,459.663,646.698,459.663"></path>
            </g>
            <g id="icon-terminal">
                <path transform="scale(.023, -.023) translate(0, -1000)" d="M992,896C992,896,32,896,32,896C14.336,896,0,881.664,0,864C0,864,0,160,0,160C0,142.304,14.336,128,32,128C32,128,992,128,992,128C1009.696,128,1024,142.304,1024,160C1024,160,1024,864,1024,864C1024,881.664,1009.696,896,992,896C992,896,992,896,992,896M960,224C960,206.304,945.696,192,928,192C928,192,96,192,96,192C78.336,192,64,206.304,64,224C64,224,64,800,64,800C64,817.664,78.336,832,96,832C96,832,928,832,928,832C945.696,832,960,817.664,960,800C960,800,960,224,960,224C960,224,960,224,960,224M303.936,635.488C303.936,635.488,180.576,758.88,180.576,758.88C168.576,770.88,149.12,770.88,137.12,758.88C125.12,746.88,125.12,727.424,137.12,715.424C137.12,715.424,244.576,608,244.576,608C244.576,608,137.12,500.544,137.12,500.544C125.12,488.544,125.12,469.12,137.12,457.12C149.12,445.12,168.576,445.12,180.576,457.12C180.576,457.12,303.936,580.48,303.936,580.48C306.368,581.824,308.832,583.04,310.88,585.088C317.184,591.392,320,599.744,319.648,608C319.968,616.256,317.184,624.608,310.88,630.88C308.832,632.928,306.368,634.144,303.936,635.488C303.936,635.488,303.936,635.488,303.936,635.488M608,512C608,512,416,512,416,512C398.336,512,384,497.664,384,480C384,462.304,398.336,448,416,448C416,448,608,448,608,448C625.696,448,640,462.304,640,480C640,497.664,625.696,512,608,512C608,512,608,512,608,512"></path>
            </g>
        </defs>
    </svg>
</iron-iconset-svg>`;

document.head.appendChild(documentContainer.content);
