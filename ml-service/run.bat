

@echo off
echo ================================
echo   Resume Ranking ML Service
echo ================================
echo.

if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo Dependencies installed
    echo.
)

if not exist "lightgbm_ranking.txt" (
    echo Warning: lightgbm_ranking.txt not found!
    echo Please copy your model file to this directory.
    echo.
)

if not exist "ranking.pkl" (
    echo Warning: ranking.pkl not found!
    echo Please copy your vectorizer file to this directory.
    echo.
)

echo Starting ML service...
echo.
python main.py
