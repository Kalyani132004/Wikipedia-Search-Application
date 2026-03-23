const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");
const headerEl = document.querySelector(".wiki-search-header");
const clearBtnEl = document.getElementById("clearBtn");
const errorMessageEl = document.getElementById("errorMessage");
const errorTextEl = document.getElementById("errorText");

function createAndAppendSearchResult(result, index) {
    let { link, title, description } = result;

    let resultItemWrapper = document.createElement("a");
    resultItemWrapper.href = link;
    resultItemWrapper.target = "_blank";
    resultItemWrapper.classList.add("result-item");
   
    resultItemWrapper.style.animationDelay = `${index * 0.1}s`;

    let titleEl = document.createElement("h2");
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultItemWrapper.appendChild(titleEl);

    let urlContainer = document.createElement("div");
    urlContainer.classList.add("result-url");
    
    let linkIcon = document.createElement("i");
    linkIcon.classList.add("fa-solid", "fa-link");
    urlContainer.appendChild(linkIcon);
    
    let urlSpan = document.createElement("span");
    urlSpan.textContent = link;
    urlContainer.appendChild(urlSpan);

    resultItemWrapper.appendChild(urlContainer);

    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultItemWrapper.appendChild(descriptionEl);

    searchResultsEl.appendChild(resultItemWrapper);
}

function displayResults(searchResults) {
    spinnerEl.classList.add("d-none");

    if (searchResults.length === 0) {
        showError("No results found. Try a different keyword.");
        return;
    }

    searchResults.forEach((result, index) => {
        createAndAppendSearchResult(result, index);
    });
}

function showError(message) {
    spinnerEl.classList.add("d-none");
    errorMessageEl.classList.remove("d-none");
    errorTextEl.textContent = message;
}

function searchWikipedia(event) {
    if (event.key === "Enter") {
        let searchInput = searchInputEl.value.trim();
        
        if (searchInput === "") {
            return;
        }

    
        spinnerEl.classList.remove("d-none");
        searchResultsEl.textContent = "";
        errorMessageEl.classList.add("d-none");
        headerEl.classList.add("compact");

        let url = "https://apis.ccbp.in/wiki-search?search=" + encodeURIComponent(searchInput);
        let options = {
            method: "GET"
        };

        fetch(url, options)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(function(jsonData) {
                let { search_results } = jsonData;
                displayResults(search_results);
            })
            .catch(function(error) {
                showError("Failed to fetch results. Please try again later.");
                console.error("Error fetching data:", error);
            });
    }
}


searchInputEl.addEventListener("input", function() {
    if (searchInputEl.value.trim() !== "") {
        clearBtnEl.classList.remove("d-none");
    } else {
        clearBtnEl.classList.add("d-none");
    }
});

clearBtnEl.addEventListener("click", function() {
    searchInputEl.value = "";
    clearBtnEl.classList.add("d-none");
    searchInputEl.focus();
    searchResultsEl.textContent = "";
    errorMessageEl.classList.add("d-none");
    headerEl.classList.remove("compact");
});

searchInputEl.addEventListener("keydown", searchWikipedia);

window.addEventListener("DOMContentLoaded", () => {
    searchInputEl.focus();
});