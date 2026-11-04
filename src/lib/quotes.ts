export type Quote = { text: string; author: string };

export const QUOTES: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Stay hungry, stay foolish.", author: "Stewart Brand" },
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
];

export function randomIndex(length: number, exclude?: number): number {
  if (length <= 1) return 0;
  let i = Math.floor(Math.random() * length);
  while (i === exclude) i = Math.floor(Math.random() * length);
  return i;
}
