import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Circle,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  ListTodo
} from "lucide-react";

const initialTodos = [
  {
    id: 1,
    title: "Learn Prometheus basics",
    completed: true
  },
  {
    id: 2,
    title: "Deploy application on EC2",
    completed: false
  },
  {
    id: 3,
    title: "Configure Grafana dashboard",
    completed: false
  }
];

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("taskflow-todos");

    return savedTodos ? JSON.parse(savedTodos) : initialTodos;
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("taskflow-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (event) => {
    event.preventDefault();

    const title = input.trim();

    if (!title) return;

    const newTodo = {
      id: Date.now(),
      title,
      completed: false
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    );
  };

  const clearCompleted = () => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => !todo.completed)
    );
  };

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="container">
        {/* Header */}
        <header className="header">
          <div className="brand">
            <div className="brand-icon">
              <ClipboardList size={25} />
            </div>

            <div>
              <h1>TaskFlow</h1>
              <p>Simple tasks. Better productivity.</p>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            System Online
          </div>
        </header>

        {/* Main Card */}
        <section className="todo-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">MY TASKS</p>
              <h2>Stay on top of your work</h2>
            </div>

            <div className="task-count">
              <span>{activeCount}</span>
              <small>remaining</small>
            </div>
          </div>

          {/* Add Todo */}
          <form className="add-form" onSubmit={addTodo}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />

            <button type="submit" className="add-button">
              <Plus size={20} />
              Add Task
            </button>
          </form>

          {/* Filters */}
          <div className="toolbar">
            <div className="filters">
              <button
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={filter === "active" ? "active" : ""}
                onClick={() => setFilter("active")}
              >
                Active
              </button>

              <button
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>

            {completedCount > 0 && (
              <button className="clear-button" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>

          {/* Todo List */}
          <div className="todo-list">
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ListTodo size={28} />
                </div>

                <h3>No tasks here</h3>

                <p>
                  {filter === "completed"
                    ? "You haven't completed any tasks yet."
                    : "Add a task above to get started."}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  className={`todo-item ${
                    todo.completed ? "completed" : ""
                  }`}
                  key={todo.id}
                >
                  <button
                    className="check-button"
                    onClick={() => toggleTodo(todo.id)}
                    aria-label="Toggle task"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={23} />
                    ) : (
                      <Circle size={23} />
                    )}
                  </button>

                  <span className="todo-title">{todo.title}</span>

                  {todo.completed && (
                    <span className="completed-label">
                      <Check size={14} />
                      Done
                    </span>
                  )}

                  <button
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="card-footer">
            <div className="progress-info">
              <span>
                {completedCount} of {todos.length} tasks completed
              </span>

              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width:
                      todos.length === 0
                        ? "0%"
                        : `${(completedCount / todos.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <span>TaskFlow</span>
          <span>•</span>
          <span>Monitoring Demo</span>
        </footer>
      </main>
    </div>
  );
}

export default App;