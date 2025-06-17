
import { useEffect } from 'react';
import { conditionEvaluator, createEvaluationContext } from '@/utils/conditionEvaluator';

interface WordPressBridgeProps {
  debugMode?: boolean;
  onEvaluationComplete?: (sectionId: string, visible: boolean) => void;
}

export const WordPressBridge = ({ debugMode = false, onEvaluationComplete }: WordPressBridgeProps) => {
  useEffect(() => {
    // Set debug mode
    conditionEvaluator.setDebugMode(debugMode);

    // Create global functions for WordPress to use
    (window as any).SmartSections = {
      // Main function for WordPress to evaluate a section
      evaluateSection: (sectionId: string, conditionGroups: any[]) => {
        const context = createEvaluationContext();
        const result = conditionEvaluator.evaluateSection(conditionGroups, context);
        
        if (onEvaluationComplete) {
          onEvaluationComplete(sectionId, result);
        }
        
        return result;
      },

      // Function to update user login status (called from WordPress)
      setUserLoginStatus: (isLoggedIn: boolean) => {
        (window as any).SmartSectionsUserLoggedIn = isLoggedIn;
      },

      // Function to get current evaluation context
      getEvaluationContext: () => {
        const context = createEvaluationContext();
        // Override login status if set by WordPress
        if (typeof (window as any).SmartSectionsUserLoggedIn !== 'undefined') {
          context.isLoggedIn = (window as any).SmartSectionsUserLoggedIn;
        }
        return context;
      },

      // Debug function
      enableDebug: (enabled: boolean) => {
        conditionEvaluator.setDebugMode(enabled);
      },

      // Test function for WordPress admin
      testConditions: (conditionGroups: any[], testContext?: any) => {
        const context = testContext || createEvaluationContext();
        return conditionEvaluator.evaluateSection(conditionGroups, context);
      }
    };

    // Initialize sections on page load
    const initializeSections = () => {
      const sections = document.querySelectorAll('[data-smart-section]');
      sections.forEach((section) => {
        const sectionId = section.getAttribute('data-smart-section-id');
        const conditionsData = section.getAttribute('data-smart-section-conditions');
        
        if (sectionId && conditionsData) {
          try {
            const conditionGroups = JSON.parse(conditionsData);
            const shouldShow = (window as any).SmartSections.evaluateSection(sectionId, conditionGroups);
            
            if (!shouldShow) {
              (section as HTMLElement).style.display = 'none';
            }
          } catch (error) {
            console.error('[Smart Sections] Error parsing conditions for section:', sectionId, error);
          }
        }
      });
    };

    // Run initialization
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSections);
    } else {
      initializeSections();
    }

    // Re-evaluate on page changes (for SPAs)
    const handlePageChange = () => {
      setTimeout(initializeSections, 100);
    };

    window.addEventListener('popstate', handlePageChange);
    
    return () => {
      window.removeEventListener('popstate', handlePageChange);
      document.removeEventListener('DOMContentLoaded', initializeSections);
    };
  }, [debugMode, onEvaluationComplete]);

  return null; // This component doesn't render anything
};
