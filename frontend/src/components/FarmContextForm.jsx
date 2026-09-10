import React, { useState } from 'react';
import {
  Sprout,
  Ruler,
  CalendarDays,
  Droplets,
  History
} from 'lucide-react';

export default function FarmContextForm({ onSubmit, isLoading }) {

  const [farmData, setFarmData] = useState({
    area_acres: '',
    crop_age_days: '',
    growth_stage: '',
    irrigation_method: '',
    previous_disease: false
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFarmData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit({
      ...farmData,

      area_acres: Number(farmData.area_acres),
      crop_age_days: Number(farmData.crop_age_days),

      previous_disease:
        farmData.previous_disease === true ||
        farmData.previous_disease === 'true'
    });
  };


  return (
    <div className="w-full max-w-2xl mx-auto">

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-7">

          <div className="p-3 rounded-xl bg-agri-500/10 border border-agri-500/20">

            <Sprout className="w-6 h-6 text-agri-400" />

          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Farm Information
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Provide basic farm details for a more personalized advisory.
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* FARM AREA */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">

              <Ruler className="w-4 h-4 text-agri-400" />

              Farm Area

            </label>

            <div className="relative">

              <input
                type="number"
                name="area_acres"
                value={farmData.area_acres}
                onChange={handleChange}
                min="0"
                step="0.1"
                required
                placeholder="e.g. 2.5"
                className="w-full px-4 py-3 pr-20 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-agri-500"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                Acres
              </span>

            </div>

          </div>


          {/* CROP AGE */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">

              <CalendarDays className="w-4 h-4 text-agri-400" />

              Crop Age

            </label>

            <div className="relative">

              <input
                type="number"
                name="crop_age_days"
                value={farmData.crop_age_days}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 45"
                className="w-full px-4 py-3 pr-20 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-agri-500"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                Days
              </span>

            </div>

          </div>


          {/* GROWTH STAGE */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">

              <Sprout className="w-4 h-4 text-agri-400" />

              Growth Stage

            </label>

            <select
              name="growth_stage"
              value={farmData.growth_stage}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-agri-500"
            >

              <option value="">
                Select growth stage
              </option>

              <option value="Seedling">
                Seedling
              </option>

              <option value="Vegetative">
                Vegetative
              </option>

              <option value="Flowering">
                Flowering
              </option>

              <option value="Fruit Development">
                Fruit Development
              </option>

              <option value="Maturity">
                Maturity
              </option>

            </select>

          </div>


          {/* IRRIGATION */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">

              <Droplets className="w-4 h-4 text-agri-400" />

              Irrigation Method

            </label>

            <select
              name="irrigation_method"
              value={farmData.irrigation_method}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-agri-500"
            >

              <option value="">
                Select irrigation method
              </option>

              <option value="Drip">
                Drip
              </option>

              <option value="Sprinkler">
                Sprinkler
              </option>

              <option value="Flood">
                Flood
              </option>

              <option value="Furrow">
                Furrow
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* PREVIOUS DISEASE */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">

              <History className="w-4 h-4 text-agri-400" />

              Previous Disease in This Field?

            </label>


            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setFarmData((prev) => ({
                    ...prev,
                    previous_disease: true
                  }))
                }
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  farmData.previous_disease === true
                    ? 'bg-agri-500/15 border-agri-500 text-agri-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Yes
              </button>


              <button
                type="button"
                onClick={() =>
                  setFarmData((prev) => ({
                    ...prev,
                    previous_disease: false
                  }))
                }
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  farmData.previous_disease === false
                    ? 'bg-agri-500/15 border-agri-500 text-agri-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                No
              </button>

            </div>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold transition-all disabled:opacity-50 disabled:pointer-events-none"
          >

            {isLoading
              ? 'Generating Advisory...'
              : 'Continue to Analysis'
            }

          </button>

        </form>

      </div>

    </div>
  );
}