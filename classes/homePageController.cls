public without sharing class homePageController {

     @AuraEnabled(cacheable=true)
    public static String getUserRole() {
        // Query the current user's role
        User currentUser = [SELECT Name,UserRole.Name FROM User WHERE Id = :UserInfo.getUserId()];
        
       // Check if the user has a role, as it can be null
        if (currentUser.UserRole != null) {
            return currentUser.UserRole.Name;
       } else {
            return 'No Role';
}
    }
    
   
}