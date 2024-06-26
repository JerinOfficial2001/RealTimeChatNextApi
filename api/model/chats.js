import mongoose from "mongoose";

let Chats;

if (mongoose.models && mongoose.models.WC_Chats) {
  Chats = mongoose.models.WC_Chats;
} else {
  const ChatsSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
  });

  Chats = mongoose.model("WC_Chats", ChatsSchema);
}

export default Chats;
