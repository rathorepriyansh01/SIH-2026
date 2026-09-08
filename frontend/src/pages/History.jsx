import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScanHistory, getScanDetail, SERVER_URL } from '../services/api';
import { History as HistoryIcon, Calendar, Activity, ChevronRight, Image as ImageIcon, Search, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

export default function History() {
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getScanHistory();
      if (data.success) {
        setHistoryList(data.history || []);
      } else {
        setError('Failed to load scan history.');
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = async (scanId) => {
    try {
      const data = await getScanDetail(scanId);
      if (data.success) {
        navigate('/result', { state: { resultData: data } });
      }
    } catch (err) {
      alert('Failed to load full scan details.');
    }
  };

  const filteredHistory = historyList.filter(item =>
    item.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-agri-400" />
            Scan History
          </h1>
          <p className="text-sm text-slate-400">View previous crop diagnostic scans & saved advisory records</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by disease or crop..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-agri-500/50"
          />
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading Scan History Database..." />
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-6 h-6 text-rose-400" />
          <span>{error}</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800">
          <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Scan Records Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            You haven't scanned any crop leaves yet. Upload a leaf image to generate your first scan report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const imgUrl = item.image_path
              ? (item.image_path.startsWith('http') ? item.image_path : `${SERVER_URL}${item.image_path}`)
              : null;
            const isHealthy = item.disease.toLowerCase() === 'healthy';

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video mb-4 border border-slate-800">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.disease}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      isHealthy ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
                    }`}>
                      {item.disease}
                    </span>
                  </div>

                  {/* Crop & Disease Info */}
                  <div className="mb-3">
                    <p className="text-[11px] font-bold text-agri-400 uppercase tracking-widest">{item.crop}</p>
                    <h3 className="text-lg font-bold text-white truncate">{item.disease}</h3>
                  </div>
                </div>

                {/* Card Footer Metrics */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-agri-400" />
                    <span>{item.confidence.toFixed(1)}% Confidence</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-agri-400 transition-colors font-medium">
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4" />
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
