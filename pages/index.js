import Link from 'next/link';

function HomePage() {

  const eventId = new Date();

return (
<div>
  <div class="main-photo"></div>
  <section class="header-section wf-section">
    <div class="logo-div"></div>
    <div class="nav-btn-div">
      <a href="#" class="header-nav-buttons w-button">What is codebuddy?</a>
      <a href="#" class="header-nav-buttons w-button">Become a buddy</a>
      <a href="#" class="header-nav-buttons w-button">Calendar of Events</a>
      <a href="#" class="header-nav-buttons button-right w-button">Signup / Login</a>
    </div>
  </section>
  <section class="home-section wf-section">
    <div class="home-top-div">
      <div class="home-spacer-div"></div>
      <div class="tagline-div">
        <div class="tagline-text-block">Experience the power of <span class="collab-text-span">collaboration</span> on <span class="logo-text-span"> sdbhjjkk</span>, connecting you with skilled code enthusiasts through live video to supercharge your code</div>
      </div>
    </div>
  </section>
</div>

)
}

export default HomePage;