const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector("#generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially
let password = ""
let passwordLength = 10;
let checkCount = 0;
handleSlider();


function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min) + "% 100%" )
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow - HW
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
        return getRandomInteger(0,9);
}

function generateLowerCase() {
        return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase() {
        return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length)
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false 
    let hasLower = false
    let hasNum = false
    let hasSym = false
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"
    } catch(e) {
        copyMsg.innerText = "Failed"
    }
    //to maked copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
            copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i=array.length-1; i > 0; i--){
        // random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach( (el) => (str += el) );
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('click', handleCheckBoxChange)
} )

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    // if none of the checkbox are checked
    console.log('entering');
    
    if( checkCount <= 0 )
        return;

    if( passwordLength <  checkCount ){
        passwordLength = checkCount;
        handleSlider()
    }

    // process to find new password
    console.log("starting to generate new password");
    
    // remove old password
    password = ''

    // let's put the stuff mentioned by checkboxes
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("compulsary addition done");

    // remaining addition
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done");

    // shuffle the password
    password = shufflePassword( Array.from(password) );

    console.log("shuffle the password");

    // show in UI
    passwordDisplay.value = password;

    // calculate password strength
    calcStrength();
})