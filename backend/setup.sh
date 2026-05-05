#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Setting up Superannuation AI Advisor"
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js and try again."
    exit 1
fi

echo "✅ Python 3 and Node.js are installed"

# Create virtual environment if missing
echo "📦 Ensuring virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt --upgrade

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
pushd .. > /dev/null
npm install
popd > /dev/null

# Create models directory
echo "📁 Creating models directory..."
mkdir -p models

# Train ML models
echo "🤖 Training ML models..."
python train.py

# Check if models were created successfully
if [ ! -f "models/kmeans_model.pkl" ]; then
    echo "❌ Model training failed. Please check the error messages above."
    exit 1
fi

echo "✅ ML models trained successfully"

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "HF_TOKEN=your_huggingface_token_here" > .env
    echo "⚠️  Please edit .env file and add your Hugging Face token"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Activate the venv: source .venv/bin/activate"
echo "2. Start the ML backend: python api.py"
echo "3. Start the frontend: npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:8080"
echo "- Backend API: http://localhost:8000"
echo ""
echo "For more information, see README.md"
