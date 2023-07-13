import Link from 'next/link';

function HomePage() {

  const eventId = new Date();

return (
<div>
  <div><img className="main-photo" src="alvan-nee-73flblFUksY-unsplash-1-min.jpg" alt='image of dog friends happy together'/></div>
  <section className="header-section wf-section">
  <img className='logo-div' src="/CB_logo.png" alt='code buddy logo'/>
    <div className="nav-btn-div">
      <a href="#" className="header-nav-buttons w-button">What is codebuddy?</a>
      <a href="#" className="header-nav-buttons w-button">Become a buddy</a>
      <a href="#" className="header-nav-buttons w-button">Calendar of Events</a>
      <a href="#" className="header-nav-buttons button-right w-button">Signup / Login</a>
    </div>
  </section>
  <section className="home-section wf-section">
    <div className="home-top-div">
      <div className="home-spacer-div"></div>
      <div className="tagline-div">
        <div className="tagline-text-block">Experience the power of <span className="collab-text-span">collaboration</span> on <span> <img className='logo-text-span' src='grey_logo.png' alt='code buddy logo'/></span>, connecting you with skilled code enthusiasts through live video to supercharge your code</div>
      </div>
    </div>
  </section>
</div>

)
}

export default HomePage;