"use client";
import React, { useState, useEffect } from "react";
import {
  Globe,
  Users,
  User,
  Building2,
  MapPin,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

type AudienceType = "public" | "followers" | "following";

interface AudienceConfig {
  type: AudienceType;
  state?: string;
  city?: string;
  zipCode?: string;
}

interface AudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: (config: AudienceConfig) => void;
  initialConfig?: AudienceConfig;
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const AUDIENCE_OPTIONS = [
  {
    value: "public" as AudienceType,
    label: "Public",
    description: "Anyone on or off Homeiz",
    icon: Globe,
  },
  {
    value: "followers" as AudienceType,
    label: "Accounts following you",
    description: "Only your followers can see",
    icon: Users,
  },
  {
    value: "following" as AudienceType,
    label: "Accounts you follow",
    description: "Only people you follow can see",
    icon: User,
  },
];
export function AudienceModal({
  isOpen,
  onClose,
  onDone,
  initialConfig,
}: AudienceModalProps) {
  const [selected, setSelected] = useState<AudienceType>(
    initialConfig?.type ?? "public",
  );
  const [state, setState] = useState(initialConfig?.state ?? "");
  const [city, setCity] = useState(initialConfig?.city ?? "");
  const [zipCode, setZipCode] = useState(initialConfig?.zipCode ?? "");
  const [stateOpen, setStateOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDone = () => {
    if (!isFormValid) return;

    onDone({ type: selected, state, city, zipCode });
    onClose();
  };

  const isFormValid =
    selected &&
    state.trim() !== "" &&
    city.trim() !== "" &&
    zipCode.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(2px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            Select Audience
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-text-primary md:text-text-secondary hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-2">
          {/* Audience options */}
          {AUDIENCE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-md border transition-all text-left group ${
                selected === value
                  ? "border-sky-green bg-sky-green"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-text-primary  `}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold text-text-primary`}>
                  {label}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 truncate">
                  {description}
                </p>
              </div>
              {selected === value && (
                <Check size={16} className="text-sky-500 shrink-0" />
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="pt-2 pb-1">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-text-primary shrink-0" />
              <span className="text-sm font-semibold uppercase tracking-widest text-text-primary">
                Location Based
              </span>
            </div>
          </div>

          {/* State Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary px-1">
              <Building2 size={13} className="text-text-primary" />
              State
            </label>
            <div className="relative">
              <button
                onClick={() => setStateOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg  bg-gray-100 text-sm font-semibold text-left hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span
                  className={
                    state ? "text-text-primary" : "text-text-secondary"
                  }
                >
                  {state || "Select state"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-text-primary transition-transform ${stateOpen ? "rotate-180" : ""}`}
                />
              </button>

              {stateOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {US_STATES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setState(s);
                        setStateOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        state === s
                          ? "bg-sky-50 text-text-primary font-semibold"
                          : "text-text-primary font-semibold"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary px-1">
              <MapPin size={13} className="text-text-primary " />
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full px-3 py-2.5 rounded-lg  bg-gray-100 text-sm text-text-primary placeholder-text-secondary font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Zip Code */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-primary"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Zip code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter Zip code"
              maxLength={10}
              className="w-full px-3 py-2.5 rounded-lg  bg-gray-100 text-sm text-gray-800 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Done button */}
        <div className="px-5 pb-6 pt-2">
          <button
            onClick={handleDone}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors active:scale-[0.98] ${
              isFormValid
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
