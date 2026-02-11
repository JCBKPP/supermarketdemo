
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  Sun,
  Camera,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { STAFF_USER, MOCK_ATTENDANCE } from '../constants.tsx';

const StaffHome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockToggle = () => {
    setIsClockedIn(!isClockedIn);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Welcome Header */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="relative">
          <img src={STAFF_USER.avatar} alt="Me" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl" />
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white">
            <Sun size={20} />
          </div>
        </div>
        <div className="text-center md:text-left space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-slate-800">Hi, {STAFF_USER.fullName}! 👋</h1>
          <p className="text-slate-500 font-medium">You have a Morning Shift today at <span className="text-blue-600">Produce Section</span>.</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
              <Calendar size={14} />
              Shift: 09:00 - 17:00
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 rounded-full text-xs font-semibold text-blue-600">
              <MapPin size={14} />
              Main Street Branch
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clock In/Out Widget */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-8 relative overflow-hidden">
          {showConfirmation && (
            <div className="absolute inset-0 bg-green-600 z-50 animate-in zoom-in duration-300 flex flex-col items-center justify-center text-white p-6">
              <CheckCircle2 size={64} className="mb-4" />
              <h3 className="text-2xl font-bold">Successfully {isClockedIn ? 'Clocked In' : 'Clocked Out'}!</h3>
              <p className="opacity-90 mt-2">Have a great session!</p>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <p className="text-slate-400 font-medium">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="w-full space-y-6">
            <button 
              onClick={handleClockToggle}
              className={`w-full py-6 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isClockedIn 
                ? 'bg-red-500 text-white shadow-red-200 hover:bg-red-600' 
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              <Clock size={28} />
              {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
            </button>
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1"><Camera size={12} /> Photo verification required</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> Within zone</span>
            </div>
          </div>

          <div className="w-full pt-8 border-t border-slate-100 flex justify-between">
            <div className="text-left">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Today's Hours</p>
              <p className="text-lg font-bold text-slate-800">{isClockedIn ? 'Working...' : '0.0h'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Weekly Total</p>
              <p className="text-lg font-bold text-slate-800">38.5h</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 space-y-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <CalendarDays size={24} />
              </div>
              <span className="text-sm font-medium opacity-80">Next 7 Days</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold">4 Shifts</h3>
              <p className="text-indigo-100 font-medium mt-1">Scheduled for this week</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold bg-white text-indigo-700 px-4 py-2 rounded-xl self-start">
              View Schedule <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
             <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <Briefcase size={24} className="text-slate-600" />
              </div>
              <span className="text-sm font-bold text-slate-400">Leave Balance</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-600">Annual Leave</span>
                  <span className="text-slate-800">12 / 18 Days</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[66%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-600">Sick Leave</span>
                  <span className="text-slate-800">4 / 7 Days</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[57%]"></div>
                </div>
              </div>
            </div>
            <button className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Request New Leave</button>
          </div>

          {/* Recent Attendance */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
              Recent Attendance
              <button className="text-xs text-blue-600 font-bold hover:underline">View History</button>
            </h3>
            <div className="space-y-4">
              {MOCK_ATTENDANCE.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center font-black text-slate-800 leading-none">
                      <span className="text-[10px] uppercase text-slate-400">{record.date.split('-')[1]}</span>
                      {record.date.split('-')[2]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{record.clockIn} - {record.clockOut}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{record.location}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffHome;
