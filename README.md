# Excel Online Test Automation

A Playwright-based test automation framework for Microsoft Excel Online, demonstrating how to handle canvas-rendered spreadsheets and formula calculations.

## 🎯 Overview

This project automates testing of Excel Online functionality, specifically:

- ✅ Navigating to specific cells using the name box
- ✅ Verifying formula calculations (TODAY() function)
- ✅ Extracting calculated values from canvas-rendered cells
- ✅ Handling Excel Online's asynchronous calculation behavior

## 🔥 Key Challenges Solved

### Canvas Rendering Issue

Excel Online renders spreadsheet content on HTML5 Canvas, making traditional DOM-based text extraction impossible. This project implements robust workarounds for accessing cell values.

### Asynchronous Formula Calculations

Excel Online's `TODAY()` formula requires time to calculate and may return _"Retrieving data. Wait a few seconds and try to cut or copy again."_ This is handled with intelligent retry logic.

### Clipboard Timing Issues

The solution implements a retry mechanism that:

- 🔍 Detects Excel's "Retrieving data" message
- ⏱️ Waits the recommended time before retrying
- ✅ Validates clipboard content with regex patterns
- 🎉 Succeeds typically on attempt 2-3

## 🚀 Quick Start

### Installation

```bash
npm install
npx playwright install
```

### Configuration

Create `playwright.env.json`:

```json
{
  "username": "your-email@example.com",
  "password": "your-password"
}
```

### Running Tests

```bash
npm test
```

## ⚠️ Known Limitations

| Issue                | Description                                                        | Impact                               |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| **Canvas Rendering** | Excel Online's canvas-based UI prevents direct DOM text extraction | Requires clipboard-based workarounds |
| **Timing Dependent** | Formula calculations require wait times and retry logic            | Tests may be slower/flakier          |
