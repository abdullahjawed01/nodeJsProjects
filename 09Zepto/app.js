#!/usr/bin/env node
import puppeteer from "puppeteer";
import readlineSync from "readline-sync";
import chalk from "chalk";
import figlet from "figlet";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function banner() {
    console.log(chalk.green(figlet.textSync("Zepto CLI")));
}

async function startBot() {

    await banner();

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://www.zepto.com/login", { waitUntil: "networkidle2" });

    console.log(chalk.yellow("🔥 Waiting for login popup..."));

    await sleep(3000);

    // STEP 1: CLICK ANY BUTTON THAT OPENS MOBILE LOGIN
    const clicked = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll("button")];

        const possibleButtons = buttons.filter(btn =>
            btn.innerText.toLowerCase().includes("mobile") ||
            btn.innerText.toLowerCase().includes("login") ||
            btn.innerText.toLowerCase().includes("continue")
        );

        if (possibleButtons.length > 0) {
            possibleButtons[0].click();
            return true;
        }
        return false;
    });

    if (!clicked) {
        console.log(chalk.red("❌ Could not find login button! UI changed."));
        await browser.close();
        return;
    }

    console.log(chalk.green("✓ Login button clicked. Waiting for input..."));

    // STEP 2: TRY MULTIPLE SELECTORS (because Zepto changes UI often)
    const mobileSelectors = [
        'input[placeholder*="mobile"]',
        'input[placeholder*="Mobile"]',
        'input[type="tel"]',
        'input[name="phone"]',
        'input[aria-label*="mobile"]'
    ];

    let mobileSelectorFound = null;

    for (const selector of mobileSelectors) {
        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            mobileSelectorFound = selector;
            break;
        } catch { }
    }

    if (!mobileSelectorFound) {
        console.log(chalk.red("❌ Mobile input not found! Zepto changed the UI again."));
        await browser.close();
        return;
    }

    console.log(chalk.green(`✓ Mobile input detected: ${mobileSelectorFound}`));

    // ENTER NUMBER
    const mobile = readlineSync.question(chalk.green("Enter your mobile number: "));
    await page.type(mobileSelectorFound, mobile, { delay: 50 });

    await page.keyboard.press("Enter");
    console.log(chalk.green("✓ Mobile submitted. Waiting for OTP..."));

    // STEP 3: OTP INPUT (Multiple selectors)
    const otpSelectors = [
        'input[placeholder*="OTP"]',
        'input[type="number"]',
        'input[aria-label*="OTP"]'
    ];

    let otpSelectorFound = null;

    for (const selector of otpSelectors) {
        try {
            await page.waitForSelector(selector, { timeout: 15000 });
            otpSelectorFound = selector;
            break;
        } catch { }
    }

    if (!otpSelectorFound) {
        console.log(chalk.red("❌ OTP input not found! Blocked by UI update."));
        await browser.close();
        return;
    }

    console.log(chalk.green(`✓ OTP input detected: ${otpSelectorFound}`));

    const otp = readlineSync.question(chalk.green("Enter OTP: "));
    await page.type(otpSelectorFound, otp, { delay: 50 });

    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log(chalk.greenBright("🎉 Logged in successfully!"));
}

startBot();
