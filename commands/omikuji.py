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

    if "おみくじ" == content:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="🥠 " + random.choice(["大吉", "中吉", "小吉", "末吉", "吉", "凶", "大凶"]))
        )
        return True
    
    return False