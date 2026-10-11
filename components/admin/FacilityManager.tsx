'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Facility, SportType } from '@/types';
import { 
  Plus, 
  Edit3, 
  Power, 
  Check, 
  AlertCircle, 
  Layers, 
  Trophy, 
  Clock,
  Sparkles
} from 'lucide-react';

interface FacilityManagerProps {
  venueId: string;
}

export default function FacilityManager({ venueId }: FacilityManagerProps) {
  const { facilities, addFacility, updateFacility, toggleFacilityActive } = useDemo();
  const venueFacilities = facilities.filter(f => f.venueId === venueId);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [selectedSports, setSelectedSports] = useState<SportType[]>(['Football']);
  const [slotDuration, setSlotDuration] = useState<number>(60);
  const [bufferMinutes, setBufferMinutes] = useState<number>(0);
  const [surfaceType, setSurfaceType] = useState('50mm AstroTurf');
  const [featuresStr, setFeaturesStr] = useState('Floodlit, Perimeter Netting');
  const [errorMsg, setErrorMsg] = useState('');

  const allSports: SportType[] = [
    'Football', 'Futsal', 'Badminton', 'Basketball', 
    'Snooker', '8-Ball Pool', 'Cricket Nets', 'Table Tennis'
  ];

  const handleOpenAdd = () => {
    setEditingFacilityId(null);
    setName('');
    setSelectedSports(['Football']);
    setSlotDuration(60);
    setBufferMinutes(0);
    setSurfaceType('FIFA Quality AstroTurf');
    setFeaturesStr('Perimeter nets, LED lighting');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (fac: Facility) => {
    setEditingFacilityId(fac.id);
    setName(fac.name);
    setSelectedSports(fac.sports);
    setSlotDuration(fac.slotDurationMinutes);
    setBufferMinutes(fac.bufferMinutes);
    setSurfaceType(fac.surfaceType || '');
    setFeaturesStr(fac.features.join(', '));
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const toggleSport = (sport: SportType) => {
    if (selectedSports.includes(sport)) {
      if (selectedSports.length > 1) {
        setSelectedSports(selectedSports.filter(s => s !== sport));
      }
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please specify facility name (e.g. Turf Pitch 3)');
      return;
    }
    if (selectedSports.length === 0) {
      setErrorMsg('Please choose at least one supported sport');
      return;
    }

    const features = featuresStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingFacilityId) {
      const existing = facilities.find(f => f.id === editingFacilityId);
      if (existing) {
        updateFacility({
          ...existing,
          name: name.trim(),
          sports: selectedSports,
          slotDurationMinutes: slotDuration,
          bufferMinutes,
          surfaceType: surfaceType.trim(),
          features
        });
      }
    } else {
      addFacility({
        venueId,
        name: name.trim(),
        sports: selectedSports,
        slotDurationMinutes: slotDuration,
        bufferMinutes,
        isActive: true,
        surfaceType: surfaceType.trim(),
        features
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Inventory & Court Management
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Facilities, Pitches & Tables
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage individual pitches, courts, duration rules, and supported sports for this venue.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Facility</span>
        </button>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {venueFacilities.map((fac) => (
          <div
            key={fac.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              fac.isActive
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-950/50 border-slate-900 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  fac.isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {fac.isActive ? 'Active' : 'Deactivated'}
                </span>

                <button
                  onClick={() => toggleFacilityActive(fac.id)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    fac.isActive 
                      ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/30' 
                      : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/30'
                  }`}
                  title={fac.isActive ? 'Deactivate facility' : 'Activate facility'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {fac.name}
              </h3>

              <div className="flex flex-wrap gap-1 mb-2">
                {fac.sports.map(s => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {s}
                  </span>
                ))}
              </div>

              {fac.surfaceType && (
                <p className="text-xs text-slate-400 mb-2">
                  <span className="text-slate-500">Surface:</span> {fac.surfaceType}
                </p>
              )}

              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span>Slot Duration:</span>
                  <strong className="text-slate-200">{fac.slotDurationMinutes} mins</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Buffer Interval:</span>
                  <strong className="text-slate-200">{fac.bufferMinutes} mins</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => handleOpenEdit(fac)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Specs</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Facility Modal Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-bold text-white">
                {editingFacilityId ? 'Edit Facility Specs' : 'Add New Pitch / Court'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure facility naming, sport tags, and booking duration.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Facility Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Turf Pitch 3, Badminton Court 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Supported Sports (Multi-Select) *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {allSports.map((sport) => {
                    const isSelected = selectedSports.includes(sport);
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => toggleSport(sport)}
                        className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{sport}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Slot Duration
                  </label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={60}>60 minutes (Standard)</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Buffer Between Slots
                  </label>
                  <select
                    value={bufferMinutes}
                    onChange={(e) => setBufferMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={0}>0 mins (Consecutive)</option>
                    <option value={15}>15 mins transition</option>
                    <option value={30}>30 mins transition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Surface Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. FIFA Quality Pro Synthetic Grass 50mm"
                  value={surfaceType}
                  onChange={(e) => setSurfaceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Key Features (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="Floodlights, Scoreboard, Perimeter Nets"
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
