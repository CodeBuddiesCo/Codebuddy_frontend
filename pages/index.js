import Link from 'next/link';

function HomePage() {
  const eventId = new Date();

  return (
    <div>
      <div className="main-photo"></div>
      <section className="header-section wf-section">
        <div className="logo-div"></div>
        <div className="nav-btn-div">
          <Link href="#">
            <div className="header-nav-buttons w-button">What is codebuddy?</div>
          </Link>
          <Link href="#">
            <div className="header-nav-buttons w-button">Become a buddy</div>
          </Link>
          <Link href="#">
            <div className="header-nav-buttons w-button">Calendar of Events</div>
          </Link>
          <Link href="/user/login">
            <div className="header-nav-buttons button-right w-button">Signup / Login</div>
          </Link>
        </div>
      </section>
      <section className="home-section wf-section">
        <div className="home-top-div">
          <div className="home-spacer-div"></div>
          <div className="tagline-div">
            <div className="tagline-text-block">
              Experience the power of <span className="collab-text-span">collaboration</span> on <span className="logo-text-span"> sdbhjjkk</span>, connecting you with skilled code enthusiasts through live video to supercharge your code
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
