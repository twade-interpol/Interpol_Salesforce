@isTest
public class doj_RelatedSubjectControllerTest {

     @testSetup
    static void setupTestData() {
        // Insert mock Contact records
        List<Contact> contacts = new List<Contact>{
            new Contact(FirstName = 'John', LastName = 'Doe', Email = 'john.doe@example.com', Phone = '1234567890'),
            new Contact(FirstName = 'Jane', LastName = 'Smith', Email = 'jane.smith@example.com', Phone = '0987654321'),
            new Contact(FirstName = 'Johnny', LastName = 'Appleseed', Email = 'johnny.appleseed@example.com', Phone = '1122334455')
        };
        insert contacts;
        
        Case inquiryCase = new Case(Subject = 'Inquiry Case 1');
        insert inquiryCase;
        
        PublicComplaint PC = new PublicComplaint(FirstName='Test',IncidentDate=Date.today());
        insert PC;
         // Create mock parent records
        ComplaintCase complaintCs = new ComplaintCase(Interpol_Name__c = 'Complaint Case 1',PublicComplaintId=PC.id,CaseId=inquiryCase.id);
        insert complaintCs;
    }
    
    @isTest
    static void testSearchContacts() {
        // Test case: Search for contacts with "John" in their name
        Test.startTest();
        List<Contact> results = doj_RelatedSubjectController.searchContacts('John');
        Test.stopTest();

        // Assertions
        System.assertNotEquals(null, results, 'Results should not be null.');
        System.assertEquals(2, results.size(), 'There should be exactly 2 contacts matching the search term.');

        // Verify individual results
        Contact contact1 = results[0];
        Contact contact2 = results[1];
        System.assert(contact1.Name.contains('John'), 'First contact name should contain "John".');
        System.assert(contact2.Name.contains('John'), 'Second contact name should contain "John".');
    }
    
     @isTest
    static void testLinkSubjectsForComplaintCase() {
        // Create subject IDs
        List<Contact> contactList= [Select id from Contact];
       List<String> contactIds = new List<String>();

        // Loop through the contactList and extract the IDs
        for (Contact c : contactList) {
            contactIds.add(c.Id);
        }
        system.debug('contactIds>>'+contactIds);
      
		ComplaintCase cs=[Select id from ComplaintCase LIMIT 1];
        // Call the method with a ComplaintCase parent ID
        Test.startTest();
        List<String> result = doj_RelatedSubjectController.linkSubject(contactIds, cs.Id);
        Test.stopTest();

        // Assertions
        System.assertNotEquals(null, result, 'Result should not be null.');
        System.assertEquals(2, result.size(), 'Result should contain two entries.');
        System.assertEquals('The selected subject(s) are linked to the Interpol Case', result[0], 'Incorrect success message.');

    }
    
     @isTest
    static void testLinkSubjectsForCase() {
        // Create subject IDs
        List<Contact> contactList= [Select id from Contact];
       List<String> contactIds = new List<String>();

        // Loop through the contactList and extract the IDs
        for (Contact c : contactList) {
            contactIds.add(c.Id);
        }
        system.debug('contactIds>>'+contactIds);
      
		Case cs=[Select id from Case LIMIT 1];
        // Call the method with a ComplaintCase parent ID
        Test.startTest();
        List<String> result = doj_RelatedSubjectController.linkSubject(contactIds, cs.Id);
        Test.stopTest();

        // Assertions
        System.assertNotEquals(null, result, 'Result should not be null.');
        System.assertEquals(2, result.size(), 'Result should contain two entries.');
        System.assertEquals('The selected subject(s) are linked to the Interpol Inquiry', result[0], 'Incorrect success message.');

    }
    
     @IsTest
    static void testGetObjectType_ValidRecordId() {
        // Create a test account record
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        // Get the record ID of the inserted account
        String recordId = testAccount.Id;
        
        // Call the method and verify the result
        Test.startTest();
        String objectType = doj_RelatedSubjectController.getObjectType(recordId);
        Test.stopTest();
        
        // Assert that the returned object type is "Account"
        System.assertEquals('Account', objectType, 'The object type should be Account');
    }
    
}