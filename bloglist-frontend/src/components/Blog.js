import { useState, useEffect } from 'react'

const Blog = ({blog, handleLikePost, handleDeletePost, username}) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {setLikes(blog.likes)}, [blog.likes])

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

  const likePost = async (event) => {
    event.preventDefault()
    const postLikes = await likes+1
    setLikes(postLikes)
    handleLikePost(blog, postLikes)
  }

  const deletePostButton = async (event) => {
    event.preventDefault()
    handleDeletePost(blog.id)
  }

  const deletePost = () => {
    if(username === blog.user[0].username) {
      return(<button onClick={deletePostButton}>delete</button>)
    }
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
          likes {likes} <button onClick={likePost}>like</button> <br></br>
          {blog.usersname}
          {deletePost()}
        </div>
    </div>
  )
}
export default Blog