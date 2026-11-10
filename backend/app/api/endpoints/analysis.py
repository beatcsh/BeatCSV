from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.csv_analyzer import analyze_csv
import pandas as pd

router = APIRouter(prefix = "/analysis", tags = [ "Analysis" ])

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException( status_code = 400, detail = "Only CSV supported" )

    try:
        content = await file.read()

        if not content:
            raise HTTPException( status_code = 400, detail = "The uploaded file is empty" )

        result = analyze_csv(content)
        result["filename"] = file.filename

        return result

    except pd.errors.EmptyDataError:
        raise HTTPException( status_code = 400, detail = "The CSV contains no data" )

    except (pd.errors.ParserError, UnicodeDecodeError):
        raise HTTPException( status_code = 400, detail = "Unable to parse the CSV file" )