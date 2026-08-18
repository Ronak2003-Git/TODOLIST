import { FiArrowRight, FiLayers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function PlaceholderPage({ title, phase, description }) {
  return (
    <section className="placeholder-page">
      <span className="placeholder-page__icon"><FiLayers /></span>
      <p className="eyebrow eyebrow--violet">{phase.toUpperCase()}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="placeholder-page__line" />
      <Link to="/dashboard" className="text-link">Back to dashboard <FiArrowRight /></Link>
    </section>
  );
}

export default PlaceholderPage;
