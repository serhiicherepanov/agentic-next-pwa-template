# Version Control And Git

## Branching

Every PR-bound task should happen on a dedicated branch from the updated default branch.

Default procedure:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/<short-slug>
```

Use `fix/<short-slug>` for bug fixes and `chore/<short-slug>` for maintenance.

If the repository uses `master` instead of `main`, adapt the default branch in this document and `.cursor/rules/git-branch-before-task.mdc`.

## Non-Interactive Git

- Never use interactive flags such as `git add -i` or `git rebase -i`.
- Never launch an editor from Git or GitHub CLI commands.
- Use explicit commit messages.
- Use `git pull --ff-only` or an explicit rebase strategy, never plain `git pull`.
- Do not force-push unless the user explicitly requests it and the branch is not protected.

## End Of Task

1. Run the relevant verification commands.
2. Commit on the task branch.
3. Push the branch.
4. Open or update the PR.
5. Report the PR URL.

Do not push directly to the default branch.
