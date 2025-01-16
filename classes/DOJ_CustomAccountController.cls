public class DOJ_CustomAccountController {
    @auraEnabled(cacheable=true)
    //param AccountId
    //return Account
    public static Account getAccountCustomFields(Id accountId){
        // return Account and specific fields from account Object that matches param Id and just Just one Account
        return[SELECT Id, Name, Agency_Name__c FROM Account WHERE Id = :accountId LIMIT 1];
    }

}