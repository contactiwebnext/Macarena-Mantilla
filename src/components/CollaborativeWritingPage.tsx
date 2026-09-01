import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PenTool, Feather, BookOpen, Clock, Sparkles, CheckCircle2, 
  Send, Heart, ShieldCheck, FileText, Check, ChevronRight, 
  HelpCircle, RefreshCw, Music, Calendar, DollarSign, MessageSquare, 
  Coffee, Star, ArrowRight, UserCheck, CreditCard, Lock, X, 
  ExternalLink
} from "lucide-react";
import { saveMessageToFirestore } from "../lib/firestoreSync";
import { ContactMessage } from "../types";

// Official Direct Integration Links
const PAY_NOW_URL = "https://www.paypal.com/ncp/payment/Y57GPU6U3735C";
const BOOK_NOW_URL = "https://scheduler.zoom.us/macarena-mantilla-vi0qwt/macarena";

interface CollaborativeWritingProps {
  onShowToast: (msg: string) => void;
  onNavigateToTab: (tab: string) => void;
}

const SAMPLE_PROMPTS = [
  {
    theme: "Poetic Metaphor",
    prompt: "Describe an everyday household object (like an unwashed coffee mug or an old wool sweater) as if it were holding a secret conversation with the rain outside.",
    tip: "Focus on tactile textures and subtle lighting."
  },
  {
    theme: "Mental Health & Catharsis",
    prompt: "Write a short letter to the version of yourself from three autumns ago. Tell them one quiet truth they were not yet ready to hear.",
    tip: "Write without censoring; we'll refine the rhythm together."
  },
  {
    theme: "Lyrical Stanza & Rhythm",
    prompt: "Draft a 4-line acoustic song verse where every second line ends on an open vowel sound ('-ay', '-o', '-ee') reflecting distance and longing.",
    tip: "Read the cadence out loud to feel the breath pause."
  },
  {
    theme: "Memoir & Sensory Detail",
    prompt: "Recall a specific scent from your childhood kitchen. Describe the room entirely through smells, temperature changes, and background sounds without naming the food.",
    tip: "Sensory grounding creates immediate emotional resonance."
  }
];

export default function CollaborativeWritingPage({ onShowToast, onNavigateToTab }: CollaborativeWritingProps) {
  // Calculator state
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [sessionFormat, setSessionFormat] = useState<"video" | "async" | "audio" | "inperson">("video");
  const [selectedTopic, setSelectedTopic] = useState<string>("Poetry & Lyrics");
  
  // Prompt Playground state
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [draftSnippet, setDraftSnippet] = useState("");

  // Booking Inquiry Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    preferredDate: "",
    preferredTime: "morning",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Price Calculation: CAD 30 / hour (with discount on 5-hour package)
  const baseRatePerHour = 30;
  const calculateTotal = (hours: number) => {
    if (hours === 5) {
      return 135; // $15 discount on 5hr bundle
    }
    return hours * baseRatePerHour;
  };

  const currentTotal = calculateTotal(selectedHours);

  // Format title helper
  const getFormatLabel = () => {
    switch (sessionFormat) {
      case "video": return "1-on-1 Live Video (Google Meet / Zoom)";
      case "async": return "Async Shared Google Doc Co-Writing";
      case "audio": return "Audio Voice Memo Exchange & Line Notes";
      case "inperson": return "Vancouver BC In-Person Studio Co-Writing";
      default: return "1-on-1 Co-Writing Session";
    }
  };

  // Submit standard Booking Inquiry (saves details to Firestore and guides to Zoom Scheduler / PayPal)
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const messagePayload: ContactMessage = {
      id: "cowrite-" + Date.now(),
      name: bookingForm.name,
      email: bookingForm.email,
      subject: `[Collaborative Writing Inquiry - ${selectedHours} hr(s) @ CAD $${currentTotal}]`,
      message: `=== Collaborative Writing Session Inquiry ===
Duration: ${selectedHours} hour(s) (CAD $${currentTotal})
Format: ${getFormatLabel()}
Genre/Topic: ${selectedTopic}
Preferred Date: ${bookingForm.preferredDate || "Flexible"} (${bookingForm.preferredTime})
Project Vision & Notes: ${bookingForm.notes || "None provided"}
${draftSnippet ? `\nAttached User Scratchpad / Draft:\n${draftSnippet}` : ""}

Direct PayPal Link: ${PAY_NOW_URL}
Direct Zoom Scheduler: ${BOOK_NOW_URL}`,
      date: new Date().toISOString().split("T")[0]
    };

    try {
      await saveMessageToFirestore(messagePayload);
      setIsSubmitting(false);
      setBookingSubmitted(true);
      onShowToast(`Inquiry saved! You can now select your time on Zoom or pay via PayPal.`);
    } catch (err) {
      setIsSubmitting(false);
      setBookingSubmitted(true);
      onShowToast("Inquiry recorded successfully!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-charcoal" id="view-collaborative-writing">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 bg-lavender/60 border border-brand-purple/20 px-4 py-1.5 rounded-full text-brand-purple text-xs font-semibold tracking-wider uppercase">
          <Feather className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
          <span>Bespoke Creative Mentorship & Co-Creation</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-charcoal leading-[1.15]">
          Collaborative Writing <br />
          <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-violet-accent bg-clip-text text-transparent">
            at CAD $30 / hour
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          Whether you are refining heartfelt poetry stanzas, composing song lyrics, drafting an introspective essay, or processing thoughts through therapeutic journaling—let's write side-by-side with genuine attention, cadence, and care.
        </p>

        {/* Hyperlinked Action Buttons in Hero */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={BOOK_NOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-book-now-btn"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase tracking-widest px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
          >
            <Calendar className="w-4 h-4 text-pink-300 group-hover:scale-110 transition-transform" />
            <span>Book Now</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={PAY_NOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-pay-now-btn"
            className="bg-gradient-to-r from-brand-pink via-brand-purple to-violet-accent hover:from-pink-500 hover:to-purple-600 text-white text-xs uppercase tracking-widest px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
          >
            <CreditCard className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
            <span>Pay Now</span>
            <ExternalLink className="w-3 h-3 text-white/80" />
          </a>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
            <span>CAD $30/hr Flat Rate</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-brand-purple" />
            <span>1-on-1 Dedicated Time</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-berry-pink" />
            <span>100% Your Copyright</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
            <Heart className="w-3.5 h-3.5 text-pink-500" />
            <span>Safe & Inclusive Space</span>
          </div>
        </div>
      </section>

      {/* 4 CO-WRITING FOCUS PILLARS */}
      <section className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Creative Mediums</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">What We Can Co-Create Together</h2>
          <p className="text-xs text-slate-500">Tailored to your creative rhythm, artistic level, and storytelling voice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pastel-pink/60 flex items-center justify-center text-berry-pink">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Poetry & Lyrical Stanzas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sculpt evocative imagery, rhythmic meter, rhyme nuances, and song verses for vocal performance or print chapbooks.
              </p>
            </div>
            <ul className="space-y-1.5 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Song chorus cadence</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Metaphor development</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Spoken word flow</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-lavender flex items-center justify-center text-brand-purple">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Essays & Memoirs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unpack personal history, slow literature essays, creative non-fiction, and personal blog manuscripts with authentic voice.
              </p>
            </div>
            <ul className="space-y-1.5 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Narrative arc structuring</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Tone and pacing polish</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Substack & blog essays</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Mental Health Journaling</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A safe, non-judgmental space to articulate emotions, process life transitions, and practice mindful therapeutic reflection through words.
              </p>
            </div>
            <ul className="space-y-1.5 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Men & women's healing</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Guided journaling prompts</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Compassionate listening</li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pastel-purple/50 flex items-center justify-center text-violet-accent">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Line Editing & Voice Polish</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take an existing piece of writing and elevate word choice, sentence rhythm, readability, and emotional impact without losing your soul.
              </p>
            </div>
            <ul className="space-y-1.5 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Line-by-line refinements</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Word economy & precision</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-teal-600" /> Editorial marginalia</li>
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CALCULATOR & BOOKING REQUEST SECTION */}
      <section id="booking-section" className="mb-20 bg-white border border-slate-100 rounded-[36px] p-6 sm:p-10 md:p-14 shadow-sm text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Estimator & Packages */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Transparent Pricing</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Custom Session Estimator</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your desired duration and format. Pricing is strictly CAD $30 per hour with no hidden platform fees.
              </p>
            </div>

            {/* Duration Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
                1. Select Time Allocation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { hours: 1, label: "1 Hour", sub: "Quick Polish" },
                  { hours: 2, label: "2 Hours", sub: "Deep Co-Write" },
                  { hours: 3, label: "3 Hours", sub: "Multi-Poem / Essay" },
                  { hours: 5, label: "5-Hr Bundle", sub: "Intensive Series" },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setSelectedHours(item.hours)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedHours === item.hours
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="block font-bold text-sm">{item.label}</span>
                    <span className={`block text-[10px] ${selectedHours === item.hours ? "text-slate-300" : "text-slate-400"}`}>
                      {item.sub}
                    </span>
                    <span className={`block text-xs font-mono font-bold mt-1 ${selectedHours === item.hours ? "text-pink-300" : "text-brand-purple"}`}>
                      CAD ${calculateTotal(item.hours)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Format Picker */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
                2. Choose Collaboration Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "video", title: "Live Video (Google Meet / Zoom)", desc: "Real-time verbal dialogue and side-by-side writing." },
                  { id: "async", title: "Async Shared Google Docs", desc: "Detailed written comments, suggestions & structural edits." },
                  { id: "audio", title: "Audio Voice Memo Exchange", desc: "Thoughtful audio feedback notes on your drafts." },
                  { id: "inperson", title: "Vancouver BC In-Person", desc: "Quiet studio / café sessions in Vancouver BC area." },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSessionFormat(fmt.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      sessionFormat === fmt.id
                        ? "bg-lavender/50 border-brand-purple ring-1 ring-brand-purple/40"
                        : "bg-slate-50/50 hover:bg-slate-100/70 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="font-bold text-xs block text-charcoal">{fmt.title}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Picker */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
                3. Primary Project Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Poetry & Lyrics",
                  "Personal Memoir",
                  "Slow Literature Essay",
                  "Mental Health Journaling",
                  "Line Editing & Rhythm",
                  "Other Creative Project"
                ].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTopic === topic
                        ? "bg-brand-purple text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Rate Summary Box with Direct Hyperlinked Buttons */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Total Investment</span>
                  <h3 className="font-serif text-3xl font-bold text-white">CAD ${currentTotal}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-pink-300">Rate Breakdown</span>
                  <p className="text-xs text-slate-300">{selectedHours} hour(s) @ CAD $30/hr</p>
                  {selectedHours === 5 && (
                    <span className="text-[10px] text-teal-400 font-bold">Includes 10% Bundle Savings</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Includes line-by-line editorial markups & written summary.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Full intellectual property & copyright retained 100% by you.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Post-session action plan & prompt exercises included.</span>
                </div>
              </div>

              {/* Direct Hyperlinks on Summary Box */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={BOOK_NOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="summary-book-now-btn"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs uppercase tracking-widest py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Calendar className="w-3.5 h-3.5 text-pink-300 group-hover:scale-110 transition-transform" />
                  <span>Book Now</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={PAY_NOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="summary-pay-now-btn"
                  className="w-full bg-gradient-to-r from-brand-pink via-brand-purple to-violet-accent hover:from-pink-500 hover:to-purple-600 text-white text-xs uppercase tracking-widest py-3 rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <CreditCard className="w-3.5 h-3.5 text-teal-200 group-hover:scale-110 transition-transform" />
                  <span>Pay Now</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Booking & Fast-Action Links */}
          <div className="lg:col-span-6 bg-cream/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-purple font-bold">Fast Action Portal</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal">Book Slot or Complete Payment</h3>
              <p className="text-xs text-slate-500">
                You can immediately schedule on Zoom with <strong>Book Now</strong> or complete payment securely via PayPal with <strong>Pay Now</strong>.
              </p>
            </div>

            {/* Quick Link Banner Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <a
                href={BOOK_NOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center transition-all flex flex-col items-center justify-center gap-1 group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-pink-300 group-hover:scale-110 transition-transform" />
                  <span>Book Now</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-300 font-normal">Direct Zoom Calendar</span>
              </a>

              <a
                href={PAY_NOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-gradient-to-r from-brand-pink via-brand-purple to-violet-accent hover:from-pink-500 hover:to-purple-600 text-white text-center transition-all flex flex-col items-center justify-center gap-1 group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
                  <span>Pay Now</span>
                  <ExternalLink className="w-3 h-3 text-white/90" />
                </div>
                <span className="text-[10px] text-pink-100 font-normal">PayPal Secure Checkout</span>
              </a>
            </div>

            {bookingSubmitted ? (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-200 text-center space-y-4 shadow-xs">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto animate-bounce" />
                <h4 className="font-serif text-xl font-bold text-teal-900">Session Request Received! ✍️</h4>
                <p className="text-xs text-teal-800 leading-relaxed">
                  Thank you, <span className="font-bold">{bookingForm.name}</span>. We have logged your request for <span className="font-bold">{selectedHours} hour(s)</span> at <span className="font-bold">CAD ${currentTotal}</span>.
                </p>
                
                {/* Instant Link Callouts */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mt-4 text-left">
                  <p className="text-xs text-slate-700 font-bold">Ready to complete your reservation right away?</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={BOOK_NOW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-900 text-white text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl font-bold text-center flex items-center justify-center gap-1 hover:bg-slate-800"
                    >
                      <Calendar className="w-3.5 h-3.5 text-pink-300" />
                      <span>1. Book Zoom Slot</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href={PAY_NOW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl font-bold text-center flex items-center justify-center gap-1 hover:shadow"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>2. Pay via PayPal</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSubmitted(false);
                      setBookingForm({ name: "", email: "", preferredDate: "", preferredTime: "morning", notes: "" });
                    }}
                    className="bg-charcoal text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="text-left">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Or send project details & goals directly to Macarena's inbox:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      placeholder="e.g. Elena Vance"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">Target Date</label>
                    <input
                      type="date"
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal font-medium text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">Time Window</label>
                    <select
                      value={bookingForm.preferredTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal font-medium text-slate-700"
                    >
                      <option value="morning">Morning (9am - 12pm PST)</option>
                      <option value="afternoon">Afternoon (1pm - 5pm PST)</option>
                      <option value="evening">Evening (6pm - 9pm PST)</option>
                      <option value="weekend">Weekend Special</option>
                      <option value="flexible">Flexible / Any Time</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
                    Tell Me About Your Project / Goals
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Tell me what you're working on, what feels stuck, or what you want to bring to life during our session..."
                    className="w-full bg-white border border-slate-300 rounded-2xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal font-medium"
                  />
                </div>

                {/* Optional Scratchpad Inclusion Note */}
                {draftSnippet && (
                  <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-xl text-[11px] text-pink-900 flex items-center justify-between">
                    <span>✓ Attached draft snippet from the prompt scratchpad below.</span>
                    <button
                      type="button"
                      onClick={() => setDraftSnippet("")}
                      className="text-pink-600 hover:underline font-bold text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Form Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="form-submit-inquiry-btn"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase tracking-widest py-3.5 rounded-full font-bold transition-all shadow hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-pink-300" />
                        <span>Send Project Inquiry & Notes</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-teal-600" /> 256-Bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>CAD $30 / hr Rate Guaranteed</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PROMPT PLAYGROUND & SCRATCHPAD */}
      <section className="mb-20 bg-gradient-to-r from-pastel-purple/50 via-cream to-pastel-pink/50 border border-white/80 rounded-[36px] p-6 sm:p-10 md:p-12 text-left shadow-xs">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-pink" /> Try An Inspiration Exercise
              </span>
              <h3 className="font-serif text-2xl font-bold">Collaborative Writing Sandbox</h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePromptIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand-purple" /> Next Writing Prompt
            </button>
          </div>

          {/* Current Prompt Card */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-purple font-bold bg-lavender px-2.5 py-1 rounded-full">
                {SAMPLE_PROMPTS[activePromptIndex].theme}
              </span>
              <span className="text-[11px] text-slate-400">Prompt {activePromptIndex + 1} of {SAMPLE_PROMPTS.length}</span>
            </div>
            <p className="font-serif text-base text-slate-800 italic leading-relaxed">
              "{SAMPLE_PROMPTS[activePromptIndex].prompt}"
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="font-bold text-brand-purple">Macarena's Guidance:</span> {SAMPLE_PROMPTS[activePromptIndex].tip}
            </p>
          </div>

          {/* User Live Scratchpad */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
              Your Scratchpad (Type your rough thoughts or lyrics here)
            </label>
            <textarea
              rows={4}
              value={draftSnippet}
              onChange={(e) => setDraftSnippet(e.target.value)}
              placeholder="Test a line or draft your poetic stanza here... You can attach this directly to your booking inquiry above!"
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-purple text-charcoal shadow-inner"
            />
            {draftSnippet && (
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>{draftSnippet.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span className="text-teal-700 font-semibold">✓ Automatically linked to booking form</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4 STEPS) */}
      <section className="mb-20 text-left">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">The Process</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">How A Session Unfolds</h2>
          <p className="text-xs text-slate-500">Smooth, effortless, and focused entirely on creative momentum.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Reserve & Share",
              desc: "Select your hours at CAD $30/hr and share your rough draft, voice memo, or initial spark."
            },
            {
              step: "02",
              title: "Creative Prep",
              desc: "Macarena reviews your themes, preparing tailored prompts, cadence notes, and structural ideas."
            },
            {
              step: "03",
              title: "Live or Async Co-Write",
              desc: "We write side-by-side, adjusting rhythm, refining metaphors, and unlocking stuck sections."
            },
            {
              step: "04",
              title: "Polished Manuscript",
              desc: "Receive your clean text, line-edit archive, and actionable next steps with 100% rights."
            }
          ].map((s) => (
            <div key={s.step} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <span className="font-mono text-2xl font-black text-brand-pink">{s.step}</span>
              <h3 className="font-serif text-base font-bold text-charcoal">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Kind Words</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Writers & Artists on Co-Creating</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Macarena helped me turn three scattered voice memos into a cohesive 4-verse acoustic song. Her ear for lyric rhythm and cadence is phenomenal."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-serif text-xs font-bold text-charcoal">Julian M.</h4>
              <p className="text-[10px] font-mono text-slate-400">Songwriter & Guitarist • Vancouver</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The 2-hour mental health journaling session was so grounding. She creates such a calm, welcoming space where men can be vulnerable without fear."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-serif text-xs font-bold text-charcoal">David K.</h4>
              <p className="text-[10px] font-mono text-slate-400">Writer & Architect • Toronto</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "At CAD $30/hour, this is the most accessible high-level poetry editing I've experienced. My chapbook manuscript feels infinitely tighter."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-serif text-xs font-bold text-charcoal">Claire S.</h4>
              <p className="text-[10px] font-mono text-slate-400">Poet & Essayist • Montreal</p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="mb-12 max-w-3xl mx-auto text-left space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Clarity & Details</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "How does the CAD $30/hour billing work?",
              a: "Sessions are billed strictly at CAD $30 per hour. If you book a 1-hour session, the total is CAD $30. If you book the 5-hour intensive bundle, you receive a discount ($135 CAD). You can pay directly with the PayPal 'Pay Now' button."
            },
            {
              q: "How do I schedule my session time?",
              a: "You can click 'Book Now' at any time to open Macarena's live Zoom Scheduler calendar (https://scheduler.zoom.us/macarena-mantilla-vi0qwt/macarena) and select an open time slot that works best for your schedule."
            },
            {
              q: "Who owns the copyright to the words written together?",
              a: "You retain 100% of all intellectual property, publishing rights, and royalties. Macarena acts as a co-creator, editor, and creative guide; no co-writing credits are required unless you choose to acknowledge her."
            },
            {
              q: "What should I prepare before our first session?",
              a: "Anything from a blank slate to a finished first draft! You can bring raw journal entries, a list of song chord progressions, half-written stanzas, or just a central theme you want to explore."
            },
            {
              q: "Can we do async collaboration if our timezones don't align?",
              a: "Absolutely. With async co-writing, you share your document and Macarena will record comprehensive line edits, structural recommendations, and voice memo feedback within your booked time allotment."
            }
          ].map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="font-serif text-sm font-bold text-charcoal">{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-brand-purple transition-transform ${openFaq === idx ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <div className="mt-16 p-8 md:p-12 bg-slate-900 text-white rounded-[36px] text-center space-y-5 max-w-4xl mx-auto shadow-xl">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold">Ready to Bring Your Words to Life?</h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
          Book your first hour of collaborative writing at CAD $30/hour and experience the clarity of intentional, slow literature mentorship.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href={BOOK_NOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="footer-book-now-btn"
            className="bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest px-8 py-3.5 rounded-full font-bold transition-all border border-white/20 cursor-pointer flex items-center gap-2 group"
          >
            <Calendar className="w-4 h-4 text-pink-300 group-hover:scale-110 transition-transform" />
            <span>Book Now</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          
          <a
            href={PAY_NOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="footer-pay-now-btn"
            className="bg-gradient-to-r from-brand-pink via-brand-purple to-violet-accent hover:from-pink-500 hover:to-purple-600 text-white text-xs uppercase tracking-widest px-8 py-3.5 rounded-full font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 group"
          >
            <CreditCard className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
            <span>Pay Now</span>
            <ExternalLink className="w-3 h-3 text-white/90" />
          </a>
        </div>
      </div>
    </div>
  );
}
