//=====================================================
// ELEMENT REFERENCES
//=====================================================

const registrationForm = document.getElementById("registrationForm");

// Inputs
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const username = document.getElementById("username");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

// Other Elements
const error = document.getElementById("error");
const successMessage = document.getElementById("successMessage");

// Password
const showPassword = document.getElementById("showPassword");
const strengthBar = document.getElementById("strengthBar");

// Dark Mode
const darkMode = document.getElementById("darkMode");

// Theme Selector
const themeSelector = document.getElementById("themeSelector");

// Profile Picture
const profilePicture = document.getElementById("profilePicture");
const previewImage = document.getElementById("previewImage");

// Table
const tableBody = document.querySelector("#studentTable tbody");
const noStudentsRow = document.getElementById("noStudentsRow");

// Search
const searchStudent = document.getElementById("searchStudent");

// Buttons
const clearAll = document.getElementById("clearAll");
const exportCSV = document.getElementById("exportCSV");
const sortBtn = document.getElementById("sortBtn");

// Fallback placeholder avatar (no external network dependency)
const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">' +
        '<rect width="60" height="60" fill="#FFC9B5"/>' +
        '<text x="50%" y="55%" font-size="26" text-anchor="middle" fill="#5a3a30" font-family="sans-serif">?</text>' +
        '</svg>'
    );

//=====================================================
// STUDENTS ARRAY
//=====================================================

let students = [];

// Used later while editing
let editIndex = -1;

// Holds the selected profile picture as a base64 string
let imageData = "";

//=====================================================
// LOCAL STORAGE HELPERS
//=====================================================

function loadStudents() {

    const data = localStorage.getItem("students");

    students = data ? JSON.parse(data) : [];

}

function saveStudents() {

    localStorage.setItem("students", JSON.stringify(students));

}

//=====================================================
// DARK MODE
//=====================================================

darkMode.addEventListener("change", function () {

    if (this.checked) {

        document.body.classList.add("dark-mode");

        localStorage.setItem("darkMode", "enabled");

    } else {

        document.body.classList.remove("dark-mode");

        localStorage.setItem("darkMode", "disabled");

    }

});

//=====================================================
// THEME SELECTOR
//=====================================================

themeSelector.addEventListener("change", function () {

    const selectedTheme = this.value;

    localStorage.setItem("themeColor", selectedTheme);

    changeTheme(selectedTheme);

});

function changeTheme(color) {

    const navbar = document.querySelector(".navbar");

    navbar.classList.remove(
        "bg-primary",
        "bg-success",
        "bg-danger",
        "bg-dark"
    );

    navbar.style.background = "";

    switch (color) {

        case "primary":

            navbar.classList.add("bg-primary");

            break;

        case "success":

            navbar.classList.add("bg-success");

            break;

        case "danger":

            navbar.classList.add("bg-danger");

            break;

        case "dark":

            navbar.classList.add("bg-dark");

            break;

        default:

            navbar.style.background = "#F28C8C";

    }

}

//=====================================================
// SHOW / HIDE PASSWORD
//=====================================================

showPassword.addEventListener("change", function () {

    const type = this.checked ? "text" : "password";

    password.type = type;

    confirmPassword.type = type;

});

//=====================================================
// PASSWORD STRENGTH
//=====================================================

password.addEventListener("keyup", passwordStrength);

function passwordStrength() {

    const pass = password.value;

    strengthBar.className = "progress-bar";

    if (pass.length === 0) {

        strengthBar.style.width = "0%";

        strengthBar.innerHTML = "";

    } else if (pass.length < 6) {

        strengthBar.style.width = "33%";

        strengthBar.classList.add("weak");

        strengthBar.innerHTML = "Weak";

    } else if (!/\d/.test(pass)) {

        strengthBar.style.width = "66%";

        strengthBar.classList.add("medium");

        strengthBar.innerHTML = "Medium";

    } else {

        strengthBar.style.width = "100%";

        strengthBar.classList.add("strong");

        strengthBar.innerHTML = "Strong";

    }

}

//=====================================================
// PROFILE PICTURE PREVIEW
//=====================================================

profilePicture.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {

        clearImagePreview();

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        imageData = e.target.result;

        previewImage.src = imageData;

        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

});

function clearImagePreview() {

    imageData = "";

    previewImage.src = "";

    previewImage.style.display = "none";

}

//=====================================================
// AGE CALCULATION
//=====================================================

function calculateAge(dateOfBirth) {

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {

        age--;

    }

    return age;

}

//=====================================================
// FIELD-LEVEL HELPERS
//=====================================================

function markInvalid(field, message) {

    field.classList.add("is-invalid");

    error.innerHTML = message;

}

function clearInvalid(field) {

    field.classList.remove("is-invalid");

}

function clearAllInvalid() {

    [fullName, email, username, phone, dob, gender, password, confirmPassword]
        .forEach(clearInvalid);

}

//=====================================================
// VALIDATE FORM
//=====================================================

function validateForm() {

    error.innerHTML = "";

    clearAllInvalid();

    //-------------------------------------------------
    // FULL NAME
    //-------------------------------------------------

    const nameValue = fullName.value.trim();

    if (nameValue === "") {

        markInvalid(fullName, "Full Name is required.");

        return false;

    }

    if (!/^[A-Za-z ]+$/.test(nameValue)) {

        markInvalid(fullName, "Full Name should contain only alphabets.");

        return false;

    }

    if (nameValue.length < 3) {

        markInvalid(fullName, "Full Name must be at least 3 characters.");

        return false;

    }

    //-------------------------------------------------
    // EMAIL
    //-------------------------------------------------

    const emailValue = email.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {

        markInvalid(email, "Email is required.");

        return false;

    }

    if (!emailPattern.test(emailValue)) {

        markInvalid(email, "Enter a valid Email.");

        return false;

    }

    //-------------------------------------------------
    // USERNAME
    //-------------------------------------------------

    const usernameValue = username.value.trim();

    if (usernameValue === "") {

        markInvalid(username, "Username is required.");

        return false;

    }

    if (usernameValue.length < 4) {

        markInvalid(username, "Username must be at least 4 characters.");

        return false;

    }

    const usernameTaken = students.some(function (student, index) {

        return student.username.toLowerCase() === usernameValue.toLowerCase()
            && index !== editIndex;

    });

    if (usernameTaken) {

        markInvalid(username, "This Username is already taken.");

        return false;

    }

    //-------------------------------------------------
    // PHONE
    //-------------------------------------------------

    const phoneValue = phone.value.trim();

    if (phoneValue === "") {

        markInvalid(phone, "Phone Number is required.");

        return false;

    }

    if (!/^\d+$/.test(phoneValue)) {

        markInvalid(phone, "Phone Number should contain numbers only.");

        return false;

    }

    if (phoneValue.length < 10 || phoneValue.length > 11) {

        markInvalid(phone, "Phone Number must contain 10 or 11 digits.");

        return false;

    }

    //-------------------------------------------------
    // DATE OF BIRTH
    //-------------------------------------------------

    if (dob.value === "") {

        markInvalid(dob, "Date of Birth is required.");

        return false;

    }

    const birthDate = new Date(dob.value);

    const today = new Date();

    if (birthDate > today) {

        markInvalid(dob, "Future Date is not allowed.");

        return false;

    }

    const age = calculateAge(dob.value);

    if (age < 1) {

        markInvalid(dob, "Enter a valid Date of Birth.");

        return false;

    }

    //-------------------------------------------------
    // GENDER
    //-------------------------------------------------

    if (gender.value === "") {

        markInvalid(gender, "Please select Gender.");

        return false;

    }

    //-------------------------------------------------
    // PASSWORD
    //-------------------------------------------------

    const passwordValue = password.value;

    if (passwordValue === "") {

        markInvalid(password, "Password is required.");

        return false;

    }

    if (passwordValue.length < 6) {

        markInvalid(password, "Password must be at least 6 characters.");

        return false;

    }

    if (!/\d/.test(passwordValue)) {

        markInvalid(password, "Password must contain at least one number.");

        return false;

    }

    //-------------------------------------------------
    // CONFIRM PASSWORD
    //-------------------------------------------------

    if (confirmPassword.value === "") {

        markInvalid(confirmPassword, "Confirm Password is required.");

        return false;

    }

    if (passwordValue !== confirmPassword.value) {

        markInvalid(confirmPassword, "Passwords do not match.");

        return false;

    }

    //-------------------------------------------------
    // TERMS
    //-------------------------------------------------

    if (!terms.checked) {

        error.innerHTML = "You must agree to the Terms & Conditions.";

        return false;

    }

    //-------------------------------------------------
    // SUCCESS
    //-------------------------------------------------

    error.innerHTML = "";

    return true;

}

//=====================================================
// REAL-TIME VALIDATION (field only re-checks on its own event)
//=====================================================

fullName.addEventListener("blur", validateForm);
email.addEventListener("blur", validateForm);
username.addEventListener("blur", validateForm);
phone.addEventListener("blur", validateForm);
dob.addEventListener("blur", validateForm);
gender.addEventListener("change", validateForm);
password.addEventListener("keyup", validateForm);
confirmPassword.addEventListener("keyup", validateForm);
terms.addEventListener("change", validateForm);

//=====================================================
// REGISTER FORM SUBMIT
//=====================================================

registrationForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!validateForm()) {

        return;

    }

    const age = calculateAge(dob.value);

    const student = {

        name: fullName.value.trim(),
        email: email.value.trim(),
        username: username.value.trim(),
        phone: phone.value.trim(),
        dob: dob.value,
        age: age,
        gender: gender.value,
        image: imageData

    };

    if (editIndex !== -1) {

        students[editIndex] = student;

        editIndex = -1;

    } else {

        students.push(student);

    }

    saveStudents();

    displayStudents();

    successMessage.classList.remove("d-none");

    setTimeout(function () {

        successMessage.classList.add("d-none");

    }, 3000);

    registrationForm.reset();

    clearImagePreview();

    passwordStrength();

    clearAllInvalid();

    error.innerHTML = "";

});

//=====================================================
// RENDER A SINGLE STUDENT ROW
//=====================================================

function renderRow(student, index) {

    const imgSrc = student.image || PLACEHOLDER_IMAGE;

    return `
        <tr>
            <td>${index + 1}</td>
            <td>
                <img src="${imgSrc}" alt="${student.name}'s profile picture" class="student-img">
            </td>
            <td>${student.name}</td>
            <td>${student.username}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editStudent(${index})">
                    Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        </tr>
    `;

}

//=====================================================
// DISPLAY STUDENTS
//=====================================================

function displayStudents(list) {

    const source = list || students;

    if (source.length === 0) {

        tableBody.innerHTML = "";

        tableBody.appendChild(noStudentsRow);

        noStudentsRow.style.display = "";

        return;

    }

    tableBody.innerHTML = source
        .map(function (student) {

            // Use the student's real index in the master array so
            // Edit/Delete always act on the correct record, even
            // while a search filter is active.
            const realIndex = students.indexOf(student);

            return renderRow(student, realIndex);

        })
        .join("");

}

//=====================================================
// SEARCH STUDENT
//=====================================================

searchStudent.addEventListener("keyup", function () {

    const searchValue = this.value.toLowerCase();

    const filtered = students.filter(function (student) {

        return student.name.toLowerCase().includes(searchValue) ||
            student.username.toLowerCase().includes(searchValue);

    });

    displayStudents(filtered);

});

//=====================================================
// EDIT STUDENT
//=====================================================

function editStudent(index) {

    const student = students[index];

    fullName.value = student.name;
    email.value = student.email;
    username.value = student.username;
    phone.value = student.phone;
    dob.value = student.dob;
    gender.value = student.gender;

    if (student.image) {

        previewImage.src = student.image;
        previewImage.style.display = "block";

    } else {

        clearImagePreview();

    }

    imageData = student.image || "";

    editIndex = index;

    clearAllInvalid();

    error.innerHTML = "";

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

}

//=====================================================
// DELETE STUDENT
//=====================================================

function deleteStudent(index) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {

        students.splice(index, 1);

        if (editIndex === index) {

            editIndex = -1;

        }

        saveStudents();

        displayStudents();

    }

}

//=====================================================
// CLEAR ALL STUDENTS
//=====================================================

clearAll.addEventListener("click", function () {

    const confirmClear = confirm("Delete all students?");

    if (confirmClear) {

        students = [];

        localStorage.removeItem("students");

        editIndex = -1;

        searchStudent.value = "";

        displayStudents();

    }

});

//=====================================================
// SORT BY NAME
//=====================================================

sortBtn.addEventListener("click", function () {

    students.sort(function (a, b) {

        return a.name.localeCompare(b.name);

    });

    saveStudents();

    displayStudents();

});

//=====================================================
// EXPORT CSV
//=====================================================

function csvEscape(value) {

    return `"${String(value).replace(/"/g, '""')}"`;

}

exportCSV.addEventListener("click", function () {

    if (students.length === 0) {

        alert("No students available to export.");

        return;

    }

    let csv = "Name,Username,Email,Phone,Age,Gender\n";

    students.forEach(function (student) {

        csv += [

            csvEscape(student.name),
            csvEscape(student.username),
            csvEscape(student.email),
            csvEscape(student.phone),
            csvEscape(student.age),
            csvEscape(student.gender)

        ].join(",") + "\n";

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Students.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

});

//=====================================================
// FORM RESET
//=====================================================

registrationForm.addEventListener("reset", function () {

    setTimeout(function () {

        error.innerHTML = "";

        clearAllInvalid();

        clearImagePreview();

        passwordStrength();

        editIndex = -1;

    }, 0);

});

//=====================================================
// INITIALIZE PAGE
//=====================================================

function init() {

    loadStudents();

    displayStudents();

    if (localStorage.getItem("darkMode") === "enabled") {

        document.body.classList.add("dark-mode");

        darkMode.checked = true;

    }

    const savedTheme = localStorage.getItem("themeColor");

    if (savedTheme) {

        themeSelector.value = savedTheme;

    }

    changeTheme(themeSelector.value);

}

init();