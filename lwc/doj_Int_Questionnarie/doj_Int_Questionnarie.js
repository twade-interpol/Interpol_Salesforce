import { LightningElement } from 'lwc';
export default class Doj_Int_Questionnarie extends LightningElement {
yesNoOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No [if “No”, provide justification]', value: 'no' }
    ];
yesNoNAOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No [if “No”, provide justification]', value: 'no' },
        { label: 'N/A', value: 'N/A' }
    ];

    handleRadioChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.detail.value;
    }

    hideModalBox() {
        // The data to be sent to the parent
        const dataToSend = false;

        // Create and dispatch a custom event with the data
        const event = new CustomEvent('senddata', {
            detail: dataToSend
        });

        // Dispatch the event
        this.dispatchEvent(event);
    }

}