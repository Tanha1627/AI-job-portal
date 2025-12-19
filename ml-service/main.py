from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager
import uvicorn

# Import our custom modules
from ml_service import ResumeRanker
from pdf_extractor import PDFTextExtractor


# ----------------------------
# Lifespan (Startup / Shutdown)
# ----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model on startup"""
    try:
        app.state.ranker = ResumeRanker(
            model_path="lightgbm_ranking.txt",
            vectorizer_path="ranking.pkl"
        )
        print("✓ ML Model loaded successfully")
    except Exception as e:
        print(f"✗ Error loading ML model: {e}")
        app.state.ranker = None

    app.state.pdf_extractor = PDFTextExtractor()

    yield  # App runs here

    print("Shutting down Resume Ranking ML Service...")


# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI(
    title="Resume Ranking ML Service",
    description="AI-powered resume ranking using LightGBM",
    version="1.0.0",
    lifespan=lifespan
)


# ----------------------------
# CORS Middleware
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# Request / Response Models
# ----------------------------
class ApplicationInput(BaseModel):
    id: str
    fullname: str
    email: Optional[str] = None
    phoneNumber: Optional[str] = None
    resumeFileUrl: Optional[str] = None
    coverLetter: Optional[str] = None
    status: Optional[str] = "pending"
    createdAt: Optional[str] = None
    applicantProfile: Optional[Dict[str, Any]] = None


class RankingRequest(BaseModel):
    applications: List[ApplicationInput]
    job_description: str


class ApplicationOutput(ApplicationInput):
    resume_text: Optional[str] = None
    rank: int
    rank_score: float
    match_category: str
    match_percentage: float


class RankingResponse(BaseModel):
    success: bool
    ranked_applications: List[ApplicationOutput]
    total_applications: int
    category_summary: Dict[str, int]
    message: Optional[str] = None


# ----------------------------
# API Endpoints
# ----------------------------
@app.get("/")
async def root():
    return {
        "message": "Resume Ranking ML Service",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    ranker = app.state.ranker
    return {
        "status": "healthy" if ranker is not None else "unhealthy",
        "model_loaded": ranker is not None
    }


@app.post("/rank", response_model=RankingResponse)
async def rank_applications(request: RankingRequest):
    ranker = app.state.ranker
    pdf_extractor = app.state.pdf_extractor

    if not ranker:
        raise HTTPException(status_code=503, detail="ML model not loaded")

    if not request.applications:
        return RankingResponse(
            success=True,
            ranked_applications=[],
            total_applications=0,
            category_summary={},
            message="No applications to rank"
        )

    try:
        print(f"Ranking {len(request.applications)} applications...")

        applications_dict = [app.dict() for app in request.applications]

        for app_data in applications_dict:
            resume_url = app_data.get("resumeFileUrl")

            if resume_url:
                try:
                    print(f"Extracting text from: {resume_url}")
                    resume_text = pdf_extractor.extract_from_url(resume_url)
                    cover_letter = app_data.get("coverLetter", "")
                    app_data["resume_text"] = f"{resume_text} {cover_letter}"
                except Exception as e:
                    print(f"Error extracting resume: {e}")
                    app_data["resume_text"] = app_data.get("coverLetter", "")
            else:
                app_data["resume_text"] = app_data.get("coverLetter", "")

        ranked_applications = ranker.rank_applications(
            applications_dict,
            request.job_description
        )

        output_applications = [
            ApplicationOutput(**app) for app in ranked_applications
        ]

        category_summary = ranker.get_category_summary(ranked_applications)

        return RankingResponse(
            success=True,
            ranked_applications=output_applications,
            total_applications=len(output_applications),
            category_summary=category_summary,
            message=f"Successfully ranked {len(output_applications)} applications"
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error ranking applications: {str(e)}"
        )


@app.post("/extract-text")
async def extract_text(pdf_url: str):
    pdf_extractor = app.state.pdf_extractor
    try:
        text = pdf_extractor.extract_from_url(pdf_url)
        sections = pdf_extractor.extract_key_sections(text)
        return {
            "success": True,
            "text": text,
            "sections": sections,
            "length": len(text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/test")
async def test_ranking():
    ranker = app.state.ranker

    if not ranker:
        raise HTTPException(status_code=503, detail="ML model not loaded")

    test_applications = [
        {
            "id": "1",
            "fullname": "Alice Johnson",
            "email": "alice@example.com",
            "resume_text": "Python developer with 5 years in machine learning. Expert in TensorFlow, PyTorch."
        },
        {
            "id": "2",
            "fullname": "Bob Smith",
            "email": "bob@example.com",
            "resume_text": "Frontend developer with React and Angular."
        },
        {
            "id": "3",
            "fullname": "Carol White",
            "email": "carol@example.com",
            "resume_text": "Senior ML engineer with NLP and deep learning experience."
        }
    ]

    job_desc = "Looking for Python ML Engineer with deep learning and NLP experience"
    ranked = ranker.rank_applications(test_applications, job_desc)

    return {
        "success": True,
        "ranked_applications": ranked
    }


# ----------------------------
# Run Application
# ----------------------------
if __name__ == "__main__":
    print("\n📚 Docs: http://localhost:8000/docs")
    print("🔍 Health: http://localhost:8000/health\n")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )




















# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional, Dict, Any
# import uvicorn

# # Import our custom modules
# from ml_service import ResumeRanker
# from pdf_extractor import PDFTextExtractor

# # Initialize FastAPI app
# app = FastAPI(
#     title="Resume Ranking ML Service",
#     description="AI-powered resume ranking using LightGBM",
#     version="1.0.0"
# )

# # CORS middleware - allows requests from your frontend/backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify exact origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize ML components
# ranker = None
# pdf_extractor = PDFTextExtractor()


# @app.on_event("startup")
# async def startup_event():
#     """Load ML model on startup"""
#     global ranker
#     try:
#         ranker = ResumeRanker(
#             model_path='lightgbm_ranking.txt',
#             vectorizer_path='ranking.pkl'
#         )
#         print("✓ ML Model loaded successfully")
#     except Exception as e:
#         print(f"✗ Error loading ML model: {e}")
#         ranker = None


# # Request/Response Models
# class ApplicationInput(BaseModel):
#     id: str
#     fullname: str
#     email: Optional[str] = None
#     phoneNumber: Optional[str] = None
#     resumeFileUrl: Optional[str] = None
#     coverLetter: Optional[str] = None
#     status: Optional[str] = "pending"
#     createdAt: Optional[str] = None
#     applicantProfile: Optional[Dict[str, Any]] = None


# class RankingRequest(BaseModel):
#     applications: List[ApplicationInput]
#     job_description: str


# class ApplicationOutput(ApplicationInput):
#     resume_text: Optional[str] = None
#     rank: int
#     rank_score: float
#     match_category: str  # "Best Match", "Average Match", "Weak Match"
#     match_percentage: float


# class RankingResponse(BaseModel):
#     success: bool
#     ranked_applications: List[ApplicationOutput]
#     total_applications: int
#     category_summary: Dict[str, int]
#     message: Optional[str] = None


# # API Endpoints
# @app.get("/")
# async def root():
#     """Root endpoint"""
#     return {
#         "message": "Resume Ranking ML Service",
#         "docs": "/docs",
#         "health": "/health"
#     }


# @app.get("/health")
# async def health_check():
#     """Health check endpoint"""
#     return {
#         "status": "healthy" if ranker is not None else "unhealthy",
#         "model_loaded": ranker is not None
#     }


# @app.post("/rank", response_model=RankingResponse)
# async def rank_applications(request: RankingRequest):
#     """
#     Rank job applications based on resume content
#     """
#     if not ranker:
#         raise HTTPException(status_code=503, detail="ML model not loaded")
    
#     if not request.applications:
#         return RankingResponse(
#             success=True,
#             ranked_applications=[],
#             total_applications=0,
#             message="No applications to rank"
#         )
    
#     try:
#         print(f"Ranking {len(request.applications)} applications...")
        
#         # Convert to dicts for processing
#         applications_dict = [app.dict() for app in request.applications]
        
#         # Extract text from resumes
#         for app in applications_dict:
#             resume_url = app.get('resumeFileUrl')
            
#             if resume_url:
#                 try:
#                     print(f"Extracting text from: {resume_url}")
#                     resume_text = pdf_extractor.extract_from_url(resume_url)
#                     cover_letter = app.get('coverLetter', '')
#                     app['resume_text'] = f"{resume_text} {cover_letter}"
#                     print(f"Extracted {len(resume_text)} characters")
#                 except Exception as e:
#                     print(f"Error extracting resume: {e}")
#                     app['resume_text'] = app.get('coverLetter', '')
#             else:
#                 app['resume_text'] = app.get('coverLetter', '')
        
#         # Rank applications
#         ranked_applications = ranker.rank_applications(
#             applications_dict, 
#             request.job_description
#         )
        
#         print(f"Successfully ranked {len(ranked_applications)} applications")
        
#         # Convert back to Pydantic models
#         output_applications = [
#             ApplicationOutput(**app) for app in ranked_applications
#         ]
        
#         # Get category summary
#         category_summary = ranker.get_category_summary(ranked_applications)
        
#         return RankingResponse(
#             success=True,
#             ranked_applications=output_applications,
#             total_applications=len(output_applications),
#             category_summary=category_summary,
#             message=f"Successfully ranked {len(output_applications)} applications"
#         )
        
#     except Exception as e:
#         print(f"Error in ranking: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Error ranking applications: {str(e)}")


# @app.post("/extract-text")
# async def extract_text(pdf_url: str):
#     """Extract text from a PDF URL"""
#     try:
#         print(f"Extracting text from: {pdf_url}")
#         text = pdf_extractor.extract_from_url(pdf_url)
#         sections = pdf_extractor.extract_key_sections(text)
        
#         return {
#             "success": True,
#             "text": text,
#             "sections": sections,
#             "length": len(text)
#         }
#     except Exception as e:
#         print(f"Error extracting text: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/test")
# async def test_ranking():
#     """Test endpoint with sample data"""
#     if not ranker:
#         raise HTTPException(status_code=503, detail="ML model not loaded")
    
#     test_applications = [
#         {
#             'id': '1',
#             'fullname': 'Alice Johnson',
#             'email': 'alice@example.com',
#             'resume_text': 'Python developer with 5 years in machine learning. Expert in TensorFlow, PyTorch, deep learning.'
#         },
#         {
#             'id': '2',
#             'fullname': 'Bob Smith',
#             'email': 'bob@example.com',
#             'resume_text': 'Frontend developer with React and Angular. Built web applications.'
#         },
#         {
#             'id': '3',
#             'fullname': 'Carol White',
#             'email': 'carol@example.com',
#             'resume_text': 'Senior ML engineer. Computer vision, NLP, deep learning expert. Led ML teams.'
#         }
#     ]
    
#     job_desc = "Looking for Python ML Engineer with deep learning and NLP experience"
#     ranked = ranker.rank_applications(test_applications, job_desc)
    
#     return {
#         "success": True,
#         "message": "Test ranking completed",
#         "ranked_applications": ranked
#     }


# # Run the application
# if __name__ == "__main__":
#     print("\n" + "="*50)
#     print("  Resume Ranking ML Service")
#     print("="*50)
#     print("\n📚 API Documentation: http://localhost:8000/docs")
#     print("🔍 Health Check: http://localhost:8000/health\n")
    
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True  # Auto-reload on code changes
#     )