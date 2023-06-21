import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blogRendering', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'Book of TestLib',
      author: 'James Jest',
      url: 'http://testing-library.react',
      user: 'null'
    }
    container = render(
      <Blog blog={blog} />
    ).container
  })

  test('renders blog title and author', () => {
    const blogElement = container.querySelector('.blogDefaultView')
    const hiddenElement = container.querySelector('.blowExpandedView')
    expect(blogElement).toBeDefined()
    expect(hiddenElement).toBeDefined()
  })

  test('renders blog url and likes when "view" button is pressed', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.buttonViewBlog')
    await user.click(button)
    const blogElement = container.querySelector('.blowExpandedView')
    expect(blogElement).toBeDefined()
  })

  test('pressing like twice, calls event handler twice', async () => {
    const blog = {
      title: 'Book of TestLib',
      author: 'James Jest',
      url: 'http://testing-library.react',
      user: 'null'
    }
    const mockHandler = jest.fn()
    container = render(
      <Blog blog={blog} handleLikePost={mockHandler}/>
    ).container

    const user = userEvent.setup()
    const button = container.querySelector('.likeButton')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})