//HTML elements
let randomCountryElement = document.querySelector('#random-country')
let userAnswerElement = document.querySelector("#user-answer")
let submitButton = document.querySelector("#submit-answer")
let resultTextElement = document.querySelector('#result')
let playAgainButton = document.querySelector("#play-again")

//variables to be used by getRandomCountry()
let countryName
let countryCode
let countryCapital


function getRandomCountry() {
    // instructions for random found here: 
    // https://www.designcise.com/web/tutorial/how-to-select-a-random-element-from-a-javascript-array
    //get random country from country list
    const randIndex = Math.floor(Math.random() * countriesAndCodes.length)
    let countryRandom = countriesAndCodes[randIndex]
    countryCode = countryRandom["alpha-2"]
    countryName = countryRandom["name"]

    //get capital for random country
    //I wanted this in the same function as getting a country
    //so that I can warn the user when there has been a mismatch in the data...
    //before they have a chance to make their guess
    let worldBankAPIURL = `https://api.worldbank.org/v2/country/${countryCode}?format=json`
    fetch(worldBankAPIURL)
        .then(res => res.json())
        .then(worldBankData => {
            countryCapital = worldBankData[1][0].capitalCity

            console.log(countryCapital) //so users who open devtools can cheat :D

            //ask user to reload if no/invalid data
            if (countryCapital == "")
                alert(`Error: No data for capital of ${countryName}, please click Play Again or reload page.`)
        })
        .catch(error => {
            alert("Error fetching data.\n\n", error)
        })
}


function gradeUserAnswer(answer) {
    //make case insensitive by making everything uppercase...
    //and trim white space in user answer
    let countryCapitalUpper = countryCapital.toUpperCase()
    let answerUpper = answer.trim().toUpperCase()

    if (answerUpper === countryCapitalUpper) 
        resultTextElement.innerHTML = `Correct! The capital of ${countryName} is ${answer}.`
    else 
        resultTextElement.innerHTML = `Incorrect! The capital of ${countryName} is ${countryCapital}, not ${answer}.`

}

window.addEventListener("load", () => {
    //get random country and get country's capital on page load
    getRandomCountry()
    randomCountryElement.innerHTML = countryName
})

submitButton.addEventListener("click", () => {
    //take user input to be graded
    let answer = userAnswerElement.value
    gradeUserAnswer(answer)
})

playAgainButton.addEventListener("click", () => {
    //get random country, clear everything, put new country in randomCountryElement
    getRandomCountry()
    userAnswerElement.value = ""
    resultTextElement.innerHTML = ""
    randomCountryElement.innerHTML = countryName
})
