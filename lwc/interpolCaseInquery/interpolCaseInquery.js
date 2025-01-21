/*
  Developed By: Henry Dennis | Date: 9/5/2024
  Description: Template html File for the Interpol Case Inquiry LWC component
*/

//This is the JS file for the Interpol Case Inquiry LWC
import { LightningElement, wire, api } from 'lwc';
//this is the import for the apex class
import getCaseInquiries from '@salesforce/apex/caseInqueryController.getCaseInquiries';
import searchInquiry from '@salesforce/apex/caseInqueryController.searchInquiry';

//this is the import for the navigation
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refeshApex} from '@salesforce/apex';

// * These are the table actions new code on 9/12/24
/*const ACTIONS = [
    { label: 'View Inquiry', name: 'view' },
    { label: 'Edit Inquiry', name: 'edit' },
   ];*/

export default class InterpolCaseInquery extends NavigationMixin (LightningElement) {

   selectedInquiry;
    /*OLD CODES FROM 9/10/24*/

    // *Case Inquiry Data Table Columns
    caseInquireColumn = [
        {
            label: 'Inquiry Number', fieldName: 'CaseNumberURL', 
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'CaseNumber'
        
                },
                target: '_blank',
                tooltip: 'Click to view Case Inquiry!'
            },
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Inquiry Type', fieldName: 'Type',
            wrapText: true,
            hideDefaultActions: true
        },
      /* {
            label: 'Contact Name', fieldName: 'Contact.Name'
        },*/
        {
            label: 'Subject', fieldName: 'Subject',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Status', fieldName: 'Status',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Priority', fieldName: 'Priority',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Notification Type', fieldName: 'Type_Of_Notification__c',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Sender', fieldName: 'Sender__c',
            type: 'email',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'To', fieldName: 'To__c',
            type: 'email',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'CC', fieldName: 'CC__c',
            type: 'email',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Date Received', fieldName: 'Received_On__c',
            type: 'date',
            wrapText: true,
            hideDefaultActions: true
        },
        {
            label: 'Case Owner', fieldName: 'Owning_Division__c',
            wrapText: true,
            hideDefaultActions: true
        }
       /* {
            label: 'Actions',
            fieldName: 'Actions',
            type: 'action',
            typeAttributes: { 
                rowActions: ACTIONS 
            }
        }*/
       
    ];


    cases;
    baseData;

    // * This method will be called when the component is inserted in the DOM
   connectedCallback() {

        // * Querying contacts
        getCaseInquiries()
         .then(cases => {   
            cases.forEach(singleCase => {
                singleCase.CaseNumberURL = '/' + singleCase.Id;
                singleCase.type = singleCase.Type;
                singleCase.subject = singleCase.Subject;
                singleCase.status = singleCase.Status;
                singleCase.priority = singleCase.Priority;
                singleCase.notificationtype = singleCase.Type_Of_Notification__c;
                singleCase.sender = singleCase.Sender__c;
                singleCase.to = singleCase.To__c;
                singleCase.cc = singleCase.CC__c;
                singleCase.datereceived = singleCase.Received_On__c;
                singleCase.caseowner = singleCase.Owning_Division__c;

               
            });
             console.log(cases);
            this.cases = cases;
            this.baseData = this.cases;
       })
       .catch(error => console.log(error));

     }
      /*OLD CODES ENDS FROM 9/10/24*/
     /*--------------------------------------*/

     /*NEW CODES FROM 9/12/24*/


    @wire(getCaseInquiries)
    inquiryWire(result){
        this.wireInquiries = result;
        if(result.data){
            this.cases = result.data.map((row) =>{ 
            return this.mapInquiry(row);
            })
            this.baseData = this.cases;
        }
                if(result.error){
                    console.error(result.error);
            
        }
    }

   /* mapInquiry(row){
        console.log(row);
        
    }*/

  
   get selectedInquiryLen() {
        if(this.selectedInquiry == undefined) 
        return 0;
        return this.selectedInquiry.length
    }
    

    handleRowSelection(event){
        this.selectedInquiry = event.detail.selectedRows;
    }

}