@RestResource(urlMapping='/samlAssertion/*')
global with sharing class SAMLAssertionController {
    @AuraEnabled @HttpPost
    global static String postSAML(String issuer, String encodedKey, String subject, String Audience, String Recipient) {
        String actualResponse;
        Object dummy;
        SAMLBearerAssertion samlAssertion = new SAMLBearerAssertion();
        samlAssertion.audience = Audience;
        samlAssertion.action = Recipient;
        samlAssertion.issuer = issuer;
        samlAssertion.encodedKey = encodedKey;
        samlAssertion.subject = subject; 
        Map<Integer,Object> resMap = samlAssertion.postSAML();
        if (resMap.containsKey(200)) {
            dummy = resMap.get(200);
            System.debug(dummy instanceof String);
            actualResponse = String.valueOf(dummy);
        } else { if ((resMap.containsKey(400)) || (resMap.containsKey(404))) {
            Set<Integer> keySet = new Set<Integer>();
            keySet = resMap.keySet();
            Integer firstelement = (new List<Integer>(keySet))[0];
            dummy = resMap.get(firstelement);
            actualResponse = String.valueOf(dummy);
                } 
            }
            System.debug('Actual Response >>> ' + actualResponse);
        return actualResponse;
    }
}