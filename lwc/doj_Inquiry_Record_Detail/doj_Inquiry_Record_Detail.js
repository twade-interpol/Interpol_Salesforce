/**
  Author: Chandra
  Description: This Component is used to display Inquiry record 
  Created date : 12/30/2024
 */

import { LightningElement, api, wire, track } from 'lwc';

export default class DOJ_Complaint_Case_Record extends LightningElement {


  //"Inquiry Information
  lfieldList = ["Subject__c", "From__c", "To__c", "CC__c"];
  rfieldList = ["Sender__c", "Importance__c", "Received_On__c","Deduplication_Details__c"];


  //"Additional Information
  lafieldList = ["Status", "Priority", "Category__c", "OwnerId", "Owning_Division__c"];
  rafieldList = ["CaseNumber", "CreatedById","LastModifiedDate", "LastModifiedById"];


  //"Email Information
  ldfieldList = ["Email_Body__c"];
  rdfieldList = [];




  showEditField;     // show or Hide fields 
  showbuttons;       // Show or Hide Save and Cancel Buttons 
  @api recordId;     // Record ID of the interpol case

  @api objectApiName;
  activeSections = ['A', 'B', 'C'];  // Section for Accordian 
  // Function to expand and collaspse Accordian
  handleSectionToggle(event) {    // Toggle handler for Accordian 
    const openSections = event.detail.openSections;

    if (openSections.length === 0) {
      this.activeSectionsMessage = 'All sections are closed';
    } else {
      this.activeSectionsMessage =
        'Open sections: ' + openSections.join(', ');
    }
  }

  // function called after save to show fields as display only after save 
  handleSuccess(event) {
    this.showEditField = false;
    this.showbuttons = false;

  }
  // Handle Edit to make fields editable 
  handleEdit() {
    this.showEditField = !this.showEditField;
    this.showbuttons = true;
  }


  handlecancel() {
    this.showEditField = false;
    this.showbuttons = false;

  }


}