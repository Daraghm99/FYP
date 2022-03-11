
source scriptUtils.sh
export PATH=${PWD}/../bin:$PATH

certificatesForOwner(){
    echo
    echo "Enroll the CA admin"
    echo
    # Create directory to store crypto material
    mkdir -p consortium/crypto-config/peerOrganizations/owner/
    export FABRIC_CA_CLIENT_HOME=${PWD}/consortium/crypto-config/peerOrganizations/owner/

    # Enroll the admin user and create the public and private key
    fabric-ca-client enroll -u https://admin:adminpw@localhost:1010 --caname ca.owner --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-1010-ca-owner.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-1010-ca-owner.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-1010-ca-owner.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-1010-ca-owner.pem
        OrganizationalUnitIdentifier: orderer' > ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/config.yaml

    ###############################################################
                            #REGISTERING#

    echo
    echo "Registering Peer0"
    echo
    fabric-ca-client register --caname ca.owner --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    echo
    echo "Registering Peer1"
    echo
    fabric-ca-client register --caname ca.owner --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem
    
    echo
    echo "Registering User"
    echo
    fabric-ca-client register --caname ca.owner --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    echo
    echo "Registering the org admin"
    echo
    fabric-ca-client register --caname ca.owner --id.name owneradmin --id.secret owneradminpw --id.type admin --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    #Creating a directory for the peers
    mkdir -p consortium/crypto-config/peerOrganizations/owner/peers

    #################################################################
                            #ENROLLING Peer 0#

    #Creating the directory for Peer 0
    mkdir -p consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner

    echo
    echo "Generating the peer0 msp"
    echo
    fabric-ca-client enroll -u https://peer0:peer0pw@localhost:1010 --caname ca.owner -M ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/msp --csr.hosts peer0.owner --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    #Copying Owner config.yaml file to Peer 0
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/config.yaml ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/msp/config.yaml  

    echo
    echo "Generating the peer0-tls certificates"
    echo
    fabric-ca-client enroll -u https://peer0:peer0pw@localhost:1010 --caname ca.owner -M ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls --enrollment.profile tls --csr.hosts peer0.owner --csr.hosts localhost --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    #Copying the tls ca cert, server cert and server keystore to folders that are referenced by the peers startup config
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/ca.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/signcerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/server.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/keystore/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/server.key

    mkdir ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/tlscacerts
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/tlscacerts/ca.crt

    mkdir ${PWD}/consortium/crypto-config/peerOrganizations/owner/tlsca    
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/tlsca/tlsca.owner-cert.pem

    mkdir ${PWD}/consortium/crypto-config/peerOrganizations/owner/ca
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer0.owner/msp/cacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/ca/ca.owner-cert.pem
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/keystore/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/ca/

    #################################################################
                            #ENROLLING Peer 1#
    #Creating the directory for Peer 1
    mkdir -p consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner

    echo
    echo "Generating the peer1 msp"
    echo
    fabric-ca-client enroll -u https://peer1:peer1pw@localhost:1010 --caname ca.owner -M ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/msp --csr.hosts peer1.owner --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    #Copying Owner config.yaml file to Peer 1
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/config.yaml ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/msp/config.yaml  

    echo
    echo "Generating the peer1-tls certificates"
    echo

    fabric-ca-client enroll -u https://peer1:peer1pw@localhost:1010 --caname ca.owner -M ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls --enrollment.profile tls --csr.hosts peer1.owner --csr.hosts localhost --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls/ca.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls/signcerts/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls/server.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls/keystore/* ${PWD}/consortium/crypto-config/peerOrganizations/owner/peers/peer1.owner/tls/server.key

    ###################################################################
                            #Enrolling Admin & User msp

    mkdir -p consortium/crypto-config/peerOrganizations/owner/users
    mkdir -p consortium/crypto-config/peerOrganizations/owner/users/User1
    
    echo
    echo "Generating the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:1010 --caname ca.owner -M ${PWD}/consortium/crypto-config/peerOrganizations/owner/users/User1/msp --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    echo
    echo "Generating the org admin msp"
    echo
    fabric-ca-client enroll -u https://owneradmin:owneradminpw@localhost:1010 --caname ca.owner -M ${PWD}/consortium/crypto-config/peerOrganizations/owner/users/Admin@owner/msp --tls.certfiles ${PWD}/consortium/fabric-ca/owner/tls-cert.pem

    cp ${PWD}/consortium/crypto-config/peerOrganizations/owner/msp/config.yaml ${PWD}/consortium/crypto-config/peerOrganizations/owner/users/Admin@owner/msp/config.yaml
}

certificatesForRetailer(){
    echo
    echo "Enroll the CA admin"
    echo
    # Create directory to store crypto material
    mkdir -p consortium/crypto-config/peerOrganizations/retailer/
    export FABRIC_CA_CLIENT_HOME=${PWD}/consortium/crypto-config/peerOrganizations/retailer/

    # Enroll the admin user and create the public and private key
    fabric-ca-client enroll -u https://admin:adminpw@localhost:1020 --caname ca.retailer --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-retailer.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-retailer.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-retailer.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-retailer.pem
        OrganizationalUnitIdentifier: orderer' > ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/config.yaml

    ###############################################################
                            #REGISTERING#
    echo
    echo "Registering Peer0"
    echo
    fabric-ca-client register --caname ca.retailer --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    echo
    echo "Registering Peer1"
    echo
    fabric-ca-client register --caname ca.retailer --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    echo
    echo "Registering User"
    echo
    fabric-ca-client register --caname ca.retailer --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    echo
    echo "Registering the org admin"
    echo
    fabric-ca-client register --caname ca.retailer --id.name retaileradmin --id.secret retaileradminpw --id.type admin --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    #Creating a directory for the peers
    mkdir -p consortium/crypto-config/peerOrganizations/retailer/peers

    #################################################################
                            #ENROLLING Peer 0#

    #Creating the directory for Peer 0
    mkdir -p consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer

    echo
    echo "Generating the peer0 msp"
    echo
    fabric-ca-client enroll -u https://peer0:peer0pw@localhost:1020 --caname ca.retailer -M ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/msp --csr.hosts peer0.retailer --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    #Copying retailer config.yaml file to Peer 0
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/config.yaml ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/msp/config.yaml  

    echo
    echo "Generating the peer0-tls certificates"
    echo
    fabric-ca-client enroll -u https://peer0:peer0pw@localhost:1020 --caname ca.retailer -M ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls --enrollment.profile tls --csr.hosts peer0.retailer --csr.hosts localhost --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    #Copying the tls ca cert, server cert and server keystore to folders that are referenced by the peers startup config
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/ca.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/signcerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/server.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/keystore/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/server.key

    mkdir ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/tlscacerts
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/tlscacerts/ca.crt

    mkdir ${PWD}/consortium/crypto-config/peerOrganizations/retailer/tlsca    
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/tlsca/tlsca.retailer-cert.pem

    mkdir ${PWD}/consortium/crypto-config/peerOrganizations/retailer/ca
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer0.retailer/msp/cacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/ca/ca.retailer-cert.pem
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/keystore/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/ca/

    #################################################################
                            #ENROLLING Peer 1#
    #Creating the directory for Peer 1
    mkdir -p consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer

    echo
    echo "Generating the peer1 msp"
    echo

    fabric-ca-client enroll -u https://peer1:peer1pw@localhost:1020 --caname ca.retailer -M ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/msp --csr.hosts peer1.retailer --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    #Copying retailer config.yaml file to Peer 1
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/config.yaml ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/msp/config.yaml  

    echo
    echo "Generating the peer1-tls certificates"
    echo
    fabric-ca-client enroll -u https://peer1:peer1pw@localhost:1020 --caname ca.retailer -M ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls --enrollment.profile tls --csr.hosts peer1.retailer --csr.hosts localhost --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls/tlscacerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls/ca.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls/signcerts/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls/server.crt
    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls/keystore/* ${PWD}/consortium/crypto-config/peerOrganizations/retailer/peers/peer1.retailer/tls/server.key

    ###################################################################
                            #Enrolling Admin & User msp

    mkdir -p consortium/crypto-config/peerOrganizations/retailer/users
    mkdir -p consortium/crypto-config/peerOrganizations/retailer/users/User1

    echo
    echo "Generating the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:1020 --caname ca.retailer -M ${PWD}/consortium/crypto-config/peerOrganizations/retailer/users/User1/msp --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    echo
    echo "Generating the org admin msp"
    echo
    fabric-ca-client enroll -u https://retaileradmin:retaileradminpw@localhost:1020 --caname ca.retailer -M ${PWD}/consortium/crypto-config/peerOrganizations/retailer/users/Admin@retailer/msp --tls.certfiles ${PWD}/consortium/fabric-ca/retailer/tls-cert.pem

    cp ${PWD}/consortium/crypto-config/peerOrganizations/retailer/msp/config.yaml ${PWD}/consortium/crypto-config/peerOrganizations/retailer/users/Admin@retailer/msp/config.yaml

}

certificatesForOrderer(){
    echo
    echo "Enroll the CA admin"
    echo
    # Create directory to store crypto material
    mkdir -p consortium/crypto-config/ordererOrganizations/example.com
    export FABRIC_CA_CLIENT_HOME=${PWD}/consortium/crypto-config/ordererOrganizations/example.com

    # Enroll the admin user and create the public and private key
    fabric-ca-client enroll -u https://admin:adminpw@localhost:1030 --caname ca-orderer --tls.certfiles ${PWD}/consortium/fabric-ca/ordererOrg/tls-cert.pem

    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-orderer.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-orderer.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-orderer.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-1020-ca-orderer.pem
        OrganizationalUnitIdentifier: orderer' > ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/msp/config.yaml

    echo
    echo "Registering orderer"
    echo
    fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/consortium/fabric-ca/ordererOrg/tls-cert.pem

    echo
    echo "Registering the orderer admin"
    echo
    fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/consortium/fabric-ca/ordererOrg/tls-cert.pem

    mkdir -p consortium/crypto-config/ordererOrganizations/example.com/orderers
    mkdir -p consortium/crypto-config/ordererOrganizations/example.com/orderers/example.com


    #################################################################################################
                            #ENROLLING#
    mkdir -p consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com

    echo
    echo "Generating the orderer msp"
    echo
    fabric-ca-client enroll -u https://orderer:ordererpw@localhost:1030 --caname ca-orderer -M ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/consortium/fabric-ca/ordererOrg/tls-cert.pem

    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/msp/config.yaml ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml

    echo
    echo "Generating the orderer-tls certificates"
    echo
    fabric-ca-client enroll -u https://orderer:ordererpw@localhost:1030 --caname ca-orderer -M ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/consortium/fabric-ca/ordererOrg/tls-cert.pem

    # Copy the tls CA cert, server cert, server keystore to well known file names in the orderer's tls directory that are referenced by orderer startup config
    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/* ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
    cp ${PWD}/consortium/crypto-config//ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/* ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

    mkdir -p ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts
    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

    mkdir -p ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/msp/tlscacerts
    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

    mkdir -p ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/ca
    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/keystore/* ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/ca/ca.example.com-cert.pem

    echo
    echo "Generating the admin msp"
    echo
    fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:1030 --caname ca-orderer -M ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp --tls.certfiles ${PWD}/consortium/fabric-ca/ordererOrg/tls-cert.pem

    cp ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/msp/config.yaml ${PWD}/consortium/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml
}

#echo "Creating Owner Identities"
#certificatesForOwner

#echo "Creating Retailer Identities"
#certificatesForRetailer

#echo "Creating Orderer Identities"
#certificatesForOrderer

echo "Generating CCP Files"
consortium/ccp-generate.sh