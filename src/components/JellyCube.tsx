import { useEffect, useRef, useState } from 'react';
import { ArrowUp, LoaderCircle, Pause, Play, RotateCcw } from 'lucide-react';
import type { JellyColor, JellyScene } from '@/lib/jellyScene';
import './JellyCube.css';

const colors: { id: JellyColor; name: string; swatch: string }[] = [
  { id: 'berry', name: 'Berry', swatch: '#cf3b75' },
  { id: 'mint', name: 'Mint', swatch: '#35a980' },
  { id: 'honey', name: 'Honey', swatch: '#dca23f' },
];

export default function JellyCube() {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<JellyScene | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [color, setColor] = useState<JellyColor>('berry');
  const [paused, setPaused] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let started = false;
    let instance: JellyScene | null = null;
    setStatus('loading');
    const fail = () => {
      if (cancelled) return;
      instance?.dispose();
      scene.current = null;
      setStatus('unavailable');
    };
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      try {
        const { createJellyScene } = await import('@/lib/jellyScene');
        if (cancelled) return;
        instance = await createJellyScene(element, () => { if (!cancelled) setPaused(false); });
        if (cancelled) { instance.dispose(); return; }
        scene.current = instance;
        setColor('berry');
        setPaused(false);
        setStatus('ready');
      } catch (error) {
        console.error('Could not initialize the jelly cube.', error);
        fail();
      }
    }, { rootMargin: '120px' });
    observer.observe(element);
    element.addEventListener('jelly-error', fail);
    return () => {
      cancelled = true;
      observer.disconnect();
      element.removeEventListener('jelly-error', fail);
      instance?.dispose();
      scene.current = null;
    };
  }, [attempt]);

  return (
    <div className="jelly-cube" role="group" aria-label="Jelly cube">
      <div className="jelly-stage" ref={host} data-jelly-status={status}>
        {status === 'ready' && (
          <div className="jelly-invitation">
            <span>play with the jelly :)</span>
            <svg viewBox="0 0 50 38" fill="none" aria-hidden="true">
              <path d="M9 3C3 15 9 27 22 30C29 32 36 32 44 30M36 24L44 30L36 36" />
            </svg>
          </div>
        )}
        {status !== 'ready' && (
          <div className="jelly-placeholder" role="status" aria-label={status === 'loading' ? 'Loading jelly' : 'Interactive 3D unavailable'}>
            {status === 'loading' ? <LoaderCircle size={18} className="jelly-loading" aria-hidden="true" /> : (
              <img src="/jelly-fallback.png" alt="A translucent berry-colored jelly cube" width={400} height={400} />
            )}
          </div>
        )}
      </div>
      <div className="jelly-controls" aria-label="Jelly controls">
        {colors.map(item => (
          <button
            key={item.id}
            type="button"
            className="jelly-color"
            title={item.name}
            aria-label={`${item.name} jelly`}
            aria-pressed={color === item.id}
            disabled={status !== 'ready'}
            onClick={() => { setColor(item.id); scene.current?.setColor(item.id); }}
          >
            <span style={{ backgroundColor: item.swatch }} />
          </button>
        ))}
        <span className="jelly-control-divider" aria-hidden="true" />
        <button type="button" title="Bounce" aria-label="Bounce jelly" disabled={status !== 'ready'} onClick={() => scene.current?.nudge()}>
          <ArrowUp size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          title={paused ? 'Resume' : 'Pause'}
          aria-label={paused ? 'Resume jelly' : 'Pause jelly'}
          aria-pressed={paused}
          disabled={status !== 'ready'}
          onClick={() => { scene.current?.setPaused(!paused); setPaused(!paused); }}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
        <button
          type="button"
          title={status === 'unavailable' ? 'Retry 3D' : 'Reset'}
          aria-label={status === 'unavailable' ? 'Retry jelly' : 'Reset jelly'}
          disabled={status === 'loading'}
          onClick={() => status === 'unavailable' ? setAttempt(value => value + 1) : scene.current?.reset()}
        >
          <RotateCcw size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
