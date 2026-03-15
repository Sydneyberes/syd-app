import Footer from '../components/Footer'

// Posts array — connect to a CMS (Sanity, Contentful, etc.) when ready
const posts = []

function Blog() {
  return (
    <>
      <main className="blog-page">
        <div className="blog-header">
          <h1>My<br />Thoughts</h1>
          <p>Design, process, and things I'm thinking about.</p>
        </div>

        {posts.length > 0 ? (
          <div className="blog-posts">
            {posts.map((post) => (
              <a key={post.id} href={`/blog/${post.slug}`} className="blog-post">
                <span className="blog-post-title">{post.title}</span>
                <span className="blog-post-meta">{post.date}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="blog-coming-soon">Posts coming soon</p>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Blog
