import readlineSync from "readline-sync";
import chalk from "chalk";
import figlet from "figlet";
import QRCode from "qrcode";

// 18%
const GST = 0.18;

// 10%
const SERVICE_TAX = 0.10;

// Menu
const menu = [
    { id: 1, name: "Irani Chai", price: 20 },
    { id: 2, name: "Masala Chai", price: 25 },
    { id: 3, name: "Sulaimani Chai", price: 18 },
    { id: 4, name: "Bun Maska", price: 30 },
    { id: 5, name: "Osmania Biscuits", price: 15 },
    { id: 6, name: "Veg Puff", price: 35 },
    { id: 7, name: "Chicken Puff", price: 40 },
    { id: 8, name: "Samosa", price: 20 },
];
console.log(menu)

let cart = [];
console.log(cart)

const banner = () => {
    console.clear();
    console.log(chalk.green(figlet.textSync("Niloufer Cafe")));
    console.log(chalk.yellow("Best Cafe & Chai In Hyderabad ☕"));
};

const showMenu = () => {
    console.log(chalk.cyan("\n--- Menu ---"));
    menu.forEach((item) =>
        console.log(`${item.id}. ${item.name} - ₹${item.price}`)
    );
    console.log("0. Finish Order\n");
};

const addToCart = () => {
    const id = readlineSync.questionInt("Choose item ID: ");
    console.log(id,"user given")
    if (id === 0) return false;

    const item = menu.find((i) => i.id === id);
    console.log(item,"user selected item")
    if (!item) {
        console.log(chalk.red("Invalid choice!"));
        return true;
    }

    const qty = readlineSync.questionInt("Quantity: ");
    console.log(qty,"user selected qty")
    if (qty <= 0) {
        console.log(chalk.red("Invalid quantity!"));
        return true;
    }

    const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        qty: qty,
    };

    cart.push(cartItem);
    console.log(chalk.green(`${item.name} x${qty} added!`));

    console.log(chalk.gray("\nPress ENTER to continue..."));
    readlineSync.question("");
    banner();
    return true;
};

const generateBill = () => {
    let subtotal = 0;

    console.log(chalk.cyan("\n---- BILL DETAILS ----"));

    const tableData = cart.map((item, index) => {
        const total = item.price * item.qty;
        subtotal += total;

        return {
            "S.No": index + 1,
            "Item Name": item.name,
            Price: `₹${item.price}`,
            Qty: item.qty,
            Total: `₹${total}`
        };
    });

    console.table(tableData);

    const gst = subtotal * GST;
    const serviceTax = subtotal * SERVICE_TAX;
    const grandTotal = subtotal + gst + serviceTax;

    console.log(chalk.white("-------------------------"));
    console.log(`Subtotal: ₹${subtotal.toFixed(2)}`);
    console.log(`GST (5%): ₹${gst.toFixed(2)}`);
    console.log(`Service Tax (10%): ₹${serviceTax.toFixed(2)}`);
    console.log(chalk.greenBright(`Total: ₹${grandTotal.toFixed(2)}`));
    console.log(chalk.white("-------------------------"));

    return grandTotal.toFixed(2);
};



function askCustomerDetails() {
    console.log(chalk.magenta("\nCustomer Details"));
    const fullName = readlineSync.question("Full Name: ");
    const email = readlineSync.question("Email: ");
    const phone = readlineSync.question("Phone: ");

    console.log(chalk.greenBright(`
Thanks ${fullName}! 📱
Check your bill in SMS/Email shortly! 📧
`));
}

async function showQRCode(total) {
    console.log(chalk.yellow("\n📌 Scan & Pay using UPI\n"));

    const upiString = `upi://pay?pa=9661222472@kotak811&pn=Cafe%20Niloufer%20-%20Best%20Cafe%20&%20Chai%20In%20Hyderabad&am=${total}&cu=INR`;

    QRCode.toString(
        upiString,
        { type: "terminal", small: true },  // 🔥 reduced QR size
        (err, qr) => {
            if (err) {
                console.log(chalk.red("Failed to generate QR code!"));
                return;
            }
            console.log(chalk.green(qr));
        }
    );

    console.log(chalk.greenBright("❤️ Thank You for Choosing Cafe Niloufer ☕"));
    console.log(chalk.magenta("Best Cafe & Chai In Hyderabad 🔥"));
}


async function main() {
    banner();

    while (true) {
        showMenu();
        if (!addToCart()) break;
    }

    console.clear();
    banner();

    const total = generateBill();
    askCustomerDetails();
    await showQRCode(total);
}

main();