import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { db } from "./utils/firebase";

function App() {
  let [todos, setTodos] = React.useState([]);
  let [newTxt, setNewTxt] = React.useState("");

  // load from DB and populate "todos"

  React.useEffect(() => {
    async function loadTodos() {
      let data = await db.collection("todos").get();
      setTodos(data.docs);
    }
    loadTodos();
  }, []);

  let deleteTodo = id => {
    db.collection("todos")
      .doc(id)
      .delete();
    let newTodos = todos.filter(v => v.id !== id);
    setTodos(newTodos);
  };

  let addTodo = async () => {
    let obj = {
      txt: newTxt,
      author: "Mehtewgeem"
    };
    let docref = await db.collection("todos").add(obj); // docref uses id to REFER to the document
    let doc = await db
      .collection("todos")
      .doc(docref.id)
      .get();
    setTodos([...todos, doc]);
  };

  function onSubmit(event) {
    event.preventDefault();
    setNewTxt("");
    addTodo();
  }

  return (
    <div>
      {todos.map(v => (
        <button
          key={v.id}
          onClick={() => {
            deleteTodo(v.id);
          }}
        >
          {v.data().txt} - {v.data().author}
        </button>
      ))}
      <hr />
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newTxt}
          onChange={event => setNewTxt(event.target.value)}
        />
        <button>ADD</button>
      </form>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
