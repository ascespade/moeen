#!/bin/bash
set -e

echo "🚀 Boosting Cursor Aggressiveness & Installing MCPs with Monitoring..."

# 1. تحديث النظام
sudo apt update -y && sudo apt upgrade -y

# 2. تثبيت الأدوات الأساسية
sudo apt install -y curl wget git unzip build-essential tmux htop jq python3-pip glances

# 3. تثبيت glances مع web server
sudo pip3 install glances bottle

# 4. ضبط Cursor ليستهلك أقصى موارد
cat <<'EOF' > ~/run_cursor_aggressive.sh
#!/bin/bash
CURSOR_CMD="cursor"

CPUS=$(nproc)

ulimit -n 65535
ulimit -u 65535
ulimit -m unlimited
ulimit -v unlimited

exec nice -n -20 taskset -c 0-$((CPUS-1)) $CURSOR_CMD "$@"
EOF

chmod +x ~/run_cursor_aggressive.sh
sudo mv ~/run_cursor_aggressive.sh /usr/local/bin/cursor-aggressive

echo "✅ Cursor Aggressive runner installed. Use: cursor-aggressive <args>"

# 5. تثبيت MCPs
MCP_DIR=~/.cursor/mcps
mkdir -p $MCP_DIR

echo "⚡ Installing recommended MCPs..."

npm install -g @playwright/test
npm install -g eslint
npm install -g prettier
npm install -g swagger-cli
npm install -g lighthouse

cat <<EOF > $MCP_DIR/config.json
{
  "mcps": {
    "playwright": "$(which playwright)",
    "eslint": "$(which eslint)",
    "prettier": "$(which prettier)",
    "swagger": "$(which swagger)",
    "lighthouse": "$(which lighthouse)"
  }
}
EOF

echo "✅ MCPs configuration saved at $MCP_DIR/config.json"

# 6. إضافة alias
if ! grep -q "alias cursor" ~/.bashrc; then
  echo "alias cursor='cursor-aggressive'" >> ~/.bashrc
fi

# 7. تشغيل Glances Dashboard (مونيتور)
if ! pgrep -f "glances -w" > /dev/null; then
  nohup glances -w -p 61208 > /dev/null 2>&1 &
  echo "✅ Monitoring Dashboard running at http://<SERVER_IP>:61208"
fi

echo "🎉 Setup Complete! Use cursor-aggressive and open monitoring dashboard in browser."

