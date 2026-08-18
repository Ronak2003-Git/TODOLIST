import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import LogoMark from '../components/LogoMark';
import PlannerIllustration from '../components/PlannerIllustration';

function OnboardingPage() {
  const navigate = useNavigate();
  return (
    <main className="intro-screen onboarding-screen">
      <section className="onboarding-copy">
        <LogoMark />
        <div className="onboarding-copy__body">
          <p className="eyebrow eyebrow--violet">CUSAT STUDENT PLANNER</p>
          <h1>Plan better.<br /><em>Stay organized.</em><br />Achieve more.</h1>
          <p>Manage classes, assignments, exams, projects, notes, reminders and more — all in one place.</p>
          <ul className="feature-list">
            <li><FiCheckCircle /> Keep every deadline in view</li>
            <li><FiCheckCircle /> Build a study routine that works</li>
            <li><FiCheckCircle /> Track your academic progress</li>
          </ul>
          <div className="button-row">
            <button className="button button--primary" type="button" onClick={() => navigate('/register')}>Get Started <FiArrowRight /></button>
            <Link className="button button--ghost" to="/login">Skip for now</Link>
          </div>
        </div>
      </section>
      <section className="onboarding-visual"><PlannerIllustration /></section>
    </main>
  );
}

export default OnboardingPage;
