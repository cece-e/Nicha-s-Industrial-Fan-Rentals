const { createClient } = window['@supabase/supabase-js'] || {};

const supabase = window.supabase ? window.supabase.createClient(
    "https://vrwpukkqeyjnqfhmdxki.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd3B1a2txZXlqbnFmaG1keGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUwNzEsImV4cCI6MjA5NzA2MTA3MX0.7Cobjo_7FmK85BttATR0YGSVnEET87j-l81LJlBJMkU"
) : null;

let currentData = {};

// 1. SHOW PREVIEW
window.showPreview = function () {
    const customer = document.getElementById("clientName").value;
    const contact = document.getElementById("clientNumber").value;
    const address = document.getElementById("clientAddress").value;
    const startDateValue = document.getElementById("startDate").value;
    const endDateValue = document.getElementById("endDate").value;

    if (!customer || !contact || !address || !startDateValue || !endDateValue) {
        alert("Please complete all fields.");
        return;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (endDate <= startDate) {
        alert("Egress date must be later than ingress date.");
        return;
    }

    const hours = (endDate - startDate) / (1000 * 60 * 60);
    const days = Math.max(1, Math.ceil(hours / 24));
    const quantity = Number(document.getElementById("quantity").value);
    const delivery = Number(document.getElementById("delivery").value || 0);
    const discount = Number(document.getElementById("discount").value || 0);
    const hasCord = document.getElementById("hasCord").checked;
    const cordQty = Number(document.getElementById("cordQty").value || 0);
    const hasStandby = document.getElementById("hasStandby").checked;
    const vatChecked = document.getElementById("vat").checked;

    const FAN_PRICE = 1100;
    const CORD_PRICE = 150;
    const STANDBY_PRICE = 1000;

    const rental = quantity * days * FAN_PRICE;
    const cordTotal = hasCord ? cordQty * CORD_PRICE : 0;
    const standbyTotal = hasStandby ? days * STANDBY_PRICE : 0;
    const subtotal = rental + delivery + cordTotal + standbyTotal - discount;
    const vat = vatChecked ? subtotal * 0.08 : 0;
    const total = subtotal + vat;

    currentData = {
        customer, contact, address, startDate: startDateValue, endDate: endDateValue,
        quantity, days, delivery, discount, cordQty, cordTotal, standbyTotal, rental, subtotal, vat, total
    };

    document.getElementById("preview").style.display = "block";
    document.getElementById("p_customer").innerText = `Customer: ${customer}`;
    document.getElementById("p_contact").innerText = `Contact: ${contact}`;
    document.getElementById("p_address").innerText = `Address: ${address}`;
    document.getElementById("p_dates").innerText = `${startDateValue} → ${endDateValue}`;
    document.getElementById("p_days").innerText = `Days: ${days}`;
    document.getElementById("p_fans").innerText = `Fans: ${quantity}`;
    document.getElementById("p_rental").innerText = `Rental: Php ${rental.toLocaleString()}`;
    document.getElementById("p_delivery").innerText = `Delivery: Php ${delivery.toLocaleString()}`;
    document.getElementById("p_cord").innerText = `Extension Cord: Php ${cordTotal.toLocaleString()}`;
    document.getElementById("p_standby").innerText = `Standby: Php ${standbyTotal.toLocaleString()}`;
    document.getElementById("p_discount").innerText = `Discount: Php ${discount.toLocaleString()}`;
    document.getElementById("p_subtotal").innerText = `Subtotal: Php ${subtotal.toLocaleString()}`;
    document.getElementById("p_vat").innerText = `VAT: Php ${vat.toFixed(2)}`;
    document.getElementById("p_total").innerText = `TOTAL: Php ${total.toFixed(2)}`;
};

window.hidePreview = function () {
    document.getElementById("preview").style.display = "none";
};

window.addEventListener("DOMContentLoaded", () => {
    
    const pdfTemplate = document.getElementById("pdfTemplate");
    if (pdfTemplate) {
        pdfTemplate.style.display = "none";
    }

    if(!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
        script.onload = () => {
            window.supabaseClient = window.supabase.createClient(
                "https://vrwpukkqeyjnqfhmdxki.supabase.co",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd3B1a2txZXlqbnFmaG1keGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUwNzEsImV4cCI6MjA5NzA2MTA3MX0.7Cobjo_7FmK85BttATR0YGSVnEET87j-l81LJlBJMkU"
            );
        };
        document.head.appendChild(script);
    }

    const confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.addEventListener("click", async () => {
        try {
            const client = window.supabaseClient || supabase;
            if (client) {
                const { error } = await client
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
                    alert("Supabase Error: " + error.message);
                    return;
                }
            }

            await generatePDF();

        } catch (err) {
            console.error(err);
            alert("Failed to process transaction.");
        }
    });
});

    const confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.addEventListener("click", async () => {
        try {
            const client = window.supabaseClient || supabase;
            if (client) {
                const { error } = await client
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
                    alert("Supabase Error: " + error.message);
                    return;
                }
            }

            await generatePDF();

        } catch (err) {
            console.error(err);
            alert("Failed to process transaction.");
        }
    });



async function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = "logo.jpg";
    await new Promise((resolve) => {
        logo.onload = resolve;
    });

    // pg 1
    doc.addImage(
        logo,
        "JPEG", 
        85,     
        5,      
        80,     
        50      
    );

    doc.setFontSize(18);
    doc.text("NICHA'S INDUSTRIAL FAN RENTALS", 105, 65, {
        align: "center"
    });

    doc.setFontSize(10);

    doc.text(
        "3508 VIGAN STREET, BRGY. 579, STA. MESA, MANILA, 1008",
        105,
        72,
        { align: "center" }
    );

    doc.text(
        "09565322670",
        105,
        78,
        { align: "center" }
    );

    let y = 90;

    doc.text(
        `Date: ${new Date().toLocaleDateString()}`,
        15,
        y
    );

    y += 8;
    doc.text(`Name: ${currentData.customer}`, 15, y);

    y += 8;
    doc.text(`Contact Number: ${currentData.contact}`, 15, y);

    y += 8;
    doc.text(`Location: ${currentData.address}`, 15, y);

    y += 8;
    doc.text(`Ingress: ${currentData.startDate}`, 15, y);

    y += 8;
    doc.text(`Egress: ${currentData.endDate}`, 15, y);

    y += 15;

    const proposalText = `
    Nicha's Industrial Fan Rentals is honored to be given the opportunity to meet your requirements. We sincerely 
    hope that you will find our proposal well-suited to your needs.
    With our high-quality equipment, technical expertise, and dedicated support team, we are fully committed to 
    ensuring the success and smooth execution of your event or project.
    Should you have any questions or require further clarification, please feel free to contact our assigned Account 
    Manager, who will be more than happy to assist you.
    Our Financial Proposal, along with the Terms and Conditions, is attached for your review and consideration.
    Thank you very much for considering Nicha's Industrial Fan Rentals for this undertaking. We look forward to the 
    opportunity to serve you.

    Very truly yours,
    Nicha's Industrial Fan Rentals`;

    const proposalLines = doc.splitTextToSize(
        proposalText,
        180
    );

    doc.setFontSize(11);
    doc.text(
        proposalLines,
        15,
        y
    );

    y += proposalLines.length * 6 + 10;
    doc.text("Jennifer O. Quidilla", 15, y);

    y += 6;
    doc.text("Account Manager", 15, y);

    y += 6;
    doc.text("09953748952", 15, y);

    y += 12;

    doc.setFontSize(14);
    doc.text("FINANCIAL PROPOSAL", 15, y);

    doc.autoTable({
        startY: y + 5,
        head: [
            ["Item", "Description", "Qty", "Unit Cost", "Total"]
        ],
        body: [
            [
                "1",
                "Industrial Fan",
                currentData.quantity,
                "Php 1,100.00",
                `Php ${currentData.rental.toLocaleString()}`
            ],
            [
                "2",
                "Set Up and Pull Out",
                currentData.quantity,
                "FREE",
                "FREE"
            ],
            [
                "3",
                "Delivery and Return Fee",
                "1",
                `Php ${currentData.delivery.toLocaleString()}`,
                `Php ${currentData.delivery.toLocaleString()}`
            ],
            [
                "4",
                "Extension Cord",
                currentData.cordQty,
                "Php 150.00",
                `Php ${currentData.cordTotal.toLocaleString()}`
            ],
            [
                "5",
                "Standby Personnel",
                currentData.days,
                "Php 1,000.00",
                `Php ${currentData.standbyTotal.toLocaleString()}`
            ]
        ]
    });

    y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(11);

    doc.text(
        `Discount: Php ${currentData.discount.toLocaleString()}`,
        15,
        y
    );

    y += 8;

    doc.text(
        `VAT: Php ${currentData.vat.toFixed(2)}`,
        15,
        y
    );

    y += 10;

    doc.setFontSize(14);

    doc.text(
        `GRAND TOTAL: Php ${currentData.total.toLocaleString()}`,
        15,
        y
    );

    y += 15;

    doc.setFontSize(11);

    doc.text(
        "ANY LOSS OR DAMAGE TO THE DELIVERED ITEM/S WILL BE CHARGED ACCORDINGLY:",
        15,
        y
    );

    y += 8;

    doc.text(
        "Industrial Fan = Php 8,000 each",
        15,
        y
    );

    y += 6;

    doc.text(
        "Extension Cord = Php 400 each",
        15,
        y
    );

    // Pg 2
    doc.addPage();

    doc.setFontSize(16);
    doc.text("TERMS & CONDITIONS", 15, 20);

    let termsY = 35;

    const sections = [
        {
            title: "Booking Confirmation and Payment Terms",
            body:
                "50% upon confirmation (or Php 1,000.00 only if total is under 10,000) plus 1 government I.D and 50% (or the rest of the balance) upon delivery (For Strict Compliance). We only provide an Acknowledgement Receipt for our clients. If the client wants an Official Receipt, there is an additional 8% for VAT."
        },
        {
            title: "Order Cancellation",
            body:
                "50% down payment NON-REFUNDABLE."
        },
        {
            title: "Power Requirements",
            body:
                "Electrical supply and necessary cables will be provided by the client."
        },
        {
            title: "Delivery",
            body:
                "The client should inform the supplier of the event's exact location like room/s, floor/s, indoor or outdoor. If the venue is located on the upper floor."
        },
        {
            title: "Meals (Only if Client Requested a Standby Crew)",
            body:
                "Meals for the supplier's personnel will be provided by the client or will add Php150 per pax per meal. The supplier will inform the client of the number of personnel needed to set up the event."
        },
        {
            title: "Return Policy",
            body:
                "All items must be returned to Nicha's Industrial Fan Rentals after the event duration. Failure to do so will result in additional payment of rented items per day and forfeiture of the security deposit."
        }
    ];

    sections.forEach(section => {

        doc.setFontSize(12);

        doc.text(
            section.title + ":",
            15,
            termsY
        );

        termsY += 7;

        doc.setFontSize(11);

        const wrapped = doc.splitTextToSize(
            section.body,
            180
        );

        doc.text(
            wrapped,
            15,
            termsY
        );

        termsY += wrapped.length * 6 + 10;
    });

    // pg 3

    doc.addPage();

    doc.setFontSize(16);
    doc.text("CONFORME", 15, 20);

    doc.setFontSize(11);

    const conformeText =
        "This Proposal constitutes a valid and binding contractual agreement once signed by you. Your signature below indicates acceptance of the quotation, terms, and conditions stated in this document.";

    const conformeLines =
        doc.splitTextToSize(conformeText, 180);

    doc.text(
        conformeLines,
        15,
        40
    );

    doc.text(
        "CONFORME:",
        15,
        120
    );

    doc.line(
        50,
        118,
        140,
        118
    );

    doc.text(
        "Authorized Representative",
        15,
        135
    );

    doc.text(
        "(Signature over Printed Name)",
        15,
        142
    );

    doc.save(
        `Quotation-${currentData.customer}.pdf`
    );
}