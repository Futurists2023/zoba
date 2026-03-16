"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { suburbCatalog } from "@/data/suburb-catalog";
import { type QuoteResult } from "@/lib/database-quote-engine";
import { DEFAULT_TEST_SUBURB_ID, type QuoteRequest } from "@/lib/quote";

type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  note?: string;
};

type ChildSetup = {
  daycare: number;
  preschool: number;
  primary: number;
  highSchool: number;
  schoolType: "public" | "private_mid" | "private_premium";
};

const presets: Array<{
  label: string;
  subtitle: string;
  request: QuoteRequest;
  childSetup: ChildSetup;
}> = [
  {
    label: "Young Family",
    subtitle: "Private school and CBD hybrid week",
    request: {
      suburbId: DEFAULT_TEST_SUBURB_ID,
      adults: 2,
      children: 1,
      lifestyleTier: "balanced",
      bedrooms: 2,
      parkingSpaces: 1,
      propertyType: "apartment",
      workDestinationArea: "cbd",
      cars: 1,
      commuteDaysPerWeek: 3,
      usesUber: true,
      uberTripsPerMonth: 4,
      usesPublicTransport: false,
      schoolType: "private_mid",
      childcare: "none",
      domesticHelp: "monthly",
      medicalAidTier: "mid",
      fibreTier: "standard",
      backupPower: "inverter",
      netMonthlyIncome: 60000,
    },
    childSetup: {
      daycare: 0,
      preschool: 0,
      primary: 1,
      highSchool: 0,
      schoolType: "private_mid",
    },
  },
  {
    label: "Solo Professional",
    subtitle: "Lean remote setup with city flexibility",
    request: {
      suburbId: DEFAULT_TEST_SUBURB_ID,
      adults: 1,
      children: 0,
      lifestyleTier: "value",
      bedrooms: 1,
      parkingSpaces: 0,
      propertyType: "apartment",
      workDestinationArea: "remote",
      cars: 0,
      commuteDaysPerWeek: 0,
      usesUber: true,
      uberTripsPerMonth: 6,
      usesPublicTransport: true,
      schoolType: "none",
      childcare: "none",
      domesticHelp: "none",
      medicalAidTier: "basic",
      fibreTier: "basic",
      backupPower: "basic",
      netMonthlyIncome: 28000,
    },
    childSetup: {
      daycare: 0,
      preschool: 0,
      primary: 0,
      highSchool: 0,
      schoolType: "public",
    },
  },
  {
    label: "Dual-Income Couple",
    subtitle: "Comfort-led setup with backup power",
    request: {
      suburbId: DEFAULT_TEST_SUBURB_ID,
      adults: 2,
      children: 0,
      lifestyleTier: "comfortable",
      bedrooms: 2,
      parkingSpaces: 1,
      propertyType: "townhouse",
      workDestinationArea: "century_city",
      cars: 1,
      commuteDaysPerWeek: 4,
      usesUber: true,
      uberTripsPerMonth: 8,
      usesPublicTransport: false,
      schoolType: "none",
      childcare: "none",
      domesticHelp: "weekly",
      medicalAidTier: "premium",
      fibreTier: "fast",
      backupPower: "full",
      netMonthlyIncome: 90000,
    },
    childSetup: {
      daycare: 0,
      preschool: 0,
      primary: 0,
      highSchool: 0,
      schoolType: "public",
    },
  },
];

const initialRequest = presets[0].request;

const categoryLabels: Record<string, string> = {
  housing: "Housing",
  transport: "Transport",
  groceries: "Groceries",
  utilities: "Utilities",
  schooling_childcare: "Schooling & childcare",
  connectivity: "Connectivity",
  domestic_help: "Domestic help",
  backup_power: "Backup power",
};

const lifestyleOptions: ChoiceOption<QuoteRequest["lifestyleTier"]>[] = [
  {
    value: "value",
    label: "Value",
    note: "Built for tighter budgets, lighter trade-offs, and more disciplined monthly spend.",
  },
  {
    value: "balanced",
    label: "Balanced",
    note: "A practical middle lane for people who want a solid Cape Town setup without overspending.",
  },
  {
    value: "comfortable",
    label: "Comfort",
    note: "Adds more breathing room for convenience, better buffers, and a less stretched month.",
  },
];

const propertyOptions: ChoiceOption<
  NonNullable<QuoteRequest["propertyType"]>
>[] = [
  { value: "any", label: "Any" },
  { value: "apartment", label: "Apartment" },
  { value: "townhouse", label: "Townhouse" },
  { value: "house", label: "House" },
];

const destinationOptions: ChoiceOption<
  NonNullable<QuoteRequest["workDestinationArea"]>
>[] = [
  { value: "remote", label: "Remote" },
  { value: "cbd", label: "CBD" },
  { value: "century_city", label: "Century City" },
  { value: "claremont", label: "Claremont" },
  { value: "bellville", label: "Bellville" },
];

const helpOptions: ChoiceOption<NonNullable<QuoteRequest["domesticHelp"]>>[] = [
  { value: "none", label: "None" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "twice_weekly", label: "2x weekly" },
];

const backupOptions: ChoiceOption<NonNullable<QuoteRequest["backupPower"]>>[] =
  [
    { value: "none", label: "None" },
    { value: "basic", label: "Basic" },
    { value: "inverter", label: "Inverter" },
    { value: "full", label: "Full" },
  ];

const childSchoolOptions: ChoiceOption<ChildSetup["schoolType"]>[] = [
  { value: "public", label: "Public" },
  { value: "private_mid", label: "Private mid" },
  { value: "private_premium", label: "Private premium" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatKey(value: string) {
  return value.replaceAll("_", " ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatCount(value: number, singular: string, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function getFibreTierForBudget(
  amount: number,
): NonNullable<QuoteRequest["fibreTier"]> {
  if (amount < 200) {
    return "none";
  }
  if (amount < 750) {
    return "basic";
  }
  if (amount < 1150) {
    return "standard";
  }
  return "fast";
}

function getFibreBudgetForTier(tier: NonNullable<QuoteRequest["fibreTier"]>) {
  if (tier === "none") {
    return 0;
  }
  if (tier === "basic") {
    return 700;
  }
  if (tier === "standard") {
    return 1000;
  }
  return 1300;
}

function getChildTotal(setup: ChildSetup) {
  return setup.daycare + setup.preschool + setup.primary + setup.highSchool;
}

function summarizeChildSetup(setup: ChildSetup) {
  const summary = [
    setup.daycare ? `${setup.daycare} daycare` : null,
    setup.preschool ? `${setup.preschool} pre-school` : null,
    setup.primary ? `${setup.primary} primary` : null,
    setup.highSchool ? `${setup.highSchool} high school` : null,
  ].filter(Boolean);

  if (!summary.length) {
    return "No child costs configured yet";
  }

  return summary.join(" | ");
}

function summarizeHousehold(request: QuoteRequest) {
  const children = request.children ?? 0;

  return `${formatCount(request.adults, "adult")}, ${
    children > 0 ? formatCount(children, "child", "children") : "no children"
  }`;
}

function summarizeHomeSetup(request: QuoteRequest) {
  const parkingSpaces = request.parkingSpaces ?? 0;

  return `${formatCount(request.bedrooms, "bedroom")} • ${
    parkingSpaces > 0
      ? formatCount(parkingSpaces, "parking bay", "parking bays")
      : "no parking"
  }`;
}

function mapChildSetupToRequest(
  setup: ChildSetup,
): Pick<QuoteRequest, "children" | "schoolType" | "childcare"> {
  const totalChildren = getChildTotal(setup);
  const schoolDrivenChildren =
    setup.preschool + setup.primary + setup.highSchool;

  return {
    children: totalChildren,
    schoolType:
      totalChildren > 0 && schoolDrivenChildren > 0 ? setup.schoolType : "none",
    childcare:
      totalChildren === 0
        ? ("none" as const)
        : setup.daycare > 0
          ? ("full_time" as const)
          : setup.preschool > 0
            ? ("part_time" as const)
            : ("none" as const),
  };
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className="stepper-card">
      <div className="stepper-meta">
        <span className="mini-label">{label}</span>
        <small>{min === 0 ? "Optional" : `Min ${min}`}</small>
      </div>
      <div className="stepper-shell">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={!canDecrease}
          onClick={() => onChange(clamp(value - 1, min, max))}
        >
          -
        </button>
        <div className="stepper-value">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={!canIncrease}
          onClick={() => onChange(clamp(value + 1, min, max))}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ChoiceChips<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<ChoiceOption<T>>;
  onChange: (next: T) => void;
}) {
  return (
    <section className="stack-card">
      <div className="card-header">
        <div>
          <p className="mini-label">{label}</p>
        </div>
      </div>
      <div className="choice-grid">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`choice-pill ${value === option.value ? "is-active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            {option.note ? <small>{option.note}</small> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="switch-row"
      onClick={() => onChange(!checked)}
    >
      <div>
        <span className="switch-title">{label}</span>
        <p>{description}</p>
      </div>
      <span className={`switch-ui ${checked ? "is-on" : ""}`}>
        <span />
      </span>
    </button>
  );
}

function BudgetSlider({
  label,
  min,
  max,
  step,
  value,
  displayValue,
  note,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  note: string;
  onChange: (next: number) => void;
}) {
  return (
    <section className="stack-card">
      <div className="card-header">
        <div>
          <p className="mini-label">{label}</p>
          <h3>{displayValue}</h3>
        </div>
        <span className="city-chip">{note}</span>
      </div>
      <input
        className="range-slider range-slider-strong"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="slider-scale">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </section>
  );
}

function ZobaWordmark() {
  return (
    <div className="zoba-lockup" aria-label="zoba">
      <span className="zoba-emblem" aria-hidden="true">
        <span className="zoba-grid">
          <i />
          <i />
          <i />
        </span>
      </span>
      <div className="zoba-type">
        <strong>zoba</strong>
        <span>Cape Town cost of living</span>
      </div>
    </div>
  );
}

function SelectMenu<T extends string>({
  label,
  value,
  title,
  detail,
  options,
  isOpen,
  onToggle,
  onChange,
}: {
  label: string;
  value: T;
  title: string;
  detail?: string;
  options: Array<ChoiceOption<T>>;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (next: T) => void;
}) {
  return (
    <div className={`select-menu ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <div>
          <span className="mini-label">{label}</span>
          <strong>{title}</strong>
          {detail ? <small>{detail}</small> : null}
        </div>
        <span className="select-chevron">{isOpen ? "Hide" : "Choose"}</span>
      </button>
      {isOpen ? (
        <div className="select-sheet" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`select-option ${value === option.value ? "is-active" : ""}`}
              onClick={() => onChange(option.value)}
            >
              <span>{option.label}</span>
              {option.note ? <small>{option.note}</small> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function QuoteExperience() {
  const plannerRef = useRef<HTMLElement | null>(null);
  const [request, setRequest] = useState<QuoteRequest>(initialRequest);
  const [fibreBudget, setFibreBudget] = useState(
    getFibreBudgetForTier(initialRequest.fibreTier ?? "none"),
  );
  const [childSetup, setChildSetup] = useState<ChildSetup>(
    presets[0].childSetup,
  );
  const [childDraft, setChildDraft] = useState<ChildSetup>(
    presets[0].childSetup,
  );
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"suburb" | "lifestyle" | null>(null);
  const selectedSuburb = useMemo(
    () =>
      suburbCatalog.find((suburb) => suburb.id === request.suburbId) ??
      suburbCatalog[0],
    [request.suburbId],
  );
  const selectedLifestyle = useMemo(
    () =>
      lifestyleOptions.find(
        (option) => option.value === request.lifestyleTier,
      ) ?? lifestyleOptions[1],
    [request.lifestyleTier],
  );

  const categoryRows = useMemo(() => {
    if (!result) {
      return [];
    }

    const maxValue = Math.max(...Object.values(result.categories), 1);

    return Object.entries(result.categories)
      .map(([key, value]) => ({
        key,
        label: categoryLabels[key] ?? formatKey(key),
        value,
        width: `${Math.max((value / maxValue) * 100, 8)}%`,
      }))
      .sort((left, right) => right.value - left.value);
  }, [result]);

  const assumptionRows = useMemo(() => {
    if (!result) {
      return [];
    }

    const entries = [
      ["Lifestyle", result.assumptions.lifestyle_tier],
      ["Bedrooms", result.assumptions.bedrooms],
      ["Work hub", result.assumptions.work_destination_area],
      ["Parking", result.assumptions.parking_spaces],
      ["School", result.assumptions.school_type],
      ["Backup", result.assumptions.backup_power],
    ];

    return entries.map(([label, value]) => ({
      label,
      value: String(value ?? "n/a").replaceAll("_", " "),
    }));
  }, [result]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        plannerRef.current &&
        !plannerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsRefreshing(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        const payload = (await response.json()) as
          | { data: QuoteResult }
          | { error: string; message?: string };

        if (!response.ok || !("data" in payload)) {
          const message =
            "message" in payload
              ? payload.message
              : "We could not calculate a quote for this scenario.";
          setErrorMessage(
            message ?? "We could not calculate a quote for this scenario.",
          );
          return;
        }

        setResult(payload.data);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unexpected network error while loading quote.",
        );
      } finally {
        setIsRefreshing(false);
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [request]);

  function updateRequest<K extends keyof QuoteRequest>(
    key: K,
    value: QuoteRequest[K],
  ) {
    setRequest((current) => ({ ...current, [key]: value }));
  }

  function applyChildSetup(nextSetup: ChildSetup) {
    const mapped = mapChildSetupToRequest(nextSetup);
    setChildSetup(nextSetup);
    setRequest((current) => ({
      ...current,
      children: mapped.children,
      schoolType: mapped.schoolType,
      childcare: mapped.childcare,
    }));
    setChildModalOpen(false);
  }

  function openChildModal() {
    const nextDraft =
      getChildTotal(childSetup) > 0
        ? childSetup
        : {
            daycare: 0,
            preschool: 0,
            primary: 1,
            highSchool: 0,
            schoolType: "public" as const,
          };

    setChildDraft(nextDraft);
    setChildModalOpen(true);
  }

  return (
    <main ref={plannerRef} className="metro-shell">
      <section className="hero-stage">
        <div className="hero-card">
          <ZobaWordmark />
          <p className="hero-kicker">Know the cost before the move.</p>
          <h2>See what it really costs to live in Cape Town.</h2>
          <p>
            Model rent, commute, groceries, fibre, and backup power in one fast
            planner built for young professionals, couples, and families
            figuring out their next move in Cape Town.
          </p>
        </div>

        <div className="hero-metric">
          <span>Live monthly estimate</span>
          <strong>
            {result
              ? formatCurrency(result.monthly_cost.selected)
              : "Calculating..."}
          </strong>
          <p>
            {result
              ? `${result.suburb} place-based living cost`
              : "Loading your first scenario"}
          </p>
          <div className="hero-suburb-block">
            <div className="hero-suburb-copy">
              <span className="mini-label">Current suburb</span>
              <p>{selectedSuburb.summary}</p>
            </div>
            <p className="hero-suburb-note">
              <span>Standout</span>
              <strong>{selectedSuburb.standoutFeature}</strong>
            </p>
            <SelectMenu
              label="Switch suburb"
              value={request.suburbId}
              title={selectedSuburb.name}
              detail={selectedSuburb.standoutFeature}
              options={suburbCatalog.map((suburb) => ({
                value: suburb.id,
                label: suburb.name,
                note: suburb.standoutFeature,
              }))}
              isOpen={openMenu === "suburb"}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === "suburb" ? null : "suburb",
                )
              }
              onChange={(next) => {
                updateRequest("suburbId", next);
                setOpenMenu(null);
              }}
            />
          </div>
        </div>
      </section>

      <section className="preset-rail">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="preset-tile"
            onClick={() => {
              setRequest(preset.request);
              setFibreBudget(
                getFibreBudgetForTier(preset.request.fibreTier ?? "none"),
              );
              setChildSetup(preset.childSetup);
              setChildDraft(preset.childSetup);
            }}
          >
            <span>{preset.label}</span>
            <small>{preset.subtitle}</small>
          </button>
        ))}
      </section>

      <section className="metro-grid">
        <div className="composer-stack">
          <section className="stack-card">
            <div className="card-header">
              <div>
                <p className="mini-label">Lifestyle</p>
                <h3>{selectedLifestyle.label}</h3>
              </div>
            </div>

            <SelectMenu
              label="Choose a lifestyle"
              value={request.lifestyleTier}
              title={selectedLifestyle.label}
              detail={selectedLifestyle.note}
              options={lifestyleOptions}
              isOpen={openMenu === "lifestyle"}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === "lifestyle" ? null : "lifestyle",
                )
              }
              onChange={(next) => {
                updateRequest("lifestyleTier", next);
                setOpenMenu(null);
              }}
            />
          </section>

          <section className="stack-card">
            <div className="card-header">
              <div>
                <p className="mini-label">Household</p>
                <h3>{summarizeHousehold(request)}</h3>
              </div>
            </div>
            <p className="card-copy household-summary">
              {summarizeHomeSetup(request)}
            </p>
            <div className="household-layout">
              <div className="household-group">
                <div className="household-group-head">
                  <strong>People</strong>
                  <span>Who are we budgeting for?</span>
                </div>
                <div className="household-grid">
                  <Stepper
                    label="Adults"
                    value={request.adults}
                    min={1}
                    max={6}
                    onChange={(value) => updateRequest("adults", value)}
                  />
                  <button
                    type="button"
                    className="child-trigger-card"
                    onClick={openChildModal}
                  >
                    <div className="child-trigger-top">
                      <span className="mini-label">Children</span>
                      <span className="child-trigger-action">
                        {request.children ? "Edit details" : "Add details"}
                      </span>
                    </div>
                    <strong>{request.children ?? 0}</strong>
                    <p>
                      {request.children
                        ? summarizeChildSetup(childSetup)
                        : "Add daycare or school costs so your estimate reflects family needs."}
                    </p>
                  </button>
                </div>
              </div>

              <div className="household-group">
                <div className="household-group-head">
                  <strong>Home</strong>
                  <span>Size the space you need</span>
                </div>
                <div className="household-grid">
                  <Stepper
                    label="Bedrooms"
                    value={request.bedrooms}
                    min={1}
                    max={6}
                    onChange={(value) => updateRequest("bedrooms", value)}
                  />
                  <Stepper
                    label="Parking"
                    value={request.parkingSpaces ?? 0}
                    min={0}
                    max={4}
                    onChange={(value) => updateRequest("parkingSpaces", value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <ChoiceChips
            label="Property style"
            value={request.propertyType ?? "any"}
            options={propertyOptions}
            onChange={(value) => updateRequest("propertyType", value)}
          />

          <ChoiceChips
            label="Work destination"
            value={request.workDestinationArea ?? "remote"}
            options={destinationOptions}
            onChange={(value) => updateRequest("workDestinationArea", value)}
          />

          <section className="stack-card">
            <div className="card-header">
              <div>
                <p className="mini-label">Mobility</p>
                <h3>Map your commute</h3>
              </div>
            </div>
            <div className="range-block">
              <div className="range-meta">
                <span>Commute days per week</span>
                <strong>{request.commuteDaysPerWeek ?? 0}</strong>
              </div>
              <input
                className="range-slider"
                type="range"
                min={0}
                max={7}
                value={request.commuteDaysPerWeek ?? 0}
                onChange={(event) =>
                  updateRequest(
                    "commuteDaysPerWeek",
                    Number(event.target.value),
                  )
                }
              />
            </div>
            <div className="range-block">
              <div className="range-meta">
                <span>Uber trips per month</span>
                <strong>{request.uberTripsPerMonth ?? 0}</strong>
              </div>
              <input
                className="range-slider"
                type="range"
                min={0}
                max={20}
                value={request.uberTripsPerMonth ?? 0}
                onChange={(event) =>
                  updateRequest("uberTripsPerMonth", Number(event.target.value))
                }
              />
            </div>
            <div className="switch-stack">
              <SwitchRow
                label="Include Uber"
                description="Add ride-hailing spend to the Cape Town monthly total."
                checked={request.usesUber ?? false}
                onChange={(value) => updateRequest("usesUber", value)}
              />
              <SwitchRow
                label="Include public transport"
                description="Useful when trains, taxis, or buses carry part of the trip."
                checked={request.usesPublicTransport ?? false}
                onChange={(value) =>
                  updateRequest("usesPublicTransport", value)
                }
              />
            </div>
          </section>

          <ChoiceChips
            label="Domestic help"
            value={request.domesticHelp ?? "none"}
            options={helpOptions}
            onChange={(value) => updateRequest("domesticHelp", value)}
          />

          <BudgetSlider
            label="Fibre budget"
            min={0}
            max={1500}
            step={50}
            value={fibreBudget}
            displayValue={formatCurrency(fibreBudget)}
            note={`${(request.fibreTier ?? "none").replaceAll("_", " ")} tier`}
            onChange={(next) => {
              setFibreBudget(next);
              updateRequest("fibreTier", getFibreTierForBudget(next));
            }}
          />

          <ChoiceChips
            label="Backup power"
            value={request.backupPower ?? "none"}
            options={backupOptions}
            onChange={(value) => updateRequest("backupPower", value)}
          />
        </div>

        <aside className="desktop-summary">
          {errorMessage ? (
            <div className="error-banner">{errorMessage}</div>
          ) : null}
          <div className="summary-card">
            <p className="eyebrow">Cape Town monthly cost</p>
            <h2>
              {result
                ? formatCurrency(result.monthly_cost.selected)
                : "Calculating..."}
            </h2>
            <p className="summary-subtitle">
              {result
                ? `${result.suburb} living cost based on your current rent, commute, and lifestyle picks`
                : "Building your first estimate"}
            </p>

            <div className="summary-pill-row">
              <span
                className={`affordability-chip is-${result?.affordability ?? "unknown"}`}
              >
                {result?.affordability ?? "pending"}
              </span>
              <span className="snapshot-pill">
                {result?.snapshot_version ?? "local dataset"}
              </span>
            </div>

            {result ? (
              <>
                <div className="hero-number-block">
                  <span>Expected range</span>
                  <strong>
                    {formatCurrency(result.monthly_cost.low)} to{" "}
                    {formatCurrency(result.monthly_cost.high)}
                  </strong>
                </div>

                <div className="metric-strip">
                  <article>
                    <span>Workable income</span>
                    <strong>
                      {formatCurrency(
                        result.salary_thresholds.workable_net_salary,
                      )}
                    </strong>
                  </article>
                  <article>
                    <span>Comfortable income</span>
                    <strong>
                      {formatCurrency(
                        result.salary_thresholds.comfortable_net_salary,
                      )}
                    </strong>
                  </article>
                </div>

                <div className="summary-list">
                  {categoryRows.slice(0, 5).map((row) => (
                    <div key={row.key} className="summary-row">
                      <span>{row.label}</span>
                      <strong>{formatCurrency(row.value)}</strong>
                    </div>
                  ))}
                </div>

                <div className="notes-card">
                  <p className="mini-label">Main cost drivers</p>
                  <ul>
                    {result.drivers.map((driver) => (
                      <li key={driver}>{driver}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </section>

      <div className={`bottom-sheet ${sheetOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="sheet-trigger"
          onClick={() => setSheetOpen((current) => !current)}
        >
          <div>
            <span className="sheet-label">
              {selectedSuburb.name} cost of living
            </span>
            <strong>
              {result
                ? formatCurrency(result.monthly_cost.selected)
                : "Calculating..."}
            </strong>
          </div>
        </button>

        <div className="sheet-body">
          {errorMessage ? (
            <div className="error-banner">{errorMessage}</div>
          ) : null}

          {result ? (
            <>
              <div className="sheet-metrics">
                <article>
                  <span>Expected range</span>
                  <strong>{formatCurrency(result.monthly_cost.low)}</strong>
                  <em>to {formatCurrency(result.monthly_cost.high)}</em>
                </article>
                <article>
                  <span>Workable income</span>
                  <strong>
                    {formatCurrency(
                      result.salary_thresholds.workable_net_salary,
                    )}
                  </strong>
                  <em>net salary</em>
                </article>
                <article>
                  <span>Comfortable income</span>
                  <strong>
                    {formatCurrency(
                      result.salary_thresholds.comfortable_net_salary,
                    )}
                  </strong>
                  <em>net salary</em>
                </article>
              </div>

              <div className="sheet-section">
                <p className="mini-label">Biggest monthly costs</p>
                <div className="compact-breakdown">
                  {categoryRows.slice(0, 5).map((row) => (
                    <div key={row.key} className="compact-breakdown-row">
                      <div className="compact-row-head">
                        <span>{row.label}</span>
                        <strong>{formatCurrency(row.value)}</strong>
                      </div>
                      <div className="compact-track">
                        <div style={{ width: row.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sheet-section">
                <p className="mini-label">Scenario assumptions</p>
                <div className="assumption-chip-row">
                  {assumptionRows.map((item) => (
                    <span key={item.label} className="assumption-chip">
                      {item.label}: <strong>{item.value}</strong>
                    </span>
                  ))}
                </div>
              </div>
              <div className="sheet-section">
                <p className="mini-label">Not included in this city cost</p>
                <div className="assumption-chip-row">
                  <span className="assumption-chip">
                    Medical aid <strong>excluded</strong>
                  </span>
                  <span className="assumption-chip">
                    Car ownership <strong>excluded</strong>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="sheet-placeholder">
              Your Cape Town estimate will appear here as soon as the scenario
              updates.
            </p>
          )}
        </div>
      </div>

      <footer className="trust-footer">
        <div className="trust-footer-grid">
          <section className="trust-card">
            <p className="mini-label">About us</p>
            <h3>zoba helps people plan real moves</h3>
            <p>
              zoba is a mobile-first cost-of-living planner built to help people
              estimate location-sensitive living costs in Cape Town before they
              rent, relocate, or change neighborhoods.
            </p>
          </section>

          <section className="trust-card">
            <p className="mini-label">Methodology</p>
            <h3>Modeled from local snapshot data</h3>
            <p>
              Estimates are generated from a locally hosted test dataset that
              combines suburb housing bands, commute assumptions, household
              rules, and scenario inputs. Values are modeled ranges, not quotes
              from a single vendor.
            </p>
          </section>

          <section className="trust-card">
            <p className="mini-label">Coverage</p>
            <h3>What the estimate includes</h3>
            <p>
              The current planner focuses on rent, transport, groceries,
              utilities, fibre, childcare or schooling, domestic help, and
              backup power where relevant to the selected suburb and household.
            </p>
          </section>

          <section className="trust-card">
            <p className="mini-label">Important note</p>
            <h3>This is guidance, not financial advice</h3>
            <p>
              Results are informational and should be validated against current
              listings, providers, schools, and your own budget before making a
              financial or relocation decision.
            </p>
          </section>
        </div>
      </footer>

      {childModalOpen ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setChildModalOpen(false)}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Children setup"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Children setup</p>
                <h2>What school stage should we price in?</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setChildModalOpen(false)}
              >
                Close
              </button>
            </div>

            <p className="modal-copy">
              We use this to estimate whether your Cape Town monthly cost is
              being shaped by daycare, school fees, or both.
            </p>

            <div className="modal-stepper-grid">
              <Stepper
                label="Daycare"
                value={childDraft.daycare}
                min={0}
                max={4}
                onChange={(value) =>
                  setChildDraft((current) => ({ ...current, daycare: value }))
                }
              />
              <Stepper
                label="Pre-school"
                value={childDraft.preschool}
                min={0}
                max={4}
                onChange={(value) =>
                  setChildDraft((current) => ({ ...current, preschool: value }))
                }
              />
              <Stepper
                label="Primary"
                value={childDraft.primary}
                min={0}
                max={4}
                onChange={(value) =>
                  setChildDraft((current) => ({ ...current, primary: value }))
                }
              />
              <Stepper
                label="High school"
                value={childDraft.highSchool}
                min={0}
                max={4}
                onChange={(value) =>
                  setChildDraft((current) => ({
                    ...current,
                    highSchool: value,
                  }))
                }
              />
            </div>

            {getChildTotal(childDraft) > 0 ? (
              <ChoiceChips
                label="School type"
                value={childDraft.schoolType}
                options={childSchoolOptions}
                onChange={(value) =>
                  setChildDraft((current) => ({
                    ...current,
                    schoolType: value,
                  }))
                }
              />
            ) : null}

            <div className="modal-footer">
              <div className="modal-summary">
                <span>Total children</span>
                <strong>{getChildTotal(childDraft)}</strong>
              </div>
              <button
                type="button"
                className="modal-apply"
                onClick={() => applyChildSetup(childDraft)}
              >
                Update children costs
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
