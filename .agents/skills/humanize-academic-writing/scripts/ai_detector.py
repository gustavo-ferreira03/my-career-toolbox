#!/usr/bin/env python3
"""
AI Writing Pattern Detector for Academic Text

Detects common patterns that indicate AI-generated academic writing:
- Repetitive sentence structures
- Overused transition words
- Abstract placeholder language
- Low vocabulary diversity
- Mechanical paragraph patterns
"""

import re
import sys
import json
import argparse
from collections import Counter
from typing import List, Dict, Tuple
import statistics


class AIDetector:
    """Detects AI writing patterns in academic text."""
    
    # Common AI transition words that appear at sentence starts
    AI_TRANSITIONS = [
        'moreover', 'furthermore', 'additionally', 'in addition',
        'it is important to note that', 'it should be noted that',
        'it is worth noting that', 'notably', 'significantly'
    ]
    
    # Abstract placeholder phrases common in AI writing
    ABSTRACT_PHRASES = [
        'various aspects', 'multiple factors', 'different perspectives',
        'in terms of', 'with regard to', 'with respect to',
        'it can be seen that', 'it has been shown that',
        'plays an important role', 'plays a crucial role',
        'serves as', 'acts as', 'functions as'
    ]
    
    # Passive voice markers
    PASSIVE_MARKERS = [
        'is', 'are', 'was', 'were', 'been', 'be', 'being'
    ]
    
    def __init__(self, text: str):
        """Initialize with text to analyze."""
        self.text = text
        self.paragraphs = self._split_paragraphs()
        self.sentences = self._split_sentences()
        
    def _split_paragraphs(self) -> List[str]:
        """Split text into paragraphs."""
        paragraphs = [p.strip() for p in self.text.split('\n\n') if p.strip()]
        if not paragraphs:
            # If no double newlines, treat whole text as one paragraph
            paragraphs = [self.text.strip()]
        return paragraphs
    
    def _split_sentences(self) -> List[str]:
        """Split text into sentences."""
        # Simple sentence splitter (improved regex)
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', self.text)
        return [s.strip() for s in sentences if s.strip()]
    
    def analyze_sentence_uniformity(self) -> Dict:
        """Detect if sentences have uniform length (AI pattern)."""
        if len(self.sentences) < 3:
            return {'score': 0, 'details': 'Too few sentences to analyze'}
        
        word_counts = [len(s.split()) for s in self.sentences]
        avg_length = statistics.mean(word_counts)
        std_dev = statistics.stdev(word_counts) if len(word_counts) > 1 else 0
        
        # Low variance indicates AI (variance < 20% of mean)
        variance_ratio = std_dev / avg_length if avg_length > 0 else 0
        
        # AI typically has variance_ratio < 0.3
        if variance_ratio < 0.25:
            score = 0.8
            issue = 'high_uniformity'
        elif variance_ratio < 0.35:
            score = 0.5
            issue = 'moderate_uniformity'
        else:
            score = 0.1
            issue = 'good_variation'
        
        return {
            'score': score,
            'avg_length': round(avg_length, 1),
            'std_dev': round(std_dev, 1),
            'variance_ratio': round(variance_ratio, 2),
            'issue': issue,
            'details': f'Avg sentence length: {avg_length:.1f} words, Std dev: {std_dev:.1f} (variance ratio: {variance_ratio:.2f})'
        }
    
    def detect_transition_overuse(self) -> Dict:
        """Detect overuse of mechanical AI transition words."""
        sentence_starts = [s.lower()[:50] for s in self.sentences]
        
        transition_count = 0
        found_transitions = []
        
        for start in sentence_starts:
            for trans in self.AI_TRANSITIONS:
                if start.startswith(trans):
                    transition_count += 1
                    found_transitions.append(trans)
                    break
        
        # Calculate percentage
        transition_pct = (transition_count / len(self.sentences)) * 100 if self.sentences else 0
        
        # AI typically has >20% sentences starting with these
        if transition_pct > 25:
            score = 0.9
            issue = 'excessive_transitions'
        elif transition_pct > 15:
            score = 0.6
            issue = 'high_transitions'
        elif transition_pct > 8:
            score = 0.3
            issue = 'moderate_transitions'
        else:
            score = 0.1
            issue = 'appropriate_transitions'
        
        return {
            'score': score,
            'count': transition_count,
            'percentage': round(transition_pct, 1),
            'found': found_transitions,
            'issue': issue,
            'details': f'{transition_count} sentences ({transition_pct:.1f}%) start with mechanical transitions'
        }
    
    def detect_abstract_language(self) -> Dict:
        """Detect overuse of abstract placeholder phrases."""
        text_lower = self.text.lower()
        
        found_phrases = []
        total_count = 0
        
        for phrase in self.ABSTRACT_PHRASES:
            count = text_lower.count(phrase)
            if count > 0:
                found_phrases.append((phrase, count))
                total_count += count
        
        # Calculate density (phrases per 100 words)
        word_count = len(self.text.split())
        density = (total_count / word_count) * 100 if word_count > 0 else 0
        
        # AI typically has density > 1.5
        if density > 2.0:
            score = 0.9
            issue = 'excessive_abstraction'
        elif density > 1.0:
            score = 0.6
            issue = 'high_abstraction'
        elif density > 0.5:
            score = 0.3
            issue = 'moderate_abstraction'
        else:
            score = 0.1
            issue = 'appropriate_specificity'
        
        return {
            'score': score,
            'total_count': total_count,
            'density': round(density, 2),
            'found': found_phrases,
            'issue': issue,
            'details': f'{total_count} abstract phrases found (density: {density:.2f} per 100 words)'
        }
    
    def calculate_vocabulary_diversity(self) -> Dict:
        """Calculate Type-Token Ratio (vocabulary diversity)."""
        # Tokenize and clean
        words = re.findall(r'\b[a-z]+\b', self.text.lower())
        
        if len(words) < 10:
            return {'score': 0, 'details': 'Too few words to analyze'}
        
        unique_words = set(words)
        ttr = len(unique_words) / len(words)
        
        # AI typically has TTR < 0.45 for academic text
        if ttr < 0.40:
            score = 0.8
            issue = 'low_diversity'
        elif ttr < 0.50:
            score = 0.5
            issue = 'moderate_diversity'
        else:
            score = 0.2
            issue = 'good_diversity'
        
        return {
            'score': score,
            'ttr': round(ttr, 3),
            'unique_words': len(unique_words),
            'total_words': len(words),
            'issue': issue,
            'details': f'Type-Token Ratio: {ttr:.3f} ({len(unique_words)} unique / {len(words)} total)'
        }
    
    def detect_passive_voice_overuse(self) -> Dict:
        """Detect excessive passive voice (common in AI academic writing)."""
        # Simple passive detection: look for "be" verbs + past participle patterns
        passive_patterns = [
            r'\b(is|are|was|were|been|be|being)\s+\w+ed\b',
            r'\b(is|are|was|were|been|be|being)\s+(shown|demonstrated|observed|found|noted|seen|considered|analyzed)\b'
        ]
        
        passive_count = 0
        for pattern in passive_patterns:
            passive_count += len(re.findall(pattern, self.text.lower()))
        
        # Calculate percentage relative to total sentences
        passive_pct = (passive_count / len(self.sentences)) * 100 if self.sentences else 0
        
        # AI often uses passive in >40% of sentences
        if passive_pct > 50:
            score = 0.7
            issue = 'excessive_passive'
        elif passive_pct > 35:
            score = 0.5
            issue = 'high_passive'
        elif passive_pct > 20:
            score = 0.2
            issue = 'moderate_passive'
        else:
            score = 0.1
            issue = 'appropriate_voice_mix'
        
        return {
            'score': score,
            'count': passive_count,
            'percentage': round(passive_pct, 1),
            'issue': issue,
            'details': f'{passive_count} passive constructions detected ({passive_pct:.1f}% of sentences)'
        }
    
    def analyze_paragraph_patterns(self) -> Dict:
        """Detect repetitive paragraph opening patterns."""
        if len(self.paragraphs) < 3:
            return {'score': 0, 'details': 'Too few paragraphs to analyze'}
        
        # Extract first sentence of each paragraph
        para_starts = []
        for para in self.paragraphs:
            sentences = re.split(r'(?<=[.!?])\s+', para)
            if sentences:
                para_starts.append(sentences[0].lower()[:30])
        
        # Check for similar starts
        similar_count = 0
        for i in range(len(para_starts)):
            for j in range(i + 1, len(para_starts)):
                # Check if starts are very similar (first 20 chars)
                if para_starts[i][:20] == para_starts[j][:20]:
                    similar_count += 1
        
        similarity_ratio = similar_count / len(self.paragraphs) if self.paragraphs else 0
        
        if similarity_ratio > 0.3:
            score = 0.7
            issue = 'repetitive_openings'
        elif similarity_ratio > 0.15:
            score = 0.4
            issue = 'some_repetition'
        else:
            score = 0.1
            issue = 'varied_openings'
        
        return {
            'score': score,
            'similar_count': similar_count,
            'total_paragraphs': len(self.paragraphs),
            'issue': issue,
            'details': f'{similar_count} similar paragraph openings detected among {len(self.paragraphs)} paragraphs'
        }
    
    def calculate_overall_score(self, metrics: Dict) -> float:
        """Calculate overall AI probability score (0-1)."""
        # Weight different metrics
        weights = {
            'sentence_uniformity': 0.25,
            'transition_overuse': 0.20,
            'abstract_language': 0.20,
            'vocabulary_diversity': 0.15,
            'passive_voice': 0.10,
            'paragraph_patterns': 0.10
        }
        
        weighted_score = 0
        for key, weight in weights.items():
            if key in metrics and 'score' in metrics[key]:
                weighted_score += metrics[key]['score'] * weight
        
        return weighted_score
    
    def analyze(self) -> Dict:
        """Run full analysis and return results."""
        metrics = {
            'sentence_uniformity': self.analyze_sentence_uniformity(),
            'transition_overuse': self.detect_transition_overuse(),
            'abstract_language': self.detect_abstract_language(),
            'vocabulary_diversity': self.calculate_vocabulary_diversity(),
            'passive_voice': self.detect_passive_voice_overuse(),
            'paragraph_patterns': self.analyze_paragraph_patterns()
        }
        
        overall_score = self.calculate_overall_score(metrics)
        
        # Determine AI probability level
        if overall_score > 0.7:
            probability = 'Very High'
            recommendation = 'Text shows strong AI patterns. Significant rewriting recommended.'
        elif overall_score > 0.5:
            probability = 'High'
            recommendation = 'Text shows multiple AI patterns. Rewriting recommended.'
        elif overall_score > 0.35:
            probability = 'Moderate'
            recommendation = 'Text shows some AI patterns. Selective rewriting recommended.'
        else:
            probability = 'Low'
            recommendation = 'Text appears relatively natural. Minor adjustments may help.'
        
        return {
            'overall_score': round(overall_score, 3),
            'probability': probability,
            'recommendation': recommendation,
            'metrics': metrics,
            'text_stats': {
                'paragraphs': len(self.paragraphs),
                'sentences': len(self.sentences),
                'words': len(self.text.split())
            }
        }
    
    def format_report(self, results: Dict, detailed: bool = False) -> str:
        """Format analysis results as readable report."""
        report = []
        report.append("=" * 70)
        report.append("AI WRITING PATTERN DETECTION REPORT")
        report.append("=" * 70)
        report.append("")
        
        # Overall assessment
        report.append(f"Overall AI Probability: {results['probability']} ({results['overall_score']:.1%})")
        report.append(f"Recommendation: {results['recommendation']}")
        report.append("")
        
        # Text statistics
        stats = results['text_stats']
        report.append(f"Text Statistics:")
        report.append(f"  - Paragraphs: {stats['paragraphs']}")
        report.append(f"  - Sentences: {stats['sentences']}")
        report.append(f"  - Words: {stats['words']}")
        report.append("")
        
        # Individual metrics
        report.append("Detailed Analysis:")
        report.append("-" * 70)
        
        metrics = results['metrics']
        
        # Sentence Uniformity
        m = metrics['sentence_uniformity']
        report.append(f"\n1. Sentence Uniformity: {self._score_indicator(m['score'])}")
        report.append(f"   {m['details']}")
        if detailed and m['score'] > 0.4:
            report.append(f"   → Issue: Sentences are too uniform in length")
            report.append(f"   → Fix: Mix short (5-10), medium (15-20), and long (25-35) word sentences")
        
        # Transition Overuse
        m = metrics['transition_overuse']
        report.append(f"\n2. Mechanical Transitions: {self._score_indicator(m['score'])}")
        report.append(f"   {m['details']}")
        if detailed and m['found']:
            report.append(f"   → Found transitions: {', '.join(set(m['found']))}")
            report.append(f"   → Fix: Replace with implicit connections or varied transitions")
        
        # Abstract Language
        m = metrics['abstract_language']
        report.append(f"\n3. Abstract Language: {self._score_indicator(m['score'])}")
        report.append(f"   {m['details']}")
        if detailed and m['found']:
            top_phrases = sorted(m['found'], key=lambda x: x[1], reverse=True)[:5]
            report.append(f"   → Most frequent: {', '.join([f'{p[0]} ({p[1]}x)' for p in top_phrases])}")
            report.append(f"   → Fix: Replace with specific concepts, named theories, concrete examples")
        
        # Vocabulary Diversity
        m = metrics['vocabulary_diversity']
        report.append(f"\n4. Vocabulary Diversity: {self._score_indicator(m['score'])}")
        report.append(f"   {m['details']}")
        if detailed and m['score'] > 0.5:
            report.append(f"   → Issue: Low vocabulary variety")
            report.append(f"   → Fix: Use more varied terminology, avoid word repetition")
        
        # Passive Voice
        m = metrics['passive_voice']
        report.append(f"\n5. Passive Voice Usage: {self._score_indicator(m['score'])}")
        report.append(f"   {m['details']}")
        if detailed and m['score'] > 0.4:
            report.append(f"   → Issue: Excessive passive constructions")
            report.append(f"   → Fix: Mix with active voice where appropriate")
        
        # Paragraph Patterns
        m = metrics['paragraph_patterns']
        report.append(f"\n6. Paragraph Opening Patterns: {self._score_indicator(m['score'])}")
        report.append(f"   {m['details']}")
        if detailed and m['score'] > 0.4:
            report.append(f"   → Issue: Repetitive paragraph openings")
            report.append(f"   → Fix: Vary how paragraphs begin")
        
        report.append("")
        report.append("=" * 70)
        
        return "\n".join(report)
    
    def _score_indicator(self, score: float) -> str:
        """Convert score to visual indicator."""
        if score > 0.7:
            return "🔴 HIGH CONCERN"
        elif score > 0.4:
            return "🟡 MODERATE CONCERN"
        else:
            return "🟢 OK"


def main():
    """Command-line interface."""
    # Set UTF-8 encoding for Windows console
    import sys
    if sys.platform == 'win32':
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    
    parser = argparse.ArgumentParser(
        description='Detect AI writing patterns in academic text',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python ai_detector.py input.txt
  python ai_detector.py input.txt --detailed
  python ai_detector.py input.txt --json > results.json
        """
    )
    
    parser.add_argument('input_file', help='Text file to analyze')
    parser.add_argument('--detailed', action='store_true', 
                       help='Show detailed analysis with fix suggestions')
    parser.add_argument('--json', action='store_true',
                       help='Output results as JSON')
    
    args = parser.parse_args()
    
    # Read input file
    try:
        with open(args.input_file, 'r', encoding='utf-8') as f:
            text = f.read()
    except FileNotFoundError:
        print(f"Error: File '{args.input_file}' not found", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}", file=sys.stderr)
        sys.exit(1)
    
    if not text.strip():
        print("Error: Input file is empty", file=sys.stderr)
        sys.exit(1)
    
    # Run analysis
    detector = AIDetector(text)
    results = detector.analyze()
    
    # Output results
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print(detector.format_report(results, detailed=args.detailed))


if __name__ == '__main__':
    main()
