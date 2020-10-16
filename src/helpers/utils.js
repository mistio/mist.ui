// import '../../node_modules/numeral/src/numeral.js';

function ratedCost(cost, rate) {
    const c = parseFloat(cost || 0);
    const rc = c * rate;
    return c && rc ? numeral(rc).format('0,00.00a') : numeral(cost).format('0,00.00a');
}

function itemUid(item, section) {
    // Returns a universal resource id of the form
    //      resourceType:[cloudId]:itemId
    // e.g. machine:3tm7aaHHZcMxpZ:bf04f27e924fa67023582,
    //      key::MnhLdx9u22YjVJ
    //
    // TODO replace with mist uuids

    // if item type is not defined derive it fro the current section id
    const itemType = item && item.type ? item.type : (section && section.id.slice(0, -1));
    const cloudId = item && section && section.id !== 'machines' && item.cloud && item.cloud.id ? item.cloud.id :
        '';
    let itemId = item && item.id ? item.id : '';
    if (itemType === 'incident')
        itemId = item.incident_id
    return `${ itemType  }:${  cloudId  }:${  itemId }`;
}

function mapToArray(obj) {
    const arr = [];
    if (obj) {
        for (const id in obj) {
            arr.push(obj[id]);
        }
    }
    return arr;
}

function _generateMap(list, field) {
    const out = {};
    let _field = field;
    if (field === undefined) {
        _field = 'id';
    }
    for (let i = 0; i < list.length; i++) {
        out[list[i][_field]] = list[i];
    }
    // console.log('generate map', list, field, JSON.stringify(out));
    return out;
}

function intersection(a, b){
    const _a = a instanceof Set ? a : new Set(a);
    const _b = b instanceof Set ? b : new Set(b);
    return new Set( [ ..._a ].filter(v => _b.has(v)) );
}

const CSRFToken = { value: undefined };

export { ratedCost, itemUid, mapToArray, _generateMap, intersection, CSRFToken };

