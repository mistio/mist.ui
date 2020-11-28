import '../../node_modules/@polymer/polymer/polymer-legacy.js';
/**
* Behavior that asserts whether a resource is loading, missing or found
*
* @polymerBehavior
*/
export const mistLoadingBehavior = {
    properties: {
        resourceId: {
            type: String
        },
        state: {
            type: String
        },
        asyncID: {
            type: Number
        },
        isMissing: {
            type: Boolean,
            value: false
        },
        trials: {
            type: Number
        }
    },
    observers: [
        '_updateState(resourceId, section.count)',
        // '_updateClasses(state)'
    ],
    updateState() {
        this._updateState(this.resourceId, this.section);
    },
    _updateState (resourceId, section) {
        if (this.resourceId && this.resourceId.indexOf('+add', '+create') === -1) {
            console.log('load state resourceId', resourceId, section);
            // // initial state
            this.set('state', 'loading');
            this.set('isMissing', false);

            // if we are still loading the model of resources
            if (!this.section || !this.model[this.section.id]){
                this.set('state', 'loading');
                this.set('isMissing', false);
                this._tryAgain();
            }
            // if we have loaded the resources but resource is still missing
            else if (this.model[this.section.id] && !this.model[this.section.id][this.resourceId]){
                this._tryAgain();
            }
            // if we found and loaded the resource
            else if (this.model[this.section.id] && this.model[this.section.id][this.resourceId]) {
                this.set('isMissing', false);
                this.set('state', 'found');
                this._clearAsync();
            }
            this._updateClasses(this.state);
        }
    },
    _clearAsync() {
        if (this.asyncID){
            // cancel Async
            this.cancelAsync(this.asyncID);
            this.set("asyncID", null);
        }
    },
    _tryAgain (){
        console.log('load timeout', this.trials);
        this.set('trials', this.trials ? this.trials + 1 : 1);
        this._clearAsync();
        if (this.trials > 5) {
            this.set('state', 'missing');
            this.set('isMissing', true);
        } else {
            setTimeout(() =>{
                this.updateState();
            }, 1000);
        }
    },
    _updateClasses(state) {
        console.log('load state', this.state);
        if (state === 'loading') {
            this.classList.add('loadingResource');
        } else {
            this.classList.remove('loadingResource');
        }

        if (state === 'missing') {
            this.classList.add('missingResource');
        } else {
            this.classList.remove('missingResource');
        }

        if (state === 'found') {
            this.classList.remove(['loadingResource', 'missingResource']);
        }
    }
}
