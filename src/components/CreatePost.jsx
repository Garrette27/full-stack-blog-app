import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/posts.js'
import './CreatePost1.css' // Make sure the path is correct

export function CreatePost() {
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: (formData) => createPost(formData),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      title: formData.get('title'),
      author: formData.get('author'),
      contents: formData.get('contents'),
    }
    createPostMutation.mutate(data)
  }

  return (
    <div className='container'>
      <form className='create-post' onSubmit={handleSubmit}>
        {/* Post Details Section */}
        <div className='post-details'>
          <div>
            <label htmlFor='title'>Title:</label>
            <input type='text' id='title' name='title' />
          </div>
          <div>
            <label htmlFor='author'>Author:</label>
            <input type='text' id='author' name='author' />
          </div>
          <div>
            <label htmlFor='contents'>Contents:</label>
            <textarea id='contents' name='contents'></textarea>
          </div>
          <button type='submit'>
            {createPostMutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>

        {/* Additional Form Section */}
        <div
          style={{
            flex: '1 1 45%',
            display: 'grid',
            gridTemplateColumns: '1fr', // Single column layout
            gap: '1rem',
            minWidth: '300px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor='firstName'
              style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
            >
              First Name:
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor='lastName'
              style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
            >
              Last Name:
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor='birthDate'
              style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
            >
              Birth Date:
            </label>
            <input
              type='date'
              id='birthDate'
              name='birthDate'
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor='email'
              style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
            >
              E-Mail:
            </label>
            <input
              type='email'
              id='email'
              name='email'
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                width: '100%',
              }}
            />
          </div>
          <button
            type='submit'
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Send
          </button>
        </div>
      </form>

      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post created successfully!
        </>
      ) : null}
    </div>
  )
}
