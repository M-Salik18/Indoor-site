'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { PricingRule, DayType } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Clock, 
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';

interface PricingEditorProps {
  venueId: string;
}

export default function PricingEditor({ venueId }: PricingEditorProps) {
  const { 
    facilities, 
    pricingRules, 
    addPricingRule, 
    updatePricingRule, 
    deletePricingRule 
  } = useDemo();

  const venueFacilities = facilities.filter(f => f.venueId === venueId);
  const venueRules = pricingRules.filter(r => r.venueId === venueId);

  // Form states
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    venueFacilities[0]?.id || ''
  );
  const [dayType, setDayType] = useState<DayType>('weekday');
  const [startTime, setStartTime] = useState<string>('07:00');
  const [endTime, setEndTime] = useState<string>('16:00');
  const [pricePerHour, setPricePerHour] = useState<number>(2000);
  
  // Edit mode
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const timeOptions = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00', '00:00'
  ];

  const handleStartEdit = (rule: PricingRule) => {
    setEditingRuleId(rule.id);
    setSelectedFacilityId(rule.facilityId);
    setDayType(rule.dayType);
    setStartTime(rule.startTime);
    setEndTime(rule.endTime);
    setPricePerHour(rule.pricePerHour);
    setFormError('');
    setSuccessMessage('');
  };

  const handleCancelEdit = () => {
    setEditingRuleId(null);
    setFormError('');
    // reset form to default
    setStartTime('07:00');
    setEndTime('16:00');
    setPricePerHour(2000);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!selectedFacilityId) {
      setFormError('Please select a facility');
      return;
    }

    const startH = parseInt(startTime.split(':')[0], 10);
    let endH = parseInt(endTime.split(':')[0], 10);
    if (endH === 0) endH = 24;

    if (startH >= endH) {
      setFormError('End time must be later than start time');
      return;
    }

    if (pricePerHour < 500) {
      setFormError('Price per hour must be at least LKR 500');
      return;
    }

    // Overlap validation among rules for the same facility and day
    const otherRules = venueRules.filter(
      r => r.facilityId === selectedFacilityId && r.id !== editingRuleId
    );

    const hasOverlap = otherRules.some(r => {
      const matchDay = r.dayType === 'all' || dayType === 'all' || r.dayType === dayType;
      if (!matchDay) return false;

      const rStart = parseInt(r.startTime.split(':')[0], 10);
      let rEnd = parseInt(r.endTime.split(':')[0], 10);
      if (rEnd === 0) rEnd = 24;

      // Overlap condition: max(startH, rStart) < min(endH, rEnd)
      return Math.max(startH, rStart) < Math.min(endH, rEnd);
    });

    if (hasOverlap) {
      setFormError('This time range overlaps with an existing pricing rule for this facility and day type.');
      return;
    }

    if (editingRuleId) {
      updatePricingRule({
        id: editingRuleId,
        venueId,
        facilityId: selectedFacilityId,
        dayType,
        startTime,
        endTime,
        pricePerHour: Number(pricePerHour)
      });
      setSuccessMessage('Pricing rule updated successfully.');
      setEditingRuleId(null);
    } else {
      addPricingRule({
        venueId,
        facilityId: selectedFacilityId,
        dayType,
        startTime,
        endTime,
        pricePerHour: Number(pricePerHour)
      });
      setSuccessMessage('New hourly pricing rule added successfully.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Core Differentiator
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Flexible Hourly Pricing Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure dynamic hourly rates for weekdays, weekends, daytime, and floodlit night hours per pitch. Customer bookings recalculate instantly.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No global fixed rate. Each venue owns their pricing structure.</span>
        </div>
      </div>

      {/* Pricing Rule Form (Add / Edit) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>{editingRuleId ? 'Edit Pricing Rule' : 'Create New Pricing Rule'}</span>
            {editingRuleId && (
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Editing mode</span>
            )}
          </h3>

          {editingRuleId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveRule} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          {/* Facility */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Facility
            </label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {venueFacilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.sports.join(', ')})
                </option>
              ))}
            </select>
          </div>

          {/* Day Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Day Schedule
            </label>
            <select
              value={dayType}
              onChange={(e) => setDayType(e.target.value as DayType)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="weekday">Weekdays (Mon–Fri)</option>
              <option value="weekend">Weekends (Sat–Sun)</option>
              <option value="all">All Days (Mon–Sun)</option>
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Start Time
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            >
              {timeOptions.slice(0, -1).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              End Time
            </label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            >
              {timeOptions.slice(1).map((t) => (
                <option key={t} value={t}>{t === '00:00' ? '00:00 (Midnight)' : t}</option>
              ))}
            </select>
          </div>

          {/* Price (LKR) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Price / Hr (LKR)
            </label>
            <input
              type="number"
              step={100}
              min={500}
              max={25000}
              value={pricePerHour}
              onChange={(e) => setPricePerHour(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-5 flex justify-end gap-2 pt-2">
            {editingRuleId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{editingRuleId ? 'Update Pricing Rule' : 'Save Pricing Rule'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Rules Schedule Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Pricing Rules ({venueRules.length})
          </h3>
          <span className="text-xs text-slate-400">
            Rules evaluate in real-time when customer selects a slot
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4">Day Type</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Price / Hour</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {venueRules.map((rule) => {
                const fac = facilities.find(f => f.id === rule.facilityId);
                return (
                  <tr key={rule.id} className="hover:bg-slate-950/40">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {fac?.name || 'Unknown Facility'}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        rule.dayType === 'weekday' ? 'bg-blue-950 text-blue-300 border border-blue-800/40' :
                        rule.dayType === 'weekend' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {rule.dayType === 'all' ? 'All Days' : rule.dayType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {rule.startTime} – {rule.endTime === '00:00' ? '12:00 AM (Midnight)' : rule.endTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        LKR {rule.pricePerHour.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(rule)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Rule"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this pricing rule?')) {
                              deletePricingRule(rule.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
