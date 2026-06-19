import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://vrwpukkqeyjnqfhmdxki.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd3B1a2txZXlqbnFmaG1keGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUwNzEsImV4cCI6MjA5NzA2MTA3MX0.7Cobjo_7FmK85BttATR0YGSVnEET87j-l81LJlBJMkU"
);

let currentData = {};

window.showPreview = function () {
    // CUSTOMER INFO
    const customer =
        document.getElementById("clientName").value;

    const contact =
        document.getElementById("clientNumber").value;

    const address =
        document.getElementById("clientAddress").value;

    // RENTAL PERIOD
    const startDateValue =
        document.getElementById("startDate").value;

    const endDateValue =
        document.getElementById("endDate").value;

    const startDate =
        new Date(startDateValue);

    const endDate =
        new Date(endDateValue);

    // HOURS
    const milliseconds =
        endDate - startDate;

    const hours =
        milliseconds / (1000 * 60 * 60);

    // Every started 24-hour period = 1 day
    const days =
        Math.max(1, Math.ceil(hours / 24));

    // QUANTITY
    const quantity =
        Number(document.getElementById("quantity").value);

    // DELIVERY
    const delivery =
        Number(document.getElementById("delivery").value || 0);

    // DISCOUNT
    const discount =
        Number(document.getElementById("discount").value || 0);

    // VAT
    const vatChecked =
        document.getElementById("vat").checked;

    // EXTENSION CORDS
    const hasCord =
        document.getElementById("hasCord").checked;

    const cordQty =
        Number(document.getElementById("cordQty").value || 0);

    // STANDBY PERSONNEL
    const hasStandby =
        document.getElementById("hasStandby").checked;

    // PRICES
    const FAN_PRICE = 1100;
    const CORD_PRICE = 150;
    const STANDBY_PRICE = 1000;

    // COMPUTATIONS
    const rental = quantity * days * FAN_PRICE;

    const cordTotal = hasCord ? cordQty * CORD_PRICE  : 0;

    const standbyTotal = hasStandby ? days * STANDBY_PRICE : 0;

    const subtotal = rental + delivery + cordTotal + standbyTotal - discount;

    const vat = vatChecked ? subtotal * 0.08 : 0;

    const total = subtotal + vat;

    currentData = {
        customer,
        contact,
        address,
        startDate: startDateValue,
        endDate: endDateValue,
        quantity,
        days,
        delivery,
        discount,
        cordQty,
        cordTotal,
        standbyTotal,
        rental,
        subtotal,
        vat,
        total
    };

    // SHOW PREVIEW
    document.getElementById("preview").style.display = "block";

    document.getElementById("p_customer").innerText = `👤 Customer: ${customer}`;

    document.getElementById("p_contact").innerText = `📞 Contact: ${contact}`;

    document.getElementById("p_address").innerText =  `📍 Address: ${address}`;

    document.getElementById("p_dates").innerText = `📅 Rental Period: ${startDateValue} to ${endDateValue}`;

    document.getElementById("p_days").innerText = `📆 Billable Days: ${days}`;

    document.getElementById("p_fans").innerText = `🌀 Fans: ${quantity}`;

    document.getElementById("p_rental").innerText = `💵 Rental Cost: ₱${rental.toLocaleString()}`;

    document.getElementById("p_delivery").innerText = `🚚 Delivery Fee: ₱${delivery.toLocaleString()}`;

    document.getElementById("p_cord").innerText = `🔌 Extension Cords: ₱${cordTotal.toLocaleString()}`;

    document.getElementById("p_standby").innerText = `👷 Standby Personnel: ₱${standbyTotal.toLocaleString()}`;

    document.getElementById("p_discount").innerText = `💸 Discount: ₱${discount.toLocaleString()}`;

    document.getElementById("p_subtotal").innerText = `➕ Subtotal: ₱${subtotal.toLocaleString()}`;

    document.getElementById("p_vat").innerText = `🧾 VAT: ₱${vat.toFixed(2)}`;

    document.getElementById("p_total").innerText = `💰 TOTAL: ₱${total.toFixed(2)}`;
};

window.hidePreview = function () {
    const preview = document.getElementById("preview");

    if (preview) {
        preview.style.display = "none";
    }
};

console.log("Generating PDF...");
console.log(document.getElementById("preview"));
console.log(typeof html2pdf);

// SAVE + PDF
document
.getElementById("confirmBtn")
.addEventListener("click", async () => {
    console.log("Saving quotation...");

    try {

        const { data, error } = await supabase
            .from("quotations")
            .insert([{
                customer_name: currentData.customer,
                contact_number: currentData.contact,
                address: currentData.address,

                start_date: currentData.startDate,
                end_date: currentData.endDate,

                fan_quantity: currentData.quantity,
                rental_days: currentData.days,

                delivery_fee: currentData.delivery,

                cord_total: currentData.cordTotal,

                standby_total: currentData.standbyTotal,

                discount: currentData.discount,

                vat: currentData.vat,

                total_amount: currentData.total
            }])
            .select();

        if (error) {
            console.error("Supabase Error:", error);

            alert(
                `Message: ${error.message}\n` +
                `Details: ${error.details}\n` +
                `Hint: ${error.hint}\n` +
                `Code: ${error.code}`
            );

            return;
        }

        console.log("Saved:", data);

        const quotation = document.createElement("div");
        quotation.style.width = "800px";
        quotation.style.padding = "20px";
        quotation.style.backgroundColor = "white";
        quotation.style.fontFamily = "Arial, sans-serif";

        quotation.innerHTML = `
            <h2 style="text-align:center;">
                NICHA'S INDUSTRIAL FAN RENTALS
            </h2>

            <p>
                3508 VIGAN STREET, BRGY. 579, STA. MESA, MANILA, 1008<br>
                09565322670
            </p>

            <hr>

            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

            <p><strong>Name:</strong> ${currentData.customer}</p>

            <p><strong>Contact:</strong> ${currentData.contact}</p>

            <p><strong>Location:</strong> ${currentData.address}</p>

            <p><strong>Ingress:</strong> ${currentData.startDate}</p>

            <p><strong>Egress:</strong> ${currentData.endDate}</p>

            <hr>

            <h3>Financial Proposal</h3>

            <table border="1" width="100%" style="border-collapse:collapse;">
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>

                <tr>
                    <td>Industrial Fan Rental</td>
                    <td>₱${currentData.rental.toLocaleString()}</td>
                </tr>

                <tr>
                    <td>Delivery Fee</td>
                    <td>₱${currentData.delivery.toLocaleString()}</td>
                </tr>

                <tr>
                    <td>Extension Cord</td>
                    <td>₱${currentData.cordTotal.toLocaleString()}</td>
                </tr>

                <tr>
                    <td>Standby Personnel</td>
                    <td>₱${currentData.standbyTotal.toLocaleString()}</td>
                </tr>

                <tr>
                    <td>Discount</td>
                    <td>- ₱${currentData.discount.toLocaleString()}</td>
                </tr>

                <tr>
                    <td>VAT</td>
                    <td>₱${currentData.vat.toFixed(2)}</td>
                </tr>
            </table>

            <h2>
                GRAND TOTAL:
                ₱${currentData.total.toFixed(2)}
            </h2>

            <br><br>

            <p>
                CONFORME:
                ______________________________
            </p>

            <p>
                DATE:
                ______________________________
            </p>
        `;

        document.body.appendChild(quotation);
        await html2pdf()
            .set({
                margin: 10,
                filename: `Quotation-${currentData.customer}.pdf`,
                html2canvas: {
                    scale: 2
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                }
            })
            .from(quotation)
            .save();


        alert("✅ Quotation saved and PDF generated!");

    } catch (err) {

        console.error("FULL ERROR:", err);

        alert("❌ Error occurred. Check console (F12).");
    }

});