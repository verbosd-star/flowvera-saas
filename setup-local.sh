#!/bin/bash

# Flowvera Local Setup Script
# This script sets up your local development environment

echo "🚀 Setting up Flowvera local environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup Frontend .env
echo "🔧 Setting up Frontend environment..."
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env from frontend/.env.example"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

# Setup Backend .env
echo "🔧 Setting up Backend environment..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from backend/.env.example"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

echo ""
echo "✨ Local setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review and customize backend/.env if needed"
echo "   2. Review and customize frontend/.env if needed"
echo "   3. Run 'npm run dev' to start the development servers"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for general documentation"
echo "   - ONBOARDING.md for user onboarding guide"
echo "   - CONTRIBUTING.md for contribution guidelines"
echo ""
