import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getScanHistory,
  getScanDetail,
  SERVER_URL,
} from "../services/api";

import {
  History as HistoryIcon,
  Activity,
  ChevronRight,
  Image as ImageIcon,
  Search,
  AlertCircle,
} from "lucide-react";

import Loading from "../components/Loading";


export default function History() {

  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();


  // ============================================================
  // FETCH HISTORY
  // ============================================================

  useEffect(() => {
    fetchHistory();
  }, []);


  const fetchHistory = async () => {

    setIsLoading(true);
    setError(null);

    try {

      const data = await getScanHistory();

      console.log("HISTORY API RESPONSE:", data);

      if (data?.success) {

        setHistoryList(
          Array.isArray(data.history)
            ? data.history
            : []
        );

      } else {

        setError("Failed to load scan history.");

      }

    } catch (err) {

      console.error("HISTORY ERROR:", err);

      setError(
        "Could not connect to backend server."
      );

    } finally {

      setIsLoading(false);

    }
  };


  // ============================================================
  // OPEN DETAILS
  // ============================================================

  const handleItemClick = async (scanId) => {

    try {

      console.log(
        "Loading scan details:",
        scanId
      );

      const data = await getScanDetail(scanId);

      console.log(
        "SCAN DETAIL RESPONSE:",
        data
      );

      if (data?.success) {

        navigate("/result", {
          state: {
            resultData: data,
          },
        });

      } else {

        alert("Scan details not found.");

      }

    } catch (err) {

      console.error(
        "DETAIL ERROR:",
        err
      );

      alert(
        "Failed to load full scan details."
      );

    }
  };


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredHistory = historyList.filter(
    (item) => {

      const disease = String(
        item?.disease || ""
      ).toLowerCase();

      const crop = String(
        item?.crop || ""
      ).toLowerCase();

      const query = searchQuery
        .toLowerCase();

      return (
        disease.includes(query) ||
        crop.includes(query)
      );
    }
  );


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">

            <HistoryIcon className="w-8 h-8 text-agri-400" />

            <span>
              Scan History
            </span>

          </h1>

          <p className="text-sm text-slate-400 mt-1">

            View previous crop diagnostic scans & saved advisory records

          </p>

        </div>


        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div className="relative w-full sm:w-72">

          <Search
            className="
              w-4 h-4
              text-slate-400
              absolute
              left-3.5
              top-3.5
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search by disease or crop..."
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              rounded-xl
              bg-slate-900
              border
              border-slate-800
              text-sm
              text-slate-200
              placeholder-slate-500
              focus:outline-none
              focus:border-agri-500/50
            "
          />

        </div>

      </div>


      {/* ======================================================
          LOADING
      ====================================================== */}

      {isLoading && (

        <Loading
          message="Loading Scan History Database..."
        />

      )}


      {/* ======================================================
          ERROR
      ====================================================== */}

      {!isLoading && error && (

        <div
          className="
            p-6
            rounded-2xl
            bg-rose-500/10
            border
            border-rose-500/30
            text-rose-300
            flex
            items-center
            gap-3
            text-sm
          "
        >

          <AlertCircle
            className="w-6 h-6 text-rose-400"
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ======================================================
          EMPTY
      ====================================================== */}

      {!isLoading &&
        !error &&
        filteredHistory.length === 0 && (

          <div
            className="
              text-center
              py-16
              glass-panel
              rounded-3xl
              border
              border-slate-800
            "
          >

            <ImageIcon
              className="
                w-12
                h-12
                text-slate-700
                mx-auto
                mb-3
              "
            />

            <h3
              className="
                text-lg
                font-bold
                text-white
                mb-1
              "
            >
              No Scan Records Found
            </h3>

            <p
              className="
                text-sm
                text-slate-400
                max-w-sm
                mx-auto
                mb-6
              "
            >
              You haven't scanned any crop leaves yet.
              Upload a leaf image to generate your first
              scan report.
            </p>

          </div>

        )}


      {/* ======================================================
          HISTORY CARDS
      ====================================================== */}

      {!isLoading &&
        !error &&
        filteredHistory.length > 0 && (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            {filteredHistory.map((item) => {

              const disease =
                item?.disease || "Unknown Disease";

              const crop =
                item?.crop || "Unknown Crop";

              const confidence =
                Number(item?.confidence || 0);

              const imagePath =
                item?.image_path || "";

              const imgUrl =
                imagePath.startsWith("http")
                  ? imagePath
                  : `${SERVER_URL}${imagePath}`;


              const isHealthy =
                disease.toLowerCase() === "healthy";


              return (

                <div
                  key={item.id}
                  onClick={() =>
                    handleItemClick(item.id)
                  }
                  className="
                    glass-panel
                    p-5
                    rounded-2xl
                    border
                    border-slate-800
                    glass-panel-hover
                    cursor-pointer
                    flex
                    flex-col
                    justify-between
                    group
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div>

                    <div
                      className="
                        relative
                        rounded-xl
                        overflow-hidden
                        bg-slate-950
                        aspect-video
                        mb-4
                        border
                        border-slate-800
                      "
                    >

                      {imagePath ? (

                        <img
                          src={imgUrl}
                          alt={disease}
                          className="
                            w-full
                            h-full
                            object-cover
                            group-hover:scale-105
                            transition-transform
                            duration-300
                          "
                          onError={(e) => {

                            console.error(
                              "IMAGE LOAD ERROR:",
                              imgUrl
                            );

                            e.currentTarget.style.display =
                              "none";

                          }}
                        />

                      ) : (

                        <div
                          className="
                            w-full
                            h-full
                            flex
                            items-center
                            justify-center
                            text-slate-700
                          "
                        >

                          <ImageIcon
                            className="w-8 h-8"
                          />

                        </div>

                      )}


                      {/* Disease Badge */}

                      <span
                        className={`
                          absolute
                          top-2.5
                          right-2.5
                          px-2.5
                          py-1
                          rounded-lg
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          backdrop-blur-md
                          ${
                            isHealthy
                              ? "bg-emerald-500/80 text-white"
                              : "bg-amber-500/80 text-white"
                          }
                        `}
                      >

                        {disease}

                      </span>

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="mb-3">

                      <p
                        className="
                          text-[11px]
                          font-bold
                          text-agri-400
                          uppercase
                          tracking-widest
                          mb-1
                        "
                      >
                        {crop}
                      </p>


                      <h3
                        className="
                          text-lg
                          font-bold
                          text-white
                          truncate
                        "
                        title={disease}
                      >
                        {disease}
                      </h3>


                      {/* Risk */}

                      {item?.risk_level && (

                        <p
                          className="
                            text-xs
                            text-slate-400
                            mt-1
                          "
                        >
                          Risk:{" "}
                          <span className="text-slate-300">
                            {item.risk_level}
                          </span>
                        </p>

                      )}

                    </div>

                  </div>


                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <div
                    className="
                      pt-3
                      border-t
                      border-slate-800/80
                      flex
                      items-center
                      justify-between
                      text-xs
                      text-slate-400
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        font-semibold
                        text-slate-300
                      "
                    >

                      <Activity
                        className="
                          w-3.5
                          h-3.5
                          text-agri-400
                        "
                      />

                      <span>
                        {confidence.toFixed(1)}%
                        {" "}
                        Confidence
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        text-slate-400
                        group-hover:text-agri-400
                        transition-colors
                        font-medium
                      "
                    >

                      <span>
                        Details
                      </span>

                      <ChevronRight
                        className="w-4 h-4"
                      />

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

    </div>

  );

}