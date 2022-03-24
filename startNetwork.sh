
pushd scoot-network/

# Ensure the network is down before we bring it up
./network.sh down

# Bring the network up with the peer nodes, couch db instances and channel
./network.sh up createChannel -ca -s couchdb

# Deploy the chaincode to each peer node on the network
./network.sh deployCC -ccn scoot -ccl javascript -ccp ../chaincode/SmartContract/

# Copy the connection JSON files to the application layer of the web application
cp -r /home/daragh/Documents/FYP/scoot-network/organizations/peerOrganizations/org1.example.com/connection-org1.json /home/daragh/Documents/FYP/web-app/application/connection/
cp -r /home/daragh/Documents/FYP/scoot-network/organizations/peerOrganizations/org2.example.com/connection-org2.json /home/daragh/Documents/FYP/web-app/application/connection/
cp -r /home/daragh/Documents/FYP/scoot-network/organizations/peerOrganizations/org3.example.com/connection-org3.json /home/daragh/Documents/FYP/web-app/application/connection/
cp -r /home/daragh/Documents/FYP/scoot-network/organizations/peerOrganizations/org4.example.com/connection-org4.json /home/daragh/Documents/FYP/web-app/application/connection/
