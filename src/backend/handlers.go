package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"your_module_name/db"

	"github.com/gorilla/mux"
)

func RegisterHandlers(r *mux.Router) {
	r.HandleFunc("/api/register", RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", LoginHandler).Methods("POST")
	r.HandleFunc("/api/save-build", SaveBuildHandler).Methods("POST")
	r.HandleFunc("/api/builds", GetBuildsHandler).Methods("GET")
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)

	exists, err := UserExists(user.Username)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if exists {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	err = CreateUser(&user)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)

	storedUser, err := GetUserByUsername(user.Username)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	if user.Password != storedUser.Password {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful", "username": user.Username})
}

func SaveBuildHandler(w http.ResponseWriter, r *http.Request) {
	var build Build
	json.NewDecoder(r.Body).Decode(&build)

	err := SaveBuild(&build)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Build saved successfully", "build": build})
}

func GetBuildsHandler(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")

	builds, err := GetBuildsByUsername(username)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(builds)
}
