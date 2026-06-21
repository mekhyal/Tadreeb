#!/bin/bash
# ============================================
# Tadreeb — Failing Tests Found by Code Review
# Each test targets a confirmed bug in backend/src
# ============================================

BASE="http://localhost:5001"
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
RESET="\033[0m"

PASS=0
FAIL=0

run_test() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  local body="$4"
  echo -e "${BOLD}$name${RESET}"
  echo "  Expected: $expected"
  echo "  Actual:   $actual"
  echo "  Body:     $body"
  if [ "$expected" = "$actual" ]; then
    echo -e "  ${GREEN}PASS${RESET}"
    PASS=$((PASS+1))
  else
    echo -e "  ${RED}FAIL${RESET}"
    FAIL=$((FAIL+1))
  fi
  echo ""
}

echo ""
echo "============================================"
echo "  Failing Test Cases (from code review)"
echo "============================================"
echo ""

# --- SETUP: login admin + company, register a student ---
ADMIN_TOKEN=$(curl -s -X POST "$BASE/api/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tadreeb.com","password":"Admin123!"}' \
  | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)

COMPANY_A_RESP=$(curl -s -X POST "$BASE/api/auth/company/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"company@tadreeb.com","password":"Company123!"}')
COMPANY_A_TOKEN=$(echo "$COMPANY_A_RESP" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
COMPANY_A_ID=$(echo "$COMPANY_A_RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Make sure we have a second company to attempt the mass-assignment hijack
SECOND_COMPANY_EMAIL="hijack-target-$(date +%s)@test.com"
HIJACK_TARGET_RESP=$(curl -s -X POST "$BASE/api/admin/create-company" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"companyName\":\"HijackTarget\",
    \"email\":\"$SECOND_COMPANY_EMAIL\",
    \"password\":\"Company123!\",
    \"industry\":\"Tech\",
    \"phone\":\"+96550001111\",
    \"location\":\"Kuwait\",
    \"foundedYear\":2020,
    \"status\":\"Active\"
  }")
COMPANY_B_ID=$(echo "$HIJACK_TARGET_RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "Setup done.  Admin token: ${ADMIN_TOKEN:0:12}...   CompanyA: $COMPANY_A_ID   CompanyB: $COMPANY_B_ID"
echo ""

# ============================================
# TEST 1: Mass-assignment — company hijacks another company's program
# Bug: opportunityController.js:345  updatedData = {...req.body}
# Owner-check passes for opportunity, but companyID is then writable.
# Result: caller can move someone else's program (or its own) to a different owner.
# ============================================
PROG_RESP=$(curl -s -X POST "$BASE/api/opportunities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_A_TOKEN" \
  -d '{
    "title":"Mass Assignment Test",
    "description":"will be hijacked",
    "location":"Kuwait",
    "seats":3,
    "dateFrom":"2027-01-01",
    "dateTo":"2027-03-01",
    "registrationDeadline":"2026-12-25"
  }')
PROG_ID=$(echo "$PROG_RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

UPDATE_BODY=$(curl -s -X PUT "$BASE/api/opportunities/$PROG_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_A_TOKEN" \
  -d "{\"companyID\":\"$COMPANY_B_ID\"}")
NEW_OWNER=$(echo "$UPDATE_BODY" | grep -o "\"_id\":\"$COMPANY_B_ID\"" | head -1)

if [ -n "$NEW_OWNER" ]; then
  ACTUAL="owner changed to CompanyB"
else
  ACTUAL="owner unchanged"
fi
run_test "1. Mass assignment — companyID writable on PUT /api/opportunities/:id" \
  "owner unchanged" "$ACTUAL" "$UPDATE_BODY"

# ============================================
# TEST 2: Student registration accepts garbage phone
# Bug: authController.js registerStudent — no PHONE_REGEX check (only company uses it)
# ============================================
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/student/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"universityID\":\"BADPHONE$(date +%s)\",
    \"firstName\":\"Bad\",
    \"lastName\":\"Phone\",
    \"email\":\"badphone-$(date +%s)@test.com\",
    \"password\":\"Student123!\",
    \"mobileNo\":\"not-a-phone-number\",
    \"gender\":\"Male\",
    \"universityName\":\"KU\",
    \"major\":\"CS\",
    \"year\":\"First\"
  }")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "2. Student register accepts garbage mobileNo (no regex)" \
  "400" "$CODE" "$BODY"

# ============================================
# TEST 3: Student registration with invalid gender returns 500 (no controller-level check)
# Bug: authController.js — falls through to Mongoose ValidationError caught by 500 handler
# ============================================
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/student/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"universityID\":\"BADGEN$(date +%s)\",
    \"firstName\":\"Bad\",
    \"lastName\":\"Gender\",
    \"email\":\"badgender-$(date +%s)@test.com\",
    \"password\":\"Student123!\",
    \"mobileNo\":\"+96550001234\",
    \"gender\":\"Other\",
    \"universityName\":\"KU\",
    \"major\":\"CS\",
    \"year\":\"First\"
  }")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "3. Student register with invalid gender — should 400, not 500" \
  "400" "$CODE" "$BODY"

# ============================================
# TEST 4: Student registration with invalid year returns 500
# Bug: same — no enum check at controller level
# ============================================
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/student/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"universityID\":\"BADYR$(date +%s)\",
    \"firstName\":\"Bad\",
    \"lastName\":\"Year\",
    \"email\":\"badyear-$(date +%s)@test.com\",
    \"password\":\"Student123!\",
    \"mobileNo\":\"+96550001234\",
    \"gender\":\"Male\",
    \"universityName\":\"KU\",
    \"major\":\"CS\",
    \"year\":\"Sixth\"
  }")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "4. Student register with invalid year — should 400, not 500" \
  "400" "$CODE" "$BODY"

# ============================================
# TEST 5: Public company-request accepts garbage website URL
# Bug: companyRequestController.js — only checks string, no URL_REGEX
# ============================================
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/company-requests" \
  -H "Content-Type: application/json" \
  -d "{
    \"companyName\":\"BadUrlCo-$(date +%s)\",
    \"industry\":\"Tech\",
    \"officialEmail\":\"badurl-$(date +%s)@test.com\",
    \"phoneNumber\":\"+96550001234\",
    \"website\":\"definitely not a url\",
    \"companySize\":\"50-100\",
    \"location\":\"Kuwait\",
    \"contactPerson\":\"John Doe\",
    \"companyDescription\":\"desc\",
    \"joinReason\":\"because\",
    \"confirmInfo\":true
  }")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "5. POST /api/company-requests accepts non-URL website" \
  "400" "$CODE" "$BODY"

# ============================================
# TEST 6: Public company-request accepts garbage phoneNumber
# Bug: same controller — no PHONE_REGEX check
# ============================================
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/company-requests" \
  -H "Content-Type: application/json" \
  -d "{
    \"companyName\":\"BadPhCo-$(date +%s)\",
    \"industry\":\"Tech\",
    \"officialEmail\":\"badph-$(date +%s)@test.com\",
    \"phoneNumber\":\"call me maybe\",
    \"companySize\":\"50-100\",
    \"location\":\"Kuwait\",
    \"contactPerson\":\"John Doe\",
    \"companyDescription\":\"desc\",
    \"joinReason\":\"because\",
    \"confirmInfo\":true
  }")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "6. POST /api/company-requests accepts non-phone phoneNumber" \
  "400" "$CODE" "$BODY"

# ============================================
# TEST 7: PUT /api/opportunities/:id with negative seats — should 400, not 500
# Bug: opportunityController.js:345 — body forwarded; only ValidationError saves us
# Actually returns 400 via Mongoose runValidators path, BUT the raw mongoose message leaks.
# We check the message for raw "Path `seats`" leak.
# ============================================
PROG_RESP=$(curl -s -X POST "$BASE/api/opportunities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_A_TOKEN" \
  -d '{
    "title":"Negative Seats Test",
    "description":"x",
    "location":"Kuwait",
    "seats":3,
    "dateFrom":"2027-04-01",
    "dateTo":"2027-06-01",
    "registrationDeadline":"2027-03-25"
  }')
PROG_ID=$(echo "$PROG_RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

BODY=$(curl -s -X PUT "$BASE/api/opportunities/$PROG_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_A_TOKEN" \
  -d '{"seats":-10}')
LEAKS=$(echo "$BODY" | grep -E "Path \`seats\`|Validation failed|Mongoose")
if [ -n "$LEAKS" ]; then
  ACTUAL="raw Mongoose error leaked"
else
  ACTUAL="clean message"
fi
run_test "7. PUT /api/opportunities/:id with seats=-10 leaks raw Mongoose error" \
  "clean message" "$ACTUAL" "$BODY"

# ============================================
# TEST 8: 500 leakage on malformed JSON
# Bug: error.message returned directly — body parser SyntaxError leaks position info
# ============================================
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/student/login" \
  -H "Content-Type: application/json" \
  --data-raw '{ "email": "x", ')
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
run_test "8. Malformed JSON to /api/auth/student/login — should be clean 400" \
  "400" "$CODE" "$BODY"

# ============================================
# TEST 9: Empty mobileNo on student profile update
# Bug: authController updateStudentProfile — no min-length check on mobileNo
# ============================================
STUDENT_TOKEN=$(curl -s -X POST "$BASE/api/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"failtest@test.com","password":"Student123!"}' \
  | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$STUDENT_TOKEN" ]; then
  RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE/api/auth/student/profile" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $STUDENT_TOKEN" \
    -d '{"mobileNo":""}')
  CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  run_test "9. PUT /api/auth/student/profile accepts empty mobileNo" \
    "400" "$CODE" "$BODY"
else
  echo "(skipped #9 — no student token available)"
  echo ""
fi

echo "============================================"
echo -e "  ${GREEN}Passed: $PASS${RESET}    ${RED}Failed: $FAIL${RESET}    Total: $((PASS+FAIL))"
echo "============================================"
echo ""
echo "FAIL = the bug is real (server returned the wrong thing)."
echo "PASS = the API behaved correctly; that bug isn't present."
