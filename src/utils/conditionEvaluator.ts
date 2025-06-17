
interface Condition {
  type: string;
  operator: string;
  value: string | string[] | boolean;
  enabled?: boolean;
}

interface ConditionGroup {
  logic: "AND" | "OR";
  conditions: Condition[];
  enabled?: boolean;
}

interface EvaluationContext {
  url: string;
  device: string;
  browser: string;
  language: string;
  referrer: string;
  currentTime: string;
  isLoggedIn: boolean;
  isElementorEditMode: boolean;
  userAgent: string;
}

interface EvaluationResult {
  passed: boolean;
  details: {
    condition: Condition;
    result: boolean;
    reason: string;
  }[];
}

export class ConditionEvaluator {
  private debug: boolean = false;

  constructor(debugMode: boolean = false) {
    this.debug = debugMode;
  }

  setDebugMode(enabled: boolean) {
    this.debug = enabled;
  }

  // Main evaluation function for a single condition
  evaluateCondition(condition: Condition, context: EvaluationContext): { result: boolean; reason: string } {
    if (!condition.enabled) {
      return { result: true, reason: "Condition disabled" };
    }

    let result = false;
    let reason = "";

    try {
      switch (condition.type) {
        case "page_url":
          result = this.evaluateUrlCondition(condition, context.url);
          reason = `URL ${condition.operator} "${condition.value}": ${result}`;
          break;

        case "device":
          result = this.evaluateDeviceCondition(condition, context.device);
          reason = `Device ${condition.operator} "${condition.value}": ${result}`;
          break;

        case "browser":
          result = this.evaluateBrowserCondition(condition, context.browser);
          reason = `Browser ${condition.operator} "${condition.value}": ${result}`;
          break;

        case "language":
          result = this.evaluateLanguageCondition(condition, context.language);
          reason = `Language ${condition.operator} "${condition.value}": ${result}`;
          break;

        case "referrer":
          result = this.evaluateReferrerCondition(condition, context.referrer);
          reason = `Referrer ${condition.operator} "${condition.value}": ${result}`;
          break;

        case "date_time":
          result = this.evaluateTimeCondition(condition, context.currentTime);
          reason = `Time ${condition.operator} "${condition.value}": ${result}`;
          break;

        case "user_status":
          result = this.evaluateUserStatusCondition(condition, context.isLoggedIn);
          reason = `User ${condition.operator}: ${result}`;
          break;

        case "elementor_mode":
          result = this.evaluateElementorModeCondition(condition, context.isElementorEditMode);
          reason = `Elementor edit mode: ${result}`;
          break;

        case "custom_js":
          result = this.evaluateCustomJSCondition(condition, context);
          reason = `Custom JS condition: ${result}`;
          break;

        default:
          result = false;
          reason = `Unknown condition type: ${condition.type}`;
      }

      if (this.debug) {
        console.log(`[Smart Sections] Condition evaluated:`, {
          type: condition.type,
          operator: condition.operator,
          value: condition.value,
          result,
          reason
        });
      }

      return { result, reason };
    } catch (error) {
      const errorReason = `Error evaluating condition: ${error}`;
      if (this.debug) {
        console.error(`[Smart Sections] ${errorReason}`, condition);
      }
      return { result: false, reason: errorReason };
    }
  }

  private evaluateUrlCondition(condition: Condition, url: string): boolean {
    const value = condition.value as string;
    switch (condition.operator) {
      case "is":
        return url === value;
      case "contains":
        return url.includes(value);
      case "starts_with":
        return url.startsWith(value);
      case "ends_with":
        return url.endsWith(value);
      default:
        return false;
    }
  }

  private evaluateDeviceCondition(condition: Condition, device: string): boolean {
    const value = condition.value as string;
    switch (condition.operator) {
      case "is":
        return device.toLowerCase() === value.toLowerCase();
      case "is_not":
        return device.toLowerCase() !== value.toLowerCase();
      default:
        return false;
    }
  }

  private evaluateBrowserCondition(condition: Condition, browser: string): boolean {
    const value = condition.value as string;
    switch (condition.operator) {
      case "is":
        return browser.toLowerCase() === value.toLowerCase();
      case "is_not":
        return browser.toLowerCase() !== value.toLowerCase();
      default:
        return false;
    }
  }

  private evaluateLanguageCondition(condition: Condition, language: string): boolean {
    const value = condition.value as string;
    switch (condition.operator) {
      case "is":
        return language.toLowerCase() === value.toLowerCase();
      case "is_not":
        return language.toLowerCase() !== value.toLowerCase();
      default:
        return false;
    }
  }

  private evaluateReferrerCondition(condition: Condition, referrer: string): boolean {
    const value = condition.value as string;
    switch (condition.operator) {
      case "contains":
        return referrer.includes(value);
      case "is":
        return referrer === value;
      case "starts_with":
        return referrer.startsWith(value);
      default:
        return false;
    }
  }

  private evaluateTimeCondition(condition: Condition, currentTime: string): boolean {
    const value = condition.value as string;
    const currentHour = parseInt(currentTime.split(':')[0]);
    const currentMinute = parseInt(currentTime.split(':')[1]);
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    switch (condition.operator) {
      case "between_times":
        const [startTime, endTime] = value.split('-');
        const startHour = parseInt(startTime.split(':')[0]);
        const startMinute = parseInt(startTime.split(':')[1]);
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);
        
        const startTimeMinutes = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;
        
        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
      default:
        return false;
    }
  }

  private evaluateUserStatusCondition(condition: Condition, isLoggedIn: boolean): boolean {
    switch (condition.operator) {
      case "is_logged_in":
        return isLoggedIn;
      case "is_not_logged_in":
        return !isLoggedIn;
      default:
        return false;
    }
  }

  private evaluateElementorModeCondition(condition: Condition, isElementorEditMode: boolean): boolean {
    return isElementorEditMode;
  }

  private evaluateCustomJSCondition(condition: Condition, context: EvaluationContext): boolean {
    try {
      const jsCode = condition.value as string;
      // Create a safe evaluation context
      const evaluationFunction = new Function('context', 'window', 'document', jsCode);
      return Boolean(evaluationFunction(context, window, document));
    } catch (error) {
      if (this.debug) {
        console.error('[Smart Sections] Custom JS evaluation error:', error);
      }
      return false;
    }
  }

  // Evaluate a group of conditions with AND/OR logic
  evaluateConditionGroup(group: ConditionGroup, context: EvaluationContext): EvaluationResult {
    if (!group.enabled) {
      return {
        passed: true,
        details: []
      };
    }

    const results: { condition: Condition; result: boolean; reason: string; }[] = [];
    
    for (const condition of group.conditions) {
      const evaluation = this.evaluateCondition(condition, context);
      results.push({
        condition,
        result: evaluation.result,
        reason: evaluation.reason
      });
    }

    let groupResult: boolean;
    if (group.logic === "AND") {
      groupResult = results.every(r => r.result);
    } else {
      groupResult = results.some(r => r.result);
    }

    if (this.debug) {
      console.log(`[Smart Sections] Group (${group.logic}) result:`, {
        logic: group.logic,
        passed: groupResult,
        details: results
      });
    }

    return {
      passed: groupResult,
      details: results
    };
  }

  // Main function to evaluate all condition groups for a section
  evaluateSection(conditionGroups: ConditionGroup[], context: EvaluationContext): boolean {
    if (!conditionGroups || conditionGroups.length === 0) {
      return true; // No conditions = always show
    }

    // All groups must pass (AND logic between groups)
    for (const group of conditionGroups) {
      const groupResult = this.evaluateConditionGroup(group, context);
      if (!groupResult.passed) {
        if (this.debug) {
          console.log('[Smart Sections] Section evaluation failed at group:', group);
        }
        return false;
      }
    }

    if (this.debug) {
      console.log('[Smart Sections] Section evaluation passed all groups');
    }
    return true;
  }
}

// Helper function to detect device type
export function detectDevice(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad|android(?!.*mobile)/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// Helper function to detect browser
export function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
    return 'chrome';
  } else if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  } else if (userAgent.includes('edge')) {
    return 'edge';
  } else {
    return 'unknown';
  }
}

// Helper function to create evaluation context from current environment
export function createEvaluationContext(): EvaluationContext {
  return {
    url: window.location.pathname,
    device: detectDevice(),
    browser: detectBrowser(),
    language: navigator.language.split('-')[0],
    referrer: document.referrer,
    currentTime: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    isLoggedIn: false, // This would need to be set by WordPress
    isElementorEditMode: window.location.href.includes('elementor-preview'),
    userAgent: navigator.userAgent
  };
}

// Export the main evaluator instance
export const conditionEvaluator = new ConditionEvaluator();
