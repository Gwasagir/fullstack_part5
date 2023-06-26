import { useState, useEffect } from 'react'

const Blog = ({ blog, handleLikePost, handleDeletePost, user }) => {
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
    const postLikes = likes+1
    setLikes(postLikes)
    handleLikePost(blog, postLikes)
  }

  const deletePostButton = async (event) => {
    event.preventDefault()
    handleDeletePost(blog.id)
  }

  const deletePost = () => {
    const username = user ? user.username : 'none'
    if(username === blog.user[0].username) {
      return(<button onClick={deletePostButton} id='delete-button' >delete</button>)
    }
  }

  return(
    <div>
      <div style={hideWhenVisible} className='blogDefaultView'>
        <span>{blog.title} {blog.author}</span>
        <button onClick={toggleDetails} className='buttonViewBlog'>view</button>
      </div>
      <div style={showWhenVisible} className='blogExpandedView'>
        {blog.title} {blog.author}

        <button onClick={toggleDetails} className='buttonHideBlog'>hide</button>
        <br></br>

        {blog.url} <br></br>
        likes {likes}
        <button onClick={likePost} id='like-button' className='likeButton'>like</button>
        <br></br>
        {blog.usersname} {deletePost()}
      </div>
    </div>
  )
}
export default Blog