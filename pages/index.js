import Link from 'next/link';

function HomePage() {

  const eventId = new Date();

return (
  <div>
    <h1>Welcome to Codebuddy</h1>
    <ul>
      <li><Link href="/event/calendar">Calendar of Events</Link></li>
      <li><Link href={`/event/details/${eventId}`}>Event Details</Link></li>
      <li><Link href="/user/login">Login</Link></li>
      <li><Link href="/user/register">Register</Link></li>
      <li><Link href="/user/profile">User Profile</Link></li>
    </ul>
  </div>
)
}

export default HomePage;