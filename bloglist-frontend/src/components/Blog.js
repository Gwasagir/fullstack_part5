import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({blog}) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { 
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: visible ? 'none' : '' 
  }
  const showWhenVisible = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: visible ? '' : 'none' 
  }

  const toggleDetails = () => {
    setVisible(!visible)
  }

  const likePost = () => {
    blogService
    .update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
      usersname: blog.usersname,
      likes: blog.likes+1
    })
    .then(returnedObject => {
      console.log(returnedObject)
      console.log("Hey")
    })
  }

  return(
    <div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>view</button>
      </div>  
      <div style={showWhenVisible}>
        {blog.title} {blog.author} 
        <button onClick={toggleDetails}>hide</button> <br></br>
        {blog.url} <br></br>
        likes {blog.likes} <button onClick={likePost}>like</button> <br></br>
        {blog.usersname}
      </div>
  </div>
  )
}
export default Blog