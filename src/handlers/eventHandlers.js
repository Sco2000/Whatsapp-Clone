import { FONT, CONTACT, GROUPES, DEFAULT_USER } from "../consts.js";
import { setClass, removeClass, phoneExists, generateUniqueName, showError, clearError, getInitials } from "../utils/helpers.js";
import { generateConversationId, createMessage, saveMessage } from "../data/messageManager.js";
import { archiveItem } from "../data/archiveManager.js";
import { showElement, resetSelection, displayMessages } from "../ui/uiManager.js";
import { renderContact, renderGroup, renderArchive, renderMessage } from "../ui/renderers.js";
import { logout, saveUserData } from "../auth/authManager.js";

let selectedItem = null;
let selectedType = null;

export function handleButtonClick(buttonId) {
  FONT.forEach(element => {
    const e = document.getElementById(element.id);
    if(e.classList.contains("bg-[#e1b447]")){
      e.classList.remove("bg-[#e1b447]");
    }
    if(!e.classList.contains("hover:bg-orange-200")){
      e.classList.add("hover:bg-orange-200");
    }
  });

  resetSelection();
  
  const menu = document.getElementById("menu");
  
  switch(buttonId) {
    case "nouveau":
      setClass("nouveau", "bg-[#e1b447]");
      removeClass("nouveau", "hover:bg-orange-200");
      showElement("form-add-contact");
      menu.innerHTML = "Nouveau";
      break;
    case "diffusions":
      setClass("diffusions", "bg-[#e1b447]");
      removeClass("diffusions", "hover:bg-orange-200");
      showElement("list-contact");
      menu.innerHTML = "Diffusion";
      renderContact();
      break;
    case "groupes":
      setClass("groupes", "bg-[#e1b447]");
      removeClass("groupes", "hover:bg-orange-200");
      showElement("list-groupe");
      menu.innerHTML = "Groupes";
      renderGroup();
      break;
    case "archives":
      setClass("archives", "bg-[#e1b447]");
      removeClass("archives", "hover:bg-orange-200");
      showElement("list-archive");
      menu.innerHTML = "Archives";
      renderArchive();
      break;
    case "message":
      setClass("message", "bg-[#e1b447]");
      removeClass("message", "hover:bg-orange-200");
      showElement("list-message");
      menu.innerHTML = "Message";
      renderMessage();
      break;
    case "deconnexion":
      handleLogout();
      break;
    default:
      break;
  }
}

export function handleLogout() {
    // Sauvegarder les données avant de se déconnecter
    saveCurrentUserData();
    
    // Déconnecter l'utilisateur
    logout();
    
    // Réinitialiser l'état de l'application
    resetApplicationState();
    
    // Masquer l'application principale
    const app = document.getElementById("app");
    if (app) {
      app.style.display = "none";
    }
    
    // Afficher la page de connexion
    const loginPage = document.getElementById("login-page");
    if (loginPage) {
      loginPage.style.display = "flex";
    }
    
    // Réinitialiser les champs de connexion
    resetLoginForm();
    
    console.log("Déconnexion réussie");
}

function saveCurrentUserData() {
  try {
    import("../consts.js").then(module => {
      const userData = {
        conversations: module.CONVERSATIONS,
        groups: module.GROUPES,
        contacts: module.CONTACT,
        archivedContacts: module.ARCHIVED_CONTACTS,
        archivedGroups: module.ARCHIVED_GROUPS
      };
      saveUserData(userData);
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde avant déconnexion:", error);
  }
}

function resetApplicationState() {
  // Réinitialiser la sélection
  resetSelection();
  
  // Réinitialiser les variables globales
  selectedItem = null;
  selectedType = null;
  
  // Vider les zones de contenu
  const elementsToReset = [
    "list-contact",
    "list-groupe", 
    "list-archive",
    "list-message",
    "messages-area"
  ];
  
  elementsToReset.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = "";
    }
  });
  
  // Réinitialiser les formulaires
  resetForms();
  
  // Fermer les modals ouvertes
  closeModals();
  
  // Réinitialiser les boutons de navigation
  resetNavigationButtons();
  
  // Réinitialiser les données de l'application
  resetApplicationData();
  
  console.log("État de l'application réinitialisé");
}

function resetForms() {
  const forms = ["form-add-contact", "form-add-group"];
  forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
      const inputs = form.querySelectorAll("input");
      inputs.forEach(input => {
        if (input.type === "checkbox") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });
    }
  });
}

function closeModals() {
  const modal = document.getElementById("members-modal");
  if (modal && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
  }
}

function resetNavigationButtons() {
  import("../consts.js").then(module => {
    module.FONT.forEach(element => {
      const btn = document.getElementById(element.id);
      if (btn) {
        btn.classList.remove("bg-[#e1b447]");
        if (!btn.classList.contains("hover:bg-orange-200")) {
          btn.classList.add("hover:bg-orange-200");
        }
      }
    });
  });
}

function resetApplicationData() {
  import("../consts.js").then(module => {
    // Vider les conversations
    Object.keys(module.CONVERSATIONS).forEach(key => {
      delete module.CONVERSATIONS[key];
    });
    
    // Vider les groupes (garder les groupes par défaut si nécessaire)
    module.GROUPES.length = 0;
    
    // Vider les contacts (garder les contacts par défaut si nécessaire)
    module.CONTACT.length = 0;
    
    // Vider les archives
    module.ARCHIVED_CONTACTS.length = 0;
    module.ARCHIVED_GROUPS.length = 0;
  });
}

function resetLoginForm() {
  const loginName = document.getElementById("login-name");
  const loginPhone = document.getElementById("login-phone");
  const loginError = document.getElementById("login-error");
  
  if (loginName) loginName.value = "";
  if (loginPhone) loginPhone.value = "";
  if (loginError) loginError.classList.add("hidden");
}

export function selectItem(item, type) {
  selectedItem = item;
  selectedType = type;
  
  const inputElement = document.querySelector("input[placeholder=Rechercher]");
  const nameElement = document.getElementById("selected-name");
  const avatarElement = document.getElementById("selected-avatar");
  const statusElement = document.getElementById("selected-status");
  inputElement.value = "";
  
  nameElement.textContent = item.name;
  avatarElement.textContent = getInitials(item.name);
  
  if (type === 'contact') {
    statusElement.textContent = "Contact";
  } else {
    const memberCount = Object.keys(item.users || {}).length;
    statusElement.textContent = `Groupe • ${memberCount} membre${memberCount > 1 ? 's' : ''}`;
  }
  
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  messageInput.disabled = false;
  sendButton.disabled = false;
  
  const conversationId = generateConversationId(item, type);
  displayMessages(conversationId, item);
}

export function handleRightButtonClick(buttonId) {
  if (!selectedItem) {
    return;
  }
  
  switch(buttonId) {
    case "delete":
      break;
    case "archive":
      if (archiveItem(selectedItem, selectedType)) {
        renderContact();
        renderMessage();
        renderGroup();
        resetSelection();
      }
      break;
    case "block":
      break;
    case "delete-final":
      break;
    default:
      break;
  }
}

export function sendMessage() {
  if (!selectedItem) return;
  
  const messageInput = document.getElementById("message-input");
  const messageText = messageInput.value.trim();
  
  if (messageText === "") return;
  
  const conversationId = generateConversationId(selectedItem, selectedType);
  
  const message = createMessage(
    messageText,
    DEFAULT_USER,
    selectedItem,
    conversationId
  );
  
  saveMessage(message, conversationId);
  displayMessages(conversationId, selectedItem);
  
  messageInput.value = "";
  renderMessage();
  
  if (selectedType === 'group') {
    renderGroup();
  }
}

export function addContact() {
  const newName = document.getElementById("inputName").value.trim();
  const newTel = document.getElementById("inputTel").value.trim();

  clearError("contact-error");

  if (newName === "" || newTel === "") {
    showError("contact-error", "Veuillez remplir tous les champs.");
    return;
  }
  if (isNaN(newTel)) {
    showError("contact-error", "Le numéro doit être numérique.");
    return;
  }
  if (phoneExists(newTel, CONTACT)) {
    showError("contact-error", "Ce numéro existe déjà.");
    return;
  }
  if (DEFAULT_USER.telephone === newTel) {
    showError("contact-error", "Ce numéro ne peut pas être le vôtre.");
    return;
  }
  
  const uniqueName = generateUniqueName(newName, CONTACT);
  CONTACT.push({name: uniqueName, telephone: newTel});

  document.getElementById("inputName").value = "";
  document.getElementById("inputTel").value = "";
  clearError("contact-error");
  renderContact();
}

export function addGroup() {
  const groupName = document.getElementById("inputGroupName").value.trim();
  clearError("group-error");

  if(groupName === "") {
    showError("group-error", "Veuillez donner un nom au groupe.");
    return;
  }

  const selectedContacts = {};
  // Ajouter l'utilisateur connecté comme admin
  selectedContacts[DEFAULT_USER.name] = {
    ...DEFAULT_USER,
    role: "admin" // Marquer comme admin
  };

  const checkboxes = document.querySelectorAll('#contacts-selection input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    showError("group-error", "Sélectionnez au moins un contact.");
    return;
  }

  checkboxes.forEach(checkbox => {
    const contactIndex = parseInt(checkbox.value);
    const contact = CONTACT[contactIndex];
    if (contact) {
      selectedContacts[contact.name] = {
        ...contact,
        role: "member" // Marquer comme membre
      };
    }
  });

  const newGroup = {
    name: groupName,
    users: selectedContacts,
    createdBy: DEFAULT_USER.id, // ID du créateur
    lastMessage: "",
    time: ""
  };

  GROUPES.push(newGroup);

  document.getElementById("inputGroupName").value = "";
  const allCheckboxes = document.querySelectorAll('#contacts-selection input[type="checkbox"]');
  allCheckboxes.forEach(checkbox => checkbox.checked = false);

  clearError("group-error");
  showElement("list-groupe");
  renderGroup();
}

export { selectedItem, selectedType };