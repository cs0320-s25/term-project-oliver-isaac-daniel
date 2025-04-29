# scrape.py

import asyncio
import json
from playwright.async_api import async_playwright
from selectors import extract_course_data
import os
from typing import Literal

OUTPUT_PATH: Literal["data/courses.json"] = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "courses.json"
)
CAB_URL = "https://cab.brown.edu/"

async def scrape_courses():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True to hide browser
        page = await browser.new_page()
        
        await page.goto(CAB_URL)

        # Click "Find Courses" button
        await page.click("#search-button")
        await page.wait_for_selector(".result__link")

        course_links = page.locator(".result__link")
        count = await course_links.count()

        print(f"Found {count} courses.")

        all_courses = []

        # 25 substituted for count so we don't go through all of them
        for idx in range(25):
            try:
                link = course_links.nth(idx)
                await link.scroll_into_view_if_needed()
                await link.click()

                # Wait for course detail to load
                await page.wait_for_selector(".dtl-course-code")

                # Extract course info using selectors.py
                course_data = await extract_course_data(page)
                all_courses.append(course_data)

                print(f"Scraped {idx + 1}/{count}: {course_data['id']}")

            except Exception as e:
                print(f"Error scraping course {idx + 1}: {e}")
                continue

        # Save data
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(all_courses, f, indent=2, ensure_ascii=False)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(scrape_courses())
