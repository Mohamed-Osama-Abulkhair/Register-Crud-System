var passwordInput = document.getElementById("password-input");
var passwordIcon = document.querySelectorAll(".in-password-icon")[0];
var nameInput = document.getElementById("nameInput");
var email = document.getElementById("email");
var selectInput = document.getElementById("select-input");
var errorMessage = document.getElementsByClassName("error");
var form = document.getElementById("form");
var inputs = Array.from(document.getElementsByTagName("input"));
let serverLink =
  "https://mohamed-osama-abulkhair.github.io/Register-crud-System";
  
function inputValidation(regex, input, message, messageValue) {
  if (regex.test(input.value)) {
    input.classList.remove("error-border");
    input.classList.add("success-border");
    message.innerHTML = "";
  } else {
    input.classList.add("error-border");
    input.classList.remove("success-border");
    message.innerHTML = messageValue;
  }
}

var regexName = /^[a-zA-Z]{3,9}(?:\s[a-zA-Z]{3,9})*$/;
if (
  window.location.href == `${serverLink}/index.html` ||
  window.location.href == serverLink
) {
  nameInput.onkeyup = function () {
    inputValidation(
      regexName,
      nameInput,
      errorMessage[0],
      "Enter a real name at least 3 characters"
    );
  };
}

var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
email.onkeyup = () => {
  if (
    window.location.href == `${serverLink}/index.html` ||
    window.location.href == serverLink
  ) {
    inputValidation(
      regexEmail,
      email,
      errorMessage[1],
      "Provide a valid email address"
    );
  } else if (window.location.href == `${serverLink}/login.html`) {
    inputValidation(
      regexEmail,
      email,
      errorMessage[0],
      "Provide a valid email address"
    );
  }
};

var regexPassword = /^(.*\d){3,}|(.*[a-zA-Z]){3,}.*$/;
passwordInput.onkeyup = function () {
  if (passwordInput.value == "") {
    passwordIcon.style.opacity = "0";
    passwordIcon.style.cursor = "default";
  } else {
    passwordIcon.style.opacity = "1";
    passwordIcon.style.cursor = "pointer";
    if (
      window.location.href == `${serverLink}/index.html` ||
      window.location.href == serverLink
    ) {
      inputValidation(
        regexPassword,
        passwordInput,
        errorMessage[2],
        "Password must be at least 3 characters"
      );
    } else if (window.location.href == `${serverLink}/login.html`) {
      inputValidation(
        regexPassword,
        passwordInput,
        errorMessage[1],
        "Password must be at least 3 characters"
      );
    }

    passwordIcon.onclick = function () {
      if (passwordInput.type == "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");
      }
    };
  }
};

if (
  window.location.href == `${serverLink}/index.html` ||
  window.location.href == serverLink
) {
  var li = document.getElementsByTagName("li");
  var selectInput = document.getElementById("select-input");
  selectInput.onclick = () => {
    $(".content ").slideToggle(0);
    $(".fa-caret-down").toggleClass("arrow");
    select();
  };
  var select = () => {
    for (let i = 0; i < li.length; i++) {
      li[i].addEventListener("click", function () {
        selectInput.value = li[i].innerHTML;
        $(".content").slideUp(0);
        $(".fa-caret-down").toggleClass("arrow");
        errorMessage[3].innerHTML = "";
        selectInput.classList.remove("error-border");
        selectInput.classList.add("success-border");
        search.value = "";
      });
    }
  };

  var search = document.getElementById("search");
  var ul = document.getElementById("options");
  search.onkeyup = function () {
    var container = "";
    arr = ["Advertising", "Barber", "Clinic", "Hospital", "School"];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].toLowerCase().includes(search.value.toLowerCase())) {
        container += `
      <li>${arr[i]}</li>`;
      }
      ul.innerHTML = container;
    }
    select();
  };
}
//
//
// _____________________________________________________
let allUsers = [];
if (localStorage.getItem("allUsers") != null) {
  allUsers = JSON.parse(localStorage.getItem("allUsers"));
}

function signup() {
  if (
    nameInput.value == "" ||
    email.value == "" ||
    passwordInput.value == "" ||
    selectInput.value == ""
  ) {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
        errorMessage[i].innerHTML = "field is required";
        inputs[i].classList.add("error-border");
      }
    }
    return;
  }

  if (
    regexName.test(nameInput.value) &&
    regexEmail.test(email.value) &&
    regexPassword.test(passwordInput.value) &&
    selectInput.value != ""
  ) {
    reload.classList.remove("d-none");
    setTimeout(() => {
      reload.classList.add("d-none");
    }, 3000);

    let user = {
      userName: nameInput.value,
      userEmail: email.value.toLowerCase(),
      userPassword: passwordInput.value,
      userSelectInput: selectInput.value,
    };

    if (allUsers.some((newUser) => newUser.userEmail === user.userEmail)) {
      Swal.fire({
        icon: "error",
        title: "Email already exists!",
      });
      return;
    }

    allUsers.push(user);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    Swal.fire({
      icon: "success",
      title: "the registration is done!",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "login.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }
}

let allUsersLogin = [];
if (localStorage.getItem("allUsersLogin") != null) {
  allUsersLogin = JSON.parse(localStorage.getItem("allUsersLogin"));
}

function signIn() {
  if (email.value == "" || passwordInput.value == "") {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
        errorMessage[i].innerHTML = "field is required";
        inputs[i].classList.add("error-border");
      }
    }
    return;
  }

  if (regexEmail.test(email.value) && regexPassword.test(passwordInput.value)) {
    reload.classList.remove("d-none");
    setTimeout(() => {
      reload.classList.add("d-none");
    }, 3000);

    let userLogin = {
      userEmail: email.value.toLowerCase(),
      userPassword: passwordInput.value,
    };

    if (allUsers.length == 0) {
      Swal.fire({
        icon: "error",
        title: "your Email or password is incorrect",
      });
      console.log("else");

      return;
    }

    for (let i = 0; i < allUsers.length; i++) {
      if (
        allUsers[i].userEmail == userLogin.userEmail &&
        allUsers[i].userPassword == userLogin.userPassword
      ) {
        allUsersLogin.push(allUsers[i]);
        localStorage.setItem("allUsersLogin", JSON.stringify(allUsersLogin));
        setTimeout(() => {
          window.location.href = "user.html";
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "your Email or password is incorrect",
        });
      }
    }
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    window.location.href == `${serverLink}/index.html` ||
    window.location.href == serverLink
  ) {
    signup();
  } else if (window.location.href == `${serverLink}/login.html`) {
    signIn();
  }
});
