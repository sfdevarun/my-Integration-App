import { LightningElement } from 'lwc';

export default class TestLwc extends LightningElement {
    tokenValue = 'true';
    get tokenOptions() {
        return [
        { label: 'Production', value: 'true' },
        { label: 'Sandbox', value: 'false' }
        ];
    }

    handleChange(event) {
        const selectedOption = event.detail.value;
        console.log('Option selected with value: ' + selectedOption);
    }
}