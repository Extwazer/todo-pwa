import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(localStorage.getItem("to-do-list")) || {
      elements: [],
      filter: "all",
    };
  }

  componentDidUpdate = () => {
    const { elements } = this.state;
    localStorage.setItem("to-do-list", JSON.stringify({ elements }));
  };

  addNewElement = (e) => {
    if (e.keyCode === 13) {
      this.setState({
        elements: this.state.elements.concat({
          id: Date.now(),
          value: e.target.value,
          isCheck: false,
        }),
      });
    }
  };

  deleteElement = (elementId) => {
    const { elements } = this.state;
    const newArray = elements.filter(({ id }) => id !== elementId);
    this.setState({
      elements: newArray,
    });
  };

  checkElement = (checkedId) => {
    const { elements } = this.state;
    const newArray = elements.map(({ id, value, isCheck }) => {
      if (id === checkedId) {
        isCheck = !isCheck;
      }
      return { id: id, value: value, isCheck };
    });

    this.setState({
      elements: newArray,
    });
  };

  checkAllElements = () => {
    const { elements } = this.state;
    let check = false;

    elements.forEach((el) => {
      if (!el.isCheck) {
        check = true;
      }
    });

    const newArray = elements.map(({ id, value, isCheck }) => {
      return { id: id, value: value, isCheck: check };
    });

    this.setState({
      elements: newArray,
    });
  };

  removeCheckedElements = () => {
    const { elements } = this.state;

    const filteredArray = elements.filter(({ isCheck }) => !isCheck);

    this.setState({
      elements: filteredArray,
    });
  };

  countFinishedElements = () => {
    const { elements } = this.state;
    const count = elements.filter(({ isCheck }) => isCheck !== false).length;
    return count;
  };

  changeFilterElements = (arg) => {
    if (typeof arg !== "string") return;
    this.setState({
      filter: arg,
    });
  };

  filterElements = (arg) => {
    const { elements } = this.state;

    const newArray = elements.filter((el) => {
      switch (arg) {
        case "completed":
          return el.isCheck === true;
          break;
        case "nCompleted":
          return el.isCheck === false;
          break;
        default:
          return el;
      }
    });

    return newArray.map(({ id, value, isCheck }) => (
      <li id={id} className={isCheck ? "light-green" : ""}>
        <div className="element">{value}</div>
        <div className="elements-btns">
          <button
            className="button checked"
            onClick={() => this.checkElement(id)}
          >
            {isCheck ? "Checked" : "Not Checked"}
          </button>

          <button
            className="button delete"
            onClick={() => this.deleteElement(id)}
          >
            Delete
          </button>
        </div>
      </li>
    ));
  };

  render() {
    const { elements } = this.state;
    return (
      <div className="container margins">
        <div className="col-8">
          <div className="form-element">
            <input type="text" onKeyDown={this.addNewElement}></input>
          </div>
          {elements.length ? (
            <div className="filtration">
              <button
                onClick={() => this.changeFilterElements("all")}
                className="button"
              >
                Show All
              </button>
              <button
                onClick={() => this.changeFilterElements("completed")}
                className="button "
              >
                Show Completed
              </button>
              <button
                onClick={() => this.changeFilterElements("nCompleted")}
                className="button "
              >
                Show Not Completed
              </button>
            </div>
          ) : null}
          <ul className="form-lists">
            {this.filterElements(this.state.filter)}
          </ul>
        </div>
        <div className="col-4">
          <div className="sidebar">
            <h2>Task Finished: {this.countFinishedElements()}</h2>
            {elements.length ? (
              <button
                className="button"
                onClick={() => this.checkAllElements()}
              >
                Check All
              </button>
            ) : null}
            {elements.length ? (
              <button
                className="button"
                onClick={() => this.removeCheckedElements()}
              >
                Remove Checked
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
