import { LightningElement } from 'lwc';
import getAccessToken from '@salesforce/apex/refreshTokenController.getAccessToken';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RefreshTokenFlow extends LightningElement {
    clientid = '3MVG9SemV5D80oBc_4KF2WNxqF4oFuu_3r7JbSX1n9fvF_lgKMAfyXVX592tkkHiZBzBTOaqM1WBIN_b80ReY';
    clientsecret = '3588CFBF973CED5178DFD9338BC72BF11E44F5518FEDCFB6FD2C723D4164CA78';
    refresh_token = '';
    sessionId;
    get options() {
        return [
            { label: 'Access Connect REST API resources (chatter_api)', value: 'chatter_api' },
            // { label: 'Manage Customer Data Platform Ingestion API data (cdp_ingest_api)', value: 'cdp_ingest_api' },
            // { label: 'Access Analytics REST API Charts Geodata resources (eclair_api)', value: 'eclair_api' },
            { label: 'Access Analytics REST API resources (wave_api)', value: 'wave_api' },
            { label: 'Manage user data via APIs (api)', value: 'api' },
            { label: 'Access custom permissions (custom_permissions)', value: 'custom_permissions' },
            { label: 'Access the identity URL service (id, profile, email, address, phone)', value: 'id profile email address phone' },
            { label: 'Access Lightning applications (lightning)', value: 'lightning' },
            { label: 'Access content resources (content)', value: 'content' },
            { label: 'Access unique user identifiers (openid)', value: 'openid' },
            { label: 'Full access (full)', value: 'full' },
            { label: 'Perform requests at any time (refresh_token, offline_access)', value: 'refresh_token offline_access' },
            { label: 'Access Visualforce applications (visualforce)', value: 'visualforce' },
            { label: 'Manage user data via Web browsers (web)', value: 'web' },
            { label: 'Access chatbot services (chatbot_api)', value: 'chatbot_api' },
            { label: 'Access Headless Registration API (user_registration_api)', value: 'user_registration_api' },
            { label: 'Access Headless Forgot Password API (forgot_password)', value: 'forgot_password' },
            // { label: 'Access all Data Cloud API resources (cdp_api)', value: 'cdp_api' },
            { label: 'Access the Salesforce API Platform (sfap_api)', value: 'sfap_api' },
            { label: 'Access Interaction API resources (interaction_api)', value: 'interaction_api' },
            // { label: 'Perform ANSI SQL queries on Customer Data Platform data (cdp_query_api)', value: 'cdp_query_api' },
            // { label: 'Manage Pardot services (pardot_api)', value: 'pardot_api' },
            // { label: 'Manage Customer Data Platform profile data (cdp_profile_api)', value: 'cdp_profile_api' }
        ];
    }

    messageWhenValueMissing = 'Please select atleast 1 value';
    flag = false;
    selectedValues = '';
    unformattedString = [];

    handleClientIdChange(event) {
        this.clientid = event.target.value;
        console.log(this.clientid);
        this.sessionId = '';
    }

    handleClientSecretChange(event) {
        this.clientsecret = event.target.value;
        console.log(this.clientsecret);
        this.sessionId = '';
    }

    handleRefreshTokenChange(event) {
        this.refresh_token = event.target.value;
        console.log(this.refresh_token);
        this.sessionId = '';
    }

    handleChange(event) {
        this.unformattedString = event.detail.value;
        const inputArray = JSON.stringify(this.unformattedString);
        let parsedArray = JSON.parse(inputArray);

        let resultArray = [];

        parsedArray.forEach(function (element) {
        if (typeof element === 'string') {
            resultArray.push(...element.split(','));
        } else {
            resultArray.push(element);
        }
        });
        this.selectedValues = resultArray.join(' ');
        if (this.selectedValues.length !== 0) {
            this.flag = true;
        } else { if (this.selectedValues.length === 0) {
            this.flag =false;
        }
        }
        console.log(this.selectedValues);
    }

    getAccessToken() {
        getAccessToken({ clientId: this.clientid, clientSecret: this.clientsecret, refreshToken:this.refresh_token })
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