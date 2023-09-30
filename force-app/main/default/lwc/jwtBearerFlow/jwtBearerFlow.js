import { LightningElement, api } from 'lwc';
import getAccessToken from '@salesforce/apex/JWTController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JwtBearerFlow extends LightningElement {
    @api scopes = 'web openid api';
    issuer = '3MVG9SemV5D80oBc_4KF2WNxqF5NH3vYnspZNQFUFkKV4GCh2SidlmwaXByvI63q2jXfkuQcBAW1OJaGXF0bi';
    audience = 'https://login.salesforce.com';
    subject = 'jaiswalarun16-0era@force.com';
    certificate = 'salesforcetest';
    sessionId;
    tokenEndpoint = 'https://login.salesforce.com/services/oauth2/token';
    toggle;

    handleIssuerChange(event) {
        this.issuer = event.target.value;
        console.log('issuer >>> ' + this.issuer);
        this.sessionId = '';
    }

    handleAudienceChange(event) {
        this.audience = event.target.value;
        console.log('audience >>> ' + this.audience);
        this.sessionId = '';
    }

    handleSubjectChange(event) {
        this.subject = event.target.value;
        console.log('subject >>> ' + this.subject);
        this.sessionId = '';
    }

    handleCertificateChange(event) {
        this.certificate = event.target.value;
        console.log('certificate >>> ' + this.certificate);
        this.sessionId = '';
    }

    handleTokenEndpointChange(event) {
        this.tokenEndpoint = event.target.value;
        console.log('tokenEndpoint >>> ' + this.tokenEndpoint);
        this.sessionId = '';
    }

    handleScopeChange(event) {
        this.scopes = event.target.value;
        console.log(this.scopes);
        this.sessionId = '';
    }

    handleToggleChange(event) {
        this.toggle = event.target.checked;
    }

    getAccessToken() {
        getAccessToken({ sub: this.subject, iss: this.issuer, aud: this.audience, cert: this.certificate, scopes: this.scopes, tokenEndpoint: this.tokenEndpoint })
            .then((result) => {
                console.log(result);
                this.sessionId = result;
                this.showToast('success', 'Access Token Generated', this.sessionId);
            })
            .catch((error) => {
                console.error('Error: ', error);
                // if (error.body.message.includes("Value provided is invalid for action parameter 'scopes' of type 'String'")) {
                //     this.showToast('error', 'Error', error.body.message);
                //     this.showToast('info', 'Action', 'Please pass the scopes either via refresh token flow or statically.');
                // } Fixed this issue permannently by changing data type of selectedValues from array to string
                if (error.body.message.includes("Unauthorized endpoint, please check Setup->Security->Remote site settings. endpoint =")) {
                    this.showToast('error', 'Error', error.body.message);
                    this.showRemoteSiteUrlAddMessage(error.body.message);
                } else {
                    if (error.body.message.includes("You have attempted to reach a URL that no longer exists on salesforce.com.")) {
                        this.showToast('error', 'Error 404: URL No Longer Exists', 'You have attempted to reach a URL that no longer exists on salesforce.com. Please check your token endpoint.');
                    } else {
                        this.showToast('error', 'Error', error.body.message);
                    }
                }
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