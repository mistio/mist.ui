import '../../node_modules/@polymer/polymer/polymer-legacy.js';
/**
 * Behavior that empties the list selection.
 *
 * @polymerBehavior
 */
export const mistRulesBehavior = {
    properties: {},
    _rulesApplyOnResource(_rules, resource, _resourceTags, type) {
        const that = this;
        if (!resource || !this.model || !this.model.rules)
            return [];
        return Object.values(this.model.rules).filter((r) => {
            return r.resource_type === type &&
                // applies on all resources
                (!r.selectors || !r.selectors.length ||
                // applies on this resource
                r.selectors.filter((s) => {return s.type === `${type}s`}).map(x => x.ids).join().indexOf(resource.id) >- 1 ||
                // applies on tags
                that.resourceHasTags(resource,r.resourceTags));
        });
    },

    resourceHasTags(resource,selectors) {
        // CAUTION: Selectors' format is as follows
        //      selectors = [{type:'tags',tags:{test:null,xtest:true}}, {type:'volumes',ids:[]}]
        // whereas volume tags are in the format
        //      volume.tags = {test:"", xtest:true, ...}
        // A selector-tag tupple where value is null, equals to the corresponding volume-tag tupple where value is "" empty string.
        //      i.e. selectors[0].tags["test"] = null 'EQUALS' volume.tags["test"] = "".
        // The following returns true if the volume has at least one of the selectors tags
        if (!resource || !selectors)
            return false;
        const bool =  selectors.filter((t) => {return t.type === 'tags'})
                        .map(x => x.tags)
                        .findIndex((s) => {
                            for (const p of Object.keys(s) ) {
                                if (resource.tags[p] === s[p] || (resource.tags[p] === "" && s[p]=== null)) {
                                    return true;
                                }
                            }
                            return false;
                        }) > -1;
        return bool;
    },
};
