import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://vrwpukkqeyjnqfhmdxki.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd3B1a2txZXlqbnFmaG1keGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUwNzEsImV4cCI6MjA5NzA2MTA3MX0.7Cobjo_7FmK85BttATR0YGSVnEET87j-l81LJlBJMkU"
);

let currentData = {};

// PREVIEW
window.showPreview = function () {

    const customer = document.getElementById("clientName").value;
    const contact = document.getElementById("clientNumber").value;
    const address = document.getElementById("clientAddress").value;

    const startDateValue =
        document.getElementById("startDate").value;

    const endDateValue =
        document.getElementById("endDate").value;

    if (!customer || !contact || !address) {
        alert("Please complete customer information.");
        return;
    }

    if (!startDateValue || !endDateValue) {
        alert("Please select ingress and egress date.");
        return;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    if (endDate <= startDate) {
        alert("Egress date must be later than ingress date.");
        return;
    }

    const hours =
        (endDate - startDate) / (1000 * 60 * 60);

    const days =
        Math.max(1, Math.ceil(hours / 24));

    const quantity =
        Number(document.getElementById("quantity").value);

    const delivery =
        Number(document.getElementById("delivery").value || 0);

    const discount =
        Number(document.getElementById("discount").value || 0);

    const hasCord =
        document.getElementById("hasCord").checked;

    const cordQty =
        Number(document.getElementById("cordQty").value || 0);

    const hasStandby =
        document.getElementById("hasStandby").checked;

    const vatChecked =
        document.getElementById("vat").checked;

    const FAN_PRICE = 1100;
    const CORD_PRICE = 150;
    const STANDBY_PRICE = 1000;

    const rental =
        quantity * days * FAN_PRICE;

    const cordTotal =
        hasCord ? cordQty * CORD_PRICE : 0;

    const standbyTotal =
        hasStandby ? days * STANDBY_PRICE : 0;

    const subtotal =
        rental +
        delivery +
        cordTotal +
        standbyTotal -
        discount;

    const vat =
        vatChecked ? subtotal * 0.08 : 0;

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

    document.getElementById("preview").style.display = "block";

    document.getElementById("p_customer").innerText =
        `Customer: ${customer}`;

    document.getElementById("p_contact").innerText =
        `Contact: ${contact}`;

    document.getElementById("p_address").innerText =
        `Address: ${address}`;

    document.getElementById("p_dates").innerText =
        `${startDateValue} → ${endDateValue}`;

    document.getElementById("p_days").innerText =
        `Days: ${days}`;

    document.getElementById("p_fans").innerText =
        `Fans: ${quantity}`;

    document.getElementById("p_rental").innerText =
        `Rental: ₱${rental.toLocaleString()}`;

    document.getElementById("p_delivery").innerText =
        `Delivery: ₱${delivery.toLocaleString()}`;

    document.getElementById("p_cord").innerText =
        `Extension Cord: ₱${cordTotal.toLocaleString()}`;

    document.getElementById("p_standby").innerText =
        `Standby: ₱${standbyTotal.toLocaleString()}`;

    document.getElementById("p_discount").innerText =
        `Discount: ₱${discount.toLocaleString()}`;

    document.getElementById("p_subtotal").innerText =
        `Subtotal: ₱${subtotal.toLocaleString()}`;

    document.getElementById("p_vat").innerText =
        `VAT: ₱${vat.toFixed(2)}`;

    document.getElementById("p_total").innerText =
        `TOTAL: ₱${total.toFixed(2)}`;
};

// HIDE PREVIEW
window.hidePreview = function () {
    document.getElementById("preview").style.display = "none";
};
console.log("html2pdf =", html2pdf);

// SAVE 
window.addEventListener("DOMContentLoaded", () => {

    const confirmBtn =
        document.getElementById("confirmBtn");

    confirmBtn.addEventListener("click", async () => {

        try {

            const { error } =
                await supabase
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
                    }]);

            if (error) {
                alert(error.message);
                return;
            }

            await generatePDF();

        } catch (err) {
            console.error(err);
            alert("Failed to save quotation.");
        }

    });

});

async function generatePDF() {

const div = document.createElement("div");
div.innerHTML = "<h1>Hello World</h1>";
document.body.appendChild(div);

html2pdf(div);

    document.body.appendChild(div);

    html2pdf(pdf);
}