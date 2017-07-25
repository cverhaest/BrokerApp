/**
* Created by Sonal_Chaudhary on 7/13/2017.
*/

public with sharing class BrokerController {
    
    @AuraEnabled
    public static BrokerResults getBrokers() {
        BrokerResults brokerResults = new BrokerResults();
        brokerResults.brokers = [SELECT Id, Name, Email__c, Mobile_Phone__c FROM Broker__c];
        brokerResults.total = brokerResults.brokers.size();
        return brokerResults;
    }
    
    @AuraEnabled
    public static Broker__c saveBroker(Broker__c broker)
    {
        upsert broker;
        return broker;    
    }
    
    @AuraEnabled
    public static void deleteBroker(List<Broker__c> brokers)
    {
        //delete brokers;
    }    
    
    public with sharing class BrokerResults {
        @AuraEnabled
        public List<Broker__c> brokers { get;set; }
        
        @AuraEnabled
        public Integer total { get;set; }
    }
    
}