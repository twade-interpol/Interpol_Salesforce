public class RelatedInquiryandInterpolcases {
 public String recordId { get; set; }
     public String recordId1 { get; set; }

        public boolean DisplayPopup {get; set;}    
     
    public void ClosePopup() {       
        DisplayPopup = false;   
    }
  
    public void ShowPopup() {       
        DisplayPopup = true;   
    }
    
      public RelatedInquiryandInterpolcases(ApexPages.StandardSetController  controller) {

        // Get URL parameters
        recordId = ApexPages.currentPage().getParameters().get('Id');
          system.debug(ApexPages.currentPage().getParameters());
          
    }
    
    
}