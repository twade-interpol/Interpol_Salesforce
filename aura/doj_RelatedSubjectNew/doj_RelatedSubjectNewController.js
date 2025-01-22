({
    doInit: function (component, event, helper) {
        // Get the current URL
        var pageRef = component.get("v.pageReference");
        console.log('pageRef>>'+pageRef);
        var msgMethod = component.get("v.parentRecordId");
        console.log('msgMethod>>'+msgMethod);
        /*var state = pageRef.state; // state holds any query params
        var base64Context = state.inContextOfRef;
        if (base64Context.startsWith("1\.")) {
            base64Context = base64Context.substring(2);
        }
        var addressableContext = JSON.parse(window.atob(base64Context));
        console.log("addressableContext.attributes.recordId",addressableContext.attributes.recordId);
        component.set("v.recordId", addressableContext.attributes.recordId);*/
    }
})