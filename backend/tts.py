"""
Text-to-Speech (TTS) Module:
Fetches authentic spoken Kannada audio for agricultural voice guidance.
Uses Google Translate TTS proxy with client='tw-ob' and language='kn'.
"""

import io
import urllib.parse
import requests
import logging

logger = logging.getLogger("tts")

def generate_kannada_audio(text: str) -> bytes:
    """
    Fetches spoken Kannada MP3 audio from Google TTS endpoint.
    Truncates text safely if needed to stay within URL length limits.
    """
    if not text:
        text = "ಸೌತೆಕಾಯಿ ಎಲೆಗಳ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ."

    # Limit to first 250 characters for clean URL encoding and clear listening
    clean_text = text[:250].strip()
    encoded_text = urllib.parse.quote(clean_text)
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl=kn&client=tw-ob&q={encoded_text}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200 and len(response.content) > 100:
            return response.content
        else:
            logger.warning(f"TTS request returned status {response.status_code}")
            return b""
    except Exception as e:
        logger.error(f"Error generating Kannada TTS audio: {e}")
        return b""
