public with sharing class WebServerFlowController {
    @AuraEnabled
    public static Map<Integer, String> getAuthCode(String redirectURI, String clientid, String authorizeEndpoint, String scope) {
        String authorizeURL = authorizeEndpoint;
        String client_id = clientid;
        System.debug(client_id);
        String redirect_uri = redirectURI;
        System.debug(redirect_uri);
        String response_type = 'code';
        HttpRequest request = new HttpRequest();
        request.setEndpoint(authorizeURL);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        if (scope != null || scope != '') {
            request.setBody('client_id=' + EncodingUtil.urlEncode(client_id, 'UTF-8') + '&redirect_uri=' + EncodingUtil.urlEncode(redirect_uri, 'UTF-8') + '&response_type=' + response_type + '&scope=' + scope);
        } else {
            request.setBody('client_id=' + EncodingUtil.urlEncode(client_id, 'UTF-8') + '&redirect_uri=' + EncodingUtil.urlEncode(redirect_uri, 'UTF-8') + '&response_type=' + response_type);
        }
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
    }
    @AuraEnabled
    public static Map<Integer, String> getAccessToken(String authorizationCode, String redirectURI, String clientid, String clientsecret){
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
            Map<Integer,String> resp = new Map<Integer,String>();
            
            if (response.getStatusCode() == 200) {
                Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                System.debug('response => ' + response.getBody());
                System.debug('json response => ' + jsonResponse);
                // resp.put(200, (String)jsonResponse.get('access_token'));
                Map<String, Object> data = new Map<String, Object>();
                data.put('access_token', (String)jsonResponse.get('access_token'));
                data.put('id', (String)jsonResponse.get('id'));
                data.put('instance_url', (String)jsonResponse.get('instance_url'));
                data.put('refresh_token', (String)jsonResponse.get('refresh_token'));
                data.put('scope', (String)jsonResponse.get('scope'));
                data.put('token_type', (String)jsonResponse.get('token_type'));
                String jsonString = JSON.serialize(data);
                System.debug('jsonString >>> ' + jsonString);
                resp.put(200, jsonString);
                return resp;
            } else {
                if (response.getStatusCode() == 400) {
                    System.debug('response => ' + response + ' ' + 'response Body => ' + response.getBody() + ' ' + 'response Status => ' + response.getStatus());
                    if (response.getBody().contains('You have sent us an Illegal URL or an improperly formatted request.')) {
                        resp.put(400, 'Illegal Request. You have sent us an Illegal URL or an improperly formatted request.');
                        return resp;
                    } else {
                        Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                        resp.put(400, 'The error message is ' + (String)jsonResponse.get('error') + ' and description is ' + (String)jsonResponse.get('error_description') + '. You made a ' + response.getStatus() + '. Please review your form parameters in order to fix this issue.');
                        return resp;
                    }
                }
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}