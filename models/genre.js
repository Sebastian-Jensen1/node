import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Genre schema
const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
});

// Virtual for genre's URL
GenreSchema.virtual("url").get(function () {
  return `/catalog/genre/${this._id}`;
});

// Export model (ES Module format)
const Genre = mongoose.model("Genre", GenreSchema);
export default Genre;
