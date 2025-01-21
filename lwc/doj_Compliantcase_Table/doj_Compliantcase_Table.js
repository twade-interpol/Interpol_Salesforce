/**
  Author: Chandra
  Description: This Component is used to display to List View 
  Created date : 09/10/2024
 */

import { LightningElement, track, wire } from 'lwc';
import getCases from '@salesforce/apex/updateCaseController.getCases';

const columns = [
    //   { label:'Public Complaint', fieldName: 'PublicComplaintlink', type: 'url', sortable:true, typeAttributes: {label: {fieldName: 'PublicComplaintName'}, tooltip:'Go to detail page', target: '_blank'}},
    { label: 'Name', fieldName: 'recordid', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, tooltip: 'Go to detail page', target: '_blank' } },
    { label: 'Inquiry', fieldName: 'caserecordid', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'CaseNumber' }, tooltip: 'Go to inquiry', target: '_blank' } },

    { label: 'Offenses', fieldName: 'Offenseslink', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Offenses__rName' }, tooltip: 'Go to offences', target: '_blank' } },
    { label: 'Office', fieldName: 'Office__c', type: 'text', sortable: true },
    { label: 'Reference', fieldName: 'Reference__c', type: 'text', sortable: true },
    { label: 'Type Of Notification', fieldName: 'Type_Of_Notification__c', type: 'text', sortable: true },
    { label: 'Entity Id', fieldName: 'Control_Nr__c', type: 'text', sortable: true },

];
export default class UpdateMultipleCases extends LightningElement {
    error;
    columns = columns;
    allRecords; //All Cases available for data table    
    showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    rowNumberOffset; //Row number
    preSelected = [];
    selectedRows;
    showQuestions=false;
    yesNoOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
    ];

    @wire(getCases)
    wopps({ error, data }) {
        if (data) {
            let records = [];
            for (let i = 0; i < data.length; i++) {
                let record = {};
                record.rowNumber = '' + (i + 1);
                record.PublicComplaintlink = '/lightning/r/PublicComplaint/' + data[i].PublicComplaintId + '/view';
                record.PublicComplaintlink = '/' + data[i].PublicComplaintId;
                record.recordid = '/' + data[i].Id;
                if (data[i].CaseId != undefined && data[i].CaseId != '') {
                    record.CaseNumber = data[i].Case.CaseNumber;
                    record.caserecordid = '/' + data[i].CaseId;
                }


                record.Offenseslink = '/' + data[i].Offenses__c;
                //    if(data[i].PublicComplaint != undefined ){
                record.PublicComplaintName = data[i].PublicComplaint.Name;
                //      }
                if (data[i].Offenses__r != undefined) {
                    record.Offenses__rName = data[i].Offenses__r.Name;
                }


                record = Object.assign(record, data[i]);
                records.push(record);
            }
            this.allRecords = records;
            this.showTable = true;
        } else {
            this.error = error;
        }
    }
    //Capture the event fired from the paginator component
    handlePaginatorChange(event) {
        this.recordsToDisplay = event.detail.recordsToDisplay;
        this.preSelected = event.detail.preSelected;
        if (this.recordsToDisplay && this.recordsToDisplay > 0) {
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
        } else {
            this.rowNumberOffset = 0;
        }
    }

    getSelectedRows(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedRecordIds = [];
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {
            console.log(selectedRows[i].Id);
            selectedRecordIds.push(selectedRows[i].Id);
        }
        this.template.querySelector('c-doj_compliant_-case_-list-view').handelRowsSelected(selectedRecordIds);
    }

    handleAllSelectedRows(event) {
        this.selectedRows = [];
        const selectedItems = event.detail;
        let items = [];
        selectedItems.forEach((item) => {
            this.showActionButton = true;
            console.log(item);
            items.push(item);
        });
        this.selectedRows = items;
        console.log(this.selectedRows);
    }


    changeStyle() { 
        //Generate Dynamic Values
        let mdata = [];
        this.allRecords.forEach(ele => {
            if (ele['Priority']) {
                ele.priorityModified = ele.Priority === 'High' ? 'slds-text-color_error' : 'slds-text-color_success';
            }

            if (ele['Status']) {
                ele.statusModified = ele.Status === 'Closed' ? `slds-is-edited` : ``;
            }
            mdata.push(ele);
        });
        this.allRecords = mdata;
        this.template.querySelector('c-doj_compliant_-case_-list-view').setRecordsOnPage();
    }

    handleshowQuestions()
    {
        this.showQuestions = true;
    }
     handleDataEvent(event) {
        // Access the data sent from the child component
        this.showQuestions = event.detail;
    }

}