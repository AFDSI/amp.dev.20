# Git Workflow Best Practices for Working with Claude Code Web

A practical guide to maintaining clean git state when collaborating with AI coding assistants.

---

## Table of Contents

1. [Core Lessons](#core-lessons)
2. [Lesson #1: Never Use Stash](#lesson-1-never-use-git-stash---use-branches-instead)
3. [Lesson #2: Verify State](#lesson-2-verify-state-before-significant-changes)
4. [Lesson #3: Create Snapshots](#lesson-3-create-snapshots-to-enable-unwinding)
5. [Complete Workflow](#complete-workflow-with-claude-code-web)
6. [Emergency Recovery](#emergency-recovery-commands)
7. [Git Aliases](#git-aliases-to-add-to-gitconfig)
8. [Golden Rules](#golden-rules)

---

## Core Lessons

### **LESSON #1: Never Use `git stash`**
- Stashes are anonymous and easy to forget
- No clear context about what was stashed or why
- Difficult to review stashed changes later
- Can accumulate into a confusing mess

### **LESSON #2: Verify State Before Changes**
- Can't mentally track complex Claude git commands
- Need to test complex repo changes BEFORE moving to new modifications
- Verification provides confidence and clarity

### **LESSON #3: Create Snapshots for Unwinding**
- Must be able to undo the last transaction
- Return to a previous state that can be understood and validated
- Safety nets prevent irreversible mistakes

---

## LESSON #1: Never Use `git stash` - Use Branches Instead

### Problem with Stash

- Stashes are anonymous and easy to forget
- No clear context about what was stashed or why
- Difficult to review stashed changes later
- Can accumulate into a confusing mess

### Better Alternative: Work-in-Progress (WIP) Branches

```bash
# Instead of: git stash
# Do this:
git checkout -b wip/descriptive-name
git add .
git commit -m "WIP: brief description of what I was doing"
git push -u origin wip/descriptive-name  # Optional: backup to remote

# Later, when you want to return to this work:
git checkout wip/descriptive-name

# You can see exactly what you were doing with:
git log -1
git show HEAD
```

### Benefits of WIP Branches

- ✅ Named and traceable
- ✅ Can push to remote as backup
- ✅ Easy to review with `git log` and `git show`
- ✅ Can delete when done: `git branch -D wip/descriptive-name`

---

## LESSON #2: Verify State Before Significant Changes

### Pre-Flight Checklist Command

Save this as a shell function in your `~/.bashrc` or `~/.zshrc`:

```bash
# Run this BEFORE any significant git operation
git-verify-clean() {
  echo "=== REPOSITORY STATE VERIFICATION ==="
  echo ""
  echo "📍 Current Branch:"
  git branch --show-current
  echo ""
  echo "📊 Working Tree Status:"
  git status --short
  if [ -z "$(git status --short)" ]; then
    echo "  ✅ Clean (no changes)"
  else
    echo "  ⚠️  HAS UNCOMMITTED CHANGES"
  fi
  echo ""
  echo "🌿 Branch Sync Status:"
  git branch -vv | grep -E '\[.*: (ahead|behind)' || echo "  ✅ All branches in sync"
  echo ""
  echo "📦 Stashes:"
  local stash_count=$(git stash list | wc -l)
  if [ "$stash_count" -eq 0 ]; then
    echo "  ✅ No stashes (0)"
  else
    echo "  ⚠️  $stash_count stashes present"
    git stash list
  fi
  echo ""
  echo "💾 Last Commit:"
  git log -1 --oneline
  echo ""
  echo "==================================="
}
```

### Usage

```bash
# Before asking Claude to make changes:
git-verify-clean

# If clean, proceed. If not, clean up first.
```

### Quick One-Liner Alternative

```bash
git status && git branch -vv && echo "Stashes: $(git stash list | wc -l)"
```

---

## LESSON #3: Create Snapshots to Enable Unwinding

### The Safety Net Strategy

#### Before Complex Changes

```bash
# 1. Create a snapshot branch (read-only reference point)
git checkout -b snapshot/before-claude-changes-$(date +%Y%m%d-%H%M)
git checkout -  # Return to previous branch

# 2. Verify you can return to this snapshot
git log snapshot/before-claude-changes-* -1 --oneline

# 3. Now proceed with Claude's changes
```

#### After Complex Changes

```bash
# Test the changes
npm test  # or your test command

# If good: Delete the snapshot
git branch -D snapshot/before-claude-changes-*

# If bad: Restore from snapshot
git reset --hard snapshot/before-claude-changes-*
```

---

## Complete Workflow with Claude Code Web

### BEFORE Asking Claude to Make Changes

```bash
# 1. Verify clean state
git status && git branch -vv
# Expect: "nothing to commit, working tree clean"

# 2. Ensure you're on the right branch
git branch --show-current
# Should show: claude/[session-id] or your working branch

# 3. Create safety snapshot
git branch snapshot/$(date +%Y%m%d-%H%M)

# 4. Note current commit (for manual rollback)
git log -1 --oneline
# Copy this commit hash somewhere
```

### AFTER Claude Makes Changes

```bash
# 5. Review what changed
git status
git diff --stat

# 6. Test the changes
npm test  # or your validation command

# 7a. If GOOD: Commit and clean up
git add .
git commit -m "Descriptive message"
git branch -D snapshot/*  # Delete snapshot

# 7b. If BAD: Rollback to snapshot
git reset --hard snapshot/[timestamp]
# Or: git reset --hard [commit-hash-from-step-4]
```

### REGULAR Maintenance

```bash
# Weekly: Clean up old branches
git branch | grep -E '(wip/|snapshot/)' | xargs git branch -D

# Always: Verify before ending session
git status && echo "Stashes: $(git stash list | wc -l)"
```

---

## Emergency Recovery Commands

Keep these handy for when things go wrong:

```bash
# See what you changed in last N commits
git log -5 --oneline
git show [commit-hash]

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Restore specific file to last commit
git checkout HEAD -- path/to/file

# See all branch snapshots (including deleted)
git reflog

# Recover deleted branch
git checkout -b recovered-branch [commit-hash-from-reflog]

# Nuclear option: reset to exact remote state
git fetch origin
git reset --hard origin/main  # or your branch
```

---

## Git Aliases to Add to `~/.gitconfig`

Add these to your `~/.gitconfig` file for quick access:

```ini
[alias]
    # Verify clean state
    verify = "!echo '=== Status ===' && git status && echo '\\n=== Branches ===' && git branch -vv && echo '\\n=== Stashes ===' && git stash list | wc -l"

    # Create snapshot
    snap = "!git branch snapshot/$(date +%Y%m%d-%H%M%S)"

    # List snapshots
    snaps = "!git branch | grep snapshot/"

    # Clean old snapshots
    snap-clean = "!git branch | grep snapshot/ | xargs git branch -D"

    # Undo last commit (keep changes)
    undo = reset --soft HEAD~1

    # Quick status
    s = status --short

    # Better log
    l = log --oneline --graph --decorate -10
```

### Usage After Adding Aliases

```bash
git verify      # Check state
git snap        # Create snapshot
git snaps       # List snapshots
git snap-clean  # Delete all snapshots
git undo        # Undo last commit
git s           # Quick status
git l           # Pretty log
```

---

## Golden Rules

1. **Never stash** - use `wip/` branches instead
2. **Always verify** before asking Claude to modify repo
3. **Always snapshot** before complex changes
4. **Always test** before committing
5. **Always cleanup** after successful changes
6. **Keep main clean** - only merge tested, working code

---

## Quick Reference Card

### Starting Work with Claude

```bash
git-verify-clean          # Check state
git snap                  # Create snapshot
# Ask Claude to make changes
```

### After Claude's Changes

```bash
git status                # See what changed
npm test                  # Test changes
git add . && git commit   # If good
git reset --hard snapshot/* # If bad
```

### Cleanup

```bash
git snap-clean            # Remove snapshots
git branch -D wip/*       # Remove WIP branches
```

---

## About This Guide

**Created:** 2025-11-19
**Purpose:** Best practices for maintaining clean git state when working with Claude Code Web
**Lessons Learned:** Through real-world experience with repository sync issues and stash confusion

**Key Insight:** The complexity of AI-generated git operations requires human verification checkpoints and safety nets to prevent confusion and enable confident rollback.

---

## Additional Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [Git Branching Strategy](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [Understanding Git Reflog](https://git-scm.com/docs/git-reflog)

---

**Last Updated:** 2025-11-19
