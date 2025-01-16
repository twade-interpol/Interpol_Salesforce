/*Developed By: Henry Dennis | Date: 9/5/2024
  Description: controller class File for the Interpol Case Inquiry LWC component
*/

public with sharing class caseInqueryController {
    
    /*This is the Inquiry query.*/
    @AuraEnabled
    public static List<Case> getCaseInquiries(){
        return[SELECT CaseNumber, Type, Subject, Status, 
        Priority, Type_Of_Notification__c, Sender__c, To__c, CC__c, Received_On__c, 
        Owning_Division__c FROM Case];
    }

     /*This is the Search Inquiry query.*/
    @AuraEnabled
    public static List<Case> searchInquiry(String searchString){
        List<List<SObject>> inquiries = [FIND :searchString IN ALL FIELDS RETURNING Case(Id, CaseNumber, Type, Subject, Status,
        Priority, Type_Of_Notification__c, Sender__c, To__c, CC__c, Received_On__c, Owning_Division__c)];
        return (List<Case>) inquiries[0];
    }

    /*This is the Property query.*/
    @AuraEnabled
    public static List<Property__c> getProperties(){
       return [SELECT id, Name, owner.name, Category__c, Property_Type__c, Type_of_Document__c, Country__c, Date_of_issue__c, Expiry_Date__c FROM Property__c] ;
    }

}