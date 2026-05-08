const supabaseUrl = "https://mhabqeyxtcoefzyezqzo.supabase.co";
const supabaseKey = "sb_publishable_3Yn5AWd5I10SR-9m_-dK9Q_kj91BuhD";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const chatBox = document.getElementById("chat-box");

async function loadMessages() {

  const { data } = await supabaseClient
    .from("messages")
    .select("*")
    .order("id", { ascending: true });

  chatBox.innerHTML = "";

  data.forEach(msg => {
    addMessage(msg.text);
  });
}

function addMessage(text) {

  const div = document.createElement("div");

  div.className = "message";
  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

  const input = document.getElementById("message");

  if (input.value === "") return;

  await supabaseClient
    .from("messages")
    .insert({
      text: input.value
    });

  input.value = "";
}

supabaseClient
  .channel("messages-channel")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages"
    },
    payload => {
      addMessage(payload.new.text);
    }
  )
  .subscribe();

loadMessages();
