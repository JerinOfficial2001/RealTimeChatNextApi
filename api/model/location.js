import mongoose from "mongoose";

let Locations;

if (mongoose.models && mongoose.models.Locations) {
  Locations = mongoose.model("Locations");
} else {
  const LocationSchema = new mongoose.Schema({
    lat: String,
    long: String,
    userName: String,
    mobNum: String,
    address: String,
  });

  Locations = mongoose.model("Locations", LocationSchema);
}

export default Locations;
