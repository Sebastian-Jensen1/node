#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres, and book instances to your database. Specify database as argument - e.g.: node populatedb "mongodb+srv://youruser:yourpassword@yourcluster.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on the command line
const userArgs = process.argv.slice(2);

import mongoose from "mongoose";
import Book from "./models/book.js";
import Author from "./models/author.js";
import Genre from "./models/genre.js";
import BookInstance from "./models/bookinstance.js";

// Arrays to store created documents
const genres = [];
const authors = [];
const books = [];
const bookinstances = [];

// MongoDB connection string
const mongoDB = userArgs[0];

async function main() {
  try {
    console.log("Debug: Connecting to MongoDB...");
    await mongoose.connect(mongoDB);
    console.log("Debug: Connected!");

    await createGenres();
    await createAuthors();
    await createBooks();
    await createBookInstances();

    console.log("Debug: Finished! Closing connection...");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error in main execution:", err);
  }
}

// Function to create Genres
async function genreCreate(index, name) {
  const genre = new Genre({ name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

// Function to create Authors
async function authorCreate(index, first_name, family_name, d_birth, d_death) {
  const authorDetails = { first_name, family_name };
  if (d_birth) authorDetails.date_of_birth = d_birth;
  if (d_death) authorDetails.date_of_death = d_death;

  const author = new Author(authorDetails);
  await author.save();
  authors[index] = author;
  console.log(`Added author: ${first_name} ${family_name}`);
}

// Function to create Books
async function bookCreate(index, title, summary, isbn, author, genre) {
  const bookDetails = { title, summary, author, isbn };
  if (genre) bookDetails.genre = genre;

  const book = new Book(bookDetails);
  await book.save();
  books[index] = book;
  console.log(`Added book: ${title}`);
}

// Function to create Book Instances
async function bookInstanceCreate(index, book, imprint, due_back, status) {
  const bookInstanceDetails = { book, imprint };
  if (due_back) bookInstanceDetails.due_back = due_back;
  if (status) bookInstanceDetails.status = status;

  const bookInstance = new BookInstance(bookInstanceDetails);
  await bookInstance.save();
  bookinstances[index] = bookInstance;
  console.log(`Added book instance: ${imprint}`);
}

// Creating Genres
async function createGenres() {
  console.log("Adding genres...");
  await Promise.all([
    genreCreate(0, "Fantasy"),
    genreCreate(1, "Science Fiction"),
    genreCreate(2, "French Poetry"),
  ]);
}

// Creating Authors
async function createAuthors() {
  console.log("Adding authors...");
  await Promise.all([
    authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", null),
    authorCreate(1, "Ben", "Bova", "1932-11-08", null),
    authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
    authorCreate(3, "Bob", "Billings", null, null),
    authorCreate(4, "Jim", "Jones", "1971-12-16", null),
  ]);
}

// Creating Books
async function createBooks() {
  console.log("Adding books...");
  await Promise.all([
    bookCreate(
      0,
      "The Name of the Wind",
      "A fantasy novel...",
      "9781473211896",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      1,
      "The Wise Man's Fear",
      "Sequel to The Name of the Wind...",
      "9788401352836",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      2,
      "The Slow Regard of Silent Things",
      "A novella...",
      "9780756411336",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      3,
      "Apes and Angels",
      "Sci-fi novel...",
      "9780765379528",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      4,
      "Death Wave",
      "Another sci-fi novel...",
      "9780765379504",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      5,
      "Test Book 1",
      "Summary of test book 1",
      "ISBN111111",
      authors[4],
      [genres[0], genres[1]]
    ),
    bookCreate(
      6,
      "Test Book 2",
      "Summary of test book 2",
      "ISBN222222",
      authors[4],
      []
    ),
  ]);
}

// Creating Book Instances
async function createBookInstances() {
  console.log("Adding book instances...");
  await Promise.all([
    bookInstanceCreate(0, books[0], "London Gollancz, 2014.", null, "Available"),
    bookInstanceCreate(1, books[1], "Gollancz, 2011.", null, "Loaned"),
    bookInstanceCreate(2, books[2], "Gollancz, 2015.", null, null),
    bookInstanceCreate(
      3,
      books[3],
      "New York Tom Doherty Associates, 2016.",
      null,
      "Available"
    ),
    bookInstanceCreate(
      4,
      books[4],
      "New York Tom Doherty Associates, 2016.",
      null,
      "Available"
    ),
    bookInstanceCreate(
      5,
      books[4],
      "New York Tom Doherty Associates, 2016.",
      null,
      "Maintenance"
    ),
    bookInstanceCreate(
      6,
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      null,
      "Loaned"
    ),
    bookInstanceCreate(7, books[0], "Imprint XXX2", null, null),
    bookInstanceCreate(8, books[1], "Imprint XXX3", null, null),
  ]);
}

// Run the main function
main();
