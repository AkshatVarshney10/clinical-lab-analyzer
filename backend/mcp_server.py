from mcp.server.fastmcp import FastMCP
import json

# Initialize the MCP Server
mcp = FastMCP("ClinicalLabTools")

# Mock database simulating the Kaggle Dataset reference ranges
REFERENCE_DB = {
    "glucose": {"min": 70, "max": 99, "unit": "mg/dL"},
    "hemoglobin": {"min": 12.0, "max": 16.0, "unit": "g/dL"},
    "wbc": {"min": 4.5, "max": 11.0, "unit": "10^3/uL"},
    "platelets": {"min": 150, "max": 450, "unit": "10^3/uL"},
    "ferritin": {"min": 12, "max": 150, "unit": "ug/L"},
    "tsh": {"min": 0.4, "max": 4.0, "unit": "mU/L"}
}

@mcp.tool()
def reference_range_lookup(test_name: str) -> str:
    """Look up official reference ranges and units for a given lab test."""
    test_name = test_name.lower().strip()
    data = REFERENCE_DB.get(test_name, {"min": None, "max": None, "unit": None, "error": "Test not found in DB."})
    return json.dumps(data)

def fallback_lookup(test_name: str) -> dict:
    """Direct callable fallback in case stdio MCP protocol fails during hackathon demo."""
    return json.loads(reference_range_lookup(test_name))

if __name__ == "__main__":
    # Runs the server listening on stdio (Standard MCP communication)
    mcp.run()