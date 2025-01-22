/**
  Author: Chandra
  Description: This Component is used to display record for DOB 
  Created date : 09/24/2024
 */

import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';     // Importing toast events
import DOB_OBJECT from '@salesforce/schema/DOB__c';   // Importing Object refernce 



export default class Doj_dob_record extends LightningElement {

     
        @api fieldList = ["Name", "CreatedById","OwnerId" ]; //harcoded the values assuming objectApiName
          @api lfieldList = ["Name","OwnerId" ]; //harcoded the values assuming objectApiName
            @api rfieldList = ["Date_of_Birth__c" ]; //harcoded the values assuming objectApiName

                   SfieldList = ["OwnerId", "CreatedDate", "CreatedById", "LastModifiedDate"]; //harcoded the values assuming objectApiName
      SrfieldList = ["LastModifiedById"]; //harcoded the values assuming objectApiName
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