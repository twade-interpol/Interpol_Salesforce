/*
  Developed By: Matthew Magesh
  Description: This is the component used for Home page
*/
import { LightningElement, wire, track } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import userId from '@salesforce/user/Id';
import getUserRole from '@salesforce/apex/homePageController.getUserRole';

const FIELDS = [NAME_FIELD];
export default class Doj_HomePageComponent extends LightningElement {
userName;
userRole;
userId = userId;

connectedCallback() {
        this.fetchUserRole();
    }

    fetchUserRole() {
        getUserRole()
            .then((result) => { 
                console.log('userole>>'+result);
               this.userRole = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.userRole = undefined;
            });
    }

    @wire(getRecord, { recordId: '$userId', fields: FIELDS})  
currentUserInfo({error, data}) {
    if (data) {
        console.log('data'+JSON.stringify(data));
        this.userName = data.fields.Name.value;
    } else if (error) {
        console.error('cant see picture', error);
        this.error = error ;
    }
    }

}