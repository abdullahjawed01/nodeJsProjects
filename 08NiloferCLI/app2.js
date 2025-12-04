import rd from "readline-sync"
import chalk from "chalk"
import figlet from "figlet"
import QRCode from "qrcode";



let GST = 0.18 

let servicecharge = 0.1

let menu = [
    { id: 1, name: "Irani Chai", price: 20 },
    { id: 2, name: "Masala Chai", price: 25 },
    { id: 3, name: "Sulaimani Chai", price: 18 },
    { id: 4, name: "Bun Maska", price: 30 },
    { id: 5, name: "Osmania Biscuits", price: 15 },
    { id: 6, name: "Veg Puff", price: 35 },
    { id: 7, name: "Chicken Puff", price: 40 },
    { id: 8, name: "Samosa", price: 20 },
]

let cart = []
console.log(cart);

function banner(){
    console.clear();
    console.log(chalk.green(figlet.textSync("Niloufer Cafe")));
    console.log(chalk.yellow("Best Cafe & Chai In Hyderabad ☕"));
};

function showmenu(){
    console.log(chalk.cyan("\n--- Menu ---"));
    menu.forEach((item)=>
        console.log(`${item.id}.${item.name}-${item.price}`) 
) 
console.log("0.Finish Order\n");
}

function addToCart(){
    let id = rd.questionInt("Choose item ID: ")
    console.log(id,"user given");
    if(id === 0 )return false;


    let item = menu.find((i)=>i.id === id)
    console.log(item,"user sellected");
    if(!item){
        console.log(chalk.red("Invalid Choice"));
        return true;

    }
    const qty = rd.questionInt("Quantity: ")
    console.log(qty," user selected quantity")
    if(qty <= 0 ){
        console.log(chalk.red("invalid quantity"));
        return true;
    }
    const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        qty:qty,
    }
    cart.push(cartItem)
    console.log(chalk.green(`${item.name} X ${qty} added!`));

    console.log(chalk.grey("\n Press Enter to continue"));
    rd.question("")
    banner()
    return true;

}


function generateBill(){
    let subtotal = 0

    console.log(chalk.cyan("\n ---- Bill Details----"));

    let tableData = cart.map((item,index)=>{
        let total = item.price * item.qty;
        subtotal += total
        
        return {
            "S.No": index+1,
            "item Name": item.name,
            price : `${item.price}`,
            Qty : item.qty,
            Total : `${total}`
            
        }
    })

    console.table(tableData)

    let gst = subtotal*GST
    let serviceIndex = subtotal * servicecharge
    let grandTotal = subtotal + gst + serviceIndex

    console.log(chalk.white("-------------------------"));
    console.log(`Subtotal: ₹${subtotal.toFixed(2)}`);
    console.log(`GST (5%): ₹${gst.toFixed(2)}`);
    console.log(`Service Tax (10%): ₹${serviceIndex.toFixed(2)}`);
    console.log(chalk.greenBright(`Total: ₹${grandTotal.toFixed(2)}`));
    console.log(chalk.white("-------------------------"));

    return grandTotal.toFixed(2);       
}

function askCustomerDetails(){
    console.log(chalk.magenta("\n Customer Details"));
    let fullName = rd.question("Enter your Name: ")
    let email = rd.questionEMail("Enter your Email: ")
    let phone = rd.question("Phone: ")
   
    console.log(chalk.greenBright(`Thanks ${fullName}
        check your bill in SMS/Email shortly`));
}

async function showQRCode(total){
    console.log(chalk.yellow('\n Scan & pay using UPI \n'));

    let upiString = `upi://pay?pa=9661222472@kotak811&pn=Cafe%20Niloufer%20-%20Best%20Cafe%20&%20Chai%20In%20Hyderabad&am=${total}&cu=INR`

    QRCode.toString(
        upiString,
        { type: "terminal", small: true }, 
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
    banner()

    while (true){
        showmenu()
        if(!addToCart()) break;
    }

    console.clear();
    banner()


    let total = generateBill()
    askCustomerDetails()
    await showQRCode(total)
}
main()