// app/utils/contentFilter.js - Moderate Content Filter for Prayer Requests

/**
 * Content Filter for Prayer Requests
 * Provides moderate filtering that blocks inappropriate content while
 * allowing discussion of sensitive topics in a respectful manner
 */

// Basic profanity words - common inappropriate language
const PROFANITY_WORDS = [
  // Strong profanity
  'fuck', 'fucking', 'shit', 'bitch', 'damn', 'hell', 'ass', 'crap',
  'bastard', 'whore', 'slut', 'piss', 'cock', 'dick', 'pussy',
  // Variants and common misspellings
  'f*ck', 'f**k', 'sh*t', 'sh**', 'b*tch', 'd*mn', 'a**', 'cr*p',
  'fck', 'fuk', 'sht', 'btch', 'dmn', 'ars', 'azz',
  // Intentional character substitutions
  'f4ck', 'sh1t', 'b1tch', 'd4mn', '@ss', '$hit', 'fu©k'
];

// Inappropriate content patterns - content that's not appropriate for prayer community
const INAPPROPRIATE_PATTERNS = [
  // Sexual content (not including appropriate discussion of intimacy issues)
  /\b(porn|pornography|sex tape|nude|naked|horny|sexy time)\b/gi,
  /\b(masturbat|orgasm|climax|cum|cumming)\b/gi,
  /\b(hooker|prostitute|escort|stripper)\b/gi,
  
  // Hate speech and discrimination
  /\b(faggot|fag|dyke|tranny|retard|retarded|spic|chink|nigger|nigga)\b/gi,
  /\b(kike|wetback|towelhead|sandnigger|raghead)\b/gi,
  
  // Violence/threats (excluding appropriate requests for safety)
  /\b(kill myself|suicide|end it all|not worth living)\b/gi,
  /\b(murder|kill you|death threat|bomb|terrorist)\b/gi,
  
  // Spam/promotional content
  /\b(buy now|click here|visit my|check out my|follow me)\b/gi,
  /\b(make money|get rich|free money|bitcoin|crypto)\b/gi,
  /(http|www\.|\.com|\.org|\.net)/gi,
  
  // Inappropriate requests
  /\b(send nudes|hook up|looking for sex|one night stand)\b/gi,
  /\b(drug dealer|selling drugs|buy weed|cocaine|heroin)\b/gi
];

// Sensitive topics that ARE allowed when discussed appropriately
const ALLOWED_SENSITIVE_TOPICS = [
  // These won't be filtered - important for prayer requests
  'abuse', 'addiction', 'depression', 'anxiety', 'suicide thoughts', 
  'self harm', 'eating disorder', 'alcoholism', 'divorce', 'death',
  'cancer', 'illness', 'miscarriage', 'infertility', 'unemployment',
  'homeless', 'poverty', 'domestic violence', 'sexual assault',
  'trauma', 'ptsd', 'mental health', 'therapy', 'counseling'
];

// Spam patterns - repetitive or suspicious content
const SPAM_PATTERNS = [
  // Excessive repetition
  /(.)\1{10,}/g, // Same character repeated 10+ times
  /\b(\w+)\s+\1\s+\1/gi, // Same word repeated 3+ times
  
  // Excessive capitalization
  /[A-Z]{20,}/g, // 20+ consecutive capital letters
  
  // Excessive punctuation
  /[!?]{5,}/g, // 5+ consecutive exclamation/question marks
  /\.{10,}/g, // 10+ consecutive periods
];

/**
 * Content Filter Class
 */
export class ContentFilter {
  constructor(options = {}) {
    this.strictness = options.strictness || 'moderate';
    this.allowSensitiveTopics = options.allowSensitiveTopics !== false;
  }

  /**
   * Main filtering function
   * @param {string} text - Text to filter
   * @returns {Object} - Filter result with isClean, reason, and suggestions
   */
  filterContent(text) {
    if (!text || typeof text !== 'string') {
      return {
        isClean: false,
        reason: 'Please enter your prayer request',
        suggestions: ['Share what you need prayer for in a respectful way']
      };
    }

    const cleanText = text.trim();
    
    if (cleanText.length === 0) {
      return {
        isClean: false,
        reason: 'Please enter your prayer request',
        suggestions: ['Share what you need prayer for']
      };
    }

    // Check for profanity
    const profanityResult = this.checkProfanity(cleanText);
    if (!profanityResult.isClean) {
      return profanityResult;
    }

    // Check for inappropriate content patterns
    const inappropriateResult = this.checkInappropriateContent(cleanText);
    if (!inappropriateResult.isClean) {
      return inappropriateResult;
    }

    // Check for spam patterns
    const spamResult = this.checkSpamPatterns(cleanText);
    if (!spamResult.isClean) {
      return spamResult;
    }

    // Check content length and quality
    const qualityResult = this.checkContentQuality(cleanText);
    if (!qualityResult.isClean) {
      return qualityResult;
    }

    return {
      isClean: true,
      reason: null,
      suggestions: []
    };
  }

  /**
   * Check for profanity words
   */
  checkProfanity(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    const lowerText = text.toLowerCase();
    
    for (const word of PROFANITY_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(lowerText)) {
        return {
          isClean: false,
          reason: 'Please keep your prayer request respectful',
          suggestions: [
            'Share your feelings without using inappropriate language',
            'Our community values respectful communication',
            'Express your concerns in a way that honors others'
          ]
        };
      }
    }

    return { isClean: true };
  }

  /**
   * Check for inappropriate content patterns
   */
  checkInappropriateContent(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    for (const pattern of INAPPROPRIATE_PATTERNS) {
      if (pattern.test(text)) {
        // Check if it's a sensitive topic that should be allowed
        const lowerText = text.toLowerCase();
        const isSensitiveTopicDiscussion = ALLOWED_SENSITIVE_TOPICS.some(topic => 
          lowerText.includes(topic.toLowerCase())
        );

        // If it's not a sensitive topic discussion, filter it
        if (!isSensitiveTopicDiscussion) {
          return {
            isClean: false,
            reason: 'Please keep your prayer request appropriate for our community',
            suggestions: [
              'Focus on how we can pray for your situation',
              'Share your needs in a way that respects all community members',
              'Remember this is a safe space for spiritual support'
            ]
          };
        }
      }
    }

    return { isClean: true };
  }

  /**
   * Check for spam patterns
   */
  checkSpamPatterns(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(text)) {
        return {
          isClean: false,
          reason: 'Please write your prayer request naturally',
          suggestions: [
            'Avoid excessive repetition or special characters',
            'Write in a conversational, sincere manner',
            'Share your genuine prayer needs'
          ]
        };
      }
    }

    // Check for URLs or promotional content
    if (/(http|www\.|\.com|\.org|\.net)/gi.test(text)) {
      return {
        isClean: false,
        reason: 'Please don\'t include links or promotional content',
        suggestions: [
          'Focus on your prayer request without external links',
          'Share your personal situation instead',
          'Keep the focus on spiritual support'
        ]
      };
    }

    return { isClean: true };
  }

  /**
   * Check content quality and length
   */
  checkContentQuality(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true };
    }

    const trimmed = text.trim();

    // Check if it's too short to be meaningful
    if (trimmed.length < 5) {
      return {
        isClean: false,
        reason: 'Please share more details about your prayer request',
        suggestions: [
          'Help us understand how to pray for you',
          'Share what specific support you need',
          'Give us enough context to pray effectively'
        ]
      };
    }

    // Check if it's just random characters or gibberish
    const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
    const totalLength = trimmed.length;
    
    if (letterCount / totalLength < 0.5 && totalLength > 10) {
      return {
        isClean: false,
        reason: 'Please write your prayer request clearly',
        suggestions: [
          'Use regular words to describe your situation',
          'Help us understand your prayer needs',
          'Write in a way others can relate to and pray for'
        ]
      };
    }

    return { isClean: true };
  }

  /**
   * Quick validation for real-time feedback
   */
  quickValidate(text) {
    // Ensure we always return boolean values
    if (!text || typeof text !== 'string') {
      return { isValid: true };
    }
    
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return { isValid: true };
    }
    
    const lowerText = trimmed.toLowerCase();
    
    // Quick profanity check (first 10 words for performance)
    for (const word of PROFANITY_WORDS.slice(0, 10)) {
      if (lowerText.includes(word)) {
        return { 
          isValid: false, 
          message: 'Please keep your language respectful' 
        };
      }
    }

    // Quick inappropriate content check
    const hasInappropriate = INAPPROPRIATE_PATTERNS.slice(0, 3).some(pattern => 
      pattern.test(trimmed)
    );
    
    if (hasInappropriate) {
      return {
        isValid: false,
        message: 'Please keep your content appropriate'
      };
    }

    return { isValid: true };
  }
}

// Default content filter instance
export const contentFilter = new ContentFilter({
  strictness: 'moderate',
  allowSensitiveTopics: true
});

// Validation helper for forms
export const validatePrayerContent = (text) => {
  // Ensure proper type handling
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      error: 'Please enter your prayer request',
      suggestions: ['Share what you need prayer for in a respectful way'],
      hasInappropriateContent: false
    };
  }

  const result = contentFilter.filterContent(text);
  
  return {
    isValid: Boolean(result.isClean), // Ensure boolean
    error: result.reason || null,
    suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    hasInappropriateContent: Boolean(!result.isClean)
  };
};

// Quick validation for real-time input
export const quickValidateContent = (text) => {
  // Ensure proper type handling
  if (!text || typeof text !== 'string') {
    return { isValid: true };
  }
  
  const result = contentFilter.quickValidate(text);
  
  return {
    isValid: Boolean(result.isValid), // Ensure boolean
    message: result.message || null
  };
};

// Export for testing and configuration
export { PROFANITY_WORDS, INAPPROPRIATE_PATTERNS, ALLOWED_SENSITIVE_TOPICS };

export default contentFilter;