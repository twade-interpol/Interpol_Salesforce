import { LightningElement,wire } from 'lwc';
import fetchQuickLink from '@salesforce/apex/doj_QuicklinksController.fetchQuickLink';

export default class Doj_QuickLink extends LightningElement {

  customMetadataList;

    // Use @wire to fetch the custom metadata when the component is loaded
    @wire(fetchQuickLink)
    wiredMetadata({ error, data }) {
        if (data) {
             this.customMetadataList = data.map(item => ({
                id: item.DeveloperName,
                label: item.Label,
                link: item.Link_URL__c // Assuming Link__c is your URL field
            }));
        } else if (error) {
            console.error('Error fetching custom metadata:', error); 
        }
    }
}