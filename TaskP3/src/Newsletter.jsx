import { useState } from 'react'

function Newsletter() {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {

    event.preventDefault()

    if (email === '') {
      setMessage('Please enter your email.')
      return
    }

    setMessage('Successfully subscribed!')

    setEmail('')
  }

  return (
    <section
      id="subscribe"
      className="newsletter-section"
    >

      <div className="section-container">

        <h2>Sign Up for Our Daily Insider</h2>

        <p className="section-subtitle">
          Subscribe to receive the latest updates and news.
        </p>

        <form
          onSubmit={handleSubmit}
          className="newsletter-form"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

        <p className="newsletter-message">
          {message}
        </p>

      </div>

    </section>
  )
}

export default Newsletter