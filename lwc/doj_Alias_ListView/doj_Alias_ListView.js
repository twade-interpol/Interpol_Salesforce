/**
  Author: Chandra
  Description: This Component is used to display to List View 
  Created date : 09/25/2024
 */

import { LightningElement, track, wire } from 'lwc';
import getAlias from '@salesforce/apex/updateCaseController.getAlias';


const columns = [
      { label: 'Name', fieldName: 'Namelink', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Name' }, tooltip: 'Go to detail page', target: '_blank' } },
    { label: 'Aliases', fieldName: 'Aliaseslink', type: 'url', sortable: true, typeAttributes: { label: { fieldName: 'Aliases__rname' }, tooltip: 'Go to offences', target: '_blank' } },
    { label: 'Owner', fieldName: 'Ownername', type: 'text', sortable: true },


];





export default class Doj_Alias_ListView extends LightningElement {


    error;
    columns = columns;
    allRecords; //All Cases available for data table    
    showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    rowNumberOffset; //Row number
    preSelected = [];
    selectedRows;

    @wire(getAlias)
    wopps({ error, data }) {
        if (data) {
            console.log('Alias Controller')
            let records = [];
            for (let i = 0; i < data.length; i++) {
                let record = {};

                console.log('log' + data[i].Aliases__c);
                record.rowNumber = '' + (i + 1);
               console.log('log' + data[i].Name);
            
             record.Namelink = '/' + data[i].Id;
                record.Aliaseslink = '/' + data[i].Aliases__c;
                if (data[i].Aliases__r != undefined) {
                    record.Aliases__rname = data[i].Aliases__r.Name;
                }
               record.Ownername = data[i].Owner.Name;

              //  record.LastModifiedByName = data[i].LastModifiedBy.Name;

                 

                record = Object.assign(record, data[i]);
                records.push(record);
            }
            console.log('log' + records);

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




}