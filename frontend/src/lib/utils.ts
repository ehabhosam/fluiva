import { PlanType } from "@/api/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// returns [blockUnit, periodUnit]
export function getUnitsFromPlanType(planType: PlanType): [string, string] {
  switch (planType) {
    case PlanType.DAILY:
      return ["hour", "day"];
    case PlanType.WEEKLY:
      return ["day", "week"];
    case PlanType.MONTHLY:
      return ["week", "month"];
  }

  throw new Error(`Unsupported plan type: ${planType}`);
}

export function divisor(total: number, value: number) {
  if (value <= 0) {
    throw new Error("Value must be greater than zero");
  }

  return Math.ceil(total / value);
}
