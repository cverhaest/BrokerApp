({
    callServer : function(component, method, params, callback) {
        var action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        action.setCallback(this,function(response) {
            var state= response.getState();
            if (state === "SUCCESS") {
                callback.call(this,response.getReturnValue());
            }
            else if (state === "ERROR") {
                var errors= response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[O] && errors[O].message) {
                        throw new Error("Error: " + errors[O].message);
                    }
                } else {
                    throw new Error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    displayModal : function(component, modalComponentName, modalProperties) {
        $A.createComponent(
            modalComponentName,
            modalProperties,
            function(newModal, status, errorMessage) {
                if (status === "SUCCESS")
                    component.set("v.modal", newModal);
                else if (status === "INCOMPLETE")
                    console.log("No response from server or client is offline.")
                    else if (status === "ERROR")
                        console.log("Error: " + errorMessage);
            }
        );
    },
    
    findSelectedRows : function(component) {
        var selectedIds = [];
        var getAllId = component.find("boxPack");
        for (var i = 0; i < getAllId.length; i++) {
            if (getAllId[i].get("v.value") == true) {
                selectedIds.push(getAllId[i].get("v.text"));
            }
        }
        return selectedIds;
    },
    
    showSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    
    convertObjectToList : function(selectedBrokers) {
        var list = Object.keys(selectedBrokers).map(function (key) { 
                    return selectedBrokers[key]; 
                });
        return list;
    },
    
    findLengthObject : function(broker) {
        return (Object.keys(broker).length);
    },
    
})