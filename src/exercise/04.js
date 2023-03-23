import { useEffect, useState } from "react";

function getFromLocalStorage(key) {
  const storedValue = localStorage.getItem(key);
  try {
    return JSON.parse(storedValue);
  } catch {}
  return storedValue;
}

function setInLocalStorage(key, value) {
  const valueToStore = JSON.stringify(value);
  localStorage.setItem(key, valueToStore);
}

export function useLocalStorage(key, initialValue = null) {
  const [state, setState] = useState(getFromLocalStorage(key) || initialValue)

  useEffect(() => {
    setInLocalStorage(key, state);
  }, [key, state]);

  useEffect(() => {
    function handleChange() {
      setState(getFromLocalStorage(key))
    }

    window.addEventListener("storage", handleChange)

    return function cleanup() {
      window.removeEventListener("storage", handleChange);
    };
  }, [key])

  return [state, setState]
}

function Form() {
  const [name, setName] = useLocalStorage("name", "");

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Name:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <h4>{name ? `Welcome, ${name}!` : "Enter your name"}</h4>
    </form>
  );
}

function FormWithObject() {
  const [formData, setFormData] = useLocalStorage("formData", {
    title: "",
    content: "",
  });

  function handleChange(e) {
    setFormData(formData => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Title:</label>
      <input name="title" value={formData.title} onChange={handleChange} />
      <label htmlFor="name">Content:</label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
      />
    </form>
  );
}

export default function App() {
  return (
    <div>
      <h2>useLocalStorage can save string</h2>
      <Form />
      <hr />
      <h2>useLocalStorage can save objects (Bonus)</h2>
      <FormWithObject />
    </div>
  );
}
