import "./style.css"
import "./index.css"

import { createElement } from "./components.js"
import { leftBox, centerBox, rightBox, loginPage } from "./ui/components.js"
import { showElement } from "./ui/uiManager.js"
import { renderMessage } from "./ui/renderers.js"
import { sendMessage, selectItem } from "./handlers/eventHandlers.js"
import { isUserLoggedIn, restoreUserSession, restoreUserData } from "./auth/authManager.js"

// Variables globales pour l'accès depuis les composants
window.selectItem = selectItem;

const app = createElement(
    "div", 
    {
        id:"app",
        class: ["w-[95%]", "h-[95%]", "flex","shadow-xl"],
        style: { display: "none" } // Masqué par défaut
    },
    [
      leftBox,
      centerBox,
      rightBox
    ]
);

// Event listeners
document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && event.target.id === 'message-input') {
    sendMessage();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('input[placeholder="Rechercher"]');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      if (document.getElementById("list-message").style.display !== "none") {
        renderMessage();
      }
    });
  }
});

// Initialisation de l'application
document.body.appendChild(loginPage);
document.body.appendChild(app);

// Fonction d'initialisation
function initializeApplication() {
  // Essayer de restaurer une session existante
  const sessionRestored = restoreUserSession();
  
  if (sessionRestored && isUserLoggedIn()) {
    // Session valide trouvée
    document.getElementById("login-page").style.display = "none";
    document.getElementById("app").style.display = "flex";
    
    // Restaurer les données utilisateur
    const userData = restoreUserData();
    if (userData) {
      restoreApplicationData(userData);
    }
    
    showElement("list-message");
    renderMessage();
    console.log("Application initialisée avec session existante");
  } else {
    // Aucune session valide
    document.getElementById("login-page").style.display = "flex";
    document.getElementById("app").style.display = "none";
    console.log("Aucune session trouvée, affichage de la page de connexion");
  }
}

// Fonction pour restaurer les données de l'application
function restoreApplicationData(userData) {
  try {
    // Importer les constantes et restaurer les données
    import("./consts.js").then(module => {
      if (userData.conversations) {
        Object.assign(module.CONVERSATIONS, userData.conversations);
      }
      
      if (userData.groups && userData.groups.length > 0) {
        module.GROUPES.length = 0;
        module.GROUPES.push(...userData.groups);
      }
      
      if (userData.contacts && userData.contacts.length > 0) {
        module.CONTACT.length = 0;
        module.CONTACT.push(...userData.contacts);
      }
      
      if (userData.archivedContacts) {
        module.ARCHIVED_CONTACTS.length = 0;
        module.ARCHIVED_CONTACTS.push(...userData.archivedContacts);
      }
      
      if (userData.archivedGroups) {
        module.ARCHIVED_GROUPS.length = 0;
        module.ARCHIVED_GROUPS.push(...userData.archivedGroups);
      }
      
      console.log("Données restaurées depuis localStorage");
    });
  } catch (error) {
    console.error("Erreur lors de la restauration:", error);
  }
}

// Fonction pour sauvegarder périodiquement les données
function setupAutoSave() {
  setInterval(() => {
    if (isUserLoggedIn()) {
      import("./consts.js").then(module => {
        import("./auth/authManager.js").then(authModule => {
          const userData = {
            conversations: module.CONVERSATIONS,
            groups: module.GROUPES,
            contacts: module.CONTACT,
            archivedContacts: module.ARCHIVED_CONTACTS,
            archivedGroups: module.ARCHIVED_GROUPS
          };
          authModule.saveUserData(userData);
        });
      });
    }
  }, 3000); // Sauvegarde toutes les 3 secondes
}

// Démarrer l'application
initializeApplication();
setupAutoSave();