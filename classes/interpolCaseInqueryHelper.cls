/*
 Developed By: Henry Dennis | Date: 9/5/2024
 Description: This class is used to query the Inquiry object and return the case number and the case owner.
 This class is also used to create, update, and delete cases and associate those cases to the inquiry.
*/

public with sharing class interpolCaseInqueryHelper {
    @AuraEnabled
    public static List<Case> getCaseInquiries(){
        return[SELECT CaseNumber, Type, Contact.Name, Subject, Status, 
        Priority FROM Case];
    }

}