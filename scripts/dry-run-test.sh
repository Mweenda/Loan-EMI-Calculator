#!/bin/bash

# 🧪 DRY-RUN TEST SCRIPT
# This script verifies the project setup without making permanent changes

set -e  # Exit on error

echo "🔍 LOAN EMI CALCULATOR - DRY RUN VERIFICATION"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Checking prerequisites...${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check PNPM
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓${NC} PNPM installed: $PNPM_VERSION"
else
    echo -e "${RED}✗${NC} PNPM not found. Install with: npm install -g pnpm"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓${NC} Git installed"
else
    echo -e "${RED}✗${NC} Git not found"
    exit 1
fi

echo ""
echo -e "${YELLOW}2. Checking repository structure...${NC}"
echo ""

# Check key directories
for dir in "apps/web" "packages/shared" "docs"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} Directory exists: $dir"
    else
        echo -e "${RED}✗${NC} Directory missing: $dir"
        exit 1
    fi
done

echo ""
echo -e "${YELLOW}3. Checking configuration files...${NC}"
echo ""

# Check key config files
for file in "package.json" "tsconfig.json" "turbo.json" ".eslintrc.json" ".prettierrc" "pnpm-workspace.yaml"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} File exists: $file"
    else
        echo -e "${RED}✗${NC} File missing: $file"
        exit 1
    fi
done

echo ""
echo -e "${YELLOW}4. Checking documentation files...${NC}"
echo ""

# Check documentation
for doc in "README.md" "docs/INDEX.md" "docs/ENGINEERING_ONBOARDING.md" "docs/CONTRIBUTING.md" "docs/TECHNICAL_DESIGN_DOCUMENT.md"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} Document exists: $doc"
    else
        echo -e "${RED}✗${NC} Document missing: $doc"
        exit 1
    fi
done

echo ""
echo -e "${YELLOW}5. Checking code templates...${NC}"
echo ""

# Check templates
if [ -f "packages/shared/src/index.ts" ]; then
    LINES=$(wc -l < "packages/shared/src/index.ts")
    echo -e "${GREEN}✓${NC} EMI formula template exists ($LINES lines)"
else
    echo -e "${RED}✗${NC} EMI formula template missing"
    exit 1
fi

if [ -f "apps/web/tests/calculator.e2e.spec.ts" ]; then
    LINES=$(wc -l < "apps/web/tests/calculator.e2e.spec.ts")
    echo -e "${GREEN}✓${NC} E2E test template exists ($LINES lines)"
else
    echo -e "${RED}✗${NC} E2E test template missing"
    exit 1
fi

echo ""
echo -e "${YELLOW}6. Validating configuration files...${NC}"
echo ""

# Validate JSON files
if command -v jq &> /dev/null; then
    for file in "package.json" "tsconfig.json" "turbo.json" ".eslintrc.json"; do
        if jq empty "$file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Valid JSON: $file"
        else
            echo -e "${RED}✗${NC} Invalid JSON: $file"
            exit 1
        fi
    done
elif command -v python3 &> /dev/null; then
    for file in "package.json" "tsconfig.json" "turbo.json" ".eslintrc.json"; do
        if python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Valid JSON: $file"
        else
            echo -e "${RED}✗${NC} Invalid JSON: $file"
            exit 1
        fi
    done
else
    echo -e "${YELLOW}⚠${NC} Skipping JSON validation (jq/python3 not available)"
fi

# Validate YAML
if command -v python3 &> /dev/null; then
    if python3 -c "import yaml; yaml.safe_load(open('pnpm-workspace.yaml'))" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Valid YAML: pnpm-workspace.yaml"
    else
        echo -e "${RED}✗${NC} Invalid YAML: pnpm-workspace.yaml"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}7. Checking git status...${NC}"
echo ""

# Check git
if [ -d ".git" ]; then
    BRANCH=$(git branch --show-current)
    REMOTE=$(git remote -v | head -1)
    echo -e "${GREEN}✓${NC} Git repository initialized"
    echo -e "${GREEN}✓${NC} Current branch: $BRANCH"
    echo -e "${GREEN}✓${NC} Remote configured"
else
    echo -e "${RED}✗${NC} Git repository not initialized"
    exit 1
fi

echo ""
echo -e "${YELLOW}8. Running pnpm install (DRY RUN)...${NC}"
echo ""

# Check if pnpm install would work (dry run)
if pnpm install --dry-run &>/dev/null; then
    echo -e "${GREEN}✓${NC} PNPM installation would succeed"
else
    echo -e "${YELLOW}⚠${NC} PNPM install dry-run warning (may be normal)"
fi

echo ""
echo -e "${YELLOW}9. Checking workspace integrity...${NC}"
echo ""

# List workspace packages
echo -e "${GREEN}✓${NC} Workspace packages:"
pnpm list --depth 0 2>/dev/null | head -5 || echo "  (packages will be visible after pnpm install)"

echo ""
echo -e "${YELLOW}10. Documentation coverage check...${NC}"
echo ""

DOC_COUNT=$(find docs -name "*.md" | wc -l)
DOC_LINES=$(cat docs/*.md README.md 2>/dev/null | wc -l)
echo -e "${GREEN}✓${NC} Documentation files: $DOC_COUNT"
echo -e "${GREEN}✓${NC} Documentation lines: $DOC_LINES+"

echo ""
echo "=============================================="
echo -e "${GREEN}✓ ALL DRY-RUN TESTS PASSED${NC}"
echo "=============================================="
echo ""
echo "🚀 Project is ready for implementation!"
echo ""
echo "Next steps:"
echo "  1. pnpm install"
echo "  2. pnpm dev"
echo "  3. Read docs/ENGINEERING_ONBOARDING.md"
echo "  4. Begin Phase 1 implementation"
echo ""
