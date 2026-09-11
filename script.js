const API_URL = "https://jsonplaceholder.typicode.com/users";

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const addBtn = document.getElementById("addBtn");
const userList = document.getElementById("userList");

// ========== READ (Afficher les utilisateurs) ==========
async function afficher() {
  const response = await fetch(API_URL);
  const users = await response.json();

  userList.innerHTML = ""; // On vide la liste

  users.forEach(user => {
    const li = document.createElement("li");
    li.className = "user-item";

   li.innerHTML = `
  <span>\( {user.name} ( \){user.email})</span>
  <button class="delete-btn" data-id="${user.id}">Supprimer</button>
`;

    userList.appendChild(li);
  });

  // On ajoute les événements de suppression
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      supprimer(id);
    });
  });
}

// ========== CREATE (Ajouter un utilisateur) ==========
async function ajouter() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name === "" || email === "") {
    alert("Remplis le nom et l'email !");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      email: email
    })
  });

  const newUser = await response.json();
  console.log("Utilisateur ajouté :", newUser);

  // On vide les champs
  nameInput.value = "";
  emailInput.value = "";

  // On recharge la liste
  afficher();
}

// ========== DELETE (Supprimer) ==========
async function supprimer(id) {
  await fetch(`\( {API_URL}/ \){id}`, {
    method: "DELETE"
  });

  console.log("Utilisateur supprimé");
  afficher(); // On recharge la liste
}

// ========== Événements ==========
addBtn.addEventListener("click", ajouter);

// On charge les utilisateurs au démarrage
afficher();