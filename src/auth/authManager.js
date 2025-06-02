import { USERS, DEFAULT_USER } from "../consts.js";

export function authenticateUser(name, telephone) {
  const user = USERS.find(u => 
    u.name.toLowerCase() === name.toLowerCase() && 
    u.telephone === telephone
  );
  
  if (user) {
    // Mettre à jour l'utilisateur par défaut
    DEFAULT_USER.name = user.name;
    DEFAULT_USER.telephone = user.telephone;
    DEFAULT_USER.id = user.id;
    DEFAULT_USER.isLoggedIn = true;
    
    // Sauvegarder la session utilisateur
    saveUserSession(user);
    
    return { success: true, user };
  }
  
  return { success: false, message: "Nom ou numéro de téléphone incorrect" };
}

export function isUserLoggedIn() {
  return DEFAULT_USER.isLoggedIn;
}

export function getCurrentUser() {
  return DEFAULT_USER;
}

// Sauvegarder la session utilisateur
export function saveUserSession(user) {
  try {
    const sessionData = {
      name: user.name,
      telephone: user.telephone,
      id: user.id,
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem("userSession", JSON.stringify(sessionData));
    console.log(`Session sauvegardée pour ${user.name}`);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la session:", error);
  }
}

// Restaurer la session utilisateur
export function restoreUserSession() {
  try {
    const savedSession = localStorage.getItem("userSession");
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      
      if (sessionData.name && sessionData.telephone && sessionData.id) {
        DEFAULT_USER.name = sessionData.name;
        DEFAULT_USER.telephone = sessionData.telephone;
        DEFAULT_USER.id = sessionData.id;
        DEFAULT_USER.isLoggedIn = true;
        
        console.log(`Session restaurée pour ${sessionData.name}`);
        return true;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la restauration de la session:", error);
  }
  return false;
}

// Sauvegarder les données utilisateur (messages, groupes, etc.)
export function saveUserData(data) {
  try {
    const currentUser = getCurrentUser();
    if (currentUser.isLoggedIn) {
      const userDataKey = `userData_${currentUser.id}`;
      const userData = {
        userId: currentUser.id,
        conversations: data.conversations || {},
        groups: data.groups || [],
        contacts: data.contacts || [],
        archivedContacts: data.archivedContacts || [],
        archivedGroups: data.archivedGroups || [],
        lastUpdate: new Date().toISOString()
      };
      
      localStorage.setItem(userDataKey, JSON.stringify(userData));
      console.log(`Données sauvegardées pour l'utilisateur ${currentUser.name}`);
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données utilisateur:", error);
  }
}

// Restaurer les données utilisateur
export function restoreUserData() {
  try {
    const currentUser = getCurrentUser();
    if (currentUser.isLoggedIn) {
      const userDataKey = `userData_${currentUser.id}`;
      const savedData = localStorage.getItem(userDataKey);
      
      if (savedData) {
        const userData = JSON.parse(savedData);
        console.log(`Données restaurées pour l'utilisateur ${currentUser.name}`);
        return userData;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la restauration des données utilisateur:", error);
  }
  return null;
}

// Vérifier si une session existe
export function hasValidSession() {
  try {
    const savedSession = localStorage.getItem("userSession");
    return savedSession !== null;
  } catch (error) {
    return false;
  }
}

// Ajouter cette fonction de déconnexion
export function logout() {
  const previousUser = { ...DEFAULT_USER };
  
  // Réinitialiser l'utilisateur par défaut
  DEFAULT_USER.name = "";
  DEFAULT_USER.telephone = "";
  DEFAULT_USER.id = null;
  DEFAULT_USER.isLoggedIn = false;
  
  // Supprimer la session de localStorage
  clearUserSession();
  
  console.log(`Utilisateur ${previousUser.name} déconnecté`);
  
  return true;
}

// Ajouter cette fonction pour supprimer la session
export function clearUserSession() {
  try {
    localStorage.removeItem("userSession");
    console.log("Session utilisateur supprimée");
  } catch (error) {
    console.error("Erreur lors de la suppression de la session:", error);
  }
}