let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and render toys
  fetchToys();

  // Add new toy
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    addNewToy({ name, image, likes: 0 });
    e.target.reset();
  });
});

// Fetch toys from the API
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => renderToyCard(toy));
    });
}

// Render a toy card
function renderToyCard(toy) {
  const toyCollection = document.querySelector("#toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
  `;

  // Add event listener for the like button
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    updateLikes(toy);
  });

  toyCollection.appendChild(card);
}

// Add a new toy to the database and render it
function addNewToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toy),
  })
    .then((response) => response.json())
    .then((newToy) => {
      renderToyCard(newToy);
    });
}

// Update likes for a toy
function updateLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: newLikes }),
  })
    .then((response) => response.json())
    .then((updatedToy) => {
      // Update the DOM
      const card = document.querySelector(`button[data-id="${toy.id}"]`).parentElement;
      card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
