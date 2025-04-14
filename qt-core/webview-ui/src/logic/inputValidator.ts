// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";
import { vscodeApi } from "./vscodeApi";
import { MessageId } from "@shared/message";

// rule
export enum RuleId {
  NotEmpty,
  MinLength,
  MaxLength,
  RegexMatch,
  ValidFileName,
  ValidDirectoryName,
  DirectoryExists,
}

export type RuleParam<T = any> = T | (() => T);

export interface Rule {
  id: RuleId;
  param?: RuleParam;
}

export interface RuleCheckResult {
  id: RuleId;
  param: any;
  passed: boolean;
  error: string;
}

// validator
export enum ValidationPolicyFlags {
  TrimBeforeCheck,
  StopOnFirstFailure,
}

export type ValidationPolicySet = Set<ValidationPolicyFlags>;
export type ValidationErrorMessageOverrideFunc =  (rule: RuleCheckResult) => string | undefined;

export const DefaultValidationPolicySet = new Set([
  ValidationPolicyFlags.TrimBeforeCheck,
  ValidationPolicyFlags.StopOnFirstFailure
])

export interface ValidatorResult {
  passed: boolean;
  failedResults?: RuleCheckResult[];
}

export class Validator {
  private _rules: Rule[] = [];
  private _policies: ValidationPolicySet;
  private _errorMessageBuilder: ValidationErrorMessageOverrideFunc | undefined = undefined;

  constructor(rules: Rule[], policies?: ValidationPolicySet) {
    this._rules = rules;
    this._policies = policies ?? DefaultValidationPolicySet;
  }

  public addRule(rule: Rule) {
    this._rules.push(rule);
  }

  public addRuleFrom(id: RuleId, param?: RuleParam) {
    this._rules.push({ id, param });
  }

  public setRules(rules: Rule[]) {
    this._rules = rules;
  }

  public setPolicyEnabled(id: ValidationPolicyFlags, enabled: boolean) {
    if (enabled) {
      this._policies.add(id);
    } else {
      this._policies.delete(id);
    }
  }

  public setPolicySet(policies: Set<ValidationPolicyFlags>) {
    this._policies = policies
  }

  public setErrorMessageBuilder(f: ValidationErrorMessageOverrideFunc) {
    this._errorMessageBuilder = f;
  }

  public async run(data: string): Promise<ValidatorResult> {
    const preprocessedData = this._preprocessInputText(data);
    const failedResults = [];

    for (const rule of this._rules) {
      const checker = allRuleCheckFuncs[rule.id];
      const param = readParamValue(rule.param);
      const result = await checker(rule.id, param, preprocessedData);
      if (!result.passed) {
        failedResults.push(this._polishCheckResult(result));
        if (this._policies.has(ValidationPolicyFlags.StopOnFirstFailure)) {
          break;
        }
      }
    }

    const failed = (failedResults.length > 0);
    return {
      passed: !failed,
      failedResults: failed ? failedResults : undefined
    }
  }

  private _polishCheckResult(result: RuleCheckResult): RuleCheckResult {
    if (this._errorMessageBuilder) {
      const e = this._errorMessageBuilder(result);
      if (e) {
        result.error = e;
        return result;
      }
    }

    return result;
  }

  private _preprocessInputText(data: string): string {
    if (this._policies.has(ValidationPolicyFlags.TrimBeforeCheck)) {
      return data.trim();
    }

    return data;
  }
}

// rule checkers
type RuleCheckFunc = (id: RuleId, param: any, data: string) => Promise<RuleCheckResult>;
const allRuleCheckFuncs: Record<RuleId, RuleCheckFunc> = {
  [RuleId.NotEmpty]: checkNotEmpty,
  [RuleId.MinLength]: checkMinLength,
  [RuleId.MaxLength]: checkMaxLength,
  [RuleId.RegexMatch]: checkRegexMatch,
  [RuleId.ValidFileName]: notImplementedRule,
  [RuleId.ValidDirectoryName]: notImplementedRule,
  [RuleId.DirectoryExists]: checkDirectoryExists
}

function checkNotEmpty(id: RuleId, param: any, data: string) {
  return Promise.resolve({
    id,
    param,
    passed: data.length > 0,
    error: data.length > 0 ? "" : "This field is required"
  });
}

function checkMinLength(id: RuleId, param: any, data: string) {
  const criteria = _.toInteger(param);
  if (!param || (criteria <= 0)) {
    return invalidParamResult(id, param, data)
  }

  const passed = (data.length >= criteria);
  const error = passed ? "" : `Must have a minimum length of ${criteria}`
  return  Promise.resolve({ id, param, passed, error })
}

function checkMaxLength(id: RuleId, param: any, data: string) {
  const criteria = _.toInteger(readParamValue(param));
  if (!param || criteria <= 0) {
    return invalidParamResult(id, param)
  }

  const passed = (data.length <= criteria);
  const error = passed ? "" : `Max length is set to ${criteria}`
  return  Promise.resolve({ id, param, passed, error })
}

function checkRegexMatch(id: RuleId, param: any, data: string) {
  const pattern = _.toString(param);
  if (!param || pattern.length <= 0) {
    return invalidParamResult(id, param)
  }

  try {
    const regex = new RegExp(pattern);
    const passed = regex.test(data);
    const error = passed ? "" : `Not matched with the pattern`
    return Promise.resolve({ id, param, passed, error })
  } catch (e) {
    return invalidParamResult( id, param, "Invalid regex pattern")
  }
}

async function checkDirectoryExists(id: RuleId, param: any, data: string) {
  const absPath = _.toString(param);
  if (!param || absPath.length <= 0) {
    return invalidParamResult(id, param)
  }

  try {
    const res = await vscodeApi.request(MessageId.RequestCheckDirectoryExists, param)
    return Promise.resolve({ id, param, passed: res, error: "non existing" })
  } catch (e) {
    return invalidParamResult(id, param)
  }
}

// helpers
function notImplementedRule(id: RuleId, param: any, _: string) {
  return Promise.resolve({
    id, 
    param,
    passed: false,
    error: `Rule is not implemented: '${RuleId[id]}'`
  });
}

function invalidParamResult(id: RuleId, param: any, error?: string) {
  return Promise.resolve({
    id, 
    param,
    passed: false,
    error: error ?? `Invalid parameter on rule '${RuleId[id]}' with '${param}'`,
  });
}

function readParamValue(p: RuleParam) {
  if (typeof p === "function") {
    return (p as () => any)();
  }
  
  return p;
}

