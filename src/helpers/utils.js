import '../../node_modules/numeral/src/numeral.js';

function ratedCost(cost, rate) {
    var c = parseFloat(cost || 0);
    var rc = c * rate;
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
    var item_type = item && item.type ? item.type : (section && section.id.slice(0, -1));
    var cloudId = item && section && section.id != 'machines' && item.cloud && item.cloud.id ? item.cloud.id :
        '';
    var itemId = item && item.id ? item.id : '';
    if (item_type == 'incident')
        itemId = item.incident_id
    return item_type + ':' + cloudId + ':' + itemId;
}

function mapToArray(obj) {
    var arr = [];
    if (obj) {
        for (let id in obj) {
            arr.push(obj[id]);
        }
    }
    return arr;
}

export { ratedCost, itemUid, mapToArray };