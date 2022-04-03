
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const Scoot = require('../lib/scoot.js');

let assert = sinon.assert;
chai.use(sinonChai);

describe('ScootChain Unit Tests', () => {

    let transactionContext, chaincodeStub, request1, request2;
    beforeEach(() => {
        transactionContext = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states) {
                ret = chaincodeStub.states[key];
            }
            return Promise.resolve(ret);
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                delete chaincodeStub.states[key];
            }
            return Promise.resolve(key);
        });

        chaincodeStub.getStateByRange.callsFake(async () => {
            function* internalGetStateByRange() {
                if (chaincodeStub.states) {
                    // Shallow copy
                    const copied = Object.assign({}, chaincodeStub.states);

                    for (let key in copied) {
                        yield {value: copied[key]};
                    }
                }
            }

            return Promise.resolve(internalGetStateByRange());
        });

        owner1 = {
            ID: 'hello@mail.com',
            Name: 'Daragh',
            Password: 'hello',
            Role: 'owner',
        };

        owner2 = {
            ID: 'hi@mail.com',
            Name: 'John',
            Password: 'hello',
            Role: 'owner',
        };

        retailer1 = {
            ID: 'retailer1@mail.com',
            Name: 'Halfords',
            Password: 'hello',
            Role: 'retailer',
        };

        servicer1 = {
            ID: 'servicer1@mail.com',
            Name: 'John',
            Password: 'hello',
            Role: 'servicer',
        };

        registrar = {
            ID: 'registrar@mail.com',
            Name: 'registrar',
            Password: 'hello',
            Role: 'registrar',
        };

        request1 = {
            SerialNumber: '876548',
            Manufacturer: 'Xiomai',
            Model: '87-S',
            Owner: 'Daragh@mail.com',
            Retailer: 'Halfords',
            Status: 'Pending',
        	State: 'Active',
        };

        request2 = {
            SerialNumber: '876548',
            Manufacturer: 'Xiomai',
            Model: '87-Performance',
            Owner: 'Colm@mail.com',
            Retailer: 'Halfords',
            Status: 'Pending',
        	State: 'Active',
        };

        scooter1 = {
            SerialNumber: '98765',
            Manufacturer: 'Xiomai',
            Model: '87-Performance',
            Owner: 'hello@mail.com',
            Retailer: 'Halfords',
            Status: 'Registered',
        	State: 'Active',
        };

        scooter2 = {
            SerialNumber: '98765',
            Manufacturer: 'OKAI',
            Model: '87-Performance',
            Owner: 'hello@mail.com',
            Retailer: 'Halfords',
            Status: 'Registered',
        	State: 'Active',
        };

        service = {
            SID: '987TGH',
            SerialNumber: '98765',
            ServiceType: 'Repair',
            ServiceDate: '2022-03-17',
            ServiceDescription: 'Repaired',
        };

        service1 = {
            SID: '987T',
            SerialNumber: '98765',
            ServiceType: 'Upgrade',
            ServiceDate: '2022-03-17',
            ServiceDescription: 'Upgraded',
        };
    });

    describe('Test Create E-Scooter Request', () => {

        it('Should Return success on requestAssetRegistration', async () => {

            let scoot = new Scoot();
            // Create a Retailer to send the request to
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            await scoot.requestAssetRegistration(transactionContext, request1.SerialNumber, request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);
            let ret = JSON.parse((await chaincodeStub.getState(request1.SerialNumber)).toString());
            expect(ret).to.eql(request1);
        });

        it('Should Return Asset Exists on requestAssetRegistration', async () => {
            
            let scoot = new Scoot();
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            await scoot.requestAssetRegistration(transactionContext, request1.SerialNumber, request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);

            // Requesting Registration with an E-Scooter of the same Serial Number
            const result = await scoot.requestAssetRegistration(transactionContext, request2.SerialNumber, request2.Manufacturer, request2.Model, request2.Owner, request2.Retailer);
            expect(JSON.parse(result)).to.eql('Asset Exists');
        });
    });

    describe('Test Query My Requests', () => {

        it('Should Return Success on queryMyRequests', async () => {

            let scoot = new Scoot();
            // Create the retailer to send requests to
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            // Create 3 different requests to the same retailer
            await scoot.requestAssetRegistration(transactionContext, request1.SerialNumber, request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);
            await scoot.requestAssetRegistration(transactionContext, '5GHTY54', request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);
            await scoot.requestAssetRegistration(transactionContext, '87YUVC4', request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);

            let ret = await scoot.queryMyRequests(transactionContext, request1.Retailer);
            ret = JSON.parse(ret);
            expect(ret.length).to.equal(3);
        });
    });

    describe('Test Register E-Scooter', () => {

        it('Should Return Success on createAsset', async () => {

            let scoot = new Scoot();
            // User with the role of owner
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            let ret = JSON.parse((await chaincodeStub.getState(scooter1.SerialNumber)).toString());
            expect(ret).to.eql(scooter1);
        });

        it('Should Return Asset Exists on createAsset', async () => {

            let scoot = new Scoot();
            //User with the role of owner
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            // Two E-Scooters with the same Serial Number
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            const result = await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            expect(JSON.parse(result)).to.eql('Asset Exists');
        });

        it('Should Return User Not Found on createAsset', async () => {

            let scoot = new Scoot();
            // Register Asset with no user created
            const result = await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            expect(JSON.parse(result)).to.eql('User Not Found');
        });

        it('Should Return User Role Error on createAsset', async () => {
            
            let scoot = new Scoot();
            // Register User with a role of servicer
            await scoot.createUser(transactionContext, servicer1.ID, servicer1.Name, servicer1.Password, servicer1.Role);
            const result = await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, servicer1.ID, scooter1.Retailer);
            expect(JSON.parse(result)).to.eql('User Role Error');
        });
    });

    describe('Test Query My E-Scooters', async () => {

        it('Should Return Success on queryMyAssets', async () => {

            let scoot = new Scoot();
            // Create a User with the role of Owner and register 4 E-Scooters to them
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            await scoot.createAsset(transactionContext, 'HTY7654', scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            await scoot.createAsset(transactionContext, 'HTY7659', scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            await scoot.createAsset(transactionContext, 'HTY7954', scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);

            let ret = await scoot.queryMyAssets(transactionContext, owner1.ID);
            ret = JSON.parse(ret);
            expect(ret.length).to.equal(4);
        });
    });

    describe('Test Create Asset Service', async () => {
        
        it('Should Return Success on createAssetService', async () => {

            let scoot = new Scoot();
            // Register an E-Scooter to an Owner
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            // Create the service
            await scoot.createAssetService(transactionContext, service.SID, service.SerialNumber, service.ServiceType, service.ServiceDate, service.ServiceDescription);
            let ret = JSON.parse((await chaincodeStub.getState(service.SID)).toString());
            expect(ret).to.eql(service);
        });

        it('Should Return E-Scooter Not Found on createAssetService', async () => {
            let scoot = new Scoot();
            // Create the service without registering an E-Scooter to a User
            const result = await scoot.createAssetService(transactionContext, service.SID, service.SerialNumber, service.ServiceType, service.ServiceDate, service.ServiceDescription);
            expect(JSON.parse(result)).to.eql('E-Scooter Not Found');
        });
    });

    describe('Test Query Asset Service History', async () => {

        it('Should Return Not Found on queryAssetServiceHistory', async () => {

            let scoot = new Scoot();
            // Query all services done to an E-Scooter without creating it
            const result = await scoot.queryAssetServiceHistory(transactionContext, '99999');
            expect(JSON.parse(result)).to.eql('Not Found');
        });

        it('Should Return Success on queryAssetServiceHistory', async () => {
            let scoot = new Scoot();
            // Create an Owner and register an E-Scooter to them
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            // Create two service on the E-Scooter
            await scoot.createAssetService(transactionContext, service.SID, scooter1.SerialNumber, service.ServiceType, service.ServiceDate, service.ServiceDescription);
            await scoot.createAssetService(transactionContext, service1.SID, scooter1.SerialNumber, service1.ServiceType, service.ServiceDate, service1.ServiceDescription);

            let ret = await scoot.queryAssetServiceHistory(transactionContext, scooter1.SerialNumber);
            ret = JSON.parse(ret);
            expect(ret.length).to.equal(2);
        });
    });

    describe('Test Transfer Asset', async () => {

        it('Should Return Asset Transferred on transferAsset', async () => {

            let scoot = new Scoot();
            // Create two owners and an E-Scooter to transfer
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createUser(transactionContext, owner2.ID, owner2.Name, owner2.Password, owner2.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            // Initiate the Transfer to Owner 2
            const result = await scoot.transferAsset(transactionContext, scooter1.SerialNumber, owner2.ID);
            expect(JSON.parse(result)).to.eql('Asset Transferred');
        });

        it('Should Return User Error on transferAsset', async () => {

            let scoot = new Scoot();
            // Register an E-Scooter to a User but not the new owner
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);
            // Transfer to a user that dosent exist
            const result = await scoot.transferAsset(transactionContext, scooter1.SerialNumber, owner2.ID);
            expect(JSON.parse(result)).to.eql('User Error');
        });

        it('Should Return Self Transfer on transferAsset', async () => {

            let scoot = new Scoot();
            // Register an E-Scooter to a User
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);    
            // Initiate transfer to the same user
            const result = await scoot.transferAsset(transactionContext, scooter1.SerialNumber, owner1.ID);
            expect(JSON.parse(result)).to.eql('Self Transfer');
        });
    });

    describe('Test Mark Asset As Stolen', async () => {

        it('Should Return Success on markAssetStolen', async () => {

            let scoot = new Scoot();
            // Register an E-Scooter to a User
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);    
            // Mark that E-Scooter as Stolen
            await scoot.markAssetStolen(transactionContext, scooter1.SerialNumber);
            let ret = JSON.parse((await chaincodeStub.getState(scooter1.SerialNumber)));
            let expected = {
                SerialNumber: scooter1.SerialNumber,
                Manufacturer: scooter1.Manufacturer,
                Model: scooter1.Model,
                Owner: scooter1.Owner,
                Retailer: scooter1.Retailer,
                Status: 'Registered',
                State: 'Stolen',
            };
            expect(ret).to.eql(expected);
        });
    });

    describe('Test Approve Asset Registration Request', async () => {

        it('Should Return Success on approveRegistrationRequest', async () => {

            let scoot = new Scoot();
            // Create a Request
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            await scoot.requestAssetRegistration(transactionContext, request1.SerialNumber, request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);
            await scoot.approveAssetRegistration(transactionContext, request1.SerialNumber);
            let ret = JSON.parse((await chaincodeStub.getState(request1.SerialNumber)));

            let expected = {
                SerialNumber: request1.SerialNumber, 
        	    Manufacturer: request1.Manufacturer, 
        	    Model: request1.Model, 
        	    Owner: request1.Owner,
        	    Retailer: request1.Retailer,
        	    Status: "Registered",
        	    State: request1.State,
            };
            expect(ret).to.eql(expected);
        });
    });

    describe('Test Reject Asset Registration', async () => {

        it('Should Return Success on rejectAssetRegistration', async () => {

            let scoot = new Scoot();
            // Create an E-Scooter Request
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            await scoot.requestAssetRegistration(transactionContext, request1.SerialNumber, request1.Manufacturer, request1.Model, request1.Owner, request1.Retailer);
            // Reject the request
            await scoot.rejectAssetRegistration(transactionContext, request1.SerialNumber);
            let ret = await chaincodeStub.getState(request1.SerialNumber);
            expect(ret).to.equal(undefined);
        });
    });

    describe('Test Get Asset Status', async () => {

        it('Should Return Success on getAssetStatus', async () => {

            let scoot = new Scoot();
            // Register an E-Scooter to an Owner
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);    
            const result = await scoot.getAssetStatus(transactionContext, scooter1.SerialNumber);
            expect(JSON.parse(result)).to.eql('Active');
        });

        it('Should Return Asset Not Found on getAssetStatus', async () => {

            let scoot = new Scoot();
            const result = await scoot.getAssetStatus(transactionContext, scooter1.SerialNumber);
            expect(JSON.parse(result)).to.eql('Asset Not Found');
        });
    });

    describe('Test Query Stolen Scooters', () => {

        it('Should Return Success on Query Stolen Scooters', async () => {

            let scoot = new Scoot();
            // Register two E-Scooters to a User and mark them as stolen
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);  
            await scoot.createAsset(transactionContext, '782', '782', '782', scooter1.Owner, '782');  
            await scoot.createAsset(transactionContext, '876543', scooter2.Manufacturer, scooter2.Model, scooter2.Owner, scooter2.Retailer);    
            await scoot.markAssetStolen(transactionContext, scooter1.SerialNumber);
            await scoot.markAssetStolen(transactionContext, '876543');

            let ret = await scoot.queryStolenScooters(transactionContext);
            ret = JSON.parse(ret);
            expect(ret.length).to.equal(2);
        });
    });

    describe('Test Read Asset', () => {

        it('Should return Success on Read Asset', async () => {

            let scoot = new Scoot();
            // Creating an asset and a User
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createAsset(transactionContext, scooter1.SerialNumber, scooter1.Manufacturer, scooter1.Model, scooter1.Owner, scooter1.Retailer);  

            let ret = JSON.parse(await chaincodeStub.getState(scooter1.SerialNumber));
            expect(ret).to.eql(scooter1);
        });
    });

    describe('Test Create User', () => {

        it('Should Return Success on Create User', async () => {

            let scoot = new Scoot();
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            let ret = JSON.parse((await chaincodeStub.getState(owner1.ID)).toString());
            expect(ret).to.eql(owner1);
        });

        it('Should Return User Exists on Create User', async () => {

            let scoot = new Scoot();
            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            const result = await scoot.createUser(transactionContext, owner1.ID, owner2.Name, owner2.Password, owner2.Role);
            expect(JSON.parse(result)).to.eql('User Exists');
        });

        it('Should Return Retailer Exists on Create User', async () => {

            let scoot = new Scoot();
            // Create Two Retailers with the same Store Name
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            const result = await scoot.createUser(transactionContext, 'retailer2@gmail.com', retailer1.Name, retailer1.Password, retailer1.Role);
            expect(JSON.parse(result)).to.eql('Retailer Exists');
        });
    });

    describe('Test Get All Users', () => {

        it('Should Return Success on getAllUsers', async () => {

            let scoot = new Scoot();

            await scoot.createUser(transactionContext, owner1.ID, owner1.Name, owner1.Password, owner1.Role);
            await scoot.createUser(transactionContext, owner2.ID, owner2.Name, owner2.Password, owner2.Role);
            await scoot.createUser(transactionContext, registrar.ID, registrar.Name, registrar.Password, registrar.Role);

            let ret = await scoot.getAllUsers(transactionContext);
            ret = JSON.parse(ret);
            expect(ret.length).to.equal(2);

        });
    });

    describe('Test Query User', () => {

        it('Should Return User Not Found on queryUser', async () => {

            let scoot = new Scoot();
            const result = await scoot.queryUser(transactionContext, owner1.ID);
            expect(JSON.parse(result)).to.eql('User Not Found');
        });
    });

    describe('Test Retailer Exists', () => {

        it('Should Return false on RetailerExists', async () => {

            let scoot = new Scoot();
            const result = await scoot.RetailerExists(transactionContext, owner1.ID);
            expect(result).to.eql(false);
        });

        it('Should Return true on RetailerExists', async () => {

            let scoot = new Scoot();
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            const result = await scoot.RetailerExists(transactionContext, retailer1.Name);
            expect(result).to.eql(true);
        });
    });

    describe('Test Remove Participant', () => {

        it('Should Return Success on Remove Participant', async () => {

            let scoot = new Scoot();
            await scoot.createUser(transactionContext, retailer1.ID, retailer1.Name, retailer1.Password, retailer1.Role);
            // Remove the retailer
            await scoot.removeParticipant(transactionContext, retailer1.ID);
            let ret = await chaincodeStub.getState(retailer1.ID);
            expect(ret).to.equal(undefined);
        });
    });
});
