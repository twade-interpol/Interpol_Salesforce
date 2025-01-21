/**
  Author: Chandra
  Description: This Component is used to display linked Inquiry and Interpol cases 
  Created date : 12/04/2024
 */

import { LightningElement, track, wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import getassciation from '@salesforce/apex/updateCaseController.getassciation';
import getassciationcount from '@salesforce/apex/updateCaseController.getassciationcount';
import { deleteRecord } from 'lightning/uiRecordApi';
import  LINK_OBJECT from '@salesforce/schema/Inquiry_Interpol_Case_Junction__c'; 
import { NavigationMixin } from 'lightning/navigation';
import {IsConsoleNavigation,getFocusedTabInfo,setTabLabel,openSubtab} from 'lightning/platformWorkspaceApi';
import { subscribe, MessageContext } from 'lightning/messageService';
import refresh_MESSAGE_CHANNEL from '@salesforce/messageChannel/refreshrelatedlistInterpolInquiries__c';

const TAB_LABEL = 'Linked Inquires and INTERPOL cases';

export default class Doj_relatedlistInquirytointerpolcase extends NavigationMixin(LightningElement) {
      @wire(MessageContext)
    messageContext;

     @wire(CurrentPageReference)
    currentPageRef;

  @wire(IsConsoleNavigation) isConsoleNavigation;

  @api strTitle ='Linked Inquiries and Cases';
 
  
  @track buttonlabelinq = false;
  @track buttonlabelinc = false;

  

  tabId;

     subscribeToMessageChannel() {
        subscribe(this.messageContext, refresh_MESSAGE_CHANNEL, (message) => {
            this.handleMessage();
        });
    }

        handleMessage(message) {
            console.log(message);
             refreshApex(this.apexdata);
             refreshApex(this.apexrecount);
    }
 
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


     if(this.recordId.startsWith("500") )
     {
        this.buttonlabelinq =  true;
     }else
     {
        this.buttonlabelinc = true;
     }


    }


    @track columns = [
    //   { label:'Public Complaint', fieldName: 'PublicComplaintlink', type: 'url', sortable:true, typeAttributes: {label: {fieldName: 'PublicComplaintName'}, tooltip:'Go to detail page', target: '_blank'}},
  //  { label: 'Name', fieldName: 'recordid', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, tooltip: 'Go to detail page', target: '_blank' } },
      { label: 'INTERPOL Case Number', fieldName: 'INTERPOLCaseNumber', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Interpol_Case__rName' }, tooltip: 'Go to INTERPOL Case',  } },
      { label: 'Inquiry Number', fieldName: 'Inquirylink', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Inquiry__rCaseNumber' }, tooltip: 'Go to inquiry',  } },
      { label: 'Created By', fieldName: 'CreatedByIdlink', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'CreatedByName' },  } },
      { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: true,  },
      { label: 'Last Modified By', fieldName: 'LastModifiedByIdlink', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'LastModifiedByName' }, } },
      { label: 'Last Modified Date', fieldName: 'LastModifiedDate', type: 'date', sortable: true, },
       {
            type: 'action',
            typeAttributes: {
                rowActions: this.getRowActions.bind(this), // Dynamically define actions
                menuAlignment: 'right'
            }
        }


];
objectApiName=LINK_OBJECT;
      fields = ['Name','Interpol_Case__c',   'Inquiry__c','LastModifiedById','CreatedById'];

    @track isShowModal = false;
     @track isDelete = false;
     @track isEdit = false;
     @track rowtodelete;
     @track rowtoEdit;
     @track apexrecount;
    error;
    @track allRecords; //All Cases available for data table    
    showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    rowNumberOffset; //Row number
    preSelected = [];
    selectedRows;
    @track reccount = 0;
    showQuestions=false;
    @api recordId;     // Record ID of the interpol case
    @track apexdata = []; 
    @track rellistlinl ;
    @api pagetype;

    @track pagerequest;
    
    @api passedrecid;
    @track viewallpage = true;;




get pagerequest(){
    if(this.pagetype && this.pagetype == 'full'){
           return 'full';

        }else{
            return '';
        }

}

       get viewallpage(){
        if(this.pagetype && this.pagetype == 'full'){
           return false;

        }else{
            return true;
        }
        
    }

get passedrecid(){
      return this.recordId;
}

get showviewall(){

if(this.pagetype && this.pagetype == 'full')
  return false;
else
  return true;

}


   // Define row actions
    getRowActions(row, doneCallback) {
        const actions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' }
        ];
        doneCallback(actions);
    }


    @wire(getassciationcount,{ recordid: '$passedrecid'}) 
    ress(result){
         this.apexrecount = result;
          this.reccount = result.data;
    }

    @wire(getassciation,{ recordid: '$passedrecid',pagetype : '$pagetype' }) 
    wopps(result) {
        this.apexdata = result;
        this.rellistlinl = '/lightning/r/Case/' + this.recordId + '/related/Inquiry_Interpol_Case_Junction__r/view?2.fragment=';
        if (result.data) {
            let records = [];
            let count = this.pagetype == 'full' ? 9 : result.data.length;
            for (let i = 0; i < result.data.length; i++) {
                let record = {};
                record.Id = result.data[i].Id;
                record.Name = result.data[i].Name;
                record.Inquirylink = '/' + result.data[i].Inquiry__c;
                record.Inquiry__rCaseNumber = result.data[i].Inquiry__r.CaseNumber;
                record.INTERPOLCaseNumber = result.data[i].Interpol_Case__r.Name;
                record.INTERPOLCaseNumber = '/' + result.data[i].Interpol_Case__c;
                record.Interpol_Case__rName = result.data[i].Interpol_Case__r.Name;
                record.CreatedByName =  result.data[i].CreatedBy.Name;
                record.CreatedByIdlink = '/' + result.data[i].CreatedById;
                record.LastModifiedByIdlink = '/' + result.data[i].LastModifiedById;
                record.LastModifiedByName =  result.data[i].LastModifiedBy.Name;
                record = Object.assign(record, result.data[i]);
                records.push(record);
           //      this.reccount = result.data.length;
            }
            this.allRecords = records;
            this.showTable = true;
        } else {
            this.error = result.error;
          //  this.reccount = 0;
        }
    }

        /**
     * modal dialog open
     */
    openModal(){
        this.isShowModal = true;
    }

    /**
     * modal dialog close
     */
    closeModal(){
        this.isShowModal = false;
    }



/* Open new subtab*/

  handleNavigate() {
    var compDefinition = {
      componentDef: 'c:linkinterpolcaseinquiry',
      attributes: {
        passedrecord: this.passedrecid,
      },
    };
    // Base64 encode the compDefinition JS object
    let encodedDef = btoa(JSON.stringify(compDefinition));
     openSubtab(this.tabId, {url:"/one/one.app#" + encodedDef,icon:'SubTab Icon Name', label:'Create new linked Inquires and INTERPOL cases' }).then(result => {
            console.log('result', result);
        }).catch(error => {
            console.log('error', error);
        });

/*    url = '/one/one.app#' + encodedCompDef;
  //   window.open(url, '_blank');


  /*
    this.[NavigationMixin.GenerateUrl]({
      type: 'standard__webPage',
      attributes: {
        url: '/one/one.app#' + encodedCompDef,
      },
    }).then((url) => {
            window.open(url, '_blank'); // Open in a new tab
        });

        */


/*
    this[NavigationMixin.Navigate]({
      // Pass in pageReference
      type: 'standard__component',
      attributes: {
        componentName: 'c__linkinterpolcaseinquiry',
        apiName: "CustomTabName1",
      },
      state: {
        c__passedrecord: this.passedrecid,
      },
    });
*/
  }



    // Handle row actions
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'edit':
            this.rowtoEdit = row;
            this.isEdit = true;
                //this.editRow(row);
                break;
            case 'delete':
               this.isDelete = true;
               this.rowtodelete = row;
             //   this.deleteRow(row);
                break;
            default:
                break;
        }
    }


    // Edit Row
    editRow(row) {
        const toastEvent = new ShowToastEvent({
            title: 'Edit Row',
            message: 'Editing row',
            variant: 'info'
        });
        this.dispatchEvent(toastEvent);
        // Implement your edit logic here (e.g., open a modal)
        this.isShowModal = true;
    }

    // Delete Row
    deleteRow(row) {
        const toastEvent = new ShowToastEvent({
            title: 'Delete Row',
            message: 'Are you Sure you want to delete?',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    // deleteRecord Row
    deleteRecord() {

 deleteRecord(this.rowtodelete.Id)
      .then(() => {
      
          //5. We are firing a toast message
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record deleted',
                variant: 'success'
            })
        );
        this.allRecords = this.allRecords.filter(record => record.Id !== this.rowtodelete.Id);
        this.rowtodelete = '';

      })
      .catch((error) => {
   this.dispatchEvent(
            new ShowToastEvent({
                 title: 'Error deleting record',
                 message: reduceErrors(error).join(', '),
                variant: 'success'
            })
        );
      });
  


         this.isDelete = false;
    }

closedelete(){
        this.isDelete = false;

}

closeedit(){
        this.isEdit = false;

}



    handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        const efields = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(efields);

    }

    handleSuccess(event) {
        this.rowtoEdit = '';
            this.isEdit = false;
             refreshApex(this.apexdata);
             refreshApex(this.apexrecount);
                    const toastEvent=new ShowToastEvent({
            title:"Record has been Edited successfully !",
            message: "Success ",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);




    }


       handleSuccesscase(event) {
        this.rowtoEdit = '';
            this.isEdit = false;
             refreshApex(this.apexdata);
             refreshApex(this.apexrecount);

                    const toastEvent=new ShowToastEvent({
            title:"Record has been created successfully !",
            message: "Success ",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);




    }

    handleError(event) {
                this.rowtoEdit = '';
            this.isEdit = false;
            const toastEvent=new ShowToastEvent({
            title:"Error editting record !",
            message: "Error ",
            variant: "Error"
        });
        this.dispatchEvent(toastEvent);
    }

refreshdata(){
 refreshApex(this.apexdata);
 refreshApex(this.apexrecount);

}

viewall(){

      var compDefinition = {
      componentDef: 'c:doj_relatedlistInquirytointerpolcase',
      attributes: {
        pagetype: 'full',
        recordId: this.recordId,
      },
    };
    // Base64 encode the compDefinition JS object
    let encodedDef = btoa(JSON.stringify(compDefinition));
     openSubtab(this.tabId, {url:"/one/one.app#" + encodedDef,icon:'SubTab Icon Name', label:'linked Inquires and INTERPOL cases' }).then(result => {
            console.log('result', result);
        }).catch(error => {
            console.log('error', error);
        });


/*
    this[NavigationMixin.Navigate]({
      // Pass in pageReference
      type: 'standard__component',
      attributes: {
        componentName: 'c__doj_relatedlistInquirytointerpolcase',
         apiName: "CustomTabName",
      },
      state: {
        c__pagetype: 'full',
        c__relatedrec: this.recordId,
      },
    });
    */

}
}