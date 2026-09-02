from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import csv
import io
from agent import run_agent_pipeline

app = FastAPI(title="Clinical Lab Results API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LabResult(BaseModel):
    test_name: str
    value: float
    unit: str
    reference_min: Optional[float] = None
    reference_max: Optional[float] = None

class LabBatchRequest(BaseModel):
    labs: List[LabResult]

@app.post("/analyze_labs")
async def analyze_labs(request: LabBatchRequest):
    lab_data = [lab.dict() for lab in request.labs]
    results = run_agent_pipeline(lab_data)
    return {"status": "success", "data": results}

@app.post("/analyze_labs_csv")
async def analyze_labs_csv(file: UploadFile = File(...)):
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    lab_data = []
    for idx, row in enumerate(reader):
        test_name = row.get("Test_Name", row.get("test_name", ""))
        raw_value = row.get("Result", row.get("value", 0))
        unit = row.get("Unit", row.get("unit", ""))
        
        # Grab the Kaggle reference ranges directly
        min_ref = row.get("Min_Reference", row.get("min_reference", None))
        max_ref = row.get("Max_Reference", row.get("max_reference", None))
        
        try:
            value = float(raw_value)
            if test_name:
                lab = {
                    "id": f"lab_{idx}",
                    "test_name": test_name, 
                    "value": value, 
                    "unit": unit
                }
                
                # Safely assign bounds if they exist in the CSV
                try:
                    if min_ref: lab["reference_min"] = float(min_ref)
                    if max_ref: lab["reference_max"] = float(max_ref)
                except ValueError:
                    pass
                    
                lab_data.append(lab)
        except ValueError:
            continue
            
    results = run_agent_pipeline(lab_data)
    return {"status": "success", "data": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)