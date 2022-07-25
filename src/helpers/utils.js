/* Helper function to format a number that symbolizes monetary value to a shorter string,
  eg: 12900000 turns into 12.9M
  Takes input a Number or a String that can be cast into Number */
function numeral(num) {
  if (typeof num !== 'number' && typeof num !== 'string') return '0.00';
  // This takes the digits that are on the right of where the . will land in the result
  // eg 1234 will turn into 1.23 k, this function expects the 234 and returns the 23
  function solveRight(rightPart) {
    let res = `${rightPart.slice(0, 2)}.${rightPart.slice(2)}`;
    //check if it starts with 0
    if (res.slice(0,1) === '0') {
      if (parseFloat(res.slice(1,2)) >= 5 )
        return 1;
      else
        return 0;
    }
    else {
      res = parseFloat(res);
      res = Math.round(res);
      return res;
    }
  }
  // Map the order of the number of digits to the proper metric
  const suffixes = { 3: 'K', 6: 'M', 9: 'B', 12: 'T', 15: 'Q' };
  let toFormat = Number(num);
  if (Number.isNaN(toFormat)) return '0.00';
  // Check if the number is negative
  const prefix = toFormat < 0 ? '-' : '';
  toFormat = Math.abs(toFormat);
  if (toFormat < 1000) {
    return `${prefix}${String(toFormat.toFixed(2))}`;
  }
  toFormat = String(toFormat);
  [toFormat] = toFormat.split('.');
  let res = '';
  // This is the order of magnitude, anything between 4 and 6 digits has order 3 and will end in K
  // Between 7 and 9 digits will get M and so on
  const order = parseInt((toFormat.length - 1) / 3, 10) * 3;
  // This variable decides were the "." will be placed in the end result
  const comma = toFormat.length - order;
  res = `${toFormat.slice(0, comma)}.`;
  const rightP = solveRight(toFormat.slice(comma));
  // if rightP is 0 don't show it
  if (rightP !== 0)
    res += String(rightP);
  else
    res = res.slice(0,1)
  res += suffixes[order];
  return `${prefix}${res}`;
}

function ratedCost(cost, rate) {
  const c = parseFloat(cost || 0);
  const rc = c * rate;
  return c && rc ? numeral(rc) : numeral(cost);
}

function formatMoney(value, decs_, dot_, comma_) {
  const decs = Number.isNaN(Math.abs(decs_)) ? 2 : decs_;
  const val = Math.abs(Number(value) || 0).toFixed(decs);
  const dot = dot_ === undefined ? '.' : dot_;
  const comma = comma_ === undefined ? ',' : comma_;
  const prefix = value < 0 ? '-' : '';
  const number = String(parseInt(val, 10));
  let commaIndex = number.length;
  commaIndex = commaIndex > 3 ? commaIndex % 3 : 0;
  return (
    prefix +
    (commaIndex ? number.substr(0, commaIndex) + comma : '') +
    number.substr(commaIndex).replace(/(\d{3})(?=\d)/g, `$1${comma}`) +
    (decs
      ? dot +
        Math.abs(val - number)
          .toFixed(decs)
          .slice(2)
      : '')
  );
}

function itemUid(item, section) {
  // Returns a universal resource id of the form
  //      resourceType:[cloudId]:itemId
  // e.g. machine:3tm7aaHHZcMxpZ:bf04f27e924fa67023582,
  //      key::MnhLdx9u22YjVJ
  //
  // TODO replace with mist uuids

  // if item type is not defined derive it fro the current section id
  const itemType =
    item && item.type ? item.type : section && section.id.slice(0, -1);
  const cloudId =
    item && section && section.id !== 'machines' && item.cloud && item.cloud.id
      ? item.cloud.id
      : '';
  let itemId = item && item.id ? item.id : '';
  if (itemType === 'incident') itemId = item.incident_id;
  return `${itemType}:${cloudId}:${itemId}`;
}

function mapToArray(obj) {
  const arr = [];
  if (obj) {
    Object.keys(obj).forEach(id => {
      arr.push(obj[id]);
    });
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

function intersection(a, b) {
  const _a = a instanceof Set ? a : new Set(a);
  const _b = b instanceof Set ? b : new Set(b);
  return new Set([..._a].filter(v => _b.has(v)));
}

const CSRFToken = { value: '' };
const stripePublicAPIKey = { value: '' };
export {
  ratedCost,
  formatMoney,
  itemUid,
  mapToArray,
  _generateMap,
  intersection,
  CSRFToken,
  stripePublicAPIKey,
};
