#!/bin/bash
# AI Governance Demo Setup Script

set -e

echo "=================================================="
echo "    AI Governance Demo Environment Setup          "
echo "=================================================="

# Check for ollama
if ! command -v ollama &> /dev/null; then
    echo "[!] Ollama is not installed. Please install it using:"
    echo "    curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

# Pull the small LLaMA model
echo "[*] Pulling llama3.2:1b model from Ollama..."
ollama pull llama3.2:1b

# Setup Virtual Environment
if [ ! -d "venv" ]; then
    echo "[*] Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "[*] Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install ollama "agent-governance-toolkit[full]" pyyaml

echo ""
echo "[+] Setup Complete!"
echo "Run the demo using:"
echo "    source venv/bin/activate"
echo "    python app.py"
echo "=================================================="
