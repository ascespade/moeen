#!/bin/bash

# SSH Connection to cursor-dev
# اتصال SSH بـ cursor-dev

echo "🔗 الاتصال بـ cursor-dev..."

# SSH connection command
ssh cursor-dev

# Alternative if the above doesn't work:
# ssh ubuntu@cursor-dev
# or
# ssh -i ~/.ssh/cursor-dev ubuntu@cursor-dev

echo "✅ تم الاتصال بـ cursor-dev"
