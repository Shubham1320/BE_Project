#!/bin/bash

sudo ./network.sh up -ca -s couchdb
sudo ./network.sh createChannel

cd ..
cd chaincode-go
GO111MODULE=on go mod vendor
cd ..
cd supply-network
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package basic.tar.gz --path ../chaincode-go/ --lang golang --label basic_1.0

sudo chown -R $USER organizations/peerOrganizations/
sudo chown -R $USER organizations/ordererOrganizations/

source ./changeOrganization.sh manufacturer 7051
peer lifecycle chaincode install basic.tar.gz

source ./changeOrganization.sh retailer 9051
peer lifecycle chaincode install basic.tar.gz

source ./changeOrganization.sh distributor 10051
peer lifecycle chaincode install basic.tar.gz

export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "Package ID" | cut -d':' -f 2,3 | cut -d',' -f 1 | cut -d" " -f 2)
echo $CC_PACKAGE_ID

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --signature-policy 'OR('\''ManufacturerMSP.peer'\'','\''RetailerMSP.peer'\'','\''DistributorMSP.peer'\'')'

source ./changeOrganization.sh retailer 9051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --signature-policy 'OR('\''ManufacturerMSP.peer'\'','\''RetailerMSP.peer'\'','\''DistributorMSP.peer'\'')'

source ./changeOrganization.sh manufacturer 7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --signature-policy 'OR('\''ManufacturerMSP.peer'\'','\''RetailerMSP.peer'\'','\''DistributorMSP.peer'\'')'

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name basic --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --signature-policy 'OR('\''ManufacturerMSP.peer'\'','\''RetailerMSP.peer'\'','\''DistributorMSP.peer'\'')' --output json

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt" --peerAddresses localhost:10051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt" --signature-policy 'OR('\''ManufacturerMSP.peer'\'','\''RetailerMSP.peer'\'','\''DistributorMSP.peer'\'')'



