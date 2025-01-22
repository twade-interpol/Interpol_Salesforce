/**
  Author: Chandra
  Description: This Component is used to display record for INTERPOL Case 
  Created date : 09/06/2024
 */


import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';     // Importing toast events
import COMPLAINTCASE_OBJECT from '@salesforce/schema/ComplaintCase';   // Importing Object refernce 



export default class DOJ_Complaint_Case_Record extends LightningElement {

     
        fieldList = ["Interpol_Name__c", "Offenses__c", "Aliases__c", "Reference__c", "Office__c", "Type_Of_Notification__c", "CaseId", "Control_Nr__c", "ENTITY_ID__c", "Businesses__c", "Properties__c","Saved_Search_Results__c","Interpol_Cases__c","Comments__c"]; //harcoded the values assuming objectApiName
      //"PublicComplaintId"
        lfieldList = ["Name", "Offenses__c"]; //harcoded the values assuming objectApiName
     
       rfieldList = [ "Status__c","Comments__c","Review_Date__c"]; //harcoded the values assuming objectApiName
     

    //   SfieldList = ["OwnerId", "CreatedDate", "CreatedById"]; //harcoded the values assuming objectApiName
   //   SrfieldList = ["LastModifiedById", "LastModifiedDate"]; //harcoded the values assuming objectApiName

       SfieldList = ["CreatedDate","CreatedById"]; //harcoded the values assuming objectApiName
      SrfieldList = ["LastModifiedDate"]; //harcoded the values assuming objectApiName


        showEditField;     // show or Hide fields 
        showbuttons;       // Show or Hide Save and Cancel Buttons 
        @api recordId;     // Record ID of the interpol case
    
       @api objectApiName;
        activeSections = ['A','B'];  // Section for Accordian 
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
            
            
            handlecancel(){
                this.showEditField = false;
                this.showbuttons = false;
              
            }


}