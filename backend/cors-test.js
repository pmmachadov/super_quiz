// CORS Test Script - Save as cors-test.js and run with Node.js
// Run: node cors-test.js

const fetch = require("node-fetch");

async function testCORS() {
  console.log("Testing CORS configuration for Super Quiz API...\n");

  try {
    const response = await fetch(
      "https://backend-supersquiz.onrender.com/api/quizzes",
      {
        method: "GET",
        headers: {
          Origin: "https://mysuperquiz.netlify.app",
          Accept: "application/json",
        },
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:");

    // Print all response headers related to CORS
    const corsHeaders = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
      "access-control-allow-credentials",
      "access-control-max-age",
    ];

    corsHeaders.forEach(header => {
      const value = response.headers.get(header);
      console.log(`  ${header}: ${value || "not present"}`);
    });

    if (response.ok) {
      const data = await response.json();
      console.log("\nSuccessfully retrieved data!");
      console.log(
        `Received ${Array.isArray(data) ? data.length : "non-array"} response`
      );
    } else {
      console.log("\nRequest failed with status:", response.status);
    }
  } catch (error) {
    console.error("\nError testing CORS:", error.message);
  }
}

testCORS();
