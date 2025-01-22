public class doj_QuicklinksController {

    @AuraEnabled(cacheable=true)
    public static List<Quick_Links__mdt> fetchQuickLink() {
        // Query your custom metadata (replace MyCustomMetadata__mdt with your actual metadata name)
        return [SELECT DeveloperName,Label, Link_URL__c FROM Quick_Links__mdt];
    }
}