import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Leaf,
  Bug,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  CalendarDays,
  ShieldAlert,
  Sprout,
  FlaskConical,
  Eye,
  Lightbulb,
  Info,
  MapPin,
  TrendingUp,
  Languages,
  ChevronDown,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { SERVER_URL } from "../services/api";


export default function Result() {

  const location = useLocation();
  const navigate = useNavigate();

  const resultData =
    location.state?.resultData || {};

  const uploadedImage =
    location.state?.imageUrl || null;


  // =========================================================
  // LANGUAGE
  // =========================================================

  const [language, setLanguage] =
    useState(
      location.state?.language || "English"
    );


  // =========================================================
  // NORMALIZE BACKEND RESPONSE
  // =========================================================

  const advisory =
    resultData.advisory ||
    resultData.llm_advisory ||
    resultData.ai_advisory ||
    {};

  const detection =
    resultData.detection ||
    resultData.prediction ||
    {};


  const context =
    resultData.context ||
    advisory.context ||
    {};


  const diseaseAnalysis =
    advisory.disease_analysis ||
    {};


  const pestAnalysis =
    advisory.pest_analysis ||
    [];


  const chemicalRecommendations =
    advisory.chemical_recommendations ||
    [];


  const weather =
  context.weather ||
  resultData.weather ||
  advisory.weather ||
  {};


  const monitoringPlan =
    advisory.monitoring_plan ||
    {};


  const riskAssessment =
    advisory.risk_assessment ||
    {};


  const actionPlan =
    advisory.action_plan ||
    {};


  // =========================================================
  // BASIC VALUES
  // =========================================================

  const disease =
    detection.disease ||
    detection.name ||
    diseaseAnalysis.name ||
    "Unknown Disease";


  const crop =
    resultData.crop ||
    detection.crop ||
    context.farm?.crop ||
    "Tomato";


  const confidence =
    Number(
      detection.confidence ??
      resultData.confidence ??
      0
    );


  const riskLevel =
    riskAssessment.overall_risk ||
    riskAssessment.risk_level ||
    riskAssessment.level ||
    advisory.risk_level ||
    "Unknown";


  const severity =
    riskAssessment.severity ||
    diseaseAnalysis.severity ||
    advisory.severity ||
    "Unknown";


  const summary =
    advisory.summary ||
    advisory.final_summary ||
    advisory.overall_summary ||
    "AI summary is not available.";


  // =========================================================
  // IMAGE
  // =========================================================

  const imagePath =
    resultData.scan_metadata?.image_path ||
    resultData.image_path ||
    detection.image_path ||
    null;


  const imageUrl =
    uploadedImage ||
    (
      imagePath
        ? imagePath.startsWith("http")
          ? imagePath
          : `${SERVER_URL}${imagePath}`
        : null
    );


  // =========================================================
  // DISEASE DATA
  // =========================================================

  const description =
    diseaseAnalysis.description ||
    advisory.description ||
    "Disease description is not available.";


  const symptoms =
    diseaseAnalysis.symptoms ||
    advisory.symptoms ||
    [];


  const causes =
    diseaseAnalysis.possible_causes ||
    diseaseAnalysis.possibleCauses ||
    advisory.possible_causes ||
    [];


  const development =
    diseaseAnalysis.development ||
    "";


  const spread =
    diseaseAnalysis.spread ||
    "";


  const favorableConditions =
    diseaseAnalysis.favorable_conditions ||
    diseaseAnalysis.favorableConditions ||
    [];


  const differentialNotes =
    diseaseAnalysis.differential_notes ||
    [];


  // =========================================================
  // WEATHER DATA NORMALIZATION
  // =========================================================

  const previous5Days = Array.isArray(weather.previous_5_days)
    ? weather.previous_5_days
    : [];

  const next5Days = Array.isArray(weather.next_5_days)
    ? weather.next_5_days
    : [];

  // Current weather
  const currentWeather =
    weather.current ||
    weather.current_weather ||
    {};

  // Backend currently provides current weather
  // mainly through current_summary.
  const currentWeatherSummary =
    weather.current_summary ||
    weather.current_weather_summary ||
    "";

  // Rain prediction
  const rainPrediction =
    weather.rain_prediction ||
    "";

  // Disease weather risk
  const diseaseWeatherRisk =
    weather.disease_weather_risk ||
    "";

  // Pest weather risk
  const pestWeatherRisk =
    weather.pest_weather_risk ||
    "";

  // Spraying advice
  const sprayingAdvice =
    weather.spraying_advice ||
    "";


  // =========================================================
  // FARM + LOCATION
  // =========================================================

  const farm =
    context.farm ||
    resultData.farm ||
    {};


  const locationData =
    context.location ||
    resultData.location ||
    {};


  // =========================================================
  // RISK DATA
  // =========================================================

  const riskFactors =
    riskAssessment.risk_factors ||
    riskAssessment.factors ||
    [];


  const riskReason =
    riskAssessment.reason ||
    riskAssessment.explanation ||
    "Risk is calculated using disease confidence, crop condition and environmental factors.";


  // =========================================================
  // HELPERS
  // =========================================================

  const formatValue = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not available";
    }


    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }


    if (typeof value === "object") {

      if (Array.isArray(value)) {
        return value.join(", ");
      }

      return Object.entries(value)
        .map(([key, val]) => `${key}: ${val}`)
        .join(" • ");
    }


    return String(value);
  };
    const formatWeatherAdvice = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item === "object") {
          return (
            item.advice ||
            item.reason ||
            item.message ||
            item.summary ||
            item.description ||
            JSON.stringify(item)
          );
        }

        return String(item);
      })
      .join(" • ");
  }

  if (typeof value === "object") {
    return (
      value.summary ||
      value.message ||
      value.advice ||
      value.reason ||
      value.risk ||
      value.level ||
      JSON.stringify(value)
    );
  }

  return String(value);
};


  const cleanDiseaseName = (name) => {

    if (!name) {
      return "Unknown Disease";
    }

    return name
      .replace("Tomato___", "")
      .replaceAll("_", " ");
  };


  const getRiskScore = (risk) => {

    const value =
      String(risk).toLowerCase();


    if (
      value.includes("critical")
    ) {
      return 95;
    }


    if (
      value.includes("high")
    ) {
      return 80;
    }


    if (
      value.includes("moderate") ||
      value.includes("medium")
    ) {
      return 55;
    }


    if (
      value.includes("low")
    ) {
      return 25;
    }


    return 50;
  };


  const riskScore =
    getRiskScore(riskLevel);


  const getRiskClass = (risk) => {

    const value =
      String(risk).toLowerCase();


    if (
      value.includes("high") ||
      value.includes("critical") ||
      value.includes("severe")
    ) {

      return (
        "text-rose-400 bg-rose-500/10 " +
        "border-rose-500/30"
      );
    }


    if (
      value.includes("moderate") ||
      value.includes("medium")
    ) {

      return (
        "text-amber-400 bg-amber-500/10 " +
        "border-amber-500/30"
      );
    }


    if (
      value.includes("low") ||
      value.includes("none")
    ) {

      return (
        "text-emerald-400 bg-emerald-500/10 " +
        "border-emerald-500/30"
      );
    }


    return (
      "text-slate-300 bg-slate-800 " +
      "border-slate-700"
    );
  };


  const renderList = (
    items,
    emptyText = "No information available."
  ) => {

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      return (
        <p className="text-sm text-slate-500">
          {emptyText}
        </p>
      );
    }


    return (
      <ul className="space-y-2">

        {items.map((item, index) => (

          <li
            key={index}
            className="flex items-start gap-3 text-sm text-slate-300"
          >

            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-agri-400 shrink-0" />

            <span>
              {typeof item === "object"
                ? formatValue(item)
                : item}
            </span>

          </li>

        ))}

      </ul>
    );
  };


  // =========================================================
  // WEATHER GRAPH DATA
  // =========================================================

  const historicalChartData =
    useMemo(() => {

      if (!Array.isArray(previous5Days)) {
        return [];
      }


      return previous5Days.map(
        (day, index) => ({

          day:
            day.date ||
            `Day ${index + 1}`,

          temperature:
            Number(
              day.temperature ??
              day.avg_temperature_c ??
              day.max_temperature_c ??
              0
            ),

          rainfall:
            Number(
              day.rainfall ??
              day.precipitation_mm ??
              0
            ),

          humidity:
            Number(
              day.humidity ??
              day.humidity_percent ??
              0
            ),

          rainProbability:
            Number(
              day.rain_probability ??
              day.rain_probability_percent ??
              0
            ),

          wind:
            Number(
              day.wind ??
              day.max_wind_speed_kmh ??
              0
            ),

        })
      );

    }, [previous5Days]);


  const forecastChartData =
    useMemo(() => {

      if (!Array.isArray(next5Days)) {
        return [];
      }


      return next5Days.map(
        (day, index) => {

          const temperature =
            day.temperature ??
            day.avg_temperature_c ??
            day.max_temperature_c ??
            0;


          let tempValue =
            Number(temperature);


          if (
            typeof temperature === "string" &&
            temperature.includes("-")
          ) {

            tempValue =
              Number(
                temperature
                  .split("-")[0]
              );

          }


          return {

            day:
              day.date ||
              `Day ${index + 1}`,

            temperature:
              tempValue,

            rainfall:
              Number(
                day.rainfall ??
                day.precipitation_mm ??
                0
              ),

            humidity:
              Number(
                day.humidity ??
                day.humidity_percent ??
                0
              ),

            rainProbability:
              Number(
                day.rain_probability ??
                day.rain_probability_percent ??
                0
              ),

            wind:
              Number(
                day.wind ??
                day.max_wind_speed_kmh ??
                0
              ),

          };

        }
      );

    }, [next5Days]);


  const weatherGraphData = [
    ...historicalChartData,
    ...forecastChartData,
  ];


  // =========================================================
  // NO RESULT
  // =========================================================

  if (!location.state?.resultData) {

    return (

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">

        <div className="glass-panel rounded-3xl border border-slate-800 p-10">

          <AlertTriangle
            className="w-12 h-12 text-amber-400 mx-auto mb-4"
          />

          <h2 className="text-2xl font-bold text-white mb-2">
            No Scan Result Available
          </h2>

          <p className="text-slate-400 mb-6">
            Please perform a new crop scan.
          </p>

          <button
            onClick={() => navigate("/scan")}
            className="px-6 py-3 rounded-xl bg-agri-500 text-slate-950 font-bold"
          >
            Scan Another Crop
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">


      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-agri-400"
        >

          <ArrowLeft className="w-4 h-4" />

          Back to History

        </button>


        <div className="flex items-center gap-3">

          {/* LANGUAGE */}

          <div className="relative">

            <Languages
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-agri-400"
            />

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="appearance-none pl-9 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white outline-none focus:border-agri-500"
            >

              <option>English</option>
              <option>हिन्दी</option>
              <option>اردو</option>
              <option>ગુજરાતી</option>
              <option>मराठी</option>
              <option>ਪੰਜਾਬੀ</option>
              <option>বাংলা</option>
              <option>தமிழ்</option>
              <option>తెలుగు</option>
              <option>ಕನ್ನಡ</option>
              <option>മലയാളം</option>
              <option>অসমীয়া</option>
              <option>ଓଡ଼ିଆ</option>

            </select>

            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
            />

          </div>


          <button
            onClick={() => navigate("/scan")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-agri-400"
          >

            <RefreshCw className="w-4 h-4" />

            New Scan

          </button>

        </div>

      </div>


      {/* =====================================================
          LANGUAGE NOTICE
      ===================================================== */}

      <div className="rounded-2xl bg-agri-500/10 border border-agri-500/20 p-4 flex items-start gap-3">

        <Languages className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />

        <div>

          <p className="text-sm font-bold text-agri-300">
            Report Language: {language}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Language selection is ready. The AI advisory language
            will be connected to the LLM generation step.
          </p>

        </div>

      </div>


      {/* =====================================================
          LOW CONFIDENCE
      ===================================================== */}

      {confidence < 60 && (

        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex items-start gap-4">

          <AlertTriangle
            className="w-6 h-6 text-amber-400 shrink-0"
          />

          <div>

            <h3 className="font-bold text-amber-300">
              Verification Recommended
            </h3>

            <p className="text-sm text-amber-200/80 mt-1">

              ML model confidence is{" "}
              {confidence.toFixed(2)}%.
              Please verify the symptoms before taking
              major treatment decisions.

            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          3A — DISEASE + MAIN RESULT
      ===================================================== */}

      <section>

        <SectionHeading
          number="3A"
          title="Disease Analysis"
          icon={<Leaf />}
        />


        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">


          {/* IMAGE */}

          <div className="glass-panel rounded-3xl border border-slate-800 p-5">

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square border border-slate-800">

              {imageUrl ? (

                <img
                  src={imageUrl}
                  alt={disease}
                  className="w-full h-full object-contain"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center">

                  <Leaf className="w-16 h-16 text-slate-700" />

                </div>

              )}

            </div>


            <p className="text-xs text-slate-500 mt-4">
              AI Crop Disease Analysis
            </p>

          </div>


          {/* RESULT */}

          <div className="glass-panel rounded-3xl border border-slate-800 p-7">

            <div className="flex items-start justify-between gap-4 mb-6">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-agri-500/10 flex items-center justify-center">

                  <Activity className="w-7 h-7 text-agri-400" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    AI Detected
                  </p>

                  <h1 className="text-3xl font-extrabold text-white">
                    {cleanDiseaseName(disease)}
                  </h1>

                </div>

              </div>


              <span
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${getRiskClass(
                  riskLevel
                )}`}
              >
                {riskLevel} Risk
              </span>

            </div>


            {/* CONFIDENCE */}

            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 mb-5">

              <div className="flex justify-between mb-3">

                <span className="text-sm text-slate-400">
                  ML Prediction Confidence
                </span>

                <span className="text-lg font-extrabold text-agri-400">
                  {confidence.toFixed(2)}%
                </span>

              </div>


              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-agri-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(confidence, 0),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>


            {/* BASIC DATA */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <MetricBox
                title="Crop"
                value={crop}
              />

              <MetricBox
                title="Risk"
                value={riskLevel}
              />

              <MetricBox
                title="Severity"
                value={severity}
              />

            </div>

          </div>

        </div>


        {/* DISEASE DETAILS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">

          <InfoCard
            title="Description"
            icon={<Info />}
          >

            <p className="text-sm leading-7 text-slate-300">
              {description}
            </p>

          </InfoCard>


          <InfoCard
            title="Symptoms"
            icon={<Activity />}
          >

            {renderList(symptoms)}

          </InfoCard>


          <InfoCard
            title="Possible Causes"
            icon={<Lightbulb />}
          >

            {renderList(causes)}

          </InfoCard>


          <InfoCard
            title="Disease Development"
            icon={<Sprout />}
          >

            <p className="text-sm leading-7 text-slate-300">
              {development || "Not available"}
            </p>

          </InfoCard>


          <InfoCard
            title="Disease Spread"
            icon={<TrendingUp />}
          >

            <p className="text-sm leading-7 text-slate-300">
              {spread || "Not available"}
            </p>

          </InfoCard>


          <InfoCard
            title="Favorable Conditions"
            icon={<CloudRain />}
          >

            {renderList(favorableConditions)}

          </InfoCard>


          <InfoCard
            title="Differential Notes"
            icon={<Info />}
          >

            {renderList(
              differentialNotes,
              "No differential notes available."
            )}

          </InfoCard>

        </div>

      </section>


      {/* =====================================================
          3B — RISK GRAPH
      ===================================================== */}

      <section>

        <SectionHeading
          number="3B"
          title="Risk Assessment"
          icon={<ShieldAlert />}
        />


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


          {/* SCORE */}

          <div className="glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center">

            <p className="text-sm text-slate-500">
              Overall Risk Score
            </p>

            <div className="relative w-44 h-44 my-5">

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    currentColor ${riskScore * 3.6}deg,
                    #1e293b ${riskScore * 3.6}deg
                  )`,
                }}
              />

              <div className="absolute inset-3 rounded-full bg-slate-950 flex flex-col items-center justify-center">

                <span className="text-4xl font-extrabold text-white">
                  {riskScore}
                </span>

                <span className="text-xs text-slate-500">
                  / 100
                </span>

              </div>

            </div>


            <span
              className={`px-4 py-2 rounded-xl border font-bold ${getRiskClass(
                riskLevel
              )}`}
            >
              {riskLevel}
            </span>

          </div>


          {/* RISK FACTORS */}

          <div className="glass-panel rounded-3xl border border-slate-800 p-6 lg:col-span-2">

            <h3 className="text-lg font-bold text-white mb-3">
              Why is the risk {riskLevel}?
            </h3>

            <p className="text-sm text-slate-400 leading-7 mb-5">
              {riskReason}
            </p>


            {riskFactors.length > 0 ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {riskFactors.map(
                  (factor, index) => (

                    <div
                      key={index}
                      className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 flex gap-3"
                    >

                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />

                      <span className="text-sm text-slate-300">
                        {typeof factor === "object"
                          ? formatValue(factor)
                          : factor}
                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-slate-500">
                No specific risk factors available.
              </p>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          3C — WEATHER
      ===================================================== */}

      <section>

        <SectionHeading
          number="3C"
          title="Weather & Environmental Intelligence"
          icon={<CloudRain />}
        />


        {/* CURRENT WEATHER */}

        <div className="glass-panel rounded-3xl border border-slate-800 p-6">

          <h3 className="text-lg font-bold text-white mb-5">
            Current Weather
          </h3>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <WeatherCard
              icon={<Thermometer />}
              label="Temperature"
              value={
                currentWeather.temperature_c !== undefined
                  ? `${currentWeather.temperature_c}°C`
                  : "N/A"
              }
            />


            <WeatherCard
              icon={<Droplets />}
              label="Humidity"
              value={
                currentWeather.humidity_percent !== undefined
                  ? `${currentWeather.humidity_percent}%`
                  : "N/A"
              }
            />


            <WeatherCard
              icon={<CloudRain />}
              label="Rainfall"
              value={
                currentWeather.rain_mm !== undefined
                  ? `${currentWeather.rain_mm} mm`
                  : "N/A"
              }
            />


            <WeatherCard
              icon={<Wind />}
              label="Wind"
              value={
                currentWeather.wind_speed_kmh !== undefined
                  ? `${currentWeather.wind_speed_kmh} km/h`
                  : "N/A"
              }
            />

          </div>


          {/* LOCATION */}

          {(locationData.latitude ||
            locationData.longitude ||
            locationData.city) && (

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">

              <MapPin className="w-4 h-4 text-agri-400" />

              {locationData.city ||
                locationData.district ||
                "Farm Location"}

              {locationData.latitude &&
                ` • ${locationData.latitude}, ${locationData.longitude}`}

            </div>

          )}

        </div>


        {/* WEATHER GRAPHS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">


          {/* TEMPERATURE */}

          <ChartCard
            title="Temperature Trend"
            subtitle="Past and forecast temperature"
          >

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <LineChart data={weatherGraphData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="temperature"
                  strokeWidth={3}
                  name="Temperature °C"
                />

              </LineChart>

            </ResponsiveContainer>

          </ChartCard>


          {/* RAINFALL */}

          <ChartCard
            title="Rainfall"
            subtitle="Rainfall in millimetres"
          >

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart data={weatherGraphData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="rainfall"
                  name="Rainfall mm"
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>


          {/* HUMIDITY */}

          <ChartCard
            title="Humidity"
            subtitle="Relative humidity percentage"
          >

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <AreaChart data={weatherGraphData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity %"
                  fillOpacity={0.2}
                />

              </AreaChart>

            </ResponsiveContainer>

          </ChartCard>


          {/* RAIN PROBABILITY */}

          <ChartCard
            title="Rain Probability"
            subtitle="Chance of rain"
          >

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <LineChart data={weatherGraphData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="rainProbability"
                  strokeWidth={3}
                  name="Rain Probability %"
                />

              </LineChart>

            </ResponsiveContainer>

          </ChartCard>

        </div>


        {/* WEATHER RISK */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

          <WeatherInsight
            title="Disease Weather Risk"
            value={
              typeof diseaseWeatherRisk === "string"
                ? diseaseWeatherRisk
                : formatValue(diseaseWeatherRisk)
            }
          />


          <WeatherInsight
            title="Pest Weather Risk"
            value={
              typeof pestWeatherRisk === "string"
                ? pestWeatherRisk
                : formatValue(pestWeatherRisk)
            }
          />


          <WeatherInsight
            title="Spraying Advice"
            value={
              typeof sprayingAdvice === "string"
                ? sprayingAdvice
                : formatValue(sprayingAdvice)
            }
          />

        </div>


        {/* RAIN PREDICTION */}

        <div className="mt-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">

          <div className="flex items-center gap-3 mb-3">

            <CloudRain className="w-5 h-5 text-blue-400" />

            <h3 className="font-bold text-white">
              Rain Prediction
            </h3>

          </div>

          <p className="text-sm text-slate-300 leading-7">

            {typeof rainPrediction === "string"
              ? rainPrediction
              : rainPrediction.summary ||
                rainPrediction.message ||
                formatValue(rainPrediction)}

          </p>

        </div>


        {/* FORECAST TABLE */}

        <WeatherTable
          title="Next 5 Days Forecast"
          data={next5Days}
        />

      </section>


      {/* =====================================================
          3D — PEST ANALYSIS
      ===================================================== */}

      <section>

        <SectionHeading
          number="3D"
          title="Pest Analysis"
          icon={<Bug />}
        />


        {pestAnalysis.length === 0 ? (

          <div className="glass-panel rounded-3xl border border-slate-800 p-6">

            <div className="flex gap-3">

              <CheckCircle2 className="w-5 h-5 text-emerald-400" />

              <p className="text-sm text-slate-400">
                No major pest information was detected for this scan.
              </p>

            </div>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {pestAnalysis.map(
              (pest, index) => (

                <div
                  key={index}
                  className="glass-panel rounded-3xl border border-slate-800 p-6"
                >

                  <div className="flex items-start justify-between gap-3 mb-4">

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {pest.name ||
                          pest.pest ||
                          pest.common_name ||
                          `Pest ${index + 1}`}
                      </h3>

                      {pest.scientific_name && (

                        <p className="text-xs italic text-slate-500 mt-1">
                          {pest.scientific_name}
                        </p>

                      )}

                    </div>

                    <Bug className="w-6 h-6 text-amber-400" />

                  </div>


                  {pest.identification && (

                    <p className="text-sm text-slate-400 leading-6 mb-4">
                      {pest.identification}
                    </p>

                  )}


                  <InfoRow
                    label="Affected Part"
                    value={pest.plant_part_affected}
                  />


                  <InfoRow
                    label="Life Cycle"
                    value={pest.life_cycle_stage}
                  />


                  <div className="mt-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Damage Symptoms
                    </p>

                    {renderList(
                      pest.damage_symptoms
                    )}

                  </div>


                  <div className="mt-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Early Warning Signs
                    </p>

                    {renderList(
                      pest.early_warning_signs
                    )}

                  </div>


                  {/* IPM */}

                  {pest.ipm && (

                    <div className="mt-5 pt-5 border-t border-slate-800">

                      <p className="text-sm font-bold text-white mb-3">
                        Integrated Pest Management
                      </p>


                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <MiniList
                          title="Monitoring"
                          items={pest.ipm.monitoring}
                        />

                        <MiniList
                          title="Cultural Control"
                          items={pest.ipm.cultural_control}
                        />

                        <MiniList
                          title="Biological Control"
                          items={pest.ipm.biological_control}
                        />

                        <MiniList
                          title="Chemical Control"
                          items={pest.ipm.chemical_control}
                        />

                      </div>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =====================================================
          CHEMICAL RECOMMENDATIONS
      ===================================================== */}

      <section>

        <SectionHeading
          number="3D+"
          title="Treatment & Chemical Recommendations"
          icon={<FlaskConical />}
        />


        {chemicalRecommendations.length === 0 ? (

          <div className="glass-panel rounded-3xl border border-slate-800 p-6">

            <p className="text-sm text-slate-500">
              No chemical recommendation available.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {chemicalRecommendations.map(
              (item, index) => (

                <div
                  key={index}
                  className="glass-panel rounded-3xl border border-slate-800 p-6"
                >

                  <div className="flex flex-col sm:flex-row justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold text-white">

                        {item.product ||
                          item.name ||
                          item.medicine ||
                          `Recommendation ${index + 1}`}

                      </h3>


                      <p className="text-sm text-agri-400 mt-1">
                        Target:{" "}
                        {item.target || disease}
                      </p>

                    </div>


                    <FlaskConical className="w-7 h-7 text-blue-400" />

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                    <DetailBox
                      label="Dose / Acre"
                      value={
                        item.dose_per_acre ||
                        item.dosage_per_acre ||
                        item.dose ||
                        item.dosage
                      }
                    />


                    <DetailBox
                      label="Total Farm Amount"
                      value={
                        item.total_amount ||
                        item.total_quantity
                      }
                    />


                    <DetailBox
                      label="Water / Acre"
                      value={
                        item.water_per_acre ||
                        item.water_per_hectare
                      }
                    />


                    <DetailBox
                      label="Application"
                      value={
                        item.application_method ||
                        item.application
                      }
                    />

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

                    <DetailBox
                      label="Frequency"
                      value={item.frequency}
                    />

                    <DetailBox
                      label="Interval"
                      value={item.interval}
                    />

                    <DetailBox
                      label="PHI"
                      value={
                        item.pre_harvest_interval
                      }
                    />

                  </div>


                  {item.precautions &&
                    item.precautions.length > 0 && (

                    <div className="mt-5">

                      <p className="text-xs uppercase text-slate-500 font-bold mb-2">
                        Precautions
                      </p>

                      {renderList(
                        item.precautions
                      )}

                    </div>

                  )}


                  <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">

                    <p className="text-xs text-amber-200/80 leading-6">

                      <strong className="text-amber-300">
                        Safety:
                      </strong>{" "}

                      Always verify the exact dose on the
                      registered product label and follow
                      local agricultural regulations.

                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =====================================================
          3E — ACTION PLAN
      ===================================================== */}

      <section>

        <SectionHeading
          number="3E"
          title="Recommended Action Plan"
          icon={<CheckCircle2 />}
        />


        <div className="space-y-5">


          <ActionBlock
            title="Do This Now"
            icon={<AlertTriangle />}
            value={
              actionPlan.now ||
              actionPlan.immediate_actions ||
              actionPlan.immediate ||
              []
            }
          />


          <ActionBlock
            title="Next 24 Hours"
            icon={<Activity />}
            value={
              actionPlan.next_24_hours ||
              []
            }
          />


          <ActionBlock
            title="Next 3 Days"
            icon={<CalendarDays />}
            value={
              actionPlan.next_3_days ||
              []
            }
          />


          <ActionBlock
            title="Next 5 Days"
            icon={<CalendarDays />}
            value={
              actionPlan.next_5_days ||
              []
            }
          />


          <ActionBlock
            title="Prevention"
            icon={<ShieldAlert />}
            value={
              actionPlan.prevention ||
              actionPlan.prevention_tips ||
              []
            }
          />


          <ActionBlock
            title="Long-Term Management"
            icon={<Sprout />}
            value={
              actionPlan.long_term_management ||
              actionPlan.management ||
              []
            }
          />

        </div>


        {/* MONITORING */}

        <div className="glass-panel rounded-3xl border border-slate-800 p-6 mt-6">

          <div className="flex items-center gap-3 mb-5">

            <Eye className="w-6 h-6 text-purple-400" />

            <h3 className="text-lg font-bold text-white">
              Smart Monitoring Plan
            </h3>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ObjectInfo
              title="Monitoring Frequency"
              value={
                monitoringPlan.monitoring_frequency ||
                monitoringPlan.frequency
              }
            />


            <ObjectInfo
              title="Priority Zone"
              value={
                monitoringPlan.priority_zone
              }
            />


            <ObjectInfo
              title="Early Warning Signs"
              value={
                monitoringPlan.early_warning_signs
              }
            />


            <ObjectInfo
              title="Inspection Interval"
              value={
                monitoringPlan.inspection_interval
              }
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          3F — FINAL AI SUMMARY
      ===================================================== */}

      <section>

        <SectionHeading
          number="3F"
          title="Final AI Summary"
          icon={<Lightbulb />}
        />


        <div className="relative overflow-hidden rounded-3xl border border-agri-500/30 bg-gradient-to-br from-agri-500/10 via-slate-900 to-slate-950 p-7">

          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-agri-500/10 blur-3xl" />


          <div className="relative">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-xl bg-agri-500/10 flex items-center justify-center">

                <Sprout className="w-7 h-7 text-agri-400" />

              </div>

              <div>

                <p className="text-xs uppercase tracking-widest text-agri-400 font-bold">
                  AI Advisory
                </p>

                <h3 className="text-xl font-extrabold text-white">
                  Farm Health Summary
                </h3>

              </div>

            </div>


            <p className="text-base leading-8 text-slate-200 max-w-5xl">
              {summary}
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">

              <SummaryMetric
                label="Disease"
                value={cleanDiseaseName(disease)}
              />

              <SummaryMetric
                label="ML Confidence"
                value={`${confidence.toFixed(2)}%`}
              />

              <SummaryMetric
                label="Risk"
                value={riskLevel}
              />

            </div>


            {advisory.confidence_note && (

              <div className="mt-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800">

                <p className="text-xs text-slate-400 leading-6">

                  <strong className="text-slate-300">
                    Model note:
                  </strong>{" "}

                  {advisory.confidence_note}

                </p>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          3G — LANGUAGE
      ===================================================== */}

      <section>

        <SectionHeading
          number="3G"
          title="Report Language"
          icon={<Languages />}
        />


        <div className="glass-panel rounded-3xl border border-slate-800 p-6">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

            <div>

              <h3 className="text-lg font-bold text-white">
                Choose your preferred language
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                The final AI advisory can be generated in
                Indian regional languages.
              </p>

            </div>


            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="w-full md:w-72 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-agri-500"
            >

              <option>English</option>
              <option>हिन्दी</option>
              <option>اردو</option>
              <option>ગુજરાતી</option>
              <option>मराठी</option>
              <option>ਪੰਜਾਬੀ</option>
              <option>বাংলা</option>
              <option>தமிழ்</option>
              <option>తెలుగు</option>
              <option>ಕನ್ನಡ</option>
              <option>മലയാളം</option>
              <option>অসমীয়া</option>
              <option>ଓଡ଼ିଆ</option>

            </select>

          </div>


          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">

            {[
              "English",
              "हिन्दी",
              "اردو",
              "ગુજરાતી",
              "मराठी",
              "தமிழ்",
              "తెలుగు",
            ].map((lang) => (

              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition ${
                  language === lang
                    ? "border-agri-500 bg-agri-500/10 text-agri-400"
                    : "border-slate-800 bg-slate-900 text-slate-400"
                }`}
              >
                {lang}
              </button>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL SAFETY NOTE
      ===================================================== */}

      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">

        <div className="flex items-start gap-3">

          <Info className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />

          <p className="text-xs text-slate-500 leading-6">

            This report combines ML disease detection,
            farm information, weather conditions and AI
            advisory. Chemical treatment should always be
            verified against the registered product label
            and local agricultural guidance.

          </p>

        </div>

      </div>


      {/* =====================================================
          BOTTOM BUTTONS
      ===================================================== */}

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 pb-10">

        <button
          onClick={() => navigate("/history")}
          className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 font-bold"
        >
          Back to History
        </button>


        <button
          onClick={() => navigate("/scan")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 text-slate-950 font-bold flex items-center justify-center gap-2"
        >

          <RefreshCw className="w-5 h-5" />

          Scan Another Crop

        </button>

      </div>

    </div>
  );
}


// =============================================================
// SECTION HEADING
// =============================================================

function SectionHeading({
  number,
  title,
  icon,
}) {

  return (

    <div className="flex items-center gap-4 mb-5">

      <div className="w-12 h-12 rounded-xl bg-agri-500/10 border border-agri-500/20 flex items-center justify-center">

        {React.cloneElement(icon, {
          className: "w-6 h-6 text-agri-400",
        })}

      </div>


      <div>

        <p className="text-xs uppercase tracking-widest text-agri-400 font-bold">
          {number}
        </p>

        <h2 className="text-2xl font-extrabold text-white">
          {title}
        </h2>

      </div>

    </div>
  );
}


// =============================================================
// METRIC BOX
// =============================================================

function MetricBox({
  title,
  value,
}) {

  return (

    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">

      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
        {title}
      </p>

      <p className="text-lg font-bold text-white mt-1">
        {value || "Not available"}
      </p>

    </div>
  );
}


// =============================================================
// INFO CARD
// =============================================================

function InfoCard({
  title,
  icon,
  children,
}) {

  return (

    <div className="glass-panel rounded-3xl border border-slate-800 p-6">

      <div className="flex items-center gap-2 mb-4">

        <span className="text-agri-400">

          {React.cloneElement(icon, {
            className: "w-4 h-4",
          })}

        </span>

        <h3 className="text-sm font-bold text-white">
          {title}
        </h3>

      </div>

      {children}

    </div>
  );
}


// =============================================================
// WEATHER CARD
// =============================================================

function WeatherCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

      <div className="flex items-center gap-2 text-blue-400 mb-3">

        {React.cloneElement(icon, {
          className: "w-5 h-5",
        })}

        <span className="text-xs text-slate-500">
          {label}
        </span>

      </div>

      <p className="text-xl font-extrabold text-white">
        {value}
      </p>

    </div>
  );
}


// =============================================================
// CHART CARD
// =============================================================

function ChartCard({
  title,
  subtitle,
  children,
}) {

  return (

    <div className="glass-panel rounded-3xl border border-slate-800 p-5">

      <h3 className="text-lg font-bold text-white">
        {title}
      </h3>

      <p className="text-xs text-slate-500 mt-1 mb-4">
        {subtitle}
      </p>

      {children}

    </div>
  );
}


// =============================================================
// WEATHER INSIGHT
// =============================================================

function WeatherInsight({
  title,
  value,
}) {

  return (

    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
        {title}
      </p>

      <p className="text-sm text-slate-300 leading-6">
        {value || "Not available"}
      </p>

    </div>
  );
}


// =============================================================
// WEATHER TABLE
// =============================================================

function WeatherTable({
  title,
  data,
}) {

  return (

    <div className="glass-panel rounded-3xl border border-slate-800 p-6 mt-6">

      <div className="flex items-center gap-2 mb-5">

        <CalendarDays className="w-5 h-5 text-agri-400" />

        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>

      </div>


      {!Array.isArray(data) ||
      data.length === 0 ? (

        <p className="text-sm text-slate-500">
          Weather forecast is not available.
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-800">

                <th className="text-left p-3 text-slate-500">
                  Date
                </th>

                <th className="text-left p-3 text-slate-500">
                  Temperature
                </th>

                <th className="text-left p-3 text-slate-500">
                  Rainfall
                </th>

                <th className="text-left p-3 text-slate-500">
                  Rain Chance
                </th>

                <th className="text-left p-3 text-slate-500">
                  Wind
                </th>

              </tr>

            </thead>


            <tbody>

              {data.map(
                (day, index) => (

                  <tr
                    key={index}
                    className="border-b border-slate-900"
                  >

                    <td className="p-3 text-agri-400 font-semibold">
                      {day.date || `Day ${index + 1}`}
                    </td>

                    <td className="p-3 text-slate-300">
                      {formatTemperature(day)}
                    </td>

                    <td className="p-3 text-slate-300">
                      {day.rainfall ??
                        day.precipitation_mm ??
                        0} mm
                    </td>

                    <td className="p-3 text-slate-300">
                      {day.rain_probability ??
                        day.rain_probability_percent ??
                        0}%
                    </td>

                    <td className="p-3 text-slate-300">
                      {day.wind ??
                        day.max_wind_speed_kmh ??
                        "N/A"} km/h
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


// =============================================================
// FORMAT TEMPERATURE
// =============================================================

function formatTemperature(day) {

  if (
    day.min_temperature_c !== undefined &&
    day.max_temperature_c !== undefined
  ) {

    return `${day.min_temperature_c}°C - ${day.max_temperature_c}°C`;
  }


  if (day.temperature !== undefined) {

    return `${day.temperature}°C`;
  }


  return "N/A";
}


// =============================================================
// INFO ROW
// =============================================================

function InfoRow({
  label,
  value,
}) {

  return (

    <div className="flex justify-between gap-4 py-2 border-b border-slate-800">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-sm text-slate-300 text-right">
        {value || "Not available"}
      </span>

    </div>
  );
}


// =============================================================
// MINI LIST
// =============================================================

function MiniList({
  title,
  items,
}) {

  return (

    <div className="rounded-xl bg-slate-950/50 p-3">

      <p className="text-xs text-slate-500 font-bold mb-2">
        {title}
      </p>

      {Array.isArray(items) &&
      items.length > 0 ? (

        <ul className="space-y-1">

          {items.map(
            (item, index) => (

              <li
                key={index}
                className="text-xs text-slate-400"
              >
                • {typeof item === "object"
                  ? JSON.stringify(item)
                  : item}
              </li>

            )
          )}

        </ul>

      ) : (

        <p className="text-xs text-slate-600">
          Not available
        </p>

      )}

    </div>
  );
}


// =============================================================
// DETAIL BOX
// =============================================================

function DetailBox({
  label,
  value,
}) {

  return (

    <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-4">

      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
        {label}
      </p>

      <p className="text-sm text-slate-200 mt-2 font-semibold">
        {value || "Not available"}
      </p>

    </div>
  );
}


// =============================================================
// ACTION BLOCK
// =============================================================

function ActionBlock({
  title,
  icon,
  value,
}) {

  const items =
    Array.isArray(value)
      ? value
      : value
        ? [value]
        : [];


  return (

    <div className="glass-panel rounded-3xl border border-slate-800 p-6">

      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">

          {React.cloneElement(icon, {
            className: "w-5 h-5 text-agri-400",
          })}

        </div>

        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>

      </div>


      {items.length === 0 ? (

        <p className="text-sm text-slate-500">
          No information available.
        </p>

      ) : (

        <ul className="space-y-3">

          {items.map(
            (item, index) => (

              <li
                key={index}
                className="flex items-start gap-3 text-sm text-slate-300"
              >

                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

                <span>
                  {typeof item === "object"
                    ? JSON.stringify(item)
                    : item}
                </span>

              </li>

            )
          )}

        </ul>

      )}

    </div>
  );
}


// =============================================================
// OBJECT INFO
// =============================================================

function ObjectInfo({
  title,
  value,
}) {

  return (

    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
        {title}
      </p>


      {Array.isArray(value) ? (

        <ul className="space-y-2">

          {value.map(
            (item, index) => (

              <li
                key={index}
                className="text-sm text-slate-300 flex gap-2"
              >

                <span className="text-agri-400">
                  •
                </span>

                <span>
                  {typeof item === "object"
                    ? JSON.stringify(item)
                    : item}
                </span>

              </li>

            )
          )}

        </ul>

      ) : (

        <p className="text-sm text-slate-300 leading-6">
          {value || "Not available"}
        </p>

      )}

    </div>
  );
}


// =============================================================
// SUMMARY METRIC
// =============================================================

function SummaryMetric({
  label,
  value,
}) {

  return (

    <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">

      <p className="text-xs text-slate-500 uppercase font-bold">
        {label}
      </p>

      <p className="text-sm text-white font-bold mt-1">
        {value}
      </p>

    </div>
  );
}