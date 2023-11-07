# cse-exercise-puppeteer

axe-core proof of concept integration with Puppeteer

This will scan a single page for WCAG 2.1 AA violations (and below) and output the results in human readable format similar to axe-dev tools browser plugin.

## Built using
- Node.js v20.9.0
- axe-core 4.8.2
- puppeteer 21.5.0
- typescript 5.2.2

## How to run
- Run `npm install`
- Run `node axe-puppeteer.js https://dequeuniversity.com/demo/mars`

## Example output of PASS
```
cse-exercise-puppeteer % node axe-puppeteer.js https://dequeuniversity.com/demo/mars

 Scan Result: PASS

```

## Example output of FAIL
```
cse-exercise-puppeteer % node axe-puppeteer.js https://dequeuniversity.com/demo/mars

 Scan Result: FAIL

Total Issues: 25

       Minor: 0
    Moderate: 0
     Serious: 18
    Critical: 7

# | Description
--------------------------------
1 | Buttons must have discernible text
7 | Elements must meet minimum color contrast ratio thresholds
1 | Frames must have an accessible name
1 | <html> element must have a lang attribute
4 | Images must have alternate text
1 | Links must be distinguishable without relying on color
8 | Links must have discernible text
2 | Select element must have an accessible name
```