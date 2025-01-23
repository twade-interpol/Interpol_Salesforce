@isTest
public class doj_SubjectRelatedViewControllerTest {

    @isTest
    static void testFetchSubjectIdValidRecord() {
        // Create test data
        Contact testSubject = new Contact(FirstName = 'John', LastName = 'Doe');
        insert testSubject;

        Account testAcc = new Account(Name = 'testacc', Agency_Name__c = 'testAccountAgency');
        insert testAcc;

        Case testInq = new Case(Description = 'test', AccountId = testAcc.Id);
        insert testInq;

        PublicComplaint testpublicComplaint = new PublicComplaint(AccountId = testAcc.Id, IncidentDate = Date.newInstance(2025, 1, 10));
        insert testpublicComplaint;

        ComplaintCase testCase = new ComplaintCase(
            Interpol_Cases__c = testSubject.Id,
            PublicComplaintId = testpublicComplaint.Id,
            CaseId = testInq.Id
        );
        insert testCase;

        Test.startTest();
        // Call the method with a valid ComplaintCase ID
        String subjectId = doj_SubjectRelatedViewController.fetchSubjectId(testCase.Id);
        Test.stopTest();

        // Assert the result
        System.assertEquals(testCase.Interpol_Cases__c, subjectId, 'The subject ID should match the Interpol_Cases__c field value.');
    }

    @isTest
    static void testFetchSubjectIdInvalidRecordId() {
        Test.startTest();
        try {
            // Call the method with a null ID
            doj_SubjectRelatedViewController.fetchSubjectId(null);
            System.assert(false, 'An exception should have been thrown for a null record ID.');
        } catch (QueryException e) {
            System.assert(true, 'QueryException correctly thrown for invalid record ID.');
        }
        Test.stopTest();
    }

    @isTest
    static void testFetchSubjectIdNoInterpolCases() {
        Contact testSubject = new Contact(FirstName = 'John', LastName = 'Doe');
        insert testSubject;

        Account testAcc = new Account(Name = 'testacc', Agency_Name__c = 'testAccountAgency');
        insert testAcc;

        Case testInq = new Case(Description = 'test', AccountId = testAcc.Id);
        insert testInq;

        PublicComplaint testpublicComplaint = new PublicComplaint(AccountId = testAcc.Id, IncidentDate = Date.newInstance(2025, 1, 10));
        insert testpublicComplaint;

        ComplaintCase testCase = new ComplaintCase(
            Interpol_Cases__c = null,
            PublicComplaintId = testpublicComplaint.Id,
            CaseId = testInq.Id
        );
        insert testCase;

        Test.startTest();
        // Call the method with a ComplaintCase ID that has no Interpol_Cases__c value
        String subjectId = doj_SubjectRelatedViewController.fetchSubjectId(testCase.Id);
        Test.stopTest();

        // Assert that the result is null
        System.assertEquals(null, subjectId, 'The subject ID should be null when Interpol_Cases__c is not populated.');
    }
}