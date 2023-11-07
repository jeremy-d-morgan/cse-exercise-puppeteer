const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const { url } = require("url");
const assert = require('assert');

// Cheap URL validation
const isValidURL = input => {
  const u = new URL(input)
  return u.protocol && u.host;
};

(async () => {
  // node axe-puppeteer.js <url>
  const url = process.argv[2];
  assert(isValidURL(url), 'Invalid URL');

  let browser;
  let results;
  try {
    // Setup Puppeteer
    browser = await puppeteer.launch({
        headless: "new"
    });

    // Get new page
    const page = await browser.newPage();
    await page.goto(url);

    // Inject and run axe-core testing for WCAG 2.1 AA and below and only return violations
    const handle = await page.evaluateHandle(`
            // Inject axe source code
            ${axeCore.source}
            // Run axe
            axe.run({
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
                },
                disableOtherRules: true,
                resultTypes: ['violations']
            });
    `);

    // Get the results from `axe.run()`.
    results = await handle.jsonValue();

    // Destroy the handle & return axe results.
    await handle.dispose();

    // Make sure the results are "ok"
    if (typeof results.violations != "undefined") {
        
        // Get the violations
        const violations = results.violations;

        // Total issue count
        var issueCount = 0;

        // Issue count by severity
        var minorCount = 0;
        var moderateCount = 0;
        var seriousCount = 0;
        var criticalCount = 0;
        
        // Help text and their issue count
        var HelpTextWithCount = [];
        var HelpTextWithCountLargest = 0;
        
        // Parse the violations
        violations.forEach(v => {
            
            // Count all the issues
            var issues = v.nodes.length;
            issueCount += issues;

            // Record the largest issue count for outpuit formating later
            if (issues > HelpTextWithCountLargest) {
                HelpTextWithCountLargest = issues;
            }

            // Count the severity
            switch(v.impact) {
                case "minor":
                    minorCount += issues;
                    break;
                case "moderate":
                    moderateCount += issues;
                    break;
                case "serious":
                    seriousCount += issues;
                    break;
                case "critical":
                    criticalCount += issues;
                    break;
            }

            // Record the help text and count
            HelpTextWithCount.push({"help": v.help, "count": issues});
            
        });

        // Start CLI output

        console.log("");
    
        if (issueCount > 0) {
            console.log(" Scan Result: FAIL");
        } else {
            console.log(" Scan Result: PASS");
        }

        if (issueCount > 0) {

            console.log("");
            console.log("Total Issues: " + issueCount);
            console.log("");
            console.log("       Minor: " + minorCount);
            console.log("    Moderate: " + moderateCount);
            console.log("     Serious: " + seriousCount);
            console.log("    Critical: " + criticalCount);
            console.log("");

            var padding = "";

            if (HelpTextWithCountLargest >= 10) {
                padding = " ";
            } else if (HelpTextWithCountLargest >= 100) {
                padding = "  ";
            } else if (HelpTextWithCountLargest >= 1000) {
                padding = "   ";
            }
            
            console.log(padding + "# | Description");
            console.log("--------------------------------");

            HelpTextWithCount.forEach(h => {

                console.log(padding + h.count + " | " + h.help);

            });

        }

        console.log("");

    } else {
        console.log('Something went wrong');
    }

  } catch (err) {
    // Ensure we close the puppeteer connection when possible
    if (browser) {
      await browser.close();
    }

    console.error('Error running axe-core:', err.message);
    process.exit(1);
  }

  await browser.close();
})();
