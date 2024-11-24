import * as signalR from "@microsoft/signalr";
import "./css/main.css";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");

const tbRoomToCreate: HTMLInputElement = document.querySelector("#tbRoomToCreate");
const btnRoomToCreateSend: HTMLButtonElement = document.querySelector("#btnRoomToCreateSend");


const tbRoomToJoin: HTMLInputElement = document.querySelector("#tbRoomToJoin");
const tbRoomToJoinPlayer: HTMLInputElement = document.querySelector("#tbRoomToJoinPlayer");
const tbRoomToJoinGiven: HTMLInputElement = document.querySelector("#tbRoomToJoinGiven");
const btnRoomToJoinSend: HTMLButtonElement = document.querySelector("#btnRoomToJoinSend");

const username = new Date().getTime();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5138/hub")
    .build();

connection.on("messageReceived", (username: string, message: string) => {
    const m = document.createElement("div");

    m.innerHTML = `<div class="message-author">${username}</div><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.on("roomCreated", (roomCreated: string) => {
    const m = document.createElement("div");

    m.innerHTML = `<div class="message-author">${roomCreated} is created! Please now join</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.on("playerJoined", (playerName: string, givenName: string) => {
    const m = document.createElement("div");

    m.innerHTML = `<div class="message-author">${playerName} joined</div><div>With: ${givenName}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});


connection.start().catch((err) => document.write(err));

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        send();
    }
});

btnSend.addEventListener("click", send);

tbRoomToCreate.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        createRoom();
    }
});

btnRoomToCreateSend.addEventListener("click", createRoom);

tbRoomToJoin.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        joinRoom();
    }
});

btnRoomToJoinSend.addEventListener("click", joinRoom);

function createRoom() {
    connection.send("createRoom", tbRoomToCreate.value)
        .then(() => (tbRoomToCreate.value = ""));
}

function joinRoom() {
    connection.send("joinRoom", tbRoomToJoin.value, tbRoomToJoinPlayer.value, tbRoomToJoinGiven.value)
        .then(() => (tbRoomToJoin.value = ""));
}

function send() {
    connection.send("newMessage", username, tbMessage.value)
        .then(() => (tbMessage.value = ""));
}