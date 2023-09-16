
function loadShows() {
    return fetch('shows.json')
        .then(response => response.json())
        .then(shows => {
            const maximum = shows.length;
            const randomInteger = Math.floor(Math.random() * maximum);

            return shows[randomInteger];
        });
}


function loadRandomTrack(show) {
    const randomIndex = Math.floor(Math.random() * show.tracks.length);

    return show.tracks[randomIndex];
}


function displayShowInfo(show) {
    fullShowLink = "https://archive.org/details/" + show.showExtension
    document.getElementById('showDisplay').innerHTML = `<a href="${fullShowLink}" target="_blank">${show.showName}</a>`;

}


function getShowHTML(show) {
    fullShowLink = "https://archive.org/details/" + show.showExtension
    fullHTML = `<a href="${fullShowLink}" target="_blank">${show.showName}</a>`;

    return fullHTML;
}


function displayTrackInfo(track, show) {
    document.getElementById('trackDisplay').innerHTML = track.trackName;
}


function loadAndDisplayIframe(show, track) {
    const randomIframe = document.getElementById('random-iframe');
    const audioType = show.audioType;
    randomIframe.src = `https://archive.org/embed/${show.showExtension}/${track.trackExtension}.${audioType}`;
}

function handleError(error) {
    console.error('Error:', error);
}

function showContent() {
    var resultsDiv = document.querySelector('.results');
    resultsDiv.style.display = 'block';
}

function calculateScore(userYear, actualYear) {

    userScore = 5000;

    const givenDate = new Date(actualYear);
    const year = givenDate.getFullYear();

    console.log(year);
    console.log(userYear);

    if (year == userYear) {
        console.log("year correct");
        userScore = 5000;
        console.log(userScore);

    }
    else {

        console.log("year incorrect");

        const guessedDate = new Date(userYear, 0, 1);

        const timeDifference = Math.abs(givenDate - guessedDate);
        const differenceInYears = timeDifference / (1000 * 60 * 60 * 24 * 365.25); // Taking into account leap years

        console.log(`The guess is off by ${differenceInYears.toFixed(2)} years.`);

        userScore = Math.round(userScore - (differenceInYears * 565));

        if (userScore < 0) {
            userScore = 0
        }

    }

    return userScore;
}


function displayResultPage() {

    // HIDE ALL CURRENT ELEMENTS
    var resultsDiv = document.getElementById("resultsDiv");
    var mainDiv = document.getElementById("main-content");


    // Hide the content by changing the display property to "none"
    resultsDiv.style.display = "none";
    mainDiv.style.display = "none";

    nextRoundButton.style.display = "none";

    // SHOW RESULT PAGE ELEMENTS
    const resultPage = document.getElementById("finalResultPage");
    resultPage.style.display = "block";

    // Display the final score
    const finalScoreElement = document.getElementById("finalScoreValue");
    finalScoreElement.textContent = totalUserScore + "/25000";

    let tableHTML = `
<table>
  <tr>
    <th id="trackColumn">Track</th>
    <th>Your guess</th>
    <th>Actual Year</th>
    <th>Score</th>
  </tr>
`;

    for (let i = 0; i < rounds.length; i++) {
        const [showName, trackName, userGuess, actualYear, userScore] = rounds[i];
        tableHTML += `
    <tr>
      <td id="trackColumn">${showName}<br>${trackName}</td>
      <td>${userGuess}</td>
      <td>${actualYear}</td>
      <td>${userScore}</td>
    </tr>
  `;
    }


    tableHTML += `<tr> 
    <td id="trackColumn">Total Score:</td>
    <td></td><td></td>
    <td>${totalUserScore}/25000</td> </tr>`;
    tableHTML += '</table>';


    var parentElement = document.getElementById('tableContainer');
    parentElement.innerHTML = tableHTML;


    document.getElementById("homeButton").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    document.getElementById("newGameButton").addEventListener("click", function () {
        location.reload();

    });



}


let currentRound = 1;
let totalUserScore = 0;


const rounds = [];

// Function to add a round to the array
function addRound(showName, trackName, userGuess, actualYear, userScore) {
    rounds.push([showName, trackName, userGuess, actualYear, userScore]);
}


document.addEventListener("DOMContentLoaded", () => {
    let loadedShow;


    var sliderValue = null; // or any other value
    var confirmButton = null

    // Function to update the slider width based on screen size
    function updateSliderWidth() {

        d3.select('#slider svg').remove();

        var confirmButton = document.getElementById("confirmButton");




        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const sliderWidthPercentage = 75; // You can adjust this percentage as needed
        const sliderWidth = (screenWidth * sliderWidthPercentage) / 95;

        if (sliderValue === null) {
            displayValue = 1980;
        }
        else {
            displayValue = sliderValue;
        }

        

        var slider = d3
            .sliderHorizontal()
            .min(1965)
            .max(1995)
            .step(1)
            .width(sliderWidth)
            .ticks(30)
            .displayValue(false)
            .default(1980)
            .tickFormat(d3.format('.0f'))
            .silentValue(displayValue)
            .on('onchange', (val) => {
                d3.select('#selectedYear').text(val);
                sliderValue = val; // Update the variable with the slider value


            });

        // Append the slider to the SVG
        d3.select('#slider')
            .append('svg')
            .attr('width', sliderWidth + 70) // Add extra padding as needed
            .attr('height', 120)
            .append('g')
            .attr('transform', 'translate(30,30)')
            .call(slider);


        var svgElement = document.querySelector('.axis'); // Use '.axis' for class or '#yourId' for ID


        // Update the transform attribute
        svgElement.setAttribute('transform', 'translate(0,14)');

        var sliderHandle = document.querySelector("#slider > svg > g > g.slider > g > path")


        if (sliderHandle.style.fill == "grey") {
        }

        if (confirmButton.disabled !== false) {
            sliderHandle.style.fill = "grey";
        }


        var tickElements = document.querySelectorAll('.tick');

        // Loop through the tick elements and change the text of every fifth tick to "A"
        for (var i = 0; i < tickElements.length; i++) {
            if (i % 5 !== 0) {
                tickElements[i].querySelector('text').textContent = "";
            }
        }

        var lines = document.querySelectorAll('line[y2]');

        // Loop through each 'line' element and set 'y2' attribute to 11
        for (var i = 0; i < lines.length; i++) {
            if (i % 5 !== 0) {
                lines[i].setAttribute('y2', '14');
            }
            else {
                lines[i].setAttribute('y2', '27');

            }
        }

        // Get all the 'text' elements with the attribute 'dy'
        var texts = document.querySelectorAll('text[dy]');

        // Loop through each 'text' element and set 'dy' attribute to 2em
        for (var i = 0; i < texts.length; i++) {
            texts[i].setAttribute('dy', '1.7em');
        }

    }


    // Initial update of the slider width
    updateSliderWidth();


    // Add a window resize event listener to update the slider width
    window.addEventListener('resize', updateSliderWidth);


    loadShows()
        .then(show => {
            console.log('Imported Show:', show);
            loadedShow = show; // Store the show object in the variable
            displayShowInfo(show);

            // Load a random track
            const track = loadRandomTrack(show);
            console.log(track);
            displayTrackInfo(track, show);

            return { show, track };
        })
        .then(data => {
            // Step 4: Load and display the iframe
            loadAndDisplayIframe(data.show, data.track);
        })
        .catch(handleError);


    // Set all variables for need HTML elements
    var confirmButton = document.getElementById("confirmButton");
    var resultsDiv = document.querySelector(".results");
    const userGuessElement = document.getElementById("userGuess");
    const userScoreElement = document.getElementById("userScore");
    var nextRoundButton = document.getElementById("nextRoundButton");
    const loadingMessage = document.getElementById("loadingMessage");
    const roundHeader = document.getElementById("roundHeader");
    const sliderDiv = document.getElementById("slider")
    var iframe = document.getElementById('random-iframe');


    iframe.style.display = 'none';


    // Add a load event listener to the iframe so that loading message is hidden when audio is loaded
    iframe.addEventListener('load', function () {
        console.log('Iframe is loaded.');
        loadingMessage.style.display = 'none';
        iframe.style.display = 'inline';
        // Show Iframe element

    });




    confirmButton.addEventListener("click", function () {

        // Show results information
        resultsDiv.style.display = "block";

        var sliderHandle = document.querySelector("#slider > svg > g > g.slider > g > path")

        // Grey out slider handle and disable
        sliderHandle.style.fill = "grey";
        sliderDiv.style.pointerEvents = "none";

        // Disable confirmation button
        confirmButton.disabled = true;


        // Display guess and actual year 
        userGuessElement.innerHTML = "Your guess: " + selectedYear.textContent + "&nbsp;&nbsp;&nbsp;&nbsp;Actual year: " + loadedShow.showYear;

        // Calculate score + total score and then display
        userScore = calculateScore(selectedYear.textContent, loadedShow.showDate);
        totalUserScore = totalUserScore + userScore;
        userScoreElement.textContent = (userScore + "/5000");

        // Get show and track from current round
        const showElement = document.getElementById("showDisplay");
        const trackElement = document.getElementById("trackDisplay");


        // Scroll page down to next round button (bottom of the page)
        nextRoundButton.scrollIntoView({ behavior: 'smooth' });


        // Add round details to array for later results display
        addRound(showElement.innerHTML, trackElement.innerHTML, selectedYear.textContent, loadedShow.showYear, (userScore + "/5000"));



    });



    nextRoundButton.addEventListener("click", function () {

        currentRound++;


        if (currentRound == 6) {
            var embedDiv = document.querySelector('div.embed');

            // Remove the div element from the DOM
            embedDiv.parentNode.removeChild(embedDiv);
            displayResultPage();


        }
        else {

            if (currentRound == 5) {
                console.log("Final round");
                nextRoundButton.textContent = "Finish game";
            }

            roundHeader.textContent = ("Round " + currentRound + "/5")

            // LOAD NEXT ROUND
            console.log("Next round pressed");


            // Reset UI elements
            resultsDiv.style.display = "none";
            confirmButton.disabled = false;


            sliderValue = 1980;


            selectedYear.textContent = "1980"; // Reset selectedYear text
            updateSliderWidth();

            sliderDiv.style.pointerEvents = "";

            iframe.style.display = "none";
            loadingMessage.style.display = "revert";

            // Load and display a new show
            loadShows()
                .then(show => {
                    console.log('Imported Show:', show);
                    loadedShow = show;
                    displayShowInfo(show);
                    const track = loadRandomTrack(show);
                    console.log(track);
                    displayTrackInfo(track, show);
                    loadAndDisplayIframe(show, track);

                    // Reset user input and scores
                    userScoreElement.textContent = "";
                    userGuessElement.textContent = "";

                    // Increment current round
                })
                .catch(handleError);


        }
    });
});



