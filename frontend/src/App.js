import { useEffect, useState } from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "@/components/clarity/Header";
import SideDrawer from "@/components/clarity/SideDrawer";
import AuthModal from "@/components/clarity/AuthModal";
import FloatingIndex from "@/components/clarity/FloatingIndex";
import Footer from "@/components/clarity/Footer";
import IndexSection from "@/components/clarity/IndexSection";
import HomePage from "@/HomePage";
import { ClarityProvider } from "@/state/ClarityContext";

// Priority pages
import {
  ScoreFactorBreakdownPage, WhatIfSimulatorPage, SIPCalculatorPage,
  EMICalculatorPage, RiskProfilingQuizPage, ExplainabilityPanelPage,
} from "@/pages/priority";

// Category page bundles
import * as Onb from "@/pages/onboarding";
import * as Acc from "@/pages/account";
import * as Cre from "@/pages/credit";
import * as Inv from "@/pages/investments";
import * as Pay from "@/pages/payments";
import * as Sav from "@/pages/savings";
import * as Lend from "@/pages/lending";
import * as Ins from "@/pages/insurance";
import * as Edu from "@/pages/education";
import * as Trust from "@/pages/trust";
import * as Com from "@/pages/community";
import * as Adm from "@/pages/admin";

function useRevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const observed = new WeakSet();
    const observeAll = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}

function ScrollToTop() {
  useEffect(() => {
    const onNav = () => window.scrollTo({ top: 0, behavior: "instant" });
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);
  return null;
}

function Shell() {
  const [authOpen, setAuthOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useRevealOnScroll();

  const handleSignIn = (name) => {
    setSignedIn(name || "guest");
    setAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-bone text-ink font-body" data-testid="app-root">
      <Header
        onOpenAuth={() => setAuthOpen(true)}
        onOpenDrawer={() => setDrawerOpen(true)}
        signedIn={signedIn}
      />
      {/* Spacer for the fixed header */}
      <div style={{ height: 96 }} aria-hidden />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <FloatingIndex onOpen={() => setDrawerOpen(true)} />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={handleSignIn}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Onboarding */}
        <Route path="/onboarding/kyc" element={<Onb.KYCPage />} />
        <Route path="/onboarding/otp" element={<Onb.OTPPage />} />
        <Route path="/onboarding/progressive-profiling" element={<Onb.ProgressiveProfilingPage />} />
        <Route path="/onboarding/language" element={<Onb.MultiLanguagePage />} />

        {/* Account */}
        <Route path="/account/net-worth" element={<Acc.NetWorthPage />} />
        <Route path="/account/transactions" element={<Acc.TransactionsPage />} />
        <Route path="/account/spending" element={<Acc.SpendingPage />} />
        <Route path="/account/digest" element={<Acc.DigestPage />} />
        <Route path="/account/budget" element={<Acc.BudgetPage />} />

        {/* Credit */}
        <Route path="/credit/history" element={<Cre.ScoreHistoryPage />} />
        <Route path="/credit/factors" element={<ScoreFactorBreakdownPage />} />
        <Route path="/credit/whatif-simulator" element={<WhatIfSimulatorPage />} />
        <Route path="/credit/alerts" element={<Cre.ScoreAlertsPage />} />
        <Route path="/credit/loan-eligibility" element={<Cre.LoanEligibilityPage />} />

        {/* Investments */}
        <Route path="/investments/goals" element={<Inv.GoalsPage />} />
        <Route path="/investments/sip-calculator" element={<SIPCalculatorPage />} />
        <Route path="/investments/risk-quiz" element={<RiskProfilingQuizPage />} />
        <Route path="/investments/portfolio" element={<Inv.PortfolioPage />} />
        <Route path="/investments/growth-projections" element={<Inv.GrowthProjectionsPage />} />
        <Route path="/investments/auto-rebalancing" element={<Inv.RebalancePage />} />
        <Route path="/investments/watchlists" element={<Inv.WatchlistsPage />} />
        <Route path="/investments/round-up" element={<Inv.RoundUpPage />} />

        {/* Payments */}
        <Route path="/payments/p2p" element={<Pay.P2PPage />} />
        <Route path="/payments/bills" element={<Pay.BillsPage />} />
        <Route path="/payments/split" element={<Pay.SplitPage />} />
        <Route path="/payments/scheduled" element={<Pay.ScheduledPage />} />
        <Route path="/payments/reminders" element={<Pay.RemindersPage />} />

        {/* Savings */}
        <Route path="/savings/pots" element={<Sav.PotsPage />} />
        <Route path="/savings/auto-save" element={<Sav.AutoSavePage />} />
        <Route path="/savings/streaks" element={<Sav.StreaksPage />} />

        {/* Lending */}
        <Route path="/lending/micro-loan" element={<Lend.MicroLoanPage />} />
        <Route path="/lending/emi-calculator" element={<EMICalculatorPage />} />
        <Route path="/lending/repayment-tracker" element={<Lend.RepaymentTrackerPage />} />

        {/* Insurance */}
        <Route path="/insurance/compare" element={<Ins.InsuranceComparePage />} />
        <Route path="/insurance/claims" element={<Ins.ClaimsPage />} />
        <Route path="/insurance/premium-reminders" element={<Ins.PremiumRemindersPage />} />

        {/* Education */}
        <Route path="/education/bites" element={<Edu.BitesPage />} />
        <Route path="/education/glossary" element={<Edu.GlossaryPage />} />
        <Route path="/education/quizzes" element={<Edu.QuizzesPage />} />
        <Route path="/education/explainers" element={<Edu.ExplainersPage />} />

        {/* Trust */}
        <Route path="/trust/explainability" element={<ExplainabilityPanelPage />} />
        <Route path="/trust/consent" element={<Trust.ConsentPage />} />
        <Route path="/trust/disclaimers" element={<Trust.DisclaimersPage />} />
        <Route path="/trust/audit" element={<Trust.AuditPage />} />

        {/* Community */}
        <Route path="/community/referral" element={<Com.ReferralPage />} />
        <Route path="/community/leaderboards" element={<Com.LeaderboardsPage />} />
        <Route path="/community/family" element={<Com.FamilyPage />} />

        {/* Admin */}
        <Route path="/admin/risk-buckets" element={<Adm.AdminRiskBucketsPage />} />
        <Route path="/admin/fraud" element={<Adm.AdminFraudPage />} />
      </Routes>

      <IndexSection />
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ClarityProvider>
        <ScrollToTop />
        <Shell />
      </ClarityProvider>
    </BrowserRouter>
  );
}
