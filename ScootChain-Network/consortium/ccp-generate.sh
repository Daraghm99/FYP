#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        consortium/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        consortium/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG="owner"
P0PORT=7051
CAPORT=1010
PEERPEM=consortium/crypto-config/peerOrganizations/owner/tlsca/tlsca.owner-cert.pem
CAPEM=consortium/crypto-config/peerOrganizations/owner/ca/ca.owner-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > consortium/crypto-config/peerOrganizations/owner/connection-owner.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > consortium/crypto-config/peerOrganizations/owner/connection-owner.yaml

ORG="retailer"
P0PORT=9051
CAPORT=1020
PEERPEM=consortium/crypto-config/peerOrganizations/retailer/tlsca/tlsca.retailer-cert.pem
CAPEM=consortium/crypto-config/peerOrganizations/retailer/ca/ca.retailer-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > consortium/crypto-config/peerOrganizations/retailer/connection-retailer.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > consortium/crypto-config/peerOrganizations/retailer/connection-retailer.yaml
