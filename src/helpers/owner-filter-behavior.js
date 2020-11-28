import '../../node_modules/@polymer/polymer/polymer-legacy.js';
/**
 * Behavior that enables the owner filter behavior for lists.
 *
 * @polymerBehavior
 */
export const ownerFilterBehavior = {
    properties: {},
    _ownerFilter () {
        const _this = this;
        return {
            'apply': (item,query) => {
                let q = query.slice(0) || '';
                    const filterOwner = query.indexOf('owner:')>-1;
                    const ownerRegex = /owner:(\S*)\s?/;

                if (filterOwner && q) {
                    if (ownerRegex.exec(q).length) {
                        const owner = ownerRegex.exec(q)[1];
                        if (owner) {
                            if (owner === "$me"){
                                if (!item || !item.owned_by || item.owned_by !== _this.model.user.id)
                                    return false;
                            }
                            else {
                                const ownerObj = _this.model.membersArray.find((m) => {
                                    return [m.name, m.email, m.username, m.id].indexOf(owner) > -1;
                                });
                                if (!ownerObj || !item.owned_by || item.owned_by !== ownerObj.id)
                                    return false;
                            }
                            q = q.replace('owner:','').replace(owner,'');
                            return q;
                        }
                    }
                }
                return query;
            }
        }
    }
};
