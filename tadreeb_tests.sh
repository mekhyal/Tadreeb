#!/bin/bash
# ============================================
# Tadreeb — 6 Code-Level Bug Tests
# ============================================

BASE="http://localhost:5001"
BOLD="\033[1m"
RESET="\033[0m"

echo ""
echo "============================================"
echo "  Testing 6 Code-Level Bugs"
echo "============================================"
echo ""

# SETUP
ADMIN_RESP=$(curl -s -X POST "$BASE/api/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tadreeb.com","password":"Admin123!"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESP" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)

COMPANY_RESP=$(curl -s -X POST "$BASE/api/auth/company/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"company@tadreeb.com","password":"Company123!"}')
COMPANY_TOKEN=$(echo "$COMPANY_RESP" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
COMPANY_ID=$(echo "$COMPANY_RESP" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$COMPANY_ID" ]; then
  COMPANY_ID=$(echo "$COMPANY_RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo "Setup done. Company ID: $COMPANY_ID"
echo ""

# ============================================
# BUG 1: Mass Assignment — companyID overwrite
# ============================================
echo -e "${BOLD}Bug 1: Mass Assignment — companyID Overwrite${RESET}"
echo "Method: PUT /api/opportunities/:id"
echo "Severity: CRITICAL"

# Create a program first
PROG_RESP=$(curl -s -X POST "$BASE/api/opportunities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_TOKEN" \
  -d '{
    "title":"Bug1 Mass Assignment Test",
    "description":"Testing companyID overwrite",
    "location":"Kuwait",
    "seats":5,
    "dateFrom":"2026-08-01",
    "dateTo":"2026-10-01",
    "registrationDeadline":"2026-07-25"
  }')
PROG_ID=$(echo "$PROG_RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "  Created program: $PROG_ID (owned by $COMPANY_ID)"

# Try to overwrite companyID to a fake ID
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PUT "$BASE/api/opportunities/$PROG_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_TOKEN" \
  -d '{"companyID":"000000000000000000000000","title":"Hijacked Program"}')
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')
echo "Status: $HTTP_CODE"
echo "Expected: 400 or field ignored — companyID should NOT be changeable"
# Check if companyID was changed in response
RETURNED_COMPANY=$(echo "$BODY" | grep -o '"companyID":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$RETURNED_COMPANY" ]; then
  RETURNED_COMPANY=$(echo "$BODY" | grep -o '"companyID":{"_id":"[^"]*"' | head -1 | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
fi
echo "Returned companyID: $RETURNED_COMPANY"
if [ "$RETURNED_COMPANY" != "$COMPANY_ID" ] && [ -n "$RETURNED_COMPANY" ]; then
  echo "*** FAILED — companyID was overwritten! Mass assignment vulnerability confirmed."
else
  echo "PASSED — companyID was not changed."
fi
echo "Response: ${BODY:0:300}"
echo "---"
echo ""

# ============================================
# BUG 2: Invalid mobileNo accepted
# ============================================
echo -e "${BOLD}Bug 2: Student Registration — Invalid mobileNo${RESET}"
echo "Method: POST /api/auth/student/register"
echo "Severity: HIGH"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE/api/auth/student/register" \
  -H "Content-Type: application/json" \
  -d '{
    "universityID":"2024BUG2TEST",
    "firstName":"Bug2",
    "lastName":"Test",
    "email":"bug2test@test.com",
    "password":"Student123!",
    "mobileNo":"not-a-phone-number",
    "gender":"Male",
    "universityName":"KU",
    "major":"CS",
    "year":"Second"
  }')
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')
echo "Status: $HTTP_CODE"
echo "Expected: 400 — should reject invalid phone number"
echo "Response: ${BODY:0:200}"
echo "---"
echo ""

# ============================================
# BUG 3: gender "Other" → 500 raw Mongoose error
# ============================================
echo -e "${BOLD}Bug 3: Invalid Gender Value — Raw Error Exposure${RESET}"
echo "Method: POST /api/auth/student/register"
echo "Severity: HIGH (info leak)"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE/api/auth/student/register" \
  -H "Content-Type: application/json" \
  -d '{
    "universityID":"2024BUG3TEST",
    "firstName":"Bug3",
    "lastName":"Test",
    "email":"bug3test@test.com",
    "password":"Student123!",
    "mobileNo":"0501234567",
    "gender":"Other",
    "universityName":"KU",
    "major":"CS",
    "year":"Second"
  }')
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')
echo "Status: $HTTP_CODE"
echo "Expected: 400 with clean message — NOT 500 with raw Mongoose error"
echo "Response: ${BODY:0:300}"
echo "---"
echo ""

# ============================================
# BUG 4: year "Sixth" → 500 raw Mongoose error
# ============================================
echo -e "${BOLD}Bug 4: Invalid Year Value — Raw Error Exposure${RESET}"
echo "Method: POST /api/auth/student/register"
echo "Severity: HIGH (info leak)"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE/api/auth/student/register" \
  -H "Content-Type: application/json" \
  -d '{
    "universityID":"2024BUG4TEST",
    "firstName":"Bug4",
    "lastName":"Test",
    "email":"bug4test@test.com",
    "password":"Student123!",
    "mobileNo":"0501234567",
    "gender":"Male",
    "universityName":"KU",
    "major":"CS",
    "year":"Sixth"
  }')
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')
echo "Status: $HTTP_CODE"
echo "Expected: 400 with clean message — NOT 500 with raw Mongoose error"
echo "Response: ${BODY:0:300}"
echo "---"
echo ""

# ============================================
# BUG 5: Company request — invalid website URL
# ============================================
echo -e "${BOLD}Bug 5: Company Request — Invalid Website URL${RESET}"
echo "Method: POST /api/company-requests"
echo "Severity: MEDIUM"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE/api/company-requests" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName":"Bug5Corp",
    "industry":"Testing",
    "officialEmail":"bug5@test.com",
    "phoneNumber":"0501234567",
    "website":"definitely not a url",
    "companySize":"1-10",
    "location":"Kuwait",
    "contactPerson":"Bug5 Contact",
    "companyDescription":"Testing invalid URL",
    "joinReason":"Testing",
    "confirmInfo":true
  }')
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')
echo "Status: $HTTP_CODE"
echo "Expected: 400 — should reject invalid URL"
echo "Response: ${BODY:0:200}"
echo "---"
echo ""

# ============================================
# BUG 6: Company request — invalid phone number
# ============================================
echo -e "${BOLD}Bug 6: Company Request — Invalid Phone Number${RESET}"
echo "Method: POST /api/company-requests"
echo "Severity: MEDIUM"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE/api/company-requests" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName":"Bug6Corp",
    "industry":"Testing",
    "officialEmail":"bug6@test.com",
    "phoneNumber":"call me maybe",
    "website":"https://valid.com",
    "companySize":"1-10",
    "location":"Kuwait",
    "contactPerson":"Bug6 Contact",
    "companyDescription":"Testing invalid phone",
    "joinReason":"Testing",
    "confirmInfo":true
  }')
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')
echo "Status: $HTTP_CODE"
echo "Expected: 400 — should reject invalid phone"
echo "Response: ${BODY:0:200}"
echo "---"
echo ""

echo "============================================"
echo "  Done! Check which ones actually failed."
echo "============================================"
