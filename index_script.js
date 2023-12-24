document.addEventListener("DOMContentLoaded", function () {
    const openSingleTrackButton = document.getElementById("openSingleTrackButton");
    const openShowButton = document.getElementById("openShowButton");
    const popup = document.getElementById("popup");
    const popupContent = document.querySelector(".popup-content");
    const overlay = document.getElementById("overlay"); // Get the overlay element
    const showDetailsVisibilityContainer = document.querySelector("#popup > div > div.visibilityDetailsContainer")

    var closeButton = document.getElementById("closeButton");

    var singleYearContainer = document.getElementById("singleYearContainer");
    var singleYearRadio = document.getElementById("singleYearRadio");

    var singleShowContainer = document.getElementById("singleShowContainer");
    var singleShowRadio = document.getElementById("singleShowRadio");

    var homePlayButton = document.getElementById("homePlayButton");
    
    
    var guessFormat;

    var gameChoice;


    showDetailsVisibilityContainer.style.display = "none";



    openSingleTrackButton.addEventListener("click", () => {

        gameChoice = "single"

        popup.style.display = "block";
        overlay.style.display = "block"; // Show the overlay
        document.body.style.overflow = "hidden"; // Disable scrolling

        // Disable interactions with elements outside the popup
        document.querySelectorAll("button:not(.homePlayButton)").forEach((button) => {
            button.style.pointerEvents = "none";
        });

        slider.value = 5
        singleYearContainer.checked = true
        roundText.innerHTML = "5 Rounds";

    });

    openShowButton.addEventListener("click", () => {

        gameChoice = "show"

        popup.style.display = "block";
        overlay.style.display = "block"; // Show the overlay
        document.body.style.overflow = "hidden"; // Disable scrolling

        showDetailsVisibilityContainer.style.display = "block";

        // Disable interactions with elements outside the popup
        document.querySelectorAll("button:not(.homePlayButton)").forEach((button) => {
            button.style.pointerEvents = "none";
        });

        slider.value = 3
        singleShowRadio.checked = true
        roundText.innerHTML = "3 Rounds";

    });

    var slider = document.getElementById("sliderRange");
    var roundText = document.getElementById("trackRoundText");

    slider.oninput = function () {
        roundValue = parseInt(this.value)
        if (roundValue == 1) {
            roundText.innerHTML = roundValue + " Round";
        }
        else {
            roundText.innerHTML = roundValue + " Rounds";
        }
    }

    



    singleYearContainer.addEventListener("click", function () {
        singleYearRadio.checked = true;
        slider.value = 5 
        roundText.innerHTML = "5 Rounds";
        

    });



    singleShowContainer.addEventListener("click", function () {
        singleShowRadio.checked = true;
        slider.value = 3 
        roundText.innerHTML = "3 Rounds";
    });

    



    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none"; // Hide the overlay
        document.body.style.overflow = "auto"; // Enable scrolling

        showDetailsVisibilityContainer.style.display = "none";

        // Enable interactions with elements outside the popup
        document.querySelectorAll("button").forEach((button) => {
            button.style.pointerEvents = "auto";
        });
    });

    homePlayButton.addEventListener("click", function () {

        if (singleShowRadio.checked) {
            guessFormat = "ES"
        }
        else {
            guessFormat = "YS"
        }


        if (gameChoice == "single") {

            

            roundValue = slider.value;

            window.location.href = "game.html?Format=" + guessFormat + "&Rounds=" + roundValue;
        }
        else{

            checkbox = document.querySelector("#popup > div > div.visibilityDetailsContainer > label > input[type=checkbox]")


            roundValue = slider.value;

            window.location.href = "game_show.html?Format=" + guessFormat + "&Rounds=" + roundValue + "&detailsHidden=" + checkbox.checked;


        }

    });




});