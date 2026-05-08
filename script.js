function sendMessage() {
  let input = document.getElementById("msg");
  let chat = document.getElementById("chat");

  if (input.value === "") return;

  let div = document.createElement("div");
  div.className = "message";
  div.innerText = input.value;

  chat.appendChild(div);

  input.value = "";
}
