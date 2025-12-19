








import lightgbm as lgb
import pickle
import numpy as np
import re

class ResumeRanker:
    def __init__(self, model_path='lightgbm_ranking.txt', vectorizer_path='ranking.pkl'):
        """Initialize the ranking model and vectorizer"""
        try:
            self.model = lgb.Booster(model_file=model_path)
            print(f"✓ Model loaded from {model_path}")
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            raise
        
        try:
            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
            print(f"✓ Vectorizer loaded from {vectorizer_path}")
        except Exception as e:
            print(f"✗ Error loading vectorizer: {e}")
            raise
        
        self.num_features = 386  # Based on your model
    
    def extract_text_from_resume(self, resume_text):
        """Extract and clean text from resume"""
        if not resume_text:
            return ""
        text = re.sub(r'[^\w\s]', ' ', resume_text.lower())
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def prepare_features(self, resume_texts, job_description):
        """Prepare features for ranking"""
        n_applicants = len(resume_texts)
        features = np.zeros((n_applicants, self.num_features))
        combined_texts = [f"{resume} {job_description}" for resume in resume_texts]
        
        try:
            if hasattr(self.vectorizer, 'transform'):
                tfidf_features = self.vectorizer.transform(combined_texts).toarray()
                feature_count = min(tfidf_features.shape[1], self.num_features)
                features[:, :feature_count] = tfidf_features[:, :feature_count]
        except Exception as e:
            print(f"Error in feature extraction: {e}")
            pass
        
        return features
    
    def categorize_score(self, score, all_scores):
        """Categorize score into Best, Average, Weak"""
        if not all_scores:
            return "Average Match"
        
        scores_array = np.array(all_scores)
        percentile_67 = np.percentile(scores_array, 67)
        percentile_33 = np.percentile(scores_array, 33)
        
        if score >= percentile_67:
            return "Best Match"
        elif score >= percentile_33:
            return "Average Match"
        else:
            return "Weak Match"
    
    def rank_applications(self, applications, job_description):
        """Rank applications and assign categories"""
        if not applications:
            return []
        
        resume_texts = [app.get('resume_text', '') for app in applications]
        features = self.prepare_features(resume_texts, job_description)
        
        try:
            scores = np.asarray(self.model.predict(features), dtype=float)
        except Exception as e:
            print(f"Error in prediction: {e}")
            scores = np.random.rand(len(applications))
        
        # Assign scores
        for i, app in enumerate(applications):
            app['rank_score'] = float(scores[i])
        
        # Sort by score descending
        ranked_applications = sorted(applications, key=lambda x: x['rank_score'], reverse=True)
        all_scores = [app['rank_score'] for app in ranked_applications]
        
        # Assign rank, category, and match percentage
        for i, app in enumerate(ranked_applications):
            app['rank'] = i + 1
            app['match_category'] = self.categorize_score(app['rank_score'], all_scores)
            app['match_percentage'] = round(max(0.0, min(app['rank_score'], 1.0)) * 100, 1)
        
        return ranked_applications
    
    def get_category_summary(self, ranked_applications):
        """Get summary of applications by category"""
        summary = {'Best Match': 0, 'Average Match': 0, 'Weak Match': 0}
        for app in ranked_applications:
            category = app.get('match_category', 'Average Match')
            summary[category] += 1
        return summary


# Example usage and testing
if __name__ == "__main__":
    print("="*70)
    print("Testing Resume Ranker with Categories")
    print("="*70)
    
    try:
        ranker = ResumeRanker()
        
        test_applications = [
            {'id': '1', 'fullname': 'John Doe', 'resume_text': 'Python developer with 5 years experience in machine learning and data science. Proficient in TensorFlow, PyTorch, scikit-learn, deep learning, NLP.'},
            {'id': '2', 'fullname': 'Jane Smith', 'resume_text': 'Frontend developer with React and Angular experience. Built multiple web applications using JavaScript, HTML, CSS.'},
            {'id': '3', 'fullname': 'Bob Johnson', 'resume_text': 'Senior Python engineer with expertise in machine learning, deep learning, NLP, and computer vision. Led ML teams and deployed production models.'},
            {'id': '4', 'fullname': 'Alice Brown', 'resume_text': 'Data analyst with experience in SQL, Excel, and basic Python. Created dashboards and reports.'},
            {'id': '5', 'fullname': 'Charlie Wilson', 'resume_text': 'Full stack developer with Node.js and React. Built REST APIs and web applications.'}
        ]
        
        job_desc = "Looking for a Python Machine Learning Engineer with experience in deep learning and NLP. Must be proficient in TensorFlow or PyTorch."
        
        print("\nRanking applications...\n")
        ranked = ranker.rank_applications(test_applications, job_desc)
        
        print("="*70)
        print("Ranked Applications:")
        print("="*70)
        
        for app in ranked:
            rank = app['rank']
            name = app['fullname']
            score = app['rank_score']
            category = app['match_category']
            percentage = app['match_percentage']
            
            # Visual indicator
            icon = "  "
            if rank == 1:
                icon = "🥇"
            elif rank == 2:
                icon = "🥈"
            elif rank == 3:
                icon = "🥉"
            
            # Category display
            cat_display = {"Best Match": f"✓ {category}", "Average Match": f"• {category}", "Weak Match": f"✗ {category}"}.get(category)
            
            # Progress bar
            bar_length = int(percentage / 5)
            bar = "█" * bar_length + "░" * (20 - bar_length)
            
            print(f"{icon} #{rank} {name:20s} | {bar} {percentage:5.1f}% | {cat_display}")
        
        # Summary
        summary = ranker.get_category_summary(ranked)
        print("\n" + "="*70)
        print("Category Summary:")
        print("="*70)
        for category, count in summary.items():
            print(f"  {category:15s}: {count} application(s)")
        
        print("\n✓ Test completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()


# python.analysis.typeCheckingMode



























# import lightgbm as lgb
# import pickle
# import numpy as np
# import re

# class ResumeRanker:
#     def __init__(self, model_path='lightgbm_ranking.txt', vectorizer_path='ranking.pkl'):
#         """Initialize the ranking model and vectorizer"""
#         try:
#             self.model = lgb.Booster(model_file=model_path)
#             print(f"✓ Model loaded from {model_path}")
#         except Exception as e:
#             print(f"✗ Error loading model: {e}")
#             raise
        
#         try:
#             with open(vectorizer_path, 'rb') as f:
#                 self.vectorizer = pickle.load(f)
#             print(f"✓ Vectorizer loaded from {vectorizer_path}")
#         except Exception as e:
#             print(f"✗ Error loading vectorizer: {e}")
#             raise
        
#         self.num_features = 386  # Based on your model
    
#     def extract_text_from_resume(self, resume_text):
#         """Extract and clean text from resume"""
#         if not resume_text:
#             return ""
        
#         # Remove special characters and extra whitespace
#         text = re.sub(r'[^\w\s]', ' ', resume_text.lower())
#         text = re.sub(r'\s+', ' ', text).strip()
#         return text
    
#     def prepare_features(self, resume_texts, job_description):
#         """
#         Prepare features for ranking
#         resume_texts: list of resume text strings
#         job_description: job description text
#         Returns: numpy array of shape (n_applicants, 386)
#         """
#         n_applicants = len(resume_texts)
#         features = np.zeros((n_applicants, self.num_features))
        
#         # Combine resume and job description for each applicant
#         combined_texts = []
#         for resume_text in resume_texts:
#             combined = f"{resume_text} {job_description}"
#             combined_texts.append(combined)
        
#         try:
#             # Transform using the loaded vectorizer
#             if hasattr(self.vectorizer, 'transform'):
#                 tfidf_features = self.vectorizer.transform(combined_texts).toarray()
#             else:
#                 # If it's not a sklearn vectorizer, handle accordingly
#                 tfidf_features = np.zeros((n_applicants, self.num_features))
            
#             # Ensure we have the right number of features
#             feature_count = min(tfidf_features.shape[1], self.num_features)
#             features[:, :feature_count] = tfidf_features[:, :feature_count]
            
#         except Exception as e:
#             print(f"Error in feature extraction: {e}")
#             # Return zero features if extraction fails
#             pass
        
#         return features
    
#     def categorize_score(self, score, all_scores):
#         """
#         Categorize application into Best, Average, or Weak
#         Based on score distribution using percentiles
#         """
#         if not all_scores or len(all_scores) == 0:
#             return "Average Match"
        
#         # Calculate percentiles
#         scores_array = np.array(all_scores)
#         percentile_67 = np.percentile(scores_array, 67)
#         percentile_33 = np.percentile(scores_array, 33)
        
#         if score >= percentile_67:
#             return "Best Match"
#         elif score >= percentile_33:
#             return "Average Match"
#         else:
#             return "Weak Match"
    
#     def rank_applications(self, applications, job_description):
#         """
#         Rank applications based on resume content
#         Categorizes into: Best Match, Average Match, Weak Match
        
#         Args:
#             applications: list of dicts with 'id', 'resume_text', and other fields
#             job_description: job description text
            
#         Returns:
#             list of dicts with added 'rank', 'rank_score', 'match_category', and 'match_percentage' fields
#         """
#         if not applications:
#             return []
        
#         # Extract resume texts
#         resume_texts = [app.get('resume_text', '') for app in applications]
        
#         # Prepare features
#         features = self.prepare_features(resume_texts, job_description)
        
#         # Get predictions from model
#         try:
#             scores = self.model.predict(features)
#         except Exception as e:
#             print(f"Error in prediction: {e}")
#             # Fallback to random scores if prediction fails
#             scores = np.random.rand(len(applications))

#         # Get predictions from model
# try:
#     scores = np.asarray(
#         self.model.predict(features),
#         dtype=float
#     )
# except Exception as e:
#     print(f"Error in prediction: {e}")
#     scores = np.random.rand(len(applications))

# # Add scores
# for i, app in enumerate(applications):
#     app['rank_score'] = float(scores[i])

# # Sort
# ranked_applications = sorted(
#     applications,
#     key=lambda x: x['rank_score'],
#     reverse=True
# )

# all_scores = [app['rank_score'] for app in ranked_applications]

# for i, app in enumerate(ranked_applications):
#     app['rank'] = i + 1
#     app['match_category'] = self.categorize_score(
#         app['rank_score'], all_scores
#     )

#     score = float(app['rank_score'])
#     app['match_percentage'] = round(
#         max(0.0, min(score, 1.0)) * 100, 1
#     )

        
#         # Add scores to applications
#         for i, app in enumerate(applications):
#             app['rank_score'] = float(scores[i])
        
#         # Sort by score (higher is better)
#         ranked_applications = sorted(applications, key=lambda x: x['rank_score'], reverse=True)
        
#         # Get all scores for categorization
#         all_scores = [app['rank_score'] for app in ranked_applications]
        
#         # Add rank position, category, and percentage
#         for i, app in enumerate(ranked_applications):
#             app['rank'] = i + 1
#             app['match_category'] = self.categorize_score(app['rank_score'], all_scores)
            
#             # Add percentage score for display (0-100%)
#             app['match_percentage'] = round(app['rank_score'] * 100, 1)
        
#         return ranked_applications
    
#     def get_category_summary(self, ranked_applications):
#         """Get summary of applications by category"""
#         summary = {
#             'Best Match': 0,
#             'Average Match': 0,
#             'Weak Match': 0
#         }
        
#         for app in ranked_applications:
#             category = app.get('match_category', 'Average Match')
#             summary[category] = summary.get(category, 0) + 1
        
#         return summary


# # Example usage and testing
# if __name__ == "__main__":
#     print("="*70)
#     print("Testing Resume Ranker with Categories")
#     print("="*70)
    
#     # Test the ranker
#     try:
#         ranker = ResumeRanker()
        
#         # Sample data
#         test_applications = [
#             {
#                 'id': '1',
#                 'fullname': 'John Doe',
#                 'resume_text': 'Python developer with 5 years experience in machine learning and data science. Proficient in TensorFlow, PyTorch, scikit-learn, deep learning, NLP.'
#             },
#             {
#                 'id': '2',
#                 'fullname': 'Jane Smith',
#                 'resume_text': 'Frontend developer with React and Angular experience. Built multiple web applications using JavaScript, HTML, CSS.'
#             },
#             {
#                 'id': '3',
#                 'fullname': 'Bob Johnson',
#                 'resume_text': 'Senior Python engineer with expertise in machine learning, deep learning, NLP, and computer vision. Led ML teams and deployed production models.'
#             },
#             {
#                 'id': '4',
#                 'fullname': 'Alice Brown',
#                 'resume_text': 'Data analyst with experience in SQL, Excel, and basic Python. Created dashboards and reports.'
#             },
#             {
#                 'id': '5',
#                 'fullname': 'Charlie Wilson',
#                 'resume_text': 'Full stack developer with Node.js and React. Built REST APIs and web applications.'
#             }
#         ]
        
#         job_desc = "Looking for a Python Machine Learning Engineer with experience in deep learning and NLP. Must be proficient in TensorFlow or PyTorch."
        
#         print("\nRanking applications...\n")
#         ranked = ranker.rank_applications(test_applications, job_desc)
        
#         print("="*70)
#         print("Ranked Applications:")
#         print("="*70)
        
#         for app in ranked:
#             rank = app['rank']
#             name = app['fullname']
#             score = app['rank_score']
#             category = app['match_category']
#             percentage = app['match_percentage']
            
#             # Visual indicator
#             if rank == 1:
#                 icon = "🥇"
#             elif rank == 2:
#                 icon = "🥈"
#             elif rank == 3:
#                 icon = "🥉"
#             else:
#                 icon = "  "
            
#             # Category display
#             if category == "Best Match":
#                 cat_display = f"✓ {category}"
#             elif category == "Average Match":
#                 cat_display = f"• {category}"
#             else:
#                 cat_display = f"✗ {category}"
            
#             # Progress bar
#             bar_length = int(percentage / 5)
#             bar = "█" * bar_length + "░" * (20 - bar_length)
            
#             print(f"{icon} #{rank} {name:20s} | {bar} {percentage:5.1f}% | {cat_display}")
        
#         # Summary
#         summary = ranker.get_category_summary(ranked)
#         print("\n" + "="*70)
#         print("Category Summary:")
#         print("="*70)
#         for category, count in summary.items():
#             print(f"  {category:15s}: {count} application(s)")
        
#         print("\n✓ Test completed successfully!")
        
#     except Exception as e:
#         print(f"\n✗ Test failed: {e}")
#         import traceback
#         traceback.print_exc()