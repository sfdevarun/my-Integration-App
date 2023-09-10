public with sharing class JWTController {
    @AuraEnabled
    public static string getAccessToken(String sub, String iss, String aud){
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
            
            //Get the access token
            String accessToken = bearer.getAccessToken();
            system.debug('Access Token-->'+accessToken);
            return accessToken;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}