#!/bin/bash

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="${1^}MSP"
echo $CORE_PEER_LOCALMSPID
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/$1.example.com/peers/peer0.$1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/$1.example.com/users/Admin@$1.example.com/msp
export CORE_PEER_ADDRESS=localhost:$2