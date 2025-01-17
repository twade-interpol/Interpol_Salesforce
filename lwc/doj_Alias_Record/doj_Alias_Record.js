/**
  Author: Chandra
  Description: This Component is used to display record for Alias 
  Created date : 09/25/2024
 */

import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';     // Importing toast events
import Alias_OBJECT from '@salesforce/schema/Alias__c';   // Importing Object refernce 



export default class Doj_Alias_Record extends LightningElement {

   fieldList = ["Name", "OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate", "LastModifiedById"]; //harcoded the values assuming objectApiName
 //harcoded the values assuming objectApiName
    showEditField;     // show or Hide fields 
    showbuttons;       // Show or Hide Save and Cancel Buttons 
    @api recordId;     // Record ID of the interpol case

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