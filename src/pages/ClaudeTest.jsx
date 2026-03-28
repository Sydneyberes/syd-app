import ReactMarkdown from 'react-markdown'
import Footer from '../components/Footer'
import spec from '../content/route-planner-spec.md?raw'

function ClaudeTest() {
  return (
    <>
      <main className="claude-test-page">
        <div className="claude-test-content">
          <ReactMarkdown>{spec}</ReactMarkdown>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ClaudeTest
