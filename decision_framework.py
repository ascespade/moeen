#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
إطار اتخاذ القرارات الذكي
Smart Decision Making Framework
"""

import json
from datetime import datetime
from typing import Dict, List, Any, Optional

class SmartDecisionFramework:
    def __init__(self):
        self.decision_rules = self.load_decision_rules()
        self.context_history = []
        
    def load_decision_rules(self) -> Dict:
        """تحميل قواعد اتخاذ القرارات"""
        return {
            "autonomous_decisions": [
                "technology_selection",
                "performance_optimization", 
                "security_enhancement",
                "user_experience_improvement",
                "code_quality_improvement",
                "documentation_addition",
                "testing_implementation",
                "error_handling_enhancement",
                "accessibility_improvement",
                "responsive_design_optimization"
            ],
            "critical_decisions": [
                "major_requirement_change",
                "financial_impact",
                "project_strategy_change",
                "security_policy_change",
                "timeline_modification",
                "privacy_concerns",
                "architecture_change",
                "budget_allocation"
            ],
            "decision_weights": {
                "user_experience": 0.3,
                "performance": 0.25,
                "security": 0.2,
                "maintainability": 0.15,
                "scalability": 0.1
            }
        }
    
    def analyze_request(self, request: str, context: Dict = None) -> Dict:
        """تحليل الطلب واتخاذ القرار"""
        analysis = {
            "request_type": self.classify_request(request),
            "complexity_level": self.assess_complexity(request),
            "decision_type": self.determine_decision_type(request, context),
            "recommended_approach": self.get_recommended_approach(request),
            "autonomous_actions": self.get_autonomous_actions(request),
            "requires_approval": self.requires_user_approval(request, context)
        }
        
        return analysis
    
    def classify_request(self, request: str) -> str:
        """تصنيف نوع الطلب"""
        request_lower = request.lower()
        
        if any(word in request_lower for word in ["add", "create", "build", "implement"]):
            return "creation"
        elif any(word in request_lower for word in ["fix", "repair", "debug", "error"]):
            return "fix"
        elif any(word in request_lower for word in ["optimize", "improve", "enhance", "speed"]):
            return "optimization"
        elif any(word in request_lower for word in ["change", "modify", "update", "replace"]):
            return "modification"
        else:
            return "general"
    
    def assess_complexity(self, request: str) -> str:
        """تقييم مستوى التعقيد"""
        complexity_indicators = {
            "simple": ["add button", "change color", "fix typo"],
            "medium": ["create form", "add validation", "implement feature"],
            "complex": ["refactor", "architecture", "security", "performance"],
            "critical": ["database", "authentication", "payment", "api"]
        }
        
        request_lower = request.lower()
        
        for level, indicators in complexity_indicators.items():
            if any(indicator in request_lower for indicator in indicators):
                return level
        
        return "medium"
    
    def determine_decision_type(self, request: str, context: Dict = None) -> str:
        """تحديد نوع القرار"""
        if self.is_autonomous_decision(request):
            return "autonomous"
        elif self.is_critical_decision(request, context):
            return "critical"
        else:
            return "standard"
    
    def is_autonomous_decision(self, request: str) -> bool:
        """تحديد إذا كان القرار يمكن اتخاذه بشكل مستقل"""
        request_lower = request.lower()
        
        autonomous_keywords = [
            "optimize", "improve", "enhance", "add feature", 
            "fix bug", "refactor", "clean code", "add validation",
            "improve performance", "add error handling"
        ]
        
        return any(keyword in request_lower for keyword in autonomous_keywords)
    
    def is_critical_decision(self, request: str, context: Dict = None) -> bool:
        """تحديد إذا كان القرار حرج ويتطلب موافقة"""
        request_lower = request.lower()
        
        critical_keywords = [
            "delete", "remove", "destroy", "drop database",
            "change password", "security", "payment", "money",
            "user data", "privacy", "confidential"
        ]
        
        return any(keyword in request_lower for keyword in critical_keywords)
    
    def get_recommended_approach(self, request: str) -> Dict:
        """الحصول على النهج الموصى به"""
        request_type = self.classify_request(request)
        complexity = self.assess_complexity(request)
        
        approaches = {
            "creation": {
                "simple": "implement_with_enhancements",
                "medium": "implement_with_optimizations", 
                "complex": "implement_with_architecture_considerations",
                "critical": "implement_with_security_focus"
            },
            "fix": {
                "simple": "quick_fix_with_prevention",
                "medium": "comprehensive_fix_with_testing",
                "complex": "root_cause_analysis_with_systematic_fix",
                "critical": "immediate_fix_with_monitoring"
            },
            "optimization": {
                "simple": "performance_optimization",
                "medium": "comprehensive_optimization",
                "complex": "system_wide_optimization",
                "critical": "critical_performance_optimization"
            }
        }
        
        return approaches.get(request_type, {}).get(complexity, "standard_implementation")
    
    def get_autonomous_actions(self, request: str) -> List[str]:
        """الحصول على الإجراءات المستقلة"""
        actions = []
        
        # إجراءات عامة
        actions.extend([
            "add_error_handling",
            "improve_performance", 
            "enhance_security",
            "add_documentation",
            "improve_user_experience"
        ])
        
        # إجراءات محددة حسب الطلب
        if "button" in request.lower():
            actions.extend([
                "add_hover_effects",
                "add_loading_states",
                "add_accessibility",
                "add_keyboard_shortcuts"
            ])
        
        if "form" in request.lower():
            actions.extend([
                "add_validation",
                "add_auto_save",
                "add_progress_indicator",
                "add_responsive_design"
            ])
        
        if "api" in request.lower():
            actions.extend([
                "add_rate_limiting",
                "add_caching",
                "add_monitoring",
                "add_documentation"
            ])
        
        return actions
    
    def requires_user_approval(self, request: str, context: Dict = None) -> bool:
        """تحديد إذا كان الطلب يتطلب موافقة المستخدم"""
        return self.is_critical_decision(request, context)
    
    def make_autonomous_decision(self, request: str, context: Dict = None) -> Dict:
        """اتخاذ قرار مستقل"""
        analysis = self.analyze_request(request, context)
        
        decision = {
            "action": "proceed_autonomously",
            "approach": analysis["recommended_approach"],
            "autonomous_actions": analysis["autonomous_actions"],
            "estimated_time": self.estimate_time(request),
            "confidence_level": self.calculate_confidence(request),
            "reasoning": self.generate_reasoning(request, analysis)
        }
        
        return decision
    
    def estimate_time(self, request: str) -> str:
        """تقدير الوقت المطلوب"""
        complexity = self.assess_complexity(request)
        
        time_estimates = {
            "simple": "1-5 minutes",
            "medium": "5-15 minutes", 
            "complex": "15-30 minutes",
            "critical": "30+ minutes"
        }
        
        return time_estimates.get(complexity, "5-15 minutes")
    
    def calculate_confidence(self, request: str) -> float:
        """حساب مستوى الثقة"""
        base_confidence = 0.8
        
        # زيادة الثقة للطلبات البسيطة
        if self.assess_complexity(request) == "simple":
            base_confidence += 0.1
        
        # تقليل الثقة للطلبات الحرجة
        if self.is_critical_decision(request):
            base_confidence -= 0.2
        
        return min(1.0, max(0.0, base_confidence))
    
    def generate_reasoning(self, request: str, analysis: Dict) -> str:
        """توليد التبرير للقرار"""
        reasoning_parts = []
        
        # تبرير النهج
        reasoning_parts.append(f"بناءً على تحليل الطلب، النهج الموصى به هو: {analysis['recommended_approach']}")
        
        # تبرير الإجراءات المستقلة
        if analysis["autonomous_actions"]:
            reasoning_parts.append(f"سأقوم تلقائياً بـ: {', '.join(analysis['autonomous_actions'][:3])}")
        
        # تبرير عدم الحاجة للموافقة
        if not analysis["requires_approval"]:
            reasoning_parts.append("هذا القرار لا يتطلب موافقة إضافية")
        
        return " ".join(reasoning_parts)

# استخدام المثال
def test_decision_framework():
    """اختبار إطار اتخاذ القرارات"""
    framework = SmartDecisionFramework()
    
    # اختبار طلبات مختلفة
    test_requests = [
        "أضف زر حفظ",
        "حسن أداء الموقع", 
        "أضف نظام تسجيل الدخول",
        "احذف قاعدة البيانات"
    ]
    
    for request in test_requests:
        print(f"\n🔍 تحليل الطلب: {request}")
        analysis = framework.analyze_request(request)
        
        print(f"📊 النوع: {analysis['request_type']}")
        print(f"📈 التعقيد: {analysis['complexity_level']}")
        print(f"🎯 القرار: {analysis['decision_type']}")
        print(f"⚡ النهج: {analysis['recommended_approach']}")
        print(f"🤖 الإجراءات المستقلة: {len(analysis['autonomous_actions'])}")
        print(f"❓ يتطلب موافقة: {analysis['requires_approval']}")

if __name__ == "__main__":
    test_decision_framework()
