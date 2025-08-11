#!/bin/bash

# Color codes for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

# Function to print section headers
print_section() {
  echo -e "\n${YELLOW}==== $1 ====${NC}\n"
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to check if a process is running on a port
port_in_use() {
  lsof -i:"$1" >/dev/null 2>&1
}

# Check for required tools
print_section "Checking required tools"

REQUIRED_TOOLS=("node" "npm" "stripe")
MISSING_TOOLS=false

for tool in "${REQUIRED_TOOLS[@]}"; do
  if ! command_exists "$tool"; then
    echo -e "${RED}$tool is not installed. Please install it before continuing.${NC}"
    MISSING_TOOLS=true
  else
    echo -e "${GREEN}$tool is installed.${NC}"
  fi
done

if [ "$MISSING_TOOLS" = true ]; then
  echo -e "\n${RED}Please install the missing tools and try again.${NC}"
  exit 1
fi

# Check for ngrok
if ! command_exists "ngrok"; then
  echo -e "${YELLOW}ngrok is not installed. We'll use Stripe CLI for webhook forwarding.${NC}"
  USE_NGROK=false
else
  echo -e "${GREEN}ngrok is installed.${NC}"
  USE_NGROK=true
fi

# Check environment variables
print_section "Checking environment variables"

ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}$ENV_FILE does not exist. Please create it from .env.local.example.${NC}"
  exit 1
fi

# Run environment variable verification script
node scripts/verify-env-config.js
if [ $? -ne 0 ]; then
  echo -e "${RED}Environment variable verification failed.${NC}"
  exit 1
fi

# Run TypeScript type checking
print_section "Running TypeScript type checking"
npm run lint

if [ $? -ne 0 ]; then
  echo -e "${RED}TypeScript type checking failed.${NC}"
  exit 1
else
  echo -e "${GREEN}TypeScript type checking passed.${NC}"
fi

# Build the project
print_section "Building the project"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed.${NC}"
  exit 1
else
  echo -e "${GREEN}Build successful.${NC}"
fi

# Start the local server in the background
print_section "Starting the local server"

# Check if port 3003 is already in use
if port_in_use 3003; then
  echo -e "${RED}Port 3003 is already in use. Please stop the process using this port and try again.${NC}"
  exit 1
fi

npm run dev &
SERVER_PID=$!

# Wait for the server to start
echo "Waiting for the server to start..."
sleep 10

# Check if the server is running
if ! port_in_use 3003; then
  echo -e "${RED}Server failed to start.${NC}"
  kill $SERVER_PID 2>/dev/null
  exit 1
else
  echo -e "${GREEN}Server is running.${NC}"
fi

# Set up webhook forwarding
print_section "Setting up webhook forwarding"

if [ "$USE_NGROK" = true ]; then
  # Start ngrok in the background
  echo "Starting ngrok..."
  ngrok http 3003 > /dev/null &
  NGROK_PID=$!
  
  # Wait for ngrok to start
  sleep 5
  
  # Get the ngrok URL
  NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
  
  if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}Failed to get ngrok URL.${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
    exit 1
  fi
  
  echo -e "${GREEN}ngrok URL: $NGROK_URL${NC}"
  WEBHOOK_URL="$NGROK_URL/api/webhook/stripe"
else
  # Use Stripe CLI for webhook forwarding
  echo "Starting Stripe webhook listener..."
  stripe listen --forward-to http://localhost:3003/api/webhook/stripe &
  STRIPE_PID=$!
  
  # Wait for Stripe CLI to start
  sleep 5
fi

# Create a test checkout session
print_section "Creating a test checkout session"

# Call the checkout API to create a test session
CHECKOUT_RESPONSE=$(curl -s -X POST http://localhost:3003/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"productId":"1","email":"test@example.com"}')

# Extract the checkout URL from the response
CHECKOUT_URL=$(echo $CHECKOUT_RESPONSE | jq -r '.url')

if [ -z "$CHECKOUT_URL" ] || [ "$CHECKOUT_URL" = "null" ]; then
  echo -e "${RED}Failed to create checkout session.${NC}"
  echo "Response: $CHECKOUT_RESPONSE"
  kill $SERVER_PID 2>/dev/null
  if [ "$USE_NGROK" = true ]; then
    kill $NGROK_PID 2>/dev/null
  else
    kill $STRIPE_PID 2>/dev/null
  fi
  exit 1
fi

echo -e "${GREEN}Checkout URL: $CHECKOUT_URL${NC}"

# Simulate a successful checkout using Stripe CLI
print_section "Simulating a successful checkout"

# Extract the session ID from the checkout URL
SESSION_ID=$(echo $CHECKOUT_URL | grep -o 'cs_[a-zA-Z0-9_]*')

if [ -z "$SESSION_ID" ]; then
  echo -e "${RED}Failed to extract session ID from checkout URL.${NC}"
  kill $SERVER_PID 2>/dev/null
  if [ "$USE_NGROK" = true ]; then
    kill $NGROK_PID 2>/dev/null
  else
    kill $STRIPE_PID 2>/dev/null
  fi
  exit 1
fi

echo "Session ID: $SESSION_ID"

# Trigger a checkout.session.completed event
stripe trigger checkout.session.completed --session $SESSION_ID

# Wait for the webhook to be processed
echo "Waiting for webhook to be processed..."
sleep 5

# Check if the entitlement was granted
print_section "Checking if entitlement was granted"

# TODO: Add code to check if the entitlement was granted
# This would typically involve checking the database or calling an API

echo -e "${YELLOW}Manual verification required: Check the database to verify that the entitlement was granted.${NC}"

# Run smoke tests
print_section "Running smoke tests"

# TODO: Add code to run smoke tests
# This would typically involve running Playwright or other E2E tests

echo -e "${YELLOW}Smoke tests not implemented yet.${NC}"

# Clean up
print_section "Cleaning up"

# Kill the server
kill $SERVER_PID 2>/dev/null
echo "Server stopped."

# Kill ngrok or Stripe CLI
if [ "$USE_NGROK" = true ]; then
  kill $NGROK_PID 2>/dev/null
  echo "ngrok stopped."
else
  kill $STRIPE_PID 2>/dev/null
  echo "Stripe webhook listener stopped."
fi

print_section "Verification complete"

echo -e "${GREEN}All checks passed!${NC}"
echo "Please review the output above for any warnings or manual verification steps."