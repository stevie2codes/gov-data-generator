#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Government Data Generator..."
echo "📍 Directory: $(pwd)"
echo "📦 Installing dependencies if needed..."
npm install
echo "🔥 Starting development server..."
npm run dev
