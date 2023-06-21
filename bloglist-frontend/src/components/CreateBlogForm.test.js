import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('new blog form is calling event handler with right details', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<CreateBlogForm createBlogPost={createBlog}/>)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Book of form Test')
  await user.type(authorInput, 'James Test')
  await user.type(urlInput, 'www.TestBook.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Book of form Test')
})
