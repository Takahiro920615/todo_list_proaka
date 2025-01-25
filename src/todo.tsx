import React, { useState, useEffect } from 'react';
import localforage from 'localforage';


type Todo = {
  content: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
};

type Filter = 'all'|'completed'|'unchecked'|'delete';

// Todoコンポーネント
const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [nexId, setNextId] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(()=> {
    localforage.getItem('todo-20240622').then((values)=> {
      if (values) {
        setTodos(values as Todo[]);
      }
    });
  }, []);

  useEffect(()=> {
    localforage.setItem('todo-20240622', todos);
  }, [todos]);


  
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

// const handleEdit = (id: number, value: string) => {
//   setTodos((todos) => {
   
//     const newTodos = todos.map((todo) => {
//       if (todo.id === id) {
//         return { ...todo, content: value};
//       }
//       return todo;
//     });

//     console.log('=== Original todos ===');
//     todos.map((todo) => {
//       console.log(`id: ${todo.id}, content: ${todo.content}`);
//     });
    
//     // todos ステートを更新
//     return newTodos;
//   });
// };

// const handleCheck = (id: number, completed_flg: boolean) => {
//   setTodos((todos) => {
//     const newTodos = todos.map((todo) => {
//       if(todo.id === id) {
//         return { ...todo, completed_flg};
//       }
//       return todo;
//     });
//     return newTodos;
//   });
// };

// const handleRemove = (id: number, delete_flg: boolean) => {
//   setTodos((todos) => {
//     const newTodos = todos.map((todo) => {
//       if(todo.id===id) {
//         return{ ...todo,delete_flg};
//       }
//         return todo;
//     });

//     return newTodos;
//   });
// };

const handleFilterChange = (filter: Filter) => {
  setFilter(filter);
};

const getFilteredTodos = () => {
  switch(filter) {
    case 'completed':
      return todos.filter((todo)=> todo.completed_flg && !todo.delete_flg);
    case 'unchecked':
      return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
    case 'delete':
      return todos.filter((todo) => todo.delete_flg);
    default:
      return todos.filter((todo) => !todo.delete_flg)
  }
}

const isFormDisabled = filter === 'completed' || filter === 'delete' ;

const handleEmpty = () => {
  setTodos((todos) => todos.filter((todo) => !todo.delete_flg));
};

// ジェネリクス関数==========================
// const updateTodo = <T extends keyof Todo>(todos: Todo[], id: number, key: T, value: Todo[T]):Todo[]=> {
//   return todos.map((todo) => {
//     if(todo.id === id) {
//       return{ ...todo, [key]:value};
//     }
//     return todo;
//   });
// };

// const handleEdit = (id:number, value: string) => {
//   setTodos((todos)=> updateTodo(todos, id, 'content', value));
// };

// const handleCheck = (id: number, completed_flg: boolean) => {
//   setTodos((todos) => updateTodo(todos, id, 'completed_flg', completed_flg))
// }

// const handleRemove = (id:number, delete_flg: boolean) => {
//   setTodos((todos) => updateTodo(todos, id, 'delete_flg', delete_flg));
// };
// ==============================================

const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
  id: number,
  key: K,
  value: V
) => {
  setTodos((todos) => {
    const newTodos = todos.map((todo)=> {
    if(todo.id === id){
      return{...todo,[key]:value};
    } else {
      return todo;
    }
  });
  return newTodos;
});
};




return (
  <div className="todo-container">
    <select
      defaultValue="all"
      onChange={(e) => handleFilterChange(e.target.value as Filter)}
    >
      <option value="all">すべてのタスク</option>
      <option value="completed">完了したタスク</option>
      <option value="unchecked">現在のタスク</option>
      <option value="delete">ごみ箱</option>
    </select>
    {/* フィルターが `delete` のときは「ごみ箱を空にする」ボタンを表示 */}
    {filter === 'delete' ? (
      <button onClick={handleEmpty}>
        ごみ箱を空にする
      </button>
    ) : (
      // フィルターが `completed` でなければ Todo 入力フォームを表示
      filter !== 'completed' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            value={text} // フォームの入力値をステートにバインド
            disabled={isFormDisabled}
            onChange={(e) => setText(e.target.value)} // 入力値が変わった時にステートを更新
          />
          <button type="submit">追加</button>
        </form>
      )
    )}
    <ul>
      {getFilteredTodos().map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed_flg}
            onChange={() => handleTodo(todo.id, 'completed_flg', !todo.completed_flg)}
          />
          <input
            type="text"
            disabled={todo.completed_flg || todo.delete_flg}
            value={todo.content}
            onChange={(e) => handleTodo(todo.id, 'content', e.target.value)}
          />
          <button onClick={() => handleTodo(todo.id, 'delete_flg', !todo.delete_flg)}>
            {todo.delete_flg ? '復元' : '削除'}
          </button>
        </li>
      ))}
    </ul>
  </div>
);
};

export default Todo;