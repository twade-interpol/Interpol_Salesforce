@isTest
public class homePageControllerTest {

      @IsTest
    static void testGetUserRole_WithRole() {
        // Create a test UserRole
        UserRole testRole = new UserRole(
            Name = 'Test Role',
            DeveloperName = 'Test_Role'
        );
        insert testRole;

        // Create a test User and assign the role
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'testuser@example.com',
            Username = 'testuser' + DateTime.now().getTime() + '@example.com',
            Alias = 'testusr',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1].Id,
            UserRoleId = testRole.Id
        );
        insert testUser;

        // Run the test with the test user's context
        System.runAs(testUser) {
            Test.startTest();
            String userRole = homePageController.getUserRole(); // Replace 'YourClassName' with the name of your class
            Test.stopTest();

            // Assert the role name
            System.assertEquals('Test Role', userRole, 'The returned role name should match the test role name.');
        }
    }

    @IsTest
    static void testGetUserRole_NoRole() {
        // Create a test User without a role
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'testuser@example.com',
            Username = 'testuser' + DateTime.now().getTime() + '@example.com',
            Alias = 'testusr',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1].Id
        );
        insert testUser;

        // Run the test with the test user's context
        System.runAs(testUser) {
            Test.startTest();
            String userRole = homePageController.getUserRole(); // Replace 'YourClassName' with the name of your class
            Test.stopTest();

            // Assert the response for no role
            System.assertEquals('No Role', userRole, 'The method should return "No Role" if the user has no role assigned.');
        }
    }
}