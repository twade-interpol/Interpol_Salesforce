/*
  Developed By: Henry Dennis | Date: 9/27/2024
  Description: Js File for the Interpol Case Property LWC component
*/
import { LightningElement, api, wire } from 'lwc';
//this is the import for the apex class
import getProperties from '@salesforce/apex/caseInqueryController.getProperties';

//this is the import for the navigation
import { NavigationMixin } from 'lightning/navigation';

// * These are the table actions new code on 9/12/24
/*const ACTIONS = [
    { label: 'View Property', name: 'view' },
    { label: 'Edit Property', name: 'edit' },
   ];*/

       
export default class Doj_Property extends NavigationMixin (LightningElement) {

   selectedProperty;

    propertyColumns = [
        {
            label: 'Document', fieldName: 'PropertyURL',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'Type_of_Document__c'
                },
                target: '_blank',
                tooltip: 'view Property!'
            },
            wrapText: true,
            hideDefaultActions: true
        },

        /*{
            label: 'Property Name',
            fieldName: 'Name',
            type: 'text',
            wrapText: true,
            hideDefaultActions: true
        },*/

         
        {
            label: 'Property Category',
            fieldName: 'Category__c',
            type: 'text',
             wrapText: true,
            hideDefaultActions: true
        },

         {
            label: 'Property Type',
            fieldName: 'Property_Type__c',
            type: 'text',
             wrapText: true,
            hideDefaultActions: true
        },

         

         /*{
            label: 'Document',
            fieldName: 'Type_of_Document__c',
            type: 'text',
             wrapText: true,
            hideDefaultActions: true
        },*/

         {
            label: 'Country',
            fieldName: 'Country__c',
            type: 'text',
             wrapText: true,
            hideDefaultActions: true
        },

         {
            label: 'Issue Date',
            fieldName: 'Date_of_issue__c',
            type: 'date',
             wrapText: true,
            hideDefaultActions: true
        },

        {
            label: 'Expire Date',
            fieldName: 'Expiry_Date__c',
            type: 'date',
             wrapText: true,
            hideDefaultActions: true
        }

         /*{
            label: 'Actions',
            fieldName: 'Actions',
            type: 'action',
            typeAttributes: { 
                rowActions: ACTIONS 
            }
        }*/


        

   ];

 

// columns = propertyColumns;
 properties =[];
 myProperty;
 error;
 baseData;
 propertyDataFilter=[];
 fullPropertyTableData=[];

 //this is used to hold the selected property row
 selectedProperties;

   // * This method will be called when the component is inserted in the DOM
  connectedCallback() {

        // * This is used to call the getContacts method from the apex class
        getProperties()
        // this is  used to store the data in the contacts variable
        .then(properties => {
            properties.forEach(Property__c => {
                Property__c.PropertyURL = '/' + Property__c.Id;
                Property__c.name = Property__c.Name;
                Property__c.category__c = Property__c.Category__c;
                Property__c.Property_Type__c = Property__c.Property_Type__c;
                Property__c.Type_of_Document__c = Property__c.Type_of_Document__c;
                Property__c.Country__c = Property__c.Country__c;
                Property__c.Date_of_issue__c = Property__c.Date_of_issue__c;
                Property__c.Expiry_Date__c = Property__c.Expiry_Date__c;
            });
            console.log(properties);
            this.properties = properties;
            this.baseData = myProperty;
             this.propertyDataFilter = properties;
             this.fullPropertyTableData = properties;
            ///this.selectedContactRow = contacts.slice(0, 3).map(contact => contact.Id);
           /// console.log(JSON.stringify(this.selectedContactRow));
        })
        .catch(error => console.log(error));
    }

  @api recordId;
    property;

     get selectedPropertyLen() {
        if (this.selectedProperty == undefined) 
            return 0;
        return this.selectedProperty.length
    }

    handleRowSelection(event){
        this.selectedProperty = event.detail.selectedRows;
    }

}