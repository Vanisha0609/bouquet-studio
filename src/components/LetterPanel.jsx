import { useState } from "react";

export default function LetterPanel({ addLetter }) {
  const [text, setText] = useState("");
  const [font, setFont] = useState("Caveat");

  return (
    <>
      <h3>Write Your Letter</h3>

      <select value={font} onChange={e => setFont(e.target.value)}>
        <option>Caveat</option>
        <option>Dancing Script</option>
        <option>Patrick Hand</option>
        <option>Kalam</option>
        <option>Satisfy</option>
      </select>

      <textarea
        placeholder="Write your letter here..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button onClick={() => addLetter(text, font)}>
        Add Letter to Canvas
      </button>
    </>
  );
}
