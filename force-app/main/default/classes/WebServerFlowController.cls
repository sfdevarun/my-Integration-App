public with sharing class WebServerFlowController {
    @AuraEnabled
    public static String getAuthCode(String redirectURI, String clientid, String authorizeEndpoint) {
        String authorizeURL = authorizeEndpoint;
        String client_id = clientid;
        System.debug(client_id);
        String redirect_uri = redirectURI;
        System.debug(redirect_uri);
        String response_type = 'code';
        String scope = 'api+web+openid+refresh_token';
        HttpRequest request = new HttpRequest();
        request.setEndpoint(authorizeURL);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setBody('client_id=' + EncodingUtil.urlEncode(client_id, 'UTF-8') + '&redirect_uri=' + EncodingUtil.urlEncode(redirect_uri, 'UTF-8') + '&response_type=' + response_type + '&scope=' + scope);
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
    @AuraEnabled
    public static String getAccessToken(String authorizationCode, String redirectURI, String clientid, String clientsecret){
        try {
            String authorization_Code = authorizationCode;
            String client_id = clientid;
            String client_secret = clientsecret;
            String redirect_uri = redirectURI;
            String tokenURL = 'https://login.salesforce.com/services/oauth2/token';
            HttpRequest request = new HttpRequest();
            request.setEndpoint(tokenURL);
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.setBody('grant_type=authorization_code' + '&client_id=' + EncodingUtil.urlEncode(client_id, 'UTF-8') + '&redirect_uri=' + EncodingUtil.urlEncode(redirect_uri, 'UTF-8') + '&code=' + authorization_Code + '&client_secret=' + EncodingUtil.urlEncode(client_secret, 'UTF-8'));
            System.debug('Request Body >>> ' + request.getBody());
            
            Http http = new Http();
            HttpResponse response = http.send(request);
            
            if (response.getStatusCode() == 200) {
                System.debug('Response Body >>> ' + response.getBody());
                Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                return (String)jsonResponse.get('access_token');
            } else {
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}