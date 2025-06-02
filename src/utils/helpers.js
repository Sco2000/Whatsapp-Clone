export function getInitials(fullName) {
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0 && isNaN(part));
  if (nameParts.length === 0) return '';
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

export function phoneExists(phone, contacts) {
  return contacts.some(contact => contact.telephone === phone);
}

export function generateUniqueName(baseName, contacts) {
  const existingNames = contacts.map(contact => contact.name.toLowerCase());
  let uniqueName = baseName;
  let counter = 1;
  
  while (existingNames.includes(uniqueName.toLowerCase())) {
    uniqueName = `${baseName} ${counter}`;
    counter++;
  }
  
  return uniqueName;
}

export function showError(elementId, message) {
  let errorDiv = document.getElementById(elementId);
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = elementId;
    errorDiv.className = "text-red-500 text-sm mt-1";
    const form = document.getElementById(elementId.includes("group") ? "form-add-group" : "form-add-contact");
    form.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

export function clearError(elementId) {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) errorDiv.textContent = "";
}

export function setClass(id, classs) {
  const e = document.getElementById(id);
  e.classList.add(classs);
}

export function removeClass(id, classs) {
  const e = document.getElementById(id);
  e.classList.remove(classs);
}

export function setFocus(currentTarget, type) {
  const focusClass = "bg-[#e1b447]";
  const hoverClass = "hover:bg-orange-100";
  
  if (type === "message") {
    const allContacts = document.querySelectorAll("#list-message .contact");
    allContacts.forEach(contact => {
      if (contact.classList.contains(focusClass)) {
        contact.classList.remove(focusClass);
      }
      if (!contact.classList.contains(hoverClass)) {
        contact.classList.add(hoverClass);
      }
    });
  } else if (type === "groupe") {
    const allGroups = document.querySelectorAll("#groups-container .groupe");
    allGroups.forEach(group => {
      if (group.classList.contains(focusClass)) {
        group.classList.remove(focusClass);
      }
      if (!group.classList.contains(hoverClass)) {
        group.classList.add(hoverClass);
      }
    });
  }
  
  currentTarget.classList.add(focusClass);
  currentTarget.classList.remove(hoverClass);
}