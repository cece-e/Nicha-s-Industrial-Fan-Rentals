import { createClient }
from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

        const supabase = createClient(
            "https://vrwpukkqeyjnqfhmdxki.supabase.co",
            "sb_publishable_jQeJy6INmyOse--1jhzbGQ_rk95dfrq"
        );

        let currentData = {};

        // SHOW PREVIEW
        window.showPreview = function () {

            const customer = document.getElementById("customer").value;
            const contact = document.getElementById("contact").value;
            const address = document.getElementById("address").value;

            const fans = Number(document.getElementById("fans").value);
            const price = Number(document.getElementById("price").value);
            const delivery = Number(document.getElementById("delivery").value);

            const vatChecked = document.getElementById("vat").checked;

            const hasCord = document.getElementById("hasCord").checked;
            const cordQty = Number(document.getElementById("cordQty").value);
            const cordPrice = 150;

            const rental = fans * price;
            const cordTotal = hasCord ? cordQty * cordPrice : 0;

            const subtotal = rental + delivery + cordTotal;

            let vat = 0;
            if (vatChecked) {
                vat = subtotal * 0.08;
            }

            const total = subtotal + vat;

            currentData = {
                customer,
                contact,
                address,
                fans,
                price,
                delivery,
                cordTotal,
                vat,
                total
            };

            // SHOW PREVIEW BOX
            document.getElementById("preview").style.display = "block";

            document.getElementById("p_customer").innerText = `👤 Customer: ${customer}`;
            document.getElementById("p_contact").innerText = `📞 Contact: ${contact}`;
            document.getElementById("p_address").innerText = `📍 Address: ${address}`;

            document.getElementById("p_fans").innerText = `🌀 Fans: ${fans}`;
            document.getElementById("p_price").innerText = `💰 Price: ₱${price}`;
            document.getElementById("p_rental").innerText = `💵 Rental: ₱${rental}`;
            document.getElementById("p_delivery").innerText = `🚚 Delivery: ₱${delivery}`;
            document.getElementById("p_cord").innerText = `🔌 Extension Cords: ₱${cordTotal}`;
            document.getElementById("p_subtotal").innerText = `➕ Subtotal: ₱${subtotal}`;
            document.getElementById("p_vat").innerText = `🧾 VAT: ₱${vat}`;

            document.getElementById("p_total").innerText = `💸 TOTAL: ₱${total}`;
        }

        // HIDE PREVIEW
        window.hidePreview = function () {
            document.getElementById("preview").style.display = "none";
        }

        // SAVE + PDF
        document.getElementById("confirmBtn").addEventListener("click", async () => {

            const { error } = await supabase
                .from("quotations")
                .insert([{
                    customer_name: currentData.customer,
                    contact_number: currentData.contact,
                    fan_quantity: currentData.fans,
                    total_amount: currentData.total
                }]);

            if (error) {
                alert("Error saving quotation");
                console.log(error);
                return;
            }

            alert("Saved successfully!");

            html2pdf()
                .from(document.getElementById("preview"))
                .save(`Quotation-${currentData.customer}.pdf`);
        });