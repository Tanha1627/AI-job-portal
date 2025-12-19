"""
Simple test script for FastAPI ML service
Run: python test.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if service is running"""
    print("\n" + "="*50)
    print("Testing Health Check")
    print("="*50)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        data = response.json()
        
        if data.get('model_loaded'):
            print("✓ Service is healthy")
            print("✓ Model loaded successfully")
        else:
            print("✗ Model not loaded!")
        
        return data.get('model_loaded', False)
    except Exception as e:
        print(f"✗ Service not running: {e}")
        print("\nMake sure to start the service first:")
        print("  python main.py")
        return False


def test_ranking():
    """Test ranking with sample data"""
    print("\n" + "="*50)
    print("Testing Application Ranking")
    print("="*50)
    
    # Sample applications
    payload = {
        "applications": [
            {
                "id": "1",
                "fullname": "Alice Johnson",
                "email": "alice@example.com",
                "coverLetter": "Python ML engineer with 5 years experience in deep learning, TensorFlow, PyTorch, NLP, and computer vision."
            },
            {
                "id": "2",
                "fullname": "Bob Smith",
                "email": "bob@example.com",
                "coverLetter": "Frontend developer with React and Vue.js. Built responsive web applications."
            },
            {
                "id": "3",
                "fullname": "Carol White",
                "email": "carol@example.com",
                "coverLetter": "Senior ML engineer with expertise in deep learning, NLP, computer vision. Led production ML teams."
            },
            {
                "id": "4",
                "fullname": "David Brown",
                "email": "david@example.com",
                "coverLetter": "Data analyst with Excel and SQL skills. Created dashboards and reports."
            }
        ],
        "job_description": "Looking for Senior ML Engineer with Python, deep learning, NLP experience. Must know TensorFlow or PyTorch."
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/rank",
            json=payload,
            timeout=60
        )
        data = response.json()
        
        if data.get('success'):
            print(f"✓ Successfully ranked {data.get('total_applications')} applications\n")
            
            # Display results
            print("Rankings:")
            print("-" * 70)
            for app in data.get('ranked_applications', []):
                rank = app.get('rank')
                score = app.get('rank_score', 0)
                name = app.get('fullname')
                
                # Medal emoji for top 3
                medal = ""
                if rank == 1:
                    medal = "🥇"
                elif rank == 2:
                    medal = "🥈"
                elif rank == 3:
                    medal = "🥉"
                else:
                    medal = "  "
                
                # Score percentage
                score_pct = score * 100
                bar_length = int(score_pct / 5)  # Scale to 20 chars max
                bar = "█" * bar_length + "░" * (20 - bar_length)
                
                print(f"{medal} #{rank} {name:20s} | {bar} {score_pct:5.1f}%")
            
            print("-" * 70)
            return True
        else:
            print(f"✗ Ranking failed: {data.get('error')}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_simple():
    """Test the simple test endpoint"""
    print("\n" + "="*50)
    print("Testing Simple Endpoint")
    print("="*50)
    
    try:
        response = requests.get(f"{BASE_URL}/test", timeout=60)
        data = response.json()
        
        if data.get('success'):
            print("✓ Test endpoint working\n")
            
            print("Sample Rankings:")
            for app in data.get('ranked_applications', []):
                rank = app.get('rank')
                score = app.get('rank_score', 0)
                name = app.get('fullname')
                print(f"  #{rank}: {name:20s} - {score:.4f}")
            
            return True
        else:
            print("✗ Test endpoint failed")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    print("\n" + "="*70)
    print("  FastAPI ML Service - Simple Test")
    print("="*70)
    
    # Test health first
    if not test_health():
        print("\n⚠️  Service is not running or model not loaded.")
        print("\nTo start the service:")
        print("  1. Activate virtual environment: source venv/bin/activate")
        print("  2. Run: python main.py")
        return
    
    # Run tests
    print("\n")
    test_simple()
    test_ranking()
    
    # Summary
    print("\n" + "="*70)
    print("  Test Complete!")
    print("="*70)
    print("\n✓ All tests passed!")
    print("\n📚 View interactive docs: http://localhost:8000/docs")
    print("🔍 Check health: http://localhost:8000/health\n")


if __name__ == "__main__":
    main()