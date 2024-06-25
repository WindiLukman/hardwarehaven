package main

import (
	"encoding/json"
	"net/http"
	"github.com/gorilla/mux"
	"log"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var users = make(map[string]string) // In-memory user storage

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	users[user.Username] = user.Password
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	password, exists := users[user.Username]
	if !exists || password != user.Password {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
}

func main() {
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/api/register", RegisterUser).Methods("POST")
	r.HandleFunc("/api/login", LoginUser).Methods("POST")

	// Serve static files
	fs := http.FileServer(http.Dir("./build"))
	r.PathPrefix("/").Handler(fs)

	log.Println("Server is running on port 5000...")
	log.Fatal(http.ListenAndServe(":5000", r))
}
