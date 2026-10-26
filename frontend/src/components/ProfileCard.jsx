import { formatDate } from '../utils/format';

export default function ProfileCard({ user, title = 'Profile' }) {
  return (
    <section className="card profile" aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="card__title">{title}</h2>
      <dl className="dl">
        <div><dt>Email</dt><dd>{user.email}</dd></div>
        <div><dt>Account ID</dt><dd>{user.id}</dd></div>
        <div><dt>Account created</dt><dd>{formatDate(user.timeCreated)}</dd></div>
      </dl>
    </section>
  );
}
