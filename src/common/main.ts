import { initSearchPage } from "../index/search-handler.js";
import { initScoreForm } from "../index/student-score-handler.js";
import { initTrackedOffersPage } from "../tracked-offers/tracked-offers.js";
import {initLoginPage} from "../auth/login-handler.js";
import {initUploadPage} from "../upload/upload-handler.js";

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("index.html") || path === "/") {
        initScoreForm();
        initSearchPage();
    } else if (path.includes("tracked-offers.html")) {
        initTrackedOffersPage();
    } else if (path.includes("login.html")) {
        initLoginPage();
    } else if (path.includes("upload.html")) {
        initUploadPage();
    }
});