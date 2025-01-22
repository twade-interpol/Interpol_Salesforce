import { LightningElement,api } from 'lwc';




export default class doj_int_businesses extends LightningElement {

   fieldList = ["Name","Street_Address__c", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById"]; //harcoded the values assuming objectApiName
    showEditField;     // show or Hide fields 
    showbuttons;       // Show or Hide Save and Cancel Buttons 
    @api recordId;     // Record ID of the business

    @api objectApiName;
    activeSections = ['A'];  // Section for Accordian 
    handleSectionToggle(event) {    // Toggle handler for Accordian 
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }


    handleSuccess(event) {
        this.showEditField = false;
        this.showbuttons = false;

    }

    handleEdit() {
        this.showEditField = !this.showEditField;
        this.showbuttons = true;
    }


    handlecancel() {
        this.showEditField = false;
        this.showbuttons = false;

    }
}