# Beta Branch Workflow Guide

This guide explains how to use the automated workflows for managing your beta branch and merging to main.

## Overview

The project now has automated workflows that handle the beta-to-main merge process, including:
- Removing `-beta` suffixes from custom element names
- Converting CDN imports to local package imports
- Creating release tags
- **Note**: Documentation files (README.md) are left unchanged for manual control

## Workflows Available

### 1. Beta to Main Merge (`beta-merge.yaml`)
**Trigger**: Manual workflow dispatch
**Purpose**: Automatically merge beta branch to main with all necessary transformations

**How to use:**
1. Go to GitHub → Actions → "Beta to Main Merge"
2. Click "Run workflow"
3. Type "merge" in the confirmation field
4. Click "Run workflow"

**What it does:**
- Checks out main branch
- Merges beta branch (no commit)
- Removes all `-beta` suffixes from:
  - Custom element type: `yet-another-media-player-beta` → `yet-another-media-player`
  - Custom element definition: `customElements.define("yet-another-media-player-beta"` → `customElements.define("yet-another-media-player"`
  - All source files (`.js` files only)
- Converts CDN imports to local package imports:
  - `lit-element@3.3.3/lit-element.js?module` → `lit`
  - `js-yaml@4.1.0/+esm` → `js-yaml`
  - `sortablejs@1.15.0/+esm` → `sortablejs`
- Commits all changes with descriptive message
- Pushes to main branch
- Creates a Git tag (does NOT create GitHub Release or HACS notification)

### 2. Beta PR Validation (`beta-pr-merge.yaml`)
**Trigger**: Pull request from beta to main
**Purpose**: Validates beta branch and provides merge guidance

**What it does:**
- Validates that rollup build works
- Checks for expected `-beta` references
- Comments on PR with merge instructions
- Provides links to automated workflow

### 3. Enhanced Rollup Build (`rollup.yaml`)
**Trigger**: Push to main or beta branches
**Purpose**: Builds the project and provides merge guidance for beta

**What it does:**
- Runs rollup build on both branches
- For beta branch: Provides guidance on next steps and workflow links
- For main branch: Standard build and commit
- Auto-commits built files to the respective branch

## Workflow Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Automated Workflow** | ✅ Fully automated<br>✅ Consistent results<br>✅ Creates release tags | ⚠️ Requires manual trigger | Production releases |
| **Manual Merge** | ✅ Full control<br>✅ Can review changes | ❌ Error-prone<br>❌ Time-consuming | Development/testing |

## Manual Process (Fallback)

If you prefer manual control, follow the existing process in `src/Beta Merge Instructions.txt`:

1. `git checkout main`
2. `git merge beta --no-commit`
3. Manually replace `-beta` with empty string
4. Update imports from CDN to local packages
5. `git add . && git commit`
6. `git push origin main`

## Authentication Setup

### SSH Authentication (Recommended)
The workflows use SSH authentication to avoid Personal Access Token scope restrictions:

```bash
# Verify SSH setup
ssh -T git@github.com

# If using HTTPS, switch to SSH
git remote set-url origin git@github.com:jianyu-li/yet-another-media-player.git
```

### Personal Access Token (Alternative)
If using HTTPS, ensure your PAT has the `workflow` scope for pushing workflow files.

## File Transformations

The automated workflow performs these transformations:

### Custom Element Names
```javascript
// Before (beta branch)
type: "yet-another-media-player-beta"
customElements.define("yet-another-media-player-beta", YetAnotherMediaPlayerCard);

// After (main branch)
type: "yet-another-media-player"
customElements.define("yet-another-media-player", YetAnotherMediaPlayerCard);
```

### Import Statements
```javascript
// Before (beta branch)
import { LitElement, html, css, nothing } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm";
import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/+esm";

// After (main branch)
import { LitElement, html, css, nothing } from "lit";
import yaml from "js-yaml";
import Sortable from "sortablejs";
```

### Documentation Files
**Note**: The workflow only modifies `.js` files in the `src/` directory. Documentation files like `README.md` are left unchanged to preserve your manual documentation control.

### HACS Integration
**Important**: The workflow creates Git tags but does NOT create GitHub Releases or trigger HACS notifications. To create a HACS release:
1. Go to GitHub → Releases
2. Create a new release from the tag
3. Add release notes
4. Publish the release

## Troubleshooting

### Workflow Fails
If the automated workflow fails:
1. Check the workflow logs for specific errors
2. Ensure beta branch builds successfully first
3. Verify all dependencies are properly configured
4. Use manual merge as fallback

### Missing -beta References
If no `-beta` references are found:
- This is normal if you've already cleaned up the beta branch
- The workflow will still run successfully
- All other transformations will still occur

### Permission Issues
If you get permission errors:
- Ensure the workflow has write permissions to the repository
- Check that the `GITHUB_TOKEN` secret is properly configured
- Verify you have admin access to the repository
- **For workflow file pushes**: Use SSH authentication or ensure PAT has `workflow` scope

### Push Errors
If you get "refusing to allow a Personal Access Token to create or update workflow" errors:
- Switch to SSH: `git remote set-url origin git@github.com:jianyu-li/yet-another-media-player.git`
- Or update your PAT to include the `workflow` scope

## Best Practices

1. **Always test on beta first**: Ensure your changes work in the beta branch before merging
2. **Use descriptive commit messages**: The automated workflow creates good commit messages, but manual commits should be descriptive
3. **Review the diff**: Even with automation, review the changes before pushing to main
4. **Tag releases**: The automated workflow creates tags, but you can also create them manually for important releases
5. **Use SSH authentication**: Avoid PAT scope issues by using SSH keys for GitHub access
6. **Manual HACS releases**: Create GitHub Releases manually when ready for HACS distribution

## Support

If you encounter issues with the workflows:
1. Check the GitHub Actions logs
2. Review this guide
3. Fall back to manual merge process
4. Create an issue in the repository
