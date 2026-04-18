# Go to the parent folder that contains all three project folders

cd ~/claude-buddy

# Initialize git

git init

# Add remote

git remote add origin https://github.com/ripken808/claude-buddy.git

# Create a .gitignore

cat > .gitignore << 'EOF'
node_modules/
dist/
.DS_Store
\*.log
.env
EOF

# Stage everything

git add .

# First commit

git commit -m "feat: initial Claude Buddy v0.1 - Phase 1 complete

- React + Vite browser prototype
- 15 emotional states driven by token usage
- Claude Code pixel art sprite with symbol eyes
- Real usage connected via Chrome extension + Express proxy
- Reads five_hour.utilization and seven_day.utilization from Claude.ai API
- Dev panel with state forcing and token controls
- Black + orange terminal aesthetic"

# Push

git branch -M main
git push -u origin main
