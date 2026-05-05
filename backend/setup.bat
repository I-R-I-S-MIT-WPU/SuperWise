@echo off
setlocal

REM Ensure script runs from its own directory (backend)
cd /d %~dp0

echo 🚀 Setting up Superannuation AI Advisor
echo ======================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is required but not installed.
    echo Please install Python and try again.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed.
    echo Please install Node.js and try again.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Create virtual environment if missing
echo 📦 Ensuring virtual environment...
if not exist .venv (
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate

REM Install Python dependencies
echo 📦 Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt --upgrade

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
pushd ..
npm install
popd

REM Create models directory
echo 📁 Creating models directory...
if not exist models mkdir models

REM Train ML models
echo 🤖 Training ML models...
python train.py

REM Check if models were created successfully
if not exist models\kmeans_model.pkl (
    echo ❌ Model training failed. Please check the error messages above.
    pause
    exit /b 1
)

echo ✅ ML models trained successfully

REM Set up environment variables
echo 🔧 Setting up environment variables...
if not exist .env (
    echo HF_TOKEN=your_huggingface_token_here > .env
    echo ⚠️  Please edit .env file and add your Hugging Face token
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Activate the venv: .venv\Scripts\activate
echo 2. Start the ML backend: python api.py
echo 3. Start the frontend: npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:8080
echo - Backend API: http://localhost:8000
echo.
echo For more information, see README.md
pause
