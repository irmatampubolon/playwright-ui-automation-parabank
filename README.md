# Playwright UI Automation — Parabank

> End-to-end UI test automation for **Parabank** — a realistic banking demo application — built with **Playwright** and **TypeScript** using the Page Object Model pattern.

![Playwright](https://img.shields.io/badge/Playwright-2D9050?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

**Live app:** https://parabank.parasoft.com

---

## Coverage

| Module           | Scenarios                                                    |
|------------------|--------------------------------------------------------------|
| Login / Auth     | Valid login, invalid credentials, empty fields, logout       |
| Accounts         | Overview load, balance display, account details              |
| Transfer Funds   | Successful transfer, same account validation, missing fields |
| Bill Pay         | Valid payment submission, missing fields validation          |

---

## Project Structure

```
playwright-ui-automation-parabank/
├── tests/
│   ├── login/            # Login & auth test cases
│   ├── accounts/         # Account overview & details
│   └── transfer/         # Fund transfer & bill pay
├── pages/
│   ├── LoginPage.ts      # POM — login page
│   ├── OverviewPage.ts   # POM — accounts overview
│   └── TransferPage.ts   # POM — transfer funds page
├── utils/
│   └── helpers.ts        # Shared utilities
├── .github/workflows/
│   └── playwright.yml    # CI/CD pipeline
├── playwright.config.ts
└── package.json
```

---

## Getting Started

### Install

```bash
git clone https://github.com/irmatampubolon/playwright-ui-automation-parabank.git
cd playwright-ui-automation-parabank
npm install
npx playwright install
```

### Run Tests

```bash
# Run all tests
npx playwright test

# Run specific module
npx playwright test tests/login
npx playwright test tests/accounts
npx playwright test tests/transfer

# Run headed (see the browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# View HTML report
npx playwright show-report
```

---

## Test Credentials

This framework uses Parabank's built-in demo account:

| Field    | Value  |
|----------|--------|
| Username | `john` |
| Password | `demo` |

These are the official demo credentials provided by Parabank at https://parabank.parasoft.com.

---

## Key Patterns

- **Page Object Model (POM)** — locators and actions are encapsulated per page
- **Fixtures** — shared login state reused across test files
- **Soft assertions** — collect multiple failures per test
- **Network interception** — used for simulating error states
- **CI/CD** — GitHub Actions runs tests on every push

---

## Author

**Irma Tampubolon**
Senior QA Engineer | Playwright & TypeScript

- GitHub: [github.com/irmatampubolon](https://github.com/irmatampubolon)
- LinkedIn: [linkedin.com/in/irma-tampubolon](https://linkedin.com/in/irma-tampubolon)
