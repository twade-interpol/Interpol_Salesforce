public class doj_RelatedSubjectController {

     @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String searchTerm) {
        // Query contacts matching the search term
        return [
            SELECT Id, Name, Email, Phone
            FROM Contact
            WHERE Name LIKE :('%' + searchTerm + '%')
            Order By Name ASC LIMIT 15
        ];
    }
    
     @AuraEnabled
    public static List<String> linkSubject(List<String> subjectIds, Id parentId) {
        List<String> messageList = new List<String>();
        system.debug('subjectIds>>'+subjectIds);
        system.debug('parentId>>'+parentId);
        Schema.SObjectType complaintCaseObject = Schema.ComplaintCase.getSObjectType();
        Schema.SObjectType caseObject = Schema.Case.getSObjectType();
		Schema.SObjectType record = parentId.getsobjecttype();
        system.debug('objectAPIName>>'+record);
        String message='';
        if(record==complaintCaseObject)
        {
            List<Case_Subject__c> caseSubjectList = new List<Case_Subject__c>();
            for(String str:subjectIds)
            {
                Case_Subject__c caseSub= new Case_Subject__c();
                caseSub.INTERPOL_Case__c=parentId;
                caseSub.Subject__c=str;
                caseSubjectList.add(caseSub);
            }
            insert caseSubjectList;
            message='The selected subject(s) are linked to the Interpol Case';
            messageList.add(message);
            messageList.add(parentId);
        }else if(record==caseObject){
            List<Inquiry_Subject__c> inquirySubjectList = new List<Inquiry_Subject__c>();
            for(String str:subjectIds)
            {
                Inquiry_Subject__c inquirySub= new Inquiry_Subject__c();
                inquirySub.INTERPOL_Inquiry__c=parentId;
                inquirySub.Subject__c=str;
                inquirySubjectList.add(inquirySub);
            }
            insert inquirySubjectList;
            message='The selected subject(s) are linked to the Interpol Inquiry';
            messageList.add(message);
            messageList.add(parentId);
        }
      return messageList;
    }
    
     @AuraEnabled(cacheable=true)
    public static String getObjectType(String recordId) {
        system.debug('recordId>>'+recordId);
        if (recordId == null) {
            throw new AuraHandledException('Record ID cannot be null');
        }
        // Use Describe API to fetch object type
        return Id.valueOf(recordId).getSObjectType().getDescribe().getName();
    }
}