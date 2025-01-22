import { LightningElement, track, wire } from 'lwc';
export default class Int_CustomComponent extends LightningElement {

    @track accountOptions = [ { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },{ label: 'Unknown', value: 'Unknown' },];

     @track typeOfDocoptions = [ { label: 'Passport', value: 'Passport' },
        { label: 'Driver License	', value: 'DriverLicense' },
        { label: 'Identity Card	', value: 'IdentityCard' },{ label: 'Residence permit', value: 'Residence permit'},
        { label: 'Social Security Number', value: 'SSN' },{ label: 'National Identification Number', value: 'RNIN'},
        { label: 'Other', value: 'Other'}]
}