import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [info, setInfo] = useState({ message: null })
  const blogFormRef = useRef()

  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')

  useEffect(() => {
    async function getBlogs() {
      const getBlogs = await blogService.getAll()
      const blogList = [].concat(getBlogs)
        .sort((a,b) => a.likes < b.likes ? 1 : -1)
      setBlogs( blogList )
    }
    getBlogs()
  }, [info])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLikePost = (blog, likes) => {
    blogService
      .update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: blog.user,
        usersname: blog.usersname,
        likes: likes
      })
  }


  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })
    setTimeout(() => {
      setInfo({ message: null } )
    }, 4000)
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

  const handleLogout = async () => {
    window.localStorage.clear()
  }

  const loggedInView = () => (
    <div>
      <form onSubmit={handleLogout}>
        {user.username} logged in
        <button type="submit">logout</button>
      </form>
    </div>
  )

  const handleDeletePost = (blogId) => {
    blogService
      .deleteBlog(blogId, `Bearer ${ user.token }`)
      .then(notifyWith( 'Post deleted'))
  }

  const createBlogPost= (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlogObj => {
        setBlogs(blogs.concat(returnedBlogObj))
        notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        blogFormRef.current.toggleVisibility()
      })
      .catch(error => notifyWith( error.response.data.error, 'error'))
  }

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
      {user && <div> {loggedInView()} </div> }
      {user &&
        <Togglable buttonLabel="show create">
          <CreateBlogForm
            createBlogPost={createBlogPost}
          />
        </Togglable>
      }
      <ul>
        {blogs.map((blog =>
          <Blog key={blog.id}
            blog={blog}
            handleLikePost={handleLikePost}
            handleDeletePost={handleDeletePost}
            user={user} />
        ))}
      </ul>

    </div>
  )
}

export default App