public with sharing class BrokerDetails {
    
    @AuraEnabled
    public Integer total { get;set; }
    
    @AuraEnabled
    public List<BrokerController.BrokerWrapper> brokerList { get;set; }
}