#!/bin/bash

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package basic.tar.gz --path ../chaincode-javascript/ --lang node --label basic_1.0