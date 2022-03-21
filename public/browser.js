function itemtemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>`;
}

// initial page lode render
let ourHTML = items
  .map(function (item) {
    return itemtemplate(item);
  })
  .join("");

document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// create feature
let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();

  axios
    .post("/create-item", { text: createField.value })
    .then(function (response) {
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemtemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch(function () {
      console.log("err from browser side");
    });
});

document.addEventListener("click", function (e) {
  //delete feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("delete item?")) {
      axios
        .post("/delete-item", { id: e.target.getAttribute("data-id") })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log("err from browser side");
        });
    }
  }

  //update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(
      "enter new text",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );

    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(function () {
          console.log("err from browser side");
        });
    }
  }
});
