'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Venue, DistrictType } from '@/types';
import { 
  Building, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Check, 
  Sparkles, 
  Save
} from 'lucide-react';

interface VenueSettingsEditorProps {
  venueId: string;
}

export default function VenueSettingsEditor({ venueId }: VenueSettingsEditorProps) {
  const { venues, updateVenue } = useDemo();
  const currentVenue = venues.find(v => v.id === venueId) || venues[0];

  const [name, setName] = useState(currentVenue.name);
  const [district, setDistrict] = useState<DistrictType>(currentVenue.district);
  const [city, setCity] = useState(currentVenue.city);
  const [address, setAddress] = useState(currentVenue.address);
  const [phone, setPhone] = useState(currentVenue.phone);
  const [email, setEmail] = useState(currentVenue.email);
  const [openingHours, setOpeningHours] = useState(currentVenue.openingHours);
  const [openingDays, setOpeningDays] = useState(currentVenue.openingDays);
  const [description, setDescription] = useState(currentVenue.description);
  const [startingPrice, setStartingPrice] = useState(currentVenue.startingPricePerHour);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenue({
      ...currentVenue,
      name,
      district,
      city,
      address,
      phone,
      email,
      openingHours,
      openingDays,
      description,
      startingPricePerHour: Number(startingPrice)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Profile & Operating Hours
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Venue Settings & Information
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Updates to this profile reflect live on the public marketplace venue detail page.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile settings saved!</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Venue Business Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              District *
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value as DistrictType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Kandy">Kandy (Central)</option>
              <option value="Colombo">Colombo (Western)</option>
              <option value="Gampaha">Gampaha (Western)</option>
              <option value="Kurunegala">Kurunegala (North West)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Town / City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Starting Hourly Price (LKR)
            </label>
            <input
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Physical Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Public Contact Hotline (Visible on Bookings)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Daily Operating Hours
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Operating Days
            </label>
            <input
              type="text"
              value={openingDays}
              onChange={(e) => setOpeningDays(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Public Venue Overview & Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
