import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center">
      <div className="text-3xl font-bold underline">Hello world!</div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;
