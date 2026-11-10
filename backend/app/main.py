from fastapi import FastAPI
from app.api.endpoints.analysis import router as analysis_router

app = FastAPI(
    title = "BeatCSV",
    description = "CSV data profiling and quality analysis",
    version = "1.0.0"
)

app.include_router(analysis_router, prefix = "/api/v1")

@app.get("/")
async def root():
    return { "message": "Welcome to BeatCSV API" }