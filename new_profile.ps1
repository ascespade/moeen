# Clean PowerShell Profile with Arabic Support
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

function Write-Arabic {
    param([string]$Text, [string]$Color = "White")
    $reversedText = -join ($Text.ToCharArray() | ForEach-Object { $_ })
    Write-Host $reversedText -ForegroundColor $Color
}

function ssh-remote { ssh cursor-dev }
function dev-remote { ssh cursor-dev "cd ~/workspace && tmux new-session -s dev || tmux attach-session -t dev" }
function code-remote { Start-Process "http://100.64.64.33:8080" }
function server-status { ssh cursor-dev "~/workspace/scripts/monitor.sh" }
function test-connection { ssh cursor-dev "echo 'Connection successful!'" }

Write-Arabic "تم تحميل بيئة التطوير البعيد بنجاح!" "Green"
Write-Host "Remote development environment loaded!" -ForegroundColor Cyan
Write-Host "Use 'Write-Arabic' for Arabic text" -ForegroundColor Yellow
