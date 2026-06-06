import os
import dotenv
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
import random
import requests
import re

def process(event: MessageEvent, line_bot_api: LineBotApi):
    content = event.message.text

    if "ダイス" == content or "🎲" == content:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=f"🎲 {random.randint(1, 6)}")
        )
        return True
    
    if "dd" == content:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=f"🎲 {random.randint(1, 100)}")
        )
        return True
    
    dice_match = re.fullmatch(r"(\d+)d(\d+)", content)
    
    if dice_match:
        num_dice, sides = map(int, dice_match.groups())
        if num_dice > 100:
            return False
        if sides > 100:
            return False
        rolls = [random.randint(1, sides) for _ in range(num_dice)]
        str_rolls = [str(r) for r in rolls]

        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=f"🎲 {', '.join(str_rolls)} → {sum(rolls)}")
        )
        return True
    
    return False