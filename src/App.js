import { useState, useEffect } from 'react';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import api from "./utils/api"

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  // Read todos
  const getTasks = async () => {
    const response = await api.get('/tasks');
    setTodoList(response.data.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Create todos
  const addTask = async () => {
    try {
      const response = await api.post('/tasks', {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        console.log('Success');
        setTodoValue(""); // 입력창 초기화
        getTasks(); // 값 추가하면 다시 할일리스트 출력
      } else {
        throw new Error('Task cannot be added');
      }
    } catch (err) {
      console.log('Error', err);
    }
  }

  // Update todos
  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      console.log('task', task);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (err) {
      console.log('Error', err);
    }
  }

  // Delete todos
  const deleteItem = async (id) => {
    try {
      const deleteTask = todoList.find((item) => item._id === id);
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }

    } catch (err) {
      console.log('Error', err);
    }
  }

  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            className="input-box"
            value={todoValue}
            onChange={(event) => setTodoValue(event.target.value)}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask}>추가</button>
        </Col>
      </Row>

      <TodoBoard
        todoList={todoList}
        deleteItem={deleteItem}
        toggleComplete={toggleComplete}
      />
    </Container>
  );
}

export default App;
