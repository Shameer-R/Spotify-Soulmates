const user_1_input = document.getElementById("user-1-input")
const user_2_input = document.getElementById("user-2-input")
const submitButton = document.getElementById("submit")
const resultLabel = document.getElementById("Result")

submitButton.addEventListener("click", async () => {
    
    user1_ID = user_1_input.value 
    user2_ID = user_2_input.value

    const url = `http://localhost:3000/compatibility/${user1_ID}/${user2_ID}`

    try {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            resultLabel.textContent = "You guys are " + data.Compatability + "% compatible!"
        })
    } catch (error) {
        console.error(error)
    }

})