
import {useEffect, useState} from 'react'
import {Link, Route, Routes,useNavigate, useParams} from 'react-router-dom'
function Header() {
  return <header><h1><Link to='/'>WEB</Link></h1></header>
}
function Nav(props) {
  return <nav><ol>{props.data.map((item) => {
    return <li key={item.id}><Link to={`/read/${item.id}`}>{item.title}</Link></li>
  })}</ol></nav>
}
function Read() {
  const param = useParams()
  const id = Number(param.id)
  const [topic, setTopic] = useState([{title:null, body: null}])
  const refreshTopic = async () => {
    const res = await fetch(`http://localhost:3333/topics/`+id);
    const result = await res.json()
    setTopic(result)
  }
 
  useEffect(() => {
    refreshTopic()
  }, [id]) 


  return <article><h2>{topic.title}</h2>{topic.body}</article>
}

function Create() {
  const nagivate = useNavigate()
  const submitHandler = async (evt) => {
    evt.preventDefault();
    const title = evt.target.title.value;
    const body = evt.target.body.value;

    const res = await fetch('http://localhost:3333/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, body})
    })
    const result = await res.json()
    nagivate('/read/' + result.id)

  }

  return <form onSubmit={submitHandler}>
    <h2>Create</h2>
    <p><input type="text" name="title" placeholder='title'></input></p>
    <p><textarea name='body' placeholder='body'></textarea></p>
    <p><input type="submit" value="create"></input></p>
  </form>
}

function Control(){
  const param = useParams();
  const id = Number(param.id)
  let contextUI = null;
  if (id) {
    contextUI = <><Link to={'/update/' + id}>Update</Link></>
  }
  return <ul>
      <li><Link to="/create">Create</Link></li>
    </ul>
}
function App() {
  const [topics, setTopics] = useState([])
  const refreshTopics = async () => {
    const res = await fetch(`http://localhost:3333/topics`);
    const result = await res.json()
    setTopics(result)
  }
 
  useEffect(() => {
    refreshTopics()
  }, []) 

  // console.log(topics)
  return (
    <div className="App">
      <Header></Header>
      <Nav data={topics}></Nav>
      <Routes>
        <Route path='/' element={<><h2>Welcome</h2>Hello React!</>}>
        
        </Route>
        <Route path='/read/:id' element={<Read></Read>}></Route>
        <Route path='/create' element={<Create></Create>}></Route>
      </Routes>
      <Routes>
        {['/', '/read/:id', '/create'].map(e=>{
          return <Route key={e} path={e} element={<Control></Control>}></Route>
        })}
      </Routes>

      <Control></Control>
    </div>

  );
}

export default App;
