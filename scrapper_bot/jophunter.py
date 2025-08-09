from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import requests
import re
import uuid
from datetime import datetime

# Configuration
LARAVEL_SERVER_URL = 'http://localhost:8000/api/v1/job-postings'
MAX_JOBS = 10  
COOKIES_FILE = "naukri_cookies.json"
OUTPUT_FILE = "naukri_jobs_detailed.json"

CHROME_PATH = "/usr/bin/chromium"
CHROMEDRIVER_PATH = "/usr/bin/chromedriver"

# Setup Chrome options with enhanced headless support
options = Options()

# Enhanced headless configuration
options.binary_location = CHROME_PATH
options.add_argument("--headless=new")  # Use new headless mode
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")  # Set explicit window size for headless
options.add_argument("--start-maximized")

# Anti-detection measures
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)

# User agent to mimic real browser
options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

# Additional anti-detection measures
options.add_argument("--disable-web-security")
options.add_argument("--allow-running-insecure-content")
options.add_argument("--disable-extensions")
options.add_argument("--disable-plugins")
options.add_argument("--disable-images")  # Speed up loading
options.add_argument("--disable-javascript-harmony-shipping")
options.add_argument("--disable-background-timer-throttling")
options.add_argument("--disable-renderer-backgrounding")
options.add_argument("--disable-backgrounding-occluded-windows")

# Enable geolocation and other preferences
prefs = {
    "profile.default_content_setting_values.geolocation": 1,
    "profile.default_content_settings.popups": 0,
    "profile.managed_default_content_settings.images": 2,  # Block images for faster loading
    "profile.default_content_setting_values.notifications": 2
}
options.add_experimental_option("prefs", prefs)

# Initialize driver
service = Service(ChromeDriverManager().install())
service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)

# Additional anti-detection script
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

# Generate unique session ID for tracking
session_id = str(uuid.uuid4())[:8]
print(f"🔍 Starting scraping session: {session_id}")

def clean_text(text):
    """Clean and normalize text data"""
    if not text:
        return ""
    # Remove extra whitespace and newlines
    cleaned = re.sub(r'\s+', ' ', str(text).strip())
    # Remove special characters that might cause issues
    cleaned = re.sub(r'[^\w\s\-.,():/&@]', '', cleaned)
    return cleaned

def extract_experience_years(experience_text):
    """Extract numeric experience from text"""
    if not experience_text:
        return ""
    
    # Look for patterns like "2-5 years", "0-2 years", etc.
    match = re.search(r'(\d+)(?:\s*-\s*(\d+))?\s*years?', experience_text.lower())
    if match:
        min_exp = match.group(1)
        max_exp = match.group(2) if match.group(2) else min_exp
        return f"{min_exp}-{max_exp} years"
    
    return clean_text(experience_text)

def extract_salary_range(salary_text):
    """Extract and normalize salary information"""
    if not salary_text or "not disclosed" in salary_text.lower():
        return "Not Disclosed"
    
    return clean_text(salary_text)

def wait_for_element(driver, locator, timeout=20):  # Increased timeout for headless
    """Wait for element with better error handling"""
    try:
        return WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
    except TimeoutException:
        return None

def wait_for_clickable_element(driver, locator, timeout=20):
    """Wait for element to be clickable"""
    try:
        return WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable(locator)
        )
    except TimeoutException:
        return None

def extract_job_details(driver, job_url):
    """Extract comprehensive job details from individual job page"""
    print(f"  📄 Extracting details from: {job_url}")
    
    try:
        # Open job URL in new tab
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[-1])
        driver.get(job_url)
        
        # Wait longer for page to load in headless mode
        time.sleep(5)
        
        # Wait for main content to load with multiple possible selectors
        main_container = None
        selectors_to_try = [
            (By.CLASS_NAME, "styles_job-header-container___0wLZ"),
            (By.CSS_SELECTOR, ".jd-header-details"),
            (By.CSS_SELECTOR, "[data-qa='job-header']"),
            (By.TAG_NAME, "main")
        ]
        
        for selector in selectors_to_try:
            main_container = wait_for_element(driver, selector, 15)
            if main_container:
                break
        
        if not main_container:
            print("    ⚠️ Main container not found, trying to scroll and wait...")
            driver.execute_script("window.scrollTo(0, 500);")
            time.sleep(3)
            main_container = wait_for_element(driver, (By.TAG_NAME, "body"), 10)
            if not main_container:
                print("    ⚠️ Page content not loaded, skipping...")
                return None
        
        job_details = {
            'job_url': job_url,
            'scraped_at': datetime.now().isoformat(),
            'session_id': session_id
        }
        
        # Extract basic job information with multiple selector attempts
        title_selectors = [
            "h1.styles_jd-header-title__rZwM1",
            "h1[data-qa='job-title']",
            ".jd-header-title",
            "h1"
        ]
        
        for selector in title_selectors:
            try:
                title_elem = driver.find_element(By.CSS_SELECTOR, selector)
                job_details['title'] = clean_text(title_elem.get_attribute("title") or title_elem.text)
                break
            except:
                continue
        
        if 'title' not in job_details:
            job_details['title'] = ""
        
        # Company name with multiple selectors
        company_selectors = [
            ".styles_jd-header-comp-name__MvqAI a",
            "[data-qa='company-name']",
            ".jd-header-comp-name a",
            ".company-name"
        ]
        
        for selector in company_selectors:
            try:
                company_elem = driver.find_element(By.CSS_SELECTOR, selector)
                job_details['company'] = clean_text(company_elem.text)
                break
            except:
                continue
        
        if 'company' not in job_details:
            job_details['company'] = ""
        
        # Extract company rating and reviews
        try:
            rating_elem = driver.find_element(By.CSS_SELECTOR, ".styles_amb-rating__4UyFL")
            job_details['company_rating'] = clean_text(rating_elem.text)
        except:
            job_details['company_rating'] = ""
        
        try:
            reviews_elem = driver.find_element(By.CSS_SELECTOR, ".styles_amb-reviews__0J1e3")
            job_details['company_reviews'] = clean_text(reviews_elem.text)
        except:
            job_details['company_reviews'] = ""
        
        # Extract job requirements with multiple selectors
        exp_selectors = [
            ".styles_jhc__exp__k_giM span",
            "[data-qa='experience'] span",
            ".experience span"
        ]
        
        for selector in exp_selectors:
            try:
                exp_elem = driver.find_element(By.CSS_SELECTOR, selector)
                job_details['experience'] = extract_experience_years(exp_elem.text)
                break
            except:
                continue
        
        if 'experience' not in job_details:
            job_details['experience'] = ""
        
        # Salary extraction
        salary_selectors = [
            ".styles_jhc__salary__jdfEC span",
            "[data-qa='salary'] span",
            ".salary span"
        ]
        
        for selector in salary_selectors:
            try:
                salary_elem = driver.find_element(By.CSS_SELECTOR, selector)
                job_details['salary'] = extract_salary_range(salary_elem.text)
                break
            except:
                continue
        
        if 'salary' not in job_details:
            job_details['salary'] = ""
        
        # Location extraction
        location_selectors = [
            ".styles_jhc__location__W_pVs a",
            "[data-qa='location'] a",
            ".location a"
        ]
        
        for selector in location_selectors:
            try:
                location_elem = driver.find_element(By.CSS_SELECTOR, selector)
                job_details['location'] = clean_text(location_elem.text)
                break
            except:
                continue
        
        if 'location' not in job_details:
            job_details['location'] = ""
        
        # Extract job statistics
        job_details['posted'] = ""
        job_details['openings'] = ""
        job_details['applicants'] = ""
        
        try:
            stats = driver.find_elements(By.CSS_SELECTOR, ".styles_jhc__stat__PgY67")
            for stat in stats:
                stat_text = clean_text(stat.text)
                if "posted:" in stat_text.lower():
                    job_details['posted'] = stat_text.replace("Posted:", "").strip()
                elif "openings:" in stat_text.lower():
                    job_details['openings'] = stat_text.replace("Openings:", "").strip()
                elif "applicants:" in stat_text.lower():
                    job_details['applicants'] = stat_text.replace("Applicants:", "").strip()
        except:
            pass
        
        # Extract job highlights
        try:
            highlights = driver.find_elements(By.CSS_SELECTOR, ".styles_JDC__job-highlight-list__QZC12 li")
            job_details['job_highlights'] = [clean_text(h.text) for h in highlights if h.text.strip()]
        except:
            job_details['job_highlights'] = []
        
        # Extract detailed job description
        desc_selectors = [
            ".styles_JDC__dang-inner-html__h0K4t",
            "[data-qa='job-description']",
            ".job-description",
            ".jd-description"
        ]
        
        for selector in desc_selectors:
            try:
                desc_elem = driver.find_element(By.CSS_SELECTOR, selector)
                job_details['description'] = clean_text(desc_elem.text)
                break
            except:
                continue
        
        if 'description' not in job_details:
            job_details['description'] = ""
        
        # Extract role details
        role_details = {
            'role': '',
            'industry_type': '',
            'department': '',
            'employment_type': '',
            'role_category': ''
        }
        
        try:
            detail_elements = driver.find_elements(By.CSS_SELECTOR, ".styles_other-details__oEN4O .styles_details__Y424J")
            for element in detail_elements:
                try:
                    label_elem = element.find_element(By.TAG_NAME, "label")
                    span_elem = element.find_element(By.TAG_NAME, "span")
                    label_text = clean_text(label_elem.text)
                    span_text = clean_text(span_elem.text)
                    
                    if "role:" in label_text.lower():
                        role_details['role'] = span_text
                    elif "industry type:" in label_text.lower():
                        role_details['industry_type'] = span_text
                    elif "department:" in label_text.lower():
                        role_details['department'] = span_text
                    elif "employment type:" in label_text.lower():
                        role_details['employment_type'] = span_text
                    elif "role category:" in label_text.lower():
                        role_details['role_category'] = span_text
                except:
                    continue
        except:
            pass
        
        # Add role details to job_details
        job_details.update(role_details)
        
        # Extract education requirements
        try:
            education_elements = driver.find_elements(By.CSS_SELECTOR, ".styles_education__KXFkO .styles_details__Y424J")
            job_details['ug_requirement'] = ""
            job_details['pg_requirement'] = ""
            
            for element in education_elements:
                try:
                    label_elem = element.find_element(By.TAG_NAME, "label")
                    span_elem = element.find_element(By.TAG_NAME, "span")
                    label_text = clean_text(label_elem.text)
                    span_text = clean_text(span_elem.text)
                    
                    if "ug:" in label_text.lower():
                        job_details['ug_requirement'] = span_text
                    elif "pg:" in label_text.lower():
                        job_details['pg_requirement'] = span_text
                except:
                    continue
        except:
            job_details['ug_requirement'] = ""
            job_details['pg_requirement'] = ""
        
        # Extract key skills
        skills_selectors = [
            ".styles_key-skill__GIPn_ .styles_chip__7YCfG span",
            "[data-qa='key-skills'] span",
            ".skills span"
        ]
        
        skills_list = []
        for selector in skills_selectors:
            try:
                skills_elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for skill_elem in skills_elements:
                    skill_text = clean_text(skill_elem.text)
                    if skill_text and skill_text not in skills_list:
                        skills_list.append(skill_text)
                if skills_list:
                    break
            except:
                continue
        
        job_details['key_skills'] = skills_list
        
        # Extract about company
        try:
            about_elem = driver.find_element(By.CSS_SELECTOR, ".styles_about-company__lOsvW .styles_detail__U2rw4")
            job_details['about_company'] = clean_text(about_elem.text)
        except:
            job_details['about_company'] = ""
        
        # Close current tab and return to main window
        driver.close()
        driver.switch_to.window(driver.window_handles[0])
        
        print(f"    ✅ Successfully extracted: {job_details.get('title', 'Unknown')} at {job_details.get('company', 'Unknown')}")
        return job_details
        
    except Exception as e:
        print(f"    ⚠️ Error extracting job details: {e}")
        # Ensure we close the tab and return to main window
        try:
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
        except:
            pass
        return None

def send_data_to_server(jobs_data):
    """Send scraped data to Flask server"""
    if not jobs_data:
        print("📤 No data to send to server")
        return False
    
    try:
        print(f"📤 Sending {len(jobs_data)} jobs to server...")
        response = requests.post(
            LARAVEL_SERVER_URL, 
            json=jobs_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Server response: {result.get('message', 'Success')}")
            print(f"   Jobs inserted: {result.get('jobs_inserted', 'Unknown')}")
            return True
        else:
            print(f"❌ Server error: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send data to server: {e}")
        return False

def save_to_local_file(jobs_data, filename):
    """Save data to local JSON file as backup"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(jobs_data, f, ensure_ascii=False, indent=2)
        print(f"💾 Data saved to local file: {filename}")
        return True
    except Exception as e:
        print(f"❌ Failed to save to local file: {e}")
        return False

def main():
    """Main scraping function"""
    all_jobs = []
    page_number = 1
    job_count = 0
    
    try:
        print("🚀 Starting Naukri job scraper in headless mode...")
        
        # Load Naukri homepage first
        print("📱 Loading Naukri homepage...")
        driver.get("https://www.naukri.com")
        time.sleep(5)  # Increased wait time for headless mode
        
        # Load and inject cookies
        try:
            with open(COOKIES_FILE, "r") as f:
                cookies = json.load(f)
            
            for cookie in cookies:
                try:
                    driver.add_cookie(cookie)
                except:
                    continue
            print("🍪 Cookies loaded successfully")
            
            # Refresh page after adding cookies
            driver.refresh()
            time.sleep(3)
            
        except FileNotFoundError:
            print("⚠️ Cookies file not found, proceeding without cookies")
        except Exception as e:
            print(f"⚠️ Error loading cookies: {e}")
        
        # Navigate to job listings page
        search_url = "https://www.naukri.com/java-full-stack-developer-jobs?k=java%20full%20stack%20developer&nignbevent_src=jobsearchDeskGNB&experience=2&cityTypeGid=97&cityTypeGid=183&cityTypeGid=184&qbusinessSize=62&qbusinessSize=211"
        print(f"🔍 Navigating to job search page...")
        driver.get(search_url)
        time.sleep(8)  # Increased wait time for search results to load
        
        # Main scraping loop
        while job_count < MAX_JOBS:
            print(f"\n📄 Scraping Page {page_number}...")
            
            # Wait for job cards to load
            job_cards = []
            card_selectors = [
                ".srp-jobtuple-wrapper",
                "[data-qa='job-card']",
                ".jobTupleHeader"
            ]
            
            for selector in card_selectors:
                try:
                    WebDriverWait(driver, 15).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    job_cards = driver.find_elements(By.CSS_SELECTOR, selector)
                    if job_cards:
                        break
                except TimeoutException:
                    continue
            
            if not job_cards:
                print("   ❌ No job cards found on this page, trying scroll and wait...")
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
                time.sleep(5)
                job_cards = driver.find_elements(By.CSS_SELECTOR, ".srp-jobtuple-wrapper")
                
                if not job_cards:
                    print("   ❌ Still no job cards found, ending scraping")
                    break
            
            print(f"   Found {len(job_cards)} job cards")
            
            # Process each job card
            for i, card in enumerate(job_cards):
                if job_count >= MAX_JOBS:
                    break
                
                try:
                    # Scroll card into view
                    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", card)
                    time.sleep(1)
                    
                    # Get job URL with multiple selector attempts
                    job_url = None
                    url_selectors = [
                        "h2 > a",
                        ".title a",
                        "[data-qa='job-title'] a",
                        "a[href*='/job-detail/']"
                    ]
                    
                    for selector in url_selectors:
                        try:
                            title_elem = card.find_element(By.CSS_SELECTOR, selector)
                            job_url = title_elem.get_attribute("href")
                            if job_url:
                                break
                        except:
                            continue
                    
                    if not job_url:
                        print(f"    ⚠️ Could not find job URL for card {i+1}, skipping...")
                        continue
                    
                    print(f"  🎯 Processing job {job_count + 1}/{MAX_JOBS}")
                    
                    # Extract detailed job information
                    job_data = extract_job_details(driver, job_url)
                    
                    if job_data:
                        all_jobs.append(job_data)
                        job_count += 1
                        
                        # Small delay between jobs
                        time.sleep(3)  # Increased delay for headless mode
                    else:
                        print(f"    ⚠️ Failed to extract data, skipping...")
                        
                except Exception as e:
                    print(f"    ⚠️ Error processing job card {i+1}: {e}")
                    continue
            
            # Break if we've collected enough jobs
            if job_count >= MAX_JOBS:
                break
            
            # Navigate to next page
            try:
                # Scroll to pagination area
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(3)
                
                # Try multiple next button selectors
                next_selectors = [
                    '//a[@class="styles_btn-secondary__2AsIP" and span[text()="Next"]]',
                    '//a[contains(@class, "next")]',
                    '//a[text()="Next"]',
                    '.styles_btn-secondary__2AsIP'
                ]
                
                next_button = None
                for selector in next_selectors:
                    try:
                        if selector.startswith('//'):
                            next_button = driver.find_element(By.XPATH, selector)
                        else:
                            next_button = driver.find_element(By.CSS_SELECTOR, selector)
                        
                        if next_button and next_button.is_enabled():
                            break
                    except:
                        continue
                
                if next_button and next_button.is_enabled():
                    # Use JavaScript click for better reliability in headless mode
                    driver.execute_script("arguments[0].click();", next_button)
                    page_number += 1
                    time.sleep(8)  # Increased wait time for page load
                else:
                    print("🚫 Next button not found or disabled, reached end of results")
                    break
                    
            except Exception as e:
                print(f"⚠️ Error navigating to next page: {e}")
                break
        
        print(f"\n🎉 Scraping completed!")
        print(f"📊 Total jobs scraped: {len(all_jobs)}")
        
        # Save data locally first
        save_to_local_file(all_jobs, OUTPUT_FILE)
        
        # Send data to server
        if all_jobs:
            server_success = send_data_to_server(all_jobs)
            if not server_success:
                print("⚠️ Server upload failed, but data is saved locally")
        
        return all_jobs
        
    except KeyboardInterrupt:
        print("\n⏹️ Scraping interrupted by user")
        return all_jobs
    except Exception as e:
        print(f"\n❌ Unexpected error during scraping: {e}")
        return all_jobs
    finally:
        # Cleanup
        try:
            driver.quit()
            print("🧹 Browser closed")
        except:
            pass

if __name__ == "__main__":
    print("=" * 60)
    print("🔍 NAUKRI JOB SCRAPER (HEADLESS MODE)")
    print("=" * 60)
    
    start_time = datetime.now()
    scraped_jobs = main()
    end_time = datetime.now()
    
    print("\n" + "=" * 60)
    print("📈 SCRAPING SUMMARY")
    print("=" * 60)
    print(f"⏱️  Total time: {end_time - start_time}")
    print(f"📊 Jobs scraped: {len(scraped_jobs)}")
    print(f"💾 Data saved to: {OUTPUT_FILE}")
    print(f"🔗 Server endpoint: {LARAVEL_SERVER_URL}")
    print(f"🆔 Session ID: {session_id}")
    
    if scraped_jobs:
        print(f"\n✅ Successfully completed scraping session!")
    else:
        print(f"\n⚠️ No jobs were scraped. Check the logs for issues.")
    
    print("=" * 60)