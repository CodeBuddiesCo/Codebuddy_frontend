import Link from 'next/link';

function HomePage() {

  const eventId = new Date();

return (
<div>
<div class="div-block-8"></div>
  <section class="section wf-section">
    <div class="div-block-3"></div>
    <div class="div-block-4">
      <a href="#" class="nav-buttons w-button">What is codebuddy?</a>
      <a href="#" class="nav-buttons w-button">Become a buddy</a>
      <a href="#" class="nav-buttons w-button">Calendar of Events</a>
      <a href="#" class="nav-buttons right w-button">Signup / Login</a>
    </div>
  </section>
  <section class="section-2 wf-section">
    <div class="div-block-5"></div>
    <div class="div-block-6">
      <div class="text-block">Experience the power of <span class="text-span">collaboration</span> on                   , connecting you with skilled  code enthusiasts through live video to supercharge your code</div>
      <div class="div-block-7"></div>
    </div>
  </section>
</div>

)
}

export default HomePage;