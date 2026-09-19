import Header from './Header'
import Banner from './Banner'
import About from './About'
import Work from './Work.jsx'
import Gallery from './Gallery'
import Articles from './Articles.jsx'
import Tutorials from './Tutorials.jsx'
import Newsletter from './Newsletter'
import Contact from './Contact'
import Footer from './Footer'
import './App.css'
function App() {
  return (
    <>
      <Header />

      <main>
        <Banner />
        <About />
        <Work />
        <Gallery />
        <Articles />
        <Tutorials />
        <Newsletter />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App