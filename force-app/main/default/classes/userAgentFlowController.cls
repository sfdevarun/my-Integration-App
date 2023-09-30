public with sharing class userAgentFlowController {
    @AuraEnabled
    public static Map<Integer, String> getAccessToken(String redirectURI, String clientid, String passed_state, String authURL, String scope) {
        try {
            String authorizeURL = authURL;
            String client_id = clientid;
            System.debug(client_id);
            String redirect_uri = redirectURI;
            System.debug(redirect_uri);
            String response_type = 'token';
            String state = passed_state;
            // String scope = 'api+web+openid';
            HttpRequest request = new HttpRequest();
            request.setEndpoint(authorizeURL);
            request.setMethod('GET');
            request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.setBody('client_id=' + EncodingUtil.urlEncode(client_id, 'UTF-8') + '&redirect_uri=' + EncodingUtil.urlEncode(redirect_uri, 'UTF-8') + '&response_type=' + response_type + '&state=' + EncodingUtil.urlEncode(state, 'UTF-8') + '&scope=' + scope);
            System.debug('Request Body >>> ' + request.getBody());
            
            Http http = new Http();
            HttpResponse response = http.send(request);
            Map<Integer,String> resp = new Map<Integer,String>();
            
            if (response.getStatusCode() == 302) {
                System.debug('Location >>> ' + response.getHeader('Location'));
                String location = String.valueOf(response.getHeader('Location'));
                resp.put(302, location);
                return resp;
            } else {
                if (response.getStatusCode() == 400 || response.getStatusCode() == 404) {
                    System.debug('response => ' + response + ' ' + 'response Body => ' + response.getBody() + ' ' + 'response Status => ' + response.getStatus());
                    if (response.getBody().contains('You have sent us an Illegal URL or an improperly formatted request.')) {
                        resp.put(response.getStatusCode(), 'Illegal Request. You have sent us an Illegal URL or an improperly formatted request.');
                        return resp;
                        } else { if (response.getBody().contains('invalid_client_id')) {
                                resp.put(response.getStatusCode(), 'invalid_client_id. client identifier invalid');
                                return resp;
                            } else {
                                if (response.getBody().contains('redirect_uri_mismatch')) {
                                    resp.put(response.getStatusCode(), 'redirect_uri_mismatch. redirect_uri must match configuration');
                                    return resp;
                                    } else {              
                                        if (response.getBody().contains('You have attempted to reach a URL that no longer exists on salesforce.com')) {
                                            resp.put(response.getStatusCode(), 'URL No Longer Exists. You have attempted to reach a URL that no longer exists on salesforce.com.');
                                            return resp;
                                            } else {
                                                Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                                                resp.put(response.getStatusCode(), 'The error message is ' + (String)jsonResponse.get('error') + ' and description is ' + (String)jsonResponse.get('error_description') + '. You made a ' + response.getStatus() + '. Please review your form parameters in order to fix this issue.');
                                                return resp;
                                                }
                                        }
                                }
                            }
                    }
                    return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error Message: ' + e.getMessage());
        }
    }
}