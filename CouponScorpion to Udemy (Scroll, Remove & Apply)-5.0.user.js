// ==UserScript==
// @name         CouponScorpion to Udemy (Scroll, Remove & Apply)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Scroll to input -> Remove if exists -> Fill Input (Index 1) -> Click Apply
// @author       You
// @match        https://couponscorpion.com/*
// @match        https://www.udemy.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // ============================================================
    // PARTIE 1: COUPONSCORPION
    // ============================================================
    if (currentUrl.includes('couponscorpion.com')) {
        window.addEventListener('load', function() {
            var originalWrapper = document.querySelector('.rh_button_wrapper');
            if (originalWrapper) {
                var originalLinkTag = originalWrapper.querySelector('a');
                var dynamicLink = originalLinkTag ? originalLinkTag.href : '#';

                var newWrapper = document.createElement('span');
                newWrapper.className = 'rh_button_wrapper';
                newWrapper.style.marginLeft = '10px';
                newWrapper.style.display = 'inline-block';

                newWrapper.innerHTML = `
                    <a href="${dynamicLink}" target="_blank" class="btn_offer_block re_track_btn" style="background-color: #28a745 !important; color: white !important; border: none;">
                        Add your library
                    </a>
                `;
                originalWrapper.parentNode.insertBefore(newWrapper, originalWrapper.nextSibling);
            }
        });
    }

    // ============================================================
    // PARTIE 2: UDEMY
    // ============================================================
    if (currentUrl.includes('udemy.com')) {
        window.addEventListener('load', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const couponCode = urlParams.get('couponCode');

            if (couponCode) {
                console.log("Coupon Code : " + couponCode);

                setTimeout(function() {

                    var allInputs = document.querySelectorAll('.text-input-form-module--text-input-form--tITHD .ud-text-input.ud-text-input-medium.ud-text-sm');
                    var couponInput = (allInputs.length >= 2) ? allInputs[1] : allInputs[0];

                    if (couponInput) {

                        console.log("Scrolling...");
                        couponInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        setTimeout(function(){
                            checkAndApply(couponInput);
                        }, 8000);

                    } else {
                        console.log("we didn't found where we can type the coupon code.");
                    }

                    // Function delet and insert coupone
                    function checkAndApply(targetInput) {

                        function fillInput(val) {
                            let lastValue = targetInput.value;
                            targetInput.value = val;
                            let event = new Event('input', { bubbles: true });
                            let tracker = targetInput._valueTracker;
                            if (tracker) { tracker.setValue(lastValue); }
                            targetInput.dispatchEvent(event);
                            targetInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }

                        var removeButton = document.querySelector('.redeem-coupon--code-icon-button--nwf7w');

                        if (removeButton) {
                            console.log(" the Old coupon was founded . Removing it ...");
                            removeButton.click();
                            setTimeout(function() {
                                fillInput(couponCode);
                                console.log("New Coupon  tktb.");
                                clickApply(targetInput);
                            }, 1500);
                        } else {
                            console.log("Ma kaynch coupon 9dim. Kandkhlo nichan.");
                            fillInput(couponCode);
                            console.log("Coupon jdid tktb.");
                            clickApply(targetInput);
                        }
                    }
                    // apply Function
                    function clickApply(inputElement) {
                        var form = inputElement.closest('form');
                        if (form) {
                            var applyBtn = form.querySelector('button');
                            if (applyBtn) {
                                setTimeout(() => {
                                    applyBtn.click();
                                    console.log("Button Apply tclicka!");
                                }, 500);
                            }
                        }
                    }

                }, 10000);
            }
        });
    }

})();