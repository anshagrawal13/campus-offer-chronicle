import {
  Award, Banknote, Briefcase, Building2, Cpu, Eye, Globe, Handshake, Heart, Lightbulb, MapPin, Megaphone,
  Newspaper, Phone, Rocket, ShieldAlert, ShieldCheck, Star, Swords, Target, TrendingUp, Users, type LucideIcon,
} from "lucide-react";
import { titleCaseFromCode, type CompanyProfile } from "@/lib/companyData";

export interface IntelField { key: string; label: string; value?: string }
export interface IntelSection { id: string; title: string; icon: LucideIcon; fields: IntelField[] }

const SCHEMA: [string, LucideIcon, string[]][] = [
  ["Company Identity", Building2, ["name", "short_name", "category", "nature_of_company", "incorporation_year", "employee_size", "headquarters_address"]],
  ["Overview & Vision", Eye, ["overview_text", "vision_statement", "mission_statement", "core_values", "history_timeline"]],
  ["Leadership", Users, ["ceo_name", "ceo_linkedin_url", "key_leaders", "board_members", "warm_intro_pathways", "decision_maker_access"]],
  ["Funding & Financials", Banknote, ["annual_revenue", "annual_profit", "revenue_mix", "valuation", "yoy_growth_rate", "profitability_status", "key_investors", "recent_funding_rounds", "total_capital_raised", "burn_rate", "runway_months", "burn_multiplier"]],
  ["Global Presence", Globe, ["operating_countries", "office_count", "office_locations"]],
  ["Products & Services", Briefcase, ["offerings_description", "focus_sectors", "pain_points_addressed", "top_customers", "case_studies", "product_pipeline"]],
  ["Technology Stack", Cpu, ["tech_stack", "ai_ml_adoption_level", "r_and_d_investment", "intellectual_property", "cybersecurity_posture", "tech_adoption_rating", "innovation_roadmap"]],
  ["Partnerships & Ecosystem", Handshake, ["technology_partners", "partnership_ecosystem", "industry_associations"]],
  ["Competitive Landscape", Swords, ["key_competitors", "competitive_advantages", "unique_differentiators", "weaknesses_gaps", "benchmark_vs_peers", "market_share_percentage"]],
  ["Market Opportunity", Target, ["tam", "sam", "som", "future_projections", "strategic_priorities", "key_challenges_needs"]],
  ["Core Value Proposition & ESG", Lightbulb, ["core_value_proposition", "esg_ratings", "sustainability_csr", "carbon_footprint", "ethical_sourcing"]],
  ["Culture & Work Life", Heart, ["work_culture_summary", "manager_quality", "psychological_safety", "feedback_culture", "diversity_metrics", "diversity_inclusion_score", "ethical_standards", "burnout_risk", "mission_clarity", "employee_turnover", "avg_retention_tenure", "layoff_history", "crisis_behavior"]],
  ["Recent News & Milestones", Newspaper, ["recent_news", "awards_recognitions", "event_participation"]],
  ["Sales & Customer Metrics", TrendingUp, ["sales_motion", "go_to_market_strategy", "customer_acquisition_cost", "customer_lifetime_value", "cac_ltv_ratio", "churn_rate", "net_promoter_score", "customer_concentration_risk", "customer_testimonials", "exit_strategy_history"]],
  ["Risk & Compliance", ShieldAlert, ["regulatory_status", "legal_issues", "supply_chain_dependencies", "geopolitical_risks", "macro_risks"]],
  ["Work Location & Commute", MapPin, ["remote_policy_details", "flexibility_level", "typical_hours", "overtime_expectations", "weekend_work", "location_centrality", "office_zone_type", "public_transport_access", "cab_policy", "airport_commute_time"]],
  ["Safety & Wellbeing", ShieldCheck, ["area_safety", "safety_policies", "infrastructure_safety", "emergency_preparedness", "health_support"]],
  ["Career Growth & Learning", Rocket, ["training_spend", "onboarding_quality", "learning_culture", "mentorship_availability", "internal_mobility", "promotion_clarity", "exposure_quality", "role_clarity", "early_ownership", "work_impact", "execution_thinking_balance", "automation_level", "cross_functional_exposure", "tools_access", "skill_relevance", "exit_opportunities", "global_exposure", "network_strength", "hiring_velocity"]],
  ["Brand & Reputation", Award, ["brand_value", "brand_sentiment_score", "external_recognition", "company_maturity", "client_quality", "marketing_video_url"]],
  ["Compensation & Benefits", Star, ["fixed_vs_variable_pay", "bonus_predictability", "esops_incentives", "leave_policy", "family_health_insurance", "relocation_support", "lifestyle_benefits"]],
  ["Digital Presence & Ratings", Megaphone, ["website_url", "linkedin_url", "twitter_handle", "facebook_url", "instagram_url", "website_quality", "website_rating", "website_traffic_rank", "social_media_followers", "glassdoor_rating", "indeed_rating", "google_rating"]],
  ["Contact Information", Phone, ["primary_contact_email", "primary_phone_number", "contact_person_name", "contact_person_title", "contact_person_email", "contact_person_phone"]],
];

export function buildIntelligenceSections(profile?: CompanyProfile): IntelSection[] {
  return SCHEMA.map(([title, icon, keys], i) => ({
    id: `section-${i}`,
    title,
    icon,
    fields: keys.map((key) => ({
      key,
      label: key === "r_and_d_investment" ? "R&D Investment" : titleCaseFromCode(key),
      value: profile?.[key],
    })),
  }));
}
