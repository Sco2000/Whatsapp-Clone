let ARCHIVED_CONTACTS = [];
let ARCHIVED_GROUPS = [];
let CONVERSATIONS = {};
let MESSAGE_ID_COUNTER = 1;

const DATA = [
    {
        id:0,
        title: "Moustapha Seck",
        content: "Wa fils",
        pts: 20,
        done:true,
        deleted: true
    },
    {
        id:1,
        title: "Fallou Ndiaye",
        content: "Kou baax nekkal nitt",
        pts: 20,
        done:false,
        deleted: true
    },
    {
        id:2,
        title: "Mame Ndiaye Savon",
        content: "Bayil nelaw",
        pts: 10,
        done:true,
        deleted: false
    },
    {
        id:3,
        title: "Bamba Thiam",
        content: "Tegg xel",
        pts: 8,
        done:true,
        deleted: true
    }
];

const COLORS = {
    deleted : "red",
    done: "blue",
    done_deleted: "orange",
    other : "#f4f4f4"
}

const FONT = [
  { 
    id: "message",
    item: ["fa-solid", "fa-message", "flex", "flex-col", "text-xs"],
    text: "Messages"
  },
  {
    id: "groupes",
    item: ["fa-solid", "fa-user-group", "flex", "flex-col"],
    text: "Groupes",
  },
  {
    id: "diffusions",
    item: ["fa-solid", "fa-arrows-turn-to-dots", "flex", "flex-col"],
    text: "Diffusions",
  },
  {
    id: "archives",
    item: ["fa-solid", "fa-box-archive", "flex", "flex-col"],
    text: "Archives",
  },
  {
    id: "nouveau",
    item: ["fa-solid", "fa-plus", "flex", "flex-col"],
    text: "Nouveau",
  },
  {
    id: "deconnexion",
    item: ["fa-solid", "fa-right-from-bracket", "flex", "flex-col"],
    text: "Déconnexion",
  }
]

const CONTACT = [
    {
    name : "New Name", 
    telephone : "newTel",
    }
]

const GROUPES = [
    {
        name: "Promo 7",
        users: {},
        lastMessage: "",
        time:""
    }
]

const USERS = [
  {
    name: "Ousmane Marra",
    telephone: "774368884",
    id: 1
  },
  {
    name: "Fatou Diop",
    telephone: "775123456",
    id: 2
  },
  {
    name: "Mamadou Fall",
    telephone: "776789012",
    id: 3
  }
];

let DEFAULT_USER = {
  name: "",
  telephone: "",
  id: null,
  isLoggedIn: false
};

export const RIGHT_BUTTONS = [
  {
    id: "delete",
    item: ["fa-solid", "fa-delete-left", "text-orange-500"],
    border: "border-orange-500"
  },
  {
    id: "archive",
    item: ["fa-solid", "fa-box-archive", "text-neutral-400"],
    border: "border-neutral-400"
  },
  {
    id: "block",
    item: ["fa-solid", "fa-square", ""],
    border: "border-slate-900"
  },
  {
    id: "delete-final",
    item: ["fa-solid", "fa-trash", "text-red-600"],
    border: "border-red-600"
  }
];

export function getNextMessageId() {
  return MESSAGE_ID_COUNTER++;
}

export {DATA, COLORS, FONT, CONTACT, GROUPES,USERS, DEFAULT_USER, ARCHIVED_CONTACTS, ARCHIVED_GROUPS,CONVERSATIONS, MESSAGE_ID_COUNTER}