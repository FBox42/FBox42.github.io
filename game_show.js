const showData = {};
let selectedShow;
let sliderHandle;
let searchInput;
let randomIframe;

function loadShows() {

    console.log(guessFormat)
    if (guessFormat == "YS") {
        return fetch('shows.json')
            .then(response => response.json())
            .then(shows => {
                const maximum = shows.length;
                const randomInteger = Math.floor(Math.random() * maximum);

                return shows[randomInteger];
            });
    }
    else {
        return fetch('shows.json')
            .then(response => response.json())
            .then(shows => {
                const maximum = shows.length;
                const randomInteger = Math.floor(Math.random() * maximum);

                // Iterate through the showsData array and create the mapping
                shows.forEach(show => {
                    showData[show.showName] = show.showDate;
                });


                return shows[randomInteger];

            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });

    }
}


// Function to perform the search by show name
function performSearch() {

    console.log("inside function")

    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const resultsBody = document.getElementById("results-body");
    const resultsTable = document.getElementById("results-table");

    // Clear previous search results
    resultsBody.innerHTML = "";

    if (searchInput.trim() === "") {
        // If the search input is empty, display "0 results"
        resultsBody.innerHTML = '<tr></tr>';
        resultsTable.style.display = "block"; // Show the table
    } else {

        const filteredResults = Object.keys(showData).filter(showName => showName.toLowerCase().includes(searchInput));


        // Clear previous results from the table
        resultsBody.innerHTML = "";

        // Show only the first ten filtered results
        const resultsToShow = filteredResults.slice(0, 50);

        // Populate the table with filtered results
        resultsToShow.forEach(item => {
            const row = resultsBody.insertRow();
            const cell = row.insertCell(0);
            cell.textContent = item;

            // Add a class to the <td> element
            cell.classList.add("dropdown-item");
        });

        const dropdownItems = document.querySelectorAll(".dropdown-item");

        // Initialize a variable to store the selected text content

        let searchResults = document.getElementById("results-table");



        // Add a click event listener to each dropdown item
        dropdownItems.forEach(function (item) {
            item.addEventListener("click", function () {
                // Get the text content of the clicked element
                selectedShow = this.textContent;

                // You can now use the selectedText variable as needed

                selectedShowText.textContent = "Selected show: " + selectedShow;

                selectedShowText.scrollIntoView({ behavior: 'smooth' });


                searchResults.style.display = "none"
                console.log("here")



                if (confirmButton.disabled == true) {
                    confirmButton.disabled = false;
                }


            });
        });





    }
}

function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}


function loadRandomTrack(show) {
    const randomIndex = Math.floor(Math.random() * show.tracks.length);

    return show.tracks[randomIndex];
}


function displayShowInfo(show) {
    fullShowLink = "https://archive.org/details/" + show.showExtension
    if (guessFormat == "YS") {
        document.getElementById('showDisplay').innerHTML = `Show: <br><a href="${fullShowLink}" target="_blank">${show.showName}</a>`;
    }
    else{
        document.getElementById('showDisplay').innerHTML = `Correct show: <br><a href="${fullShowLink}" target="_blank">${show.showName}</a>`;
    }
}


function getShowHTML(show) {
    fullShowLink = "https://archive.org/details/" + show.showExtension
    fullHTML = `<a href="${fullShowLink}" target="_blank">${show.showName}</a>`;

    return fullHTML;
}




function loadAndDisplayIframe(show, track) {
    randomIframe = document.getElementById('random-iframe');

    if (showDetailsHidden == "true") {
        randomIframe.src = `https://archive.org/embed/${show.showExtension}&playlist=1&list_height=0`;
    }
    else {
        randomIframe.src = `https://archive.org/embed/${show.showExtension}&playlist=1&list_height=295`;
    }

    if (showDetailsHidden == "false") {
        randomIframe.style.height = "300px";
    }
}

function hideShowDetails() {

    randomIframe.style.height = "100px"


    var src = randomIframe.src;

    let updatedSrc = src.replace(/list_height=295/, 'list_height=0');
    randomIframe.src = updatedSrc;


    showDetailsHidden = "true"

}

function showShowDetails() {

    var src = randomIframe.src;

    let updatedSrc = src.replace(/list_height=0/, 'list_height=295');


    // Update the src attribute of the randomiframe element
    randomIframe.src = updatedSrc;

    randomIframe.style.height = "300px";


    showDetailsHidden = "false"
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



    if (guessFormat == "YS") {

        const givenDate = new Date(actualYear);
        const year = givenDate.getFullYear();

        if (year == userYear) {
            userScore = 5000;
            console.log(userScore);

        }
        else {

            const guessedDate = new Date(userYear, 0, 1);

            const timeDifference = Math.abs(givenDate - guessedDate);
            var differenceInDays = timeDifference / (1000 * 60 * 60 * 24);


            differenceInDays = Math.round(differenceInDays / 50) * 50;

            console.log(`The guess is off by ${differenceInDays} days.`);


            userScore = Math.round(userScore - (differenceInDays * 2.2));

            if (userScore < 0) {
                userScore = 0
            }

        }
    }
    else {
        if (userYear == actualYear) {
            userScore = 5000;
            console.log("exact match")
        }
        else {
            console.log("no match")
            const userDate = new Date(userYear);
            const actualDate = new Date(actualYear);

            const timeDifference = Math.abs(actualDate - userDate);
            var differenceInDays = timeDifference / (1000 * 60 * 60 * 24);


            differenceInDays = Math.round(differenceInDays / 50) * 50;

            console.log(`The guess is off by ${differenceInDays} days.`);


            userScore = Math.round(userScore - (differenceInDays * 2.2));

            if (userScore < 0) {
                userScore = 0
            }

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

    const maxPoints = (totalRounds * 5000)
    finalScoreElement.textContent = totalUserScore + "/" + maxPoints;

    let tableHTML;


    if (guessFormat == "YS") {
        tableHTML = `
        <table>
        <tr>
            <th id="trackColumn">Show</th>
            <th>Your guess</th>
            <th>Actual Year</th>
            <th>Score</th>
        </tr>
        `;

        for (let i = 0; i < rounds.length; i++) {
            const [showName, trackName, userGuess, actualYear, userScore] = rounds[i];
            tableHTML += `
    <tr>
      <td id="trackColumn">${showName}</td>
      <td>${userGuess}</td>
      <td>${actualYear}</td>
      <td>${userScore}</td>
    </tr>
  `;
        }

        tableHTML += `<tr> 
    <td id="trackColumn">Total Score:</td>
    <td></td><td>
    <td>${totalUserScore}/${maxPoints} </tr>`;
        tableHTML += '</table>';
    }
    else {

        tableHTML = `
        <table>
        <tr>
            <th id="trackColumn">Show</th>
            <th>Your guess</th>
            <th>Score</th>
        </tr>
        `;

        for (let i = 0; i < rounds.length; i++) {
            const [showName, userGuess, userScore] = rounds[i];
            tableHTML += `
    <tr>
      <td id="trackColumn">${showName}</td>
      <td>${userGuess}</td>
      <td>${userScore}</td>
    </tr>
  `;
        }

        tableHTML += `<tr> 
    <td id="trackColumn">Total Score:</td>
    <td></td></td>
    <td>${totalUserScore}/${maxPoints}</tr>`;
        tableHTML += '</table>';



    }




    console.log(rounds)


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

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

var guessFormat = urlParams.get('Format')
var showDetailsHidden = urlParams.get('detailsHidden')

console.log(guessFormat)
var totalRounds = parseInt(urlParams.get('Rounds'));

if (guessFormat !== "YS" && guessFormat !== "ES") {
    console.log("no fomat found")
    guessFormat = "YS"
}

if (showDetailsHidden !== "true" && showDetailsHidden !== "false") {
    showDetailsHidden = "true"
}

if (!Number.isInteger(totalRounds) || totalRounds <= 0) {
    totalRounds = 5
}



// Function to add a round to the array
function addRound(showName, trackName, userGuess, actualYear, userScore) {

    if (guessFormat == "YS") {
        rounds.push([showName, trackName, userGuess, actualYear, userScore]);
    }
    else {
        rounds.push([showName, userGuess, userScore]);

    }

}


document.addEventListener("DOMContentLoaded", () => {

    var showDetailsCheckbox = document.getElementById('showDetailsCheckbox')

    showDetailsCheckbox.addEventListener('change', function () {
        // Check if the checkbox is checked
        if (showDetailsCheckbox.checked) {
            showShowDetails()

        } else {
            hideShowDetails()
        }
    })


    if (showDetailsHidden == "false") {
        showDetailsCheckbox.checked = true
    }


    let loadedShow;
    var confirmButton = null

    var searchContainer = document.querySelector('.search-container')
    var selectedShowText = document.getElementById('selectedShowText');




    if (guessFormat == "YS") {

        searchContainer.style.display = "none"
        selectedShowText.style.display = "none"


        var sliderValue = null; // or any other value


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

            sliderHandle = document.querySelector("#slider > svg > g > g.slider > g > path")


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

    }
    else {

        selectedYear.style.display = "none"

        searchInput = document.getElementById("search-input");
        let searchResults = document.getElementById("results-table");

        searchInput.addEventListener('click', function () {

            searchResults.style.display = "block"

        });

        // Use debounce to delay the execution of the search function
        const debouncedSearch = debounce(performSearch, 500); // 300ms delay

        // Attach the debounced search function to the input field's "input" event
        searchInput.addEventListener("input", debouncedSearch);


        // Get references to the selectedYear element and the confirmButton element
        const confirmButton = document.getElementById('confirmButton');


        confirmButton.disabled = true;

    }

    loadShows()
        .then(show => {
            console.log('Imported Show:', show);
            loadedShow = show;
            displayShowInfo(show);

            return { show };
        })
        .then(data => {
            // Step 4: Load and display the iframe
            loadAndDisplayIframe(data.show);
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

    roundHeader.textContent = ("Round " + currentRound + "/" + totalRounds)



    iframe.style.display = 'none';




    // Add a load event listener to the iframe so that loading message is hidden when audio is loaded
    iframe.addEventListener('load', function () {

        console.log('Iframe is loaded.');

        setTimeout(function () {
            // Your code to be executed after 2 seconds
            loadingMessage.style.display = 'none';
            iframe.style.display = 'inline';
        }, 1700);

        // Show Iframe element

    });






    confirmButton.addEventListener("click", function () {

        // Show results information
        resultsDiv.style.display = "block";

        if (guessFormat == "YS") {

            sliderHandle = document.querySelector("#slider > svg > g > g.slider > g > path")

            // Grey out slider handle and disable
            sliderHandle.style.fill = "grey";
            sliderDiv.style.pointerEvents = "none";

            userGuessElement.innerHTML = "Your guess: " + selectedYear.textContent + "&nbsp;&nbsp;&nbsp;&nbsp;Actual year: " + loadedShow.showYear;

            userScore = calculateScore(selectedYear.textContent, loadedShow.showDate);

        }
        else {

            searchInput.disabled = true;
            userScore = calculateScore(showData[selectedShow], loadedShow.showDate);

            userGuessElement.innerHTML = "Your guess: <br>" + selectedShow;

            searchContainer.style.height = "0px"
            selectedShowText.style.display = "none"

        }

        // Disable confirmation button
        confirmButton.disabled = true;


        // Display guess and actual year 

        // Calculate score + total score and then display
        totalUserScore = totalUserScore + userScore;
        userScoreElement.textContent = (userScore + "/5000");

        // Get show and track from current round
        const showElement = document.getElementById("showDisplay");
        const trackElement = document.getElementById("trackDisplay");


        // Scroll page down to next round button (bottom of the page)
        nextRoundButton.scrollIntoView({ behavior: 'smooth' });

        showResultsLink = document.querySelector("#showDisplay > a")


        if (guessFormat == "YS") {
            // Add round details to array for later results display
            addRound(showResultsLink.outerHTML, 0, selectedYear.textContent, loadedShow.showYear, (userScore + "/5000"));
        }
        else {
            addRound(showResultsLink.outerHTML, 0, selectedShow, 0, (userScore + "/5000"))
        }


    });



    nextRoundButton.addEventListener("click", function () {

        currentRound++;


        // var iframe = document.querySelector("#random-iframe");

        iframe.src = "";

        console.log("current= " + currentRound)
        console.log("total = " + totalRounds)


        if (currentRound == (totalRounds + 1)) {
            var embedDiv = document.querySelector('div.embed');

            console.log("inside if statement")

            // Remove the div element from the DOM
            embedDiv.parentNode.removeChild(embedDiv);
            displayResultPage();


        }
        else {

            if (currentRound == (totalRounds - 1)) {
                nextRoundButton.textContent = "Final round";
            }
            else if (currentRound == (totalRounds)) {
                nextRoundButton.textContent = "Finish game";
            }

            roundHeader.textContent = ("Round " + currentRound + "/" + totalRounds)

            // Reset UI elements
            resultsDiv.style.display = "none";

            if (guessFormat == "YS") {
                sliderValue = 1980;

                selectedYear.textContent = "1980"; // Reset selectedYear text

                sliderDiv.style.pointerEvents = "";

                updateSliderWidth();

                sliderHandle.style.fill = "white";

                confirmButton.disabled = false;


            }
            else {

                selectedShowText.textContent = "Selected show: "
                searchInput.disabled = false;
                selectedShow = null;
                confirmButton.disabled = true;
                searchInput.value = ""

                searchContainer.style.height = "400px"
                selectedShowText.style.display = "block"

            }




            iframe.style.display = "none";
            loadingMessage.style.display = "revert";


            // Load and display a new show
            loadShows()
                .then(show => {
                    console.log('Imported Show:', show);
                    loadedShow = show;
                    displayShowInfo(show);

                    loadAndDisplayIframe(show);

                    // Reset user input and scores
                    userScoreElement.textContent = "";
                    userGuessElement.textContent = "";

                    // Increment current round
                })
                .catch(handleError);


        }
    });
});



