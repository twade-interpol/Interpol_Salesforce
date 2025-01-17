/**
  Author: Chandra
  Description: AURA component for list view record button  
  Created date : 09/10/2024
 */
({
	handleInit : function(component, event, helper) {
		  const workspaceAPI = component.find("workspace");
                // Use the Workspace API to set the tab title
        workspaceAPI.getFocusedTabInfo()
            .then((response) => {
                const tabId = response.tabId;
                workspaceAPI.setTabLabel({
                    tabId: tabId,
                    label: "New INTERPOL Case"
                });
            })
            .catch((error) => {
                console.error("Error setting tab title: ", error);
            });
    },
    
       handleLwcEvent: function (component, event, helper) {
        // Get event details if needed
        console.log('Received event from LWC: ');

                   const workspaceAPI = component.find("workspace");

        // Get the currently focused tab info
        workspaceAPI.getFocusedTabInfo()
            .then((tabInfo) => {
                const tabId = tabInfo.tabId;
                console.log("Focused Tab ID: ", tabId);

                // Close the focused tab
                return workspaceAPI.closeTab({ tabId: tabId });
            })
            .then(() => {
                console.log("Focused tab closed successfully.");
            })
            .catch((error) => {
                console.error("Error closing focused tab: ", error);
            });
                
                
                
         
                
           
           
           

    }
        
	
})