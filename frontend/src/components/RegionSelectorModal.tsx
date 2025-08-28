import React from 'react';
import './RegionSelectorModal.css';

interface Region {
  code: string;
  label: string;
  flagUrl: string;
  domain: string;
}

interface RegionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: 'both' | 'region' | 'offer';
}

const regions: Region[] = [
  {
    code: 'us',
    label: 'KeplerX - USA',
    flagUrl: 'https://flagcdn.com/w80/us.png',
    domain: 'https://usa.keplerx.com',
  },
  {
    code: 'uk',
    label: 'KeplerX - UK',
    flagUrl: 'https://flagcdn.com/w80/gb.png',
    domain: 'https://uk.keplerx.com',
  },
  {
    code: 'eu',
    label: 'KeplerX - EU',
    flagUrl: 'https://flagcdn.com/w80/eu.png',
    domain: 'https://eu.keplerx.com',
  },
  {
    code: 'uae',
    label: 'KeplerX - UAE',
    flagUrl: 'https://flagcdn.com/w80/ae.png',
    domain: 'https://ae.keplerx.com',
  },
  {
    code: 'in',
    label: 'KeplerX - India',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    domain: 'https://in.keplerx.com',
  },
];

const RegionSelectorModal: React.FC<RegionSelectorModalProps> = ({ isOpen, onClose, view }) => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  if (!isOpen) return null;

  const handleVisit = (domain: string) => {
    window.location.href = domain; // redirect current tab; use window.open(domain, '_blank') for new tab
  };

  const showRegions = view === 'both' || view === 'region';
  const showOffer = view === 'both' || view === 'offer';

  return (
    <div className="region-modal-overlay" onClick={onClose}>
      <div className="region-modal" onClick={(e) => e.stopPropagation()}>
        <button className="region-modal-close" onClick={onClose}>&times;</button>
        {showRegions && (
          <>
            <h2 className="region-modal-title">Choose Your Region</h2>
            <div className="region-cards-container">
              {regions.map((region) => (
                <div className="region-card" key={region.code}>
                  <div className="region-flag"><img src={region.flagUrl} alt={region.label} /></div>
                  <h3 className="region-label">{region.label}</h3>
                  <button className="visit-btn" onClick={() => handleVisit(region.domain)}>
                    Visit Now!
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {showOffer && (
          <div className="offer-form-wrapper">
            <h4 className="offer-heading">Avail Your FREE OFFER NOW!</h4>
            <form
              className="offer-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget as HTMLFormElement;
                const data = new FormData(formEl);
                const payload = Object.fromEntries(data.entries());
                try {
                  const res = await fetch('/api/forms/free-offer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  const respData = await res.json();
                  if (!res.ok) throw new Error(respData.error || 'Submit failed');
                  setShowSuccess(true);
                  formEl.reset();
                  setTimeout(() => setShowSuccess(false), 3000);
                } catch (err: any) {
                  alert(err.message || 'Submit failed');
                }
              }}
            >
              <input type="email" name="email" placeholder="Enter Your Email" required />
              <textarea name="message" rows={3} placeholder="Write your message here" />
              <button className="avail-btn" type="submit">Avail Now!</button>
            </form>
          </div>
        )}
        {showSuccess && (
          <div className="success-popup" onClick={() => setShowSuccess(false)}>
            <div className="success-popup-content">
              <i className="fas fa-check-circle"></i>
              <h3>Thank You!</h3>
              <p>Your request has been submitted successfully. We'll get back to you soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionSelectorModal; 