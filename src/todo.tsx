import React, { useState } from 'react';

type Todo = {
  content: string;
  readonly id: number;
};

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [nexId, setNextId] = useState(1);

  
  const handleSubmit = () => {

    // 値がからの場合は何もせず終了する
    if (!text) return;
  

  const newTodo: Todo = {
    content: text,
    id: nexId,
  };
  
  setTodos((prevTodos) => [newTodo, ...prevTodos]);
  setNextId(nexId + 1)
  setText('');
};

  return(
   <div>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >

    <input
      type="text"
      value={text}
      onChange={(e)=> setText(e.target.value)}
    />
    <input type="submit" content="追加"/>
    </form>
    <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="text"
                value={todo.content}
                onChange={(e) => e.preventDefault()}
              />
            </li>
        )}
          
        )}
    </ul>
   </div> 
  );
};

export default Todo;