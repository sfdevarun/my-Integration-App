public with sharing class UsernamePasswordController {
    @AuraEnabled
    public static Map<Integer, String> getAccessToken(String username, String password, String clientId, String clientSecret, Boolean tokenFlag) {
        HttpRequest request = new HttpRequest();
        if (tokenFlag == true) {
            request.setEndpoint('https://login.salesforce.com/services/oauth2/token');
        } else {
            request.setEndpoint('https://test.salesforce.com/services/oauth2/token');
        }
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setBody('grant_type=password' +
                       '&client_id=' + EncodingUtil.urlEncode(clientId, 'UTF-8') +
                       '&client_secret=' + EncodingUtil.urlEncode(clientSecret, 'UTF-8') +
                       '&username=' + EncodingUtil.urlEncode(username, 'UTF-8') +
                       '&password=' + EncodingUtil.urlEncode(password, 'UTF-8'));
        
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
            if (response.getStatusCode() == 400) {
                System.debug('response => ' + response + ' ' + 'response Body => ' + response.getBody() + ' ' + 'response Status => ' + response.getStatus());
                Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                resp.put(400, 'The error message is ' + (String)jsonResponse.get('error') + ' and description is ' + (String)jsonResponse.get('error_description') + '. You made a ' + response.getStatus() + '. Please review your form parameters in order to fix this issue.');
                return resp;
            }
            return null;
        }
    }
}