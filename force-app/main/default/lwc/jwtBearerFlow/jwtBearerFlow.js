import { LightningElement } from 'lwc';
import getAccessToken from '@salesforce/apex/JWTController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JwtBearerFlow extends LightningElement {
    issuer = '3MVG9SemV5D80oBc_4KF2WNxqF5NH3vYnspZNQFUFkKV4GCh2SidlmwaXByvI63q2jXfkuQcBAW1OJaGXF0bi';
    audience = 'https://login.salesforce.com';
    subject = 'jaiswalarun16-0era@force.com';
    sessionId;

    handleIssuerChange(event) {
        this.issuer = event.target.value;
        this.sessionId = '';
    }

    handleAudienceChange(event) {
        this.audience = event.target.value;
        this.sessionId = '';
    }

    handleSubjectChange(event) {
        this.subject = event.target.value;
        this.sessionId = '';
    }

    getAccessToken() {
        getAccessToken({ sub: this.subject, iss: this.issuer, aud: this.audience })
            .then((result) => {
                // Handle successful response
                console.log(result);
                this.sessionId = result;
                this.showToast('success', 'Access Token Generated', this.sessionId);
            })
            .catch((error) => {
                // Handle error
                this.showToast('error', 'Error', error.body.message);
            });
    }

    showToast(variant, title, message) {
        const toastEvent = new ShowToastEvent({ variant, title, message });
        this.dispatchEvent(toastEvent);
    }
}