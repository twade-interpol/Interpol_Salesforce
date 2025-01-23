@isTest
public class doj_QuicklinksControllerTest {

        @isTest
    static void testFetchQuickLink() {

        // Step 1: Test the controller method
        Test.startTest();
        List<Quick_Links__mdt> results = doj_QuicklinksController.fetchQuickLink();
        Test.stopTest();
    }
}