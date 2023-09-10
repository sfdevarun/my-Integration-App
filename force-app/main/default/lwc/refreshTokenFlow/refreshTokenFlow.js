import { LightningElement } from 'lwc';

export default class RefreshTokenFlow extends LightningElement {
    get options() {
        return [
            { label: 'Access Connect REST API resources (chatter_api)', value: 'chatter_api' },
            // { label: 'Manage Customer Data Platform Ingestion API data (cdp_ingest_api)', value: 'cdp_ingest_api' },
            // { label: 'Access Analytics REST API Charts Geodata resources (eclair_api)', value: 'eclair_api' },
            { label: 'Access Analytics REST API resources (wave_api)', value: 'wave_api' },
            { label: 'Manage user data via APIs (api)', value: 'api' },
            { label: 'Access custom permissions (custom_permissions)', value: 'custom_permissions' },
            { label: 'Access the identity URL service (id, profile, email, address, phone)', value: 'id, profile, email, address, phone' },
            { label: 'Access Lightning applications (lightning)', value: 'lightning' },
            { label: 'Access content resources (content)', value: 'content' },
            { label: 'Access unique user identifiers (openid)', value: 'openid' },
            { label: 'Full access (full)', value: 'full' },
            { label: 'Perform requests at any time (refresh_token, offline_access)', value: 'refresh_token, offline_access' },
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

    messageWhenValueMissing = 'Bhai ek select kar le';

    selectedValues = [];

    handleChange(event) {
        this.selectedValues = event.detail.value;
        console.log(this.selectedValues);
    }
}