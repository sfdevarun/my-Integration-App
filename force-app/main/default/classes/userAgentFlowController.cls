public with sharing class userAgentFlowController {
    @AuraEnabled
    public static String getAccessToken(String redirectURI, String clientid, String passed_state, String authURL) {
        String authorizeURL = authURL;
        String client_id = clientid;
        System.debug(client_id);
        String redirect_uri = redirectURI;
        System.debug(redirect_uri);
        String response_type = 'token';
        String state = passed_state;
        String scope = 'api+web+openid+refresh_token';
        // String scope = 'api+web+openid';
        HttpRequest request = new HttpRequest();
        request.setEndpoint(authorizeURL);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setBody('client_id=' + EncodingUtil.urlEncode(client_id, 'UTF-8') + '&redirect_uri=' + EncodingUtil.urlEncode(redirect_uri, 'UTF-8') + '&response_type=' + response_type + '&state=' + EncodingUtil.urlEncode(state, 'UTF-8') + '&scope=' + scope);
        System.debug('Request Body >>> ' + request.getBody());
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        
        if (response.getStatusCode() == 302) {
            System.debug('Location >>> ' + response.getHeader('Location'));
            return response.getHeader('Location');
        } else {
            return null;
        }
    }
}