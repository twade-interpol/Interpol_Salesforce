public class doj_SubjectRelatedViewController {

      @AuraEnabled(cacheable=true)
    public static String fetchSubjectId(Id recordId) {
        
        ComplaintCase Compcase= [SELECT Interpol_Cases__c FROM ComplaintCase where id=:recordId];
        return Compcase.Interpol_Cases__c;
        //return null;
    }
}