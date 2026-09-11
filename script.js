const API_URL = "https://jsonplaceholder.typicode.com/users";

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const addBtn = document.getElementById("addBtn");
const userList = document.getElementById("userList");

// Variable pour savoir si on est en train de modifier un utilisateur
let editUserId = null;

// ========== READ (Afficher les utilisateurs) ==========
async function afficher() {
  try {
    const response = await fetch(API_URL);
    const users = await response.json();

    userList.innerHTML = ""; // On vide la liste

    users.forEach(user => {
      ajouterUtilisateurDansDOM(user);
    });
  } catch (error) {
    console.error("Erreur lors du chargement :", error);
  }
}

// Fonction utilitaire pour ajouter un element dans la liste HTML
function ajouterUtilisateurDansDOM(user) {
  const li = document.createElement("li");
  li.className = "user-item";
  li.setAttribute("data-id", user.id);

  li.innerHTML = `
    <span><strong>${user.name}</strong> (${user.email})</span>
    <div class="actions">
      <button class="edit-btn">Modifier</button>
      <button class="delete-btn">Supprimer</button>
    </div>
  `;

  // Gestion de la suppression
  li.querySelector(".delete-btn").addEventListener("click", () => {
    supprimer(user.id, li);
  });

  // Gestion de la modification (remplit les champs)
  li.querySelector(".edit-btn").addEventListener("click", () => {
    preparerModification(user, li);
  });

  userList.appendChild(li);
}

// ========== CREATE / UPDATE (Ajouter ou Modifier) ==========
async function enregistrer() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name === "" || email === "") {
    alert("Veuillez remplir le nom et l'email !");
    return;
  }

  // Si editUserId n'est pas null, on MODIFIE (UPDATE)
  if (editUserId !== null) {
    await modifier(editUserId, name, email);
  } 
  // Sinon, on AJOUTE (CREATE)
  else {
    await ajouter(name, email);
  }

  // Réinitialiser le formulaire
  reinitialiserFormulaire();
}

// Sub-fonction Ajouter
async function ajouter(name, email) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const newUser = await response.json();
    // JSONPlaceholder renvoie toujours l'ID 11 pour les POSTs
    // On génère un ID unique temporaire si besoin
    newUser.id = newUser.id || Date.now(); 

    ajouterUtilisateurDansDOM(newUser);
    console.log("Utilisateur ajouté :", newUser);
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
  }
}

// Sub-fonction Modifier (PUT)
async function modifier(id, name, email) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    // Mettre à jour l'élément dans le DOM directement
    const li = userList.querySelector(`li[data-id="${id}"]`);
    if (li) {
      li.querySelector("span").innerHTML = `<strong>${name}</strong> (${email})`;
    }

    console.log("Utilisateur modifié avec succès");
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
  }
}

// Prépare le formulaire pour l'édition
function preparerModification(user, liElement) {
  nameInput.value = user.name;
  emailInput.value = user.email;
  editUserId = user.id;

  addBtn.textContent = "Mettre à jour";
  addBtn.style.backgroundColor = "#ff9800"; // Couleur orange pour différencier
}

// Réinitialise l'état du formulaire
function reinitialiserFormulaire() {
  nameInput.value = "";
  emailInput.value = "";
  editUserId = null;
  addBtn.textContent = "Ajouter";
  addBtn.style.backgroundColor = "#4CAF50";
}

// ========== DELETE (Supprimer) ==========
async function supprimer(id, elementHTML) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    // Supprimer directement l'élément du DOM
    elementHTML.remove();
    console.log(`Utilisateur avec l'ID ${id} supprimé`);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// ========== Événements ==========
addBtn.addEventListener("click", enregistrer);

// Lancer le chargement initial
afficher();