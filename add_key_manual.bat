@echo off
echo Copying public key to server...
scp my_public_key.txt ubuntu@100.64.64.33:~/

echo.
echo Now connect to server and run these commands:
echo.
echo ssh ubuntu@100.64.64.33
echo Password: root
echo.
echo Then run:
echo mkdir -p ~/.ssh
echo chmod 700 ~/.ssh
echo cat ~/my_public_key.txt ^>^> ~/.ssh/authorized_keys
echo chmod 600 ~/.ssh/authorized_keys
echo rm ~/my_public_key.txt
echo.
echo After that, test with:
echo ssh ubuntu@100.64.64.33
echo.
pause
