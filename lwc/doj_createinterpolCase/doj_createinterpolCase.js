/**
  Author: Chandra
  Description: This Component is used to create INTERPOL case  
  Created date : 11/28/2024
 */

import { LightningElement, track,wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';     // Importing toast events
import { CloseActionScreenEvent } from 'lightning/actions';
import COMPLAINTCASE_OBJECT from '@salesforce/schema/ComplaintCase'; 
import { NavigationMixin } from 'lightning/navigation';
import { IsConsoleNavigation, openTab, closetab, getFocusedTabInfo} from 'lightning/platformWorkspaceApi';

export default class Doj_createinterpolCase extends NavigationMixin(LightningElement) {
        @wire(IsConsoleNavigation) isConsoleNavigation;

@api calledfrmlist;
    get dynamicStyle() {
        if(this.calledfrmlist == "true"){
            return `margin-left: 20%;margin-right: 20%;`;
        } else{
           return `margin-left: 0%;margin-right: 0%;`;
        }
    } 

    get cardstyle(){
        if(this.calledfrmlist == "true"){
            return `display: block;height: 28rem;`;
        } else{
           return ``;
        }

    }

    

    objectApiName=COMPLAINTCASE_OBJECT;

        lfieldList = ["Name", "Offenses__c"]; //harcoded the values assuming objectApiName
     
       rfieldList = ["Status__c","Comments__c"]; //harcoded the values assuming objectApiName
     

     fulllist = [ "Offenses__c","Status__c","Review_Date__c","Comments__c"];

/*
connectedCallback() {
        getFocusedTabInfo().then((tabInfo) => {
            if(tabInfo.parentTabId)
              this.tabId = tabInfo.parentTabId;
            else{
              this.tabId = tabInfo.tabId;
            }
            console.log('this.tabId',this.tabId);
        })
        if(this.pagetype && this.pagetype == 'full' ){
          console.log(this.pagetype);
        }else{
            this.pagetype = '';
        }

}
*/

 async handleSuccess(event){
     const crerecordId = event.detail.id; 
        const toastEvent=new ShowToastEvent({
            title:"Record has been created successfully !",
            message: "Interpol Case Created ",
            variant: "success"
        });


 try {

if (IsConsoleNavigation) {
     /*  const focusedTabInfo = await GetFocusedTabInfo();
         if (focusedTabInfo.tabType === 'PrimaryTab') {
              await CloseTab({ tabId: focusedTabInfo.tabId });
         }
*/
        openTab({
                recordId: crerecordId,
                focus: true, // Automatically focus the tab
            }).catch((error) => {
                console.error('Error opening workspace tab:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Failed to open a new Salesforce tab.',
                        variant: 'error'
                    })
                );
            });

        // Dispatch a custom event to notify the Aura component
        const event = new CustomEvent('callaurafunction', {
            detail: '' , // Optional: Send data to Aura
        });
        this.dispatchEvent(event);



        }
            // Open the record in a new console tab
          else {

    
                // Open the newly created record in a new tab
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: crerecordId,
                actionName: 'view'
            }
        }, true); // true opens the record in a new tab
        }
  
   } catch (error) {
        // Handle any errors during navigation


 }

/*
  if (!this.isConsoleNavigation) {
            return;
        }
       else{

     await  openTab({
            pageReference: {
                type: 'standard__objectPage',
                attributes: {
                    recordId: crerecordId,
                    actionName: 'View'
                }
            },

        });
       }
*/
    //    this.dispatchEvent(toastEvent);
        
    }


onSubmitHandler(event) {
    event.preventDefault();
    // Get data from submitted form
    const fields = event.detail.fields;
    // Here you can execute any logic before submit
    // and set or modify existing fields
    fields.PublicComplaintId = '0fhSL0000000001YAA';
    fields.CaseId = '500SL000001YhhtYAC';
    // You need to submit the form after modifications
     this.template.querySelector('lightning-record-form').submit(fields);
}

   customHideModalPopup() {    
        this.dispatchEvent(new CloseActionScreenEvent());
                // Dispatch a custom event to notify the Aura component
        const event = new CustomEvent('callaurafunction', {
            detail: '' , // Optional: Send data to Aura
        });
        this.dispatchEvent(event);
        
    }



}