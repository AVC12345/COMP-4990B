document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.querySelector("input[type='text']");
    const resultDiv = document.querySelector(".result");
    const requirementsList = document.querySelector(".requirements");
    const progressBar = document.querySelector(".progress-bar");

    passwordInput.addEventListener("input", async function() {
        const password = passwordInput.value;
        if (password.trim() === "") { //this condition checks if the string is empty
            resultDiv.textContent = "";
            requirementsList.innerHTML = "";
            progressBar.style.display = "none";
        } else {
            progressBar.style.display = "block";
            const validationResult = await validatePassword(password);

            if (validationResult.count == 0) {
                resultDiv.textContent = "*** STRONG PASSWORD ***";
                resultDiv.style.color = "green";
                requirementsList.innerHTML = "";
            } else if (validationResult.count < 4){
                resultDiv.textContent = "MEDIUM STRENGTH PASSWORD";
                resultDiv.style.color = "blue";
                requirementsList.innerHTML = "";
                requirementsList.style.color = "black";

                for (const requirement of validationResult.unfulfilled) {
                    const li = document.createElement("li");
                    li.textContent = requirement;
                    requirementsList.appendChild(li);
                }

                const progressPercent = calculateProgress(validationResult);
                updateProgressBar(progressPercent);
            }else{
                resultDiv.textContent = "WEAK PASSWORD.";
                resultDiv.style.color = "red";
                requirementsList.innerHTML = "";
                requirementsList.style.color = "#800080";

                for (const requirement of validationResult.unfulfilled) {
                    const li = document.createElement("li");
                    li.textContent = requirement;
                    requirementsList.appendChild(li);
                }

                const progressPercent = calculateProgress(validationResult);
                updateProgressBar(progressPercent);
            }
        }


        // if (validationResult.valid) {
        //     resultDiv.textContent = "Password is valid!";
        //     resultDiv.style.color = "green";
        //     requirementsList.innerHTML = "";
        // } else {
        //     resultDiv.textContent = "Password is not valid.";
        //     resultDiv.style.color = "red";
        //     requirementsList.innerHTML = "";

        //     for (const requirement of validationResult.unfulfilled) {
        //         const li = document.createElement("li");
        //         li.textContent = requirement;
        //         requirementsList.appendChild(li);
        //     }

        //     const progressPercent = calculateProgress(validationResult);
        //     updateProgressBar(progressPercent);
        // }
    });

    function calculateProgress(validationResult) {
        const totalRequirements = 6; // Total number of requirements, including the new one
        const fulfilledRequirements = totalRequirements - validationResult.unfulfilled.length;
        return (fulfilledRequirements / totalRequirements) * 100;
    }
    
    function updateProgressBar(percent) {
        const progressBar = document.querySelector(".progress-fill");
        progressBar.style.width = percent + "%";
    }

    document.body.appendChild(resultDiv);
    document.body.appendChild(requirementsList);
});

async function validatePassword(password) {
    const unfulfilled = [];
    var count = 0; 

    if (password.length < 16) {
        unfulfilled.push("Password must be at least 16 characters long.");
        count = count + 1;
    }

    const capitalLetters = password.match(/[A-Z]/g) || [];
    if (capitalLetters.length < 3) {
        unfulfilled.push("Password must have at least 3 capital letters.");
        count = count + 1;
    }

    const uniqueNumbers = [...new Set(password.match(/\d/g))];
    if (uniqueNumbers.length < 3) {
        unfulfilled.push("Password must have at least 3 different numbers.");
        count = count + 1;
    }

    const uniqueSpecialChars = [...new Set(password.match(/[^\w\s]/g))];
    if (uniqueSpecialChars.length < 3) {
        unfulfilled.push("Password must have at least 3 different special characters.");
        count = count + 1;
    }

    if (/^[0-9\s\W]|[\s\W]$/.test(password)) {
        unfulfilled.push("Password cannot start or end with a number or special character.");
        count = count + 1;
    }

    const isEnglishWord = await checkIsEnglishWord(password);
    if (isEnglishWord) {
        unfulfilled.push("Password cannot containt full english words");
        count = count + 1;
    }

    
    return {count: count, unfulfilled: unfulfilled};
}

async function checkIsEnglishWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        return Array.isArray(data) && data.length > 0;
    } catch (error) {
        return false;
    }
}

