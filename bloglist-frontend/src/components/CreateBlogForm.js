import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({
  createBlogPost,
  userId
}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlogPost = (event) => {
    event.preventDefault()
    createBlogPost({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      userId: userId
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlogPost}>
        <div>title:
          <input
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </div>
        <div>author:
          <input
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
          />
        </div>
        <div>url:
          <input
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

CreateBlogForm.propTypes = {
  createBlogPost: PropTypes.func.isRequired,
  userId: PropTypes.func.isRequired
}

export default CreateBlogForm