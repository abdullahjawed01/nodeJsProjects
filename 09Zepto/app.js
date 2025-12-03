import puppeteer from 'puppeteer';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import figlet from 'figlet';

async function banner() {
    console.log(chalk.cyan(figlet.textSync('Zepto Bot', { horizontalLayout: 'full' })));
}

async function start() {
    await banner();

    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    // Go to Zepto login page
    await page.goto('https://www.zepto.com/login', { waitUntil: 'networkidle2' });

    // Wait for login page to load
    await page.waitForTimeout(2000);

    // Click "Login with Mobile" button
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(
            b => b.innerText.toLowerCase().includes('mobile')
        );
        if (btn) btn.click();
    });

    // Wait for mobile input to appear
    await page.waitForSelector('input[placeholder*="mobile"]', { timeout: 10000 });

    // Type mobile number
    const mobile = readlineSync.question(chalk.yellow('Enter your mobile number: '));
    await page.type('input[placeholder*="mobile"]', mobile, { delay: 100 });
    await page.click('button[type="submit"]');

    console.log(chalk.green('✅ Mobile number submitted, waiting for OTP...'));

    // Enter OTP manually
    const otp = readlineSync.question(chalk.yellow('Enter OTP received: '));
    await page.type('input[placeholder*="OTP"]', otp, { delay: 100 });
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log(chalk.green('✅ Logged in successfully'));

    // Search for product
    const product = readlineSync.question(chalk.yellow('Enter product name to search: '));
    const searchSelector = 'input[placeholder*="Search"]';
    await page.waitForSelector(searchSelector);
    await page.type(searchSelector, product, { delay: 100 });
    await page.keyboard.press('Enter');

    // Wait for search results
    await page.waitForSelector('div[data-testid="product-card"]', { timeout: 10000 });

    // Click first product
    const productLink = await page.$('div[data-testid="product-card"] a');
    if (!productLink) {
        console.log(chalk.red('❌ No products found'));
        await browser.close();
        return;
    }
    await productLink.click();
    await page.waitForTimeout(2000);

    // Add to cart
    const addToCartBtn = await page.$('button[data-testid="add-to-cart"]');
    if (addToCartBtn) {
        await addToCartBtn.click();
        console.log(chalk.green(`✅ ${product} added to cart`));
    } else {
        console.log(chalk.red('❌ Could not find Add to Cart button'));
        await browser.close();
        return;
    }

    // Go to checkout
    await page.goto('https://www.zepto.com/cart', { waitUntil: 'networkidle2' });
    console.log(chalk.blue('🛒 Reached checkout page. Please complete payment manually.'));

    // Keep browser open for manual checkout
    await page.waitForTimeout(600000); // 10 minutes
    await browser.close();
}

start();
