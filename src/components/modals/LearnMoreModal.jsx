// Educational Aerospace Encyclopedia Modal (Project Orbital)
import React, { useState } from 'react';
import { LEARN_TOPICS } from '../../data/learnContent';
import { sound } from '../../utils/soundEngine';
import { X, BookOpen, Compass, Zap, Radio, Shield, Thermometer, ChevronRight } from 'lucide-react';

export default function LearnMoreModal({ isOpen, onClose }) {
  const [selectedTopicId, setSelectedTopicId] = useState(LEARN_TOPICS[0].id);

  if (!isOpen) return null;

  const currentTopic = LEARN_TOPICS.find(t => t.id === selectedTopicId) || LEARN_TOPICS[0];

  const getTopicIcon = (category) => {
    switch (category) {
      case 'Astrodynamics': return Compass;
      case 'Propulsion': return Compass;
      case 'Power Systems': return Zap;
      case 'Telecommunications': return Radio;
      case 'Space Environment': return Shield;
      case 'Thermodynamics': return Thermometer;
      default: return BookOpen;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="hud-panel w-full max-w-4xl max-h-[85vh] rounded-2xl border border-sky-500/40 shadow-[0_0_50px_rgba(56,189,248,0.25)] flex flex-col overflow-hidden hud-bracket">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest">
                NASA AEROSPACE ENGINEERING HANDBOOK
              </div>
              <h2 className="font-orbitron font-bold text-lg sm:text-xl text-white">
                ORBITAL DYNAMICS & SPACECRAFT SYSTEMS
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar + Main Topic */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Sidebar Topics List (4 cols) */}
          <div className="md:col-span-4 border-r border-sky-500/20 p-3 space-y-1.5 overflow-y-auto max-h-[60vh] bg-slate-950/60">
            {LEARN_TOPICS.map(topic => {
              const isSelected = selectedTopicId === topic.id;
              const Icon = getTopicIcon(topic.category);

              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTopicId(topic.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-500/20 border border-sky-400/50 text-white'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-orbitron text-xs font-semibold">{topic.title}</div>
                      <div className="font-mono text-[10px] text-slate-400">{topic.category}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Main Topic Article (8 cols) */}
          <div className="md:col-span-8 p-6 overflow-y-auto max-h-[60vh] bg-slate-950/80">
            <div className="flex items-center gap-2 font-mono text-xs text-sky-400 mb-1">
              <span>{currentTopic.category.toUpperCase()}</span>
              <span>//</span>
              <span>TECHNICAL REFERENCE</span>
            </div>

            <h3 className="font-orbitron font-bold text-2xl text-white mb-2">
              {currentTopic.title}
            </h3>

            <p className="text-sm text-sky-200/90 font-medium mb-4 italic">
              {currentTopic.summary}
            </p>

            {/* Equation Card */}
            {currentTopic.equation && (
              <div className="bg-slate-900/90 border border-sky-500/30 p-3 rounded-lg mb-5 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">GOVERNING EQUATION:</span>
                <span className="font-mono text-sm text-emerald-400 font-bold px-3 py-1 rounded bg-black/60 border border-emerald-500/30">
                  {currentTopic.equation}
                </span>
              </div>
            )}

            {/* Markdown-style Content Prose */}
            <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed space-y-4">
              {currentTopic.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('###')) {
                  return (
                    <h4 key={idx} className="font-orbitron text-base font-bold text-sky-300 mt-4 mb-2">
                      {paragraph.replace('###', '').trim()}
                    </h4>
                  );
                }
                return (
                  <p key={idx} className="text-xs sm:text-sm text-slate-300">
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-sky-500/20 bg-slate-950 flex items-center justify-between font-mono text-xs text-slate-400">
          <span>NASA STEM & AEROSPACE EDUCATION INITIATIVE</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-aerospace px-4 py-1.5 rounded text-xs"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}

