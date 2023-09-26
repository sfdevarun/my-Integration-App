import { LightningElement, api } from 'lwc';
import getAuthCode from '@salesforce/apex/WebServerFlowController.getAuthCode';
import getAccessToken from '@salesforce/apex/WebServerFlowController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class WebServerFlow extends NavigationMixin(LightningElement) {
    check = true;
    clientid = '3MVG9SemV5D80oBc_4KF2WNxqF4oFuu_3r7JbSX1n9fvF_lgKMAfyXVX592tkkHiZBzBTOaqM1WBIN_b80ReY';
    clientsecret = '3588CFBF973CED5178DFD9338BC72BF11E44F5518FEDCFB6FD2C723D4164CA78';
    redirectURI = 'https://login.salesforce.com/callback';
    authorizeEndpoint = 'https://login.salesforce.com/services/oauth2/authorize';
    authURL;
    authorizationCode;
    sessionId;
    @api scopes = '';
    toggle;
    badRequest;

    handleClientIdChange(event) {
        this.clientid = event.target.value;
        console.log(this.clientid);
    }

    handleRedirectURIChange(event) {
        this.redirectURI = event.target.value;
        console.log(this.redirectURI);
    }

    handleAuthorizationCodeChange(event) {
        this.authorizationCode = event.target.value;
        console.log(this.authorizationCode);
        this.sessionId = '';
    }

    handleClientSecretChange(event) {
        this.clientsecret = event.target.value;
        console.log(this.clientsecret);
    }

    handleAuthorizeEndpointChange(event) {
        this.authorizeEndpoint = event.target.value;
        console.log(this.authorizeEndpoint);
    }

    handleScopeChange(event) {
        this.scopes = event.target.value;
        console.log(this.scopes);
    }

    handleToggleChange(event) {
        this.toggle = event.target.checked;
    }

    getAuthCode() {
        if (this.scopes.length > 0) {
            this.scopes.toString();
        } else {
            this.scopes = '';
        }
        getAuthCode({ redirectURI: this.redirectURI, clientid: this.clientid, authorizeEndpoint: this.authorizeEndpoint, scope: this.scopes })
            .then(result => {
                if (Object.keys(result)[0] === "302") {
                    this.authURL = result["302"];
                    this.showToast('success', 'Successful Authorization', `You'll be navigated to the Salesforce login page, copy the code from the callback URL and paste here.`);
                    this.navigateToURL(this.authURL);
                } else {
                    if (Object.keys(result)[0] === "400" || Object.keys(result)[0] === "404") {
                        this.badRequest = result[Object.keys(result)[0]];
                        this.showToast('error', 'Your status code is ' + Object.keys(result)[0], this.badRequest);
                    }
                }
                // window.location.href = this.authURL;
                // window.open(this.authURL, '_blank');
            })
            .catch(error => {
                console.error('Error:', error.body.message);
                if (error.body.message.includes("Unauthorized endpoint, please check Setup->Security->Remote site settings. endpoint =")) {
                    this.showRemoteSiteUrlAddMessage(error.body.message);
                }
                this.showToast('error', 'Error', error.body.message);
            });
    }
    showToast(variant, title, message) {
        const toastEvent = new ShowToastEvent({ variant, title, message });
        this.dispatchEvent(toastEvent);
    }
    navigateToURL(authURL) {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: this.authURL
            },
        });
        this.check = false;
    }
    getAccessToken() {
        getAccessToken({ authorizationCode: this.authorizationCode, redirectURI: this.redirectURI, clientid: this.clientid, clientsecret: this.clientsecret })
        .then(result => {
            console.log('Access Token:', result);
            if (Object.keys(result)[0] === "200") {
                this.sessionId = result["200"];
                this.showToast('success', 'Access Token Generated', this.sessionId);
            } else {
                if (Object.keys(result)[0] === "400") {
                    this.badRequest = result["400"];
                    this.showToast('error', 'Your status code is 400', this.badRequest);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error.body.message);
            this.showToast('error', 'Error', error.body.message);
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