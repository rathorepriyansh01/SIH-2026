import React from "react";
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
  MapPin,
  ShieldAlert,
  Sprout,
  FlaskConical,
  Eye,
  Lightbulb,
  Info,
} from "lucide-react";

import { SERVER_URL } from "../services/api";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state?.resultData || {};
  const uploadedImage = location.state?.imageUrl || null;

  // =========================================================
  // BACKEND RESPONSE NORMALIZATION
  // =========================================================

  const advisory =
    resultData.advisory ||
    resultData.llm_advisory ||
    resultData.ai_advisory ||
    resultData;

  const prediction =
    resultData.prediction ||
    resultData.detection ||
    advisory.prediction ||
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
    advisory.weather ||
    resultData.weather ||
    resultData.context?.weather ||
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

  const context =
    resultData.context ||
    advisory.context ||
    {};

  // =========================================================
  // BASIC VALUES
  // =========================================================

  const disease =
    prediction.disease ||
    prediction.name ||
    diseaseAnalysis.name ||
    "Unknown Disease";

  const crop =
    prediction.crop ||
    context.farm?.crop ||
    context.crop ||
    "Unknown Crop";

  const confidence =
    Number(
      prediction.confidence ??
      resultData.confidence ??
      0
    );

  const riskLevel =
    prediction.risk_level ||
    riskAssessment.level ||
    riskAssessment.risk_level ||
    advisory.risk_level ||
    "Unknown";

  const severity =
    riskAssessment.severity ||
    diseaseAnalysis.severity ||
    advisory.severity ||
    "Unknown";

  const confidenceLevel =
    prediction.confidence_level ||
    (confidence >= 80
      ? "High"
      : confidence >= 60
      ? "Moderate"
      : "Low");

  // =========================================================
  // IMAGE URL
  // =========================================================

  const imagePath =
    resultData.scan_metadata?.image_path ||
    resultData.image_path ||
    prediction.image_path ||
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
  // DISEASE DETAILS
  // =========================================================

  const description =
    diseaseAnalysis.description ||
    advisory.description ||
    "No disease description available.";

  const symptoms =
    diseaseAnalysis.symptoms ||
    advisory.symptoms ||
    [];

  const possibleCauses =
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

  // =========================================================
  // WEATHER
  // =========================================================

  const currentWeather =
    weather.current ||
    weather.current_weather ||
    {};

  const previous5Days =
    weather.previous_5_days ||
    [];

  const next5Days =
    weather.next_5_days ||
    [];

  const rainPrediction =
    weather.rain_prediction ||
    {};

  const diseaseWeatherRisk =
    weather.disease_weather_risk ||
    {};

  const sprayingAdvice =
    weather.spraying_advice ||
    [];

  // =========================================================
  // FARM INFORMATION
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
      return JSON.stringify(value);
    }

    return String(value);
  };

  const getRiskClass = (risk) => {
    const value = String(risk).toLowerCase();

    if (
      value.includes("high") ||
      value.includes("critical") ||
      value.includes("severe")
    ) {
      return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    }

    if (
      value.includes("moderate") ||
      value.includes("medium")
    ) {
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }

    if (
      value.includes("low") ||
      value.includes("none")
    ) {
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }

    return "text-slate-300 bg-slate-800 border-slate-700";
  };

  const getDayName = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
        }
      );
    } catch {
      return date;
    }
  };

  const renderList = (items, emptyText = "No information available.") => {
    if (!Array.isArray(items) || items.length === 0) {
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
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-agri-400 shrink-0" />
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
  // NO RESULT
  // =========================================================

  if (!location.state?.resultData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl border border-slate-800 p-10">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-white mb-2">
            No Scan Result Available
          </h2>

          <p className="text-slate-400 mb-6">
            Please perform a new crop scan to view the AI
            analysis.
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
  // UI
  // =========================================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="flex items-center justify-between">

        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-agri-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>

        <button
          onClick={() => navigate("/scan")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-agri-400 hover:border-agri-500/40"
        >
          <RefreshCw className="w-4 h-4" />
          New Scan
        </button>

      </div>


      {/* =====================================================
          LOW CONFIDENCE WARNING
      ===================================================== */}

      {confidence < 60 && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex items-start gap-4">

          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />

          <div>
            <h3 className="font-bold text-amber-300">
              Verification Recommended
            </h3>

            <p className="text-sm text-amber-200/80 mt-1">
              The model confidence is{" "}
              {confidence.toFixed(2)}%.
              Please verify the symptoms with an
              agricultural expert or upload a clearer
              leaf image before taking major treatment
              decisions.
            </p>
          </div>

        </div>
      )}


      {/* =====================================================
          MAIN RESULT
      ===================================================== */}

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


        {/* PREDICTION */}

        <div className="glass-panel rounded-3xl border border-slate-800 p-7">

          <div className="flex items-center gap-4 mb-6">

            <div className="w-12 h-12 rounded-xl bg-agri-500/10 flex items-center justify-center">
              <Activity className="w-7 h-7 text-agri-400" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                AI Detected
              </p>

              <h1 className="text-3xl font-extrabold text-white">
                {disease}
              </h1>
            </div>

          </div>


          {/* CONFIDENCE */}

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 mb-5">

            <div className="flex justify-between mb-3">

              <span className="text-sm text-slate-400">
                Prediction Confidence
              </span>

              <span className="text-lg font-extrabold text-agri-400">
                {confidence.toFixed(2)}%
              </span>

            </div>

            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-agri-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(confidence, 0),
                    100
                  )}%`,
                }}
              />

            </div>

            <p className="text-xs text-slate-500 mt-3">
              Confidence Level:{" "}
              <span className="text-slate-300 font-bold">
                {confidenceLevel}
              </span>
            </p>

          </div>


          {/* RISK + SEVERITY */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">

              <p className="text-[11px] uppercase text-slate-500 font-bold">
                Crop
              </p>

              <p className="text-lg font-bold text-white mt-1">
                {crop}
              </p>

            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">

              <p className="text-[11px] uppercase text-slate-500 font-bold">
                Risk Level
              </p>

              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-lg border text-sm font-bold ${getRiskClass(
                  riskLevel
                )}`}
              >
                {riskLevel}
              </span>

            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">

              <p className="text-[11px] uppercase text-slate-500 font-bold">
                Severity
              </p>

              <p className="text-lg font-bold text-white mt-1">
                {severity}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          DISEASE INFORMATION
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<Leaf className="w-6 h-6 text-agri-400" />}
          title="Disease Information"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <InfoBlock
            title="Description"
            icon={<Info className="w-4 h-4" />}
          >
            <p className="text-sm leading-7 text-slate-300">
              {description}
            </p>
          </InfoBlock>


          <InfoBlock
            title="Symptoms"
            icon={<Activity className="w-4 h-4" />}
          >
            {renderList(symptoms)}
          </InfoBlock>


          <InfoBlock
            title="Possible Causes"
            icon={<Lightbulb className="w-4 h-4" />}
          >
            {renderList(possibleCauses)}
          </InfoBlock>


          <InfoBlock
            title="Development"
            icon={<Sprout className="w-4 h-4" />}
          >
            <p className="text-sm leading-7 text-slate-300">
              {development || "No development information available."}
            </p>
          </InfoBlock>


          <InfoBlock
            title="Spread"
            icon={<Activity className="w-4 h-4" />}
          >
            <p className="text-sm leading-7 text-slate-300">
              {spread || "No spread information available."}
            </p>
          </InfoBlock>


          <InfoBlock
            title="Favorable Conditions"
            icon={<CloudRain className="w-4 h-4" />}
          >
            {renderList(favorableConditions)}
          </InfoBlock>

        </div>

      </section>


      {/* =====================================================
          PEST ANALYSIS
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<Bug className="w-6 h-6 text-amber-400" />}
          title="Pest Analysis"
        />

        {pestAnalysis.length === 0 ? (

          <div className="text-sm text-slate-500">
            No pest information available for this scan.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {pestAnalysis.map((pest, index) => (

              <div
                key={index}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5"
              >

                <h3 className="text-lg font-bold text-white mb-3">
                  {pest.name ||
                    pest.pest ||
                    pest.common_name ||
                    `Pest ${index + 1}`}
                </h3>

                {pest.description && (
                  <p className="text-sm text-slate-400 leading-6 mb-4">
                    {pest.description}
                  </p>
                )}

                {pest.damage && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Damage
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      {pest.damage}
                    </p>
                  </div>
                )}

                {pest.signs && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Signs
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      {pest.signs}
                    </p>
                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          CHEMICAL RECOMMENDATIONS
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<FlaskConical className="w-6 h-6 text-blue-400" />}
          title="Chemical & Pest Management"
        />

        {chemicalRecommendations.length === 0 ? (

          <p className="text-sm text-slate-500">
            No chemical recommendation available.
          </p>

        ) : (

          <div className="space-y-4">

            {chemicalRecommendations.map(
              (item, index) => (

                <div
                  key={index}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {item.product ||
                          item.name ||
                          item.medicine ||
                          `Recommendation ${index + 1}`}
                      </h3>

                      {item.target && (
                        <p className="text-xs text-agri-400 mt-1">
                          Target: {item.target}
                        </p>
                      )}

                    </div>

                    {item.dosage && (
                      <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
                        {item.dosage}
                      </span>
                    )}

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

                    {item.application && (
                      <SmallDetail
                        label="Application"
                        value={item.application}
                      />
                    )}

                    {item.timing && (
                      <SmallDetail
                        label="Timing"
                        value={item.timing}
                      />
                    )}

                    {item.frequency && (
                      <SmallDetail
                        label="Frequency"
                        value={item.frequency}
                      />
                    )}

                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-4">
                      {item.notes}
                    </p>
                  )}

                </div>

              )
            )}

          </div>

        )}

        <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">

          <p className="text-xs text-amber-200/80 leading-6">
            <strong className="text-amber-300">
              Safety note:
            </strong>{" "}
            Chemical recommendations are AI-generated
            guidance. Always follow the registered product
            label, local agricultural regulations and
            advice from a qualified agricultural expert
            before application.
          </p>

        </div>

      </section>


      {/* =====================================================
          WEATHER
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<CloudRain className="w-6 h-6 text-blue-400" />}
          title="Weather & Environmental Intelligence"
        />

        {/* CURRENT WEATHER */}

        <div className="mb-8">

          <h3 className="text-lg font-bold text-white mb-4">
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
              label="Rain"
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

        </div>


        {/* RAIN PREDICTION */}

        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 mb-8">

          <div className="flex items-center gap-3 mb-3">

            <CloudRain className="w-5 h-5 text-blue-400" />

            <h3 className="font-bold text-white">
              Rain Prediction
            </h3>

          </div>

          <p className="text-sm text-slate-300 leading-6">

            {typeof rainPrediction === "string"
              ? rainPrediction
              : rainPrediction.summary ||
                rainPrediction.message ||
                (
                  rainPrediction.rain_expected !== undefined
                    ? rainPrediction.rain_expected
                      ? "Rain is expected during the forecast period."
                      : "No significant rain is currently expected during the forecast period."
                    : "Rain prediction information is not available."
                )}

          </p>

        </div>


        {/* PREVIOUS 5 DAYS */}

        <WeatherTimeline
          title="Previous 5 Days"
          data={previous5Days}
          historical
        />


        {/* NEXT 5 DAYS */}

        <WeatherTimeline
          title="Next 5 Days Forecast"
          data={next5Days}
        />


        {/* WEATHER RISK */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

            <div className="flex items-center gap-3 mb-3">

              <ShieldAlert className="w-5 h-5 text-amber-400" />

              <h3 className="font-bold text-white">
                Disease Weather Risk
              </h3>

            </div>

            <p className="text-sm text-slate-300 leading-6">

              {typeof diseaseWeatherRisk === "string"
                ? diseaseWeatherRisk
                : diseaseWeatherRisk.summary ||
                  diseaseWeatherRisk.level ||
                  diseaseWeatherRisk.risk ||
                  "No weather-related disease risk information available."}

            </p>

          </div>


          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

            <div className="flex items-center gap-3 mb-3">

              <FlaskConical className="w-5 h-5 text-agri-400" />

              <h3 className="font-bold text-white">
                Spraying Advice
              </h3>

            </div>

            {Array.isArray(sprayingAdvice) ? (
              renderList(
                sprayingAdvice.map((item) =>
                  typeof item === "string"
                    ? item
                    : `${item.date || ""}: ${
                        item.reason ||
                        item.advice ||
                        (item.suitable
                          ? "Suitable conditions"
                          : "Avoid spraying")
                      }`
                )
              )
            ) : (
              <p className="text-sm text-slate-300">
                {formatValue(sprayingAdvice)}
              </p>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          MONITORING PLAN
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<Eye className="w-6 h-6 text-purple-400" />}
          title="Smart Monitoring Plan"
        />

        {typeof monitoringPlan === "string" ? (

          <p className="text-sm text-slate-300 leading-7">
            {monitoringPlan}
          </p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ObjectInfo
              title="Monitoring Frequency"
              value={
                monitoringPlan.frequency ||
                monitoringPlan.monitoring_frequency
              }
            />

            <ObjectInfo
              title="What To Monitor"
              value={
                monitoringPlan.what_to_monitor ||
                monitoringPlan.parameters
              }
            />

            <ObjectInfo
              title="Early Warning Signs"
              value={
                monitoringPlan.early_warning_signs ||
                monitoringPlan.warning_signs
              }
            />

            <ObjectInfo
              title="Next Recommended Check"
              value={
                monitoringPlan.next_check ||
                monitoringPlan.next_monitoring
              }
            />

          </div>

        )}

      </section>


      {/* =====================================================
          RISK ASSESSMENT
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
          title="Risk Assessment"
        />

        {typeof riskAssessment === "string" ? (

          <p className="text-sm text-slate-300 leading-7">
            {riskAssessment}
          </p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ObjectInfo
              title="Overall Risk"
              value={
                riskAssessment.level ||
                riskAssessment.risk_level
              }
            />

            <ObjectInfo
              title="Severity"
              value={riskAssessment.severity}
            />

            <ObjectInfo
              title="Spread Risk"
              value={
                riskAssessment.spread_risk
              }
            />

            <ObjectInfo
              title="Reason"
              value={
                riskAssessment.reason ||
                riskAssessment.explanation
              }
            />

          </div>

        )}

      </section>


      {/* =====================================================
          ACTION PLAN
      ===================================================== */}

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">

        <SectionTitle
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          title="Recommended Action Plan"
        />

        {typeof actionPlan === "string" ? (

          <p className="text-sm text-slate-300 leading-7">
            {actionPlan}
          </p>

        ) : (

          <div className="space-y-5">

            <ActionBlock
              title="Immediate Actions"
              value={
                actionPlan.immediate_actions ||
                actionPlan.immediate ||
                []
              }
            />

            <ActionBlock
              title="Prevention"
              value={
                actionPlan.prevention ||
                actionPlan.prevention_tips ||
                []
              }
            />

            <ActionBlock
              title="Long-Term Management"
              value={
                actionPlan.long_term_management ||
                actionPlan.management ||
                []
              }
            />

          </div>

        )}

      </section>


      {/* =====================================================
          FOOTER INFO
      ===================================================== */}

      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">

        <div className="flex items-start gap-3">

          <Info className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />

          <p className="text-xs text-slate-500 leading-6">

            This report combines the crop disease model,
            farm context, environmental conditions and AI
            advisory. AI output should support — not replace
            — professional agricultural judgement.

          </p>

        </div>

      </div>


      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 pb-8">

        <button
          onClick={() => navigate("/history")}
          className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 font-bold hover:border-agri-500/40"
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


// =========================================================
// REUSABLE COMPONENTS
// =========================================================

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">

      <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
        {icon}
      </div>

      <h2 className="text-xl font-extrabold text-white">
        {title}
      </h2>

    </div>
  );
}


function InfoBlock({ title, icon, children }) {
  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">

      <div className="flex items-center gap-2 mb-3">

        <span className="text-agri-400">
          {icon}
        </span>

        <h3 className="text-sm font-bold text-white">
          {title}
        </h3>

      </div>

      {children}

    </div>
  );
}


function SmallDetail({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
        {label}
      </p>

      <p className="text-sm text-slate-300 mt-1">
        {value}
      </p>
    </div>
  );
}


function WeatherCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">

      <div className="flex items-center gap-2 text-blue-400 mb-2">
        {React.cloneElement(icon, {
          className: "w-4 h-4",
        })}

        <span className="text-xs text-slate-500">
          {label}
        </span>
      </div>

      <p className="text-lg font-extrabold text-white">
        {value}
      </p>

    </div>
  );
}


function WeatherTimeline({
  title,
  data,
}) {
  return (
    <div className="mb-8">

      <div className="flex items-center gap-2 mb-4">

        <CalendarDays className="w-5 h-5 text-agri-400" />

        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>

      </div>

      {!Array.isArray(data) || data.length === 0 ? (

        <p className="text-sm text-slate-500">
          Weather data not available.
        </p>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {data.map((day, index) => (

            <div
              key={index}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4"
            >

              <p className="text-xs font-bold text-agri-400 mb-3">
                {day.date || `Day ${index + 1}`}
              </p>

              <p className="text-sm text-white font-bold mb-3">
                {day.min_temperature_c !== undefined &&
                day.max_temperature_c !== undefined
                  ? `${day.min_temperature_c}°C - ${day.max_temperature_c}°C`
                  : "Temperature N/A"}
              </p>

              <div className="space-y-2 text-xs text-slate-400">

                <div className="flex justify-between">
                  <span>Rain</span>
                  <span className="text-slate-200">
                    {day.precipitation_mm ?? 0} mm
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Rain Chance</span>
                  <span className="text-slate-200">
                    {day.rain_probability_percent ?? 0}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Wind</span>
                  <span className="text-slate-200">
                    {day.max_wind_speed_kmh ?? "N/A"} km/h
                  </span>
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


function ObjectInfo({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
        {title}
      </p>

      {Array.isArray(value) ? (

        <ul className="space-y-2">
          {value.map((item, index) => (
            <li
              key={index}
              className="text-sm text-slate-300 flex gap-2"
            >
              <span className="text-agri-400">•</span>
              <span>
                {typeof item === "object"
                  ? JSON.stringify(item)
                  : item}
              </span>
            </li>
          ))}
        </ul>

      ) : (

        <p className="text-sm text-slate-300 leading-6">
          {value || "Not available"}
        </p>

      )}

    </div>
  );
}


function ActionBlock({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">

      <h3 className="text-sm font-bold text-white mb-3">
        {title}
      </h3>

      {!Array.isArray(value) || value.length === 0 ? (

        <p className="text-sm text-slate-500">
          No information available.
        </p>

      ) : (

        <ul className="space-y-2">

          {value.map((item, index) => (

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

          ))}

        </ul>

      )}

    </div>
  );
}