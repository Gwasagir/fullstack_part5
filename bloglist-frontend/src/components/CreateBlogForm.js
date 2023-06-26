import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({
  createBlogPost,
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
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>create new</h2>
      <form onSubmit={addBlogPost}>
        <div>title:
          <input
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='write blog title here'
          />
        </div>
        <div>author:
          <input
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='write author here'
          />
        </div>
        <div>url:
          <input
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='write url here'
          />
        </div>
        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

CreateBlogForm.propTypes = {
  createBlogPost: PropTypes.func.isRequired,
}

export default CreateBlogForm