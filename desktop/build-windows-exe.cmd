@echo off
setlocal
cd /d "%~dp0.."
echo Builds PICO-Creator.exe on Windows. Python is needed only for this build.
echo Genera PICO-Creator.exe en Windows. Python solo es necesario para compilar.
py -3 -m venv .build-venv
if errorlevel 1 goto fail
.build-venv\Scripts\python -m pip install "pyinstaller>=6,<7"
if errorlevel 1 goto fail
.build-venv\Scripts\python -m PyInstaller --noconfirm --clean --onefile --windowed --name PICO-Creator --distpath desktop-output --workpath .desktop-build --specpath .desktop-build --add-data "PICO-Creator.html;." desktop\launcher.py
if errorlevel 1 goto fail
echo Ready: desktop-output\PICO-Creator.exe
echo Listo: desktop-output\PICO-Creator.exe
pause
exit /b 0
:fail
echo Build failed / Error al compilar.
pause
exit /b 1
