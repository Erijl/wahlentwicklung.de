#!/bin/bash

# Path to the directory containing the .proto files
PROTO_DIR="../"

# Output directory for generated Java code
JAVA_OUTPUT_DIR="../../wahlentwicklung-importer/src/main/java"

# Output directory for generated TypeScript code
# TS_OUTPUT_DIR="" TBD

# Path to the protoc-gen-ts_proto.cmd (npm package)
# PROTOC_GEN_TS_PATH="" TBD

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Generate Java definitions
START_TIME=$(date +%s%N)
protoc -I="$PROTO_DIR" --java_out="$JAVA_OUTPUT_DIR" "$PROTO_DIR/*.proto"
END_TIME=$(date +%s%N)

EXEC_TIME=$((END_TIME - START_TIME))
SECONDS=$((EXEC_TIME / 1000000000))
MILLISECONDS=$((EXEC_TIME / 1000000 % 1000))

if [ $? -eq 0 ]; then
    printf "${GREEN}[ ✔  ] ${NC}%-50s %ds %03dms\n" "Java definitions generated successfully" $SECONDS $MILLISECONDS
else
    printf "${RED}[ ✖  ] Java definitions generation failed. TypeScript will not be generated.${NC}\n"
    exit 1
fi

# Generate TypeScript definitions
#START_TIME=$(date +%s%N)
#protoc -I="$PROTO_DIR" --plugin=protoc-gen-ts_proto=$PROTOC_GEN_TS_PATH --ts_proto_out=$TS_OUTPUT_DIR "$PROTO_DIR/*.proto" --ts_proto_opt=esModuleInterop=true --ts_proto_opt=importSuffix=.js
#END_TIME=$(date +%s%N)
#
#EXEC_TIME=$((END_TIME - START_TIME))
#SECONDS=$((EXEC_TIME / 1000000000))
#MILLISECONDS=$((EXEC_TIME / 1000000 % 1000))
#
#if [ $? -eq 0 ]; then
#    printf "${GREEN}[ ✔  ] ${NC}%-50s %ds %03dms\n" "TypeScript definitions generated successfully" $SECONDS $MILLISECONDS
#else
#    printf "${RED}[ ✖  ] TypeScript definitions generation failed.${NC}\n"
#    exit 1
#fi