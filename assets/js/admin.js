document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".qrg-item").forEach(item => {
        const toggle = item.querySelector(".qrg-toggle");
        if (!toggle) return;

        toggle.textContent = item.classList.contains("active") ? "−" : "+";
    });

    document.querySelectorAll(".qrg-tab").forEach(tab => {
        tab.addEventListener("click", function () {

            const target = this.dataset.tab;

            // toggle active tab
            document.querySelectorAll(".qrg-tab").forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            // toggle content
            document.querySelectorAll(".qrg-tab-content").forEach(c => {
                c.classList.remove("active");
                if (c.dataset.content === target) {
                    c.classList.add("active");
                }
            });
        });
    });

    if (typeof QRCodeStyling === "undefined") {
        console.error("QR library not loaded");
        return;
    }

    const preview = document.getElementById("qrg-preview");
    if (!preview) return;

    /*
    -------------------------
    ACCORDION
    -------------------------
    */
    document.querySelectorAll(".qrg-header").forEach(header => {
        header.addEventListener("click", function () {

            const item = this.parentElement;
            const toggle = this.querySelector(".qrg-toggle");

            item.classList.toggle("active");

            if (item.classList.contains("active")) {
                toggle.textContent = "−";
            } else {
                toggle.textContent = "+";
            }
        });
    });

    /*
    -------------------------
    STATE
    -------------------------
    */
    let qrState = {
        type: 'url',
        data: '',
        size: 300,

        colors: {
            bg: '#ffffff',

            dots: {
            mode: 'gradient',
            color: '#000000',
            grad1: '#ff0000',
            grad2: '#0000ff',
            rotation: 0
        },

            eye: {
                mode: 'same',
                color: '#ff0000'
            }
        },

        center: 'none',
        image: null
    };

    /*
    -------------------------
    INIT QR
    -------------------------
    */
    const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        data: '',
        dotsOptions: {
            color: qrState.fg,
            type: 'square'
        },
        backgroundOptions: {
            color: qrState.bg
        }
    });

    qr.append(preview);

    /*
    -------------------------
    HELPERS
    -------------------------
    */
    function buildData() {

        if (qrState.type === 'url') {
            return document.getElementById('qrg-url').value.trim();
        }

        if (qrState.type === 'text') {
            return document.getElementById('qrg-text').value.trim();
        }

        if (qrState.type === 'email') {

            const email = document.getElementById('qrg-email').value.trim();
            const subject = document.getElementById('qrg-email-subject').value.trim();
            const body = document.getElementById('qrg-email-body').value.trim();

            if (!email) return '';

            let url = `mailto:${email}`;

            let params = [];

            if (subject) {
                params.push(`subject=${encodeURIComponent(subject)}`);
            }
        
            if (body) {
                params.push(`body=${encodeURIComponent(body)}`);
            }
        
            if (params.length) {
                url += '?' + params.join('&');
            }
        
            return url;
        }

        if (qrState.type === 'phone') {
            const phone = document.getElementById('qrg-phone').value.trim();
            return phone ? `tel:${phone}` : '';
        }

        return '';
    }

    function updateQR() {

        let dotsOptions;

        if (qrState.colors.dots.mode === 'solid') {

            dotsOptions = {
                color: qrState.colors.dots.color,
                gradient: null // 🔥 CRITICAL FIX
            };

        } else {

            dotsOptions = {
                color: undefined, // 🔥 also important
                gradient: {
                    type: "linear",
                    rotation: parseInt(qrState.colors.dots.rotation),
                    colorStops: [
                        { offset: 0, color: qrState.colors.dots.grad1 },
                        { offset: 1, color: qrState.colors.dots.grad2 }
                    ]
                }
            };
        }

        let eyeColor = qrState.colors.eye.mode === 'same'
            ? (qrState.colors.dots.mode === 'solid'
                ? qrState.colors.dots.color
                : qrState.colors.dots.grad1)
            : qrState.colors.eye.color;

        qr.update({
            width: 300,
            height: 300,
            data: qrState.data || ' ',
            dotsOptions: dotsOptions,
            backgroundOptions: {
                color: qrState.colors.bg
            },
            cornersSquareOptions: {
                color: eyeColor
            },
            cornersDotOptions: {
                color: eyeColor
            },
            image: qrState.image || undefined,

            // 🔥 ALWAYS PASS OBJECT
            imageOptions: {
                crossOrigin: "anonymous",
            
                // apply only if image exists
                imageSize: qrState.image ? 0.50 : 0,
                margin: qrState.image ? 8 : 0
            }
        });
    }

    document.querySelectorAll('input[name="qrg-dots-mode"]').forEach(radio => {
        radio.addEventListener("change", function () {

            qrState.colors.dots.mode = this.value;

            document.querySelector(".qrg-dots-solid").style.display =
                this.value === 'solid' ? 'block' : 'none';

            document.querySelector(".qrg-dots-gradient").style.display =
                this.value === 'gradient' ? 'block' : 'none';

            updateQR();
        });
    });

    const bgInput = document.getElementById("qrg-bg");

    if (bgInput) {
        bgInput.addEventListener("input", function () {
            qrState.colors.bg = this.value;
            updateQR();
        });
    }

    const dotsColorInput = document.getElementById("qrg-dots-color");

    if (dotsColorInput) {
        dotsColorInput.addEventListener("input", function () {
            qrState.colors.dots.color = this.value;

            // force mode to solid
            qrState.colors.dots.mode = 'solid';

            // 🔥 SYNC RADIO UI
            document.querySelector('input[name="qrg-dots-mode"][value="solid"]').checked = true;

            // 🔥 SHOW/HIDE UI
            document.querySelector(".qrg-dots-solid").style.display = 'block';
            document.querySelector(".qrg-dots-gradient").style.display = 'none';

            updateQR();
        });
    }

    document.getElementById("qrg-grad-1").addEventListener("input", function () {
        qrState.colors.dots.grad1 = this.value;
        updateQR();
    });

    document.getElementById("qrg-grad-2").addEventListener("input", function () {
        qrState.colors.dots.grad2 = this.value;
        updateQR();
    });

    document.getElementById("qrg-grad-dir").addEventListener("change", function () {
        qrState.colors.dots.rotation = this.value;
        updateQR();
    });

    document.querySelectorAll('input[name="qrg-eye-mode"]').forEach(radio => {
        radio.addEventListener("change", function () {

            qrState.colors.eye.mode = this.value;

            document.querySelector(".qrg-eye-custom").style.display =
                this.value === 'custom' ? 'block' : 'none';

            updateQR();
        });
    });

    document.getElementById("qrg-eye-color").addEventListener("input", function () {
        qrState.colors.eye.color = this.value;
        updateQR();
    });



    /*
    -------------------------
    CONTENT TYPE SWITCH
    -------------------------
    */
    const typeSelect = document.getElementById("qrg-type");
    const typeFields = document.querySelectorAll(".qrg-type-field");

    typeSelect.addEventListener("change", function () {
        const val = this.value;
        qrState.type = val;

        typeFields.forEach(f => {
            f.style.display = (f.dataset.type === val) ? "block" : "none";
        });

        qrState.data = '';
        qrState.data = buildData();
        updateQR();
    });

    /*
    -------------------------
    INPUT EVENTS
    -------------------------
    */
    ['qrg-url','qrg-text','qrg-email', 'qrg-email-subject', 'qrg-email-body', 'qrg-phone'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener("input", function () {
            qrState.data = buildData();
            updateQR();
        });
    });

    /*
    -------------------------
    COLORS
    -------------------------
    */

    document.getElementById("qrg-bg").addEventListener("input", function () {
        qrState.colors.bg = this.value;
        updateQR();
    });

    /*
    -------------------------
    SIZE (UI ONLY)
    -------------------------
    */
    const sizeInput = document.getElementById("qrg-size");
    const sizeVal = document.getElementById("qrg-size-val");

    sizeInput.addEventListener("input", function () {
        qrState.size = parseInt(this.value);
        sizeVal.innerText = this.value;
    });

    /*
    -------------------------
    CENTER CONTENT UI TOGGLE
    -------------------------
    */
    const centerRadiosUI = document.querySelectorAll('input[name="qrg-center"]');

    centerRadiosUI.forEach(radio => {
        radio.addEventListener("change", function () {

            // 🔥 Reset everything first (important)
            qrState.center = this.value;
            qrState.image = null;

            // Hide all UI sections
            document.querySelector(".qrg-center-logo").style.display = "none";
            document.querySelector(".qrg-center-text").style.display = "none";
            document.querySelector(".qrg-center-icons").style.display = "none";

            // Show selected UI
            if (this.value === "logo") {
                document.querySelector(".qrg-center-logo").style.display = "block";
            }

            if (this.value === "text") {
                document.querySelector(".qrg-center-text").style.display = "block";

                const textVal = document.getElementById("qrg-center-text").value.trim();

                if (textVal) {
                    qrState.image = generateTextImage(textVal);
                }
            }

            if (this.value === "icon") {
                document.querySelector(".qrg-center-icons").style.display = "block";
            }

            // 🔥 Clear QR image immediately
            updateQR();
        });
    });

    /*
    -------------------------
    LOGO UPLOAD
    -------------------------
    */
    const logoInput = document.getElementById("qrg-logo");

    if (logoInput) {
        logoInput.addEventListener("change", function (e) {

            const file = e.target.files[0];
            if (!file) return;

            // 🔒 Optional: basic file validation
            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                // 🔥 Assign logo as base64 (safe + fast)
                qrState.image = event.target.result;

                updateQR();
            };

            reader.readAsDataURL(file);
        });
    }

    const textInput = document.getElementById("qrg-center-text");

    if (textInput) {
        textInput.addEventListener("input", function () {

            if (qrState.center !== 'text') return;

            const value = this.value.trim();

            if (!value) {
                qrState.image = null;
                updateQR();
                return;
            }

            // 🔥 convert text → image
            qrState.image = generateTextImage(value);

            updateQR();
        });
    }

    function generateTextImage(text) {

        const canvas = document.createElement("canvas");
        const size = 200;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        // 🔥 white background (important for scan safety later)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        // 🔤 text style
        ctx.fillStyle = "#000000";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(text, size / 2, size / 2);

        return canvas.toDataURL("image/png");
    }

    /*
    -------------------------
    ICON SELECT
    -------------------------
    */
    document.querySelectorAll(".qrg-icon").forEach(icon => {
        icon.addEventListener("click", function () {

            document.querySelectorAll(".qrg-icon").forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            const iconName = this.dataset.icon;

            generateIconImage(iconName, "#000000").then(imgData => {

                if (!imgData) return;

                qrState.image = imgData;
                updateQR();
            });
        });
    });

    function generateIconImage(iconName, bgColor = "#000000") {

        return new Promise((resolve) => {

            const size = 200;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext("2d");

            // 🔵 circle background
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();

            const img = new Image();

            // 🔥 load SVG from plugin folder
            img.src = qrgData.assets_url + "icons/" + iconName + ".svg";

            img.onload = function () {

                const iconSize = size * 0.6;
                const x = (size - iconSize) / 2;
                const y = (size - iconSize) / 2;

                ctx.drawImage(img, x, y, iconSize, iconSize);

                resolve(canvas.toDataURL("image/png"));
            };

            img.onerror = function () {
                console.error("Icon failed:", iconName);
                resolve(null);
            };
        });
    }

    function getQRConfig(size) {

        let dotsOptions;

        if (qrState.colors.dots.mode === 'solid') {
            dotsOptions = {
                color: qrState.colors.dots.color,
                gradient: null
            };
        } else {
            dotsOptions = {
                color: undefined,
                gradient: {
                    type: "linear",
                    rotation: parseInt(qrState.colors.dots.rotation),
                    colorStops: [
                        { offset: 0, color: qrState.colors.dots.grad1 },
                        { offset: 1, color: qrState.colors.dots.grad2 }
                    ]
                }
            };
        }

        let eyeColor = qrState.colors.eye.mode === 'same'
            ? (qrState.colors.dots.mode === 'solid'
                ? qrState.colors.dots.color
                : qrState.colors.dots.grad1)
            : qrState.colors.eye.color;

        return {
            width: size,
            height: size,
            data: qrState.data || ' ',
            dotsOptions: dotsOptions,
            backgroundOptions: {
                color: qrState.colors.bg
            },
            cornersSquareOptions: {
                color: eyeColor
            },
            cornersDotOptions: {
                color: eyeColor
            },
            image: qrState.image || undefined,
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize: qrState.image ? 0.50 : 0,
                margin: qrState.image ? 8 : 0
            }
        };
    }

    /*
    -------------------------
    DOWNLOAD
    -------------------------
    */
    const buttons = document.querySelectorAll(".qrg-actions button");

    if (buttons.length) {
    
        buttons[0].addEventListener("click", () => downloadQR("png"));
        buttons[1].addEventListener("click", () => downloadQR("svg"));
        buttons[2].addEventListener("click", () => downloadQR("jpeg"));
    }

    function downloadQR(format) {

        const tempQR = new QRCodeStyling(getQRConfig(qrState.size));
        
        tempQR.download({
            name: "qr",
            extension: format
        });
    }


    updateQR();
});

