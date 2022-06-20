import {useState,useEffect} from 'react';
import {Link, Routes, Route, useParams, useNavigate} from 'react-router-dom';
function Header(){
  return <header><h1><Link to="/">WEB</Link></h1></header>
}
function Nav(props){
  return <nav><ol>{props.data.map(e=>{
    return <li key={e.id}><Link to={`/read/${e.id}`}>{e.title}</Link></li>
  })}</ol></nav>
}

function Read(props){
  const param = useParams();
  const id = Number(param.id);
  const [topic, setTopic] = useState({title:null, body:null});
  const refreshTopic = async ()=>{
    const resp = await fetch('http://localhost:3333/topics/'+id);
    const result = await resp.json();
    setTopic(result);
  }
  useEffect(()=>{
    refreshTopic();
  },[id]);
  return <article>
    <h2>{topic.title}</h2>
    {topic.body}
  </article>
}
function Create(props){  
  const submitHandler = async (evt)=>{
    evt.preventDefault();    
    const title = evt.target.title.value;
    const body = evt.target.body.value;
    props.onCreate(title, body);    
  }
  return <form onSubmit={submitHandler}>
    <h2>Create</h2>
    <p><input type="text" name="title" placeholder="title"></input></p>
    <p><textarea name="body" placeholder="body"></textarea></p>
    <p><input type="submit" value="create" /></p>
  </form>
}
function Control(props){
  const param = useParams();
  const id = Number(param.id);
  let contextUI = null;
  if(id){
    contextUI = <>
      <Link to={'/update/'+id}>Update</Link>
      <button onClick={()=>{
        props.onDelete(id);
      }}>delete</button>
    </>
  }
  return <ul>
    <li><Link to="/create">Create</Link></li>
    {contextUI}
  </ul>
}
function Update(props){
  const param = useParams();
  const id = Number(param.id);
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const refreshTopic = async ()=>{
    const resp = await fetch('http://localhost:3333/topics/'+id);
    const result = await resp.json();
    setTitle(result.title);
    setBody(result.body);
  }
  useEffect(()=>{
    refreshTopic();
  },[id]);
  
  const navigate = useNavigate();
  const submitHandler = async (evt)=>{
    evt.preventDefault();    
    const title = evt.target.title.value;
    const body = evt.target.body.value;
    props.onUpdate(id,title,body)    
  }
  return <form onSubmit={submitHandler}>
    <h2>Update</h2>
    <p><input type="text" name="title" placeholder="title" value={title} onChange={(evt)=>{
      setTitle(evt.target.value);
    }}></input></p>
    <p><textarea name="body" placeholder="body" value={body} onChange={evt=>{
      setBody(evt.target.value);
    }}></textarea></p>
    <p><input type="submit" value="update" /></p>
  </form>
}
function App() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const refreshTopics = async ()=>{
    const resp = await fetch('http://localhost:3333/topics');
    const result = await resp.json();
    setTopics(result);
  }
  useEffect(()=>{
    refreshTopics();
  },[]);
  const createHandler = async (title, body)=>{
    const resp = await fetch('http://localhost:3333/topics',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, body})
    })
    const result = await resp.json();
    navigate('/read/'+result.id);
    refreshTopics();
  }
  const updateHandler = async (id,title,body)=>{
    const resp = await fetch('http://localhost:3333/topics/'+id,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, body})
    })
    const result = await resp.json();
    navigate('/read/'+result.id);
    refreshTopics();
  }
  const deleteHandler = async (id)=>{
    const resp = await fetch('http://localhost:3333/topics/'+id,{
      method: 'DELETE'
    })
    const result = await resp.json();
    navigate('/');
    refreshTopics();
  }
  return (
    <div>
      <Header></Header>
      <Nav data={topics}></Nav>
      <Routes>
        <Route path="/" element={<><h2>Welcome</h2>Hello, React!</>}></Route>
        <Route path="/read/:id" element={<Read></Read>}></Route>
        <Route path="/create" element={<Create onCreate={createHandler}></Create>}></Route>
        <Route path="/update/:id" element={<Update onUpdate={updateHandler}></Update>}></Route>
      </Routes>
      <Routes>
        {['/', '/read/:id', '/create'].map(e=>{
          return <Route key={e} path={e} element={<Control onDelete={deleteHandler}></Control>}></Route>
        })}
      </Routes>
    </div>
  );
}

export default App;
