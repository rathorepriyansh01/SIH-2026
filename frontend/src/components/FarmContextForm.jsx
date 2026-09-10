import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function FarmContextForm({
  onSubmit,
  isLoading = false
}) {

  const [farmData, setFarmData] = useState({
    area_acres: '',
    crop_age_days: '',
    growth_stage: 'Seedling',
    irrigation_method: 'Drip',
    previous_disease: false
  });

  const [location, setLocation] = useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState(null);


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFarmData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // ========================================
  // GET USER LOCATION
  // ========================================

  const getUserLocation = () => {

    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {

      setLocationError(
        'Geolocation is not supported by your browser.'
      );

      setLocationLoading(false);

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        setLocation({
          latitude,
          longitude
        });


        setLocationLoading(false);

      },


      (error) => {

        console.error(
          'Location Error:',
          error
        );


        let message =
          'Unable to get your location.';


        if (error.code === 1) {

          message =
            'Location permission denied. Please allow location access.';

        } else if (error.code === 2) {

          message =
            'Location is currently unavailable.';

        } else if (error.code === 3) {

          message =
            'Location request timed out. Please try again.';

        }


        setLocationError(message);

        setLocationLoading(false);

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }

    );

  };


  // ========================================
  // SUBMIT FARM DATA
  // ========================================

  const handleSubmit = (e) => {

    e.preventDefault();


    const finalFarmData = {

      ...farmData,

      area_acres:
        Number(farmData.area_acres),

      crop_age_days:
        Number(farmData.crop_age_days),

      previous_disease:
        farmData.previous_disease,


      // Location
      location: location

    };


    console.log(
      'Farm Data:',
      finalFarmData
    );


    onSubmit(finalFarmData);

  };


  return (

    <form
      onSubmit={handleSubmit}
      className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6"
    >

      {/* ========================================
          HEADER
      ======================================== */}

      <div>

        <h2 className="text-2xl font-bold text-white">
          Farm Information
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Provide some details about your tomato crop
          for a better AI advisory.
        </p>

      </div>


      {/* ========================================
          AREA
      ======================================== */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Farm Area (Acres)
        </label>

        <input
          type="number"
          name="area_acres"
          value={farmData.area_acres}
          onChange={handleChange}
          min="0"
          step="0.1"
          placeholder="e.g. 2.5"
          required
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-agri-500"
        />

      </div>


      {/* ========================================
          CROP AGE
      ======================================== */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Crop Age (Days)
        </label>

        <input
          type="number"
          name="crop_age_days"
          value={farmData.crop_age_days}
          onChange={handleChange}
          min="1"
          placeholder="e.g. 45"
          required
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-agri-500"
        />

      </div>


      {/* ========================================
          GROWTH STAGE
      ======================================== */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Growth Stage
        </label>

        <select
          name="growth_stage"
          value={farmData.growth_stage}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-agri-500"
        >

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


      {/* ========================================
          IRRIGATION
      ======================================== */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Irrigation Method
        </label>

        <select
          name="irrigation_method"
          value={farmData.irrigation_method}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-agri-500"
        >

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


      {/* ========================================
          PREVIOUS DISEASE
      ======================================== */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-3">
          Previous Disease History?
        </label>


        <div className="flex gap-3">

          <button
            type="button"
            onClick={() =>
              setFarmData((previous) => ({
                ...previous,
                previous_disease: true
              }))
            }
            className={`px-6 py-3 rounded-xl font-semibold text-sm border transition ${
              farmData.previous_disease === true
                ? 'bg-agri-500 text-slate-950 border-agri-500'
                : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
          >
            Yes
          </button>


          <button
            type="button"
            onClick={() =>
              setFarmData((previous) => ({
                ...previous,
                previous_disease: false
              }))
            }
            className={`px-6 py-3 rounded-xl font-semibold text-sm border transition ${
              farmData.previous_disease === false
                ? 'bg-agri-500 text-slate-950 border-agri-500'
                : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
          >
            No
          </button>

        </div>

      </div>


      {/* ========================================
          LOCATION
      ======================================== */}

      <div className="space-y-3">

        <div className="flex items-center gap-2">

          <MapPin className="w-5 h-5 text-agri-400" />

          <label className="text-sm font-semibold text-white">
            Farm Location
          </label>

        </div>


        {!location ? (

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">

            <p className="text-sm text-slate-400 mb-3">
              Allow location access to get weather
              information for your farm.
            </p>


            <button
              type="button"
              onClick={getUserLocation}
              disabled={locationLoading}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-agri-500 text-slate-950 font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
            >

              <MapPin className="w-4 h-4" />

              {locationLoading
                ? 'Detecting Location...'
                : 'Use My Location'}

            </button>


            {locationError && (

              <div className="flex items-start gap-2 mt-3 text-sm text-rose-300">

                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                <span>
                  {locationError}
                </span>

              </div>

            )}

          </div>

        ) : (

          <div className="p-4 rounded-xl bg-agri-500/10 border border-agri-500/30">

            <div className="flex items-center gap-2 mb-3">

              <CheckCircle className="w-5 h-5 text-agri-400" />

              <span className="text-sm font-bold text-agri-300">
                Location Detected
              </span>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <div>

                <p className="text-xs text-slate-500">
                  Latitude
                </p>

                <p className="text-sm text-white font-semibold">
                  {location.latitude.toFixed(6)}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-500">
                  Longitude
                </p>

                <p className="text-sm text-white font-semibold">
                  {location.longitude.toFixed(6)}
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={getUserLocation}
              className="mt-3 text-xs text-agri-400 hover:text-agri-300"
            >
              Update Location
            </button>

          </div>

        )}

      </div>


      {/* ========================================
          SUBMIT
      ======================================== */}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-agri-500 text-slate-950 font-bold hover:opacity-90 transition disabled:opacity-50"
      >

        {isLoading
          ? 'Generating Advisory...'
          : 'Continue to Analysis'}

      </button>

    </form>

  );

}