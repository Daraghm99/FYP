

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

source scriptUtils.sh

NETWORK_DOCKER=docker/docker-compose-net.yaml

COMPOSE_FILE_COUCH=./docker/docker-compose-couch.yaml

COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

# Create Consortium

function createConsortium() {

    which configtxgen
    if [ "$?" -ne 0 ] then
        fatalln "configxgen tool not found"
    fi

    infoln "Generating Orderer Genisis Block"

    # Block file cannot be named orderer.genesis.block or the orderer will fail to launch

    set -x
	configtxgen -profile TwoOrgsApplicationGenesis -channelID system-channel -outputBlock  ./system-genesis-block/genesis.block
	res=$?
	{ set +x; } 2>/dev/null

    if [ "$?" -ne 0 ] then
        fatalln "Failed to generate orderer genisis block"
    fi
}

function CAServiceUP() {
    
    IMAGE_TAG = docker-compose -f $COMPOSE_FILE_CA up -d

    docker ps -a
    if [ $? -ne 0 ]; then
        fatalln "Unable to start CA service docker"
    fi
}

function networkUp() {

    COMPOSE_FILES="-f ${NETWORK_DOCKER}"

    if [ "${DATABASE}" == "couchdb" ]; then
        COMPOSE_FILES="${COMPOSE_FILES} -f ${COMPOSE_FILE_COUCH}"
    fi

    IMAGE_TAG = docker-compose ${COMPOSE_FILES} up -d 2>&1

    docker ps -a
    if [ $? -ne 0 ]; then
        fatalln "Unable to start network"
    fi
}

function createChannel() {

    if [ ! -d "consortium/crypto-config/peerOrganizations" ]; then
        infoln "bringing up network"
        networkUp
    fi

    scripts/createChannel.sh $CHANNEL_NAME $CLI_DELAY $MAX_RETRY $VERBOSE
    if [ $? -ne 0 ]; then
        fatalln "Create channel failed"
    fi 
}