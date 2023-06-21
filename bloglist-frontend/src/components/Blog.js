import { useState } from 'react'

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

  const likePost = () => {}

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
        {blog.user[0].name}
      </div>
  </div>
  )
}
export default Blog