import { CONTACT, GROUPES } from "../consts.js";

let ARCHIVED_CONTACTS = [];
let ARCHIVED_GROUPS = [];

export function archiveItem(selectedItem, selectedType) {
  if (!selectedItem || !selectedType) return;
  
  if (selectedType === 'contact') {
    const index = CONTACT.findIndex(c => c.name === selectedItem.name && c.telephone === selectedItem.telephone);
    if (index > -1) {
      const archivedContact = CONTACT.splice(index, 1)[0];
      ARCHIVED_CONTACTS.push(archivedContact);
      console.log(`Contact ${selectedItem.name} archivé`);
      return true;
    }
  } else {
    const index = GROUPES.findIndex(g => g.name === selectedItem.name);
    if (index > -1) {
      const archivedGroup = GROUPES.splice(index, 1)[0];
      ARCHIVED_GROUPS.push(archivedGroup);
      console.log(`Groupe ${selectedItem.name} archivé`);
      return true;
    }
  }
  return false;
}

export function restoreContact(contact) {
  const index = ARCHIVED_CONTACTS.findIndex(c => c.name === contact.name && c.telephone === contact.telephone);
  if (index > -1) {
    const restoredContact = ARCHIVED_CONTACTS.splice(index, 1)[0];
    CONTACT.push(restoredContact);
    console.log(`Contact ${contact.name} restauré`);
    return true;
  }
  return false;
}

export function restoreGroup(group) {
  const index = ARCHIVED_GROUPS.findIndex(g => g.name === group.name);
  if (index > -1) {
    const restoredGroup = ARCHIVED_GROUPS.splice(index, 1)[0];
    GROUPES.push(restoredGroup);
    console.log(`Groupe ${group.name} restauré`);
    return true;
  }
  return false;
}

export { ARCHIVED_CONTACTS, ARCHIVED_GROUPS };