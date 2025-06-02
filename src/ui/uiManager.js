import { createElement } from "../components.js";
import { loadMessages } from "../data/messageManager.js";
import { getInitials } from "../utils/helpers.js";
import { DEFAULT_USER, CONTACT, GROUPES} from "../consts.js";

const managedElements = ["form-add-contact", "form-add-group", "list-contact", "list-groupe", "list-archive", "list-message"];

export function hideAllElements() {
  managedElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "none";
    }
  });
}

export function showElement(elementId) {
  hideAllElements(); 
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = ""; 
    
    if (elementId === "form-add-group") {
      renderContactsSelection();
    }
  }
}

export function resetSelection() {
  const nameElement = document.getElementById("selected-name");
  const avatarElement = document.getElementById("selected-avatar");
  const statusElement = document.getElementById("selected-status");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const messagesArea = document.getElementById("messages-area");
  
  nameElement.textContent = "Sélectionnez un contact";
  avatarElement.textContent = "";
  statusElement.textContent = "";
  messageInput.disabled = true;
  sendButton.disabled = true;
  
  messagesArea.innerHTML = '';
  const defaultMessage = createElement("div", {
    class: ["text-center", "text-gray-500", "mb-4"]
  }, "Sélectionnez une conversation pour commencer");
  messagesArea.appendChild(defaultMessage);
}

export function displayMessages(conversationId, selectedItem) {
  const messagesArea = document.getElementById("messages-area");
  messagesArea.innerHTML = '';
  
  const messages = loadMessages(conversationId);
  
  if (messages.length === 0) {
    const welcomeMessage = createElement("div", {
      class: ["text-center", "text-gray-500", "mb-4"]
    }, `Conversation avec ${selectedItem.name}`);
    messagesArea.appendChild(welcomeMessage);
    return;
  }
  
  messages.forEach(message => {
    const isFromCurrentUser = message.sender.name === DEFAULT_USER.name;
    const messageElement = createElement("div", {
      class: [
        "p-3", "rounded-lg", "max-w-xs", "mb-2",
        isFromCurrentUser ? "bg-green-400" : "bg-gray-300",
        isFromCurrentUser ? "text-white" : "text-black",
        isFromCurrentUser ? "ml-auto" : "mr-auto"
      ]
    }, [
      createElement("div", {}, message.content),
      createElement("div", {
        class: ["text-xs", "mt-1", "opacity-75"]
      }, message.time)
    ]);
    messagesArea.appendChild(messageElement);
  });
  
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

export function renderContactsSelection() {
  const contactsContainer = document.getElementById("contacts-selection");
  if (contactsContainer && CONTACT) {
    contactsContainer.innerHTML = "";
    CONTACT.forEach((contact, index) => {
      const contactItem = createElement("div", {
        class: ["w-full", "flex", "justify-between", "items-center", "p-2", "bg-white", "rounded", "border"]
      }, [
        createElement("div", {class: ["flex", "items-center", "gap-2"]}, [
          createElement("div", {class: ["w-8", "h-8", "bg-gray-300", "rounded-full", "flex", "items-center", "justify-center"]}, 
            contact.name.charAt(0).toUpperCase()
          ),
          createElement("div", {class: ["flex", "flex-col"]}, [
            createElement("div", {class: ["font-medium"]}, contact.name),
            createElement("div", {class: ["text-sm", "text-gray-600"]}, contact.telephone)
          ])
        ]),
        createElement("input", {
          type: "checkbox",
          class: ["w-4", "h-4"],
          id: `contact-${index}`,
          value: index
        })
      ]);
      contactsContainer.appendChild(contactItem);
    });
  }
}

// Variable pour stocker le groupe actuellement sélectionné dans le modal
let currentModalGroup = null;

export function showMembersModal(group) {
  currentModalGroup = group;
  const modal = document.getElementById("members-modal");
  const groupNameElement = document.getElementById("modal-group-name");
  const membersList = document.getElementById("members-list");
  
  groupNameElement.textContent = `Membres de ${group.name}`;
  membersList.innerHTML = "";
  
  // Masquer le formulaire d'ajout au début
  const addMemberForm = document.getElementById("add-member-form");
  if (addMemberForm) {
    addMemberForm.style.display = "none";
  }
  
  // Afficher tous les membres du groupe
  Object.values(group.users || {}).forEach(member => {
    const memberElement = createElement("div", {
      class: ["flex", "items-center", "gap-3", "p-2", "bg-gray-50", "rounded"]
    }, [
      createElement("div", {
        class: ["w-10", "h-10", "bg-gray-300", "rounded-full", "flex", "items-center", "justify-center", "font-bold"]
      }, getInitials(member.name)),
      createElement("div", {
        class: ["flex-1"]
      }, [
        createElement("div", {
          class: ["font-medium"]
        }, member.name),
        createElement("div", {
          class: ["text-sm", "text-gray-600"]
        }, member.telephone || "Pas de numéro")
      ])
    ]);
    membersList.appendChild(memberElement);
  });
  
  modal.classList.remove("hidden");
}

export function toggleAddMemberForm(show = null) {
  const addMemberForm = document.getElementById("add-member-form");
  if (!addMemberForm) return;
  
  if (show === null) {
    // Toggle
    const isHidden = addMemberForm.style.display === "none";
    addMemberForm.style.display = isHidden ? "block" : "none";
    
    if (isHidden) {
      renderAvailableContacts();
    }
  } else {
    // Set specific state
    addMemberForm.style.display = show ? "block" : "none";
    if (show) {
      renderAvailableContacts();
    }
  }
}

export function renderAvailableContacts() {
  if (!currentModalGroup) return;
  
  const availableContactsList = document.getElementById("available-contacts-list");
  if (!availableContactsList) return;
  
  availableContactsList.innerHTML = "";
  
  // Filtrer les contacts qui ne sont pas déjà dans le groupe
  const groupMemberNames = Object.keys(currentModalGroup.users || {});
  const availableContacts = CONTACT.filter(contact => 
    !groupMemberNames.includes(contact.name)
  );
  
  if (availableContacts.length === 0) {
    const noContactsMessage = createElement("div", {
      class: ["text-gray-500", "text-center", "py-2"]
    }, "Tous les contacts sont déjà dans ce groupe");
    availableContactsList.appendChild(noContactsMessage);
    return;
  }
  
  availableContacts.forEach((contact, index) => {
    const contactItem = createElement("div", {
      class: ["flex", "items-center", "gap-2", "p-2", "hover:bg-gray-100", "rounded"]
    }, [
      createElement("input", {
        type: "checkbox",
        class: ["w-4", "h-4"],
        id: `available-contact-${index}`,
        value: contact.name
      }),
      createElement("div", {
        class: ["w-8", "h-8", "bg-gray-300", "rounded-full", "flex", "items-center", "justify-center", "font-bold"]
      }, getInitials(contact.name)),
      createElement("div", {
        class: ["flex-1"]
      }, [
        createElement("div", {
          class: ["font-medium"]
        }, contact.name),
        createElement("div", {
          class: ["text-sm", "text-gray-600"]
        }, contact.telephone)
      ])
    ]);
    availableContactsList.appendChild(contactItem);
  });
}

export function addMembersToGroup() {
  if (!currentModalGroup) return;
  
  const checkedBoxes = document.querySelectorAll('#available-contacts-list input[type="checkbox"]:checked');
  
  if (checkedBoxes.length === 0) {
    alert("Veuillez sélectionner au moins un contact à ajouter.");
    return;
  }
  
  // Ajouter les contacts sélectionnés au groupe
  checkedBoxes.forEach(checkbox => {
    const contactName = checkbox.value;
    const contact = CONTACT.find(c => c.name === contactName);
    
    if (contact && !currentModalGroup.users[contactName]) {
      currentModalGroup.users[contactName] = contact;
    }
  });
  
  // Mettre à jour le groupe dans la liste GROUPES
  const groupIndex = GROUPES.findIndex(g => g.name === currentModalGroup.name);
  if (groupIndex > -1) {
    GROUPES[groupIndex] = currentModalGroup;
  }
  
  // Rafraîchir l'affichage
  showMembersModal(currentModalGroup);
  toggleAddMemberForm(false);
  
  // Optionnel : rafraîchir la liste des groupes si elle est visible
  const groupsContainer = document.getElementById("groups-container");
  if (groupsContainer && groupsContainer.style.display !== "none") {
    // Importer et appeler renderGroup si nécessaire
    import("./renderers.js").then(module => {
      module.renderGroup();
    });
  }
  
  console.log(`${checkedBoxes.length} membre(s) ajouté(s) au groupe ${currentModalGroup.name}`);
}

export function closeMembersModal() {
  const modal = document.getElementById("members-modal");
  modal.classList.add("hidden");
}