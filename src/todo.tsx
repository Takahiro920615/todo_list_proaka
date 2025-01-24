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

const handleEdit = (id: number, value: string) => {
  setTodos((todos) => {
    /**
     * 引数として渡された todo の id が一致する
     * 更新前の todos ステート内の todo の
     * value プロパティを引数 value (= e.target.value) に書き換える
     */
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, content: value};
      }
      return todo;
    });

    console.log('=== Original todos ===');
    todos.map((todo) => {
      console.log(`id: ${todo.id}, content: ${todo.content}`);
    });
    
    // todos ステートを更新
    return newTodos;
  });
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
      { todos.map((todo) =>{
        return (
          <li key={todo.id}>
            <input
              type="text"
              value={todo.content}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
          </li>
        );
      })}
    </ul>
   </div> 
  );
};

export default Todo;