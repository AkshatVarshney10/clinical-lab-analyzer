import os
import json
from dotenv import load_dotenv
from google import genai
from mcp_server import fallback_lookup

load_dotenv()

client = genai.Client()

def classify_and_route(lab_inputs: list):
    routed_results = {"Critical": [], "Warning": [], "Normal": []}
    
    for lab in lab_inputs:
        ref_min = lab.get("reference_min")
        ref_max = lab.get("reference_max")
        
        # Fallback to MCP database only if CSV lacked the data
        if ref_min is None or ref_max is None:
            ref = fallback_lookup(lab["test_name"])
            ref_min = ref.get("min")
            ref_max = ref.get("max")
            lab["reference_min"] = ref_min
            lab["reference_max"] = ref_max
            
        if ref_min is None or ref_max is None:
            lab["status"] = "Warning"
            routed_results["Warning"].append(lab)
            continue
            
        val = float(lab["value"])
        min_v = float(ref_min)
        max_v = float(ref_max)
        
        if min_v <= val <= max_v:
            lab["status"] = "Normal"
            routed_results["Normal"].append(lab)
        else:
            range_span = max_v - min_v if max_v > min_v else min_v
            threshold = range_span * 0.20
            
            # 20% deviation threshold for Critical vs Warning
            if val < (min_v - threshold) or val > (max_v + threshold):
                lab["status"] = "Critical"
                routed_results["Critical"].append(lab)
            else:
                lab["status"] = "Warning"
                routed_results["Warning"].append(lab)
                
    return routed_results

def explain_abnormalities(abnormal_labs: list):
    if not abnormal_labs:
        return {}
    
    prompt = f"""
    You are an expert AI Clinical Lab Assistant. Analyze these flagged lab results: {json.dumps(abnormal_labs)}
    
    Apply Explainable AI (XAI) principles. Explain exactly WHY they are flagged based on their values vs reference ranges.
    Return a strict JSON object containing a root key 'explanations', which is an array of objects.
    Each object must have:
    - 'id' (string, MUST EXACTLY MATCH the id from the input)
    - 'why_flagged' (string, explain actual value vs normal range)
    - 'meaning' (string, what this implies clinically in plain English)
    - 'next_steps' (array of strings, 2-3 immediate actionable medical steps)
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        data = json.loads(response.text)
        # Map the XAI response purely by our injected ID to bypass language translation issues
        return {item["id"]: item for item in data.get("explanations", []) if "id" in item}
    except Exception as e:
        print("LLM Parsing Error:", e)
        return {}

def run_agent_pipeline(lab_inputs: list):
    for idx, lab in enumerate(lab_inputs):
        if "id" not in lab:
            lab["id"] = f"lab_{idx}"
            
    routed = classify_and_route(lab_inputs)
    abnormal_labs = routed["Critical"] + routed["Warning"]
    explanations = explain_abnormalities(abnormal_labs)
    
    for severity in ["Critical", "Warning"]:
        for lab in routed[severity]:
            expl = explanations.get(lab["id"])
            if expl:
                lab["explanation"] = expl
            else:
                lab["explanation"] = {
                    "why_flagged": "Flagged due to deviation from normal range.",
                    "meaning": "Possible clinical anomaly.",
                    "next_steps": ["Consult healthcare provider."]
                }
            
    return routed