import { useState } from "react"

const CreateBlogForm = ({
    createBlogPost,
    userId
  }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const addBlogPost = (event) => {
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

  export default CreateBlogForm