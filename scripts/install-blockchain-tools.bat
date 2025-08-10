@echo off
REM Automated Blockchain Tools Installer for Windows
REM Installs missing blockchain development dependencies
REM Supports: Rust, Solana CLI, Anchor CLI

setlocal enabledelayedexpansion

REM Configuration
set RUST_MIN_VERSION=1.70.0
set SOLANA_VERSION=1.18.0
set ANCHOR_VERSION=0.29.0

REM Colors (limited support in Windows)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

REM Logging functions
:log_info
echo %BLUE%[INFO]%NC% %~1
goto :eof

:log_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:log_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:log_error
echo %RED%[ERROR]%NC% %~1
goto :eof

REM Check if command exists
:command_exists
where %1 >nul 2>&1
goto :eof

REM Install Rust using rustup
:install_rust
call :log_info "Installing Rust using rustup..."

REM Check if rustc exists
call :command_exists rustc
if %errorlevel% equ 0 (
    call :log_success "Rust is already installed"
    goto :eof
)

call :log_info "Downloading rustup installer..."
powershell -Command "Invoke-WebRequest -Uri 'https://win.rustup.rs/x86_64' -OutFile 'rustup-init.exe'"

if not exist rustup-init.exe (
    call :log_error "Failed to download rustup installer"
    exit /b 1
)

call :log_info "Running rustup installer..."
rustup-init.exe -y --default-toolchain stable

REM Clean up
del rustup-init.exe

REM Add to PATH (requires restart)
call :log_warning "Please restart your command prompt to update PATH"

call :log_success "Rust installation completed"
goto :eof

REM Install Solana CLI
:install_solana
call :log_info "Installing Solana CLI v%SOLANA_VERSION%..."

call :command_exists solana
if %errorlevel% equ 0 (
    call :log_success "Solana CLI is already installed"
    goto :eof
)

call :log_info "Downloading Solana CLI installer..."
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/solana-labs/solana/releases/download/v%SOLANA_VERSION%/solana-install-init-x86_64-pc-windows-msvc.exe' -OutFile 'solana-install-init.exe'"

if not exist solana-install-init.exe (
    call :log_error "Failed to download Solana CLI installer"
    exit /b 1
)

call :log_info "Running Solana CLI installer..."
solana-install-init.exe v%SOLANA_VERSION%

REM Clean up
del solana-install-init.exe

call :log_success "Solana CLI installation completed"
goto :eof

REM Install Anchor CLI
:install_anchor
call :log_info "Installing Anchor CLI v%ANCHOR_VERSION%..."

call :command_exists cargo
if %errorlevel% neq 0 (
    call :log_error "Cargo not found. Please install Rust first."
    exit /b 1
)

call :command_exists anchor
if %errorlevel% equ 0 (
    call :log_success "Anchor CLI is already installed"
    goto :eof
)

call :log_info "Installing Anchor Version Manager (AVM)..."
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

call :log_info "Installing Anchor CLI v%ANCHOR_VERSION%..."
avm install %ANCHOR_VERSION%
avm use %ANCHOR_VERSION%

call :log_success "Anchor CLI installation completed"
goto :eof

REM Install Node.js dependencies
:install_node_deps
call :log_info "Verifying Node.js dependencies..."

call :command_exists node
if %errorlevel% neq 0 (
    call :log_error "Node.js not found. Please install Node.js 20+ first."
    exit /b 1
)

call :log_success "Node.js found"

if exist package.json (
    if exist pnpm-workspace.yaml (
        call :command_exists pnpm
        if %errorlevel% equ 0 (
            call :log_info "Installing project dependencies with pnpm..."
            pnpm install
            call :log_success "Project dependencies installed"
        ) else (
            call :log_warning "pnpm not found. Please install pnpm for optimal dependency management"
        )
    )
)

goto :eof

REM Show usage information
:show_usage
echo Usage: %0 [OPTIONS]
echo.
echo Options:
echo   --tool=^<tool^>     Install specific tool (rust^|solana^|anchor^|node)
echo   --all             Install all tools
echo   --help            Show this help message
echo.
echo Examples:
echo   %0 --tool=rust    Install only Rust
echo   %0 --all          Install all blockchain tools
goto :eof

REM Parse command line arguments
set INSTALL_ALL=false
set SPECIFIC_TOOL=

:parse_args
if "%~1"=="" goto :end_parse
if "%~1"=="--all" (
    set INSTALL_ALL=true
    shift
    goto :parse_args
)
if "%~1"=="--help" (
    call :show_usage
    exit /b 0
)
if "%~1:~0,7%"=="--tool=" (
    set SPECIFIC_TOOL=%~1:~7%
    shift
    goto :parse_args
)
call :log_error "Unknown option: %~1"
call :show_usage
exit /b 1

:end_parse

REM Main execution
call :log_info "Blockchain Tools Installer for Windows"
echo.

if "%INSTALL_ALL%"=="true" (
    call :log_info "Installing all blockchain development tools..."
    
    call :install_rust
    if %errorlevel% neq 0 exit /b 1
    
    call :install_solana
    if %errorlevel% neq 0 exit /b 1
    
    call :install_anchor
    if %errorlevel% neq 0 exit /b 1
    
    call :install_node_deps
    if %errorlevel% neq 0 exit /b 1
    
) else if not "%SPECIFIC_TOOL%"=="" (
    call :log_info "Installing %SPECIFIC_TOOL%..."
    
    if "%SPECIFIC_TOOL%"=="rust" call :install_rust
    if "%SPECIFIC_TOOL%"=="solana" call :install_solana
    if "%SPECIFIC_TOOL%"=="anchor" call :install_anchor
    if "%SPECIFIC_TOOL%"=="node" call :install_node_deps
    
    if %errorlevel% neq 0 exit /b 1
    
) else (
    call :log_error "No installation target specified. Use --all or --tool=<tool>"
    call :show_usage
    exit /b 1
)

echo.
call :log_success "Installation completed successfully!"
call :log_info "Please restart your command prompt to update your PATH"

endlocal