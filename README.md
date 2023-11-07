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