import { LightningElement } from 'lwc';
import getAccessToken from '@salesforce/apex/userAgentFlowController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class UserAgentFlow extends NavigationMixin(LightningElement) {
    clientid = '3MVG9SemV5D80oBc_4KF2WNxqF4oFuu_3r7JbSX1n9fvF_lgKMAfyXVX592tkkHiZBzBTOaqM1WBIN_b80ReY';
    redirectURI = 'https://login.salesforce.com/services/oauth2/success';
    state = 'myTest';
    authURL = 'https://login.salesforce.com/services/oauth2/authorize';
    validateURL;

    handleClientIdChange(event) {
        this.clientid = event.target.value;
        console.log(this.clientid);
    }

    handleRedirectURIChange(event) {
        this.redirectURI = event.target.value;
        console.log(this.redirectURI);
    }

    handleStateChange(event) {
        this.state = event.target.value;
        console.log(this.state);
    }

    handleAuthURLChange(event) {
        this.authURL = event.target.value;
        console.log(this.authURL);
    }

    getAccessToken() {
        getAccessToken({ redirectURI: this.redirectURI, clientid: this.clientid, passed_state: this.state, authURL: this.authURL })
        .then(result => {
            this.validateURL = result;
            this.showToast('success', 'Successful Authorization', this.validateURL);
            this.navigateToURL(this.validateURL);
            // window.open(this.validateURL, '_blank');
        })
        .catch(error => {
            console.error('Error:', error);
            this.showToast('error', 'Error', error.body.message);
        });
    }

    showToast(variant, title, message) {
        const toastEvent = new ShowToastEvent({ variant, title, message });
        this.dispatchEvent(toastEvent);
    }

    navigateToURL(validateURL) {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: this.validateURL
            },
        });
    }
}