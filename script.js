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
    const rental =
        quantity * days * FAN_PRICE;

    const cordTotal =
        hasCord
            ? cordQty * CORD_PRICE
            : 0;

    const standbyTotal =
        hasStandby
            ? days * STANDBY_PRICE
            : 0;

    const subtotal =
        rental +
        delivery +
        cordTotal +
        standbyTotal -
        discount;

    const vat =
        vatChecked
            ? subtotal * 0.08 : 0;

    const total =
        subtotal + vat;

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

    document.getElementById("p_customer").innerText =
        `👤 Customer: ${customer}`;

    document.getElementById("p_contact").innerText =
        `📞 Contact: ${contact}`;

    document.getElementById("p_address").innerText =
        `📍 Address: ${address}`;

    document.getElementById("p_dates").innerText =
        `📅 Rental Period:
            ${startDateValue} to ${endDateValue}`;

    document.getElementById("p_days").innerText =
        `📆 Billable Days: ${days}`;

    document.getElementById("p_fans").innerText =
        `🌀 Fans: ${quantity}`;

    document.getElementById("p_rental").innerText =
        `💵 Rental Cost: ₱${rental.toLocaleString()}`;

    document.getElementById("p_delivery").innerText =
        `🚚 Delivery Fee: ₱${delivery.toLocaleString()}`;

    document.getElementById("p_cord").innerText =
        `🔌 Extension Cords: ₱${cordTotal.toLocaleString()}`;

    document.getElementById("p_standby").innerText =
        `👷 Standby Personnel: ₱${standbyTotal.toLocaleString()}`;

    document.getElementById("p_discount").innerText =
        `💸 Discount: ₱${discount.toLocaleString()}`;

    document.getElementById("p_subtotal").innerText =
        `➕ Subtotal: ₱${subtotal.toLocaleString()}`;

    document.getElementById("p_vat").innerText =
        `🧾 VAT: ₱${vat.toFixed(2)}`;

    document.getElementById("p_total").innerText =
        `💰 TOTAL: ₱${total.toFixed(2)}`;
};

// =========================
// HIDE PREVIEW
// =========================

window.hidePreview = function () {
    document.getElementById("preview").style.display = "none";
};

console.log("Generating PDF...");
console.log(document.getElementById("preview"));
console.log(typeof html2pdf);

window.testPDF = function () {

    const div = document.createElement("div");

    div.innerHTML = `
        <h1>Hello PDF</h1>
        <p>This is a test.</p>
    `;

    html2pdf()
        .from(div)
        .save("test.pdf");
};

// SAVE + PDF
document
.getElementById("confirmBtn")
.addEventListener("click", async () => {

    console.log("Saving quotation...");

    // SAVE TO SUPABASE
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

        alert("❌ Could not save to database.\n\n" + error.message);
        return;
    }

    console.log("Saved:", data);

    // GENERATE PDF
    try {
        await html2pdf()
            .from(document.getElementById("preview"))
            .save(`Quotation-${currentData.customer}.pdf`);
        alert("✅ Quotation saved and PDF generated!");
    }catch(pdfError) {
        console.error(pdfError);
        alert("Quotation saved but PDF generation failed.");
    }
});