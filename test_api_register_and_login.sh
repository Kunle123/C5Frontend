#!/bin/bash

API_BASE="https://api-gw-production.up.railway.app"

EMAIL="debuguser@example.com"
PASSWORD="DebugPassword123!"
NAME="Debug User"

# Register a new user
register_response=$(curl -s -X POST "$API_BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"'$NAME'","email":"'$EMAIL'","password":"'$PASSWORD'"}')

echo -e "\nRegister response:\n$register_response\n"

TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*"' | cut -d '"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to register or extract token."
  exit 1
fi

echo "Extracted JWT token: $TOKEN"

echo -e "\nAttempting login with the same credentials...\n"

login_response=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$EMAIL'","password":"'$PASSWORD'"}')

echo -e "Login response:\n$login_response\n" 