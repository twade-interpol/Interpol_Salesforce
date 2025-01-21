/**
* @File Name : doj_CaseInquiryControllerTest.cls
* @Description : This is the Test class for the caseInqueryController Class
* @Author : Henry Dennis
* @Last Modified By :
* @Last Modified On : January 17, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | January 17, 2025 |   | Initial Version
**/

@isTest
public class doj_CaseInquiryControllerTest {

	 @testSetup
    static void SetupTestData(){
        //create some cases

        List<Case> caseInquiry = new List<Case>();
        //create 5 cases
        for(Integer i = 0; i < 5; i++){
			 //create a case
            Case c = new Case();
			// add some data to the case
            c.Type = 'Inquiry';
			c.Subject = 'H1-B Visa';
            c.Status = 'New';
            c.Priority = 'High';
			c.Type_Of_Notification__c = 'Foreign Crime';
			c.Sender__c = 'abc@verzon.net';
			c.To__c = 'XYZ@cnn.com';
			c.CC__c = 'USA@gmail.com';
			//c.Received_On__c = '';
            c.Owning_Division__c = 'Dispatch';
			//add the case to the list
            caseInquiry.add(c);
        }
        //insert the cases
        insert caseInquiry;

       
    }
    @IsTest
    static void testGetCaseInquiryList(){
		 //start the test
        Test.startTest();
		//create an instance of the apex controller class
         List <Case> caseInquiry =  caseInqueryController.getCaseInquiries();
		 // assert or check that there are 5 cases in the list
        System.assertEquals(5, caseInquiry.size());
		//stop the test after the test
        Test.stopTest();
    }
   
}