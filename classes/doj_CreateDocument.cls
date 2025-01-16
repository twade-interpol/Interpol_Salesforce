@RestResource(urlMapping='/createDocumentFromText')
global class doj_CreateDocument {
    global class RequestBody {
        public String textInput;
        public String fieldName;
        public String recordId;
        public String fileName;
        public String messageType;
    }

    @HttpPost
    global static String createDocumentsForCase() {
        try {
            // Parse the JSON request body
            List<RequestBody> inputs = (List<RequestBody>) JSON.deserialize(RestContext.request.requestBody.toString(), List<RequestBody>.class);
			system.debug('inputs>>'+inputs);
            if (inputs == null || inputs.isEmpty()) {
                RestContext.response.statusCode = 400;
                return 'Error: Request body cannot be empty.';
            }

            Map<Id, List<ContentVersion>> consolidatedFiles = new Map<Id, List<ContentVersion>>();

            for (RequestBody input : inputs) {
                // Validate individual input
                system.debug('input>>'+input);
                if (String.isBlank(input.textInput)) {
                    RestContext.response.statusCode = 400;
                    return 'Error: Text input cannot be blank.';
                }
                if (String.isBlank(input.fileName)) {
                    RestContext.response.statusCode = 400;
                    return 'Error: File name cannot be blank.';
                }
                if (String.isBlank(input.recordId)) {
                    RestContext.response.statusCode = 400;
                    return 'Error: Record ID cannot be blank.';
                }
                  if (String.isBlank(input.fieldName)) {
                    RestContext.response.statusCode = 400;
                    return 'Error: Field name cannot be blank.';
                }

                Schema.SObjectType recordType = Id.valueOf(input.recordId).getSObjectType();
                String recordTypeName = recordType.getDescribe().getName();
                system.debug('recordTypeName>>'+recordTypeName);
               String recordId = input.recordId;
				List<SObject> records = Database.query('SELECT Id FROM ' + recordTypeName + ' WHERE Id = :recordId LIMIT 1');
				system.debug('records>>'+records);
                if (records.isEmpty()) {
                    RestContext.response.statusCode = 404;
                    return 'Error: No record found with the provided ID.';
                }
				//String table='<table border="1"><tr><th>Field Name</th><th>Value</th></tr>';
                String tableRow = '<tr><td>' + input.fieldName + '</td><td>' + input.textInput + '</td></tr>';
				String msgType = input.messageType;
                // Insert ContentVersion (required for creating ContentDocument)
                ContentVersion contentVersion = new ContentVersion();
                contentVersion.Title = input.fileName;
                contentVersion.PathOnClient = input.fileName;
                //contentVersion.doj_Message_Type__c = String.valueof(input.messageType);
                contentVersion.doj_Message_Type__c = msgType;
                //contentVersion.messagetype__c= input.messageType;
                contentVersion.VersionData = Blob.valueOf(tableRow);
                system.debug('CV>>'+contentVersion);
                insert contentVersion;
				system.debug('CV>>'+contentVersion);
                // Add ContentVersion to the consolidated map for the same Record ID
                if (!consolidatedFiles.containsKey(Id.valueOf(input.recordId))) {
                    consolidatedFiles.put(Id.valueOf(input.recordId), new List<ContentVersion>());
                }
                consolidatedFiles.get(Id.valueOf(input.recordId)).add(contentVersion);
            }

            // For each Record ID, consolidate ContentVersions into a single document if needed
            for (Id recordId : consolidatedFiles.keySet()) {
                List<ContentVersion> contentVersions = consolidatedFiles.get(recordId);

                if (contentVersions.size() > 1) {
                    String consolidatedContent = '<table border="1"><tr><th>Field Name</th><th>Value</th></tr>';
                    String msgType='';
                   for (ContentVersion cv : contentVersions) {
                        consolidatedContent += cv.VersionData.toString();
                       	msgType=cv.doj_Message_Type__c;
                    }
                    consolidatedContent += '</table>';

                    // Create a single consolidated ContentVersion
                    ContentVersion consolidatedVersion = new ContentVersion();
                    consolidatedVersion.Title = 'ConsolidatedDocument_' + DateTime.now().format('yyyyMMddHHmmss');
                    consolidatedVersion.PathOnClient = consolidatedVersion.Title + '.doc';
                    consolidatedVersion.doj_Message_Type__c = msgType;
                    consolidatedVersion.VersionData = Blob.valueOf(consolidatedContent);
                    insert consolidatedVersion;

                    // Link the consolidated document to the record
                    ContentDocumentLink documentLink = new ContentDocumentLink();
                    documentLink.ContentDocumentId = [
                        SELECT ContentDocumentId 
                        FROM ContentVersion 
                        WHERE Id = :consolidatedVersion.Id
                    ].ContentDocumentId;
                    documentLink.LinkedEntityId = recordId;
                    documentLink.ShareType = 'V'; // Viewer access
                    documentLink.Visibility = 'AllUsers';
                    insert documentLink;
                } else {
                    // If only one file, wrap it in a full table structure and create a new ContentVersion
                    ContentVersion cv = contentVersions[0];
                    String singleTableContent = '<table border="1"><tr><th>Field Name</th><th>Value</th></tr>' + 
                                                 cv.VersionData.toString() +
                                                 '</table>';

                    // Create a new ContentVersion with the wrapped table content
                    ContentVersion newVersion = new ContentVersion();
                    newVersion.Title = cv.Title;
                    newVersion.PathOnClient = cv.PathOnClient;
                    newVersion.doj_Message_Type__c = cv.doj_Message_Type__c;
                    newVersion.VersionData = Blob.valueOf(singleTableContent);
                    insert newVersion;

                    // Link the new document to the record
                    ContentDocumentLink documentLink = new ContentDocumentLink();
                    documentLink.ContentDocumentId = [
                        SELECT ContentDocumentId 
                        FROM ContentVersion 
                        WHERE Id = :newVersion.Id
                    ].ContentDocumentId;
                    documentLink.LinkedEntityId = recordId;
                    documentLink.ShareType = 'V'; // Viewer access
                    documentLink.Visibility = 'AllUsers';
                    insert documentLink;
                }
            }


            return 'Documents created and linked successfully.';
        } catch (Exception e) {
            RestContext.response.statusCode = 500;
            return 'Error: ' + e.getMessage();
        }
    }
}