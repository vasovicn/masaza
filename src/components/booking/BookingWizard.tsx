"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import StepService from "./StepService";
import StepDuration from "./StepDuration";
import StepDate from "./StepDate";
import StepTime from "./StepTime";
import StepContact from "./StepContact";
import StepSuccess from "./StepSuccess";
import { addMinutes } from "@/lib/slots";

interface ServiceDuration {
  id: string;
  minutes: number;
  price: number;
  label?: string | null;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  category: { id: string; name: string };
  durations: ServiceDuration[];
}

interface BookingState {
  service: Service | null;
  duration: ServiceDuration | null;
  date: string;
  time: string;
  endTime: string;
  isInquiry: boolean;
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    notes: string;
  } | null;
}

// Steps: 0=service, 1=duration, 2=date, 3=time, 4=contact, 5=success
const STEP_LABELS = ["Usluga", "Trajanje", "Datum", "Vreme", "Podaci", "Potvrda"];

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string; phone?: string } | null>(null);

  const [state, setState] = useState<BookingState>({
    service: null,
    duration: null,
    date: "",
    time: "",
    endTime: "",
    isInquiry: false,
    contact: null,
  });

  useEffect(() => {
    // Load services (only bookable online)
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        const allServices: Service[] = d.services || [];
        const bookable = allServices.filter((s) => s.durations.length > 0);
        setServices(bookable);
        // Pre-select service from query param
        const serviceId = searchParams.get("service");
        if (serviceId) {
          const found = d.services?.find((s: Service) => s.id === serviceId);
          if (found) {
            setState((prev) => ({ ...prev, service: found }));
            if (found.durations.length === 1) {
              setState((prev) => ({ ...prev, service: found, duration: found.durations[0] }));
              setStep(2);
            } else {
              setStep(1);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Load user
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.type === "client") setUser(d.user);
      })
      .catch(() => {});
  }, [searchParams]);

  const handleServiceSelect = (service: Service) => {
    setState((prev) => ({ ...prev, service, duration: null }));
    if (service.durations.length === 1) {
      setState((prev) => ({ ...prev, service, duration: service.durations[0] }));
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const handleDurationSelect = (duration: ServiceDuration) => {
    setState((prev) => ({ ...prev, duration }));
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setState((prev) => ({ ...prev, date, time: "" }));
    setStep(3);
  };

  const handleTimeSelect = (time: string, isInquiry: boolean) => {
    const endTime = state.duration ? addMinutes(time, state.duration.minutes) : "";
    setState((prev) => ({ ...prev, time, endTime, isInquiry }));
    setStep(4);
  };

  const handleContactSubmit = async (contact: BookingState["contact"]) => {
    if (!state.service || !state.duration || !state.date || !state.time || !contact) return;

    setSubmitLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: state.service.id,
          serviceDurationId: state.duration.id,
          date: state.date,
          startTime: state.time,
          customerName: `${contact.firstName} ${contact.lastName}`,
          customerPhone: contact.phone,
          customerEmail: contact.email || undefined,
          notes: contact.notes || undefined,
          ...(state.isInquiry ? { status: "inquiry" } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri kreiranju rezervacije");

      setState((prev) => ({ ...prev, contact }));
      setStep(5);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Greška");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNewBooking = () => {
    setState({
      service: null,
      duration: null,
      date: "",
      time: "",
      endTime: "",
      isInquiry: false,
      contact: null,
    });
    setStep(0);
    setSubmitError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-3 border-[#9dceb1] border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[0, 1, 2, 3, 4].map((s) => {
              const label = STEP_LABELS[s];
              const isCompleted = s < step;
              const isCurrent = s === step;
              const isSkipped = s === 1 && state.service?.durations.length === 1;

              if (isSkipped) return null;

              return (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? "text-white"
                        : isCurrent
                        ? "text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    style={{
                      backgroundColor: isCompleted || isCurrent ? "#9dceb1" : undefined,
                    }}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : s + 1}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${isCurrent ? "font-medium" : "text-gray-400"}`} style={{ color: isCurrent ? "#3a8059" : undefined }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 mt-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                backgroundColor: "#5a9e78",
                width: `${(step / 4) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        {step === 0 && (
          <StepService services={services} onSelect={handleServiceSelect} />
        )}
        {step === 1 && state.service && (
          <StepDuration
            serviceName={state.service.name}
            durations={state.service.durations}
            onSelect={handleDurationSelect}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepDate
            selectedDate={state.date}
            onSelect={handleDateSelect}
            onBack={() => setStep(state.service && state.service.durations.length > 1 ? 1 : 0)}
          />
        )}
        {step === 3 && state.duration && (
          <StepTime
            date={state.date}
            durationId={state.duration.id}
            durationMinutes={state.duration.minutes}
            isToday={state.date === new Date().toISOString().split("T")[0]}
            onSelect={handleTimeSelect}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <>
            {submitError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {submitError}
              </div>
            )}
            <StepContact
              onSubmit={handleContactSubmit}
              onBack={() => setStep(3)}
              loading={submitLoading}
              prefill={user || undefined}
              isInquiry={state.isInquiry}
            />
          </>
        )}
        {step === 5 && state.service && state.duration && state.contact && (
          <StepSuccess
            booking={{
              service: state.service,
              duration: state.duration,
              date: state.date,
              time: state.time,
              endTime: state.endTime,
              contact: state.contact,
            }}
            isLoggedIn={!!user}
            isInquiry={state.isInquiry}
            onNewBooking={handleNewBooking}
          />
        )}
      </div>
    </div>
  );
}
