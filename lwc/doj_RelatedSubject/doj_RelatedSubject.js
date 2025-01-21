import { LightningElement, track, wire,api } from 'lwc';
import searchContacts from '@salesforce/apex/doj_RelatedSubjectController.searchContacts';
import linkSubject from '@salesforce/apex/doj_RelatedSubjectController.linkSubject';
import getObjectType from '@salesforce/apex/doj_RelatedSubjectController.getObjectType';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [

    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'Email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
];
export default class Doj_RelatedSubject extends NavigationMixin(LightningElement) {
 
  @track searchTerm = '';
    @track contacts;
    @track error;
    @api recordId;
    data = [];              // Holds the fetched data from the Apex controller
    filteredData = [];
    selectedIds = [];      // Holds the data after applying the search filter
    delayTimeout;           // Used for debouncing the search input
    isPopupOpen=false;
    objectName=' ';
    objectId='';

    connectedCallback() {
        this.recordId=this.recordId;
        console.log('Record ID:', this.recordId); // You can use it as needed in your component
        if (this.recordId) {
            this.fetchObjectType();
        }
    }

    async fetchObjectType() {
    try {
      this.objectName = await getObjectType({ recordId: this.recordId });
      if(this.objectName =='ComplaintCase') 
      {
        this.objectName= 'Case';
      }
      if(this.objectName =='Case')
      {
        this.objectName= 'Inquiry';
      }
      console.log('this.objectName>>>'+this.objectName);
    } catch (error) {
      console.error('Error fetching object type:', error);
    }
  }

    @wire(searchContacts, { searchTerm: '$searchTerm' })
    wiredContacts({ error, data }) {
        if (data) {
            this.data = data;
            this.filterData();  // Filter data when fetched
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

    // Getter method for columns

    get columns() {

        return columns;

    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
         this.debounceFilter();   // Debounce to delay filtering for better performance
    }

     // Debouncing function to delay filter invocation

    debounceFilter() {

        clearTimeout(this.delayTimeout);

        this.delayTimeout = setTimeout(() => {

            this.filterData();

        }, 300);

    }

     filterData() {

        this.filteredData = this.data.filter(record =>

            // Case-insensitive search for Name and Email fields

            Object.values(record).some(value =>

                value.toLowerCase().includes(this.searchTerm.toLowerCase())

            )

        );

    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedIds = selectedRows.map(row => row.Id); // Collect selected record IDs
        console.log('this.selectedIds>>'+this.selectedIds);
    }

     // Send selected IDs to Apex
    handleSave() {
        if (this.selectedIds.length === 0) {
            console.log('No records selected');
            return;
        }

        linkSubject({ subjectIds: this.selectedIds,parentId:this.recordId})
            .then(result => {
                console.log('Apex call result:', result[0]);
                console.log('Apex call result1>>:', result[1]);
                this.objectId=result[1];
                this.navigateToRecord(result[0]);
                 this.showToast(result[0]);
                // Additional success handling, like showing a success message
            })
            .catch(error => {
                console.error('Error calling Apex:', error);
            });
    }

    /* navigateToRecord(recordId) {
        // Check if recordId is provided
        if (!recordId) return;

        // Navigate to the record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
     }*/
     
     navigateToRecord(msg) {
       if (!this.recordId) return;

       /* // Build the URL dynamically
        const baseUrl = window.location.origin;
        const recordUrl = `${baseUrl}/${this.objectId}`;

        // Redirect to the record page
        setTimeout(() => {
        window.location.assign(recordUrl);
         }, 3000);*/
        if(msg==='The selected subject(s) are linked to the Interpol Case')
        {
            const baseUrl = window.location.origin; // Get the base URL dynamically
            window.top.location.href = `${baseUrl}/lightning/r/ComplaintCase/${this.recordId}/related/Related_Subjects__r/view`;
        }else{
            const baseUrl = window.location.origin; // Get the base URL dynamically
            window.top.location.href = `${baseUrl}/lightning/r/Case/${this.recordId}/related/Inquiry_Subjects__r/view`;

        }

    }
    handleCancel()
    {
       /*const baseUrl = window.location.origin;
       const recordUrl = `${baseUrl}/${this.objectId}`;
       window.location.assign(recordUrl);*/

       return (this.sfdcBaseURL = window.location.origin + '/' + this.objectId);

    }

    showToast(message) {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: message,
            variant: 'success', // possible values: 'success', 'error', 'warning', 'info'
        });
        this.dispatchEvent(event);
    }
    closePopup(){

        this.isPopupOpen=false;
    }
}