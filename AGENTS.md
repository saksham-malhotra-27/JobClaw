Do not add unrelated features unless explicitly requested.

## General Coding Rules

- Use TypeScript with strict typing.
- Do not use `any` unless there is no reasonable alternative.
- Use descriptive variable and function names.
- Avoid abbreviations such as `res`, `req`, `obj`, `arr`, or `tmp` when a clearer name is possible.
- Prefer small functions with one clear responsibility.
- Keep logic readable instead of writing overly compact code.
- Add comments only when the reason behind the code is not obvious.
- Do not add premature abstractions.
- Do not introduce databases, queues, Docker, authentication, or extra frameworks unless requested.

## Constants and Literal Values

- Avoid repeating meaningful literal strings or numbers across the codebase.
- Store reusable constants in `src/shared/constants.ts`.
- Group constants by business responsibility.
- Use `as const` so values remain readonly and retain their literal TypeScript types.
- Use `UPPER_SNAKE_CASE` for constant property names.
- Do not extract trivial one-time UI text, highly contextual error messages, or values that are clearer inline.
- Do not use unexplained numeric values. Extract meaningful numbers such as default page limits, timeouts, and retry counts.
- Business-specific constants used only inside one module may remain in that module instead of being placed in the shared constants file.
- Prefer grouped constant objects over one flat list of unrelated constants.
- Import constants at the top of the file using static imports.
- Do not use inline or dynamic imports for constants.
- Reference constants directly when the expression remains readable.
- Avoid creating unnecessary local aliases for constants.
- A local alias is acceptable when a deeply nested constant is used repeatedly and clearly improves readability.

Example TypeScript structure:
```
    export const CONSTANTS = {
      JOB_SEARCH: {
        DEFAULT_PAGES_PER_SOURCE: 1,
        MAX_PAGES_PER_SOURCE: 5,
        GOOGLE_SEARCH_URL: "https://www.google.com/search",
      },

      PLAYWRIGHT: {
        DEFAULT_TIMEOUT_MS: 30_000,
        FORBIDDEN_ACTION_LABELS: [
          "Apply",
          "Submit",
          "Sign in",
          "Register",
          "Create account",
          "Upload resume",
          "Upload CV",
        ],
      },

      OLLAMA: {
        DEFAULT_MODEL: "qwen3:8b",
        CHAT_ENDPOINT: "/api/chat",
      },

      ERROR_CODES: {
        INVALID_INPUT: "INVALID_INPUT",
        OLLAMA_FAILURE: "OLLAMA_FAILURE",
        MCP_FAILURE: "MCP_FAILURE",
        CAPTCHA_DETECTED: "CAPTCHA_DETECTED",
      },
    } as const;
```
Preferred usage:
```
    import { CONSTANTS } from "@/shared/constants";

    const isForbiddenAction =
      CONSTANTS.PLAYWRIGHT.FORBIDDEN_ACTION_LABELS.includes(buttonLabel);

    setTimeout(
      callback,
      CONSTANTS.PLAYWRIGHT.DEFAULT_TIMEOUT_MS,
    );
```
Avoid unnecessary reassignment:
```
    const forbiddenActionLabels =
      CONSTANTS.PLAYWRIGHT.FORBIDDEN_ACTION_LABELS;
```
Keep feature-specific constants close to their feature when they are not shared across business modules.

## File Organization

- Organize code by business responsibility.
- Keep job-search-specific logic inside `src/job-search`.
- Keep LLM orchestration inside `src/agent`.
- Keep external tool integrations inside `src/integrations`.
- Keep reusable schemas and types inside `src/shared`.
- Do not place job-search-specific code inside `src/shared`.
- Split a file when it handles more than one clear responsibility.
- Prefer multiple focused files inside a folder over one large file.
- Avoid creating a separate file for trivial one-line helpers.

## Naming
- Use camelCase for variables and functions.
- Use PascalCase for types, interfaces, React components, and classes.
- Use UPPER_SNAKE_CASE only for true constants.
- Name boolean variables with prefixes unless the scope makes the meaning completely obvious:
 - is
 - has
 - can
 - should
- Prefer: 
```
const isCaptchaVisible = true;
const hasMoreResults = false;
const shouldOpenJobPage = true;
const searchResults;
const selectedSource;
const parsedSearchIntent;
```
- Avoid unless scope makes the meaning completely obvious: 
```
const data;
const result;
const item;
const x;
```

## Functions
- A function should perform one main task.
- Prefer early returns over deeply nested conditions.
- Validate inputs at boundaries.
- Return structured results instead of loosely shaped objects.
- Keep side effects explicit.
- Do not mix query generation, browser execution extraction, and filtering in one function.

## Types and Validation
- Define shared request and response shapes using Zod.
- Infer TypeScript types from Zod schemas where practical.
- Validate:
 - API request bodies
 - Ollama structured outputs
 - MCP tool outputs
 - Environment variables
 - Do not trust LLM output without validation.

## React and Next.js
- Use Server Components by default.
- Add "use client" only when browser state or event handlers are required.
- Keep API and browser automation logic on the server.
- Never expose Ollama, MCP, or internal tool configuration to the client.
- Keep page.tsx focused on rendering and user interaction.
- Extract large UI sections into components when needed.
- Do not add global state management for the MVP.

## API Routes
- Validate request bodies using Zod.
- Return consistent JSON responses.
- Use appropriate HTTP status codes.
- Do not expose stack traces or internal implementation details.
- Handle failures explicitly.
- Suggested response shape: 
```
type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
```


## LLM Rules
- Use the LLM for:
 - Parsing natural-language search intent
 - Resolving ambiguous role or location wording
 - Choosing browser actions when needed
- Do not use the LLM for:
 - Date arithmetic
 - URL validation
 - Duplicate detection
 - Salary conversion when deterministic code can handle it
 - Basic filtering that can be expressed with normal code
- Disable reasoning output unless it is specifically needed.
- Require structured JSON output.
- Validate all model responses.

## Playwright MCP Safety
- Search only public pages.
- Read only the requested number of Google result pages.
- Default to one page per source.
- Open only links matching the configured source domain.
- Never click:
 - Apply
 - Submit
 - Sign in
 - Register
 - Create account
 - Upload resume
 - Upload CV
- Never submit forms.
- Never bypass CAPTCHAs.
- Stop and report when a CAPTCHA or authentication wall appears.

## Error Handling
- Use clear custom error messages.
- Do not silently ignore failures.
- Record which source failed and why.
- One failed source should not crash the entire search.
- Distinguish between:
 - Invalid user input
 - Ollama failure
 - MCP failure
 - CAPTCHA
 - Authentication wall
 - No results
 - Parsing failure

## MVP Scope

The current MVP should only support:

- A job-search prompt
- Structured intent parsing
- Configured source domains
- Google site: query generation
- One Google results page per source
- Public job-link extraction
- Basic coverage reporting

Do not implement yet:

- Resume generation
- Automatic applications
- Email outreach
- User accounts
- Persistent database storage
- Background queues
- Multi-agent orchestration
- Complex ranking
- Production deployment architecture