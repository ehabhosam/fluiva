#!/bin/bash

# Script to copy the latest proto file from planner-microservice to server
# Run this script whenever you make changes to the proto file

set -e  # Exit on any error

# Define paths
PROTO_SOURCE="../planner-microservice/proto/planner.proto"
PROTO_DEST="./proto/planner.proto"

# Check if source proto file exists
if [ ! -f "$PROTO_SOURCE" ]; then
    echo "Error: Source proto file not found at $PROTO_SOURCE"
    exit 1
fi

# Create proto directory if it doesn't exist
mkdir -p ./proto

# Copy the proto file
cp "$PROTO_SOURCE" "$PROTO_DEST"

echo "✅ Proto file copied successfully from $PROTO_SOURCE to $PROTO_DEST"

# Optional: Show file info
echo "📄 Updated proto file info:"
ls -la "$PROTO_DEST"
