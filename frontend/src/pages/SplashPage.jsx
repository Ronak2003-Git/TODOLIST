import { useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import LogoMark from '../components/LogoMark';
import PlannerIllustration from '../components/PlannerIllustration';

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/onboarding'), 2200);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="intro-screen splash-screen">
      <section className="intro-panel intro-panel--brand">
        <LogoMark />
        <div className="intro-panel__content">
          <p className="eyebrow eyebrow--violet">YOUR ACADEMIC COMPANION</p>
          <h1>Your daily plan.<br />Your goals.<br /><em>Your success.</em></h1>
          <p>All in one place.</p>
        </div>
        <div className="splash-loader"><LoadingSpinner label="Preparing your planner" /><span>Preparing your planner</span></div>
      </section>
      <section className="intro-visual">
        <PlannerIllustration />
        <button className="text-link intro-continue" type="button" onClick={() => navigate('/onboarding')}>
          Continue now <FiArrowRight />
        </button>
      </section>
    </main>
  );
}

export default SplashPage;
