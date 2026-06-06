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

    if "ニュース" == content:
        res = requests.get('https://api.sharkbot.xyz/search/news').json()["news_url"]
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=res)
        )
        return True
    
    return False