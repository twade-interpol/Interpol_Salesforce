public with sharing class doj_FileViewController {
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentWrapper> getFilesWithMessageType(String recordId) {
        List<ContentDocumentWrapper> fileWrappers = new List<ContentDocumentWrapper>();

        // Query ContentDocumentLink to get files related to the record
        List<ContentDocumentLink> documentLinks = [
            SELECT ContentDocumentId, LinkedEntityId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :recordId
        ];

        // Extract ContentDocumentId into a set
        Set<Id> contentDocumentIds = new Set<Id>();
        for (ContentDocumentLink docLink : documentLinks) {
            contentDocumentIds.add(docLink.ContentDocumentId);
        }
		Map<id,id> conVerMap= new Map<id,id>();
        // Fetch details of ContentDocument and ContentVersion
        List<ContentVersion> versions = [
            SELECT Id, Title, FileType, doj_Message_Type__c, ContentDocumentId
            FROM ContentVersion
            WHERE ContentDocumentId IN :contentDocumentIds
        ];
        for(ContentVersion con:versions)
        {
            conVerMap.put(con.id,con.ContentDocumentId);
        }

        // Map ContentVersion to ContentDocument and populate wrapper
        for (ContentVersion version : versions) {
            fileWrappers.add(new ContentDocumentWrapper(
                conVerMap.get(version.Id), version.Title, version.FileType, version.doj_Message_Type__c
            ));
        }

        return fileWrappers;
    }
    
    @AuraEnabled
    public static void updateContentVersionFields(List<String> contentDocumentIds,String msgType,String recId) {
        // Query ContentVersion records for the given ContentDocumentIds
        system.debug('msgType>>>'+msgType);
        system.debug('recordId>>>'+recId);
        system.debug('contentDocumentIds>>>'+contentDocumentIds);
        List<ContentDocumentLink> conDocList= new List<ContentDocumentLink>();
        List<ContentVersion> contentVersions = [
            SELECT Id, Title, doj_Message_Type__c
            FROM ContentVersion
            WHERE ContentDocumentId IN :contentDocumentIds
        ];

        // Update the required field(s)
        for (ContentVersion cv : contentVersions) {
            String messageType= msgType;
            cv.doj_Message_Type__c = messageType; // Replace with your logic
        }

     
        
         // Create a ContentDocumentLink
        /*for(Id Conid:contentDocumentIds)
        {
            ContentDocumentLink link = new ContentDocumentLink();
            link.ContentDocumentId = Conid;
            link.LinkedEntityId = recId; // Associate with the Case record
            link.ShareType = 'I'; // Set share type (Inferred permission)
            link.Visibility = 'AllUsers'; // Visibility options: AllUsers, InternalUsers, SharedUsers
            conDocList.add(link);
            
        }
        system.debug('link>>'+conDocList);
        insert conDocList;*/
           // Save the changes
        if (!contentVersions.isEmpty()) {
            system.debug('contentVersions>>'+contentVersions);
            update contentVersions;
            system.debug('contentVersions>>'+contentVersions);
        }
    }

    // Wrapper class to hold file details
    public class ContentDocumentWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String title;
        @AuraEnabled public String fileType;
        @AuraEnabled public String messageType;
        

        public ContentDocumentWrapper(String id, String title, String fileType, String messageType) {
            this.id = id;
            this.title = title;
            this.fileType = fileType;
            this.messageType = messageType;
            
        }
    }
}