import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

const emptyTodoItem = {
  title: "",
  description: "",
  completed: false,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],

      modal: false,
      todoItem: {
        ...emptyTodoItem,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = async () => {
    try {
      const res = await axios.get("/api/todos/");
      this.setState({ todoList: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = async (item) => {
    this.toggleModal();

    if (item.id) {
      try {
        await axios.put(`/api/todos/${item.id}/`, item);
        this.refreshList();
      } catch (error) {
        console.error(error);
      }
      return;
    }

    try {
      await axios.post(`/api/todos/`, item);
      this.refreshList();
    } catch (error) {
      console.error(error);
    }
  };

  handleDelete = async (item) => {
    try {
      await axios.delete(`/api/todos/${item.id}`, item);
      this.refreshList();
    } catch (error) {
      console.error(error);
    }
  };

  createItem = () => {
    this.setState({
      todoItem: { ...emptyTodoItem },
      modal: !this.state.modal,
    });
  };

  editItem = (todoItem) => {
    this.setState({ todoItem, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    return this.setState({ viewCompleted: !!status });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={`nav-link ${this.state.viewCompleted ? "active" : ""}`}
          onClick={() => this.displayCompleted(true)}
        >
          Complete
        </span>
        <span
          className={`nav-link ${this.state.viewCompleted ? "" : "active"}`}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;

    const itemsToShow = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return itemsToShow.map((item) => {
      return (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${
              this.state.viewCompleted ? "completed-todo" : ""
            }`}
            title={item.description}
          >
            {item.title}
          </span>
          <span>
            <button
              onClick={() => this.editItem(item)}
              className="btn btn-secondary mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => this.handleDelete(item)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </span>
        </li>
      );
    });
  };

  render = () => {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            todoItem={this.state.todoItem}
            toggle={this.toggleModal}
            onSave={this.handleSubmit}
          ></Modal>
        ) : null}
      </main>
    );
  };
}
export default App;
