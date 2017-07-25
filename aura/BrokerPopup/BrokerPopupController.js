({
    onSave : function(component, event, helper) {
        var event = component.getEvent("modalClose");
        event.setParams({
            "action": "save",
            "data": component.get('v.broker')
        });
        event.fire();
    },
    
    onCancel : function(component, event, helper) {
        var event = component.getEvent("modalClose");
        event.setParams({
            "action": "cancel"
        });
        event.fire();
    }
})