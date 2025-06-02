import { createElement } from "../components.js";
import { CONTACT, GROUPES } from "../consts.js";
import { ARCHIVED_CONTACTS, ARCHIVED_GROUPS, restoreContact, restoreGroup } from "../data/archiveManager.js";
import { getContactsWithConversations, getGroupsWithConversations, generateConversationId, getLastMessage, getLastMessageTime } from "../data/messageManager.js";
import { getInitials, setFocus } from "../utils/helpers.js";
import { showMembersModal } from "./uiManager.js";
import { selectItem } from "../handlers/eventHandlers.js"

export function renderContact() {
  const list = document.getElementById("list-contact");
  if (list) {
    list.innerHTML = "";
    CONTACT.forEach(user => {
      const cont = createElement("div", {class: ["w-[97%]", "flex", "justify-between","p-2", "items-center", "rounded-xl", "border-r-2", "border-b-2", "border-[#e1b447]"]}, [
        createElement("div", {class: ["flex", "space-x-1", "justify-between", "items-center" ]}, [createElement("div", {
            class: ["w-10", "h-10", "flex", "justify-center", "items-center", "rounded-full", "bg-gray-300", "font-bold"]
          }, getInitials(user.name)), createElement("div", {}, user.name)]),
         
        createElement("div", {}, [createElement("input", {type: "checkbox"})])
        
      ]);
      list.appendChild(cont);
    });
  }
}

export function renderMessage() {
  const message = document.getElementById("list-message");
  const searchInput = document.querySelector('input[placeholder="Rechercher"]');
  
  if (message) {
    message.innerHTML = "";
    
    const showAllContacts = searchInput && searchInput.value.trim() === "*";
    
    let contactsToShow = [];
    let groupsToShow = [];
    
    if (showAllContacts) {
      contactsToShow = CONTACT;
      groupsToShow = GROUPES;
    } else {
      contactsToShow = getContactsWithConversations(CONTACT);
      groupsToShow = getGroupsWithConversations(GROUPES);
    }
    
    contactsToShow.forEach(user => {
      const conversationId = generateConversationId(user, 'contact');
      const lastMessage = showAllContacts ? "Nouvelle conversation" : getLastMessage(conversationId);
      const lastTime = showAllContacts ? "" : getLastMessageTime(conversationId);
      
      const cont = createElement("div", {
        class: ["w-[97%]", "flex", "justify-between","p-2", "items-center", "rounded-xl", "border-r-2", "border-b-2", "border-[#e1b447]", "hover:bg-orange-100", "cursor-pointer", "contact"], 
        onclick: (e) => {
          // Cette fonction sera importée depuis eventHandlers
          selectItem(user, 'contact');
          setFocus(e.currentTarget, "message");
        }
      }, [
        createElement("div", {class: ["flex", "space-x-1", "justify-between", "items-center" ]}, [
          createElement("div", {
            class: ["w-10", "h-10", "flex", "justify-center", "items-center", "rounded-full", "bg-gray-300", "font-bold"]
          }, getInitials(user.name)), 
          createElement("div", {}, [
            createElement("div", {}, user.name), 
            createElement("div", {class: ["text-sm", "text-gray-600", "truncate", "max-w-[150px]"]}, lastMessage)
          ])
        ]),
        createElement("div", {class: [ "flex", "flex-col", ]}, [
          createElement("div", {class:["text-emerald-400", "text-xs"]}, lastTime),
          ...(showAllContacts ? [] : [createElement("div", {class: ["w-2", "h-2", "ml-4", "rounded-full", "border", "bg-green-400"]})])
        ])
      ]);
      message.appendChild(cont);
    });
    
    if (!showAllContacts && contactsToShow.length === 0 && groupsToShow.length === 0) {
      const emptyMessage = createElement("div", {
        class: ["text-center", "text-gray-500", "mt-8"]
      }, "Aucune conversation. Tapez * pour voir tous les contacts.");
      message.appendChild(emptyMessage);
    }
  }
}

export function renderGroup() {
  const groupsContainer = document.getElementById("groups-container");
  const menu = document.getElementById("menu");
  menu.innerHTML = "Groupes";
  
  if (groupsContainer) {
    groupsContainer.innerHTML = ""; 
    GROUPES.forEach(group => {
      const conversationId = generateConversationId(group, 'group');
      const lastMessage = getLastMessage(conversationId);
      const lastTime = getLastMessageTime(conversationId);
      
      const groupElement = createElement("div", {
        class: ["w-[97%]", "flex", "justify-between", "p-2", "rounded-xl", "border-r-2", "border-b-2", "border-[#e1b447]", "cursor-pointer", "hover:bg-orange-100", "groupe"],
        onclick: (e) => {
          selectItem(group, 'group');
          setFocus(e.currentTarget, "groupe");
        }
      }, [
        createElement("div", {class: ["flex", "gap-2"]}, [
          createElement("div", {
            class: ["w-10", "h-10", "flex", "justify-center", "items-center", "rounded-full", "bg-gray-300", "font-bold"]
          }, getInitials(group.name)),
          createElement("div", {class: ["flex", "flex-col", "text-left"]}, [
            createElement("div", {class: ["font-semibold"]}, group.name),
            createElement("div", {
              class: ["text-gray-600", "text-sm", "truncate", "max-w-[200px]"]
            }, lastMessage)
          ])
        ]),
        createElement("div", {class: ["flex", "items-center", "gap-2"]}, [
          createElement("div", {
            class: ["text-xs", "text-gray-500"]
          }, lastTime || ""),
          createElement("button", {
            class: ["w-6", "h-6", "rounded-full", "bg-[#e1b447]", "hover:bg-blue-200", "flex", "items-center", "justify-center", "transition-colors"],
            onclick: () => {
              showMembersModal(group);
            },
            title: "Voir les membres"
          }, createElement("i", {class: ["fa-solid", "fa-users", "text-white", "text-xs"]}))
        ])
      ]);
      groupsContainer.appendChild(groupElement);
    });
  }
}

export function renderArchive() {
  const archiveList = document.getElementById("list-archive");
  if (archiveList) {
    archiveList.innerHTML = "";
    
    ARCHIVED_CONTACTS.forEach(contact => {
      const archivedItem = createElement("div", {
        class: ["w-[97%]", "flex", "justify-between", "p-2", "items-center", "rounded-xl", "border-r-2", "border-b-2", "border-[#e1b447]"]
      }, [
        createElement("div", {class: ["flex", "items-center", "gap-2"]}, [
          createElement("div", {
            class: ["w-10", "h-10", "flex", "justify-center", "items-center", "rounded-full", "bg-gray-300", "font-bold"]
          }, getInitials(contact.name)),
          createElement("div", {class: ["flex", "flex-col"]}, [
            createElement("div", {class: ["font-medium"]}, contact.name),
            createElement("div", {class: ["text-sm", "text-gray-500"]}, "Contact archivé")
          ])
        ]),
        createElement("div", {class: ["flex", "gap-2"]}, [
          createElement("button", {
            class: ["size-8", "bg-[#e1b447]", "text-white", "rounded-full", "text-sm"],
            onclick: () => {
              restoreContact(contact);
              renderArchive();
              renderContact();
              renderMessage();
            }
          }, createElement("i", {class:["fa-solid", "fa-rotate-right"]})),
        ])
      ]);
      archiveList.appendChild(archivedItem);
    });
    
    ARCHIVED_GROUPS.forEach(group => {
      const memberCount = Object.keys(group.users || {}).length;
      const archivedItem = createElement("div", {
        class: ["w-[97%]", "flex", "justify-between", "p-2", "items-center", "rounded-xl", "border-r-2", "border-b-2", "border-[#e1b447]"]
      }, [
        createElement("div", {class: ["flex", "items-center", "gap-2"]}, [
          createElement("div", {
            class: ["w-10", "h-10", "flex", "justify-center", "items-center", "rounded-full", "bg-gray-300", "font-bold"]
          }, getInitials(group.name)),
          createElement("div", {class: ["flex", "flex-col"]}, [
            createElement("div", {class: ["font-medium"]}, group.name),
            createElement("div", {class: ["text-sm", "text-gray-500"]}, `Groupe archivé • ${memberCount} membre${memberCount > 1 ? 's' : ''}`)
          ])
        ]),
        createElement("div", {class: ["flex", "gap-2"]}, [
          createElement("button", {
            class: ["px-3", "py-1", "bg-[#e1b447]", "text-white", "rounded-full", "text-sm"],
            onclick: () => {
              restoreGroup(group);
              renderArchive();
              renderGroup();
            }
          }, createElement("i", {class:["fa-solid", "fa-rotate-right"]}))
        ])
      ]);
      archiveList.appendChild(archivedItem);
    });
    
    if (ARCHIVED_CONTACTS.length === 0 && ARCHIVED_GROUPS.length === 0) {
      const emptyMessage = createElement("div", {
        class: ["text-center", "text-gray-500", "mt-8"]
      }, "Aucun élément archivé");
      archiveList.appendChild(emptyMessage);
    }
  }
}