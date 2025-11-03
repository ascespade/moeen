#!/bin/bash
# Test Custom Authentication System
echo "🧪 Testing Custom Authentication System..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please add your Supabase credentials"
fi

# Check JWT_SECRET
if grep -q "JWT_SECRET=" .env.local && ! grep -q "JWT_SECRET=$" .env.local; then
    echo "✅ JWT_SECRET is configured in .env.local"
else
    echo "⚠️  JWT_SECRET not set in .env.local"
    echo "   Generate one using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
fi

# Check Supabase credentials
if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local && ! grep -q "NEXT_PUBLIC_SUPABASE_URL=$" .env.local; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL is configured"
else
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
fi

if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local && ! grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=$" .env.local; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured"
else
    echo "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY not set in .env.local"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Run SQL script in Supabase SQL Editor: supabase/setup_custom_auth.sql"
echo "2. Start dev server: npm run dev"
echo "3. Test login at http://localhost:3001/login"
echo ""
echo "✅ Setup check complete!"
