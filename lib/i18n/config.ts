import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, zh } from "@/locales";
import { studioEn, studioZh } from "@/locales/studio";
import { editorEn, editorZh } from "@/locales/editor";
import { feedbackEn, feedbackZh } from "@/locales/feedback";
import {
  documentWorkflowEn,
  documentWorkflowZh,
} from "@/locales/document-workflow";
import { visualEn, visualZh } from "@/locales/visual";
import { metricsEn, metricsZh } from "@/locales/metrics";
import { rubricsEn, rubricsZh } from "@/locales/rubrics";
import { auditEn, auditZh } from "@/locales/audit";

// Build namespace structure from in-memory locales
const resources = {
  en: {
    audit: auditEn,
    rubrics: rubricsEn,
    metrics: metricsEn,
    visual: visualEn,
    documentWorkflow: documentWorkflowEn,
    feedback: feedbackEn,
    editor: editorEn,
    studio: studioEn,
    auth: en.auth,
    common: en.common,
    course: en.course,
    composition: en.composition,
    evaluation: en.evaluation,
    admin: en.admin,
    vocabulary: en.vocabulary,
    home: en.home,
    dashboard: en.dashboard,
    documents: en.documents,
    productGuide: en.productGuide,
  },
  zh: {
    audit: auditZh,
    rubrics: rubricsZh,
    metrics: metricsZh,
    visual: visualZh,
    documentWorkflow: documentWorkflowZh,
    feedback: feedbackZh,
    editor: editorZh,
    studio: studioZh,
    auth: zh.auth,
    common: zh.common,
    course: zh.course,
    composition: zh.composition,
    evaluation: zh.evaluation,
    admin: zh.admin,
    vocabulary: zh.vocabulary,
    home: zh.home,
    dashboard: zh.dashboard,
    documents: zh.documents,
    productGuide: zh.productGuide,
  },
};

// Initialize i18next with default settings
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  defaultNS: "common",
  ns: [
    "audit",
    "rubrics",
    "metrics",
    "visual",
    "documentWorkflow",
    "feedback",
    "editor",
    "studio",
    "auth",
    "common",
    "course",
    "composition",
    "evaluation",
    "admin",
    "vocabulary",
    "home",
    "dashboard",
    "documents",
    "productGuide",
  ],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  cleanCode: true,
  nonExplicitSupportedLngs: true,
  load: "currentOnly",
});

export default i18n;
