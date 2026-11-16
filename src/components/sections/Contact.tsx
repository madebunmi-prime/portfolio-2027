'use client';

import dynamic from 'next/dynamic';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { ActionButton } from '@/components/ui/Button';
import { Glow } from '@/components/ui/Glow';
import { Highlight } from '@/components/ui/Highlight';
import { Icon } from '@/components/ui/Icon';

const ModelTile = dynamic(() => import('@/components/three/ModelTile'), { ssr: false });

const messageSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().min(10),
});

type Status = 'idle' | 'sending' | 'success' | 'error';
type Props = { data: Portfolio['contact']; socials: Portfolio['socials'] };

const inputClass =
  'rounded-[14px] border border-ink-600 bg-ink-800 px-[18px] py-4 text-fg outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-violet focus:shadow-[0_0_0_4px_rgb(139_92_246/0.2)]';

export function Contact({ data, socials }: Props) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = messageSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) return setStatus('error');

    // No endpoint configured → hand off to the visitor's mail client.
    if (!data.formEndpoint) {
      const { name, message } = parsed.data;
      window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(message)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(data.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) form.reset();
    } catch {
      setStatus('error');
    }
  }

  const label = status === 'sending' ? data.labels.sending : status === 'success' ? data.labels.success : data.labels.submit;
  const f = data.fields;

  return (
    <section id={data.id ?? 'contact'} className="pt-[clamp(96px,11vw,160px)] pb-[clamp(64px,8vw,112px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
        <Reveal>
        <Glow lift={false} className="glass flex h-full flex-col gap-7 rounded-[28px] p-[clamp(24px,3.5vw,48px)]">
          <div className="flex flex-col gap-3.5">
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.5rem,3vw+1.4rem,5rem)] leading-[0.95] font-semibold tracking-[-0.015em] text-fg">
              <Highlight text={data.title} />
            </h2>
            <p className="max-w-[46ch] text-pretty text-body">{data.body}</p>
            {data.tags.length ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {data.tags.map((t) => (
                  <span key={t} className="rounded-full border border-ink-500 px-3 py-1.5 text-[13.5px] text-fg">{t}</span>
                ))}
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
            <label className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-fg">{f.name.label}</span>
              <input required name="name" autoComplete="name" placeholder={f.name.placeholder} className={inputClass} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-fg">{f.email.label}</span>
              <input required type="email" name="email" autoComplete="email" placeholder={f.email.placeholder} className={inputClass} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-fg">{f.message.label}</span>
              <textarea required name="message" rows={5} placeholder={f.message.placeholder} className={`${inputClass} resize-y`} />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <ActionButton type="submit" disabled={status === 'sending'} className="disabled:opacity-70">
                {label} <span aria-hidden="true">→</span>
              </ActionButton>
              <p role="status" aria-live="polite" className="text-sm text-pink">
                {status === 'error' ? data.labels.error : ''}
              </p>
            </div>
          </form>
        </Glow>
        </Reveal>

        <Reveal delay={0.12} className="flex min-h-[420px] flex-col overflow-hidden rounded-[28px] border border-ink-700 bg-[radial-gradient(70%_60%_at_50%_45%,rgb(139_92_246/0.28),transparent_70%),#0a0920]">
          <div className="min-h-[320px] flex-1">
            <ModelTile model="orb" accent="violet" />
          </div>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] border-t border-ink-700">
            {socials.map((s) => (
              <li key={s.label} className="border-ink-700 not-last:border-r">
                {s.links.length === 1 ? (
                  <a href={s.links[0]!.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 px-6 py-[22px] text-fg transition-colors hover:bg-violet/10">
                    <Icon name={s.icon} className="size-[22px] flex-none" />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-semibold">{s.label}</span>
                      <span className="truncate text-[13px] text-muted">{s.links[0]!.handle}</span>
                    </span>
                  </a>
                ) : (
                  <div className="flex flex-col gap-2 px-6 py-[22px] text-fg">
                    <span className="flex items-center gap-3.5">
                      <Icon name={s.icon} className="size-[22px] flex-none" />
                      <span className="font-semibold">{s.label}</span>
                    </span>
                    <ul className="flex flex-col gap-1 pl-[calc(22px+14px)]">
                      {s.links.map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-[13px] text-muted underline decoration-ink-500 underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
                          >
                            {l.handle}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
