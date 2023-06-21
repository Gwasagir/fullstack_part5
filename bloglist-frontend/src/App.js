import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import LoginForm from './components/LoginForm'
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
        const returnedBlogObj = await blogService.create(blogObject)
        setBlogs(blogs.concat(returnedBlogObj))
        console.log('created new blogpost')
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
      {!user && 
        <Togglable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>} 
      {user && <div> {loggedInForm()} </div> }
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