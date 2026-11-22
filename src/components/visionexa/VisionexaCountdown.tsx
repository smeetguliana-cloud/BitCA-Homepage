import { useEffect, useMemo, useState } from 'react';

interface VisionexaCountdownProps {
  target: string | null;
}

function getRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, '0');

export default function VisionexaCountdown({ target }: VisionexaCountdownProps) {
  const targetMs = useMemo(() => {
    if (!target) return null;
    const parsed = new Date(target).getTime();
    return Number.isFinite(parsed) ? parsed : null;
  }, [target]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (targetMs === null || now >= targetMs) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [targetMs, now]);

  const remaining = targetMs === null
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : getRemaining(targetMs - now);
  const complete = targetMs !== null && now >= targetMs;
  const dateLabel = targetMs === null
    ? 'Date to be announced'
    : new Date(targetMs).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
      });

  const units = [
    ['Days', remaining.days],
    ['Hours', remaining.hours],
    ['Minutes', remaining.minutes],
    ['Seconds', remaining.seconds],
  ] as const;

  return (
    <div className={`vx-countdown ${complete ? 'is-complete' : ''}`}>
      <div className="vx-countdown__top">
        <span className="vx-countdown__accent" />
        <span>{complete ? 'Visionexa is here' : 'Next up'}</span>
        <strong>{dateLabel}</strong>
      </div>
      <div className="vx-count" role="timer" aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds remaining`}>
        {units.map(([label, value]) => (
          <div className="vx-unit" key={label}>
            <span className="vx-unit__value">{complete ? '00' : pad(value)}</span>
            <span className="vx-unit__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
