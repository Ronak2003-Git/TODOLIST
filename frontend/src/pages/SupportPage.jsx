import { useEffect, useMemo, useState } from 'react';
import {
  FiArrowRight, FiBarChart2, FiCalendar, FiCheckSquare, FiChevronDown, FiFileText,
  FiHelpCircle, FiMail, FiMessageCircle, FiPlus, FiSearch, FiSend, FiUser, FiX,
} from 'react-icons/fi';
import { usePlanner } from '../context/PlannerContext';
import { getApiError } from '../services/api';
import { createSupportTicket, getSupportTickets } from '../services/supportService';

const topics = [
  { id: 'getting-started', title: 'Getting started', description: 'Learn the basics of using CUSAT ToDoList.', icon: FiFileText, tone: 'purple', articles: 8 },
  { id: 'tasks', title: 'Tasks & assignments', description: 'Create, manage, and organize your work effectively.', icon: FiCheckSquare, tone: 'green', articles: 12 },
  { id: 'calendar', title: 'Calendar & schedule', description: 'Understand your calendar, timetable, and reminders.', icon: FiCalendar, tone: 'amber', articles: 10 },
  { id: 'progress', title: 'Study progress', description: 'Track your progress and analyze performance.', icon: FiBarChart2, tone: 'blue', articles: 7 },
  { id: 'account', title: 'Account & settings', description: 'Manage your account, preferences, and more.', icon: FiUser, tone: 'pink', articles: 9 },
];

const articles = [
  { topic: 'getting-started', title: 'Welcome to your CUSAT ToDoList planner', body: 'Start by adding your subjects, then create tasks with due dates and reminders.' },
  { topic: 'getting-started', title: 'How to organize a productive study week', body: 'Use your dashboard and calendar together to plan focused sessions.' },
  { topic: 'tasks', title: 'Create a new task or assignment', body: 'Open Add New Task, choose a course, set the deadline, priority, and reminder, then save.' },
  { topic: 'tasks', title: 'Mark a task complete or update its status', body: 'Open the task and choose Mark as Completed, or use the status control in your task list.' },
  { topic: 'calendar', title: 'Use calendar and timetable views', body: 'Calendar highlights task deadlines while the timetable helps you plan classes and study time.' },
  { topic: 'calendar', title: 'Set a reminder for an important deadline', body: 'Choose a reminder while creating or editing a task. Notification preferences are in Settings.' },
  { topic: 'progress', title: 'Understand your completion rate', body: 'Completion rate is calculated from tasks you have completed compared with your total tasks.' },
  { topic: 'progress', title: 'Use subject-wise progress', body: 'Progress shows how many tasks have been completed for each course.' },
  { topic: 'account', title: 'Update profile information and photo', body: 'Go to Profile and use Edit Profile to update your details or add a photo.' },
  { topic: 'account', title: 'Change password and app appearance', body: 'Settings lets you choose Light, Dark, or System mode and securely change your password.' },
];

const faqs = [
  { question: 'How do I create a new task?', answer: 'Choose Add New Task from the dashboard, task page, or the mobile plus button. Enter a title, choose a subject, due date, priority, and save.' },
  { question: 'How can I set a reminder for my tasks?', answer: 'While adding or editing a task, select a reminder time such as 30 minutes, 1 hour, or 1 day before the deadline.' },
  { question: 'How do I add or edit my subjects?', answer: 'Open My Subjects, choose Add / Manage Subjects, then enter your course name, code, and lecturer. Each subject can be edited later.' },
  { question: 'How does the progress tracking work?', answer: 'Your progress page uses completed tasks and subject task counts to calculate completion rates automatically.' },
  { question: 'How can I change my account password?', answer: 'Open Settings, choose Change Password, enter your current password and a new password of at least eight characters.' },
  { question: 'Where can I write and organize study notes?', answer: 'Open Notes & Resources. You can write structured notes with headings, bullets, numbered steps, and previews.' },
  { question: 'Can I attach PDF or DOCX study files?', answer: 'Yes. Notes & Resources accepts PDF and DOCX files up to 10 MB, with a secure download button for each attachment.' },
];

const blankTicket = { category: 'other', subject: '', message: '' };

function responseFor(message) {
  const text = message.toLowerCase();
  if (text.includes('task') || text.includes('assignment')) return 'For tasks, open Tasks & Assignments and select Add New Task. You can then set your subject, due date, priority, and reminder.';
  if (text.includes('password') || text.includes('account')) return 'You can change your password in Settings. For profile information, open Profile and select Edit Profile.';
  if (text.includes('note')) return 'Open Notes & Resources to write a structured study note or attach a PDF/DOCX study file.';
  return 'Thanks for your message. I can help with tasks, calendar, notes, progress, profile, and settings. If this needs a person, use Raise a Ticket.';
}

function SupportPage() {
  const { showToast } = usePlanner();
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState(blankTicket);
  const [ticketError, setTicketError] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([{ id: 'welcome', sender: 'support', text: 'Hi! I’m the CUSAT ToDoList support assistant. What can I help you with today?' }]);

  useEffect(() => {
    getSupportTickets().then(setTickets).catch(() => {});
  }, []);

  const matchingArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return articles.filter((article) => (!selectedTopic || article.topic === selectedTopic) && (!term || `${article.title} ${article.body}`.toLowerCase().includes(term)));
  }, [search, selectedTopic]);

  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 5);
  const chosenTopic = topics.find((topic) => topic.id === selectedTopic);

  const chooseTopic = (topicId) => {
    setSelectedTopic(topicId);
    setSearch('');
  };

  const resetArticles = () => {
    setSelectedTopic('');
    setSearch('');
  };

  const openTicket = (category = 'other', subject = '') => {
    setTicketForm({ category, subject, message: '' });
    setTicketError('');
    setIsTicketOpen(true);
  };

  const submitTicket = async (event) => {
    event.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      setTicketError('Add a subject and describe the issue so the support team can help.');
      return;
    }
    setIsSubmittingTicket(true);
    setTicketError('');
    try {
      const ticket = await createSupportTicket({ ...ticketForm, subject: ticketForm.subject.trim(), message: ticketForm.message.trim() });
      setTickets((current) => [ticket, ...current]);
      setIsTicketOpen(false);
      showToast(`Ticket #${ticket.id} was submitted. We will respond within 24 hours.`);
    } catch (error) {
      setTicketError(getApiError(error, 'Unable to submit your support ticket. Please try again.'));
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const sendChat = (event) => {
    event.preventDefault();
    const message = chatText.trim();
    if (!message) return;
    const id = Date.now();
    setChatMessages((current) => [...current, { id, sender: 'student', text: message }]);
    setChatText('');
    window.setTimeout(() => setChatMessages((current) => [...current, { id: `${id}-reply`, sender: 'support', text: responseFor(message) }]), 350);
  };

  return (
    <section className="support-page">
      <div className="support-heading"><div><p className="eyebrow eyebrow--violet">CUSAT STUDENT CARE</p><h2>Help &amp; Support</h2><p>We’re here to help you. Find answers or get in touch with us.</p></div></div>
      <label className="support-search"><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedTopic(''); }} type="search" placeholder="Search for help articles…" aria-label="Search help articles" /></label>

      <section className="support-panel support-topics"><div className="support-panel__head"><h3>Popular Help Topics</h3><button className="support-link" type="button" onClick={resetArticles}>View All Articles <FiArrowRight /></button></div><div className="support-topic-grid">{topics.map(({ id, title, description, icon: Icon, tone, articles: count }) => <button className={selectedTopic === id ? `support-topic support-topic--${tone} support-topic--selected` : `support-topic support-topic--${tone}`} key={id} type="button" onClick={() => chooseTopic(id)}><span><Icon /></span><strong>{title}</strong><p>{description}</p><small>{count} Articles <FiArrowRight /></small></button>)}</div></section>

      {(search || selectedTopic) && <section className="support-panel article-results"><div className="support-panel__head"><div><p className="eyebrow eyebrow--violet">HELP ARTICLES</p><h3>{search ? `Results for “${search}”` : chosenTopic?.title}</h3></div><button className="support-link" type="button" onClick={resetArticles}>Clear <FiX /></button></div>{matchingArticles.length ? <div className="article-result-list">{matchingArticles.map((article) => <article key={article.title}><FiFileText /><div><strong>{article.title}</strong><p>{article.body}</p></div></article>)}</div> : <p className="support-empty">No articles match that search. Try a different phrase or contact support.</p>}</section>}

      <div className="support-main-grid"><section className="support-panel support-faqs"><div className="support-panel__head"><h3>Frequently Asked Questions</h3></div><div className="faq-list">{visibleFaqs.map((faq, index) => <article className={openFaq === index ? 'faq-item faq-item--open' : 'faq-item'} key={faq.question}><button type="button" onClick={() => setOpenFaq((current) => current === index ? null : index)} aria-expanded={openFaq === index}><span><FiHelpCircle /></span><strong>{faq.question}</strong><FiChevronDown /></button>{openFaq === index && <p>{faq.answer}</p>}</article>)}</div><button className="support-link support-link--bottom" type="button" onClick={() => setShowAllFaqs((current) => !current)}>{showAllFaqs ? 'Show fewer FAQs' : 'View All FAQs'} <FiArrowRight /></button></section>

        <section className="support-panel support-contact"><h3>Still Need Help?</h3><p>Can’t find the answer you’re looking for? Our support options are ready when you need them.</p><div className="support-contact-options"><a className="support-option" href="mailto:support@cusat-todolist.in?subject=CUSAT%20ToDoList%20Support"><span className="support-option__icon support-option__icon--mail"><FiMail /></span><div><strong>Email Support</strong><small>support@cusat-todolist.in</small></div><em>Usually within <b>24 hours</b></em></a><button className="support-option" type="button" onClick={() => setIsChatOpen(true)}><span className="support-option__icon support-option__icon--chat"><FiMessageCircle /></span><div><strong>Live Chat</strong><small>Chat with the support assistant</small></div><em>Available <b>9 AM – 9 PM</b></em></button><button className="support-option" type="button" onClick={() => openTicket()}><span className="support-option__icon support-option__icon--ticket"><FiPlus /></span><div><strong>Raise a Ticket</strong><small>Submit your issue or feedback</small></div><em>Reply within <b>24 hours</b></em></button></div><button className="button button--primary button--full" type="button" onClick={() => openTicket()}>Contact Support</button>{tickets.length > 0 && <div className="support-recent-ticket"><strong>Latest ticket</strong><span>#{tickets[0].id} · {tickets[0].subject}</span><small>{tickets[0].status.replace('_', ' ')}</small></div>}</section></div>

      <section className="support-reassurance"><div className="support-reassurance__mark"><FiHelpCircle /></div><div><h3>We are here for you!</h3><p>CUSAT ToDoList is designed to help you stay organized and achieve your academic goals. If you face any issues, our support options are ready to assist.</p></div><FiBarChart2 className="support-reassurance__art" aria-hidden="true" /></section>

      {isTicketOpen && <div className="modal-layer" role="presentation"><section className="support-modal" role="dialog" aria-modal="true" aria-labelledby="ticket-title"><button className="modal-close" type="button" onClick={() => setIsTicketOpen(false)} aria-label="Close"><FiX /></button><p className="eyebrow eyebrow--violet">SUPPORT TICKET</p><h3 id="ticket-title">How can we help?</h3><p>Tell us what happened. Your ticket will be saved to your account.</p>{ticketError && <p className="form-alert">{ticketError}</p>}<form onSubmit={submitTicket} noValidate><label className="form-field"><span>Topic</span><select value={ticketForm.category} onChange={(event) => setTicketForm({ ...ticketForm, category: event.target.value })}><option value="account">Account & settings</option><option value="tasks">Tasks & assignments</option><option value="calendar">Calendar & schedule</option><option value="progress">Study progress</option><option value="notes">Notes & resources</option><option value="other">Other</option></select></label><label className="form-field"><span>Subject <b>*</b></span><input value={ticketForm.subject} onChange={(event) => setTicketForm({ ...ticketForm, subject: event.target.value })} placeholder="e.g. I cannot save my task" autoFocus /></label><label className="form-field"><span>Describe the issue <b>*</b></span><textarea value={ticketForm.message} onChange={(event) => setTicketForm({ ...ticketForm, message: event.target.value })} placeholder="Include any details that will help us understand the problem." rows="5" /></label><div className="form-actions"><button className="button button--ghost" type="button" onClick={() => setIsTicketOpen(false)} disabled={isSubmittingTicket}>Cancel</button><button className="button button--primary" type="submit" disabled={isSubmittingTicket}>{isSubmittingTicket ? 'Sending…' : 'Submit ticket'}</button></div></form></section></div>}

      {isChatOpen && <div className="modal-layer" role="presentation"><section className="chat-modal" role="dialog" aria-modal="true" aria-labelledby="chat-title"><header><div><p className="eyebrow eyebrow--violet">LIVE CHAT</p><h3 id="chat-title">CUSAT ToDoList support</h3></div><button className="modal-close" type="button" onClick={() => setIsChatOpen(false)} aria-label="Close"><FiX /></button></header><div className="chat-messages">{chatMessages.map((message) => <p className={message.sender === 'support' ? 'chat-message chat-message--support' : 'chat-message chat-message--student'} key={message.id}>{message.text}</p>)}</div><form className="chat-input" onSubmit={sendChat}><input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Type your question…" aria-label="Chat message" /><button type="submit" aria-label="Send message"><FiSend /></button></form><button className="support-link chat-ticket-link" type="button" onClick={() => { setIsChatOpen(false); openTicket(); }}>Need a person? Raise a ticket <FiArrowRight /></button></section></div>}
    </section>
  );
}

export default SupportPage;
