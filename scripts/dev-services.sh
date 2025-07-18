#!/bin/bash

# Development script for running Hamsoya monorepo services with debugging
# This script helps manage multiple services with different debugger ports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service configurations
declare -A SERVICES=(
    ["auth-service"]="5001:9229"
    ["api-gateway"]="8080:9230"
)

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Hamsoya Development Services  ${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_service_info() {
    echo -e "${GREEN}Service Configuration:${NC}"
    for service in "${!SERVICES[@]}"; do
        IFS=':' read -r app_port debug_port <<< "${SERVICES[$service]}"
        echo -e "  ${YELLOW}$service${NC}:"
        echo -e "    App Port:     ${GREEN}$app_port${NC}"
        echo -e "    Debug Port:   ${GREEN}$debug_port${NC}"
        echo -e "    Debug URL:    ${BLUE}chrome://inspect${NC} or ${BLUE}ws://localhost:$debug_port${NC}"
        echo ""
    done
}

check_ports() {
    echo -e "${YELLOW}Checking port availability...${NC}"
    
    for service in "${!SERVICES[@]}"; do
        IFS=':' read -r app_port debug_port <<< "${SERVICES[$service]}"
        
        if lsof -Pi :$app_port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  ${RED}✗${NC} Port $app_port (${service} app) is already in use"
        else
            echo -e "  ${GREEN}✓${NC} Port $app_port (${service} app) is available"
        fi
        
        if lsof -Pi :$debug_port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  ${RED}✗${NC} Port $debug_port (${service} debug) is already in use"
        else
            echo -e "  ${GREEN}✓${NC} Port $debug_port (${service} debug) is available"
        fi
    done
    echo ""
}

start_services() {
    echo -e "${YELLOW}Starting all services...${NC}"
    echo -e "${BLUE}Command: npx nx run-many --target=serve --all${NC}"
    echo ""
    
    # Start all services
    npx nx run-many --target=serve --all
}

start_single_service() {
    local service=$1
    if [[ -z "${SERVICES[$service]}" ]]; then
        echo -e "${RED}Error: Unknown service '$service'${NC}"
        echo -e "${YELLOW}Available services: ${!SERVICES[*]}${NC}"
        exit 1
    fi
    
    IFS=':' read -r app_port debug_port <<< "${SERVICES[$service]}"
    echo -e "${YELLOW}Starting $service...${NC}"
    echo -e "${BLUE}Command: npx nx serve $service${NC}"
    echo -e "${GREEN}App will be available at: http://localhost:$app_port${NC}"
    echo -e "${GREEN}Debugger will be available at: ws://localhost:$debug_port${NC}"
    echo ""
    
    npx nx serve "$service"
}

show_debug_info() {
    echo -e "${GREEN}Debugging Information:${NC}"
    echo ""
    echo -e "${YELLOW}Chrome DevTools:${NC}"
    echo -e "  1. Open Chrome and go to ${BLUE}chrome://inspect${NC}"
    echo -e "  2. Click 'Configure' and add the debug ports:"
    for service in "${!SERVICES[@]}"; do
        IFS=':' read -r app_port debug_port <<< "${SERVICES[$service]}"
        echo -e "     - localhost:$debug_port (${service})"
    done
    echo ""
    echo -e "${YELLOW}VS Code:${NC}"
    echo -e "  Add this to your .vscode/launch.json:"
    echo -e '  {'
    echo -e '    "type": "node",'
    echo -e '    "request": "attach",'
    echo -e '    "name": "Attach to Auth Service",'
    echo -e '    "port": 9229'
    echo -e '  },'
    echo -e '  {'
    echo -e '    "type": "node",'
    echo -e '    "request": "attach",'
    echo -e '    "name": "Attach to API Gateway",'
    echo -e '    "port": 9230'
    echo -e '  }'
    echo ""
}

show_help() {
    echo -e "${GREEN}Usage:${NC}"
    echo -e "  $0 [command] [service]"
    echo ""
    echo -e "${GREEN}Commands:${NC}"
    echo -e "  ${YELLOW}start${NC}           Start all services"
    echo -e "  ${YELLOW}start <service>${NC}  Start a specific service"
    echo -e "  ${YELLOW}check${NC}           Check port availability"
    echo -e "  ${YELLOW}info${NC}            Show service configuration"
    echo -e "  ${YELLOW}debug${NC}           Show debugging setup information"
    echo -e "  ${YELLOW}help${NC}            Show this help message"
    echo ""
    echo -e "${GREEN}Available services:${NC} ${YELLOW}${!SERVICES[*]}${NC}"
    echo ""
}

# Main script logic
case "${1:-start}" in
    "start")
        print_header
        if [[ -n "$2" ]]; then
            start_single_service "$2"
        else
            print_service_info
            check_ports
            start_services
        fi
        ;;
    "check")
        print_header
        check_ports
        ;;
    "info")
        print_header
        print_service_info
        ;;
    "debug")
        print_header
        show_debug_info
        ;;
    "help"|"-h"|"--help")
        print_header
        show_help
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
