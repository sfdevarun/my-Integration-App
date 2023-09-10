import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import makeSAMLAssertion from '@salesforce/apex/SAMLAssertionController.postSAML';

export default class MakeSAMLAssertion extends LightningElement {
    issuer = '3MVG9SemV5D80oBc_4KF2WNxqF7snro9ibNgHO1DN1wfFKe66pkkB89VuXAWTQgNILYVe_TbWfXD_zT9XO5v6';
    encodedKey = `MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrvVU0Y/OIQgi6
    buuWE3pbk5LSJQqul/paj6JiV6lfLzrKZhF8VVlTeHHBCZ1WhSVTf0wZ9w01LL67
    Bpa6lNMrjmYPtYoFHOrK6opAvUwrTJfeZJ4rkfzzkci1fSW10o88zVP0ciF3Db3v
    CFpoo+hvcV9K2zBBC+Cxea2M3JbeO6b1duXi3AjthzuTNcS3lHJvfrX2fvXjKKD1
    te59c/hW6pPS5V4Tbt8Jufp4v6npgrNSqoU/MbyHq9ENTpujzIQd8mcJSRqoV+vL
    0/DNn9DCSjJCT/HPrUnojcDB3msmbfihxDk7u1Hsx1XTxroFXG+dGTR2JYFu4fzj
    DI7lk2h1AgMBAAECggEAAKI7uMGaVJ6NwrEFwdwuNOf4ADoubmjVfdUO2oG2ox5y
    VJczfvvKTxe1hRVV1SEQ+1xlDv7NjSyDmFQUuqPcSEpdD7dx8W/jC+mj+0uCMZy1
    k2wCoL2IAJbBS1jRX/jixMIrNPk2LLwfvyHkQi5B/XtJHeZuKKdJu83ro9vtMJe9
    MrQobi2HwF7zAEnswbsx2kxD94QoW9g3Zr3wyKJNGoHC74MTA0lNIZSRdnBis9/O
    uQTXLLUKVKXaIszocCgWp8EoWllNDs8Z5qyaUG2hYECZywpwEADHoQLV4nUSAow/
    8390ZcWo3nXlZPibVZwrwi/APyxMx9F7k0rx7OEbFwKBgQC4VZm+LCNEflIKyhY2
    MJ6BZ4Bo9ePZvXIMtsdD2SbqbXsrrurhKqv9wkJaEuR4c2RnoAjP4YPD9RzYVIS4
    1nWIjm3Ij3nbeavieCEgLtuE2LpgPC2zCr0K8mK8dU06aq+XwkP6zK3+5ATHPiDy
    r26ND2fqVXBsYfBWTcXTJuHoMwKBgQDugjMca22BrApG8LjThcbsGVW0zEA0UNvl
    +h2R3Nhb67H7WLh6DrbLLJ2DdKkdEscJXg4CD//LYjManINqDjzkynegO7g7trUq
    NEo0RTLy8HeZ8iETyHUibMREvS1dmRCYigg0qp/2/KiZT5qEPTku7BKSuJBvFMfz
    Cd//JpPktwKBgEJxoIxbDo9W1S3McDsyRUAx1ah/0ZSf4+dPTv5W3N8tfXNeho2J
    OxuqFQ6wtqfwOCXeGq8MA9nzlWUo+fpCW3VQmaPsi6kf72Qflxkpqrj1AiFEL9jU
    qxWyDwMNaTwATrDuNmDFvIYfHNXQwEGaGMhB4FwoVfDLUL1bJU6aOl3fAoGBAOr/
    JdTOlCq7k7Sp4bGnkYN2wtdMl8X0FXXWpePdsN+ArvBzTfAVJ02wO9IV07ptkeZM
    4Yhusx11N9z0cRbByIW0Z4Fc1f0f3AglVSeDNtveyjjINIcFb0Pn3snLizM5aPyi
    o8sgglQcRRIpOJkqqXjt6K7fYo/P7eIszKLdI8KpAoGBALGQJsx7D8pOvcwIGywC
    m/MilbYtzMzHl6Jxsdxb2jLR6rYAq6pDqZZrvpFcE08A29OS69azYEabDXDts4dt
    N2B1cRz5I3ejXWDDEzuXES6Hil7gaLGdh+wkpxLQ0rfJTn4XYLOUvwksx156Kyzl
    9ndCUddT5SVSAf6lRr9trJay`;
    subject = 'jaiswalarun16-0era@force.com';
    sessionId;

    handleIssuerChange(event) {
        this.issuer = event.target.value;
    }

    handleEncodedKeyChange(event) {
        this.encodedKey = event.target.value;
    }

    handleSubjectChange(event) {
        this.subject = event.target.value;
    }

    handleButtonClick() {
        makeSAMLAssertion({ issuer: this.issuer, encodedKey: this.encodedKey, subject: this.subject })
            .then((result) => {
                // Handle successful response
                console.log(result);
                this.sessionId = JSON.parse(result).access_token;
                this.showToast('success', 'Access Token Generated', this.sessionId);
            })
            .catch((error) => {
                // Handle error
                this.showToast('error', 'Error', error.body.message);
            });
    }

    showToast(variant, title, message) {
        const toastEvent = new ShowToastEvent({ variant, title, message });
        this.dispatchEvent(toastEvent);
    }
}