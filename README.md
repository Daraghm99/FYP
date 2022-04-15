# ScootChain: A Blockchain-based E-Scooter Ownership System

## These instructions are for use on Linux

### Step 1 - Prerequisites
[Link to Hyperledger Fabric PreReqesuites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)
Download all prerequisite software for Hyperledger Fabric
`node -v`
`npm -v`
`docker --version`
`docker-compose --version`
`curl --version`

### Step 2 - Images, Samples and Binaries
[Link to Hyperledger Fabric Images](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)
Download all Images and Binaries from Hyperledger Fabric
`curl -sSL https://bit.ly/2ysbOFE | bash -s`

### Step 3 - Start the Network
`./startNetwork.sh`

### Step 4 - Enroll the Registrar
`cd web-app/application`
`node enrollRegistrar.js`

### Step 5 - Start the Server
`npm start`

### Step 6 - Start the React Application
`cd web-app/presentation/scoot-chain`
`npm start`

### Step 7 - Login to the Registrar
email: registrar@gmail.com
password: password

### Step 8 - Start Creating different user with the Registrar
