import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [input, setInput] = useState(""); //value in the input
  const [todos, setTodos] = useState([]); //storing the value of todos here after we fetched from the API
  const [isUpdating, setIsUpdating] = useState(false); //Boolean for is user Editing the task or not
  const [updatingTodo, setUpdatingTodo] = useState({}); //storing the value of todo that we editing

  // Fetching the Todos from the API
  const getTodos = () => {
    try {
      fetch("https://todo-list-backend-km0f.onrender.com/todos")
        .then((res) => res.json())
        .then((data) => {
          setTodos(data);
          console.log(data);
        });
    } catch (e) {
      console.error("Error while fetching the todos:", e);
    }
  };

  // fetching the todos when the page initially loads

  useEffect(() => {
    getTodos();
  }, []);

  //Create Todo Sending Post request to the api

  const handleAddTodos = async () => {
    try {
      const response = await fetch("https://todo-list-backend-km0f.onrender.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          work: input,
          status: false,
          createdAt: new Date(),
          lastUpdated: new Date(),
        }),
      });

      const data = await response.json();
      console.log("Created:", data);
      alert(data.message);
    } catch (e) {
      console.error("Error while posting Todo:", e);
    } finally {
      setInput("");
    }

    // fetching the updated todos when new one added
    getTodos();
  };

  // Delete Todo Sending Delete request for the api

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`https://todo-list-backend-km0f.onrender.com/todos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      alert(data.message);
    } catch (e) {
      console.log("Error while Deleting th todos:", e);
    }

    // fetching the updated todos when existing one is deleted
    getTodos();
  };

  //Edit Todo sending put request to the api

  const handleEditTodo = async (todo) => {
    try {
      const response = await fetch(`https://todo-list-backend-km0f.onrender.com/todos/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          work: input,
          status: todo.status,
          createdAt: todo.createdAt,
          lastUpdated: new Date(),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      alert(data.message);

      //clearing the input field
      setInput("");
      // fetching the updated todos when existing one is updated
      getTodos();
    } catch (e) {
      console.error("Error while Updating:", e);
    }
  };

  // checking if the user is updating and changing the value in the input

  useEffect(() => {
    if (isUpdating) {
      setInput(updatingTodo.work);
    }
  }, [isUpdating, updatingTodo]);

  return (
    <div className="flex items-center justify-center p-20 bg-[#f4f2f0]">
      <div className="relative w-[80vw] rounded-2xl">
        <div className="bg-[#555c91] p-5 pb-20 w-full rounded-t-3xl">
          <h3 className=" font-medium text-3xl text-center mb-3">TODO List</h3>
          <div className="absolute top-34 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg flex flex-col items-center gap-5 w-[85%] px-[25%] rounded-2xl mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border-b-2 border-[#555c91] p-1.5 w-[70%] text-[#555c91] text-md placeholder:text-[#555c91] placeholder:text-md"
              placeholder="What would you like to do ?"
            />
            {isUpdating ? (
              <button
                className="bg-[#ed6a5a] p-2 text-md font-medium rounded-md w-20 cursor-pointer"
                onClick={() => {
                  if (input.length > 0) {
                    handleEditTodo(updatingTodo);
                  }
                }}
              >
                Update
              </button>
            ) : (
              <button
                className="bg-[#ed6a5a] p-2 text-md font-medium rounded-md w-20 cursor-pointer"
                onClick={() => {
                  if (input.length > 0) {
                    handleAddTodos();
                  }
                }}
              >
                +Add
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-white pt-30 flex items-center justify-center rounded-b-2xl pb-6">
          <div className=" bg-white shadow-lg flex flex-col gap-5 w-[85%] rounded-2xl border-gray-300">
            <div className="p-5 ">
              <h3 className="font-medium text-2xl ">TODO List</h3>
            </div>
            <div className="w-full overflow-x-auto ">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-6 py-2">List</th>
                    <th className="px-6 py-2">Status</th>
                    <th className="px-6 py-2">Close</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr
                      key={todo._id}
                      className="bg-gray-50 border-t"
                      onDoubleClick={() => {
                        setUpdatingTodo(todo);
                        setIsUpdating(!isUpdating);
                      }}
                    >
                      <td className="px-6 py-2 whitespace-nowrap">
                        {todo.work}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {todo.status === false ? "Pending" : "Completed"}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="sm"
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            handleDeleteTodo(todo._id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
