import { LightningElement } from 'lwc';
import getAccessToken from '@salesforce/apex/UsernamePasswordController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UsernamePasswordComp extends LightningElement {
    username = 'jaiswalarun16-0era@force.com';
    password = 'Testabc@123I';
    clientId = '3MVG9SemV5D80oBc_4KF2WNxqF4oFuu_3r7JbSX1n9fvF_lgKMAfyXVX592tkkHiZBzBTOaqM1WBIN_b80ReY';
    clientSecret = '3588CFBF973CED5178DFD9338BC72BF11E44F5518FEDCFB6FD2C723D4164CA78';
    sessionId;
    handleUsernameChange(event) {
        this.username = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleClientIdChange(event) {
        this.clientId = event.target.value;
    }

    handleClientSecretChange(event) {
        this.clientSecret = event.target.value;
    }

    getAccessToken() {
        getAccessToken({ username: this.username, password: this.password, clientId: this.clientId, clientSecret: this.clientSecret })
            .then(result => {
                // Handle access token response
                console.log('Access Token:', result);
                this.sessionId = result;
                this.showToast('success', 'Access Token Generated', this.sessionId);
            })
            .catch(error => {
                // Handle error response
                console.error('Error:', error);
                this.showToast('error', 'Error', error.body.message);
            });
    }
    showToast(variant, title, message) {
        const toastEvent = new ShowToastEvent({ variant, title, message });
        this.dispatchEvent(toastEvent);
    }
}