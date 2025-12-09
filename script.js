// ==UserScript==
// @name         FNG to Feliluke - Custom Selectors + Email
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Split Name, Custom DL4/DL5, Real Email -> Auto Fill
// @author       You
// @match        https://www.fakenamegenerator.com/*
// @match        https://feliluke.com/partner-with-us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feliluke.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================================
    // PARTIE 1: EXTRACTION (FAKENAMEGENERATOR)
    // ==========================================================
    if (window.location.href.includes("fakenamegenerator.com")) {

        // 1. Create Save Button
        let btnSave = document.createElement("button");
        btnSave.innerHTML = "Get & Save Data";
        Object.assign(btnSave.style, {
            position: "fixed", top: "20px", right: "20px", zIndex: "9999",
            padding: "10px 20px", backgroundColor: "#6f42c1", color: "white",
            border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
        });
        document.body.appendChild(btnSave);

        btnSave.addEventListener("click", function() {
            console.clear();
            console.log("--- START EXTRACTION ---");

            let finalFName = "", finalLName = "", finalNum = "", finalCode = "hi", finalEmail = "";

            // --- A. NAME SPLIT ---
            let nameEl = document.querySelector('div.address h3');
            if (nameEl) {
                let full = nameEl.innerText.trim();
                let parts = full.split(" ");
                if (parts.length > 1) {
                    finalLName = parts.pop();
                    finalFName = parts.join(" ");
                } else {
                    finalFName = full;
                }
                console.log("👤 Name:", finalFName, finalLName);
            }

            // --- B. NUM (Selector: DL #4) ---
            let numEl = document.querySelector('dl.dl-horizontal:nth-of-type(4) dd');
            if (numEl) {
                finalNum = numEl.innerText.trim();
                console.log("📞 Num (DL4):", finalNum);
            }

            // --- C. CODE (Selector: DL #5) ---
            let codeEl = document.querySelector('dl.dl-horizontal:nth-of-type(5) dd');
            if (codeEl) {
                finalCode = codeEl.innerText.trim();
                console.log("🔢 Code (DL5):", finalCode);
            }

            // --- D. REAL EMAIL (Search for 'Email Address') ---
            // Had l-code kay9leb 3la Email fin ma kan o kayjebdo
            let allDts = document.querySelectorAll('.extra dl.dl-horizontal dt');
            for (let dt of allDts) {
                if (dt.innerText.includes("Email")) {
                    let dd = dt.nextElementSibling;
                    if (dd) {
                        // Kanjbdo email o n7ydo ay text zayd
                        finalEmail = dd.innerText.trim().split(/\s+/)[0];
                        console.log("📧 Real Email Found:", finalEmail);
                    }
                    break;
                }
            }

            // Ila mal9inahch, n-génériw wa7d bach ma t-bloquach
            if (!finalEmail) {
                finalEmail = `${finalFName}.${finalLName}@gmail.com`.toLowerCase().replace(/\s/g, '');
            }

            // --- E. SAVE GLOBAL ---
            GM_setValue("s_fname", finalFName);
            GM_setValue("s_lname", finalLName);
            GM_setValue("s_num", finalNum);
            GM_setValue("s_code", finalCode);
            GM_setValue("s_email", finalEmail);

            console.log("💾 ALL DATA SAVED");
            alert(`Data Saved!\nName: ${finalFName} ${finalLName}\nEmail: ${finalEmail}\nNum: ${finalNum}\nCode: ${finalCode}`);
        });
    }

    // ==========================================================
    // PARTIE 2: AUTO FILL (FELILUKE)
    // ==========================================================
    if (window.location.href.includes("feliluke.com")) {

        // 1. Create Fill Button
        let btnFill = document.createElement("button");
        btnFill.innerHTML = "Auto Fill Form";
        Object.assign(btnFill.style, {
            position: "fixed", top: "20px", right: "20px", zIndex: "9999",
            padding: "10px 20px", backgroundColor: "#28a745", color: "white",
            border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
        });
        document.body.appendChild(btnFill);

        btnFill.addEventListener("click", function() {
            // Jib data mn storage
            let d_fname = GM_getValue("s_fname", "");
            let d_lname = GM_getValue("s_lname", "");
            let d_num   = GM_getValue("s_num", "");
            let d_code  = GM_getValue("s_code", "");
            let d_email = GM_getValue("s_email", "");

            console.log("📦 Filling with:", { d_fname, d_lname, d_email, d_num, d_code });

            // Selectors
            let iFirst = document.querySelector('.wcu-register-field-col.wcu-register-field-col-1 input');
            let iLast  = document.querySelector('.wcu-register-field-col.wcu-register-field-col-2 input');
            let iEmail = document.querySelector('.wcu-register-field-col-email input');
            let iProm  = document.querySelector('.wcu-register-field-col #wcu-input-promote');
            let iPhone = document.querySelector('.wcu-register-field-col #wcu-input-custom-1');

            // Function bach n3mro l-input o ndiro events
            const fill = (el, val) => {
                if (el) {
                    el.value = val;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    el.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            };

            // Execute Fill
            fill(iFirst, d_fname);
            fill(iLast, d_lname);
            fill(iEmail, d_email);
            fill(iProm, d_code);
            fill(iPhone, d_num);
        });
    }
})();