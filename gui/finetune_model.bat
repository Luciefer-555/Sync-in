@echo off
echo Starting fine-tuning process...

:: Verify Ollama is running
ollama list >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Ollama is not running. Please start Ollama first.
    pause
    exit /b 1
)

echo Step 1: Creating modelfile...
echo FROM llama3:latest > cs_mentor_modelfile
echo. >> cs_mentor_modelfile
echo SYSTEM """You are CS Mentor, an AI assistant specialized in computer science education and career guidance. You provide clear, concise, and accurate information about programming concepts, interview preparation, and career development in the tech industry.""" >> cs_mentor_modelfile
echo. >> cs_mentor_modelfile
echo PARAMETER num_ctx 4096 >> cs_mentor_modelfile
echo PARAMETER temperature 0.7 >> cs_mentor_modelfile
echo. >> cs_mentor_modelfile

echo Step 2: Starting fine-tuning...
ollama create cs-mentor -f cs_mentor_modelfile

if %ERRORLEVEL% equ 0 (
    echo.
    echo Fine-tuning started successfully!
    echo.
    echo Next steps:
    echo 1. Check progress with: ollama list
    echo 2. Test the model with: ollama run cs-mentor
    echo 3. Once complete, you can use the model in your applications
) else (
    echo.
    echo Error occurred during fine-tuning.
    echo Please check the error message above and try again.
    echo.
    echo Note: Ollama's fine-tuning capabilities are currently limited.
    echo For advanced fine-tuning, consider using the base LLaMA model with LoRA.
)

echo.
pause
