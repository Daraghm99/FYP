
pushd scoot-network/

# Ensure the network is down before we bring it up
./network.sh down

# Bring the network up with the peer nodes, couch db instances and channel
./network.sh up createChannel -ca -s couchdb

# Deploy the chaincode to each peer node on the network
./network.sh deployCC -ccn scootSmartContract -ccl javascript -ccp ../chaincode/
