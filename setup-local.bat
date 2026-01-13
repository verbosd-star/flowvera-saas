@echo off
REM Flowvera Local Setup Script for Windows
REM This script sets up your local development environment

echo.
echo 🚀 Setting up Flowvera local environment...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Setup Frontend .env
echo 🔧 Setting up Frontend environment...
if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env >nul
    echo ✅ Created frontend\.env from frontend\.env.example
) else (
    echo ⚠️  frontend\.env already exists, skipping...
)

REM Setup Backend .env
echo 🔧 Setting up Backend environment...
if not exist "backend\.env" (
    copy backend\.env.example backend\.env >nul
    echo ✅ Created backend\.env from backend\.env.example
) else (
    echo ⚠️  backend\.env already exists, skipping...
)

echo.
echo ✨ Local setup complete!
echo.
echo 📝 Next steps:
echo    1. Review and customize backend\.env if needed
echo    2. Review and customize frontend\.env if needed
echo    3. Run 'npm run dev' to start the development servers
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo 📚 For more information, see:
echo    - README.md for general documentation
echo    - ONBOARDING.md for user onboarding guide
echo    - CONTRIBUTING.md for contribution guidelines
echo.
pause
