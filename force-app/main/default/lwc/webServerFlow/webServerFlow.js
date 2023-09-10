import { LightningElement } from 'lwc';
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
    }

    handleClientSecretChange(event) {
        this.clientsecret = event.target.value;
        console.log(this.clientsecret);
    }

    handleAuthorizeEndpointChange(event) {
        this.authorizeEndpoint = event.target.value;
        console.log(this.authorizeEndpoint);
    }

    getAuthCode() {
        getAuthCode({ redirectURI: this.redirectURI, clientid: this.clientid, authorizeEndpoint: this.authorizeEndpoint })
            .then(result => {
                console.log('Authorization Code', result);
                this.authURL = result;
                this.showToast('success', 'Successful Authorization', this.authURL);
                this.navigateToURL(this.authURL);
                // window.location.href = this.authURL;
                // window.open(this.authURL, '_blank');
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
            this.sessionId = result;
            this.showToast('success', 'Access Token', this.sessionId);
        })
        .catch(error => {
            console.error('Error:', error);
            this.showToast('error', 'Error', error.body.message);
        });
    }
}