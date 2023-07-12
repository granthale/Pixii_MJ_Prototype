import asyncio
from getpass import getpass
from pathlib import Path
from typing import Optional

import re
import requests
from playwright.async_api import Page, async_playwright
import time

import os
from dotenv import load_dotenv
load_dotenv()


def download_image(image_url: str, image_path: str, timeout: int = 5) -> str:
    """
    Downloads an image from a provided URL and saves it to a local path.
    Args:
        image_url (str): URL of the image to download.
        image_path (str): Local path where the image will be saved, including the image file name.
        timeout (int): Maximum time, in seconds, to wait for the server's response. Default is 5 seconds.
    Raises:
        HTTPError: If there was an unsuccessful HTTP response.
        Timeout: If the request times out.
    Returns:
        str: Local path where the image has been saved.
    """
    response = requests.get(image_url, timeout=timeout)
    response.raise_for_status()  # Raise exception if invalid response.
    with open(image_path, "wb") as f:
        f.write(response.content)
    return image_path


async def login_to_discord(
    page: Page,
    server_id: str,
    channel_id: str,
    email: Optional[str] = os.getenv("DISCORD_EMAIL"),
    password: Optional[str] = os.getenv("DISCORD_PASSWORD"),
    auth_code: Optional[str] = None,
) -> None:
    """
    Log in to Discord via a Playwright browser page.
    Args:
        page (Page): Playwright browser page instance.
        server_id (str): Discord server ID to navigate to after login.
        channel_id (str): Discord channel ID to navigate to after login.
        email (Optional[str], optional): Email to use for logging in to Discord. Defaults to None.
        password (Optional[str], optional): Password to use for logging in to Discord. Defaults to None.
        auth_code (Optional[str], optional): Authentication code to use for logging in to Discord. Defaults to None.
    Raises:
        TimeoutError: If any of the page actions do not complete within the default timeout period.
    """
    discord_channel_url = f"https://discord.com/channels/{server_id}/{channel_id}"
    await page.goto(discord_channel_url)

    # await page.get_by_role("button", name="Continue in browser").click()
    await page.get_by_label("Email or Phone Number*").click()

    if not email:
        email = input("Please enter your email: ")
    await page.get_by_label("Email or Phone Number*").fill(email)

    await page.get_by_label("Email or Phone Number*").press("Tab")

    if not password:
        password = getpass("Please enter your password: ")
    await page.get_by_label("Password*").fill(password)

    await page.get_by_role("button", name="Log In").click()

    # if not auth_code:
    #     auth_code = input("Please enter your authentication code: ")
    # await page.get_by_placeholder(
    #     "6-digit authentication code/8-digit backup code"
    # ).fill(auth_code)

    # await page.get_by_role("button", name="Log In").click()


async def post_prompt(page: Page, prompt: str) -> None:
    """
    Post a prompt message in Discord via a Playwright browser page.
    Args:
        page (Page): Playwright browser page instance.
        prompt (str): The prompt to be posted in the message box.
    Raises:
        TimeoutError: If any of the page actions do not complete within the default timeout period.
    """
    message_text_box = page.get_by_role("textbox", name="Message #general").nth(0)
    await message_text_box.fill("/imagine  ")
    await page.locator("div").filter(
        has_text=re.compile(
            r"^/imaginepromptCreate images with MidjourneyMidjourney Bot$"
        )
    ).nth(3).click()

    prompt_input = page.locator(".optionPillValue-2uxsMp").nth(0)

    await prompt_input.fill(prompt, timeout=10000)
    await message_text_box.press("Enter", timeout=10000)


async def upscale_image(page: Page) -> None:
    """
    Upscale an image on a Discord channel using the U1 button.
    Args:
        page (Page): Playwright browser page instance.
    Raises:
        TimeoutError: If any of the page actions do not complete within the default timeout period.
    """
    last_message = page.locator(selector="li").last
    upscale_1 = last_message.locator("button", has_text="U1")

    # Wait for the upscale button to be visible
    while not await upscale_1.is_visible():
        print("Upscale button is not yet available, waiting...")
        await asyncio.sleep(5)  # wait for 5 seconds

    print("Upscale button is now available, clicking...")
    await upscale_1.click(timeout=10000)


async def get_image_url(
    page: Page, timeout: int = 10000, check_interval: int = 5, max_wait: int = 30
) -> Optional[str]:
    """
    Get the href attribute of the last image link on the page, retrying until it exists and the 'Vary (Strong)' button is visible.
    Args:
        page (Page): Playwright browser page instance.
        timeout (int): Maximum time, in milliseconds, to wait for the image link. Default is 1000 milliseconds.
        check_interval (int): Time, in seconds, to wait between checks for the button and image link. Default is 5 seconds.
        max_wait (int): Maximum time, in seconds, to wait before giving up. Default is 30 seconds.
    Returns:
        str: The href attribute of the last image link.
    Raises:
        TimeoutError: If the image link does not appear within the maximum wait time.
    """

    last_message = page.locator(selector="li").last
    vary_strong = last_message.locator("button", has_text="Vary (Strong)")
    image_links = last_message.locator(
        "xpath=//a[starts-with(@class, 'originalLink-')]"
    )

    start_time = time.time()

    # Wait for the 'Vary (Strong)' button and an image link to appear
    while True:
        if await vary_strong.is_visible() and await image_links.count() > 0:
            last_image_link = await image_links.last.get_attribute(
                "href", timeout=timeout
            )
            print("Image link is present, returning it.")
            if last_image_link is not None:
                return last_image_link
            else:
                raise TimeoutError("Image link not found within the maximum wait time.")

        print(
            "Waiting for 'Vary (Strong)' button to appear and for image link to appear..."
        )

        # If the maximum wait time has been reached, raise an exception
        if time.time() - start_time > max_wait:
            raise TimeoutError(
                "Waited for 30 seconds but 'Vary (Strong)' button did not appear and image link did not appear."
            )

        await asyncio.sleep(check_interval)  # wait for 5 seconds

IMAGE_PATH = Path(__file__).parent / "static"


async def main(prompt) -> bool:
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        await login_to_discord(
            page=page,
            server_id=os.getenv("DISCORD_SERVER_ID"),
            channel_id=os.getenv("DISCORD_CHANNEL_ID"),
        )

        await post_prompt(page=page, prompt=prompt)

        await upscale_image(page=page)

        image_url = await get_image_url(page=page)
        if image_url is not None:
            local_image_path = IMAGE_PATH / f"{prompt}.png"
            download_image(image_url=image_url, image_path=str(local_image_path))
        else:
            print(f"Error: No image URL returned for prompt {prompt}")