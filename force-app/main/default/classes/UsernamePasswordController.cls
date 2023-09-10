public with sharing class UsernamePasswordController {
    @AuraEnabled
    public static String getAccessToken(String username, String password, String clientId, String clientSecret) {
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://login.salesforce.com/services/oauth2/token');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setBody('grant_type=password' +
                       '&client_id=' + EncodingUtil.urlEncode(clientId, 'UTF-8') +
                       '&client_secret=' + EncodingUtil.urlEncode(clientSecret, 'UTF-8') +
                       '&username=' + EncodingUtil.urlEncode(username, 'UTF-8') +
                       '&password=' + EncodingUtil.urlEncode(password, 'UTF-8'));
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        
        if (response.getStatusCode() == 200) {
            Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
            return (String)jsonResponse.get('access_token');
        } else {
            // Handle error response
            return null;
        }
    }
}