import { FiBookOpen, FiCheck, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';

function PlannerIllustration({ compact = false }) {
  return (
    <div className={`planner-illustration ${compact ? 'planner-illustration--compact' : ''}`} aria-label="Student planner illustration" role="img">
      <span className="orbit orbit--one" />
      <span className="orbit orbit--two" />
      <div className="illustration-card illustration-card--checklist">
        <div className="illustration-card__row"><span className="mini-check"><FiCheck /></span><span /></div>
        <div className="illustration-card__row"><span className="mini-check"><FiCheck /></span><span /></div>
        <div className="illustration-card__row"><span className="mini-check"><FiCheck /></span><span /></div>
      </div>
      <div className="illustration-card illustration-card--student">
        <span className="student-figure"><FiBookOpen /></span>
        <div><strong>Study smart</strong><small>Your plan, on track.</small></div>
      </div>
      <span className="floating-icon floating-icon--star"><FiStar /></span>
      <span className="floating-icon floating-icon--clock"><FiClock /></span>
      <span className="floating-icon floating-icon--done"><FiCheckCircle /></span>
    </div>
  );
}

export default PlannerIllustration;
