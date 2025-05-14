import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
 await page.goto('http://localhost:8003/');
 await page.getByRole('button', { name: 'Login' }).click();
 await page.getByRole('textbox', { name: 'Course description input' }).click();
 await page.getByRole('textbox', { name: 'Course description input' }).click();
 await page.getByRole('textbox', { name: 'Course description input' }).click();
 await page.getByRole('textbox', { name: 'Course description input' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Course description input' }).fill('I want a class on introductory econ');
 await page.getByRole('button', { name: 'Submit course blurb' }).click();
 await page.getByRole('button', { name: 'Start a new course search' }).click();
 await page.getByRole('textbox', { name: 'Course description input' }).click();
 await page.getByRole('textbox', { name: 'Course description input' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Course description input' }).fill('I am looking for anthroplogy class but ');
 await page.getByRole('textbox', { name: 'Course description input' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Course description input' }).fill('I am looking for anthroplogy class but I am also intersted in ');
 await page.getByRole('textbox', { name: 'Course description input' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Course description input' }).fill('I am looking for anthroplogy class but I am also intersted in  Computer ');
 await page.getByRole('textbox', { name: 'Course description input' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Course description input' }).fill('I am looking for anthroplogy class but I am also intersted in  Computer Science');
 await page.getByRole('button', { name: 'Submit course blurb' }).click();
 await page.getByRole('button', { name: 'Start a new course search' }).click();
 await page.getByRole('button', { name: 'Sign Out' }).click();
});







