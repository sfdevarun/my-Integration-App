public with sharing class JWTController {
    @AuraEnabled
    public static String getAccessToken(String sub, String iss, String aud){
        try {
            Auth.JWT jwt = new Auth.JWT();
            jwt.setSub(sub); 
            jwt.setAud(aud); 
            jwt.setIss(iss);
            // Map<String, Object> claims = new Map<String, Object>();
            // claims.put('scope', 'scope name');
            // jwt.setAdditionalClaims(claims);

            //Create the object that signs the JWT bearer token
            Auth.JWS jws = new Auth.JWS(jwt, 'salesforcetest');
            
            //Get the resulting JWS in case debugging is required
            String token = jws.getCompactSerialization();
            
            //Set the token endpoint that the JWT bearer token is posted to
            String tokenEndpoint = 'https://login.salesforce.com/services/oauth2/token';
            
            //POST the JWT bearer token
            Auth.JWTBearerTokenExchange bearer = new Auth.JWTBearerTokenExchange(tokenEndpoint, jws);
            System.debug('bearer\'s HTTP response => ' + bearer.getHttpResponse());
            String accessToken = bearer.getAccessToken();
            System.debug('bearer => ' + bearer);
            System.debug('Access Token-->'+ accessToken);
            return accessToken;
        } catch (Exception e) {
            String errorResponse = e.getMessage();
            String jsonStr = errorResponse.substring(errorResponse.indexOf('{'));
            Map<String, Object> errorMap = (Map<String, Object>)JSON.deserializeUntyped(jsonStr);
            if ((String)errorMap.get('error_description') == 'user hasn\'t approved this consumer') {
                throw new AuraHandledException('The error message is ' + (String)errorMap.get('error') + ' and description is ' + (String)errorMap.get('error_description') + '. The Subject/Username is incorrect. Please pass the correct value');
            } else { if ((String)errorMap.get('error_description') == 'client identifier invalid') {
                    throw new AuraHandledException('The error message is ' + (String)errorMap.get('error') + ' and description is ' + (String)errorMap.get('error_description') + '. The Issuer/client Id is incorrect. Please pass the correct value');
                } else {
                    throw new AuraHandledException('The error message is ' + (String)errorMap.get('error') + ' and description is ' + (String)errorMap.get('error_description') + '. The Audience is incorrect. Please pass the correct value');
                }
            }
        }
    }
}