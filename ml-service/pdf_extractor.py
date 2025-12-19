import PyPDF2
import requests
from io import BytesIO
import re

class PDFTextExtractor:
    """Extract text from PDF files"""
    
    @staticmethod
    def extract_from_url(pdf_url):
        """
        Extract text from PDF URL (e.g., Cloudinary URL)
        
        Args:
            pdf_url: URL of the PDF file
            
        Returns:
            Extracted text as string
        """
        try:
            # Download PDF from URL
            print(f"Downloading PDF from: {pdf_url}")
            response = requests.get(pdf_url, timeout=30)
            response.raise_for_status()
            
            # Read PDF from bytes
            pdf_file = BytesIO(response.content)
            return PDFTextExtractor.extract_from_file(pdf_file)
            
        except Exception as e:
            print(f"Error extracting text from URL {pdf_url}: {e}")
            return ""
    
    @staticmethod
    def extract_from_file(pdf_file):
        """
        Extract text from PDF file object
        
        Args:
            pdf_file: File-like object containing PDF data
            
        Returns:
            Extracted text as string
        """
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            
            # Extract text from all pages
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            # Clean up text
            text = PDFTextExtractor.clean_text(text)
            return text
            
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""
    
    @staticmethod
    def clean_text(text):
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s\.\,\@\-\+\#\(\)]', ' ', text)
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    @staticmethod
    def extract_key_sections(text):
        """
        Extract key sections from resume text
        Returns a dict with sections
        """
        sections = {
            'skills': '',
            'experience': '',
            'education': '',
            'full_text': text
        }
        
        if not text:
            return sections
        
        text_lower = text.lower()
        
        # Extract skills section
        skills_patterns = [
            r'skills?[\s:]*(.{0,500}?)(?:experience|education|projects|$)',
            r'technical\s+skills?[\s:]*(.{0,500}?)(?:experience|education|$)',
        ]
        for pattern in skills_patterns:
            skills_match = re.search(pattern, text_lower, re.IGNORECASE | re.DOTALL)
            if skills_match:
                sections['skills'] = skills_match.group(1).strip()
                break
        
        # Extract experience section
        exp_patterns = [
            r'(?:work\s+)?experience[\s:]*(.{0,1000}?)(?:education|skills|projects|$)',
            r'professional\s+experience[\s:]*(.{0,1000}?)(?:education|skills|$)',
        ]
        for pattern in exp_patterns:
            exp_match = re.search(pattern, text_lower, re.IGNORECASE | re.DOTALL)
            if exp_match:
                sections['experience'] = exp_match.group(1).strip()
                break
        
        # Extract education section
        edu_patterns = [
            r'education[\s:]*(.{0,500}?)(?:experience|skills|projects|$)',
            r'academic\s+background[\s:]*(.{0,500}?)(?:experience|skills|$)',
        ]
        for pattern in edu_patterns:
            edu_match = re.search(pattern, text_lower, re.IGNORECASE | re.DOTALL)
            if edu_match:
                sections['education'] = edu_match.group(1).strip()
                break
        
        return sections


# Test the extractor
if __name__ == "__main__":
    print("PDF Text Extractor - Test")
    print("="*50)
    
    # Test with a sample URL (replace with actual URL)
    test_url = input("Enter PDF URL to test (or press Enter to skip): ").strip()
    
    if test_url:
        extractor = PDFTextExtractor()
        text = extractor.extract_from_url(test_url)
        
        print(f"\nExtracted {len(text)} characters")
        print("\nFirst 500 characters:")
        print("-"*50)
        print(text[:500])
        print("-"*50)
        
        sections = extractor.extract_key_sections(text)
        print("\nExtracted Sections:")
        print(f"  Skills: {len(sections['skills'])} chars")
        print(f"  Experience: {len(sections['experience'])} chars")
        print(f"  Education: {len(sections['education'])} chars")
    else:
        print("Skipped - no URL provided")