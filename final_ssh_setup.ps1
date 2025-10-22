Write-Host "🔑 Final SSH Setup with Keys" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Display the public key
Write-Host "`n📋 Your Public Key:" -ForegroundColor Yellow
$publicKey = Get-Content "my_public_key.txt"
Write-Host $publicKey -ForegroundColor Cyan

Write-Host "`n📋 Manual Setup Instructions:" -ForegroundColor Yellow
Write-Host "1. Connect to server: ssh ubuntu@100.64.64.33" -ForegroundColor White
Write-Host "2. Password: root" -ForegroundColor White
Write-Host "3. Run these commands on the server:" -ForegroundColor White
Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
Write-Host "   cat ~/my_public_key.txt >> ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host "   chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host "   rm ~/my_public_key.txt" -ForegroundColor Gray
Write-Host "`n4. Setup Tailscale:" -ForegroundColor White
Write-Host "   sudo tailscale down" -ForegroundColor Gray
Write-Host "   sudo tailscale up --accept-routes --accept-dns=false" -ForegroundColor Gray
Write-Host "   sudo systemctl enable tailscaled" -ForegroundColor Gray
Write-Host "   sudo systemctl start tailscaled" -ForegroundColor Gray
Write-Host "`n5. Test: exit then ssh ubuntu@100.64.64.33" -ForegroundColor White

Write-Host "`n🚀 Alternative: Try direct key usage:" -ForegroundColor Yellow
Write-Host "ssh -i ~/.ssh/id_rsa ubuntu@100.64.64.33" -ForegroundColor Cyan

Write-Host "`n✅ After setup, you'll have:" -ForegroundColor Green
Write-Host "   - SSH without password" -ForegroundColor White
Write-Host "   - Tailscale running in background" -ForegroundColor White
Write-Host "   - No need to enter password when closing Cursor" -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
