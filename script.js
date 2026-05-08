const supabaseUrl = "https://mhabqeyxtcoefzyezqzo.supabase.co";
const supabaseKey = "sb_publishable_3Yn5AWd5I10SR-9m_-dK9Q_kj91BuhD";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const chatBox = document.getElementById("chat-box");

// tampilkan 1 pesan
function addMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerText = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// load semua pesan
async function loadMessages() {
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.log(error);
    return;
  }

  chatBox.innerHTML = "";

  data.forEach(msg => {
    addMessage(msg.text);
  });
}

// kirim pesan
async function sendMessage() {
  const input = document.getElementById("message");

  if (input.value.trim() === "") return;

  const text = input.value;

  input.value = "";

  await supabaseClient
    .from("messages")
    .insert({
      text: text
    });
}

// realtime listener
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
      // reload semua pesan biar konsisten
      loadMessages();
    }
  )
  .subscribe();

// pertama kali load
loadMessages();
