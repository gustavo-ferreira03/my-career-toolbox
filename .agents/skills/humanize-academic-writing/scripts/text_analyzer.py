#!/usr/bin/env python3
"""
Text Analyzer for Academic Writing

Provides quantitative metrics on text quality:
- Sentence length distribution
- Vocabulary richness
- Academic word usage
- Readability scores
"""

import re
import sys
import argparse
from collections import Counter
from typing import List, Dict, Tuple
import statistics


class TextAnalyzer:
    """Analyzes text quality metrics."""
    
    # Common academic vocabulary (sample - expand as needed)
    ACADEMIC_WORDS = {
        'analyze', 'analysis', 'approach', 'area', 'assess', 'assume',
        'authority', 'available', 'benefit', 'concept', 'consistent',
        'constitute', 'context', 'contrast', 'create', 'data', 'define',
        'derive', 'distribute', 'economy', 'environment', 'establish',
        'estimate', 'evident', 'export', 'factor', 'financial', 'formula',
        'function', 'identify', 'income', 'indicate', 'individual',
        'interpret', 'involve', 'issue', 'labor', 'legal', 'legislate',
        'major', 'method', 'occur', 'percent', 'period', 'policy',
        'principle', 'proceed', 'process', 'require', 'research',
        'respond', 'role', 'section', 'sector', 'significant', 'similar',
        'source', 'specific', 'structure', 'theory', 'variable'
    }
    
    def __init__(self, text: str):
        """Initialize with text to analyze."""
        self.text = text
        self.sentences = self._split_sentences()
        self.words = self._extract_words()
        
    def _split_sentences(self) -> List[str]:
        """Split text into sentences."""
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', self.text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _extract_words(self) -> List[str]:
        """Extract words (lowercase, alphabetic only)."""
        return re.findall(r'\b[a-z]+\b', self.text.lower())
    
    def sentence_length_stats(self) -> Dict:
        """Calculate sentence length statistics."""
        if not self.sentences:
            return {'error': 'No sentences found'}
        
        lengths = [len(s.split()) for s in self.sentences]
        
        return {
            'count': len(lengths),
            'min': min(lengths),
            'max': max(lengths),
            'mean': round(statistics.mean(lengths), 2),
            'median': round(statistics.median(lengths), 2),
            'stdev': round(statistics.stdev(lengths), 2) if len(lengths) > 1 else 0,
            'distribution': self._length_distribution(lengths)
        }
    
    def _length_distribution(self, lengths: List[int]) -> Dict:
        """Categorize sentences by length."""
        short = sum(1 for l in lengths if l < 12)
        medium = sum(1 for l in lengths if 12 <= l <= 22)
        long = sum(1 for l in lengths if l > 22)
        
        total = len(lengths)
        return {
            'short (<12 words)': short,
            'short_pct': round(short / total * 100, 1) if total > 0 else 0,
            'medium (12-22 words)': medium,
            'medium_pct': round(medium / total * 100, 1) if total > 0 else 0,
            'long (>22 words)': long,
            'long_pct': round(long / total * 100, 1) if total > 0 else 0
        }
    
    def vocabulary_metrics(self) -> Dict:
        """Calculate vocabulary richness metrics."""
        if not self.words:
            return {'error': 'No words found'}
        
        unique_words = set(self.words)
        word_freq = Counter(self.words)
        
        # Type-Token Ratio
        ttr = len(unique_words) / len(self.words)
        
        # Lexical density (content words / total words)
        # For simplicity, words with length > 3 are considered content words
        content_words = [w for w in self.words if len(w) > 3]
        lexical_density = len(content_words) / len(self.words) if self.words else 0
        
        # Most common words
        most_common = word_freq.most_common(10)
        
        return {
            'total_words': len(self.words),
            'unique_words': len(unique_words),
            'type_token_ratio': round(ttr, 3),
            'lexical_density': round(lexical_density, 3),
            'most_common': most_common
        }
    
    def academic_vocabulary_usage(self) -> Dict:
        """Calculate academic word usage."""
        if not self.words:
            return {'error': 'No words found'}
        
        academic_word_count = sum(1 for w in self.words if w in self.ACADEMIC_WORDS)
        academic_pct = (academic_word_count / len(self.words)) * 100 if self.words else 0
        
        found_academic_words = [w for w in self.words if w in self.ACADEMIC_WORDS]
        freq = Counter(found_academic_words)
        
        return {
            'academic_word_count': academic_word_count,
            'percentage': round(academic_pct, 2),
            'top_academic_words': freq.most_common(10)
        }
    
    def transition_word_analysis(self) -> Dict:
        """Analyze transition word usage."""
        transitions = {
            'additive': ['moreover', 'furthermore', 'additionally', 'also', 'besides'],
            'adversative': ['however', 'nevertheless', 'nonetheless', 'yet', 'still'],
            'causal': ['therefore', 'thus', 'consequently', 'hence', 'accordingly'],
            'sequential': ['first', 'second', 'finally', 'subsequently', 'meanwhile']
        }
        
        text_lower = self.text.lower()
        results = {}
        total_transitions = 0
        
        for category, words in transitions.items():
            count = sum(text_lower.count(f' {word} ') + text_lower.count(f'{word}, ') 
                       for word in words)
            results[category] = count
            total_transitions += count
        
        transition_density = (total_transitions / len(self.words)) * 100 if self.words else 0
        
        return {
            'total_transitions': total_transitions,
            'density_per_100_words': round(transition_density, 2),
            'by_category': results
        }
    
    def passive_voice_analysis(self) -> Dict:
        """Analyze passive voice usage."""
        # Simple passive detection
        passive_patterns = [
            r'\b(is|are|was|were|been|be|being)\s+\w+ed\b',
            r'\b(is|are|was|were|been|be|being)\s+(shown|demonstrated|observed|found|noted|seen|considered|analyzed)\b'
        ]
        
        passive_count = sum(len(re.findall(pattern, self.text.lower())) 
                           for pattern in passive_patterns)
        
        passive_pct = (passive_count / len(self.sentences)) * 100 if self.sentences else 0
        
        return {
            'passive_constructions': passive_count,
            'per_sentence': round(passive_count / len(self.sentences), 2) if self.sentences else 0,
            'percentage': round(passive_pct, 1)
        }
    
    def readability_metrics(self) -> Dict:
        """Calculate basic readability metrics."""
        if not self.sentences or not self.words:
            return {'error': 'Insufficient text'}
        
        # Average sentence length
        avg_sentence_length = len(self.words) / len(self.sentences)
        
        # Average word length
        avg_word_length = sum(len(w) for w in self.words) / len(self.words)
        
        # Complex words (>2 syllables, approximated by >6 characters)
        complex_words = sum(1 for w in self.words if len(w) > 6)
        complex_pct = (complex_words / len(self.words)) * 100
        
        return {
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2),
            'complex_words': complex_words,
            'complex_word_pct': round(complex_pct, 1)
        }
    
    def analyze(self) -> Dict:
        """Run full analysis."""
        return {
            'sentence_stats': self.sentence_length_stats(),
            'vocabulary': self.vocabulary_metrics(),
            'academic_vocabulary': self.academic_vocabulary_usage(),
            'transitions': self.transition_word_analysis(),
            'passive_voice': self.passive_voice_analysis(),
            'readability': self.readability_metrics()
        }
    
    def format_report(self, results: Dict) -> str:
        """Format analysis as readable report."""
        report = []
        report.append("=" * 70)
        report.append("TEXT QUALITY ANALYSIS REPORT")
        report.append("=" * 70)
        report.append("")
        
        # Sentence Statistics
        report.append("SENTENCE STATISTICS")
        report.append("-" * 70)
        stats = results['sentence_stats']
        report.append(f"Total Sentences: {stats['count']}")
        report.append(f"Length Range: {stats['min']}-{stats['max']} words")
        report.append(f"Mean Length: {stats['mean']} words")
        report.append(f"Median Length: {stats['median']} words")
        report.append(f"Standard Deviation: {stats['stdev']} words")
        report.append("")
        report.append("Length Distribution:")
        dist = stats['distribution']
        report.append(f"  Short (<12 words):  {dist['short (<12 words)']:3d} ({dist['short_pct']:5.1f}%)")
        report.append(f"  Medium (12-22):     {dist['medium (12-22 words)']:3d} ({dist['medium_pct']:5.1f}%)")
        report.append(f"  Long (>22 words):   {dist['long (>22 words)']:3d} ({dist['long_pct']:5.1f}%)")
        
        # Vocabulary Assessment
        report.append("")
        report.append("VOCABULARY RICHNESS")
        report.append("-" * 70)
        vocab = results['vocabulary']
        report.append(f"Total Words: {vocab['total_words']}")
        report.append(f"Unique Words: {vocab['unique_words']}")
        report.append(f"Type-Token Ratio: {vocab['type_token_ratio']} ", end="")
        
        ttr = vocab['type_token_ratio']
        if ttr > 0.55:
            report.append("(Excellent diversity)")
        elif ttr > 0.45:
            report.append("(Good diversity)")
        elif ttr > 0.35:
            report.append("(Moderate diversity)")
        else:
            report.append("(Low diversity - consider varying vocabulary)")
        
        report.append(f"Lexical Density: {vocab['lexical_density']}")
        report.append("")
        report.append("Most Frequent Words:")
        for word, count in vocab['most_common'][:5]:
            report.append(f"  {word:15s} {count:3d}x")
        
        # Academic Vocabulary
        report.append("")
        report.append("ACADEMIC VOCABULARY")
        report.append("-" * 70)
        acad = results['academic_vocabulary']
        report.append(f"Academic Words: {acad['academic_word_count']} ({acad['percentage']}% of total)")
        if acad['top_academic_words']:
            report.append("Top Academic Words Used:")
            for word, count in acad['top_academic_words'][:5]:
                report.append(f"  {word:15s} {count:3d}x")
        
        # Transitions
        report.append("")
        report.append("TRANSITION WORDS")
        report.append("-" * 70)
        trans = results['transitions']
        report.append(f"Total Transitions: {trans['total_transitions']} ({trans['density_per_100_words']} per 100 words)")
        report.append("By Category:")
        for category, count in trans['by_category'].items():
            report.append(f"  {category.capitalize():15s} {count:3d}")
        
        # Passive Voice
        report.append("")
        report.append("PASSIVE VOICE")
        report.append("-" * 70)
        passive = results['passive_voice']
        report.append(f"Passive Constructions: {passive['passive_constructions']}")
        report.append(f"Per Sentence: {passive['per_sentence']}")
        report.append(f"Percentage: {passive['percentage']}%")
        
        if passive['percentage'] > 40:
            report.append("⚠️  High passive voice usage - consider more active constructions")
        elif passive['percentage'] < 20:
            report.append("✓ Good balance of voice")
        
        # Readability
        report.append("")
        report.append("READABILITY METRICS")
        report.append("-" * 70)
        read = results['readability']
        report.append(f"Average Sentence Length: {read['avg_sentence_length']} words")
        report.append(f"Average Word Length: {read['avg_word_length']} characters")
        report.append(f"Complex Words: {read['complex_words']} ({read['complex_word_pct']}%)")
        
        report.append("")
        report.append("=" * 70)
        
        return "\n".join(report)
    
    @staticmethod
    def compare_texts(text1: str, text2: str) -> str:
        """Compare two texts and show differences."""
        analyzer1 = TextAnalyzer(text1)
        analyzer2 = TextAnalyzer(text2)
        
        results1 = analyzer1.analyze()
        results2 = analyzer2.analyze()
        
        report = []
        report.append("=" * 70)
        report.append("TEXT COMPARISON REPORT")
        report.append("=" * 70)
        report.append("")
        
        # Compare sentence stats
        report.append("SENTENCE LENGTH")
        report.append("-" * 70)
        s1 = results1['sentence_stats']
        s2 = results2['sentence_stats']
        report.append(f"{'Metric':<20} {'Text 1':>15} {'Text 2':>15} {'Change':>15}")
        report.append(f"{'Mean Length':<20} {s1['mean']:>15.2f} {s2['mean']:>15.2f} {s2['mean']-s1['mean']:>+15.2f}")
        report.append(f"{'Std Deviation':<20} {s1['stdev']:>15.2f} {s2['stdev']:>15.2f} {s2['stdev']-s1['stdev']:>+15.2f}")
        
        # Compare vocabulary
        report.append("")
        report.append("VOCABULARY")
        report.append("-" * 70)
        v1 = results1['vocabulary']
        v2 = results2['vocabulary']
        report.append(f"{'Type-Token Ratio':<20} {v1['type_token_ratio']:>15.3f} {v2['type_token_ratio']:>15.3f} {v2['type_token_ratio']-v1['type_token_ratio']:>+15.3f}")
        report.append(f"{'Lexical Density':<20} {v1['lexical_density']:>15.3f} {v2['lexical_density']:>15.3f} {v2['lexical_density']-v1['lexical_density']:>+15.3f}")
        
        # Compare transitions
        report.append("")
        report.append("TRANSITIONS")
        report.append("-" * 70)
        t1 = results1['transitions']
        t2 = results2['transitions']
        report.append(f"{'Density/100 words':<20} {t1['density_per_100_words']:>15.2f} {t2['density_per_100_words']:>15.2f} {t2['density_per_100_words']-t1['density_per_100_words']:>+15.2f}")
        
        # Compare passive voice
        report.append("")
        report.append("PASSIVE VOICE")
        report.append("-" * 70)
        p1 = results1['passive_voice']
        p2 = results2['passive_voice']
        report.append(f"{'Percentage':<20} {p1['percentage']:>14.1f}% {p2['percentage']:>14.1f}% {p2['percentage']-p1['percentage']:>+14.1f}%")
        
        report.append("")
        report.append("=" * 70)
        
        return "\n".join(report)


def main():
    """Command-line interface."""
    parser = argparse.ArgumentParser(
        description='Analyze text quality metrics',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python text_analyzer.py input.txt
  python text_analyzer.py original.txt revised.txt --compare
        """
    )
    
    parser.add_argument('input_file', help='Text file to analyze')
    parser.add_argument('input_file2', nargs='?', help='Second text file for comparison')
    parser.add_argument('--compare', action='store_true',
                       help='Compare two text files')
    
    args = parser.parse_args()
    
    # Read first file
    try:
        with open(args.input_file, 'r', encoding='utf-8') as f:
            text1 = f.read()
    except FileNotFoundError:
        print(f"Error: File '{args.input_file}' not found", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}", file=sys.stderr)
        sys.exit(1)
    
    if not text1.strip():
        print("Error: Input file is empty", file=sys.stderr)
        sys.exit(1)
    
    # Comparison mode
    if args.compare or args.input_file2:
        if not args.input_file2:
            print("Error: Two files required for comparison", file=sys.stderr)
            sys.exit(1)
        
        try:
            with open(args.input_file2, 'r', encoding='utf-8') as f:
                text2 = f.read()
        except FileNotFoundError:
            print(f"Error: File '{args.input_file2}' not found", file=sys.stderr)
            sys.exit(1)
        
        print(TextAnalyzer.compare_texts(text1, text2))
    else:
        # Single file analysis
        analyzer = TextAnalyzer(text1)
        results = analyzer.analyze()
        print(analyzer.format_report(results))


if __name__ == '__main__':
    main()
