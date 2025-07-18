# Debugging Guide for Hamsoya Monorepo

This guide explains how to debug the Node.js services in the Hamsoya monorepo, which have been configured with unique debugger ports to avoid conflicts.

## Service Configuration

Each service runs on different ports to avoid conflicts:

| Service | App Port | Debug Port | Debug URL |
|---------|----------|------------|-----------|
| auth-service | 5001 | 9229 | ws://localhost:9229 |
| api-gateway | 8080 | 9230 | ws://localhost:9230 |

## Quick Start

### Using the Development Script

We've provided a convenient script to manage services:

```bash
# Start all services
./scripts/dev-services.sh start

# Start a specific service
./scripts/dev-services.sh start auth-service
./scripts/dev-services.sh start api-gateway

# Check port availability
./scripts/dev-services.sh check

# Show service information
./scripts/dev-services.sh info

# Show debugging setup information
./scripts/dev-services.sh debug
```

### Manual Commands

```bash
# Start all services
npx nx run-many --target=serve --all

# Start individual services
npx nx serve auth-service    # Debug port: 9229
npx nx serve api-gateway     # Debug port: 9230
```

## Debugging Methods

### 1. VS Code Debugging

The repository includes a `.vscode/launch.json` configuration with pre-configured debug profiles:

1. **Start your services** first using one of the methods above
2. **Open VS Code** and go to the Debug panel (Ctrl+Shift+D)
3. **Select a debug configuration**:
   - "Attach to Auth Service" - connects to port 9229
   - "Attach to API Gateway" - connects to port 9230
   - "Debug All Services" - connects to both services simultaneously
4. **Click the play button** or press F5 to start debugging

### 2. Chrome DevTools

1. **Start your services** using the development script or nx commands
2. **Open Chrome** and navigate to `chrome://inspect`
3. **Click "Configure"** and add the debug ports:
   - `localhost:9229` (auth-service)
   - `localhost:9230` (api-gateway)
4. **Click "Done"** and you should see your Node.js processes listed
5. **Click "inspect"** next to the service you want to debug

### 3. WebStorm/IntelliJ IDEA

1. **Start your services** first
2. **Create a new Run Configuration**:
   - Type: "Attach to Node.js/Chrome"
   - Host: localhost
   - Port: 9229 (for auth-service) or 9230 (for api-gateway)
3. **Start debugging** by clicking the debug button

## Troubleshooting

### Port Conflicts

If you encounter "address already in use" errors:

1. **Check what's using the ports**:
   ```bash
   # Check app ports
   lsof -i :5001  # auth-service
   lsof -i :8080  # api-gateway
   
   # Check debug ports
   lsof -i :9229  # auth-service debug
   lsof -i :9230  # api-gateway debug
   ```

2. **Kill conflicting processes**:
   ```bash
   # Kill by port
   kill -9 $(lsof -t -i:9229)
   kill -9 $(lsof -t -i:9230)
   
   # Or kill all node processes (be careful!)
   pkill -f node
   ```

3. **Use the port checker**:
   ```bash
   ./scripts/dev-services.sh check
   ```

### Services Not Starting

1. **Clean and rebuild**:
   ```bash
   npx nx reset
   npx nx run-many --target=build --all
   ```

2. **Check dependencies**:
   ```bash
   npm install
   ```

3. **Verify configuration**:
   ```bash
   ./scripts/dev-services.sh info
   ```

### Debugger Not Connecting

1. **Verify the service is running** and the debug port is open:
   ```bash
   netstat -tlnp | grep :9229  # auth-service
   netstat -tlnp | grep :9230  # api-gateway
   ```

2. **Check firewall settings** - ensure the debug ports are not blocked

3. **Restart the service** if the debugger was attached when the service crashed

## Configuration Details

### Auth Service Debug Configuration

Located in `apps/auth-service/package.json`:

```json
{
  "serve": {
    "options": {
      "inspect": "localhost:9229"
    },
    "configurations": {
      "development": {
        "inspect": "localhost:9229"
      },
      "production": {
        "inspect": false
      }
    }
  }
}
```

### API Gateway Debug Configuration

Located in `apps/api-gateway/package.json`:

```json
{
  "serve": {
    "options": {
      "inspect": "localhost:9230"
    },
    "configurations": {
      "development": {
        "inspect": "localhost:9230"
      },
      "production": {
        "inspect": false
      }
    }
  }
}
```

## Adding New Services

When adding new services to the monorepo:

1. **Assign a unique debug port** (e.g., 9231, 9232, etc.)
2. **Update the service's package.json** with the inspect configuration
3. **Update the development script** in `scripts/dev-services.sh`
4. **Add a new debug configuration** to `.vscode/launch.json`
5. **Update this documentation**

## Best Practices

1. **Always start services before attaching debuggers**
2. **Use unique ports** for each service to avoid conflicts
3. **Disable debugging in production** by setting `"inspect": false`
4. **Use the development script** for consistent service management
5. **Check port availability** before starting services if you encounter issues
