#!/bin/bash

# API base URL
API_BASE="https://api-gw-production.up.railway.app"

# Generate a random email for registration
timestamp=$(date +%s)
EMAIL="testuser_$timestamp@example.com"
PASSWORD="TestPassword123!"
NAME="Test User $timestamp"

# Register a new user and extract the token
register_response=$(curl -s -X POST "$API_BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"'$NAME'","email":"'$EMAIL'","password":"'$PASSWORD'"}')

TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*"' | cut -d '"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to register or extract token. Response: $register_response"
  exit 1
fi

echo "Registered new user: $EMAIL"
echo "Extracted JWT token: $TOKEN"

# Helper function
echo_section() {
  echo -e "\n==================== $1 ====================\n"
}

# 1. User Info
echo_section "GET /api/auth/me"
curl -s -w '\nStatus: %{http_code}\n' -H "Authorization: Bearer $TOKEN" "$API_BASE/api/auth/me"

# 2. CVs
echo_section "GET /cvs"
curl -s -w '\nStatus: %{http_code}\n' -H "Authorization: Bearer $TOKEN" "$API_BASE/cvs"

echo_section "POST /cvs (create dummy CV)"
curl -s -w '\nStatus: %{http_code}\n' -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"jobDescription":"Test job","contact":"Test contact","summary":"Test summary","experience":"Test exp","education":"Test edu","skills":"Test skills"}' \
  "$API_BASE/cvs"

# 3. Cover Letters
echo_section "GET /cover-letters"
curl -s -w '\nStatus: %{http_code}\n' -H "Authorization: Bearer $TOKEN" "$API_BASE/cover-letters"

echo_section "POST /cover-letters (create dummy)"
curl -s -w '\nStatus: %{http_code}\n' -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"jobDescription":"Test job","style":"formal","intro":"Intro","experience":"Exp","interest":"Interest","closing":"Closing"}' \
  "$API_BASE/cover-letters"

# 4. Mega CV
echo_section "GET /mega-cv/previous-cvs"
curl -s -w '\nStatus: %{http_code}\n' -H "Authorization: Bearer $TOKEN" "$API_BASE/mega-cv/previous-cvs"

echo_section "POST /mega-cv (create dummy)"
curl -s -w '\nStatus: %{http_code}\n' -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"jobDescription":"Test job","selectedSections":["dummy-section-id"]}' \
  "$API_BASE/mega-cv"

# 5. Applications
echo_section "GET /applications"
curl -s -w '\nStatus: %{http_code}\n' -H "Authorization: Bearer $TOKEN" "$API_BASE/applications"

echo_section "POST /applications (create dummy)"
curl -s -w '\nStatus: %{http_code}\n' -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"job":"Test job","company":"Test company","date":"2024-06-01","status":"Sent"}' \
  "$API_BASE/applications"

echo -e "\nAll endpoint tests complete.\n" 