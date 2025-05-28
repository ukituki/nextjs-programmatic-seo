import { DirectoryItem } from "@/interfaces"; // Adjust path as needed

export const sampleBookItems: DirectoryItem[] = [
  {
    id: "book1",
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", // Placeholder
    genre: "Classic",
    publicationYear: 1925,
    isbn: "9780743273565",
    publisher: "Charles Scribner's Sons",
    summary: "A story of wealth, love, and the American Dream in the Roaring Twenties.",
    pageCount: 180,
    location: "all", // For non-location specific
    description: "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers.",
    name: "The Great Gatsby", 
  },
  {
    id: "book2",
    slug: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", // Placeholder
    genre: "Fiction",
    publicationYear: 1960,
    isbn: "9780061120084",
    publisher: "J. B. Lippincott & Co.",
    summary: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    pageCount: 324,
    location: "all",
    description: "Compassionate, dramatic, and deeply moving, To Kill A Mockingbird takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos.",
    name: "To Kill a Mockingbird",
  },
  {
    id: "book3",
    slug: "1984",
    title: "1984",
    author: "George Orwell",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80", // Placeholder
    genre: "Dystopian",
    publicationYear: 1949,
    isbn: "9780451524935",
    publisher: "Secker & Warburg",
    summary: "A haunting vision of a totalitarian future where critical thought is suppressed.",
    pageCount: 328,
    location: "all",
    description: "Nineteen Eighty-Four, often published as 1984, is a dystopian novel by English writer George Orwell published in June 1949, whose themes centre on the risks of government overreach, totalitarianism and repressive regimentation of all persons and behaviours within society.",
    name: "1984",
  },
  {
    id: "book4",
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "https://images.unsplash.com/photo-1570793005524-38b051399549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", // Placeholder
    genre: "Romance",
    publicationYear: 1813,
    isbn: "9780141439518",
    publisher: "T. Egerton, Whitehall",
    summary: "A classic romance novel exploring societal expectations and personal biases.",
    pageCount: 279,
    location: "all",
    description: "Pride and Prejudice is an 1813 novel of manners by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    name: "Pride and Prejudice",
  },
  {
    id: "book5",
    slug: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    image: "https://images.unsplash.com/photo-1600189261867-30e5eff7b65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", // Placeholder
    genre: "Fantasy",
    publicationYear: 1937,
    isbn: "9780547928227",
    publisher: "George Allen & Unwin",
    summary: "The enchanting prelude to The Lord of the Rings, a tale of adventure and courage.",
    pageCount: 310,
    location: "all",
    description: "The Hobbit, or There and Back Again, is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
    name: "The Hobbit",
  }
];

export const bookLocations: string[] = ["all"]; // As per non-location specific guidance
