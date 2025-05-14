# selectors.py

async def extract_course_data(page):
    """Extract ID, Title, and Description from a course detail page."""
    course_id = await page.locator(".dtl-course-code").inner_text()
    dept_code = course_id.strip().split(" ")[0]
    title = await page.locator(".detail-title").inner_text()
    description = await page.locator(".section--description .section__content").inner_text()

    return {
        "id": course_id.strip(),
        "department": dept_code,
        "title": title.strip(),
        "description": description.strip()
    }
