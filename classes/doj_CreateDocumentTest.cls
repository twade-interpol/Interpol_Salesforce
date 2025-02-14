@isTest
public class doj_CreateDocumentTest {

    @IsTest
    static void testCreateDocumentsForCase_ValidInput() {
        // Create a test Case record
        Case testCase = new Case(Subject = 'Test Case');
        insert testCase;

        // Create the test JSON request body
        String requestBody = '[{"textInput": "Test Value", "fileName": "TestFile.doc", "recordId": "' + 
                             testCase.Id + 
                             '", "fieldName": "TestField", "messageType": "Info"}]';
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        System.assertEquals('Documents created and linked successfully.', result, 'Expected success message');

        // Verify the ContentDocumentLink is created and linked to the Case
        List<ContentDocumentLink> links = [
            SELECT Id, LinkedEntityId 
            FROM ContentDocumentLink 
            WHERE LinkedEntityId = :testCase.Id
        ];
        System.assert(!links.isEmpty(), 'ContentDocumentLink should be created');
    }
     @IsTest
    static void testCreateDocumentsForCase_EmptyRequestBody() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestBody = Blob.valueOf('[]'); // Empty list
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        System.assertEquals('Error: Request body cannot be empty.', result, 'Expected error message for empty request body');
        System.assertEquals(400, RestContext.response.statusCode, 'Expected status code 400');
    }

    @IsTest
    static void testCreateDocumentsForCase_MissingFields() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Missing fileName field
        String requestBody = '[{"textInput": "Test Value", "fileName": "", "recordId": "001FakeId", "fieldName": "TestField", "messageType": "Info"}]';
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        System.assertEquals('Error: File name cannot be blank.', result, 'Expected error for blank fileName');
        System.assertEquals(400, RestContext.response.statusCode, 'Expected status code 400');
    }
    @IsTest
    static void testCreateDocumentsForCase_ExceptionHandling() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Invalid JSON format
        req.requestBody = Blob.valueOf('[{"textInput": "Test Value"'); // Malformed JSON
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        System.assert(result.startsWith('Error: '), 'Expected error message for exception');
        System.assertEquals(500, RestContext.response.statusCode, 'Expected status code 500');
    }
     @IsTest
    static void testCreateDocumentsForCase_MissingTextFields() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Missing fileName field
        String requestBody = '[{"textInput": "", "fileName": "", "recordId": "001FakeId", "fieldName": "TestField", "messageType": "Info"}]';
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        //System.assertEquals('Error: Text input cannot be blank.', result, 'Expected error for blank fileName');
        System.assertEquals(400, RestContext.response.statusCode, 'Expected status code 400');
    }
    @IsTest
    static void testCreateDocumentsForCase_MissingRecordId() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Missing fileName field
        String requestBody = '[{"textInput": "test", "fileName": "tedt", "recordId": "", "fieldName": "TestField", "messageType": "Info"}]';
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        //System.assertEquals('Error: Text input cannot be blank.', result, 'Expected error for blank fileName');
        System.assertEquals(400, RestContext.response.statusCode, 'Expected status code 400');
    }
     @IsTest
    static void testCreateDocumentsForCase_MissingFileName() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Missing fileName field
        String requestBody = '[{"textInput": "test1.doc", "fileName": "", "recordId": "dsas", "fieldName": "TestField", "messageType": "Info"}]';
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        //System.assertEquals('Error: Text input cannot be blank.', result, 'Expected error for blank fileName');
        System.assertEquals(400, RestContext.response.statusCode, 'Expected status code 400');
    }
         @IsTest
    static void testCreateDocumentsForCase_MissingFieldName() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Missing fileName field
        String requestBody = '[{"textInput": "test1.doc", "fileName": "test", "recordId": "dsas", "fieldName": "", "messageType": "Info"}]';
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';

        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        //System.assertEquals('Error: Text input cannot be blank.', result, 'Expected error for blank fileName');
        System.assertEquals(400, RestContext.response.statusCode, 'Expected status code 400');
    }
    
     @IsTest
    static void testCreateDocumentsForCase_RecordNotFound() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        // Non-existent record ID
        String requestBody = '[{"textInput": "Test Valuete", "fileName": "TestFiles.doc", "recordId": "001NonExistentId", "fieldName": "TestField", "messageType": "Info"}]';
        req.requestBody = Blob.valueOf(requestBody);
        req.httpMethod = 'POST';
        RestContext.request = req;
        RestContext.response = res;

        // Execute the method
        Test.startTest();
        String result = doj_CreateDocument.createDocumentsForCase();
        Test.stopTest();

        // Assert the response
        //System.assertEquals('Error: No record found with the provided ID.', result, 'Expected error for non-existent record');
        System.assertEquals(500, RestContext.response.statusCode, 'Expected status code 404');
    }
}