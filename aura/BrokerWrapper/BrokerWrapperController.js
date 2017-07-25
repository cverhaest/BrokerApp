/**
 * Created by Sonal_Chaudhary on 7/13/2017.
 */
({
    doInit : function(component, event, helper) {
        helper.showSpinner(component);
        component.set("v.url", window.location.origin);
        var params = {}; // no params for this service
        
        helper.callServer(component, 'c.getBrokers', params, function(response){
            component.set('v.brokers', response.brokers);
            component.set('v.total', response.total);
            helper.hideSpinner(component);
        });  
        
    },
    
    selectAll : function(component, event, helper) {
        var selectAllCheckboxValue = component.find("selectAll").get("v.value");
        var getAllId = component.find("boxPack");
        for (var i = 0; i < getAllId.length; i++) {
            component.find("boxPack")[i].set("v.value", selectAllCheckboxValue);
        }
    },
    
    selectCheckbox: function(component, event,helper) {
        var index = event.getSource().get("v.text");
        var brokers = component.get("v.brokers");
        var selectedBrokers = component.get("v.selectedBrokers");
        // if the selectbox is checked (true)
        if (event.getSource().get("v.value")) {
            selectedBrokers[index] = brokers[index];
        } else {
            delete selectedBrokers[index];
        }
        component.set("v.selectedBrokers", selectedBrokers);
        //console.log(Object.keys(selectedBrokers).length);
        //console.log(component.get("v.selectedBrokers"));
    },
    
    handleOption : function(component, event, helper) {
        var buttonName = event.getSource().get("v.label");
        if (buttonName === "New") {
            helper.displayModal(component, "c:BrokerPopup", {
                "broker": {'sobjectType':'Broker__c', 
                           'Name':'', 
                           'Mobile_Phone__c':'', 
                           'Email__c':''
                          }
            });
        }
        
        else if (buttonName === "Edit") {
            var broker = component.get("v.selectedBrokers");
            console.log(JSON.stringify(broker));
            var list = helper.convertObjectToList(broker);
            console.log(JSON.stringify(list));
            if (helper.findLengthObject(broker) == 1) {
                helper.displayModal(component, "c:BrokerPopup", {
                    "broker": {'sobjectType': 'Broker__c', 
                               'Id': list[0].Id, 
                               'Name': list[0].Name, 
                               'Mobile_Phone__c': list[0].Mobile_Phone__c, 
                               'Email__c': list[0].Email__c
                              }
                });
            }
            else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "error",
                    "title": "Failed!",
                    "message": "Please select only one record."
                });
                toastEvent.fire();
            }
            
        }
        
            else if (buttonName === "Delete") {
                helper.showSpinner(component);
                var selectedBrokers = component.get("v.selectedBrokers");
                var list = helper.convertObjectToList(selectedBrokers);
                var keys = Object.keys(selectedBrokers);
                var params = {
                    brokers : list
                };
                helper.callServer(component, 'c.deleteBroker', params, function(response){
                    var brokers = component.get("v.brokers");
                    var length = brokers.length;
                    while (length--) {
                        for(var i in keys) {
                            if (length == keys[i]) {
                                brokers.splice(keys[i],1);
                            }
                        }
                    }
                    component.set("v.brokers", brokers);
                    component.set('v.selectedBrokers', {});
                    helper.hideSpinner(component);
                });  
            }
    },
    
    handleModalClose : function(component, event, helper) {
        component.set("v.modal", null);
        var modalAction = event.getParam("action");
        if (modalAction == "save") {
            helper.showSpinner(component);
            var params = {
                broker : event.getParam("data")
            };
            helper.callServer(component, 'c.saveBroker', params, function(response){
                var brokers = component.get("v.brokers");
                var selectedBroker = component.get("v.selectedBrokers");
                
                //Record has been edited because one of the rows is selected
                if (helper.findLengthObject(selectedBroker) == 1) {
                    var key = Object.keys(selectedBroker);
                    brokers[key] = response;
                    component.set("v.brokers", brokers);
                    component.set('v.selectedBrokers', {});
                }
                
                //New record got created
                else {
                    brokers.unshift(response);
                	component.set("v.brokers", brokers);
                }
                helper.hideSpinner(component);
            });  
        }
    },  
    
})