# Monitoring Endpoint

The node provides a dedicated `/mcp` endpoint to check MCP server status:

**MCP Status Endpoint**

```bash
# Check MCP server status
curl http://localhost:53550/mcp

# Example response:
{
  "enabled": true,
  "transport": "sse",
  "status": "running"
}
```

