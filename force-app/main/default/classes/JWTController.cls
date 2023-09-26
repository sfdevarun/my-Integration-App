public with sharing class JWTController {
    @AuraEnabled
    public static String getAccessToken(String sub, String iss, String aud, String cert, String scopes, String tokenEndpoint){
        try {
            Auth.JWT jwt = new Auth.JWT();
            jwt.setSub(sub); 
            jwt.setAud(aud); 
            jwt.setIss(iss);
            Map<String, Object> claims = new Map<String, Object>();
            //claims.put('scope', 'web openid api id offline_access');
            System.debug('Scopes >>> ' + scopes);
            claims.put('scope', scopes);
            System.debug('jwt >>> ' + jwt);
            jwt.setAdditionalClaims(claims);
            Auth.JWS jws = new Auth.JWS(jwt, cert);
            String token = jws.getCompactSerialization(); 
            Auth.JWTBearerTokenExchange bearer = new Auth.JWTBearerTokenExchange(tokenEndpoint, jws);
            System.HttpResponse resp = bearer.getHttpResponse();
            System.debug('bearer\'s HTTP response => ' + resp);
            String accessToken = bearer.getAccessToken();
            System.debug('bearer => ' + bearer);
            System.debug('Access Token--> '+ accessToken);
            return accessToken;
        } catch (Exception e) {
            String errorResponse = e.getMessage();
            System.debug('Error Message => ' + errorResponse);
            if (errorResponse.contains('Data Not Available: The data you were trying to access could not be found. It may be due to another user deleting the data or a system error. If you know the data is not deleted but cannot access it')) {
                throw new AuraHandledException('You passed an incorrect certificate');
            } else { if (errorResponse.contains('You have attempted to reach a URL that no longer exists on salesforce.com.')) {
                throw new AuraHandledException(errorResponse);
                } else {
                    if (errorResponse.contains('Unauthorized endpoint, please check Setup->Security->Remote site settings. endpoint =')) {
                        throw new AuraHandledException(errorResponse);
                        } else {
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
        }
    }
}