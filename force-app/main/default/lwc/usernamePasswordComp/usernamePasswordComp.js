import { LightningElement } from 'lwc';
import getAccessToken from '@salesforce/apex/UsernamePasswordController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UsernamePasswordComp extends LightningElement {
    username = 'jaiswalarun16-0era@force.com';
    password = 'Iphone6@123I';
    clientId = '3MVG9SemV5D80oBc_4KF2WNxqF4oFuu_3r7JbSX1n9fvF_lgKMAfyXVX592tkkHiZBzBTOaqM1WBIN_b80ReY';
    clientSecret = '3588CFBF973CED5178DFD9338BC72BF11E44F5518FEDCFB6FD2C723D4164CA78';
    sessionId;
    badRequest;
    handleUsernameChange(event) {
        this.username = event.target.value;
        this.sessionId = '';
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
        this.sessionId = '';
    }

    handleClientIdChange(event) {
        this.clientId = event.target.value;
        this.sessionId = '';
    }

    handleClientSecretChange(event) {
        this.clientSecret = event.target.value;
        this.sessionId = '';
    }

    getAccessToken() {
        getAccessToken({ username: this.username, password: this.password, clientId: this.clientId, clientSecret: this.clientSecret })
            .then(result => {
                // Handle access token response
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
                // Handle error response
                console.error('Error:', error);
                this.showToast('error', 'Error', error.body.message);
                this.showRemoteSiteUrlAddMessage(error.body.message);
            });
    }
    showToast(variant, title, message) {
        const toastEvent = new ShowToastEvent({ variant, title, message });
        this.dispatchEvent(toastEvent);
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