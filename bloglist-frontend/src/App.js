import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [info, setInfo] = useState({ message: null})
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


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

  const createBlog= (event) => {
    event.preventDefault()
      const blogObject = {
        title: title,
        author: author,
        url: url,
        userId: user.id
      }
      try {
      blogService
        .create(blogObject)
          .then(returnedBlog => {
            console.log("here")
            setBlogs(blogs.concat(returnedBlog))
            notifyWith(`a new blog ${title} by ${author} added`)
            setTitle('')
            setAuthor('')
            setUrl('')
          })    
    } catch(error) {
      notifyWith(('invalid blog post', 'error'))
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

      <h2>create new</h2>

      <form onSubmit={createBlog}>
        <div>title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>url:
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
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
    <br></br>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

    </div>
  )
}

export default App