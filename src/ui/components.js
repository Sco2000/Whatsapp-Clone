import { createElement } from "../components.js";
import { FONT, RIGHT_BUTTONS, DEFAULT_USER, GROUPES } from "../consts.js";
import { handleButtonClick, handleRightButtonClick, addContact, addGroup, sendMessage } from "../handlers/eventHandlers.js";
import { showElement } from "./uiManager.js";
import { closeMembersModal, toggleAddMemberForm, addMembersToGroup } from "./uiManager.js";

export const leftBox = createElement("div", {
  class: ["w-[7%]", "h-full", "bg-[#f0efe8]", "flex", "flex-col", "gap-3", "items-center", "justify-center"],
  vFor: {
    each: FONT,
    render: (item) => {
        return createElement("button",{
          class: ["w-[80%]", "h-[10%]",  "border", "border-[#e1b447]", "rounded-xl", "hover:bg-orange-200"],
          id: item.id,
          onclick: () => {
            handleButtonClick(item.id)
        }
        }, [createElement("i",  {class: item.item}), createElement("div",{class:["text-xs", "text-slate-800"]}, item.text)])
    }
  }
});

export const formAddContact = createElement("div", {
    class: ["w-[80%]", "h-[60%]", "bg-[#f0efe8]", "m-20", "flex", "flex-col", "gap-4", "items-center", "rounded-2xl", "p-6"],
    id: "form-add-contact"
}, 
  [
    createElement("div", {
      class: ["text-xl", "font-semibold", "text-gray-800", "mb-2"]
    }, "Ajouter un nouveau contact"),
    
    createElement("input", {
      placeHolder: "Nom et Prénom",
      class: ["w-2/3", "h-12", "rounded-lg", "p-3", "border", "border-gray-300", "focus:border-[#e1b447]", "focus:outline-none", "bg-white"],
      id: "inputName"
    }),
    
    createElement("input", {
      placeHolder: "Téléphone",
      class: ["w-2/3", "h-12", "rounded-lg", "p-3", "border", "border-gray-300", "focus:border-[#e1b447]", "focus:outline-none", "bg-white"],
      id: "inputTel",
      type: "tel"
    }),
    
    createElement("div", {
      class: ["flex", "gap-3", "mt-4"]
    }, [
      createElement("button", {
        class: ["px-6", "py-2", "bg-[#e1b447]", "text-white", "rounded-xl", "hover:bg-[#d4a017]", "transition-colors"],
        onclick: addContact
      }, "Ajouter"),
      createElement("button", {
        class: ["px-6", "py-2", "bg-gray-300", "text-gray-700", "rounded-xl", "hover:bg-gray-400", "transition-colors"],
        onclick: () => {
          document.getElementById("inputName").value = "";
          document.getElementById("inputTel").value = "";
        }
      }, "Annuler")
    ])
  ]);

export const formAddGroup = createElement("div", {
    class: ["w-[80%]", "h-[80%]", "bg-[#f0efe8]", "m-20", "flex", "flex-col", "gap-2", "items-center", "rounded-2xl", "p-4", "overflow-y-auto"],
    id: "form-add-group"
}, 
  [
    createElement("div", {}, createElement("div", {class:["text-xl", "mb-4"]}, "Ajouter un nouveau groupe")),
    createElement("input", {
      placeHolder: "Nom du groupe",
      class:["w-2/3", "h-[8%]", "rounded", "p-2", "mb-4"],
      id: "inputGroupName"
    }),
    createElement("div", {class: ["text-lg", "mb-2"]}, "Sélectionner les contacts :"),
    createElement("div", {class: ["text-sm", "text-gray-600", "mb-2"]}, `Vous (${DEFAULT_USER.name}) serez automatiquement ajouté au groupe`),
    createElement("div", {
      class: ["w-full", "flex", "flex-col", "gap-2", "max-h-[50%]", "overflow-y-auto", "mb-4"],
      id: "contacts-selection"
    }),
    createElement("div", {class: ["flex", "gap-4"]}, [
      createElement("button", {
        class: ["w-[120px]", "h-[40px]", "bg-[#e1b447]", "rounded-xl", "text-center"],
        onclick: addGroup
      }, "Créer"),
      createElement("button", {
        class: ["w-[120px]", "h-[40px]", "bg-gray-400", "rounded-xl", "text-center"],
        onclick: () => showElement("list-groupe")
      }, "Annuler")
    ])
  ]);

export const membersModal = createElement("div", {
  class: ["fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "hidden"],
  id: "members-modal",
  onclick: (e) => {
    if (e.target.id === 'members-modal') {
      closeMembersModal();
    }
  }
}, [
  createElement("div", {
    class: ["bg-white", "rounded-lg", "p-6", "max-w-[40%]", "w-full", "mx-4", "max-h-96", "overflow-y-auto"]
  }, [
    createElement("div", {
      class: ["flex", "justify-between", "items-center", "mb-4"]
    }, [
      createElement("h2", {
        class: ["text-xl", "font-bold"],
        id: "modal-group-name"
      }, "Membres du groupe"),
      createElement("button", {
        class: ["bg-[#e1b447]","size-8","flex", "justify-center", "items-center", "rounded-full","text-white"],
        onclick: toggleAddMemberForm,
        title: "Ajouter un membre"
      }, createElement("i", {class: ["fa-solid", "fa-plus"]})),
      createElement("button", {
        class: ["bg-[#e1b447]","size-8","flex", "justify-center", "items-center", "rounded-full","text-white"],
        onclick: closeMembersModal
      }, createElement("i", {class: ["fa-solid", "fa-xmark"]}))
    ]),
    
    // Formulaire d'ajout de membres (caché par défaut)
    createElement("div", {
      class: ["mb-4", "p-4", "bg-gray-50", "rounded-lg"],
      id: "add-member-form",
      vShow: false
    }, [
      createElement("div", {
        class: ["text-lg", "font-semibold", "mb-3"]
      }, "Ajouter des membres"),
      
      createElement("div", {
        class: ["mb-3"]
      }, [
        createElement("label", {
          class: ["block", "text-sm", "font-medium", "text-gray-700", "mb-2"]
        }, "Sélectionner les contacts à ajouter :"),
        createElement("div", {
          class: ["max-h-32", "overflow-y-auto", "border", "border-gray-300", "rounded", "p-2"],
          id: "available-contacts-list"
        })
      ]),
      
      createElement("div", {
        class: ["flex", "gap-2", "justify-end"]
      }, [
        createElement("button", {
          class: ["px-4", "py-2", "bg-[#e1b447]", "text-white", "rounded", "hover:bg-[#d4a017]", "transition-colors"],
          onclick: addMembersToGroup
        }, "Ajouter"),
        createElement("button", {
          class: ["px-4", "py-2", "bg-gray-300", "text-gray-700", "rounded", "hover:bg-gray-400", "transition-colors"],
          onclick: () => toggleAddMemberForm(false)
        }, "Annuler")
      ])
    ]),
    
    createElement("div", {
      class: ["space-y-3"],
      id: "members-list"
    })
  ])
]);

export const listContact = createElement("div",{
  class: ["w-full", "h-[90%]", "flex", "flex-col", "items-center", "gap-1"],
  id: "list-contact"
});

export const listGroup = createElement("div", {
  class: ["w-full", "h-[90%]", "flex", "flex-col", "items-center", "gap-1", "relative"],
  id: "list-groupe"
}, [
  createElement("div", {
    class: ["w-full", "flex", "flex-col", "items-center", "gap-1"],
    id: "groups-container"
  }),
  createElement("button", {
    class: ["size-16", "absolute", "border", "border-[#e1b447]", "bottom-4", "right-4", "rounded-full", "bg-white", "hover:bg-[#e1b447]"],
    id: "add-groupe",
    onclick: () => showElement("form-add-group")
  }, createElement("i", {class: ["fa-solid", "fa-plus"]}))
]);

export const listArchive = createElement("div", {
  class: ["w-full", "h-[90%]", "flex", "flex-col", "items-center", "gap-1"],
  id: "list-archive"
});

export const listMessage = createElement("div", {
  class: ["w-full", "h-[90%]", "flex", "flex-col", "items-center", "gap-1"],
  id: "list-message"
});

export const centerBox = createElement("div", {
  class: ["w-1/3", "h-full", "bg-[#f9f7f5]", "flex", "flex-col", "items-center"]
}, [
    createElement("div", {class: ["w-[97%]","h-[10%]", "flex", "flex-col", "gap-1"]}, 
      [ 
        createElement("h1",{class: "text-2xl", id:"menu"},"Discussions"),
        createElement("hr"),
        createElement("input", {
          placeHolder: "Rechercher",
          class: ["rounded", "p-1"]
        }),
      ]),
    formAddContact,
    formAddGroup,
    listContact,
    listGroup,
    listArchive,
    listMessage,
    membersModal
]);

export const rightBox = createElement("div", {
  class: ["w-[60%]", "h-full", "bg-[#efe7d7]", "flex", "flex-col"]
}, [
  createElement("div", {
    class: ["w-full", "h-[10%]", "bg-[#efe7d7]", "flex", "justify-between", "items-center", "px-4", "gap-3", "border-b", "border-white"]
  }, [createElement("div", {class: ["flex", "space-x-2"]}, 
      [
        createElement("div", {
        class: ["w-12", "h-12", "bg-gray-400", "rounded-full", "flex", "items-center", "justify-center"],
        id: "selected-avatar"
      }),
      createElement("div", {class: ["flex", "flex-col"]}, [
        createElement("div", {class: ["font-semibold", "text-lg"], id: "selected-name"}, "Sélectionnez un contact"),
        createElement("div", {class: ["text-sm", "text-gray-600"], id: "selected-status"}, "")
      ])
      ]),
      createElement("div", {
      class: ["flex", "gap-2"],
      vFor: {
        each: RIGHT_BUTTONS,
        render: (button) => {
          return createElement("button", {
            class: ["w-10", "h-10", "rounded-full", "flex", "items-center", "justify-center", "border", button.border],
            id: button.id,
            onclick: () => handleRightButtonClick(button.id)
          }, createElement("i", {class: button.item}))
        }
      }
    }),
  ]),
  
  createElement("div", {
    class: ["flex-1", "p-4", "overflow-y-auto"],
    id: "messages-area"
  }, [
    createElement("div", {class: ["text-center", "text-gray-500", "mb-4"]}, "Sélectionnez une conversation pour commencer"),
  ]),
  
  createElement("div", {
    class: ["w-full", "h-[10%]", "bg-white", "flex", "items-center", "px-1", "gap-2", "border-t", "border-gray-300"]
  }, [
    createElement("div", {class: ["flex-1", "mx-4"]}, [
      createElement("input", {
        class: ["w-full", "p-2", "bg-[#f0efe8]", "rounded-xl", "border", "border-gray-300", "outline-none"],
        placeholder: "Tapez votre message...",
        id: "message-input",
        disabled: true
      })
    ]),
    
    createElement("button", {
      class: ["w-12", "h-12", "bg-green-500", "rounded-full", "flex", "items-center", "justify-center", "hover:bg-green-600"],
      onclick: sendMessage,
      disabled: true,
      id: "send-button"
    }, createElement("i", {class: ["fa-solid", "fa-arrow-right", "text-white"]}))
  ])
]);

// Ajouter cette fonction
import { authenticateUser } from "../auth/authManager.js";

export const loginPage = createElement("div", {
  class: ["w-full", "h-full", "bg-gradient-to-br", "from-blue-50", "to-indigo-100", "flex", "items-center", "justify-center"],
  id: "login-page"
}, [
  createElement("div", {
    class: ["bg-white", "rounded-2xl", "shadow-xl", "p-8", "w-96", "max-w-md"]
  }, [
    createElement("div", {
      class: ["text-center", "mb-8"]
    }, [
      createElement("h1", {
        class: ["text-3xl", "font-bold", "text-gray-800", "mb-2"]
      }, "Connexion"),
      createElement("p", {
        class: ["text-gray-600"]
      }, "Accédez à votre messagerie")
    ]),
    
    createElement("form", {
      class: ["space-y-6"],
      id: "login-form"
    }, [
      createElement("div", {}, [
        createElement("label", {
          class: ["block", "text-sm", "font-medium", "text-gray-700", "mb-2"]
        }, "Nom complet"),
        createElement("input", {
          type: "text",
          id: "login-name",
          class: ["w-full", "px-4", "py-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-[#e1b447]", "focus:border-transparent", "outline-none"],
          placeholder: "Entrez votre nom complet",
          required: true
        })
      ]),
      
      createElement("div", {}, [
        createElement("label", {
          class: ["block", "text-sm", "font-medium", "text-gray-700", "mb-2"]
        }, "Numéro de téléphone"),
        createElement("input", {
          type: "tel",
          id: "login-phone",
          class: ["w-full", "px-4", "py-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-[#e1b447]", "focus:border-transparent", "outline-none"],
          placeholder: "Entrez votre numéro",
          required: true
        })
      ]),
      
      createElement("div", {
        class: ["text-red-500", "text-sm", "hidden"],
        id: "login-error"
      }),
      
      createElement("button", {
        type: "submit",
        class: ["w-full", "bg-[#e1b447]", "text-white", "py-3", "px-4", "rounded-lg", "font-medium", "hover:bg-[#d4a017]", "transition-colors", "duration-200"],
        onclick: handleLogin
      }, "Se connecter")
    ])
  ])
]);

function handleLogin(event) {
  event.preventDefault();
  
  const name = document.getElementById("login-name").value.trim();
  const phone = document.getElementById("login-phone").value.trim();
  const errorDiv = document.getElementById("login-error");
  
  // Validation
  if (!name || !phone) {
    showLoginError("Veuillez remplir tous les champs");
    return;
  }
  
  // Authentification
  const result = authenticateUser(name, phone);
  
  if (result.success) {
    // Connexion réussie
    hideLoginPage();
    showMainApp();
  } else {
    showLoginError(result.message);
  }
}

function showLoginError(message) {
  const errorDiv = document.getElementById("login-error");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  
  // Effacer l'erreur après 5 secondes
  setTimeout(() => {
    if (errorDiv) {
      errorDiv.classList.add("hidden");
    }
  }, 5000);
}

function hideLoginPage() {
  const loginPage = document.getElementById("login-page");
  if (loginPage) {
    loginPage.style.display = "none";
  }
}

function showMainApp() {
  const app = document.getElementById("app");
  if (app) {
    app.style.display = "flex";
  }
  
  // Charger les données utilisateur et initialiser l'application
  import("../auth/authManager.js").then(authModule => {
    const userData = authModule.restoreUserData();
    
    import("../ui/renderers.js").then(module => {
      import("../ui/uiManager.js").then(uiModule => {
        // Restaurer les données si elles existent
        if (userData) {
          restoreApplicationData(userData);
        }
        
        uiModule.showElement("list-message");
        module.renderMessage();
        
        // Mettre à jour l'interface avec les infos utilisateur
        updateUserInterface();
      });
    }).catch(error => {
      console.error("Erreur lors du chargement de l'application:", error);
      showLoginError("Une erreur est survenue lors du chargement de l'application.");
    });
  });
}

// Nouvelle fonction pour restaurer les données de l'application
function restoreApplicationData(userData) {
  try {
    // Restaurer les conversations
    if (userData.conversations) {
      import("../consts.js").then(module => {
        Object.assign(module.CONVERSATIONS, userData.conversations);
      });
    }
    
    // Restaurer les groupes
    if (userData.groups && userData.groups.length > 0) {
      import("../consts.js").then(module => {
        module.GROUPES.length = 0; // Vider le tableau
        module.GROUPES.push(...userData.groups);
        console.log(GROUPES);
        
      });
    }
    
    // Restaurer les contacts
    if (userData.contacts && userData.contacts.length > 0) {
      import("../consts.js").then(module => {
        module.CONTACT.length = 0; // Vider le tableau
        module.CONTACT.push(...userData.contacts);
      });
    }
    
    // Restaurer les archives
    if (userData.archivedContacts) {
      import("../consts.js").then(module => {
        module.ARCHIVED_CONTACTS.length = 0;
        module.ARCHIVED_CONTACTS.push(...userData.archivedContacts);
      });
    }
    
    if (userData.archivedGroups) {
      import("../consts.js").then(module => {
        module.ARCHIVED_GROUPS.length = 0;
        module.ARCHIVED_GROUPS.push(...userData.archivedGroups);
      });
    }
    
    console.log("Données de l'application restaurées");
  } catch (error) {
    console.error("Erreur lors de la restauration des données:", error);
  }
}

// Fonction pour mettre à jour l'interface utilisateur
function updateUserInterface() {
  import("../auth/authManager.js").then(authModule => {
    const currentUser = authModule.getCurrentUser();
    
    // Mettre à jour le formulaire de groupe avec le nom de l'utilisateur
    const groupUserInfo = document.querySelector('#form-add-group .text-gray-600');
    if (groupUserInfo) {
      groupUserInfo.textContent = `Vous (${currentUser.name}) serez automatiquement ajouté au groupe`;
    }
    
    console.log(`Interface mise à jour pour l'utilisateur: ${currentUser.name}`);
  });
}

// Ajouter cette fonction pour nettoyer l'interface après déconnexion
function resetLoginInterface() {
  const loginName = document.getElementById("login-name");
  const loginPhone = document.getElementById("login-phone");
  const loginError = document.getElementById("login-error");
  
  if (loginName) {
    loginName.value = "";
    loginName.focus(); // Mettre le focus sur le champ nom
  }
  if (loginPhone) loginPhone.value = "";
  if (loginError) loginError.classList.add("hidden");
}