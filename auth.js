// auth.js
//
// Gates the whole app behind Firebase Authentication (email/password).
// Loaded as an ES module, so it can `import` directly from Firebase's CDN
// and from ./firebase-config.js with no build step.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Firebase persists the session (IndexedDB-backed, "local" persistence) by
// default in browsers, so a logged-in user stays logged in across page
// reloads and browser restarts with no extra code needed here.

// ---- DOM references ----
const authOverlay = document.getElementById("authOverlay");
const topBar = document.querySelector(".top");
const appContainer = document.querySelector(".container");

const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

// ---- Tab switching on the auth card ----
tabLogin.addEventListener("click", () => switchTab("login"));
tabSignup.addEventListener("click", () => switchTab("signup"));

function switchTab(which) {
  const isLogin = which === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);
  loginError.textContent = "";
  signupError.textContent = "";
}

// ---- Friendly error messages ----
function friendlyError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/missing-password":
      return "Please enter a password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// ---- Sign up ----
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signupError.textContent = "";

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) {
    signupError.textContent = "Passwords don't match.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged (below) takes care of revealing the app.
  } catch (err) {
    console.error("Signup error:", err.code, err.message, err);
    signupError.textContent = friendlyError(err.code);
  }
});

// ---- Log in ----
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Login error:", err.code, err.message, err);
    loginError.textContent = friendlyError(err.code);
  }
});

// ---- Log out (the top-bar "Login" button turns into "Log out" once signed in) ----
loginBtn.addEventListener("click", () => {
  if (auth.currentUser) {
    signOut(auth);
  }
});

// ---- Gate the app based on auth state ----
onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChanged fired. user:", user ? user.email : null);
  if (user) {
    authOverlay.classList.add("hidden");
    topBar.classList.remove("hidden");
    appContainer.classList.remove("hidden");

    signupBtn.classList.add("hidden");
    loginBtn.textContent = "Log out";
  } else {
    if (window.currentSong && !window.currentSong.paused) {
      window.currentSong.pause();
    }
    if (window.play) {
      window.play.src = "svg/playbtn.svg";
    }

    authOverlay.classList.remove("hidden");
    topBar.classList.add("hidden");
    appContainer.classList.add("hidden");

    loginForm.reset();
    signupForm.reset();
    loginError.textContent = "";
    signupError.textContent = "";
    switchTab("login");
  }
});
