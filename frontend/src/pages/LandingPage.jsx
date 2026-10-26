import { KeyRound, LayoutDashboard, FileText, Smartphone } from 'lucide-react';
import Button from '../components/Button';
import { heroImage } from '../utils/heroImage';

const FEATURES = [
  { icon: KeyRound, title: 'Secure Account Access', text: 'Create an account and sign in with your email and password. Protected actions need you to be signed in.' },
  { icon: LayoutDashboard, title: 'Personal Dashboard', text: 'See your account details and an overview of your posts as soon as you sign in.' },
  { icon: FileText, title: 'Information Management', text: 'Create, view, update and delete posts from one place, with a confirmation before anything is removed.' },
  { icon: Smartphone, title: 'Simple and Reliable Experience', text: 'A clear layout that works the same on your phone, tablet and computer.' },
];

export default function LandingPage() {
  return (
    <>
      <section className="hero" id="home">
        {heroImage && <img className="hero__img" src={heroImage} alt="Feyide House" />}
        <div className="hero__veil" />
        <div className="container hero__content">
          <h1 className="hero__title">MY SAFETY</h1>
          <p className="hero__lead">Your Safety. Your Space. Your Peace of Mind.</p>
          <p className="hero__text">
            A simple and reliable platform designed to help you stay connected, manage information, and access your safety resources with ease.
          </p>
          <div className="hero__actions">
            <Button to="/register" variant="accent" size="lg">Get Started</Button>
            <Button to="/login" variant="light" size="lg">Login</Button>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container about">
          <div>
            <h2>A calm place to keep your information in order</h2>
          </div>
          <div className="about__body">
            <p>
              MY SAFETY gives you a straightforward way to manage your own information online. Register with your email, sign in, and use your dashboard to review your account and work with posts.
            </p>
            <p>The interface is deliberately plain: fewer screens, clear actions, and messages that tell you exactly what happened.</p>
          </div>
        </div>
      </section>

      <section className="section section--tint" id="features">
        <div className="container">
          <h2 className="section__title">What you can do</h2>
          <div className="features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="card feature">
                <span className="feature__icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container cta__inner">
          <h2>Ready to get organized?</h2>
          <p>Create your account and start managing your information today.</p>
          <Button to="/register" variant="accent" size="lg">Create Your Account</Button>
        </div>
      </section>
    </>
  );
}
