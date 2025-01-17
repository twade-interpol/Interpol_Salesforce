import { LightningElement,wire,api } from 'lwc';
import { getRelatedListRecordsBatch } from 'lightning/uiRelatedListApi';
import { getRecord } from 'lightning/uiRecordApi';
import fetchSubjectId from '@salesforce/apex/doj_SubjectRelatedViewController.fetchSubjectId';

const CASECOLUMNS = [   
{ label: 'Interpol Case', fieldName: 'Name' , initialWidth: 180,
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'NameLabel' },  // Custom label for the link
            target: '_blank'  // Opens the link in a new tab
}},
{ label: 'Offences', fieldName: 'Offenses__c',initialWidth: 180,
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'offenceLabel' },  // Custom label for the link
            target: '_blank'  // Opens the link in a new tab
}},
{ label: 'Aliases', fieldName: 'Aliases__c', initialWidth: 180, type: 'url',
        typeAttributes: {
         label:{fieldName:'aliasesLabel'},  // Custom label for the link
        target: '_blank'  // Opens the link in a new tab
}},
   
];
const CASEINQUIRYCOLUMNS = [   
    { label: 'Name', fieldName: 'Name'},
    { label: 'Contact', fieldName: 'Aliases__c'}
];
export default class Doj_SubjectRelatedView extends LightningElement {
    error;
    caserecordList;
    caseinquiryrecords;
    @api recordId;
    subjectId;
    currentUrl = window.location.host;
    subjectName='';
    columns = CASECOLUMNS;
    caseinquirycolumns=CASEINQUIRYCOLUMNS;
    parentRecordId='';
    fields = [
    'ComplaintCase.Interpol_Cases__c',
 ];
      connectedCallback() {
        this.fetchRecordData();
    }

    // Function to fetch the record data
     fetchRecordData() {
       if (this.recordId) {
            fetchSubjectId({ recordId: this.recordId })
                .then(result => {
                    this.parentRecordId = result; // Store the account data
                    console.log('Account Data:', this.accountData); 
                })
                .catch(error => {
                    this.error = error; // Store the error information
                    console.error('Error fetching account details:', error);
                });
        }
    }

    
    //This Wire method is used to get the record of all child related object to Contact.
    @wire( getRelatedListRecordsBatch, {

        parentRecordId: '$parentRecordId',
        relatedListParameters: [
            {
                relatedListId: 'Interpol_Cases__r',
                fields: [ 'ComplaintCase.Id', 'ComplaintCase.Interpol_Cases__r.Name' ,'ComplaintCase.Name', 'ComplaintCase.Offenses__c','ComplaintCase.Aliases__c' , 'ComplaintCase.PublicComplaintId','ComplaintCase.Offenses__r.Name',
                'ComplaintCase.Aliases__r.Name']
            },
         ],
       

    } )listInfo( { error, data } ) {
        console.log('Success Response alias: '+JSON.stringify(data));
        console.log('Error Response alias: '+JSON.stringify(error));
        if ( data ) {
            let caserecordList = [];
            let caseinquiryrecords = [];
            //console.log('data>>'+data[])
            data.results.forEach( obj => {


                console.log('obj>>'+JSON.stringify(obj));
                //recordArray=obj;
                obj.result.records.forEach(obj1 => {
                console.log('obj1>>'+JSON.stringify(obj1));  
                if(obj1.apiName=='ComplaintCase')
                {
                    let recordobj = {};
                    recordobj.Id = obj1.fields.Id.value;
                    recordobj.Name = this.currentUrl+'/'+obj1.fields.Id.value;
                    recordobj.NameLabel=obj1.fields.Name.value
                    recordobj.Offenses__c = obj1.fields.Offenses__c.value!=null ? this.currentUrl+'/'+obj1.fields.Offenses__c.value : '';
                    recordobj.offenceLabel = obj1.fields.Offenses__r.displayValue!=null ? obj1.fields.Offenses__r.displayValue : '';
                    recordobj.Aliases__c = obj1.fields.Aliases__c.value!=null? this.currentUrl+'/'+obj1.fields.Aliases__c.value : '';
                    recordobj.aliasesLabel = obj1.fields.Aliases__r.displayValue!=null? obj1.fields.Aliases__r.displayValue :'';
                    this.subjectName=obj1.fields.Interpol_Cases__r.displayValue
                    console.log('recordobj>>'+JSON.stringify(recordobj));
                    caserecordList.push( recordobj );
                    console.log('caserecordList>>'+JSON.stringify(caserecordList));
                    console.log('>>'+window.location.host);
                    
                }
            });
                

            });
            this.caserecordList=caserecordList;
            this.caseinquiryrecords = caseinquiryrecords;
           
            
        } else if (error) {
            console.log('error>>'+error);
            
        }
    }
}