import { LightningElement, api } from 'lwc';
import getAccessToken from '@salesforce/apex/userAgentFlowController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class UserAgentFlow extends NavigationMixin(LightningElement) {
    clientid = '3MVG9SemV5D80oBc_4KF2WNxqF4oFuu_3r7JbSX1n9fvF_lgKMAfyXVX592tkkHiZBzBTOaqM1WBIN_b80ReY';
    redirectURI = 'https://login.salesforce.com/services/oauth2/success';
    state = 'myTest';
    authURL = 'https://login.salesforce.com/services/oauth2/authorize';
    validateURL;
    toggle;
    @api scopes = '';

    handleClientIdChange(event) {
        this.clientid = event.target.value;
        this.sessionId = '';
        console.log(this.clientid);
    }

    handleRedirectURIChange(event) {
        this.redirectURI = event.target.value;
        this.sessionId = '';
        console.log(this.redirectURI);
    }

    handleStateChange(event) {
        this.state = event.target.value;
        this.sessionId = '';
        console.log(this.state);
    }

    handleAuthURLChange(event) {
        this.authURL = event.target.value;
        this.sessionId = '';
        console.log(this.authURL);
    }

    handleToggleChange(event) {
        this.toggle = event.target.checked;
    }

    handleScopeChange(event) {
        this.scopes = event.target.value;
        console.log(this.scopes);
    }

    getAccessToken() {
        getAccessToken({ redirectURI: this.redirectURI, clientid: this.clientid, passed_state: this.state, authURL: this.authURL, scope: this.scopes })
        .then(result => {
            if (Object.keys(result)[0] === "302") {
                this.validateURL = result["302"];
                this.showToast('success', 'Successful Authentication', `You'll be navigated to the Salesforce login page, You can get the access token from the URL once you login successfully.`);
                this.navigateToURL(this.validateURL);
            } else {
                if (Object.keys(result)[0] === "400" || Object.keys(result)[0] === "404") {
                    this.badRequest = result[Object.keys(result)[0]];
                    this.showToast('error', 'Your status code is ' + Object.keys(result)[0], this.badRequest);
                }
            }
            // window.open(this.validateURL, '_blank');
        })
        .catch(error => {
            console.error('Error:', error);
            this.showToast('error', 'Error', error.body.message);
            if (error.body.message.includes("Unauthorized endpoint, please check Setup->Security->Remote site settings. endpoint =")) {
                this.showRemoteSiteUrlAddMessage(error.body.message);
            }
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

    showRemoteSiteUrlAddMessage(errorMessage) {
        const parts = errorMessage.split('endpoint = ');
        if (parts.length >= 2) {
            const endpointUrl = parts[1];
            try {
                const url = new URL(endpointUrl);
                const baseUrl = url.protocol + '//' + url.host;
                console.log('Base URL:', baseUrl);
                this.showToast('info', 'Action', 'Please add the ' + baseUrl + ' URL to your Remote Site Settings.');
            } catch (error) {
                console.error('Error parsing URL:', error.message);
            }
        } else {
            console.log('Endpoint not found in the error message.');
        }
    }
}