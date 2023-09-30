public with sharing class refreshTokenController {
    @AuraEnabled
    public static Map<Integer, String> getAccessToken(String clientId, String clientSecret, String refreshToken) {
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://login.salesforce.com/services/oauth2/token');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setBody('grant_type=refresh_token' +
                       '&client_id=' + EncodingUtil.urlEncode(clientId, 'UTF-8') +
                       '&client_secret=' + EncodingUtil.urlEncode(clientSecret, 'UTF-8') +
                       '&refresh_token=' + EncodingUtil.urlEncode(refreshToken, 'UTF-8'));
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        Map<Integer,String> resp = new Map<Integer,String>();
        
        if (response.getStatusCode() == 200) {
            Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
            System.debug('response => ' + response.getBody());
            System.debug('json response => ' + jsonResponse);
            resp.put(200, (String)jsonResponse.get('access_token'));
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
                            if (response.getBody().contains('invalid_client')) {
                                resp.put(response.getStatusCode(), 'invalid_client. invalid client credentials');
                                return resp;
                                } else {              
                                    if (response.getBody().contains('invalid_grant')) {
                                        resp.put(response.getStatusCode(), 'invalid_grant. expired access/refresh token');
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
}