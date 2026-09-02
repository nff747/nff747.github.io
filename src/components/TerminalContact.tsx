'use client';

import React, { useState } from 'react';
import { Terminal, Check, CornerDownLeft, Loader2 } from 'lucide-react';

export function TerminalContact() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'connected' | 'error'>('idle');
  const [logMessage, setLogMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setLogMessage('ERROR: INVALID_SIGNATURE // MUST_BE_RFC_EMAIL');
      return;
    }

    setStatus('transmitting');
    setLogMessage('ENCRYPTING PAYLOAD // TRANSMITTING VIA WEBSOCKET...');

    // Simulate packet dispatch
    setTimeout(() => {
      setStatus('connected');
      setLogMessage('HANDSHAKE COMPLETE [200 OK] // DISPATCH CONFIRMED');
    }, 1200);
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
      <div className="rounded-2xl glass-card overflow-hidden border border-white/[0.08] shadow-glass-card">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-white/[0.06] text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-slate-300 font-semibold tracking-wider">
              CLIENT_UPLINK // TERMINAL_v3.2
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Terminal className="w-3.5 h-3.5" />
            <span>ENCRYPTED_SESSION</span>
          </div>
        </div>

        {/* Terminal Interactive Console */}
        <div className="p-8 md:p-10 font-mono text-sm">
          <p className="text-slate-400 mb-6 leading-relaxed">
            Ready to deploy cutting-edge WebGPU shaders, browser AI pipelines, or high-converting 3D funnels? Establish an immediate direct socket connection:
          </p>

          <form onSubmit={handleSubmit} className="relative flex items-center">
            {/* Terminal Prompt Prefix */}
            <span className="text-neon-crimson font-bold select-none mr-3">
              guest@nff747:~$
            </span>
            <span className="text-slate-500 hidden sm:inline mr-2">connect --email</span>

            {/* Single Input Command Prompt */}
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="founder@studio.com"
              disabled={status === 'transmitting' || status === 'connected'}
              className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none focus:ring-0 text-sm font-mono border-b border-white/[0.1] focus:border-neon-crimson py-1 transition-colors"
            />

            {/* Action Return Button */}
            <button
              type="submit"
              disabled={status === 'transmitting' || status === 'connected'}
              className="ml-3 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-neon-crimson hover:text-white border border-white/[0.1] text-xs text-slate-300 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {status === 'transmitting' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : status === 'connected' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <>
                  <span>SEND</span>
                  <CornerDownLeft className="w-3 h-3 text-slate-500" />
                </>
              )}
            </button>
          </form>

          {/* Dynamic Console Telemetry Logs */}
          {logMessage && (
            <div 
              className={`mt-6 text-xs p-3 rounded-lg border font-mono ${
                status === 'connected'
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : status === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
              }`}
            >
              &gt;&gt; {logMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
