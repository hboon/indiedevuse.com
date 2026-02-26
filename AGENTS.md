# indiedevuse.com - Development Guide

## Conventions

- Use TypeScript for all files
- If a log statement start with "xxx", do not remove it
- If a comment starts with hhh, do not remove it, and do not treat it as a TODO for you. Keep my test code
- If you are adding a TODO comment for me, instead of staring with TODO, start with hhh3 instead. IF it is a TODO comment that is already in the code, keep it as-is
- Avoid line breaks in code within the function unless it's a clear delimiter for code that does different things
- Instead of writing a comment, write code with clear function names and variable names unless it can't be easily inferred or might be ambiguous from reading the code
- Spell abbreviations with all uppercase letters unless it's the only word or first word in an identifier, and not a type name. In that case spell it with all lowercase, for example uppercase `URL` in `thatURL` and only lowercase it when it's the only word or start of word, eg `url` and `urlForProfile`, `id` and `thatID`
- Use all uppercase for abbreviations (e.g. ID, URL, API) when they appear mid- or end-position in camelCase or PascalCase identifiers:
    - Examples use: thatID, userURL, toJSON, parseHTMLResponse
- Use all lowercase for abbreviations only when they are the first or only word in a camelCase identifier and not a type name:
    - Examples not to do: id, url, idForUser, urlForProfile
- Always have curly braces for if/else/for/while even if the body is a one-liner. Including for early returns
- Use `env` and not `process.env`
    - Frontend: `import { env } from "@/env"` and just use `env.<WHATEVER>`
    - Backend: Add to `backend/src/env.ts`, import the file, and use `env.<WHATEVER>`
- Code should be written without spurious comments or extra blank lines. Keep it compact, readable, and clean

## Production logging

- This is production code, so we do not log spuriously.
- In the backend, we log unexpected errors, especially if it helps us to fix things with `logger.error` (we use `pino` so metadata is the first arg and string is the second arg eg. `logger.info({ stuff}, "string")`). We don't usually log successes unless they are major or a summary
- In the frontend, we always assign in each file `const logger = LOGGER`  and then use `logger` for consistency of the `logger` variable name with the frontend but not that it's `console` underneath (so string is the first arg, metadata is the second arg, eg. `logger.info("string", { stuff})`).

## Comments

- Write few or no comments. Instead, variable and function names should be intention-revealing
- Do not write function comments that explain the params and return type
- It is important to give variables and functions names that are self-explanatory and intention-revealing.

## When writing JavaScript functions

Use function declarations for top-level functions:

```
function fetchStats() {
// implementation
}
```

rather than arrow functions:

```
const fetchStats = () => {
// implementation
};
```

## Refactoring

— for extraction of code to functions to remove duplicate code, these are my rules of thumb:
	- Avoiding bugs is the main reason to refactor. Refactor only if leaving the code duplicated is likely to lead to bugs—for example, if I might forget to update both places in the future and the compiler or linter cannot warn me about the inconsistency.
	- Don’t refactor just for the sake of DRY. If the duplication is harmless and unlikely to drift in dangerous ways (e.g., the compiler would catch changes), I’m okay with leaving it duplicated.
	- Don’t make future changes harder. If refactoring would require adding a lot of parameters or conditional logic (if/switch) to handle slight differences, that may make the code harder to change or understand later. In such cases, I prefer to keep the code separate even if it looks mostly similar now.

## Vue

### Handlers

Handlers in vue with `@click` must be function calls (i.e. with parenthesis like `@click="isOK ? foo() : bar()"`) unless it's just the one function, then we can skip the parenthesis like `@click="isOK"`.

### Vue Component References

When accessing DOM methods on Vue component refs, use `$el`:

- Correct: `componentRef.value?.$el?.scrollIntoView()` (and a `//@ts-ignore` comment in the line before it)
- Incorrect: `componentRef.value?.scrollIntoView()`

## Structure and style

- Write the code so that most functions are pure — they should not have side effects, and instead take inputs and return outputs. Leave side effects (like modifying global or shared state, network requests, or file I/O) to a small number of clearly separated functions. Structure the code to make the flow of data and state explicit and easy to reason about.
- Prefer `const` over `let` unless you absolutely need to reassign the variable. eg.

    Prefer 

    ```
    const filtered = someValue ? anotherValue : someValue
    ```

    over:

    ```
    let filtered = someValue
    if (shouldFilter) {
      filtered = anotherValue
    }
    ```

## Tools

- My development servers live reload changes, so don't try/ask to restart them
- Use pnpm instead of npm
- When installing shadcn-vue components, use `pnpm dlx shadcn-vue@radix add <component>`
- Use git instead of jetbrains to look for dirty files in repos
- Use the jetbrains MCP to look for errors to fix. Only fix warnings in the repo dirty state. Not committed code
- Use `bun` to run scripts instead of `node` or `npm` or `pnpm`

## Required Actions After Edits

- Use `pnpm run type-check` for/in both frontend and backend for type checking as a way to spot errors after a change
- Use `pnpm run lint` in frontend, but only look for `vue/no-undef-components` errors, e.g: "The '<Badge>' component has been used, but not defined  vue/no-undef-components" as a way to missing imports
- Always run prettier after making edits to files (use: `pnpm prettier --write <file_path>`)
- Remove obvious, explanatory comments and function comments that were added as part of the edit

## Structured logging

If an `error` object is available, include it as well as the stack like this (along with other relevant information):

```
{
error,
stack: error instanceof Error ? error.stack : undefined
}
```

## Best Practices for Claude Code

### Initial Exploration

- Start with reconnaissance: Check git status, recent commits, and scan for TODO markers (especially `hhh3` comments, but remember that `hhh3` is for the author unless instructed otherwise)
- Use `Grep` to find all instances of variables/functions before renaming them
- Check for TypeScript errors early and frequently with `pnpm run type-check`
- Check for missing import errors early and frequently with `pnpm run lint` in frontend, but only look for `vue/no-undef-components` errors, e.g: "The '<Badge>' component has been used, but not defined  vue/no-undef-components"
- When changing environment variables, immediately search for all usages across the codebase

### Tool Usage

- Use `Task` tool for complex searches across multiple files instead of multiple Grep calls
- Use `MultiEdit` when making multiple changes to the same file
- Batch operations: Use parallel tool calls when gathering information from multiple files
- Run prettier after every file edit automatically
- Whenever I ask you to notify me about things, or let me know about progress, always use this script like this `terminal-notifier -title "Claude Code" -message "message goes here"` with the `Bash` tool
- When I say to use "browser tools" or "browser-tools" or "browser tools MCP" or "browser-tools MCP", I mean "browser-tools" MCP and not "Playwright (MCP)"

### Code Changes

- When adding new fields to types/interfaces, immediately update all related API responses and type definitions
- When modifying payment/subscription logic, check both frontend and backend for consistency unless instructed to otherwise
- Consider using discriminated unions for complex state (e.g., subscription status)

### Version control and git

- Only commit when instructed to, never commit unless instructed to
- When instructed to commit, commit as my default account without Co-Authored-By (appending "with Claude Code" to the commit message):
- Commits should be atomic, just a single functional unit of change where reasonable
- Commit messages should be a single line with no line breaks. With 1 or 2 sentences. Avoid point forms or paragraphs. The commit message should usually describe the why of the change rather than the how/what as the latter can be inferred from the diff

> <commit message here>
- Never change these 2 values, be it with git commands or edit config files directly:

```
git config user.name
git config user.email
```

### Validation

- Run type checking after each significant change
- Verify environment variables are consistently named everywhere
- Check for related test files that might need updates
- Look for all usages of renamed variables immediately

### Communication

- Ask clarifying questions about business logic early (e.g., "Should free subscribers see feature X?")
- Confirm understanding of who sees what options in the UI
- Pay attention to existing patterns in the codebase before implementing new features

## Project-Specifics

- This is a Vue.js SPA with pre-rendering (using @prerenderer/rollup-plugin), not SSR. Meta tags are set in the router beforeEach hook and baked into pre-rendered HTML at build time
