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
        browser = await p.chromium.launch(headless=True)  # Set headless=True to hide browser
        page = await browser.new_page()
        
        await page.goto(CAB_URL)

        # Click "Find Courses" button
        await page.click("#search-button")
        await page.wait_for_selector(".result__link")

        course_links = page.locator(".result__link")
        count = await course_links.count()

        print(f"Found {count} courses.")

        all_courses = []

        #we can substitute arbitrary numbers less than count for count if we only want to test on a few
        for idx in range(count):
            link = course_links.nth(idx)
            await link.scroll_into_view_if_needed()
            await link.click()
            await asyncio.sleep(0.05)

            try:
                await page.wait_for_selector(".dtl-course-code", timeout=10000)
                course_data = await extract_course_data(page)
                all_courses.append(course_data)
                print(f"Scraped {idx + 1}/{count}: {course_data['id']}")
            except Exception as e:
                print(f"Error scraping course {idx + 1}: {e}")

            #Always close the panel, even if scraping failed, that way we can continue iterating properly
            try:
                await page.wait_for_selector(".panel__content")
                panel = page.locator(".panel__content").nth(-1)
                await panel.locator(".panel__back").click()
                await asyncio.sleep(0.05)
                await page.wait_for_selector(".result__link")
            except Exception as e:
                print(f"Error clicking back after course {idx + 1}: {e}")


        #Save data
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(all_courses, f, indent=2, ensure_ascii=False)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(scrape_courses())
