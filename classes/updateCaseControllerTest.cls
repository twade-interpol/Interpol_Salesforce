@isTest
public class updateCaseControllerTest {

    @testSetup
    static void setupTestData() {
                // Create test ComplaintCase records
        List<PublicComplaint> PublicComplaints = new List<PublicComplaint>();
        for (Integer i = 0; i < 5; i++) {
            PublicComplaints.add(new PublicComplaint(IncidentDate = date.today()));
        }
        insert PublicComplaints;
        
         List<case> cases = new List<Case>();
        for (Integer i = 0; i < 5; i++) {
            cases.add(new case(Origin = 'Email'));
        }
        insert cases;
        
        
        
        
        
        // Create test ComplaintCase records
        List<ComplaintCase> complaintCases = new List<ComplaintCase>();
        for (Integer i = 0; i < 5; i++) {
            complaintCases.add(new ComplaintCase(PublicComplaintId = PublicComplaints[i].Id, CaseId = cases[i].id ));
        }
        insert complaintCases;

        // Create test Alias__c records
        List<Alias__c> aliases = new List<Alias__c>();
        for (Integer i = 0; i < 5; i++) {
            aliases.add(new Alias__c(Name = 'Alias ' + i));
        }
        insert aliases;

        // Create test DOB__c records
        List<DOB__c> dobs = new List<DOB__c>();
        for (Integer i = 0; i < 5; i++) {
            dobs.add(new DOB__c(Name = 'DOB ' + i));
        }
        insert dobs;

        // Create test Businesses__c records
        List<Businesses__c> businesses = new List<Businesses__c>();
        for (Integer i = 0; i < 5; i++) {
            businesses.add(new Businesses__c(Name = 'Business ' + i, Street_Address__c = 'Address ' + i));
        }
        insert businesses;

        // Create test Inquiry_Interpol_Case_Junction__c records
        List<Inquiry_Interpol_Case_Junction__c> junctions = new List<Inquiry_Interpol_Case_Junction__c>();
        for (Integer i = 0; i < 5; i++) {
            junctions.add(new Inquiry_Interpol_Case_Junction__c(Inquiry__c = cases[i].Id, Interpol_Case__c = complaintCases[i].Id));
        }
        insert junctions;
    }

    @isTest
    static void testGetCases() {
        Test.startTest();
        List<ComplaintCase> cases = updateCaseController.getCases();
        Test.stopTest();
        System.assertNotEquals(0, cases.size(), 'Cases should be returned.');
    }

    @isTest
    static void testGetAlias() {
        Test.startTest();
        List<Alias__c> aliases = updateCaseController.getAlias();
        Test.stopTest();
        System.assertNotEquals(0, aliases.size(), 'Aliases should be returned.');
    }

    @isTest
    static void testGetDob() {
        Test.startTest();
        List<DOB__c> dobs = updateCaseController.getDob();
        Test.stopTest();
        System.assertNotEquals(0, dobs.size(), 'DOBs should be returned.');
    }

    @isTest
    static void testGetBus() {
        Test.startTest();
        List<Businesses__c> businesses = updateCaseController.getBus();
        Test.stopTest();
        System.assertNotEquals(0, businesses.size(), 'Businesses should be returned.');
    }

    @isTest
    static void testGetAssociation() {
        Test.startTest();
        Inquiry_Interpol_Case_Junction__c record = [SELECT Id,Inquiry__c FROM Inquiry_Interpol_Case_Junction__c LIMIT 1];
        List<Inquiry_Interpol_Case_Junction__c> associations = updateCaseController.getassciation(record.Inquiry__c, 'full');
        Test.stopTest();
        System.assertNotEquals(5, associations.size(), 'Associations should be returned.');
    }

    @isTest
    static void testGetAssociationCount() {
        Test.startTest();
         Inquiry_Interpol_Case_Junction__c record = [SELECT Id,Inquiry__c FROM Inquiry_Interpol_Case_Junction__c LIMIT 1];
        Integer count = updateCaseController.getassciationcount(record.Inquiry__c);
        Test.stopTest();
        System.assert(count > 0, 'Count should be greater than zero.');
    }
/*
    @isTest
    static void testEmptyCall() {
        Test.startTest();
        Id recordId = [SELECT Id FROM Inquiry_Interpol_Case_Junction__c LIMIT 1].Id;
        Boolean result = updateCaseController.emptycall(recordId);
        Test.stopTest();
        System.assertEquals(true, result, 'Empty call should return true.');
    }
*/
    @isTest
    static void testSearchRecords() {
        Test.startTest();
        List<ComplaintCase> results = updateCaseController.searchRecords('ITC');
        Test.stopTest();
        System.assertNotEquals(0, results.size(), 'Search records should return results.');
    }

}