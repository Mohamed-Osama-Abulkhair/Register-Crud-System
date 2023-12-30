var allUsersLogin = JSON.parse(localStorage.getItem("allUsersLogin"));

document.addEventListener("DOMContentLoaded", function () {
  if (allUsersLogin == null) {
    Swal.fire({
      icon: "error",
      title: "You cannot access your profile without login!",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }
  const profileNameElement = document.getElementById("profile-name");
  profileNameElement.innerHTML = allUsersLogin[0].userName;
  const business = document.getElementById("business-name");
  business.innerHTML = allUsersLogin[0].userSelectInput;
});

var profile = document.getElementById("profile-img");
var inputFile = document.getElementById("input-file");

let profileImg = JSON.parse(localStorage.getItem("profileImg")) || [];

if (profileImg.length > 0) {
  for (let i = 0; i < profileImg.length; i++) {
    if (profileImg[i].user === allUsersLogin[0].userEmail) {
      profile.src = profileImg[i].src || "images/user.png";
    }
  }
}

inputFile.addEventListener("change", function () {
  const selectedFile = inputFile.files[0];

  if (selectedFile && isImageFile(selectedFile)) {
    profile.src = URL.createObjectURL(selectedFile);
    for (let i = 0; i < profileImg.length; i++) {
      if (profileImg[i].user === allUsersLogin[0].userEmail) {
        profileImg.splice(i, 1);
      }
    }
    profileImg.push({
      src: profile.src,
      user: allUsersLogin[0].userEmail,
    });

    localStorage.setItem("profileImg", JSON.stringify(profileImg));
  } else {
    Swal.fire({
      icon: "error",
      title: "Please select a valid image file.!",
    });
  }
});

function isImageFile(file) {
  const acceptedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
  ];
  return file && acceptedImageTypes.includes(file.type);
}

// _____________________________________________________________

var clientInput = document.getElementById("client");
var phoneInput = document.getElementById("phone");
var departmentInput = document.getElementById("department");
var priceInput = document.getElementById("price");
var employeeInput = document.getElementById("employee");
var addBtn = document.getElementById("add-btn");
var search = document.getElementById("search");
var deleteAllBtn = document.getElementById("delete-All-btn");
var tbody = document.getElementById("tbody");
var total = document.getElementById("total");
var clients = [];
var inputs = document.getElementsByTagName("input");
var deleteYes = document.getElementById("delete-yes");
var currentIndex;

if (JSON.parse(localStorage.getItem("clientsList") != null)) {
  clients = JSON.parse(localStorage.getItem("clientsList"));
  displayData();
  if (tbody.innerHTML != "") {
    deleteAllBtn.removeAttribute("disabled");
  }
}

let form = document.getElementById("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  checkOperation();
});

let checkOperation = () => {
  if (addBtn.innerHTML.trim() === '<i class="fa-solid fa-plus"></i>Add New') {
    addClient();
  } else {
    updateClientInfo();
    addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>Add New`;
    addBtn.style.background = "#0057FF";
    addBtn.style.color = "#fff";
  }
  displayData();
  clearForm();
  addValidation();
  for (let i = 1; i <= inputs.length - 2; i++) {
    inputs[i].classList.remove("is-valid");
  }
};

function addClient() {
  let ClientInfo = {
    name: clientInput.value,
    phone: phoneInput.value,
    department: departmentInput.value,
    price: Number(priceInput.value),
    employee: employeeInput.value,
    createdBy: allUsersLogin[0].userEmail,
  };
  clients.push(ClientInfo);
  localStorage.setItem("clientsList", JSON.stringify(clients));
  deleteAllBtn.removeAttribute("disabled");
}

function clearForm() {
  for (var i = 1; i <= inputs.length - 2; i++) {
    inputs[i].value = "";
  }
}

function displayData() {
  var container = "";
  var totalPrice = 0;

  for (var i = 0; i < clients.length; i++) {
    if (clients[i].createdBy === allUsersLogin[0].userEmail) {
      container += `<tr>
      <td>${i + 1}</td>
      <td>${clients[i].name}</td>
      <td>${clients[i].phone}</td>
      <td>${clients[i].department}</td>
      <td>${clients[i].price}</td>
      <td>${clients[i].employee}</td>
      <td><i id="updateBtn" onclick="getClientInfo(${i})" class="fa-solid fa-pen-to-square" title="update" ></i>
      <i  id="deleteBtn" onclick="deleteClient(${i})"class="fa-solid fa-trash" title="delete"></i>
      </td>
      </tr>`;
      if (clients.length > 0) {
        total.style.opacity = "1";
        totalPrice += Number(clients[i].price);
      }
      tbody.innerHTML = container;
      total.innerHTML = totalPrice + " EGP";
    }
  }
}

function getClientInfo(index) {
  currentIndex = index;
  var currentClient = clients[currentIndex];
  clientInput.value = currentClient.name;
  phoneInput.value = currentClient.phone;
  departmentInput.value = currentClient.department;
  priceInput.value = currentClient.price;
  employeeInput.value = currentClient.employee;
  addBtn.innerHTML = `<i class="fa-solid fa-pen-to-square" id="currentUpdate"></i> Update`;
  addBtn.style.background = "#FDB400";
  addBtn.style.color = "#000";
  document.getElementById("currentUpdate").style.color = "#000";
}

function updateClientInfo() {
  let clientInfo = {
    name: clientInput.value,
    phone: phoneInput.value,
    department: departmentInput.value,
    price: Number(priceInput.value),
    employee: employeeInput.value,
    createdBy: allUsersLogin[0].userEmail,
  };

  clients[currentIndex] = clientInfo;
  localStorage.setItem("clientsList", JSON.stringify(clients));
  addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>Add New`;
  addBtn.style.background = "#0057FF";
  addBtn.style.color = "#fff";
}

function deleteClient(index) {
  clients.splice(index, 1);
  localStorage.setItem("clientsList", JSON.stringify(clients));
  displayData();

  if (clients.length == 0) {
    tbody.innerHTML = "";
    total.innerHTML = "";
    deleteAllBtn.disabled = "true";
  }
}

deleteYes.onclick = function () {
  localStorage.removeItem("clientsList");
  clients = [];
  tbody.innerHTML = "";
  total.innerHTML = "";
  deleteAllBtn.disabled = "true";
};

search.onkeyup = function () {
  var container = "";
  var totalPrice = 0;
  var searchTerm = search.value.toLowerCase();

  for (var i = 0; i < clients.length; i++) {
    if (
      (clients[i].name.toLowerCase().includes(searchTerm) ||
        clients[i].phone.toLowerCase().includes(searchTerm) ||
        clients[i].department.toLowerCase().includes(searchTerm) ||
        clients[i].employee.toLowerCase().includes(searchTerm)) &&
      clients[i].createdBy === allUsersLogin[0].userEmail
    ) {
      const highlightedName = clients[i].name.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<mark style="background-color: #FDB400;">${match}</mark>`
      );
      const highlightedPhone = clients[i].phone.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<mark style="background-color: #FDB400;">${match}</mark>`
      );
      const highlightedDepartment = clients[i].department.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<mark style="background-color: #FDB400;">${match}</mark>`
      );
      const highlightedEmployee = clients[i].employee.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<mark style="background-color: #FDB400;">${match}</mark>`
      );

      container += `<tr>
        <td>${i + 1}</td>
        <td>${highlightedName}</td>
        <td>${highlightedPhone}</td>
        <td>${highlightedDepartment}</td>
        <td>${clients[i].price}</td>
        <td>${highlightedEmployee}</td>
        <td>
          <i id="updateBtn" onclick="getClientInfo(${i})" class="fa-solid fa-pen-to-square" title="update"></i>
          <i id="deleteBtn" onclick="deleteClient(${i})" class="fa-solid fa-trash" title="delete"></i>
        </td>
      </tr>`;
      totalPrice += Number(clients[i].price);
    }
  }

  if (totalPrice == 0) {
    total.style.opacity = "0";
  } else {
    total.style.opacity = "1";
  }

  tbody.innerHTML = container;
  total.innerHTML = totalPrice + " EGP";

  if (searchTerm === "") {
    document
      .querySelectorAll("mark")
      .forEach((mark) => (mark.style.display = "none"));
  }
};

// _________________________________________________________________________________________

var errorMessageArray = document.getElementsByClassName("error-message");
var regexName = /^[a-zA-Z]{3,9}(?:\s[a-zA-Z]{3,9})*$/;
var regexPhone = /^01[0125][0-9]{8}$/;
var regexDepartment = /^[a-zA-Z]{3,11}(?:\s[a-zA-Z]{3,11})*$/;
var regexPrice = /^\d+(\.\d{1,2})?$/;
var regexEmployee = /^[a-zA-Z]{3,9}(?:\s[a-zA-Z]{3,9})*$/;

let displayError = (regex, input, errorMessage) => {
  if (regex.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    addBtn.removeAttribute("disabled");
    errorMessage.classList.add("d-none");
    addValidation();
  } else {
    input.classList.add("is-invalid");
    addBtn.disabled = "true";
    errorMessage.classList.remove("d-none");
  }
};

function addValidation() {
  for (var i = 1; i <= inputs.length - 2; i++) {
    if (inputs[i].value == "") {
      addBtn.disabled = "true";
    } else {
      if (
        regexName.test(clientInput.value) &&
        regexPhone.test(phoneInput.value) &&
        regexDepartment.test(departmentInput.value) &&
        regexPrice.test(priceInput.value) &&
        regexEmployee.test(employeeInput.value)
      ) {
        addBtn.removeAttribute("disabled");
        inputs[i].classList.add("is-valid");
        inputs[i].classList.remove("is-invalid");
      } else {
        addBtn.disabled = "true";
      }
    }
  }
}

clientInput.onkeyup = function () {
  displayError(regexName, clientInput, errorMessageArray[0]);
};
phoneInput.onkeyup = function () {
  displayError(regexPhone, phoneInput, errorMessageArray[1]);
};
departmentInput.onkeyup = function () {
  displayError(regexDepartment, departmentInput, errorMessageArray[2]);
};
priceInput.onkeyup = function () {
  displayError(regexPrice, priceInput, errorMessageArray[3]);
};
employeeInput.onkeyup = function () {
  displayError(regexEmployee, employeeInput, errorMessageArray[4]);
};

// _______________________________________________________
let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("allUsersLogin");
});

// _________
let openTab = document.querySelector("i.fa-outdent");
let closeTab = document.querySelector("i.fa-circle-xmark");
let links = document.querySelector(".col-md-3 .front");

openTab.addEventListener("click", () => {
  links.style.transform = "scale(1, 1)";
    openTab.style.display = "inline";
    closeTab.style.display = "inline";
});

closeTab.addEventListener("click", () => {
  links.style.transform = "scale(0, 0.5)";
    openTab.style.display = "inline";
    closeTab.style.display = "none";    
});

function toggleLinks(isOpen) {
  if (isOpen) {
    links.style.transform = "scale(1, 1)";
    openTab.style.display = "inline";
    closeTab.style.display = "inline";
  } else {
    links.style.transform = "scale(1, 1)";
    openTab.style.display = "none";
    closeTab.style.display = "none";    
  }
}

function checkResponsive() {
  const responsiveThreshold = 992;
  const windowWidth = window.innerWidth;

  if (windowWidth < responsiveThreshold) {
    toggleLinks(true);
  } else {
    toggleLinks(false);
  }
}

checkResponsive();

window.addEventListener("resize", checkResponsive);


