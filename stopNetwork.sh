
pushd scoot-network

./network.sh down

# Remove Connection JSON file for each Organization
rm -rf /home/daragh/Documents/FYP/web-app/application/connection/*

# Remove all users from the application wallet
rm -rf /home/daragh/Documents/FYP/web-app/application/wallet/*
