import React, { useState } from 'react';

type Todo = {
  content: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
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
    completed_flg: false,
    delete_flg: false,
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

const handleCheck = (id: number, completed_flg: boolean) => {
  setTodos((todos) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id) {
        return { ...todo, completed_flg};
      }
      return todo;
    });
    return newTodos;
  });
}

const handleRemove = (id: number, delete_flg: boolean) => {
  setTodos((todos) => {
    const newTodos = todos.map((todo) => {
      if(todo.id===id) {
        return{ ...todo,delete_flg};
      }
        return todo;
    });

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
              type="checkbox"
              checked={todo.completed_flg}
              onChange={() => handleCheck(todo.id, !todo.completed_flg)}
            />
            <input
              type="text"
              value= {todo.content}
              disabled ={todo.completed_flg}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleRemove(todo.id, !todo.delete_flg)}>
              {todo.delete_flg? '復元' : '削除'}
            </button>
          </li>
        );
      })}
    </ul>
   </div> 
  );
};

export default Todo;