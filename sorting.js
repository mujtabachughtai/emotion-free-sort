
// This function is called when the page is loaded
window.onload = function() {
  // Select the sorting area element
  var sortingArea = document.querySelector('.sorting-area');
  // Select all the word boxes
  var boxes = document.querySelectorAll('.word-box');
  // Get the bounding client rect of the sorting area
  var sortingAreaRect = sortingArea.getBoundingClientRect();
  // Get the width of a word box
  var boxWidth = boxes[0].offsetWidth;
  // Get the height of a word box
  var boxHeight = boxes[0].offsetHeight;
  // Set the maximum left position of a word box
  var maxLeft = sortingAreaRect.left - boxWidth - 5;
  // Set the minimum left position of a word box
  var minLeft = sortingAreaRect.right + 5;
  // Set the maximum top position of a word box
  var maxTop = sortingAreaRect.bottom - boxHeight - 5;
  // Set the minimum top position of a word box
  var minTop = sortingAreaRect.top + 5;

  // Loop through all the word boxes
  boxes.forEach(function(box) {
    // Generate a random left position for the word box
    var left = Math.random() < 0.5 ? minLeft : maxLeft;
    // Generate a random top position for the word box
    var top = Math.floor(Math.random() * (maxTop - minTop) + minTop);
    // Create a new rect object to represent the word box
    var newBoxRect = {left: left, top: top, width: boxWidth, height: boxHeight};
    // Check if the new rect overlaps with any existing word boxes
    while(checkOverlap(newBoxRect, boxes)){
      // If it does overlap, generate new random positions
      left = Math.random() < 0.5 ? minLeft : maxLeft;
      top = Math.floor(Math.random() * (maxTop - minTop) + minTop);
      newBoxRect = {left: left, top: top, width: boxWidth, height: boxHeight};
    }
    // Apply the new positions to the word box element
    box.style.left = left + 'px';
    box.style.top = top + 'px';
  });
}

// This function checks if a rect overlaps with any existing rects
function checkOverlap(newBoxRect, boxes){
  // Loop through all the existing rects
  for(var i=0; i < boxes.length; i++){
    // Get the bounding client rect of the current rect
    var boxRect = boxes[i].getBoundingClientRect();
    // Check if the new rect overlaps with the current rect
    if(!(newBoxRect.left + newBoxRect.width < boxRect.left || 
      newBoxRect.left > boxRect.left + boxRect.width || 
      newBoxRect.top + newBoxRect.height < boxRect.top || 
      newBoxRect.top > boxRect.top + boxRect.height)){
        // If it does overlap, return true
        return true;
    }
  }
        // If the new rect does not overlap with any existing rects, return false
        return false;
}

// Make word boxes draggable on page load
$(document).ready(function() {
    $('.word-box').draggable();
  });

// Select the continue button
var continueButton = document.querySelector('.buttons-container button');

// Hide the continue button initially
continueButton.style.display = 'none';

// Function to check if the word boxes are within the sorting area range and make continue button clickable if in range
function checkIfWordsInRange() {
    var sortingArea = document.querySelector('.sorting-area');
    var sortingAreaRect = sortingArea.getBoundingClientRect();
    var boxes = document.querySelectorAll('.word-box');
    var allWordsInRange = true;

    boxes.forEach(function(box) {
        var boxRect = box.getBoundingClientRect();
        if(!(sortingAreaRect.left <= boxRect.left &&
            sortingAreaRect.right >= boxRect.left + boxRect.width &&
            sortingAreaRect.top <= boxRect.top &&
            sortingAreaRect.bottom >= boxRect.top + boxRect.height)){
            allWordsInRange = false;
        }
    });

    if (allWordsInRange) {
        continueButton.style.display = 'block';
    } else {
        continueButton.style.display = 'none';
    }
}

// Call the checkIfWordsInRange function when the page loads
checkIfWordsInRange();

// Call the checkIfWordsInRange function whenever the words are moved
// for example on the stop event of the draggable function
$('.word-box').draggable({
    stop: function() {
        checkIfWordsInRange();
    }
});

function convertDataToCSV(coordinates, pagename) {
  let csv = "";
  // Get the names of the word-boxes
  let wordBoxes = document.getElementsByClassName("word-box");
  for (let i = 0; i < wordBoxes.length; i++) {
    let wordBox = wordBoxes[i];
    let word = wordBox.textContent;
    csv += pagename + "." + word + ".x," + pagename + "." + word + ".y,";
  }
  csv = csv.slice(0, -1); // remove the last comma
  csv += "\n";
  // Add the coordinates to the CSV
  coordinates.forEach(function(coordinate) {
    csv += coordinate.x + "," + coordinate.y + ",";
  });
  csv = csv.slice(0, -1); // remove the last comma
  return csv;
}


continueButton.addEventListener("click", function() {
  // Get the current page name
  let pagename = location.href.split("/").slice(-1)[0].split(".")[0];
  // Get all elements with the class "word-box"
  let wordBoxes = document.getElementsByClassName("word-box");
  // Create an empty array to store the coordinates of each word box
  let coordinates = [];
  // Loop through each word box and get its x and y position
  for (let i = 0; i < wordBoxes.length; i++) {
    let wordBox = wordBoxes[i];
    let x = wordBox.offsetLeft;
    let y = wordBox.offsetTop;
    // Add the x and y position as an object to the coordinates array
    coordinates.push({ x, y });
  }
  // Convert the coordinates array to a CSV string
  let csvString = convertDataToCSV(coordinates, pagename);
  // Download the CSV file to the downloads folder
  let csvFile = "C:\\Users\\mujikhalid\\downloads\\data.csv";
  let blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, csvFile);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", csvFile);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      }}
      
  // Get the page number by removing the "page" prefix from the current page name
  let pageNumber = parseInt(pagename.replace("page", ""));
  // Increment the page number to get the next page
  let nextPageNumber = pageNumber + 1;
  // Build the URL for the next page
  let nextPage = "page" + nextPageNumber + ".html";
  // Move to the next page
  window.location.href = nextPage;
});
