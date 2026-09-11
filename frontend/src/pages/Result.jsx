import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
  Activity,
  ShieldCheck,
  Eye,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { SERVER_URL } from "../services/api";
import { useLanguage } from "../i18n/LanguageContext";

export default function Result() {
  const { t, language } = useLanguage();

  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state?.resultData;
  const passedImageUrl = location.state?.imageUrl;

  /*
   * Safe translation helper.
   * Agar koi key missing ho to blank/undefined screen nahi hogi.
   */
  const tr = (key, fallback) => {
    try {
      const value = key
        .split(".")
        .reduce((obj, part) => obj?.[part], t);

      return value || fallback;
    } catch {
      return fallback;
    }
  };

  // =====================================================
  // NO RESULT
  // =====================================================

  if (!resultData) {
    return (
      <div className="max-w-md mx-auto my-16 text-center glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">

        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />

        <h2 className="text-xl font-bold text-white">
          {tr(
            "result.noResult",
            "No Result Data Available"
          )}
        </h2>

        <p className="text-sm text-slate-400">
          {language === "hi"
            ? "कृपया पहले स्कैन पेज से एक इमेज अपलोड करें।"
            : "Please upload an image from the Scan page first."}
        </p>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agri-500 text-slate-950 font-bold text-sm"
        >
          {language === "hi"
            ? "स्कैन पेज पर जाएँ"
            : "Go to Scan Page"}
        </Link>

      </div>
    );
  }

  // =====================================================
  // SUPPORT BOTH API RESPONSE FORMATS
  // =====================================================

  const detection = resultData.detection || {};
  const prediction = resultData.prediction || {};

  const advisory = resultData.advisory || {};

  // =====================================================
  // DISEASE
  // =====================================================

  const disease =
    detection.disease ||
    prediction.disease ||
    "Unknown Disease";

  // =====================================================
  // CONFIDENCE
  // =====================================================

  const confidence = Number(
    detection.confidence ??
      prediction.confidence ??
      0
  );

  // =====================================================
  // TOP PREDICTIONS
  // =====================================================

  const topPredictions =
    detection.top_predictions || [];

  // =====================================================
  // RISK
  // =====================================================

  const riskLevel =
    advisory.risk_level ||
    prediction.risk_level ||
    "Unknown";

  // =====================================================
  // SEVERITY
  // =====================================================

  const severity =
    advisory.severity ||
    prediction.severity ||
    "Unknown";

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary =
    advisory.summary ||
    resultData.disease_information?.description ||
    (language === "hi"
      ? "AI सलाह वर्तमान में उपलब्ध नहीं है।"
      : "AI advisory information is currently unavailable.");

  // =====================================================
  // IMMEDIATE ACTIONS
  // =====================================================

  const immediateActions =
    Array.isArray(advisory.immediate_actions)
      ? advisory.immediate_actions
      : Array.isArray(
          resultData.recommended_actions
            ?.immediate_actions
        )
      ? resultData.recommended_actions
          .immediate_actions
      : [];

  // =====================================================
  // PREVENTION
  // =====================================================

  const preventionTips =
    Array.isArray(advisory.prevention_tips)
      ? advisory.prevention_tips
      : Array.isArray(
          resultData.recommended_actions
            ?.prevention
        )
      ? resultData.recommended_actions.prevention
      : [];

  // =====================================================
  // MONITORING
  // =====================================================

  const monitoringAdvice =
    advisory.monitoring_advice ||
    (language === "hi"
      ? "फसल की नियमित रूप से निगरानी करते रहें।"
      : "Continue monitoring the crop regularly.");

  // =====================================================
  // EXPERT CONSULTATION
  // =====================================================

  const expertConsultationRequired =
    advisory.expert_consultation_required === true;

  // =====================================================
  // CONFIDENCE NOTE
  // =====================================================

  const confidenceNote =
    advisory.confidence_note ||
    (language === "hi"
      ? `ML मॉडल की भविष्यवाणी की विश्वसनीयता ${confidence.toFixed(
          2
        )}% है।`
      : `The ML model prediction confidence is ${confidence.toFixed(
          2
        )}%.`);

  // =====================================================
  // CONTEXT
  // =====================================================

  const context =
    resultData.context || {};

  const weather =
    context.weather || {};

  const farmLocation =
    context.location || {};

  const farm =
    context.farm || {};

  // =====================================================
  // HISTORY METADATA
  // =====================================================

  const historyMetadata =
    resultData.scan_metadata || {};

  // =====================================================
  // IMAGE URL
  // =====================================================

  const historyImagePath =
    historyMetadata.image_path;

  let imageUrl =
    passedImageUrl || null;

  if (!imageUrl && historyImagePath) {
    imageUrl =
      historyImagePath.startsWith("http")
        ? historyImagePath
        : `${SERVER_URL}${historyImagePath}`;
  }

  // =====================================================
  // CLEAN DISEASE NAME
  // =====================================================

  const cleanDiseaseName = (name) => {
    if (!name) {
      return "Unknown Disease";
    }

    return String(name)
      .replace("Tomato___", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const diseaseName =
    cleanDiseaseName(disease);

  // =====================================================
  // HINDI DISEASE NAME
  // =====================================================

  const getDiseaseName = () => {
    if (language !== "hi") {
      return diseaseName;
    }

    const diseaseLower =
      diseaseName.toLowerCase();

    const diseaseMap = {
      healthy: "स्वस्थ",
      "early blight": "अगेती झुलसा",
      "late blight": "पछेती झुलसा",
      "leaf mold": "पत्ती फफूंदी",
      "septoria leaf spot":
        "सेप्टोरिया पत्ती धब्बा",
    };

    return (
      diseaseMap[diseaseLower] ||
      diseaseName
    );
  };

  const displayDiseaseName =
    getDiseaseName();

  // =====================================================
  // CONFIDENCE STATUS
  // =====================================================

  let confidenceStatus = "Low";

  if (confidence >= 80) {
    confidenceStatus = "High";
  } else if (confidence >= 60) {
    confidenceStatus = "Medium";
  }

  const confidenceStatusText =
    language === "hi"
      ? confidenceStatus === "High"
        ? "उच्च"
        : confidenceStatus === "Medium"
        ? "मध्यम"
        : "कम"
      : confidenceStatus;

  // =====================================================
  // RISK DISPLAY
  // =====================================================

  const getRiskText = () => {
    if (language !== "hi") {
      return riskLevel;
    }

    const value =
      String(riskLevel).toLowerCase();

    if (value === "high") return "उच्च";
    if (value === "medium") return "मध्यम";
    if (value === "moderate") return "मध्यम";
    if (value === "low") return "कम";
    if (value === "none") return "कोई जोखिम नहीं";

    return riskLevel;
  };

  const displayRisk =
    getRiskText();

  // =====================================================
  // SEVERITY DISPLAY
  // =====================================================

  const getSeverityText = () => {
    if (language !== "hi") {
      return severity;
    }

    const value =
      String(severity).toLowerCase();

    if (value === "high") return "उच्च";
    if (value === "medium") return "मध्यम";
    if (value === "moderate") return "मध्यम";
    if (value === "low") return "कम";
    if (value === "unknown") return "अज्ञात";

    return severity;
  };

  const displaySeverity =
    getSeverityText();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between">

        <button
          onClick={() => navigate("/scan")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />

          {language === "hi"
            ? "दूसरी फसल स्कैन करें"
            : "Scan Another Leaf"}
        </button>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-agri-400 hover:bg-slate-800"
        >
          <RefreshCw className="w-4 h-4" />

          {language === "hi"
            ? "नया स्कैन"
            : "New Scan"}
        </Link>

      </div>

      {/* =================================================
          CONFIDENCE WARNING
      ================================================= */}

      {confidence < 70 && (

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">

          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />

          <div>

            <h4 className="text-sm font-bold text-amber-300">
              {language === "hi"
                ? "सत्यापन की सलाह"
                : "Verification Recommended"}
            </h4>

            <p className="text-sm text-amber-200/80 mt-1">

              {language === "hi"
                ? `मॉडल की विश्वसनीयता ${confidence.toFixed(
                    2
                  )}% है। कोई बड़ा उपचार निर्णय लेने से पहले लक्षणों की पुष्टि कृषि विशेषज्ञ से करें या अधिक स्पष्ट पत्ती की इमेज अपलोड करें।`
                : `The model confidence is ${confidence.toFixed(
                    2
                  )}%. Please verify the symptoms with an agricultural expert or upload a clearer leaf image before taking major treatment decisions.`}

            </p>

          </div>

        </div>

      )}

      {/* =================================================
          MAIN RESULT
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* IMAGE */}

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">

          <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-square flex items-center justify-center border border-slate-800">

            {imageUrl ? (

              <img
                src={imageUrl}
                alt={
                  language === "hi"
                    ? "स्कैन की गई टमाटर की पत्ती"
                    : "Scanned tomato leaf"
                }
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            ) : (

              <ImageIcon className="w-16 h-16 text-slate-700" />

            )}

          </div>

          <p className="text-xs text-slate-400 mt-4">
            {language === "hi"
              ? "AI फसल रोग विश्लेषण"
              : "AI Crop Disease Analysis"}
          </p>

        </div>

        {/* PREDICTION */}

        <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-agri-500/10">

              <Activity className="w-6 h-6 text-agri-400" />

            </div>

            <div>

              <p className="text-sm text-slate-400">
                {language === "hi"
                  ? "AI द्वारा पहचान"
                  : "AI DETECTED"}
              </p>

              <h1 className="text-3xl font-bold text-white">
                {displayDiseaseName}
              </h1>

            </div>

          </div>

          {/* CONFIDENCE */}

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">

            <div className="flex justify-between mb-3">

              <span className="text-slate-400">
                {language === "hi"
                  ? "भविष्यवाणी की विश्वसनीयता"
                  : "Prediction Confidence"}
              </span>

              <span className="text-agri-400 font-bold">
                {confidence.toFixed(2)}%
              </span>

            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">

              <div
                className="bg-agri-500 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(
                      confidence,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

            <p className="text-xs text-slate-500 mt-3">

              {language === "hi"
                ? "विश्वसनीयता स्तर:"
                : "Confidence Level:"}

              {" "}

              <span className="text-slate-300 font-semibold">
                {confidenceStatusText}
              </span>

            </p>

          </div>

          {/* RISK + SEVERITY */}

          <div className="grid grid-cols-2 gap-4 mt-5">

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">

              <p className="text-xs text-slate-500 uppercase">
                {language === "hi"
                  ? "जोखिम स्तर"
                  : "Risk Level"}
              </p>

              <p className="text-lg font-bold text-amber-400 mt-1">
                {displayRisk}
              </p>

            </div>

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">

              <p className="text-xs text-slate-500 uppercase">
                {language === "hi"
                  ? "गंभीरता"
                  : "Severity"}
              </p>

              <p className="text-lg font-bold text-white mt-1">
                {displaySeverity}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          ENVIRONMENT & FARM CONTEXT
      ================================================= */}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 rounded-xl bg-blue-500/10">

            <Activity className="w-6 h-6 text-blue-400" />

          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              {language === "hi"
                ? "खेत और पर्यावरण की जानकारी"
                : "Farm & Environmental Context"}
            </h2>

            <p className="text-xs text-slate-500">
              {language === "hi"
                ? "AI सलाह के लिए उपयोग की गई जानकारी"
                : "Information used for AI advisory"}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* WEATHER */}

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">

            <h3 className="font-bold text-white mb-4">
              🌦️{" "}
              {language === "hi"
                ? "वर्तमान मौसम"
                : "Current Weather"}
            </h3>

            <div className="space-y-3 text-sm">

              <p className="text-slate-400">
                {language === "hi"
                  ? "तापमान:"
                  : "Temperature:"}

                <span className="text-white font-semibold ml-2">
                  {weather.temperature_c ?? "N/A"} °C
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "नमी:"
                  : "Humidity:"}

                <span className="text-white font-semibold ml-2">
                  {weather.humidity_percent ?? "N/A"}%
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "वर्षा:"
                  : "Rain:"}

                <span className="text-white font-semibold ml-2">
                  {weather.rain_mm ?? "N/A"} mm
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "हवा की गति:"
                  : "Wind Speed:"}

                <span className="text-white font-semibold ml-2">
                  {weather.wind_speed_kmh ?? "N/A"} km/h
                </span>
              </p>

            </div>

          </div>

          {/* LOCATION */}

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">

            <h3 className="font-bold text-white mb-4">
              📍{" "}
              {language === "hi"
                ? "खेत का स्थान"
                : "Farm Location"}
            </h3>

            <div className="space-y-3 text-sm">

              <p className="text-slate-400">
                {language === "hi"
                  ? "अक्षांश:"
                  : "Latitude:"}

                <span className="text-white font-semibold ml-2">
                  {farmLocation.latitude ?? "N/A"}
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "देशांतर:"
                  : "Longitude:"}

                <span className="text-white font-semibold ml-2">
                  {farmLocation.longitude ?? "N/A"}
                </span>
              </p>

              {farmLocation.city && (

                <p className="text-slate-400">

                  {language === "hi"
                    ? "शहर:"
                    : "City:"}

                  <span className="text-white font-semibold ml-2">
                    {farmLocation.city}
                  </span>

                </p>

              )}

              {farmLocation.district && (

                <p className="text-slate-400">

                  {language === "hi"
                    ? "जिला:"
                    : "District:"}

                  <span className="text-white font-semibold ml-2">
                    {farmLocation.district}
                  </span>

                </p>

              )}

              {farmLocation.state && (

                <p className="text-slate-400">

                  {language === "hi"
                    ? "राज्य:"
                    : "State:"}

                  <span className="text-white font-semibold ml-2">
                    {farmLocation.state}
                  </span>

                </p>

              )}

            </div>

          </div>

          {/* FARM */}

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">

            <h3 className="font-bold text-white mb-4">
              🌱{" "}
              {language === "hi"
                ? "खेत की जानकारी"
                : "Farm Information"}
            </h3>

            <div className="space-y-3 text-sm">

              <p className="text-slate-400">
                {language === "hi"
                  ? "क्षेत्रफल:"
                  : "Area:"}

                <span className="text-white font-semibold ml-2">
                  {farm.area_acres ?? "N/A"}{" "}
                  {language === "hi"
                    ? "एकड़"
                    : "acres"}
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "फसल की आयु:"
                  : "Crop Age:"}

                <span className="text-white font-semibold ml-2">
                  {farm.crop_age_days ?? "N/A"}{" "}
                  {language === "hi"
                    ? "दिन"
                    : "days"}
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "विकास अवस्था:"
                  : "Growth Stage:"}

                <span className="text-white font-semibold ml-2">
                  {farm.growth_stage ?? "N/A"}
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "सिंचाई:"
                  : "Irrigation:"}

                <span className="text-white font-semibold ml-2">
                  {farm.irrigation_method ?? "N/A"}
                </span>
              </p>

              <p className="text-slate-400">
                {language === "hi"
                  ? "पिछला रोग:"
                  : "Previous Disease:"}

                <span className="text-white font-semibold ml-2">
                  {farm.previous_disease
                    ? language === "hi"
                      ? "हाँ"
                      : "Yes"
                    : language === "hi"
                    ? "नहीं"
                    : "No"}
                </span>
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          AI SUMMARY
      ================================================= */}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">

        <div className="flex items-center gap-3 mb-5">

          <div className="p-3 rounded-xl bg-purple-500/10">

            <Sparkles className="w-6 h-6 text-purple-400" />

          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              {language === "hi"
                ? "AI सलाह"
                : "AI Advisory"}
            </h2>

            <p className="text-xs text-slate-500">
              {language === "hi"
                ? "ML भविष्यवाणी और AI विश्लेषण से तैयार"
                : "Generated using ML prediction + AI reasoning"}
            </p>

          </div>

        </div>

        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">

          <p className="text-sm leading-7 text-slate-300">
            {summary}
          </p>

        </div>

      </div>

      {/* =================================================
          ACTION PLAN
      ================================================= */}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">

        <h2 className="text-2xl font-bold text-white mb-6">
          {language === "hi"
            ? "फसल कार्य योजना"
            : "Crop Action Plan"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* IMMEDIATE ACTIONS */}

          <div>

            <div className="flex items-center gap-2 mb-4">

              <CheckCircle className="w-5 h-5 text-agri-400" />

              <h3 className="font-bold text-agri-400">
                {language === "hi"
                  ? "तुरंत किए जाने वाले कार्य"
                  : "Immediate Actions"}
              </h3>

            </div>

            <div className="space-y-4">

              {immediateActions.length > 0 ? (

                immediateActions.map(
                  (action, index) => (

                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-300"
                    >

                      <CheckCircle className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />

                      <span>
                        {action}
                      </span>

                    </div>

                  )
                )

              ) : (

                <p className="text-sm text-slate-500">
                  {language === "hi"
                    ? "कोई तत्काल कार्य उपलब्ध नहीं है।"
                    : "No immediate actions available."}
                </p>

              )}

            </div>

          </div>

          {/* PREVENTION */}

          <div>

            <div className="flex items-center gap-2 mb-4">

              <ShieldCheck className="w-5 h-5 text-agri-400" />

              <h3 className="font-bold text-agri-400">
                {language === "hi"
                  ? "बचाव के उपाय"
                  : "Prevention Tips"}
              </h3>

            </div>

            <div className="space-y-4">

              {preventionTips.length > 0 ? (

                preventionTips.map(
                  (tip, index) => (

                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-300"
                    >

                      <ShieldCheck className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />

                      <span>
                        {tip}
                      </span>

                    </div>

                  )
                )

              ) : (

                <p className="text-sm text-slate-500">
                  {language === "hi"
                    ? "कोई बचाव उपाय उपलब्ध नहीं है।"
                    : "No prevention tips available."}
                </p>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          MONITORING
      ================================================= */}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">

        <div className="flex items-center gap-3 mb-4">

          <div className="p-3 rounded-xl bg-blue-500/10">

            <Eye className="w-6 h-6 text-blue-400" />

          </div>

          <h2 className="text-xl font-bold text-white">
            {language === "hi"
              ? "निगरानी संबंधी सलाह"
              : "Monitoring Advice"}
          </h2>

        </div>

        <p className="text-sm leading-7 text-slate-300">
          {monitoringAdvice}
        </p>

      </div>

      {/* =================================================
          CONFIDENCE NOTE
      ================================================= */}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">

        <div className="flex items-start gap-4">

          <Activity className="w-6 h-6 text-agri-400 shrink-0" />

          <div>

            <h3 className="font-bold text-white mb-2">
              {language === "hi"
                ? "मॉडल विश्वसनीयता जानकारी"
                : "Model Confidence Note"}
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              {confidenceNote}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          EXPERT CONSULTATION
      ================================================= */}

      {expertConsultationRequired && (

        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30">

          <div className="flex items-start gap-4">

            <Stethoscope className="w-7 h-7 text-amber-400 shrink-0" />

            <div>

              <h3 className="font-bold text-amber-300">
                {language === "hi"
                  ? "विशेषज्ञ से परामर्श की सलाह"
                  : "Expert Consultation Recommended"}
              </h3>

              <p className="text-sm text-amber-200/80 mt-2 leading-6">

                {language === "hi"
                  ? "उपचार करने से पहले स्थानीय कृषि विशेषज्ञ, कृषि वैज्ञानिक या विस्तार अधिकारी से निदान की पुष्टि करने पर विचार करें।"
                  : "Consider confirming the diagnosis with a local agricultural expert, agronomist, or extension officer before applying treatment."}

              </p>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          DISCLAIMER
      ================================================= */}

      <div className="text-center pb-6">

        <p className="text-xs text-slate-600 max-w-2xl mx-auto">

          {language === "hi"
            ? "यह AI द्वारा तैयार सलाह केवल निर्णय लेने में सहायता के लिए है और पेशेवर कृषि निदान का विकल्प नहीं है। फसल उपचार के लिए हमेशा स्थानीय रूप से स्वीकृत उत्पाद निर्देशों और विशेषज्ञ की सलाह का पालन करें।"
            : "This AI-generated advisory is intended for decision support and does not replace professional agricultural diagnosis. Always follow locally approved product labels and expert recommendations for crop treatment."}

        </p>

      </div>

    </div>
  );
}