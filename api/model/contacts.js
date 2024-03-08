import mongoose from "mongoose";

let Contacts;

if (mongoose.models && mongoose.models.Contacts) {
  Contacts = mongoose.model("Contacts");
} else {
  const ContactsSchema = new mongoose.Schema(
    {
      Contact_id: String,
      name: String,
      user_id: String,
      ContactDetails: Object,
    },
    {
      timestamps: true,
    }
  );

  Contacts = mongoose.model("Contacts", ContactsSchema);
}

export default Contacts;
