export function isEnglishRelated(text: string): boolean {
    const keywords = [
      "hello", "hi", "english", "how", "are", "you", "alphabet", "word",
      "repeat", "teacher", "class", "say", "name", "goodbye", "question",
      "vocabulary", "grammar", "pronunciation", "spelling", "i'm", "my name",
      "i am", "lesson", "what is your name", "thank you", "basic", "conversation",
      "introduce", "talk", "learn", "listen", "greetings", "numbers", "colors",
      "animals", "days", "months", "practice", "sentence", "dialogue", "speak",
      "language", "study"
    ];
  
    const input = text.toLowerCase();
  
    return keywords.some((word) => input.includes(word));
  }
  