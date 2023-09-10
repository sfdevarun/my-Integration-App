@RestResource(urlMapping='/samlAssertion/*')
global with sharing class SAMLAssertionController {
    @AuraEnabled @HttpPost
    global static String postSAML(String issuer, String encodedKey, String subject) {
        SAMLBearerAssertion samlAssertion = new SAMLBearerAssertion();
        samlAssertion.issuer = issuer;
        samlAssertion.encodedKey = encodedKey;
        samlAssertion.subject = subject;
        return samlAssertion.postSAML();
    }
}