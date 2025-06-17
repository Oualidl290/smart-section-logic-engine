
/**
 * Smart Sections WordPress Plugin JavaScript
 * This file should be included in your WordPress plugin
 */

(function() {
  'use strict';

  // Condition Evaluator Class (simplified version for WordPress)
  class SmartSectionsEvaluator {
    constructor(debugMode = false) {
      this.debug = debugMode;
      this.log('Smart Sections initialized');
    }

    log(message, data = null) {
      if (this.debug) {
        console.log('[Smart Sections]', message, data);
      }
    }

    // Main evaluation function
    evaluateSection(conditionGroups, context) {
      if (!conditionGroups || conditionGroups.length === 0) {
        return true; // No conditions = always show
      }

      // Handle legacy format
      if (conditionGroups.logic && conditionGroups.rules) {
        conditionGroups = [{
          logic: conditionGroups.logic,
          conditions: conditionGroups.rules,
          enabled: true
        }];
      }

      // Handle new format
      if (conditionGroups.groups) {
        conditionGroups = conditionGroups.groups;
      }

      // Evaluate each group (AND logic between groups)
      for (const group of conditionGroups) {
        if (!group.enabled) continue;
        
        const groupResult = this.evaluateGroup(group, context);
        if (!groupResult) {
          this.log('Group evaluation failed', group);
          return false;
        }
      }

      this.log('All groups passed');
      return true;
    }

    evaluateGroup(group, context) {
      const results = [];
      
      for (const condition of group.conditions) {
        if (!condition.enabled) continue;
        
        const result = this.evaluateCondition(condition, context);
        results.push(result);
        this.log(`Condition result: ${condition.type} ${condition.operator} ${condition.value} = ${result}`);
      }

      if (results.length === 0) return true;

      if (group.logic === 'AND') {
        return results.every(r => r);
      } else {
        return results.some(r => r);
      }
    }

    evaluateCondition(condition, context) {
      try {
        switch (condition.type) {
          case 'page_url':
            return this.evaluateUrlCondition(condition, context.url);
          case 'device':
            return this.evaluateDeviceCondition(condition, context.device);
          case 'browser':
            return this.evaluateBrowserCondition(condition, context.browser);
          case 'language':
            return this.evaluateLanguageCondition(condition, context.language);
          case 'referrer':
            return this.evaluateReferrerCondition(condition, context.referrer);
          case 'date_time':
            return this.evaluateTimeCondition(condition, context.currentTime);
          case 'user_status':
            return this.evaluateUserStatusCondition(condition, context.isLoggedIn);
          case 'elementor_mode':
            return context.isElementorEditMode;
          case 'custom_js':
            return this.evaluateCustomJSCondition(condition, context);
          default:
            this.log('Unknown condition type:', condition.type);
            return false;
        }
      } catch (error) {
        this.log('Error evaluating condition:', error);
        return false;
      }
    }

    evaluateUrlCondition(condition, url) {
      const value = condition.value;
      switch (condition.operator) {
        case 'is': return url === value;
        case 'contains': return url.includes(value);
        case 'starts_with': return url.startsWith(value);
        case 'ends_with': return url.endsWith(value);
        default: return false;
      }
    }

    evaluateDeviceCondition(condition, device) {
      const value = condition.value.toLowerCase();
      switch (condition.operator) {
        case 'is': return device.toLowerCase() === value;
        case 'is_not': return device.toLowerCase() !== value;
        default: return false;
      }
    }

    evaluateBrowserCondition(condition, browser) {
      const value = condition.value.toLowerCase();
      switch (condition.operator) {
        case 'is': return browser.toLowerCase() === value;
        case 'is_not': return browser.toLowerCase() !== value;
        default: return false;
      }
    }

    evaluateLanguageCondition(condition, language) {
      const value = condition.value.toLowerCase();
      switch (condition.operator) {
        case 'is': return language.toLowerCase() === value;
        case 'is_not': return language.toLowerCase() !== value;
        default: return false;
      }
    }

    evaluateReferrerCondition(condition, referrer) {
      const value = condition.value;
      switch (condition.operator) {
        case 'contains': return referrer.includes(value);
        case 'is': return referrer === value;
        case 'starts_with': return referrer.startsWith(value);
        default: return false;
      }
    }

    evaluateTimeCondition(condition, currentTime) {
      const value = condition.value;
      switch (condition.operator) {
        case 'between_times':
          const [startTime, endTime] = value.split('-');
          const current = this.timeToMinutes(currentTime);
          const start = this.timeToMinutes(startTime);
          const end = this.timeToMinutes(endTime);
          return current >= start && current <= end;
        default:
          return false;
      }
    }

    evaluateUserStatusCondition(condition, isLoggedIn) {
      switch (condition.operator) {
        case 'is_logged_in': return isLoggedIn;
        case 'is_not_logged_in': return !isLoggedIn;
        default: return false;
      }
    }

    evaluateCustomJSCondition(condition, context) {
      try {
        const jsCode = condition.value;
        const func = new Function('context', 'window', 'document', jsCode);
        return Boolean(func(context, window, document));
      } catch (error) {
        this.log('Custom JS error:', error);
        return false;
      }
    }

    timeToMinutes(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    }
  }

  // Device Detection
  function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      return 'mobile';
    } else if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) {
      return 'tablet';
    }
    return 'desktop';
  }

  // Browser Detection
  function detectBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('chrome') && !ua.includes('edge')) return 'chrome';
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
    if (ua.includes('edge')) return 'edge';
    return 'unknown';
  }

  // Create evaluation context
  function createContext() {
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
      isLoggedIn: window.SmartSectionsUserLoggedIn || false,
      isElementorEditMode: window.location.href.includes('elementor-preview'),
      userAgent: navigator.userAgent
    };
  }

  // Initialize Smart Sections
  function initializeSmartSections() {
    const debugMode = window.SmartSectionsDebug || false;
    const evaluator = new SmartSectionsEvaluator(debugMode);
    const context = createContext();

    // Find all smart sections
    const sections = document.querySelectorAll('[data-smart-section-conditions]');
    
    sections.forEach(section => {
      try {
        const conditionsData = section.getAttribute('data-smart-section-conditions');
        const sectionId = section.getAttribute('data-smart-section-id') || 'unknown';
        
        if (conditionsData) {
          const conditions = JSON.parse(conditionsData);
          const shouldShow = evaluator.evaluateSection(conditions, context);
          
          if (!shouldShow) {
            section.style.display = 'none';
            evaluator.log(`Section ${sectionId} hidden`);
          } else {
            evaluator.log(`Section ${sectionId} visible`);
          }
        }
      } catch (error) {
        console.error('[Smart Sections] Error processing section:', error);
      }
    });
  }

  // WordPress integration
  window.SmartSections = {
    init: initializeSmartSections,
    evaluator: SmartSectionsEvaluator,
    setUserLoginStatus: function(isLoggedIn) {
      window.SmartSectionsUserLoggedIn = isLoggedIn;
    },
    enableDebug: function(enabled) {
      window.SmartSectionsDebug = enabled;
    }
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSmartSections);
  } else {
    initializeSmartSections();
  }

  // Re-evaluate on page changes
  window.addEventListener('popstate', function() {
    setTimeout(initializeSmartSections, 100);
  });

})();
