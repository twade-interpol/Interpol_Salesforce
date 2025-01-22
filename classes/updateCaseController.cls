/**
  Author: Chandra
  Description: Utility Apex class for LWC 
  Created date : 09/10/2024
 */

public with sharing class updateCaseController {
    @AuraEnabled(cacheable=true)
    public static list<ComplaintCase>  getCases(){ 
        return [SELECT Id,Name, CaseId,case.casenumber, Saved_Search_Results__c,PublicComplaintId,PublicComplaint.Name, Offenses__c, Offenses__r.Name, Aliases__c, DOBs__c, Businesses__c, Properties__c, Interpol_Cases__c, Reference__c, Office__c, Type_Of_Notification__c, Control_Nr__c, ENTITY_ID__c, Status_Id__c, FileNumber__c FROM ComplaintCase];
    }

    @AuraEnabled(cacheable=true)
    public static list<Alias__c>  getAlias(){ 
        return [SELECT Id, Aliases__c,Aliases__r.Name,Name, OwnerId, owner.name FROM Alias__c] ;
    }

    @AuraEnabled(cacheable=true)
    public static list<DOB__c>  getDob(){ 
        return [SELECT Id, Name, DOBs__c,DOBs__r.name, OwnerId, owner.name FROM DOB__c] ;
    }
    //Added method to retrieve business reocrd info for lwc Que.C 09/30/24
    @AuraEnabled(cacheable=true)
    public static list<Businesses__c>  getBus(){ 
        return [SELECT Id, Name, Street_Address__c, Businesses__c, Businesses__r.name, OwnerId, owner.name FROM Businesses__c] ;
    }
    
    
        //Added method to retrieve business reocrd info for lwc Que.C 09/30/24
    @AuraEnabled(cacheable=true)
    public static list<Inquiry_Interpol_Case_Junction__c>  getassciation(id recordid, string pagetype){ 
        if(pagetype == 'full'){
            system.debug('In full');
        return [SELECT Id, Inquiry__c,Inquiry__r.CaseNumber, Interpol_Case__c,Interpol_Case__r.Name, CreatedDate, CreatedById, CreatedBy.Name,LastModifiedBy.Name, LastModifiedDate, LastModifiedById  FROM Inquiry_Interpol_Case_Junction__c where Interpol_Case__c  =: recordid or Inquiry__c =: recordid limit 2000] ;
        }else{
              system.debug('In related');
             return [SELECT Id, Inquiry__c,Inquiry__r.CaseNumber, Interpol_Case__c,Interpol_Case__r.Name, CreatedDate, CreatedById, CreatedBy.Name,LastModifiedBy.Name, LastModifiedDate, LastModifiedById  FROM Inquiry_Interpol_Case_Junction__c where Interpol_Case__c  =: recordid or Inquiry__c =: recordid limit 10] ;
       
        }
    }
    
    
    @AuraEnabled(cacheable=true)
    public static integer getassciationcount(id recordid){ 
        integer recount = [SELECT count() FROM Inquiry_Interpol_Case_Junction__c where Interpol_Case__c  =: recordid or Inquiry__c =: recordid];
        return  recount;
    }
    
    /*
        @AuraEnabled(cacheable=true)
    public static boolean emptycall(id recordid){ 
       
        return  true;
    }
    */
            //Added method to retrieve business reocrd info for lwc Que.C 09/30/24
    @AuraEnabled
    public static list<ComplaintCase>  searchRecords(String searchKey){ 
        if (String.isEmpty(searchKey)) {
            return new List<ComplaintCase>();
        }
        
         String query = '%' + searchKey + '%';
           return [
            SELECT Id, Name
            FROM ComplaintCase
            WHERE Name LIKE :query
            LIMIT 10
        ]; 
        
     //   return [SELECT Id, Inquiry__c,Inquiry__r.CaseNumber, Interpol_Case__c,Interpol_Case__r.Name FROM Inquiry_Interpol_Case_Junction__c where Interpol_Case__c  =: recordid] ;
    }
    
    
    
}