import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [info, setInfo] = useState({ message: null})

  const [username, setUsername] = useState('') 
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('') 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlogPost= async (blogObject) => {
      try {
      const returnedBlogObj = await blogService.create(blogObject) // error happens here but cant stop promise handling
      setBlogs(blogs.concat(returnedBlogObj))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch(exception) {
      notifyWith( 'invalid blog post', 'error' )
    }
  }
  
  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })
    setTimeout(() => {
      setInfo({ message: null} )
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      notifyWith( `${user.username} logged in succesfully` )
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith( 'Wrong credentials' , 'error')
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.clear()
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const loggedInForm = () => (
    <div>
      <form onSubmit={handleLogout}>
      {user.username} logged in 
        <button type="submit">logout</button>
      </form>
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification info={info} />
      {!user && loginForm()} 
      {user && <div>
          {loggedInForm()}
        </div>
      }
      {user && 
        <Togglable buttonLabel="show create">
          <CreateBlogForm
            createBlogPost={createBlogPost}
            userId={user.id}
          />
        </Togglable>
      }
    <br></br>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}/>
      )}

    </div>
  )
}

export default App