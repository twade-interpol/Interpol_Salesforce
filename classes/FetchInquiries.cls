/**
* @File Name : FetchInquiries.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : October 7, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 7, 2024 |   | Initial Version
**/

public class FetchInquiries {


    public class cwrapper{
            @AuraEnabled
            public Id recid;
            @AuraEnabled
            public string name;
            @AuraEnabled
            public string objectname;


    }

    @AuraEnabled( cacheable = true )  
    public static List< FetchInquiries.cwrapper  > fetchrecords( String searchKey ) {  
         
         list<FetchInquiries.cwrapper> output = new list<FetchInquiries.cwrapper>();
        String strKey = '%' + searchKey + '%';  

        for(case inq : [SELECT Id, Subject,CaseNumber FROM case WHERE CaseNumber LIKE: strKey LIMIT 10]){
            FetchInquiries.cwrapper sw = new FetchInquiries.cwrapper();
            sw.recid = inq.Id;
            sw.name = inq.CaseNumber;
            sw.objectname = 'Case';
            output.add(sw);

          } 



        for(ComplaintCase c : [SELECT Id,Name FROM ComplaintCase where name LIKE: strKey LIMIT 10]){
            FetchInquiries.cwrapper sw = new FetchInquiries.cwrapper();
            sw.recid = c.Id;
            sw.name = c.Name;
             sw.objectname = 'ComplaintCase';
            output.add(sw);

          } 

          

            return output;
    }  



}