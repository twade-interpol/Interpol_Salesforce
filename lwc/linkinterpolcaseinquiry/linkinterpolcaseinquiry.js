/**
  Author: Chandra
  Description: This Component is used to  create linked Inquiry and Interpol cases 
  Created date : 12/05/2024
 */

import { LightningElement,api,wire,track  } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import  LINK_OBJECT from '@salesforce/schema/Inquiry_Interpol_Case_Junction__c'; 
import COMPLAINTCASE_OBJECT from '@salesforce/schema/ComplaintCase'; 
import { NavigationMixin } from 'lightning/navigation';
import getassciationcount from '@salesforce/apex/updateCaseController.getassciationcount';
//import emptycall from '@salesforce/apex/updateCaseController.emptycall';
import {IsConsoleNavigation,getFocusedTabInfo,closeTab, refreshTab } from 'lightning/platformWorkspaceApi';
import { publish, MessageContext } from 'lightning/messageService';
import refresh_MESSAGE_CHANNEL from '@salesforce/messageChannel/refreshrelatedlistInterpolInquiries__c';

const TAB_LABEL2 = 'Create new linked Inquires and INTERPOL cases';

export default class Linkinterpolcaseinquiry extends NavigationMixin(LightningElement)  {

      @wire(MessageContext)
    messageContext;
    
 @wire(CurrentPageReference)
    currentPageRef;
@api passedrecord;
@track inquiryid;
@track interpolcaseid;;
 @track showButton = false; 
 @track reccount = 0;
 @track apexrecount;
  @track show;
   @track empty;
     @track emptyres;

  @wire(IsConsoleNavigation) isConsoleNavigation;
@track headertitle;

    @wire(getassciationcount,{ recordid: '$passedrecord',pagetype : '$pagetype'}) 
    ress1(result){
         this.apexrecount = result;
          this.reccount = result.data;
          if(this.reccount ){
            this.show = true;
          }else{
            this.show = true;
          }
    }
/*
    @wire(emptycall,{ recordid: '$passedrecord'}) 
    ress2(result){
         this.empty = result;
          this.emptyres = result.data;
       
          }
    

    /*   renderedCallback() {
          const workspaceAPI = this.template.querySelector('lightning:workspaceAPI');
                if (workspaceAPI) {
                workspaceAPI.setTabLabel({ label: 'TEST LABEL' });
            }

    /*    
        // Check if in Console Navigation
        if (!this.isConsoleNavigation) {
            console.warn('Not in Console Navigation, cannot set tab label.');
            return;
        }
        
        try {
            // Get the focused tab's info
            const focusedTab1 = await getFocusedTabInfo();
            if (focusedTab1.isSubtab && focusedTab1 && focusedTab1.tabId) {
                // Set the label for the focused tab
                await setTabLabel(focusedTab1.tabId, TAB_LABEL2);
                console.log('Tab label set to: ${TAB_LABEL2}');
            } else {
                console.warn('No focused tab found.');
            }
        } catch (error) {
            console.error('Error setting tab label:', error);
        }

        */

/*
        try{
           const tabInfo2 = await getAllTabInfo();
           if(tabInfo2.isSubtab){
            console.log(tabInfo2.isSubtab);
           }

        }
        catch (error) {
            console.error('Error setting tab labelqqqqq:', error);
        } 

        
    } */


     fulllist = [ "Offenses__c","Status__c","Comments__c","Review_Date__c"];


    @track isShowModal = false;
    @track newrec = false;
    @track ipid;

objectApiName=LINK_OBJECT;

    objectApiName2=COMPLAINTCASE_OBJECT;
      rofields = ['Name'];
      lfields = ['Interpol_Case__c'];
      rfields = ['Inquiry__c'];

 /*   get passedrecord() {
        return this.currentPageRef.state.c__passedrecord;
    }

    */

    
    connectedCallback() {
        // Check if recordId starts with '005'
        if (this.passedrecord && this.passedrecord.startsWith('500')) {
            this.inquiryid = this.passedrecord;
            this.showButton = true;
              this.headertitle = 'Link Case to INTERPOL Inquiry ';
        } else {
            this.interpolcaseid = this.passedrecord;
             this.headertitle = 'Link Inquiry to INTERPOL Case';
        }
    }



  handleSuccess(event){
     
     this.newrec = true;
     this.ipId = event.detail.id;
     this.isShowModal = false;
     
      refreshApex(this.apexrecount);

        if (this.ipId && this.ipId.startsWith('500')) {
            this.inquiryid = this.ipId;
        } else {
            this.interpolcaseid = this.ipId;
        }


        const toastEvent=new ShowToastEvent({
            title:"Record has been created successfully !",
       //    message: "Interpol Case Created ",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }


handleCancel(){



            getFocusedTabInfo()
                .then((tabInfo) => {
                    const currentTabId = tabInfo.tabId;

                    // Close the current tab
                    closeTab(currentTabId).then(() => {
                        // Refresh the entire page after the tab is closed
                    //    window.location.reload();
                      publish(this.messageContext, refresh_MESSAGE_CHANNEL,'TEST');
                    });
                })
                .catch((error) => {
                    console.error('Error closing tab:', error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Failed to close the tab.',
                            variant: 'error'
                        })
                    );
                });

                

}

  handleSuccessacc(event){
     
     this.newrec = true;
     this.ipId = event.detail.id;



     if (IsConsoleNavigation) {
            // Get the current focused tab
            getFocusedTabInfo()
                .then((tabInfo) => {
                    const currentTabId = tabInfo.tabId;

                    // Close the current tab
                    closeTab(currentTabId).then(() => {
                        // Refresh the entire page after the tab is closed
                    //    window.location.reload();
                      publish(this.messageContext, refresh_MESSAGE_CHANNEL,'TEST');
                    });
                })
                .catch((error) => {
                    console.error('Error closing tab:', error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Failed to close the tab.',
                            variant: 'error'
                        })
                    );
                });
        }

        
   
        const toastEvent=new ShowToastEvent({
            title:"Record has been linked successfully !",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

    


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


    closeModal(){
        this.isShowModal = false;
    }


handlcaseadd(){

    this.isShowModal = true;
}


    }